# Activity Points Management System

A React front end that lets a student log in and view/manage the activity points
they've earned through co-curricular, extra-curricular, technical, professional,
social and other approved activities. Built for the Web Programming assignment —
front end only, no backend or database; all data comes from local JSON files.

## Features

- **Login** — student UID + password checked against `src/data/students.json`.
- **Dashboard** — name, UID, department, semester, points earned, target and remaining.
- **Activity List** — every activity with category, date, points claimed/approved and status, filterable by status.
- **Activity Details** — full description and approval status for a single activity.
- **Add Activity** — form to submit a new activity (title, category, date, description, points claimed); validated and saved to the browser's `localStorage` so it survives a refresh.
- **Categories** — the six approved activity categories with descriptions and per-activity point caps.
- **Profile** — student info plus a breakdown of approved points by category.
- **Admin review** — a separate admin login sees every submitted activity across all students, filterable by status, and can approve (optionally adjusting the points awarded) or reject a pending submission. Changes are saved immediately and the student sees the updated status right away.

## Tech / React concepts used

- Functional components, JSX, props
- `useState`, `useEffect`
- React Context (`AuthContext`, `ActivityContext`) for shared state instead of prop-drilling
- `react-router-dom` (`HashRouter`, `Routes`, `Route`, `NavLink`, protected routes)
- Conditional rendering (empty states, filters, error messages)
- Controlled form handling with validation

## Project structure

```
activity-points-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Navbar.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ActivityList.jsx
│   │   ├── ActivityDetails.jsx
│   │   ├── AddActivity.jsx
│   │   ├── Categories.jsx
│   │   ├── Profile.jsx
│   │   └── AdminDashboard.jsx
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── ActivityContext.js
│   ├── data/
│   │   ├── students.json
│   │   ├── admins.json
│   │   ├── activities.json
│   │   └── categories.json
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Running locally

Requires Node.js (16+) and npm.

```bash
npm install
npm start
```

The app opens at `http://localhost:3000`. Sign in with one of the sample accounts:

| UID       | Password | Role    |
|-----------|----------|---------|
| 21CS045   | pass123  | Student |
| 21EC102   | pass456  | Student |
| 22ME018   | pass789  | Student |
| admin     | admin123 | Admin   |

Signing in as `admin` goes straight to the **Review Activities** screen instead
of the student dashboard.

## Adding your own data

Edit the JSON files in `src/data/`:

- `students.json` — add `{ uid, password, name, department, semester, targetPoints }`.
- `activities.json` — add `{ id, studentUid, title, category, date, description, pointsClaimed, pointsApproved, status }`. `category` must match an `id` from `categories.json`. `status` is `"Approved"`, `"Pending"` or `"Rejected"`.
- `categories.json` — add `{ id, name, description, maxPerActivity }`.

On first run, the app copies `activities.json` into the browser's `localStorage`
(key `apms_activities`) and reads/writes that copy from then on — this is what
lets both "Add Activity" and admin approve/reject actions persist across a
refresh without a real backend. The bundled JSON file itself is never modified;
to reset all data back to the original sample set, clear your browser's
localStorage for the site (or open DevTools → Application → Local Storage and
delete the `apms_activities` and `apms_session` keys).

## Deploying to GitHub Pages

1. Create a new GitHub repository and push this project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Activity Points Management System"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/activity-points-app.git
   git push -u origin main
   ```

2. In `package.json`, set `"homepage"` to your actual GitHub Pages URL:
   ```json
   "homepage": "https://YOUR-USERNAME.github.io/activity-points-app"
   ```

3. Install the deploy dependency (already listed in `devDependencies`) and deploy:
   ```bash
   npm install
   npm run deploy
   ```
   This builds the app and pushes the `build` folder to a `gh-pages` branch.

4. In the GitHub repo, go to **Settings → Pages** and confirm the source is
   set to the `gh-pages` branch. The site will be live at the `homepage` URL
   within a minute or two.

   > The app uses `HashRouter`, so routes look like `.../#/dashboard`. This is
   > deliberate — GitHub Pages serves static files and doesn't support
   > server-side rewrites, so `HashRouter` avoids "404" errors on refresh or
   > direct links to a route like `/activities`.

## Notes

- No backend or database is used, as required by the assignment brief — all
  reads come from the bundled JSON files, and the one piece of "write"
  behaviour (adding an activity) is simulated with `localStorage`.
- Login is a simple client-side credential check against sample data; it is
  **not** secure and is only meant to demonstrate the flow.
