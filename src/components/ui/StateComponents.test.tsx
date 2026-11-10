import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";

describe("shared UI states", () => {
  it("announces loading progress", () => {
    render(<LoadingState message="Loading flowers" />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading flowers");
  });

  it("announces errors and invokes retry actions", () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Could not load flowers" onRetry={onRetry} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not load flowers",
    );
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("renders a clear empty-state message", () => {
    render(<EmptyState title="No flowers" message="Try another search." />);

    expect(screen.getByRole("heading", { name: "No flowers" })).toBeVisible();
    expect(screen.getByText("Try another search.")).toBeVisible();
  });
});
