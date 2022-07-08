var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    productName: {
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
    amount: {
      type: String,
      required: true,
    },
     quantity: {
      type: String,
      required: true,
    },
    updated: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema, "product");
