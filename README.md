<h1 align="center">  
  Leaflet-Map  
</h1>  
<p align="center">  
  <strong>基于Leaflet.js二次封装，做一些微小的工作</strong><br>  
  高德，天地图，谷歌等瓦片底图⭐，常用地图坐标系偏移修正⭐，天地图web服务调用，geoserver图层加载
</p>  

### 使用前

因为是基于Leaflet的二次封装，必须先熟练掌握Leaflet的使用

### 安装

```  
npm i @osdiot/leaflet-map  
```

### 开始使用

#### 导入包文件

```js  
import { map as drawMap, utils } from  "@osdiot/leaflet-map"
```  

`drawMap` 是地图核心模块，提供了地图初始化加载，以及其他一些地图相关的方法

#### 创建地图容器

```html
 <div id="map"></div>
``` 

`id`的命名按照`html`规范即可，可以设置为其他名称，例如：`osd-map`,`map-instance` 内置默认的容器id是`map`

创建好地图容器之后，需要给地图容器赋予样式，定宽定高，例如

```css
#map {
    width:800px;
    height:800px;
}
``` 

#### 创建配置文件

```js 
const mapConfig = {
  map: {
    container: "map", // 地图容器id
    type: "GaoDe.Normal.Map", // 地图类型
    center: [31.820591, 117.227219], // 默认中心坐标点
    zoom: 12, // 默认缩放
    preferCanvas: true, // 是否使用canvas加载
    minZoom: 6, // 最小缩放级别
    maxZoom: 18, // 最大缩放级别
    key: "6cb11577e3ac27bbe015669e413f6cc4", // 天地图秘钥
  },
  control: {
    addAttribution: {
      enable: false, // 是否开启水印
    },
    zoom: {
      enable: false, // 是否开启缩放组件
    },
  },
};
``` 

#### 加载地图

这里以`Vue3`项目为例，地图实例需要在`onMounted`生命周期之后创建

```js
import { onMounted } from "vue";
let gisMap = null

onMounted(() => {
    // 创建地图实例
    const gisMap = drawMap.createMap(mapConfig);
    // 加载地图底图
    drawMap.addPresetTileLayer(mapConfig);
})
``` 

至此，地图的初始化加载已经完成

### 配置说明

#### 底图

地图使用了`leaflet.ChineseTmsProviders`插件，所以配置是继承了该插件的使用，[项目地址](https://github.com/htoooth/Leaflet.ChineseTmsProviders)

其中`providers` 对应的就是上面地图配置的`type` [文档地址](https://github.com/htoooth/Leaflet.ChineseTmsProviders#providers)

在该插件的基础上，还新增了高德一种简化要素的类型地图，类型为`GaoDe.Brief.Map`

#### 配置文件

`mapConfig.map` 这里可以传入除自身配置之外,`Leaflet Map`所提供的所有配置参数，内部对参数传递做了一个合并

`mapConfig.control` 这里是对地图控制组件的参数配置，目前只提供了水印图和缩放组件配置，继承`Leaflet Control`配置


### API

#### map

| 方法名                        | 返回值 | 描述                                  |
| :---------------------------- | :----- | :------------------------------------ |
| createMap(`options`)          | -      | 创建地图实例 `options` 是地图配置参数 |
| addPresetTileLayer(`options`) | -      | 加载地图底图 `options` 是地图配置参数 |
| setFixView 暂未实现           | -      | 使地图缩放到适合大小                  |

#### map.layer

| 方法名                           | 返回值        | 描述                                                         |
| :------------------------------- | :------------ | :----------------------------------------------------------- |
| getGeoJson(`options`)            | Promise(json) | 获取geosever的geojson数据                                    |
| createWFSLayer(`options`,`data`) | geoJsonLayer  | 创建WFS图层  `options`是L.geojson 参数  `data` 是geojson数据 |
| createWMSLayer(`options`)        | tileLayer     | 创建WMS图层  `options`是L.tileLayer.wms 参数                 |

#### map.service

| 方法名                       | 返回值        | 描述                                                                                                                                              |
| :--------------------------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| localSearch(`map`,`options`) | Promise(data) | POI位置搜索（基于[天地图地名搜索2.0](http://lbs.tianditu.gov.cn/server/search2.html)）`map` 是地图实例对象，`options` 是天地图该api的所需配置参数 |
| getLocation(`options`)       | -             | 地理位置解析经纬度 基于[地理位置解析查询](http://lbs.tianditu.gov.cn/server/geocodinginterface.html)   `options` 是天地图该api的所需配置参数      |
| getPoint(`options`)          | -             | 逆地理位置解析 基于[逆地理编码查询](http://lbs.tianditu.gov.cn/server/geocoding.html)    `options` 是天地图该api的所需配置参数                    |
| getLocationByIp()            | Promise(data) | 根据IP获取地理位置                                                                                                                                |