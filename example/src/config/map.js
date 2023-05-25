export default {
  map: {
    container: "map",
    type: "GaoDe.Satellite.Map",
    center: [31.394637, 120.975175],
    zoom: 18,
    preferCanvas: true,
    minZoom: 3,
    maxZoom: 18,
    // key: "6cb11577e3ac27bbe015669e413f6cc4",
    key: "pk.eyJ1Ijoib3Nkd2VueXUiLCJhIjoiY2w2b2g2bnllMDFxMzNjcGlwcXNxazRrNyJ9.QBEkrrQwNHRvBy81N5STAw",
  },
  wmsUrl: "/api/geoserver/gis/wms",
  wfsUrl: "/geoserver/gis/ows",
  autoLocation: false, // 是否自动定位
};
