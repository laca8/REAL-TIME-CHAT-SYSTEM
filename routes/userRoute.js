const express = require("express");
const router = express.Router();
const { fetchUsers } = require("../controllers/usersController");
router.get("/", fetchUsers);
module.exports = router;
