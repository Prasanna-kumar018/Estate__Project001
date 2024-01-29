const express = require('express');
const router = express.Router();
const {
  registerHandler,
  googlehandler,
  Updatehandler,
  deleteHandler,
  signouthandler
} = require("../Controllers/SignUp_Controllers");
const loginhandler = require("../Controllers/login_controllers");
const validtoken  = require('../middleware/validtoken');
router.route('/register').post(registerHandler);
router.route('/login').post(loginhandler);
router.route("/google").post(googlehandler);
router.put("/update/:id", validtoken, Updatehandler);
router.delete('/delete/:id', validtoken, deleteHandler);
router.get('/signout', signouthandler);
module.exports = router;