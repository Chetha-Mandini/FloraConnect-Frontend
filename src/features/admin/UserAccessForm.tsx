import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import { apiEndpoints } from "../../config/api";
import { api } from "../../services/api/auth";
import {
  adminApi,
  type AccessPolicy,
  type AdminRecord,
  type UserAccess,
} from "../../services/api/admin";
import { LoadingSkeleton } from "./components";

const positions = [
  "PRESIDENT",
  "SECRETARY",
  "TREASURER",
  "BOTANICAL_OFFICER",
  "RESEARCH_OFFICER",
  "COORDINATOR",
  "GENERAL_MEMBER",
];
const label = (value: string) => value.toLowerCase().replaceAll("_", " ");

function OrganizationPicker({
  value,
  name,
  onChange,
}: {
  value: string;
  name: string;
  onChange: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<AdminRecord[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void adminApi
        .records(
          "organizations",
          new URLSearchParams({ search, status: "APPROVED", page: "1" }),
          controller.signal,
        )
        .then((result) => {
          if (!controller.signal.aborted) {
            setOptions(result.records);
            setError("");
          }
        })
        .catch((failure) => {
          if (!controller.signal.aborted) setError((failure as Error).message);
        });
    }, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [search]);
  return (
    <>
      <label>
        Find an approved organization
        <input
          type="search"
          value={search}
          maxLength={150}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by organization name"
        />
      </label>
      <label>
        Assigned organization
        <select
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Select an organization</option>
          {value && !options.some((item) => item.id === value) && (
            <option value={value}>{name || "Current organization"}</option>
          )}
          {options.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} · {item.location}
            </option>
          ))}
        </select>
      </label>
      <p className="fc-admin-muted">
        Up to 20 matches. Refine the search if your organization is not listed.
      </p>
      {error && <p role="alert">{error}</p>}
    </>
  );
}

export default function UserAccessForm({
  target,
  onClose,
  onSaved,
}: {
  target?: AdminRecord;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [policy, setPolicy] = useState<AccessPolicy | null>(null);
  const [role, setRole] = useState(target?.role ?? "USER");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [position, setPosition] = useState("GENERAL_MEMBER");
  const [business, setBusiness] = useState({
    name: "",
    contact: "",
    location: "",
  });
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void Promise.all([
      api<AccessPolicy>(apiEndpoints.admin.accessPolicy, {
        signal: controller.signal,
      }),
      target
        ? api<UserAccess>(apiEndpoints.admin.userAccess(target.id), {
            signal: controller.signal,
          })
        : Promise.resolve(null),
    ])
      .then(([data, access]) => {
        if (controller.signal.aborted) return;
        setPolicy(data);
        const selectedRole = access?.user.role ?? "USER";
        setRole(selectedRole);
        setPermissions(
          access?.user.permissions ??
            data.roles.find((item) => item.id === selectedRole)?.permissions ??
            [],
        );
        setOrganizationId(access?.organizationId ?? "");
        setOrganizationName(access?.organizationName ?? "");
        setPosition(access?.position ?? "GENERAL_MEMBER");
        setBusiness(
          access?.business ?? { name: "", contact: "", location: "" },
        );
        setError("");
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError((failure as Error).message);
      });
    return () => controller.abort();
  }, [target, revision]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const chosen = policy?.roles.find((item) => item.id === role);
  const organizationRole = [
    "ORGANIZATION_ADMIN",
    "ORGANIZATION_MEMBER",
  ].includes(role);
  const businessRole = ["FLORIST", "GROWER"].includes(role);
  const close = () => {
    if (
      !busy &&
      (!dirty || window.confirm("Discard the unsaved account changes?"))
    )
      onClose();
  };
  return (
    <Modal
      title={target ? `Manage access · ${target.name}` : "Add user"}
      onClose={close}
      className="fc-admin-dialog"
    >
      <div className="fc-admin-root fc-admin-detail">
        {!policy ? (
          <>
            {error ? (
              <>
                <p role="alert">{error}</p>
                <button onClick={() => setRevision((value) => value + 1)}>
                  Retry
                </button>
              </>
            ) : (
              <LoadingSkeleton />
            )}
          </>
        ) : (
          <form
            className="fc-admin-form"
            aria-label={target ? "Manage user access" : "Add user"}
            onChange={() => {
              setDirty(true);
              setError("");
            }}
            onSubmit={async (event) => {
              event.preventDefault();
              if (busy) return;
              const values = new FormData(event.currentTarget);
              setBusy(true);
              setError("");
              try {
                const body = {
                  role,
                  permissions,
                  reason: values.get("reason"),
                  currentPassword: values.get("currentPassword"),
                  confirmSuperAdmin: values.get("confirmSuperAdmin") === "on",
                  ...(organizationRole ? { organizationId, position } : {}),
                  ...(businessRole ? { business } : {}),
                  ...(!target
                    ? {
                        name: values.get("name"),
                        email: values.get("email"),
                        phone: values.get("phone"),
                        temporaryPassword: values.get("temporaryPassword"),
                      }
                    : {}),
                };
                const result = await api<{ message: string }>(
                  target
                    ? apiEndpoints.admin.userAccess(target.id)
                    : apiEndpoints.admin.createUser,
                  { method: target ? "PATCH" : "POST", body },
                );
                setDirty(false);
                onSaved(result.message);
              } catch (failure) {
                setError((failure as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <fieldset disabled={busy} className="fc-admin-access-fields">
              {!target && (
                <>
                  <h3>Account details</h3>
                  <label>
                    Full name
                    <input
                      name="name"
                      required
                      maxLength={100}
                      autoComplete="off"
                    />
                  </label>
                  <label>
                    Email address
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="off"
                    />
                  </label>
                  <label>
                    Phone number
                    <input name="phone" type="tel" maxLength={30} />
                  </label>
                  <label>
                    Temporary password
                    <input
                      name="temporaryPassword"
                      type="password"
                      required
                      minLength={8}
                      maxLength={128}
                      autoComplete="new-password"
                    />
                  </label>
                  <p className="fc-admin-muted">
                    New users must verify their email and replace this temporary
                    password at first sign-in. Share it through a secure
                    channel; it will not be returned or stored in audit logs.
                  </p>
                </>
              )}
              {target && (
                <p>
                  {target.email}. Saving access changes signs this user out of
                  existing sessions. Changing roles can replace linked
                  organization access or suspend an owned business; existing
                  business status is preserved when keeping a business role.
                </p>
              )}
              <label>
                System role
                <select
                  value={role}
                  onChange={(event) => {
                    setRole(event.target.value);
                    setPermissions(
                      policy.roles.find(
                        (item) => item.id === event.target.value,
                      )?.permissions ?? [],
                    );
                  }}
                >
                  {policy.roles.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <p>{chosen?.description}</p>
              <p className="fc-admin-muted">Access scope: {chosen?.scope}</p>
              <fieldset className="fc-admin-permissions">
                <legend>Granted permissions</legend>
                {policy.permissions
                  .filter((item) => chosen?.permissions.includes(item.id))
                  .map((permission) => (
                    <label className="fc-admin-checkbox" key={permission.id}>
                      <input
                        type="checkbox"
                        checked={
                          permissions.includes(permission.id) ||
                          !permission.configurable ||
                          role === "SUPER_ADMIN"
                        }
                        disabled={
                          role === "SUPER_ADMIN" ||
                          !permission.configurable ||
                          busy
                        }
                        onChange={(event) =>
                          setPermissions((previous) => {
                            const next = new Set(previous);
                            if (event.target.checked) {
                              next.add(permission.id);
                              if (permission.id === "applications.review")
                                next.add("applications.read");
                            } else {
                              next.delete(permission.id);
                              if (permission.id === "applications.read")
                                next.delete("applications.review");
                            }
                            return [...next];
                          })
                        }
                      />
                      <span>
                        {permission.name}
                        {!permission.configurable && (
                          <small>Required account access</small>
                        )}
                      </span>
                    </label>
                  ))}
              </fieldset>
              <p className="fc-admin-muted">
                Permissions can narrow the selected role. They cannot grant
                access outside its scope. Super Admin always retains all
                implemented permissions.
              </p>
              {organizationRole && (
                <>
                  <h3>Organization membership</h3>
                  <OrganizationPicker
                    value={organizationId}
                    name={organizationName}
                    onChange={setOrganizationId}
                  />
                  <label>
                    Organization position
                    <select
                      value={position}
                      onChange={(event) => setPosition(event.target.value)}
                    >
                      {positions.map((value) => (
                        <option key={value} value={value}>
                          {label(value)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <p className="fc-admin-muted">
                    This position is descriptive. It does not grant system
                    permissions.
                  </p>
                </>
              )}
              {businessRole && (
                <>
                  <h3>
                    {role === "FLORIST" ? "Florist" : "Grower"} business profile
                  </h3>
                  {(["name", "contact", "location"] as const).map((field) => (
                    <label key={field}>
                      Business {field}
                      <input
                        required
                        maxLength={field === "name" ? 150 : 200}
                        value={business[field]}
                        onChange={(event) =>
                          setBusiness((previous) => ({
                            ...previous,
                            [field]: event.target.value,
                          }))
                        }
                      />
                    </label>
                  ))}
                </>
              )}
              {role === "SUPER_ADMIN" && target?.role !== "SUPER_ADMIN" && (
                <label className="fc-admin-checkbox">
                  <input name="confirmSuperAdmin" type="checkbox" required />
                  <span>
                    I confirm this user will receive full Super Admin access.
                  </span>
                </label>
              )}
              <h3>Confirm administrative action</h3>
              <label>
                Reason
                <textarea name="reason" required maxLength={1000} />
              </label>
              <label>
                Your current password
                <input
                  name="currentPassword"
                  type="password"
                  required
                  maxLength={128}
                  autoComplete="current-password"
                />
              </label>
              {error && (
                <p role="alert" className="fc-admin-error">
                  {error}
                </p>
              )}
              <div className="fc-admin-actions">
                <button
                  className="fc-admin-primary"
                  type="submit"
                  disabled={busy}
                  aria-busy={busy}
                >
                  {busy
                    ? "Saving…"
                    : target
                      ? "Save access changes"
                      : "Create user"}
                </button>
                <button type="button" disabled={busy} onClick={close}>
                  Cancel
                </button>
              </div>
            </fieldset>
          </form>
        )}
      </div>
    </Modal>
  );
}
