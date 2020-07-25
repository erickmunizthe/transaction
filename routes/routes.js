const express = require('express');
const transactionRouter = express.Router();

transactionRouter.get('/', (req, res) => {
  console.log(req.query.period);
  res.end();
});

module.exports = transactionRouter;
