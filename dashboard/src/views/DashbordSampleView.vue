<script setup>
import { useWeatherStore } from '@/stores/WeatherStore';
import { useDataStore } from '@/stores/DataStore';
import Graphe from '@/components/mesure/Graphe.vue';
import { isProxy, toRaw } from 'vue';

const weatherStore = useWeatherStore();
const dataStore = useDataStore();

const mesures = weatherStore.selectedMeasures;
const weatherData = dataStore.data;
const loading = dataStore.loading;
const error = dataStore.error;
const graphType = 'line';

let json = weatherData;
if (isProxy(weatherData)) {
    json = toRaw(weatherData);
}

const parsedData = Object.keys(json.data)
    .filter(key => key !== 'id' && key !== 'unit')
    .map(key => ({
        date: key,
        ...json.data[key]
    }));

const getUnitForKey = (key) => {
    const units = {
        temperature: '°C',
        pressure: 'hPa',
        humidity: '%',
        rain: 'mm',
        luminosity: 'lux',
        wind_heading: '°',
        wind_speed_avg: 'km/h',
    };
    return units[key];
};
</script>

<template>
    <div class="graphs-container">
        <div v-for="mesure in mesures" :key="mesure" class="graph-item">
            <h2>{{ mesure }}</h2>
            <Graphe :titre="mesure" :valeur="parsedData.map(item => item[mesure])"
                :dates="parsedData.map(item => item.date)" :type="graphType" />
        </div>
    </div>
</template>

<style scoped>
.graphs-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    width: 100%;
}

.graph-item {
    box-sizing: border-box;
}
</style>
