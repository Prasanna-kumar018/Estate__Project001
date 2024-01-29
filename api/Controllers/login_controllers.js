const asyncHandler = require("express-async-handler");
const Users = require("../Schemas/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//POST           
const loginhandler = asyncHandler(async (req, res) => {
    let { Email, Password } = req.body;
  let data = await Users.findOne({ Email });
  if (!data) {
    res.status(400);
    throw new Error("User Not Found");
    }
    console.log(data);
  let verification = bcrypt.compareSync(Password, data.Password);
    if (!verification)
    {
        res.status(400);
        throw new Error("Invalid Credential");
    }
    let accesstoken = jwt.sign({ id: data._id }, process.env.SECRET_KEY);
    let { Password:hash, ...rest } = data._doc;
    res.cookie("accesstoken", accesstoken, { httpOnly: true });
    res.status(200).json(rest);
    
});

module.exports =  loginhandler;
