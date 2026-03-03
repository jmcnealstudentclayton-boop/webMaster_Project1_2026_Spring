/**
 * js/pages/reviews/review.js
 * Fetch and render reviews (read-only, with optional search)
 */
import { supabase } from '../../supabase-config.js';

export async function renderReviews(query = '') {
    const container = document.getElementById('reviews-list');
    if (!container) return;

    let req = supabase
        .from('reviews')
        .select('*, movies(title), users(username)')
        .order('review_date', { ascending: false })
        .limit(50);

    const { data, error } = await req;

    if (error) {
        container.innerHTML = `<p class="text-slate-400">Could not load reviews.</p>`;
        console.error(error);
        return;
    }

    // Client-side filter by movie title or username
    let filtered = data;
    if (query) {
        const q = query.toLowerCase();
        filtered = data.filter(r =>
            (r.movies?.title ?? '').toLowerCase().includes(q) ||
            (r.users?.username ?? '').toLowerCase().includes(q)
        );
    }

    if (!filtered.length) {
        container.innerHTML = `<p class="text-slate-400">No reviews found.</p>`;
        return;
    }

    container.innerHTML = filtered.map(r => `
        <div class="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <strong>${r.movies?.title ?? 'Unknown'}</strong>
            <span class="text-slate-400"> — ${r.rating}/10 by ${r.users?.username ?? 'Anon'}</span>
            <p class="mt-2 text-sm">${r.review_text}</p>
            <small class="text-slate-500">${r.review_date}</small>
        </div>
    `).join('');
}
