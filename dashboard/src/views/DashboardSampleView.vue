<script setup>
import { useWeatherStore } from '@/stores/WeatherStore';
import { useDataStore } from '@/stores/DataStore';
import Graphe from '@/components/mesure/Graphe.vue';
import { isProxy, toRaw, computed, ref } from 'vue';

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

const displaySameGraph = ref(false);

const parsedData = computed(() => {
    if (Array.isArray(json)) {
        return json.map(station => ({
            id: station.id,
            data: Object.keys(station.data)
                .filter(key => key !== 'id' && key !== 'unit')
                .map(key => ({
                    date: key,
                    lat: station.data[key].lat,
                    lon: station.data[key].lon,
                    ...station.data[key]
                })),
            unit: station.unit
        }));
    } else {
        return [{
            id: json.id,
            data: Object.keys(json.data)
                .filter(key => key !== 'id' && key !== 'unit')
                .map(key => ({
                    date: key,
                    lat: json.data[key].lat,
                    lon: json.data[key].lon,
                    ...json.data[key]
                })),
            unit: json.unit
        }];
    }
});

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
    <div>
        <button v-if="parsedData.length > 1" @click="displaySameGraph = !displaySameGraph" class="displaySameGraph">
            {{ displaySameGraph ? 'Afficher les données sur des graphiques séparés' : 'Afficher les données sur le même graphique' }}
        </button>
        <div class="graphs-container">
            <template v-if="displaySameGraph">
                <div v-for="mesure in mesures" :key="mesure" class="graph-item">
                    <template v-if="mesure !== 'position' && mesure !== 'wind_heading'">
                        <h3>{{ labels[mesure] }}</h3>
                        <Graphe :titre="`${labels[mesure]} (${getUnitForKey(mesure)})`" 
                                :valeur="parsedData.map(station => station.data.map(item => item[mesure]))"
                                :dates="parsedData[0].data.map(item => item.date)" 
                                :unit="getUnitForKey(mesure)"
                                :stationIds="parsedData.map(station => station.id)"
                                type="line" />
                    </template>
                </div>
                <div v-if="mesures.includes('position')" class="graph-item">
                    <h3>Position</h3>
                    <Graphe :titre="'Latitude et Longitude'" 
                            :valeur="parsedData.map(station => station.data.map(item => [item.lat, item.lon]))"
                            :dates="parsedData[0].data.map(item => item.date)" 
                            :unit="getUnitForKey('position')"
                            :stationIds="parsedData.map(station => station.id)"
                            type="radar" />
                </div>
                <div v-if="mesures.includes('wind_heading')" class="graph-item">
                    <h3>{{ labels['wind_heading'] }} ({{ getUnitForKey('wind_heading') }})</h3>
                    <Graphe :titre="`${labels['wind_heading']} (${getUnitForKey('wind_heading')})`" 
                            :valeur="[parsedData.flatMap(station => station.data.map(item => item['wind_heading']))]"
                            :dates="parsedData[0].data.map(item => item.date)" 
                            :unit="getUnitForKey('wind_heading')"
                            :stationIds="parsedData.map(station => station.id)"
                            type="wind" />
                </div>
                
            </template>
            <template v-else>
                <div v-for="station in parsedData" :key="station.id">
                    <h2>Station {{ station.id }}</h2>
                    <div v-for="mesure in mesures" :key="mesure" class="graph-item">
                        <template v-if="mesure !== 'position' && mesure !== 'wind_heading'">
                            <h3>{{ labels[mesure] }}</h3>
                            <Graphe :titre="`${labels[mesure]} (${getUnitForKey(mesure)})`" 
                                    :valeur="[station.data.map(item => item[mesure])]"
                                    :dates="station.data.map(item => item.date)" 
                                    :unit="getUnitForKey(mesure)"
                                    :stationIds="[station.id]"
                                    type="line" />
                        </template>
                    </div>
                    <div v-if="mesures.includes('position')" class="graph-item">
                        <h3>Position</h3>
                        <Graphe :titre="'Latitude et Longitude'" 
                                :valeur="[station.data.map(item => [item.lat, item.lon])]"
                                :dates="station.data.map(item => item.date)" 
                                :unit="getUnitForKey('position')"
                                :stationIds="[station.id]"
                                type="radar" />
                    </div>
                    <div v-if="mesures.includes('wind_heading')" class="graph-item">
                        <h3>{{ labels['wind_heading'] }}</h3>
                        <Graphe :titre="`${labels['wind_heading']} (${getUnitForKey('wind_heading')})`" 
                                :valeur="[station.data.map(item => item['wind_heading'])]"
                                :dates="station.data.map(item => item.date)" 
                                :unit="getUnitForKey('wind_heading')"
                                :stationIds="[station.id]"
                                type="wind" />
                    </div>
                </div>
            </template>
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
.displaySameGraph {
    /* easter egg de la requetête chat GPT qui a produit ce bouton: add an incredibly complicated css so it looks like bouton de la mort qui tue */
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    background: linear-gradient(45deg, #ff0000, #ff7f00, #cece53, #7fff00, #00ff00, #00ff7f, #00ffff, #007fff, #0000ff, #7f00ff, #ff00ff, #ff007f);
    background-size: 400% 400%;
    border: none;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.7);
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    animation: gradientAnimation 5s ease infinite;
}

@keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.displaySameGraph:hover {
    transform: scale(1.1);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}
</style>