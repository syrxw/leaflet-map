<template>
  <div class="page-container">
    <el-card class="toggle-bar">
      <el-autocomplete
        v-model="searchValue"
        value-key="name"
        placeholder="请输入关键字"
        :fetch-suggestions="querySearchAsync"
        @select="querySearchSelect"
      >
        <template #default="{ item }">
          <span :title="item.name">{{ item.name }}</span>
          <span class="district" :title="item.district">{{ item.district }}</span>
        </template>
      </el-autocomplete>
    </el-card>
    <div id="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";

import { map as drawMap } from "leaflet-smap";
import mapConfig from "@/config/map";

let gisMap;
let tileLayer;
let searchMarker;
function mapInit() {
  gisMap = drawMap.createMap(mapConfig);
  drawMap.addPresetTileLayer(mapConfig);
}

const searchValue = ref("");
async function querySearchAsync(keyword, cb) {
  drawMap.service
    .localSearch(gisMap, {
      tk: mapConfig.map.key,
      keyWord: keyword,
    })
    .then((res) => {
      if (res.status.infocode === 1000) {
        cb(res.pois || []);
      } else {
        cb([]);
      }
    });
}

function querySearchSelect(item) {
  const locale = item.lonlat.split(",");
  const latlng = {
    lng: locale[0],
    lat: locale[1],
  };
  setMapPin({ latlng, address: item.address });
}

function setMapPin(ev) {
  if (searchMarker) {
    searchMarker.remove();
  }

  searchMarker = new L.marker(ev.latlng, {
    icon: new L.icon({
      iconUrl: "/marker.svg",
      iconSize: [38, 95],
    }),
  });

  searchMarker.bindTooltip(ev.address);

  gisMap.addLayer(searchMarker);

  gisMap.panTo(ev.latlng);
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
