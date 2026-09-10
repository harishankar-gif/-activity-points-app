import React, { createContext, useContext, useEffect, useState } from "react";
import studentsData from "../data/students.json";
import adminsData from "../data/admins.json";

const AuthContext = createContext(null);
const SESSION_KEY = "apms_session"; // stores { uid, role }

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  function findByUidAndRole(uid, role) {
    const list = role === "admin" ? adminsData : studentsData;
    return list.find((s) => s.uid.toLowerCase() === uid.toLowerCase());
  }

  // Restore session on first load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const { uid, role } = JSON.parse(raw);
        const match = findByUidAndRole(uid, role);
        if (match) setCurrentUser({ ...match, role: role || "student" });
      }
    } catch (err) {
      console.error("Could not restore session:", err);
    }
    setCheckingSession(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function login(uid, password) {
    const trimmedUid = uid.trim();

    const adminMatch = adminsData.find(
      (a) => a.uid.toLowerCase() === trimmedUid.toLowerCase() && a.password === password
    );
    if (adminMatch) {
      const user = { ...adminMatch, role: "admin" };
      setCurrentUser(user);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ uid: user.uid, role: "admin" }));
      return { ok: true, role: "admin" };
    }

    const studentMatch = studentsData.find(
      (s) => s.uid.toLowerCase() === trimmedUid.toLowerCase() && s.password === password
    );
    if (studentMatch) {
      const user = { ...studentMatch, role: "student" };
      setCurrentUser(user);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ uid: user.uid, role: "student" }));
      return { ok: true, role: "student" };
    }

    return { ok: false, message: "UID or password is incorrect." };
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, checkingSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
