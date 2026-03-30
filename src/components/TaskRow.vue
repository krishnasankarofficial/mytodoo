<template>
    <div
        class="group rounded-xl border border-light/10 bg-gray/40 p-3 md:p-4 text-left transition hover:border-light/25"
        :class="[
            { 'opacity-70': task.status === 'completed' },
            dueDateClass
        ]"
    >
        <div class="flex flex-wrap gap-2 items-start justify-between">
            <div class="flex gap-2 min-w-0 flex-1">
                <span
                    v-if="variant === 'active'"
                    class="drag-handle cursor-grab text-light/30 select-none pt-1"
                    aria-hidden="true"
                    >⋮⋮</span
                >
                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                        <input
                            v-if="variant === 'active'"
                            type="checkbox"
                            class="mt-0.5"
                            :checked="false"
                            @change="onComplete"
                        />
                        <h3
                            class="font-PoppinsBold text-base md:text-lg break-words"
                            :class="{ 'line-through text-light/50': task.status === 'completed' }"
                        >
                            {{ task.title }}
                        </h3>
                        <span
                            v-if="task.priority !== 'none'"
                            class="text-[10px] uppercase px-2 py-0.5 rounded border font-PoppinsBold"
                            :class="getPriorityClass(task.priority)"
                            >{{ task.priority }}</span
                        >
                    </div>
                    <p v-if="task.description" class="text-sm text-light/60 mt-1 whitespace-pre-wrap">
                        {{ task.description }}
                    </p>
                    <div class="flex flex-wrap gap-2 mt-2 text-xs text-light/50">
                        <span v-if="task.dueAt" class="flex items-center gap-1">
                            <Clock :size="12" />
                            Due {{ formatDue(task.dueAt) }}
                        </span>
                        <span v-if="task.recurrence?.rule !== 'none'" class="flex items-center gap-1">
                            <Repeat :size="12" />
                            Repeats {{ task.recurrence.rule }}
                        </span>
                    </div>
                    <div v-if="(task.tags || []).length" class="flex flex-wrap gap-1 mt-2">
                        <span
                            v-for="tag in task.tags"
                            :key="tag"
                            class="text-[11px] px-2 py-0.5 rounded-full bg-dark border border-light/15"
                            >{{ tag }}</span
                        >
                    </div>
                    <div v-if="(task.subtasks || []).length" class="mt-2 space-y-1">
                        <label
                            v-for="st in task.subtasks"
                            :key="st.id"
                            class="flex items-center gap-2 text-sm cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                class="accent-green"
                                :checked="st.done"
                                @change="toggleSubtask(st.id)"
                            />
                            <span :class="{ 'line-through text-light/40': st.done }">{{ st.title }}</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap gap-2 shrink-0">
                <button
                    v-if="variant === 'active'"
                    type="button"
                    class="text-xs px-2 py-1 rounded border border-light/20 hover:bg-gray flex items-center gap-1"
                    @click="editing = !editing"
                >
                    <Edit3 v-if="!editing" :size="12" />
                    <XCircle v-else :size="12" />
                    {{ editing ? "Close" : "Edit" }}
                </button>
                <button
                    v-if="variant === 'active'"
                    type="button"
                    class="text-xs px-2 py-1 rounded border border-light/20 hover:bg-gray flex items-center gap-1"
                    @click="app.softDelete(task.id)"
                >
                    <Trash2 :size="12" />
                    Trash
                </button>
                <button
                    v-if="variant === 'completed'"
                    type="button"
                    class="text-xs px-2 py-1 rounded border border-light/20 hover:bg-gray flex items-center gap-1"
                    @click="app.uncompleteTask(task.id)"
                >
                    <RotateCcw :size="12" />
                    Reopen
                </button>
                <button
                    v-if="variant === 'trash'"
                    type="button"
                    class="text-xs px-2 py-1 rounded border border-green/40 text-green hover:bg-gray flex items-center gap-1"
                    @click="app.restoreTask(task.id)"
                >
                    <RotateCcw :size="12" />
                    Restore
                </button>
                <button
                    v-if="variant === 'trash'"
                    type="button"
                    class="text-xs px-2 py-1 rounded border border-red/40 text-red hover:bg-gray flex items-center gap-1"
                    @click="confirmDelete"
                >
                    <XCircle :size="12" />
                    Delete forever
                </button>
            </div>
        </div>
        <div v-if="editing && variant === 'active'" class="mt-4 space-y-2 border-t border-light/10 pt-3">
            <input v-model="draft.title" class="w-full bg-dark border border-light/20 rounded-lg px-3 py-2 text-sm" placeholder="Task title" />
            <textarea
                v-model="draft.description"
                rows="2"
                class="w-full bg-dark border border-light/20 rounded-lg px-3 py-2 text-sm"
                placeholder="Description"
            />
            <div>
                <label class="block text-xs text-light/50 mb-1">Tags</label>
                <div class="flex flex-wrap gap-1 mb-2">
                    <button
                        v-for="tag in selectedTags"
                        :key="tag"
                        type="button"
                        class="text-xs px-2 py-1 rounded-full bg-red/20 text-light border border-red/40 hover:bg-red/30 flex items-center gap-1"
                        @click="removeTag(tag)"
                    >
                        {{ tag }}
                        <XCircle :size="10" />
                    </button>
                </div>
                <div class="flex gap-2">
                    <select
                        v-if="availableTags.length > 0"
                        ref="existingTagSelect"
                        class="flex-1 bg-dark border border-light/20 rounded-lg px-3 py-2 text-sm"
                        @change="onExistingTagSelect"
                    >
                        <option value="">Select existing tag…</option>
                        <option v-for="tag in availableTags" :key="tag" :value="tag">
                            {{ tag }}
                        </option>
                    </select>
                    <input
                        v-model="newTagInput"
                        type="text"
                        placeholder="New tag"
                        :class="availableTags.length > 0 ? 'flex-1' : 'flex-[2]'"
                        class="bg-dark border border-light/20 rounded-lg px-3 py-2 text-sm"
                        @keydown.enter.prevent="addNewTag"
                    />
                    <button
                        type="button"
                        class="px-3 py-2 rounded-lg border border-light/20 hover:bg-gray text-xs"
                        @click="addNewTag"
                    >
                        +
                    </button>
                </div>
            </div>
            <div>
                <label class="block text-xs text-light/50 mb-1">Due date & time</label>
                <input 
                    v-model="draft.dueAt" 
                    type="datetime-local" 
                    class="w-full bg-dark border border-light/20 rounded-lg px-3 py-2 text-sm"
                    @change="onDueDateChange"
                />
            </div>
            <label class="block text-xs text-light/50">Priority</label>
            <select v-model="draft.priority" class="w-full bg-dark border border-light/20 rounded-lg px-3 py-2 text-sm">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="none">None</option>
            </select>
            <label class="block text-xs text-light/50">Recurrence</label>
            <select v-model="draft.recurrenceRule" class="w-full bg-dark border border-light/20 rounded-lg px-3 py-2 text-sm">
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom (interval)</option>
            </select>
            <input
                v-if="draft.recurrenceRule === 'custom'"
                v-model.number="draft.intervalDays"
                type="number"
                min="1"
                class="w-full bg-dark border border-light/20 rounded-lg px-3 py-2 text-sm"
                placeholder="Every N days"
            />
            <button
                type="button"
                class="bg-green text-dark font-PoppinsBold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5"
                @click="saveEdit"
            >
                <Save :size="14" />
                Save
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, nextTick } from "vue"
import dayjs from "dayjs"
import { Edit3, Trash2, RotateCcw, XCircle, Save, Clock, Repeat } from "lucide-vue-next"
import { useAppStore } from "../stores/app.js"
import { useConfirm } from "../composables/useConfirm.js"

const props = defineProps({
    task: { type: Object, required: true },
    variant: { type: String, default: "active" },
})

const app = useAppStore()
const { confirm } = useConfirm()
const editing = ref(false)
const selectedTags = ref([])
const existingTagSelect = ref(null)
const newTagInput = ref("")
const draft = ref({
    title: "",
    description: "",
    dueAt: "",
    recurrenceRule: "none",
    intervalDays: 2,
    priority: "none",
})

const priorityColors = {
    high: "bg-red/20 text-red border-red/40",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    none: "border-light/20 text-light/70",
}

function getPriorityClass(priority) {
    return priorityColors[priority] || priorityColors.none
}

const dueDateClass = computed(() => {
    if (!props.task.dueAt || props.task.status !== 'active') return ''
    
    const now = dayjs()
    const due = dayjs(props.task.dueAt)
    const today = now.startOf('day')
    const tomorrow = today.add(1, 'day')
    
    if (due.isBefore(today)) {
        // Overdue - stronger red
        return 'border-red/40 bg-red/10'
    } else if (due.isSame(today, 'day')) {
        // Due today - minimal red
        return 'border-red/30 bg-red/5'
    } else if (due.isSame(tomorrow, 'day')) {
        // Due tomorrow - light yellow
        return 'border-yellow-500/30 bg-yellow-500/5'
    }
    
    return ''
})

watch(
    () => props.task,
    (t) => {
        draft.value = {
            title: t.title,
            description: t.description || "",
            dueAt: t.dueAt ? dayjs(t.dueAt).format("YYYY-MM-DDTHH:mm") : "",
            priority: t.priority || "none",
            recurrenceRule: t.recurrence?.rule || "none",
            intervalDays: t.recurrence?.intervalDays ?? 2,
        }
        selectedTags.value = [...(t.tags || [])]
    },
    { immediate: true },
)

watch(editing, (open) => {
    if (open) {
        nextTick(() => resetExistingTagSelect())
    }
})

const availableTags = computed(() => {
    const cur = selectedTags.value.map((t) => String(t).toLowerCase())
    return app.allTags.filter((tag) => !cur.includes(String(tag).toLowerCase()))
})

function resetExistingTagSelect() {
    const el = existingTagSelect.value
    if (el) {
        el.selectedIndex = 0
    }
}

function onExistingTagSelect(e) {
    const el = e.target
    const raw = el.value
    if (!raw) return
    const tag = String(raw).trim().toLowerCase()
    if (tag && !selectedTags.value.map((t) => String(t).toLowerCase()).includes(tag)) {
        selectedTags.value = [...selectedTags.value, tag]
    }
    nextTick(() => {
        resetExistingTagSelect()
    })
}

function addNewTag() {
    const tag = newTagInput.value.trim().toLowerCase()
    const cur = selectedTags.value.map((t) => String(t).toLowerCase())
    if (tag && !cur.includes(tag)) {
        selectedTags.value = [...selectedTags.value, tag]
        newTagInput.value = ""
    }
}

function onDueDateChange(e) {
    const value = e.target.value
    if (!value) return
    
    // If only date is selected (length 10, format: YYYY-MM-DD), add default time
    if (value.length === 10) {
        draft.value.dueAt = value + 'T00:00'
    }
}

function removeTag(tag) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

function formatDue(iso) {
    return dayjs(iso).format("MMM D, YYYY h:mm A")
}

function onComplete() {
    app.completeTask(props.task.id)
}

function toggleSubtask(sid) {
    const subtasks = (props.task.subtasks || []).map((s) =>
        s.id === sid ? { ...s, done: !s.done } : s,
    )
    app.updateTaskById(props.task.id, { subtasks })
}

function saveEdit() {
    let recurrence = { rule: "none" }
    if (draft.value.recurrenceRule === "daily") recurrence = { rule: "daily" }
    else if (draft.value.recurrenceRule === "weekly") recurrence = { rule: "weekly", weekday: 1 }
    else if (draft.value.recurrenceRule === "custom")
        recurrence = { rule: "custom", intervalDays: Math.max(1, draft.value.intervalDays || 0) }
    
    let dueAt = null
    if (draft.value.dueAt) {
        try {
            let dateStr = draft.value.dueAt
            // If only date is provided (YYYY-MM-DD), append 00:00 time
            if (dateStr.length === 10 && !dateStr.includes('T')) {
                dateStr += 'T00:00'
            }
            dueAt = new Date(dateStr).toISOString()
        } catch (e) {
            console.error("Invalid date:", draft.value.dueAt, e)
        }
    }
    
    app.updateTaskById(props.task.id, {
        title: draft.value.title.trim() || "Untitled",
        description: draft.value.description,
        tags: selectedTags.value,
        priority: draft.value.priority,
        dueAt,
        recurrence,
    })
    editing.value = false
}

async function confirmDelete() {
    const confirmed = await confirm({
        title: "Delete task",
        message: "Permanently delete this task? This cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
    })
    if (confirmed) {
        app.deleteForever(props.task.id)
    }
}
</script>
