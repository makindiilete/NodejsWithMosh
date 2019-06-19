const Joi = require("joi");
const mongoose = require("mongoose");

//SCHEMA
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: {
    type: Boolean,
    default: false,
    required: true
  },
  phone: {
    type: String,
    minlength: 11,
    maxlength: 16
    // required: true
  }
});

const Customer = mongoose.model("Customer", customerSchema);

// JOI VALIDATION HANDLER
function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(5)
      .required(),
    isGold: Joi.boolean().required(),
    phone: Joi.string()
      .min(11)
      .required()
  };
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validate = validateCustomer;
