<template>
    <div
        v-show="showHelp"
        role="dialog"
        aria-labelledby="help-title"
        class="w-80 lg:w-[min(32rem,90vw)] max-h-[85vh] flex flex-col items-stretch bg-dark border border-light/80 shadow-xl p-0 fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
    >
        <div class="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray">
            <h2 id="help-title" class="font-PoppinsBold text-lg flex items-center gap-2">
                <HelpCircle :size="22" :stroke-width="2.25" class="shrink-0 text-green" aria-hidden="true" />
                <span>Help &amp; Shortcuts</span>
                <Keyboard :size="18" :stroke-width="2.25" class="shrink-0 text-light/50" aria-hidden="true" />
            </h2>
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
                <h3 class="font-PoppinsBold text-green mb-2 flex items-center gap-2">
                    <Keyboard :size="16" :stroke-width="2.25" class="shrink-0" aria-hidden="true" />
                    Keyboard shortcuts
                </h3>
                <div class="space-y-1.5 text-light/90">
                    <div class="flex justify-between items-center gap-2">
                        <span class="flex items-center gap-2 min-w-0">
                            <CalendarDays :size="14" :stroke-width="2.25" class="shrink-0 text-light/50" aria-hidden="true" />
                            Today view
                        </span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs shrink-0">Alt+1</kbd>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <span class="flex items-center gap-2 min-w-0">
                            <CalendarClock :size="14" :stroke-width="2.25" class="shrink-0 text-light/50" aria-hidden="true" />
                            Upcoming view
                        </span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs shrink-0">Alt+2</kbd>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <span class="flex items-center gap-2 min-w-0">
                            <CheckCircle2 :size="14" :stroke-width="2.25" class="shrink-0 text-light/50" aria-hidden="true" />
                            Completed view
                        </span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs shrink-0">Alt+3</kbd>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <span class="flex items-center gap-2 min-w-0">
                            <Trash2 :size="14" :stroke-width="2.25" class="shrink-0 text-light/50" aria-hidden="true" />
                            Trash view
                        </span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs shrink-0">Alt+4</kbd>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <span class="flex items-center gap-2 min-w-0">
                            <ListTodo :size="14" :stroke-width="2.25" class="shrink-0 text-light/50" aria-hidden="true" />
                            All tasks view
                        </span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs shrink-0">Alt+5</kbd>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <span class="flex items-center gap-2 min-w-0">
                            <Flame :size="14" :stroke-width="2.25" class="shrink-0 text-light/50" aria-hidden="true" />
                            Streak view
                        </span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs shrink-0">Alt+6</kbd>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <span class="flex items-center gap-2 min-w-0">
                            <Target :size="14" :stroke-width="2.25" class="shrink-0 text-light/50" aria-hidden="true" />
                            Focus mode
                        </span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs shrink-0">Alt+F</kbd>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <span class="flex items-center gap-2 min-w-0">
                            <PlusCircle :size="14" :stroke-width="2.25" class="shrink-0 text-light/50" aria-hidden="true" />
                            Quick add task
                        </span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs shrink-0">Alt+N</kbd>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <span class="flex items-center gap-2 min-w-0">
                            <HelpCircle :size="14" :stroke-width="2.25" class="shrink-0 text-light/50" aria-hidden="true" />
                            Help
                        </span>
                        <kbd class="px-2 py-0.5 rounded bg-dark border border-light/30 font-mono text-xs shrink-0">Alt+H</kbd>
                    </div>
                </div>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2 flex items-center gap-2">
                    <Zap :size="16" :stroke-width="2.25" class="shrink-0" aria-hidden="true" />
                    Quick Add
                </h3>
                <p class="text-light/90 mb-2 text-xs">Type naturally — dates are parsed automatically. Press Enter or click Add.</p>
                <div class="space-y-1 text-light/70 text-[11px] font-mono bg-dark/50 p-2 rounded">
                    <div>"Call Sam tomorrow 3pm"</div>
                    <div>"Meeting next Monday at 2pm"</div>
                    <div>"Dentist March 15"</div>
                    <div>"Review PR in 2 hours"</div>
                </div>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2 flex items-center gap-2">
                    <ListChecks :size="16" :stroke-width="2.25" class="shrink-0" aria-hidden="true" />
                    Task features
                </h3>
                <div class="space-y-2 text-xs">
                    <div>
                        <strong class="text-light">Priority</strong>
                        <p class="text-light/70 mt-0.5">High · Medium · Low · None (color-coded in the app)</p>
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
                <h3 class="font-PoppinsBold text-green mb-2 flex items-center gap-2">
                    <LayoutGrid :size="16" :stroke-width="2.25" class="shrink-0" aria-hidden="true" />
                    Views
                </h3>
                <div class="space-y-1.5 text-xs">
                    <div class="flex items-start gap-2">
                        <CalendarDays :size="14" :stroke-width="2.25" class="shrink-0 text-light/45 mt-0.5" aria-hidden="true" />
                        <strong class="text-light min-w-[72px]">Today</strong>
                        <span class="text-light/70">Overdue + due today</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <CalendarClock :size="14" :stroke-width="2.25" class="shrink-0 text-light/45 mt-0.5" aria-hidden="true" />
                        <strong class="text-light min-w-[72px]">Upcoming</strong>
                        <span class="text-light/70">Future due dates, sorted</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <ListTodo :size="14" :stroke-width="2.25" class="shrink-0 text-light/45 mt-0.5" aria-hidden="true" />
                        <strong class="text-light min-w-[72px]">All</strong>
                        <span class="text-light/70">All active tasks, custom order</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <CheckCircle2 :size="14" :stroke-width="2.25" class="shrink-0 text-light/45 mt-0.5" aria-hidden="true" />
                        <strong class="text-light min-w-[72px]">Completed</strong>
                        <span class="text-light/70">Done tasks (can reopen)</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <Trash2 :size="14" :stroke-width="2.25" class="shrink-0 text-light/45 mt-0.5" aria-hidden="true" />
                        <strong class="text-light min-w-[72px]">Trash</strong>
                        <span class="text-light/70">Deleted (can restore)</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <Target :size="14" :stroke-width="2.25" class="shrink-0 text-light/45 mt-0.5" aria-hidden="true" />
                        <strong class="text-light min-w-[72px]">Focus</strong>
                        <span class="text-light/70">One task + Pomodoro</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <Flame :size="14" :stroke-width="2.25" class="shrink-0 text-light/45 mt-0.5" aria-hidden="true" />
                        <strong class="text-light min-w-[72px]">Streak</strong>
                        <span class="text-light/70">Activity heatmap + consecutive-day streak</span>
                    </div>
                </div>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2 flex items-center gap-2">
                    <HardDrive :size="16" :stroke-width="2.25" class="shrink-0" aria-hidden="true" />
                    Data &amp; storage
                </h3>
                <div class="space-y-2 text-light/90 text-xs">
                    <div>
                        <strong class="text-light">Browser-only storage</strong>
                        <p class="text-light/70 mt-0.5">Your tasks stay on this device only. No account, no cloud, completely private.</p>
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
                        <strong class="text-light">Scheduled backup</strong>
                        <p class="text-light/70 mt-0.5">Enable checkbox to auto-download JSON backup every 60 minutes. Files saved to your Downloads folder as <code class="text-red text-[10px]">stride-auto-YYYY-MM-DD.json</code></p>
                    </div>
                </div>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2 flex items-center gap-2">
                    <Search :size="16" :stroke-width="2.25" class="shrink-0" aria-hidden="true" />
                    Search &amp; filter
                </h3>
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
                <h3 class="font-PoppinsBold text-green mb-2 flex items-center gap-2">
                    <Target :size="16" :stroke-width="2.25" class="shrink-0" aria-hidden="true" />
                    Focus Mode
                </h3>
                <p class="text-light/90 mb-2 text-xs">Work on one task at a time with Pomodoro timer.</p>
                <div class="space-y-1.5 text-light/70 text-[11px]">
                    <div>• Shows earliest due task from active list</div>
                    <div>• <strong class="text-light">Start</strong> — work session (default 25 min)</div>
                    <div>• <strong class="text-light">Break</strong> — rest period (default 5 min)</div>
                    <div>• <strong class="text-light">Stop</strong> — cancel timer</div>
                    <div>• Browser notifications when timer completes (enable via Notify button)</div>
                </div>
            </section>

            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-2 flex items-center gap-2">
                    <TrendingUp :size="16" :stroke-width="2.25" class="shrink-0" aria-hidden="true" />
                    Productivity tracking
                </h3>
                <div class="space-y-2 text-xs">
                    <div>
                        <strong class="text-light">Streak</strong>
                        <p class="text-light/70 mt-0.5">Consecutive days with at least one completed task. Shown in header.</p>
                    </div>
                    <div>
                        <strong class="text-light">Daily progress</strong>
                        <p class="text-light/70 mt-0.5">Percentage of today's due tasks completed. Updates in real-time.</p>
                    </div>
                    <div>
                        <strong class="text-light">Recurring tasks</strong>
                        <p class="text-light/70 mt-0.5">When completed, next instance auto-created based on recurrence rule.</p>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia"
import {
    X,
    HelpCircle,
    Keyboard,
    Zap,
    ListChecks,
    LayoutGrid,
    HardDrive,
    Search,
    Target,
    TrendingUp,
    CalendarDays,
    CalendarClock,
    CheckCircle2,
    Trash2,
    PlusCircle,
    ListTodo,
    Flame,
} from "lucide-vue-next"
import { useUiStore } from "../stores/ui.js"

const ui = useUiStore()
const { showHelp } = storeToRefs(ui)
</script>
