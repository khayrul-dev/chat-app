const express = require("express");
const {
  getUsers,
  addUser,
  removeUser,
} = require("../controller/usersController");
const decorateHtmlResponse = require("../middleware/common/decorateHtmlResponse");
const {
  addUserValidators,
  addUserValidatorsHandler,
} = require("../middleware/users/userValidator");
const avatarUpload = require("../middleware/users/avatarUpload");
const { checkLogin } = require("../middleware/common/checkLogin");

const router = express();

router.get("/", decorateHtmlResponse("users"), checkLogin, getUsers);
router.post(
  "/",
  checkLogin,
  avatarUpload,
  addUserValidators,
  addUserValidatorsHandler,
  addUser
);

router.delete("/:id", removeUser);

module.exports = router;
