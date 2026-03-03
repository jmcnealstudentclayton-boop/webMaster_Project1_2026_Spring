/**
 * js/pages/watchlist/form.js
 * Populate selects and render the watchlist table
 */
import { supabase } from '../../supabase-config.js';

export async function populateSelects() {
    // Movies
    const movieSel = document.getElementById('wl-movie-select');
    if (movieSel) {
        const { data } = await supabase.from('movies').select('movie_id, title').order('title');
        data?.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.movie_id;
            opt.textContent = m.title;
            movieSel.appendChild(opt);
        });
    }

    // Users
    const userSel = document.getElementById('wl-user-select');
    if (userSel) {
        const { data } = await supabase.from('users').select('user_id, username').order('username');
        data?.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.user_id;
            opt.textContent = u.username;
            userSel.appendChild(opt);
        });
    }
}

export async function loadWatchlist() {
    const tbody = document.getElementById('watchlist-body');
    if (!tbody) return;

    const { data, error } = await supabase
        .from('watchlist')
        .select('*, movies(title)')
        .order('added_date', { ascending: false })
        .limit(50);

    if (error) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-3 text-slate-400">Error loading watchlist.</td></tr>`;
        console.error(error);
        return;
    }

    if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-3 text-slate-400">Watchlist is empty.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(w => `
        <tr class="border-b border-slate-700">
            <td class="px-4 py-3">${w.movies?.title ?? 'Unknown'}</td>
            <td class="px-4 py-3 text-slate-400">${w.added_date ?? ''}</td>
            <td class="px-4 py-3">${w.watched ? '<span class="text-green-400">✔ Watched</span>' : '<span class="text-slate-400">Pending</span>'}</td>
            <td class="px-4 py-3"><button class="px-3 py-1 border border-slate-700 rounded-lg text-sm text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer" data-id="${w.watchlist_id}">Remove</button></td>
        </tr>
    `).join('');

    // Remove handler
    tbody.querySelectorAll('button[data-id]').forEach(btn => {
        btn.addEventListener('click', async () => {
            await supabase.from('watchlist').delete().eq('watchlist_id', btn.dataset.id);
            await loadWatchlist();
        });
    });
}
