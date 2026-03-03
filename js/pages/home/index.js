/**
 * js/pages/home/index.js
 * Home page — show featured movies or quick stats
 */
import { supabase } from '../../supabase-config.js';

async function init() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;

    // Fetch a handful of top-rated movies for the hero section
    const { data: movies, error } = await supabase
        .from('movies')
        .select('*')
        .order('movie_id', { ascending: true })
        .limit(8);

    if (error) {
        grid.innerHTML = `<p class="text-slate-400">Could not load movies.</p>`;
        console.error(error);
        return;
    }

    grid.innerHTML = movies.map(m => `
        <div class="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-indigo-500 transition-colors">
            <h3 class="text-lg font-semibold">${m.title}</h3>
            <p class="text-slate-400 text-sm">${m.release_year ?? ''}</p>
            <p class="mt-2 text-sm">${(m.description ?? '').substring(0, 120)}${m.description?.length > 120 ? '…' : ''}</p>
        </div>
    `).join('');
}

init();
