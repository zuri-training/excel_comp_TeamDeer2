const express = require("express");

const fileController = require("../controllers/fileController");

const router = express.Router();

const { requireAuth } = require("../controllers/userController");

router.post("/upload", fileController.fileUpload);

module.exports = router;
