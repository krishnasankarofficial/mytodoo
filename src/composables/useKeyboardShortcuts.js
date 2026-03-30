import { onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"

export function useKeyboardShortcuts({ onQuickAdd } = {}) {
    const router = useRouter()

    function handler(e) {
        const inTextField =
            e.target &&
            (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)
        // Still allow Alt+ shortcuts while typing (views, docs, focus, quick-add refocus)
        if (inTextField && !e.altKey) {
            return
        }
        if (e.altKey && e.key === "7") {
            e.preventDefault()
            router.push("/docs")
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
        if (e.altKey && e.key === "5") {
            e.preventDefault()
            router.push("/all")
        }
        if (e.altKey && e.key === "6") {
            e.preventDefault()
            router.push("/streak")
        }
        if (e.altKey && e.key.toLowerCase() === "f") {
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
