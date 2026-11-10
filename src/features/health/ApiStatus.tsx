import { useEffect, useState } from "react";
import { checkApiHealth } from "../../services/api/health";

export default function ApiStatus() {
  const [status, setStatus] = useState<
    "checking" | "connected" | "unavailable"
  >("checking");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    checkApiHealth(controller.signal)
      .then(() => {
        if (active) setStatus("connected");
      })
      .catch(() => {
        if (active) setStatus("unavailable");
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [attempt]);
  return (
    <div className={`api-status ${status}`}>
      <span role="status">
        {status === "checking"
          ? "Connecting to FloraConnect…"
          : status === "connected"
            ? "FloraConnect API connected"
            : "Connection temporarily unavailable"}
      </span>
      {status === "unavailable" && (
        <button
          type="button"
          onClick={() => {
            setStatus("checking");
            setAttempt((value) => value + 1);
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
