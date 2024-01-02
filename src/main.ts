import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/dist/vuetify.min.css'

import App from './App.vue'
import router from './router'
import {createVuetify} from "vuetify";

const app = createApp(App)

app.use(createPinia())
app.use(createVuetify({
    theme:{
        defaultTheme:"light",
        themes:{
            light:{
                colors: {
                    background: '#FFFFFF',
                    surface: '#FFFFFF',
                    primary: '#6200EE',
                    secondary: '#03DAC6',
                    error: '#B00020',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                },
            }
        }
    }
}))
app.use(router)

app.mount('#app')
