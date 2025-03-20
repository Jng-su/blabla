import { useState } from "react";
import { useWebSocket } from "./hooks/websocket/useWebSocket";

export default function App() {
  const { isConnected, messages, sendMessage } = useWebSocket();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">WebSocket Test</h1>
      <p className="text-center mb-4">
        Status:{" "}
        <span className={isConnected ? "text-green-500" : "text-red-500"}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </p>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type 'Hello'"
          className="flex-1 p-2 border border-gray-300 rounded"
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
      <ul className="list-disc pl-5">
        {messages.map((msg, i) => (
          <li key={i} className="text-gray-700">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}
