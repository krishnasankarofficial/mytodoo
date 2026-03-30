import { onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { useUiStore } from "../stores/ui.js"

export function useKeyboardShortcuts({ onQuickAdd } = {}) {
    const router = useRouter()
    const ui = useUiStore()

    function handler(e) {
        if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)) {
            if (e.key === "Escape") {
                ui.setShowHelp(false)
            }
            return
        }
        if (e.altKey && e.key.toLowerCase() === "h") {
            e.preventDefault()
            ui.setShowHelp(true)
        }
        if (e.key === "Escape") {
            ui.setShowHelp(false)
        }
        if (e.altKey && e.key === "1") {
            e.preventDefault()
            router.push("/today")
        }
        if (e.altKey && e.key === "2") {
            e.preventDefault()
            router.push("/upcoming")
        }
        if (e.altKey && e.key === "3") {
            e.preventDefault()
            router.push("/completed")
        }
        if (e.altKey && e.key === "4") {
            e.preventDefault()
            router.push("/trash")
        }
        if (e.altKey && e.key === "f") {
            e.preventDefault()
            router.push("/focus")
        }
        if (e.altKey && e.key === "n" && onQuickAdd) {
            e.preventDefault()
            onQuickAdd()
        }
    }

    onMounted(() => window.addEventListener("keydown", handler))
    onUnmounted(() => window.removeEventListener("keydown", handler))
}
