<template>
  <div>
    <canvas ref="myChart"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
  unit: {
    type: String,
    required: true,
    default: ''
  },
  stationIds: {
    type: Array,
    required: true
  }
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
  } else if (props.type === 'wind') {
    renderWindChart(ctx);
  } else {
    renderLineChart(ctx);
  }
}

// Fonction pour créer un graphique en ligne
function renderLineChart(ctx) {
  const datasets = props.valeur.map((valeurs, index) => {
    const pointRadius = Math.max(1, 5 - Math.floor(valeurs.length / 50));
    return {
      label: `${props.titre}, Station : ${props.stationIds[index]}`,
      data: valeurs,
      fill: false,
      borderColor: `rgba(${75 + index * 50}, ${192 + index * 50}, 192, 1)`,
      tension: 0.4,
      borderWidth: 2,
      pointBackgroundColor: `rgba(${75 + index * 50}, ${192 + index * 50}, 192, 1)`,
      pointRadius: pointRadius,
      pointHoverRadius: pointRadius + 2,
    };
  })

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.dates.map(date => {
        const d = new Date(date);
        return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()} : ${d.getHours()}h`;
      }),
      datasets: datasets
    },
    options: {
      responsive: true,
      scales: {
        y: {
          suggestedMin: Math.min(...props.valeur.flat()) - 1,
          suggestedMax: Math.max(...props.valeur.flat()) + 1,
          title: {
            display: true,
            text: props.unit
          }
        },
      },
    },
  });
}

// Fonction pour créer un graphique radar
function renderRadarChart(ctx) {
  const datasets = props.valeur.map((valeurs, index) => {
    const latitudes = valeurs.map(val => val[0]);
    const longitudes = valeurs.map(val => val[1]);
    const pointRadius = Math.max(1, 5 - Math.floor(latitudes.length / 50));

    return [
      {
        label: `Latitude, Station: ${props.stationIds[index]} (°)`,
        data: latitudes,
        fill: true,
        borderColor: `rgba(${75 + index * 50}, ${192 - index * 30}, ${192 - index * 30}, 1)`,
        backgroundColor: `rgba(${75 + index * 50}, ${192 - index * 30}, ${192 - index * 30}, 0.2)`,
        pointBackgroundColor: `rgba(${75 + index * 50}, ${192 - index * 30}, ${192 - index * 30}, 1)`,
        pointRadius: pointRadius,
        pointHoverRadius: pointRadius + 2,
      },
      {
        label: `Longitude, Station: ${props.stationIds[index]} (°)`,
        data: longitudes,
        fill: true,
        borderColor: `rgba(${192 - index * 50}, ${75 - index * 50}, 75, 1)`,
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
        pointBackgroundColor: `rgba(${192 - index * 50}, ${75 - index * 50}, 75, 1)`,
        pointRadius: pointRadius,
        pointHoverRadius: pointRadius + 2,
      }
    ];
  }).flat();

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
      datasets: datasets
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: Math.min(...props.valeur.flat().map(val => Math.min(val[0], val[1]))) - 1,
          suggestedMax: Math.max(...props.valeur.flat().map(val => Math.max(val[0], val[1]))) + 1,
        }
      }
    },
  });
}

function renderWindChart(ctx) {
  const data_wind = {
    labels: ['N', 'NNE', 'NE', 'NEE', 'E', 'SEE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'SWW', 'W', 'NWW', 'NW', 'NNW'],
    datasets: props.valeur.map((valeurs, index) => {
      const data = new Array(16).fill(0);
      (Array.isArray(valeurs) ? valeurs : []).forEach(degree => {
        const idx = Math.round(degree / 22.5) % 16;
        data[idx]++;
      });
      const total = valeurs.length;
      return {
        label: `Direction du vent, Station: ${props.stationIds[index]}`,
        data: data.map(count => (count / total) * 100),
        fill: true,
        borderColor: `rgba(${75 + index * 50}, ${75 + index * 50}, 192, 1)`,
        backgroundColor: `rgba(${75 + index * 50}, ${75 + index * 50}, 192, 0.2)`,
        pointBackgroundColor: `rgba(${75 + index * 50}, ${75 + index * 50}, 192, 1)`,
        pointRadius: 5,
        pointHoverRadius: 7,
      };
    })
  };

  const options = {
    plugins: {
      legend: {
        display: false,
        fullWidth: true,
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Windrose',
        position: "top",
        font: {
          size: 20
        }
      },
      tooltip: {
        enabled: true,
        caretSize: 10,
        backgroundColor: 'rgba(0, 0, 55, 0.5)'
      }
    },
    scales: {
      r: {
        startAngle: -11.25,
        angleLines: {
          display: true,
          lineWidth: 1,
          borderDash: [6, 8]
        },
        grid: {
          lineWidth: 1
        },
        ticks: {
          color: 'black',
          backdropColor: "rgba(0,0,0,0)",
          stepSize: 10,
          font: {
            size: 12
          },
          z: 1,
          callback: function (value) {
            if (value !== 0) return value + '%';
          }
        },
        pointLabels: {
          display: true,
          centerPointLabels: true,
          font: {
            size: 12
          },
          callback: function (value, index) {
            if ((index % 2) === 0) return value;
          }
        }
      }
    }
  };

  new Chart(ctx, {
    type: 'polarArea',
    data: data_wind,
    options: options
  });
}
</script>

<style scoped>
</style>