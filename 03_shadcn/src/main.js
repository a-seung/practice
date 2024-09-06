import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { createPinia } from 'pinia';

import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import 'tailwindcss/tailwind.css';


const app = createApp(App)
const pinia = createPinia();
app.use(router)
app.use(pinia);
app.mount('#app')
