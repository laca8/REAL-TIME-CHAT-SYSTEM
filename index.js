const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const WebSocket = require("ws");
const db = require("./config/db");
const globalError = require("./middlewares/errorhandler");
const AppError = require("./utils/apiError");
const {
  addUserToDb,
  sendPrivateMessage,
  createGroupAndAddToDb,
  joinGroup,
  sendMessageToGroup,
} = require("./service/wsService");
const app = express();
const server = http.createServer(app);
//create webSocket server
const wss = new WebSocket.Server({ server });
dotenv.config();
app.use(express.json());
//online users
let clients = [];
app.use("/api/messages", require("./routes/messageRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/groups", require("./routes/groupRoute"));
app.use("*", (req, res, next) => {
  next(new AppError("this route not found", 404));
});
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    //add user to online list
    clients.push({ username: data.username, ws });
    if (data.type == "connect") {
      console.log(`${data.username} connected....`);
      addUserToDb(data, clients);
    }
    //send private message
    if (data.to) {
      console.log(data);
      sendPrivateMessage(data, clients);
    }
    //create group
    if (data.createGroup) {
      console.log(data);
      createGroupAndAddToDb(data);
    }
    if (data.joinGroup) {
      console.log(data);
      joinGroup(data, clients);
    }
    if (data.toGroup) {
      console.log(data);
      sendMessageToGroup(data, clients);
    }
  });

  ws.on("close", () => {
    console.log(`${ws} disconnected...`);
    const userDisconnect = clients.find((client) => client.ws === ws);
    clients = clients.filter((client) => client.ws !== ws);
    clients.forEach((client) => {
      client.ws.send(
        JSON.stringify({ type: "offline", username: userDisconnect.username })
      );
    });
  });
  ws.on("error", (err) => {
    console.error("WebSocket error:", err.message);
    ws.send(
      JSON.stringify({
        error: "An error occurred with the WebSocket connection",
      })
    );
  });
});
app.use(globalError);
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
