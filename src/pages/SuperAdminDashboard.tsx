import UserAccessForm from "../features/admin/UserAccessForm";
import RoleAccessGuide from "../features/admin/RoleAccessGuide";
import AdminProfileMenu from "../features/admin/AdminProfileMenu";
import { apiEndpoints } from "../config/api";
import { dateLabel, readable } from "../features/admin/format";
import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  type LucideIcon,
  Activity,
  Building2,
  ClipboardCheck,
  Flower2,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useSession } from "../features/auth/useSession";
import PasswordChangeForm from "../features/auth/PasswordChangeForm";
import { api, destinationFor, logout } from "../services/api/auth";
import {
  adminApi,
  type AdminRecord,
  type Analytics,
  type RecordPage,
  type Summary,
} from "../services/api/admin";
import {
  DataTable,
  EmptyState,
  LoadingSkeleton,
  MetricCard,
  Pagination,
  StatusBadge,
  TrendChart,
} from "../features/admin/components";
import Modal from "../components/ui/Modal";
import "../features/admin/admin.css";

const navigation: { group: string; items: [string, string, LucideIcon][] }[] = [
  {
    group: "Workspace",
    items: [
      ["", "Overview", LayoutDashboard],
      ["users", "Users", Users],
      ["organizations", "Organizations", Building2],
      ["businesses", "Florists & Growers", Flower2],
      ["verifications", "Verification Requests", ClipboardCheck],
    ],
  },
  {
    group: "Platform",
    items: [
      ["listings", "Flower Listings", Flower2],
      ["orders", "Orders", ClipboardCheck],
      ["content", "Posts & Events", Building2],
      ["reports", "Reports & Moderation", ShieldCheck],
    ],
  },
  {
    group: "Administration",
    items: [
      ["roles", "Roles & Permissions", ShieldCheck],
      ["analytics", "Analytics", Activity],
      ["audit-logs", "Audit Logs", Activity],
      ["settings", "System Settings", Settings],
      ["profile", "My Profile", Users],
    ],
  },
];
const descriptions: Record<string, string> = {
  "": "A clear view of your community and the work awaiting your attention.",
  users: "Manage accounts and controlled staff assignments.",
  organizations: "Review registered organizations across the platform.",
  businesses: "Review approved florist and grower profiles.",
  verifications: "Review application evidence before granting access.",
  analytics: "Database-backed registration trends and account distribution.",
  "audit-logs": "Review recorded privileged actions.",
  roles: "System roles and the access enforced by the backend.",
  profile: "Manage your account details and password.",
  settings: "Global configuration availability.",
};
const unavailable: Record<string, string> = {
  listings:
    "Flower listing persistence and seller ownership APIs are not implemented. The public flower catalogue is reference content, not seller inventory.",
  orders:
    "Order and order-item models, status history, and authorized correction policies are not implemented.",
  content:
    "Organization posts, member draft approvals, and events do not yet have persistent models or APIs.",
  reports:
    "Complaint records, moderation decisions, and report resolution APIs are not implemented.",
  settings:
    "Persistent global settings and their runtime enforcement are not implemented. Session policy is currently managed by the authentication service.",
};
const idColumn = {
  label: "Identifier",
  render: (r: AdminRecord) => <code className="fc-admin-id">{r.id}</code>,
};
const statusColumn = {
  label: "Status",
  render: (r: AdminRecord) => <StatusBadge value={r.status} />,
};
const dateColumn = {
  label: "Created",
  render: (r: AdminRecord) => dateLabel(r.createdAt),
};

export default function SuperAdminDashboard() {
  const session = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const section = location.pathname.replace(/^\/admin\/?/, "").split("/")[0];
  const title =
    navigation
      .flatMap((g) => g.items)
      .find(([path]) => path === section)?.[1] ?? "Page unavailable";
  const [drawer, setDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState<RecordPage | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [days, setDays] = useState("30");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<AdminRecord | null>(null);
  const [action, setAction] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [accessTarget, setAccessTarget] = useState<AdminRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const user = session.user;
  const allowed = user?.role === "SUPER_ADMIN" && !user.mustChangePassword;
  const resource = section === "verifications" ? "applications" : section;
  const isTable = [
    "users",
    "organizations",
    "businesses",
    "applications",
    "audit-logs",
  ].includes(resource);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    if (!allowed) return;
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const query = new URLSearchParams({
          page: String(page),
          search: debouncedSearch,
          status,
          type,
          sort,
        });
        if (isTable) {
          const result = await adminApi.records(
            resource,
            query,
            controller.signal,
          );
          if (!controller.signal.aborted) setData(result);
        }
        if (section === "") {
          // First useful overview never waits for the slower aggregation charts.
          const results = await Promise.allSettled([
            adminApi.summary(controller.signal).then((result) => {
              if (!controller.signal.aborted) {
                setSummary(result);
                setLoading(false);
              }
            }),
            ...(days !== "custom" || (from && to)
              ? [
                  adminApi
                    .analytics(
                      new URLSearchParams(
                        days === "custom" ? { from, to } : { days },
                      ),
                      controller.signal,
                    )
                    .then((result) => {
                      if (!controller.signal.aborted) setAnalytics(result);
                    }),
                ]
              : []),
          ]);
          const failure = results.find(
            (result) => result.status === "rejected",
          );
          if (failure?.status === "rejected" && !controller.signal.aborted)
            setError((failure.reason as Error).message);
        }
        if (section === "analytics") {
          const range = new URLSearchParams(
            days === "custom" ? { from, to } : { days },
          );
          if (days !== "custom" || (from && to)) {
            const result = await adminApi.analytics(range, controller.signal);
            if (!controller.signal.aborted) setAnalytics(result);
          }
        }
        if (section === "roles") {
          const result = await api<{ records: AdminRecord[] }>(
            apiEndpoints.admin.roles,
            { signal: controller.signal },
          );
          if (!controller.signal.aborted)
            setData({
              ...result,
              page: 1,
              pageSize: 20,
              total: result.records.length,
            });
        }
      } catch (e) {
        if (!controller.signal.aborted) setError((e as Error).message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void run();
    return () => controller.abort();
  }, [
    allowed,
    section,
    resource,
    isTable,
    page,
    debouncedSearch,
    status,
    type,
    sort,
    revision,
    days,
    from,
    to,
  ]);

  function changePage() {
    setDrawer(false);
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setType("");
    setPage(1);
    setSelected(null);
    setAction("");
    setNotice("");
  }
  async function signOut() {
    setBusy(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function submitAction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || busy) return;
    const form = new FormData(event.currentTarget);
    const reason = String(form.get("reason") ?? "").trim();
    setBusy(true);
    setError("");
    try {
      if (action === "APPROVED" || action === "REJECTED")
        await api(apiEndpoints.admin.review(selected.id), {
          method: "POST",
          body: { decision: action, reason },
        });
      else if (action === "status")
        await api(apiEndpoints.admin.userStatus(selected.id), {
          method: "POST",
          body: {
            status: selected.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED",
            reason,
          },
        });
      else if (action === "edit")
        await api(apiEndpoints.admin.editUser(selected.id), {
          method: "PATCH",
          body: {
            name: form.get("name"),
            phone: form.get("phone"),
            address: form.get("address"),
            reason,
          },
        });
      setSelected(null);
      setAction("");
      setNotice("Change saved and recorded in the audit log.");
      setRevision((v) => v + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (session.loading)
    return (
      <main className="fc-admin-root fc-admin-auth">
        <LoadingSkeleton />
      </main>
    );
  if (session.error)
    return (
      <main className="fc-admin-root fc-admin-auth">
        <p role="alert">{session.error}</p>
        <button onClick={session.retry}>Retry authentication</button>
      </main>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "SUPER_ADMIN")
    return <Navigate to={destinationFor(user.role)} replace />;
  if (user.mustChangePassword)
    return (
      <main className="fc-admin-root fc-admin-auth">
        <PasswordChangeForm temporary />
      </main>
    );

  const columns =
    resource === "users"
      ? [
          {
            label: "User",
            render: (r: AdminRecord) => (
              <>
                <strong>{r.name}</strong>
                <small>{r.email}</small>
              </>
            ),
          },
          { label: "Role", render: (r: AdminRecord) => readable(r.role) },
          statusColumn,
          {
            label: "Email",
            render: (r: AdminRecord) =>
              r.emailVerified ? "Verified" : "Pending verification",
          },
          idColumn,
        ]
      : resource === "audit-logs"
        ? [
            { label: "Action", render: (r: AdminRecord) => readable(r.action) },
            { label: "Details", render: (r: AdminRecord) => r.details },
            dateColumn,
            idColumn,
          ]
        : [
            {
              label: "Name",
              render: (r: AdminRecord) => (
                <>
                  <strong>{r.name}</strong>
                  <small>{r.userId?.email ?? r.contact}</small>
                </>
              ),
            },
            { label: "Type", render: (r: AdminRecord) => readable(r.type) },
            statusColumn,
            { label: "Location", render: (r: AdminRecord) => r.location },
            dateColumn,
          ];
  const rangeFilter = (
    <div className="fc-admin-range">
      <label>
        Period
        <select value={days} onChange={(e) => setDays(e.target.value)}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="custom">Custom range</option>
        </select>
      </label>
      {days === "custom" && (
        <>
          <label>
            From
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
        </>
      )}
    </div>
  );

  return (
    <div className={`fc-admin-root ${collapsed ? "fc-admin-collapsed" : ""}`}>
      <a className="fc-admin-skip" href="#admin-main">
        Skip to content
      </a>
      {drawer && (
        <button
          className="fc-admin-backdrop"
          aria-label="Close navigation"
          onClick={() => setDrawer(false)}
        />
      )}
      <aside
        className={`fc-admin-sidebar ${drawer ? "fc-admin-open" : ""}`}
        aria-label="Administrative navigation"
      >
        <Link to="/admin" className="fc-admin-brand" onClick={changePage}>
          <Flower2 size={26} />{" "}
          <span>
            FloraConnect<small>SUPER ADMIN</small>
          </span>
        </Link>
        <button
          className="fc-admin-mobile-close"
          aria-label="Close navigation"
          onClick={() => setDrawer(false)}
        >
          <X size={20} />
        </button>
        <nav>
          {navigation.map((group) => (
            <div className="fc-admin-nav-group" key={group.group}>
              <p>{group.group}</p>
              {group.items.map(([path, label, Icon]) => (
                <NavLink
                  key={path}
                  end
                  to={`/admin${path ? `/${path}` : ""}`}
                  onClick={changePage}
                  title={label}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <button
          className="fc-admin-logout"
          disabled={busy}
          onClick={() => void signOut()}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>
      <div className="fc-admin-workspace">
        <header className="fc-admin-topbar">
          <button
            aria-label="Toggle navigation"
            aria-expanded={drawer || !collapsed}
            onClick={() => {
              if (window.matchMedia("(max-width: 800px)").matches)
                setDrawer((v) => !v);
              else setCollapsed((v) => !v);
            }}
          >
            <Menu size={21} />
          </button>
          <div className="fc-admin-breadcrumb">
            Administration <span>/</span> {title}
          </div>
          <AdminProfileMenu
            key={location.pathname}
            name={user.name}
            busy={busy}
            onLogout={() => void signOut()}
          />
        </header>
        <main id="admin-main" className="fc-admin-main">
          <div className="fc-admin-heading">
            <div>
              <p className="fc-admin-eyebrow">FLORACONNECT ADMINISTRATION</p>
              <h1>{title}</h1>
              <p>
                {descriptions[section] ??
                  "Platform operations and administration."}
              </p>
            </div>
            <div className="fc-admin-actions">
              {section === "users" && (
                <button
                  className="fc-admin-primary"
                  onClick={() => setCreatingUser(true)}
                >
                  Add user
                </button>
              )}
              <button
                onClick={() => setRevision((v) => v + 1)}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          </div>
          {error && (
            <div className="fc-admin-error" role="alert">
              {error}
              <button onClick={() => setRevision((v) => v + 1)}>Retry</button>
            </div>
          )}
          {notice && (
            <p className="fc-admin-notice" role="status">
              {notice}
            </p>
          )}
          {unavailable[section] ? (
            <section className="fc-admin-panel">
              <EmptyState title="Backend capability required">
                {unavailable[section]}
              </EmptyState>
            </section>
          ) : section === "profile" ? (
            <Profile user={user} onSaved={session.retry} />
          ) : (
            <>
              {isTable && (
                <section className="fc-admin-panel fc-admin-tools">
                  <label className="fc-admin-search">
                    <Search size={17} aria-hidden="true" />
                    <input
                      aria-label={`Search ${title}`}
                      placeholder={
                        resource === "users"
                          ? "Search name, email or UUID…"
                          : "Search records or UUID…"
                      }
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </label>
                  {resource !== "audit-logs" && (
                    <label>
                      Status
                      <select
                        value={status}
                        onChange={(e) => {
                          setStatus(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="">All statuses</option>
                        {(resource === "users"
                          ? [
                              "ACTIVE",
                              "SUSPENDED",
                              "PENDING_EMAIL_VERIFICATION",
                            ]
                          : resource === "applications"
                            ? ["PENDING", "APPROVED", "REJECTED"]
                            : ["APPROVED", "SUSPENDED"]
                        ).map((v) => (
                          <option key={v} value={v}>
                            {readable(v)}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  {["businesses", "applications"].includes(resource) && (
                    <label>
                      Type
                      <select
                        value={type}
                        onChange={(e) => {
                          setType(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="">All types</option>
                        <option value="FLORIST">Florist</option>
                        <option value="GROWER">Grower</option>
                        {resource === "applications" && (
                          <option value="ORGANIZATION_REPRESENTATIVE">
                            Organization
                          </option>
                        )}
                      </select>
                    </label>
                  )}
                  {resource !== "audit-logs" && (
                    <label>
                      Sort
                      <select
                        value={sort}
                        onChange={(e) => {
                          setSort(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="createdAt">Newest first</option>
                        <option value="name">Name A–Z</option>
                      </select>
                    </label>
                  )}
                </section>
              )}
              {(section === "" || section === "analytics") && rangeFilter}
              {loading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  {section === "" && summary && (
                    <>
                      <div className="fc-admin-metrics">
                        {[
                          ["Registered users", "users", "users"],
                          ["Active accounts", "active", "users"],
                          ["Organizations", "organizations", "organizations"],
                          ["Florists", "florists", "businesses"],
                          ["Growers", "growers", "businesses"],
                          ["Pending applications", "", "verifications"],
                        ].map(([label, key, path]) => (
                          <MetricCard
                            key={label}
                            title={label}
                            count={
                              key
                                ? summary.counts[key]
                                : summary.counts.pendingOrganizations +
                                  summary.counts.pendingFlorists +
                                  summary.counts.pendingGrowers
                            }
                            to={`/admin/${path}`}
                          />
                        ))}
                      </div>
                      <section className="fc-admin-panel">
                        <h2>Pending actions</h2>
                        <div className="fc-admin-pending">
                          {[
                            [
                              "Organization applications",
                              "pendingOrganizations",
                            ],
                            ["Florist applications", "pendingFlorists"],
                            ["Grower applications", "pendingGrowers"],
                          ].map(([label, key]) => (
                            <Link to="/admin/verifications" key={key}>
                              <span>{label}</span>
                              <strong>{summary.counts[key]}</strong>
                              <span>Review →</span>
                            </Link>
                          ))}
                        </div>
                        <p className="fc-admin-muted">
                          {summary.counts.unverified} accounts awaiting email
                          verification
                        </p>
                      </section>
                    </>
                  )}
                  {(section === "" || section === "analytics") && analytics && (
                    <>
                      <div className="fc-admin-charts">
                        <TrendChart
                          title="User registrations"
                          points={analytics.users}
                        />
                        <TrendChart
                          title="Organization registrations"
                          points={analytics.organizations}
                        />
                        <TrendChart
                          title="Business registrations"
                          points={analytics.businesses}
                        />
                      </div>
                      {section === "analytics" && (
                        <section className="fc-admin-panel">
                          <h2>Users by system role</h2>
                          <ul className="fc-admin-distribution">
                            {analytics.byRole.map((r) => (
                              <li key={r._id}>
                                <span>{readable(r._id)}</span>
                                <strong>{r.count}</strong>
                              </li>
                            ))}
                          </ul>
                          <p className="fc-admin-muted">
                            Account distribution includes all dates. Order and
                            listing analytics require their backend domains.
                          </p>
                        </section>
                      )}
                    </>
                  )}
                  {section === "" && summary && (
                    <section className="fc-admin-panel">
                      <div className="fc-admin-section-heading">
                        <h2>Recent administrative activity</h2>
                        <Link to="/admin/audit-logs">View audit log →</Link>
                      </div>
                      <DataTable
                        records={summary.audit}
                        columns={[
                          {
                            label: "Action",
                            render: (r) => readable(r.action),
                          },
                          { label: "Details", render: (r) => r.details },
                          dateColumn,
                        ]}
                        onSelect={setSelected}
                      />
                    </section>
                  )}
                  {isTable && data && (
                    <section className="fc-admin-panel">
                      <DataTable
                        records={data.records}
                        columns={columns}
                        onSelect={(record) => {
                          setSelected(record);
                          setAction("");
                        }}
                      />
                      <Pagination
                        page={page}
                        total={data.total}
                        onChange={setPage}
                      />
                    </section>
                  )}
                  {section === "roles" && data && (
                    <RoleAccessGuide records={data.records} />
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
      {(creatingUser || accessTarget) && (
        <UserAccessForm
          target={accessTarget ?? undefined}
          onClose={() => {
            setCreatingUser(false);
            setAccessTarget(null);
          }}
          onSaved={(message) => {
            setCreatingUser(false);
            setAccessTarget(null);
            setNotice(message);
            setRevision((value) => value + 1);
          }}
        />
      )}
      {selected && (
        <Modal
          title={selected.name ?? readable(selected.action)}
          onClose={() => {
            if (
              !busy &&
              (!action || window.confirm("Discard the unsaved changes?"))
            ) {
              setSelected(null);
              setAction("");
            }
          }}
          className="fc-admin-dialog"
        >
          <div className="fc-admin-root fc-admin-detail">
            <dl>
              {Object.entries(selected)
                .filter(
                  ([key, value]) =>
                    !["userId", "evidenceUrl", "permissions"].includes(key) &&
                    value !== undefined &&
                    value !== null,
                )
                .map(([key, value]) => (
                  <div key={key}>
                    <dt>{readable(key.replace(/([A-Z])/g, "_$1"))}</dt>
                    <dd>
                      {typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : String(value)}
                    </dd>
                  </div>
                ))}
            </dl>
            {selected.userId && (
              <p>
                Applicant: {selected.userId.name} · {selected.userId.email}
              </p>
            )}
            {selected.evidenceUrl &&
              /^https?:\/\//i.test(selected.evidenceUrl) && (
                <a
                  href={selected.evidenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View supporting evidence (external site) ↗
                </a>
              )}
            {!action && (
              <div className="fc-admin-actions">
                {resource === "applications" &&
                  selected.status === "PENDING" && (
                    <>
                      <button
                        disabled={!selected.userId?.emailVerified}
                        onClick={() => setAction("APPROVED")}
                      >
                        Approve application
                      </button>
                      <button
                        className="fc-admin-danger"
                        onClick={() => setAction("REJECTED")}
                      >
                        Reject application
                      </button>
                    </>
                  )}
                {resource === "users" && selected.id !== user.id && (
                  <button
                    onClick={() => {
                      setAccessTarget(selected);
                      setSelected(null);
                      setAction("");
                    }}
                  >
                    Manage role &amp; permissions
                  </button>
                )}
                {resource === "users" && selected.role !== "SUPER_ADMIN" && (
                  <>
                    <button onClick={() => setAction("edit")}>
                      Edit personal details
                    </button>
                    {["ACTIVE", "SUSPENDED"].includes(
                      selected.status ?? "",
                    ) && (
                      <button onClick={() => setAction("status")}>
                        {selected.status === "SUSPENDED"
                          ? "Reactivate account"
                          : "Suspend account"}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
            {action && (
              <form
                className="fc-admin-form"
                onSubmit={(e) => void submitAction(e)}
              >
                <h3>Confirm {readable(action)}</h3>
                <p>
                  This change will be validated and logged by the server.
                  {action === "status" &&
                    " Existing account sessions will be revoked."}
                </p>
                {action === "edit" && (
                  <>
                    <label>
                      Full name
                      <input
                        name="name"
                        required
                        maxLength={100}
                        defaultValue={selected.name}
                      />
                    </label>
                    <label>
                      Phone
                      <input
                        name="phone"
                        type="tel"
                        maxLength={30}
                        defaultValue={selected.phone}
                      />
                    </label>
                    <label>
                      Address
                      <textarea
                        name="address"
                        maxLength={300}
                        defaultValue={selected.address}
                      />
                    </label>
                  </>
                )}
                <label>
                  Reason
                  <textarea name="reason" required maxLength={1000} />
                </label>

                {error && <p role="alert">{error}</p>}
                <div className="fc-admin-actions">
                  <button className="fc-admin-primary" disabled={busy}>
                    Confirm change
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm("Discard the unsaved changes?"))
                        setAction("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

function Profile({
  user,
  onSaved,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  return (
    <div className="fc-admin-profile">
      <section className="fc-admin-panel">
        <h2>Personal details</h2>
        <p>{user.email} · Super Admin</p>
        <code className="fc-admin-id">{user.id}</code>
        <form
          className="fc-admin-form"
          onChange={() => setDirty(true)}
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy) return;
            const form = new FormData(e.currentTarget);
            setBusy(true);
            try {
              await api(apiEndpoints.auth.profile, {
                method: "PATCH",
                body: {
                  name: form.get("name"),
                  phone: form.get("phone"),
                  address: form.get("address"),
                },
              });
              setDirty(false);
              setMessage("Profile saved.");
              onSaved();
            } catch (error) {
              setMessage((error as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Full name
            <input
              name="name"
              required
              maxLength={100}
              defaultValue={user.name}
            />
          </label>
          <label>
            Phone
            <input
              name="phone"
              type="tel"
              maxLength={30}
              defaultValue={user.phone}
            />
          </label>
          <label>
            Address
            <textarea
              name="address"
              maxLength={300}
              defaultValue={user.address}
            />
          </label>
          <button className="fc-admin-primary" disabled={busy}>
            Save profile
          </button>
          <p role="status">{message}</p>
        </form>
      </section>
      <section className="fc-admin-panel">
        <PasswordChangeForm />
      </section>
    </div>
  );
}
