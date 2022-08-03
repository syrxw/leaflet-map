import Map from "./base";
import MapLayerType from "./conf/layer";
import request from "./utils/request";
class MapDraw extends Map {
  constructor(config) {
    super(config);
  }

  /**
   * 创建渲染图层
   * @param {*} options 图层参数
   * @param {*} isPure 是否虚拟生成图层信息
   */
  createLayer(options, isPure) {
    this.layers[options.id] = {
      name: options.name, // 图层名称
      lenged: options.lenged, // 图层图例
      type: options.type, // 图层类型[lineString,point,ployon]
      style: options.style, // 图层装配样式
      isShow: true, // 是否展示
      renderData: options.renderData || [], // 渲染数据
      renderFunc: options.renderFunc, // 渲染函数
      layer: isPure ? options.layer : null,
    };

    if (!isPure) {
      this.layers[options.id].layer = new this.aqsc.Layer(options.type, options.name);
      this.layers[options.id].layer.setLayerIndex(Object.keys(this.layers).length + 1);
      this.map.addLayer(this.layers[options.id].layer);
    }
  }

  /**
   * 创建WFS图层
   * @param {Object} options
   */
  async createWFSLayer(options) {
    // 向geoserver请求数据
    let params = {
      service: "WFS",
      version: "1.1.0",
      request: "GetFeature",
      typeName: options.layer,
      outputFormat: "application/json",
      srsName: options.epsg,
      ...options,
    };
    // /geoserver/gis/ows
    const url = options.url;
    const u = url + window.L.Util.getParamString(params, url);
    const data = await request.get(u);

    const wfsLayer = new window.L.geoJson(data, {
      style: { ...options.style, renderer: window.L.canvas() },
      onEachFeature: () => {},
    });
    wfsLayer.addTo(this.map.map);

    // 请求回来的数据是geojson  用leaflet的geojson方法进行渲染
    this.createLayer(
      {
        id: options.layer,
        name: options.name,
        type: MapLayerType.type.WFS,
        renderData: [],
        renderFunc: null,
        style: options.style,
        layer: wfsLayer,
      },
      true
    );
  }

  /**
   * 创建WMS图层
   * @param {Object} options
   */
  async createWMSLayer(options) {
    // /api/geoserver/gis/wms
    const config = {
      layers: options.layer,
      format: "image/png",
      transparent: true,
      ...options,
    };
    if (options.crs) config.crs = options.crs;
    const wmsLayer = window.L.tileLayer.wms(options.url, config);
    wmsLayer.addTo(this.map);

    this.createLayer(
      {
        id: options.layer,
        name: options.name,
        type: MapLayerType.type.WMS,
        renderData: [],
        renderFunc: null,
        style: options.style,
        layer: wmsLayer,
      },
      true
    );
  }

  /**
   * 创建右键菜单
   * @param {*} data 右键菜单数据
   */
  createRightMenu(data) {
    const rightMenu = new this.aqsc.ContextRightMenu();
    data.map((item) => {
      let rightMenuItem = new this.aqsc.CustomRightMenuItem(
        item.name,
        (e) => {
          item.callback(e);
        },
        item.options
      );
      rightMenu.addItem(rightMenuItem);
    });
    this.map.addContextRightMenu(rightMenu);
  }

  /**
   * 创建图片类型的点位
   * @param {Object} data
   * @returns
   */
  createImgPoint(data) {
    let point = new this.aqsc.Point(...data.point);
    let markerPoint = new this.aqsc.MarkerCustomImg(point, {
      ...data.options,
      imagePath: data.options.imagePath || "aqsc/images/marker-icon.png",
    });
    return markerPoint;
  }

  /**
   * 渲染图层上的数据
   * @param {String} layerId
   */
  renderLayerById(layerId) {
    const layer = this.layers[layerId];
    if (layer.renderData.length > 0) {
      layer.renderFunc(layer.renderData);
    }
  }
}

export default MapDraw;
