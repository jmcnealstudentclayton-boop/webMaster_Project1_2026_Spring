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
        container.innerHTML = `<p class="text-muted">Could not load reviews.</p>`;
        console.error(error);
        return;
    }

    if (!data.length) {
        container.innerHTML = `<p class="text-muted">No reviews yet.</p>`;
        return;
    }

    container.innerHTML = data.map(r => `
        <div class="card mb-2">
            <strong>${r.movies?.title ?? 'Unknown'}</strong>
            <span class="text-muted"> — ${r.rating}/10 by ${r.users?.username ?? 'Anon'}</span>
            <p class="mt-1">${r.review_text}</p>
            <small class="text-muted">${r.review_date}</small>
        </div>
    `).join('');
}
