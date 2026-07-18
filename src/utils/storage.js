import { INITIAL_INVOICE_STATE } from "../constants/invoicePresets";

const STORAGE_KEY = "invoicenow_wysiwyg_state_v3";

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

// Instantiate specific shared instance for handling heavy assets
const dbInstance = new GenericIndexedDB("InvoiceNowDB", 1, ["assets"]);

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
 * TEXT-STATE LOCALSTORAGE LAYER (EXCLUDES BASE64 LOGO ASSETS)
 * ============================================================================
 */
export const loadCachedState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
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
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);
    if (parsed && parsed.businessLogo) {
      const legacyLogo = parsed.businessLogo;

      // Clean the legacy logo out of localStorage immediately to free up space
      delete parsed.businessLogo;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));

      return legacyLogo;
    }
  } catch (e) {
    console.error("Failed to parse or extract legacy logo for migration", e);
  }
  return null;
};

export const persistState = (state) => {
  try {
    // Strip the binary data image out before writing text to localStorage block
    const pureTextState = { ...state };
    delete pureTextState.businessLogo;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(pureTextState));
  } catch (e) {
    console.error("Local data cache write failed", e);
  }
};
