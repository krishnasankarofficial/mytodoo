import './assets/css/base.css'
import 'es6-promise/auto'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


// Vuex
import store from './store/index.js'


import { createApp } from 'vue'
import App from './App.vue'

const vuetify = createVuetify({
    components,
    directives,

})

createApp(App).use(
  store,
  vuetify,
).mount('#app')
