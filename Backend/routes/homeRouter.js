const express = require("express");

const homeController = require("../controllers/homeController");

const router = express.Router();

router.get("/", homeController.getHome);

router.get("/contactUs", homeController.contactUs);

router.get("/documentation", homeController.documentation);

module.exports = router;
