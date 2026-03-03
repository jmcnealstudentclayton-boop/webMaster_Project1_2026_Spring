/**
 * js/pages/watchlist/form.js
 * Populate user filter and render the watchlist table (read-only, XSS-safe)
 */
import { supabase } from '../../supabase-config.js';

// ---- XSS helper ----
function esc(str) {
    const d = document.createElement('div');
    d.textContent = str ?? '';
    return d.innerHTML;
}

// ---- Base path for cross-page links ----
function basePath() {
    const p = window.location.pathname;
    const repo = 'webMaster_Project1_2026_Spring';
    const i = p.indexOf(repo);
    return i !== -1 ? p.substring(0, i + repo.length) : '';
}

export async function populateUserFilter() {
    const userSel = document.getElementById('wl-user-filter');
    if (!userSel) return;

    const { data } = await supabase.from('users').select('user_id, first_name, last_name').order('last_name');
    data?.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.user_id;
        opt.textContent = `${u.first_name} ${u.last_name}`;
        userSel.appendChild(opt);
    });
}

export async function loadWatchlist() {
    const tbody   = document.getElementById('watchlist-body');
    const spinner = document.getElementById('wl-spinner');
    const countEl = document.getElementById('wl-count');
    if (!tbody) return;

    spinner?.classList.remove('hidden');
    tbody.innerHTML = '';
    if (countEl) countEl.textContent = '';

    const userId = document.getElementById('wl-user-filter')?.value;
    const status = document.getElementById('wl-status-filter')?.value;

    let req = supabase
        .from('watchlist')
        .select('*, movies(title, movie_id, poster_url), users(first_name, last_name, user_id)', { count: 'exact' })
        .order('date_added', { ascending: false })
        .limit(100);

    if (userId) req = req.eq('user_id', Number(userId));
    if (status === 'watched') req = req.eq('watched', true);
    if (status === 'pending') req = req.eq('watched', false);

    const { data, error, count } = await req;

    spinner?.classList.add('hidden');

    if (error) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-3 text-slate-400">Error loading watchlist.</td></tr>`;
        console.error(error);
        return;
    }

    const total = count ?? (data?.length ?? 0);
    if (countEl) countEl.textContent = `${total} entr${total !== 1 ? 'ies' : 'y'} found`;

    if (!data?.length) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-3 text-slate-400">No entries found.</td></tr>`;
        return;
    }

    const base = basePath();
    tbody.innerHTML = data.map(w => `
        <tr class="border-b border-slate-700">
            <td class="px-4 py-3"><a href="${base}/pages/users/?id=${w.users?.user_id}" class="text-indigo-400 hover:text-indigo-300">${esc(w.users?.first_name + ' ' + w.users?.last_name)}</a></td>
            <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                    ${w.movies?.poster_url ? `<img src="${esc(w.movies.poster_url)}" alt="" class="w-8 h-12 object-cover rounded shrink-0" loading="lazy" onerror="this.remove()">` : ''}
                    <a href="${base}/pages/movies/detail.html?id=${w.movies?.movie_id}" class="text-indigo-400 hover:text-indigo-300">${esc(w.movies?.title)}</a>
                </div>
            </td>
            <td class="px-4 py-3 text-slate-400">${esc(w.date_added)}</td>
            <td class="px-4 py-3">${w.watched ? '<span class="text-green-400">✔ Watched</span>' : '<span class="text-slate-400">Pending</span>'}</td>
        </tr>
    `).join('');
}
