<script setup>
import TemperatureChart from '../components/mesure/Graphe.vue'



</script>

<template>
    <main>
        <TemperatureChart titre="Température extérieure" :data="[
    { time: '2025-02-23T14:00:00Z', value: 12 },
    { time: '2025-02-23T15:00:00Z', value: 14 },
    { time: '2025-02-23T16:00:00Z', value: 16 },
    { time: '2025-02-23T17:00:00Z', value: 18 }
  ]"
/>
    </main>
</template>
