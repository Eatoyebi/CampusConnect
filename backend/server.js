import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5050;

app.use(cors());
app.use(express.json());

// Base test route
app.get("/", (req, res) => {
  res.send("Campus Connect API is running...");
});

//(Commenting out for now)app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Create HTTP server + Socket.IO
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      process.env.FRONTEND_ORIGIN || "http://localhost:4200", // Angular dev
    ],
    methods: ["GET", "POST"]
  }
});

//Real-time chat events
io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(" ${socket.id} joined ${room}");
  });

  socket.on("send_message", (data) => {
    // data: { room, author, message, time }
    io.to(data.room).emit("receive_message", data);
    console.log(" ${data.author} @ ${data.room}: ${data.message}");
  });

  socket.on("disconnect", () => {
    console.log(" disconnected: ${socket.id}");
  });
});

//Start combined HTTP + WS Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
