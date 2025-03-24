import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8001";

const socket: Socket = io(WS_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  auth: { token: Cookies.get("access_token") },
});

socket.on("connect", () => {
  console.log("📩 WebSocket: Connected to server");
});

socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});

export default socket;
