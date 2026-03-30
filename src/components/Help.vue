<template>
    <div
        v-show="showHelp"
        role="dialog"
        aria-labelledby="help-title"
        class="w-80 lg:w-[min(32rem,90vw)] max-h-[85vh] flex flex-col items-stretch bg-dark border border-light/80 shadow-xl p-0 fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
    >
        <div class="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray">
            <h2 id="help-title" class="font-PoppinsBold text-lg">Help &amp; Shortcuts</h2>
            <button
                type="button"
                class="min-w-[2rem] min-h-[2rem] rounded-full bg-red text-dark font-PoppinsBold text-sm hover:opacity-90 flex items-center justify-center"
                aria-label="Close help"
                @click="ui.setShowHelp(false)"
            >
                <X :size="18" :stroke-width="2.5" />
            </button>
        </div>
        <div class="flex flex-col gap-3 w-full overflow-y-auto p-4 text-sm text-left">
            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">⌨️ Keyboard Shortcuts</h3>
                <div class="space-y-1.5 text-light/90">
                    <div class="flex justify-between items-center">
                        <span>Today view</span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs">Alt+1</kbd>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Upcoming view</span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs">Alt+2</kbd>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Completed view</span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs">Alt+3</kbd>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Trash view</span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs">Alt+4</kbd>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Focus mode</span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs">Alt+F</kbd>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Quick add task</span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs">Alt+N</kbd>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Help</span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs">Alt+H</kbd>
                    </div>
                </div>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">✨ Quick Add</h3>
                <p class="text-light/90 mb-2">Type naturally and dates are parsed automatically:</p>
                <ul class="list-disc list-inside space-y-1 text-light/80 text-xs">
                    <li>"Call Sam tomorrow 3pm"</li>
                    <li>"Meeting next Monday at 2pm"</li>
                    <li>"Dentist appointment March 15"</li>
                    <li>"Review PR in 2 hours"</li>
                </ul>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">📋 Task Features</h3>
                <ul class="list-disc list-inside space-y-1 text-light/90">
                    <li><strong>Priority:</strong> High, Medium, Low, None</li>
                    <li><strong>Tags:</strong> Comma-separated labels for filtering</li>
                    <li><strong>Subtasks:</strong> Break tasks into smaller steps</li>
                    <li><strong>Recurrence:</strong> Daily, Weekly, or Custom intervals</li>
                    <li><strong>Drag & Drop:</strong> Reorder tasks in All view</li>
                </ul>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">🎯 Views</h3>
                <ul class="list-disc list-inside space-y-1 text-light/90">
                    <li><strong>Today:</strong> Overdue and due today</li>
                    <li><strong>Upcoming:</strong> Future due dates, sorted chronologically</li>
                    <li><strong>All:</strong> All active tasks, custom order</li>
                    <li><strong>Completed:</strong> Finished tasks (can reopen)</li>
                    <li><strong>Trash:</strong> Soft-deleted tasks (can restore)</li>
                    <li><strong>Focus:</strong> One task at a time with Pomodoro</li>
                </ul>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">💾 Data & Storage</h3>
                <ul class="list-disc list-inside space-y-1 text-light/90">
                    <li><strong>Local-first:</strong> All data stays in your browser</li>
                    <li><strong>Auto-save:</strong> Changes saved automatically</li>
                    <li><strong>Snapshots:</strong> Last 5 states kept for recovery</li>
                    <li><strong>Export/Import:</strong> JSON backup with metadata</li>
                    <li><strong>Auto-backup:</strong> Optional periodic exports</li>
                </ul>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">🔍 Search & Filter</h3>
                <p class="text-light/90">Search matches task titles, descriptions, and tags. Tag filter shows exact matches. Both filters work together.</p>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">⏱️ Focus Mode</h3>
                <p class="text-light/90 mb-2">Work on one task at a time with optional Pomodoro timer:</p>
                <ul class="list-disc list-inside space-y-1 text-light/80 text-xs">
                    <li>Shows earliest due task from your active list</li>
                    <li>Start work sessions (default 25 min)</li>
                    <li>Take breaks (default 5 min)</li>
                    <li>Browser notifications when timer completes</li>
                </ul>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">📊 Productivity</h3>
                <ul class="list-disc list-inside space-y-1 text-light/90">
                    <li><strong>Streak:</strong> Days with completed tasks</li>
                    <li><strong>Daily Progress:</strong> % of today's tasks done</li>
                    <li><strong>Recurring Tasks:</strong> Auto-create next instance</li>
                </ul>
            </section>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia"
import { X } from "lucide-vue-next"
import { useUiStore } from "../stores/ui.js"

const ui = useUiStore()
const { showHelp } = storeToRefs(ui)
</script>
