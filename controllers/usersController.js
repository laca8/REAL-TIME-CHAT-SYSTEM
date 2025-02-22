const db = require("../config/db");
const AppError = require("../utils/apiError");

const fetchUsers = async (req, res, next) => {
  try {
    db.all("SELECT * FROM users", (error, rows) => {
      if (error) {
        console.log(error);
        next(new AppError(error.message, 400));
      }
      return res.status(200).json({ users: rows });
    });
  } catch (error) {
    console.log(error);
    next(new AppError(error.message, 500));
  }
};
module.exports = { fetchUsers };
