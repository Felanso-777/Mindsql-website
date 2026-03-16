/**
 * MINDSQL — transitions.js
 * Shared across all pages: page transitions, matrix, cursor, toast, scroll reveal, hamburger
 */

(function () {
    'use strict';

    /* ============================================================
       PAGE TRANSITION OVERLAY
    ============================================================ */

    const overlay = document.createElement('div');
    overlay.id = 'page-transition';
    overlay.innerHTML = `
        <div class="transition-logo">MIND<span>SQL</span></div>
        <div class="transition-bar"><div class="transition-bar-fill"></div></div>
    `;
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    document.body.appendChild(overlay);

    // Fade out on load (page has arrived)
    window.addEventListener('DOMContentLoaded', () => {
        overlay.classList.add('blocking'); // triggers fill animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            });
        });
    });

    // Intercept internal navigation
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href
            || href.startsWith('#')
            || href.startsWith('javascript')
            || href.startsWith('http')
            || href.startsWith('mailto')
            || link.target === '_blank') return;

        e.preventDefault();

        overlay.style.transition = 'opacity 0.38s cubic-bezier(0.4, 0, 0.2, 1)';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'all';
        overlay.classList.add('blocking');

        setTimeout(function () {
            window.location.href = href;
        }, 420);
    });


    /* ============================================================
       MATRIX CANVAS
    ============================================================ */

    // Skip on mobile to save performance
    if (window.innerWidth > 640) {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        const chars = '01アイウエオSQL><{}[]MINDSELECTFROM';
        const fontSize = 13;
        let drops = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const cols = Math.floor(canvas.width / fontSize);
            drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -50));
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.048)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(79, 142, 255, 0.85)';
            ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.974) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(drawMatrix, 55);
    }


    /* ============================================================
       CUSTOM CURSOR (pointer devices only)
    ============================================================ */

    if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 640) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        const ring = document.createElement('div');
        ring.className = 'cursor-ring';
        document.body.appendChild(cursor);
        document.body.appendChild(ring);

        // Instant snap — no rAF loop, no lag
        document.addEventListener('mousemove', function (e) {
            var x = e.clientX, y = e.clientY;
            cursor.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
            ring.style.transform   = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
        }, { passive: true });

        const hoverSel = 'a, button, input, label, .glass-card, .team-card, .copy-btn, .hamburger, .download-btn';

        document.addEventListener('mouseover', function (e) {
            if (e.target.closest(hoverSel)) {
                cursor.classList.add('hovering');
                ring.classList.add('hovering');
            }
        });

        document.addEventListener('mouseout', function (e) {
            if (e.target.closest(hoverSel)) {
                cursor.classList.remove('hovering');
                ring.classList.remove('hovering');
            }
        });
    }


    /* ============================================================
       TOAST SYSTEM — window.showToast(msg, type)
    ============================================================ */

    const toastWrap = document.createElement('div');
    toastWrap.className = 'toast-container';
    document.body.appendChild(toastWrap);

    window.showToast = function (message, type) {
        type = type || 'info';
        const t = document.createElement('div');
        t.className = 'toast';

        var icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
        var color = type === 'success' ? '#3fb950' : type === 'error' ? '#ff5f56' : 'var(--accent-color)';
        t.style.borderLeftColor = color;
        t.innerHTML = `<span style="color:${color};margin-right:0.5rem">${icon}</span>${message}`;

        toastWrap.appendChild(t);

        setTimeout(function () {
            t.classList.add('exit');
            setTimeout(function () { t.remove(); }, 350);
        }, 3200);
    };


    /* ============================================================
       SCROLL REVEAL
    ============================================================ */

    window.addEventListener('DOMContentLoaded', function () {
        var els = document.querySelectorAll(
            '.glass-card, .stat-item, .timeline-item, .team-card, .troubleshoot-item'
        );

        els.forEach(function (el, i) {
            // Override any CSS animations
            el.style.animation = 'none';
            el.style.opacity = '0';
            el.style.transform = 'translateY(28px)';
            var delay = (i % 4) * 90;
            el.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
        });

        var revealObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        els.forEach(function (el) { revealObs.observe(el); });
    });


    /* ============================================================
       RIPPLE EFFECT
    ============================================================ */

    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.download-btn, .copy-btn');
        if (!btn) return;

        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height) * 2;
        var r = document.createElement('span');
        r.style.cssText = [
            'position:absolute',
            'border-radius:50%',
            'background:rgba(255,255,255,0.16)',
            'pointer-events:none',
            `width:${size}px`,
            `height:${size}px`,
            `left:${e.clientX - rect.left - size / 2}px`,
            `top:${e.clientY - rect.top - size / 2}px`,
            'transform:scale(0)',
            'animation:rippleAnim 0.6s linear forwards',
        ].join(';');

        if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(r);
        setTimeout(function () { r.remove(); }, 620);
    });


    /* ============================================================
       HAMBURGER MENU
    ============================================================ */

    window.addEventListener('DOMContentLoaded', function () {
        var navContainer = document.querySelector('.nav-container');
        var navLinks = document.querySelector('.nav-links');
        if (!navContainer || !navLinks) return;

        var ham = document.createElement('button');
        ham.className = 'hamburger';
        ham.setAttribute('aria-label', 'Toggle navigation');
        ham.innerHTML = '<span></span><span></span><span></span>';
        navContainer.appendChild(ham);

        ham.addEventListener('click', function (e) {
            e.stopPropagation();
            ham.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        document.addEventListener('click', function () {
            ham.classList.remove('open');
            navLinks.classList.remove('open');
        });

        navLinks.addEventListener('click', function (e) { e.stopPropagation(); });
    });

})();
