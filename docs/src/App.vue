<template>
  <div id="map"></div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import MapDraw from "../../lib/map-es";
import mapConfig from "./config/map";

const gisMap = new MapDraw.Map(mapConfig.map);
gisMap.mount("map");
gisMap.emitter.on("mapLoaded", () => {
  gisMap.createWFSLayer({
    name: "管线1",
    layer: "gis:hptest",
    url: mapConfig.wfsUrl,
    epsg: "EPSG:4326",
  });
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#app img {
  width: 100px;
  margin-top: 20px;
}
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
