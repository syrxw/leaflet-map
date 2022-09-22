<template>
  <div id="map"></div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";

import { map as drawMap } from "@osdiot/leaflet-map";
import mapConfig from "@/config/map";
import { DynamicMapLayer } from "esri-leaflet";
import request from "@/utils/request";

let gisMap;
async function mapInit() {
  mapConfig.map.zoom = 15;
  mapConfig.map.center = [37.42403, 112.43175];
  gisMap = drawMap.createMap(mapConfig);
  let tileLayer = drawMap.addPresetTileLayer(mapConfig);

  // request.get("/arcgis/rest/services?f=json").then((res) => {
  //   res.services.forEach((item) => {
  //     if (item.type === "MapServer") {
  //       new DynamicMapLayer({
  //         url: `/arcgis/rest/services/${item.name}/MapServer`,
  //         opacity: 1,
  //         f: "jsapi",
  //       }).addTo(gisMap);
  //     }
  //   });
  // });

  new DynamicMapLayer({
    url: "/arcgis/rest/services/LinXpipe/MapServer",
    opacity: 1,
    f: "jsapi",
  }).addTo(gisMap);

  // new DynamicMapLayer({
  //   url: "/arcgis/rest/services/GXNYpipe/MapServer",
  //   opacity: 1,
  //   f: "jsapi",
  // }).addTo(gisMap);

  // console.log(envLayer);

  // gisMap.addLayer(envLayer);
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

/* .leaflet-zoom-animated img {
  filter: brightness(0.88) contrast(1.22) grayscale(0) hue-rotate(360deg) opacity(1) saturate(1.1)
    sepia(0.54) invert(0.9);
} */
</style>
