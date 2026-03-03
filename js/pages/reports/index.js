/**
 * js/pages/reports/index.js
 * Reports page — aggregate queries for insights
 * XSS-safe + inline spinners
 */
import { supabase } from '../../supabase-config.js';

/* ── XSS helper ─────────────────────────────── */
function esc(str) {
    const d = document.createElement('div');
    d.textContent = str ?? '';
    return d.innerHTML;
}

/* ── Spinner helpers ─────────────────────────── */
const spinnerHTML = '<div class="flex justify-center py-4"><div class="w-6 h-6 border-4 border-slate-600 border-t-indigo-500 rounded-full animate-spin"></div></div>';

function showSpinner(el) { el.innerHTML = spinnerHTML; }

/* ── Init ────────────────────────────────────── */
async function init() {
    await Promise.all([
        topRated(),
        mostWatchlisted(),
        genreBreakdown(),
        activeReviewers(),
    ]);
}

/* ── Top Rated Movies ────────────────────────── */
async function topRated() {
    const el = document.getElementById('report-top-rated');
    if (!el) return;
    showSpinner(el);

    const { data, error } = await supabase
        .from('reviews')
        .select('movie_id, rating, movies(title)');

    if (error) { el.innerHTML = errMsg(); return; }

    const map = {};
    data.forEach(r => {
        if (!map[r.movie_id]) map[r.movie_id] = { title: r.movies?.title, sum: 0, count: 0 };
        map[r.movie_id].sum += r.rating;
        map[r.movie_id].count++;
    });

    const sorted = Object.values(map)
        .map(m => ({ ...m, avg: (m.sum / m.count).toFixed(1) }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 10);

    el.innerHTML = sorted.length
        ? sorted.map((m, i) =>
            `<p>${i + 1}. <strong>${esc(m.title)}</strong> — ${m.avg}/10 (${m.count} reviews)</p>`
          ).join('')
        : '<p class="text-slate-400">No review data found.</p>';
}

/* ── Most Watchlisted ────────────────────────── */
async function mostWatchlisted() {
    const el = document.getElementById('report-most-watchlisted');
    if (!el) return;
    showSpinner(el);

    const { data, error } = await supabase
        .from('watchlist')
        .select('movie_id, movies(title)');

    if (error) { el.innerHTML = errMsg(); return; }

    const counts = {};
    data.forEach(w => {
        const t = w.movies?.title ?? 'Unknown';
        counts[t] = (counts[t] || 0) + 1;
    });

    const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    el.innerHTML = sorted.length
        ? sorted.map(([title, n], i) =>
            `<p>${i + 1}. <strong>${esc(title)}</strong> — ${n} users</p>`
          ).join('')
        : '<p class="text-slate-400">No watchlist data found.</p>';
}

/* ── Genre Breakdown ─────────────────────────── */
async function genreBreakdown() {
    const el = document.getElementById('report-genre-breakdown');
    if (!el) return;
    showSpinner(el);

    const { data, error } = await supabase
        .from('movie_genres')
        .select('genres(genre_name)');

    if (error) { el.innerHTML = errMsg(); return; }

    const counts = {};
    data.forEach(mg => {
        const g = mg.genres?.genre_name ?? 'Unknown';
        counts[g] = (counts[g] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    el.innerHTML = sorted.length
        ? sorted.map(([genre, n]) =>
            `<p><strong>${esc(genre)}</strong> — ${n} movies</p>`
          ).join('')
        : '<p class="text-slate-400">No genre data found.</p>';
}

/* ── Active Reviewers ────────────────────────── */
async function activeReviewers() {
    const el = document.getElementById('report-active-reviewers');
    if (!el) return;
    showSpinner(el);

    const { data, error } = await supabase
        .from('reviews')
        .select('user_id, users(first_name, last_name)');

    if (error) { el.innerHTML = errMsg(); return; }

    const counts = {};
    data.forEach(r => {
        const u = r.users ? `${r.users.first_name} ${r.users.last_name}` : 'Unknown';
        counts[u] = (counts[u] || 0) + 1;
    });

    const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    el.innerHTML = sorted.length
        ? sorted.map(([user, n], i) =>
            `<p>${i + 1}. <strong>${esc(user)}</strong> — ${n} reviews</p>`
          ).join('')
        : '<p class="text-slate-400">No reviewer data found.</p>';
}

/* ── Error fallback ──────────────────────────── */
function errMsg() {
    return '<p class="text-slate-400">Could not load data.</p>';
}

init();
