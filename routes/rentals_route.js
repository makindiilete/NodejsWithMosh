const { Rental, validate } = require("../models/rentals_model");
const { Movie } = require("../models/movies_model");
const { Customer } = require("../models/customer_model");
//loading fawn to implement two phase commits.
const Fawn = require("fawn");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//initialising two phase commits.
Fawn.init(mongoose);

//MONGODB DATABASE OBJECTS - GET THE LIST OF ALL THE Rentals
router.get("/", async (req, res) => {
  const rentals = await Rental.find()
    //sorting by the "dateOut" properties in descending order
    .sort("-dateOut");
  res.send(rentals);
});

//MONGODB GET SINGLE OBJECT - GET A SINGLE OBJECT BY ID
router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) {
    res.status(404).send("Such rental does not exist");
    return;
  }
  res.send(rental);
});

//MONGODB DATABASE  POST REQUEST - CREATE A NEW GENRE OBJECT
router.post("/", async (req, res) => {
  //  input validation using function defined
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  // //here we check to confirm the movie sent exist in the database
  const movie = await Movie.findById(req.body.movieId);

  //here we check to confirm the customer sent exist in the database
  const customer = await Customer.findById(req.body.customerId);

  //here we are checking to ensure the movie we are renting out is still in stock
  if (movie.numberInStock === 0)
    return res.status(404).send("Current this movie is out of stock!");

  //if the customer does not exist, we simply return with the error msg
  if (!customer) {
    res.status(404).send("This customer doesnt exist in the database");
  }
  //if the movie does not exist, we simply return with the error msg
  if (!movie) {
    res.status(404).send("This movie doesnt exist in the database");
  }
  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  try {
    //  creating new two phase commit task with fawn
    new Fawn.Task()
      //Task 1 : Saving the rentals with 2 args (collection name & document object variable to be saved)
      .save("rentals", rental)
      //Task 2 : updating the movies with 2 args (collection name & the id of the movies to be updated)
      .update(
        "movies",
        { _id: movie._id },
        {
          //here we are using the increment function "$inc" and decrementing the "numberInStock" by one "-1"
          $inc: { numberInStock: -1 }
        }
      )
      //    completing the operation with run
      .run();
    //  catching errors (500 code means internal server error)
  } catch (error) {
    res.status(500).send("Something failed....");
  }
  res.send(rental);
});

//MONGODB DATABASE PUT REQUEST
router.put("/:id", async (req, res) => {
  // JOI VALIDATION
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    res.status(404).send("Invalid Movie");
    return;
  }
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    res.status(404).send("Invalid Customer");
    return;
  }
  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      },
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone
      }
    },
    //  this sends the updated details. Without this, we will get the old details displayed after the update
    { new: true }
  );
  //we check if the rental exist in the database else we return an error
  if (!rental) {
    res.status(404).send("Invalid Rental");
    return;
  }
  res.send(rental);
});

//MONGODB DATA DELETE REQUEST
router.delete("/:id", async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);
  console.log(rental);
  if (!rental) {
    res
      .status(404)
      .send(
        "The rental you try to delete doesnt exist or might have already been deleted!"
      );
  }
  res.send(rental);
});

module.exports = router;
