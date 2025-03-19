import { io } from "socket.io-client";

const WS_URL =
  import.meta.env.VITE_APP_ENV === "production"
    ? import.meta.env.VITE_WS_URL
    : "http://localhost:8001";

const socket = io(WS_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
});

socket.on("connect", () => {
  console.log(`✅ Connected to WebSocket server at ${WS_URL}`);
});

socket.on("connect_error", (err) => {
  console.error("❌ WebSocket connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from WebSocket server");
});

export default socket;
