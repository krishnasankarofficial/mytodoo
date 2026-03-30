import { getCurrentInstance } from "vue"

export function useConfirm() {
    const instance = getCurrentInstance()
    
    async function confirm(options) {
        const root = instance?.appContext?.app?._instance
        if (root?.exposed?.showConfirm) {
            return await root.exposed.showConfirm(options)
        }
        // Fallback to native confirm
        return window.confirm(options.message || "Are you sure?")
    }

    return { confirm }
}
