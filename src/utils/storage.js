import { INITIAL_INVOICE_STATE } from "../constants/invoicePresets";

const STORAGE_KEY = "invoicenow_wysiwyg_state_v3";

export const loadCachedState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_INVOICE_STATE;
  } catch (e) {
    console.error("Local data retrieval failed", e);
    return INITIAL_INVOICE_STATE;
  }
};

export const persistState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Local data cache write failed", e);
  }
};
