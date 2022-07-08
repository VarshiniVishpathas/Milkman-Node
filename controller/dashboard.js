const Mongoose = require("mongoose"),
    CryptoJS = require("crypto-js"),
    validator = require("node-validator");
const { isObject } = require("node-validator");
const pincodeDB = Mongoose.model("pincode");
const productDB = Mongoose.model("product");
const walletDB = Mongoose.model("wallet");

module.exports = {
    getpincode: function (req, res) {
            pincodeDB.find({}, (err, getPincode) => {
            if (err) {
                return res.json({ status: 400, msg: "Something went wrong" });
            }
            return res.json({ status: 200, msg: "Pincode fetched successfully", data: getPincode });
        })
    },
    addPincode: function (req, res) {
        try {
            var req_data = req.body;
            var check = validator
            .isObject()
            .withRequired(
                "area",validator.isString({ regex: /^(?=.*[\w\d]).+/ })
            )
            .withRequired(
                "pincode",validator.isString({regex: /^[1-9][0-9]{5}$/ })
            )
            .withRequired(
                "district",validator.isString({ regex: /^(?=.*[\w\d]).+/ })
            )
            validator.run(check, req_data, function (errCount, errs) {
				if (errCount > 0) {
					return res.json({
						status: 400,
						msg: "Invalid parameters",
						error: errs,
					});
				}
				pincodeDB.create(req_data, (err, pincodeRec) => {
					if (err) {
						if (err.code == 11000) {
							return res.json({ status: 400, msg: "Pincode already exists" });
						}
						return res.json({ status: 400, msg: "Something went wrong" });
					} else if (!pincodeRec) {
						return res.json({ status: 400, msg: "Something went wrong" });
					}
					return res.json({ status: 200, msg: "Pincode Added successfully" });
				});

			});
        }
        catch(e){
            console.log(e);
			return res.json({ status: 500, msg: "Something went wrong", call: e });
        }
    },
    getproduct: function (req, res) {
        productDB.find({}, (err, getProduct) => {
            if (err) {
                return res.json({ status: 400, msg: "Something went wrong" });
            }
            return res.json({ status: 200, msg: "Products fetched successfully", data: getProduct });
        })
    },
    addProduct: function(req,res){
        try{
            let req_data = req.body;
            var check = validator
            .isObject()
            .withRequired(
                "productName",validator.isString()
            )
            .withRequired(
                "quantity", validator.isString({regex: /^[1-9]+[0-9]*$/ })
            )
            .withRequired(
                "amount", validator.isString({ regex: /^[1-9]+[0-9]*$/ })
            )
            validator.run(check, req_data, function (errCount, errs){
                if(errCount>0){
                    return res.json({
                        status: 400,
                        msg: "Invalid Parameters",
                        error: errs,
                    })
                }
                productDB.create(req_data, (err,productRec) => {
                    if(err){
                        if(err.code === 11000){
                            return res.json({status: 200, msg: "Product Already Exists"});
                        }
                        return res.json({ status: 400, msg: " Something went wrong"});
                    }else if(!productRec){
                        return res.json({status: 400, msg: "Something went wrong"});
                    }
                    return res.json({ status: 200, msg: "Product Added Successfully"});
                })
            })
        }
        catch(e){
            console.log(e);
            return res.json({status: 500, msg: "Something went wrong", call: e});
        }
    },
    walletTrans: function(req,res){
        try{
            let req_data = req.body;
            var check = validator
            .isObject()
            .withRequired(
                "userID",validator.isString({ regex: /^(?=.*[\w\d]).+/ })
            )
            .withRequired(
                "transactionMode", validator.isString({ regex: /^(?=.*[\w\d]).+/ })
            )
            .withRequired(
                "action", validator.isString({ regex: /^(?=.*[\w\d]).+/ })
            )
            .withRequired(
                "transactionDate", validator.isDate()
            )
            .withRequired(
                "amount", validator.isString({ regex: /^[1-9]+[0-9]*$/ })
            )
            validator.run(check, req_data, function (errCount, errs){
                if(errCount>0){
                    return res.json({
                        status: 400,
                        msg: "Invalid Parameters",
                        error: errs,
                    })
                }
                u
                walletDB.create(req_data, (err,productRec) => {
                    if(err){
                        if(err.code === 11000){
                            return res.json({status: 200, msg: "Transaction already Exists"});
                        }
                        return res.json({ status: 400, msg: " Something went wrong"});
                    }else if(!productRec){
                        return res.json({status: 400, msg: "Something went wrong"});
                    }
                    return res.json({ status: 200, msg: "Wallet transaction saved successfully"});
                })
            })
        }
        catch(e){
            console.log(e);
            return res.json({status: 500, msg: "Something went wrong", call: e});
        }  
    },
    getWallet: function (req, res) {
		bookingDB.find({ status: 0, userID: req.body.userID }, (err, getDetails) => {
			if (err) {
				return res.json({ status: 400, msg: "Something went wrong" });
			}
			return res.json({ status: 200, msg: "Transactions fetched successfully", data: getDetails });
		})
	},
};