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

  async getAll(storeName) {
    const db = await this._openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);

      // Use standard getAll API supported by modern browsers
      const request = store.getAll();

      request.onsuccess = () => {
        // If items are stored directly with an external key (like key-value),
        // we want to map them back alongside their structural database keys.
        // But since we want keys paired with objects for deep migration, let's fetch entries manually using a cursor if needed, or read via openCursor:
        const entries = [];
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            entries.push({ key: cursor.key, value: cursor.value });
            cursor.continue();
          } else {
            resolve(entries);
          }
        };
        cursorRequest.onerror = () => reject(cursorRequest.error);
      };

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

    // If a concurrent cycle has just initialized the fresh registry configuration arrays,
    // immediately pivot to return that invoice structure instead of spawning an un-indexed zombie record block.
    const checkRegistry = localStorage.getItem(CONSTANTS.REGISTRY_KEY);
    if (checkRegistry) {
      const existingRegistry = JSON.parse(checkRegistry);
      if (existingRegistry && existingRegistry.length > 0) {
        const structuralFallbackId = existingRegistry[0].id;
        const activeInvoice = await dbInstance.get("invoices", structuralFallbackId);
        if (activeInvoice) return activeInvoice;
      }
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

/**
 * ============================================================================
 * MULTI-DOCUMENT WORKSPACE CRUD UTILITIES
 * ============================================================================
 */

/**
 * Fetches a single specific invoice state entry out of the IndexedDB primary vault layer
 * @param {string} id - Unique document identifier UUID
 * @returns {Promise<Object|null>}
 */
export const getInvoiceById = async (id) => {
  try {
    return await dbInstance.get("invoices", id);
  } catch (e) {
    console.error(`Failed to retrieve invoice target id ${id} from database storage:`, e);
    return null;
  }
};

/**
 * Creates a brand new document record block with isolated properties and saves it to tracking paths
 * @returns {Promise<Object>} The initialized state definition alongside the generated active tracking UUID
 */
export const createNewInvoiceWorkspace = async () => {
  const newUuid = crypto.randomUUID();

  // Clean initialization values based on standard workspace schemas
  const baseTemplate = {
    ...INITIAL_INVOICE_STATE,
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  };

  await dbInstance.put("invoices", newUuid, baseTemplate);
  updateRegistryMetadata(newUuid, baseTemplate);

  return { id: newUuid, payload: baseTemplate };
};

/**
 * Drops record entities entirely out of IndexedDB and purges references inside tracking maps
 * @param {string} id - The specific target tracking key UUID pointer intended for cascading drop execution
 * @returns {Promise<string|null>} Resolves with the next best available active ID string to switch view targets to
 */
export const deleteInvoiceWorkspace = async (id) => {
  try {
    // 1. Evict main payload configuration structures from database store mapping
    await dbInstance.delete("invoices", id);

    // 2. Clear out lightweight array parameters from index registry layout
    const registryData = localStorage.getItem(CONSTANTS.REGISTRY_KEY);
    let registry = registryData ? JSON.parse(registryData) : [];
    const filteredRegistry = registry.filter((item) => item.id !== id);
    localStorage.setItem(CONSTANTS.REGISTRY_KEY, JSON.stringify(filteredRegistry));

    // 3. Evaluate proper alternative workspaces fallback targets to safely return to application layers
    if (filteredRegistry.length > 0) {
      return filteredRegistry[filteredRegistry.length - 1].id;
    }

    // Completely empty database state fallback management initialization loop block
    const freshUuid = crypto.randomUUID();
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

    return freshUuid;
  } catch (e) {
    console.error(`Failed to delete invoice workspace target allocation for entry ${id}:`, e);
    return null;
  }
};

/**
 * Reads a target invoice state configuration, clones it, and assigns a new unique database identity pointer.
 * @param {string} sourceId - The unique identifier UUID of the invoice template to duplicate.
 * @returns {Promise<Object>} Resolves with the cloned payload and its newly minted workspace identity pointer.
 */
export const duplicateInvoiceWorkspace = async (sourceId) => {
  try {
    // 1. Pull down the exact source state structure from IndexedDB
    const sourceData = await dbInstance.get("invoices", sourceId);
    if (!sourceData) throw new Error(`Source workspace allocation ${sourceId} not found.`);

    // 2. Generate clean target identities and deep clone parameters
    const cloneUuid = crypto.randomUUID();
    const clonedPayload = {
      ...JSON.parse(JSON.stringify(sourceData)), // Deep copy to prevent pointer leaks
      invoiceNumber: `${sourceData.invoiceNumber || "INV"}-COPY`,
    };

    // 3. Write target clone payload down into the database layer
    await dbInstance.put("invoices", cloneUuid, clonedPayload);

    // 4. Force synchronous inline metadata indexing update
    updateRegistryMetadata(cloneUuid, clonedPayload);

    return { id: cloneUuid, payload: clonedPayload };
  } catch (e) {
    console.error("Database workspace duplication caught an execution block:", e);
    throw e;
  }
};

/**
 * Updates the workspace client name identifier within a target invoice document.
 * @param {string} id - Unique document workspace UUID
 * @param {string} nextClientName - The updated workspace/client name string
 * @returns {Promise<void>}
 */
export const renameInvoiceWorkspace = async (id, nextClientName) => {
  try {
    const data = await dbInstance.get("invoices", id);
    if (!data) throw new Error(`Target invoice workspace ${id} not found.`);

    // 1. Update the document payload properties inside IndexedDB
    data.clientName = nextClientName;
    await dbInstance.put("invoices", id, data);

    // 2. Synchronize the local metadata tracking indices map
    const registryData = localStorage.getItem(CONSTANTS.REGISTRY_KEY);
    let registry = registryData ? JSON.parse(registryData) : [];
    const index = registry.findIndex((item) => item.id === id);

    if (index !== -1) {
      registry[index].clientName = nextClientName;
      registry[index].updatedAt = Date.now();
      localStorage.setItem(CONSTANTS.REGISTRY_KEY, JSON.stringify(registry));
    }
  } catch (e) {
    console.error("Failed to rename target invoice workspace configuration records:", e);
    throw e;
  }
};

/**
 * ============================================================================
 * UNIVERSAL BACKUP ENGINE
 * ============================================================================
 */

/**
 * Compiles all registries, app states, full invoice schemas, and branding elements into a JSON string
 * @returns {Promise<string>} The complete serialized backup string
 */
export const exportFullBackupData = async () => {
  try {
    // 1. Extract localStorage structural maps
    const registry = JSON.parse(localStorage.getItem(CONSTANTS.REGISTRY_KEY) || "[]");
    const activeId = localStorage.getItem(CONSTANTS.ACTIVE_ID_KEY) || "";

    // 2. Fetch all raw full invoices from IndexedDB
    const rawInvoices = await dbInstance.getAll("invoices");
    // Format into a clean serializable object map
    const invoicesMap = {};
    rawInvoices.forEach((item) => {
      invoicesMap[item.key] = item.value;
    });

    // 3. Extract shared logo asset
    const logoAsset = await dbInstance.get("assets", "business_logo");

    // 4. Construct unified portable envelope bundle
    const backupEnvelope = {
      version: 1,
      exportedAt: Date.now(),
      meta: {
        application: "InvoiceNow",
        recordCount: rawInvoices.length,
      },
      storage: {
        registry,
        activeId,
      },
      database: {
        invoices: invoicesMap,
        logo: logoAsset,
      },
    };

    return JSON.stringify(backupEnvelope, null, 2);
  } catch (e) {
    console.error("Backup serialization string compilation failed:", e);
    throw new Error("Failed to compile workspace backup data.");
  }
};

/**
 * Validates, flushes, and safely hydratizes an incoming backup file envelope into live systems
 * @param {Object} backupData - Parsed JSON object incoming data envelope structure
 * @returns {Promise<string>} The new recommended active ID workspace string to lock states onto
 */
export const importFullBackupData = async (backupData) => {
  // 1. Structural Validation Integrity Guardrail Check
  if (!backupData || backupData.meta?.application !== "InvoiceNow" || !backupData.database) {
    throw new Error("Invalid file schema format. This file does not belong to InvoiceNow.");
  }

  try {
    const { storage, database } = backupData;
    const incomingInvoices = database.invoices || {};
    const incomingRegistry = storage?.registry || [];

    if (Object.keys(incomingInvoices).length === 0 || incomingRegistry.length === 0) {
      throw new Error("The backup file contains empty database profiles.");
    }

    // 2. Safely wipe existing workspace structures to prevent overlapping key pollution
    const activeRegistry = JSON.parse(localStorage.getItem(CONSTANTS.REGISTRY_KEY) || "[]");
    for (const item of activeRegistry) {
      await dbInstance.delete("invoices", item.id);
    }

    // 3. Populate deep invoice configurations into core database object store
    for (const [id, payload] of Object.entries(incomingInvoices)) {
      await dbInstance.put("invoices", id, payload);
    }

    // 4. Update the global design branding logo if contained in the payload package
    if (database.logo) {
      await dbInstance.put("assets", "business_logo", database.logo);
    } else {
      await dbInstance.delete("assets", "business_logo");
    }

    // 5. Restore primary application runtime index tracks
    localStorage.setItem(CONSTANTS.REGISTRY_KEY, JSON.stringify(incomingRegistry));

    // Choose fallback logic if the active incoming element doesn't align structurally
    const targetActiveId =
      storage.activeId && incomingInvoices[storage.activeId]
        ? storage.activeId
        : Object.keys(incomingInvoices)[0];

    localStorage.setItem(CONSTANTS.ACTIVE_ID_KEY, targetActiveId);

    return targetActiveId;
  } catch (e) {
    console.error("Data restoration transaction cycle aborted:", e);
    throw e;
  }
};
