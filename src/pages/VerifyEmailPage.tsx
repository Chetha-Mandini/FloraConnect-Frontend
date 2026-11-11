import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthLayout, {
  actionClass,
  AuthField,
} from "../components/auth/AuthLayout";
import { api } from "../services/api/auth";
export default function VerifyEmailPage() {
  const location = useLocation();
  const token = new URLSearchParams(location.hash.slice(1)).get("token");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  return (
    <AuthLayout
      title="Verify your email"
      description="Verify ownership of your email before your account becomes active."
    >
      {error && (
        <p
          role="alert"
          className="mb-4! rounded-lg bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="mb-4! rounded-lg bg-[#eaf2e8] p-3 text-sm text-[#245c35]"
        >
          {message}
        </p>
      )}
      {token && !verified ? (
        <button
          disabled={busy}
          className={`${actionClass} w-full`}
          onClick={async () => {
            setBusy(true);
            setError("");
            try {
              const response = await api<{ message: string }>(
                "/auth/verify-email",
                { method: "POST", body: { token } },
              );
              setVerified(true);
              setMessage(response.message);
              window.history.replaceState(null, "", location.pathname);
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Verifying…" : "Confirm my email"}
        </button>
      ) : !verified ? (
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const fields = new FormData(event.currentTarget);
            setBusy(true);
            setError("");
            try {
              const response = await api<{ message: string }>(
                "/auth/resend-verification",
                { method: "POST", body: { email: fields.get("email") } },
              );
              setMessage(response.message);
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <AuthField
            id="verification-email"
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            required
          />
          <button disabled={busy} className={`${actionClass} w-full`}>
            {busy ? "Requesting…" : "Request verification email"}
          </button>
        </form>
      ) : null}
      <Link
        to="/login"
        className="mt-5 inline-flex min-h-10 items-center text-sm font-semibold text-[#245c35]!"
      >
        Return to login
      </Link>
    </AuthLayout>
  );
}
