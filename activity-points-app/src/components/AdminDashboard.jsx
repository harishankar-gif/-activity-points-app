import React, { useMemo, useState } from "react";
import { useActivities } from "../context/ActivityContext";
import studentsData from "../data/students.json";
import categories from "../data/categories.json";

const STATUS_FILTERS = ["Pending", "Approved", "Rejected", "All"];

function studentName(uid) {
  return studentsData.find((s) => s.uid === uid)?.name || uid;
}

function categoryName(id) {
  return categories.find((c) => c.id === id)?.name || id;
}

export default function AdminDashboard() {
  const { getAllActivities, updateActivityStatus } = useActivities();
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [drafts, setDrafts] = useState({}); // { [id]: pointsApprovedString }

  const all = getAllActivities();
  const filtered = useMemo(() => {
    if (statusFilter === "All") return all;
    return all.filter((a) => a.status === statusFilter);
  }, [all, statusFilter]);

  const pendingCount = all.filter((a) => a.status === "Pending").length;

  function handleApprove(activity) {
    const draftValue = drafts[activity.id];
    const pointsApproved =
      draftValue !== undefined && draftValue !== "" ? Number(draftValue) : activity.pointsClaimed;
    updateActivityStatus(activity.id, { status: "Approved", pointsApproved });
  }

  function handleReject(activity) {
    updateActivityStatus(activity.id, { status: "Rejected", pointsApproved: 0 });
  }

  function handleDraftChange(id, value) {
    setDrafts((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className="ledger-sheet">
      <h1 className="page-heading">Review Activities</h1>
      <p className="page-subheading">
        {pendingCount === 0
          ? "No activities are waiting for review."
          : `${pendingCount} activity submission${pendingCount === 1 ? "" : "s"} waiting for review.`}
      </p>

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
        <div className="empty-state">No activities match this filter.</div>
      ) : (
        filtered.map((a) => (
          <div className="admin-row" key={a.id}>
            <div className="admin-row-main">
              <p className="activity-title">{a.title}</p>
              <p className="activity-meta">
                <span>{studentName(a.studentUid)}</span>
                <span>{a.studentUid}</span>
                <span>{categoryName(a.category)}</span>
                <span>{new Date(a.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
              </p>
              {a.description && <p className="admin-desc">{a.description}</p>}
            </div>

            <div className="admin-row-side">
              <span className={`seal ${a.status}`} title={a.status}>
                {a.status === "Approved" ? "✓" : a.status === "Rejected" ? "✕" : "…"}
              </span>
              <span className="claimed">claimed {a.pointsClaimed}</span>

              {a.status === "Pending" ? (
                <>
                  <input
                    type="number"
                    min="0"
                    max={a.pointsClaimed}
                    className="admin-points-input"
                    placeholder={String(a.pointsClaimed)}
                    value={drafts[a.id] ?? ""}
                    onChange={(e) => handleDraftChange(a.id, e.target.value)}
                  />
                  <div className="admin-actions">
                    <button className="btn-approve" onClick={() => handleApprove(a)}>Approve</button>
                    <button className="btn-reject" onClick={() => handleReject(a)}>Reject</button>
                  </div>
                </>
              ) : (
                <span className="approved-pts">{a.pointsApproved} pts</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
