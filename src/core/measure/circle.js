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

let drawLayer = {};
let currentLayerId = null;

function enable() {
  circleDrawer = new L.Draw.Circle(mapInstance, drawControl.options.draw.circle);
  circleDrawer.enable();
}

function disable() {
  circleDrawer?.disable();
}

function initialize(instance, options = { showMarker: false }) {
  mapInstance = instance;

  layerGroup = new L.FeatureGroup();
  mapInstance.addLayer(layerGroup);

  // 初始化图层数据
  currentLayerId = nanoid();
  drawLayer[currentLayerId] = {
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
    drawLayer[currentLayerId].shape = event.layer;
    layerGroup.addLayer(drawLayer[currentLayerId].shape);

    if (options.showMarker) {
      addMeasureMarker(event.layer.getRadius(), event.layer.getLatLng());
    }

    emitter.emit("measure.circle.created", event);
  });
  mapInstance.off(L.Draw.Event.DRAWVERTEX);
}

function addMeasureMarker(radius, latlng) {
  const marker = L.marker(latlng, { icon: L.divIcon({ className: "measure-div-icon" }) });
  marker
    .bindTooltip(
      buildHtml(
        `${formatArea(radius)}<div onclick="circle.remove('${currentLayerId}')">删除</div>`
      ),
      {
        permanent: true,
        direction: "right",
        className: "measure-tooltip",
      }
    )
    .openTooltip();

  drawLayer[currentLayerId].point.addLayer(marker);
  drawLayer[currentLayerId].point.addTo(mapInstance);
}

function remove(id) {
  Object.keys(drawLayer[id]).forEach((item) => {
    drawLayer[id][item].remove();
  });
}

function removeAll() {
  Object.keys(drawLayer).forEach((item) => {
    Object.keys(drawLayer[item]).forEach((sitem) => {
      drawLayer[item][sitem].remove();
    });
  });
}

function buildHtml(content) {
  return `<div style='display:block;cursor:pointer;color:#f00'>${content}</div>`;
}

function formatArea(radius) {
  let area = (Math.PI * Math.pow(radius / 1000, 2)).toFixed(2) + "k㎡";
  return area;
}

window.circle = {};
window.circle.remove = remove;

export default { initialize, enable, disable, removeAll };
