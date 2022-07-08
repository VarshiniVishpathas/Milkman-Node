var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const walletSchema = new Schema(
  {
    userID: {
        type: mongoose.ObjectId,
        required: false,
      },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1],//'active','inactive'
        index: true,
      },
    orderID: {
      type: mongoose.ObjectId,
      index: true,
      required: false,
    },
    amount: {
        type: String,
        required: false,
      },
     action: {
      type: String,
      required: false,
    },
    transactionDate: {
        type: String,
        required: false,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("wallet", walletSchema, "wallet");
