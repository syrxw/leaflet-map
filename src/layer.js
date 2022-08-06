import request from "./utils/request";

/**
 * 创建渲染图层
 * @param {*} options 图层参数
 * @param {*} isPure 是否虚拟生成图层信息
 */
export function createLayerGroup(options) {
  return L.layerGroup(options);
}

export async function getGeoJson(options) {
  // 向geoserver请求数据
  let params = {
    service: "WFS",
    version: "1.1.0",
    request: "GetFeature",
    typeName: options.layer,
    outputFormat: "application/json",
    ...options,
  };

  const url = options.url;
  const u = url + L.Util.getParamString(params, url);

  return await request.get(u);
}

/**
 * 创建WFS图层
 * @param {Object} options
 */
export function createWFSLayer(options, data) {
  const wfsLayer = new L.geoJson(data, {
    style: { ...options.style, renderer: L.canvas() },
    onEachFeature: () => {},
  });

  return wfsLayer;
}

/**
 * 创建WMS图层
 * @param {Object} options
 */
export function createWMSLayer(options) {
  const config = {
    layers: options.layer,
    format: "image/png",
    transparent: true,
    zoomOffset: 100,
    detectRetina: true,
    ...options,
  };
  if (options.crs) config.crs = options.crs;
  const wmsLayer = L.tileLayer.wms(options.url, config);
  return wmsLayer;
}
