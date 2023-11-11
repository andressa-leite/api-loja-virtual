const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true 
  }
);

mongoose.set("useCreateIndex", true);

module.exports = mongoose.connection;
