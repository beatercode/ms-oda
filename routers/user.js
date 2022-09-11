const express = require('express');
const router = express.Router();
const controller = require("../controller/user.controller");

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/username/:username", controller.findOneUsername);
router.get("/id/:user_id", controller.findOneUserID);
router.put("/:user_id", controller.update);
router.delete("/:user_id", controller.delete);

module.exports = router;