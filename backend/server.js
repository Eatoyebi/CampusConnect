import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";
import { connectDB } from "./src/config/db.js";
import ticketsRouter from "./src/routes/maintenanceTicketRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import ChatMessage from "./src/models/ChatMessage.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import mongoose from "mongoose";

dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app FIRST (before app.use)
const app = express();
const PORT = process.env.BACKEND_PORT || 5050;

// Middleware

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: [process.env.FRONTEND_ORIGIN || "http://localhost:4200"],
    credentials: true,
    methods: ["GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/maintenance-tickets", ticketsRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);

// Base test route
app.get("/", (req, res) => {
  res.send("Campus Connect API is running...");
});

// Connect DB ONCE
connectDB(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Create HTTP server + Socket.IO
const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: [process.env.FRONTEND_ORIGIN || "http://localhost:4200"],
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// Real-time chat events
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join_room", async (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);

    try {
      const history = await ChatMessage.find({ room })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      socket.emit("chat_history", history.reverse());
    } catch (err) {
      console.error("Error loading chat history:", err);
      socket.emit("chat_error", { message: "Failed to load chat history." });
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const room = data?.room;
      const author = data?.author;
      const message = data?.message;

      if (!room || !author || !message || !message.trim()) return;

      const saved = await ChatMessage.create({
        room,
        author,
        authorId: data?.authorId || "",
        message: message.trim(),
        time: data?.time || "",
      });

      io.to(room).emit("receive_message", saved);
    } catch (err) {
      console.error("Error saving chat message:", err);
      socket.emit("chat_error", { message: "Failed to send message." });
    }
  });

  socket.on("moderation_delete_message", async ({ messageId }) => {
  try {
    if (!messageId) return;

    const msg = await ChatMessage.findById(messageId);
    if (!msg) return;

    msg.isDeleted = true;
    msg.deletedAt = new Date();
    await msg.save();

    io.to(msg.room).emit("message_deleted", { messageId });
  } catch (err) {
    console.error("moderation_delete_message error:", err);
  }
});
  
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});