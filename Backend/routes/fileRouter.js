const express = require("express");

const router = express.Router();

const { requireAuth } = require("../controllers/userController");

const fileController = require("../controllers/fileController");

const { upload } = require("../config/multer");

router.post(
  "/upload",
  requireAuth,
  upload.single("excelFile"),
  fileController.fileUpload
);

module.exports = router;
