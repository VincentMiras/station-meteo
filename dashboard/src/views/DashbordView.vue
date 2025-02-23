<script setup>
import Carte from '@/components/Carte.vue';
import Temperature from '@/components/Temperature.vue';
import { useWeatherStore } from '@/stores/weatherStore';

const weatherStore = useWeatherStore();

</script>

<template>
    <Temperature :temp="21"/>
    <Carte :coords="[[41,1]]"/>
</template>