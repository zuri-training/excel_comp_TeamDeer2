const mongoose = require("mongoose");

const Schema = mongoose.Schema;

fileSchema = new Schema({
  Column1: {
    type: String,
    required: true,
  },
  Column2: {
    type: String,
    required: true,
  },
  Column3: {
    type: String,
    required: false,
  },
  Column4: {
    type: String,
    required: false,
  },
  Column5: {
    type: String,
    required: false,
  },
  Column6: {
    type: String,
  },
  Column7: {
    type: String,
  },
  Column8: {
    type: String,
  },
  Column9: {
    type: String,
  },
  Column10: {
    type: String,
  },
  Column11: {
    type: String,
  },
  Column12: {
    type: String,
  },
  Column13: {
    type: String,
  },
  Column14: {
    type: String,
  },
  Column15: {
    type: String,
  },
});

const ExcelFile = mongoose.model("excelFile", fileSchema);

module.exports = ExcelFile;
