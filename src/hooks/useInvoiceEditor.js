import { useState, useMemo } from "react";
import { INITIAL_INVOICE_STATE } from "../constants/invoicePresets";
import { COUNTRIES } from "../constants/countries";
import { loadCachedState, persistState } from "../utils/storage";

export function useInvoiceEditor(triggerToast) {
  const [invoice, setInvoice] = useState(loadCachedState);

  // --- HISTORICAL UNDO / REDO STATE STACK ---
  const [history, setHistory] = useState([JSON.stringify(INITIAL_INVOICE_STATE)]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const saveWithHistory = (newState) => {
    setInvoice(newState);
    persistState(newState);

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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("businessLogo", reader.result);
        triggerToast("Logo saved successfully.");
      };
      reader.readAsDataURL(file);
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
  };
}
