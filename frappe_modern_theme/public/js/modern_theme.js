// modern_theme.js
// - Loads theme settings (background images) from backend
// - Adds parallax on scroll
// - Watches for theme changes (data-theme on body) and toggles CSS variables

(function () {

    const FAR_MULT = 0.25;
    const MID_MULT = 0.5;

    function onScroll() {
        const y = window.scrollY || window.pageYOffset;

        document.body.style.setProperty('--parallax-far', `${y * FAR_MULT}px`);
        document.body.style.transform = `translateY(0)`;
        document.body.style.setProperty('--parallax-offset', `${Math.round(y * FAR_MULT)}px`);
    }

    // Watch for theme attribute changes
    const observer = new MutationObserver(function (mutations) {
        for (const m of mutations) {
            if (m.type === 'attributes' && m.attributeName === 'data-theme') {
                const theme = document.body.getAttribute('data-theme') || 'light';
                applyThemeVars(theme);
            }
        }
    });

    function applyThemeVars(theme) {
        if (theme === 'dark') {
            document.body.style.setProperty('--bg-current', "var(--bg-dark)");
            document.documentElement.style.setProperty('--panel-blur', '6px');
        } else {
            document.body.style.setProperty('--bg-current', "var(--bg-light)");
            document.documentElement.style.setProperty('--panel-blur', '8px');
        }
    }

    function init() {

        // -------------------------------------------------------
        // 1️⃣ Fetch background settings BEFORE applying theme vars
        // -------------------------------------------------------
        fetch('/api/method/frappe_modern_theme.api.get_theme_settings')
            .then(r => r.json())
            .then(data => {
                const s = data.message;
                if (!s.enable) return;

                if (s.light_bg) {
                    document.documentElement
                        .style.setProperty('--bg-light', `url(${s.light_bg})`);
                }
                if (s.dark_bg) {
                    document.documentElement
                        .style.setProperty('--bg-dark', `url(${s.dark_bg})`);
                }

                // re-apply theme after backgrounds are loaded
                const t = document.body.getAttribute('data-theme') || 'light';
                applyThemeVars(t);
            })
            .catch(err => console.error("[Modern Theme] Failed to load theme settings:", err));

        // -------------------------------------------------------
        // 2️⃣ Continue with normal init
        // -------------------------------------------------------
        const theme = document.body.getAttribute('data-theme') || 'light';
        applyThemeVars(theme);

        observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

        let ticking = false;
        window.addEventListener(
            'scroll',
            function () {
                if (!ticking) {
                    window.requestAnimationFrame(function () {
                        onScroll();
                        ticking = false;
                    });
                }
                ticking = true;
            },
            { passive: true }
        );

        window.frappe_modern_theme = { applyThemeVars };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();