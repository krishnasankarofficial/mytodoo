<template>
    <div
        v-if="preview"
        class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70"
        role="dialog"
        aria-modal="true"
    >
        <div
            class="bg-dark border border-light/30 rounded-2xl max-w-md w-full max-h-[min(90dvh,100%)] overflow-y-auto p-5 sm:p-6 text-left shadow-xl"
        >
            <h3 class="font-PoppinsBold text-lg mb-2">Import backup</h3>
            <p v-if="preview.valid" class="text-sm text-light/70 mb-4">
                Schema v{{ preview.schemaVersion }} · {{ preview.taskCount }} tasks
                <span v-if="preview.exportedAt"> · exported {{ preview.exportedAt }}</span>
            </p>
            <p v-if="preview.error" class="text-red text-sm mb-4">{{ preview.error }}</p>
            <div class="flex flex-col sm:flex-row gap-2 sm:justify-end sm:items-center">
                <button
                    type="button"
                    class="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-light/25 hover:bg-gray"
                    @click="cancel"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-red text-dark font-PoppinsBold disabled:opacity-40"
                    :disabled="!preview.valid"
                    @click="confirm"
                >
                    Replace all data
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue"
import { storeToRefs } from "pinia"
import { useUiStore } from "../stores/ui.js"
import { useAppStore } from "../stores/app.js"

const ui = useUiStore()
const app = useAppStore()
const { importPreview } = storeToRefs(ui)

const preview = computed(() => importPreview.value)

function cancel() {
    ui.setImportPreview(null)
}

function confirm() {
    const p = importPreview.value
    if (!p || !p.valid || !p.state) return
    app.replaceState(p.state)
    ui.setImportPreview(null)
    ui.notify("Import complete")
}
</script>
