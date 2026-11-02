import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingState } from "./LoadingState";

describe("LoadingState", () => {
  it("displays the default loading message", () => {
    render(<LoadingState />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays a custom loading message", () => {
    render(<LoadingState message="Loading owners..." />);

    expect(screen.getByText("Loading owners...")).toBeInTheDocument();
  });

  it("displays a loading spinner", () => {
    render(<LoadingState />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
