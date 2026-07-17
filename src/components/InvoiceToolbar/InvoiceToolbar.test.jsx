import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import InvoiceToolbar from "./InvoiceToolbar";

vi.mock("../Icons", () => ({
  Icons: {
    Undo: () => <span data-testid="icon-undo">Undo</span>,
    Redo: () => <span data-testid="icon-redo">Redo</span>,
    Settings: () => <span data-testid="icon-settings">Settings</span>,
  },
}));

vi.mock("../../constants/invoicePresets", () => ({
  BRAND_COLORS: [
    { hex: "#000000", label: "Black" },
    { hex: "#ff0000", label: "Red" },
  ],
}));

vi.mock("../../constants/countries", () => ({
  COUNTRIES: [
    { code: "IN", name: "India (₹)" },
    { code: "US", name: "United States ($)" },
  ],
}));

describe("InvoiceToolbar Component", () => {
  const mockInvoice = {
    countryCode: "IN",
    templateId: "classic",
    brandColor: "#000000",
    typography: "font-sans",
    paperSize: "a4",
    watermarkText: "DRAFT",
  };

  const defaultProps = {
    invoice: mockInvoice,
    historyIdx: 1,
    historyLength: 3,
    onUpdateField: vi.fn(),
    onCountryChange: vi.fn(),
    onUndo: vi.fn(),
    onRedo: vi.fn(),
  };

  it("disables the undo option button when historical indexing rests at 0 boundary states", () => {
    render(<InvoiceToolbar {...defaultProps} historyIdx={0} />);
    expect(screen.getByTitle("Undo")).toBeDisabled();
  });

  it("disables the redo action trigger button if pointer locations equal max length indexes", () => {
    render(<InvoiceToolbar {...defaultProps} historyIdx={2} historyLength={3} />);
    expect(screen.getByTitle("Redo")).toBeDisabled();
  });

  it("dispatches field mutations directly when dropdown selectors are toggled", () => {
    const handleUpdate = vi.fn();
    render(<InvoiceToolbar {...defaultProps} onUpdateField={handleUpdate} />);

    // Toggle the template dropdown view panel overlay layer opens
    fireEvent.click(screen.getByRole("button", { name: /toggle style template selector/i }));

    const option = screen.getByText("Modern Minimalist");
    fireEvent.click(option);

    expect(handleUpdate).toHaveBeenCalledWith("templateId", "modern-minimalist");
  });

  it("opens up custom watermark modal controls when the selector selects the custom option value", () => {
    render(<InvoiceToolbar {...defaultProps} />);

    // Toggle the new custom watermark picker component layer dropdown panel view list layout
    fireEvent.click(screen.getByRole("button", { name: /toggle watermark selector/i }));

    const customOption = screen.getByText("Custom Stamp");
    fireEvent.click(customOption);

    expect(screen.getByTestId("watermark-modal")).toBeInTheDocument();
  });

  it("closes the configuration window overlay when closing the modal overlay screen context", () => {
    render(<InvoiceToolbar {...defaultProps} />);

    // Open the watermark configuration portal element view layer loop
    fireEvent.click(screen.getByRole("button", { name: /toggle watermark selector/i }));
    fireEvent.click(screen.getByText("Custom Stamp"));
    expect(screen.getByTestId("watermark-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Overlay background layer"));
    expect(screen.queryByTestId("watermark-modal")).not.toBeInTheDocument();
  });
});
