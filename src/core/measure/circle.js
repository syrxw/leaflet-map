import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import "./locale";
import "@/style/index.scss";

import emitter from "@/utils/emitter";

let mapInstance;
let circleDrawer;
function enable() {
  circleDrawer = new L.Draw.Circle(mapInstance, drawControl.options.draw.circle);
  circleDrawer.enable();
}

function disable() {
  circleDrawer.disable();
}

let pointLayerGroup;
let layerGroup;
let drawControl;
function initialize(instance, options) {
  mapInstance = instance;
  layerGroup = new L.FeatureGroup();
  pointLayerGroup = new L.FeatureGroup();
  mapInstance.addLayer(layerGroup);
  mapInstance.addLayer(pointLayerGroup);

  drawControl = new L.Control.Draw({
    edit: {
      featureGroup: layerGroup,
    },
    draw: {
      circle: {
        icon: new L.DivIcon({
          iconSize: new L.Point(8, 8),
          className: "leaflet-div-icon leaflet-editing-icon measure-icon",
        }),
        shapeOptions: {
          stroke: true,
          color: "#f40",
          weight: 4,
          opacity: 1,
        },
        ...options,
      },
    },
  });

  mapInstance.off(L.Draw.Event.CREATED).on(L.Draw.Event.CREATED, function (event) {
    let drawlayer = event.layer;
    layerGroup.addLayer(drawlayer);
    addMeasureMarker(drawlayer._mRadius, drawlayer._latlng);
  });
  mapInstance.off(L.Draw.Event.DRAWVERTEX);
}

function addMeasureMarker(radius, latlng) {
  const marker = L.marker(latlng, { icon: L.divIcon({ className: "my-div-icon" }) });
  marker
    .bindTooltip(buildHtml(`${formatArea(radius)}<div onclick="circle.deleteLine()">删除</div>`), {
      permanent: true,
      direction: "right",
      className: "measure-tooltip",
    })
    .openTooltip();

  pointLayerGroup.addLayer(marker);
}

window.circle = {};
window.circle.deleteLine = function (e) {
  pointLayerGroup.remove();
  layerGroup.remove();
};

function buildHtml(content) {
  return `<div style='display:block;cursor:pointer;color:#f00'>${content}</div>`;
}

function formatArea(radius) {
  let area = (radius / 1000).toFixed(2) + "k㎡";
  return area;
}

export default { initialize, enable, disable };
