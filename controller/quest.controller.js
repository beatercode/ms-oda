
const Quests = require("../models/Quest")

exports.create = async (req, res) => {
    
    try {
    if (!req.body.name || !req.body.question) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    if (req.body.customId) {
        res.status(400).send({ message: "Quest custom ID cann't be specified!" });
        return;
    }

    // MODES:
    // QUIZ
    // TEXTNOVEL
    // VISUALNOVEL

    let mode = req.body.mode ? req.body.mode : "quiz"
    mode = mode.toUpperCase()
    if (!['QUIZ', 'TEXTNOVEL', 'VISUALNOVEL'].includes(mode)) {
        res.status(500).send({ message: 'Unsupported mode' })
        return
    }

    let modeLetter = mode == 'QUIZ' ? 'Q' : mode == 'TEXTNOVEL' ? 'T' : 'V'
    let questionType = req.body.questionType
    if (questionType != 'text' && questionType != 'image') {
        res.status(500).send({ message: 'Unsupported question type' })
        return
    }
    let maxIdQuest = await Quests.find({})
    maxIdQuest = maxIdQuest.filter(x => x.customId.substring(0, 1) === modeLetter)
    maxIdQuest = maxIdQuest.map(x => +x.customId.substring(1, x.customId.length))
    maxIdQuest = maxIdQuest.length > 0 ? Math.max(...maxIdQuest) : 0
    let nextIdQuest = modeLetter + (maxIdQuest + 1)

    const quest = new Quests({
        customId: nextIdQuest,
        questId: req.body.questId,
        path: req.body.path,
        name: req.body.name,
        questionType: questionType,
        question: req.body.question,
        republishable: req.body.republishable ? req.body.republishable : false,
        wasPublished: req.body.wasPublished ? req.body.wasPublished : false,
        mode: mode.toLowerCase(),
        options: req.body.options ? req.body.options : [],
        voters: req.body.voters ? req.body.voters : []
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
    Quests.find(condition)
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

exports.findAllQuest = (req, res) => {
    const questId = req.params.questId;
    Quests.findOne({ "questId": questId })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Quest with id " + questId });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Quest with id=" + questId });
        });
};

exports.findOneCustomId = (req, res) => {
    const customId = req.params.customId;
    Quests.findOne({ "customId": customId })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Quest with id " + customId });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Quest with id=" + customId });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const customId = req.params.customId;
    Quests.findOneAndUpdate({ "customId": customId }, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Quest with id=${customId}. Maybe Quests was not found!`
                });
            } else res.send({ message: "Quests was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Quests with id=" + customId
            });
        });
};

exports.delete = (req, res) => {
    const customId = req.params.customId;
    Quests.findOneAndRemove({ "customId": customId })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Quest with id=${customId}. Maybe Quest was not found!`
                });
            } else {
                res.send({
                    message: "Quest was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Quest with id=" + id
            });
        });
};