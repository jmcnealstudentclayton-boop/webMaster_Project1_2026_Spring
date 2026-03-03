/**
 * js/pages/watchlist/index.js
 * Watchlist page — add movies, view & manage watchlist
 */
import { supabase } from '../../supabase-config.js';
import { populateSelects, loadWatchlist } from './form.js';

async function init() {
    await populateSelects();
    await loadWatchlist();

    const form = document.getElementById('watchlist-form');
    form?.addEventListener('submit', handleAdd);
}

async function handleAdd(e) {
    e.preventDefault();
    const msg = document.getElementById('wl-message');

    const user_id  = Number(document.getElementById('wl-user-select').value);
    const movie_id = Number(document.getElementById('wl-movie-select').value);

    if (!user_id || !movie_id) {
        msg.textContent = 'Please select both a user and a movie.';
        return;
    }

    const { error } = await supabase.from('watchlist').insert({
        user_id,
        movie_id,
        added_date: new Date().toISOString().split('T')[0],
        watched: false,
    });

    if (error) {
        msg.textContent = `Error: ${error.message}`;
        console.error(error);
    } else {
        msg.textContent = 'Added to watchlist!';
        await loadWatchlist();
    }
}

init();
