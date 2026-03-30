<template>
    <div class="space-y-2">
        <draggable
            v-if="variant === 'active' && list.length"
            v-model="list"
            item-key="id"
            handle=".drag-handle"
            animation="180"
            class="space-y-2"
            @end="onDragEnd"
        >
            <template #item="{ element }">
                <TaskRow :task="element" variant="active" />
            </template>
        </draggable>
        <div v-else class="space-y-2">
            <TaskRow v-for="t in list" :key="t.id" :task="t" :variant="variant" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue"
import draggable from "vuedraggable"
import TaskRow from "./TaskRow.vue"
import { useAppStore } from "../stores/app.js"

const props = defineProps({
    tasks: { type: Array, default: () => [] },
    variant: { type: String, default: "active" },
})

const app = useAppStore()
const list = ref([])

watch(
    () => props.tasks,
    (t) => {
        list.value = [...t]
    },
    { immediate: true, deep: true },
)

function onDragEnd() {
    app.reorderActive(list.value.map((x) => x.id))
}
</script>
