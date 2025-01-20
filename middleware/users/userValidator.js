const { check, validationResult } = require("express-validator");
const User = require("../../models/People");
const createError = require("http-errors");
const { unlink } = require("fs");
const path = require("path");

const addUserValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must contain anything other then alphabet")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email is already in use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("bn-BD", { strickMode: true })
    .withMessage("Mobile number must be a valid Bangladeshi mobile number!")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value });
        if (user) {
          throw createError("Mobile number already in use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must me at least 8 character & contain al least 1 uppercase 1 lowercase 1 number & 1 symbol"
    ),
];

const addUserValidatorsHandler = function (req, res, next) {
  const error = validationResult(req);
  const mappedError = error.mapped();
  if (Object.keys(mappedError).length === 0) {
    next();
  } else {
    // remove uploaded file
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(path.join(__dirname, `../public/avatar/${filename}`), (err) => {
        if (err) console.log(err.message);
      });
    }
    res.status(500).json({ errors: mappedError });
  }
};

module.exports = {
  addUserValidators,
  addUserValidatorsHandler,
};
