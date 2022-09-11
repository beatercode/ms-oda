const express = require('express');
const router = express.Router();
const operation = require('../logic/survey.operation')
const controller = require("../controller/survey.controller");

// SEND
router.post('/send', async (req, res) => {
    let survey = req.body
    let result = await operation.execute(survey.survey_id)
    res.send(result);
});

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;