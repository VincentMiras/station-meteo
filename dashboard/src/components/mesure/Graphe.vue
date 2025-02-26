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
  new Chart(ctx, {
    type: props.type, // Utiliser le type de graphique passé en prop
    data: {
      labels: props.dates, // Utilisation des dates en tant que labels
      datasets: [{
        label: props.titre, // Utilisation du titre en tant que label du dataset
        data: props.valeur, // Utilisation des valeurs passées dans les props
        fill: false, // Ne pas remplir la courbe sous la ligne
        borderColor: 'rgba(75, 192, 192, 1)', // Couleur de la ligne
        tension: 0.4, // Arrondir les courbes (facultatif, à ajuster selon le besoin)
        borderWidth: 2, // Largeur de la ligne
        pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Couleur des points
        pointRadius: 5, // Taille des points
        pointHoverRadius: 7, // Taille des points au survol
      }]
    },
    options: {
      responsive: true,
      scales: props.type === 'pie' ? {} : {
        y: {
          suggestedMin: Math.min(...props.valeur) - 1,
          suggestedMax: Math.max(...props.valeur) + 1,
        },
      },
    },
  });
}
</script>

<style scoped>
/* Styles spécifiques à votre composant */
</style>
