<script setup>
import { useWeatherStore } from '@/stores/WeatherStore';
import { ref, onMounted } from 'vue';

const weatherStore = useWeatherStore();
const defaultStartDate = ref('');

onMounted(() => {
    defaultStartDate.value = new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString().slice(0, 16);
    if (!weatherStore.startDate) {
        weatherStore.startDate = defaultStartDate.value;
    }
});
</script>

<template>
    <div class="date-container">
        <label for="start">Start date:</label>
        <input type="datetime-local" id="start" name="start" :max="weatherStore.endDate"
            v-model="weatherStore.startDate" :placeholder="defaultStartDate" />

        <label for="end">End date (optional):</label>
        <input type="datetime-local" id="end" name="end" :min="weatherStore.startDate" v-model="weatherStore.endDate" />
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

input[type="datetime-local"] {
    width: 100%;
    max-width: 300px;
    padding: 10px;
    margin-top: 5px;
    border: 2px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="datetime-local"]:focus {
    border-color: rgb(214, 161, 3);
    box-shadow: 0 0 8px rgba(214, 161, 3, 0.5);
    outline: none;
}

input[type="datetime-local"]::placeholder {
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
    gap: 10px;
}
</style>
