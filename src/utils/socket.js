const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const connectionRequest = require("../models/connectionRequest");

const getRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //handle events
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const room = getRoomId(userId, targetUserId);
      socket.join(room);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, text, userId, targetUserId }) => {
        try {
          const roomId = getRoomId(userId, targetUserId);

          const isFriends = await connectionRequest.findOne({
            $or: [
              {
                fromUserId: userId,
                toUserId: targetUserId,
                status: "accepted",
              },
              {
                toUserId: targetUserId,
                fromUserId: userId,
                status: "accepted",
              },
            ],
          });
          if (!isFriends) {
            return;
          }

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            text,
          });
          await chat.save();

          io.to(roomId).emit("receivedMessage", { firstName, lastName, text });
        } catch (err) {
          console.error("Error saving message:", err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = { initializeSocket };
