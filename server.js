const server = require("https").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;

io.on("connection", (socket) => {

  // Join a game
  const { gameCode } = socket.handshake.query;
  socket.join(gameCode);

  // Leave a game
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
    socket.leave(gameCode);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
