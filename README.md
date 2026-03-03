# MovieDB

A movie database web application built for **ITFN 2214 — Webmaster Group Project** (Spring 2026). Browse movies, read reviews, explore watchlists, and view aggregated reports — all powered by a read-only Supabase PostgreSQL backend.

**Live Site:** <https://jmcnealstudentclayton-boop.github.io/webMaster_Project1_2026_Spring/>

---

## Features

| Page | Description |
|------|-------------|
| **Home** | Featured movies grid with quick-link cards |
| **Browse Movies** | Search by title, filter by genre, sort by title/year/runtime, paginated (20/page) |
| **Movie Detail** | Full movie info with genres and all community reviews |
| **Reviews** | Browse all reviews, search by movie title or username, paginated |
| **Watchlist** | Filter entries by user and watched/pending status |
| **User Profile** | View a user's stats, reviews, and watchlist |
| **Reports** | Top-rated movies, most watchlisted, genre breakdown, most active reviewers |

### Additional

- **Mobile-first responsive design** with hamburger nav on small screens
- **XSS-safe rendering** — all user-generated content is escaped
- **Accessibility** — skip-to-content links, ARIA labels, keyboard focus indicators, semantic HTML
- **Loading spinners** during async operations
- **Animated cards** with hover lift and fade-in effects

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) (CDN) |
| Scripting | Vanilla JavaScript (ES Modules) |
| Database | [Supabase](https://supabase.com/) (PostgreSQL) — **read-only** |
| Hosting | [GitHub Pages](https://pages.github.com/) (static) |

---

## Database Schema

> The database is **read-only**. No inserts, updates, deletes, or schema changes are performed by the application.

| Table | Rows | Description |
|-------|------|-------------|
| `movies` | 200 | Title, year, runtime, description |
| `genres` | 16 | Genre names |
| `movie_genres` | 607 | Many-to-many junction (movie ↔ genre) |
| `users` | 50 | Username, email, join date, subscription type |
| `reviews` | 1,348 | User ratings and text reviews |
| `watchlist` | 2,245 | User watchlist entries with watched flag |

---

## Project Structure

```
ROOT/
├── index.html                        Home page
├── project.md                        Project roadmap
├── README.md                         This file
├── css/
│   └── styles.css                    Global custom overrides
├── js/
│   ├── supabase-config.js            Supabase client init
│   ├── loadInserts.js                Shared nav & footer loader
│   └── pages/
│       ├── home/index.js             Home page logic
│       ├── movies/
│       │   ├── index.js              Browse movies (search, filter, sort, pagination)
│       │   └── detail.js             Movie detail page
│       ├── reviews/
│       │   ├── index.js              Reviews page init
│       │   └── review.js             Review cards + pagination
│       ├── watchlist/
│       │   ├── index.js              Watchlist page init
│       │   └── form.js              Filters & table rendering
│       ├── users/index.js            User profile page
│       └── reports/index.js          Aggregated report queries
├── pages/
│   ├── movies/
│   │   ├── index.html                Browse movies
│   │   └── detail.html               Movie details
│   ├── reviews/index.html            Reviews list
│   ├── watchlist/index.html          Watchlist table
│   ├── users/index.html              User profile
│   └── reports/index.html            Reports dashboard
└── pageInserts/
    ├── nav.html                      Shared navigation bar
    └── footer.html                   Shared footer
```

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- An internet connection (for Supabase API calls and Tailwind CDN)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/jmcnealstudentclayton-boop/webMaster_Project1_2026_Spring.git
   cd webMaster_Project1_2026_Spring
   ```

2. **Serve locally** — because the app uses ES Modules, you need an HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node.js (npx)
   npx serve .
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

> **Note:** The Supabase connection is pre-configured with a public anon key. No environment variables or `.env` files are needed.

### Deployment

The site is deployed automatically via **GitHub Pages** from the `main` branch. Simply push to `main` and the site updates within minutes.

---

## Team

- ITFN 2214 — Webmaster Group Project, Spring 2026

---

## License

This project was created for educational purposes as part of a college course.
