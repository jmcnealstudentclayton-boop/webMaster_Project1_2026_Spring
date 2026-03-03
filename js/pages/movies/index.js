/**
 * js/pages/movies/index.js
 * Browse Movies — search, genre filter, sort, pagination, XSS-safe
 */
import { supabase } from '../../supabase-config.js';

const grid       = document.getElementById('movie-grid');
const searchEl   = document.getElementById('search-input');
const genreEl    = document.getElementById('genre-filter');
const sortEl     = document.getElementById('sort-select');
const spinner    = document.getElementById('movie-spinner');
const countEl    = document.getElementById('movie-count');
const pagDiv     = document.getElementById('movie-pagination');

const PAGE_SIZE = 20;
let currentPage = 1;

// ---- XSS helper ----
function esc(str) {
    const d = document.createElement('div');
    d.textContent = str ?? '';
    return d.innerHTML;
}

// ---- Populate genre dropdown ----
async function loadGenres() {
    const { data } = await supabase.from('genres').select('genre_id, genre_name').order('genre_name');
    data?.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.genre_id;
        opt.textContent = g.genre_name;
        genreEl?.appendChild(opt);
    });
}

// ---- Sort config ----
function getSortParams() {
    const val = sortEl?.value || 'title-asc';
    const [col, dir] = val.split('-');
    const column = col === 'year' ? 'release_year' : col === 'runtime' ? 'runtime_minutes' : 'title';
    return { column, ascending: dir === 'asc' };
}

// ---- Main loader ----
async function loadMovies() {
    // Show spinner, hide content
    spinner?.classList.remove('hidden');
    grid.innerHTML = '';
    countEl.textContent = '';
    pagDiv.innerHTML = '';

    const query  = searchEl?.value.trim() || '';
    const genre  = genreEl?.value || '';
    const { column, ascending } = getSortParams();

    try {
        let movieIds = null;

        // If genre filter is active, look up movie_ids from junction table
        if (genre) {
            const { data: mg } = await supabase
                .from('movie_genres')
                .select('movie_id')
                .eq('genre_id', Number(genre));
            movieIds = (mg || []).map(r => r.movie_id);
            if (!movieIds.length) {
                spinner?.classList.add('hidden');
                countEl.textContent = '0 movies found';
                grid.innerHTML = `<p class="text-slate-400 col-span-full">No movies match that genre.</p>`;
                return;
            }
        }

        // Build query
        let req = supabase.from('movies').select('*', { count: 'exact' });
        if (query) req = req.ilike('title', `%${query}%`);
        if (movieIds) req = req.in('movie_id', movieIds);
        req = req.order(column, { ascending });

        // Pagination range
        const from = (currentPage - 1) * PAGE_SIZE;
        const to   = from + PAGE_SIZE - 1;
        req = req.range(from, to);

        const { data, error, count } = await req;

        spinner?.classList.add('hidden');

        if (error) {
            grid.innerHTML = `<p class="text-slate-400 col-span-full">Error loading movies.</p>`;
            console.error(error);
            return;
        }

        const total = count ?? 0;
        countEl.textContent = `${total} movie${total !== 1 ? 's' : ''} found`;

        if (!data.length) {
            grid.innerHTML = `<p class="text-slate-400 col-span-full">No movies found.</p>`;
            return;
        }

        grid.innerHTML = data.map(m => `
            <a href="detail.html?id=${m.movie_id}" class="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-indigo-500 transition-colors block no-underline text-inherit card-lift animate-fade-in">
                <h3 class="text-lg font-semibold">${esc(m.title)}</h3>
                <p class="text-slate-400 text-sm">${esc(String(m.release_year ?? ''))} &middot; ${m.runtime_minutes ?? '?'} min</p>
                <p class="mt-2 text-sm">${esc((m.description ?? '').substring(0, 150))}${(m.description?.length ?? 0) > 150 ? '…' : ''}</p>
            </a>
        `).join('');

        // Render pagination
        renderPagination(total);
    } catch (err) {
        spinner?.classList.add('hidden');
        grid.innerHTML = `<p class="text-slate-400 col-span-full">Something went wrong.</p>`;
        console.error(err);
    }
}

function renderPagination(total) {
    const pages = Math.ceil(total / PAGE_SIZE);
    if (pages <= 1) { pagDiv.innerHTML = ''; return; }

    const btnClass = (active) => active
        ? 'px-3 py-1 rounded-lg bg-indigo-500 text-white text-sm'
        : 'px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:border-indigo-500 text-sm cursor-pointer';

    let html = '';
    // Prev
    if (currentPage > 1) {
        html += `<button data-page="${currentPage - 1}" class="${btnClass(false)}">&laquo; Prev</button>`;
    }
    // Page numbers (show max 7 around current)
    const start = Math.max(1, currentPage - 3);
    const end   = Math.min(pages, currentPage + 3);
    for (let i = start; i <= end; i++) {
        html += `<button data-page="${i}" class="${btnClass(i === currentPage)}">${i}</button>`;
    }
    // Next
    if (currentPage < pages) {
        html += `<button data-page="${currentPage + 1}" class="${btnClass(false)}">Next &raquo;</button>`;
    }

    pagDiv.innerHTML = html;
    pagDiv.querySelectorAll('button[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = Number(btn.dataset.page);
            loadMovies();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ---- Event listeners ----
let timer;
searchEl?.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => { currentPage = 1; loadMovies(); }, 300);
});
genreEl?.addEventListener('change', () => { currentPage = 1; loadMovies(); });
sortEl?.addEventListener('change',  () => { currentPage = 1; loadMovies(); });

// ---- Init ----
loadGenres();
loadMovies();
