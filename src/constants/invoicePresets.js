export const BRAND_COLORS = [
  { hex: "#3b82f6", label: "Classic Blue" },
  { hex: "#10b981", label: "Emerald" },
  { hex: "#ef4444", label: "Crimson" },
  { hex: "#f59e0b", label: "Gold" },
  { hex: "#8b5cf6", label: "Amethyst" },
  { hex: "#1e293b", label: "Charcoal" },
];

export const COUNTRIES = [
  {
    code: "US",
    name: "United States",
    currency: "USD",
    symbol: "$",
    taxName: "Sales Tax",
    defaultTaxRate: 0,
  },
  {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    symbol: "£",
    taxName: "VAT",
    defaultTaxRate: 20,
  },
  {
    code: "EU",
    name: "European Union",
    currency: "EUR",
    symbol: "€",
    taxName: "VAT",
    defaultTaxRate: 21,
  },
  { code: "IN", name: "India", currency: "INR", symbol: "₹", taxName: "GST", defaultTaxRate: 18 },
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    symbol: "C$",
    taxName: "GST/HST",
    defaultTaxRate: 5,
  },
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    symbol: "A$",
    taxName: "GST",
    defaultTaxRate: 10,
  },
  {
    code: "JP",
    name: "Japan",
    currency: "JPY",
    symbol: "¥",
    taxName: "Consumption Tax",
    defaultTaxRate: 10,
  },
  {
    code: "CUSTOM",
    name: "Custom Setup",
    currency: "USD",
    symbol: "$",
    taxName: "Tax",
    defaultTaxRate: 0,
  },
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
  currencySymbol: "₹",
  taxName: "Sales Tax",

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

  discountValue: 0,
  discountType: "percentage",
  shippingCharges: 0,
  additionalCharges: 0,
  amountPaid: 0,

  paymentInstructions: "",
  terms: "Please make the payment by the due date.",
  notes: "It was great doing business with you.",

  templateId: "classic",
  brandColor: "#3b82f6",
  typography: "font-sans",
  paperSize: "a4",
  watermarkText: "",
};
