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
                <p class="text-light/90 mb-2 text-xs">Type naturally — dates are parsed automatically. Press Enter or click Add.</p>
                <div class="space-y-1 text-light/70 text-[11px] font-mono bg-dark/50 p-2 rounded">
                    <div>"Call Sam tomorrow 3pm"</div>
                    <div>"Meeting next Monday at 2pm"</div>
                    <div>"Dentist March 15"</div>
                    <div>"Review PR in 2 hours"</div>
                </div>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">📋 Task Features</h3>
                <div class="space-y-2 text-xs">
                    <div>
                        <strong class="text-light">Priority</strong>
                        <p class="text-light/70 mt-0.5">🔴 High · 🟡 Medium · 🔵 Low · ⚪ None</p>
                    </div>
                    <div>
                        <strong class="text-light">Tags</strong>
                        <p class="text-light/70 mt-0.5">Add labels for filtering. Use existing tags or create new ones.</p>
                    </div>
                    <div>
                        <strong class="text-light">Subtasks</strong>
                        <p class="text-light/70 mt-0.5">Break tasks into smaller checkable steps.</p>
                    </div>
                    <div>
                        <strong class="text-light">Recurrence</strong>
                        <p class="text-light/70 mt-0.5">Daily, Weekly, or Custom intervals. Next instance auto-created on completion.</p>
                    </div>
                    <div>
                        <strong class="text-light">Drag & Drop</strong>
                        <p class="text-light/70 mt-0.5">Grab ⋮⋮ handle to reorder tasks in All view.</p>
                    </div>
                </div>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">🎯 Views</h3>
                <div class="space-y-1.5 text-xs">
                    <div class="flex items-start gap-2">
                        <strong class="text-light min-w-[80px]">Today</strong>
                        <span class="text-light/70">Overdue + due today</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <strong class="text-light min-w-[80px]">Upcoming</strong>
                        <span class="text-light/70">Future due dates, sorted</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <strong class="text-light min-w-[80px]">All</strong>
                        <span class="text-light/70">All active tasks, custom order</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <strong class="text-light min-w-[80px]">Completed</strong>
                        <span class="text-light/70">Done tasks (can reopen)</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <strong class="text-light min-w-[80px]">Trash</strong>
                        <span class="text-light/70">Deleted (can restore)</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <strong class="text-light min-w-[80px]">Focus</strong>
                        <span class="text-light/70">One task + Pomodoro</span>
                    </div>
                </div>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">💾 Data & Storage</h3>
                <div class="space-y-2 text-light/90 text-xs">
                    <div>
                        <strong class="text-light">Local-first storage</strong>
                        <p class="text-light/70 mt-0.5">All data stays in your browser. No server, no account needed.</p>
                    </div>
                    <div>
                        <strong class="text-light">Auto-save</strong>
                        <p class="text-light/70 mt-0.5">Changes saved automatically after 400ms of inactivity.</p>
                    </div>
                    <div>
                        <strong class="text-light">Snapshots</strong>
                        <p class="text-light/70 mt-0.5">Last 5 states kept in localStorage for quick recovery if data corrupts.</p>
                    </div>
                    <div>
                        <strong class="text-light">Export JSON</strong>
                        <p class="text-light/70 mt-0.5">Manual backup with timestamp. Download anytime.</p>
                    </div>
                    <div>
                        <strong class="text-light">Import JSON</strong>
                        <p class="text-light/70 mt-0.5">Restore from backup. Preview before replacing all data.</p>
                    </div>
                    <div>
                        <strong class="text-light">Auto-backup (optional)</strong>
                        <p class="text-light/70 mt-0.5">Enable checkbox to auto-download JSON backup every 60 minutes. Files saved to your Downloads folder as <code class="text-red text-[10px]">stride-auto-YYYY-MM-DD.json</code></p>
                    </div>
                </div>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">🔍 Search & Filter</h3>
                <div class="space-y-2 text-xs">
                    <div>
                        <strong class="text-light">Search</strong>
                        <p class="text-light/70 mt-0.5">Matches task titles, descriptions, and tags. Works across all views.</p>
                    </div>
                    <div>
                        <strong class="text-light">Tag filter</strong>
                        <p class="text-light/70 mt-0.5">Select a tag to show only tasks with that tag. Both filters work together.</p>
                    </div>
                </div>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">⏱️ Focus Mode</h3>
                <p class="text-light/90 mb-2 text-xs">Work on one task at a time with optional Pomodoro timer.</p>
                <div class="space-y-1.5 text-light/70 text-[11px]">
                    <div>• Shows earliest due task from active list</div>
                    <div>• <strong class="text-light">Start</strong> — work session (default 25 min)</div>
                    <div>• <strong class="text-light">Break</strong> — rest period (default 5 min)</div>
                    <div>• <strong class="text-light">Stop</strong> — cancel timer</div>
                    <div>• Browser notifications when timer completes (enable via Notify button)</div>
                </div>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2">📊 Productivity Tracking</h3>
                <div class="space-y-2 text-xs">
                    <div>
                        <strong class="text-light">🔥 Streak</strong>
                        <p class="text-light/70 mt-0.5">Consecutive days with at least one completed task. Shown in header.</p>
                    </div>
                    <div>
                        <strong class="text-light">📊 Daily Progress</strong>
                        <p class="text-light/70 mt-0.5">Percentage of today's due tasks completed. Updates in real-time.</p>
                    </div>
                    <div>
                        <strong class="text-light">🔁 Recurring Tasks</strong>
                        <p class="text-light/70 mt-0.5">When completed, next instance auto-created based on recurrence rule.</p>
                    </div>
                </div>
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
