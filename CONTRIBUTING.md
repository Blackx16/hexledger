# Contributing to The Hexagon Ledger

Thank you for your interest in contributing to **The Hexagon Ledger** (`hexledger`)! We welcome contributions to our blockchain smart contracts, backend RPC proxy, and React frontend.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs
- Before creating bug reports, check the issue tracker to avoid duplicates.
- Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) and include clear reproduction steps, browser version, and testnet network state.

### Suggesting Enhancements
- Feature suggestions are welcome! Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).

### Pull Requests
1. Fork the repository and clone your fork locally.
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your modifications following our code style.
4. Ensure tests and local build pass:
   ```bash
   # In cert-backend
   npm test # if defined

   # In cert-frontend
   npm run build
   ```
5. Commit your changes with concise, descriptive commit messages:
   ```bash
   git commit -m "feat(verifier): add support for batch hash comparison"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request referencing the related issue.

## Community & Support
If you have questions, feel free to open a GitHub discussion or issue on this repository.
