# The Hexagon Ledger: Blockchain-Based Skill Credentialing System
## Table of Contents

1.  [Project Overview](#1-project-overview)
2.  [Problem Statement (SIH)](#2-problem-statement-sih)
3.  [Our Solution](#3-our-solution)
4.  [Features](#4-features)
5.  [Technical Architecture](#5-technical-architecture)
    * [Frontend](#frontend)
    * [Backend](#backend)
    * [Database](#database)
    * [Blockchain & Smart Contract](#blockchain--smart-contract)
6.  [Setup & Installation](#6-setup--installation)
    * [Prerequisites](#prerequisites)
    * [Environment Variables](#environment-variables)
    * [Running with Docker (Recommended)](#running-with-docker-recommended)
    * [Running Manually](#running-manually)
7.  [Usage Guide](#7-usage-guide)
    * [Learner Workflow](#learner-workflow)
    * [Employer Workflow](#employer-workflow)
8.  [Smart Contract Details](#8-smart-contract-details)
9.  [Future Enhancements](#9-future-enhancements)
10. [Team](#10-team)
11. [License](#11-license)

---

## 1. Project Overview

The Hexagon Ledger is a cutting-edge **blockchain-based skill credentialing system** designed to revolutionize how vocational training certificates are issued, managed, and verified. Built to address the pervasive issues of fraud, lack of interoperability, and limited learner ownership in traditional systems, our platform ensures that skill credentials are **immutable, transparent, instantly verifiable, and lifelong assets** for learners.

---

## 2. Problem Statement (SIH)

**ID:** 25200
**Ministry:** Ministry of Skill Development and Entrepreneurship (MSDE)
**Title:** Blockchain-Based Skill Credentialing System

**Summary of the Challenge:**
Existing vocational credentialing systems in India suffer from significant drawbacks:
* **Fraud and Forgery:** Certificates are easily tampered with or faked.
* **Lack of Interoperability:** Difficulty for institutions to verify credentials issued by others.
* **Limited Lifelong Access:** Learners struggle to maintain and prove ownership of their skill records.
* **Trust Deficit:** Employers face uncertainty, delays, and costs in verifying skills.

The core need is for a secure, unified platform that digitally issues tamper-proof credentials, allows for instant decentralized verification, and empowers learners with lifelong ownership of their skill records.

---

## 3. Our Solution

The Hexagon Ledger directly tackles the problems outlined by MSDE:

* **Digital & Tamper-Proof:** All credentials are cryptographically hashed and recorded on the Ethereum blockchain, making them impervious to alteration.
* **Instant Verification:** Employers and institutions can verify a learner's skills in real-time, eliminating manual processes and delays.
* **Lifelong Learner Ownership:** Learners control access to their verifiable digital credentials, empowering them with a portable, enduring record of their achievements.
* **Interoperable & Unified:** By leveraging a public blockchain standard, our system inherently fosters interoperability across various vocational training providers.

---

## 4. Features

**For Learners:**
* Secure User Authentication (Login/Register).
* Upload digital skill certificates (e.g., PDF, image).
* Generate SHA-256 hash of the uploaded file.
* Issue new credentials on the Ethereum Sepolia Testnet via MetaMask.
* Receive a unique, downloadable QR code containing their wallet address for easy sharing.
* Accumulate **multiple verifiable credentials** under a single blockchain identity.

**For Employers:**
* Secure User Authentication (Login/Register).
* Verify learner credentials via three flexible methods:
    * Manual input of learner's Ethereum wallet address.
    * Live camera scan of a learner's QR code.
    * Upload of a QR code image file.
* Retrieve and display **all** issued credentials for a given learner from the blockchain.
* Option to upload a local certificate file to compare its hash against on-chain records for definitive 'Verified' / 'Mismatch' status.

---

## 5. Technical Architecture

Our system is built on a robust, full-stack architecture integrated with blockchain technology.

```mermaid
graph TD
    A[<b>Frontend (UI)</b><br/>React.js, Vite, Tailwind CSS] -->|API Calls| B(<b>Backend (Logic)</b><br/>Node.js, Express.js)
    A -- MetaMask --> C(<b>Blockchain (Trust)</b><br/>Ethereum Sepolia)
    B -- SQLite --> D(<b>Database (Users)</b><br/>users.db)
    B -- Read-Only Calls --> C
    B -- JWT Auth --> A
    C -- Smart Contract --> E(<b>CertifyChain.sol</b>)


    Frontend
Technologies: React.js, Vite, Tailwind CSS, Framer Motion.

Libraries: react-router-dom, axios, ethers.js, qrcode.react, html5-qrcode, jsQR, lucide-react.

Role: Provides an intuitive user interface, handles client-side logic, calculates file hashes, integrates with MetaMask, and manages QR code generation/scanning.

Backend
Technologies: Node.js, Express.js.

Libraries: cors, dotenv, jsonwebtoken (JWT), bcryptjs, sqlite3, ethers.js.

Role: Manages user authentication, protects API routes, stores hashed user credentials in SQLite, and acts as a proxy for blockchain read operations.

Database
Technology: SQLite (file-based).

File: cert-backend/users.db.

Table: users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT (hashed), role TEXT).

Role: Stores hashed user passwords and roles for authentication. Crucially, no credential data is stored in the database; it resides exclusively on the blockchain.

Blockchain & Smart Contract
Platform: Ethereum (Sepolia Testnet).

Language: Solidity.

Smart Contract: CertifyChain.sol.

Role: The decentralized, immutable ledger for all skill credentials. Each credential record includes the certHash, timestamp, and issuer's address. Supports storing multiple credentials per learner address.

6. Setup & Installation
Prerequisites
Before you begin, ensure you have the following installed:

Git

Node.js (LTS version recommended, e.g., v20.x)

npm (usually comes with Node.js)

Docker Desktop (or Docker Engine if on Linux)

MetaMask browser extension configured for the Ethereum Sepolia Testnet.

Fund your MetaMask wallet with Sepolia ETH (faucet links can be found by searching for 'Sepolia Faucet').

A deployed instance of CertifyChain.sol on the Sepolia Testnet. You will need its address and the private key of the deploying wallet.

Environment Variables
Create .env files with the following content:

cert-backend/.env:

Code snippet

API_URL="YOUR_SEPOLIA_RPC_URL" # e.g., from Alchemy or Infura (wss or https)
PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY" # Private key of the wallet that will issue credentials (often the contract deployer)
CONTRACT_ADDRESS="YOUR_DEPLOYED_CONTRACT_ADDRESS" # Address of CertifyChain.sol on Sepolia
JWT_SECRET="a_very_long_and_random_secret_key" # Use a strong random string
Note: The PRIVATE_KEY is highly sensitive. For production, consider secure key management. For this demo, ensure it's from a test wallet.

frontend/.env:

Code snippet

VITE_API_BASE_URL="http://localhost:3001"
Running with Docker (Recommended)
Docker provides an isolated and consistent environment.

Clone the repository:

Bash

git clone [https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME # Navigate to the project root directory
Create .env files: Follow the instructions above to create cert-backend/.env and frontend/.env.

Build and run the Docker containers:

Bash

docker-compose build
docker-compose up
The application will be accessible at http://localhost:5173.

To stop the containers: docker-compose down.

Running Manually
Note: This method requires careful management of dependencies and environment. Docker is highly recommended for consistency.

Clone the repository:

Bash

git clone [https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME # Navigate to the project root directory
Create .env files: Follow the instructions above.

Install Backend Dependencies:

Bash

cd cert-backend
npm install
Start Backend Server:

Bash

npm start # or node index.js
Leave this terminal running.

Install Frontend Dependencies:

Bash

cd ../frontend
npm install
Start Frontend Development Server:

Bash

npm run dev
The application will be accessible at http://localhost:5173 (or the port specified by Vite).

7. Usage Guide
Learner Workflow
Register/Login: Navigate to http://localhost:5173 and register as a learner. Then log in.

Connect Wallet: Ensure MetaMask is unlocked and connected to the Sepolia Testnet with some Sepolia ETH.

Upload Certificate: Click 'Choose File' and select a digital certificate (e.g., PDF, JPG).

Issue Credential: Click 'Issue Credential'. MetaMask will prompt you to confirm the transaction.

Download QR Code: After the transaction confirms, a QR code containing your learner wallet address will appear. Download it. This is your shareable proof of identity.

Employer Workflow
Register/Login: Register as an employer and log in.

Verify Learner:

Manual Entry: Enter the learner's wallet address directly.

Scan QR Code: Use the live camera scanner or upload a QR code image file.

View Credentials: All verifiable credentials associated with that learner's address will be displayed, showing their unique hash, issuance timestamp, and the issuer's address.

Compare (Optional): To verify a specific certificate, upload a digital copy of it (e.g., a PDF) from your local machine. The system will compare its hash against all on-chain records and highlight matches.

8. Smart Contract Details
Contract Name: CertifyChain.sol

Deployed Network: Ethereum Sepolia Testnet

Key Data Structure:

Solidity

struct Credential {
    string certHash;      // SHA-256 hash of the credential file
    uint256 timestamp;    // Unix timestamp when the credential was issued
    address issuer;       // The blockchain address of the issuing entity
}
Key Mapping (Multi-Credential Support):

Solidity

mapping(address => Credential[]) public credentials;
// Each learner address can have an array of Credential structs.
Key Functions:

issueCredential(address _learner, string memory _certHash): Issues a new credential by adding it to the learner's credentials array.

getCredentials(address _learner) view returns (Credential[] memory): Retrieves all credentials for a given learner address.

9. Future Enhancements
We have a clear roadmap for expanding The Hexagon Ledger:

IPFS Integration: Decentralize the storage of the actual credential files (not just their hashes) on IPFS.

Dedicated Issuer Role: Implement a smart contract-level role to restrict credential issuance to authorized institutions.

Batch Issuance: Allow institutions to issue multiple credentials in a single transaction for efficiency.

Credential Revocation: Introduce a mechanism for officially revoking a credential on-chain (while maintaining the immutable record).

DigiLocker Integration: Explore linking verifiable credentials with India's national DigiLocker system.

Layer-2 Scaling: Migrate or integrate with a Layer-2 solution (e.g., Polygon) for lower transaction costs and higher throughput.

Advanced UI/UX: Further polish the user interface and experience.

