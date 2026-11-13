import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AppErrorBoundary from "./AppErrorBoundary";

afterEach(() => vi.restoreAllMocks());
describe("Application root recovery", () => {
  it("catches failures outside the router without leaving an empty root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    function BrokenApp(): never {
      throw new Error("Fixture render failure");
    }
    render(
      <AppErrorBoundary>
        <BrokenApp />
      </AppErrorBoundary>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("APP_RENDER_FAILED");
    expect(screen.getByRole("button", { name: "Reload page" })).toBeVisible();
  });
  it("preserves healthy content", () => {
    render(
      <AppErrorBoundary>
        <h1>Overview</h1>
      </AppErrorBoundary>,
    );
    expect(screen.getByRole("heading", { name: "Overview" })).toBeVisible();
  });
});
