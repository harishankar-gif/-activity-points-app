import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../context/ActivityContext";
import categories from "../data/categories.json";

const STATUS_FILTERS = ["All", "Approved", "Pending", "Rejected"];

export default function ActivityList() {
  const { currentUser } = useAuth();
  const { getActivitiesForStudent } = useActivities();
  const [activities, setActivities] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setActivities(getActivitiesForStudent(currentUser.uid));
  }, [currentUser.uid, getActivitiesForStudent]);

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || id;

  const filtered = useMemo(() => {
    if (statusFilter === "All") return activities;
    return activities.filter((a) => a.status === statusFilter);
  }, [activities, statusFilter]);

  return (
    <div className="ledger-sheet">
      <h1 className="page-heading">Activity List</h1>
      <p className="page-subheading">Every activity you've submitted, most recent first.</p>

      <div className="filter-bar">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            className={"filter-chip" + (statusFilter === s ? " active" : "")}
            onClick={() => setStatusFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          No activities match this filter. <Link to="/add-activity">Add a new activity</Link>.
        </div>
      ) : (
        filtered.map((a) => (
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
              <span className="category-tag">{categoryName(a.category)}</span>
            </div>
            <div className="activity-points">
              <span className="claimed">claimed {a.pointsClaimed}</span>
              <span className="approved-pts">{a.pointsApproved} pts</span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
