/* -------------------------------------------------------------------------- */
/* ANIMATIONS                                                                 */
/* -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    // --- Entry animations ---
    const entryElements = document.querySelectorAll('[class^="animation-entry-"]');
    window.addEventListener("load", () => {
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                entry.target.classList.toggle("in-view", entry.isIntersecting);
            }
        }, { threshold: 0.2 });
        entryElements.forEach(el => observer.observe(el));
    });

    // --- Tap animations ---
    document.querySelectorAll('[class^="animation-tap-"]').forEach(el => {
        let isAnimating = false;
        let hasPlayedOnce = false;

        el.addEventListener("animationend", () => {
            isAnimating = false;
        });

        el.addEventListener("click", () => {
            if (isAnimating) return; // Wait until animation finishes

            const computed = getComputedStyle(el);
            const dir = computed.animationDirection;
            const isReversible =
            dir.includes("alternate") || dir.includes("alternate-reverse");

            el.classList.remove("active");
            void el.offsetWidth;

            // Only toggle direction if animation is marked as reversible
            if (hasPlayedOnce && isReversible) {
                el.classList.toggle("reverse-mode");
            }

            el.classList.add("active");
            hasPlayedOnce = true;
            isAnimating = true;
        });
    });
});


(function () {
    function normalize(ids) {
        return Array.isArray(ids) ? ids : [ids];
    }

    function addTrait(elementIDs, attribute) {
        normalize(elementIDs).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.setAttribute(attribute, "");
        });
    }

    function removeTrait(elementIDs, attribute) {
        normalize(elementIDs).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.removeAttribute(attribute);
        });
    }

    function toggleTrait(elementIDs, attribute) {
        normalize(elementIDs).forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;

            if (el.hasAttribute(attribute)) {
                el.removeAttribute(attribute);
            } else {
                el.setAttribute(attribute, "");
            }
        });
    }

    // Namespaced public API
    window.RaptorIdentity = {
        add: addTrait,
        remove: removeTrait,
        toggle: toggleTrait
    };
})();


/* -------------------------------------------------------------------------- */
/* MODAL & POPOVER                                                */
/* -------------------------------------------------------------------------- */

const openModal = id => document.getElementById(id)?.showModal();
const closeModal = id => document.getElementById(id)?.close();
const openPopover = id => document.getElementById(id)?.showPopover();
const closePopover = id => document.getElementById(id)?.hidePopover();


// =========================================================
// SCROLL VIEWS
// =========================================================

(function () {
    function initAutoplay(el) {
        const interval = Number(el.dataset.autoplayInterval);
        const loops = el.dataset.autoplayLoops === "true";
        const axis = el.dataset.scrollAxis;

        let index = 0;
        const slides = el.querySelectorAll(":scope > .scroll-group > *");
        const total = slides.length;

        const scrollBy = axis === "horizontal" ? "left" : "top";
        const scrollSize = axis === "horizontal" ? "scrollWidth" : "scrollHeight";

        setInterval(() => {
            if (loops) {
                index = (index + 1) % total;
            } else if (index < total - 1) {
                index++;
            } else {
                return;
            }

            const step = el[scrollSize] / total;
            el.scrollTo({
                [scrollBy]: index * step,
                behavior: "smooth"
            });
        }, interval);
    }

    document.addEventListener("DOMContentLoaded", () => {
        document
            .querySelectorAll("[data-scroll-autoplay]")
            .forEach(initAutoplay);
    });
})();

(function () {
    function getScrollView(id) {
        const el = document.getElementById(id);
        if (!el || el.children.length === 0) return null;
        return el;
    }

    function scrollAmount(el) {
        const items = el.querySelectorAll(":scope > .scroll-group > .scroll-item");
        if (!items.length) return 0;
        return el.scrollWidth / items.length;
    }

    function scrollBackward(id) {
        const el = getScrollView(id);
        if (!el) return;
        el.scrollBy({ left: -scrollAmount(el), behavior: 'smooth' });
    }

    function scrollForward(id) {
        const el = getScrollView(id);
        if (!el) return;
        el.scrollBy({ left: scrollAmount(el), behavior: 'smooth' });
    }

    function scrollTo(id, index) {
        const el = getScrollView(id);
        if (!el) return;

        const slide = el.children[index];
        if (!slide) return;

        slide.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }

    // Namespaced public API
    window.RaptorScroll = {
        backward: scrollBackward,
        forward: scrollForward,
        to: scrollTo
    };
})();


/* -------------------------------------------------------------------------- */
/* THEME SWITCHING                                                            */
/* -------------------------------------------------------------------------- */

const root = document.documentElement;
const THEME_KEY = "custom-theme-id";
const COLOR_KEY = "color-scheme";

// ---------------------------------------------------------------------------
// COLOR SCHEME
// ---------------------------------------------------------------------------

function getSystemScheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function getColorPreference() {
    return localStorage.getItem(COLOR_KEY) || "auto";
}

function setColorScheme(scheme) {
    localStorage.setItem(COLOR_KEY, scheme);
    applyColorScheme(scheme);
}

function syncHighlighterTheme() {
    const root = document.documentElement;

    const blockTheme = getComputedStyle(root)
        .getPropertyValue("--highlighter-theme")
        .trim()
        .replace(/"/g, "");

    const inlineTheme = getComputedStyle(root)
        .getPropertyValue("--inline-highlighter-theme")
        .trim()
        .replace(/"/g, "");

    if (blockTheme) {
        root.setAttribute("data-highlighter-theme", blockTheme);
    }

    if (inlineTheme) {
        root.setAttribute("data-inline-highlighter-theme", inlineTheme);
    }
}

function applyColorScheme(scheme) {
    const resolved =
        scheme === "auto" || !scheme
            ? getSystemScheme()
            : scheme;

    root.setAttribute("data-color-scheme", resolved);
    syncHighlighterTheme();
}

// ---------------------------------------------------------------------------
// THEME FAMILY
// ---------------------------------------------------------------------------

function getThemePreference() {
    return localStorage.getItem(THEME_KEY) || null;
}

function setTheme(themeID) {
    if (themeID) {
        localStorage.setItem(THEME_KEY, themeID);
        root.setAttribute("data-theme", themeID);
    } else {
        localStorage.removeItem(THEME_KEY);
        root.removeAttribute("data-theme");
    }

    syncHighlighterTheme();
}

// ---------------------------------------------------------------------------
// SYSTEM CHANGE LISTENER
// ---------------------------------------------------------------------------

window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
        if (getColorPreference() === "auto") {
            applyColorScheme("auto");
        }
    });

// ---------------------------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------------------------

(function init() {
    // Respect hard lock if present
    if (root.hasAttribute("data-lock-scheme")) {
        const locked =
            root.getAttribute("data-color-scheme") || "light";

        root.setAttribute("data-color-scheme", locked);
        localStorage.setItem(COLOR_KEY, locked);
        return;
    }

    const savedTheme = getThemePreference();
    const savedScheme = getColorPreference();

    if (savedTheme) {
        root.setAttribute("data-theme", savedTheme);
    }

    applyColorScheme(savedScheme);
})();


/* -------------------------------------------------------------------------- */
/* SMART DISCLOSURES                                                          */
/* -------------------------------------------------------------------------- */

class SmartDisclosure {
    constructor(el) {
        this.el = el;
        this.summary = el.querySelector('.summary');
        this.content = el.querySelector('.disc-content');
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;

        this.summary.addEventListener('click', (e) => this.onClick(e));
        this.summary.addEventListener('keydown', (e) => this.onKeyDown(e));
    }

    onClick(e) {
        e.preventDefault();
        this.toggle();
    }

    onKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle();
        }
    }

    toggle() {
        this.el.style.overflow = 'hidden';

        if (this.isClosing || !this.el.open) {
            this.open();
        } else if (this.isExpanding || this.el.open) {
            this.shrink();
        }
    }

    getAnimationProperties() {
        const computedStyle = getComputedStyle(this.el);
        const durationValue = computedStyle.getPropertyValue('--disc-duration') ||
        computedStyle.getPropertyValue('--anim-duration') ||
        '0.2s';
        const duration = parseFloat(durationValue) * 1000;
        const easing = computedStyle.getPropertyValue('--disc-easing') ||
        computedStyle.getPropertyValue('--anim-easing') ||
        'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        if (duration <= 0) return null;
        return { duration, easing };
    }

    shrink() {
        this.isClosing = true;
        this.summary.classList.add('closing');
        this.summary.classList.remove('hovered');
        this.summary.setAttribute('aria-expanded', 'false');

        // Measure before closing
        const startHeight = `${this.el.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight}px`;

        if (this.animation) this.animation.cancel();

        const props = this.getAnimationProperties();

        // Temporarily fix height before removing [open]
        this.el.style.height = startHeight;
        this.el.style.overflow = 'hidden';

        // Defer removing [open] to next frame
        requestAnimationFrame(() => {
            this.el.open = false; // remove attribute AFTER we captured height

            if (props) {
                this.animation = this.el.animate(
                    { height: [startHeight, endHeight] },
                    props
                    );

                this.animation.onfinish = () => this.onAnimationFinish(false);
                this.animation.oncancel = () => (this.isClosing = false);
            } else {
                this.el.style.height = endHeight;
                this.onAnimationFinish(false);
            }
        });
    }

    open() {
        this.el.style.height = `${this.el.offsetHeight}px`;
        this.el.open = true;
        this.summary.setAttribute('aria-expanded', 'true');
        window.requestAnimationFrame(() => this.expand());
    }

    expand() {
        this.isExpanding = true;
        const startHeight = `${this.el.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

        if (this.animation) this.animation.cancel();

        const props = this.getAnimationProperties();
        if (props) {
            this.animation = this.el.animate({ height: [startHeight, endHeight] }, props);
            this.animation.onfinish = () => this.onAnimationFinish(true);
            this.animation.oncancel = () => (this.isExpanding = false);
        } else {
            this.el.style.height = endHeight;
            this.onAnimationFinish(true);
        }
    }

    onAnimationFinish(open) {
        this.el.open = open;
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.el.style.height = this.el.style.overflow = '';
        this.summary.removeAttribute('data-state');
    }
}

// Initialize all <details>
document.querySelectorAll('details.disclosure').forEach((el) => new SmartDisclosure(el));


/* -------------------------------------------------------------------------- */
/* LINK PROTECTION                                                */
/* -------------------------------------------------------------------------- */

function encodeEmail(email) { return btoa(email); }
function decode(encoded) { return atob(encoded); }

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.protected-link').forEach(link => {
        try { link.textContent = decode(link.textContent); } catch {}
    });
});

document.addEventListener('click', e => {
    const protectedLink = e.target.closest('.protected-link');
    if (!protectedLink) return;
    e.preventDefault();
    window.location.href = decode(protectedLink.getAttribute('data-encoded-url'));
});


(function () {
    const STORAGE_PREFIX = 'segmented-control:';

    function initControl(control) {
        if (control.hasAttribute('data-initialized')) return;

        const segments = control.querySelectorAll('.segment');
        const persist = control.hasAttribute('data-persist-selection');

        const key = persist
            ? STORAGE_PREFIX + (control.getAttribute('data-selected-segment') ?? 'default')
            : null;

        let activeIndex = 0;

        // Restore persisted value
        if (key) {
            const saved = parseInt(localStorage.getItem(key), 10);
            if (!isNaN(saved) && segments[saved]) {
                activeIndex = saved;
            }
        }

        // Default selection fallback
        if (activeIndex === 0) {
            const def = [...segments]
                .findIndex(s => s.hasAttribute('data-default-selection'));
            if (def !== -1) activeIndex = def;
        }

        // Apply initial state
        segments.forEach((seg, i) =>
            seg.classList.toggle('active', i === activeIndex)
        );

        // Click handling
        segments.forEach((segment, index) => {
            segment.addEventListener('click', (e) => {
                if (segment.classList.contains('active')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return;
                }

                segments.forEach(s => s.classList.remove('active'));
                segment.classList.add('active');

                if (key) {
                    localStorage.setItem(key, index);
                }

                control.dispatchEvent(new CustomEvent('segmentChange', {
                    detail: {
                        index,
                        label: segment.textContent.trim(),
                        control
                    }
                }));
            }, true);
        });

        control.setAttribute('data-initialized', 'true');
    }

    // Init any controls already in DOM
    document.querySelectorAll('.segmented-control')
        .forEach(initControl);

    // Observe future additions
    new MutationObserver(mutations => {
        for (const m of mutations) {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;

                if (node.matches?.('.segmented-control')) {
                    initControl(node);
                }

                node.querySelectorAll?.('.segmented-control')
                    .forEach(initControl);
            });
        }
    }).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();


// =========================================================
// Multilingual Site Logic
// =========================================================

function setLocale(locale) {
    try {
        localStorage.setItem("preferredLocale", locale);
        document.documentElement.lang = locale;

        const base = window.location.origin;
        let currentPath = window.location.pathname
        .replace(/^\/[a-z]{2}(-[A-Z]{2})?\//, '') // remove existing locale prefix if any
        .replace(/^\/+/, ''); // strip leading slashes

        // Build the new URL cleanly
        let newURL = `${base}/${locale}`;
        if (currentPath.length > 0) {
            newURL += `/${currentPath}`;
        }

        // Navigate to the new locale path
        window.location.href = newURL;
    } catch (err) {
        console.error("Failed to switch locale:", err);
    }
}


// Raptor appear effect runtime
// Automatically reveals elements with `.appear` when they enter the viewport.

document.addEventListener("DOMContentLoaded", () => {
    const appearElements = document.querySelectorAll(".entry");
    const initialStates = new WeakMap();

    appearElements.forEach((el) => {
        const vars = (el.dataset.animVars || "")
            .split(",")
            .map(v => v.trim())
            .filter(Boolean);

        const computedStyle = getComputedStyle(el);
        const initialValues = {};

        // Capture current inline/computed values
        for (const varName of vars) {
            if (varName === "transition") continue;
            const value = computedStyle.getPropertyValue(varName).trim();
            initialValues[varName] = value;
        }

        initialStates.set(el, initialValues);
    });

    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            const el = entry.target;
            const isVisible = entry.isIntersecting;

            if (isVisible) {
                el.classList.add("visible");
            } else {
                el.classList.remove("visible");

                const initialValues = initialStates.get(el);
                if (initialValues) {
                    for (const [varName, value] of Object.entries(initialValues)) {
                        el.style.setProperty(varName, value);
                    }
                }
            }
        }
    }, { threshold: 0.15 });

    appearElements.forEach(el => observer.observe(el));
});


(function () {
    const root = document.documentElement;
    const COLOR_KEY = "color-scheme";

    function getPref() {
        return localStorage.getItem(COLOR_KEY) || "auto";
    }

    function setPref(value) {
        localStorage.setItem(COLOR_KEY, value);
        applyScheme(value);
    }

    function getSystem() {
        return matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    function syncHighlighterTheme() {
        const root = document.documentElement;

        const blockTheme = getComputedStyle(root)
            .getPropertyValue("--highlighter-theme")
            .trim()
            .replace(/"/g, "");

        const inlineTheme = getComputedStyle(root)
            .getPropertyValue("--inline-highlighter-theme")
            .trim()
            .replace(/"/g, "");

        if (blockTheme) {
            root.setAttribute("data-highlighter-theme", blockTheme);
        }

        if (inlineTheme) {
            root.setAttribute("data-inline-highlighter-theme", inlineTheme);
        }
    }

    function applyScheme(pref) {
        const scheme =
            pref === "auto" || !pref ? getSystem() : pref;

        root.setAttribute("data-color-scheme", scheme);
        syncHighlighterTheme();
    }

    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (getPref() === "auto") applyScheme("auto");
    });

    // Initialize on load
    applyScheme(getPref());
})();


/* -------------------------------------------------------------------------- */
/* MENUS                                                                      */
/* -------------------------------------------------------------------------- */

(() => {
    // Open / Close logic
    document.addEventListener('click', e => {
        const button = e.target.closest('[data-toggle="dropdown"]');
        if (!button) return;
        e.stopPropagation();

        const menu = button.closest('.menu');
        if (!menu) return;

        // --- FIX: reliably find dropdown even if wrapped in .menu-group ---
        let sibling = button.nextElementSibling;
        while (sibling && !sibling.classList?.contains('menu-dropdown')) {
            sibling = sibling.nextElementSibling;
        }
        const dropdown = sibling || menu.querySelector(':scope > .menu-dropdown');

        if (!dropdown) return;

        // Close all other menus
        document.querySelectorAll('.menu-dropdown[data-show]').forEach(m => {
            if (m !== dropdown) closeDropdown(m);
        });

        // Toggle current
        dropdown.getAttribute('data-show') === 'true'
        ? closeDropdown(dropdown)
        : openDropdown(dropdown);
    });

    function openDropdown(dropdown) {
        dropdown.style.display = 'block';
        dropdown.offsetHeight;
        dropdown.setAttribute('data-show', 'true');
        adjustHeight(dropdown);
        attachAutoDismiss(dropdown);
    }

    function closeDropdown(dropdown) {
        dropdown.removeAttribute('data-show');
        setTimeout(() => {
            if (!dropdown.hasAttribute('data-show')) dropdown.style.display = '';
        }, 150);
    }

    // Adjust max-height when viewport resizes
    function adjustHeight(dropdown) {
        const rect = dropdown.getBoundingClientRect();
        const maxAvailable = window.innerHeight - Math.max(rect.top, 0) - 10;
        dropdown.style.maxHeight = `${maxAvailable}px`;
        dropdown.style.overflowY = 'auto';
    }

    window.addEventListener('resize', () => {
        document.querySelectorAll('.menu-dropdown[data-show="true"]').forEach(adjustHeight);
    });

    // Dismiss mode: auto/manual
    function attachAutoDismiss(dropdown) {
        const root = dropdown.closest('[data-menu-dismiss], [data-dismiss]');
        const mode = root?.getAttribute('data-menu-dismiss') || root?.getAttribute('data-dismiss') || 'auto';
        if (mode !== 'auto') return;

        dropdown.querySelectorAll('a, button').forEach(el => {
            if (el.matches('[data-toggle="dropdown"]') || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
            el.addEventListener('click', () => closeDropdown(dropdown), { once: true });
        });
    }

    // Click outside
    document.addEventListener('click', e => {
        if (!e.target.closest('.menu, .menu-dropdown[data-show]')) {
            document.querySelectorAll('.menu-dropdown[data-show]').forEach(closeDropdown);
        }
    });

    // Escape closes menu
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.menu-dropdown[data-show]').forEach(closeDropdown);
        }
    });
})();

/* -------------------------------------------------------------------------- */
/* SECTION 8: ACTIVE LINK HIGHLIGHT                                          */
/* -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const currentHost = window.location.host;

    document.querySelectorAll('.menu-dropdown a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        try {
            const url = new URL(href, window.location.origin);

            if (url.host !== currentHost) return;

            const linkPath = url.pathname.replace(/\/$/, '');
            if (linkPath === currentPath) {
                link.dataset.active = 'true';
            }
        } catch {
            // Ignore invalid or malformed URLs
        }
    });
});


/* -------------------------------------------------------------------------- */
/* TABLES                                                                     */
/* -------------------------------------------------------------------------- */

function raptorFilterTable(searchText, tableId) {
    const input = searchText.toLowerCase();
    const tbody = document.getElementById(tableId)?.querySelector('tbody');
    if (!tbody) return;

    if (!tbody.raptorFilterOriginalRows) {
        tbody.raptorFilterOriginalRows = Array.from(tbody.rows);
    }

    tbody.innerHTML = '';
    tbody.raptorFilterOriginalRows
    .filter(row => row.textContent.toLowerCase().includes(input))
    .forEach(row => tbody.appendChild(row));
}


