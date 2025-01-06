import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import * as theme from './utils/theme'
import * as user from './lib/auth'
import { store } from './store'
import temp from './store/temp'

import { initAudio } from './audioplay'
import saveData from './store/save'
//初始化audio
initAudio()

console.log(store.state.playerData)

const app = createApp(App)

app.config.globalProperties.$theme = theme
app.config.globalProperties.$user = user
app.config.globalProperties.$store = store
app.config.globalProperties.$temp = temp
app.use(router)
app.use(i18n)
app.use(store)
app.mount('#app')

export function openPath(path) {
    window.electron.ipcRenderer.send('shell:openExplorer', path)
  }
