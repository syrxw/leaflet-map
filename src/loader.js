import { isArray } from "lodash-es";
import { createScript, createStyle } from "./utils/loadAssets";
export const fileMap = {
  coreStyle: "aqsc/core.min.css",
  coreScript: "aqsc/core.min.js",
  jquery: "aqsc/jquery-3.6.0.min.js",
  plotting: "aqsc/plotting.js",
  turf: "aqsc/turf.js",
  lasso: "aqsc/leaflet-lasso.min.js",
  antPath: "aqsc/leaflet-ant-path.js",
  arrowHead: "aqsc/leaflet-arrowheads.js",
  geometryutil: "aqsc/leaflet-geometryutil.js",
  arrowCircle: "aqsc/leaflet-arrowcircle.js",
};

export function MapLoader(file) {
  createStyle(fileMap.coreStyle);
  const aqsc = new Promise((resolve, reject) => {
    if (window.Aqsc) {
      resolve(window.Aqsc);
    } else {
      createScript(fileMap.coreScript, reject, () => {
        window.Aqsc.Util.getAqscMapAk = function () {
          return true;
        };
        resolve(window.Aqsc);
      });
    }
  });

  aqsc.then(() => {
    if (isArray(file) && file.length > 0) {
      file.forEach((item) => {
        createScript(fileMap[item]);
      });
    }
  });

  return aqsc;
}
