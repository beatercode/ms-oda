const mongoose = require("mongoose")

const WalletSchema = new mongoose.Schema({
    walletId: { type: String, default: "" },
    user: { type: String, default: "" },
    heldCoins: { type: Array, defaut: []}
})

module.exports = mongoose.model("Wallet", WalletSchema)