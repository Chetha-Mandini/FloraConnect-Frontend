import { apiEndpoints } from "../config/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import AuthLayout, {
  actionClass,
  AuthField,
} from "../components/auth/AuthLayout";
import { api, destinationFor, type AuthSession } from "../services/api/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  return (
    <AuthLayout
      title="Login"
      description="Welcome back. Sign in to your FloraConnect account."
    >
      <form
        aria-label="Member login"
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const fields = new FormData(event.currentTarget);
          setBusy(true);
          setError("");
          try {
            const session = await api<AuthSession>(apiEndpoints.auth.login, {
              method: "POST",
              body: {
                email: fields.get("email"),
                password: fields.get("password"),
              },
            });
            navigate(destinationFor(session.user.role), { replace: true });
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <fieldset
          disabled={busy}
          className="m-0 min-w-0 space-y-4 border-0 p-0"
        >
          <legend className="sr-only">Your account credentials</legend>
          <AuthField
            id="login-email"
            name="email"
            label="Email address"
            type="email"
            autoComplete="username"
            required
            placeholder="you@example.com"
          />
          <div className="relative">
            <AuthField
              id="login-password"
              name="password"
              label="Password"
              type={visible ? "text" : "password"}
              autoComplete="current-password"
              className="pr-12!"
              required
              maxLength={128}
            />
            <button
              type="button"
              className="absolute right-1 bottom-0 flex size-11 items-center justify-center rounded-md text-[#647067] focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#245c35]"
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              onClick={() => setVisible((v) => !v)}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-xs leading-relaxed text-red-800"
            >
              {error}
            </p>
          )}
          <button
            className={`${actionClass} w-full`}
            type="submit"
            aria-busy={busy}
          >
            {busy ? "Signing in…" : "Sign in"}
            <ArrowRight size={16} />
          </button>
        </fieldset>
      </form>
      <p className="mt-4! text-center text-xs">
        <Link to="/verify-email" className="text-[#245c35]! hover:underline">
          Need to verify your email?
        </Link>
      </p>
      <p className="mt-5! text-center text-xs text-[#647067]">
        New to FloraConnect?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#245c35]! hover:underline"
        >
          Explore membership
        </Link>
      </p>
    </AuthLayout>
  );
}
