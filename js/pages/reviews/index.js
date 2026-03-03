/**
 * js/pages/reviews/index.js
 * Reviews page — browse existing reviews (read-only)
 */
import { supabase } from '../../supabase-config.js';
import { renderReviews } from './review.js';

const searchEl = document.getElementById('review-search');

// Debounced search
let timer;
searchEl?.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => renderReviews(searchEl.value.trim()), 300);
});

// Initial load
renderReviews();
