const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genres_model");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    trim: true
  },
  movieGenre: {
    type: genreSchema,
    required: true
  },
  //useful for reference object
  /*  movieGenre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre"
  },*/
  numberInStock: {
    type: Number,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    minlength: 5,
    maxlength: 255
  }
});

const Movie = mongoose.model("Movie", movieSchema);

// JOI VALIDATION HANDLER
function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(10)
      .required(),
    //implementing joi object id to validate 'genreId"
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(5)
      .max(255)
      .required(),
    dailyRentalRate: Joi.number()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.movieSchema = movieSchema;
exports.validate = validateMovie;
