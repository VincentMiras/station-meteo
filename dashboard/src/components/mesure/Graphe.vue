<template>
  <div>
    <canvas ref="myChart"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

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
    script.onload = renderChart; // Exécuter la fonction une fois le script chargé
    document.head.appendChild(script);
  }
});

// Fonction pour créer le graphique
function renderChart() {
  const ctx = myChart.value.getContext('2d');
  if (props.type === 'radar') {
    renderRadarChart(ctx);
  } else {
    renderLineChart(ctx);
  }
}

// Fonction pour créer un graphique en ligne
function renderLineChart(ctx) {
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.dates,
      datasets: [{
        label: props.titre,
        data: props.valeur,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 5,
        pointHoverRadius: 7,
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
  // Vérifier que les données sont au bon format pour un graphique radar
  if (props.valeur.every(val => Array.isArray(val) && val.length === 2)) {
    const latitudes = props.valeur.map(val => val[0]);
    const longitudes = props.valeur.map(val => val[1]);

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Latitude', 'Longitude'], // Utilisation des labels pour les coordonnées
        datasets: [{
          label: props.titre,
          data: [Math.max(...latitudes), Math.max(...longitudes)], // Utilisation des valeurs maximales pour le radar
          fill: true, // Remplir la zone sous le radar
          borderColor: 'rgba(75, 192, 192, 1)', // Couleur de la ligne
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Couleur de remplissage
          pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Couleur des points
          pointRadius: 5, // Taille des points
          pointHoverRadius: 7, // Taille des points au survol
        }]
      },
      options: {
        responsive: true,
      },
    });
  } else {
    console.error('Les données pour le graphique radar ne sont pas au bon format.');
  }
}
</script>

<style scoped>
/* Styles spécifiques à votre composant */
</style>
