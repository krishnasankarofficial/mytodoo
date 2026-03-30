<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { storeToRefs } from "pinia"
import { RouterView } from "vue-router"
import NavBar from "./components/NavBar.vue"
import QuickAddBar from "./components/QuickAddBar.vue"
import Footer from "./components/Footer.vue"
import Help from "./components/Help.vue"
import ImportPreviewModal from "./components/ImportPreviewModal.vue"
import ErrorBoundary from "./components/ErrorBoundary.vue"
import ConfirmModal from "./components/ConfirmModal.vue"
import { useUiStore } from "./stores/ui.js"
import { useAppStore } from "./stores/app.js"
import { parseAppState } from "./storage/schema.js"
import { migrateFromLegacyTasksKey } from "./storage/migrations.js"
import { useKeyboardShortcuts } from "./composables/useKeyboardShortcuts.js"

const ui = useUiStore()
const app = useAppStore()
const { toastOpen, notification } = storeToRefs(ui)

const searchInput = ref("")
const tagInput = ref("")
const importFile = ref(null)
const quickAddRef = ref(null)
const confirmModal = ref(null)

watch(
    () => searchInput.value,
    (v) => ui.setSearchQuery(v),
)
watch(
    () => tagInput.value,
    (v) => ui.setTagFilter(v),
)

const INTRO_KEY = "stride_intro_seen"

onMounted(() => {
    app.initPersist()
    app.applyThemeFromPrefs()
    try {
        if (!localStorage.getItem(INTRO_KEY)) {
            localStorage.setItem(INTRO_KEY, "1")
            ui.notify("Tasks are stored in this browser only. Clearing site data will remove them.")
        }
    } catch {
        /* ignore */
    }
    if (app.preferences.autoBackupEnabled) {
        window.setInterval(() => {
            try {
                const blob = new Blob([app.exportJsonString()], { type: "application/json" })
                const a = document.createElement("a")
                a.href = URL.createObjectURL(blob)
                a.download = `stride-auto-${new Date().toISOString().slice(0, 19)}.json`
                a.click()
                URL.revokeObjectURL(a.href)
            } catch {
                /* ignore */
            }
        }, Math.max(5, app.preferences.autoBackupIntervalMin) * 60 * 1000)
    }
})

function exportJson() {
    const blob = new Blob([app.exportJsonString()], { type: "application/json" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `stride-tasks-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    ui.notify("Backup downloaded")
}

async function onImportFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    const text = await file.text()
    try {
        const parsed = JSON.parse(text)
        let result = parseAppState(parsed)
        if (!result.success && Array.isArray(parsed)) {
            const migrated = migrateFromLegacyTasksKey(parsed)
            result = parseAppState(migrated)
        }
        if (result.success) {
            ui.setImportPreview({
                valid: true,
                taskCount: result.data.tasks.length,
                schemaVersion: result.data.schemaVersion,
                exportedAt: parsed.exportedAt || null,
                state: result.data,
                error: null,
            })
        } else {
            ui.setImportPreview({
                valid: false,
                taskCount: 0,
                schemaVersion: 0,
                exportedAt: null,
                state: null,
                error: "Invalid or unsupported JSON.",
            })
        }
    } catch (err) {
        ui.notify(err && err.message ? err.message : "Could not read file", "error")
    }
}

function triggerImport() {
    importFile.value?.click()
}

function toggleTheme() {
    app.setTheme(app.preferences.theme === "dark" ? "light" : "dark")
}

const toastIsError = computed(() => notification.value.type === "error")

useKeyboardShortcuts({
    onQuickAdd: () => document.getElementById("quick-add")?.focus(),
})

function showConfirm(options) {
    return confirmModal.value?.show(options)
}

defineExpose({ showConfirm })
</script>

<template>
    <div
        class="min-h-screen w-full bg-dark text-light font-Poppins flex flex-col items-center pb-24 pt-16 px-4 transition-colors"
    >
        <header class="app-header fixed top-0 left-0 right-0 z-40 bg-dark/95 border-b border-light/10 backdrop-blur-sm">
            <div class="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <h1 class="text-xl font-PoppinsBold tracking-tight">Stride</h1>
                <div class="flex flex-wrap items-center gap-3 text-xs">
                    <span class="text-light/60">Streak {{ app.preferences.streakDays }}d</span>
                    <span class="text-light/60">Today {{ app.dailyProgressPercent }}%</span>
                    <button
                        type="button"
                        class="px-2 py-1 rounded border border-light/20 hover:bg-gray"
                        @click="toggleTheme"
                    >
                        {{ app.preferences.theme === "dark" ? "Light" : "Dark" }}
                    </button>
                </div>
            </div>
        </header>

        <main class="w-full max-w-3xl flex flex-col gap-4 flex-1">
            <NavBar />
            <QuickAddBar />
            <div class="flex flex-col sm:flex-row gap-2 w-full">
                <input
                    v-model="searchInput"
                    type="search"
                    placeholder="Search…"
                    class="flex-1 bg-gray/80 text-light text-sm px-4 py-2.5 rounded-xl border border-light/15 outline-none"
                />
                <input
                    v-model="tagInput"
                    type="text"
                    placeholder="Filter tag"
                    class="flex-1 bg-gray/80 text-light text-sm px-4 py-2.5 rounded-xl border border-light/15 outline-none"
                />
            </div>
            <div class="flex flex-wrap gap-2">
                <button
                    type="button"
                    class="text-xs font-PoppinsBold px-3 py-1.5 rounded-lg border border-light/25 hover:bg-gray"
                    @click="exportJson"
                >
                    Export JSON
                </button>
                <button
                    type="button"
                    class="text-xs font-PoppinsBold px-3 py-1.5 rounded-lg border border-light/25 hover:bg-gray"
                    @click="triggerImport"
                >
                    Import JSON
                </button>
                <label class="flex items-center gap-2 text-xs text-light/70 cursor-pointer">
                    <input
                        type="checkbox"
                        :checked="app.preferences.autoBackupEnabled"
                        @change="
                            app.updatePreferences({
                                autoBackupEnabled: $event.target.checked,
                            })
                        "
                    />
                    Auto backup interval
                </label>
            </div>
            <input
                ref="importFile"
                type="file"
                accept="application/json,.json"
                class="sr-only"
                aria-hidden="true"
                @change="onImportFile"
            />

            <ErrorBoundary>
                <RouterView v-slot="{ Component }">
                    <Suspense>
                        <component :is="Component" />
                    </Suspense>
                </RouterView>
            </ErrorBoundary>
        </main>

                <Footer />
                <Help />
                <ImportPreviewModal />
                <ConfirmModal ref="confirmModal" />

        <div
            v-if="toastOpen"
            role="status"
            aria-live="polite"
            class="fixed bottom-6 left-1/2 z-[60] max-w-[min(90vw,24rem)] -translate-x-1/2 rounded-xl border-2 px-4 py-3 text-center text-sm font-PoppinsBold shadow-lg md:text-base"
            :class="toastIsError ? 'border-red bg-gray text-red' : 'border-light bg-gray text-light'"
        >
            {{ notification.message }}
        </div>
    </div>
</template>

<style>
body {
    overflow-x: hidden;
}
</style>
