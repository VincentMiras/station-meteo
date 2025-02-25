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

    async function fetchWeatherData() {
        console.log(url_fetch);
        if (!url_fetch.value) return;

        if (abortController) {
            abortController.abort();
            console.log('Abandon fetch');
        }
        abortController = new AbortController();

        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(url_fetch.value, { signal: abortController.signal });
            console.log('API response:', response); // Log full response

            if (!response.ok) throw new Error(`Erreur API: ${response.statusText}`);

            data.value = await response.json();
            console.log('Données récupérées:', data.value); // Log the parsed data
        } catch (err) {
            if (err.name !== 'AbortError') {
                error.value = err.message;
                console.error('Erreur:', err); // More detailed error logging
            }
        } finally {
            loading.value = false;
        }
    }



    return { url_fetch, data, loading, error, fetchWeatherData };
});
