import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useWeatherStore } from '@/stores/weatherStore';

export const DataStore = defineStore('weatherData', () => {
    const weatherStore = useWeatherStore();
    const data = ref(null);
    const loading = ref(false);
    const error = ref(null);
    let abortController = null;

    const fetchWeatherData = async () => {
        if (!weatherStore.url_fetch) return;

        if (abortController) abortController.abort();
        abortController = new AbortController();

        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(weatherStore.url_fetch, { signal: abortController.signal });
            if (!response.ok) throw new Error(`Erreur API: ${response.statusText}`);

            data.value = await response.json();
        } catch (err) {
            if (err.name !== 'AbortError') {
                error.value = err.message;
            }
        } finally {
            loading.value = false;
        }
    };

    watch(() => weatherStore.url_fetch, fetchWeatherData, { immediate: true });

    return { data, loading, error, fetchWeatherData };
});
