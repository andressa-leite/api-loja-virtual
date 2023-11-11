const mongoose = require("mongoose");
const Product = require("../models/product___.model");
const cloudinary = require('cloudinary').v2;
const fs = require('fs')
const base64Stringbase64 = require('blob-util');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length === 0) {
      return res
        .status(400)
        .send({ message: "there aren't any products registered" });
    }
    res.send(products);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product) return res.status(200).json(product);
    res.status(400).json({ error: "Product not found!" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price || !description) {
      res.status(400).send({ message: "All fields must be submitted" });
    }

    const product = await Product.create(req.body);
    if (!product) {
      return res.status(400).send({ message: "Error creating Product" });
    }
    res.status(201).send({
      message: "Product created successfully",
      data: { id: product._id, name, price, description },
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const { id } = req.params;
    

    if (!name && !price && !description) {
      res.status(400).send({ message: "Submit at least one field" });
    }

    const product = await Product.findOneAndUpdate({_id: id}, {$set:{name, price, description}},{new:true});
    //await Product.findOneAndUpdate({_id: id}, {name, price, description});
    //const product = await Product.findById(id);
    console.log(product)
    res.send({ message: "product successfully updated", data: product });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await Product.deleteOne({ _id: id });
    console.log(deleteProduct);
    if (!!deleteProduct.n)
      return res.json({
        message: "Product deleted successfully",
        deleteProduct,
      });
    return res.status(400).json("Unable to delete product!");
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
   
    const file = req.body.image.split(';base64,').pop();

    fs.writeFile('image.png', file, {encoding: 'base64'}, function(err) {
        if(err) return res.status(400).send('erro to create the file');
        
        cloudinary.uploader.upload('image.png', async function(error, result) {
            if(error) {
                return res.status(400).send('erro to upload image to the cloudinary');
            }
            const updatedImage = await Product.findOneAndUpdate(
              {_id:mongoose.Types.ObjectId(id)},
              {image: result.url},
              {returnOriginal: true}
            );

            if(updatedImage) {
                return res.status(202).json({message: 'Image updated!', data: updatedImage});
            }else {
                return res.status(400).json({message:'An error has occured.'});
            }
        });
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
