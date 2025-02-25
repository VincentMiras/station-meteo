<script setup>
import { useWeatherStore } from '@/stores/WeatherStore';
import { useDataStore } from '@/stores/DataStore';
import Mesure from '@/components/mesure/MesureUnique.vue';
import Carte from '@/components/mesure/Carte.vue';

const weatherStore = useWeatherStore();
const dataStore = useDataStore();

const mesures = weatherStore.selectedMeasures;


const data = weatherStore.data;

const weatherData = data || {
    temperature: -15,
    pressure: 1013,
    humidity: 75,
    rain: 0,
    luminosity: 120,
    wind_heading: 180,
    wind_speed_avg: 20,
    position: [[41, 1]]
};

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
    <div v-if="mesures.length > 0">
        <div v-for="(measure, index) in mesures" :key="index">
            <template v-if="measure === 'position'">
                <Carte :coords="weatherData.position" />
            </template>

            <template v-else>
                <Mesure :titre="measure" :valeur="weatherData[measure]" :unite="getUnitForKey(measure)" />
            </template>
        </div>
    </div>

</template>
