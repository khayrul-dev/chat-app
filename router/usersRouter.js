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

const router = express();

router.get("/", decorateHtmlResponse("users"), getUsers);
router.post(
  "/",
  avatarUpload,
  addUserValidators,
  addUserValidatorsHandler,
  addUser
);

router.delete("/:id", removeUser);

module.exports = router;
