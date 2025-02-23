<script setup>
const props = defineProps({
  temp: {
    type: Number,
    required: true,
  },
})
</script>

<template>
    <div class="value-container">
        <h3>Température</h3>
        <div id="value">
            <p>{{ temp }} °C</p>
        </div>
    </div>
</template>

<style scoped>
.value-container {
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 300px;
    margin: 20px auto;
}

h3 {
    color: #333;
    margin-bottom: 10px;
}

#value {
    font-size: 20px;
    font-weight: bold;
    color: #d67f03;
}
</style>