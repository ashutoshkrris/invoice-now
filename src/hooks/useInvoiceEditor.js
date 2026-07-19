import { useState, useMemo, useEffect } from "react";
import { INITIAL_INVOICE_STATE } from "../constants/invoicePresets";
import { COUNTRIES } from "../constants/countries";
import {
  persistState,
  shadowPersistState,
  assetStorage,
  extractAndMigrateLegacyLogo,
  initializeAndMigrateDatabase,
  purgeLegacyStorageKey,
  getInvoiceById,
  createNewInvoiceWorkspace,
  deleteInvoiceWorkspace,
  duplicateInvoiceWorkspace,
  renameInvoiceWorkspace,
  exportFullBackupData,
  importFullBackupData,
} from "../utils/storage";
import { CONSTANTS } from "../constants/globalConstants";

export function useInvoiceEditor(triggerToast) {
  // Default workspace initialized to an empty template placeholder during DB resolution
  const [invoice, setInvoice] = useState(INITIAL_INVOICE_STATE);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeInvoiceId, setActiveInvoiceId] = useState(() => {
    return localStorage.getItem(CONSTANTS.ACTIVE_ID_KEY) || "";
  });
  const [invoiceRegistry, setInvoiceRegistry] = useState([]);

  // --- HISTORICAL UNDO / REDO STATE STACK ---
  const [history, setHistory] = useState([JSON.stringify(INITIAL_INVOICE_STATE)]);
  const [historyIdx, setHistoryIdx] = useState(0);

  // Sync state registry definitions whenever local tracking variables trigger change vectors
  const refreshRegistryCache = () => {
    try {
      const registryData = localStorage.getItem(CONSTANTS.REGISTRY_KEY);
      setInvoiceRegistry(registryData ? JSON.parse(registryData) : []);
    } catch (e) {
      console.error("Failed to read context tracking directories accurately:", e);
    }
  };

  // --- ASSET HYDRATION & LEGACY MIGRATION PIPELINE ---
  useEffect(() => {
    const loadAndMigrateAssets = async () => {
      try {
        // Asynchronously load deep state configuration from database
        const operationalState = await initializeAndMigrateDatabase();

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
        // Complete target application validation before dropping old schema keys
        const fullyHydratedState = { ...operationalState };
        if (logoAsset) {
          fullyHydratedState.businessLogo = logoAsset;
        }

        const currentActiveId = localStorage.getItem(CONSTANTS.ACTIVE_ID_KEY) || "";
        setActiveInvoiceId(currentActiveId);

        setInvoice(fullyHydratedState);
        setHistory([JSON.stringify(operationalState)]);
        setHistoryIdx(0);
        refreshRegistryCache();
        setIsHydrated(true);

        // Safely complete transactional loop by cleaning the old un-indexed storage space
        purgeLegacyStorageKey();
      } catch (err) {
        console.error("Failed to safely hydrate or migrate logo assets:", err);
        setIsHydrated(true);
      }
    };
    loadAndMigrateAssets();
  }, []);

  const saveWithHistory = async (newState) => {
    if (!isHydrated) return; // Guard mutations until initialization complete
    setInvoice(newState);
    persistState(newState);

    // Silently fork state to IndexedDB background engine
    await shadowPersistState(newState);

    const stringified = JSON.stringify(newState);
    const currentHistory = history.slice(0, historyIdx + 1);
    setHistory([...currentHistory, stringified]);
    setHistoryIdx(currentHistory.length);

    // Refresh lightweight directory components instantly to balance titles inside listings
    refreshRegistryCache();
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

      // Update the background database mirror on undo
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

  /**
   * ============================================================================
   * MULTI-DOCUMENT WORKSPACE LIFECYCLE HANDLERS
   * ============================================================================
   */

  /**
   * Switches views to a different designated document and targets isolated history queues
   * @param {string} targetId - Unique destination workspace pointer string
   */
  const switchInvoiceWorkspace = async (targetId) => {
    if (targetId === activeInvoiceId) return;

    try {
      setIsHydrated(false);
      const targetData = await getInvoiceById(targetId);

      if (targetData) {
        // Fetch any unified shared logo details securely attached inside IndexedDB
        const sharedLogo = await assetStorage.getLogo();
        const alignedState = { ...targetData };
        if (sharedLogo) {
          alignedState.businessLogo = sharedLogo;
        }

        // Lock in application details and wipe the tracking state history
        localStorage.setItem(CONSTANTS.ACTIVE_ID_KEY, targetId);
        setActiveInvoiceId(targetId);
        setInvoice(alignedState);
        setHistory([JSON.stringify(targetData)]);
        setHistoryIdx(0);
        persistState(targetData);
      }
      setIsHydrated(true);
      triggerToast("Workspace switched successfully.", "info");
    } catch (e) {
      console.error("Failed to transition invoice workspaces smoothly:", e);
      triggerToast("Failed to switch workspaces cleanly.", "error");
      setIsHydrated(true);
    }
  };

  /**
   * Triggers generation commands to launch entirely clean tracking templates
   */
  const handleCreateNewInvoice = async () => {
    try {
      setIsHydrated(false);
      const { id, payload } = await createNewInvoiceWorkspace();

      // Align logo references
      const currentLogo = await assetStorage.getLogo();
      const nextState = { ...payload };
      if (currentLogo) {
        nextState.businessLogo = currentLogo;
      }

      localStorage.setItem(CONSTANTS.ACTIVE_ID_KEY, id);
      setActiveInvoiceId(id);
      setInvoice(nextState);
      setHistory([JSON.stringify(payload)]);
      setHistoryIdx(0);
      persistState(payload);

      refreshRegistryCache();
      setIsHydrated(true);
      triggerToast("Created new invoice successfully.");
    } catch (e) {
      console.error("Workspace instantiation caught operational failure:", e);
      triggerToast("Failed to build a new invoice workflow.", "error");
      setIsHydrated(true);
    }
  };

  /**
   * Clears out target payloads and transitions back to stable workspace tracks
   * @param {string} targetId - Document ID target intended for removal processing
   */
  const handleDeleteInvoice = async (targetId) => {
    try {
      setIsHydrated(false);
      const standardFallbackId = await deleteInvoiceWorkspace(targetId);

      // If the current viewport is deleting itself, trigger automatic switching routines
      if (targetId === activeInvoiceId && standardFallbackId) {
        const nextData = await getInvoiceById(standardFallbackId);
        if (nextData) {
          const activeLogo = await assetStorage.getLogo();
          const targetPayload = { ...nextData };
          if (activeLogo) {
            targetPayload.businessLogo = activeLogo;
          }

          localStorage.setItem(CONSTANTS.ACTIVE_ID_KEY, standardFallbackId);
          setActiveInvoiceId(standardFallbackId);
          setInvoice(targetPayload);
          setHistory([JSON.stringify(nextData)]);
          setHistoryIdx(0);
          persistState(nextData);
        }
      }

      refreshRegistryCache();
      setIsHydrated(true);
      triggerToast("Invoice deleted successfully.", "success");
    } catch (e) {
      console.error("Cascade deletion processing caught a critical layer interruption:", e);
      triggerToast("Failed to completely evict target invoice properties.", "error");
      setIsHydrated(true);
    }
  };

  /**
   * Clones a target workspace, registers its indexing metadata, and transitions viewport focuses.
   * @param {string} targetId - Document ID target intended for cloning processing
   */
  const handleDuplicateInvoice = async (targetId) => {
    try {
      // Upper bound limit validation block check
      const currentLimit = CONSTANTS?.MAX_INVOICE_LIMIT || 25; // Fallback to 25 if needed
      if (invoiceRegistry.length >= currentLimit) {
        triggerToast(`Duplication failed. Maximum allowed is ${currentLimit} invoices.`, "warning");
        return;
      }

      setIsHydrated(false);
      const { id, payload } = await duplicateInvoiceWorkspace(targetId);

      // Extract unified shared asset logos cleanly from separate IndexedDB asset store
      const currentLogo = await assetStorage.getLogo();
      const nextState = { ...payload };
      if (currentLogo) {
        nextState.businessLogo = currentLogo;
      }

      // Transition global active identifiers and clear state history tracks
      localStorage.setItem(CONSTANTS.ACTIVE_ID_KEY, id);
      setActiveInvoiceId(id);
      setInvoice(nextState);
      setHistory([JSON.stringify(payload)]);
      setHistoryIdx(0);
      persistState(payload);

      refreshRegistryCache();
      setIsHydrated(true);
      triggerToast("Invoice duplicated successfully.", "success");
    } catch (e) {
      console.error("Workspace hook state duplication failed:", e);
      triggerToast("Failed to safely clone target invoice.", "error");
      setIsHydrated(true);
    }
  };

  /**
   * Modifies the primary client name/title string of a specific invoice workspace allocation.
   * @param {string} targetId - Document UUID target pointer
   * @param {string} nextClientName - The updated workspace identification title text string
   */
  const handleRenameInvoice = async (targetId, nextClientName) => {
    if (!nextClientName.trim()) {
      triggerToast("Workspace name cannot be empty.", "warning");
      return;
    }

    try {
      await renameInvoiceWorkspace(targetId, nextClientName.trim());

      // If the currently viewed invoice is renamed, synchronize active viewport state matrices
      if (targetId === activeInvoiceId) {
        setInvoice((prev) => {
          const updated = { ...prev, clientName: nextClientName.trim() };
          // Keep internal tracking history references correctly aligned
          const currentHistory = history.slice(0, historyIdx + 1);
          setHistory([...currentHistory, JSON.stringify(updated)]);
          setHistoryIdx(currentHistory.length);
          persistState(updated);
          return updated;
        });
      }

      refreshRegistryCache();
      triggerToast("Workspace renamed successfully.", "success");
    } catch (e) {
      console.error("Hook context processing caught a file rename exception block:", e);
      triggerToast("Failed to alter invoice workspace title details.", "error");
    }
  };

  /**
   * Generates a structural workspace JSON backup file download action
   */
  const handleExportBackup = async () => {
    try {
      const jsonString = await exportFullBackupData();

      // Build a standard download anchor link elements arrangement
      const dataBlob = new Blob([jsonString], { type: "application/json" });
      const downloadUrl = URL.createObjectURL(dataBlob);
      const tempAnchor = document.createElement("a");

      const fileTimestamp = new Date().toISOString().slice(0, 10);
      tempAnchor.href = downloadUrl;
      tempAnchor.download = `invoicenow_backup_${fileTimestamp}.json`;

      document.body.appendChild(tempAnchor);
      tempAnchor.click();

      // Teardown cleanup
      document.body.removeChild(tempAnchor);
      URL.revokeObjectURL(downloadUrl);

      triggerToast("Backup data file downloaded successfully.", "success");
    } catch (e) {
      console.error("Backup file generation process dropped out:", e);
      triggerToast("Failed to compile or export backup data files.", "error");
    }
  };

  /**
   * Parses, validates, and mounts an uploaded configuration bundle into the state engines
   * @param {File} fileObject - The uploaded JSON file element package
   */
  const handleImportBackup = async (fileObject) => {
    if (!fileObject) return;

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        const parsedRawJson = JSON.parse(e.target.result);
        setIsHydrated(false);

        // Run deep database initialization and transaction migration operations
        const replacementActiveId = await importFullBackupData(parsedRawJson);

        // Re-read configuration metrics from newly updated indexed tracking stores
        const operationalState = await getInvoiceById(replacementActiveId);
        const unifiedSharedLogo = await assetStorage.getLogo();

        const fullyHydratedState = { ...operationalState };
        if (unifiedSharedLogo) {
          fullyHydratedState.businessLogo = unifiedSharedLogo;
        }

        // Reset component memory stacks to match restored workspace parameters
        setActiveInvoiceId(replacementActiveId);
        setInvoice(fullyHydratedState);
        setHistory([JSON.stringify(operationalState)]);
        setHistoryIdx(0);
        persistState(operationalState);

        refreshRegistryCache();
        setIsHydrated(true);
        triggerToast("Workspace state restored from backup successfully!", "success");
      } catch (err) {
        console.error("Backup engine system extraction failure tracking:", err);
        triggerToast(err.message || "Failed to parse imported backup configuration file.", "error");
        setIsHydrated(true);
      }
    };

    fileReader.onerror = () => {
      triggerToast("Error reading the selected data file element.", "error");
    };

    fileReader.readAsText(fileObject);
  };

  return {
    invoice,
    isHydrated,
    activeInvoiceId,
    invoiceRegistry,
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
    switchInvoiceWorkspace,
    handleCreateNewInvoice,
    handleDeleteInvoice,
    handleDuplicateInvoice,
    handleRenameInvoice,
    handleExportBackup,
    handleImportBackup,
  };
}
