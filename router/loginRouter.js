const express = require("express");
const { getLogin, login, logout } = require("../controller/loginController");
const decorateHtmlResponse = require("../middleware/common/decorateHtmlResponse");
const {
  doLoginValidators,
  doLoginValidatorsHandler,
} = require("../middleware/login/loginValidators");
const { redirectLoggedIn } = require("../middleware/common/checkLogin");

const router = express();

const page_title = "Login";

router.get("/", decorateHtmlResponse(page_title), redirectLoggedIn, getLogin);

router.post(
  "/",
  decorateHtmlResponse(page_title),
  doLoginValidators,
  doLoginValidatorsHandler,
  login
);

router.delete("/", logout);

module.exports = router;
