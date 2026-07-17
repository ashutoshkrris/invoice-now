import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TotalsSummary from "./TotalsSummary";

// Mock out the EditableField component to simulate standard inputs cleanly
vi.mock("../EditableField/EditableField", () => {
  return {
    default: ({ value, onChange, placeholder, className, type }) => {
      if (type === "textarea") {
        return (
          <textarea
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
          />
        );
      }
      return (
        <input
          type={type || "text"}
          value={value === undefined || value === null ? "" : value}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
        />
      );
    },
  };
});

describe("TotalsSummary Component", () => {
  const mockInvoice = {
    terms: "Payment within 30 days",
    notes: "Thanks for your business",
    discountScope: "subtotal",
    discountType: "percentage",
    globalDiscount: 10,
    taxScope: "subtotal",
    taxType: "percentage",
    globalTaxRate: 5,
    taxName: "GST",
    shippingCharges: 15,
    amountPaid: 50,
    brandColor: "#10b981",
  };

  const mockTotals = {
    subtotal: 100.0,
    discount: 10.0,
    tax: 4.5,
    grandTotal: 109.5,
    balanceDue: 59.5,
  };

  const defaultProps = {
    invoice: mockInvoice,
    onUpdateField: vi.fn(),
    totals: mockTotals,
    activeCurrencySymbol: "$",
    isExporting: false,
  };

  it("renders financial math values with decimal precision matching props", () => {
    render(<TotalsSummary {...defaultProps} />);

    expect(screen.getByTestId("subtotal-display")).toHaveTextContent("$100.00");
    expect(screen.getByTestId("grand-total-display")).toHaveTextContent("$109.50");
    expect(screen.getByTestId("balance-due-display")).toHaveTextContent("$59.50");
  });

  it("dispatches type updates immediately when discount calculation options shift", () => {
    const handleUpdate = vi.fn();
    render(<TotalsSummary {...defaultProps} onUpdateField={handleUpdate} />);

    const select = screen.getByLabelText("Discount Type");
    fireEvent.change(select, { target: { value: "flat" } });

    expect(handleUpdate).toHaveBeenCalledWith("discountType", "flat");
  });

  it("hides unpopulated rows during PDF exports to keep documents clean", () => {
    const emptyInvoice = {
      ...mockInvoice,
      globalDiscount: 0,
      globalTaxRate: 0,
      discountScope: "subtotal",
      taxScope: "subtotal",
    };
    const zeroTotals = { subtotal: 100, discount: 0, tax: 0, grandTotal: 100, balanceDue: 100 };

    render(
      <TotalsSummary
        {...defaultProps}
        invoice={emptyInvoice}
        totals={zeroTotals}
        isExporting={true}
      />
    );

    // Verify fields drop out during compilation
    expect(screen.queryByLabelText("Discount Type")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Tax Type")).not.toBeInTheDocument();
  });

  it("dispatches null states to drop optional fields like shipping completely", () => {
    const handleUpdate = vi.fn();
    render(<TotalsSummary {...defaultProps} onUpdateField={handleUpdate} />);

    // Query directly by the element's explicit HTML title property
    const removeBtn = screen.getByTitle("Remove shipping charges");
    fireEvent.click(removeBtn);

    expect(handleUpdate).toHaveBeenCalledWith("shippingCharges", null);
  });
});
