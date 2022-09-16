<template>
  <div id="map"></div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";

import { map as drawMap } from "@root/lib/leaflet-map-es";
import mapConfig from "@/config/map";

let gisMap;
function mapInit() {
  gisMap = drawMap.createMap(mapConfig);
  mapConfig.map.type = "Mapbox.Satellite.Map";
  let tileLayer = drawMap.addPresetTileLayer(mapConfig);

  // new window.L.tileLayer(
  //   "https://api.mapbox.com/styles/v1/osdwenyu/cl6oh94u9002w15mg25o0afsj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3Nkd2VueXUiLCJhIjoiY2w2b2g2bnllMDFxMzNjcGlwcXNxazRrNyJ9.QBEkrrQwNHRvBy81N5STAw"
  // ).addTo(gisMap);
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
