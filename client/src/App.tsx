import { usePing } from "./hooks/ping/usePing";

export default function App() {
  const { response, error } = usePing();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-2xl">{response}</p>
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
}
