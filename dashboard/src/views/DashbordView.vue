<script setup>
import { useWeatherStore } from '@/stores/WeatherStore';
import { useDataStore } from '@/stores/DataStore';
import Mesure from '@/components/mesure/MesureUnique.vue';
import Carte from '@/components/mesure/Carte.vue';

const weatherStore = useWeatherStore();
const dataStore = useDataStore();

const mesures = weatherStore.selectedMeasures;
const weatherData = dataStore.data;
const loading = dataStore.loading;
const error = dataStore.error;

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
    <div v-if="loading">Chargement...</div>
    <div v-else-if="error">Erreur: {{ error }}</div>
    <div v-else>
        <div v-for="(measure, index) in mesures" :key="index">
            <template v-if="measure === 'position' && weatherData?.position">
                <Carte :coords="weatherData.position" />
            </template>
            <template v-else>
                <Mesure :titre="measure" :valeur="weatherData[measure]" :unite="getUnitForKey(measure)" />
            </template>
        </div>
    </div>
</template>
