<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWeatherStore } from '@/stores/WeatherStore';

const router = useRouter();
const weatherStore = useWeatherStore();

const handleValidation = () => {
    console.log('Mesures sélectionnées :', weatherStore.queryParams);
    console.log('URL auto ?:', weatherStore.url_fetch);
    router.push('/dashboard');
};

const isDisabled = computed(() =>
    weatherStore.mode === 'sample' && !weatherStore.startDate || weatherStore.selectedMeasures.length === 0 || weatherStore.selectedMeasures.length === 0
);

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
