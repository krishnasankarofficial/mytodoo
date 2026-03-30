<template>
    <div
        class="relative"
        :class="inline ? 'inline-flex' : 'w-full'"
        @mouseenter="show = true"
        @mouseleave="show = false"
    >
        <slot></slot>
        <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="show && text"
                class="absolute z-50 px-2 py-1 text-xs text-light bg-gray border border-light/20 rounded-lg pointer-events-none"
                :class="[positionClass, wrap ? 'max-w-[min(18rem,calc(100vw-2rem))] whitespace-normal text-left leading-snug' : 'whitespace-nowrap']"
            >
                {{ text }}
                <div class="absolute w-2 h-2 bg-gray border-light/20 transform rotate-45" :class="arrowClass"></div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed } from "vue"

const props = defineProps({
    text: { type: String, default: "" },
    position: { type: String, default: "top" }, // top, bottom, left, right
    /** Shrink-wrap trigger (e.g. heatmap cells) instead of full width */
    inline: { type: Boolean, default: false },
    /** Allow line breaks for longer help text */
    wrap: { type: Boolean, default: false },
})

const show = ref(false)

const positionClass = computed(() => {
    switch (props.position) {
        case "bottom":
            return "top-full left-1/2 -translate-x-1/2 mt-2"
        case "left":
            return "right-full top-1/2 -translate-y-1/2 mr-2"
        case "right":
            return "left-full top-1/2 -translate-y-1/2 ml-2"
        case "top":
        default:
            return "bottom-full left-1/2 -translate-x-1/2 mb-2"
    }
})

const arrowClass = computed(() => {
    switch (props.position) {
        case "bottom":
            return "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-t border-l"
        case "left":
            return "left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r"
        case "right":
            return "right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l"
        case "top":
        default:
            return "top-full left-1/2 -translate-x-1/2 -mt-1 border-b border-r"
    }
})
</script>
