<template>
  <div>
    <canvas ref="myChart"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, render } from 'vue';

// Définir les props
const props = defineProps({
  titre: {
    type: String,
    required: true,
  },
  valeur: {
    type: Array,
    required: true,
  },
  dates: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

// Référence au canvas
const myChart = ref(null);

onMounted(() => {
  // Vérifier si Chart.js est déjà chargé dans le navigateur
  if (window.Chart) {
    renderChart();
  } else {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = renderChart;
    document.head.appendChild(script);
  }
});

function renderChart() {
  const ctx = myChart.value.getContext('2d');
  if (props.type === 'radar') {
    renderRadarChart(ctx);
  } else if (props.type === 'wind'){
    renderWindChart(ctx);
  }else {
    renderLineChart(ctx);
  }
}

// Fonction pour créer un graphique en ligne
function renderLineChart(ctx) {
  const pointRadius = Math.max(1, 5 - Math.floor(props.valeur.length / 50));
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.dates.map(date => {
        const d = new Date(date);
        return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()} : ${d.getHours()}h`;
      }),
      datasets: [{
        label: props.titre,
        data: props.valeur,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointRadius: pointRadius,
        pointHoverRadius: pointRadius + 2,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          suggestedMin: Math.min(...props.valeur) - 1,
          suggestedMax: Math.max(...props.valeur) + 1,
        },
      },
    },
  });
}

// Fonction pour créer un graphique radar
function renderRadarChart(ctx) {
  if (props.valeur.every(val => Array.isArray(val) && val.length === 2)) {
    const latitudes = props.valeur.map(val => val[0]);
    const longitudes = props.valeur.map(val => val[1]);
    const pointRadius = Math.max(1, 5 - Math.floor(latitudes.length / 50)); 

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: props.dates.map((date, index) => {
          if (index % Math.ceil(props.dates.length / 10) === 0) {
        const d = new Date(date);
        return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()} : ${d.getHours()}h`;
          }
          return '';
        }),
        datasets: [
          {
            label: `Latitude`,
            data: latitudes, 
            fill: true,
            borderColor: 'rgba(75, 192, 192, 1)', 
            backgroundColor: 'rgba(75, 192, 192, 0.2)', 
            pointBackgroundColor: 'rgba(75, 192, 192, 1)', 
            pointRadius: pointRadius, 
            pointHoverRadius: pointRadius + 2,
          },
          {
            label: `Longitude`,
            data: longitudes,
            fill: true,
            borderColor: 'rgba(192, 75, 75, 1)',
            backgroundColor: 'rgba(0, 0, 0, 0.0)', 
            pointBackgroundColor: 'rgba(192, 75, 75, 1)',
            pointRadius: pointRadius, 
            pointHoverRadius: pointRadius + 2,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: Math.min(...latitudes.concat(longitudes)) - 1,
            suggestedMax: Math.max(...latitudes.concat(longitudes)) + 1,
          }
        }
      },
    });
  } else {
    console.error('Les données pour le graphique radar ne sont pas au bon format.');
  }
}
function renderWindChart(ctx) {
  const pointRadius = Math.max(1, 5 - Math.floor(props.valeur.length / 50));
  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'],
      datasets: [{
        data: props.valeur.map(val => val),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointRadius: pointRadius,
        pointHoverRadius: pointRadius + 2,
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: 0,
          suggestedMax: Math.max(...props.valeur) + 1,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
              return directions[value % 16];
            }
          }
        }
      }
    },
  });
}
</script>
<style scoped>
/* Styles spécifiques à votre composant */
</style>