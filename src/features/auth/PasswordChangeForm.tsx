import { apiEndpoints } from "../../config/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api/auth";
import { actionClass, AuthField } from "../../components/auth/AuthLayout";

export default function PasswordChangeForm({
  temporary = false,
}: {
  temporary?: boolean;
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      className="max-w-md space-y-4"
      aria-label="Change password"
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy) return;
        const values = new FormData(event.currentTarget);
        setError("");
        if (values.get("newPassword") !== values.get("confirmation")) {
          setError("Your new passwords do not match.");
          return;
        }
        setBusy(true);
        try {
          await api(apiEndpoints.auth.password, {
            method: "POST",
            body: {
              currentPassword: values.get("currentPassword"),
              newPassword: values.get("newPassword"),
            },
          });
          navigate("/login", { replace: true });
        } catch (e) {
          setError((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="text-2xl!">
        {temporary ? "Choose your own password" : "Change password"}
      </h2>
      <p className="text-sm leading-relaxed text-[#647067]">
        {temporary
          ? "Replace your temporary password before accessing administration. "
          : ""}
        Use 8–128 characters. Changing it signs out all sessions; sign in again
        afterward.
      </p>
      <fieldset disabled={busy} className="space-y-3 border-0 p-0">
        <legend className="sr-only">Password details</legend>
        <AuthField
          id="current-password"
          name="currentPassword"
          type="password"
          label="Current password"
          autoComplete="current-password"
          required
          maxLength={128}
        />
        <AuthField
          id="new-password"
          name="newPassword"
          type="password"
          label="New password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={128}
        />
        <AuthField
          id="confirm-new-password"
          name="confirmation"
          type="password"
          label="Confirm new password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={128}
        />
        {error && (
          <p role="alert" className="text-sm text-red-800">
            {error}
          </p>
        )}
        <button
          className={actionClass}
          type="submit"
          disabled={busy}
          aria-busy={busy}
        >
          {busy ? "Updating…" : "Update password"}
        </button>
      </fieldset>
    </form>
  );
}
