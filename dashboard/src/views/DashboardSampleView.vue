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

let json = weatherData;
if (isProxy(weatherData)) {
    json = toRaw(weatherData);
}

const parsedData = Object.keys(json.data)
    .filter(key => key !== 'id' && key !== 'unit')
    .map(key => ({
        date: key,
        lat: json.data[key].lat,
        lon: json.data[key].lon,
        ...json.data[key]
    }));

const units = json.unit || {};

const getUnitForKey = (key) => {
    const defaultUnits = {
        temperature: '°C',
        pressure: 'hPa',
        humidity: '%',
        rain: 'mm',
        luminosity: 'lux',
        wind_heading: '°',
        wind_speed_avg: 'km/h',
    };
    return units[key] || defaultUnits[key];
};

const labels = {
    temperature: 'Température',
    pressure: 'Pression',
    humidity: 'Humidité',
    rain: 'Pluie',
    luminosity: 'Luminosité',
    wind_heading: 'Direction du vent',
    wind_speed_avg: 'Vitesse moyenne du vent',
};
</script>

<template>
    <div class="graphs-container">
        <div v-for="mesure in mesures" :key="mesure" class="graph-item">
            <template v-if="mesure !== 'position'">
                <h2>{{ labels[mesure] }}</h2>
                <Graphe :titre="`${labels[mesure]} (${getUnitForKey(mesure)})`" :valeur="parsedData.map(item => item[mesure])"
                :dates="parsedData.map(item => item.date)" type="line" />
            </template>
        </div>
        <div v-if="mesures.includes('position')" class="graph-item">
            <h2>Position</h2>
            <Graphe :titre="'Latitude et Longitude'" :valeur="parsedData.map(item => [item.lat, item.lon])"
            :dates="parsedData.map(item => item.date)" type="radar" />
        </div>
        <div v-if="mesures.includes('wind_heading')" class="graph-item">
            <h2>{{ labels['wind_heading'] }}</h2>
            <Graphe :titre="`${labels['wind_heading']} (${getUnitForKey('wind_heading')})`" :valeur="parsedData.map(item => item['wind_heading'])"
                :dates="parsedData.map(item => item.date)" type="wind" />
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
    width: 100%;
}

.graphs-container > .graph-item:only-child {
    grid-column: span 1;
    display: flex;
    justify-content: center;
}
</style>