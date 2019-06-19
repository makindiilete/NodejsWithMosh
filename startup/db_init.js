const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function() {
  //Here we create our database, the name will be what we define after "mongodb://localhost/"
  mongoose
    .connect("mongodb://localhost/vidly")
    .then(() => winston.info("Connected to MongoDB......"));
};
