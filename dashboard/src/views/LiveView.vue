<script setup>
import ChoixCapteur from '../components/ChoixCapteur.vue'
import ValidationBouton from '../components/ValidationBouton.vue'
import { useWeatherStore } from '@/stores/weatherStore';

const weatherStore = useWeatherStore();

weatherStore.mode = 'live';
</script>

<template>
    <main>
        <ChoixCapteur />
        <ValidationBouton />
    </main>
</template>
