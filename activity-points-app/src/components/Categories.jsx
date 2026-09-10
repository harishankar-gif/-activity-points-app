import React from "react";
import categories from "../data/categories.json";

export default function Categories() {
  return (
    <div className="ledger-sheet">
      <h1 className="page-heading">Activity Categories</h1>
      <p className="page-subheading">Approved categories and the maximum points awarded per activity.</p>

      {categories.map((c) => (
        <div className="category-entry" key={c.id}>
          <p className="category-name">{c.name}</p>
          <p className="category-desc">{c.description}</p>
          <p className="category-cap">up to {c.maxPerActivity} pts</p>
        </div>
      ))}
    </div>
  );
}
