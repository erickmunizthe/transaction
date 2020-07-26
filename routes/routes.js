const express = require('express');
const transactionRouter = express.Router();
const model = require('../models/TransactionModel.js');

transactionRouter.get('/transaction', async (req, res) => {
  const query = {};

  const period = req.query.period;
  if (period) {
    query.yearMonth = period;
  }

  const nameParam = req.query.name;
  if (nameParam) {
    query.description = {
      $regex: new RegExp(nameParam),
      $options: 'i',
    };
  }
  const year = req.query.year;
  if (year) {
    query.year = year;
  }

  const category = req.query.category;
  if (category) {
    query.category = category;
  }
  try {
    const data = await model.find(query);
    const infos = getInfo(data);
    res.send(infos);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Erro ao buscar o periodo ' + period });
  }
});

function filtrar(data, tipo) {
  return data.filter((r) => {
    return r.type === tipo;
  });
}

function getInfo(data) {
  const qtd = data.length;
  const valorReceita = filtrar(data, '+').reduce((a, r) => {
    return a + r.value;
  }, 0);
  const valorDespesa = filtrar(data, '-').reduce((a, r) => {
    return a + r.value;
  }, 0);

  return {
    qtd: qtd,
    receita: valorReceita,
    despesa: valorDespesa,
    saldo: valorReceita - valorDespesa,
    dados: data,
  };
}

module.exports = transactionRouter;
