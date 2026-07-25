import { CONSTANTS } from "../constants/globalConstants";

export const getCopyrightYear = (startYear = 2026) => {
  const currentYear = new Date().getFullYear();
  return currentYear > startYear ? `${startYear}-${currentYear}` : `${startYear}`;
};

export const getAppVersion = () => {
  return __APP_VERSION__;
};

/**
 * Checks whether the provided input is a valid UPI Virtual Payment Address (VPA).
 *
 * A valid UPI ID follows the format:
 *   username@provider
 * Example:
 *   john.doe@okhdfcbank
 *   user123@ybl
 *
 * @param {string} input - The input string to validate.
 * @returns {boolean} Returns `true` if the input is a valid UPI ID; otherwise `false`.
 */
export const isUpiId = (input) => {
  if (typeof input !== "string") return false;
  return CONSTANTS.UPI_REGEX.test(input.trim());
};

/**
 * Formats a raw payment link or UPI ID into a standardized URI string.
 * If input is a raw UPI VPA (e.g., user@upi), constructs a full NPCI spec payment string
 * pre-filling payee name, balance due amount, transaction note, and currency.
 *
 * @param {string} input - Direct URL or raw UPI ID string
 * @param {Object} [invoice] - The current active invoice object state
 * @param {Object} [totals] - Calculated invoice totals object ({ balanceDue, grandTotal })
 * @returns {string} Formatted payment URI string or original trimmed URL
 */
export const getFormattedUriForPayment = (input, invoice, totals) => {
  if (!input || typeof input !== "string") return "";

  const trimmed = input.trim();

  // Check if the input is a raw UPI ID
  if (isUpiId(trimmed)) {
    const payeeName = encodeURIComponent(invoice?.businessName?.trim() || "Invoice Payment");
    const invoiceNum = invoice?.invoiceNumber?.trim()
      ? `${invoice.invoiceNumber.trim()}`
      : "Invoice";
    const note = encodeURIComponent(`${invoiceNum} - Invoice Now`);

    const rawAmount =
      typeof totals?.balanceDue === "number" && totals.balanceDue > 0
        ? totals.balanceDue
        : totals?.grandTotal || 0;

    const amountDue = Number(rawAmount);

    const params = [`pa=${trimmed}`, `tn=${note}`, `cu=INR`, `pn=${payeeName}`];

    // Only include amount if it's greater than 0
    if (amountDue > 0) {
      params.push(`am=${amountDue.toFixed(2)}`);
    }

    const uri = `upi://pay?${params.join("&")}`;

    return uri;
  }

  // Standard URLs (Stripe, PayPal, Wise, etc.) pass through as-is
  return trimmed;
};
