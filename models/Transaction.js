const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema({
    txId: { type: String, default: "" },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "" },
    ppc: { type: Number, default: 0 },
    targetCurrency: { type: String, default: "" },
    targetPpcUSD: { type: Number, default: 0 },
    targetAmount: { type: Number, default: 0 },
    user: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now() },


})

module.exports = mongoose.model("Transaction", TransactionSchema)