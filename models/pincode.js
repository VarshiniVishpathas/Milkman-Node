var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const pincodeSchema = new Schema(
  {
    area: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1],//'active','inactive'
        index: true,
      },
    pincode: {
      type: String,
      index: true,
      unique: true,
    },
     district: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("pincode", pincodeSchema, "pincode");
