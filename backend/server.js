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

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
    console.log(`${data.author} @ ${data.room}: ${data.message}`);
  });

  socket.on("disconnect", () => {
    console.log(`disconnected: ${socket.id}`);
  });
});

// Start Server (HTTP + WebSocket)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
