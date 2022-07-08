var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bookingSchema = new Schema(
  {
    userID: {
      type: mongoose.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    Quantity: {
      type: String,
      required: true,
      //unique: true,
      index: true,
    },
    status: {
      type: Number,
      default: 0,
      enum: [0, 1],//'active','inactive'
      index: true,
    },
     amount: {
      type: String,
      required: true,
      // lowercase: true
    },
     type: {
      type: String,
      required: true,
      // lowercase: true
    },
     productID: {
      type: String,
      required: true,
      // lowercase: true
    },
     productName: {
      type: String,
      required: true,
      // lowercase: true
    },
    //  slot: {
    //   type: String,
    //   required: true,
      // lowercase: true
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("customerBooking", bookingSchema, "customerBooking");
