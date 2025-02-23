<script setup>
import ChoixCapteur from '../components/ChoixCapteur.vue'
import ValidationBouton from '../components/ValidationBouton.vue'
import { useWeatherStore } from '@/stores/weatherStore';

const weatherStore = useWeatherStore();

weatherStore.mode = 'live';
</script>

<template>
    <main>
        <div class="selection-container">
            <ChoixCapteur />
        </div>
        <div class="validation-container">
            <ValidationBouton />
        </div>
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.selection-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 800px;
    /* Ajuste la largeur max pour un bon centrage */
    gap: 40px;
    /* Espace entre les deux composants */
}

.validation-container {
    margin-top: 20px;
    text-align: center;
}
</style>