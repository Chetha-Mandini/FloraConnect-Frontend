import { apiEndpoints } from "../config/api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  ClipboardCheck,
  Flower2,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  api,
  destinationFor,
  logout,
  type AuthUser,
} from "../services/api/auth";
import { useSession } from "../features/auth/useSession";
import PasswordChangeForm from "../features/auth/PasswordChangeForm";
import {
  actionClass,
  controlClass,
  labelClass,
} from "../components/auth/AuthLayout";
import Skeleton from "../components/ui/Skeleton";

type Overview = {
  counts: {
    users: number;
    organizations: number;
    businesses: number;
    pending: number;
  };
  audit: { id: string; action: string; details: string; createdAt: string }[];
};
type Application = {
  id: string;
  name: string;
  type: string;
  contact: string;
  location: string;
  evidenceUrl: string;
  organizationType?: string;
  position?: string;
  status: string;
  decisionReason?: string;
  userId: {
    name: string;
    email: string;
    emailVerified: boolean;
    status: string;
  } | null;
  createdAt: string;
};
const readable = (value: string) => value.toLowerCase().replaceAll("_", " ");
export default function AdminDashboard({
  superAdmin = false,
}: {
  superAdmin?: boolean;
}) {
  const session = useSession();
  const navigate = useNavigate();
  const user = session.user;
  const [tab, setTab] = useState("overview");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);
  const [staff, setStaff] = useState<AuthUser | null>(null);
  const [accountStatus, setAccountStatus] = useState<AuthUser | null>(null);
  const [reason, setReason] = useState("");
  const allowed =
    user &&
    (superAdmin
      ? user.role === "SUPER_ADMIN"
      : ["SUPER_ADMIN", "PLATFORM_ADMIN"].includes(user.role));
  useEffect(() => {
    if (user && (!allowed || (user.role === "SUPER_ADMIN" && !superAdmin)))
      navigate(destinationFor(user.role), { replace: true });
  }, [user, allowed, superAdmin, navigate]);
  useEffect(() => {
    if (!allowed || user?.mustChangePassword) return;
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        if (tab === "overview")
          setOverview(
            await api<Overview>(apiEndpoints.workspace(superAdmin).overview, {
              signal: controller.signal,
            }),
          );
        if (tab === "applications") {
          const data = await api<{
            applications: Application[];
            total: number;
          }>(
            `${apiEndpoints.workspace(superAdmin).applications}?page=${page}`,
            { signal: controller.signal },
          );
          if (!controller.signal.aborted) {
            setApplications(data.applications);
            setTotal(data.total);
          }
        }
        if (tab === "users") {
          const data = await api<{ users: AuthUser[]; total: number }>(
            `${apiEndpoints.workspace(superAdmin).users}?page=${page}`,
            { signal: controller.signal },
          );
          if (!controller.signal.aborted) {
            setUsers(data.users);
            setTotal(data.total);
          }
        }
      } catch (e) {
        if (!controller.signal.aborted) setError((e as Error).message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void fetchData();
    return () => controller.abort();
  }, [allowed, user?.mustChangePassword, tab, page, refresh, superAdmin]);
  if (session.loading)
    return (
      <main
        className="min-h-svh bg-[#f7f9f5] p-8"
        aria-label="Loading administration"
      >
        <Skeleton className="h-12 w-60" />
        <Skeleton className="mt-8 h-64 w-full" />
      </main>
    );
  if (session.error)
    return (
      <main className="p-8">
        <p role="alert">{session.error}</p>
        <button className={actionClass} onClick={session.retry}>
          Retry
        </button>
      </main>
    );
  if (!user || !allowed) return null;
  const changeTab = (next: string) => {
    setTab(next);
    setPage(1);
    setSelected(null);
    setStaff(null);
    setAccountStatus(null);
    setError("");
    setNotice("");
  };
  const review = async (decision: string) => {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      await api(apiEndpoints.workspace(superAdmin).review(selected.id), {
        method: "POST",
        body: { decision, reason },
      });
      setSelected(null);
      setReason("");
      setNotice("Application review saved.");
      setRefresh((n) => n + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="min-h-svh bg-[#f7f9f5] text-[#17251c]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5ebe5] bg-white px-5 py-4 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-lg font-semibold text-[#245c35]!"
        >
          <ShieldCheck size={25} /> FloraConnect
        </Link>
        <div className="flex items-center gap-4 text-xs">
          <Link to="/account" className="font-semibold text-[#245c35]!">
            {user.name}
          </Link>
          <button
            className="inline-flex min-h-10 items-center gap-2 text-[#647067]"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await logout();
                navigate("/login", { replace: true });
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <aside>
          <p className="mb-4! text-[10px] font-bold tracking-widest text-[#647067]">
            {superAdmin ? "SYSTEM ADMINISTRATION" : "PLATFORM MANAGEMENT"}
          </p>
          <nav
            aria-label="Administration"
            className="flex flex-wrap gap-2 lg:flex-col"
          >
            {[
              { id: "overview", label: "Overview", Icon: LayoutDashboard },
              {
                id: "applications",
                label: "Verification requests",
                Icon: ClipboardCheck,
              },
              ...(superAdmin
                ? [{ id: "users", label: "Users & staff access", Icon: Users }]
                : []),
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                disabled={user.mustChangePassword}
                aria-current={tab === id ? "page" : undefined}
                onClick={() => changeTab(id)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-left! text-xs font-medium disabled:opacity-50 ${tab === id ? "bg-[#eaf2e8] text-[#245c35]" : "text-[#647067] hover:bg-white"}`}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
          <p className="mt-5! max-w-[250px] text-xs leading-relaxed text-[#647067]">
            {superAdmin
              ? "Only Super Admins can assign platform staff access."
              : "Verify applications within your assigned scope. Role assignment and system settings are restricted to Super Admins."}
          </p>
        </aside>
        <main id="main" className="min-w-0">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="mb-1! text-xs text-[#647067]">
                Welcome back, {user.name}
              </p>
              <h1 className="text-3xl text-[#153d28]">
                {superAdmin ? "Super Admin Dashboard" : "Admin Dashboard"}
              </h1>
            </div>
            {!user.mustChangePassword && (
              <button
                className="inline-flex min-h-10 items-center gap-2 text-xs text-[#245c35]"
                onClick={() => setRefresh((v) => v + 1)}
              >
                <RefreshCw size={14} /> Refresh
              </button>
            )}
          </div>
          {user.mustChangePassword ? (
            <div className="rounded-xl border border-[#e5ebe5] bg-white p-5">
              <PasswordChangeForm temporary />
            </div>
          ) : (
            <>
              {error && (
                <p
                  role="alert"
                  className="mb-4! rounded-lg bg-red-50 p-3 text-sm text-red-800"
                >
                  {error}
                </p>
              )}
              {notice && (
                <p
                  role="status"
                  className="mb-4! rounded-lg bg-[#eaf2e8] p-3 text-sm text-[#245c35]"
                >
                  {notice}
                </p>
              )}
              {loading ? (
                <div aria-label="Loading dashboard data">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="mt-5 h-60 w-full" />
                </div>
              ) : tab === "overview" && overview ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      {
                        label: "Registered accounts",
                        count: overview.counts.users,
                        Icon: Users,
                      },
                      {
                        label: "Approved organizations",
                        count: overview.counts.organizations,
                        Icon: Building2,
                      },
                      {
                        label: "Approved businesses",
                        count: overview.counts.businesses,
                        Icon: Flower2,
                      },
                      {
                        label: "Pending applications",
                        count: overview.counts.pending,
                        Icon: ClipboardCheck,
                      },
                    ].map(({ label, count, Icon }) => (
                      <div
                        key={label}
                        className="rounded-xl border border-[#e5ebe5] bg-white p-5"
                      >
                        <Icon size={21} className="mb-4 text-[#245c35]" />
                        <p className="text-3xl font-semibold">
                          {count.toLocaleString()}
                        </p>
                        <p className="mt-1! text-xs text-[#647067]">{label}</p>
                      </div>
                    ))}
                  </div>
                  <section className="mt-6 rounded-xl border border-[#e5ebe5] bg-white p-5">
                    <h2 className="mb-3! text-xl!">
                      {superAdmin
                        ? "Recent administrative activity"
                        : "Your management scope"}
                    </h2>
                    {superAdmin ? (
                      overview.audit.length ? (
                        <ul className="divide-y divide-[#e5ebe5]">
                          {overview.audit.map((item) => (
                            <li key={item.id} className="py-3">
                              <p className="text-xs font-semibold capitalize">
                                {readable(item.action)}
                              </p>
                              <p className="mt-1! break-words text-xs text-[#647067]">
                                {item.details}
                              </p>
                              <time
                                className="text-[11px] text-[#647067]"
                                dateTime={item.createdAt}
                              >
                                {new Date(item.createdAt).toLocaleString()}
                              </time>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-[#647067]">
                          No administrative actions recorded yet.
                        </p>
                      )
                    ) : (
                      <p className="text-sm leading-relaxed text-[#647067]">
                        Review florist, grower and organization applications.
                        Applicants must verify their email before approval.
                        Content moderation will become available when listing
                        and reporting services are connected.
                      </p>
                    )}
                  </section>
                </>
              ) : tab === "applications" ? (
                <>
                  <h2 className="mb-4! text-xl!">Verification requests</h2>
                  {applications.length ? (
                    <div className="grid gap-3">
                      {applications.map((item) => (
                        <article
                          key={item.id}
                          className="rounded-xl border border-[#e5ebe5] bg-white p-5"
                        >
                          <div className="flex flex-wrap justify-between gap-3">
                            <div>
                              <h3 className="text-base font-semibold">
                                {item.name}
                              </h3>
                              <p className="mt-1! text-xs capitalize text-[#647067]">
                                {readable(item.type)} · {readable(item.status)}
                              </p>
                              <p className="mt-2! break-words text-xs text-[#647067]">
                                {item.userId?.name ?? "Unavailable applicant"} ·{" "}
                                {item.userId?.email}
                              </p>
                              <p className="mt-1! text-xs text-[#647067]">
                                Email{" "}
                                {item.userId?.emailVerified
                                  ? "verified"
                                  : "verification pending"}
                              </p>
                            </div>
                            {item.status === "PENDING" && (
                              <button
                                className="self-start rounded-lg border! border-[#dce5da]! px-4 py-2 text-xs font-semibold text-[#245c35]"
                                onClick={() => {
                                  setSelected(item);
                                  setReason("");
                                  setError("");
                                }}
                              >
                                Review
                              </button>
                            )}
                          </div>
                          {item.decisionReason && (
                            <p className="mt-3! text-xs text-[#647067]">
                              Decision: {item.decisionReason}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#dce5da] bg-white p-10 text-center text-sm text-[#647067]">
                      No applications have been submitted yet.
                    </div>
                  )}
                  {selected && (
                    <section
                      className="mt-5 rounded-xl border border-[#245c35] bg-white p-5"
                      aria-label={`Review ${selected.name}`}
                    >
                      <h3 className="mb-3! font-semibold">
                        Review: {selected.name}
                      </h3>
                      <dl className="space-y-2 text-xs text-[#647067]">
                        <div>
                          <dt className="font-semibold">Contact / location</dt>
                          <dd className="m-0">
                            {selected.contact} · {selected.location}
                          </dd>
                        </div>
                        {selected.organizationType && (
                          <div>
                            <dt className="font-semibold">
                              Category / representative position
                            </dt>
                            <dd className="m-0 capitalize">
                              {readable(selected.organizationType)} ·{" "}
                              {readable(selected.position ?? "")}
                            </dd>
                          </div>
                        )}
                      </dl>
                      <a
                        href={selected.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-xs font-semibold text-[#245c35]! underline"
                      >
                        Open supporting evidence (external site)
                      </a>
                      <label
                        htmlFor="review-reason"
                        className={`${labelClass} mt-4`}
                      >
                        Decision reason
                      </label>
                      <textarea
                        id="review-reason"
                        className={`${controlClass} h-24! py-2!`}
                        maxLength={1000}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                      {!selected.userId?.emailVerified && (
                        <p className="mt-2! text-xs text-[#647067]">
                          Approval is unavailable until email verification is
                          complete.
                        </p>
                      )}
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          disabled={
                            busy ||
                            !reason.trim() ||
                            !selected.userId?.emailVerified
                          }
                          className={actionClass}
                          onClick={() => void review("APPROVED")}
                        >
                          Approve
                        </button>
                        <button
                          disabled={busy || !reason.trim()}
                          className="min-h-11 rounded-lg border! border-red-200! px-4 text-sm text-red-800 disabled:opacity-50"
                          onClick={() => void review("REJECTED")}
                        >
                          Reject
                        </button>
                        <button
                          className="min-h-11 px-3 text-xs"
                          onClick={() => setSelected(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </section>
                  )}
                </>
              ) : tab === "users" && superAdmin ? (
                <>
                  <h2 className="mb-4! text-xl!">Users and staff access</h2>
                  <div className="space-y-3">
                    {users.map((person) => (
                      <article
                        key={person.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e5ebe5] bg-white p-4"
                      >
                        <div>
                          <p className="text-sm font-semibold">{person.name}</p>
                          <p className="break-all text-xs text-[#647067]">
                            {person.email}
                          </p>
                          <p className="mt-1! text-xs capitalize text-[#647067]">
                            {readable(person.role)} · {readable(person.status)}
                          </p>
                        </div>
                        {person.role !== "SUPER_ADMIN" &&
                          ["ACTIVE", "SUSPENDED"].includes(person.status) && (
                            <button
                              className="min-h-10 text-xs font-semibold text-[#245c35]"
                              onClick={() => {
                                setAccountStatus(person);
                                setReason("");
                              }}
                            >
                              {person.status === "SUSPENDED"
                                ? "Reactivate account"
                                : "Suspend account"}
                            </button>
                          )}
                        {["USER", "PLATFORM_ADMIN"].includes(person.role) &&
                          person.emailVerified &&
                          person.status === "ACTIVE" && (
                            <button
                              className="min-h-10 text-xs font-semibold text-[#245c35]"
                              onClick={() => {
                                setStaff(person);
                                setAccountStatus(null);
                                setReason("");
                              }}
                            >
                              {person.role === "PLATFORM_ADMIN"
                                ? "Revoke staff access"
                                : "Assign Platform Admin"}
                            </button>
                          )}
                      </article>
                    ))}
                  </div>
                  {accountStatus && (
                    <form
                      className="mt-5 space-y-3 rounded-xl border border-[#dce5da] bg-white p-5"
                      onSubmit={async (event) => {
                        event.preventDefault();
                        setBusy(true);
                        try {
                          await api(
                            apiEndpoints
                              .workspace(superAdmin)
                              .userStatus(accountStatus.id),
                            {
                              method: "POST",
                              body: {
                                status:
                                  accountStatus.status === "SUSPENDED"
                                    ? "ACTIVE"
                                    : "SUSPENDED",
                                reason,
                              },
                            },
                          );
                          setAccountStatus(null);
                          setNotice("Account status updated.");
                          setRefresh((v) => v + 1);
                        } catch (e) {
                          setError((e as Error).message);
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      <h3 className="text-sm font-semibold">
                        Confirm account status change for {accountStatus.name}
                      </h3>
                      <label
                        htmlFor="account-status-reason"
                        className={labelClass}
                      >
                        Reason
                      </label>
                      <input
                        id="account-status-reason"
                        className={controlClass}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        maxLength={1000}
                      />
                      <div className="flex gap-3">
                        <button disabled={busy} className={actionClass}>
                          Confirm status change
                        </button>
                        <button
                          type="button"
                          className="px-3 text-xs"
                          onClick={() => setAccountStatus(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                  {staff && (
                    <form
                      className="mt-5 space-y-3 rounded-xl border border-[#dce5da] bg-white p-5"
                      onSubmit={async (event) => {
                        event.preventDefault();
                        setBusy(true);
                        try {
                          await api(
                            apiEndpoints
                              .workspace(superAdmin)
                              .staffAssignment(staff.id),
                            {
                              method: "POST",
                              body: {
                                enabled: staff.role !== "PLATFORM_ADMIN",
                                reason,
                                currentPassword: new FormData(
                                  event.currentTarget,
                                ).get("currentPassword"),
                              },
                            },
                          );
                          setStaff(null);
                          setNotice("Staff access updated.");
                          setRefresh((v) => v + 1);
                        } catch (e) {
                          setError((e as Error).message);
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      <h3 className="text-sm font-semibold">
                        Confirm staff access change for {staff.name}
                      </h3>
                      <label htmlFor="staff-password" className={labelClass}>
                        Confirm your current password
                      </label>
                      <input
                        id="staff-password"
                        name="currentPassword"
                        type="password"
                        autoComplete="current-password"
                        required
                        maxLength={128}
                        className={controlClass}
                      />
                      <label htmlFor="staff-reason" className={labelClass}>
                        Reason
                      </label>
                      <input
                        id="staff-reason"
                        required
                        maxLength={1000}
                        className={controlClass}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                      <div className="flex gap-3">
                        <button disabled={busy} className={actionClass}>
                          Confirm change
                        </button>
                        <button
                          type="button"
                          onClick={() => setStaff(null)}
                          className="px-3 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : null}
              {tab !== "overview" && !loading && total > 20 && (
                <div className="mt-5 flex items-center gap-4 text-xs">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((v) => v - 1)}
                    className="min-h-10 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span>
                    Page {page} of {Math.ceil(total / 20)}
                  </span>
                  <button
                    disabled={page * 20 >= total}
                    onClick={() => setPage((v) => v + 1)}
                    className="min-h-10 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
