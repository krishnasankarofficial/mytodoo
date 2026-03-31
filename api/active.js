import { Redis } from "@upstash/redis"

const WINDOW_MS = 5 * 60 * 1000
const KEY = "stride:active_users"

function cors(res) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
}

/**
 * GET: count of distinct sessions seen in the last WINDOW_MS.
 * POST: { sessionId: string } — refresh this session’s heartbeat.
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN on Vercel.
 */
export default async function handler(req, res) {
    cors(res)
    if (req.method === "OPTIONS") {
        return res.status(204).end()
    }

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        return res.status(200).json({ active: null, configured: false })
    }

    const redis = Redis.fromEnv()

    const now = Date.now()
    const minScore = now - WINDOW_MS

    try {
        if (req.method === "POST") {
            let body = req.body
            if (typeof body === "string") {
                try {
                    body = JSON.parse(body || "{}")
                } catch {
                    body = {}
                }
            }
            const sessionId =
                typeof body?.sessionId === "string" && body.sessionId.length > 0 && body.sessionId.length <= 128
                    ? body.sessionId
                    : null
            if (!sessionId) {
                return res.status(400).json({ error: "sessionId required" })
            }
            await redis.zadd(KEY, { score: now, member: sessionId })
            await redis.zremrangebyscore(KEY, 0, minScore)
            return res.status(200).json({ ok: true })
        }

        if (req.method === "GET") {
            await redis.zremrangebyscore(KEY, 0, minScore)
            const active = await redis.zcard(KEY)
            return res.status(200).json({ active, configured: true })
        }

        res.setHeader("Allow", "GET, POST, OPTIONS")
        return res.status(405).json({ error: "Method not allowed" })
    } catch (e) {
        console.error("[api/active]", e)
        return res.status(503).json({ active: null, configured: true, error: "unavailable" })
    }
}
