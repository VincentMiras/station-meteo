<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useWeatherStore } from '@/stores/WeatherStore';
import { useDataStore } from '@/stores/DataStore';

const router = useRouter();
const weatherStore = useWeatherStore();
const dataStore = useDataStore();
let lien = weatherStore.mode;

const isLoading = ref(false);
const fetchFailed = ref(false);

const handleValidation = async () => {
    console.log('Mesures sélectionnées :', weatherStore.queryParams);
    console.log('URL auto ?:', weatherStore.url_fetch);

    isLoading.value = true;
    fetchFailed.value = false;

    try {
        if (weatherStore.url_fetch.length > 1) {
            const promesses = weatherStore.url_fetch.map(url => fetchData(url));
            dataStore.data = await Promise.all(promesses);
            console.log('Données récupérées:', dataStore.data);
        } else {
            dataStore.data = await fetchData(weatherStore.url_fetch);
            console.log('Données récupérées:', dataStore.data);
        }

        router.push('/dashboard' + lien);

    } catch (error) {
        console.error('Une erreur s\'est produite, impossible de récupérer les données', error);
        fetchFailed.value = true;
    } finally {
        isLoading.value = false;
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

watch(() => weatherStore.station, () => {
    fetchFailed.value = false;
});
</script>

<template>
    <button class="validate-btn" @click="handleValidation" :disabled="isDisabled"
        :class="{ 'fetch-failed': fetchFailed }">
        <span v-if="isLoading" class="spinner"></span>
        <span v-if="fetchFailed" class="cross">✖</span>
        Valider
    </button>
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
    display: flex;
    align-items: center;
    justify-content: center;
}

.validate-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
}

.validate-btn:not(:disabled):hover {
    background-color: #218838;
}

.validate-btn.fetch-failed {
    background-color: #dc3545;
}

.validate-btn.fetch-failed:hover {
    background-color: #c82333;
}

.spinner {
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 0.6s linear infinite;
    margin-right: 8px;
}

.cross {
    color: white;
    font-size: 18px;
    margin-right: 8px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>