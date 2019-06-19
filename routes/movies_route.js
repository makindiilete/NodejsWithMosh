const { Movie, validate } = require("../models/movies_model");
const { Genre } = require("../models/genres_model");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//MONGODB DATABASE OBJECTS - GET THE LIST OF ALL THE GENRES
router.get("/", async (req, res) => {
  const movies = await Movie.find()
    //  useful if we are using referenced object
    // .populate("movieGenre", "name")
    .sort({ title: 1 });
  res.send(movies);
});

//MONGODB GET SINGLE OBJECT - GET A SINGLE OBJECT BY ID
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(404).send("Such movie does not exist");
    return;
  }
  res.send(movie);
});

//MONGODB DATABASE  POST REQUEST - CREATE A NEW GENRE OBJECT
router.post("/", async (req, res) => {
  //  input validation using function defined
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  //here we check to confirm the genreId sent exist in the database
  const movieGenre = await Genre.findById(req.body.genreId);
  //if the genreId does not exist, we simply return with the error msg
  if (!movieGenre) {
    res.status(404).send("This genre doesnt exist in the database");
  }
  const movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    movieGenre: {
      _id: movieGenre._id,
      name: movieGenre.name
    }
  });
  const result = await movie.save();
  console.log(result);
  res.send(movie);
});

//MONGODB DATABASE PUT REQUEST
router.put("/:id", async (req, res) => {
  // JOI VALIDATION
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const movieGenre = await Genre.findById(req.body.genreId);
  if (!movieGenre) {
    res.status(404).send("Invalid Genre");
    return;
  }
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      movieGenre: {
        _id: movieGenre._id,
        name: movieGenre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    //  this sends the updated details. Without this, we will get the old details displayed after the update
    { new: true }
  );
  //we check if the movie exist in the database else we return an error
  if (!movie) {
    res.status(404).send("Invalid Movie");
    return;
  }
  res.send(movie);
});

//MONGODB DATA DELETE REQUEST
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  console.log(movie);
  if (!movie) {
    res
      .status(404)
      .send(
        "The movie you try to delete doesnt exist or might have already been deleted!"
      );
  }
  res.send(movie);
});

module.exports = router;
