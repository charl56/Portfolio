import { createApp } from 'vue'
import App from './App.vue'
// AOS
import AOS from 'aos'
import 'aos/dist/aos.css'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
 import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
 import "@fortawesome/fontawesome-free/css/all.css"; //
const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App)

app.use(vuetify).use(AOS.init()).mount('#app')
// app.use(vuetify).mount('#app')
