/** GA4 measurement ID — keep in sync with `index.html` gtag snippet */
export const GA_MEASUREMENT_ID = "G-HVKHH79D4Q"

/**
 * Record a page view for SPA navigations (initial load uses router afterEach too).
 * @param {string} path — e.g. route fullPath
 */
export function trackGaPageView(path) {
    if (typeof window.gtag !== "function") return
    window.gtag("config", GA_MEASUREMENT_ID, { page_path: path })
}
