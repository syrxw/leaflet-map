export default {
  map: {
    container: "map",
    type: "GaoDe.Normal.Map",
    center: [31.8584, 117.285],
    zoom: 14,
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
  autoLocation: false, // 是否自动定位
};
