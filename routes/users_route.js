const auth = require("../middleware/authorization");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/users_model");
const lodash = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//MONGODB GET REQUEST TO GET THE CURRENT LOGGED IN USER
// we protecting this route with the "auth" so only users with valid token can use it. Here we are using "/me" instead of "/:id" we have been using because we dont want users to paste id for security reason, we want to decode their id from their jwt
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id)
    //we exclude the password from the info to be retrieved by the client
    .select("-password");
  //we send it to the details user
  res.send(user);
});

//MONGODB DATABASE  POST REQUEST - CREATE A NEW USER
router.post("/", async (req, res) => {
  //  input validation using function defined
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  //checking if the user already exist in the database to avoid duplicate reg.
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered...");

  //setting the user properties with lodash
  user = new User(lodash.pick(req.body, ["name", "email", "password"]));
  //bcrypt salt
  const salt = await bcrypt.genSalt(10);
  //hashing the user password
  user.password = await bcrypt.hash(user.password, salt);

  const result = await user.save();
  console.log(result);

  //generating our token from the user model
  const token = user.generateAuthToken();
  //here now once a token is generate, we send an header with the token.
  res
    .header("x-auth-token", token)
    .send(lodash.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
