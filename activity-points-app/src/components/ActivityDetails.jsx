import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useActivities } from "../context/ActivityContext";
import categories from "../data/categories.json";

export default function ActivityDetails() {
  const { id } = useParams();
  const { getActivityById } = useActivities();
  const activity = getActivityById(id);

  if (!activity) return <Navigate to="/activities" replace />;

  const category = categories.find((c) => c.id === activity.category);

  return (
    <div className="ledger-sheet">
      <Link to="/activities" className="btn-secondary" style={{ display: "inline-block", marginBottom: 24, textDecoration: "none" }}>
        ← Back to activities
      </Link>

      <h1 className="page-heading">{activity.title}</h1>
      <p className="page-subheading">
        {category?.name || activity.category} · {new Date(activity.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
      </p>

      <div className="tally-row">
        <span className="tally-label">Status</span>
        <span className={`tally-value ${activity.status === "Approved" ? "approved" : activity.status === "Rejected" ? "" : "gold"}`}>
          {activity.status}
        </span>
      </div>
      <div className="tally-row">
        <span className="tally-label">Points claimed</span>
        <span className="tally-value navy">{activity.pointsClaimed}</span>
      </div>
      <div className="tally-row">
        <span className="tally-label">Points approved</span>
        <span className="tally-value approved">{activity.pointsApproved}</span>
      </div>

      <h2 className="section-title" style={{ marginTop: 28 }}>Description</h2>
      <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--ink)" }}>
        {activity.description || "No description was provided for this activity."}
      </p>
    </div>
  );
}
