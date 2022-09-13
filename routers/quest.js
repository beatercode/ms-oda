const express = require('express');
const router = express.Router();
const controller = require("../controller/quest.controller");

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/quest/:questId", controller.findAllQuest);
router.get("/id/:customId", controller.findOneCustomId);
router.put("/:customId", controller.update);
router.delete("/:customId", controller.delete);

module.exports = router;