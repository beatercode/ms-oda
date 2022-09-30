
const BotMessage = require("../models/BotMessage")

exports.create = async (req, res) => {

    try {
        if (!req.body.channelId) {
            res.status(400).send({ message: "Content can not be empty! 1" });
            return;
        }
        if (!req.body.text && !req.body.embed) {
            res.status(400).send({ message: "Content can not be empty! 2" });
            return;
        }

        let maxId = await BotMessage.find({})
        maxId = maxId.map(x => +x.customId)
        maxId = maxId.length > 0 ? Math.max(...maxId) : 0
        const nextId = (maxId + 1)

        const quest = new BotMessage({
            customId: nextId,
            channelId: req.body.channelId,
            text: req.body.text,
            embed: req.body.embed,
            wasPublished: req.body.wasPublished,
            date: req.body.date
        });
        quest
            .save(quest)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Tutorial."
                });
            });
    } catch (err) {
        console.log(err)
        res.status(400).send({ message: "Some error occured, open a ticket" });
    }
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
    BotMessage.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving quests."
            });
        });
};