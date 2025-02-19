<template>
  <div>
    <h3>Position des stations météo</h3>
    <div id="map" style="height:90vh;"></div>
  </div>
</template>

<script setup>
defineProps({
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
  map.value = L.map('map', {zoomControl: true,zoom:1,zoomAnimation:true,fadeAnimation:true,markerZoomAnimation:true}).setView([23.8041, 90.4152], 6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, 
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.value);

  const markers = L.markerClusterGroup();

  const marker1 = L.marker([24.3746, 88.6004]).bindPopup('<strong>Hello Bangladesh!</strong>');
  const marker2 = L.marker([22.3752, 91.8349]);
  
  markers.addLayer(marker1);
  markers.addLayer(marker2);
  
  map.value.addLayer(markers);
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 90vh; /* Prend toute la hauteur disponible */
}
</style>
