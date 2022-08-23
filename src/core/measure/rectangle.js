import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import "./locale";
import "@/style/index.scss";

import emitter from "@/utils/emitter";

let mapInstance;
let rectangleDrawer;
function enable() {
  rectangleDrawer = new L.Draw.Rectangle(mapInstance, drawControl.options.draw.rectangle);
  rectangleDrawer.enable();
}

function disable() {
  rectangleDrawer.disable();
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
      rectangle: {
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
        showArea: false,
        ...options,
      },
    },
  });

  mapInstance.off(L.Draw.Event.CREATED).on(L.Draw.Event.CREATED, function (event) {
    let drawlayer = event.layer;
    let latlng = drawlayer.getLatLngs()[0];
    layerGroup.addLayer(drawlayer);
    addMeasureMarker(latlng, drawlayer.getCenter());
  });
  mapInstance.off(L.Draw.Event.DRAWVERTEX);
}

function addMeasureMarker(latlng, center) {
  const marker = L.marker(center, { icon: L.divIcon({ className: "my-div-icon" }) });
  marker
    .bindTooltip(
      buildHtml(`${formatArea(latlng)}<div onclick="rectangle.deleteLine()">删除</div>`),
      {
        permanent: true,
        direction: "right",
        className: "measure-tooltip",
      }
    )
    .openTooltip();

  pointLayerGroup.addLayer(marker);
}

window.rectangle = {};
window.rectangle.deleteLine = function (e) {
  pointLayerGroup.remove();
  layerGroup.remove();
};

function buildHtml(content) {
  return `<div style='display:block;cursor:pointer;color:#f00'>${content}</div>`;
}

function formatArea(polygon) {
  var seeArea = L.GeometryUtil.geodesicArea(polygon);
  let area = (seeArea / 10e5).toFixed(2) + "k㎡";
  return area;
}

export default { initialize, enable, disable };