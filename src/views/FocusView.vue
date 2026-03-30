<template>
    <section class="max-w-lg mx-auto text-center">
        <h2 class="text-2xl font-PoppinsBold mb-2">Focus</h2>
        <p class="text-sm text-light/50 mb-6">One task at a time · optional Pomodoro</p>
        <div v-if="current" class="rounded-2xl border border-light/20 bg-gray/50 p-6 text-left">
            <h3 class="font-PoppinsBold text-xl mb-2">{{ current.title }}</h3>
            <p v-if="current.description" class="text-light/70 text-sm mb-4">{{ current.description }}</p>
            <div class="flex flex-wrap gap-2 justify-center mb-6">
                <button
                    type="button"
                    class="bg-green text-dark font-PoppinsBold px-6 py-2 rounded-xl flex items-center gap-2"
                    @click="done"
                >
                    <CheckCircle2 :size="16" />
                    Mark done
                </button>
                <button type="button" class="border border-light/30 px-4 py-2 rounded-xl hover:bg-gray flex items-center gap-2" @click="skip">
                    <SkipForward :size="16" />
                    Skip
                </button>
            </div>
            <div class="border-t border-light/10 pt-4">
                <p class="text-xs text-light/50 mb-2">Pomodoro</p>
                <div class="font-mono text-3xl mb-2">{{ formatClock(remaining) }}</div>
                <div class="flex flex-wrap gap-2 justify-center">
                    <button
                        type="button"
                        class="text-sm px-3 py-1 rounded-lg border border-light/25 flex items-center gap-1.5"
                        @click="pom.startWork"
                    >
                        <Play :size="14" />
                        Start {{ app.preferences.pomodoroWorkMin }}m
                    </button>
                    <button
                        type="button"
                        class="text-sm px-3 py-1 rounded-lg border border-light/25 flex items-center gap-1.5"
                        @click="pom.startBreak"
                    >
                        <Coffee :size="14" />
                        Break {{ app.preferences.pomodoroBreakMin }}m
                    </button>
                    <button type="button" class="text-sm px-3 py-1 rounded-lg border border-light/25 flex items-center gap-1.5" @click="pom.stop">
                        <Square :size="14" />
                        Stop
                    </button>
                </div>
            </div>
        </div>
        <EmptyState v-else title="Nothing to focus" hint="Add an open task with a due date or check All." icon="🎯" />
    </section>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { CheckCircle2, SkipForward, Play, Coffee, Square } from "lucide-vue-next"
import { useAppStore } from "../stores/app.js"
import EmptyState from "../components/EmptyState.vue"
import { usePomodoro } from "../composables/usePomodoro.js"

const app = useAppStore()
const pom = usePomodoro()
const { remaining } = pom

const idx = ref(0)

const pool = computed(() => {
    const list = app.activeTasks.filter((t) => t.dueAt)
    return list.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))
})

const current = computed(() => pool.value[idx.value] ?? null)

watch(pool, (p) => {
    if (idx.value >= p.length) idx.value = 0
})

function done() {
    if (current.value) app.completeTask(current.value.id)
    idx.value = 0
}

function skip() {
    idx.value = (idx.value + 1) % Math.max(pool.value.length, 1)
}

function formatClock(sec) {
    const m = Math.floor(sec / 60)
    const s = Math.max(0, sec % 60)
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}
</script>
