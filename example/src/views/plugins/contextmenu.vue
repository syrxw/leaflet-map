<template>
  <div id="map"></div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";

import { map as drawMap } from "@osdiot/leaflet-map";
import "@/plugins/leaflet.mask.js";
import ah from "@/mock/340000.json";

const mapConfig = {
  map: {
    container: "map",
    type: "GaoDe.Normal.Map",
    center: [31.820591, 117.227219],
    zoom: 10,
    preferCanvas: true,
    minZoom: 3,
    maxZoom: 18,
    key: "6cb11577e3ac27bbe015669e413f6cc4",
  },
};

let gisMap;
function mapInit() {
  gisMap = drawMap.createMap(mapConfig);
  let tileLayer = drawMap.addPresetTileLayer(mapConfig);
}

function addMask() {
  let hf = ah.features.find((item) => item.id === "340100");
  let wfsLayer = window.L.mask(
    hf,
    { fillColor: "#f40", fillOpacity: "0.5", color: "#f40" },
    gisMap
  );
  wfsLayer.addTo(gisMap);
}

onMounted(async () => {
  mapInit();
  addMask();
});
</script>

<style>
#map {
  width: 100vw;
  height: 100vh;
  z-index: 1;
}
</style>
