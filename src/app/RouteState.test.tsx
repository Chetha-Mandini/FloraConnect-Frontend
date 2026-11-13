import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { RouteFailure, RoutePending } from "./RouteState";

describe("Route loading feedback", () => {
  it("shows an initial fallback while the dashboard module is still downloading", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/admin",
          HydrateFallback: RoutePending,
          lazy: async () => new Promise(() => {}),
        },
      ],
      { initialEntries: ["/admin"] },
    );
    render(<RouterProvider router={router} />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Opening your workspace",
    );
  });
  it("offers recovery rather than an empty page on a failed route load", () => {
    const router = createMemoryRouter(
      [{ path: "/admin", element: <RouteFailure /> }],
      { initialEntries: ["/admin"] },
    );
    render(<RouterProvider router={router} />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to open this page",
    );
    expect(screen.getByRole("button", { name: "Reload page" })).toBeVisible();
  });
});
