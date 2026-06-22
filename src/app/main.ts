import { createApp } from 'vue';

import App from './App.vue';
import { installAppProviders } from './providers';

import './styles.css';

const app = createApp(App);

installAppProviders(app);

app.mount('#app');
