import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import UserAccessForm from "./UserAccessForm";
import { api } from "../../services/api/auth";
import type { AccessPolicy } from "../../services/api/admin";

vi.mock("../../services/api/auth", async (original) => ({
  ...(await original<typeof import("../../services/api/auth")>()),
  api: vi.fn(),
}));
const mandatory = ["profile.read", "password.change"];
const policy: AccessPolicy = {
  roles: [
    {
      id: "USER",
      name: "User",
      description: "Account only",
      scope: "Own account",
      permissions: [...mandatory, "profile.update"],
    },
    {
      id: "PLATFORM_ADMIN",
      name: "Platform Admin",
      description: "Review only",
      scope: "Applications",
      permissions: [
        ...mandatory,
        "profile.update",
        "applications.read",
        "applications.review",
      ],
    },
    {
      id: "SUPER_ADMIN",
      name: "Super Admin",
      description: "Full access",
      scope: "Platform",
      permissions: [
        ...mandatory,
        "profile.update",
        "applications.read",
        "applications.review",
        "users.create",
      ],
    },
  ],
  permissions: [
    {
      id: "profile.read",
      name: "View own account",
      category: "Account",
      configurable: false,
    },
    {
      id: "password.change",
      name: "Change own password",
      category: "Account",
      configurable: false,
    },
    {
      id: "profile.update",
      name: "Edit own profile",
      category: "Account",
      configurable: true,
    },
    {
      id: "applications.read",
      name: "View applications",
      category: "Verification",
      configurable: true,
    },
    {
      id: "applications.review",
      name: "Review applications",
      category: "Verification",
      configurable: true,
    },
    {
      id: "users.create",
      name: "Create users",
      category: "Users",
      configurable: true,
    },
  ],
};
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    },
  });
});
afterAll(() => {
  Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
  Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
});
beforeEach(() => {
  vi.mocked(api).mockReset();
});
afterEach(() => vi.restoreAllMocks());

async function openCreate() {
  const onSaved = vi.fn();
  vi.mocked(api).mockImplementation(
    async (path) =>
      (path === "/admin/console/access-policy"
        ? policy
        : { message: "User created, pending verification." }) as never,
  );
  render(
    <MemoryRouter>
      <UserAccessForm onClose={vi.fn()} onSaved={onSaved} />
    </MemoryRouter>,
  );
  await screen.findByRole("combobox", { name: "System role" });
  return onSaved;
}
function fill() {
  fireEvent.change(screen.getByLabelText("Full name"), {
    target: { value: "New Person" },
  });
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "new@example.test" },
  });
  fireEvent.change(screen.getByLabelText("Temporary password"), {
    target: { value: "eight888" },
  });
  fireEvent.change(screen.getByLabelText("Reason"), {
    target: { value: "Approved new account" },
  });
  fireEvent.change(screen.getByLabelText("Your current password"), {
    target: { value: "admin-fixture" },
  });
}
describe("Super Admin account forms", () => {
  it("uses backend role boundaries and submits a selected role with narrowed permissions", async () => {
    const onSaved = await openCreate();
    expect(
      screen.queryByRole("checkbox", { name: "Create users" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /Change own password/ }),
    ).toBeDisabled();
    fill();
    fireEvent.change(screen.getByRole("combobox", { name: "System role" }), {
      target: { value: "PLATFORM_ADMIN" },
    });
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Review applications" }),
    );
    fireEvent.submit(screen.getByRole("form", { name: "Add user" }));
    await waitFor(() =>
      expect(onSaved).toHaveBeenCalledWith(
        "User created, pending verification.",
      ),
    );
    const call = vi
      .mocked(api)
      .mock.calls.find(([path]) => path === "/admin/console/users")!;
    expect(call[1]).toMatchObject({
      method: "POST",
      body: {
        name: "New Person",
        email: "new@example.test",
        role: "PLATFORM_ADMIN",
        temporaryPassword: "eight888",
        currentPassword: "admin-fixture",
        reason: "Approved new account",
      },
    });
    expect(
      (call[1]?.body as { permissions: string[] }).permissions,
    ).not.toContain("applications.review");
  });
  it("requires explicit Super Admin acknowledgement and keeps its permissions fixed", async () => {
    await openCreate();
    fireEvent.change(screen.getByRole("combobox", { name: "System role" }), {
      target: { value: "SUPER_ADMIN" },
    });
    expect(
      screen.getByRole("checkbox", { name: "Create users" }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Create users" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("checkbox", { name: /I confirm this user/ }),
    ).toBeRequired();
  });
  it("shows server validation errors without closing or losing the action", async () => {
    await openCreate();
    fill();
    vi.mocked(api).mockRejectedValueOnce(
      new Error("Current password is incorrect."),
    );
    fireEvent.submit(screen.getByRole("form", { name: "Add user" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Current password is incorrect.",
    );
    expect(screen.getByRole("button", { name: "Create user" })).toBeEnabled();
  });
});
