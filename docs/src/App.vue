<template>
  <div id="map"></div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { map as drawMap, utils } from "../../lib/map-es";
import mapConfig from "./config/map";
import request from "./utils/request";

onMounted(async () => {
  const gisMap = drawMap.createMap(mapConfig);

  // mapConfig.map.type = "TianDiTu.Satellite.Map";
  // drawMap.addPresetTileLayer(mapConfig);

  // mapConfig.map.type = "TianDiTu.Satellite.Annotion";
  // drawMap.addPresetTileLayer(mapConfig);

  drawMap.addPresetTileLayer();

  // let layerGroup = drawMap.createLayerGroup();

  // layerGroup.addTo(gisMap);

  const params = {
    layer: "gis:PE160_adjust",
  };

  params.url = mapConfig.wmsUrl;
  let wmsLayer = drawMap.createWMSLayer(params);
  wmsLayer.addTo(gisMap);

  params.url = mapConfig.wfsUrl;
  const data = await drawMap.getGeoJson(params);
  let wfsLayer = drawMap.createWFSLayer({}, data);
  wfsLayer.addTo(gisMap);
});

// utils.emitter.on("mapLoaded", () => {
//   console.log("mapLoaded");
// });
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#map {
  width: 100vw;
  height: 100vh;

  z-index: 1;
}
</style>
