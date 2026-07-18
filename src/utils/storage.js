import { CONSTANTS } from "../constants/globalConstants";
import { INITIAL_INVOICE_STATE } from "../constants/invoicePresets";

/**
 * ============================================================================
 * GENERIC INDEXEDDB PROMISE WRAPPER LAYER
 * ============================================================================
 */
export class GenericIndexedDB {
  constructor(dbName, version, objectStores) {
    this.dbName = dbName;
    this.version = version;
    this.objectStores = objectStores;
  }

  _openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        this.objectStores.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        });
      };

      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async put(storeName, key, value) {
    const db = await this._openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, key) {
    const db = await this._openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result !== undefined ? request.result : null);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    const db = await this._openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Bump version from 1 to 2 and expand the objectStores instantiation array to include "invoices"
const dbInstance = new GenericIndexedDB("InvoiceNowDB", 2, ["assets", "invoices"]);

export const assetStorage = {
  async saveLogo(base64String) {
    return dbInstance.put("assets", "business_logo", base64String);
  },
  async getLogo() {
    return dbInstance.get("assets", "business_logo");
  },
  async deleteLogo() {
    return dbInstance.delete("assets", "business_logo");
  },
};

/**
 * ============================================================================
 * BACKGROUND SHADOW WRITER UTILITIES
 * ============================================================================
 */
export const shadowPersistState = async (state) => {
  try {
    const pureTextState = { ...state };
    delete pureTextState.businessLogo;

    // Target the designated multi-document ID instead of the hardcoded "current" placeholder string
    const targetId = localStorage.getItem(CONSTANTS.ACTIVE_ID_KEY) || "current";
    await dbInstance.put("invoices", targetId, pureTextState);

    // Update the lightweight tracking descriptor values inside the registry layout
    updateRegistryMetadata(targetId, pureTextState);
  } catch (e) {
    // Silent catch prevents background database failures from disrupting active workflows
    console.warn("Background shadow storage replication caught:", e);
  }
};

/**
 * ============================================================================
 * TEXT-STATE LOCALSTORAGE LAYER (EXCLUDES BASE64 LOGO ASSETS)
 * ============================================================================
 */
export const loadCachedState = () => {
  try {
    const data = localStorage.getItem(CONSTANTS.STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_INVOICE_STATE;
  } catch (e) {
    console.error("Local data retrieval failed", e);
    return INITIAL_INVOICE_STATE;
  }
};

/**
 * ============================================================================
 * LEGACY MIGRATION INTERCEPTOR
 * ============================================================================
 */
export const extractAndMigrateLegacyLogo = () => {
  try {
    const data = localStorage.getItem(CONSTANTS.STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);
    if (parsed && parsed.businessLogo) {
      const legacyLogo = parsed.businessLogo;

      // Clean the legacy logo out of localStorage immediately to free up space
      delete parsed.businessLogo;
      localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(parsed));

      return legacyLogo;
    }
  } catch (e) {
    console.error("Failed to parse or extract legacy logo for migration", e);
  }
  return null;
};

export const persistState = (state) => {
  try {
    const pureTextState = { ...state };
    delete pureTextState.businessLogo;

    localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(pureTextState));
  } catch (e) {
    console.error("Local data cache write failed", e);
  }
};

/**
 * ============================================================================
 * HYBRID DATABASE MIGRATION & CORE ASYNCHRONOUS INITIALIZATION
 * ============================================================================
 */

// Helper to keep the registry index aligned during background saves
const updateRegistryMetadata = (id, pureTextState) => {
  try {
    const registryData = localStorage.getItem(CONSTANTS.REGISTRY_KEY);
    let registry = registryData ? JSON.parse(registryData) : [];

    const existingIndex = registry.findIndex((item) => item.id === id);
    const metadata = {
      id,
      invoiceNumber: pureTextState.invoiceNumber || "UNTITLED",
      clientName: pureTextState.customerName || pureTextState.businessName || "New Client",
      updatedAt: Date.now(),
    };

    if (existingIndex !== -1) {
      registry[existingIndex] = metadata;
    } else {
      registry.push(metadata);
    }

    localStorage.setItem(CONSTANTS.REGISTRY_KEY, JSON.stringify(registry));
  } catch (e) {
    console.error("Failed to update lightweight data directory map safely:", e);
  }
};

export const initializeAndMigrateDatabase = async () => {
  try {
    // 1. Check if the structural migration loop has already executed in the past
    let activeId = localStorage.getItem(CONSTANTS.ACTIVE_ID_KEY);
    if (activeId) {
      // User is already migrated, fetch active payload configuration block from IndexedDB
      const activeInvoice = await dbInstance.get("invoices", activeId);
      if (activeInvoice) return activeInvoice;
    }

    // 2. Intercept legacy data configurations trapped inside primitive storage
    const legacyTextData = localStorage.getItem(CONSTANTS.STORAGE_KEY);

    if (legacyTextData) {
      const parsedLegacyState = JSON.parse(legacyTextData);
      const newUuid = crypto.randomUUID();

      // Write parsed schema configurations directly into the modern IndexedDB architecture
      await dbInstance.put("invoices", newUuid, parsedLegacyState);

      // Create initial index record parameters within regional properties map
      const initialRegistry = [
        {
          id: newUuid,
          invoiceNumber: parsedLegacyState.invoiceNumber || "INV-2026-001",
          clientName: parsedLegacyState.customerName || "John Doe",
          updatedAt: Date.now(),
        },
      ];

      localStorage.setItem(CONSTANTS.REGISTRY_KEY, JSON.stringify(initialRegistry));
      localStorage.setItem(CONSTANTS.ACTIVE_ID_KEY, newUuid);

      return parsedLegacyState;
    }

    // 3. Check for the "current" temporary record fallback block
    const currentKeyFallback = await dbInstance.get("invoices", "current");
    if (currentKeyFallback) {
      const newUuid = crypto.randomUUID();
      await dbInstance.put("invoices", newUuid, currentKeyFallback);
      await dbInstance.delete("invoices", "current");

      const initialRegistry = [
        {
          id: newUuid,
          invoiceNumber: currentKeyFallback.invoiceNumber || "INV-2026-001",
          clientName: currentKeyFallback.customerName || "John Doe",
          updatedAt: Date.now(),
        },
      ];

      localStorage.setItem(CONSTANTS.REGISTRY_KEY, JSON.stringify(initialRegistry));
      localStorage.setItem(CONSTANTS.ACTIVE_ID_KEY, newUuid);

      return currentKeyFallback;
    }

    // 4. Fresh user scenario setup loop
    const freshUuid = crypto.randomUUID();
    localStorage.setItem(CONSTANTS.ACTIVE_ID_KEY, freshUuid);

    const freshRegistry = [
      {
        id: freshUuid,
        invoiceNumber: INITIAL_INVOICE_STATE.invoiceNumber,
        clientName: INITIAL_INVOICE_STATE.customerName || "John Doe",
        updatedAt: Date.now(),
      },
    ];

    localStorage.setItem(CONSTANTS.REGISTRY_KEY, JSON.stringify(freshRegistry));
    await dbInstance.put("invoices", freshUuid, INITIAL_INVOICE_STATE);

    return INITIAL_INVOICE_STATE;
  } catch (err) {
    console.error("Database structural migration execution tracking failed:", err);
    return loadCachedState();
  }
};

// Safe implementation to purge the legacy standalone localStorage trace parameters in following stages
export const purgeLegacyStorageKey = () => {
  try {
    localStorage.removeItem(CONSTANTS.STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear legacy schema item configuration mapping safely:", e);
  }
};
