const asyncHandler = require("express-async-handler");
const User = require("../Schemas/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../Schemas/Users");
const registerHandler = asyncHandler(async (req, res) => {
  let { Username, Email, Password } = req.body;
  if (!Username || !Email || !Password) {
    res.status(400);
    throw new Error("All Fields are mandatory");
  }
  let data = await User.find({ Email });
  let name = await User.find({ Username });

  if (data.length > 0) {
    res.status(400);
    throw new Error("Email Already taken!");
  }
  if (name.length > 0) {
    res.status(400);
    throw new Error("Username Already taken!");
  }
  let hashedPassword = await bcrypt.hash(Password, 10);
  let result = await User.create({
    Username,
    Email,
    Password: hashedPassword,
  });

  res.json(result);
});

const googlehandler = asyncHandler(async (req, res) => {
  let { Username, Email, Photourl } = req.body;
  let data = await User.findOne({ Email });
  if (!data) {
    //sign up - sign in
    let Password =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    let hashedPassword = await bcrypt.hash(Password, 10);
    let data = await User.create({
      Username:
        Username.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-8),
      Password: hashedPassword,
      Email,
      Photourl,
    });
    console.log(data);
    let { Password: hash, ...rest } = data._doc;
    let accesstoken = jwt.sign({ id: data._id }, process.env.SECRET_KEY);
    res
      .cookie("accesstoken", accesstoken, { httpOnly: true })
      .status(201)
      .json(rest);
  } else {
    let { Password, ...rest } = data._doc;
    let accesstoken = jwt.sign({ id: data._id }, process.env.SECRET_KEY);
    res
      .cookie("accesstoken", accesstoken, { httpOnly: true })
      .status(200)
      .json(rest);
  }
});

const Updatehandler = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    res.status(403);
    throw new Error("You can't Change other users credentials");
  }
  let { Username, Email, Photourl, Password } = req.body;
  if (Password) {
    Password = await bcrypt.hash(Password, 10);
  }
  let result = await User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        Username,
        Email,
        Photourl,
        Password,
      },
    },
    { new: true }
  );
  let { Password: hash, ...rest } = result._doc;
  res.status(200).json(rest);
});

const deleteHandler = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    res.status(403);
    throw new Error("You can't delete other account");
  }
  let result = await User.findOneAndDelete({ _id: req.params.id });
  let { Password, ...rest } = result._doc;
  res.clearCookie("accesstoken");
  res.status(200).json(rest);
});
const signouthandler = asyncHandler(async (req, res) => {

    res.clearCookie("accesstoken");
    res.status(200).json({message: "Signed out successfully"});
});
module.exports = {
  registerHandler,
  googlehandler,
  Updatehandler,
  signouthandler,
  deleteHandler,
};
