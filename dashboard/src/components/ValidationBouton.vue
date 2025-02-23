<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWeatherStore } from '@/stores/weatherStore';

const router = useRouter();
const weatherStore = useWeatherStore();

const handleValidation = () => {
    console.log('Mesures sélectionnées :', weatherStore.queryParams);
    console.log('URL auto ?:', weatherStore.url_fetch);
    router.push('/dashboard');
};

const isDisabled = computed(() =>
    weatherStore.mode === 'sample' && !weatherStore.startDate
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

.validate-btn:hover {
    background-color: #218838;
}
</style>
