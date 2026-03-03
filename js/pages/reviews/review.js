/**
 * js/pages/reviews/review.js
 * Fetch and render reviews (read-only) with pagination, XSS-safe
 */
import { supabase } from '../../supabase-config.js';

const PAGE_SIZE = 20;
let currentPage = 1;
let cachedData  = [];

// ---- XSS helper ----
function esc(str) {
    const d = document.createElement('div');
    d.textContent = str ?? '';
    return d.innerHTML;
}

export async function renderReviews(query = '') {
    const container = document.getElementById('reviews-list');
    const spinner   = document.getElementById('review-spinner');
    const countEl   = document.getElementById('review-count');
    const pagDiv    = document.getElementById('review-pagination');
    if (!container) return;

    // Show spinner
    spinner?.classList.remove('hidden');
    container.innerHTML = '';
    if (countEl) countEl.textContent = '';
    if (pagDiv) pagDiv.innerHTML = '';

    // Reset page when query changes
    if (query !== renderReviews._lastQuery) {
        currentPage = 1;
        renderReviews._lastQuery = query;
    }

    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*, movies(title), users(username)')
            .order('review_date', { ascending: false });

        spinner?.classList.add('hidden');

        if (error) {
            container.innerHTML = `<p class="text-slate-400">Could not load reviews.</p>`;
            console.error(error);
            return;
        }

        // Client-side filter by movie title or username
        cachedData = data || [];
        if (query) {
            const q = query.toLowerCase();
            cachedData = cachedData.filter(r =>
                (r.movies?.title ?? '').toLowerCase().includes(q) ||
                (r.users?.username ?? '').toLowerCase().includes(q)
            );
        }

        const total = cachedData.length;
        if (countEl) countEl.textContent = `${total} review${total !== 1 ? 's' : ''} found`;

        if (!total) {
            container.innerHTML = `<p class="text-slate-400">No reviews found.</p>`;
            return;
        }

        // Paginate
        const from = (currentPage - 1) * PAGE_SIZE;
        const page = cachedData.slice(from, from + PAGE_SIZE);

        container.innerHTML = page.map(r => `
            <div class="bg-slate-800 border border-slate-700 rounded-lg p-5">
                <strong>${esc(r.movies?.title)}</strong>
                <span class="text-slate-400"> — ${r.rating}/10 by ${esc(r.users?.username)}</span>
                <p class="mt-2 text-sm">${esc(r.review_text)}</p>
                <small class="text-slate-500">${esc(r.review_date)}</small>
            </div>
        `).join('');

        // Render pagination
        renderPagination(total, query, pagDiv);
    } catch (err) {
        spinner?.classList.add('hidden');
        container.innerHTML = `<p class="text-slate-400">Something went wrong.</p>`;
        console.error(err);
    }
}
renderReviews._lastQuery = '';

function renderPagination(total, query, pagDiv) {
    if (!pagDiv) return;
    const pages = Math.ceil(total / PAGE_SIZE);
    if (pages <= 1) { pagDiv.innerHTML = ''; return; }

    const btnClass = (active) => active
        ? 'px-3 py-1 rounded-lg bg-indigo-500 text-white text-sm'
        : 'px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:border-indigo-500 text-sm cursor-pointer';

    let html = '';
    if (currentPage > 1) {
        html += `<button data-page="${currentPage - 1}" class="${btnClass(false)}">&laquo; Prev</button>`;
    }
    const start = Math.max(1, currentPage - 3);
    const end   = Math.min(pages, currentPage + 3);
    for (let i = start; i <= end; i++) {
        html += `<button data-page="${i}" class="${btnClass(i === currentPage)}">${i}</button>`;
    }
    if (currentPage < pages) {
        html += `<button data-page="${currentPage + 1}" class="${btnClass(false)}">Next &raquo;</button>`;
    }

    pagDiv.innerHTML = html;
    pagDiv.querySelectorAll('button[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = Number(btn.dataset.page);
            renderReviews(query);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}
