import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { connectDB } from "./src/config/db.js"; 
import ticketsRouter from "./src/routes/maintenanceTickets.js"; // maintenance routes

// Load environment variables
dotenv.config();

// Fix __dirname in ES modules
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// Create Express app
const app = express();
const PORT = process.env.BACKEND_PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(_dirname, "../uploads"))); // serve static uploads

// Connect to MongoDB
connectDB(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Mount routes
app.use("/api/maintenance-tickets", ticketsRouter);

// Base test route
app.get("/", (req, res) => {
  res.send("Campus Connect API is running...");
});

// Create HTTP server
const server = createServer(app);

// Socket.IO setup
const io = new SocketIOServer(server, {
  cors: {
    origin: [process.env.FRONTEND_ORIGIN || "http://localhost:4200"], // Angular dev
    methods: ["GET", "POST"],
  },
});

// Real-time chat events
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    // data = { room, author, message, time }
    io.to(data.room).emit("receive_message", data);
    console.log(`${data.author} @ ${data.room}: ${data.message}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
