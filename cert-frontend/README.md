# App

This App is a decentralized certificate issuance and verification platform built with React and Ethereum smart contracts. It allows learners to securely issue certificates and employers to verify them using blockchain technology.

## Features

- Issue certificates by uploading files and storing their hash on-chain
- Verify certificates by comparing uploaded file hashes with on-chain records
- Privacy-preserving: only hashes are stored, not raw certificate data
- Trustless verification using Ethereum smart contracts

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, ethers.js
- **Blockchain:** Ethereum, Solidity smart contract (not included in this repo)

## Folder Structure

```
frontend/
  ├── public/
  ├── src/
  │   ├── components/
  │   │   ├── LearnerPortal.jsx
  │   │   └── EmployerPortal.jsx
  │   ├── utils/
  │   │   └── blockchain.js
  │   ├── App.jsx
  │   └── main.jsx
  ├── index.html
  ├── package.json
  └── vite.config.js
```

## How It Works

### Issuing Certificates

1. Learner uploads a certificate file.
2. The file is hashed (SHA-256) in the browser.
3. The hash is sent to the smart contract and stored on-chain.
4. Transaction status and hash are displayed to the user.

### Verifying Certificates

1. Employer enters a learner's wallet address and optionally uploads a certificate file.
2. The app retrieves the stored hash from the blockchain.
3. If a file is uploaded, it is hashed locally and compared to the on-chain hash.
4. The app displays whether the certificate is verified or not.

## Getting Started

1. Clone the repository:
   ```powershell
   git clone https://github.com/aditya8866/SIHT-Frontend.git
   ```
2. Install dependencies:
   ```powershell
   cd frontend
   npm install
   ```
3. Configure your smart contract address in `src/utils/blockchain.js`:
   ```js
   export const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";
   ```
4. Start the development server:
   ```powershell
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Requirements

- Node.js & npm
- MetaMask browser extension
- Deployed Ethereum smart contract (ABI and address required)


## Author

aditya8866
