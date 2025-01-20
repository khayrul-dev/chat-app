const bcrypt = require("bcrypt");
const User = require("../models/People");
const path = require("path");
const { unlink } = require("fs");

async function getUsers(req, res, next) {
  try {
    const users = await User.find();
    res.render("users", { users: users });
  } catch (error) {
    next(err);
  }
}

async function addUser(req, res) {
  try {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    if (req.files && req.files.length > 0) {
      newUser = new User({
        ...req.body,
        avatar: req.files[0].filename,
        password: hashedPassword,
      });
    } else {
      newUser = new User({
        ...req.body,
        password: hashedPassword,
      });
    }
    // save user or send error
    await newUser.save();
    res.status(200).json({
      message: "User was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occurred!",
        },
      },
    });
  }
}

async function removeUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.id });
    // remove avatar
    if (user.avatar) {
      unlink(
        path.join(__dirname, `../public/uploads/avatar${user.avatar}`),
        (err) => {
          if (err) console.log(err.message);
        }
      );
    }
    res.status(200).json({
      message: "user was deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user!",
        },
      },
    });
  }
}

module.exports = {
  getUsers,
  addUser,
  removeUser,
};
