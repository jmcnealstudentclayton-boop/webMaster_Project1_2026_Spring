/**
 * js/pages/reviews/form.js
 * Helpers to populate select dropdowns for the review form
 */
import { supabase } from '../../supabase-config.js';

export async function populateMovieSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title')
        .order('title');

    if (error) { console.error(error); return; }

    data.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.movie_id;
        opt.textContent = m.title;
        select.appendChild(opt);
    });
}

export async function populateUserSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const { data, error } = await supabase
        .from('users')
        .select('user_id, username')
        .order('username');

    if (error) { console.error(error); return; }

    data.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.user_id;
        opt.textContent = u.username;
        select.appendChild(opt);
    });
}
