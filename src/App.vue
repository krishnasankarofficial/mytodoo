<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { storeToRefs } from "pinia"
import { RouterView, RouterLink } from "vue-router"
import { Search, Tag, Download, Upload, Sun, Moon, Flame, CalendarCheck, Info, BookOpen } from "lucide-vue-next"
import NavBar from "./components/NavBar.vue"
import Tooltip from "./components/Tooltip.vue"
import QuickAddBar from "./components/QuickAddBar.vue"
import Footer from "./components/Footer.vue"
import ImportPreviewModal from "./components/ImportPreviewModal.vue"
import ErrorBoundary from "./components/ErrorBoundary.vue"
import ConfirmModal from "./components/ConfirmModal.vue"
import { useUiStore } from "./stores/ui.js"
import { useAppStore } from "./stores/app.js"
import { parseAppState } from "./storage/schema.js"
import { migrateFromLegacyTasksKey } from "./storage/migrations.js"
import { useKeyboardShortcuts } from "./composables/useKeyboardShortcuts.js"

const logoSrc = `${import.meta.env.BASE_URL}favicon.svg`

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
            ui.notify("Your tasks are saved on this device only. Clearing browser data will delete them.")
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
    onFocusSearch: () => document.getElementById("task-search")?.focus(),
})

function showConfirm(options) {
    return confirmModal.value?.show(options)
}

defineExpose({ showConfirm })
</script>

<template>
    <div
        class="min-h-dvh w-full max-w-[100%] min-w-0 bg-dark text-light font-Poppins flex flex-col items-center pb-[calc(6rem+env(safe-area-inset-bottom,0px))] pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(5rem+env(safe-area-inset-top,0px))] px-3 sm:px-4 transition-colors"
    >
        <header
            class="app-header fixed top-0 left-0 right-0 z-40 bg-dark/95 border-b border-light/10 backdrop-blur-sm pt-[env(safe-area-inset-top,0px)]"
        >
            <div
                class="max-w-3xl mx-auto flex flex-wrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 min-w-0"
            >
                <h1 class="order-1 text-lg sm:text-xl font-PoppinsBold tracking-tight m-0 min-w-0 shrink-0">
                    <RouterLink
                        to="/today"
                        class="flex items-center gap-2 text-inherit no-underline rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-red/80 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
                    >
                        <img
                            :src="logoSrc"
                            alt=""
                            width="28"
                            height="28"
                            class="shrink-0 size-7 rounded-lg"
                            decoding="async"
                        />
                        Stride
                    </RouterLink>
                </h1>
                <div
                    class="order-3 sm:order-2 flex flex-wrap items-center justify-center sm:justify-end gap-x-2 gap-y-2 text-[11px] sm:text-xs min-w-0 basis-full sm:basis-auto sm:flex-1 sm:min-w-0"
                >
                    <Tooltip
                        text="Consecutive days with at least one completed task — open Streak for the full activity heatmap"
                        position="bottom"
                        inline
                        wrap
                    >
                        <RouterLink
                            to="/streak"
                            class="text-light/60 flex items-center gap-1.5 border-b border-dotted border-light/25 hover:text-light/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green/60 rounded-sm"
                        >
                            <Flame :size="14" :stroke-width="2.25" class="shrink-0 text-green/90" aria-hidden="true" />
                            Streak {{ app.preferences.streakDays }}d
                        </RouterLink>
                    </Tooltip>
                    <Tooltip
                        text="Daily progress — share of today’s due tasks completed"
                        position="bottom"
                        inline
                        wrap
                    >
                        <span class="text-light/60 flex items-center gap-1.5 cursor-default">
                            <CalendarCheck :size="14" :stroke-width="2.25" class="shrink-0 text-green/90" aria-hidden="true" />
                            Today {{ app.dailyProgressPercent }}%
                        </span>
                    </Tooltip>
                    <span class="text-light/25 hidden sm:inline select-none" aria-hidden="true">|</span>
                    <Tooltip text="What Stride is, privacy, and credits" position="bottom" inline wrap>
                        <RouterLink
                            to="/about"
                            class="text-light/60 flex items-center gap-1.5 border-b border-dotted border-light/25 hover:text-light/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green/60 rounded-sm"
                        >
                            <Info :size="14" :stroke-width="2.25" class="shrink-0 text-light/50" aria-hidden="true" />
                            About
                        </RouterLink>
                    </Tooltip>
                    <Tooltip text="Shortcuts, features, storage — full reference (Alt+8)" position="bottom" inline wrap>
                        <RouterLink
                            to="/docs"
                            class="text-light/60 flex items-center gap-1.5 border-b border-dotted border-light/25 hover:text-light/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green/60 rounded-sm"
                        >
                            <BookOpen :size="14" :stroke-width="2.25" class="shrink-0 text-light/50" aria-hidden="true" />
                            Docs
                        </RouterLink>
                    </Tooltip>
                </div>
                <Tooltip text="Toggle light / dark theme" position="bottom" inline class="order-2 ml-auto sm:order-3 sm:ml-0 shrink-0">
                    <button
                        type="button"
                        class="px-2 py-1 rounded border border-light/20 hover:bg-gray flex items-center gap-1.5"
                        @click="toggleTheme"
                    >
                        <Sun v-if="app.preferences.theme === 'dark'" :size="14" />
                        <Moon v-else :size="14" />
                        {{ app.preferences.theme === "dark" ? "Light" : "Dark" }}
                    </button>
                </Tooltip>
            </div>
        </header>

        <main class="w-full max-w-3xl min-w-0 flex flex-col gap-4 flex-1">
            <NavBar />
            <QuickAddBar />
            <div class="flex flex-col sm:flex-row gap-2 w-full">
                <div class="relative flex-1">
                    <Tooltip
                        text="Search task titles, descriptions, and tags — works in every view"
                        position="top"
                        wrap
                    >
                        <div class="relative w-full">
                            <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-light/40 pointer-events-none" />
                            <input
                                id="task-search"
                                v-model="searchInput"
                                type="search"
                                placeholder="Search…"
                                class="w-full bg-gray/80 text-light text-sm pl-10 pr-[5.25rem] sm:pr-28 py-2.5 rounded-xl border border-light/15 outline-none"
                                aria-keyshortcuts="Control+K Meta+K"
                            />
                            <span
                                class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 select-none"
                                aria-hidden="true"
                            >
                                <kbd
                                    class="rounded border border-light/20 bg-dark/50 px-1 py-0.5 text-[9px] sm:text-[10px] font-mono text-light/45 leading-none"
                                >
                                    Ctrl+K
                                </kbd>
                                <span class="text-light/25 text-[10px]">·</span>
                                <kbd
                                    class="rounded border border-light/20 bg-dark/50 px-1 py-0.5 text-[9px] sm:text-[10px] font-mono text-light/45 leading-none"
                                >
                                    ⌘K
                                </kbd>
                            </span>
                        </div>
                    </Tooltip>
                </div>
                <div class="relative flex-1">
                    <Tooltip
                        text="Show only tasks with this tag (works with search)"
                        position="top"
                        wrap
                    >
                        <div class="relative w-full">
                            <Tag :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-light/40 pointer-events-none z-10" />
                            <select
                                v-model="tagInput"
                                class="w-full bg-gray/80 text-light text-sm pl-10 pr-4 py-2.5 rounded-xl border border-light/15 outline-none appearance-none cursor-pointer"
                            >
                                <option value="">All tags</option>
                                <option v-for="tag in app.allTags" :key="tag" :value="tag">
                                    {{ tag }}
                                </option>
                            </select>
                        </div>
                    </Tooltip>
                </div>
            </div>
            <div class="flex flex-wrap gap-2 items-center">
                <Tooltip text="Download a JSON backup (timestamp in filename)" position="top" inline>
                    <button
                        type="button"
                        class="text-xs font-PoppinsBold px-3 py-1.5 rounded-lg border border-light/25 hover:bg-gray flex items-center gap-1.5"
                        @click="exportJson"
                    >
                        <Download :size="14" />
                        Export JSON
                    </button>
                </Tooltip>
                <Tooltip
                    text="Restore from a backup file — preview before replacing data"
                    position="top"
                    wrap
                    inline
                >
                    <button
                        type="button"
                        class="text-xs font-PoppinsBold px-3 py-1.5 rounded-lg border border-light/25 hover:bg-gray flex items-center gap-1.5"
                        @click="triggerImport"
                    >
                        <Upload :size="14" />
                        Import JSON
                    </button>
                </Tooltip>
                <Tooltip
                    text="Auto-download JSON to your Downloads folder every 60 minutes"
                    position="top"
                    wrap
                    inline
                >
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
                </Tooltip>
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
                <ImportPreviewModal />
                <ConfirmModal ref="confirmModal" />

        <div
            v-if="toastOpen"
            role="status"
            aria-live="polite"
            class="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom,0px)+0.5rem)] left-1/2 z-[60] max-w-[min(90vw,24rem)] -translate-x-1/2 rounded-xl border-2 px-3 py-2.5 sm:px-4 sm:py-3 text-center text-sm font-PoppinsBold shadow-lg md:text-base"
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
