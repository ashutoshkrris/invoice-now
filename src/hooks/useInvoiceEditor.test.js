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

// Fully mock the storage module boundary line before tests execute
vi.mock("../utils/storage", () => ({
  loadCachedState: vi.fn(() => targetMockValue),
  persistState: vi.fn(),
  extractAndMigrateLegacyLogo: vi.fn(() => null),
  assetStorage: {
    getLogo: vi.fn(() => Promise.resolve(null)),
    saveLogo: vi.fn(() => Promise.resolve()),
    deleteLogo: vi.fn(() => Promise.resolve()),
  },
}));

// Re-import the mocked module hooks so we can check tracking assertions cleanly
import { assetStorage, extractAndMigrateLegacyLogo } from "../utils/storage";

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

describe("Logo Upload Pipeline & Guardrails with IndexedDB Storage", () => {
  const mockTriggerToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    targetMockValue = { ...baseMockState };
  });

  it("blocks file uploads that exceed the 1MB safety threshold and sets proper toast warnings", () => {
    const { result } = renderHook(() => useInvoiceEditor(mockTriggerToast));

    const giantFile = new File(["x".repeat(1.5 * 1024 * 1024)], "massive_logo.png", {
      type: "image/png",
    });

    const mockEvent = {
      target: {
        files: [giantFile],
        value: "C:\\fakepath\\massive_logo.png",
      },
    };

    act(() => {
      result.current.handleLogoUpload(mockEvent);
    });

    expect(mockTriggerToast).toHaveBeenCalledWith(
      "Upload failed: Logo size cannot exceed 1 MB.",
      "error"
    );
    expect(mockEvent.target.value).toBe("");
    // Adjusted to match the initial empty string state from your presets
    expect(result.current.invoice.businessLogo).toBe("");
  });

  it("blocks unsupported image formats (e.g. webp) and alerts the user via toast", () => {
    const { result } = renderHook(() => useInvoiceEditor(mockTriggerToast));

    const invalidFile = new File(["dummy_data"], "logo.webp", {
      type: "image/webp",
    });

    const mockEvent = {
      target: {
        files: [invalidFile],
        value: "C:\\fakepath\\logo.webp",
      },
    };

    act(() => {
      result.current.handleLogoUpload(mockEvent);
    });

    expect(mockTriggerToast).toHaveBeenCalledWith(
      "Upload failed: Only JPG, JPEG, and PNG formats are supported.",
      "error"
    );
    expect(mockEvent.target.value).toBe("");
    // Adjusted to match the initial empty string state from your presets
    expect(result.current.invoice.businessLogo).toBe("");
  });

  it("successfully passes safe images through the off-screen canvas scaling pipeline and hits IndexedDB", async () => {
    // 1. Mock FileReader API using a standard constructible function
    const mockFileReaderInstance = {
      readAsDataURL: vi.fn(function () {
        if (this.onload) {
          this.onload({ target: { result: "data:image/png;base64,mockRawString" } });
        }
      }),
    };
    vi.stubGlobal(
      "FileReader",
      vi.fn(function () {
        return mockFileReaderInstance;
      })
    );

    // 2. Mock Image API using a standard constructible function
    const mockImageInstance = {
      width: 800,
      height: 600,
      set src(val) {
        if (this.onload) this.onload();
      },
      get src() {
        return "data:image/png;base64,mockRawString";
      },
    };
    vi.stubGlobal(
      "Image",
      vi.fn(function () {
        return mockImageInstance;
      })
    );

    // 3. Mock Canvas element methods
    const mockContext2D = {
      drawImage: vi.fn(),
    };
    const mockCanvasElement = {
      getContext: vi.fn(() => mockContext2D),
      toDataURL: vi.fn(() => "data:image/png;base64,optimizedMicroPayload"),
      width: 0,
      height: 0,
    };

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "canvas") return mockCanvasElement;
      return originalCreateElement(tagName);
    });

    const { result } = renderHook(() => useInvoiceEditor(mockTriggerToast));

    const safeFile = new File(["x".repeat(200 * 1024)], "company_logo.png", {
      type: "image/png",
    });
    const mockEvent = { target: { files: [safeFile] } };

    await act(async () => {
      result.current.handleLogoUpload(mockEvent);
    });

    expect(mockCanvasElement.width).toBe(250);
    expect(mockCanvasElement.height).toBe(188);
    expect(mockContext2D.drawImage).toHaveBeenCalledWith(mockImageInstance, 0, 0, 250, 188);

    expect(assetStorage.saveLogo).toHaveBeenCalledWith(
      "data:image/png;base64,optimizedMicroPayload"
    );
    expect(result.current.invoice.businessLogo).toBe("data:image/png;base64,optimizedMicroPayload");

    // Adjusted to match the exact toast notification returned by your editor pipeline
    expect(mockTriggerToast).toHaveBeenCalledWith("Logo saved successfully.");
  });

  it("safely hydrates the application state when an existing logo asset exists in IndexedDB", async () => {
    vi.mocked(assetStorage.getLogo).mockResolvedValueOnce(
      "data:image/png;base64,preExistingLogoAsset"
    );

    let renderResult;
    await act(async () => {
      renderResult = renderHook(() => useInvoiceEditor(mockTriggerToast));
    });

    expect(assetStorage.getLogo).toHaveBeenCalled();
    expect(renderResult.result.current.invoice.businessLogo).toBe(
      "data:image/png;base64,preExistingLogoAsset"
    );
  });

  it("detects, migrates, and cleans up legacy logos found inside localStorage on mount", async () => {
    const legacyLogoMockString = "data:image/png;base64,oldLegacyStringTrappedInLocalStorage";

    // We can now use vi.mocked cleanly since the property is defined in our top-level factory
    vi.mocked(extractAndMigrateLegacyLogo).mockReturnValueOnce(legacyLogoMockString);
    vi.mocked(assetStorage.getLogo).mockResolvedValueOnce(null);

    let renderResult;
    await act(async () => {
      renderResult = renderHook(() => useInvoiceEditor(mockTriggerToast));
    });

    expect(extractAndMigrateLegacyLogo).toHaveBeenCalled();
    expect(assetStorage.saveLogo).toHaveBeenCalledWith(legacyLogoMockString);
    expect(renderResult.result.current.invoice.businessLogo).toBe(legacyLogoMockString);
  });

  it("clears the asset record out of IndexedDB and resets hook state when the logo is removed", async () => {
    const { result } = renderHook(() => useInvoiceEditor(mockTriggerToast));

    // Fast-track mock state to pretend a logo is currently active
    await act(async () => {
      result.current.updateField("businessLogo", "data:image/png;base64,activeLogoPayload");
    });
    expect(result.current.invoice.businessLogo).toBe("data:image/png;base64,activeLogoPayload");

    // Execute the removal operation
    await act(async () => {
      await result.current.handleLogoDelete();
    });

    // Assert the database interface was instructed to delete the file
    expect(assetStorage.deleteLogo).toHaveBeenCalled();
    // Assert the hook state fell back to an empty string
    expect(result.current.invoice.businessLogo).toBe("");
  });
});
