import { ethers } from "ethers";

// The full JSON ABI for your contract
export const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_learner",
        type: "address",
      },
      {
        internalType: "string",
        name: "_certHash",
        type: "string",
      },
    ],
    name: "issueCredential",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_learner",
        type: "address",
      },
    ],
    name: "verifyCredential",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Replace this with your actual deployed contract address
export const CONTRACT_ADDRESS = "0x0197d5f099196969ce2e6cc175ca81b95fb9c497";

// This hashing function remains the same
export async function fileToSHA256Hex(file) {
  const ab = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", ab);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Add this function back in
export function getContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}
