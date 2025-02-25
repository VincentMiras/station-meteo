<script setup>
import { useWeatherStore } from '@/stores/WeatherStore';

const weatherStore = useWeatherStore();

const formatLabel = (measure) => {
    const labels = {
        temperature: 'Température',
        pressure: 'Pression',
        humidity: 'Humidité',
        rain: 'Précipitations',
        luminosity: 'Luminosité',
        wind_heading: 'Direction du vent',
        wind_speed_avg: 'Vitesse moyenne du vent',
        position: 'Position'
    };
    return labels[measure] || measure;
};

</script>

<template>
    <fieldset class="weather-form">
        <legend class="weather-legend">Choisissez les mesures que vous souhaitez voir :</legend>

        <div class="weather-option"
            v-for="measure in ['temperature', 'pressure', 'humidity', 'rain', 'luminosity', 'wind_heading', 'wind_speed_avg', 'position']"
            :key="measure">
            <input type="checkbox" :id="measure" :value="measure" v-model="weatherStore.selectedMeasures" />
            <label :for="measure">{{ formatLabel(measure) }}</label>
        </div>
    </fieldset>
</template>

<style scoped>
.weather-form {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 0 auto;
}

.weather-legend {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
    text-align: center;
}

.weather-option {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.weather-option input[type="checkbox"] {
    margin-right: 10px;
    transform: scale(1.2);
}

.weather-option label {
    font-size: 16px;
    font-weight: normal;
    color: #555;
    transition: color 0.3s ease;
}

.weather-option label:hover {
    color: rgb(214, 161, 3);
}

.weather-option input[type="checkbox"]:checked+label {
    color: #28a745;
}

.weather-option input[type="checkbox"]:disabled+label {
    color: #aaa;
}
</style>
