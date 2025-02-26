<script setup>
import { useWeatherStore } from '@/stores/WeatherStore';
import { useDataStore } from '@/stores/DataStore';
import { Graphe } from '@/components/mesure/Graphe.vue';
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
    json = toRaw(weatherData)
}

console.log(json)

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
    <div>
        <div>
            <div v-for="mesure in mesures" :key="mesure">
                <h2>{{ mesure }}</h2>
                <Graphe :titre="mesure" :valeur="json.map(item => item[mesure])" :dates="json.map(item => item.date)"
                    :type="graphType" />
            </div>
        </div>
    </div>
</template>