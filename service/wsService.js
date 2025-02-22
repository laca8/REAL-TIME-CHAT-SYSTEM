const db = require("../config/db");
const AppError = require("../utils/apiError");
//add user to db
const addUserToDb = async (data, clients) => {
  const { username } = data;
  //send message to all clients that user is online
  clients.forEach((client) => {
    client.ws.send(JSON.stringify({ type: "online", username }));
  });

  //create user if username exists ignore it
  db.run(
    "INSERT OR IGNORE INTO users (username) VALUES (?)",
    [username],
    (err) => {
      if (err) {
        console.error("Error inserting user:", err.message);
        clients.forEach((client) => {
          if (client.username === username) {
            client.ws.send(
              JSON.stringify({ type: "error", error: err.message })
            );
          }
        });
        return;
      } else {
        console.log("User inserted successfully.");
      }
    }
  );
};
//send private message
const sendPrivateMessage = async (data, clients) => {
  const { sender, to, message } = data;
  //add message to db
  db.run(
    "INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)",
    [sender, to, message],
    (error, rows) => {
      if (error) {
        console.log(error);
        clients.forEach((client) => {
          if (client.username === sender) {
            client.ws.send(
              JSON.stringify({ type: "error", error: err.message })
            );
          }
        });
        return;
      }
      console.log("Message sent successfully");
    }
  );
  //search for reciever online or offline
  const receiver = clients.find((client) => client.username === to);
  const senderExist = clients.find((client) => client.username === sender);
  if (senderExist) {
    //send message to sender
    senderExist.ws.send(
      JSON.stringify({ type: "private", from: sender, message })
    );
  }

  if (receiver) {
    console.log(receiver.username);
    //if user connect send message
    receiver.ws.send(
      JSON.stringify({ type: "private", from: sender, message })
    );
  }
};

//create group
const createGroupAndAddToDb = async (data) => {
  const { createGroup } = data;
  db.get(
    "SELECT * FROM groups WHERE group_name = ? ",
    [createGroup],
    (error, existGroup) => {
      if (error) {
        console.log(error);
      }
      if (existGroup) {
        console.log("Group already exist");
        return new AppError("Group already exist", 400);
      }
      if (!existGroup) {
        db.run(
          "INSERT  OR IGNORE INTO groups (group_name) VALUES (?)",
          [createGroup],
          (error, rows) => {
            if (error) {
              console.log(error);
            }
            console.log("Group created successfully");
          }
        );
      }
    }
  );
  //create group if group_name exists ignore it
};

//join group
const joinGroup = async (data, clients) => {
  const { username, joinGroup } = data;
  //check if user already exist in group
  // if not add user to group
  db.get(
    "SELECT * FROM group_members WHERE group_name = ? AND username = ?",
    [joinGroup, username],
    (error, existMember) => {
      if (error) {
        console.log(error);
        clients.forEach((client) => {
          if (client.username === username) {
            client.ws.send(
              JSON.stringify({ type: "error", error: err.message })
            );
          }
        });
        return;
      }
      if (existMember) {
        console.log("User already in group");
        clients.forEach((client) => {
          if (client.username === username) {
            client.ws.send(
              JSON.stringify({
                type: "error",
                error: "user already exist in group",
              })
            );
          }
        });
        return;
      } else {
        db.run(
          "INSERT INTO group_members (group_name,username) VALUES (?,?) ",
          [joinGroup, username],
          (error, rows) => {
            if (error) {
              console.log(error);
            }
            console.log("User joined group successfully");
          }
        );
      }
    }
  );
};
//send message to group
const sendMessageToGroup = async (data, clients) => {
  const { sender, toGroup, message } = data;
  //add message to db
  db.run(
    "INSERT INTO messages (sender,group_name,message) VALUES (?,?,?)",
    [sender, toGroup, message],
    (error, rows) => {
      if (error) {
        console.log(error);
        clients.forEach((client) => {
          if (client.username === sender) {
            client.ws.send(
              JSON.stringify({ type: "error", error: err.message })
            );
          }
        });
      }
      console.log("Message sent to group successfully");
    }
  );
  //get all members of group
  db.all(
    "SELECT username FROM group_members WHERE group_name = ?",
    [toGroup],
    (error, members) => {
      if (error) {
        console.log(error);
      } else {
        members.forEach((member) => {
          //check  if user in group and online
          const receiver = clients.find(
            (client) => client.username === member.username
          );
          if (receiver) {
            //if user exist in group send message
            console.log(receiver.username);
            receiver.ws.send(
              JSON.stringify({ type: "group", from: sender, message })
            );
          }
        });
      }
    }
  );
};
module.exports = {
  addUserToDb,
  sendPrivateMessage,
  createGroupAndAddToDb,
  joinGroup,
  sendMessageToGroup,
};
