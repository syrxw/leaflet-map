<template>
  <div class="page-container">
    <el-card class="toggle-bar">
      <el-radio-group v-model="tileLayerType" @change="handleSelect">
        <el-radio :label="item.value" v-for="item in mapTileData" :key="item.id">{{
          item.name
        }}</el-radio>
      </el-radio-group>
    </el-card>
    <div id="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";

import { map as drawMap } from "@root/lib/leaflet-map-es";

import { nanoid } from "nanoid";

let gisMap;
let mapConfig = {
  map: {
    container: "map",
    type: "TianDiTu.Normal.Map",
    center: [31.394637, 120.975175],
    zoom: 18,
    preferCanvas: true,
    minZoom: 3,
    maxZoom: 18,
    key: "6cb11577e3ac27bbe015669e413f6cc4",
  },
};
function mapInit() {
  gisMap = drawMap.createMap(mapConfig);

  L.marker(mapConfig.map.center, {
    icon: L.divIcon({ className: "my-div-icon", iconSize: [20, 20] }),
  }).addTo(gisMap);

  handleSelect("1");
}

onMounted(async () => {
  mapInit();
});

let mapTileData = ref([
  {
    id: nanoid(),
    name: "天地图wgs84",
    value: "1",
    callback: addTiandituMap,
    crs: L.CRS.EPSG3857,
  },
  {
    id: nanoid(),
    name: "高德地图gcj02",
    value: "2",
    callback: addGaodeMap,
    crs: L.CRS.EPSG3857,
  },
  {
    id: nanoid(),
    name: "百度地图bd09",
    value: "3",
    callback: addBaiduMap,
    crs: L.CRS.Baidu,
  },
]);

let tileLayerType = ref("1");
let tileLayers = {};
function handleSelect(val) {
  let currentItem = mapTileData.value.find((item) => {
    return item.value === val;
  });

  resetMapViewByCrs(currentItem.crs);
  currentItem.callback();
}

function addTiandituMap() {
  tileLayers["TianDiTuNormalMap"]?.remove();
  tileLayers["TianDiTuNormalAnnotion"]?.remove();

  mapConfig.map.type = "TianDiTu.Normal.Map";
  tileLayers["TianDiTuNormalMap"] = drawMap.addPresetTileLayer(mapConfig);

  mapConfig.map.type = "TianDiTu.Normal.Annotion";
  tileLayers["TianDiTuNormalAnnotion"] = drawMap.addPresetTileLayer(mapConfig);
}

function addGaodeMap() {
  tileLayers["GaoDeNormalMap"]?.remove();

  mapConfig.map.type = "GaoDe.Normal.Map";
  tileLayers["GaoDeNormalMap"] = drawMap.addPresetTileLayer(mapConfig);
}

function addBaiduMap() {
  tileLayers["BaiduV3NormalMap"]?.remove();

  mapConfig.map.type = "BaiduV3.Normal.Map";
  tileLayers["BaiduV3NormalMap"] = drawMap.addPresetTileLayer(mapConfig);
}

function resetMapViewByCrs(crs) {
  gisMap.options.crs = crs;
  gisMap._resetView(gisMap.getCenter(), gisMap.getZoom());
}
</script>

<style>
#map {
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.my-div-icon {
  background-color: #f40;
}
</style>
