import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import { checkAuthStatus } from "./api/spotify.js";

// Wraps any route that requires the user to be logged in.
function ProtectedRoute({ authenticated, children }) {
  if (authenticated === null) return null; // still loading
  return authenticated ? children : <Navigate to="/" replace />;
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(null); // null = loading

  useEffect(() => {
    checkAuthStatus()
      .then((status) => setAuthenticated(status.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            authenticated === true
              ? <Navigate to="/dashboard" replace />
              : <Home />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <Recommendations />
            </ProtectedRoute>
          }
        />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
