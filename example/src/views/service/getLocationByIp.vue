<template>
  <div class="page-container">
    <div id="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";

import { map as drawMap } from "leaflet-smap";
import mapConfig from "@/config/map";

let gisMap;
let tileLayer;
let searchMarker;
function mapInit() {
  gisMap = drawMap.createMap(mapConfig);
  drawMap.addPresetTileLayer(mapConfig);

  queryByIp();
}

function queryByIp() {
  drawMap.service.getLocationByIp().then((res) => {
    if (res.code === 200) {
      setMapPin({
        latlng: [res.data.lat, res.data.lng],
        address: JSON.stringify(res.data),
      });
    }
  });
}

function setMapPin(ev) {
  if (searchMarker) {
    searchMarker.remove();
  }

  searchMarker = new L.marker(ev.latlng, {
    icon: new L.icon({
      iconUrl: "/marker.svg",
      iconSize: [38, 95],
    }),
  });

  searchMarker.bindTooltip(ev.address);

  gisMap.addLayer(searchMarker);

  gisMap.panTo(ev.latlng);
}

onMounted(async () => {
  mapInit();
});
</script>

<style>
#map {
  width: 100vw;
  height: 100vh;
  z-index: 1;
}
</style>
