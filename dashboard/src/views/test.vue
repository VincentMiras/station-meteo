<script setup>
import TemperatureChart from '../components/mesure/Graphe.vue'
</script>

<template>
    <main>
        <TemperatureChart :titre="'Température'" :valeur="[1, 2, 3, 4, 5, 6, 7, 8, 9]" :dates="[0, 1, 2, 5, 4, 7, 8]" />
    </main>
</template>
