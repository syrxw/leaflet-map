const defaultConfig = {
  // 超时时间
  timeout: 3000,
  // 是否需要高精度定位
  enableHighAccuracy: false,
};
/**
 * @description: html5定位
 * @param {*}timeout/超时时间
 * @param {*}enableHighAccuracy/是否需要高精度定位
 * @return {*}
 */
export function getLocation(obj) {
  const { timeout, enableHighAccuracy } = { ...defaultConfig, ...obj };
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (e) => {
          // 纬度，经度
          const { latitude, longitude } = e.coords;
          navigator.geolocation.clearWatch(id);
          resolve({ latitude, longitude });
        },
        (error) => {
          navigator.geolocation.clearWatch(id);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject("html5已拒绝定位");
              break;
            case error.POSITION_UNAVAILABLE:
              reject("html5位置信息不可用");
              break;
            case error.TIMEOUT:
              reject("html5定位超时");
              break;
            case error.UNKNOWN_ERROR:
              reject("html5定位未知错误");
              break;
          }
        },
        { enableHighAccuracy, timeout, maximumAge: 0 }
      );
      return;
    }
    reject("浏览器不支持HTML5定位");
  });
}

export default {
  getLocation,
};
