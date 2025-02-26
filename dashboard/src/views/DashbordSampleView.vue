<script setup>
import { useWeatherStore } from '@/stores/WeatherStore';
import { useDataStore } from '@/stores/DataStore';
import Mesure from '@/components/mesure/MesureUnique.vue';
import Carte from '@/components/mesure/Carte.vue';
import { isProxy, toRaw } from 'vue';

const weatherStore = useWeatherStore();
const dataStore = useDataStore();

const mesures = weatherStore.selectedMeasures;
const weatherData = dataStore.data;
const loading = dataStore.loading;
const error = dataStore.error;

let json = weatherData;
if (isProxy(weatherData)){
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
    <div v-for="(measure, index) in mesures" :key="index">
            <template v-if="measure === 'position' && weatherData?.position">
            <Carte :coords="json.data.position" />
        </template>
        <template v-else>
            <Mesure :titre="measure" :valeur="json.data[measure]" :unite="getUnitForKey(measure)" />
        </template>
    </div>

</template>
