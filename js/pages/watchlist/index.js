/**
 * js/pages/watchlist/index.js
 * Watchlist page — browse existing watchlist entries (read-only)
 */
import { supabase } from '../../supabase-config.js';
import { populateUserFilter, loadWatchlist } from './form.js';

async function init() {
    await populateUserFilter();
    await loadWatchlist();

    // Filter listeners
    document.getElementById('wl-user-filter')?.addEventListener('change', () => loadWatchlist());
    document.getElementById('wl-status-filter')?.addEventListener('change', () => loadWatchlist());
}

init();
