const mongoose = require("mongoose");
 
//Connecting to the Database
const connectDB = async () => {
  await mongoose.connect("mongodb+srv://shazzfazneem_db_user:itnTTk4MHrAh6dwA@developertinder.naqufv6.mongodb.net/DevTinder");
};
             
module.exports = { connectDB };  
