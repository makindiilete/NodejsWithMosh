const mongoose = require("mongoose");
const id = new mongoose.Types.ObjectId();
console.log(id.getTimestamp());

//validating an object id: '1234' is the id we are testing
const isValid = mongoose.Types.ObjectId.isValid("1234");
console.log(isValid);
