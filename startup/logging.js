//our winston error logger package
const winston = require("winston");
//loading winston-mongodb for logging errors to mongodb
require("winston-mongodb");
require("express-async-errors");

module.exports = function() {
  //Uncaught Exception
  //using a different transport/file to log "uncaughtExceptions"
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );
  //Unhandled Promise Rejection
  process.on("unhandledRejection", error => {
    //  this will throw an unhandledException which will be handled by winston
    throw error;
  });
  //adding transport for logging errors to file
  winston.add(winston.transports.File, { filename: "logfile.log" });
  //adding transport for logging errors to mongodb, we pass entry to our vidly database @ line 35
  winston.add(winston.transports.MongoDB, {
    db: "mongodb://localhost/vidly",
    level: "info"
  });
};
