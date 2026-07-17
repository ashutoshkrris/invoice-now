import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import InvoiceWorkspace from "./InvoiceWorkspace";

// Precise relative layout stub matching the workspace dependencies
vi.mock("../../templates/ClassicTemplate", () => ({
  default: ({ onAddLineItem }) => (
    <div data-testid="mock-classic-template">
      <button type="button" onClick={onAddLineItem}>
        Add Item Inside Template
      </button>
    </div>
  ),
}));

describe("InvoiceWorkspace Component", () => {
  const mockInvoice = {
    templateId: "classic",
    paperSize: "a4",
    watermarkText: "PAID",
    typography: "font-sans",
    items: [],
  };

  const mockTotals = { subtotal: 500, discount: 50, tax: 25, grandTotal: 475, balanceDue: 475 };

  const mockActions = {
    onUpdateField: vi.fn(),
    onUpdateNestedItem: vi.fn(),
    onRemoveLineItem: vi.fn(),
    onAddLineItem: vi.fn(),
    onLogoUpload: vi.fn(),
    onPrint: vi.fn(),
    onExportPNG: vi.fn(),
    onExportPDF: vi.fn(),
  };

  beforeEach(() => {
    // Replaced arrow stub with a constructable class to resolve "not a constructor" errors
    class MockIntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {
        return null;
      }
      unobserve() {
        return null;
      }
      disconnect() {
        return null;
      }
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  const renderWorkspace = (props = {}) => {
    return render(
      <MemoryRouter>
        <InvoiceWorkspace
          invoice={mockInvoice}
          totals={mockTotals}
          activeCurrencySymbol="$"
          isExporting={false}
          onActions={mockActions}
          {...props}
        />
      </MemoryRouter>
    );
  };

  it("mounts the requested active layout template sheet matching invoice properties", () => {
    renderWorkspace();
    expect(screen.getByTestId("mock-classic-template")).toBeInTheDocument();
    expect(screen.getByText("PAID")).toBeInTheDocument();
  });

  it("renders size dimensions indicators corresponding to current paperSize rules", () => {
    renderWorkspace();
    expect(screen.getByText("210mm x 297mm (A4)")).toBeInTheDocument();
  });

  it("forwards click triggers up to core handler pipelines from sub-template layers", () => {
    renderWorkspace();
    const addBtn = screen.getByRole("button", { name: "Add Item Inside Template" });
    fireEvent.click(addBtn);

    expect(mockActions.onAddLineItem).toHaveBeenCalledTimes(1);
  });
});
