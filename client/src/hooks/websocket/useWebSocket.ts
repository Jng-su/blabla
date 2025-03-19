import { useState, useEffect } from "react";
import socket from "../../api/websocket";

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("message", (msg) => setMessages((prev) => [...prev, msg]));

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  interface WebSocketMessage {
    (msg: string): void;
  }

  const sendMessage: WebSocketMessage = (msg: string) =>
    socket.emit("message", msg);

  return { isConnected, messages, sendMessage };
};
