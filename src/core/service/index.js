import * as api from "@/api";

// POI位置搜索
export async function localSearch(map, options) {
  const level = map.getZoom();
  const { _northEast, _southWest } = map.getBounds();
  const mapBound = Object.values(_southWest)
    .reverse()
    .concat(Object.values(_northEast).reverse())
    .join();

  // const mapBound = [-180, -90, 180, 90];

  if (!options.tk) {
    throw new Error("请传入正确的key");
  }
  const data = await api.tianditu.search({
    level,
    mapBound,
    queryType: 1,
    start: 0,
    ...options,
  });

  return data;
}

// 地理位置解析
export async function getLocation(options) {
  if (!options.tk) {
    throw new Error("请传入正确的key");
  }
  const data = await api.tianditu.geocoderLocation(options);

  return data;
}

// 逆地理位置解析
export async function getPoint(options) {
  if (!options.tk) {
    throw new Error("请传入正确的key");
  }
  const data = await api.tianditu.geocoderPoint({ ...options, ver: 1 });

  return data;
}

// 根据ip获取位置
export async function getLocationByIp(params) {
  const data = await api.tianditu.getLocation();

  return data;
}
