import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("displays the error message", () => {
    render(<ErrorState message="Unable to load owners" />);

    expect(screen.getByText("Unable to load owners")).toBeInTheDocument();
  });

  it("shows Retry when onRetry is provided", () => {
    const onRetry = vi.fn();

    render(<ErrorState message="Request failed" onRetry={onRetry} />);

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("does not show Retry without onRetry", () => {
    render(<ErrorState message="Request failed" />);

    expect(
      screen.queryByRole("button", { name: "Retry" }),
    ).not.toBeInTheDocument();
  });
});
