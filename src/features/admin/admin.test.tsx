import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SuperAdminDashboard from "../../pages/SuperAdminDashboard";
import { api, ApiError, type AuthUser } from "../../services/api/auth";
import { rememberLoginSession } from "../auth/login-session";

vi.mock("../../services/api/auth", async (original) => ({
  ...(await original<typeof import("../../services/api/auth")>()),
  api: vi.fn(),
}));
const user = {
  id: "10c45050-d898-4b52-935f-bfa5b991d391",
  name: "Admin",
  email: "admin@example.test",
  role: "SUPER_ADMIN",
  status: "ACTIVE",
  emailVerified: true,
  mustChangePassword: false,
};
beforeEach(() => {
  vi.mocked(api).mockReset();
});
function open(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/admin/*" element={<SuperAdminDashboard />} />
        <Route
          path="/platform-admin"
          element={<p>Restricted staff workspace</p>}
        />
        <Route path="/account" element={<p>Personal account</p>} />
      </Routes>
    </MemoryRouter>,
  );
}
describe("Super Admin workspace", () => {
  it("remains visible under the matching generic EasyList cosmetic rules", async () => {
    const filter = document.createElement("style");
    // Exact generic class selectors from EasyList's easylist_general_hide.txt.
    filter.textContent =
      ".ad-detail,.ad-heading,.ad-main,.ad-notice,.ad-panel,.ad-primary,.ad-root,.ad-sidebar{display:none!important}";
    document.head.append(filter);
    try {
      rememberLoginSession(user as AuthUser);
      vi.mocked(api).mockImplementation(async () => new Promise(() => {}));
      open("/admin");
      expect(screen.getByRole("heading", { name: "Overview" })).toBeVisible();
      expect(
        screen.getByRole("complementary", {
          name: "Administrative navigation",
        }),
      ).toBeVisible();
    } finally {
      filter.remove();
    }
  });
  it("renders the authenticated workspace without waiting for session revalidation or charts", async () => {
    rememberLoginSession(user as AuthUser);
    vi.mocked(api).mockImplementation(async (path) => {
      if (path === "/auth/me" || path.includes("/analytics"))
        return new Promise(() => {});
      return {
        counts: {
          users: 7,
          active: 6,
          organizations: 0,
          florists: 0,
          growers: 0,
          unverified: 1,
          pendingOrganizations: 0,
          pendingFlorists: 0,
          pendingGrowers: 0,
        },
        audit: [],
      } as never;
    });
    open("/admin");
    expect(screen.getByRole("heading", { name: "Overview" })).toBeVisible();
    await screen.findByText("Registered users");
    expect(screen.getByText("7")).toBeVisible();
  });
  it("rechecks the server and stops rendering administration when a cached session is revoked", async () => {
    rememberLoginSession(user as AuthUser);
    vi.mocked(api).mockImplementation(async (path) => {
      if (path === "/auth/me")
        throw new ApiError("This account is not active.", 403);
      return new Promise(() => {});
    });
    open("/admin");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "This account is not active.",
    );
    expect(
      screen.queryByRole("heading", { name: "Overview" }),
    ).not.toBeInTheDocument();
  });
  it.each(["PLATFORM_ADMIN", "USER", "FLORIST"])(
    "redirects %s without requesting administrative data",
    async (role) => {
      vi.mocked(api).mockResolvedValue({ user: { ...user, role } });
      open("/admin/users");
      await screen.findByText(
        role === "PLATFORM_ADMIN"
          ? "Restricted staff workspace"
          : "Personal account",
      );
      expect(vi.mocked(api).mock.calls.map(([path]) => path)).toEqual([
        "/auth/me",
      ]);
    },
  );
  it("requires temporary password rotation before fetching dashboard data", async () => {
    vi.mocked(api).mockResolvedValue({
      user: { ...user, mustChangePassword: true },
    });
    open("/admin");
    await screen.findByRole("heading", { name: "Choose your own password" });
    expect(vi.mocked(api).mock.calls.map(([path]) => path)).toEqual([
      "/auth/me",
    ]);
  });
  it("uses UUID records and keeps sensitive search out of URLs", async () => {
    vi.mocked(api).mockImplementation(
      async (path) =>
        (path === "/auth/me"
          ? { user }
          : {
              records: [{ ...user, name: "Member", role: "USER" }],
              total: 1,
              page: 1,
              pageSize: 20,
            }) as never,
    );
    open("/admin/users");
    await screen.findByText("Member");
    expect(screen.getByText(user.id)).toBeVisible();
    fireEvent.change(screen.getByRole("textbox", { name: "Search Users" }), {
      target: { value: "person@example.test" },
    });
    await waitFor(() =>
      expect(api).toHaveBeenCalledWith(
        "/admin/console/records/users/query",
        expect.objectContaining({
          method: "POST",
          body: expect.objectContaining({ search: "person@example.test" }),
        }),
      ),
    );
    expect(
      vi
        .mocked(api)
        .mock.calls.every(([path]) => !path.includes("person@example.test")),
    ).toBe(true);
  });
  it("shows unsupported domains without fabricated production data", async () => {
    vi.mocked(api).mockResolvedValue({ user });
    open("/admin/orders");
    await screen.findByRole("heading", { name: "Backend capability required" });
    expect(vi.mocked(api).mock.calls.map(([path]) => path)).toEqual([
      "/auth/me",
    ]);
  });
});
