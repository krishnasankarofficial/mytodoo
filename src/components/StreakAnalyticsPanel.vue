<template>
    <div class="space-y-6">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div
                v-for="card in statCards"
                :key="card.key"
                class="rounded-xl border border-light/15 bg-gray/40 px-4 py-3 text-left"
            >
                <p class="text-[10px] uppercase tracking-wide text-light/45 mb-1">{{ card.label }}</p>
                <p class="text-2xl font-PoppinsBold text-light tabular-nums">{{ card.value }}</p>
                <p v-if="card.hint" class="text-[11px] text-light/40 mt-1 leading-snug">{{ card.hint }}</p>
            </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
            <div class="rounded-xl border border-light/15 bg-gray/40 p-5 min-w-0">
                <h3 class="text-sm font-PoppinsBold text-light/90 mb-1">Completions per week</h3>
                <p class="text-xs text-light/45 mb-4">Last 12 weeks · total tasks completed</p>
                <div class="flex items-end gap-1 sm:gap-1.5 h-36 px-0.5">
                    <Tooltip
                        v-for="(w, i) in analytics.weeklyTotals"
                        :key="i"
                        :text="`${w.label}: ${w.total} completion${w.total === 1 ? '' : 's'}`"
                        position="top"
                        inline
                        class="flex-1 flex flex-col justify-end h-full min-w-0 group"
                    >
                        <div
                            class="w-full rounded-t bg-green/75 hover:bg-green transition-[height,background-color] min-h-[2px] origin-bottom"
                            :style="{ height: `${(w.total / analytics.maxWeekly) * 100}%` }"
                        />
                        <span class="text-[8px] sm:text-[9px] text-light/40 text-center mt-1 truncate w-full leading-tight">
                            {{ w.label }}
                        </span>
                    </Tooltip>
                </div>
            </div>

            <div class="rounded-xl border border-light/15 bg-gray/40 p-5 min-w-0">
                <h3 class="text-sm font-PoppinsBold text-light/90 mb-1">By day of week</h3>
                <p class="text-xs text-light/45 mb-4">Last 13 weeks · when you finish tasks</p>
                <div class="flex items-end justify-between gap-1 sm:gap-2 h-36 px-1">
                    <Tooltip
                        v-for="(count, di) in analytics.weekdayCounts"
                        :key="di"
                        :text="`${analytics.weekdayLabels[di]}: ${count} completion${count === 1 ? '' : 's'}`"
                        position="top"
                        inline
                        class="flex-1 flex flex-col justify-end h-full min-w-0 items-center"
                    >
                        <div
                            class="w-full max-w-[2.25rem] rounded-t bg-green/70 hover:bg-green/90 transition min-h-[2px]"
                            :style="{ height: `${(count / analytics.maxWeekday) * 100}%` }"
                        />
                        <span class="text-[9px] text-light/45 mt-1.5">{{ analytics.weekdayLabels[di] }}</span>
                    </Tooltip>
                </div>
            </div>
        </div>

        <div class="rounded-xl border border-light/15 bg-gray/40 p-5">
            <h3 class="text-sm font-PoppinsBold text-light/90 mb-1">Last 30 days</h3>
            <p class="text-xs text-light/45 mb-4">Daily completion count · today on the right</p>
            <div class="flex items-end gap-px sm:gap-0.5 h-28 w-full overflow-x-auto pb-1">
                <Tooltip
                    v-for="day in analytics.last30Days"
                    :key="day.key"
                    :text="`${day.key}: ${day.count} completion${day.count === 1 ? '' : 's'}`"
                    position="top"
                    inline
                    class="flex-1 min-w-[6px] sm:min-w-[8px] flex flex-col justify-end h-full"
                >
                    <div
                        class="w-full rounded-t-[1px] bg-green/60 hover:bg-green/90 transition min-h-[1px]"
                        :class="day.count === 0 ? 'bg-light/10 hover:bg-light/15' : ''"
                        :style="{ height: `${(day.count / analytics.maxLast30) * 100}%` }"
                    />
                </Tooltip>
            </div>
            <div class="flex justify-between text-[9px] text-light/35 mt-2 px-0.5">
                <span>30 days ago</span>
                <span>Today</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue"
import { storeToRefs } from "pinia"
import { useAppStore } from "../stores/app.js"
import Tooltip from "./Tooltip.vue"

const app = useAppStore()
const { streakAnalytics: analytics, preferences } = storeToRefs(app)

const statCards = computed(() => {
    const a = analytics.value
    return [
        {
            key: "current",
            label: "Current streak",
            value: `${preferences.value.streakDays}d`,
            hint: "Days in a row with a completion",
        },
        {
            key: "best",
            label: "Best streak",
            value: `${a.bestStreakDays}d`,
            hint: "Longest run of consecutive active days",
        },
        {
            key: "total",
            label: "Completions (13 wk)",
            value: String(a.totalCompletionsInHeatmapWindow),
            hint: "Tasks marked done in the heatmap window",
        },
        {
            key: "active",
            label: "Active days",
            value: String(a.activeDaysInHeatmapWindow),
            hint: "Days with at least one completion",
        },
    ]
})
</script>
