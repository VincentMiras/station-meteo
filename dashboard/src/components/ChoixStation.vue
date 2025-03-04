<script setup>
import { useWeatherStore } from '@/stores/WeatherStore';

const weatherStore = useWeatherStore();
</script>

<template>
    <fieldset class="station-form">
        <legend class="station-legend">Choisissez la/les station(s) à afficher :</legend>

        <div class="station-option"
            v-for="stationId in ['piensg027', 'piensg028', 'piensg030', 'piensg031', 'piensg032']"
            :key="stationId">
            <input type="checkbox" :id="stationId" :value="stationId" v-model="weatherStore.station" :checked="stationId === 'piensg031'" />
            <label :for="stationId">{{ stationId }}</label>
        </div>
    </fieldset>
</template>

<style scoped>
.station-form {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 0 auto;
}

.station-legend {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
    text-align: center;
}

.station-option {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.station-option input[type="checkbox"] {
    margin-right: 10px;    justify-content: center;
    transform: scale(1.2);
}

.station-option label {
    font-size: 16px;
    font-weight: normal;
    color: #555;
    transition: color 0.3s ease;
}

.station-option label:hover {
    color: rgb(214, 161, 3);
}

.station-option input[type="checkbox"]:checked+label {
    color: #28a745;
}

.station-option input[type="checkbox"]:disabled+label {
    color: #aaa;
}
</style>
