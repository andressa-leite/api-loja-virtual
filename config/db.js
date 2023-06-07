const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin_user:root@cluster1.z1s7lr7.mongodb.net/test",
  {
    useNewUrlParser: true,
  }
);

mongoose.set("useCreateIndex", true);

module.exports = mongoose.connection;
