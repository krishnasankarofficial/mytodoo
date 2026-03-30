const SITE_NAME = "Stride"

export const DEFAULT_DESCRIPTION =
    "Stride is a fast, private task list: natural-language due dates, tags, Pomodoro focus, and streaks. Your data stays in your browser — no account, offline-capable."

function ensureMetaByProperty(property, content) {
    const sel = `meta[property="${property}"]`
    let el = document.head.querySelector(sel)
    if (!el) {
        el = document.createElement("meta")
        el.setAttribute("property", property)
        document.head.appendChild(el)
    }
    el.setAttribute("content", content)
}

function ensureMetaByName(name, content) {
    const sel = `meta[name="${name}"]`
    let el = document.head.querySelector(sel)
    if (!el) {
        el = document.createElement("meta")
        el.setAttribute("name", name)
        document.head.appendChild(el)
    }
    el.setAttribute("content", content)
}

function ensureLinkRel(rel, href) {
    const sel = `link[rel="${rel}"]`
    let el = document.head.querySelector(sel)
    if (!el) {
        el = document.createElement("link")
        el.setAttribute("rel", rel)
        document.head.appendChild(el)
    }
    el.setAttribute("href", href)
}

/**
 * Per-route title, description, Open Graph, Twitter Card, canonical, and share image.
 * Static fallbacks live in index.html (same defaults for non-JS crawlers).
 * @param {import('vue-router').RouteLocationNormalizedLoaded} route
 */
export function applyRouteSeo(route) {
    const meta = route.meta || {}
    const pageTitle = typeof meta.title === "string" ? meta.title : null
    const description = typeof meta.description === "string" ? meta.description : DEFAULT_DESCRIPTION

    const documentTitle = pageTitle ? `${pageTitle} | ${SITE_NAME}` : `${SITE_NAME} — Private local-first tasks`

    document.title = documentTitle

    ensureMetaByName("description", description)
    ensureMetaByName("robots", "index, follow")
    ensureMetaByProperty("og:title", documentTitle)
    ensureMetaByProperty("og:description", description)
    ensureMetaByProperty("og:type", "website")
    ensureMetaByProperty("og:site_name", SITE_NAME)
    ensureMetaByName("twitter:card", "summary_large_image")
    ensureMetaByName("twitter:title", documentTitle)
    ensureMetaByName("twitter:description", description)

    const path = window.location.pathname.replace(/\/+$/, "") || "/"
    const canonical = `${window.location.origin}${path}`
    ensureMetaByProperty("og:url", canonical)
    ensureLinkRel("canonical", canonical)

    const base = import.meta.env.BASE_URL || "/"
    const imagePath = `${base.replace(/\/?$/, "/")}og-image.svg`
    const ogImage = new URL(imagePath, window.location.origin).href
    ensureMetaByProperty("og:image", ogImage)
    ensureMetaByProperty("og:image:width", "1200")
    ensureMetaByProperty("og:image:height", "630")
    ensureMetaByName("twitter:image", ogImage)
}
