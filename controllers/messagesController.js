const db = require("../config/db");
const AppError = require("../utils/apiError");

const fetchPrivateMessages = async (req, res, next) => {
  try {
    const username = req.params.username;
    console.log(username);

    db.all(
      "SELECT * FROM messages WHERE (sender = ? OR receiver = ?) AND receiver IS NOT NULL  ORDER BY timestamp DESC LIMIT 20",
      [username, username],
      (error, rows) => {
        if (error) {
          // console.log(error);
          next(new AppError(error.message, 400));
        }
        if (rows.length != 0) {
          db.run(
            "UPDATE messages SET is_read = 1 WHERE receiver = ? AND is_read = 0",
            [username],
            (error) => {
              if (error) {
                // console.log(error);
                next(new AppError(error.message, 400));
              }
            }
          );
        }
        return res.status(200).json({ messages: rows });
      }
    );
  } catch (error) {
    console.log(error);
    next(new AppError(error.message, 500));
  }
};
const fetchGroupMessages = async (req, res, next) => {
  try {
    const groupName = req.params.groupName;
    db.all(
      "SELECT * FROM messages WHERE group_name = ? ORDER BY timestamp DESC LIMIT 20",
      [groupName],
      (error, rows) => {
        if (error) {
          console.log(error);
          next(new AppError(error.message, 400));
        }
        if (rows.length != 0) {
          db.run(
            "UPDATE messages SET is_read = 1 WHERE group_name = ? AND is_read = 0",
            [groupName],
            (error) => {
              if (error) {
                console.log(error);
              }
            }
          );
        }
        return res.status(200).json({ messages: rows });
      }
    );
  } catch (error) {
    console.log(error);
    next(new AppError(error.message, 500));
  }
};
module.exports = { fetchPrivateMessages, fetchGroupMessages };
