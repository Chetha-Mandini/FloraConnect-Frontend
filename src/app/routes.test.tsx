import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { routeObjects } from "./routes";

const routeCases: [string, RegExp][] = [
  ["/flowers", /^Flowers$/],
  ["/associations", /^Associations$/],
  ["/announcements", /^Announcements$/],
  ["/login", /^Login$/],
  ["/register", /^Register$/],
  ["/unmatched-path", /couldn’t find that page/i],
];

function renderAt(path: string) {
  const router = createMemoryRouter(routeObjects, {
    initialEntries: [path],
  });

  render(<RouterProvider router={router} />);
  return router;
}

describe("application routes", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: "ok", service: "FloraConnect API" }),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the homepage", async () => {
    renderAt("/");

    expect(await screen.findByRole("heading", { level: 1 })).toBeVisible();
  });

  it.each(routeCases)("renders %s", async (path, heading) => {
    renderAt(path);

    expect(await screen.findByRole("heading", { name: heading })).toBeVisible();
  });

  it("navigates to a feature page without leaving the router", async () => {
    const router = renderAt("/");

    fireEvent.click(screen.getByRole("link", { name: "Get Started" }));

    expect(
      await screen.findByRole("heading", { name: "Register" }),
    ).toBeVisible();
    expect(router.state.location.pathname).toBe("/register");
  });
});
