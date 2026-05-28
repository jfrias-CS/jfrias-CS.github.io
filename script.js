// Minimal JS — smooth-scroll fallback + nav highlight on scroll.
(() => {
    'use strict';

    // Smooth-scroll for hash links (modern browsers honor scroll-behavior: smooth in CSS,
    // but this gives explicit behavior + closes the mobile menu on click).
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Highlight the active section in the nav as the user scrolls.
    const navLinks = document.querySelectorAll('.nav nav a[href^="#"]');
    const sections = [...navLinks]
        .map((a) => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        navLinks.forEach((a) => {
                            a.style.color =
                                a.getAttribute('href') === `#${entry.target.id}`
                                    ? 'var(--accent)'
                                    : '';
                        });
                    }
                });
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );
        sections.forEach((s) => observer.observe(s));
    }
})();
