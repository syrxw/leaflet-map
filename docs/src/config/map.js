export default {
  map: {
    container: "map",
    type: "GaoDe.Normal.Map",
    center: [29.50410173, 109.40256809],
    zoom: 18,
    preferCanvas: true,
    minZoom: 6,
    maxZoom: 18,
  },
  control: {
    addAttribution: {
      enable: false,
    },
    zoom: {
      enable: true,
      zoomInText: "1",
    },
  },
  wmsUrl: "/api/geoserver/gis/wms",
  wfsUrl: "/geoserver/gis/ows",
  autoLocation: false, // 是否自动定位
};
