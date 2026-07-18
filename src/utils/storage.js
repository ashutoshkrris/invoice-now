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

    // Persist completely stringified payload into the new background layer
    await dbInstance.put("invoices", "current", pureTextState);
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
