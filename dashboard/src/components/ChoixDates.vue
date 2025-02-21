<script setup>
import { useWeatherStore } from '@/stores/weatherStore';

const weatherStore = useWeatherStore();

</script>

<template>
    <div class="date-container">
        <label for="start">Start date:</label>
        <input type="date" id="start" name="start" v-model="weatherStore.startDate" />

        <label for="end">End date (optional):</label>
        <input type="date" id="end" name="end" v-model="weatherStore.endDate" />
    </div>
</template>


<style scoped>
label {
    display: block;
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
    color: #333;
}

input[type="date"] {
    width: 100%;
    max-width: 300px;
    padding: 10px;
    margin-top: 5px;
    border: 2px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="date"]:focus {
    border-color: rgb(214, 161, 3);
    box-shadow: 0 0 8px rgba(214, 161, 3, 0.5);
    outline: none;
}

input[type="date"]::placeholder {
    color: #aaa;
}

.date-container {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 350px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    /* Force les inputs à être l'un en dessous de l'autre */
    gap: 10px;
    /* Espacement entre les labels et inputs */
}
</style>
