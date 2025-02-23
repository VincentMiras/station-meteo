<script setup>
import Carte from '@/components/mesure/Carte.vue';
import Temperature from '@/components/mesure/Temperature.vue';
import Pression from '@/components/mesure/Pression.vue';
import Humidité from '@/components/mesure/Humidite.vue';


import { useWeatherStore } from '@/stores/weatherStore';

const weatherStore = useWeatherStore();

</script>

<template>
    <Humidité :humi="21"/>
    <Pression :press="21"/>
    <Temperature :temp="21"/>
    <Carte :coords="[[41,1]]"/>
</template>