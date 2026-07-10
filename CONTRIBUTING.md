# Contributing to Invoice Now

Thank you for your interest in contributing to **Invoice Now**!

Whether you're fixing a bug, improving the user interface, enhancing documentation, or proposing a new feature, every contribution helps improve the project.

This guide explains the contribution process, coding standards, and review workflow to help keep development organized and maintain a high-quality codebase.

- [Before You Start](#before-you-start)
- [Issue Assignment Policy](#issue-assignment-policy)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Development Workflow](#development-workflow)
  - [1. Fork the repository](#1-fork-the-repository)
  - [2. Clone your fork](#2-clone-your-fork)
  - [3. Create a branch](#3-create-a-branch)
  - [4. Install dependencies](#4-install-dependencies)
  - [5. Start the development server](#5-start-the-development-server)
  - [6. Verify your changes](#6-verify-your-changes)
- [Development Guidelines](#development-guidelines)
- [React Guidelines](#react-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)
- [Commit Messages](#commit-messages)
- [Opening a Pull Request](#opening-a-pull-request)
- [Code Review](#code-review)
- [What to Avoid](#what-to-avoid)
- [Project Standards](#project-standards)
- [Community Guidelines](#community-guidelines)
- [Need Help?](#need-help)
- [Thank You](#thank-you)

---

## Before You Start

Before writing any code, please check the existing Issues.

* Search to see if your bug or feature request has already been reported.
* If an issue already exists, leave a comment requesting to be assigned.
* Wait until a maintainer assigns the issue before beginning work.
* If an issue is already assigned to someone else, please choose another one unless a maintainer requests additional help.

Starting work without an assigned issue can result in duplicate effort. If multiple contributors submit solutions for the same issue, only one can be merged.

If you're proposing a new feature that doesn't already have an issue, create one first and wait for feedback before starting implementation, especially for larger changes.

---

## Issue Assignment Policy

To keep contributions organized, please follow these guidelines:

* Request assignment before starting work.
* Only work on issues assigned to you.
* If an assigned issue becomes inactive for an extended period, maintainers may unassign it so another contributor can continue the work.
* Pull requests for unassigned issues may be closed if the work duplicates an existing effort or hasn't been discussed beforehand.

If you're unsure whether an issue is available, feel free to ask in the issue comments or GitHub Discussions.

---

## Reporting Bugs

When reporting a bug, please include as much relevant information as possible.

Helpful details include:

* A clear description of the problem
* Steps to reproduce the issue
* Expected behavior
* Actual behavior
* Screenshots or screen recordings, if applicable
* Browser and operating system
* Console errors or stack traces
* Any additional context that may help reproduce the issue

A detailed bug report makes it much easier to investigate and resolve the problem.

---

## Suggesting Features

Feature requests are always welcome.

Before opening a feature request:

* Search existing Issues to avoid duplicates.
* Clearly describe the problem you're trying to solve.
* Explain your proposed solution.
* Mention any alternatives you've considered.
* Include screenshots, mockups, or examples if they help explain the idea.

Please discuss significant features before implementing them.

---

## Development Workflow

Once an issue has been assigned to you, follow these steps.

### 1. Fork the repository

Fork the repository to your GitHub account.

### 2. Clone your fork

```bash
git clone https://github.com/your-username/invoice-now.git
cd invoice-now
```

### 3. Create a branch

Create a descriptive branch for your work.

Examples:

```bash
git checkout -b feature/add-recurring-invoices
```

```bash
git checkout -b fix/invoice-preview-overflow
```

```bash
git checkout -b docs/update-contributing-guide
```

Do not commit directly to the `main` branch.

### 4. Install dependencies

```bash
npm install
```

### 5. Start the development server

```bash
npm run dev
```

### 6. Verify your changes

Before committing your changes, run:

```bash
npm run lint
```

If formatting changes are needed:

```bash
npm run format
```

---

## Development Guidelines

Please keep Pull Requests focused on a single issue or feature.

When contributing:

* Follow the existing project structure.
* Keep components small and reusable.
* Reuse existing utilities and components whenever possible.
* Avoid introducing duplicate logic.
* Avoid unnecessary dependencies.
* Write clear, maintainable code.
* Remove unused imports, variables, and debugging code before submitting.

Large Pull Requests containing unrelated changes are difficult to review and may be requested to be split into smaller ones.

---

## React Guidelines

This project follows modern React practices.

Please:

* Use functional components.
* Prefer hooks over class components.
* Keep component state minimal.
* Extract reusable logic into custom hooks where appropriate.
* Separate business logic from presentation.
* Keep constants, configuration, and utility functions outside components.
* Render dialogs and modals using React Portals (`createPortal`) where appropriate.

---

## Code Style

This project uses the following tools:

* ESLint
* Prettier
* Husky
* lint-staged

These tools help maintain consistent formatting and automatically run checks before commits.

Before opening a Pull Request, ensure linting passes.

```bash
npm run lint
```

Please do not disable lint rules unless absolutely necessary.

---

## Testing

Before submitting your Pull Request, verify that:

* Your changes work as expected.
* Existing functionality has not been broken.
* The application builds successfully.
* Linting passes without errors.
* New functionality includes tests where appropriate.

For user interface changes, test your work in multiple browsers whenever possible.

---

## Documentation

Documentation improvements are always appreciated.

If your Pull Request changes user-facing behavior, installation steps, configuration, or developer workflows, please update the relevant documentation as part of the same Pull Request.

---

## Commit Messages

Write clear and descriptive commit messages.

Good examples:

```text
feat: add recurring invoice support

fix: prevent invoice total rounding error

docs: improve installation instructions

refactor: simplify invoice calculation logic
```

Avoid generic commit messages such as:

```text
update

changes

fix

misc
```

Following the Conventional Commits format is encouraged.

---

## Opening a Pull Request

Before opening a Pull Request:

* Sync your branch with the latest `main`.
* Resolve merge conflicts.
* Test your changes locally.
* Ensure linting passes.
* Remove debugging code and unnecessary changes.
* Verify that your Pull Request only contains work related to the assigned issue.

Your Pull Request should include:

* A concise summary of the changes.
* The related issue (for example, `Closes #42`).
* Screenshots or recordings for user interface changes.
* Testing notes, if applicable.

Small, focused Pull Requests are reviewed much faster than large ones.

---

## Code Review

All Pull Requests are reviewed before being merged.

Review comments are intended to improve the quality and consistency of the project. If changes are requested, update your branch and push the new commits. Your Pull Request will update automatically.

---

## What to Avoid

Please avoid:

* Working on issues that have not been assigned to you.
* Opening duplicate Issues or Pull Requests.
* Submitting unrelated changes in the same Pull Request.
* Large refactors unrelated to your assigned issue.
* Adding unnecessary dependencies.
* Introducing breaking changes without prior discussion.
* Opening Pull Requests for features that have not been discussed first.

---

## Project Standards

Please help keep the codebase consistent.

* Follow the existing coding style.
* Reuse existing components whenever possible.
* Keep the user interface consistent with the rest of the application.
* Prefer incremental improvements over large rewrites.
* Write code that is easy to understand and maintain.

---

## Community Guidelines

Be respectful and constructive when interacting with other contributors.

Everyone contributes with different levels of experience. Discussions and code reviews should remain professional, collaborative, and focused on improving the project.

---

## Need Help?

If you're unsure where to begin:

* Browse the existing Issues.
* Read the project documentation.
* Start a GitHub Discussion if you'd like feedback before implementing a larger change.

Questions are always welcome.

---

## Thank You

Open source succeeds because people choose to share their time, knowledge, and ideas.

Whether you're fixing a typo, reporting a bug, improving documentation, or building a new feature, your contribution helps make **Invoice Now** better for everyone.

Thank you for contributing!

## Field limits

See [docs/field-limits.md](docs/field-limits.md) when editing invoice text inputs.
