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

let socketPlayerMapping = new Map();

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("createGame", (gameCode) => {
    console.log("createGame: " + gameCode);
    socket.join(gameCode);
    socket.emit("createGameResponse", {
      response: "player joined",
      playerId: 0,
    });
    socketPlayerMapping.set(socket.id, "white");
    console.log(`createGame: `, io.of("/").adapter.rooms.get(gameCode));
  });

  socket.on("joinGame", (gameCode) => {
    console.log("joinGame: " + gameCode);
    const room = io.of("/").adapter.rooms.get(gameCode);
    if (room && room.size === 1) {
      socket.join(gameCode);
      socketPlayerMapping.set(socket.id, "black");
      socket.emit("joinGameResponse", {
        response: "player joined",
        playerId: 1,
      });
      console.log(socketPlayerMapping);
      io.of("/").to(gameCode).emit("start-game", gameCode);
      console.log(`joinGame: `, io.of("/").adapter.rooms.get(gameCode));
    } else if (!room) {
      socket.emit("joinGameResponse", {
        response: `Room ${gameCode} doesn't exist. Please check the code`,
        playerId: -1,
      });
      console.log(`Room ${gameCode} doesn't exist. Please check the code`);
    } else {
      socket.emit("joinGameResponse", {
        response: `Room ${gameCode} is full. Try another room`,
        playerId: -1,
      });
      console.log(`Room ${gameCode} is full. Try another room`);
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

  socket.on("castle", (data) => {
    data = { ...data, socket: socket.id };
    io.of("/").to(data.gameCode).emit("performCastling", data);
  });

  socket.on("promote", (data) => {
    data = { ...data, socket: socket.id };
    io.of("/").to(data.gameCode).emit("performPromotion", data);
  })

  socket.on("setCheck", (data) => {
    data = { ...data, socket: socket.id };
    io.of("/").to(data.gameCode).emit("markCheck", data);
  });

  socket.on("unsetCheck", (data) => {
    data = { ...data, socket: socket.id };
    io.of("/").to(data.gameCode).emit("unmarkCheck", data);
  });

  socket.on("checkmate", (data) => {
    data = { ...data, socket: socket.id };
    io.of("/").to(data.gameCode).emit("gameComplete", data);
  });

  socket.on("getColor", (data) => {
    data = { ...data, color: socketPlayerMapping.get(data.id)};
    io.of("/").to(data.gameCode).emit("setPlayerColor", data);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    socketPlayerMapping.delete(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
