import { io } from "socket.io-client";
import Cookies from "js-cookie";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8001";
const accessToken = Cookies.get("access_token");

const socket = io(WS_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  auth: { token: accessToken },
});

socket.on("connect", () => {
  console.log(`Connected with token: ${accessToken?.substring(0, 10)}...`);
});

socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});

export default socket;
