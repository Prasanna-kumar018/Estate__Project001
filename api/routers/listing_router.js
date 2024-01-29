const express = require('express');
const {
  createhandler,
  getAlllisting,
  deleteuserlisting,
  updateuserlisting,
  getuserlisting,
    getuser,
  getusers
} = require("../Controllers/listing_controllers");
const Router = express.Router();
const validtoken = require('../middleware/validtoken');
Router.get('/listings/get/:id',getuserlisting);
Router.post("/create",validtoken,createhandler);
Router.get("/listings/:id",validtoken,getAlllisting);
Router.delete("/listings/delete/:id",validtoken,deleteuserlisting);
Router.put("/listings/update/:id",validtoken,updateuserlisting);
Router.get("/get/:id",validtoken,getuser);
Router.get("/get",validtoken,getusers);


module.exports = Router;