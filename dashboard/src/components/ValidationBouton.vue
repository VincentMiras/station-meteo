<script setup>
import { useWeatherStore } from '@/stores/weatherStore';

const weatherStore = useWeatherStore();

const handleValidation = () => {
    console.log('Mesures sélectionnées :', weatherStore.selectedMeasures);
};
</script>

<template>
    <button class="validate-btn" @click="handleValidation">Valider</button>
</template>

<style scoped>
.validate-btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.validate-btn:hover {
    background-color: #218838;
}
</style>
