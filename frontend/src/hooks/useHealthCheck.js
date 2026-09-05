import { useEffect, useState } from "react";
import api from "../services/api";

/**
 * Pings the FastAPI /health endpoint on mount.
 * Confirms the frontend -> backend wiring works end-to-end.
 */
export function useHealthCheck() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/health")
      .then((res) => {
        if (!cancelled) setStatus(res.data.status);
      })
      .catch(() => {
        if (!cancelled) setStatus("unreachable");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
