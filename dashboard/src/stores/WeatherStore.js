import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useWeatherStore = defineStore('weather', () => {
    const mode = ref('live');
    const selectedMeasures = ref([]);
    const startDate = ref('');
    const endDate = ref('now');
    const station = ref([]);

    // Fonction pour convertir les dates en format UTC
    const formatToUTC = (dateStr) => {
        if (!dateStr || dateStr === 'now') return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';

        return date.toISOString().replace(/[-:]/g, '').slice(0, 13) + 'Z'; // Format compact sans secondes
    };

    // Génération des paramètres de requête
    const queryParams = computed(() => ({
        mode: mode.value,
        measures: selectedMeasures.value,
        stations: station.value,
        sdate: formatToUTC(startDate.value),
        edate: (endDate.value === '' || endDate.value === 'now') ? 'now' : formatToUTC(endDate.value),
    }));

    // Génération de l'URL de fetch
    const url_fetch = computed(() => {
        return station.value.map(stationId =>
            mode.value === 'live'
                ? `http://${stationId}.ensg.eu:3000/live/${selectedMeasures.value.join('-')}`
                : `http://${stationId}.ensg.eu:3000/sample/${queryParams.value.sdate}/${queryParams.value.edate}/${selectedMeasures.value.join('-')}`
        );
    });


    return { mode, selectedMeasures, station, startDate, endDate, queryParams, url_fetch };
});
