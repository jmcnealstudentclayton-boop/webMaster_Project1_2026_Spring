/**
 * js/pages/reports/index.js
 * Reports page — aggregate queries for insights
 */
import { supabase } from '../../supabase-config.js';

async function init() {
    await Promise.all([
        topRated(),
        mostWatchlisted(),
        genreBreakdown(),
        activeReviewers(),
    ]);
}

async function topRated() {
    const el = document.getElementById('report-top-rated');
    if (!el) return;

    const { data, error } = await supabase
        .from('reviews')
        .select('movie_id, rating, movies(title)');

    if (error) { el.innerHTML = errMsg(); return; }

    // Aggregate average ratings
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

    el.innerHTML = sorted.map((m, i) =>
        `<p>${i + 1}. <strong>${m.title}</strong> — ${m.avg}/10 (${m.count} reviews)</p>`
    ).join('');
}

async function mostWatchlisted() {
    const el = document.getElementById('report-most-watchlisted');
    if (!el) return;

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

    el.innerHTML = sorted.map(([title, n], i) =>
        `<p>${i + 1}. <strong>${title}</strong> — ${n} users</p>`
    ).join('');
}

async function genreBreakdown() {
    const el = document.getElementById('report-genre-breakdown');
    if (!el) return;

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

    el.innerHTML = sorted.map(([genre, n]) =>
        `<p><strong>${genre}</strong> — ${n} movies</p>`
    ).join('');
}

async function activeReviewers() {
    const el = document.getElementById('report-active-reviewers');
    if (!el) return;

    const { data, error } = await supabase
        .from('reviews')
        .select('user_id, users(username)');

    if (error) { el.innerHTML = errMsg(); return; }

    const counts = {};
    data.forEach(r => {
        const u = r.users?.username ?? 'Unknown';
        counts[u] = (counts[u] || 0) + 1;
    });

    const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    el.innerHTML = sorted.map(([user, n], i) =>
        `<p>${i + 1}. <strong>${user}</strong> — ${n} reviews</p>`
    ).join('');
}

function errMsg() {
    return `<p class="text-slate-400">Could not load data.</p>`;
}

init();
