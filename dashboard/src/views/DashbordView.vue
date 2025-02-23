<script setup>
import Carte from '@/components/mesure/Carte.vue';
import Mesure from '@/components/mesure/MesureUnique.vue';

import { useWeatherStore } from '@/stores/WeatherStore';

const weatherStore = useWeatherStore();

</script>

<template>
    <Mesure :titre="'Température'" :valeur="-15" :unite="'°C'" />
    <Mesure :titre="'Température'" :valeur="-10" :unite="'°C'" />
    <Mesure :titre="'Température'" :valeur="-5" :unite="'°C'" />
    <Mesure :titre="'Température'" :valeur="0" :unite="'°C'" />
    <Mesure :titre="'Température'" :valeur="5" :unite="'°C'" />
    <Mesure :titre="'Température'" :valeur="10" :unite="'°C'" />
    <Mesure :titre="'Température'" :valeur="15" :unite="'°C'" />
    <Mesure :titre="'Température'" :valeur="20" :unite="'°C'" />
    <Mesure :titre="'Température'" :valeur="25" :unite="'°C'" />
    <Mesure :titre="'Température'" :valeur="30" :unite="'°C'" />
    <Mesure :titre="'Température'" :valeur="35" :unite="'°C'" />
    <Mesure :titre="'Température'" :valeur="40" :unite="'°C'" />
    <Mesure :titre="'Température'" :valeur="45" :unite="'°C'" />
    <Mesure :titre="'Température'" :valeur="50" :unite="'°C'" />
    <Carte :coords="[[41,1]]"/>
</template>