import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RegistrationPage from "../../pages/Registation";
import LoginPage from "../../pages/LoginPage";
import AdminDashboard from "../../pages/AdminDashboard";
import { api } from "../../services/api/auth";

vi.mock("../../services/api/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../services/api/auth")>()),
  api: vi.fn(),
  logout: vi.fn(),
}));
const user = {
  id: "test-user",
  name: "Test Admin",
  email: "test@example.test",
  role: "SUPER_ADMIN",
  status: "ACTIVE",
  emailVerified: true,
  mustChangePassword: false,
  accountType: "USER",
};
const overview = {
  counts: { users: 2, organizations: 0, businesses: 0, pending: 0 },
  audit: [],
};
beforeEach(() => {
  vi.mocked(api).mockReset();
});
function registration() {
  return render(
    <MemoryRouter>
      <RegistrationPage />
    </MemoryRouter>,
  );
}
function fillPersonal() {
  fireEvent.change(screen.getByLabelText("Full name"), {
    target: { value: "Test Person" },
  });
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "person@example.test" },
  });
  fireEvent.change(screen.getByLabelText("Password", { exact: true }), {
    target: { value: "test-password-123" },
  });
  fireEvent.change(screen.getByLabelText("Confirm password"), {
    target: { value: "test-password-123" },
  });
}
describe("Role-aware registration and administration", () => {
  it("offers only public registration paths and never staff roles", () => {
    registration();
    expect(
      screen.getByRole("button", { name: /Personal account/ }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: /Florist/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /Grower/ })).toBeVisible();
    expect(
      screen.getByRole("button", { name: /Organization representative/ }),
    ).toBeVisible();
    expect(
      screen.queryByRole("button", { name: /Super Admin|Platform Admin/ }),
    ).not.toBeInTheDocument();
  });
  it("ignores role selection in registration URLs and submits only a public registration intent", async () => {
    vi.mocked(api).mockResolvedValue({ message: "Account registered." });
    render(
      <MemoryRouter
        initialEntries={["/register?role=SUPER_ADMIN&application=SUPER_ADMIN"]}
      >
        <RegistrationPage />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("button", { name: /Personal account/ }),
    ).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    fillPersonal();
    fireEvent.submit(screen.getByRole("form", { name: "Registration" }));
    await screen.findByRole("status");
    const body = vi.mocked(api).mock.calls[0][1]?.body;
    expect(body).toMatchObject({ registrationKind: "personal" });
    expect(body).not.toHaveProperty("role");
    expect(body).not.toHaveProperty("accountType");
  });
  it("creates a normal account through the API without submitting a privileged role", async () => {
    vi.mocked(api).mockResolvedValue({
      message: "Account registered and awaiting email verification.",
    });
    registration();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    fillPersonal();
    fireEvent.submit(screen.getByRole("form", { name: "Registration" }));
    await screen.findByRole("status");
    expect(api).toHaveBeenCalledWith(
      "/auth/register",
      expect.objectContaining({
        body: {
          name: "Test Person",
          email: "person@example.test",
          password: "test-password-123",
          registrationKind: "personal",
        },
      }),
    );
  });
  it("keeps mismatched passwords from reaching the registration API", () => {
    registration();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    fillPersonal();
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: { value: "different-password" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Registration" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "passwords do not match",
    );
    expect(api).not.toHaveBeenCalled();
  });
  it("collects organization category and descriptive position before application submission", () => {
    registration();
    fireEvent.click(
      screen.getByRole("button", { name: /Organization representative/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    fillPersonal();
    fireEvent.submit(screen.getByRole("form", { name: "Registration" }));
    expect(screen.getByLabelText("Organization category")).toBeVisible();
    expect(screen.getByLabelText("Your position")).toBeVisible();
    expect(api).not.toHaveBeenCalled();
  });
  it("shows API login failures without pretending the user is authenticated", async () => {
    vi.mocked(api).mockRejectedValue(
      new Error("Email or password is incorrect."),
    );
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "person@example.test" },
    });
    fireEvent.change(screen.getByLabelText("Password", { exact: true }), {
      target: { value: "wrong-password" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Member login" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Email or password is incorrect.",
    );
  });
  it("keeps the temporary-password administrator out of dashboard data", async () => {
    vi.mocked(api).mockResolvedValue({
      user: { ...user, mustChangePassword: true },
      csrfToken: "csrf",
    });
    render(
      <MemoryRouter>
        <AdminDashboard superAdmin />
      </MemoryRouter>,
    );
    await screen.findByRole("heading", { name: "Choose your own password" });
    expect(
      vi.mocked(api).mock.calls.every(([path]) => path === "/auth/me"),
    ).toBe(true);
  });
  it("redirects a Platform Admin away from Super Admin and hides staff assignment", async () => {
    vi.mocked(api).mockImplementation(async (path) =>
      path === "/auth/me"
        ? ({
            user: { ...user, role: "PLATFORM_ADMIN" },
            csrfToken: "csrf",
          } as never)
        : (overview as never),
    );
    render(
      <MemoryRouter initialEntries={["/super-admin"]}>
        <Routes>
          <Route path="/super-admin" element={<AdminDashboard superAdmin />} />
          <Route path="/platform-admin" element={<AdminDashboard />} />
        </Routes>
      </MemoryRouter>,
    );
    await screen.findByRole("heading", { name: "Admin Dashboard" });
    expect(
      screen.queryByRole("button", { name: "Users & staff access" }),
    ).not.toBeInTheDocument();
    await waitFor(() =>
      expect(api).toHaveBeenCalledWith(
        "/platform-admin/overview",
        expect.anything(),
      ),
    );
    expect(
      vi
        .mocked(api)
        .mock.calls.some(([path]) => path.startsWith("/admin/users")),
    ).toBe(false);
  });
});
