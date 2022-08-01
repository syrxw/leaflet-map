/**
 * @功能描述:plotting
 * @author: CLS
 * @date: 14:09 2019/5/2
 * @requires L-src.js
 */

/**
 * Aqsc.Plot简单标绘基类
 */
Aqsc.Plot = L.Class.extend({
    options: {
        isEdit: false,
        centerText: "",
        centerTextStyle: {},
        editIcon: true,
        editSize: new Aqsc.Size(8, 8),
        layerStyle: {
            color: "#FF7B09",
            fill: true,
            fillColor: null,
            fillOpacity: 0.2,
            opacity: 0.5,
            renderer: L.svg()
        },
        deleteIcon: L.icon({
            iconUrl: "deleteIcon.png",
            iconSize: [16, 16]
        })
    },
    initialize: function (map, type, options) {
        options = options || {}
        //为markerImg,markerIcon,img时
        if (typeof type === "object") {
            this.isEdit = type.isEdit == true ? type.isEdit : this.options.isEdit
            this.editIcon = this.options.editIcon
            //删除图标路径
            if (type.deleteIconPath) {
                this.options.deleteIcon.options.iconUrl = type.deleteIconPath
            } else {
                //判断路径
                if (this.options.deleteIcon.options.iconUrl.indexOf("http") == -1) {
                    this.options.deleteIcon.options.iconUrl =
                        Aqsc.Util.getBaseImgPath() + this.options.deleteIcon.options.iconUrl
                }
            }
        } else {
            //为线面
            //编辑属性
            this.isEdit = options.isEdit == true ? options.isEdit : this.options.isEdit
            this.editIcon = this.options.editIcon
            //删除图标路径
            if (options.deleteIconPath) {
                this.options.deleteIcon.options.iconUrl = options.deleteIconPath
            } else {
                //判断路径
                if (this.options.deleteIcon.options.iconUrl.indexOf("http") == -1) {
                    this.options.deleteIcon.options.iconUrl =
                        Aqsc.Util.getBaseImgPath() + this.options.deleteIcon.options.iconUrl
                }
            }
            this.type = type
        }
        //获取map对象
        if (map.map) {
            //安全生产gis平台
            this.map = map.map
        } else {
            //leaflet平台
            this.map = map
        }
        //必须用svg渲染，cavas适合大量点渲染
        if (options.style) {
            options.style.renderer = L.svg()
        } else {
            options.style = {
                renderer: L.svg()
            }
        }
        this.AqscMap = map
        this.draw = null // 绘制对象
        this.isCreate = false // 图形是否双击创建
        this.isDrawedIntersect = false // 图形是否应用空间查询
        this.isEditDisabled = false // 是否取消编辑
        this.editSize = this.options.editSize
        this.layerStyle = null // set图形style
        this.isClickListener = false //是否点击图形监听
        this.editMouseout = false // 是否移除图形
        this.style = options.style // 初始化属性style
        this.guid = Aqsc.Util.guid()
    },
    setMarkerImg: function (path, size) {
        // Children override
    },
    setMarkerIcon: function (options) {
        // Children override
    },
    setImg: function (options) {
        // Children override
    },
    setRadius: function (radius) {
        this.drawRadius = radius
    },
    getRadius: function () {
        // Children override
        return this.drawRadius
    },
    /**
     * 添加监听事件
     * @param {String} type
     * @param {Object} fun
     * @param {Object} Mix
     */
    addEventListener: function (type, fun, Mix) {
        var tmp = this
        if (tmp.shape) {
            tmp.shape.addEventListener(type, function (p) {
                p.sourceTarget = tmp
                fun(p)
            })
        } else {
            //图形未绘制
            if (tmp.isEnable) {
                confirm("等图形绘制成功后再添加监听事件！")
            }
            //切换到另外一种绘制无反应
        }
    },
    /**
     * 移除监听事件
     * @param {String} type
     */
    removeEventListener: function (type) {
        if (this.shape) {
            this.shape.removeEventListener(type)
        }
    },
    /**
     * 绘制成功事件
     * @param {Object} fun
     */
    onDrawSucceeded: function (fun) {
        var tmp = this
        //未知原因绘制成功监听事件会促发两次
        tmp.map.addEventListener("draw:created_p", function (event) {
            if (!tmp.isCreate) {
                //双击绘制成功后，注册此事件
                tmp.isCreate = true
                event.sourceTarget = tmp
                if (event.layer.toGeoJSON) {
                    event.geojson = event.layer.toGeoJSON()
                }
                fun(event)
            }
        })
    },
    /**
     * 编辑成功事件
     * @param {Object} fun
     */
    onEditSucceeded: function (fun) {
        var tmp = this
        //未知原因绘制成功监听事件会促发两次
        //线和面
        switch (tmp.type) {
            case "polyline":
            case "polygon":
                //线和面
                tmp.map.addEventListener(L.Draw.Event.EDITVERTEX, function (event) {
                    //if(tmp.guid == (event.shape)?event.shape.guid:-1){
                    if (tmp.guid == event.poly.guid) {
                        // event.sourceTarget = tmp;
                        //TODO 没有输出geojson
                        /*if(event.poly.toGeoJSON){
							event.geojson = event.poly.toGeoJSON();
						}*/
                        fun(tmp)
                    }
                })
                break
            case "circle":
            case "rectangle":
            case "rectangle1":
                //圆
                tmp.map.addEventListener(L.Draw.Event.EDITRESIZE, function (event) {
                    if (tmp.guid == event.shape ? event.shape.guid : -1) {
                        event.sourceTarget = tmp
                        console.log("ininin")
                        //TODO 没有输出geojson
                        /*if(event.poly.toGeoJSON){
							event.geojson = event.poly.toGeoJSON();
						}*/
                        fun(tmp)
                    }
                })
                tmp.map.addEventListener(L.Draw.Event.EDITMOVE, function (event) {
                    if (tmp.guid == event.shape ? event.shape.guid : -1) {
                        event.sourceTarget = tmp
                        console.log("ononono")
                        //TODO 没有输出geojson
                        /*if(event.poly.toGeoJSON){
							event.geojson = event.poly.toGeoJSON();
						}*/
                        fun(tmp)
                    }
                })
                break
            default:
                //点
                tmp.map.addEventListener(L.Draw.Event.EDITMOVE, function (event) {
                    if (tmp.guid == event.shape ? event.shape.guid : -1) {
                        // event.sourceTarget = tmp;
                        //TODO 没有输出geojson
                        /*if(event.poly.toGeoJSON){
							event.geojson = event.poly.toGeoJSON();
						}*/
                        fun(tmp)
                    }
                })
                break
        }
    },
    /**
     * 删除成功
     * @param {Object} fun
     */
    onDeleteSucceeded: function (fun) {
        var tmp = this
        //未知原因绘制成功监听事件会促发两次
        tmp.map.addEventListener("deletePlotShape", function (event) {
            if (tmp.guid == event.shape.guid) {
                event.sourceTarget = tmp
                fun(event)
            }
            //TODO 没有输出geojson
            //			if(event.poly.toGeoJSON){
            //				event.geojson = event.poly.toGeoJSON();
            //			}else{
            //				event.geojson = event.layer.toGeoJSON();
            //			}
        })
    },
    //	toGeoJSON:function(){
    //		if(tmp.isEnable){
    //			alert("图形尚未绘制！");
    //		}else{
    //			return this.shape.toGeoJSON();
    //		}
    //	},
    _refreshMap: function (tmp) {
        tmp.map.panTo([tmp.map.getCenter().lat, tmp.map.getCenter().lng])
        tmp.map.setZoom(tmp.map.getZoom())
    },
    /**
     * 创建marker
     * @param {Object} latlng
     * @param {Object} icon
     */
    _createMarker: function (latlng, icon) {
        var marker = null
        if (icon) {
            marker = new L.Marker(latlng, {
                icon: icon,
                zIndexOffset: this.options.zIndexOffset * 2
            })
        } else {
            marker = new L.Marker(latlng, {
                icon: this.options.icon,
                zIndexOffset: this.options.zIndexOffset * 2
            })
        }

        this.map.addLayer(marker)

        return marker
    },
    /**
     * 将经纬度坐标转换为像素坐标，对像素坐标做偏移，在转换为经纬度坐标返回
     * @param {Array} cornerLatlng
     * @param {Number} x 偏移
     * @param {Number} y 偏移
     */
    _translate: function (cornerLatlng, x, y) {
        var layerPt = this.map.latLngToLayerPoint(L.latLng(cornerLatlng[0], cornerLatlng[1]))
        layerPt.x = layerPt.x + x
        layerPt.y = layerPt.y - y
        var latLng = this.map.layerPointToLatLng(layerPt)
        return latLng
    },
    /**
     * 地图缩放后重新设置图形删除点的位置
     * @param {Object} tmp
     */
    _zoomEnd: function (tmp) {
        tmp.map.on("zoomend", function () {
            if (tmp.isClickListener) {
                switch (tmp.type) {
                    //因为点有text部分,其他图形没有text部分,故暂时可以不用设置
                    case "markerImgPt":
                    case "markerIconPt":
                    case "markerNamePt":
                        var latLng_moveEnd = tmp._translate(
                            [tmp.shape.getLatLng().lat, tmp.shape.getLatLng().lng],
                            30,
                            30
                        )
                        tmp.deleteMarker.setLatLng(latLng_moveEnd)
                        break
                    default:
                        break
                }
            }
        })
    },
    _edit: function (tmp) {
        tmp.shape.on("click", function () {
            if (!tmp.isClickListener && tmp.isEdit) {
                tmp._zoomEnd(tmp)
                //添加编辑效果
                tmp.edit.addHooks()
                tmp.isEditDisabled = false
                //添加删除点
                var latLng = null
                switch (tmp.type) {
                    case "markerImgPt":
                    case "markerIconPt":
                        //					case "markerNamePt":
                        //						if(tmp.type == "markerNamePt"){
                        //							tmp.shape.setRadius(0);
                        //						}
                        //删除点位置 x，y偏移30，30
                        latLng = tmp._translate([tmp.shape.getLatLng().lat, tmp.shape.getLatLng().lng], 30, 30)
                        //移动后，更改删除图标位置
                        tmp.shape.on("dragend", function (e) {
                            if (tmp.deleteMarker) {
                                var drag_latLng = tmp._translate([e.target._latlng.lat, e.target._latlng.lng], 30, 30)
                                var nameMarker_latLng = tmp._translate(
                                    [e.target._latlng.lat, e.target._latlng.lng],
                                    5,
                                    0
                                )
                                tmp.deleteMarker.setLatLng(drag_latLng)
                                var setNameLatLng = tmp.nameMarker ? tmp.nameMarker.setLatLng(nameMarker_latLng) : null
                                tmp._refreshMap(tmp)
                            }
                            //闪动动画
                            //移除闪动动画——主动绘制
                            if (tmp.pluse) {
                                tmp.pluse.setLatLng([e.target._latlng.lat, e.target._latlng.lng])
                                // tmp.shape.pluse.setLatLng([e.target._latlng.lat, e.target._latlng.lng]);
                            }
                            //移除闪动动画——加载json
                            if (tmp.shape.pluse) {
                                tmp.shape.pluse.setLatLng([e.target._latlng.lat, e.target._latlng.lng])
                            }
                            // 缓冲区存在
                            if (tmp.bufferShape) {
                                tmp.bufferShape.remove()
                                var buffered = turf.buffer(tmp.shape.toGeoJSON().geometry, tmp.bufferRadius, {
                                    units: "meters"
                                })
                                tmp.bufferShape = L.geoJSON(buffered, {
                                    style: function (feature) {
                                        return tmp.bufferStyle
                                    }
                                }).addTo(tmp.map)
                            }
                        })
                        break
                    case "polyline":
                        latLng = tmp._translate(
                            [
                                tmp.shape._latlngs[tmp.shape._latlngs.length - 1].lat,
                                tmp.shape._latlngs[tmp.shape._latlngs.length - 1].lng
                            ],
                            30,
                            30
                        )
                        tmp.edit._verticesHandlers[0]._markers[tmp.edit._verticesHandlers[0]._markers.length - 1].on(
                            "dragend",
                            function (e) {
                                if (tmp.deleteMarker) {
                                    var ll =
                                        tmp.edit._verticesHandlers[0]._markers[
                                            tmp.edit._verticesHandlers[0]._markers.length - 1
                                        ].getLatLng()
                                    var drag_latLng = tmp._translate([ll.lat, ll.lng], 30, 30)
                                    tmp.deleteMarker.setLatLng(drag_latLng)
                                }
                            }
                        )
                        break
                    case "polygon":
                        latLng = tmp._translate(
                            [
                                tmp.shape._latlngs[0][tmp.shape._latlngs[0].length - 1].lat,
                                tmp.shape._latlngs[0][tmp.shape._latlngs[0].length - 1].lng
                            ],
                            30,
                            30
                        )
                        for (var key in tmp.edit._markerGroup._layers) {
                            if (tmp.edit._markerGroup._layers.hasOwnProperty(key)) {
                                tmp.edit._markerGroup._layers[key].on("dragend", function (e) {
                                    if (tmp.deleteMarker) {
                                        var ll = tmp.edit._markerGroup._layers[key].getLatLng()
                                        var drag_latLng = tmp._translate([ll.lat, ll.lng], 30, 30)
                                        tmp.deleteMarker.setLatLng(drag_latLng)
                                    }
                                })
                            }
                        }
                        break
                    case "circle":
                        latLng = tmp._translate(
                            [tmp.edit._resizeMarkers[0].getLatLng().lat, tmp.edit._resizeMarkers[0].getLatLng().lng],
                            30,
                            30
                        )
                        tmp.edit._resizeMarkers[0].on("dragend", function (e) {
                            if (tmp.deleteMarker) {
                                var drag_latLng = tmp._translate([e.target._latlng.lat, e.target._latlng.lng], 30, 30)
                                tmp.deleteMarker.setLatLng(drag_latLng)
                            }
                        })
                        tmp.edit._moveMarker.on("dragend", function (e) {
                            if (tmp.deleteMarker) {
                                var ll = tmp.edit._resizeMarkers[0].getLatLng()
                                var drag_latLng = tmp._translate([ll.lat, ll.lng], 30, 30)
                                tmp.deleteMarker.setLatLng(drag_latLng)
                            }
                        })
                        break
                    case "rectangle":
                    case "rectangle1":
                        latLng = tmp._translate(
                            [
                                tmp.shape._latlngs[0][tmp.shape._latlngs[0].length - 1].lat,
                                tmp.shape._latlngs[0][tmp.shape._latlngs[0].length - 1].lng
                            ],
                            30,
                            30
                        )
                        tmp.edit._resizeMarkers[0].on("dragend", function (e) {
                            if (tmp.deleteMarker) {
                                var ll = tmp.edit._resizeMarkers[2].getLatLng()
                                var drag_latLng = tmp._translate([ll.lat, ll.lng], 30, 30)
                                tmp.deleteMarker.setLatLng(drag_latLng)
                            }
                        })
                        tmp.edit._resizeMarkers[1].on("dragend", function (e) {
                            if (tmp.deleteMarker) {
                                var ll = tmp.edit._resizeMarkers[2].getLatLng()
                                var drag_latLng = tmp._translate([ll.lat, ll.lng], 30, 30)
                                tmp.deleteMarker.setLatLng(drag_latLng)
                            }
                        })
                        tmp.edit._resizeMarkers[2].on("dragend", function (e) {
                            if (tmp.deleteMarker) {
                                var ll = tmp.edit._resizeMarkers[2].getLatLng()
                                var drag_latLng = tmp._translate([ll.lat, ll.lng], 30, 30)
                                tmp.deleteMarker.setLatLng(drag_latLng)
                            }
                        })
                        tmp.edit._resizeMarkers[3].on("dragend", function (e) {
                            if (tmp.deleteMarker) {
                                var ll = tmp.edit._resizeMarkers[2].getLatLng()
                                var drag_latLng = tmp._translate([ll.lat, ll.lng], 30, 30)
                                tmp.deleteMarker.setLatLng(drag_latLng)
                            }
                        })
                        tmp.edit._moveMarker.on("dragend", function (e) {
                            if (tmp.deleteMarker) {
                                var ll = tmp.edit._resizeMarkers[2].getLatLng()
                                var drag_latLng = tmp._translate([ll.lat, ll.lng], 30, 30)
                                tmp.deleteMarker.setLatLng(drag_latLng)
                            }
                        })
                        break
                    default:
                        break
                }
                // 显示标绘删除图标
                tmp.deleteMarker = tmp._createMarker(latLng, tmp.options.deleteIcon)
                tmp.deleteMarker.addTo(tmp.map)
                // 判断标绘删除图标显示属性
                if (tmp.editIcon) {
                    tmp.deleteMarker.setOpacity(1)
                } else {
                    tmp.deleteMarker.setOpacity(0)
                }
                //点击删除图标后
                tmp.deleteMarker.on("click", function () {
                    //添加注册事件
                    tmp.map.fire("deletePlotShape", {
                        shape: tmp.shape
                    })
                    //移除闪动动画——主动绘制
                    if (tmp.pluse) {
                        tmp.map.removeLayer(tmp.pluse)
                    }
                    //移除闪动动画——加载json
                    if (tmp.shape.pluse) {
                        tmp.map.removeLayer(tmp.shape.pluse)
                    }
                    //移除编辑点
                    tmp.edit.removeHooks()
                    //移除删除点
                    tmp.map.removeLayer(tmp.deleteMarker)
                    //移除图形
                    tmp.map.removeLayer(tmp.shape)
                    //当为imgMarker,IconMarker
                    if (tmp.nameMarker) {
                        tmp.map.removeLayer(tmp.nameMarker)
                        tmp._refreshMap(tmp)
                    }
                    //若缓冲区存在
                    if (tmp.bufferShape) {
                        tmp.map.removeLayer(tmp.bufferShape)
                    }
                    tmp.shape.centerText ? tmp.shape.centerText.remove() : null // 图形中心点名字
                })
                tmp.isClickListener = true
                tmp.editMouseout = false
            }
        })
        //移出图形
        tmp.shape.on("mouseout", function (e) {
            //移除图形后点击地图
            tmp.map.addEventListener("click", function (e1) {
                if (tmp.editMouseout && tmp.edit) {
                    try {
                        //移除编辑效果
                        if (!tmp.isEditDisabled) {
                            tmp.edit.removeHooks()
                        }
                        tmp.isEditDisabled = true
                        //移除删除点
                        if (tmp.deleteMarker) {
                            tmp.map.removeLayer(tmp.deleteMarker)
                        }
                    } catch (err) {
                        //console.log("清除标绘图形异常！");
                    }
                    tmp.isClickListener = false
                }
            })
            tmp.editMouseout = true
        })
        //移动到图形
        tmp.shape.on("mouseover", function (e) {
            tmp.editMouseout = false
        })
    },
    enable: function () {
        this.draw.addHooks(false)
        this.isEnable = true
    },
    disable: function () {
        this.draw.removeHooks()
        this.map.removeEventListener("dblclick")
        this.map.removeEventListener("draw:created_p")
        this.isEnable = false
    },
    setStyle: function (style) {
        this.layerStyle = Aqsc.Util.mergeProperty(this.layerStyle, style)
        if (this.shape) {
            this.shape.setStyle(style)
        }
    },
    getStyle: function () {
        if (this.shape) {
            return this.layerStyle
        } else {
            return "this.shape未初始化！"
        }
    },
    /**
     * 设置编辑点像素大小
     */
    setEditNodeSize: function (size) {
        this.editSize = size
    },
    /**
     * 设置编辑点像素大小
     */
    _setEditNodeSize: function () {
        //TODO
    },
    /**
     * 移除对象
     */
    remove: function () {
        try {
            this.pluse ? this.map.removeLayer(this.pluse) : null //移除闪动动画——主动绘制
            this.shape.pluse ? this.map.removeLayer(this.shape.pluse) : null //移除闪动动画——加载json
            this.edit ? this.edit.removeHooks() : null //移除编辑点
            this.deleteMarker ? this.map.removeLayer(this.deleteMarker) : null //移除删除点
            this.shape ? this.shape.remove() : null // 绘制的图形
            this.bufferShape ? this.bufferShape.remove() : null // 缓冲区
            this.nameMarker ? this.nameMarker.remove() : null // 图形名字
            this.shape.centerText ? this.shape.centerText.remove() : null // 图形中心点名字
            this._refreshMap(this) // 刷新底图
        } catch (err) {
            console.log(err)
        }
    }
})

/**
 * Aqsc.PlotShapeEdit线面表标绘编辑类
 */
Aqsc.PlotShapeEdit = L.Class.extend({
    initialize: function (map, shape, type) {
        var plotShape = new Aqsc.PlotShape(map, type, { isEdit: true })
        if (type == "polyline") {
            plotShape.shape = shape
            plotShape.shape.type = type
            plotShape.edit = new L.Edit.Poly(shape)
            plotShape._edit2(plotShape)
            plotShape.disable()
        }
        // switch (type){
        //     case "polyline":
        //         plotShape.shape = shape;
        //         plotShape.shape.type = type;
        //         plotShape.edit = new L.Edit.Poly(shape);
        //         plotShape._edit2(plotShape);
        //         plotShape.disable();
        //         break;
        //     default:
        //         break;
        // }
    }
})

/**
 * Aqsc.PlotShape线面表标绘类
 */
Aqsc.PlotShape = Aqsc.Plot.extend({
    initialize: function (map, type, options) {
        Aqsc.Plot.prototype.initialize.apply(this, arguments)
        this.type = type // 绘制类型
        var tmp = this
        switch (tmp.type) {
            case "polyline_0":
                tmp.draw = new L.Draw.Polyline(tmp.map, {
                    shapeOptions: {
                        stroke: true,
                        color: "red",
                        weight: 4,
                        opacity: 0.5,
                        fill: false,
                        clickable: true
                    },
                    tooltip: {
                        start: "点击地图开始量测,再次点击结束量测",
                        cont: "点击结束量测",
                        end: "双击结束绘制线" // 点击最后一个点结束绘制线
                    },
                    keyType: 1 // 绘制类型 在控件中有个绘制控件，以此来区别 0为控件，1为绘制类
                })
                tmp.draw.count = 0
                tmp.map.addEventListener("click", function (e) {
                    if (tmp.draw.count == 1) {
                        tmp.map.removeLayer(tmp.draw._poly)
                        tmp.draw._polyline = new L.Polyline(tmp.draw._poly._latlngs, tmp.style)
                        tmp.draw._polyline.addTo(tmp.map)
                        tmp.shape = tmp.draw._polyline
                        tmp.shape.type = tmp.type
                        tmp.shape.guid = tmp.guid

                        // 偏移30px
                        var latLng = tmp._translate(
                            [tmp.draw._poly._latlngs[1].lat, tmp.draw._poly._latlngs[1].lng],
                            45,
                            -10
                        )
                        var pt1 = new Aqsc.Point(tmp.draw._poly._latlngs[0].lng, tmp.draw._poly._latlngs[0].lat)
                        var pt2 = new Aqsc.Point(tmp.draw._poly._latlngs[1].lng, tmp.draw._poly._latlngs[1].lat)
                        var dis = pt1.distanceTo(pt2)
                        if (dis > 1000) {
                            dis = (dis / 1000).toFixed(2) + "公里"
                        } else {
                            dis = dis.toFixed(2) + "米"
                        }
                        tmp.nameMarker = new Aqsc.Text(new Aqsc.Point(latLng.lng, latLng.lat), dis + "", {
                            color: "blue",
                            rightDelete: true
                        })
                        tmp.nameMarker.T.addTo(tmp.map)
                        /*缓冲区设置 start*/
                        if (tmp.bufferRadius) {
                            var buffered = turf.buffer(tmp.shape.toGeoJSON().geometry, tmp.bufferRadius, {
                                units: "meters"
                            })
                            tmp.bufferShape = L.geoJSON(buffered, {
                                style: function (feature) {
                                    return tmp.bufferStyle
                                }
                            }).addTo(tmp.map)
                        }
                        /*缓冲区设置 end*/
                        //tmp.shape.id = "polyline_plot";

                        tmp.edit = new L.Edit.Poly(tmp.shape)
                        //添加注册事件
                        tmp.map.fire("draw:created_p", {
                            layer: tmp.shape,
                            layerType: tmp.type
                        })
                        if (tmp.layerStyle) {
                            tmp.shape.setStyle(tmp.layerStyle)
                        }
                        tmp._edit(tmp)
                        tmp.disable()
                    }
                    tmp.draw.count++
                })
                break
            case "polyline":
                //针对线面最佳的渲染方式为svg
                tmp.draw = new L.Draw.Polyline(tmp.map, {
                    shapeOptions: tmp.style,
                    keyType: 1 // 绘制类型 在控件中有个绘制控件，以此来区别 0为控件，1为绘制类
                })
                tmp.map.addEventListener("dblclick", function (e) {
                    if (tmp.draw._poly._latlngs.length < 2) {
                        Aqsc.Util.alert("绘制线请绘制至少2个点", 3000)
                        return
                    }
                    if (tmp.isEnable) {
                        tmp.map.removeLayer(tmp.draw._poly)
                        tmp.draw._polyline = new L.Polyline(tmp.draw._poly._latlngs, tmp.style)
                        tmp.draw._polyline.addTo(tmp.map)
                        tmp.shape = tmp.draw._polyline
                        tmp.shape.type = tmp.type
                        tmp.shape.guid = tmp.guid
                        /*缓冲区设置 start*/
                        if (tmp.bufferRadius) {
                            var buffered = turf.buffer(tmp.shape.toGeoJSON().geometry, tmp.bufferRadius, {
                                units: "meters"
                            })
                            tmp.bufferShape = L.geoJSON(buffered, {
                                style: function (feature) {
                                    return tmp.bufferStyle
                                }
                            }).addTo(tmp.map)
                        }
                        /*缓冲区设置 end*/
                        //tmp.shape.id = "polyline_plot";

                        tmp.edit = new L.Edit.Poly(tmp.shape)
                        //添加注册事件
                        tmp.map.fire("draw:created_p", {
                            layer: tmp.shape,
                            layerType: tmp.type
                        })
                        if (tmp.layerStyle) {
                            tmp.shape.setStyle(tmp.layerStyle)
                        }
                        tmp._edit(tmp)
                        tmp.disable()
                    }
                })
                break
            case "polyline_free":
                break
            case "polygon":
                //针对线面最佳的渲染方式为svg
                tmp.draw = new L.Draw.Polygon(tmp.map, {
                    tooltip: {
                        end: "双击结束绘制"
                    },
                    shapeOptions: tmp.style
                })
                tmp.map.addEventListener("dblclick", function (e) {
                    if (tmp.draw._poly._latlngs.length < 4) {
                        Aqsc.Util.alert("绘制面请绘制至少3个点", 3000)
                        return
                    }
                    if (tmp.isEnable) {
                        if (tmp.draw._poly._latlngs.length < 3) {
                            return
                        }
                        tmp.map.removeLayer(tmp.draw._poly)
                        tmp.draw._polygon = new L.Polygon(tmp.draw._poly._latlngs, tmp.style)
                        tmp.draw._polygon.addTo(tmp.map)
                        tmp.shape = tmp.draw._polygon
                        tmp.shape.type = tmp.type
                        tmp.shape.guid = tmp.guid
                        /*缓冲区设置 start*/
                        if (tmp.bufferRadius) {
                            var buffered = turf.buffer(tmp.shape.toGeoJSON().geometry, tmp.bufferRadius, {
                                units: "meters"
                            })
                            tmp.bufferShape = L.geoJSON(buffered, {
                                style: function (feature) {
                                    return tmp.bufferStyle
                                }
                            }).addTo(tmp.map)
                        }
                        /*缓冲区设置 end*/

                        /*中心点 start*/
                        if (tmp.shape.centerText) {
                            tmp.shape.centerText.remove()
                        }
                        if (options.centerText) {
                            var pt = tmp.getCenter()
                            tmp.shape.centerText = new Aqsc.Text(pt, options.centerText, options.centerTextStyle)
                            tmp.shape.centerText.T.addTo(tmp.map)
                        }
                        /*中心点 end*/

                        //tmp.shape.id = "polygon_plot";
                        //注册绘制成功事件
                        tmp.map.fire("draw:created_p", {
                            layer: tmp.shape,
                            layerType: type
                        })
                        if (tmp.layerStyle) {
                            tmp.shape.setStyle(tmp.layerStyle)
                        }
                        //编辑操作
                        tmp.edit = new L.Edit.PolyVerticesEdit(tmp.shape, tmp.shape.getLatLngs())
                        tmp._edit(tmp)
                        tmp.disable()
                    }
                })
                break
            case "circle":
                tmp.tip = new L.Draw.Tooltip(tmp.map)
                //针对线面最佳的渲染方式为svg
                tmp.draw = new L.Draw.Circle(tmp.map, {
                    tooltip: {
                        end: "双击结束绘制"
                    },
                    shapeOptions: tmp.style
                })
                tmp.map.addEventListener("dblclick", function (e) {
                    if (tmp.isEnable) {
                        tmp.map.removeLayer(tmp.draw._shape)
                        tmp.style.radius = tmp.draw._shape._mRadius
                        tmp.draw._circle = new L.Circle(tmp.draw._shape._latlng, tmp.style)
                        tmp.draw._circle.addTo(tmp.map)
                        tmp.shape = tmp.draw._circle
                        tmp.shape.type = tmp.type
                        tmp.shape.guid = tmp.guid
                        /*缓冲区设置 start*/
                        if (tmp.bufferRadius) {
                            var buffered = turf.buffer(
                                tmp.shape.toGeoJSON().geometry,
                                tmp.bufferRadius + tmp.style.radius,
                                {
                                    units: "meters"
                                }
                            )
                            tmp.bufferShape = L.geoJSON(buffered, {
                                style: function (feature) {
                                    return tmp.bufferStyle
                                }
                            }).addTo(tmp.map)
                        }
                        /*缓冲区设置 end*/

                        tmp.edit = new L.Edit.Circle(tmp.shape)
                        tmp.map.fire("draw:created_p", {
                            layer: tmp.shape,
                            layerType: tmp.type
                        })
                        if (tmp.layerStyle) {
                            tmp.shape.setStyle(tmp.layerStyle)
                        }
                        tmp._edit(tmp)
                        tmp.disable()
                    }
                })
                break
            case "rectangle":
                //针对线面最佳的渲染方式为svg
                tmp.draw = new L.Draw.Rectangle(tmp.map, {
                    tooltip: {
                        end: "双击结束绘制"
                    },
                    shapeOptions: tmp.style
                })
                tmp.map.addEventListener("dblclick", function (e) {
                    if (tmp.isEnable) {
                        tmp.map.removeLayer(tmp.draw._shape)
                        tmp.draw._rectangle = new L.rectangle(tmp.draw._shape._latlngs, tmp.style)

                        tmp.shape = tmp.draw._rectangle
                        /*缓冲区设置 start*/
                        if (tmp.bufferRadius) {
                            var buffered = turf.buffer(tmp.shape.toGeoJSON().geometry, tmp.bufferRadius, {
                                units: "meters"
                            })
                            tmp.bufferShape = L.geoJSON(buffered, {
                                style: function (feature) {
                                    return tmp.bufferStyle
                                }
                            }).addTo(tmp.map)
                        }
                        /*缓冲区设置 end*/
                        tmp.shape.guid = tmp.guid
                        tmp.shape.type = tmp.type
                        tmp.shape.addTo(tmp.map)
                        tmp.edit = new L.Edit.Rectangle(tmp.shape)
                        tmp.map.fire("draw:created_p", {
                            layer: tmp.shape,
                            layerType: tmp.type
                        })
                        if (tmp.layerStyle) {
                            tmp.shape.setStyle(tmp.layerStyle)
                        }
                        tmp._edit(tmp)
                        tmp.disable()
                    }
                })
                break
            case "rectangle1":
                //针对线面最佳的渲染方式为svg
                tmp.draw = new L.Draw.Rectangle(tmp.map, {
                    tooltip: {
                        end: "鼠标松开结束绘制"
                    },
                    shapeOptions: tmp.style
                })
                tmp.map.addEventListener("click", function (e) {
                    if (tmp.isEnable) {
                        tmp.map.removeLayer(tmp.draw._shape)
                        tmp.draw._rectangle = new L.rectangle(tmp.draw._shape._latlngs, tmp.style)

                        tmp.shape = tmp.draw._rectangle
                        /*缓冲区设置 start*/
                        if (tmp.bufferRadius) {
                            var buffered = turf.buffer(tmp.shape.toGeoJSON().geometry, tmp.bufferRadius, {
                                units: "meters"
                            })
                            tmp.bufferShape = L.geoJSON(buffered, {
                                style: function (feature) {
                                    return tmp.bufferStyle
                                }
                            }).addTo(tmp.map)
                        }
                        /*缓冲区设置 end*/
                        tmp.shape.guid = tmp.guid
                        tmp.shape.type = tmp.type
                        tmp.shape.addTo(tmp.map)
                        tmp.edit = new L.Edit.Rectangle(tmp.shape)
                        tmp.map.fire("draw:created_p", {
                            layer: tmp.shape,
                            layerType: tmp.type
                        })
                        if (tmp.layerStyle) {
                            tmp.shape.setStyle(tmp.layerStyle)
                        }
                        tmp._edit(tmp)
                        tmp.disable()
                    }
                })
                break
            default:
                break
        }
    },
    /**
     * 设置缓冲区
     * @param {Number} radius 半径
     * @param {PolyStyle} style 样式
     */
    setBuffer: function (radius, style) {
        var tmp = this
        tmp.bufferRadius = radius
        tmp.bufferStyle = style
    },
    setRadius: function (radius) {
        this.drawRadius = radius
        if (this.type == "circle" /* && this.isEnable*/) {
            this.shape.setRadius(radius)
        }
    },
    getCenter: function () {
        var latlng = this.shape.getCenter()
        var pt = new Aqsc.Point(latlng.lng, latlng.lat)
        return pt
    },
    setCenterText: function (centerText, centerTextStyle) {
        if (this.shape.centerText) {
            this.shape.centerText.remove()
        }
        if (centerText) {
            var pt = this.getCenter()
            this.shape.centerText = new Aqsc.Text(pt, centerText, centerTextStyle)
            this.shape.centerText.T.addTo(this.map)
        }
    },
    setLineStyle: function (key) {
        var dashArray = "0"
        switch (key) {
            case "dx": //点线
                dashArray = "1,10"
                break
            case "xx": //虚线
                dashArray = "10"
                break
            case "cxx": //长虚线
                dashArray = "20,20"
                break
            case "cdx": //长点虚线
                dashArray = "20, 10, 1, 10"
                break
            case "sx": //实线
                dashArray = "0"
                break
            default:
                break
        }
        this.layerStyle = this.layerStyle || {}
        this.layerStyle.dashArray = dashArray
        if (this.shape) {
            this.shape.setStyle({ dashArray: dashArray })
        }
    },
    /**
     * 绘制的图形包含哪些点
     * @param {Array<MarkerPoint|MarkerIcon|MarkerCustomImg|MarkerCluster>} t_markers
     * @returns {Array<MarkerPoint|MarkerIcon|MarkerCustomImg|MarkerCluster>}
     */
    onDrawedIntersectsPoints: function (t_markers, fun) {
        var tmp = this
        tmp.t_markers = t_markers
        tmp.map.addEventListener("draw:created_p", function (event) {
            if (!tmp.isDrawedIntersect) {
                var t_resultMarkers = [] //返回结果集
                var t_markers_length = tmp.t_markers.length
                if (tmp.type == "circle") {
                    if (tmp.shape) {
                        for (var i = 0; i < t_markers_length; i++) {
                            //百度地图判断圆内有多个点有BUG，跟地球半径R有关系
                            var distance = tmp.shape._latlng.distanceTo(tmp.t_markers[i].latLng) //圆中心到marker点的距离
                            var radius = tmp.shape.getRadius()
                            if (distance <= radius) {
                                //距离小于圆心半径
                                t_resultMarkers.push(tmp.t_markers[i])
                            }
                        }
                    } else {
                        return -1
                    }
                } else {
                    if (tmp.shape) {
                        var shapeLatLngs = []
                        switch (tmp.type) {
                            case "polyline":
                                shapeLatLngs = tmp.shape._latlngs
                                break
                            case "polygon":
                            case "rectangle":
                            case "rectangle1":
                                shapeLatLngs = tmp.shape._latlngs[0]
                                break
                            default:
                                break
                        }
                        for (var i = 0; i < t_markers_length; i++) {
                            var isIntersect = false
                            if (tmp.type == "polyline") {
                                isIntersect = Aqsc.Util.contains(tmp.t_markers[i].latLng, shapeLatLngs, "polyline")
                            } else {
                                isIntersect = Aqsc.Util.contains(tmp.t_markers[i].latLng, shapeLatLngs, "polygon")
                            }
                            if (isIntersect) {
                                t_resultMarkers.push(tmp.t_markers[i])
                            }
                        }
                    } else {
                        return -1
                    }
                }
                fun(t_resultMarkers)
                tmp.isDrawedIntersect = true
            }
        })
    }
})

/**
 * Aqsc.PlotMarkerImg图片点标绘类
 */
Aqsc.PlotMarkerImg = Aqsc.Plot.extend({
    options: {
        showBackground: true, //是否显示背景
        backgroundColor: "#0078D7", //背景颜色
        backgroundOpacity: 0.9, //背景透明度

        stroke: false, //是否描边
        strokeColor: "#0078D7", //描边验收
        color: "white",
        font: "16px '微软雅黑'", //字体与字体大小
        offsetX: 15, //x轴偏移
        offsetY: 5, //y偏移

        iconUrl: "marker-icon.png",
        size: [32, 44],
        anchorSize: null,

        amination: false, //闪动动画
        aminationColor: "red", //动画闪动颜色
        editIcon: true // 是否显示标绘删除点
    },
    /**
     * 设置图片样式
     * @param {String} imgUrl
     * @param {Array} size
     */
    //	setImgStyle:function(imgUrl,size){
    //		tmp.draw.options.icon.options.iconUrl = imgUrl;
    //		tmp.draw.options.icon.options.iconSize = size;
    //	},
    initialize: function (map, options) {
        Aqsc.Plot.prototype.initialize.apply(this, arguments)
        options = options || {}
        options.textStyle = options.textStyle || {}
        options.editIcon = options.editIcon || {}
        this.type = "markerImgPt"
        var tmp = this
        // 是否显示删除标绘图标
        tmp.editIcon = options.editIcon === false ? options.editIcon : tmp.options.editIcon
        // 动画属性值
        tmp.amination = options.amination ? options.amination : tmp.options.amination
        tmp.aminationColor = options.aminationColor ? options.aminationColor : tmp.options.aminationColor
        tmp.tip = options.tip ? options.tip : "双击地图绘制marker点"
        if (options.markerImg) {
            tmp.draw = new L.Draw.Marker(tmp.map, {
                keyType: 1, // 绘制类型 在控件中有个绘制控件，以此来区别 0为控件，1为绘制类
                tooltip: tmp.tip,
                icon: L.icon({
                    id: options.id ? options.id : Aqsc.Util.guid(),
                    iconUrl: options.markerImg.iconUrl
                        ? options.markerImg.iconUrl
                        : Aqsc.Util.getBaseImgPath() + tmp.options.iconUrl,
                    iconSize: options.markerImg.size ? options.markerImg.size : tmp.options.size,
                    iconAnchor: options.markerImg.anchorSize ? options.markerImg.anchorSize : tmp.options.anchorSize
                })
            })
        } else {
            //属性为空时
            tmp.draw = new L.Draw.Marker(tmp.map, {
                tooltip: tmp.tip,
                keyType: 1 // 绘制类型 在控件中有个绘制控件，以此来区别 0为控件，1为绘制类
            })
        }
        tmp.map.on("dblclick", function (e) {
            if (tmp.isEnable) {
                var shppe = L.marker(tmp.draw._marker._latlng, tmp.draw._marker.options)
                tmp.edit = new L.Edit.Marker(shppe)
                tmp.shape = shppe // 复制一个marker
                tmp.shape.guid = tmp.guid
                tmp.shape.type = tmp.type
                if (options.name) {
                    //存在文字属性，增加文字
                    tmp.nameMarker = L.circle(e.latlng, {
                        text: tmp.name ? tmp.name : options.name,
                        radius: 0,
                        fillOpacity: 1,
                        opacity: 0,
                        textStyle: {
                            showBackground:
                                options.textStyle.showBackground === false ? false : tmp.options.showBackground,
                            backgroundColor: options.textStyle.backgroundColor
                                ? options.textStyle.backgroundColor
                                : tmp.options.backgroundColor,
                            backgroundOpacity: options.textStyle.backgroundOpacity
                                ? options.textStyle.backgroundOpacity
                                : tmp.options.backgroundOpacity,
                            backgroundBorderWidth: 0.1,

                            stroke: options.textStyle.stroke === true ? options.textStyle.stroke : tmp.options.stroke,
                            strokeColor: options.textStyle.strokeColor
                                ? options.textStyle.strokeColor
                                : tmp.options.strokeColor,
                            offsetX: options.textStyle.offsetX ? options.textStyle.offsetX : tmp.options.offsetX,
                            offsetY: options.textStyle.offsetY ? options.textStyle.offsetY : tmp.options.offsetY,
                            color: options.textStyle.color ? options.textStyle.color : tmp.options.color,
                            font: options.textStyle.font ? options.textStyle.font : tmp.options.font
                        }
                    }).addTo(tmp.map)
                    tmp.shape.options.text = tmp.nameMarker.options
                }
                tmp.shape.addTo(tmp.map)
                /*缓冲区设置 start*/
                if (tmp.bufferRadius) {
                    var buffered = turf.buffer(tmp.shape.toGeoJSON().geometry, tmp.bufferRadius, {
                        units: "meters"
                    })
                    tmp.bufferShape = L.geoJSON(buffered, {
                        style: function (feature) {
                            return tmp.bufferStyle
                        }
                    }).addTo(tmp.map)
                }
                /*缓冲区设置 end*/

                if (tmp.amination) {
                    //是否启用动画
                    var pulsingIcon = L.icon.pulse({
                        iconSize: tmp.draw.options.icon.options.iconSize,
                        iconAnchor: tmp.draw.options.icon.options.iconAnchor,
                        color: tmp.aminationColor
                    })
                    tmp.pluse = L.marker([tmp.shape._latlng.lat, tmp.shape._latlng.lng], {
                        icon: pulsingIcon
                    })
                    tmp.pluse.addTo(tmp.map)
                }
                //map中添加事件
                tmp.map.fire("draw:created_p", {
                    layer: tmp.shape,
                    layerType: tmp.type
                })
                if (tmp.layerStyle) {
                    tmp.shape.setStyle(tmp.layerStyle)
                }
                tmp._edit(tmp)
                tmp.zoomEnd(tmp)
                tmp._disable()
            }
        })
    },
    bindTooltip: function (tip) {
        var tmp = this
        tmp.shape.bindTooltip(tip)
    },
    setName: function (text, options) {
        options = options || {}
        options.textStyle = options.textStyle || {}
        var tmp = this
        if (tmp.nameMarker) {
            tmp.nameMarker.remove()
            tmp.nameMarker = L.circle(tmp.nameMarker._latlng, {
                text: text,
                radius: 0,
                fillOpacity: 1,
                opacity: 0,
                textStyle: {
                    showBackground: options.textStyle.showBackground === false ? false : tmp.options.showBackground,
                    backgroundColor: options.textStyle.backgroundColor
                        ? options.textStyle.backgroundColor
                        : tmp.options.backgroundColor,
                    backgroundOpacity: options.textStyle.backgroundOpacity
                        ? options.textStyle.backgroundOpacity
                        : tmp.options.backgroundOpacity,
                    backgroundBorderWidth: 0.1,

                    stroke: options.textStyle.stroke === true ? options.textStyle.stroke : tmp.options.stroke,
                    strokeColor: options.textStyle.strokeColor
                        ? options.textStyle.strokeColor
                        : tmp.options.strokeColor,
                    offsetX: options.textStyle.offsetX ? options.textStyle.offsetX : tmp.options.offsetX,
                    offsetY: options.textStyle.offsetY ? options.textStyle.offsetY : tmp.options.offsetY,
                    color: options.textStyle.color ? options.textStyle.color : tmp.options.color,
                    font: options.textStyle.font ? options.textStyle.font : tmp.options.font
                }
            }).addTo(tmp.map)
        } else {
            tmp.name = text
        }
    },
    /**
     * 设置缓冲区
     * @param {Number} radius 半径
     * @param {PolyStyle} style 样式
     */
    setBuffer: function (radius, style) {
        var tmp = this
        tmp.bufferRadius = radius
        tmp.bufferStyle = style
    },
    /**
     * 设置动画（内部方法）
     * @param {Boolean} amination
     * @param {Object} options
     */
    _setAmination: function (amination, options) {
        var tmp = this
        tmp.amination = amination
        if (!tmp.amination) {
            //不启用动画
            tmp.pluse ? tmp.map.removeLayer(tmp.pluse) : null
            return 0
        }
        options = options || {}
        if (tmp.isCreate) {
            //已经双击绘制过
            if (tmp.pluse) {
                //绘制前已经设置动画
                tmp.map.removeLayer(tmp.pluse)
                var pulsingIcon = L.icon.pulse({
                    iconSize: options.iconSize ? options.iconSize : [36, 44],
                    iconAnchor: options.iconAnchor ? options.iconAnchor : [16, 44],
                    color: options.color ? options.color : "red"
                })
                tmp.pluse = L.marker([tmp.shape._latlng.lat, tmp.shape._latlng.lng], {
                    icon: pulsingIcon
                })
                tmp.pluse.addTo(tmp.map)
            } else {
                //绘制前未设置动画
                var pulsingIcon = L.icon.pulse({
                    iconSize: options.iconSize ? options.iconSize : [36, 44],
                    iconAnchor: options.iconAnchor ? options.iconAnchor : [16, 44],
                    color: options.color ? options.color : "red"
                })
                tmp.pluse = L.marker([tmp.shape._latlng.lat, tmp.shape._latlng.lng], {
                    icon: pulsingIcon
                })
                tmp.pluse.addTo(tmp.map)
            }
        } else {
            //未双击绘制
            tmp.aminationColor = options.color ? options.color : "red"
        }
    },
    /**
     * 设置动画
     * @param {Object} color
     * @param {Object} iconSize
     * @param {Object} iconAnchor
     */
    setAmination: function (color, iconSize, iconAnchor) {
        var tmp = this
        tmp._setAmination(true, {
            color: color,
            iconSize: iconSize,
            iconAnchor: iconAnchor
        })
    },
    /**
     * 设置动画颜色（弃用）
     * @param {String} color
     */
    setAminationColor: function (color) {
        var tmp = this
        tmp._setAmination(true, {
            color: color,
            iconSize: tmp.draw.options.icon.options.iconSize,
            iconAnchor: tmp.draw.options.icon.options.iconAnchor
        })
    },
    removeAmination: function () {
        var tmp = this
        tmp._setAmination(false)
    },
    /**
     * 重新设置图标
     * @param {String} imgUrl
     * @param {Size} iconSize
     * @param {Size} anchorSize
     */
    setMarkerImg: function (iconUrl, iconSize, anchorSize) {
        var icon = L.icon({
            iconUrl: iconUrl,
            iconSize: iconSize,
            iconAnchor: anchorSize
        })
        this.shape.setIcon(icon)
    },
    setOpacity: function (opacity) {
        this.shape.setOpacity(opacity)
    },
    _disable: function () {
        this.draw.removeHooks()
        this.map.removeEventListener("dblclick")
        this.map.removeEventListener("draw:created_p")
        this.isEnable = false
    },
    disable: function () {
        this.draw.removeHooks()
        this.map.removeEventListener("dblclick")
        this.map.removeEventListener("draw:created_p")
        this.isEnable = false
    },
    zoomEnd: function (tmp) {
        tmp.map.on("zoomend", function () {
            if (tmp.shape && tmp.nameMarker) {
                tmp.nameMarker.setLatLng([tmp.shape.getLatLng().lat, tmp.shape.getLatLng().lng])
                tmp.nameMarker.setRadius(0)
            }
        })
    }
    //	toGeoJSON:function(){
    //		if(tmp.shape){
    //			return L.layerGroup([tmp.nameMarker,tmp.shape]).toGeoJSON;
    //		}else{
    //			alert("图形尚未绘制！");
    //		}
    //	},
})
/**
 * Aqsc.PlotMarkerIcon字体标绘类
 */
Aqsc.PlotMarkerIcon = Aqsc.PlotMarkerImg.extend({
    options: {
        icon: "ambulance", //icon的名称；
        prefix: "fa", //icon名称的前缀；
        markerColor: "red", //marker的颜色；
        spin: false, //图标是否旋转，默认不旋转
        iconColor: "darkblue", //图标icon的颜色
        markerType: "0",
        marker: true,

        showBackground: true, //是否显示背景
        backgroundColor: "#0078D7", //背景颜色
        backgroundOpacity: 0.9, //背景透明度

        stroke: false, //是否描边
        strokeColor: "#0078D7", //描边验收
        color: "white",
        font: "16px '微软雅黑' ", //字体与字体大小
        offsetX: 25, //x轴偏移
        offsetY: -15, //y偏移

        editIcon: true // 是否显示删除标绘图标
    },
    initialize: function (map, options) {
        Aqsc.Plot.prototype.initialize.apply(this, arguments)
        options = options || {}
        options.textStyle = options.textStyle || {}
        options.editIcon = options.editIcon || {}
        this.type = "markerIconPt"
        //获取字体点marker属性
        var _opts = {
            icon: options.markerIcon.icon ? options.markerIcon.icon : this.options.icon,
            prefix: options.markerIcon.prefix ? options.markerIcon.prefix : this.options.prefix,
            markerColor: options.markerIcon.markerColor ? options.markerIcon.markerColor : this.options.markerColor,
            spin: options.markerIcon.spin ? options.markerIcon.spin : this.options.spin,
            iconColor: options.markerIcon.iconColor ? options.markerIcon.iconColor : this.options.iconColor,
            markerType: options.markerIcon.markerType ? options.markerIcon.markerType : this.options.markerType,
            marker: options.markerIcon.marker == false ? options.markerIcon.marker : this.options.marker,
            fontSize: options.markerIcon.fontSize ? options.markerIcon.fontSize : "40px"
        }
        if (options.markerIcon.markerType == 2) {
            this._icon = L.AwesomeMarkers.iconOnly(_opts)
        } else {
            this._icon = L.AwesomeMarkers.icon(_opts)
        }
        var tmp = this
        // 是否显示删除标绘图标
        tmp.editIcon = options.editIcon === false ? options.editIcon : tmp.options.editIcon
        // 动画属性值
        tmp.amination = options.amination ? options.amination : tmp.options.amination
        tmp.aminationColor = options.aminationColor ? options.aminationColor : tmp.options.aminationColor
        tmp.tip = options.tip ? options.tip : "双击地图绘制marker点"
        tmp.draw = new L.Draw.Marker(tmp.map, {
            keyType: 1, // 绘制类型 在控件中有个绘制控件，以此来区别 0为控件，1为绘制类
            tooltip: tmp.tip,
            icon: tmp._icon
        })
        tmp.map.on("dblclick", function (e) {
            if (tmp.isEnable) {
                var shppe = L.marker(tmp.draw._marker._latlng, tmp.draw._marker.options)
                tmp.edit = new L.Edit.Marker(shppe)
                tmp.shape = shppe // 复制一个marker
                tmp.shape.type = tmp.type
                tmp.shape.guid = tmp.guid
                if (options.name) {
                    //存在文字属性，增加文字
                    tmp.nameMarker = L.circle(e.latlng, {
                        text: options.name,
                        radius: 0,
                        fillOpacity: 0,
                        opacity: 0,
                        textStyle: {
                            showBackground:
                                options.textStyle.showBackground === false ? false : tmp.options.showBackground,
                            backgroundColor: options.textStyle.backgroundColor
                                ? options.textStyle.backgroundColor
                                : tmp.options.backgroundColor,
                            backgroundOpacity: options.textStyle.backgroundOpacity
                                ? options.textStyle.backgroundOpacity
                                : tmp.options.backgroundOpacity,
                            backgroundBorderWidth: 0.1,

                            stroke: options.textStyle.stroke === true ? options.textStyle.stroke : tmp.options.stroke,
                            strokeColor: options.textStyle.strokeColor
                                ? options.textStyle.strokeColor
                                : tmp.options.strokeColor,
                            offsetX: options.textStyle.offsetX ? options.textStyle.offsetX : tmp.options.offsetX,
                            offsetY: options.textStyle.offsetY ? options.textStyle.offsetY : tmp.options.offsetY,
                            color: options.textStyle.color ? options.textStyle.color : tmp.options.color,
                            font: options.textStyle.font ? options.textStyle.font : tmp.options.font
                        }
                    }).addTo(tmp.map)
                    tmp.shape.options.text = tmp.nameMarker.options
                }
                tmp.shape.addTo(tmp.map)

                /*缓冲区设置 start*/
                if (tmp.bufferRadius) {
                    var buffered = turf.buffer(tmp.shape.toGeoJSON().geometry, tmp.bufferRadius, {
                        units: "meters"
                    })
                    tmp.bufferShape = L.geoJSON(buffered, {
                        style: function (feature) {
                            return tmp.bufferStyle
                        }
                    }).addTo(tmp.map)
                }
                /*缓冲区设置 end*/

                if (tmp.amination) {
                    //是否弃用动画
                    var pulsingIcon = L.icon.pulse({
                        iconSize: tmp.draw.options.icon.options.iconSize,
                        iconAnchor: tmp.draw.options.icon.options.iconAnchor,
                        color: tmp.aminationColor
                    })
                    tmp.pluse = L.marker([tmp.shape._latlng.lat, tmp.shape._latlng.lng], {
                        icon: pulsingIcon
                    })
                    tmp.pluse.addTo(tmp.map)
                }
                tmp.map.fire("draw:created_p", {
                    layer: tmp.shape,
                    layerType: tmp.type
                })
                if (tmp.layerStyle) {
                    tmp.shape.setStyle(tmp.layerStyle)
                }
                tmp._edit(tmp)
                tmp.zoomEnd(tmp)
                tmp._disable()
            }
        })
    },
    setSize: function (size) {
        this._icon.setFontSize(size)
    },
    setColor: function (color) {
        this._icon.setColor(color)
    }
})

/**
 * 文字标绘
 */
Aqsc.PlotMarkerName = Aqsc.PlotMarkerImg.extend({
    options: {},
    initialize: function (map, text, options) {
        Aqsc.Plot.prototype.initialize.apply(this, arguments)
        options = options || {}
        L.setOptions(this, options)
        this.type = "markerNamePt"
        this.text = text
        var tmp = this
        tmp.tip = options.tip ? options.tip : "双击地图绘制文字"
        tmp.draw = new L.Draw.Marker(tmp.map, {
            tooltip: tmp.tip,
            isOnlyText: true
        })
        tmp.tooltip = new L.Draw.Tooltip(tmp.map)
        tmp.map.addEventListener("mousemove", function (e) {
            tmp.tooltip.updateContent({
                text: tmp.tip
                //subtext:"我是中国人",
            })
            tmp.tooltip.updatePosition(e.latlng)
        })
        tmp.map.on("dblclick", function (e) {
            if (tmp.isEnable) {
                tmp._zoomEnd(tmp)
                tmp.txt = new L.Text(e.latlng, text, {
                    renderer: L.svg(),
                    color: "red",
                    font: "16px"
                })
                tmp.txt.addTo(tmp.map)
                tmp.shape = tmp.txt
                tmp.shape.addTo(tmp.map)
                tmp.setFontStyle(tmp.options)
                tmp.setStyle(tmp.options)
                tmp.map.fire("draw:created_p", {
                    layer: tmp.shape,
                    layerType: tmp.type
                })
                tmp._edit(tmp)
                tmp.map.on("zoomend", function (e) {
                    //TODO
                })
                tmp.disable()
            }
        })
    },
    setText: function (text) {
        this.txt._text = text
        document.getElementById(this.txt._id).innerHTML = text
    },
    getText: function () {
        return this.txt._text
    },
    setFontStyle: function (style) {
        if (style.fontFamily) {
            document.getElementById(this.txt._id).style.fontFamily = style.fontFamily
            this.txt.options.fontFamily = style.fontFamily
        }
        if (style.fontSize) {
            document.getElementById(this.txt._id).style.fontSize = style.fontSize
            this.txt.options.fontSize = style.fontSize
        }
        if (style.fontStyle) {
            document.getElementById(this.txt._id).style.fontStyle = style.fontStyle
            this.txt.options.fontStyle = style.fontStyle
        }
        if (style.fontWeight) {
            document.getElementById(this.txt._id).style.fontWeight = style.fontWeight
            this.txt.options.fontWeight = style.fontWeight
        }
        if (style.text) {
            document.getElementById(this.txt._id).innerHTML = style.text
            this.txt._text = style.text
        }
    },
    _edit: function (tmp) {
        tmp.shape.on("click", function () {
            if (!tmp.isClickListener && tmp.isEdit) {
                var latLng = tmp._translate([tmp.shape.getLatLng().lat, tmp.shape.getLatLng().lng], 30, 30)
                tmp.deleteMarker = tmp._createMarker(latLng, tmp.options.deleteIcon)
                tmp.deleteMarker.addTo(tmp.map)
                tmp.deleteMarker.on("click", function () {
                    //移除删除点
                    tmp.map.removeLayer(tmp.deleteMarker)
                    //移除图形
                    tmp.map.removeLayer(tmp.shape)
                    tmp._refreshMap(tmp)
                })
                tmp.isClickListener = true
                tmp.editMouseout = false
            }
        })
        //移出图形
        tmp.shape.on("mouseout", function (e) {
            //移除图形后点击地图
            tmp.map.addEventListener("click", function (e1) {
                if (tmp.editMouseout) {
                    try {
                        //移除删除点
                        if (tmp.deleteMarker) {
                            tmp.map.removeLayer(tmp.deleteMarker)
                        }
                    } catch (err) {}
                    tmp.isClickListener = false
                }
            })
            tmp.editMouseout = true
        })
        //移动到图形
        tmp.shape.on("mouseover", function (e) {
            tmp.editMouseout = false
        })
    },
    enable: function () {
        this.isEnable = true
        this.map._container.style.cursor = "crosshair"
    },
    disable: function () {
        this.isEnable = false
        this.map.removeEventListener("dblclick")
        this.map.removeEventListener("draw:created_p")
        this.tooltip.dispose()
        this.map._container.style.cursor = ""
    }
})

/**
 * Aqsc.PlotImg图片标绘类，操作方式为点击
 */
Aqsc.PlotImg = Aqsc.PlotMarkerImg.extend({
    options: {
        imgPath: "imageOverlay.png"
    },
    initialize: function (map, options) {
        options = options || {}
        this.isEdit = options.isEdit == true ? options.isEdit : this.options.isEdit
        //获取删除图标
        if (options.deleteIconPath) {
            this.options.deleteIcon.options.iconUrl = options.deleteIconPath
        } else {
            //判断路径
            if (this.options.deleteIcon.options.iconUrl.indexOf("http") == -1) {
                this.options.deleteIcon.options.iconUrl =
                    Aqsc.Util.getBaseImgPath() + this.options.deleteIcon.options.iconUrl
            }
        }
        this.imgPath = options.imgPath ? options.imgPath : Aqsc.Util.getBaseImgPath() + this.options.imgPath
        this.isEnable = false // 操作是否启用
        this.isCreate = false // 图形是否双击创建
        this.isEditDisabled = false // 是否取消编辑
        this.isClickListener = false //是否点击图形监听
        this.editMouseout = false // 是否移除图形
        this.type = "img" //图形类型
        if (map.map) {
            this.map = map.map
        } else {
            this.map = map
        }
        var tmp = this
        tmp.map._container.style.cursor = "crosshair"
        //绘制矩形	TODO，后续根据须有通过绘制矩形展示图片
        //		tmp.draw = new L.Draw.Rectangle(tmp.map, {
        ////			"tooltip": "双击结束绘制",
        //			"shapeOptions": {
        //				weight:1,
        //				color:"red",
        //				fill:false
        //			}
        //		});
        //操作提示
        tmp.tip = new L.Draw.Tooltip(tmp.map)
        tmp.map.addEventListener("mousemove", function (e) {
            tmp.tip.updateContent({
                text: "双击地图结束图片绘制（图片以双击位置为中心）"
                //subtext:"我是中国人",
            })
            tmp.tip.updatePosition(e.latlng)
        })
        tmp.map.addEventListener("dblclick", function (e) {
            if (tmp.isEnable) {
                var latLng1 = tmp._translate([e.latlng.lat, e.latlng.lng], 150, 150)
                var latLng2 = tmp._translate([e.latlng.lat, e.latlng.lng], -150, -150)
                var imageBounds = L.latLngBounds([
                    [latLng1.lat, latLng1.lng],
                    [latLng2.lat, latLng2.lng]
                ])
                var point1 = L.latLng(imageBounds.getNorthWest())
                var point2 = L.latLng(imageBounds.getNorthEast())
                var point3 = L.latLng(imageBounds.getSouthWest())

                var basePath = Aqsc.Util.getBaseImgPath()
                var iconPan = L.icon({
                    iconUrl: basePath + "rect.png",
                    iconSize: [16, 16]
                })
                var iconRotate = L.icon({
                    iconUrl: basePath + "rotate.png",
                    iconSize: [25, 25]
                })
                tmp.imageOverlayRotateMarkerNW = L.marker(point1, {
                    draggable: true,
                    opacity: 0,
                    icon: iconRotate
                }).addTo(tmp.map)
                tmp.imageOverlayRotateMarkerNE = L.marker(point2, {
                    draggable: true,
                    opacity: 0,
                    icon: iconPan
                }).addTo(tmp.map)
                tmp.imageOverlayRotateMarkerSW = L.marker(point3, {
                    draggable: true,
                    opacity: 0,
                    icon: iconPan
                }).addTo(tmp.map)
                tmp.overlay = L.imageOverlay
                    .rotated(tmp.imgPath, point1, point2, point3, {
                        opacity: 1,
                        interactive: true
                    })
                    .addTo(tmp.map)
                tmp.shape = tmp.overlay
                tmp.map.addLayer(tmp.shape)
                //注册绘制成功事件
                tmp.map.fire("draw:created_p", {
                    layer: tmp.shape,
                    layerType: tmp.type
                })
                tmp._edit(tmp)
                tmp.disable()
            }
        })
    },
    addEventListener: function (type, fun, Mix) {
        var tmp = this
        if (tmp.shape) {
            tmp.shape.on(type, function (p) {
                p.sourceTarget = tmp
                fun(p)
            })
        }
    },
    setOpacity: function (opacity) {
        this.shape.setOpacity(opacity)
    },
    _edit: function (tmp) {
        tmp.shape.on("click", function () {
            tmp.edit = L.Class.extend({})
            tmp.edit.removeHooks = function () {
                tmp.imageOverlayRotateMarkerNW.setOpacity(0)
                tmp.imageOverlayRotateMarkerNE.setOpacity(0)
                tmp.imageOverlayRotateMarkerSW.setOpacity(0)
            }
            function repositionImage(e) {
                tmp.shape.reposition(
                    tmp.imageOverlayRotateMarkerNW.getLatLng(),
                    tmp.imageOverlayRotateMarkerNE.getLatLng(),
                    tmp.imageOverlayRotateMarkerSW.getLatLng()
                )
            }
            tmp.imageOverlayRotateMarkerNW.on("drag dragend", repositionImage)
            tmp.imageOverlayRotateMarkerNE.on("drag dragend", repositionImage)
            tmp.imageOverlayRotateMarkerSW.on("drag dragend", repositionImage)
            tmp.shape.on("mouseout", function (e) {
                tmp.map.on("click", function (e1) {
                    if (tmp.editMouseout) {
                        tmp.imageOverlayRotateMarkerNW.setOpacity(0)
                        tmp.imageOverlayRotateMarkerNE.setOpacity(0)
                        tmp.imageOverlayRotateMarkerSW.setOpacity(0)
                        tmp.map.removeLayer(tmp.deleteMarker)
                    }
                })
                tmp.editMouseout = true
            })
            tmp.shape.on("mouseover", function (e) {
                tmp.editMouseout = false
            })
            if (!tmp.isClickListener && tmp.isEdit) {
                tmp._onclick(tmp)
            }
        })
    },
    _dragEnd: function (tmp) {
        var p_imageOverlayRotateMarkerNE = tmp.imageOverlayRotateMarkerNE
        p_imageOverlayRotateMarkerNE.on("dragend", function (e) {
            var newLatlng = tmp._translate(
                [p_imageOverlayRotateMarkerNE.getLatLng().lat, p_imageOverlayRotateMarkerNE.getLatLng().lng],
                30,
                30
            )
            tmp.deleteMarker.setLatLng(newLatlng)
        })
    },
    _onclick: function (tmp) {
        //添加编辑点
        if (tmp.deleteMarker) {
            tmp.map.removeLayer(tmp.deleteMarker)
        }
        //添加删除图标
        var latLng = tmp._translate(
            [tmp.imageOverlayRotateMarkerNE.getLatLng().lat, tmp.imageOverlayRotateMarkerNE.getLatLng().lng],
            30,
            30
        )
        tmp.deleteMarker = tmp._createMarker(latLng, tmp.options.deleteIcon)
        tmp.deleteMarker.addTo(tmp.map)
        tmp.deleteMarker.on("click", function () {
            //移除删除点
            tmp.map.removeLayer(tmp.deleteMarker)
            tmp.map.removeLayer(tmp.shape)
            tmp.map.removeLayer(tmp.imageOverlayRotateMarkerNW)
            tmp.map.removeLayer(tmp.imageOverlayRotateMarkerNE)
            tmp.map.removeLayer(tmp.imageOverlayRotateMarkerSW)
        })
        tmp.imageOverlayRotateMarkerNW.setOpacity(1)
        tmp.imageOverlayRotateMarkerNE.setOpacity(1)
        tmp.imageOverlayRotateMarkerSW.setOpacity(1)
        //_drag
        tmp._dragEnd(tmp)
    },
    /**
     * 创建marker(删除图标)
     */
    _createMarker: function (latlng, icon) {
        marker = new L.Marker(latlng, {
            icon: icon,
            zIndexOffset: 2000 * 2
        })
        return marker
    },
    enable: function () {
        this.isEnable = true
    },
    disable: function () {
        this.isEnable = false
        this.map.removeEventListener("dblclick")
        this.map.removeEventListener("draw:created_p")
        this.tip.dispose()
        this.map._container.style.cursor = ""
    }
})
