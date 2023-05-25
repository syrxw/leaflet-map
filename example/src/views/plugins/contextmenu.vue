<template>
  <div id="map"></div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";

import { map as drawMap } from "leaflet-smap";

import { randomPoint } from "@turf/random";

import "@/plugins/leaflet.contextmenu";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";

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
    contextmenu: true,
  },
};

let gisMap;
function mapInit() {
  gisMap = drawMap.createMap(mapConfig);
  let tileLayer = drawMap.addPresetTileLayer(mapConfig);

  let pointLayer = new window.L.featureGroup().addTo(gisMap);

  const { _northEast, _southWest } = gisMap.getBounds();
  const bbox = Object.values(_southWest).reverse().concat(Object.values(_northEast).reverse());

  let points = randomPoint(100, { bbox });

  points.features.forEach((item) => {
    L.marker(item.geometry.coordinates.reverse(), {
      icon: L.icon({
        iconUrl: "/marker.svg",
        iconSize: [38, 95],
      }),
      contextmenu: false,
      contextmenuItems: [
        {
          text: "删除",
        },
      ],
    }).addTo(pointLayer);
  });

  gisMap.on("zoom", (e) => {
    if (gisMap.getZoom() >= 10) {
      pointLayer.eachLayer((item) => {
        item.setOpacity(1);
      });
    } else {
      pointLayer.eachLayer((item) => {
        item.setOpacity(0);
      });
    }
  });

  // new L.geoJson(randomPoint(100, { bbox })).addTo(pointLayer);
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
