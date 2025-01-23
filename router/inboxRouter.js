const express = require("express");
const { getInbox } = require("../controller/inboxController");
const decorateHtmlResponse = require("../middleware/common/decorateHtmlResponse");
const { checkLogin } = require("../middleware/common/checkLogin");

const router = express();

router.get("/", decorateHtmlResponse("inbox"), checkLogin, getInbox);

module.exports = router;
