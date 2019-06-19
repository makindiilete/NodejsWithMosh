const express = require("express");
const genres = require("../routes/genres_route");
const customers = require("../routes/customers_route");
const rentals = require("../routes/rentals_route");
const movies = require("../routes/movies_route");
const users = require("../routes/users_route");
const auth = require("../routes/auth");
const error = require("../middleware/Errors/error");

//passing "app" parameter that referenced the "const app = express();"
module.exports = function(app) {
  // needed to be able to post in json AND IT SHOULD BE ONTOP OF ALL ROUTES
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  //Express error middleware referenced here
  app.use(error);
};
