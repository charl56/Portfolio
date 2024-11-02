import { createApp } from 'vue'
import App from './App.vue'

// Global style of css
import './styles.css'

// TS particle (space effect = Starry)
import Particles from 'vue3-particles';

const app = createApp(App)
app.use(Particles);
app.mount('#app')
