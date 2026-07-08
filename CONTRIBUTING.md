# 🤝 Contributing to Invoice Now

Thank you for deciding to help make **Invoice Now** better! We love open-source contributions and welcome code updates, bug reports, and UX recommendations.

Before getting started, please take a moment to review this brief setup blueprint.

---

## 🗺️ How to Contribute

### 1. Reporting Bugs / Feature Requests
If you run into an issue or have a brilliant layout feature concept, check the **Issues** tab to make sure it hasn't already been reported. If it's new, go ahead and open a detailed ticket explaining the bug or request.

### 2. Code Contributions
1. Fork this repository to your own account.
2. Create a clean branch tracking your specific work topic:
   ```bash
   git checkout -b feature/your-awesome-feature
   ```
3. Commit your changes with clear, structured commit descriptions.
4. Push your feature branch up to your fork:
    ```bash
    git push origin feature/your-awesome-feature
    ```
5. Open a Pull Request matching the target workspace main branch.

## 🎨 Quality Code Guidelines
To maintain clean code across the workspace, this project relies on static code quality gates.

- Linting & Style Rules: We use ESLint and Prettier to enforce formatting conventions.
- Automated Validation (Husky): A Git hook manager is active (husky + lint-staged). When you run a git commit instruction, your modified files will be automatically checked for linting errors and styled with Prettier before the commit is approved.

You can verify your updates locally before committing by running:
```bash
npm run lint
```

### React 19 Style Conventions
1. Prioritize modular functional components using structured props definitions.
2. Keep helper utilities or domain assets isolated cleanly inside structural files (e.g., constants configs like invoicePresets.js).
3. Ensure custom UI modals are separated using React Portals (createPortal) to protect layout rendering from parent constraints.