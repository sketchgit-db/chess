const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.static(__dirname + "/build"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("createGame", (gameCode) => {
    console.log("createGame: " + gameCode);
    socket.join(gameCode);
    socket.emit("createGameResponse", {
      response: "player joined",
      playerId: 0,
    });
    console.log(`createGame: `, io.of("/").adapter.rooms.get(gameCode));
  });

  socket.on("joinGame", (gameCode) => {
    console.log("joinGame: " + gameCode);
    const room = io.of("/").adapter.rooms.get(gameCode);
    if (room && room.size === 1) {
      socket.join(gameCode);
      socket.to(gameCode).emit("player 2 joined");
      socket.emit("joinGameResponse", {
        response: "player joined",
        playerId: 1,
      });
      io.of("/").to(gameCode).emit("start-game", gameCode);
      console.log(`joinGame: `, io.of("/").adapter.rooms.get(gameCode));
    } else if (!room) {
      socket.emit("joinGameResponse", {
        response: `err: Room ${gameCode} doesn't exist. Try another room`,
        playerId: -1,
      });
      console.log(`err: Room ${gameCode} doesn't exist. Try another room`);
    } else {
      socket.emit("joinGameResponse", {
        response: `err: Room ${gameCode} is full. Try another room`,
        playerId: -1,
      });
      console.log(`err: Room ${gameCode} is full. Try another room`);
    }
  });

  socket.on("perform-move", (data) => {
    data = { ...data, socket: socket.id };
    io.of("/").to(data.gameCode).emit("nextTurn", data);
  });

  socket.on("getMoveRepresentation", (data) => {
    data = { ...data, socket: socket.id };
    io.of("/").to(data.gameCode).emit("updateMoveTable", data);
  });

  socket.on("checkmate", (data) => {
    data = { ...data, socket: socket.id };
    io.of("/").to(data.gameCode).emit("gameComplete", data);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
