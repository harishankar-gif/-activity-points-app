import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const studentLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/activities", label: "Activities" },
  { to: "/add-activity", label: "Add Activity" },
  { to: "/categories", label: "Categories" },
  { to: "/profile", label: "Profile" },
];

const adminLinks = [{ to: "/admin", label: "Review Activities" }];

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const links = currentUser.role === "admin" ? adminLinks : studentLinks;

  function handleSignOut() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          Activity Points <span>LEDGER</span>
        </div>
        <div className="navbar-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
            >
              {link.label}
            </NavLink>
          ))}
          {currentUser.role === "admin" && (
            <span className="navbar-link" style={{ opacity: 0.6, cursor: "default" }}>
              {currentUser.name}
            </span>
          )}
          <button className="navbar-signout" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
