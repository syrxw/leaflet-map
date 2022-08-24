import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import "./locale";
import "@/style/index.scss";
import emitter from "@/utils/emitter";

import { nanoid } from "nanoid";

let mapInstance;
let layerGroup;
let drawControl;
let polylineDrawer;

let drawLayer = {};
let currentLayerId = null;

function enable() {
  polylineDrawer = new L.Draw.Polyline(mapInstance, drawControl.options.draw.polyline);
  polylineDrawer.enable();
}

function disable() {
  polylineDrawer?.disable();
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
      polyline: {
        icon: new L.DivIcon({
          iconSize: new L.Point(8, 8),
          className: "leaflet-div-icon leaflet-editing-icon measure-icon",
        }),
        shapeOptions: {
          stroke: true,
          color: "#f40",
          weight: 4,
          opacity: 1,
          fill: false,
          clickable: true,
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
      setTimeout(() => {
        addMeasureEndMarker();
      }, 0);
    }

    emitter.emit("measure.polyline.created", event);
  });

  mapInstance.off(L.Draw.Event.DRAWVERTEX).on(L.Draw.Event.DRAWVERTEX, function (event) {
    if (options.showMarker) {
      addMeasureMarker(event.layers);
    }
  });
}

function addMeasureMarker(layerGroup) {
  let lines = [];

  layerGroup.eachLayer((e) => {
    lines.push(e.getLatLng());

    let content = lines.length <= 1 ? buildHtml("起点") : buildHtml(formatLength(lines));
    e.bindTooltip(content, {
      permanent: true,
      direction: "right",
      className: "measure-tooltip",
    }).openTooltip();
  });

  drawLayer[currentLayerId].point = layerGroup;
}

function addMeasureEndMarker() {
  let i = 0;
  let lines = [];

  const point = drawLayer[currentLayerId].point;
  if (point) {
    point.eachLayer((e) => {
      i += 1;
      lines.push(e.getLatLng());
      if (i === Object.keys(point.getLayers()).length) {
        e.setTooltipContent(
          buildHtml(
            "共" +
              formatLength(lines) +
              "<div onclick='polyline.remove(\"" +
              currentLayerId +
              "\")'>删除</div>"
          )
        );
      }
    });
  }

  mapInstance.addLayer(point);
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

function formatLength(line) {
  let dis = 0;
  for (let i = 0; i < line.length - 1; i++) {
    let start = line[i];
    let end = line[i + 1];
    dis += L.latLng([start.lat, start.lng]).distanceTo([end.lat, end.lng]);
  }
  return `${(dis / 10e2).toFixed(2)}km`;
}

window.polyline = {};
window.polyline.remove = remove;

export default { initialize, enable, disable, removeAll };
