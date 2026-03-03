/**
 * js/pages/reviews/index.js
 * Reviews page — wire up form, load recent reviews
 */
import { supabase } from '../../supabase-config.js';
import { populateMovieSelect, populateUserSelect } from './form.js';
import { renderReviews } from './review.js';

async function init() {
    await Promise.all([
        populateMovieSelect('movie-select'),
        populateUserSelect('user-select'),
        renderReviews(),
    ]);

    const form = document.getElementById('review-form');
    form?.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
    e.preventDefault();
    const msg = document.getElementById('form-message');

    const movie_id  = Number(document.getElementById('movie-select').value);
    const user_id   = Number(document.getElementById('user-select').value);
    const rating    = Number(document.getElementById('rating-input').value);
    const review_text = document.getElementById('review-text').value.trim();

    if (!movie_id || !user_id || !rating || !review_text) {
        msg.textContent = 'Please fill in all fields.';
        return;
    }

    const { error } = await supabase.from('reviews').insert({
        movie_id,
        user_id,
        rating,
        review_text,
        review_date: new Date().toISOString().split('T')[0],
    });

    if (error) {
        msg.textContent = `Error: ${error.message}`;
        console.error(error);
    } else {
        msg.textContent = 'Review submitted!';
        e.target.reset();
        await renderReviews();
    }
}

init();
