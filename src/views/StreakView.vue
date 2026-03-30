<template>
    <section class="space-y-8">
        <div>
            <h2 class="text-xl font-PoppinsBold mb-2 text-left">Streak activity</h2>
            <p class="text-sm text-light/50 mb-6 text-left max-w-xl">
                Analytics from completion timestamps on your saved tasks.
            </p>
            <StreakAnalyticsPanel />
        </div>

        <div>
            <h3 class="text-sm font-PoppinsBold text-light/80 mb-3 text-left">Contribution heatmap</h3>
            <p class="text-xs text-light/45 mb-4 text-left max-w-xl">
                One square per day: darker green means more tasks completed that day.
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
                <StreakHeatmapGrid :columns="columns" size="lg" />
            </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { storeToRefs } from "pinia"
import { useAppStore } from "../stores/app.js"
import StreakHeatmapGrid from "../components/StreakHeatmapGrid.vue"
import StreakAnalyticsPanel from "../components/StreakAnalyticsPanel.vue"

const { streakContributionColumns: columns } = storeToRefs(useAppStore())
</script>
