const path = require('path');
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require('cors');

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const PORT = 4000;

app.use(
  cors({
    origin: "*",
    credentials: true
  })
)
app.use(express.static(__dirname + '/build'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
});

let gameCode = "";

app.post('/', (req, res) => {
  console.log(req.body);
  if (req.body.type === "create") {
    gameCode = req.body.gameCode;
    res.status(200).json({"response": "ok game created"});
  } else if (req.body.type === "join") {
    if (req.body.gameCode === gameCode) {
      res.status(200).json({"response": "ok gameCode match"});
    } else {
      res.status(200).json({"response": "Sorry. Code Mismatch"});
    }
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
