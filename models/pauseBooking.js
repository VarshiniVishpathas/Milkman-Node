var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const pauseBookingSchema = new Schema(
  {
    // cancelID: {
    //   type: mongoose.ObjectId,
    //   required: true,
    //   unique: true,
    // },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1],//'active','inactive'
        index: true,
      },
    orderID: {
      type: mongoose.ObjectId,
      index: true,
    },
     userID: {
      type: mongoose.ObjectId,
      required: false,
    },
     productID: {
      type: mongoose.ObjectId,
      required: false,
    },
     action: {
      type: String,
      required: false,
    },
    actionDate: {
        type: String,
        required: false,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cancelOrders", pauseBookingSchema, "cancelOrders");
