import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import "./locale";
import "@/style/index.scss";

let mapInstance;
let polygonDrawer;
function enable() {
  polygonDrawer = new L.Draw.Polygon(mapInstance, drawControl.options.draw.polygon);
  polygonDrawer.enable();
}

function disable() {
  polygonDrawer.disable();
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
    let drawlayer = event.layer;
    let latlng = drawlayer.getLatLngs()[0];
    layerGroup.addLayer(drawlayer);
    addMeasureMarker(latlng);
  });
  mapInstance.off(L.Draw.Event.DRAWVERTEX);
}

function addMeasureMarker(latlng) {
  const marker = L.marker(latlng[0], { icon: L.divIcon({ className: "my-div-icon" }) });
  marker
    .bindTooltip(buildHtml(`${formatArea(latlng)}<div onclick="polygon.deleteLine()">删除</div>`), {
      permanent: true,
      direction: "right",
      className: "measure-tooltip",
    })
    .openTooltip();

  pointLayerGroup.addLayer(marker);
}

window.polygon = {};
window.polygon.deleteLine = function (e) {
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
