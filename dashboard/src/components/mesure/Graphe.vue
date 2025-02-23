<script setup>
import { computed, defineProps } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  TimeSeriesScale
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Adapter pour gérer les dates correctement

// Enregistrement des composants nécessaires
ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, TimeScale, TimeSeriesScale);

const props = defineProps({
  titre: { type: String, required: true },
  data: { type: Array, required: true } // [{ time: '2025-02-23T14:00:00Z', value: 12 }, ...]
});

// Définition de la palette de couleur dynamique
const getGradientColor = (temp) => {
  const colorStops = [
    { temp: -10, color: 'blue' },
    { temp: 0, color: 'cyan' },
    { temp: 10, color: 'green' },
    { temp: 20, color: 'yellow' },
    { temp: 30, color: 'orange' },
    { temp: 40, color: 'red' }
  ];

  for (let i = 0; i < colorStops.length - 1; i++) {
    if (temp >= colorStops[i].temp && temp <= colorStops[i + 1].temp) {
      return colorStops[i].color;
    }
  }
  return 'black';
};

// Transformation des données pour Chart.js
const chartData = computed(() => ({
  labels: props.data.map(d => d.time), // On garde les dates brutes (ISO format)
  datasets: [{
    label: props.titre,
    data: props.data.map(d => ({ x: d.time, y: d.value })), // Format correct pour un axe temporel
    borderColor: props.data.map(d => getGradientColor(d.value)),
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderWidth: 2,
    pointRadius: 5,
    pointBackgroundColor: props.data.map(d => getGradientColor(d.value))
  }]
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  },
  scales: {
    x: {
      type: 'time', // 📌 Utilisation du bon type d'axe X
      time: {
        unit: 'hour', // 📌 Format de temps (peut être 'minute', 'day', etc.)
        tooltipFormat: 'yyyy-MM-dd HH:mm'
      },
      title: { display: true, text: 'Temps' }
    },
    y: {
      title: { display: true, text: 'Température (°C)' }
    }
  }
}));
</script>

<template>
  <div class="chart-container">
    <h3>{{ titre }}</h3>
    <Line v-if="data.length" :data="chartData" :options="chartOptions" />
    <p v-else>Aucune donnée disponible</p>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}
h3 {
  color: #333;
  margin-bottom: 10px;
}
</style>
