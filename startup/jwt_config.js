const configJwt = require("config");

module.exports = function() {
  //checking for our jwt private key when the application starts
  if (!configJwt.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
