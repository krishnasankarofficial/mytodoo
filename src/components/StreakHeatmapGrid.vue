<template>
    <div class="flex flex-row items-start" :class="outerGap">
        <div
            v-for="(col, wi) in columns"
            :key="wi"
            class="flex flex-col"
            :class="innerGap"
        >
            <Tooltip
                v-for="cell in col"
                :key="cell.key"
                :text="tooltipText(cell)"
                position="top"
                inline
            >
                <div
                    class="rounded-[2px] shrink-0"
                    :class="[cellSizeClass, cellClass(cell)]"
                />
            </Tooltip>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue"
import Tooltip from "./Tooltip.vue"

const props = defineProps({
    /** Same shape as store getter streakContributionColumns */
    columns: { type: Array, required: true },
    /** Visual scale: popover uses sm, full page uses md/lg */
    size: { type: String, default: "sm" }, // sm | md | lg
})

const cellSizeClass = computed(() => {
    switch (props.size) {
        case "lg":
            return "w-4 h-4"
        case "md":
            return "w-3 h-3"
        case "sm":
        default:
            return "w-[10px] h-[10px]"
    }
})

const outerGap = computed(() => {
    switch (props.size) {
        case "lg":
            return "gap-1.5"
        case "md":
            return "gap-1"
        default:
            return "gap-[3px]"
    }
})

const innerGap = computed(() => outerGap.value)

function cellClass(cell) {
    if (cell.isFuture) return "bg-transparent border border-light/[0.07]"
    switch (cell.level) {
        case 0:
            return "bg-light/12"
        case 1:
            return "bg-green/40"
        case 2:
            return "bg-green/60"
        case 3:
            return "bg-green/80"
        case 4:
        default:
            return "bg-green"
    }
}

function tooltipText(cell) {
    if (cell.isFuture) return ""
    const label = cell.key
    if (cell.count === 0) return `${label}: no completions`
    return `${label}: ${cell.count} completion${cell.count === 1 ? "" : "s"}`
}
</script>
