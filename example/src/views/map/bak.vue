<template>
  <div class="op">
    <el-button @click="toggleLines">画线</el-button>
    <el-button @click="togglePolygon">画面</el-button>
    <el-button @click="toggleCircle">画圆</el-button>
    <el-button @click="toggleRentangle">画方</el-button>
    <el-button @click="removeAll">清空</el-button>
  </div>
  <div id="map"></div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";

import { map as drawMap, utils } from "@root/lib/leaflet-map-es";
import "@root/lib/leaflet-map-es.css";
import mapConfig from "@/config/map";
import request from "@/utils/request";

// import "./plugins/leaflet-tilelayer-colorizr";
import "@/plugins/leaflet.mask.js";
import ks from "@/mock/ks";

let gisMap;
function mapInit() {
  gisMap = drawMap.createMap({
    map: {
      ...mapConfig.map,
    },
  });

  // window.L.tileLayer(
  //   "http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=2&customid=hardedge",
  //   {
  //     maxZoom: 18,
  //     minZoom: 6,
  //     tms: true,
  //     crossOrigin: true,
  //     subdomains: "012",
  //   }
  // ).addTo(gisMap);

  drawMap.addPresetTileLayer(mapConfig);

  // window.L.tileLayer(
  //   "https://api.mapbox.com/styles/v1/osdwenyu/cl6oh94u9002w15mg25o0afsj/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib3Nkd2VueXUiLCJhIjoiY2w2b2g2bnllMDFxMzNjcGlwcXNxazRrNyJ9.QBEkrrQwNHRvBy81N5STAw",
  //   {
  //     maxZoom: 18,
  //     minZoom: 1,
  //   }
  // ).addTo(gisMap);

  //   let wfsLayer = window.L.mask(ks, {}, gisMap);
  // let wfsLayer = drawMap.layer.createWFSLayer({}, ks);
  // wfsLayer.addTo(gisMap);
  // gisMap.fitBounds(wfsLayer._bounds);

  var latlngs = [
    [53.73947776524085, 73.56312877462698],
    [4.633901583549054, 73.56312877462698],
    [4.633901583549054, 135.60186557058367],
    [53.73947776524085, 135.60186557058367],
  ];
  // var polygon = L.polygon(latlngs, { color: "red" }).addTo(gisMap);
  // gisMap.fitBounds(polygon.getBounds());

  gisMap
    .addControl(drawMap.control.attributionControl())
    .addControl(drawMap.control.zoomControl())
    .addControl(drawMap.control.scaleControl());
}

function toggleLines() {
  drawMap.measure.polyline.initialize(gisMap, { showMarker: true });
  drawMap.measure.polyline.enable();
}

function togglePolygon() {
  drawMap.measure.polygon.initialize(gisMap, { showMarker: true });
  drawMap.measure.polygon.enable();
}

function toggleCircle() {
  drawMap.measure.circle.initialize(gisMap, { showMarker: true });
  drawMap.measure.circle.enable();
}

function toggleRentangle() {
  drawMap.measure.rectangle.initialize(gisMap, { showMarker: true });
  drawMap.measure.rectangle.enable();
}

function removeAll() {
  drawMap.measure.polyline.removeAll();
  drawMap.measure.polygon.removeAll();
  drawMap.measure.circle.removeAll();
  drawMap.measure.rectangle.removeAll();
}

onMounted(async () => {
  // await drawMap.service
  //   .getLocationByIp()
  //   .then((res) => {
  //     if (res.code === 200) {
  //       mapConfig.map.center = [res.data.lat, res.data.lng];
  //       mapInit();
  //     }
  //   })
  //   .catch((e) => {
  //     mapInit();
  //   });

  mapInit();

  // drawMap.measure.polygon.initialize(gisMap);
  // drawMap.measure.polygon.enable();

  // drawMap.measure.rectangle.initialize(gisMap);
  // drawMap.measure.rectangle.enable();

  // utils.emitter.on("measure.circle.created", (e) => {
  //   console.log(e);
  // });

  // let layerGroup = drawMap.createLayerGroup();

  // layerGroup.addTo(gisMap);

  // const params = {
  //   layer: "gis:PE160_adjust",
  // };

  // params.url = mapConfig.wmsUrl;
  // let wmsLayer = drawMap.layer.createWMSLayer(params);
  // wmsLayer.addTo(gisMap);

  // params.url = mapConfig.wfsUrl;
  // const data = await drawMap.layer.getGeoJson(params);
  // let wfsLayer = drawMap.layer.createWFSLayer({}, data);
  // wfsLayer.addTo(gisMap);

  // try {
  //   const searchData = await drawMap.service.localSearch(gisMap, {
  //     tk: mapConfig.map.key,
  //     keyWord: "软件公司",
  //   });

  //   const locationData = await drawMap.service.getLocation({
  //     tk: mapConfig.map.key,
  //     keyWord: "软件公司",
  //   });

  //   const pointData = await drawMap.service.getPoint({
  //     tk: mapConfig.map.key,
  //     lon: 109.40256809,
  //     lat: 29.50410173,
  //   });

  //   const testData = await drawMap.service.getLocationByIp();
  // } catch (error) {
  //   console.log(error);
  // }
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

/* .leaflet-zoom-animated img {
      filter: brightness(0.88) contrast(1.22) grayscale(0) hue-rotate(360deg) opacity(1) saturate(1.1)
        sepia(0.54) invert(0.9);
    } */

.op {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 9999;
}
</style>
