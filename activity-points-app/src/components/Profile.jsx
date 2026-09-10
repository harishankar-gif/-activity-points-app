import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../context/ActivityContext";
import categories from "../data/categories.json";

export default function Profile() {
  const { currentUser } = useAuth();
  const { getActivitiesForStudent } = useActivities();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setActivities(getActivitiesForStudent(currentUser.uid));
  }, [currentUser.uid, getActivitiesForStudent]);

  const earned = activities.filter((a) => a.status === "Approved").reduce((s, a) => s + a.pointsApproved, 0);
  const initials = currentUser.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  const byCategory = categories.map((c) => {
    const pts = activities
      .filter((a) => a.category === c.id && a.status === "Approved")
      .reduce((s, a) => s + a.pointsApproved, 0);
    return { ...c, pts };
  }).filter((c) => c.pts > 0);

  return (
    <div className="ledger-sheet">
      <div className="profile-avatar">{initials}</div>
      <h1 className="page-heading">{currentUser.name}</h1>
      <p className="page-subheading">Student profile and activity summary</p>

      <div className="profile-grid">
        <div>
          <p className="profile-field-label">Student UID</p>
          <p className="profile-field-value">{currentUser.uid}</p>
        </div>
        <div>
          <p className="profile-field-label">Department</p>
          <p className="profile-field-value">{currentUser.department}</p>
        </div>
        <div>
          <p className="profile-field-label">Semester</p>
          <p className="profile-field-value">{currentUser.semester}</p>
        </div>
        <div>
          <p className="profile-field-label">Target points</p>
          <p className="profile-field-value">{currentUser.targetPoints}</p>
        </div>
      </div>

      <hr className="section-divider" />

      <h2 className="section-title">Points by category</h2>
      {byCategory.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>No approved activities yet.</p>
      ) : (
        byCategory.map((c) => (
          <div className="tally-row" key={c.id}>
            <span className="tally-label">{c.name}</span>
            <span className="tally-value navy">{c.pts} pts</span>
          </div>
        ))
      )}
      <div className="tally-row">
        <span className="tally-label"><strong>Total approved</strong></span>
        <span className="tally-value approved"><strong>{earned} pts</strong></span>
      </div>
    </div>
  );
}
