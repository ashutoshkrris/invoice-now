# 📄 Invoice Now

![Invoice Now Banner](src/assets/og-preview-banner.png)

A modern, privacy-first invoice generator built with **React 19**, **Vite 8**, and **Tailwind CSS v4**.

Generate professional, print-ready invoices directly in your browser with live customization, flexible branding, and one-click PDF or PNG exports. No server uploads, no account required, and no client data leaves your device.

## ✨ Features

- **⚡ Real-Time Adjustments:** Live preview updates as you tweak layout details, styles, and data settings.
- **🗂️ Isolated Multi-Workspaces:** Switch seamlessly between up to 25 distinct client and billing invoice workspaces in a centralized flyout directory.
- **📥 Universal Portability Backup Engine:** Export all active workspace registries, invoice payload datasets, and high-fidelity branding assets into a single serialized `.json` utility backup. Import anytime with complete database state-hydration guards.
- **📈 Dynamic Limit Indicators:** Keep tabs on database capacity with an embedded slot counter that updates dynamically and changes color text safely ($\ge$ 60% orange warnings, $\ge$ 80% red constraints).
- **🎨 Custom Branding:** Switch between curated color palettes, typography pairs, and custom hex picking on the fly.
- **✍️ Custom Watermarks:** Stamp invoices seamlessly with presets (`DRAFT`, `PAID`, `OVERDUE`) or dynamic text with custom modal configurations.
- **📱 Touch-First Accessible Operations:** Optimized workflow row layouts designed for zero-hover dependency. Duplicate, rename inline, or safely delete workspaces instantly across touch targets and mobile screens.
- **💾 Secure Direct Exports:** Download pristine `PDF` structures via `jspdf` or rasterized `PNG` snapshots via `html-to-image` client-side.
- **🖨️ Smart Print Optimization:** Pure browser-level alignment filters hidden layout elements (`no-print`) and enforces a baseline layout style across PDF engines.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v18+ recommended) and a package manager like `npm` installed.

### Installation

1. Clone the repository:

   ```bash
   git clone [https://github.com/YOUR_USERNAME/invoice-now.git](https://github.com/YOUR_USERNAME/invoice-now.git)
   cd invoice-now
   ```

2. Install the project dependencies:

   ```bash
   npm install
   ```

3. Spin up the local Vite local dev environment:
   ```bash
   npm run dev
   ```

Open your browser to the local port displayed in your terminal (typically `http://localhost:5173`).

## 🛠️ Project Scripts

Here are the available command vectors configured for this workspace:

| Script            | Description                                                                            |
| ----------------- | -------------------------------------------------------------------------------------- |
| `npm run dev`     | Runs the app in development mode with hot-reloading.                                   |
| `npm run build`   | Bundles and minifies the application files into the production-ready `dist` directory. |
| `npm run lint`    | Evaluates script architecture using standard static analysis rules.                    |
| `npm run preview` | Spins up a local production server to preview and test the production build.           |

## 📦 Core Technology Stack

- Frontend Library: React 19
- Build Tool / Server: Vite 8
- Styling Engine: Tailwind CSS v4
- Storage Engine: Hybrid Client-Side Storage Engine (IndexedDB + LocalStorage Wrapper)
- Document Generators: jsPDF & html-to-image
- Quality Assurance Gates: ESLint, Prettier, Husky, and `lint-staged`.

## 🔒 Privacy & Security

Invoice Now works entirely inside your browser. No data, data records, values, calculations, or client names are sent to external servers or remote tracking proxies. Your client invoices belong exclusively to you.

## 🤝 Contributing

Contributions are welcome! Whether you're fixing bugs, improving documentation, or proposing new features, your help is appreciated.

Please read the [Contributing Guide](./CONTRIBUTING.md) before opening an issue or submitting a pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
