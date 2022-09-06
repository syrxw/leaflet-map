<template>
  <div id="map"></div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";

import { map as drawMap } from "@osdiot/leaflet-map";
import mapConfig from "@/config/map";

let gisMap;
function mapInit() {
  gisMap = drawMap.createMap(mapConfig);
  let tileLayer = drawMap.addPresetTileLayer(mapConfig);
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
