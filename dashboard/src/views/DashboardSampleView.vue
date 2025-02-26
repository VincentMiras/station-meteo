<template>
    <div>
        <GraphTypeSelector v-model="graphType" />
        <Graphe :titre="graphTitle" :valeur="graphValues" :dates="graphDates" :type="graphType" />
    </div>
</template>

<script setup>
import { useWeatherStore } from '@/stores/WeatherStore';
import { useDataStore } from '@/stores/DataStore';
import { computed, watch, ref } from 'vue';
import Graphe from '@/components/mesure/Graphe.vue';
import GraphTypeSelector from '@/components/GraphTypeSelector.vue';

const weatherStore = useWeatherStore();
const dataStore = useDataStore();

const graphTitle = 'Weather Data';
const graphValues = computed(() => dataStore.data ? dataStore.data.map(item => item.value) : []);
const graphDates = computed(() => dataStore.data ? dataStore.data.map(item => item.date) : []);
const graphType = ref('line');

watch(() => dataStore.url_fetch, () => {
    if (dataStore.url_fetch) {
        dataStore.fetchData();
    }
}, { immediate: true });
</script>
