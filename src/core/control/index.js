import config from "@/conf/map";
import emitter from "@/utils/emitter";

let mapInstance;
/**
 * 控件模块
 */
export function setControl(instance) {
  mapInstance = instance;

  const { addAttribution: addAttributionConfig, zoom: zoomConfig } = config.control;

  // 水印信息加载
  if (addAttributionConfig.enable) {
    addAttributionControl(addAttributionConfig);
  }

  // 缩放控件加载
  if (zoomConfig.enable) {
    addZoomControl(zoomConfig);
  }

  emitter.emit("controlLoaded");
}

/**
 * 右下角水印信息
 */
function addAttributionControl(options) {
  const mergeOptions = {
    prefix: "",
    content: 'leaft-map &copy; <a href="https://www.osdiot.com/">Osdiot</a>',
    ...options,
  };
  const attribution = mapInstance.attributionControl;
  attribution.setPrefix(mergeOptions.prefix);
  attribution.addAttribution(mergeOptions.content);

  return attribution;
}

/**
 * 缩放控件
 */
function addZoomControl(options) {
  const mergeOptions = {
    ...options,
  };
  const zoomControl = L.control.zoom(mergeOptions);
  mapInstance.addControl(zoomControl);
}
