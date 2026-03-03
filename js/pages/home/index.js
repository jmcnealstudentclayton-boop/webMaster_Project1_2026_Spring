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
        <a href="pages/movies/detail.html?id=${m.movie_id}" class="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-indigo-500 transition-colors block no-underline text-inherit card-lift animate-fade-in">
            ${m.poster_url
                ? `<img src="${esc(m.poster_url)}" alt="${esc(m.title)} poster" class="w-full h-72 object-cover" loading="lazy" onerror="this.parentElement.querySelector('.poster-ph').classList.remove('hidden');this.remove()">`
                : ''}
            <div class="poster-ph ${m.poster_url ? 'hidden' : ''} w-full h-72 bg-slate-700 flex items-center justify-center text-slate-500 text-5xl">🎬</div>
            <div class="p-5">
                <h3 class="text-lg font-semibold">${esc(m.title)}</h3>
                <p class="text-slate-400 text-sm">${esc(String(m.release_year ?? ''))}</p>
                <p class="mt-2 text-sm text-slate-300">${esc((m.description ?? '').substring(0, 120))}${(m.description?.length ?? 0) > 120 ? '…' : ''}</p>
            </div>
        </a>
    `).join('');
}

init();
