//our winston error logger package
const winston = require("winston");

module.exports = function(error, req, res, next) {
  //Log the exception/error
  //error
  //warn
  //info
  //verbose
  //debug
  //silly
  // winston.log('error', error.message);

  //the first arg here "error.message" is the message field, the 2nd "error" is the meta data field
  winston.error(error.message, error);
  res.status(500).send("Something failed.");
};
