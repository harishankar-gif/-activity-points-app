import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../context/ActivityContext";
import categories from "../data/categories.json";

const emptyForm = { title: "", category: "", date: "", description: "", pointsClaimed: "" };

export default function AddActivity() {
  const { currentUser } = useAuth();
  const { addActivity } = useActivities();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const selectedCategory = categories.find((c) => c.id === form.category);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "Enter the activity title.";
    if (!form.category) next.category = "Choose a category.";
    if (!form.date) next.date = "Select the date of the activity.";
    if (!form.pointsClaimed || Number(form.pointsClaimed) <= 0) {
      next.pointsClaimed = "Enter the points you're claiming.";
    } else if (selectedCategory && Number(form.pointsClaimed) > selectedCategory.maxPerActivity) {
      next.pointsClaimed = `Maximum for this category is ${selectedCategory.maxPerActivity} points.`;
    }
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    addActivity({
      studentUid: currentUser.uid,
      title: form.title.trim(),
      category: form.category,
      date: form.date,
      description: form.description.trim(),
      pointsClaimed: Number(form.pointsClaimed),
    });

    setSubmitted(true);
    setForm(emptyForm);
    setTimeout(() => navigate("/activities"), 900);
  }

  return (
    <div className="ledger-sheet">
      <h1 className="page-heading">Add Activity</h1>
      <p className="page-subheading">Submit a new activity for approval. It will appear as "Pending" until reviewed.</p>

      {submitted && <div className="success-banner">Activity submitted. Redirecting to your activity list…</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="title">Activity title</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. IEEE Workshop on IoT" />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category && <p className="error-text">{errors.category}</p>}
          </div>

          <div className="field">
            <label htmlFor="date">Date</label>
            <input id="date" name="date" type="date" value={form.date} onChange={handleChange} max={new Date().toISOString().slice(0, 10)} />
            {errors.date && <p className="error-text">{errors.date}</p>}
          </div>

          {selectedCategory && (
            <p className="category-hint full" style={{ gridColumn: "1 / -1" }}>
              {selectedCategory.description} Maximum {selectedCategory.maxPerActivity} points per activity.
            </p>
          )}

          <div className="field">
            <label htmlFor="pointsClaimed">Points claimed</label>
            <input id="pointsClaimed" name="pointsClaimed" type="number" min="1" value={form.pointsClaimed} onChange={handleChange} placeholder="e.g. 10" />
            {errors.pointsClaimed && <p className="error-text">{errors.pointsClaimed}</p>}
          </div>

          <div className="field full">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Briefly describe what you did and your role in it" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Submit activity</button>
          <button type="button" className="btn-secondary" onClick={() => setForm(emptyForm)}>Clear form</button>
        </div>
      </form>
    </div>
  );
}
