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

  map.value = L.map('map', { zoomControl: true, zoom: 1, zoomAnimation: true, fadeAnimation: true, markerZoomAnimation: true }).setView(props.coords[0], 10);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
  }).addTo(map.value);

//   const geolayer = L.tileLayer('https://data.geopf.fr/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
//     maxZoom: 19,
//     attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
//     format: 'image/png',
// 	  style: 'normal'
//   });

//   const CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
// 	subdomains: 'abcd',
// 	maxZoom: 20
// });

//   map.value.on('zoomend', () => {
//     const currentZoom = map.value.getZoom();
//     if (currentZoom >= 8) {
//       if (!map.value.hasLayer(CartoDB_Voyager)) {
//         map.value.addLayer(CartoDB_Voyager);
//         map.value.removeLayer(geolayer);
//       }
//     } else {
//       if (!map.value.hasLayer(geolayer)) {
//         map.value.addLayer(geolayer);
//         map.value.removeLayer(CartoDB_Voyager);
//       }
//     }
//   });


  let i = 0;

  props.coords.forEach(points => {
    L.marker(points, {icon: customIcon}).bindPopup('<strong>Station </strong>'+props.station[i]).addTo(map.value);
    i+=1;

  });
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 70vh;
  border: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  text-align: center;
  color: #2c3e50;
  font-family: 'Helvetica', sans-serif;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.mypopup.leaflet-popup-content-wrapper{
  background-color: gray;
  opacity: 0.9;
}
.mypopup.leaflet-popup-tip {
  color: red;
  }

.leaflet-popup-content h4 {
  color: #2980b9;
}
</style>
