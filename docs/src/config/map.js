export default {
  map: {
    container: "map",
    type: "BaiduV3.Normal.Map",
    center: [29.495755, 109.4032717],
    zoom: 15,
    // preferCanvas: true,
    minZoom: 6,
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
