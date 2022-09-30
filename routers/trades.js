const express = require('express');
const router = express.Router();
const controller = require("../controller/trades.controller");

router.get("/listTransactions", controller.listTransactions);


module.exports = router;