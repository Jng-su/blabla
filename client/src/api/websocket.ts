import { io } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL || "/ws"; // prod 환경에선 VITE_WS_URL 사용

const socket = io(WS_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
});

export default socket;
