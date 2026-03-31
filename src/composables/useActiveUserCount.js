import { ref, onMounted, onUnmounted } from "vue"

const STORAGE_KEY = "stride_presence_session"

function getSessionId() {
    try {
        let id = localStorage.getItem(STORAGE_KEY)
        if (!id && typeof crypto !== "undefined" && crypto.randomUUID) {
            id = crypto.randomUUID()
            localStorage.setItem(STORAGE_KEY, id)
        }
        return id
    } catch {
        return null
    }
}

function apiBase() {
    const base = import.meta.env.VITE_ACTIVE_USERS_API
    if (typeof base === "string" && base.length > 0) {
        return base.replace(/\/$/, "")
    }
    return ""
}

/**
 * Polls GET /api/active and sends POST heartbeats so the server can count
 * recent sessions (Vercel + Upstash — see api/active.js).
 */
export function useActiveUserCount() {
    const active = ref(null)
    const configured = ref(null)
    let pollTimer = null
    let heartbeatTimer = null

    const prefix = apiBase()

    async function fetchCount() {
        try {
            const r = await fetch(`${prefix}/api/active`, {
                method: "GET",
                headers: { Accept: "application/json" },
            })
            if (!r.ok) {
                active.value = null
                configured.value = false
                return
            }
            const data = await r.json()
            if (data.configured === false) {
                active.value = null
                configured.value = false
                return
            }
            configured.value = true
            active.value = typeof data.active === "number" ? data.active : null
        } catch {
            active.value = null
            configured.value = false
        }
    }

    async function heartbeat() {
        const sessionId = getSessionId()
        if (!sessionId) return
        try {
            await fetch(`${prefix}/api/active`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ sessionId }),
            })
        } catch {
            /* ignore */
        }
    }

    function start() {
        fetchCount()
        pollTimer = window.setInterval(fetchCount, 45_000)
        heartbeat()
        heartbeatTimer = window.setInterval(heartbeat, 60_000)
    }

    function stop() {
        if (pollTimer) {
            clearInterval(pollTimer)
            pollTimer = null
        }
        if (heartbeatTimer) {
            clearInterval(heartbeatTimer)
            heartbeatTimer = null
        }
    }

    onMounted(() => {
        start()
    })

    onUnmounted(() => {
        stop()
    })

    return { active, configured }
}
