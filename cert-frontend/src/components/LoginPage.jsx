import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Accept onLoginSuccess as a prop
export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://192.168.1.6:3001/login", {
        username,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userRole", response.data.role); // Keep role for convenience

        onLoginSuccess();

        if (response.data.role === "learner") {
          navigate("/learner");
        } else {
          navigate("/employer");
        }
      }
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message
        : "Invalid username or password";
      setError(errorMessage);
      console.error(err);
    }
  }; // ✅ This closing brace was likely missing.

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-xl px-4 py-2 mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl px-4 py-2 mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-xl"
          >
            Login
          </button>
          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
