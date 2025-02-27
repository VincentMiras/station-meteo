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

let json = weatherData;
if (isProxy(weatherData)){
    json = toRaw(weatherData)
}

console.log(json)

const labels = {
    temperature: 'Température',
    pressure: 'Pression',
    humidity: 'Humidité',
    rain: 'Pluie',
    luminosity: 'Luminosité',
    wind_heading: 'Direction du vent',
    wind_speed_avg: 'Vitesse moyenne du vent',
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
    <div class="container">
        <div v-for="(measure, index) in mesures" :key="index">
            <template v-if="measure !== 'position'">
                <div class="measure-item">
                    <Mesure :titre="labels[measure]" :valeur="json.data[measure]" :unite="getUnitForKey(measure)" />
                </div>
            </template>
        </div>

        <div v-if="mesures.includes('position')" class="map-item">
            <Carte :coords="[[json.data.lat, json.data.lon]]" />
        </div>
    </div>
</template>


<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2vh;
}

.measure-item {
  box-sizing: border-box;
}

.map-item {
  grid-column: 1 / -1; 
  margin-top: 1vh;
}
</style>



