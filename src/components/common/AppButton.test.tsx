import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AppButton } from "./AppButton";

describe("AppButton", () => {
  it("renders button text", () => {
    render(<AppButton>Save</AppButton>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();

    render(<AppButton onClick={onClick}>Save</AppButton>);

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disables the button while loading", () => {
    render(<AppButton loading>Save</AppButton>);

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();

    render(
      <AppButton disabled onClick={onClick}>
        Save
      </AppButton>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });
});
