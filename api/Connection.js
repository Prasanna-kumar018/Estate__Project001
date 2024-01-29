const mongoose = require("mongoose");
require("dotenv").config();
const ConnectDb = async () => {
  try {
    let data = await mongoose.connect(process.env.CONNECTION_STRING);
    if (data)
    {
      console.log("Connection to the database is successful");
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
module.exports = ConnectDb;
