import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useWeatherStore } from '@/stores/WeatherStore';

export const useDataStore = defineStore('weather', () => {
    const weatherStore = useWeatherStore();

    const url_fetch = ref(weatherStore.url_fetch);  // L'URL de l'API à partir du store
    const data = ref(null);  // Les données récupérées de l'API
    const loading = ref(false);  // Le statut de chargement
    const error = ref(null);  // Les erreurs potentielles lors de la récupération des données
    let abortController = null;


    return { url_fetch, data, loading, error };
});
