/**
 * js/pages/users/index.js
 * User profile page — show user info, reviews & watchlist
 */
import { supabase } from '../../supabase-config.js';

/* ── XSS helper ──────────────────────────────── */
function esc(str) {
    const d = document.createElement('div');
    d.textContent = str ?? '';
    return d.innerHTML;
}

/* ── Base path for cross-page links ──────────── */
function basePath() {
    const p = window.location.pathname;
    const repo = 'webMaster_Project1_2026_Spring';
    const i = p.indexOf(repo);
    return i !== -1 ? p.substring(0, i + repo.length) : '';
}

async function init() {
    const spinner = document.getElementById('profile-spinner');
    const id = new URLSearchParams(window.location.search).get('id');

    if (!id) {
        spinner.innerHTML = '<p class="text-slate-400 text-center">No user ID provided.</p>';
        return;
    }

    /* ── Fetch user ─────────────────────────────── */
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', Number(id))
        .single();

    if (error || !user) {
        spinner.innerHTML = '<p class="text-slate-400 text-center">User not found.</p>';
        return;
    }

    /* ── Render header ──────────────────────────── */
    const displayName = `${user.first_name} ${user.last_name}`;
    document.title = `${displayName} | MovieDB`;
    document.getElementById('user-name').textContent = displayName;

    const metaEl = document.getElementById('user-meta');
    const metaParts = [];
    if (user.email) metaParts.push(`<span>${esc(user.email)}</span>`);
    if (user.join_date) metaParts.push(`<span>Joined ${esc(user.join_date)}</span>`);
    if (user.subscription_type) metaParts.push(`<span class="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">${esc(user.subscription_type)}</span>`);
    metaEl.innerHTML = metaParts.join('<span class="text-slate-600">·</span>');

    spinner.classList.add('hidden');
    document.getElementById('user-header').classList.remove('hidden');
    document.getElementById('stats-bar').classList.remove('hidden');

    /* ── Fetch reviews + watchlist in parallel ──── */
    const [revRes, wlRes] = await Promise.all([
        supabase
            .from('reviews')
            .select('*, movies(title, movie_id, poster_url)')
            .eq('user_id', user.user_id)
            .order('review_date', { ascending: false }),
        supabase
            .from('watchlist')
            .select('*, movies(title, movie_id, poster_url)')
            .eq('user_id', user.user_id)
            .order('date_added', { ascending: false }),
    ]);

    const reviews = revRes.data || [];
    const watchlist = wlRes.data || [];

    /* ── Stats ──────────────────────────────────── */
    document.getElementById('stat-reviews').textContent = reviews.length;
    document.getElementById('stat-watchlist').textContent = watchlist.length;
    document.getElementById('stat-watched').textContent = watchlist.filter(w => w.watched).length;

    if (reviews.length) {
        const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
        document.getElementById('stat-avg').textContent = avg;
    }

    /* ── Render reviews ─────────────────────────── */
    const revSec = document.getElementById('reviews-section');
    revSec.classList.remove('hidden');
    const base = basePath();

    const revList = document.getElementById('user-reviews');
    if (!reviews.length) {
        revList.innerHTML = '<p class="text-slate-400">This user hasn\'t written any reviews.</p>';
    } else {
        revList.innerHTML = reviews.map(r => `
            <div class="bg-slate-800 border border-slate-700 rounded-lg p-5 flex gap-4">
                ${r.movies?.poster_url
                    ? `<a href="${base}/pages/movies/detail.html?id=${r.movies?.movie_id}" class="shrink-0"><img src="${esc(r.movies.poster_url)}" alt="${esc(r.movies?.title)} poster" class="w-16 h-24 object-cover rounded" loading="lazy" onerror="this.remove()"></a>`
                    : ''}
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                        <a href="${base}/pages/movies/detail.html?id=${r.movies?.movie_id}" class="text-indigo-400 hover:text-indigo-300 font-medium">${esc(r.movies?.title)}</a>
                        <span class="text-yellow-400 font-semibold">${r.rating}/10</span>
                    </div>
                    <p class="text-sm text-slate-300">${esc(r.review_text)}</p>
                    <small class="text-slate-500 mt-2 block">${esc(r.review_date)}</small>
                </div>
            </div>
        `).join('');
    }

    /* ── Render watchlist ───────────────────────── */
    const wlSec = document.getElementById('watchlist-section');
    wlSec.classList.remove('hidden');
    const wlBody = document.getElementById('user-watchlist');

    if (!watchlist.length) {
        wlBody.innerHTML = '<tr><td colspan="3" class="px-4 py-3 text-slate-400">No watchlist entries.</td></tr>';
    } else {
        wlBody.innerHTML = watchlist.map(w => `
            <tr class="border-b border-slate-700">
                <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                        ${w.movies?.poster_url ? `<img src="${esc(w.movies.poster_url)}" alt="" class="w-8 h-12 object-cover rounded shrink-0" loading="lazy" onerror="this.remove()">` : ''}
                        <a href="${base}/pages/movies/detail.html?id=${w.movies?.movie_id}" class="text-indigo-400 hover:text-indigo-300">${esc(w.movies?.title)}</a>
                    </div>
                </td>
                <td class="px-4 py-3 text-slate-400">${esc(w.date_added)}</td>
                <td class="px-4 py-3">${w.watched
                    ? '<span class="text-green-400">✔ Watched</span>'
                    : '<span class="text-slate-400">Pending</span>'}</td>
            </tr>
        `).join('');
    }
}

init();
