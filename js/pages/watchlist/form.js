/**
 * js/pages/watchlist/form.js
 * Populate user filter and render the watchlist table (read-only)
 */
import { supabase } from '../../supabase-config.js';

export async function populateUserFilter() {
    const userSel = document.getElementById('wl-user-filter');
    if (!userSel) return;

    const { data } = await supabase.from('users').select('user_id, username').order('username');
    data?.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.user_id;
        opt.textContent = u.username;
        userSel.appendChild(opt);
    });
}

export async function loadWatchlist() {
    const tbody = document.getElementById('watchlist-body');
    if (!tbody) return;

    const userId = document.getElementById('wl-user-filter')?.value;
    const status = document.getElementById('wl-status-filter')?.value;

    let req = supabase
        .from('watchlist')
        .select('*, movies(title), users(username)')
        .order('added_date', { ascending: false })
        .limit(100);

    if (userId) req = req.eq('user_id', Number(userId));
    if (status === 'watched') req = req.eq('watched', true);
    if (status === 'pending') req = req.eq('watched', false);

    const { data, error } = await req;

    if (error) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-3 text-slate-400">Error loading watchlist.</td></tr>`;
        console.error(error);
        return;
    }

    if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-3 text-slate-400">No entries found.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(w => `
        <tr class="border-b border-slate-700">
            <td class="px-4 py-3">${w.users?.username ?? 'Unknown'}</td>
            <td class="px-4 py-3">${w.movies?.title ?? 'Unknown'}</td>
            <td class="px-4 py-3 text-slate-400">${w.added_date ?? ''}</td>
            <td class="px-4 py-3">${w.watched ? '<span class="text-green-400">✔ Watched</span>' : '<span class="text-slate-400">Pending</span>'}</td>
        </tr>
    `).join('');
}
