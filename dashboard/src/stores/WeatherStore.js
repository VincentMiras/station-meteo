import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useWeatherStore = defineStore('weather', () => {
    const mode = ref('live');
    const selectedMeasures = ref([]);
    const startDate = ref('');
    const endDate = ref('now');

    // Fonction pour convertir les dates en format UTC
    const formatToUTC = (dateStr) => {
        if (!dateStr || dateStr === 'now') return 'now'; // Retourne "now" si la date est vide ou égale à "now"
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'now'; // Vérifie si la date est invalide

        return date.toISOString().replace(/[-:]/g, '').slice(0, 13) + 'Z'; // Format compact sans secondes
    };

    // Génération des paramètres de requête
    const queryParams = computed(() => ({
        mode: mode.value,
        measures: selectedMeasures.value,
        sdate: formatToUTC(startDate.value),
        edate: endDate.value === '' ? 'now' : formatToUTC(endDate.value),
    }));

    // Génération de l'URL de fetch
    const url_fetch = computed(() =>
        mode.value === 'live'
            ? `/live/${selectedMeasures.value.join('-')}`
            : `/sample/${formatToUTC(startDate.value)}/${formatToUTC(endDate.value)}/${selectedMeasures.value.join('-')}`
    );

    return { mode, selectedMeasures, startDate, endDate, queryParams, url_fetch };
});
