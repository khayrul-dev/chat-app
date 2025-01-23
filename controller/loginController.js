const User = require("../models/People");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

function getLogin(req, res) {
  res.render("index");
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });

    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (isValidPassword) {
        // create loggedIn user object
        const userObject = {
          username: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        };

        // create jwt token
        const jwtToken = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.TOKEN_EXPIRY,
        });

        // set cookie
        res.cookie(process.env.COOKIE_NAME, jwtToken, {
          maxAge: process.env.TOKEN_EXPIRY,
          httpOnly: true,
          signed: true,
        });

        res.locals.loggedInUser = userObject;

        res.render("inbox");
      } else {
        throw createError("Login failed! Please try again.");
      }
    } else {
      throw createError("Login failed! Please try again.");
    }
  } catch (err) {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("Logged out");
}

module.exports = {
  getLogin,
  login,
  logout,
};
