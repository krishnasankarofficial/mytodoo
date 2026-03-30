<template>
    <div
        v-show="showHelp"
        role="dialog"
        aria-labelledby="help-title"
        class="w-80 lg:w-[min(32rem,90vw)] max-h-[85vh] flex flex-col items-stretch bg-dark border border-light/80 shadow-xl p-0 fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
    >
        <div class="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray">
            <h2 id="help-title" class="font-PoppinsBold text-lg">Help &amp; shortcuts</h2>
            <button
                type="button"
                class="min-w-[2rem] min-h-[2rem] rounded-full bg-red text-dark font-PoppinsBold text-sm hover:opacity-90"
                aria-label="Close help"
                @click="ui.setShowHelp(false)"
            >
                ×
            </button>
        </div>
        <div class="flex flex-col gap-3 w-full overflow-y-auto p-4 text-sm text-left">
            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-1">Navigation</h3>
                <ul class="list-disc list-inside space-y-1 text-light/90">
                    <li><kbd class="px-1 rounded bg-dark border border-light/30 font-mono text-xs">Alt</kbd>+<kbd class="px-1 rounded bg-dark border border-light/30 font-mono text-xs">1</kbd> Today · <kbd class="px-1 rounded bg-dark border border-light/30 font-mono text-xs">2</kbd> Upcoming · <kbd class="px-1 rounded bg-dark border border-light/30 font-mono text-xs">3</kbd> Done · <kbd class="px-1 rounded bg-dark border border-light/30 font-mono text-xs">4</kbd> Trash · <kbd class="px-1 rounded bg-dark border border-light/30 font-mono text-xs">F</kbd> Focus</li>
                </ul>
            </section>
            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-1">Storage</h3>
                <p class="text-light/90">Local-only. Snapshots keep the last 5 saves for recovery.</p>
            </section>
            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-1">Quick add</h3>
                <p class="text-light/90">Natural dates: “Meeting tomorrow 3pm”. Drag handles reorder open tasks.</p>
            </section>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia"
import { useUiStore } from "../stores/ui.js"

const ui = useUiStore()
const { showHelp } = storeToRefs(ui)
</script>
