const mongoose = require("mongoose");

const Users = mongoose.Schema(
  {
    Username: {
      type: String,
      required: [true, "Please add the Username"],
      unique: true,
    },
    Email: {
      type: String,
      required: [true, "Please add the Email"],
      unique: true,
    },
    Password: {
      type: String,
      required: [true, "Please add the Password"],
    },
    Photourl: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Users", Users);
