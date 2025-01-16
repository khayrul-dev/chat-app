const express = require("express");
const { getInbox } = require("../controller/inboxController");
const decorateHtmlResponse = require("../middleware/common/decorateHtmlResponse");

const router = express();

router.get("/", decorateHtmlResponse("inbox"), getInbox);

module.exports = router;
