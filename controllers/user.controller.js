const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const cloudinary = require('cloudinary').v2;
const fetchF = require('node-fetch');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users) return res.status(202).json(users);

    res.status(400).json({ error: "An error has occurred!" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (user) return res.status(200).json(user);

    res.status(400).json({ error: "An error has occurred!" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.createUser = async (req, res) => {
  const user = req.body;

  try {
    const newUser = await User.create(user);

    newUser.password = undefined;

    if (newUser) return res.status(200).json(newUser);

    res.status(400).json("An error has occurred!");
  } catch (error) {
    res.status(400).json({ error });
  }
};

async function dataUrlToFile(dataUrl, filename) {
  return fetchF(dataUrl)
    .then(res => res.blob())
    .then(blob => new File([blob], filename, { type: blob.type }))
}

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const user = req.body;


  try {
    const file = dataUrlToFile(req.body, 'avatar');
    console.log(file)
    const updatedUser = await User.findByIdAndUpdate(
      mongoose.Types.ObjectId(id),
      { $set: user },
      { new: true }
    );

    if (updatedUser) return res.json(updatedUser);

    return res.status(400).json("An error has occurred!");
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.deleteOne({ _id: id });
    if (!!deletedUser.n) return res.json(deletedUser);

    return res.status(400).json("An error has occurred!");
  } catch (error) {
    res.status(400).json({ error });
  }
};

const generateToken = (params = {}) => {
  return jwt.sign({ params }, config.key, { expiresIn: config.expiresIn });
};

exports.uploadAvatar = async (req,res) => {
  
  try {
    console.log('file', req.body);
    const result = await cloudinary.uploader
    .upload("./australia.jpg");
    console.log('result'+ JSON.stringify(result));
  } catch (error) {
    console.log(error)
  }
 
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json("User not found!");
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json("Invalid password!");

    user.password = undefined;

    const token = generateToken({ id: user._id });

    return res.send({token,user});
  } catch (error) {
    return res.status(400).send(error.message)
  }
  
};
