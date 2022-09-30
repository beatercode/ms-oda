const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");

const url = require("url");
const { randomUUID } = require("crypto");

exports.listTransactions = async (req, res) => {
  const filterDocument = url.parse(req.url, true).query;
  const filterDocumentString = JSON.stringify(filterDocument);
  console.log(
    "fetching transactions with following params: " + filterDocumentString
  ) +
    Transaction.find(JSON.parse(filterDocumentString))
      .then((transactions) => {
        console.log(JSON.stringify(transactions));
        res.send(transactions);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "An error occurred while fetching the transaction list",
        });
      });
};

exports.trade = async (req, res) => {
  if (!req.body)
    return res.status(400).send({
      message: "Trade info cannot be empty",
    });

  const body = req.body;
  if (!body.user || !body.targetCoin || !body.amount || !body.coin)
    return res.status(400).send({
      message: "Invalid Trade info",
    });

  console.log("Fetching wallet");

  const filterDocument = {
    user: body.user,
  };

  let wallet = await Wallet.findOne(filterDocument);
  console.log(JSON.stringify(wallet.heldCoins))
  console.log("Found wallet for user " + wallet.user);

  console.log("Creating transaction for trade");
  const isODASource = body.coin === "ODA";
  const transaction = new Transaction({
    txId: randomUUID(),
    amount: body.amount,
    ppc: isODASource ? 1 : 10, //FETCH
    currency: body.coin,
    targetAmount: 10, //FETCH DA API
    targetCurrency: body.targetCoin,
    targetPpcUSD: isODASource ? 1 : 10, //FECTH
    timestamp: Date.now(),
    user: body.user,
  });

  try {
    await Transaction.insertMany(transaction);
  } catch {
    res.status(500).send({
      message:
        "An error occurred while submitting the transaction with txID " +
        transaction.txId,
    });
  }
  console.log("Transaction sent txID " + transaction.txId)

  wallet.heldCoins.forEach(coin => {
    if(coin.symbol === transaction.currency) coin.amount = coin.amount - transaction.amount
    if(coin.symbol === transaction.targetCurrency) coin.amount = coin.amount + transaction.amount
  });

  try {
    await Wallet.updateOne(wallet)
  } catch {
    es.status(500).send({
        message:
          "An error occurred while updating the balance for user " +
          wallet.user,
      });
  }

  res.send(transaction);
};
