const Mongoose = require("mongoose"),
CryptoJS = require("crypto-js"),
validator = require("node-validator");
const slotDB = Mongoose.model("slots");

module.exports = {
	getSlot: function (req, res) {
		slotDB.find({}, (err, getSlots)  => {
			if (err) {
				return res.json({ status: 400, msg: "Something went wrong" });
			}
			return res.json({ status: 200, msg: "Slots fetched successfully", data: getSlots });
		})
	},
};