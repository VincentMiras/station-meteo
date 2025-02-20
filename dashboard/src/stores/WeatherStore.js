import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useWeatherStore = defineStore('weather', () => {
    const mode = ref('live');  // 'live' ou 'period'
    const selectedMeasures = ref([]);
    const searchQuery = ref(''); // Utilisé pour le mode period
    const data = ref(null); // Stocke les données récupérées de l’API
    const isLoading = ref(false);

    // Construire la requête API dynamiquement
    const queryParams = computed(() => ({
        mode: mode.value,
        measures: selectedMeasures.value,
        date: mode.value === 'period' ? searchQuery.value : null
    }));

    // Fonction pour récupérer les données depuis l’API
    const fetchData = async () => {
        isLoading.value = true;
        try {
            const response = await fetch(`https://monapi.com/weather?${new URLSearchParams(queryParams.value)}`);
            data.value = await response.json();
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        } finally {
            isLoading.value = false;
        }
    };

    return { mode, selectedMeasures, searchQuery, data, isLoading, queryParams, fetchData };
});
