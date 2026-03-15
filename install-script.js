/**
 * MINDSQL — install-script.js
 * OS auto-detection, copy-to-clipboard buttons
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ─── OS Detection ──────────────────────────────── */

    function detectOS() {
        var ua = (navigator.userAgent || '').toLowerCase();
        var platform = (navigator.platform || '').toLowerCase();
        if (ua.includes('win') || platform.includes('win')) return 'windows';
        if (ua.includes('mac') || platform.includes('mac'))  return 'macos';
        if (ua.includes('linux') || ua.includes('ubuntu') || platform.includes('linux')) return 'linux';
        return null;
    }

    var osCardIndex = { windows: 0, macos: 1, linux: 2 };
    var detectedOS = detectOS();

    if (detectedOS !== null && osCardIndex[detectedOS] !== undefined) {
        var cards = document.querySelectorAll('.install-card');
        var card  = cards[osCardIndex[detectedOS]];
        if (card) {
            var h2 = card.querySelector('h2');
            if (h2) {
                var badge = document.createElement('span');
                badge.className = 'detected-badge';
                badge.innerHTML = '✓ Your OS';
                h2.appendChild(badge);
            }
            card.style.borderColor  = 'rgba(79, 142, 255, 0.3)';
            card.style.boxShadow    = '0 12px 48px rgba(0,0,0,0.7), 0 0 40px rgba(79,142,255,0.1)';
            card.style.background   = 'linear-gradient(160deg, rgba(79,142,255,0.06) 0%, var(--card-bg) 60%)';

            // Scroll to it smoothly after a short delay
            setTimeout(function () {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 800);

            if (window.showToast) {
                setTimeout(function () {
                    showToast('✓ ' + detectedOS.charAt(0).toUpperCase() + detectedOS.slice(1) + ' detected — recommended card highlighted', 'success');
                }, 900);
            }
        }
    }

    /* ─── Copy-to-clipboard buttons ─────────────────── */

    document.querySelectorAll('.terminal-steps').forEach(function (block) {
        // Wrap in a relative container
        var wrapper = document.createElement('div');
        wrapper.className = 'terminal-steps-wrapper';
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);

        var btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        wrapper.appendChild(btn);

        btn.addEventListener('click', function () {
            // Extract only lines with a .prompt (actual commands)
            var lines = [];
            block.querySelectorAll('li').forEach(function (li) {
                var promptEl = li.querySelector('.prompt');
                if (!promptEl) return;
                // Get all text nodes after the prompt
                var text = '';
                li.childNodes.forEach(function (node) {
                    if (node === promptEl) return;
                    text += node.textContent;
                });
                text = text.trim();
                if (text) lines.push('$ ' + text);
            });

            var toCopy = lines.join('\n');
            if (!toCopy) return;

            navigator.clipboard.writeText(toCopy).then(function () {
                btn.textContent = '✓ Copied!';
                btn.classList.add('copied');
                if (window.showToast) showToast('Commands copied to clipboard!', 'success');
                setTimeout(function () {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2200);
            }).catch(function () {
                // Fallback for browsers without clipboard API
                var ta = document.createElement('textarea');
                ta.value = toCopy;
                ta.style.cssText = 'position:fixed;opacity:0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                btn.textContent = '✓ Copied!';
                btn.classList.add('copied');
                setTimeout(function () {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2200);
            });
        });
    });

});
