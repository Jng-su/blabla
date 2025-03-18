import { useState, useEffect } from "react";
import { pingApi } from "../../api/ping";

export const usePing = () => {
  const [response, setResponse] = useState<string>("Loading...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    pingApi
      .getPing()
      .then((data) => setResponse(data))
      .catch((err) => {
        console.error("Ping error:", err);
        setError(err.message);
        setResponse("Error");
      });
  }, []);

  return { response, error };
};
