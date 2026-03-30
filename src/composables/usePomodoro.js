import { ref, onUnmounted } from "vue"
import { useAppStore } from "../stores/app.js"

export function usePomodoro() {
    const app = useAppStore()
    const remaining = ref(0)
    const running = ref(false)
    const mode = ref("work")
    let timer = null

    function clear() {
        if (timer) {
            clearInterval(timer)
            timer = null
        }
        running.value = false
    }

    function startWork() {
        clear()
        const sec = (app.preferences.pomodoroWorkMin ?? 25) * 60
        remaining.value = sec
        running.value = true
        mode.value = "work"
        timer = setInterval(() => {
            remaining.value -= 1
            if (remaining.value <= 0) {
                clear()
                try {
                    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
                        new Notification("Stride", { body: "Focus session finished." })
                    }
                } catch {
                    /* ignore */
                }
            }
        }, 1000)
    }

    function startBreak() {
        clear()
        const sec = (app.preferences.pomodoroBreakMin ?? 5) * 60
        remaining.value = sec
        running.value = true
        mode.value = "break"
        timer = setInterval(() => {
            remaining.value -= 1
            if (remaining.value <= 0) clear()
        }, 1000)
    }

    function stop() {
        clear()
    }

    onUnmounted(() => clear())

    return { remaining, running, mode, startWork, startBreak, stop }
}
