import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ComponentProps } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import GrowerProfilePage from "./GrowerProfilePage";
import GrowersDirectoryPage from "./GrowersDirectoryPage";
import type { PublicGrower } from "./growerTypes";

const growers: PublicGrower[] = [
  {
    id: "asha-perera",
    displayName: "Asha Perera",
    profileImage: null,
    district: "Kandy",
    province: "Central Province",
    biography: "A flower grower based in the hills.",
    specialization: "Orchids",
    publishedFlowerPlants: [],
  },
  {
    id: "nimali-silva",
    displayName: "Nimali Silva",
    profileImage: "/nimali.jpg",
    district: "Galle",
    province: "Southern Province",
    biography: "Growing tropical flowers.",
    specialization: "Roses",
    publishedFlowerPlants: [],
  },
  {
    id: "malini-jay",
    displayName: "Malini Jay",
    profileImage: null,
    district: "Kandy",
    province: "Central Province",
    biography: "A local flower grower.",
    specialization: "Roses",
    publishedFlowerPlants: [],
  },
];

function renderDirectory(
  props: ComponentProps<typeof GrowersDirectoryPage> = {
    growers,
    status: "ready",
  },
) {
  return render(
    <MemoryRouter>
      <GrowersDirectoryPage {...props} />
    </MemoryRouter>,
  );
}

describe("growers directory UI", () => {
  it("combines name, district, and specialization filters", () => {
    renderDirectory();

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search growers by name" }),
      { target: { value: "asha" } },
    );
    fireEvent.change(screen.getByRole("combobox", { name: "District" }), {
      target: { value: "Kandy" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Specialization" }), {
      target: { value: "Orchids" },
    });

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "View Asha Perera's profile" }),
    ).toHaveAttribute("href", "/growers/asha-perera");
    expect(screen.getByText("1–1 of 1 growers")).toBeVisible();
  });

  it("resets filters after no matches", () => {
    renderDirectory();

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search growers by name" }),
      { target: { value: "unlisted grower" } },
    );
    expect(
      screen.getByRole("heading", { name: "No matching growers found" }),
    ).toBeVisible();

    fireEvent.click(
      within(
        screen.getByRole("heading", { name: "No matching growers found" })
          .parentElement!,
      ).getByRole("button", { name: "Reset Filters" }),
    );
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByText("1–3 of 3 growers")).toBeVisible();
  });

  it("shows twelve growers per page and updates results when paginating", () => {
    const thirteenGrowers = Array.from({ length: 13 }, (_, index) => ({
      ...growers[0],
      id: `grower-${index + 1}`,
      displayName: `Grower ${index + 1}`,
    }));
    renderDirectory({ growers: thirteenGrowers, status: "ready" });

    expect(screen.getAllByRole("article")).toHaveLength(12);
    expect(screen.getByText("1–12 of 13 growers")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("13–13 of 13 growers")).toBeVisible();
    expect(screen.getByText("Page 2 of 2")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getAllByRole("article")).toHaveLength(12);
  });

  it("shows the requested empty state only after a successful empty response", () => {
    renderDirectory({ growers: [], status: "ready" });

    expect(
      screen.getByRole("heading", {
        name: "No grower profiles available yet",
      }),
    ).toBeVisible();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("distinguishes unavailable data from an empty directory", () => {
    renderDirectory({ status: "unavailable", growers: [] });

    expect(
      screen.getByRole("heading", {
        name: "Grower directory is not available yet",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("searchbox", { name: "Search growers by name" }),
    ).toBeDisabled();
    expect(
      screen.queryByRole("heading", {
        name: "No grower profiles available yet",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows loading skeletons and provides an explicit retry after errors", () => {
    const onRetry = vi.fn();
    const { rerender } = renderDirectory({
      status: "loading",
      growers: [],
    });
    expect(screen.getByText("Loading grower profiles...")).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <GrowersDirectoryPage status="error" growers={[]} onRetry={onRetry} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe("grower profile UI", () => {
  it("shows public profile details and only published flower plants", () => {
    const grower: PublicGrower = {
      ...growers[0],
      publishedFlowerPlants: [
        {
          id: "pink-orchid",
          name: "Pink Orchid",
          image: null,
          category: "Orchids",
        },
      ],
    };

    render(
      <MemoryRouter initialEntries={["/growers/asha-perera"]}>
        <Routes>
          <Route
            path="/growers/:id"
            element={<GrowerProfilePage grower={grower} status="ready" />}
          />
          <Route path="/login" element={<h1>Login</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Asha Perera" })).toBeVisible();
    expect(screen.getByText("Kandy, Central Province")).toBeVisible();
    expect(
      screen.getByText("A flower grower based in the hills."),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Flower Plants from This Grower" }),
    ).toBeVisible();
    expect(screen.getByText("Pink Orchid")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "View Pink Orchid" }),
    ).toHaveAttribute("href", "/flowers/pink-orchid");
    expect(
      screen.getByText("Orchids", { selector: ".grower-plant-copy span" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Back to Growers" }),
    ).toHaveAttribute("href", "/growers");
    expect(screen.queryByText(/phone|email|address/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Send Inquiry" }));
    expect(screen.getByRole("heading", { name: "Login" })).toBeVisible();
  });

  it("keeps the profile destination for login and shows a listing empty state", () => {
    const grower = { ...growers[0], publishedFlowerPlants: [] };
    render(
      <MemoryRouter initialEntries={["/growers/asha-perera"]}>
        <Routes>
          <Route
            path="/growers/:id"
            element={<GrowerProfilePage grower={grower} status="ready" />}
          />
          <Route path="/login" element={<LoginDestination />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "No published flower plants yet" }),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("link", { name: "Send Inquiry" }));
    expect(screen.getByText("/growers/asha-perera")).toBeVisible();
  });

  it("shows separate not-found and unavailable profile states", () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/growers/unknown"]}>
        <Routes>
          <Route
            path="/growers/:id"
            element={<GrowerProfilePage status="not-found" />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "Grower profile not found" }),
    ).toBeVisible();

    rerender(
      <MemoryRouter initialEntries={["/growers/unknown"]}>
        <Routes>
          <Route
            path="/growers/:id"
            element={<GrowerProfilePage status="unavailable" />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", {
        name: "Grower profile is not available yet",
      }),
    ).toBeVisible();
  });
});

function LoginDestination() {
  const location = useLocation();
  const returnTo =
    typeof location.state === "object" &&
    location.state !== null &&
    "returnTo" in location.state &&
    typeof location.state.returnTo === "string"
      ? location.state.returnTo
      : "";
  return <p>{returnTo}</p>;
}
