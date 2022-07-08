const Mongoose = require("mongoose"),
CryptoJS = require("crypto-js"),
validator = require("node-validator");
const userDB = Mongoose.model("user"),
common = require("../helper/common");
module.exports = {
	login: function (req, res) {
		try {
			var find_data = req.body;
			var check = validator
			.isObject()
			.withRequired(
				"username",
				validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
			.withRequired(
				"password",
				validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				);
			validator.run(check, find_data, function (errCount, errs) {
				if (errCount > 0) {
					return res.json({
						status: 400,
						msg: "Invalid parameters",
						error: errs,
					});
				}
				common.check_regex(find_data.username, (match) => {
					console.log("username match  ------>", match);
					if (!match) {
						return res.json({
							status: 400,
							msg: "Invalid parameters"
						});
					}
					userDB.findOne(match, (err, userData) => {
						var errMsg = match.email ? "Invalid Email or password" : "";
						if (!userData) {
							return res.json({
								status: 400,
								msg: errMsg,
							});
						}
						var details = userData;
						var checkPass = find_data.password ? common.decrypt_password(find_data.password, details.password) : '';
						console.log("checkPass----------->", checkPass);
						if (checkPass == false) { return res.json({ status: 400, msg: "Invalid password" }); }
						var JWTtoken = common.createPayload({
							id: details._id,
							name: details.name,
							email: details.username,
							phone: details.phone,
						});
						return res.json({
							status: 200,
							msg: "Logged in successfully",
							token: JWTtoken,
						});
					});
				})
			});
		} catch (e) {
			console.log(e);
			return res.json({ status: 500, msg: "Something went wrong", call: e });
		}
	},
};