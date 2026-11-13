import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { routeObjects } from "./routes";

const routeCases: [string, RegExp][] = [
  ["/flowers", /^Flowers$/],
  ["/associations", /^Associations$/],
  ["/announcements", /^Announcements$/],
  ["/login", /^Login$/],
  ["/register", /^Register$/],
  ["/profile", /^Profile$/],
  ["/logout", /^Logout$/],
  ["/growers", /^Growers$/],
  ["/events", /^Events$/],
  ["/contact", /^Contact$/],
  ["/privacy", /^Privacy Policy$/],
  ["/terms", /^Terms of Service$/],
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

    expect(
      await screen.findByRole("heading", { name: heading }, { timeout: 4000 }),
    ).toBeVisible();
  });

  it.each([
    ["/", "Login", "/login"],
    ["/", "Register", "/register"],
    ["/events", "Login", "/login"],
    ["/events", "Register", "/register"],
  ])(
    "navigates from %s using the %s header action",
    async (source, label, destination) => {
      const router = renderAt(source);
      fireEvent.click(screen.getByRole("button", { name: "Search catalogue" }));
      const link = screen.getByRole("link", { name: label });
      expect(link).toHaveAttribute("href", destination);
      fireEvent.click(link);
      expect(await screen.findByRole("heading", { name: label })).toBeVisible();
      expect(router.state.location.pathname).toBe(destination);
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
      expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
      expect(screen.queryByRole("search")).not.toBeInTheDocument();
    },
  );

  it("opens and dismisses the mobile navigation with Escape", () => {
    renderAt("/");
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    const close = screen.getByRole("button", { name: "Close navigation" });
    expect(close).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(close, { key: "Escape" });
    expect(
      screen.getByRole("button", { name: "Open navigation" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile navigation after route navigation", async () => {
    const router = renderAt("/");
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    fireEvent.click(
      within(
        screen.getByRole("navigation", { name: "Main navigation" }),
      ).getByRole("link", { name: "Explore Flowers" }),
    );

    expect(
      await screen.findByRole("heading", { name: "Flowers" }),
    ).toBeVisible();
    expect(router.state.location.pathname).toBe("/flowers");
    expect(
      screen.getByRole("button", { name: "Open navigation" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("provides one main landmark and a working skip link", async () => {
    renderAt("/associations");

    expect(
      await screen.findByRole("heading", { name: "Associations" }),
    ).toBeVisible();
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "Skip to main content" }),
    ).toHaveAttribute("href", "#main");
    expect(
      screen.getByRole("link", { name: "Associations", current: "page" }),
    ).toBeVisible();
  });

  it("searches the catalogue from the header", async () => {
    const router = renderAt("/");
    fireEvent.click(screen.getByRole("button", { name: "Search catalogue" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Find a flower" }), {
      target: { value: "orchid" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(
      await screen.findByRole("heading", { name: "Orchid" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Rose" }),
    ).not.toBeInTheDocument();
    expect(router.state.location.search).toBe("?q=orchid");
  });

  it("clears filters after an empty catalogue search", async () => {
    const router = renderAt("/flowers?q=unavailable-flower");
    expect(
      await screen.findByRole("heading", { name: "No matching flowers" }),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(
      await screen.findByRole("heading", { name: "Acacia" }),
    ).toBeVisible();
    expect(router.state.location.search).toBe("");
  });

  it("paginates the complete catalogue and resets the page when searching", async () => {
    const router = renderAt("/flowers");
    await screen.findByRole("heading", { name: "Flowers" });
    expect(screen.getAllByRole("article")).toHaveLength(40);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(router.state.location.search).toBe("?page=2");
    expect(screen.getByText(/Page 2 of/)).toBeVisible();
    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search flowers" }),
      { target: { value: "Erythronium americanum" } },
    );
    expect(
      await screen.findByRole("heading", { name: "Adder's Tongue" }),
    ).toBeVisible();
    expect(router.state.location.search).not.toContain("page=");
  }, 15000);

  it("supports A to Z browsing and handles an invalid page number", async () => {
    renderAt("/flowers?page=-100");
    await screen.findByRole("heading", { name: "Flowers" });
    expect(screen.getByText(/Page 1 of/)).toBeVisible();
    fireEvent.change(
      screen.getByRole("combobox", { name: "Filter by first letter" }),
      { target: { value: "W" } },
    );
    expect(
      screen.getByRole("heading", { name: "Wreath Lechenaultia" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Acacia" }),
    ).not.toBeInTheDocument();
  });
});
