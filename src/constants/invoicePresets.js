export const BRAND_COLORS = [
  { hex: "#3b82f6", label: "Classic Blue" },
  { hex: "#10b981", label: "Emerald" },
  { hex: "#ef4444", label: "Crimson" },
  { hex: "#f59e0b", label: "Gold" },
  { hex: "#8b5cf6", label: "Amethyst" },
  { hex: "#1e293b", label: "Charcoal" },
];

export const getTodayDateString = () => {
  return new Date().toISOString().split("T")[0];
};

export const getDueDateString = (days = 14) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

export const INITIAL_INVOICE_STATE = {
  invoiceLabel: "INVOICE",
  businessName: "",
  businessLogo: "",
  businessAddress: "",
  businessPhone: "",
  businessEmail: "",
  businessWebsite: "",
  businessTaxId: "",
  businessRegId: "",

  invoiceNumber: "INV-2026-001",
  issueDate: getTodayDateString(),
  dueDate: getDueDateString(),
  countryCode: "IN",
  currencyCode: "INR",
  currencySymbol: "Γé╣",

  customerName: "",
  customerCompany: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  customerTaxId: "",

  items: [
    {
      name: "",
      description: "",
      qty: 0,
      price: 0,
      taxRate: 0,
      discount: 0,
    },
  ],

  shippingCharges: 0,
  amountPaid: 0,

  paymentInstructions: "",
  terms: "Please make the payment by the due date.",
  notes: "It was great doing business with you.",

  templateId: "classic",
  brandColor: "#3b82f6",
  typography: "font-sans",
  paperSize: "a4",
  watermarkText: "",

  taxScope: "none", // "none" | "item" | "subtotal"
  taxType: "percentage", // "percentage" | "flat"
  discountScope: "none", // "none" | "item" | "subtotal"
  discountType: "percentage", // "percentage" | "flat"

  taxName: "Tax",
  globalTaxRate: 0, // Handles both % or Flat depending on taxType
  globalDiscount: 0, // Handles both % or Flat depending on discountType
};
