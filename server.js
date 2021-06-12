const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const Firebase = require("firebase/app");
require("firebase/database");

Firebase.initializeApp({
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
});

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

  socket.on("createGame", (data) => {
    console.log("createGame: " + data.gameCode);
    socket.join(data.gameCode);
    socket.emit("createGameResponse", {
      response: "player joined",
      playerId: 0,
      meta: data,
    });
    socketPlayerMapping.set(socket.id, {
      color: "white",
      position: data.position,
      name: data.name,
    });
    console.log(`createGame: `, io.of("/").adapter.rooms.get(data.gameCode));
  });

  socket.on("joinGame", (data) => {
    console.log("joinGame: " + data.gameCode);
    const room = io.of("/").adapter.rooms.get(data.gameCode);
    if (room && room.size === 1) {
      socket.join(data.gameCode);
      socketPlayerMapping.set(socket.id, {
        color: "black",
        position: data.position,
        name: data.name,
      });
      socket.emit("joinGameResponse", {
        response: "player joined",
        playerId: 1,
      });
      console.log(socketPlayerMapping);
      io.of("/").to(data.gameCode).emit("start-game", data.gameCode);
      console.log(`joinGame: `, io.of("/").adapter.rooms.get(data.gameCode));
    } else if (!room) {
      socket.emit("joinGameResponse", {
        response: `Room ${data.gameCode} doesn't exist. Please check the code`,
        playerId: -1,
      });
      console.log(`Room ${data.gameCode} doesn't exist. Please check the code`);
    } else {
      socket.emit("joinGameResponse", {
        response: `Room ${data.gameCode} is full. Try another room`,
        playerId: -1,
      });
      console.log(`Room ${data.gameCode} is full. Try another room`);
    }
  });

  socket.on("setPlayerName", (data) => {
    data = { ...data, socket: socket.id };
    io.of("/").to(data.gameCode).emit("set-player-name", data);
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
  });

  socket.on("setCheck", (data) => {
    data = { ...data, socket: socket.id };
    io.of("/").to(data.gameCode).emit("markCheck", data);
  });

  socket.on("unsetCheck", (data) => {
    data = { ...data, socket: socket.id };
    io.of("/").to(data.gameCode).emit("unmarkCheck", data);
  });

  socket.on("game-complete", (data) => {
    data = { ...data, socket: socket.id };
    io.of("/").to(data.gameCode).emit("gameComplete", data);
    const gameData = {
      moves: data.gameMoves,
      result: data.result,
    };
    const date = new Date();
    const [dd, mm, yyyy] = [date.getDate(), date.getMonth() + 1, date.getFullYear()];
    const [hh, MM, ss] = [date.getHours(), date.getMinutes(), date.getSeconds()];
    let date_key = "";
    date_key += `${dd < 10 ? `0${dd}`: dd}-${mm < 10 ? `0${mm}`: mm}-${yyyy} `;
    date_key += `${hh < 10 ? `0${hh}`: hh}:${MM < 10 ? `0${MM}`: MM}:${ss < 10 ? `0${ss}`: ss}`;
    const key = `/${date_key}-${data.gameCode}`;
    console.log(key, gameData);
    Firebase.database().ref(key).set(gameData);
  });

  socket.on("propose-draw", (data) => {
    data = { ...data, socket: socket.id };
    io.of("/").to(data.gameCode).emit("proposeDraw", data);
  });

  socket.on("getColor", (data) => {
    const meta = socketPlayerMapping.get(data.id);
    data = { ...data, color: meta.color, name: meta.name, position: meta.position };
    console.log(data);
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
