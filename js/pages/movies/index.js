/**
 * js/pages/movies/index.js
 * Browse Movies — fetch & render movie cards, search/filter
 */
import { supabase } from '../../supabase-config.js';

const grid     = document.getElementById('movie-grid');
const searchEl = document.getElementById('search-input');

async function loadMovies(query = '') {
    let req = supabase.from('movies').select('*').order('title');
    if (query) {
        req = req.ilike('title', `%${query}%`);
    }

    const { data, error } = await req;
    if (error) {
        grid.innerHTML = `<p class="text-muted">Error loading movies.</p>`;
        console.error(error);
        return;
    }

    if (!data.length) {
        grid.innerHTML = `<p class="text-muted">No movies found.</p>`;
        return;
    }

    grid.innerHTML = data.map(m => `
        <div class="card">
            <h3>${m.title}</h3>
            <p class="text-muted">${m.release_year ?? ''} &middot; ${m.runtime_minutes ?? '?'} min</p>
            <p>${(m.description ?? '').substring(0, 150)}${m.description?.length > 150 ? '…' : ''}</p>
        </div>
    `).join('');
}

// Debounced search
let timer;
searchEl?.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => loadMovies(searchEl.value.trim()), 300);
});

// Initial load
loadMovies();
