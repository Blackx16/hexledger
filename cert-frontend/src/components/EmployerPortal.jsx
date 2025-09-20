import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, QrCode, Upload } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { fileToSHA256Hex } from "../utils/blockchain";
import { Html5QrcodeScanner } from "html5-qrcode";
import jsQR from "jsqr";

export default function EmployerPortal() {
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [localFileHash, setLocalFileHash] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  // Main verification logic that handles the API call
  const handleVerify = async (addressToVerify) => {
    if (!addressToVerify) {
      return alert("Please enter or scan a wallet address.");
    }

    setStatus("Querying server...");
    setCertificates([]); // Reset the array

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://192.168.1.6:3001/verify/${addressToVerify}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setCertificates(response.data.certificates);
      setStatus(`✅ Found ${response.data.certificates.length} certificate(s)`);
    } catch (err) {
      console.error(err);
      setCertificates([]);
      const errorMessage = err.response
        ? err.response.data.message
        : "Network Error or server is down.";
      setStatus(`❌ ${errorMessage}`);
    }
  };

  // When a user uploads a certificate to compare, hash it immediately
  useEffect(() => {
    if (file) {
      fileToSHA256Hex(file).then((hash) => setLocalFileHash(hash));
    } else {
      setLocalFileHash("");
    }
  }, [file]);

  // Callback for when any QR scan is successful
  const onScanSuccess = (decodedText) => {
    if (showScanner) {
      setShowScanner(false);
    }
    setAddress(decodedText);
    handleVerify(decodedText); // Automatically trigger verification
  };

  // Robust function for scanning an uploaded image file
  const handleQrFileChange = (e) => {
    const qrCodeFile = e.target.files[0];
    if (!qrCodeFile) return;

    setStatus("Scanning QR code from image...");
    const reader = new FileReader();
    reader.onloadend = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);

        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          onScanSuccess(code.data);
        } else {
          setStatus("❌ Could not find a QR code in the uploaded image.");
        }
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(qrCodeFile);
  };

  // useEffect to manage the live camera scanner
  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader-container",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false,
      );
      scanner.render(onScanSuccess, () => {});

      return () => {
        scanner
          .clear()
          .catch((error) => console.error("Scanner clear failed.", error));
      };
    }
  }, [showScanner]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4">
      <motion.div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Verify Certificate
        </h1>

        <div id="qr-reader-container" />

        {showScanner ? (
          <button
            onClick={() => setShowScanner(false)}
            className="mt-4 w-full text-center text-indigo-500"
          >
            Cancel Scan
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter learner wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 mb-3"
            />
            <label className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center cursor-pointer hover:border-indigo-500 transition mb-3">
              <span>
                {file ? file.name : "Upload certificate to compare (optional)"}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleVerify(address)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-xl flex items-center justify-center"
              >
                <Search className="h-4 w-4 mr-2" /> Verify Manually
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowScanner(true)}
                  className="w-full bg-gray-700 text-white py-2 rounded-xl flex items-center justify-center"
                >
                  <QrCode className="h-4 w-4 mr-2" /> Scan with Camera
                </button>
                <label className="w-full bg-gray-700 text-white py-2 rounded-xl flex items-center justify-center cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" /> Upload QR Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleQrFileChange}
                  />
                </label>
              </div>
            </div>
          </>
        )}

        {status && <p className="mt-4 text-center">{status}</p>}

        {certificates.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-bold text-lg mb-2">Issued Credentials:</h3>
            <ul className="space-y-4">
              {certificates.map((cert, index) => {
                const isVerified =
                  localFileHash && localFileHash === cert.certHash;
                return (
                  <li
                    key={index}
                    className={`p-3 rounded-lg ${isVerified ? "bg-green-100 ring-2 ring-green-500" : "bg-gray-50"}`}
                  >
                    <p className="text-sm font-mono break-all">
                      <strong>Hash/CID:</strong> {cert.certHash}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      <strong>Issued At:</strong>{" "}
                      {new Date(cert.timestamp * 1000).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 font-mono break-all">
                      <strong>Issuer:</strong> {cert.issuer}
                    </p>
                    {localFileHash && (
                      <div
                        className={`mt-2 text-sm font-bold ${isVerified ? "text-green-600" : "text-red-600"}`}
                      >
                        {isVerified ? (
                          <>
                            <CheckCircle className="inline h-4 w-4 mr-1" /> File
                            Verified
                          </>
                        ) : (
                          <>
                            <XCircle className="inline h-4 w-4 mr-1" /> File
                            Mismatch
                          </>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
}
