<script setup>
import { useWeatherStore } from '@/stores/WeatherStore';
import { useDataStore } from '@/stores/DataStore';
import Mesure from '@/components/mesure/MesureUnique.vue';
import Carte from '@/components/mesure/Carte.vue';
import { computed, isProxy, toRaw } from 'vue';

const weatherStore = useWeatherStore();
const dataStore = useDataStore();

const mesures = weatherStore.selectedMeasures;
const weatherData = dataStore.data;

let json = weatherData;
if (isProxy(weatherData)){
    json = toRaw(weatherData)
}

console.log(json)

const stationloc = computed(() => {
    if (Array.isArray(json)){
        return json.map(station => [station.data.lat, station.data.lon]);
    }
    else {
        return [[json.data.lat, json.data.lon]]
    }
});

const stationname = computed(() => {
    if (Array.isArray(json)){
        return json.map(station => station.id);
    }
    else {
        return json.id;
    }
});

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
    <div class="container">
        <div v-for="(station, stationIndex) in json" :key="stationIndex">
            <div v-for="(measure, index) in mesures" :key="index">
                <template v-if="measure !== 'position'">
                    <div class="measure-item">
                        <Mesure 
                            :titre="labels[measure]" 
                            :station="'station n°'+station.id"
                            :valeur="station.data[measure]" 
                            :unite="station.unit[measure]" 
                        />
                    </div>
                </template>
            </div>
        </div>
        <div v-if="mesures.includes('position')" class="map-item">
                <Carte :coords="stationloc" :station="stationname" />
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



