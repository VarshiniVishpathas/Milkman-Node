const Mongoose = require("mongoose"),
	CryptoJS = require("crypto-js"),
	validator = require("node-validator");
const otpGenerator = require('otp-generator');
const moment = require('moment');
const userDB = Mongoose.model("user");
const otpDB = Mongoose.model("otp");
const bookingDB = Mongoose.model("customerBooking");
const pauseBookingDB = Mongoose.model("cancelOrders");
const Vonage = require('@vonage/server-sdk');
const vonage = new Vonage({
	apiKey: "7b322514",
	apiSecret: "7Lqw4Op6B4RDRRiG"
})
const bcrypt = require('bcrypt');
//const client = require('twilio')('AC279f57f1a0ea4e4c0301349a6f9f6d91', 'c9ef3cad3233f775fcac29ebc9af46d2');

module.exports = {
	addBooking: function (req, res) {
		try {
			let req_data = req.body;
			var check = validator
				.isObject()
				.withRequired(
					"userID",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withOptional(
					"email",
					validator.isString({ regex: /.+@.+\..+/ })
				)
				.withRequired(
					"name",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withOptional(
					"location",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withRequired(
					"phone",
					validator.isString({ regex: /^[6-9]\d{9}$/ })
				)
				.withRequired(
					"startDate",
					validator.isDate()
				)
				.withRequired(
					"endDate",
					validator.isDate()
				)
				.withRequired(
					"Quantity",
					validator.isString({ regex: /^[6-9]\d{9}$/ })
				)
				.withRequired(
					"amount",
					validator.isString({  regex: /^[6-9]\d{9}$/  })
				)
				.withRequired(
					"productID",
					validator.isString({ regex: /^(?=.*[\w\d]).+/  })
				)
				.withRequired(
					"productName",
					validator.isString({ regex: /^(?=.*[\w\d]).+/  })
				)
				.withRequired(
					"type",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				);
				// .withRequired(
				// 	"slot",
				// 	validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				// );
			validator.run(check, req_data, function (errCount, errs) {
				if (errCount > 0) {
					return res.json({
						status: 400,
						msg: "Invalid parameters",
						error: errs,
					});
				}
				// req_data.bookedBy = req.userDetail._id;
				// req_data.updatedBy = req.userDetail._id;
				bookingDB.create(req_data, (err, bookingRec) => {
					if (err) {
						if (err.code == 11000) {
							return res.json({ status: 400, msg: "Email already exists" });
						}
						return res.json({ status: 400, msg: "Something went wrong" });
					} else if (!bookingRec) {
						return res.json({ status: 400, msg: "Something went wrong" });
					}
					return res.json({ status: 200, msg: "Booking successfully" });
				});

			});
		} catch (e) {
			console.log(e);
			return res.json({ status: 500, msg: "Something went wrong", call: e });
		}
	},
	getBooking: function (req, res) {
		const today = new Date();
		let data = req.body;
		// console.log("today--------------->", today);
		try {
			bookingDB.aggregate([
				{
					'$match': {
						'status': 0,
						// 'startdate': today,
						// 'userID': data.userID,
					}
				}
			]).exec((err, getDetails) => {
				console.log("getDetails--------->", getDetails);
				if (err) {
					return res.json({ status: 400, msg: "Something went wrong" });
				}
				return res.json({ status: 200, msg: "Booking fetched successfully", data: getDetails });
			})
		} catch (e) {
			console.log(e);
			return res.json({ status: 500, msg: "Something went wrong", call: e });
		}
	},
	getBookingDetails: function (req, res) {
		bookingDB.find({ status: 0, userID: req.body.userID }, (err, getDetails) => {
			if (err) {
				return res.json({ status: 400, msg: "Something went wrong" });
			}
			return res.json({ status: 200, msg: "Booking fetched successfully", data: getDetails });
		})
	},
	cancelBooking: function (req, res) {
		bookingDB.updateOne({ _id: req.body.bookingId }, { status: 1, updatedBy: req.userDetail._id }, (err, updRec) => {
			if (err) {
				return res.json({ status: 400, msg: "Something went wrong" });
			} else if (!updRec) {
				return res.json({ status: 400, msg: "Something went wrong" });
			}
			return res.json({ status: 200, msg: "Booking cancelled successfully" });
		})
	},
	signUp: async function (req, res) {
		try {
			let data = req.body;
			const users = await otpDB.findOne({
				number: req.body.number
			})
			if (users) return res.json({status : 400,msg:"OTP already sent to the number. Please try again after 5min"})
			const OTP = otpGenerator.generate(6, {
				digits: true, alphabets: false, upperCase: false, specialChars: false
			});
			// client.messages.create({
			//     body: 'Hello this is your otp. Kindly dont share with anyone'+ " " + OTP,
			//     to: '+917010497792',
			//     from: '+918870553437'
			//  }).then(message => console.log(message))
			//    // here you can implement your fallback code
			//    .catch(error => console.log(error))
			const from = "MilkMan OTP"
			const to = "919788877388"
			const text = 'Your Milkman otp is ' + OTP + '. ' + ' Kindly use this otp to login';
			console.log('otp ', OTP);
			vonage.message.sendSms(from, to, text, (err, responseData) => {
				if (err) {
					console.log(err);
				} else {
					if (responseData.messages[0]['status'] === "0") {
						console.log("Message sent successfully.");
					} else {
						console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
					}
				}
			})
			const number = req.body.number;
			const otp = new otpDB({ number: number, otp: OTP });
			const salt = await bcrypt.genSalt(10);
			data.otp = await bcrypt.hash(OTP, salt);
			var check = validator
				.isObject()
				.withRequired(
					"number",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withRequired(
					"otp",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				);
			validator.run(check, data, function (errCount, errs) {
				if (errCount > 0) {
					return res.json({
						status: 400,
						msg: "Invalid parameters",
						error: errs,
					});
				}
				otpDB.create(data, (err, bookingRec) => {
					if (err) {
						if (err.code == 11000) {
							return res.json({ status: 400, msg: "Email already exists" });
						}
						return res.json({ status: 400, msg: "Something went wrong  1" });
					} else if (!bookingRec) {
						return res.json({ status: 400, msg: "Something went wrong 2" });
					}
					return res.json({ status: 200, msg: "OTP Sent successfully" });
				});
			});
		} catch (e) {
			console.log(e);
			return res.json({ status: 500, msg: "Something went wrong", call: e });
		}
	},
	verifyOtp: async function (req, res) {
		try {
			let data = req.body;
			const otp = await otpDB.findOne({
				number: req.body.number
			})
			if (!otp) return res.json({ status: 400, msg: "You entered Expired OTP" });
			const rightOTP = otp.otp;
			const validUser = await bcrypt.compare(data.otp, rightOTP);
			if (otp._doc.number === data.number && validUser) {
				console.log(data);
				//return res.json({ status: 200, msg: "OTP Verified Sucessfully" });
				if (validUser) {
					userDB.find({ status: 0, number: req.body.number }, (err, getUsers) => {
						if (err) {
							return res.json({ status: 400, msg: "Something went wrong" });
						}
						else if (getUsers.length === 0) {
							return res.json({ status: 200, msg: "New User", data: getUsers });
						}
						return res.json({ status: 200, msg: "User data fetched successfully", data: getUsers });
					})
				}
				otpDB.deleteOne(data.number, (err, bookingRec) => {
					if (!bookingRec || err) {
						//return res.json({ status: 400, msg: "Something went wrong" });
					}
					//return res.json({ status: 200, msg: "OTP number deleted" });
				});
			} else {
				res.json({ status: 200, msg: "Incorrect OTP" })
			}
		} catch (e) {
			console.log(e);
			return res.json({ status: 500, msg: "Something went wrong", call: e });
		}
	},
	userSignup: async function (req, res) {
		try {
			let req_data = req.body;
			var check = validator
				.isObject()
				.withOptional(
					"email",
					validator.isString({ regex: /.+@.+\..+/ })
				)
				.withRequired(
					"name",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withRequired(
					"phone",
					validator.isString({ regex: /^[6-9]\d{9}$/ })
				)
				.withRequired(
					"area",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withRequired(
					"pincode",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withRequired(
					"address",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withOptional(
					"location",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				);
			validator.run(check, req_data, function (errCount, errs) {
				if (errCount > 0) {
					return res.json({
						status: 400,
						msg: "Invalid parameters",
						error: errs,
					});
				}
				userDB.create(req_data, (err, userRec) => {
					if (err) {
						if (err.code == 11000) {
							return res.json({ status: 400, msg: "Email already exists" });
						}
						return res.json({ status: 400, msg: "Something went wrong" });
					} else if (!userRec) {
						return res.json({ status: 500, msg: "Something went wrong" });
					}
					return res.json({ status: 201, msg: "User Added successfully" });
				});

			});
		}catch (e) {
			console.log(e);
			return res.json({ status: 500, msg: "Something went wrong", call: e });
		}
	},
	editUser: async function (req, res) {
		try {
			let req_data = req.body;
			var check = validator
				.isObject()
				.withOptional(
					"email",
					validator.isString({ regex: /.+@.+\..+/ })
				)
				.withOptional(
					"name",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withOptional(
					"phone",
					validator.isString({ regex: /^[6-9]\d{9}$/ })
				)
				.withOptional(
					"area",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withOptional(
					"pincode",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withOptional(
					"address",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withOptional(
					"slot",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withOptional(
					"location",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				);
			validator.run(check, req_data, function (errCount, errs) {
				if (errCount > 0) {
					return res.json({
						status: 400,
						msg: "Invalid parameters",
						error: errs,
					});
				}
				userDB.updateOne(req_data, (err, userRec) => {
					if (err) {
						if (err.code == 11000) {
							return res.json({ status: 400, msg: "Email already exists" });
						}
						return res.json({ status: 400, msg: "Something went wrong" });
					} else if (!userRec) {
						return res.json({ status: 500, msg: "Something went wrong" });
					}
					return res.json({ status: 201, msg: "Profile saved successfully" });
				});

			});
		}catch (e) {
			console.log(e);
			return res.json({ status: 500, msg: "Something went wrong", call: e });
		}
	},
	pauseBooking: async function (req,res){
		try {
			let req_data = req.body;
			var check = validator
				.isObject()
				.withOptional(
					"email",
					validator.isString({ regex: /.+@.+\..+/ })
				)
				.withRequired(
					"userID",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withRequired(
					"orderID",
					validator.isString({ regex: /^[6-9]\d{9}$/ })
				)
				.withRequired(
					"Quantity",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withRequired(
					"productID",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withRequired(
					"action",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				)
				.withRequired(
					"actionDate",
					validator.isString({ regex: /^(?=.*[\w\d]).+/ })
				);
			validator.run(check, req_data, function (errCount, errs) {
				if (errCount > 0) {
					return res.json({
						status: 400,
						msg: "Invalid parameters",
						error: errs,
					});
				}
				pauseBookingDB.create(req_data, (err, userRec) => {
					if (err) {
						if (err.code == 11000) {
							return res.json({ status: 400, msg: "Email already exists" });
						}
						return res.json({ status: 400, msg: "Something went wrong" });
					} else if (!userRec) {
						return res.json({ status: 500, msg: "Something went wrong" });
					}
					return res.json({ status: 201, msg: "Booking paused successfully" });
				});

			});
		}catch (e) {
			console.log(e);
			return res.json({ status: 500, msg: "Something went wrong", call: e });
		}	
	}
};
