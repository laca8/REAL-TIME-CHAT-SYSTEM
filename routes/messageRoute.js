const express = require("express");
const router = express.Router();
const {
  fetchPrivateMessages,
  fetchGroupMessages,
} = require("../controllers/messagesController");
router.get("/private/:username", fetchPrivateMessages);
router.get("/group/:groupName", fetchGroupMessages);
module.exports = router;
