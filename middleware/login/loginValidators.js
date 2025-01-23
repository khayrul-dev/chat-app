const { check, validationResult } = require("express-validator");

const doLoginValidators = [
  check("username")
    .isLength({ min: 1 })
    .withMessage("Mobile or email is required!"),
  check("password").isLength({ min: 1 }).withMessage("Password is required!"),
];

const doLoginValidatorsHandler = function (req, res, next) {
  const error = validationResult(req);
  const mappedError = error.mapped();
  if (Object.keys(mappedError).length === 0) {
    next();
  } else {
    res.render("index", {
      data: {
        username: req.username,
      },
      errors: mappedError,
    });
  }
};

module.exports = {
  doLoginValidators,
  doLoginValidatorsHandler,
};
