var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const slotsSchema = new Schema(
{
  slots: {
    type: String,
    },
  },
  { timestamps: true }
  );

module.exports = mongoose.model("slots", slotsSchema, "slots");
