import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Toast from "./Toast";

describe("Toast Component", () => {
  beforeEach(() => {
    // Intercept native timing threads so we can control time manually
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore global timeline systems after each spec validation completes
    vi.restoreAllMocks();
  });

  it("renders the notification message text clearly", () => {
    render(<Toast message="Invoice saved!" type="success" onClose={() => {}} />);
    expect(screen.getByText("Invoice saved!")).toBeInTheDocument();
  });

  it("applies the correct styling theme modifier based on status type", () => {
    render(<Toast message="Error occurred" type="error" onClose={() => {}} />);
    const toast = screen.getByTestId("toast-container");
    expect(toast).toHaveClass("bg-rose-600");
  });

  it("falls back to informative styling patterns when provided an unmapped type", () => {
    render(<Toast message="Standard update" type="unknown" onClose={() => {}} />);
    const toast = screen.getByTestId("toast-container");
    expect(toast).toHaveClass("bg-brand-600");
  });

  it("triggers the onClose callback execution immediately upon close button click", async () => {
    const handleClose = vi.fn();
    render(<Toast message="Click me" type="info" onClose={handleClose} />);

    const closeBtn = screen.getByRole("button", { name: /close notification/i });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("fires the onClose notification dismiss pipeline after 2000ms timeout threshold", () => {
    const handleClose = vi.fn();
    render(<Toast message="Expiring soon" type="success" onClose={handleClose} />);

    expect(handleClose).not.toHaveBeenCalled();

    // Fast-forward fake timer clocks directly across the threshold line
    vi.advanceTimersByTime(2000);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
