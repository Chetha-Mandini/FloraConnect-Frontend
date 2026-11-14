import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import PasswordChangeForm from "./PasswordChangeForm";
import { api } from "../../services/api/auth";

vi.mock("../../services/api/auth", async (original) => ({
  ...(await original<typeof import("../../services/api/auth")>()),
  api: vi.fn(),
}));
afterEach(() => vi.mocked(api).mockReset());
function open() {
  render(
    <MemoryRouter>
      <PasswordChangeForm />
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByLabelText("Current password"), {
    target: { value: "old-password" },
  });
  fireEvent.change(screen.getByLabelText("New password"), {
    target: { value: "eight888" },
  });
  fireEvent.change(screen.getByLabelText("Confirm new password"), {
    target: { value: "eight888" },
  });
}
describe("Password action feedback", () => {
  it("keeps a named, visible loading action and prevents duplicate submissions", async () => {
    vi.mocked(api).mockImplementation(() => new Promise(() => {}));
    open();
    fireEvent.submit(screen.getByRole("form", { name: "Change password" }));
    const action = screen.getByRole("button", { name: "Updating…" });
    expect(action).toBeVisible();
    expect(action).toBeDisabled();
    expect(action).toHaveAttribute("aria-busy", "true");
    fireEvent.submit(screen.getByRole("form", { name: "Change password" }));
    expect(api).toHaveBeenCalledTimes(1);
  });
  it("restores an enabled action after a server error", async () => {
    vi.mocked(api).mockRejectedValue(
      new Error("Current password is incorrect."),
    );
    open();
    fireEvent.submit(screen.getByRole("form", { name: "Change password" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Current password is incorrect.",
    );
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Update password" }),
      ).toBeEnabled(),
    );
    expect(
      screen.getByRole("button", { name: "Update password" }),
    ).toBeVisible();
  });
});
