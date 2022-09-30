const express = require('express');
const router = express.Router();
const controller = require("../controller/trades.controller");

router.get("/listTransactions", controller.listTransactions);

router.post("/trade", controller.trade);


module.exports = router;