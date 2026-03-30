<template>
    <div
        class="group rounded-xl border border-light/10 bg-gray/40 p-3 md:p-4 text-left transition hover:border-light/25"
        :class="{ 'opacity-70': task.status === 'completed' }"
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
                            class="text-[10px] uppercase px-2 py-0.5 rounded border border-light/20 text-light/70"
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
            <input v-model="draft.title" class="w-full bg-dark border border-light/20 rounded-lg px-3 py-2 text-sm" />
            <textarea
                v-model="draft.description"
                rows="2"
                class="w-full bg-dark border border-light/20 rounded-lg px-3 py-2 text-sm"
                placeholder="Description"
            />
            <input v-model="draft.tags" class="w-full bg-dark border border-light/20 rounded-lg px-3 py-2 text-sm" placeholder="Tags (comma separated)" />
            <input v-model="draft.dueAt" type="datetime-local" class="w-full bg-dark border border-light/20 rounded-lg px-3 py-2 text-sm" />
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
import { ref, watch } from "vue"
import dayjs from "dayjs"
import { Edit3, Trash2, RotateCcw, XCircle, Save, Clock, Repeat, Tag } from "lucide-vue-next"
import { useAppStore } from "../stores/app.js"
import { useConfirm } from "../composables/useConfirm.js"

const props = defineProps({
    task: { type: Object, required: true },
    variant: { type: String, default: "active" },
})

const app = useAppStore()
const { confirm } = useConfirm()
const editing = ref(false)
const draft = ref({
    title: "",
    description: "",
    tags: "",
    dueAt: "",
    recurrenceRule: "none",
    intervalDays: 2,
})

watch(
    () => props.task,
    (t) => {
        draft.value = {
            title: t.title,
            description: t.description || "",
            tags: (t.tags || []).join(", "),
            dueAt: t.dueAt ? dayjs(t.dueAt).format("YYYY-MM-DDTHH:mm") : "",
            priority: t.priority || "none",
            recurrenceRule: t.recurrence?.rule || "none",
            intervalDays: t.recurrence?.intervalDays ?? 2,
        }
    },
    { immediate: true },
)

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
    const tags = draft.value.tags
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    let recurrence = { rule: "none" }
    if (draft.value.recurrenceRule === "daily") recurrence = { rule: "daily" }
    else if (draft.value.recurrenceRule === "weekly") recurrence = { rule: "weekly", weekday: 1 }
    else if (draft.value.recurrenceRule === "custom")
        recurrence = { rule: "custom", intervalDays: Math.max(1, draft.value.intervalDays || 0) }
    app.updateTaskById(props.task.id, {
        title: draft.value.title.trim() || "Untitled",
        description: draft.value.description,
        tags,
        priority: draft.value.priority,
        dueAt: draft.value.dueAt ? new Date(draft.value.dueAt).toISOString() : null,
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
