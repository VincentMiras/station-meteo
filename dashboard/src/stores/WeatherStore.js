import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useWeatherStore = defineStore('weather', () => {
    const mode = ref('live');
    const selectedMeasures = ref([]);
    const startDate = ref('');
    const endDate = ref('now');

    const queryParams = computed(() => ({
        mode: mode.value,
        measures: selectedMeasures.value,
        sdate: startDate.value,
        edate: endDate.value === '' ? 'now' : endDate.value,
    }));

    return { mode, selectedMeasures, startDate, endDate, queryParams, };
});
