import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5050;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

import userRoutes from "./routes/userRoutes.js";
app.use("/api/users", userRoutes);

import chatRoutes from "./routes/chatRoutes.js";
app.use("/api/chat", chatRoutes);

import ChatMessage from "./models/ChatMessage.js";

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Base API Test Route
app.get("/", (req, res) => {
  res.send("Campus Connect API is running...");
});

// Create HTTP server + Socket.IO
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      process.env.FRONTEND_ORIGIN || "http://localhost:4200",
    ],
    methods: ["GET", "POST"]
  }
});

// Real-time chat events
io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`);

  // UPDATED: join_room now also returns message history to that client
  socket.on("join_room", async (room) => {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);

    try {
      const history = await ChatMessage.find({ room })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      // Send history only to the user who joined, in chronological order
      socket.emit("chat_history", history.reverse());
    } catch (err) {
      console.error("Error loading chat history:", err);
      socket.emit("chat_error", { message: "Failed to load chat history." });
    }
  });

  // UPDATED: save message to MongoDB before broadcasting
  socket.on("send_message", async (data) => {
    try {
      const room = data?.room;
      const author = data?.author;
      const message = data?.message;

      if (!room || !author || !message || !message.trim()) return;

      const saved = await ChatMessage.create({
        room,
        author,
        message: message.trim(),
        authorId: data.authorId,
      });

      io.to(room).emit("receive_message", saved);
      console.log(`${author} @ ${room}: ${message}`);
    } catch (err) {
      console.error("Error saving chat message:", err);
      socket.emit("chat_error", { message: "Failed to send message." });
    }
  });

  socket.on("disconnect", () => {
    console.log(`disconnected: ${socket.id}`);
  });
});

// Start Server (HTTP + WebSocket)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


