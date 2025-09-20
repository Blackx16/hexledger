import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import LearnerPortal from "./components/LearnerPortal";
import EmployerPortal from "./components/EmployerPortal";
import LoginPage from "./components/LoginPage";

const UserMenu = ({ setIsLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const displayRole = userRole
    ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
    : "";

  return (
    <div className="relative">
      {/* ✅ This button is now styled */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white text-indigo-600 px-4 py-2 rounded-md font-semibold hover:bg-indigo-50 transition-colors"
      >
        {displayRole} Portal
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userRole"),
  );

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            The Hexagon Ledger
          </Link>
          <div className="flex gap-4 text-sm sm:text-base">
            {isLoggedIn ? <UserMenu setIsLoggedIn={setIsLoggedIn} /> : null}
          </div>
        </div>
      </nav>

      <div className="flex-1">
        <Routes>
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />}
          />
          <Route
            path="/learner"
            element={
              <ProtectedRoute role="learner">
                {" "}
                <LearnerPortal />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer"
            element={
              <ProtectedRoute role="employer">
                {" "}
                <EmployerPortal />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("userRole");
  if (userRole === role) {
    return children;
  }
  return <Navigate to="/login" />;
};
