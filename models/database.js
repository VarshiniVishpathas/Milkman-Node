const config = require("../Nodedetails/config")

const mongoose = require("mongoose");

const options = {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useCreateIndex: true,
};

const uri = "mongodb://localhost:27017/milkman";
// const uri = config.db;
console.log("uri------------->", uri);
mongoose.connect(uri, options);
mongoose.connection.on("open", function (ref) {
  console.log("open connection to mongo server.");
});

mongoose.connection.on("connected", function (ref) {
  console.log("connected to mongo server.");
});

mongoose.connection.on("disconnected", function (ref) {
  console.log("disconnected from mongo server.");
});

mongoose.connection.on("close", function (ref) {
  console.log("close connection to mongo server");
});

mongoose.connection.on("error", function (err) {
  console.log("error connection to mongo server!");
  console.log(err);
});

require('./customerBooking')
require('./user')
require('./slots')
require('./otp')
require('./pincode')
require('./product')
require('./pauseBooking')
require('./wallet')