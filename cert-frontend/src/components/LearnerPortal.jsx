import { useState, useRef } from "react";
import { UploadCloud, Download } from "lucide-react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { fileToSHA256Hex, getContract } from "../utils/blockchain";
import { QRCodeSVG } from "qrcode.react";

export default function LearnerPortal() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [txnHash, setTxnHash] = useState("");
  const [status, setStatus] = useState("");
  const [learnerAddress, setLearnerAddress] = useState("");
  const qrCodeRef = useRef(null);

  const handleIssue = async () => {
    if (!file) return alert("Please upload a file");
    if (!window.ethereum) return alert("Install MetaMask");

    try {
      setStatus("Hashing file...");
      const fileHash = await fileToSHA256Hex(file);
      setHash(fileHash);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      setStatus("Sending transaction...");
      const learnerAddr = await signer.getAddress();
      setLearnerAddress(learnerAddr);

      const tx = await contract.issueCredential(learnerAddr, fileHash);
      setTxnHash(tx.hash);

      setStatus("Waiting for confirmation...");
      await tx.wait();
      setStatus("✅ Certificate issued on-chain! Here is your QR Code:");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed: " + (err.message || err));
    }
  };

  const handleDownload = () => {
    const svg = qrCodeRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      // Ensure the downloaded PNG also has a white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `Certificate-QR-${learnerAddress.substring(0, 6)}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4">
      <motion.div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Issue Certificate
        </h1>

        <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-indigo-500 transition">
          <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
          <span>{file ? file.name : "Upload your certificate"}</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <button
          className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl"
          onClick={handleIssue}
        >
          Generate & Issue
        </button>

        {status && <p className="mt-4 text-center">{status}</p>}

        {txnHash && learnerAddress && (
          <div className="mt-4 flex flex-col items-center gap-4">
            {/* ✅ This div now has a white background and padding, creating a border */}
            <div ref={qrCodeRef} className="bg-white p-4 rounded-lg shadow-md">
              <QRCodeSVG value={learnerAddress} size={128} />
            </div>

            <button
              onClick={handleDownload}
              className="w-1/2 bg-gray-700 text-white py-2 rounded-xl flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR
            </button>

            <div className="text-sm break-all w-full">
              <p>
                <strong>Your Address:</strong> {learnerAddress}
              </p>
              <p>
                <strong>Txn Hash:</strong>{" "}
                <a
                  href={`https://sepolia.etherscan.io/tx/${txnHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {txnHash}
                </a>
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
