const express = require("express");
const app = express();
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const userController = require('./controllers/user.controller');
const db = require("./config/db");
require("dotenv").config();

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET,
  secure: true
});

// console.log('uploading')
// cloudinary.uploader.upload("/australia.jpg").then(result=>console.log('img: ' + result));
 //userController.uploadAvatar();

app.use(cors())
db.on("connected", function () {
  console.log("connected!");
});

db.on("disconnected", function () {
  console.log("disconnected!");
});

db.on("error", function (error) {
  console.log("Connection error: " + error);
});

 app.use(express.json({limit: '50mb'}));
 app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

require("./config/routes")(app);

app.listen(4200, function () {
  console.log("Server is on fire.");
});
