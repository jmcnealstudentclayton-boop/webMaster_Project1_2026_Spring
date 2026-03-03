/**
 * js/pages/movies/detail.js
 * Movie detail page — show one movie + all its reviews
 */
import { supabase } from '../../supabase-config.js';

/* ── XSS helper ──────────────────────────────── */
function esc(str) {
    const d = document.createElement('div');
    d.textContent = str ?? '';
    return d.innerHTML;
}

/* ── Get base path for cross-page links ──────── */
function basePath() {
    const p = window.location.pathname;
    const repo = 'webMaster_Project1_2026_Spring';
    const i = p.indexOf(repo);
    return i !== -1 ? p.substring(0, i + repo.length) : '';
}

async function init() {
    const spinner   = document.getElementById('detail-spinner');
    const header    = document.getElementById('movie-header');
    const revSec    = document.getElementById('reviews-section');

    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
        spinner.innerHTML = '<p class="text-slate-400 text-center">No movie ID provided.</p>';
        return;
    }

    /* ── Fetch movie ────────────────────────────── */
    const { data: movie, error } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', Number(id))
        .single();

    if (error || !movie) {
        spinner.innerHTML = '<p class="text-slate-400 text-center">Movie not found.</p>';
        return;
    }

    /* ── Fetch genres ───────────────────────────── */
    const { data: mg } = await supabase
        .from('movie_genres')
        .select('genres(genre_name)')
        .eq('movie_id', movie.movie_id);

    const genres = (mg || []).map(r => r.genres?.genre_name).filter(Boolean);

    /* ── Render header ──────────────────────────── */
    document.title = `${movie.title} | MovieDB`;
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-meta').textContent =
        `${movie.release_year ?? 'Unknown year'} · ${movie.runtime ?? '?'} min`;
    document.getElementById('movie-desc').textContent = movie.description ?? '';
    document.getElementById('movie-genres').innerHTML = genres.length
        ? genres.map(g => `<span class="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">${esc(g)}</span>`).join('')
        : '';

    spinner.classList.add('hidden');
    header.classList.remove('hidden');
    revSec.classList.remove('hidden');

    /* ── Fetch reviews ──────────────────────────── */
    const { data: reviews } = await supabase
        .from('reviews')
        .select('*, users(first_name, last_name, user_id)')
        .eq('movie_id', movie.movie_id)
        .order('review_date', { ascending: false });

    const list = document.getElementById('reviews-list');
    const countEl = document.getElementById('review-count');
    const total = reviews?.length ?? 0;
    countEl.textContent = `${total} review${total !== 1 ? 's' : ''}`;

    if (!total) {
        list.innerHTML = '<p class="text-slate-400">No reviews yet for this movie.</p>';
        return;
    }

    const base = basePath();
    list.innerHTML = reviews.map(r => `
        <div class="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <div class="flex items-center justify-between mb-2">
                <a href="${base}/pages/users/?id=${r.users?.user_id}" class="text-indigo-400 hover:text-indigo-300 font-medium">${esc(r.users?.first_name + ' ' + r.users?.last_name)}</a>
                <span class="text-yellow-400 font-semibold">${r.rating}/10</span>
            </div>
            <p class="text-sm text-slate-300">${esc(r.review_text)}</p>
            <small class="text-slate-500 mt-2 block">${esc(r.review_date)}</small>
        </div>
    `).join('');
}

init();
