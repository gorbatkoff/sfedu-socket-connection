const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:3000" });

let onlineUsers = [];

io.on("connection", (socket) => {
  // Обработчик добавления нового пользователя
  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({ userId: userId, socketId: socket.id });
    }
    io.emit("getOnlineUsers", onlineUsers);
  });

  // Обработчик сообщений
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId,
    );

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  socket.on("disconnect", (socket) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(8000);
