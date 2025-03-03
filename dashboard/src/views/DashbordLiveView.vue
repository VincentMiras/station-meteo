<script setup>
import { useWeatherStore } from '@/stores/WeatherStore';
import { useDataStore } from '@/stores/DataStore';
import Mesure from '@/components/mesure/MesureUnique.vue';
import Carte from '@/components/mesure/Carte.vue';
import { computed, isProxy, toRaw } from 'vue';
import { useRouter } from 'vue-router';

const weatherStore = useWeatherStore();
const dataStore = useDataStore();
const router = useRouter()
const mesures = weatherStore.selectedMeasures;
const weatherData = dataStore.data;

let json = weatherData;
if (isProxy(weatherData)){
    json = toRaw(weatherData)
}
if (json==null){
    router.push('/liveview')
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
        return [json.id];
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
        <div v-if="Array.isArray(json)">
            <div v-for="(measure, index) in mesures" :key="index" class="measure-row">
                <div v-for="(station, stationIndex) in json" :key="stationIndex" class="measure-item">
                    <template v-if="measure !== 'position'">
                        <Mesure 
                            :titre="labels[measure]" 
                            :station="'station n°' + station.id"
                            :valeur="station.data[measure]" 
                            :unite="station.unit[measure]" />
                    </template>
                </div>
            </div>
        </div>
        <div v-else class="station-container">
            <div v-for="(measure, index) in mesures" :key="index" class="measure-item">
                <template v-if="measure !== 'position'">
                    <Mesure 
                        :titre="labels[measure]" 
                        :station="'station n°' + json.id"
                        :valeur="json.data[measure]" 
                        :unite="json.unit[measure]" 
                    />
                </template>
            </div>
        </div>
        <div v-if="mesures.includes('position')" class="map-item">
                <Carte :coords="stationloc" :station="stationname" />
        </div>
    </div>
    <Mesure 
                        :titre="'Humidité'" 
                        :station="'station n°00'"
                        :valeur="70" 
                        :unite="'%'" 
                    />
</template>


<style scoped>
.container {
    display: flex;
    flex-direction: column;
    gap: 2vh;
}

.measure-row {
    display: flex;
    flex-wrap: wrap;
    gap: 2vh;
}

.measure-item {
    box-sizing: border-box;
    flex: 1 1 calc(50% - 2vh);
}

.station-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2vh;
}

.station-container .measure-item {
    flex: 1 1 calc(50% - 2vh);
}

.map-item {
    width: 100%;
    margin-top: 1vh;
}
</style>


