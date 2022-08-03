export default {
  map: {
    mapType: "Tianditu|vec",
    mapLevel: 14,
    mapCenter: { lng: 119.64882021, lat: 31.72553618 },
    mapOptions: {
      minZoom: 6,
      maxZoom: 18,
      enableAutoResize: true,
      preferCanvas: true,
    },
    mapExtra: ["turf", "plotting", "lasso"],
  },
  wmsUrl: "/api/geoserver/gis/wms",
  wfsUrl: "/geoserver/gis/ows",
  autoLocation: false, // 是否自动定位
};
