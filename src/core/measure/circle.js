import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import "./locale";
import "@/style/index.scss";

import emitter from "@/utils/emitter";

import { nanoid } from "nanoid";

let mapInstance;
let layerGroup;
let drawControl;
let circleDrawer;

let drawlayer = {};

let currentLayerId = null;
function enable() {
  circleDrawer = new L.Draw.Circle(mapInstance, drawControl.options.draw.circle);
  circleDrawer.enable();
}

function disable() {
  circleDrawer?.disable();
}

function initialize(instance, options) {
  mapInstance = instance;
  layerGroup = new L.FeatureGroup();
  mapInstance.addLayer(layerGroup);

  // 初始化图层数据
  currentLayerId = nanoid();
  drawlayer[currentLayerId] = {
    point: new L.FeatureGroup(),
    shape: new L.FeatureGroup(),
  };

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
    event.layer.id = currentLayerId;
    drawlayer[currentLayerId].shape = event.layer;
    layerGroup.addLayer(drawlayer[currentLayerId].shape);

    addMeasureMarker(event.layer._mRadius, event.layer._latlng);
    emitter.emit("measure.circle.created", event);
  });
  mapInstance.off(L.Draw.Event.DRAWVERTEX);
}

function addMeasureMarker(radius, latlng) {
  const marker = L.marker(latlng, { icon: L.divIcon({ className: "my-div-icon" }) });
  marker
    .bindTooltip(
      buildHtml(
        `${formatArea(radius)}<div onclick="circle.deleteLine('${currentLayerId}')">删除</div>`
      ),
      {
        permanent: true,
        direction: "right",
        className: "measure-tooltip",
      }
    )
    .openTooltip();

  drawlayer[currentLayerId].point.addLayer(marker);
  drawlayer[currentLayerId].point.addTo(mapInstance);
}

window.circle = {};
window.circle.deleteLine = function (id) {
  Object.keys(drawlayer[id]).forEach((item) => {
    drawlayer[id][item].remove();
  });
};

function buildHtml(content) {
  return `<div style='display:block;cursor:pointer;color:#f00'>${content}</div>`;
}

function formatArea(radius) {
  let area = (radius / 1000).toFixed(2) + "k㎡";
  return area;
}

export default { initialize, enable, disable };
