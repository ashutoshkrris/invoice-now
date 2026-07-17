import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useInvoiceEditor } from "./useInvoiceEditor";
import { INITIAL_INVOICE_STATE } from "../constants/invoicePresets";

// Define a stable workspace mock baseline at the very top level scope
const baseMockState = {
  ...INITIAL_INVOICE_STATE,
  items: [{ name: "", description: "", qty: 1, price: 0, taxRate: 0, discount: 0 }],
};

// Hoist a clean variable target to swap values dynamically inside test scopes
let targetMockValue = { ...baseMockState };

vi.mock("../utils/storage", () => ({
  loadCachedState: vi.fn(() => targetMockValue),
  persistState: vi.fn(),
}));

describe("useInvoiceEditor Custom Hook", () => {
  const mockTriggerToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    targetMockValue = { ...baseMockState };
  });

  it("initializes with core preset parameters and standard currency calculations", () => {
    const { result } = renderHook(() => useInvoiceEditor(mockTriggerToast));

    expect(result.current.invoice).toBeDefined();
    expect(result.current.calculatedTotals.subtotal).toBe(0);
    expect(result.current.historyIdx).toBe(0);
  });

  it("calculates extension line totals accurately when row prices mutate", () => {
    const { result } = renderHook(() => useInvoiceEditor(mockTriggerToast));

    act(() => {
      result.current.updateNestedItem(0, "qty", 2);
    });

    act(() => {
      result.current.updateNestedItem(0, "price", 150);
    });

    expect(result.current.calculatedTotals.subtotal).toBe(300);
    expect(result.current.calculatedTotals.grandTotal).toBe(300);
  });

  it("traverses historical pointer states backwards when triggering undo mutations", () => {
    const { result } = renderHook(() => useInvoiceEditor(mockTriggerToast));

    act(() => {
      result.current.updateField("invoiceNumber", "INV-2026");
    });
    expect(result.current.invoice.invoiceNumber).toBe("INV-2026");

    act(() => {
      result.current.handleUndo();
    });

    expect(result.current.invoice.invoiceNumber).not.toBe("INV-2026");
    expect(mockTriggerToast).toHaveBeenCalledWith("Changes Undone", "info");
  });

  it("appends new structural row templates cleanly into the items container array", () => {
    const { result } = renderHook(() => useInvoiceEditor(mockTriggerToast));
    const baselineLength = result.current.invoice.items.length;

    act(() => {
      result.current.addLineItem();
    });

    expect(result.current.invoice.items.length).toBe(baselineLength + 1);
    expect(mockTriggerToast).toHaveBeenCalledWith("New item added to invoice layout");
  });
});

describe("Live Financial Calculation Matrices", () => {
  const mockTriggerToast = vi.fn();

  it("Scenario A: Handles per-item percentage taxes and per-item flat discounts", () => {
    targetMockValue = {
      discountScope: "item",
      discountType: "flat",
      taxScope: "item",
      taxType: "percentage",
      shippingCharges: 0,
      amountPaid: 0,
      items: [
        {
          qty: 2,
          price: 100.0,
          discount: 20.0,
          taxRate: 10,
        },
      ],
    };

    const { result } = renderHook(() => useInvoiceEditor(mockTriggerToast));

    expect(result.current.calculatedTotals.subtotal).toBe(200.0);
    expect(result.current.calculatedTotals.discount).toBe(20.0);
    expect(result.current.calculatedTotals.tax).toBe(18.0);
    expect(result.current.calculatedTotals.grandTotal).toBe(198.0);
  });

  it("Scenario B: Handles global subtotal percentage discounts and global flat taxes", () => {
    targetMockValue = {
      discountScope: "subtotal",
      discountType: "percentage",
      taxScope: "subtotal",
      taxType: "flat",
      globalDiscount: 10,
      globalTaxRate: 15.0,
      shippingCharges: 20.0,
      amountPaid: 50.0,
      items: [
        { qty: 2, price: 100.0, discount: 0, taxRate: 0 },
        { qty: 1, price: 50.0, discount: 0, taxRate: 0 },
      ],
    };

    const { result } = renderHook(() => useInvoiceEditor(mockTriggerToast));

    expect(result.current.calculatedTotals.subtotal).toBe(250.0);
    expect(result.current.calculatedTotals.discount).toBe(25.0);
    expect(result.current.calculatedTotals.tax).toBe(15.0);
    expect(result.current.calculatedTotals.grandTotal).toBe(260.0);
    expect(result.current.calculatedTotals.balanceDue).toBe(210.0);
  });

  it("Scenario C: Handles global subtotal flat discounts and global percentage taxes", () => {
    targetMockValue = {
      discountScope: "subtotal",
      discountType: "flat",
      taxScope: "subtotal",
      taxType: "percentage",
      globalDiscount: 50.0,
      globalTaxRate: 5,
      shippingCharges: 0,
      amountPaid: 0,
      items: [{ qty: 1, price: 250.0, discount: 0, taxRate: 0 }],
    };

    const { result } = renderHook(() => useInvoiceEditor(mockTriggerToast));

    expect(result.current.calculatedTotals.subtotal).toBe(250.0);
    expect(result.current.calculatedTotals.discount).toBe(50.0);
    expect(result.current.calculatedTotals.tax).toBe(10.0);
    expect(result.current.calculatedTotals.grandTotal).toBe(210.0);
  });

  it("Scenario D: Ensures clean calculation fallbacks when scopes are turned off ('none')", () => {
    targetMockValue = {
      discountScope: "none",
      taxScope: "none",
      shippingCharges: 10.0,
      amountPaid: 0,
      items: [{ qty: 1, price: 100.0, discount: 50, taxRate: 20 }],
    };

    const { result } = renderHook(() => useInvoiceEditor(mockTriggerToast));

    expect(result.current.calculatedTotals.subtotal).toBe(100.0);
    expect(result.current.calculatedTotals.discount).toBe(0.0);
    expect(result.current.calculatedTotals.tax).toBe(0.0);
    expect(result.current.calculatedTotals.grandTotal).toBe(110.0);
  });
});
