const express = require("express");
const router = express.Router();
const { fetchGroups } = require("../controllers/groupsController");
router.get("/", fetchGroups);
module.exports = router;
