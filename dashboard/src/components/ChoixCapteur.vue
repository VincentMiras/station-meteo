<template>
    <fieldset class="weather-form">
        <legend class="weather-legend">Choisissez les mesures que vous souhaitez voir :</legend>

        <div class="weather-option">
            <input type="checkbox" id="temperature" name="temperature" />
            <label for="temperature">Température</label>
        </div>

        <div class="weather-option">
            <input type="checkbox" id="pressure" name="pressure" />
            <label for="pressure">Pression</label>
        </div>

        <div class="weather-option">
            <input type="checkbox" id="rain" name="rain" />
            <label for="rain">Précipitations</label>
        </div>

        <div class="weather-option">
            <input type="checkbox" id="luminosity" name="luminosity" />
            <label for="luminosity">Luminosité</label>
        </div>

        <div class="weather-option">
            <input type="checkbox" id="wind_heading" name="wind_heading" />
            <label for="wind_heading">Direction du vent</label>
        </div>

        <div class="weather-option">
            <input type="checkbox" id="wind_speed_avg" name="wind_speed_avg" />
            <label for="wind_speed_avg">Vitesse moyenne du vent</label>
        </div>

        <div class="weather-option">
            <input type="checkbox" id="position" name="position" />
            <label for="position">Position</label>
        </div>
    </fieldset>
</template>

<style scoped>
.weather-form {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 0 auto;
}

.weather-legend {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
    text-align: center;
}

.weather-option {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.weather-option input[type="checkbox"] {
    margin-right: 10px;
    transform: scale(1.2);
}

.weather-option label {
    font-size: 16px;
    font-weight: normal;
    color: #555;
    transition: color 0.3s ease;
}

.weather-option label:hover {
    color: #ffb300;
}

.weather-option input[type="checkbox"]:checked+label {
    color: #28a745;
}

.weather-option input[type="checkbox"]:disabled+label {
    color: #aaa;
}
</style>
