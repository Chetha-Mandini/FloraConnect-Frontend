import { apiEndpoints } from "../config/api";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSession } from "../features/auth/useSession";
import PasswordChangeForm from "../features/auth/PasswordChangeForm";
import { api, destinationFor, logout } from "../services/api/auth";
import { actionClass, AuthField } from "../components/auth/AuthLayout";

export default function AccountPage() {
  const session = useSession();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const user = session.user;
  if (session.loading)
    return (
      <main className="p-8" role="status">
        Loading your account…
      </main>
    );
  if (session.error)
    return (
      <main className="p-8">
        <p role="alert">{session.error}</p>
        <button onClick={session.retry}>Retry</button>
      </main>
    );
  if (!user) return null;
  return (
    <main id="main" className="min-h-svh bg-[#f7f9f5] px-5 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap justify-between gap-3">
          <Link to="/" className="text-sm font-semibold text-[#245c35]!">
            FloraConnect
          </Link>
          <button
            disabled={busy}
            className="text-xs"
            onClick={async () => {
              setBusy(true);
              try {
                await logout();
                navigate("/login");
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            Sign out
          </button>
        </div>
        <h1 className="text-3xl">My account</h1>
        {error && (
          <p role="alert" className="text-sm text-red-800">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="text-sm text-[#245c35]">
            {message}
          </p>
        )}
        <section className="rounded-xl border border-[#e5ebe5] bg-white p-5">
          <p className="mb-2! text-xs capitalize text-[#647067]">
            {user.role.toLowerCase().replaceAll("_", " ")}
          </p>
          <p className="mb-4! text-sm text-[#647067]">{user.email}</p>
          {["SUPER_ADMIN", "PLATFORM_ADMIN"].includes(user.role) && (
            <Link
              className="mb-5 inline-block text-sm font-semibold text-[#245c35]!"
              to={destinationFor(user.role)}
            >
              Open administration →
            </Link>
          )}
          {!user.permissions || user.permissions.includes("profile.update") ? (
            <form
              className="max-w-md space-y-3"
              onSubmit={async (event) => {
                event.preventDefault();
                const values = new FormData(event.currentTarget);
                setBusy(true);
                setError("");
                try {
                  await api(apiEndpoints.auth.profile, {
                    method: "PATCH",
                    body: {
                      name: values.get("name"),
                      phone: values.get("phone"),
                      address: values.get("address"),
                    },
                  });
                  setMessage("Profile updated.");
                  session.retry();
                } catch (e) {
                  setError((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <AuthField
                id="profile-name"
                label="Full name"
                name="name"
                defaultValue={user.name}
                maxLength={100}
                required
              />
              <AuthField
                id="profile-phone"
                label="Phone number"
                name="phone"
                type="tel"
                autoComplete="tel"
                defaultValue={user.phone ?? ""}
                maxLength={30}
              />
              <AuthField
                id="profile-address"
                label="Address"
                name="address"
                autoComplete="street-address"
                defaultValue={user.address ?? ""}
                maxLength={300}
              />
              <button disabled={busy} className={actionClass}>
                Save profile
              </button>
            </form>
          ) : (
            <p className="text-sm text-[#647067]">
              Profile editing is disabled by your administrator. You can still
              change your password below.
            </p>
          )}
        </section>
        {!["USER", "SUPER_ADMIN", "PLATFORM_ADMIN"].includes(
          user.accountType,
        ) &&
          user.role === "USER" && (
            <p className="rounded-xl border border-[#e5ebe5] bg-white p-4 text-sm text-[#647067]">
              Your business or organization application requires review before
              management access is enabled.
            </p>
          )}
        <section className="rounded-xl border border-[#e5ebe5] bg-white p-5">
          <PasswordChangeForm temporary={user.mustChangePassword} />
        </section>
      </div>
    </main>
  );
}
