import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "./LoginPage";
import { api } from "../services/api/auth";

vi.mock("../services/api/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../services/api/auth")>()),
  api: vi.fn(),
}));

const session = {
  user: {
    id: "member-1",
    name: "Flower Member",
    email: "member@example.test",
    role: "USER" as const,
    status: "ACTIVE",
    emailVerified: true,
    mustChangePassword: false,
    accountType: "USER",
  },
  csrfToken: "test-token",
};

function CurrentPath() {
  const { pathname } = useLocation();
  return <p>Current route: {pathname}</p>;
}

function renderLogin(returnTo: string) {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/login",
          state: { returnTo },
        },
      ]}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<CurrentPath />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.mocked(api).mockReset();
  vi.mocked(api).mockResolvedValue(session);
});

describe("login return destination", () => {
  it("returns to the grower profile after a successful login", async () => {
    renderLogin("/growers/asha-perera");
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "member@example.test" },
    });
    fireEvent.change(screen.getByLabelText("Password", { exact: true }), {
      target: { value: "correct-horse-battery-staple" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Member login" }));

    expect(
      await screen.findByText("Current route: /growers/asha-perera"),
    ).toBeVisible();
  });

  it("rejects an external return destination", async () => {
    renderLogin("//example.test");
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "member@example.test" },
    });
    fireEvent.change(screen.getByLabelText("Password", { exact: true }), {
      target: { value: "correct-horse-battery-staple" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Member login" }));

    expect(await screen.findByText("Current route: /account")).toBeVisible();
  });
});
