const express = require('express');
const router = express.Router();
const operation = require('../logic/quest.operation')
const controller = require("../controller/quest.controller");

// SEND
router.post('/send', async (req, res) => {
    let quest = req.body
    let result = await operation.execute(quest.quest_id)
    res.send(result);
});

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/quest/:questId", controller.findAllQuest);
router.get("/id/:customId", controller.findOneCustomId);
router.put("/:customId", controller.update);
router.delete("/:customId", controller.delete);

module.exports = router;