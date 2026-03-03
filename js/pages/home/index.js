/**
 * js/pages/home/index.js
 * Home page — show featured movies with spinner + XSS-safe
 */
import { supabase } from '../../supabase-config.js';

function esc(str) {
    const d = document.createElement('div');
    d.textContent = str ?? '';
    return d.innerHTML;
}

async function init() {
    const grid    = document.getElementById('featured-grid');
    const spinner = document.getElementById('home-spinner');
    if (!grid) return;

    spinner?.classList.remove('hidden');
    grid.innerHTML = '';

    const { data: movies, error } = await supabase
        .from('movies')
        .select('*')
        .order('movie_id', { ascending: true })
        .limit(8);

    spinner?.classList.add('hidden');

    if (error) {
        grid.innerHTML = `<p class="text-slate-400 col-span-full">Could not load movies.</p>`;
        console.error(error);
        return;
    }

    grid.innerHTML = movies.map(m => `
        <div class="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-indigo-500 transition-colors">
            <h3 class="text-lg font-semibold">${esc(m.title)}</h3>
            <p class="text-slate-400 text-sm">${esc(String(m.release_year ?? ''))}</p>
            <p class="mt-2 text-sm">${esc((m.description ?? '').substring(0, 120))}${(m.description?.length ?? 0) > 120 ? '…' : ''}</p>
        </div>
    `).join('');
}

init();
