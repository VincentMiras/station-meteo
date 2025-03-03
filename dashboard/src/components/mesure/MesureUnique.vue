<script setup>
import { computed } from 'vue';

const props = defineProps({
    titre: {
        type: String,
        default: 'Unknown'
    },
    station: {
        type: [Number, String],
        default: 'Unknown'
    },
    valeur: {
        type: [Number, String],
        default: 'N/A',
    },
    unite: {
        type: String,
        default: '',
    },
});

const calculateColor = (steps, value, minValue, maxValue) => {
    const temp = Math.min(Math.max(value, minValue), maxValue);
    let color1 = steps[0].color;
    let color2 = steps[steps.length - 1].color;
    let t = 0;

    for (let i = 0; i < steps.length - 1; i++) {
        const t1 = steps[i].temp;
        const t2 = steps[i + 1].temp;

        if (temp >= t1 && temp <= t2) {
            color1 = steps[i].color;
            color2 = steps[i + 1].color;
            t = (temp - t1) / (t2 - t1);
            break;
        }
    }

    const interpolate = (c1, c2, t) => Math.round(c1 * (1 - t) + c2 * t);
    const colorA = `rgb(${interpolate(color1[0], color2[0], t)}, ${interpolate(color1[1], color2[1], t)}, ${interpolate(color1[2], color2[2], t)})`;
    const colorB = `rgb(${interpolate(color1[0], color2[0], t * 0.8)}, ${interpolate(color1[1], color2[1], t * 0.8)}, ${interpolate(color1[2], color2[2], t * 0.8)})`;

    return `background: linear-gradient(90deg, ${colorA}, ${colorB}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`;
};

const textGradient = computed(() => {
    if (props.titre === 'Température') {
        const steps = [
            { temp: -10, color: [0, 0, 255] },  // Bleu
            { temp: 0, color: [0, 255, 255] },  // Cyan
            { temp: 10, color: [0, 255, 0] },   // Vert
            { temp: 20, color: [230, 230, 0] }, // Jaune
            { temp: 30, color: [255, 165, 0] }, // Orange
            { temp: 40, color: [255, 0, 0] }    // Rouge
        ];
        return calculateColor(steps, props.valeur, -10, 40);
    }
    if (props.titre === 'Humidité') {
        const steps = [
            { temp: 0, color: [255, 0, 0] },    // Rouge
            { temp: 35, color: [230, 230, 0] }, // Jaune
            { temp: 50, color: [0, 230, 0] },   // Vert
            { temp: 65, color: [0, 165, 165] }, // Cyan
            { temp: 100, color: [0, 0, 255] }   // Bleu
        ];
        return calculateColor(steps, props.valeur, 0, 100);
    }
    if (props.titre === 'Pression') {
        const steps = [
            { temp: 950, color: [127, 0, 255] }, // Violet
            { temp: 975, color: [0, 0, 255] },   // Bleu
            { temp: 1000, color: [0, 230, 0] },  // Vert
            { temp: 1025, color: [230, 230, 0] },// Jaune
            { temp: 1050, color: [255, 0, 0] }   // Rouge
        ];
        return calculateColor(steps, props.valeur, 950, 1050);
    }
    if (props.titre === 'Précipitations') {
        const steps = [
            { temp: 0, color: [0, 0, 0] }, // Noir
            { temp: 1, color: [0, 0, 255] }// Bleu
        ];
        return calculateColor(steps, props.valeur, 0, 1);
    }
    if (props.titre === 'Luminosité') {
        const steps = [
            { temp: 0, color: [0, 0, 0] },
            { temp: 50, color: [255, 165, 0] },
            { temp: 150, color: [230, 230, 0] },
            { temp: 250, color: [200, 200, 160] },
            { temp: 500, color: [240, 240, 224] }
        ];
        return calculateColor(steps, props.valeur, 0, 500);
    }
    if (props.titre === 'Direction du vent') {
        const steps = [
            { temp: 0, color: [255, 0, 0] },
            { temp: 90, color: [0, 230, 0] },
            { temp: 180, color: [0, 0, 255] },
            { temp: 270, color: [230, 230, 0] },
            { temp: 360, color: [0, 0, 255] }
        ];
        return calculateColor(steps, props.valeur, 0, 360);
    }
    if (props.titre === 'Vitesse moyenne du vent') {
        const steps = [
            { temp: 0, color: [0, 255, 0] },
            { temp: 25, color: [191, 242, 61] },
            { temp: 50, color: [245, 245, 0] },
            { temp: 75, color: [255, 165, 0] },
            { temp: 100, color: [255, 0, 0] }
        ];
        return calculateColor(steps, props.valeur, 0, 100);
    }
});
</script>

<template>
    <div class="measure-container">
        <h3>{{ titre }}</h3>
        <div class="station-name">{{ station }}</div>
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
    position: relative; /* Important for positioning the station name */
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

.station-name {
    position: absolute; /* Absolute positioning */
    top: 10px;
    right: 10px;
    font-size: 2vh;
    color: #333;
    font-weight: normal;
}
</style>