<template>
    <div
        class="relative inline-flex"
        @mouseenter="open = true"
        @mouseleave="open = false"
    >
        <slot />
        <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="open"
                class="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-2 rounded-lg border border-light/20 bg-gray shadow-lg pointer-events-none"
                role="tooltip"
            >
                <p class="text-[10px] text-light/50 mb-1.5 whitespace-nowrap">Completions (last 13 weeks)</p>
                <StreakHeatmapGrid :columns="columns" size="sm" />
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { storeToRefs } from "pinia"
import { useAppStore } from "../stores/app.js"
import StreakHeatmapGrid from "./StreakHeatmapGrid.vue"

const app = useAppStore()
const { streakContributionColumns: columns } = storeToRefs(app)

const open = ref(false)
</script>
