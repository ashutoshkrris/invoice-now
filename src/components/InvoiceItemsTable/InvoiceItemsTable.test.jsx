import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import InvoiceItemsTable from "./InvoiceItemsTable";

// Isolate table rendering parameters from standard input blocks
vi.mock("../EditableField/EditableField", () => {
  return {
    default: ({ value, onChange, placeholder, className, type }) => (
      <input
        type={type || "text"}
        value={value === undefined || value === null ? "" : value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        data-testid="editable-input"
      />
    ),
  };
});

vi.mock("../Icons", () => ({
  Icons: {
    Trash: () => <span data-testid="mock-trash">✕</span>,
    Plus: () => <span data-testid="mock-plus">+</span>,
  },
}));

describe("InvoiceItemsTable Component", () => {
  const mockItems = [
    {
      name: "Consulting",
      description: "Web Dev Services",
      price: 100,
      qty: 2,
      taxRate: 5,
      discount: 10,
    },
  ];

  const mockInvoice = {
    taxScope: "item",
    taxType: "percentage",
    taxName: "GST",
    discountScope: "item",
    discountType: "percentage",
    items: mockItems,
  };

  const defaultProps = {
    invoice: mockInvoice,
    onUpdateField: vi.fn(),
    onUpdateNestedItem: vi.fn(),
    onRemoveLineItem: vi.fn(),
    onAddLineItem: vi.fn(),
    activeCurrencySymbol: "$",
    isExporting: false,
  };

  it("calculates extension totals correctly matching row rates and parameters", () => {
    render(<InvoiceItemsTable {...defaultProps} />);

    // Raw Subtotal: 100 * 2 = 200
    // Item Discount (10%): 20
    // Row Subtotal: 180
    // Item Tax (5% of 180): 9
    // Final Expected Line Total: 189.00

    // Fetch all occurrences across mobile card and desktop views
    const totalDisplays = screen.getAllByText("$189.00");
    expect(totalDisplays.length).toBeGreaterThan(0);
    expect(totalDisplays[0]).toBeInTheDocument();
  });

  it("fires field mutations when top-level allocation scopes are adjusted", () => {
    const handleUpdateField = vi.fn();
    render(<InvoiceItemsTable {...defaultProps} onUpdateField={handleUpdateField} />);

    // Get both "Off" scope buttons (Tax Allocation and Discount Allocation)
    const offButtons = screen.getAllByRole("button", { name: "Off" });

    // Click the first one (Tax Allocation Scope)
    fireEvent.click(offButtons[0]);

    expect(handleUpdateField).toHaveBeenCalledWith("taxScope", "none");
  });

  it("triggers deep item row deletions immediately upon user event interaction", () => {
    const handleRemoveItem = vi.fn();
    render(<InvoiceItemsTable {...defaultProps} onRemoveLineItem={handleRemoveItem} />);

    const removeBtn = screen.getByTitle("Delete Desktop Item 1");
    fireEvent.click(removeBtn);

    expect(handleRemoveItem).toHaveBeenCalledWith(0);
  });

  it("dispatches structural insertions when clicking the new row row button layout", () => {
    const handleAddItem = vi.fn();
    render(<InvoiceItemsTable {...defaultProps} onAddLineItem={handleAddItem} />);

    const addBtn = screen.getByRole("button", { name: /add new item row/i });
    fireEvent.click(addBtn);

    expect(handleAddItem).toHaveBeenCalledTimes(1);
  });

  it("omits allocation scopes and action buttons completely during file compilation exports", () => {
    render(<InvoiceItemsTable {...defaultProps} isExporting={true} />);

    expect(screen.queryByText("Tax Allocation Scope")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /add new item row/i })).not.toBeInTheDocument();
  });
});
