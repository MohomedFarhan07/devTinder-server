const mongoose = require("mongoose");

//Connecting to the Database
const connectDB = async () => {
  await mongoose.connect("mongodb+srv://shazzfazneem:TVGog6h5KSXQdAeK@developertinder.2errvzj.mongodb.net/DevTinder");
};

module.exports = { connectDB }; 
