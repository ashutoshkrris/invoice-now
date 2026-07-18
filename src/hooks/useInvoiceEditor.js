import { useState, useMemo, useEffect } from "react";
import { INITIAL_INVOICE_STATE } from "../constants/invoicePresets";
import { COUNTRIES } from "../constants/countries";
import {
  loadCachedState,
  persistState,
  shadowPersistState,
  assetStorage,
  extractAndMigrateLegacyLogo,
} from "../utils/storage";
import { CONSTANTS } from "../constants/globalConstants";

export function useInvoiceEditor(triggerToast) {
  const [invoice, setInvoice] = useState(loadCachedState);

  // --- HISTORICAL UNDO / REDO STATE STACK ---
  const [history, setHistory] = useState([JSON.stringify(INITIAL_INVOICE_STATE)]);
  const [historyIdx, setHistoryIdx] = useState(0);

  // --- ASSET HYDRATION & LEGACY MIGRATION PIPELINE ---
  useEffect(() => {
    const loadAndMigrateAssets = async () => {
      try {
        // 1. Try to fetch from modern IndexedDB storage first
        let logoAsset = await assetStorage.getLogo();

        // 2. Fallback: Check if there's a legacy logo trapped in localStorage
        if (!logoAsset) {
          const legacyLogo = extractAndMigrateLegacyLogo();
          if (legacyLogo) {
            // Silently migrate to IndexedDB in the background
            await assetStorage.saveLogo(legacyLogo);
            logoAsset = legacyLogo;
          }
        }

        // 3. Hydrate state if a logo was found in either layer
        if (logoAsset) {
          setInvoice((prev) => ({ ...prev, businessLogo: logoAsset }));
        }
      } catch (err) {
        console.error("Failed to safely hydrate or migrate logo assets:", err);
      }
    };
    loadAndMigrateAssets();
  }, []);

  const saveWithHistory = (newState) => {
    setInvoice(newState);
    persistState(newState);

    // Silently fork state to IndexedDB background engine
    shadowPersistState(newState);

    const stringified = JSON.stringify(newState);
    const currentHistory = history.slice(0, historyIdx + 1);
    setHistory([...currentHistory, stringified]);
    setHistoryIdx(currentHistory.length);
  };

  const updateField = (key, value) => {
    const updated = { ...invoice, [key]: value };
    saveWithHistory(updated);
  };

  const updateNestedItem = (idx, key, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[idx] = { ...updatedItems[idx], [key]: value };
    const updated = { ...invoice, items: updatedItems };
    saveWithHistory(updated);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      setHistoryIdx(prevIdx);
      const restored = JSON.parse(history[prevIdx]);
      setInvoice(restored);
      persistState(restored);

      // MILESTONE 1 CHANGE: Update the background database mirror on undo
      shadowPersistState(restored);

      triggerToast("Changes Undone", "info");
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      const restored = JSON.parse(history[nextIdx]);
      setInvoice(restored);
      persistState(restored);

      // Update the background database mirror on redo
      shadowPersistState(restored);

      triggerToast("Changes Redone", "info");
    }
  };

  const addLineItem = () => {
    const newItem = { name: "", description: "", qty: 1, price: 0, taxRate: 0, discount: 0 };
    const updated = { ...invoice, items: [...invoice.items, newItem] };
    saveWithHistory(updated);
    triggerToast("New item added to invoice layout");
  };

  const removeLineItem = (idx) => {
    if (invoice.items.length <= 1) {
      triggerToast("Invoice must have at least one line item.", "error");
      return;
    }
    const updatedItems = invoice.items.filter((_, i) => i !== idx);
    const updated = { ...invoice, items: updatedItems };
    saveWithHistory(updated);
    triggerToast("Line item deleted", "error");
  };

  const handleCountryChange = (countryCode) => {
    const preset = COUNTRIES.find((c) => c.code === countryCode);
    if (!preset) return;

    const updatedItems = invoice.items.map((item) => ({
      ...item,
      taxRate: preset.defaultTaxRate,
    }));

    const updated = {
      ...invoice,
      countryCode,
      currencyCode: preset.currency,
      currencySymbol: preset.symbol,
      taxName: preset.taxName,
      items: updatedItems,
    };

    saveWithHistory(updated);
    triggerToast(`Updated layout settings to ${preset.name} format!`);
  };

  // --- LIVE INVOICE FINANCIAL ARITHMETIC ---
  const calculatedTotals = useMemo(() => {
    let rawItemSubtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    let itemSubtotalAfterDiscounts = 0;

    invoice.items.forEach((item) => {
      const qty = parseInt(item.qty, 10) || 0;
      const price = parseFloat(item.price) || 0;
      const rawSub = qty * price;

      rawItemSubtotal += rawSub;

      let rowDiscount = 0;
      if (invoice.discountScope === "item") {
        const discount = parseFloat(item.discount) || 0;
        rowDiscount = invoice.discountType === "percentage" ? (rawSub * discount) / 100 : discount;
      }
      totalDiscount += rowDiscount;
      const runningSubtotal = rawSub - rowDiscount;
      itemSubtotalAfterDiscounts += runningSubtotal;

      let rowTax = 0;
      if (invoice.taxScope === "item") {
        const taxRate = parseFloat(item.taxRate) || 0;
        rowTax = invoice.taxType === "percentage" ? (runningSubtotal * taxRate) / 100 : taxRate;
        totalTax += rowTax;
      }
    });

    let globalDiscountAmount = 0;
    if (invoice.discountScope === "subtotal") {
      const globalDisc = parseFloat(invoice.globalDiscount) || 0;
      globalDiscountAmount =
        invoice.discountType === "flat"
          ? globalDisc
          : (itemSubtotalAfterDiscounts * globalDisc) / 100;
      totalDiscount += globalDiscountAmount;
    }

    if (invoice.taxScope === "subtotal") {
      const globalTax = parseFloat(invoice.globalTaxRate) || 0;
      const taxBase = itemSubtotalAfterDiscounts - globalDiscountAmount;
      const globalTaxAmount = invoice.taxType === "flat" ? globalTax : (taxBase * globalTax) / 100;
      totalTax += globalTaxAmount;
    }

    const shipping = parseFloat(invoice.shippingCharges) || 0;
    const grandTotal = rawItemSubtotal - totalDiscount + totalTax + shipping;
    const paid = parseFloat(invoice.amountPaid) || 0;

    return {
      subtotal: rawItemSubtotal,
      discount: totalDiscount,
      tax: totalTax,
      grandTotal,
      balanceDue: grandTotal - paid,
    };
  }, [invoice]);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Guardrail Check: Allowed File Types
    if (!CONSTANTS.ALLOWED_TYPES_FOR_LOGO.includes(file.type)) {
      triggerToast("Upload failed: Only JPG, JPEG, and PNG formats are supported.", "error");
      e.target.value = ""; // Reset file input
      return;
    }

    // 2. Guardrail Check: Size limit validation
    const maxSizeBytes = CONSTANTS.LOGO_SIZE_IN_MB * 1024 * 1024; // 1MB
    if (file.size > maxSizeBytes) {
      triggerToast(
        `Upload failed: Logo size cannot exceed ${CONSTANTS.LOGO_SIZE_IN_MB} MB.`,
        "error"
      );
      e.target.value = ""; // Clear file input field string
      return;
    }

    // 3. Off-screen optimization pipeline
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio safe scaling boundaries
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        // Initialize canvas pipeline
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          triggerToast("Failed to process image optimization.", "error");
          return;
        }

        // Render target image into context boundaries
        ctx.drawImage(img, 0, 0, width, height);

        // Compress canvas output to a lightweight PNG Base64 payload
        const optimizedBase64 = canvas.toDataURL("image/png");

        try {
          // Store asset asynchronously inside modern database layer
          await assetStorage.saveLogo(optimizedBase64);

          // Save processed structure to application stack
          updateField("businessLogo", optimizedBase64);
          triggerToast("Logo saved successfully.");
        } catch (error) {
          console.error("Failed to store optimized asset layout securely.", error);
          triggerToast("Failed to store optimized asset layout securely.", "error");
        }
      };

      img.onerror = () => {
        triggerToast("Invalid image file format.", "error");
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleLogoDelete = async () => {
    try {
      // 1. Wipe the asset record from modern IndexedDB completely
      await assetStorage.deleteLogo();

      // 2. Clear out the field state and update history stacks smoothly
      const updated = { ...invoice, businessLogo: "" };
      saveWithHistory(updated);

      triggerToast("Logo removed successfully.", "info");
    } catch (error) {
      console.error("Failed to delete logo asset cleanly from database layer:", error);
      triggerToast("Failed to remove logo asset securely.", "error");
    }
  };

  return {
    invoice,
    historyIdx,
    historyLength: history.length,
    calculatedTotals,
    updateField,
    updateNestedItem,
    handleUndo,
    handleRedo,
    addLineItem,
    removeLineItem,
    handleCountryChange,
    handleLogoUpload,
    handleLogoDelete,
  };
}
