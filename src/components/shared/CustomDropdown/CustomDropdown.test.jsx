import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CustomDropdown from "./CustomDropdown";

describe("CustomDropdown Shared Component", () => {
  const sampleOptions = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  const defaultProps = {
    label: "Style Template",
    options: sampleOptions,
    value: "a",
    onChange: vi.fn(),
  };

  it("renders the active option label descriptor string cleanly", () => {
    render(<CustomDropdown {...defaultProps} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
  });

  it("mounts the overlay selection panel upon action button click", () => {
    render(<CustomDropdown {...defaultProps} />);

    const button = screen.getByRole("button", { name: /toggle style template selector/i });
    fireEvent.click(button);

    expect(screen.getByTestId("custom-dropdown-portal")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("triggers the onChange handler callback immediately when an inner option is selected", () => {
    const handleChange = vi.fn();
    render(<CustomDropdown {...defaultProps} onChange={handleChange} />);

    fireEvent.click(screen.getByRole("button", { name: /toggle style template selector/i }));

    const targetOption = screen.getByText("Option B");
    fireEvent.click(targetOption);

    expect(handleChange).toHaveBeenCalledWith("b");
    expect(screen.queryByTestId("custom-dropdown-portal")).not.toBeInTheDocument();
  });
});
