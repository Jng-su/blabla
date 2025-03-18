import { usePing } from "./hooks/ping/usePing";

export default function App() {
  const { response, error } = usePing();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Welcome to Blabla 👋
      </h1>
      <p className="text-lg text-gray-700">API Response: {response}</p>
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
}
