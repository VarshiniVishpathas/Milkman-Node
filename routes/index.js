const express = require("express"),
	api = express.Router()
const controller = require("../controller/index.js"),
	common = require("../helper/common");
var objDashboard = require('../controller/dashboard');

//User
//api.post("/user/login", controller.user.login);

api.post("/signup",controller.customerBooking.signUp);
api.post("/verifyOTP", controller.customerBooking.verifyOtp);
api.post('/newUser',controller.customerBooking.userSignup);

api.post("/editProfile", controller.customerBooking.editUser );

// Pincode 
api.get('/getPincode',objDashboard.getpincode);
api.post('/addPincode',objDashboard.addPincode);

//Product
api.get('/getProducts',objDashboard.getproduct);
api.post('/addProduct',objDashboard.addProduct);

//Booking 
//common.verifyToken,
api.post("/addBooking", controller.customerBooking.addBooking);
api.post("/getBooking", controller.customerBooking.getBooking);
api.post("/getBookinglist", controller.customerBooking.getBookingDetails);
api.post("/cancelBooking", controller.customerBooking.cancelBooking);
// api.get("/cancelBooking", common.verifyToken, controller.customerBooking.cancelBooking);


// pause Booking
api.post("/pauseBooking", controller.customerBooking.pauseBooking);

//Slots
api.get("/getSlots", controller.slots.getSlot);

// Wallet transaction list
api.post("/wallet", objDashboard.walletTrans);
api.post("/getWallet", objDashboard.getWallet);
module.exports = api;