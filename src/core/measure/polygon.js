import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import "./locale";
import "@/style/index.scss";
import emitter from "@/utils/emitter";

import { nanoid } from "nanoid";

let mapInstance;
let layerGroup;
let drawControl;
let polygonDrawer;

let drawLayer = {};
let currentLayerId = null;

function enable() {
  polygonDrawer = new L.Draw.Polygon(mapInstance, drawControl.options.draw.polygon);
  polygonDrawer.enable();
}

function disable() {
  polygonDrawer?.disable();
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
      polygon: {
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

    let latlng = drawLayer[currentLayerId].shape.getLatLngs()[0];
    if (options.showMarker) {
      addMeasureMarker(latlng);
    }

    emitter.emit("measure.polygon.created", event);
  });
  mapInstance.off(L.Draw.Event.DRAWVERTEX);
}

function addMeasureMarker(latlng) {
  const marker = L.marker(latlng[0], { icon: L.divIcon({ className: "measure-div-icon" }) });
  marker
    .bindTooltip(
      buildHtml(
        `${formatArea(latlng)}<div onclick="polygon.remove('${currentLayerId}')">删除</div>`
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

function formatArea(polygon) {
  var seeArea = L.GeometryUtil.geodesicArea(polygon);
  let area = (seeArea / 10e5).toFixed(2) + "k㎡";
  return area;
}

window.polygon = {};
window.polygon.remove = remove;

export default { initialize, enable, disable, removeAll };
