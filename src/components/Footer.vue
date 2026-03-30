<template>
    <div class="text-center fixed text-xs lg:text-sm bottom-0 w-full min-h-10 bg-dark flex flex-row items-center justify-center gap-4 p-6 z-50 border-t border-light/10">
        <span class="font-PoppinsBold flex-1 text-start">&copy; {{ year }} Stride</span>
        <span class="text-light/80 hidden sm:inline"
            >Private & offline · Built by
            <a
                href="https://krishnasankar.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                class="font-PoppinsBold text-light hover:text-red transition-colors duration-200"
                >Krishnasankar</a
            ></span
        >
        <div class="flex items-center justify-end flex-1 gap-2">
            <Tooltip
                v-if="typeof Notification !== 'undefined'"
                text="Enable browser notifications when the Focus Pomodoro timer finishes"
                position="top"
                wrap
                inline
            >
                <button
                    type="button"
                    class="text-[10px] px-2 py-1 rounded border border-light/20 hover:bg-gray hidden sm:inline flex items-center gap-1"
                    @click="requestNotif"
                >
                    <Bell :size="12" />
                    Notify
                </button>
            </Tooltip>
            <Tooltip text="Help & shortcuts (Alt+H)" position="top" inline>
                <button
                    type="button"
                    class="flex cursor-pointer items-center justify-center rounded-full bg-light bg-opacity-10 text-red transition-opacity hover:bg-opacity-20 w-8 h-8 lg:h-10 lg:w-10"
                    @click="ui.setShowHelp(true)"
                >
                    <HelpCircle :size="20" :stroke-width="2.5" />
                </button>
            </Tooltip>
        </div>
    </div>
</template>

<script setup>
import { Bell, HelpCircle } from "lucide-vue-next"
import { useUiStore } from "../stores/ui.js"
import Tooltip from "./Tooltip.vue"

const ui = useUiStore()
const year = new Date().getFullYear()

function requestNotif() {
    if (typeof Notification === "undefined") return
    Notification.requestPermission().then((p) => {
        ui.notify(p === "granted" ? "Notifications enabled" : "Notifications not granted", p === "granted" ? "normal" : "error")
    })
}
</script>
