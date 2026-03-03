# MovieDB — Project Roadmap

> **Course:** ITFN 2214 — Webmaster Group Project  
> **Semester:** Spring 2026  
> **Stack:** HTML / CSS / Vanilla JS + Supabase (PostgreSQL)  
> **Repo:** `jmcnealstudentclayton-boop/webMaster_Project1_2026_Spring`  
> **Live:** <https://jmcnealstudentclayton-boop.github.io/webMaster_Project1_2026_Spring/>

---

## Database Schema (Supabase)

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
| 6  | Base CSS with dark theme & responsive layout   | ✅ Done |
| 7  | Home page with featured movies grid            | ✅ Done |
| 8  | Browse Movies page with search                 | ✅ Done |
| 9  | Reviews page layout (form + recent reviews)    | ✅ Done |
| 10 | Watchlist page layout (form + table)           | ✅ Done |
| 11 | Reports page layout (4 report cards)           | ✅ Done |

### Milestone 2 — User Input & Validation  *(Due: April 5)*

| #  | Task                                          | Status      |
|----|-----------------------------------------------|-------------|
| 12 | Client-side form validation (reviews)          | 🔲 To Do    |
| 13 | Client-side form validation (watchlist)        | 🔲 To Do    |
| 14 | Duplicate review prevention                    | 🔲 To Do    |
| 15 | Duplicate watchlist entry prevention            | 🔲 To Do    |
| 16 | Input sanitization / XSS protection            | 🔲 To Do    |
| 17 | Success / error toast notifications             | 🔲 To Do    |
| 18 | Loading spinners during async operations        | 🔲 To Do    |
| 19 | Pagination for movie browse & reviews           | 🔲 To Do    |
| 20 | Genre filter dropdown on movies page            | 🔲 To Do    |

### Milestone 3 — Database Integration & Polish  *(Due: May 4)*

| #  | Task                                          | Status      |
|----|-----------------------------------------------|-------------|
| 21 | Top-Rated Movies report (live data)             | 🔲 To Do    |
| 22 | Most-Watchlisted report (live data)             | 🔲 To Do    |
| 23 | Genre Breakdown report (live data)              | 🔲 To Do    |
| 24 | Most Active Reviewers report (live data)        | 🔲 To Do    |
| 25 | Mark movie as "watched" in watchlist            | 🔲 To Do    |
| 26 | Sort / filter options on watchlist table        | 🔲 To Do    |
| 27 | Movie detail page (all reviews for one movie)  | 🔲 To Do    |
| 28 | Supabase Row-Level Security (RLS) policies     | 🔲 To Do    |
| 29 | Final styling pass & accessibility review       | 🔲 To Do    |
| 30 | README with setup instructions                  | 🔲 To Do    |

---

## Notes

- **No PHP** — using Supabase JS client directly from the browser via ESM imports from `esm.sh`.
- **GitHub Pages** serves the site statically; all data comes from Supabase REST API.
- Supabase anon key is safe to expose in client code (read-only by default; writes controlled by RLS).
