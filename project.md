# MovieDB — Project Roadmap

> **Course:** ITFN 2214 — Webmaster Group Project  
> **Semester:** Spring 2026  
> **Stack:** HTML / Tailwind CSS / Vanilla JS + Supabase (PostgreSQL)  
> **Repo:** `jmcnealstudentclayton-boop/webMaster_Project1_2026_Spring`  
> **Live:** <https://jmcnealstudentclayton-boop.github.io/webMaster_Project1_2026_Spring/>

---

## Database Schema (Supabase) — READ-ONLY

> **⚠️ RULE: The database cannot be modified.** No new tables, no inserts, no updates, no deletes.  
> The website must work entirely with the existing dataset as provided.

| Table          | Rows  | Description                          |
|----------------|-------|--------------------------------------|
| `movies`       | 200   | Title, year, runtime, description    |
| `genres`       | 16    | Genre names                          |
| `movie_genres` | 607   | Many-to-many link (movie ↔ genre)    |
| `users`        | 50    | Username, email, join date, sub type |
| `reviews`      | 1,348 | User ratings & text reviews          |
| `watchlist`    | 2,245 | User watchlist entries (watched flag) |

---

## Folder Structure

```
ROOT/
├── index.html                        Home page
├── project.md                        This roadmap
├── css/
│   └── styles.css                    Global stylesheet
├── js/
│   ├── supabase-config.js            Supabase client init
│   ├── loadInserts.js                Fetches nav & footer inserts
│   └── pages/
│       ├── home/index.js             Home page logic
│       ├── movies/index.js           Browse/search movies
│       ├── reviews/
│       │   ├── index.js              Page init & form submit
│       │   ├── form.js               Populate select dropdowns
│       │   └── review.js             Render review cards
│       ├── watchlist/
│       │   ├── index.js              Page init & add handler
│       │   └── form.js               Populate selects & render table
│       └── reports/index.js          Aggregate report queries
├── pages/
│   ├── movies/index.html
│   ├── reviews/index.html
│   ├── watchlist/index.html
│   └── reports/index.html
└── pageInserts/
    ├── nav.html                      Shared navigation bar
    └── footer.html                   Shared footer
```

---

## Milestones

### Milestone 1 — Basic Structure & Layout  *(Due: March 15)*

| #  | Task                                          | Status |
|----|-----------------------------------------------|--------|
| 1  | GitHub repo + Pages deployment                | ✅ Done |
| 2  | Supabase project connected                    | ✅ Done |
| 3  | MySQL → Supabase migration (6 tables)         | ✅ Done |
| 4  | Folder structure & page shells created         | ✅ Done |
| 5  | Global nav & footer page inserts               | ✅ Done |
| 6  | Tailwind CSS with dark theme & responsive layout| ✅ Done |
| 7  | Home page with featured movies grid            | ✅ Done |
| 8  | Browse Movies page with search                 | ✅ Done |
| 9  | Reviews page layout (form + recent reviews)    | ✅ Done |
| 10 | Watchlist page layout (form + table)           | ✅ Done |
| 11 | Reports page layout (4 report cards)           | ✅ Done |

### Milestone 2 — Interactivity & Filtering  *(Due: April 5)*

| #  | Task                                          | Status      |
|----|-----------------------------------------------|-------------|
| 12 | Pagination for movie browse                    | 🔲 To Do    |
| 13 | Genre filter dropdown on movies page            | 🔲 To Do    |
| 14 | Sort movies by title / year / runtime           | 🔲 To Do    |
| 15 | Search reviews by movie title or username       | 🔲 To Do    |
| 16 | Pagination for reviews list                     | 🔲 To Do    |
| 17 | Filter watchlist by watched / pending status    | 🔲 To Do    |
| 18 | Loading spinners during async operations        | 🔲 To Do    |
| 19 | XSS-safe rendering (escape user content)        | 🔲 To Do    |
| 20 | Toast / inline notifications for empty results  | 🔲 To Do    |

### Milestone 3 — Reports, Detail Views & Polish  *(Due: May 4)*

| #  | Task                                          | Status      |
|----|-----------------------------------------------|-------------|
| 21 | Top-Rated Movies report (live data)             | 🔲 To Do    |
| 22 | Most-Watchlisted report (live data)             | 🔲 To Do    |
| 23 | Genre Breakdown report (live data)              | 🔲 To Do    |
| 24 | Most Active Reviewers report (live data)        | 🔲 To Do    |
| 25 | Movie detail page (all reviews for one movie)  | 🔲 To Do    |
| 26 | User profile page (reviews + watchlist)         | 🔲 To Do    |
| 27 | Responsive polish & mobile nav                  | 🔲 To Do    |
| 28 | Accessibility review (ARIA, contrast, focus)    | 🔲 To Do    |
| 29 | Final styling pass & animations                 | 🔲 To Do    |
| 30 | README with setup instructions                  | 🔲 To Do    |

---

## Rules & Notes

- **⚠️ Database is READ-ONLY** — no inserts, updates, deletes, new tables, or schema changes allowed. The site displays the existing dataset only.
- **No PHP** — using Supabase JS client directly from the browser via ESM imports from `esm.sh`.
- **Tailwind CSS** via CDN for all styling.
- **GitHub Pages** serves the site statically; all data comes from Supabase REST API (read-only queries).
- All "forms" on the site are for **filtering/searching** the existing data, not for writing to the database.
