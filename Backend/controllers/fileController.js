const multer = require("multer");

const excelToJson = require("convert-excel-to-json");
const { request } = require("express");

//call mongodb user model
//const fileModel = require("./models/fileModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Upload excel file and import to mongodb
exports.fileUpload = async (req, res) => {
  try {
    upload.single("ExcelTest.xlsx");
    console.log(req.file);
    //importExcelData2MongoDB(__dirname + "/uploads/" + req.file.filename);

    res.send("File successfully received");
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      message: error.message,
    });
  }
};

// Import Excel File to MongoDB database
function importExcelData2MongoDB(filePath) {
  // -> Read Excel File to Json Data
  const excelData = excelToJson({
    sourceFile: filePath,
    sheets: [
      {
        // Header Row -> be skipped and will not be present at our result object.
        header: {
          rows: 1,
        },
      },
    ],
  });
  // -> Log Excel Data to Console
  console.log(excelData);

  // Insert Json-Object to MongoDB
  //   fileModel.insertMany(jsonObj, (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.redirect("/");
  //     }
  //   });
  //   fs.unlinkSync(filePath);
}
