import * as api from "@/api";

// POI位置搜索
export async function localSearch(map, params) {
  const level = map.getZoom();
  const { _northEast, _southWest } = map.getBounds();
  const mapBound = Object.values(_southWest)
    .reverse()
    .concat(Object.values(_northEast).reverse())
    .join();

  if (!params.tk) {
    throw new Error("请传入正确的key");
  }
  const data = await api.tianditu.search({
    ...params,
    level,
    mapBound,
    queryType: 1,
    start: 0,
  });

  if (data.status.infocode == 1000) {
    return data;
  } else {
    throw new Error(data.status.cndesc);
  }
}

// 地理位置解析
export async function getLocation(params) {
  if (!params.tk) {
    throw new Error("请传入正确的key");
  }
  const data = await api.tianditu.geocoderLocation(params);

  return data;
}

// 逆地理位置解析
export async function getPoint(params) {
  if (!params.tk) {
    throw new Error("请传入正确的key");
  }
  const data = await api.tianditu.geocoderPoint({ ...params, ver: 1 });

  return data;
}
