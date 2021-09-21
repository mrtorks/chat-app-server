const express = require("express");
const cors = require("micro-cors");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");
const PORT = process.env.PORT || 5000;
const router = require("./router");

const envCheck =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://main.dijl7megnf8zd.amplifyapp.com/";

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: envCheck,
    methods: ["GET", "POST"],
  },
});

app.use(cors(router));

io.on("connection", (socket) => {
  console.log("We have a new connection!!!");

  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    const users = getUsersInRoom(user.usersRoom);
    console.log(users);
    if (error) return callback(error);
    socket.emit("message", {
      user: "admin",
      text: `${user.userName}, welcome to the room`,
    });
    socket.broadcast.to(user.usersRoom).emit("message", {
      user: "admin",
      text: `${user.userName}, has joined!`,
    });
    socket.join(user.usersRoom);
    io.to(user.usersRoom).emit("roomData", {
      room: user.usersRoom,
      users: getUsersInRoom(user.usersRoom),
    });
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.usersRoom).emit("message", {
      user: user.userName,
      text: message,
    });
    callback();
  });
  socket.on("disconnect", () => {
    console.log("User has left!!!");
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.userName} has left.`,
      });
      io.to(user.usersRoom).emit("roomData", {
        room: user.usersRoom,
        users: getUsersInRoom(user.usersRoom),
      });
    }
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
