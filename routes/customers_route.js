const { Customer, validate } = require("../models/customer_model");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//MONGODB GET REQUEST DATABASE OBJECTS - GET THE LIST OF ALL THE GENRES
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 });
  res.send(customers);
});

//MONGODB GET REQUEST SINGLE OBJECT - GET A SINGLE OBJECT BY ID
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404).send("Such customer does not exist");
    return;
  }
  res.send(customer);
});

//MONGODB DATABASE  POST REQUEST - CREATE A NEW GENRE OBJECT
router.post("/", async (req, res) => {
  //  input validation using function defined
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  const result = await customer.save();
  console.log(result);
  res.send(customer);
});

//MONGODB DATABASE PUT REQUEST
router.put("/:id", async (req, res) => {
  // JOI VALIDATION
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    phone: req.body.phone
  });
  res.send(customer);
});

//MONGODB DATA DELETE REQUEST
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  console.log(customer);
  if (!customer) {
    res
      .status(404)
      .send(
        "The customer you try to delete doesnt exist or might have already been deleted!"
      );
  }
  res.send(customer);
});

module.exports = router;
