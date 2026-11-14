import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import GrowerFlowerCatalogue from "./GrowerFlowerCatalogue";
import type { GrowerFlowerListing } from "./growerFlowerListings";

const listings: GrowerFlowerListing[] = [
  {
    id: "orchid-kandy",
    name: "Orchid",
    image: "/orchid.jpg",
    plantType: "Orchids",
    location: "Kandy",
    growerId: "kandy-nursery",
    growerName: "Kandy Nursery",
    status: "PUBLISHED",
  },
  {
    id: "rose-colombo",
    name: "Rose",
    image: null,
    plantType: "Cut flowers",
    location: "Colombo",
    growerId: "colombo-grower",
    growerName: "Colombo Grower",
    status: "PUBLISHED",
  },
  {
    id: "draft-orchid",
    name: "Draft Orchid",
    image: null,
    plantType: "Orchids",
    location: "Kandy",
    growerId: "kandy-nursery",
    growerName: "Kandy Nursery",
    status: "DRAFT",
  },
];

function renderCatalogue(items = listings) {
  return render(
    <MemoryRouter>
      <GrowerFlowerCatalogue listings={items} />
    </MemoryRouter>,
  );
}

describe("grower flower catalogue", () => {
  it("combines search, type, location and grower filters", () => {
    renderCatalogue();

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search flower or plant name" }),
      { target: { value: "orchid" } },
    );
    fireEvent.change(screen.getByRole("combobox", { name: "Plant type" }), {
      target: { value: "Orchids" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Location" }), {
      target: { value: "Kandy" },
    });
    fireEvent.change(
      screen.getByRole("combobox", { name: "Grower or nursery" }),
      { target: { value: "kandy-nursery" } },
    );

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "View Orchid" })).toHaveAttribute(
      "href",
      "/flowers/orchid-kandy",
    );
    expect(screen.getByRole("link", { name: "Kandy Nursery" })).toHaveAttribute(
      "href",
      "/growers/kandy-nursery",
    );
    expect(screen.getByText("1–1 of 1 listings")).toBeVisible();
  });

  it("resets a no-match search to the published listings", () => {
    renderCatalogue();

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search flower or plant name" }),
      { target: { value: "unavailable" } },
    );
    expect(screen.getByText("No matching plants found")).toBeVisible();

    const emptyResult = screen.getByText(
      "No matching plants found",
    ).parentElement!;
    fireEvent.click(
      within(emptyResult).getByRole("button", { name: "Reset Filters" }),
    );

    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.queryByText("Draft Orchid")).not.toBeInTheDocument();
  });

  it("shows 12 listings per page and hides pagination when unnecessary", () => {
    const thirteenListings = Array.from({ length: 13 }, (_, index) => ({
      ...listings[0],
      id: `orchid-${index + 1}`,
      name: `Orchid ${index + 1}`,
    }));
    renderCatalogue(thirteenListings);

    expect(screen.getAllByRole("article")).toHaveLength(12);
    expect(screen.getByText("1–12 of 13 listings")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("13–13 of 13 listings")).toBeVisible();
    expect(screen.getByText("Page 2 of 2")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getAllByRole("article")).toHaveLength(12);
  });

  it("hides pagination when one page is enough", () => {
    renderCatalogue([listings[0]]);
    expect(
      screen.queryByRole("navigation", { name: "Grower listing pages" }),
    ).not.toBeInTheDocument();
  });
});
