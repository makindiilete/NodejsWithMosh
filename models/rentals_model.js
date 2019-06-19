const Joi = require("joi");
const mongoose = require("mongoose");

//Inside the Rental document, we will be having two extra sub-documents making 3-in-1 document and we can define a separate schema for each of these 3 documents including the sub-documents bcos they can accept schemas and validation just like their parent documents.
const rentalSchema = new mongoose.Schema({
  // Here we are defining a schema for the movie sub-document, if we dont define this schema here to specify the properties we need to have in this parent document (Rental), the schema in the "movie_model.js" will be used and that will turn on all the properties and their settings we defined there which we definitely dont need especially in real world scenario where that might be 50+ properties, so here we can define a custom schema for movies so we can pick the only properties we need in the rentals
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        min: 0,
        required: true
      },
      //  the date the movie was rented out (ds sud be the current date by default)
      dateOut: {
        type: Date,
        default: Date.now,
        required: true
      },
      //  the date the movie was returned (ds will be set by the admin at d point of returned so it wont be required cos we dont want the client to set this)
      dateReturned: {
        type: Date
      },
      //  this is the rental fee for the movie, its also not required bcos we dont want this to be set by the client (ds can be calculated automatically in the routes handlers)
      rentalFee: {
        type: Number,
        min: 0
      }
    })
  },
  // Here we are defining a schema for the customer sub-document, if we dont define this schema here to specify the properties we need to have in this parent document (Rental), the schema in the "customer_model.js" will be used and that will turn on all the properties and their settings we defined there which we definitely dont need especially in real world scenario where that might be 50+ properties, so here we can define a custom schema for customers so we can pick the only properties we need in the rentals
  customer: {
    type: new mongoose.Schema({
      //  the name of the customer that rented the movie
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
      },
      //  the phone number of the customer
      phone: {
        type: Number,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      //  our gold customers, (this will be used to calculate rental fee later, we might want to give discount to our gold customers)
      isGold: {
        type: Boolean,
        default: false
      }
    })
  }
});

const Rental = mongoose.model("Rental", rentalSchema);

// JOI VALIDATION HANDLER
function validateRental(rental) {
  const schema = {
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
