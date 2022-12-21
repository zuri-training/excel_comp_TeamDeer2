const multer = require("multer");

const excelToJson = require("convert-excel-to-json");

const fs = require("fs");

//call mongodb file model
const fileModel = require("../models/fileModel");

const path = require("path");
const { syncBuiltinESMExports } = require("module");

// Upload excel file and import to mongodb
exports.fileUpload = async (req, res, next) => {
  try {
    //check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        msg: "Please provide an Excel file",
      });
    }
    importExcelData2MongoDB(
      path.dirname(__dirname) + "/ExcelFiles/" + req.file.filename
    );
    res.status(200).json({
      status: "Success",
    });
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
  console.log(filePath);
  const excelData = excelToJson({
    sourceFile: filePath,
    header: {
      rows: 1,
    },
    columnToKey: {
      A: "Column1",
      B: "Column2",
      "*": "{{columnHeader}}",
    },
  });

  //Insert Json-Object to MongoDB
  fileModel.insertMany(excelData.Sheet1, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
  fs.unlinkSync(filePath);
}
