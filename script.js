/* ============================================================
   Jonathan Frias — Portfolio v2
   Vanilla JS. No dependencies. ~5 KB.
   ============================================================ */
(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

    /* ---------- 1. THEME TOGGLE ---------- */
    const themeToggle = $('.theme-toggle');
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', storedTheme);
    }
    themeToggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    /* ---------- 2. READING PROGRESS BAR ---------- */
    const progressFill = $('.progress-bar-fill');
    const updateProgress = () => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (scrolled / total) * 100 : 0;
        if (progressFill) progressFill.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    /* ---------- 3. CURSOR SPOTLIGHT ON HERO ---------- */
    const spotlight = $('#spotlight');
    const hero = $('.hero');
    if (spotlight && hero && !prefersReducedMotion) {
        let raf = null;
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;

        const updateSpotlight = () => {
            currentX += (targetX - currentX) * 0.15;
            currentY += (targetY - currentY) * 0.15;
            spotlight.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
            if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
                raf = requestAnimationFrame(updateSpotlight);
            } else {
                raf = null;
            }
        };
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
            if (!raf) raf = requestAnimationFrame(updateSpotlight);
        });
        hero.addEventListener('mouseleave', () => {
            spotlight.style.opacity = '0';
        });
        hero.addEventListener('mouseenter', () => {
            spotlight.style.opacity = '1';
        });
    }

    /* ---------- 4. ROLE CYCLER ---------- */
    const cycler = $('#role-cycler');
    if (cycler && !prefersReducedMotion) {
        const roles = [
            'AI-powered products',
            'full-stack apps',
            'developer tools',
            'accessibility software',
            'systems that ship',
        ];
        let i = 0;
        setInterval(() => {
            i = (i + 1) % roles.length;
            const current = $('.cycler-current', cycler);
            if (!current) return;
            current.style.animation = 'none';
            // Force reflow so the animation restarts cleanly.
            // eslint-disable-next-line no-unused-expressions
            current.offsetHeight;
            current.textContent = roles[i];
            current.style.animation = '';
        }, 2800);
    }

    /* ---------- 5. STAT COUNTER ANIMATION ---------- */
    const animateCount = (el) => {
        const target = parseInt(el.dataset.count, 10);
        if (Number.isNaN(target)) return;
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        const initialValue = 0;

        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic for a nice settle.
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(initialValue + (target - initialValue) * eased);
            el.textContent = value.toLocaleString() + (progress === 1 ? suffix : '');
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    /* ---------- 6. INTERSECTION OBSERVER: reveals + counters ---------- */
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('revealed');
                    // If this element contains stat counters, fire them.
                    $$('.stat-num [data-count], .stat-num[data-count]', entry.target).forEach(animateCount);
                    revealObserver.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        $$('[data-reveal]').forEach((el) => revealObserver.observe(el));

        /* ---------- 7. DOT-NAV ACTIVE STATE ---------- */
        const dotLinks = $$('.dot-nav a');
        const sections = dotLinks
            .map((a) => document.querySelector(a.getAttribute('href')))
            .filter(Boolean);
        if (sections.length) {
            const dotObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            dotLinks.forEach((a) => {
                                a.classList.toggle(
                                    'active',
                                    a.getAttribute('href') === `#${entry.target.id}`
                                );
                            });
                        }
                    });
                },
                { rootMargin: '-45% 0px -50% 0px' }
            );
            sections.forEach((s) => dotObserver.observe(s));
        }
    } else {
        // Fallback: just show everything if IntersectionObserver missing.
        $$('[data-reveal]').forEach((el) => el.classList.add('revealed'));
        $$('.stat-num [data-count], .stat-num[data-count]').forEach((el) => {
            el.textContent = (parseInt(el.dataset.count, 10) || 0).toLocaleString() + (el.dataset.suffix || '');
        });
    }

    /* ---------- 8. SMOOTH HASH SCROLL (closes any hover popovers) ---------- */
    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (id === '#' || !id) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Move focus for a11y.
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });
})();
