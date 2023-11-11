var express = require("express");
var router = express.Router();

const userRouter = require("../routes/user.router");
const productRouter = require("../routes/product___.router")

module.exports = (app) => {
  app.use("/api/users", userRouter);
  app.use("/api/products", productRouter)
  
  app.get("/", function (req, res) {
    res.set("content-type", "text/html");
    res.send("Great! It works. Welcome to MERN API!");
  });
};
