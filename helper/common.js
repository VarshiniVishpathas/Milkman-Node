const config = require("../Nodedetails/config");
const Mongoose = require("mongoose"),
bcrypt = require("bcrypt"),
	path = require("path"),
	jwt = require("jsonwebtoken"),
	CryptoJS = require("crypto-js"),
	crypto = require('crypto')
	userDB = require("../models/user");
const saltRounds = 10;
const authKey = "dyooti2021";

exports.encrypt_password = (password) => {
	console.log("common pass", password);
	return bcrypt.hashSync(password, saltRounds);
};

exports.decrypt_password = (check_password, password) => {
	return bcrypt.compareSync(check_password, password);
};

exports.createPayload = (key) => {
	let payload = { secret: key };
	let token = jwt.sign(payload, authKey, { expiresIn: 180 * 60 });
	return token;
};

module.exports.verifyToken = async (req, res, next) => {
	const bearerHeader = req.headers["authorization"];
	console.log("bearerHeader----------->", bearerHeader);
	if (typeof bearerHeader !== "undefined") {
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1];
		jwt.verify(bearerToken, authKey, (err, decode) => {
			console.log("decode----------->", decode);
			if (err || !decode) {
				return res.status(401).send({ status: 401, msg: "Token exipired" });
			} else if (decode) {
				userDB.findOne({ _id: Mongoose.mongo.ObjectId(decode.secret.id) }, (err, matched) => {
					if (err || !matched) {
						return res.status(401).send({ status: 401, msg: "Token exipired" });
					} else if (Object.keys(matched).length == 0) {
						return res.status(401).send({ status: 401, msg: "Token exipired" });
					}
					req.userDetail = matched;
					next();
				})
			}
		})
	} else {
		return res.status(401).send({ status: 401, msg: "Token exipired" });
	}
};

exports.check_regex = (userName, callback) => {
	try {
		if (userName.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
			callback({ username: userName.toLowerCase() })
		}
		else {
			callback(false)
		}
	}
	catch (e) {
		callback(false)
	}
}