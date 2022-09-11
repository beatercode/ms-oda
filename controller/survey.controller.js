const Surveys = require("../models/Survey")

exports.create = async (req, res) => {

    console.log("Im adding a new record")
    if (!req.body.name || !req.body.question) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    if (req.body.customId) {
        res.status(400).send({ message: "Survey custom ID cann't be specified!" });
        return;
    }

    let mode = req.body.mode ? req.body.mode : "survey"
    let modeLetter = mode == "survey" ? "S" : mode == "quiz" ? "Q" : "N"
    let maxIdSurvey = await Surveys.find({})
    maxIdSurvey = maxIdSurvey.filter(x => x.customId.substring(0, 1) === modeLetter)
    maxIdSurvey = maxIdSurvey.map(x => +x.customId.substring(1, 2))
    maxIdSurvey = Math.max(...maxIdSurvey)
    let nextIdSurvey = modeLetter + (maxIdSurvey + 1)

    const survey = new Surveys({
        customId: nextIdSurvey,
        name: req.body.name,
        question: req.body.question,
        republishable: req.body.republishable ? req.body.republishable : false,
        wasPublished: req.body.wasPublished ? req.body.wasPublished : false,
        mode: mode,
        validFrom: req.body.validFrom ? req.body.validFrom : "",
        options: req.body.options ? req.body.options : [],
        voters: req.body.voters ? req.body.voters : []
    });
    survey
        .save(survey)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

exports.findAll = (req, res) => {
    console.log("Im gonna print all records")
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
    Surveys.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving surveys."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    Surveys.findOne({ "customId": id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Survey with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Survey with id=" + id });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    Surveys.findOneAndUpdate({ "customId": id }, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Survey with id=${id}. Maybe Surveys was not found!`
                });
            } else res.send({ message: "Surveys was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Surveys with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Surveys.findOneAndRemove({ "customId": id })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Survey with id=${id}. Maybe Survey was not found!`
                });
            } else {
                res.send({
                    message: "Survey was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Survey with id=" + id
            });
        });
};