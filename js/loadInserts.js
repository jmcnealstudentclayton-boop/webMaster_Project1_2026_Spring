/**
 * loadInserts.js
 * Fetches nav.html and footer.html from /pageInserts/ and injects them
 * into the current page's #nav-placeholder and #footer-placeholder elements.
 *
 * Usage: add <div id="nav-placeholder"></div> and <div id="footer-placeholder"></div>
 *        in your HTML, then import this script.
 */

const BASE = getBasePath();

function getBasePath() {
    // Determine how many levels deep we are from the project root
    // so we can resolve /pageInserts/ correctly on GitHub Pages
    const path = window.location.pathname;
    const repoName = 'webMaster_Project1_2026_Spring';
    const repoIndex = path.indexOf(repoName);
    if (repoIndex !== -1) {
        return path.substring(0, repoIndex + repoName.length);
    }
    return '';
}

async function loadInsert(file, placeholderId) {
    const el = document.getElementById(placeholderId);
    if (!el) return;
    try {
        const res = await fetch(`${BASE}/pageInserts/${file}`);
        if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`);
        el.innerHTML = await res.text();
    } catch (err) {
        console.error(err);
    }
}

function initNav() {
    // Resolve data-nav attributes into proper href with base path
    const brand = document.getElementById('nav-home-brand');
    if (brand) brand.href = BASE + '/';

    document.querySelectorAll('[data-nav]').forEach(function(a) {
        a.href = BASE + a.getAttribute('data-nav');
    });

    // Hamburger toggle
    const btn = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const hIcon = document.getElementById('hamburger-icon');
    const cIcon = document.getElementById('close-icon');
    if (!btn || !menu) return;
    btn.addEventListener('click', function() {
        menu.classList.toggle('hidden');
        const isOpen = !menu.classList.contains('hidden');
        btn.setAttribute('aria-expanded', isOpen);
        if (hIcon) hIcon.classList.toggle('hidden', isOpen);
        if (cIcon) cIcon.classList.toggle('hidden', !isOpen);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadInsert('nav.html', 'nav-placeholder');
    initNav();
    loadInsert('footer.html', 'footer-placeholder');
});
