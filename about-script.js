/**
 * MINDSQL — about-script.js
 * Stat counters, 3D tilt effect on cards
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ─── Animated Stat Counters ─────────────────────── */

    function animCounter(el, target, suffix) {
        suffix = suffix || '';
        var start = null;
        var duration = 1600;

        function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var val = Math.floor(eased * target);
            el.textContent = (target === Infinity ? '∞' : val) + suffix;
            if (progress < 1 && target !== Infinity) requestAnimationFrame(step);
        }

        if (target === Infinity) {
            el.textContent = '∞';
        } else {
            requestAnimationFrame(step);
        }
    }

    var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var numEl = entry.target.querySelector('.stat-number');
            if (!numEl || numEl.dataset.counted) return;
            numEl.dataset.counted = '1';
            var t = numEl.dataset.target;
            var target = t === 'inf' ? Infinity : parseInt(t, 10);
            animCounter(numEl, target, numEl.dataset.suffix || '');
            statObserver.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item').forEach(function (el) {
        statObserver.observe(el);
    });

    /* ─── 3D Tilt Effect on Feature Cards ───────────── */

    document.querySelectorAll('.glass-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var cx = rect.left + rect.width  / 2;
            var cy = rect.top  + rect.height / 2;
            var dx = (e.clientX - cx) / (rect.width  / 2);  // -1 to 1
            var dy = (e.clientY - cy) / (rect.height / 2);  // -1 to 1
            var tiltX = -dy * 7;
            var tiltY =  dx * 7;
            card.style.transform = `translateY(-5px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.3s ease';
        });
    });
});
