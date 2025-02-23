<script setup>
import Carte from '@/components/mesure/Carte.vue';
import Mesure from '@/components/mesure/MesureUnique.vue';

import { useWeatherStore } from '@/stores/WeatherStore';

const weatherStore = useWeatherStore();

</script>

<template>
    <Mesure :titre="'Température'" :valeur="1" :unite="'°C'" />
    <Carte :coords="[[41,1]]"/>
</template>