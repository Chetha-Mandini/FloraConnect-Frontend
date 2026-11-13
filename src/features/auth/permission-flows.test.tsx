import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminDashboard from "../../pages/AdminDashboard";
import AccountPage from "../../pages/AccountPage";
import { api } from "../../services/api/auth";

vi.mock("../../services/api/auth", async (original) => ({
  ...(await original<typeof import("../../services/api/auth")>()),
  api: vi.fn(),
}));
const user = {
  id: "10c45050-d898-4b52-935f-bfa5b991d391",
  name: "Staff",
  email: "staff@example.test",
  role: "PLATFORM_ADMIN",
  status: "ACTIVE",
  emailVerified: true,
  mustChangePassword: false,
  accountType: "USER",
  permissions: ["profile.read", "password.change", "applications.read"],
};
beforeEach(() => vi.mocked(api).mockReset());
describe("Permission-aware account screens", () => {
  it("opens the allowed verification queue without requesting a revoked overview", async () => {
    vi.mocked(api).mockImplementation(
      async (path) =>
        (path === "/auth/me"
          ? { user }
          : {
              applications: [
                {
                  id: "f8048838-bb43-479a-81a3-a654d65f84f4",
                  name: "Test shop",
                  type: "FLORIST",
                  status: "PENDING",
                  userId: {
                    name: "Applicant",
                    email: "applicant@example.test",
                    emailVerified: true,
                  },
                  contact: "Contact",
                  location: "Location",
                },
              ],
              total: 1,
            }) as never,
    );
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>,
    );
    await screen.findByRole("heading", { name: "Test shop" });
    expect(
      vi.mocked(api).mock.calls.some(([path]) => path.endsWith("/overview")),
    ).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Review" }));
    fireEvent.change(screen.getByLabelText("Decision reason"), {
      target: { value: "Reviewed evidence" },
    });
    expect(screen.getByRole("button", { name: "Approve" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reject" })).toBeDisabled();
  });
  it("retains password controls when profile editing has been disabled", async () => {
    vi.mocked(api).mockResolvedValue({ user: { ...user, role: "USER" } });
    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: "My account" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Save profile" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Update password" }),
    ).toBeVisible();
  });
});
