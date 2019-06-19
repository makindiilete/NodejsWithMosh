const jwt = require("jsonwebtoken");
const config = require("config");

function isAdmin(req, res, next) {
  // 401 Unauthorized : - when user tries to access a valid resource without a valid jwt so we give them a chance to retry and send a valid jwt
  // 403 Forbidden : - if they send a valid jwt but are not allowed to access a valid resource, that is when we use 403

  //  if a user is not an admin, we return ds error
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");
  //else if user is an admin, we pass control to the next middleware function
  next();
}

module.exports = isAdmin;
