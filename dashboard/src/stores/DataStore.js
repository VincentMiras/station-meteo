import { defineStore } from 'pinia';
import { ref } from 'vue';


export const useDataStore = defineStore('weather', () => {

    const data = ref(null);

    return { data };
});
