<template>
  <div id="map"></div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";

import { map as drawMap } from "@root/lib/leaflet-map-es";
import mapConfig from "@/config/map";
import lf from "@/mock/422827.json";

let gisMap;
function mapInit() {
  mapConfig.map.zoom = 11;
  mapConfig.map.center = [29.495755, 109.4032717];
  gisMap = drawMap.createMap(mapConfig);
  let tileLayer = drawMap.addPresetTileLayer(mapConfig);

  // new window.L.tileLayer(
  //   "https://api.mapbox.com/styles/v1/osdwenyu/cl6oh94u9002w15mg25o0afsj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3Nkd2VueXUiLCJhIjoiY2w2b2g2bnllMDFxMzNjcGlwcXNxazRrNyJ9.QBEkrrQwNHRvBy81N5STAw"
  // ).addTo(gisMap);

  let wfsLayer = drawMap.layer.createWFSLayer(
    {
      style: {
        fill: true,
        fillOpacity: 0.1,
        weight: 2,
        dashArray: "8, 8",
      },
    },
    lf
  );
  wfsLayer.addTo(gisMap);
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
