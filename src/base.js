import { MapLoader } from "./loader";
import mitt from "mitt";

import MapConfig from "./conf/map";
import LayerConfig from "./conf/layer";

class Map {
  constructor(config) {
    // 全局的配置文件
    this.config = config || MapConfig.map;
    // 地图挂载的div 接收的是个id
    this.container = null;
    // 地图创建之后的实体
    this.map = null;
    // aqsc地图示例
    this.aqsc = null;
    // 地图的中心点位
    this.pt = null;
    // 地图的图层，以key作为索引存储
    this.layers = {};
    // 地图的事件监听器
    this.emitter = mitt();
  }

  /**
   * 地图挂载创建
   * @param {*} container 地图挂载id
   * @returns
   */
  mount(container) {
    this.container = container;
    this.loadMap();
    return this;
  }

  /**
   * 创建地图
   */
  async loadMap() {
    this.aqsc = await MapLoader(this.config.mapExtra);
    this.pt = new this.aqsc.Point(this.config.mapCenter.lng, this.config.mapCenter.lat);

    if (this.config.intranet) {
      await this.intranet();
    } else {
      await this.normalLoad(this.config.mapType);
    }

    window.aqsc = this.aqsc;
    window.map = this.map;
    window._MAP = this.map.map;

    //    this.addScale()
    this.addZoom();

    this.emitter.emit("mapLoaded");
  }

  /**
   * 一般加载底图
   * @param {*} type 底图类型
   */
  normalLoad(type) {
    const mapType = type.match(/(\S*)\|/)[1];
    const layerType = type.match(/\|(\S*)/)[1];

    if (!LayerConfig.layer[mapType]) {
      throw new Error("错误的地图类型,正确的应为" + Object.keys(LayerConfig.layer));
    }

    if (!LayerConfig.layer[mapType][layerType]) {
      throw new Error("错误的图层类型,正确的应为" + Object.keys(LayerConfig.layer[mapType]));
    }

    this.destroy();

    this.map = new this.aqsc.Map(
      this.container,
      mapType,
      this.pt,
      this.config.mapLevel,
      this.config.mapOptions
    );
    this.map[LayerConfig.layer[mapType][layerType].func](
      this.container,
      layerType === "customId" ? this.config.mapCustomId : layerType
    );
  }

  /**
   * 内网地图加载
   * @param {*} type
   */
  async intranet() {}

  /**
   * 添加地图缩放控件
   */
  addZoom() {
    const zoom = new this.aqsc.Zoom();
    zoom.addToMap();
    zoom.setAnchor("bottomright");

    zoom.setZoomInText("+");
    zoom.setZoomInTitle("放大");
    zoom.zoomOutText("-");
    zoom.zoomOutTitle("缩小");
  }

  /**
   * 添加地图比例控件
   */
  addScale() {
    const scale = new this.aqsc.Scale();
    scale.addToMap();
    scale.setAnchor("bottomright");
    scale.setMaxWidth(100);
    scale.setFeetShow(false);
  }

  /**
   * 地图实例销毁
   */
  destroy() {
    if (this.map) {
      this.map.destroy();
    }

    Object.keys(this.layers).forEach((item) => {
      this.layers[item]?.clear();
    });
  }

  /**
   * 地图缩放到图层可视区域
   * @param {*} currentLayer 计算图层
   */
  setFixView(currentLayer) {
    const sw = currentLayer.layer.getBounds()._southWest;
    const ne = currentLayer.layer.getBounds()._northEast;
    if (sw && ne) {
      const fitBounds = new this.aqsc.Bounds(
        new this.aqsc.Point(sw.lng, sw.lat),
        new this.aqsc.Point(ne.lng, ne.lat)
      );
      this.map.fitBounds(fitBounds);
    }
  }
}

export default Map;
