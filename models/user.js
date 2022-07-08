var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      // lowercase: true
    },
    email: {
      type: String,
      lowercase: true,
      match: /.+@.+\..+/,
      // required: true,
      // unique: false,
      // index: true,
    },
    phone: {
      type: String,
      //required: true,
      //unique: true,
      index: true,
    },
    status: {
      type: Number,
      default: 0,
      enum: [0, 1],//'booked','canceled'
      index: true,
    },
    wallet: {
      type: Number,
      required: false,
      default: 0,
    },
     type: {
      type: String,
      required: false,
      // lowercase: true
    },
     slot: {
      type: String,
      required: false,
      // lowercase: true
    },
    area: {
      type: String,
      required: true,
      // lowercase: true
    },
    pincode: {
      type: Number,
      required: true,
      // lowercase: true
    },
    address: {
      type: String,
      required: true,
      // lowercase: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema, "user");
