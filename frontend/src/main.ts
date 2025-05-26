import '@fortawesome/fontawesome-free/css/all.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useStore } from './stores'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

// Initialize the store
const store = useStore()
store.initRootDir()

app.mount('#app')
