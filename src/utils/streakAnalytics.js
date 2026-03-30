import { dayjs } from "./dates.js"

const HEATMAP_WEEKS = 13
const WEEKLY_CHART_WEEKS = 12

/** @param {{ completedAt?: string | null }[]} tasks */
function completionCountsByDay(tasks) {
    const counts = {}
    for (const t of tasks) {
        if (!t.completedAt) continue
        const k = dayjs(t.completedAt).format("YYYY-MM-DD")
        counts[k] = (counts[k] || 0) + 1
    }
    return counts
}

function longestCompletionStreakDays(counts) {
    const days = Object.keys(counts)
        .filter((k) => counts[k] > 0)
        .sort()
    let best = 0
    let cur = 0
    let prev = null
    for (const k of days) {
        const date = dayjs(k)
        if (prev && date.diff(prev, "day") === 1) {
            cur += 1
        } else {
            cur = 1
        }
        best = Math.max(best, cur)
        prev = date
    }
    return best
}

/** @param {{ completedAt?: string | null }[]} tasks */
export function computeStreakAnalytics(tasks) {
    const counts = completionCountsByDay(tasks)
    const today = dayjs().startOf("day")
    const lastWeekStart = today.startOf("week")
    const firstWeekStart = lastWeekStart.subtract(HEATMAP_WEEKS - 1, "week")

    let totalCompletionsInHeatmapWindow = 0
    let activeDaysInHeatmapWindow = 0
    let d = firstWeekStart
    while (!d.isAfter(today, "day")) {
        const k = d.format("YYYY-MM-DD")
        const c = counts[k] || 0
        totalCompletionsInHeatmapWindow += c
        if (c > 0) activeDaysInHeatmapWindow++
        d = d.add(1, "day")
    }

    const bestStreakDays = longestCompletionStreakDays(counts)

    const weeklyTotals = []
    const chartFirstWeek = lastWeekStart.subtract(WEEKLY_CHART_WEEKS - 1, "week")
    for (let w = 0; w < WEEKLY_CHART_WEEKS; w++) {
        const weekStart = chartFirstWeek.add(w, "week")
        let sum = 0
        for (let dow = 0; dow < 7; dow++) {
            const day = weekStart.add(dow, "day")
            if (day.isAfter(today, "day")) continue
            sum += counts[day.format("YYYY-MM-DD")] || 0
        }
        weeklyTotals.push({
            label: weekStart.format("M/D"),
            total: sum,
        })
    }
    const maxWeekly = Math.max(1, ...weeklyTotals.map((x) => x.total))

    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0]
    for (let w = 0; w < HEATMAP_WEEKS; w++) {
        const weekStart = firstWeekStart.add(w, "week")
        for (let dow = 0; dow < 7; dow++) {
            const day = weekStart.add(dow, "day")
            if (day.isAfter(today, "day")) continue
            const k = day.format("YYYY-MM-DD")
            weekdayCounts[day.day()] += counts[k] || 0
        }
    }
    const maxWeekday = Math.max(1, ...weekdayCounts)

    const last30Days = []
    for (let i = 29; i >= 0; i--) {
        const day = today.subtract(i, "day")
        const k = day.format("YYYY-MM-DD")
        last30Days.push({
            key: k,
            count: counts[k] || 0,
        })
    }
    const maxLast30 = Math.max(1, ...last30Days.map((x) => x.count))

    return {
        totalCompletionsInHeatmapWindow,
        activeDaysInHeatmapWindow,
        bestStreakDays,
        weeklyTotals,
        maxWeekly,
        weekdayCounts,
        weekdayLabels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        maxWeekday,
        last30Days,
        maxLast30,
    }
}
