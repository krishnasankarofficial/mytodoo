<template>
    <div
        class="fixed text-xs lg:text-sm bottom-0 left-0 right-0 w-full min-h-10 bg-dark grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 px-3 sm:px-6 py-4 sm:py-6 pb-[max(1rem,env(safe-area-inset-bottom,0px)+0.75rem)] z-50 border-t border-light/10"
    >
        <div class="min-w-0" />
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-2 text-center justify-self-center max-w-[min(100%,36rem)]">
            <span class="font-PoppinsBold">&copy; {{ year }} Stride</span>
            <span class="text-light/80 hidden sm:inline"
                ><span class="text-light/40 sm:mx-1" aria-hidden="true">·</span>Private & offline · Built by
                <a
                    href="https://www.krishnasankar.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-PoppinsBold text-light hover:text-red transition-colors duration-200"
                    >Krishnasankar</a
                ></span
            >
        </div>
        <div class="flex justify-end min-w-0 gap-2">
            <Tooltip
                v-if="typeof Notification !== 'undefined'"
                text="Enable browser notifications when the Focus Pomodoro timer finishes"
                position="top"
                wrap
                inline
            >
                <button
                    type="button"
                    class="text-[10px] px-2 py-1 rounded border border-light/20 hover:bg-gray hidden sm:inline-flex items-center gap-1"
                    @click="requestNotif"
                >
                    <Bell :size="12" />
                    Notify
                </button>
            </Tooltip>
        </div>
    </div>
</template>

<script setup>
import { Bell } from "lucide-vue-next"
import Tooltip from "./Tooltip.vue"
import { useUiStore } from "../stores/ui.js"

const ui = useUiStore()
const year = new Date().getFullYear()

function requestNotif() {
    if (typeof Notification === "undefined") return
    Notification.requestPermission().then((p) => {
        ui.notify(p === "granted" ? "Notifications enabled" : "Notifications not granted", p === "granted" ? "normal" : "error")
    })
}
</script>
