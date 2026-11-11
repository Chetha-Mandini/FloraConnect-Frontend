import { apiEndpoints } from "../../config/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError, type AuthUser } from "../../services/api/auth";

export function useSession() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    api<{ user: AuthUser }>(apiEndpoints.auth.me, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setUser(data.user);
          setError("");
        }
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
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
      setLoading(true);
      setRevision((v) => v + 1);
    },
  };
}
