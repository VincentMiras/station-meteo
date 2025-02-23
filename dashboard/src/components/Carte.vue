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
})

import { onMounted, ref } from 'vue';
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import "leaflet.markercluster";

const map = ref(null);

onMounted(() => {

  map.value = L.map('map', { zoomControl: true, zoom: 1, zoomAnimation: true, fadeAnimation: true, markerZoomAnimation: true }).setView(props.coords[0], 6);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map.value);

  const markers = L.markerClusterGroup();

  props.coords.forEach(points => {
    let marker = L.marker(points).bindPopup('<strong>Station</strong>');
    markers.addLayer(marker);
  });

  map.value.addLayer(markers);
});
</script>

<style scoped>
#map {
  width: 90hv;
  height: 80vh;
}
</style>
