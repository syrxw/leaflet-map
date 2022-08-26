import request from "@/utils/request";

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
    crs: L.CRS.EPSG4326,
    ...options,
  };
  if (options.crs) config.crs = options.crs;
  const wmsLayer = L.tileLayer.wms(options.url, config);
  console.log(wmsLayer);
  return wmsLayer;
}

export function createImgPoint() {}
