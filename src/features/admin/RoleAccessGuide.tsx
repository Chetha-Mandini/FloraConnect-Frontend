import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api/auth";
import { apiEndpoints } from "../../config/api";
import type { AccessPolicy, AdminRecord } from "../../services/api/admin";
import { LoadingSkeleton } from "./components";

export default function RoleAccessGuide({
  records,
}: {
  records: AdminRecord[];
}) {
  const [policy, setPolicy] = useState<AccessPolicy | null>(null);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    api<AccessPolicy>(apiEndpoints.admin.accessPolicy, {
      signal: controller.signal,
    })
      .then((data) => {
        if (!controller.signal.aborted) setPolicy(data);
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError((failure as Error).message);
      });
    return () => controller.abort();
  }, [revision]);
  if (error)
    return (
      <section className="fc-admin-panel">
        <p role="alert">{error}</p>
        <button
          onClick={() => {
            setError("");
            setRevision((value) => value + 1);
          }}
        >
          Retry access policy
        </button>
      </section>
    );
  if (!policy) return <LoadingSkeleton />;
  return (
    <>
      <section className="fc-admin-panel">
        <div className="fc-admin-section-heading">
          <div>
            <h2>Roles and access boundaries</h2>
            <p className="fc-admin-muted">
              Each account has one system role. Individual grants can reduce the
              available permissions below. Only implemented operations are
              listed.
            </p>
          </div>
          <Link to="/admin/users">Manage user access →</Link>
        </div>
        <p className="fc-admin-table-hint">
          Scroll sideways to compare each role's scope and permissions.
        </p>
        <div className="fc-admin-table-wrap">
          <table className="fc-admin-role-table">
            <colgroup>
              <col style={{ width: "34%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "36%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Users</th>
                <th scope="col">Access scope</th>
                <th scope="col">Available permissions</th>
              </tr>
            </thead>
            <tbody>
              {policy.roles.map((role) => (
                <tr key={role.id}>
                  <td>
                    <strong>{role.name}</strong>
                    <small>{role.description}</small>
                  </td>
                  <td>
                    {records.find((record) => record.id === role.id)?.count ??
                      0}
                  </td>
                  <td>{role.scope}</td>
                  <td>
                    {role.id === "SUPER_ADMIN"
                      ? "All implemented platform permissions"
                      : role.permissions
                          .map(
                            (id) =>
                              policy.permissions.find((item) => item.id === id)
                                ?.name,
                          )
                          .filter(Boolean)
                          .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="fc-admin-panel">
        <h2>Safe access administration</h2>
        <ul className="fc-admin-policy">
          <li>
            Create accounts and assign roles from Users. Email verification and
            a first-login password change protect newly created accounts.
          </li>
          <li>
            Review and adjust individual permission grants within the selected
            role. Organization positions stay separate from platform
            permissions.
          </li>
          <li>
            Access changes require your current password and a recorded reason,
            and revoke the target user's sessions.
          </li>
          <li>
            Super Admin grants require explicit confirmation. Another Super
            Admin must manage your own access; the last active Super Admin is
            protected.
          </li>
          <li>
            Organization roles require an approved organization. Florist and
            Grower roles require linked business records. Unsupported domain
            operations do not gain access simply because a role is assigned.
          </li>
        </ul>
      </section>
    </>
  );
}
