export default {
  map: {
    container: "map",
    type: "TianDiTu.Normal.Map",
    center: [31.394637, 120.975175],
    zoom: 10,
    // preferCanvas: true,
    minZoom: 3,
    maxZoom: 18,
    key: "6cb11577e3ac27bbe015669e413f6cc4",
  },
  // control: {
  //   addAttribution: {
  //     enable: false,
  //   },
  //   zoom: {
  //     enable: false,
  //   },
  //   scale: {
  //     enable: false,
  //   },
  // },
  wmsUrl: "/api/geoserver/gis/wms",
  wfsUrl: "/geoserver/gis/ows",
  autoLocation: false, // 是否自动定位
};
