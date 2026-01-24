// src/components/ApiLoader.jsx
import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function ApiLoader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);

    window.addEventListener("api:loading:start", start);
    window.addEventListener("api:loading:end", end);

    return () => {
      window.removeEventListener("api:loading:start", start);
      window.removeEventListener("api:loading:end", end);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="api-loader-overlay">
      <Loader message="Updating data..." />
    </div>
  );
}

 