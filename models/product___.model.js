var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var ProductSchema = new Schema({
    name:{
        type: String,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
  });

  var Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
