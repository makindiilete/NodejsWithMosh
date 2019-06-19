const Joi = require("joi");
const mongoose = require("mongoose");
//loading jwt and config module
const config = require("config");
const jwt = require("jsonwebtoken");

//SCHEMA
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 5,
    //  we will be hashing the password into a longer string which we will store in mongodb so dts y we av a maxlength of 1024, but the real user password will be 255 max which we define in Joi validation.
    maxlength: 1024,
    required: true
  },

  //this is to separate the admins from normal users
  isAdmin: {
    type: Boolean,
    default: false
  }
});

//generating our JWT
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    //  adding "isAdmin" & "_id" to the payload
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

// JOI VALIDATION HANDLER
function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
