import { useState, useEffect } from "react";
import socket from "../../api/websocket";

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`✅ Connected to WebSocket server`);
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      console.log("🔌 Disconnected from WebSocket server");
      setIsConnected(false);
    });
    socket.on("message", (msg: string) => {
      console.log("📬 Received:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  const sendMessage = (msg: string) => {
    console.log("📤 Sending:", msg);
    if (msg === "Hello") {
      socket.emit("message", msg); // 개별 메시지
    } else {
      socket.emit("broadcast", msg); // 브로드캐스트
    }
  };

  return { isConnected, messages, sendMessage };
};
