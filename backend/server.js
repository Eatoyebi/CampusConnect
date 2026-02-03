import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { connectDB } from "./src/config/db.js";
import ticketsRouter from "./src/routes/maintenanceTicketRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();
const PORT = process.env.BACKEND_PORT || 5050;

app.use(cors());
app.use(express.json());

// serve static uploads from backend/uploads
app.use("/uploads", express.static(path.join(_dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/maintenance-tickets", ticketsRouter);

connectDB(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Campus Connect API is running...");
});

const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: [process.env.FRONTEND_ORIGIN || "http://localhost:4200"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});