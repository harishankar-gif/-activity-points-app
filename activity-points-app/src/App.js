import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ActivityProvider } from "./context/ActivityContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ActivityList from "./components/ActivityList";
import ActivityDetails from "./components/ActivityDetails";
import AddActivity from "./components/AddActivity";
import Categories from "./components/Categories";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";

// HashRouter is used (rather than BrowserRouter) so client-side routes
// keep working after deployment to GitHub Pages, which serves static files.

function HomeRedirect() {
  const { currentUser, checkingSession } = useAuth();
  if (checkingSession) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <HashRouter>
          <div className="app-shell">
            <Navbar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<Login />} />

                {/* Student routes */}
                <Route path="/dashboard" element={<ProtectedRoute role="student"><Dashboard /></ProtectedRoute>} />
                <Route path="/activities" element={<ProtectedRoute role="student"><ActivityList /></ProtectedRoute>} />
                <Route path="/activities/:id" element={<ProtectedRoute><ActivityDetails /></ProtectedRoute>} />
                <Route path="/add-activity" element={<ProtectedRoute role="student"><AddActivity /></ProtectedRoute>} />
                <Route path="/categories" element={<ProtectedRoute role="student"><Categories /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute role="student"><Profile /></ProtectedRoute>} />

                {/* Admin routes */}
                <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

                <Route path="*" element={<HomeRedirect />} />
              </Routes>
            </main>
          </div>
        </HashRouter>
      </ActivityProvider>
    </AuthProvider>
  );
}
