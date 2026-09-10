import React, { createContext, useContext, useEffect, useState } from "react";
import baseActivities from "../data/activities.json";

const ActivityContext = createContext(null);
const STORAGE_KEY = "apms_activities"; // the full, editable list lives here

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState([]);

  // On first load: use whatever is saved in localStorage, or seed it from
  // the bundled JSON the very first time the app runs in this browser.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setActivities(JSON.parse(raw));
      } else {
        setActivities(baseActivities);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(baseActivities));
      }
    } catch (err) {
      console.error("Could not load activities:", err);
      setActivities(baseActivities);
    }
  }, []);

  function persist(next) {
    setActivities(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addActivity(activity) {
    const nextId = activities.length ? Math.max(...activities.map((a) => a.id)) + 1 : 1;
    const newActivity = {
      id: nextId,
      pointsApproved: 0,
      status: "Pending",
      ...activity,
    };
    persist([...activities, newActivity]);
    return newActivity;
  }

  function updateActivityStatus(id, { status, pointsApproved }) {
    const next = activities.map((a) =>
      a.id === Number(id) ? { ...a, status, pointsApproved: Number(pointsApproved) } : a
    );
    persist(next);
  }

  function getActivitiesForStudent(uid) {
    return activities
      .filter((a) => a.studentUid === uid)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function getActivityById(id) {
    return activities.find((a) => a.id === Number(id));
  }

  function getAllActivities() {
    return [...activities].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return (
    <ActivityContext.Provider
      value={{
        addActivity,
        updateActivityStatus,
        getActivitiesForStudent,
        getActivityById,
        getAllActivities,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivities must be used within an ActivityProvider");
  return ctx;
}
