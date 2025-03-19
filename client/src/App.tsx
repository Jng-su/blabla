import { useWebSocket } from "./hooks/websocket/useWebSocket";

export default function App() {
  const { isConnected, messages, sendMessage } = useWebSocket();

  return (
    <div>
      <h1>WebSocket Test</h1>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
      <button onClick={() => sendMessage("Hello!")}>Send</button>
    </div>
  );
}
