
const Transaction = require("../models/Transaction")

const url = require('url');

exports.listTransactions = async (req, res) => {
    const filterDocument = url.parse(req.url, true).query
    const filterDocumentString = JSON.stringify(filterDocument);
    console.log("fetching transactions with following params: " + filterDocumentString)+

    Transaction.find(JSON.parse(filterDocumentString))
    .then(transactions => {
        console.log(JSON.stringify(transactions))
        res.send(transactions)
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "An error occurred while fetching the transaction list"
        });
    });
};

