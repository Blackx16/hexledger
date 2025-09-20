const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("./database.js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-for-sih";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// --- API Routes (Login/Register) ---
app.post("/register", (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
  );
  stmt.run(username, hashedPassword, role, function (err) {
    if (err) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }
    res
      .status(201)
      .json({
        success: true,
        message: "User created successfully",
        userId: this.lastID,
      });
  });
  stmt.finalize();
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ success: true, token: token, role: user.role });
  });
});

// --- Blockchain Setup ---
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// ✅ Correct ABI for the upgraded multi-certificate contract
const contractABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "learner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "certHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "issuer",
        type: "address",
      },
    ],
    name: "CredentialIssued",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "credentials",
    outputs: [
      { internalType: "string", name: "certHash", type: "string" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "address", name: "issuer", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_learner", type: "address" }],
    name: "getCredentials",
    outputs: [
      {
        components: [
          { internalType: "string", name: "certHash", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "address", name: "issuer", type: "address" },
        ],
        internalType: "struct Certificate.Credential[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_learner", type: "address" },
      { internalType: "string", name: "_certHash", type: "string" },
    ],
    name: "issueCredential",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

// ✅ Correctly defined contractInstance
const contractInstance = new ethers.Contract(
  CONTRACT_ADDRESS,
  contractABI,
  signer,
);

// --- Protected Routes ---
app.get("/verify/:address", authenticateToken, async (req, res) => {
  console.log("--- Verification Request Start ---");
  try {
    const learnerAddress = req.params.address;
    console.log(`[1/3] Received request for address: ${learnerAddress}`);

    // ✅ Call the correct function name: getCredentials
    console.log(
      "[2/3] Calling smart contract with contractInstance.getCredentials...",
    );
    const certsArray = await contractInstance.getCredentials(learnerAddress);
    console.log(
      `[3/3] Smart contract call successful. Found ${certsArray.length} certificates.`,
    );

    // Format the results for the frontend
    const formattedCerts = certsArray.map((cert) => ({
      certHash: cert.certHash,
      timestamp: Number(cert.timestamp),
      issuer: cert.issuer,
    }));

    if (formattedCerts.length > 0) {
      res.status(200).json({ success: true, certificates: formattedCerts });
    } else {
      res
        .status(404)
        .json({
          success: false,
          message: "No certificates found for this address.",
        });
    }
  } catch (error) {
    console.error("--- VERIFICATION FAILED ---");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Error Object:", error);
    console.error("--- END OF ERROR ---");
    res
      .status(500)
      .json({ success: false, message: "Server error during verification." });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
