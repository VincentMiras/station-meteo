<script setup>
import Carte from '@/components/mesure/Carte.vue';
import Mesure from '@/components/mesure/MesureUnique.vue';

import { useWeatherStore } from '@/stores/WeatherStore';

const weatherStore = useWeatherStore();

const labels = {
        temperature: 'Température',
        pressure: 'Pression',
        humidity: 'Humidité',
        rain: 'Précipitations',
        luminosity: 'Luminosité',
        wind_heading: 'Direction du vent',
        wind_speed_avg: 'Vitesse moyenne du vent',
        position: 'Position'
    };
    
</script>

<template>
    <Mesure :titre="'Température'" :valeur="-15" :unite="'°C'" />
    <Carte :coords="[[41,1]]"/>
</template>