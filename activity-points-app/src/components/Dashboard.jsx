import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../context/ActivityContext";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { getActivitiesForStudent } = useActivities();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setActivities(getActivitiesForStudent(currentUser.uid));
  }, [currentUser.uid, getActivitiesForStudent]);

  const earned = activities
    .filter((a) => a.status === "Approved")
    .reduce((sum, a) => sum + a.pointsApproved, 0);
  const target = currentUser.targetPoints;
  const remaining = Math.max(target - earned, 0);
  const pending = activities.filter((a) => a.status === "Pending").length;
  const pct = Math.min((earned / target) * 100, 100);

  const recent = activities.slice(0, 3);

  return (
    <>
      <div className="ledger-sheet">
        <div className="summary-strip">
          <div>
            <p className="summary-name">{currentUser.name}</p>
            <p className="summary-meta">
              <span>{currentUser.department}</span>
              <span>Semester {currentUser.semester}</span>
            </p>
          </div>
          <div className="summary-uid">{currentUser.uid}</div>
        </div>

        <div className="tally-row">
          <span className="tally-label">Points earned so far</span>
          <span className="tally-value approved">{earned} pts</span>
        </div>
        <div className="tally-row">
          <span className="tally-label">Target for this programme</span>
          <span className="tally-value navy">{target} pts</span>
        </div>
        <div className="tally-row">
          <span className="tally-label">Remaining to reach target</span>
          <span className="tally-value gold">{remaining} pts</span>
        </div>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-caption">
          <span>{pct.toFixed(0)}% of target reached</span>
          {pending > 0 && <span>{pending} activity awaiting approval</span>}
        </div>
      </div>

      <div className="ledger-sheet">
        <h2 className="section-title">Recent activity</h2>
        {recent.length === 0 ? (
          <div className="empty-state">
            No activities recorded yet. <Link to="/add-activity">Add your first one</Link>.
          </div>
        ) : (
          recent.map((a) => (
            <Link to={`/activities/${a.id}`} className="activity-row" key={a.id}>
              <span className={`seal ${a.status}`}>
                {a.status === "Approved" ? "✓" : a.status === "Rejected" ? "✕" : "…"}
              </span>
              <div>
                <p className="activity-title">{a.title}</p>
                <p className="activity-meta">
                  <span>{new Date(a.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  <span>{a.status}</span>
                </p>
              </div>
              <div className="activity-points">
                <span className="claimed">claimed {a.pointsClaimed}</span>
                <span className="approved-pts">{a.pointsApproved} pts</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
