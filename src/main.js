import "./assets/css/base.css"

import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import { router } from "./router/index.js"

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.config.errorHandler = (err, instance, info) => {
    if (import.meta.env.DEV) {
        console.error("[Vue error]", err, info, instance)
    }
}

app.mount("#app")
