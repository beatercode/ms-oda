const express = require('express');
const router = express.Router();
const controller = require("../controller/website.controller");

router.get("/get-homepage-data", controller.getHomepageData);
router.get("/get-team", controller.getTeam);
router.get("/get-services", controller.getServices);
router.get("/service-detail", controller.getServiceDetail);


module.exports = router;