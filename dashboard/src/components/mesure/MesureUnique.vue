<script setup>
import { computed } from 'vue';

const props = defineProps({
    titre: {
        type: String,
        required: true,
    },
    valeur: {
        type: [Number, String],
        required: true,
    },
    unite: {
        type: String,
        default: '',
    },
});

// Génération dynamique du dégradé de texte
const textGradient = computed(() => {
    if (props.titre === 'Température') {
        const minTemp = -10;
        const maxTemp = 40;
        const normalized = Math.min(Math.max((props.valeur - minTemp) / (maxTemp - minTemp), 0), 1);

        // Dégradé de couleur selon la température (bleu → orange → rouge)
        const color1 = `rgb(${Math.round(255 * normalized)}, ${Math.round(100 * (1 - normalized))}, ${Math.round(255 * (1 - normalized))})`;
        const color2 = `rgb(${Math.round(255 * normalized)}, ${Math.round(50 * (1 - normalized))}, ${Math.round(100 * (1 - normalized))})`;

        return `background: linear-gradient(90deg, ${color1}, ${color2}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`;
    }

    return 'color: black;'; // Couleur par défaut
});
</script>

<template>
    <div class="measure-container">
        <h3>{{ titre }}</h3>
        <div class="value" :style="textGradient">
            <p>{{ valeur }} {{ unite }}</p>
        </div>
    </div>
</template>

<style scoped>
.measure-container {
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 300px;
    margin: 20px auto;
    font-weight: bold;
}

h3 {
    color: #333;
    margin-bottom: 10px;
}

.value {
    font-size: 24px;
    font-weight: bold;
}
</style>
