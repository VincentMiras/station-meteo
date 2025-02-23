<script setup>
import Carte from '@/components/Carte.vue';
import Temperature from '@/components/Temperature.vue';
import Pression from '@/components/Pression.vue';

import { useWeatherStore } from '@/stores/weatherStore';

const weatherStore = useWeatherStore();

</script>

<template>
    <Pression :press="21"/>
    <Temperature :temp="21"/>
    <Carte :coords="[[41,1]]"/>
</template>