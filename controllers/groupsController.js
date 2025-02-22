const db = require("../config/db");
const AppError = require("../utils/apiError");

const fetchGroups = async (req, res) => {
  try {
    db.all("SELECT * FROM groups", (error, rows) => {
      if (error) {
        console.log(error);
        next(new AppError(error.message, 400));
      } else {
        return res.status(200).json({ groups: rows });
      }
    });
  } catch (error) {
    console.log(error);
    next(new AppError(error.message, 500));
  }
};
module.exports = { fetchGroups };
