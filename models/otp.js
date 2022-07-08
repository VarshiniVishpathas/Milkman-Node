var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const otpSchema = new Schema(
{
  number: {
    type: String,
    required: true,
  },
  otp: {
      type: String,
      //required: true
  },
  createdAt: {type: Date , default: Date.now, index:{expires: 300}}
},
  { timestamps: true }
  );

module.exports = mongoose.model("otp", otpSchema, "otp");
