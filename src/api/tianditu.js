import request from "@/utils/request";

// api 地址 http://lbs.tianditu.gov.cn/server/search2.html
const baseApi = "http://api.tianditu.gov.cn";
// 天地图查询

// poi搜索
export function search(params) {
  return request.get(`${baseApi}/v2/search`, {
    params: {
      postStr: JSON.stringify(params),
      type: "query",
      tk: params.tk,
    },
  });
}

// 地理编码查询
export function geocoderLocation(params) {
  return request.get(`${baseApi}/geocoder`, {
    params: {
      ds: JSON.stringify(params),
      tk: params.tk,
    },
  });
}

// 逆地理编码查询
export function geocoderPoint(params) {
  return request.get(`${baseApi}/geocoder`, {
    params: {
      type: "geocode",
      postStr: JSON.stringify(params),
      tk: params.tk,
    },
  });
}
