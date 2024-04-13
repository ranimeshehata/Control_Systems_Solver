import { createApp } from 'vue';
import App from './App.vue';
import store from './stores/index'; // Import the Vuex store

const app = createApp(App);

app.use(store); // Use the Vuex store

app.mount('#app');
