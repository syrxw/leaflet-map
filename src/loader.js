import { isArray } from "lodash-es";
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

export function createScript(src, reject, cb) {
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = src;
  script.onerror = reject;
  script.onload = cb;
  document.head.appendChild(script);
}

export function createStyle(url) {
  const head = document.getElementsByTagName("head")[0];
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  head.appendChild(link);
}
