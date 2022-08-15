export default {
  map: {
    container: "map",
    type: "GaoDe.Brief.Map",
    center: [31.820591, 117.227219],
    zoom: 12,
    preferCanvas: true,
    minZoom: 6,
    maxZoom: 18,
    key: "6cb11577e3ac27bbe015669e413f6cc4",
  },
  control: {
    addAttribution: {
      enable: false,
    },
    zoom: {
      enable: false,
    },
  },
  wmsUrl: "/api/geoserver/gis/wms",
  wfsUrl: "/geoserver/gis/ows",
  autoLocation: false, // 是否自动定位
};
