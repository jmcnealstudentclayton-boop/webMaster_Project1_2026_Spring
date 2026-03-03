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
        tbody.innerHTML = `<tr><td colspan="4" class="text-muted">Error loading watchlist.</td></tr>`;
        console.error(error);
        return;
    }

    if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-muted">Watchlist is empty.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(w => `
        <tr>
            <td>${w.movies?.title ?? 'Unknown'}</td>
            <td>${w.added_date ?? ''}</td>
            <td>${w.watched ? '✔ Watched' : 'Pending'}</td>
            <td><button class="btn btn-outline" data-id="${w.watchlist_id}">Remove</button></td>
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
