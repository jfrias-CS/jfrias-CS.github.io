/* Jonathan Frias — Portfolio (refined). Vanilla JS, no dependencies. */
(() => {
    'use strict';
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    // 1. Theme toggle — persists to localStorage.
    const toggle = $('.theme-toggle');
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
        document.documentElement.setAttribute('data-theme', saved);
    }
    toggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    // 2. Subtle scroll reveal (8px translate + fade).
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('revealed');
                    io.unobserve(entry.target);
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -10% 0px' }
        );
        $$('[data-reveal]').forEach((el) => io.observe(el));
    } else {
        $$('[data-reveal]').forEach((el) => el.classList.add('revealed'));
    }

    // 3. Smooth hash scroll with focus move (a11y).
    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });
})();
