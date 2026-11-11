import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SuperAdminDashboard from "../../pages/SuperAdminDashboard";
import { api } from "../../services/api/auth";

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
