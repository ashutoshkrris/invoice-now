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

export const getTodayDateString = () => "2026-07-05";
export const getDueDateString = () => "2026-07-19";

export const INITIAL_INVOICE_STATE = {
  invoiceLabel: "INVOICE",
  businessName: "Vortex Tech Labs LLC",
  businessLogo: "",
  businessAddress: "500 Innovation Parkway, Suite 100\nSan Francisco, CA 94107",
  businessPhone: "+1 (555) 444-3322",
  businessEmail: "billing@vortextech.com",
  businessWebsite: "www.vortextech.com",
  businessTaxId: "US-111222333",
  businessRegId: "REG-999888777",

  invoiceNumber: "INV-2026-042",
  issueDate: getTodayDateString(),
  dueDate: getDueDateString(),
  countryCode: "US",
  currencyCode: "USD",
  currencySymbol: "$",
  taxName: "Sales Tax",

  customerName: "Sarah Connor",
  customerCompany: "Cyberdyne Systems",
  customerEmail: "s.connor@cyberdyne.io",
  customerPhone: "+1 (555) 987-6543",
  customerAddress: "742 Cybernetic Blvd\nLos Angeles, CA 90210",
  customerTaxId: "US-888777666",

  items: [
    {
      name: "SaaS Architecture Consultation",
      description: "Interactive design scaling blueprint planning hourly session",
      qty: 12,
      price: 150,
      taxRate: 8,
      discount: 0,
    },
  ],

  discountValue: 5,
  discountType: "percentage",
  shippingCharges: 25,
  additionalCharges: 0,
  amountPaid: 0,

  paymentInstructions:
    "Silicon Founders Bank\nAccount: Vortex Tech Labs LLC Main\nIBAN: US44SFB8888000012345678\nSWIFT: SFBUS44XXX",
  terms: "Payment is due within 14 days of receipt. Interest of 1.5% applies for late settlements.",
  notes:
    "Thank you for choosing Vortex Tech Labs! We look forward to our continuous technical partnership.",

  templateId: "classic",
  brandColor: "#3b82f6",
  typography: "font-sans",
  paperSize: "a4",
  showWatermark: false,
};
