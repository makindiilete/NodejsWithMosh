const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  author: String
});

const Genre = mongoose.model("Genre", genreSchema);

// JOI VALIDATION HANDLER
function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(5)
      .required(),
    author: Joi.string().required()
  };
  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;
