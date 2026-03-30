<template>
    <section>
        <h2 class="text-xl font-PoppinsBold mb-2 text-left">Streak activity</h2>
        <p class="text-sm text-light/50 mb-6 text-left max-w-xl">
            Sample completion heatmap (dummy data) — same layout as the header streak popover, shown larger for
            preview.
        </p>

        <div
            class="rounded-xl border border-light/15 bg-gray/40 p-6 overflow-x-auto"
        >
            <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
                <p class="text-xs text-light/60">Last 13 weeks · completions per day</p>
                <div class="flex items-center gap-2 text-[10px] text-light/50">
                    <span>Less</span>
                    <div class="flex gap-2">
                        <span class="w-3 h-3 rounded-sm bg-light/12" />
                        <span class="w-3 h-3 rounded-sm bg-green/40" />
                        <span class="w-3 h-3 rounded-sm bg-green/60" />
                        <span class="w-3 h-3 rounded-sm bg-green/80" />
                        <span class="w-3 h-3 rounded-sm bg-green" />
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div class="flex gap-3 sm:gap-4 items-start min-w-0">
                <div class="flex flex-col justify-between text-[10px] text-light/40 shrink-0 w-8 h-[9.25rem]">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                </div>
                <StreakHeatmapGrid :columns="dummyColumns" size="lg" />
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from "vue"
import { dayjs } from "../utils/dates.js"
import StreakHeatmapGrid from "../components/StreakHeatmapGrid.vue"

/** Deterministic dummy grid: same shape as `streakContributionColumns` */
function buildDummyStreakColumns() {
    const numWeeks = 13
    const today = dayjs().startOf("day")
    const lastWeekStart = today.startOf("week")
    const firstWeekStart = lastWeekStart.subtract(numWeeks - 1, "week")
    const columns = []
    let seed = 2463534242

    function rnd() {
        seed ^= seed << 13
        seed ^= seed >>> 17
        seed ^= seed << 5
        return (seed >>> 0) / 4294967296
    }

    for (let w = 0; w < numWeeks; w++) {
        const col = []
        const weekStart = firstWeekStart.add(w, "week")
        for (let dow = 0; dow < 7; dow++) {
            const day = weekStart.add(dow, "day")
            const key = day.format("YYYY-MM-DD")
            const isFuture = day.isAfter(today, "day")
            if (isFuture) {
                col.push({ key, level: -1, count: 0, isFuture: true })
                continue
            }
            const u = rnd()
            let count = 0
            let level = 0
            if (u < 0.42) {
                count = 0
                level = 0
            } else if (u < 0.58) {
                count = 1
                level = 1
            } else if (u < 0.76) {
                count = 2 + Math.floor(rnd() * 2)
                level = 2
            } else if (u < 0.9) {
                count = 4 + Math.floor(rnd() * 3)
                level = 3
            } else {
                count = 7 + Math.floor(rnd() * 6)
                level = 4
            }
            col.push({ key, level, count, isFuture: false })
        }
        columns.push(col)
    }
    return columns
}

const dummyColumns = computed(() => buildDummyStreakColumns())
</script>
