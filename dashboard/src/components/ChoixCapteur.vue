<script setup>
import { useWeatherStore } from '@/stores/WeatherStore';
import { computed } from 'vue';

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

const isAllSelected = computed(() => {
  return weatherStore.selectedMeasures.length === 8;
});

// Coche ou décoche toutes les cases
const toggleAll = () => {
  if (isAllSelected.value) {
    weatherStore.selectedMeasures = [];
  } else {
    weatherStore.selectedMeasures = ['temperature', 'pressure', 'humidity', 'rain', 'luminosity', 'wind_heading', 'wind_speed_avg', 'position'];
  }
};

</script>

<template>
    <fieldset class="weather-form">
        <legend class="weather-legend">Choisissez les mesures que vous souhaitez voir :</legend>

        <div class="weather-option-all">
            <input
                type="checkbox"
                id="select-all"
                :checked="isAllSelected"
                @change="toggleAll"
            />
            <label for="select-all">Tout sélectionner</label>
        </div>

        <div class="weather-option"
            v-for="measure in ['temperature', 'pressure', 'humidity', 'rain', 'luminosity', 'wind_heading', 'wind_speed_avg', 'position']"
            :key="measure"
        >
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
    margin-bottom: 20px; /* Espacement plus grand pour séparer du titre */
    color: #333;
    text-align: center;
}

.weather-option {
    display: flex;
    align-items: center;
    margin-bottom: 16px; /* Espacement plus grand entre chaque option */
}

.weather-option input[type="checkbox"] {
    margin-right: 12px; /* Plus d'espace entre la case à cocher et le label */
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

/* Espacement particulier pour la checkbox "Tout sélectionner" */
.weather-option-all {
    font-size: 16px;
    font-weight: normal;
    color: #555;
    display: flex;
    align-items: center;
    margin-bottom: 20px; /* Espacement plus grand avant les autres options */
    padding: 5px 0;
}

.weather-option-all input[type="checkbox"] {
    margin-right: 12px;
    transform: scale(1.3); /* Taille plus grande pour la checkbox "Tout sélectionner" */
}

.weather-option-all label {
    font-size: 16px;
    color: #555;
    cursor: pointer;
    font-weight: bold;
}

.weather-option-all label:hover {
    color: #d6a103; /* Effet de survol pour la case "Tout sélectionner" */
}
</style>
