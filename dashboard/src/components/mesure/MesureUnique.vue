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
        const temp = Math.min(Math.max(props.valeur, minTemp), maxTemp);

        // Définition des paliers de température avec leurs couleurs associées
        const colorStops = [
            { temp: -10, color: [0, 0, 255] },  // Bleu
            { temp: 0, color: [0, 255, 255] },  // Cyan
            { temp: 10, color: [0, 255, 0] },   // Vert
            { temp: 20, color: [230, 230, 0] }, // Jaune
            { temp: 30, color: [255, 165, 0] }, // Orange
            { temp: 40, color: [255, 0, 0] }    // Rouge
        ];

        // Trouver les deux couleurs les plus proches pour interpoler
        let color1 = colorStops[0].color;
        let color2 = colorStops[colorStops.length - 1].color;
        let t = 0;

        for (let i = 0; i < colorStops.length - 1; i++) {
            const t1 = colorStops[i].temp;
            const t2 = colorStops[i + 1].temp;

            if (temp >= t1 && temp <= t2) {
                color1 = colorStops[i].color;
                color2 = colorStops[i + 1].color;
                t = (temp - t1) / (t2 - t1);
                break;
            }
        }

        // Interpolation des couleurs
        const interpolate = (c1, c2, t) => Math.round(c1 * (1 - t) + c2 * t);
        const colorA = `rgb(${interpolate(color1[0], color2[0], t)}, ${interpolate(color1[1], color2[1], t)}, ${interpolate(color1[2], color2[2], t)})`;
        const colorB = `rgb(${interpolate(color1[0], color2[0], t * 0.8)}, ${interpolate(color1[1], color2[1], t * 0.8)}, ${interpolate(color1[2], color2[2], t * 0.8)})`;

        return `background: linear-gradient(90deg, ${colorA}, ${colorB}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`;
    }
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
    padding: 2vh;
    background: #f9f9f9;
    border-radius: 2vh;
    box-shadow: 0 1vh 2vh rgba(0, 0, 0, 0.15);
    text-align: center;
    max-width: 60vh;
    margin: 3vh auto;
    font-weight: bold;
    transition: all 0.3s ease;
}

.measure-container:hover {
    transform: scale(1.05);
}

h3 {
    color: #333;
    margin-bottom: 1vh;
    font-size: 3vh;
}

.value {
    font-size: 4vh;
    font-weight: bold;
    color: #444;
}
</style>

