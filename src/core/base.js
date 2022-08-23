import "leaflet";
import "leaflet/dist/leaflet.css";
import "@/plugin/leaflet.ChineseTmsProviders"; // 国内地图底图加载
import "@/plugin/leaflet.mapCorrection"; // 坐标地图纠偏

import config from "@/conf/map";
import emitter from "@/utils/emitter";

let mapInstance = null;

/**
 * 创建地图
 */
export function createMap(options = config) {
  const { map: mapConfig } = options;
  mapInstance = L.map(mapConfig.container, {
    attributionControl: false,
    zoomControl: false,
    ...mapConfig,
  });

  emitter.emit("mapLoaded");

  return mapInstance;
}

/**
 * 加载预置底图
 * @param {*} type 底图类型
 */
export function addPresetTileLayer(options = config) {
  const { map: mapConfig } = options;
  L.tileLayer
    .chinaProvider(mapConfig.type, {
      ...mapConfig,
    })
    .addTo(mapInstance);

  emitter.emit("tileLayerLoaded");
}

/**
 * 地图缩放到图层可视区域
 * @param {*} currentLayer 计算图层
 */
function setFixView(currentLayer) {
  const sw = currentLayer.layer.getBounds()._southWest;
  const ne = currentLayer.layer.getBounds()._northEast;
  if (sw && ne) {
    const fitBounds = new this.aqsc.Bounds(
      new this.aqsc.Point(sw.lng, sw.lat),
      new this.aqsc.Point(ne.lng, ne.lat)
    );
    this.map.fitBounds(fitBounds);
  }
}
