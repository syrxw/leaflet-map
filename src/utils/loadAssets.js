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

export default {
  createScript,
  createStyle,
};
