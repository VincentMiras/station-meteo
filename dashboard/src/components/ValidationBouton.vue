<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWeatherStore } from '@/stores/WeatherStore';
import { useDataStore } from '@/stores/DataStore';


const router = useRouter();
const weatherStore = useWeatherStore();
const dataStore = useDataStore();
let lien =weatherStore.mode;

const handleValidation = async () => {
    console.log('Mesures sélectionnées :', weatherStore.queryParams);
    console.log('URL auto ?:', weatherStore.url_fetch);

    try {
        dataStore.data = await fetchData(weatherStore.url_fetch);
        console.log('Données récupérées:', dataStore.data);
        router.push('/dashboard'+lien);

    } catch (error) {
        console.error('Une erreur s\'est produite, impossible de récupérer les données', error);
    }
};


const isDisabled = computed(() =>
    weatherStore.mode === 'sample' && !weatherStore.startDate || weatherStore.selectedMeasures.length === 0 || weatherStore.station.length === 0
);

const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur de récupération des données');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
};
</script>

<template>
    <button class="validate-btn" @click="handleValidation" :disabled="isDisabled">Valider</button>
</template>

<style scoped>
.validate-btn {
    background-color: rgb(214, 161, 3);
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.validate-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
}

.validate-btn:not(:disabled):hover {
    background-color: #218838;
}

.validate-btn:disabled:hover {
    background-color: rgb(190, 50, 50);
    color: white;
}
</style>
