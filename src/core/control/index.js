/**
 * 右下角水印信息
 */
export function attributionControl(options) {
  const mergeOptions = {
    prefix: "",
    content: 'leaft-map &copy; <a href="https://www.osdiot.com/">Osdiot</a>',
    ...options,
  };
  const attribution = L.control.attribution();

  attribution.setPrefix(mergeOptions.prefix);
  attribution.addAttribution(mergeOptions.content);

  return attribution;
}

/**
 * 缩放控件
 */
export function zoomControl(options, map) {
  const mergeOptions = {
    ...options,
  };
  const zoomControl = L.control.zoom(mergeOptions);

  return zoomControl;
}

/**
 * 比例尺控件
 */
export function scaleControl(options, map) {
  const mergeOptions = {
    ...options,
  };
  const scaleControl = L.control.scale(mergeOptions);

  return scaleControl;
}
