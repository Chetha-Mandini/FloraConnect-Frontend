import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import AdminProfileMenu from "./AdminProfileMenu";

function open() {
  render(
    <MemoryRouter>
      <AdminProfileMenu name="Super Admin" busy={false} onLogout={vi.fn()} />
      <button>Background control</button>
    </MemoryRouter>,
  );
  const trigger = screen.getByRole("button", { name: "Administrator menu" });
  fireEvent.click(trigger);
  return trigger;
}
describe("Administrator profile menu", () => {
  it("closes when the user selects the background", () => {
    const trigger = open();
    expect(screen.getByRole("menu")).toBeVisible();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
  it("keeps the menu open for interaction inside and closes on Escape with focus restored", () => {
    const trigger = open();
    fireEvent.pointerDown(screen.getByRole("menuitem", { name: "My profile" }));
    expect(screen.getByRole("menu")).toBeVisible();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
  it("closes when keyboard focus moves outside", () => {
    open();
    fireEvent.focusIn(
      screen.getByRole("button", { name: "Background control" }),
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
  it("closes after a profile navigation", () => {
    render(
      <MemoryRouter>
        <AdminProfileMenu name="Super Admin" busy={false} onLogout={vi.fn()} />
        <Routes>
          <Route path="/admin/profile" element={<h1>My account</h1>} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Administrator menu" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "My profile" }));
    expect(screen.getByRole("heading", { name: "My account" })).toBeVisible();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
