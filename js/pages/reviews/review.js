/**
 * js/pages/reviews/review.js
 * Fetch and render recent reviews
 */
import { supabase } from '../../supabase-config.js';

export async function renderReviews() {
    const container = document.getElementById('reviews-list');
    if (!container) return;

    const { data, error } = await supabase
        .from('reviews')
        .select('*, movies(title), users(username)')
        .order('review_date', { ascending: false })
        .limit(20);

    if (error) {
        container.innerHTML = `<p class="text-slate-400">Could not load reviews.</p>`;
        console.error(error);
        return;
    }

    if (!data.length) {
        container.innerHTML = `<p class="text-slate-400">No reviews yet.</p>`;
        return;
    }

    container.innerHTML = data.map(r => `
        <div class="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <strong>${r.movies?.title ?? 'Unknown'}</strong>
            <span class="text-slate-400"> — ${r.rating}/10 by ${r.users?.username ?? 'Anon'}</span>
            <p class="mt-2 text-sm">${r.review_text}</p>
            <small class="text-slate-500">${r.review_date}</small>
        </div>
    `).join('');
}
