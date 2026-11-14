import { apiEndpoints } from "../../config/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError, type AuthUser } from "../../services/api/auth";
import { clearLoginSession, getLoginSession } from "./login-session";

export function useSession() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(getLoginSession);
  const [loading, setLoading] = useState(() => !getLoginSession());
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    api<{ user: AuthUser }>(apiEndpoints.auth.me, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          if (
            !data?.user ||
            typeof data.user.name !== "string" ||
            typeof data.user.role !== "string"
          )
            throw new Error(
              "The account session could not be read. Please sign in again.",
            );
          setUser(data.user);
          setError("");
        }
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        if (e instanceof ApiError && [401, 403].includes(e.status)) {
          clearLoginSession();
          setUser(null);
        }
        if (e instanceof ApiError && e.status === 401)
          navigate("/login", { replace: true });
        else setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [navigate, revision]);
  return {
    user,
    loading,
    error,
    retry: () => {
      clearLoginSession();
      setLoading(true);
      setRevision((v) => v + 1);
    },
  };
}
