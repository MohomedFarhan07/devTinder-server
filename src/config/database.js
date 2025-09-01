const mongoose = require("mongoose");
 
//Connecting to the Database
const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};
             
module.exports = { connectDB };  
