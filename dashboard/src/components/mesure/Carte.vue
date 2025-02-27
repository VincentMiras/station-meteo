<template>
  <div>
    <h3>Position des stations météo</h3>
    <div id="map"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  coords: {
    type: Array,
    required: true,
  },
  station: {
    type: Array,
    default:'unknown',
  }
})

import { onMounted, ref } from 'vue';
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: '../../../Raspberry_Pi_logo.png',
  iconSize: [32, 40.4266666666 ],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const map = ref(null);

onMounted(() => {

  map.value = L.map('map', { zoomControl: true, zoom: 1, zoomAnimation: true, fadeAnimation: true, markerZoomAnimation: true }).setView(props.coords[0], 6);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map.value);

  let i = 0;

  props.coords.forEach(points => {
    L.marker(points, {icon: customIcon}).bindPopup('<strong>Station </strong>'+props.station[i]).addTo(map.value);
    i+=1;

  });
});
</script>

<style scoped>
#map {
  width: 90hv;
  height: 80vh;
}
</style>
