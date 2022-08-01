/**
 * @功能描述:MilitaryPlot类
 * @author: CLS
 * @date: 14:06 2019/5/2
 * @requires core.min.js
 */

if(typeof(Aqsc) === 'undefined') {
	var Aqsc = {};
	Aqsc.Point = function() {
		this.initialize.apply(this, arguments);
	}

	Aqsc.Point.prototype = {
		initialize: function(x, y) {
			this.x = x;
			this.y = y;
		},
		equals: function(point, maxMargin) {
			var latLng = L.latLng(point.y, point.x);
			var latLngSelf = L.latLng(this.y, this.x);
			var isEqual = latLngSelf.equals(latLng, maxMargin);
			return isEqual;
		},
		clone: function() {
			var clonePt = new Aqsc.Point(this.x, this.y);
			return clonePt;
		}
	}
	Aqsc.Size = function() {
  		this.initialize.apply(this, arguments);
  	};

  	Aqsc.Size.prototype = {
  		initialize: function(width, height) {
  			this.width = width;
  			this.height = height;
  		}
  	}
  	Aqsc.Util = {};
	Aqsc.Util.guid = function(){
		function S4() {
  			return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  		}
  		return(S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	}
	
    L.Marker.Touch = L.Marker.extend({

  	_initInteraction: function() {
  		if(!this.addInteractiveTarget) {
  			// 0.7.x support
  			return this._initInteractionLegacy();
  		}
  		// TODO this may need be updated to re-add touch events for 1.0+
  		return L.Marker.prototype._initInteraction.apply(this);
  	},

  	// This is an exact copy of https://github.com/Leaflet/Leaflet/blob/v0.7/src/layer/marker/Marker.js
  	// with the addition of the touch events
  	_initInteractionLegacy: function() {

  		if(!this.options.clickable) {
  			return;
  		}

  		// TODO refactor into something shared with Map/Path/etc. to DRY it up

  		var icon = this._icon,
  			events = ['dblclick',
  				'mousedown',
  				'mouseover',
  				'mouseout',
  				'contextmenu',
  				'touchstart',
  				'touchend',
  				'touchmove'
  			];
  		if(this._detectIE) {
  			events.concat(['MSPointerDown',
  				'MSPointerUp',
  				'MSPointerMove',
  				'MSPointerCancel'
  			]);
  		} else {
  			events.concat(['touchcancel']);
  		}

  		L.DomUtil.addClass(icon, 'aqsc-clickable');
  		L.DomEvent.on(icon, 'click', this._onMouseClick, this);
  		L.DomEvent.on(icon, 'keypress', this._onKeyPress, this);

  		for(var i = 0; i < events.length; i++) {
  			L.DomEvent.on(icon, events[i], this._fireMouseEvent, this);
  		}

  		if(L.Handler.MarkerDrag) {
  			this.dragging = new L.Handler.MarkerDrag(this);

  			if(this.options.draggable) {
  				this.dragging.enable();
  			}
  		}
  	},

  	_detectIE: function() {
  		var ua = window.navigator.userAgent;

  		var msie = ua.indexOf('MSIE ');
  		if(msie > 0) {
  			// IE 10 or older => return version number
  			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  		}

  		var trident = ua.indexOf('Trident/');
  		if(trident > 0) {
  			// IE 11 => return version number
  			var rv = ua.indexOf('rv:');
  			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  		}

  		var edge = ua.indexOf('Edge/');
  		if(edge > 0) {
  			// IE 12 => return version number
  			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  		}

  		// other browser
  		return false;
  	}
  });
}

// leaflet直接使用，也可以基于aqsc api，实现套用

Aqsc.MilitaryPlot = L.Class.extend({
	options: {
		_ratio: 6, //箭头长度与宽度的比值，箭头三角形需要占用总长度的1/_ratio
		_tailRatio: 5, //箭头起始两个节点长度与箭头尾巴的比值
		_isEdit: false, //单击是否启用已经绘制图形进入编辑状态
		_style: {
			color: 'red',
			fillColor: 'red',
			fillOpacity: 0.8,
			weight:2,
			renderer:L.svg()
		}
	},
	/**
	 * 
	 * @param {Object} map
	 * @param {String} type
	 * @param {Object} opts
	 */
	initialize: function(map, type, opts,moveImgUrl) {
		opts = opts || {};
		this.map = map;
		this.type = type;
		this.isEdit = (opts.isEdit == true) ? opts.isEdit : this.options._isEdit;
		this.layerStyle = opts.style ? opts.style : this.options._style;
		this.layerStyle.renderer = L.svg();// 标绘默认为svg渲染
		this.layerStyle.id = Aqsc.Util.guid();
		this.editSize = new Aqsc.Size(15, 15);
		this.shadeEffect = false;
		this.fillEffect = false;
		this.isCreate = false; // 图形是否双击创建
		this.moveImgUrl = moveImgUrl?moveImgUrl:'';
	},
	/**
	 * 添加监听事件
	 * @param {String} type
	 * @param {Object} fun
	 * @param {Object} Mix
	 */
	addEventListener:function(type, fun, Mix){
		var tmp = this;
		if(this.shape){
			this.shape.addEventListener(type, function(p) {
				p.sourceTarget = tmp;
				p.id = tmp.shape.options.id;
				fun(p);
			});
		}else{
			confirm("等图形绘制成功后再添加监听事件！");
		}
	},
	/**
	 * 移除监听事件
	 * @param {String} type
	 */
	removeEventListener: function(type) {
		if(this.shape){
			this.shape.removeEventListener(type);
		}
  	},
  	/**
  	 * 设置图形轮廓线线性
  	 * @param {String} key
  	 */
  	setLineStyle:function(key){
		var dashArray = "0";
		switch (key){
			case "dx"://点线
				dashArray = "1,10";
				break;
			case "xx"://虚线
				dashArray = "10";
				break;
			case "cxx"://长虚线
				dashArray = "20,20";
				break;
			case "cdx"://长点虚线
				dashArray = "20, 10, 1, 10";
				break;
			case "sx"://长点虚线
				dashArray = "0";
				break;		
			default:
				break;
		}
		this.layerStyle = this.layerStyle || {};
		this.layerStyle.dashArray = dashArray;
		if(this.shape) {
			this.shape.setStyle({"dashArray":dashArray});
		}
	},
	_calculateParts: function(tmp) {
		if(tmp.type == "wjt" || tmp.type == "zjt" || tmp.type == "zwjt" || tmp.type == "sjt") {
			switch(tmp.type) {
				case "wjt": //尾箭头
				case "zjt": //直箭头
				case "zwjt": //自定义尾箭头
					//判定少于两个点或者为空，则直接返回
					if(tmp.points_xy == null || tmp.points_xy.length < 2) {
						return;
					}
					//判断如果为两个点，且两个点重合时也直接返回
					if(tmp.points_xy.length == 2 && (tmp.points_xy[0]).equals(tmp.points_xy[1])) {
						return;
					}
					//清空原有的所有点
					tmp.pointsResult_xy = [];
					//计算只有两个点时，即直的斜箭头
					if(tmp.points_xy.length == 2) {
						return tmp._calculateTwoPoints(tmp);
					}
					//计算有三个或三个以上的点时，即弯曲的斜箭头
					else {
						return tmp._calculateMorePoints(tmp);
					}
					break;
				case "sjt":
					//判定少于四个点或者为空，则直接返回
		            if(tmp.points_xy == null || tmp.points_xy.length<3){
		                return;
		            }
		            var controlPois = tmp.points_xy;
		            //定义四个用户输入点
		            var pointU_1 = controlPois[0];
		            var pointU_2 = controlPois[1];
		            var pointU_3 = controlPois[2];
		            var pointU_4 = null;
		            if(tmp.points_xy.length == 3){
		            	pointU_4 = new Aqsc.Point(pointU_3.x,pointU_3.y+0.1);
		            }else{
		            	pointU_4 = controlPois[3];
		            }
		            //计算控制点
		            //计算中间用户点
		            var pointU_C = new Aqsc.Point(((pointU_1.x+pointU_2.x)*5+(pointU_3.x+pointU_4.x))/12,((pointU_1.y+pointU_2.y)*5+(pointU_3.y+pointU_4.y))/12);
		            //计算左边外弧的控制点
		            var pointC_l_out = tmp._calculateIntersectionFromTwoCorner(pointU_1,pointU_4,Math.PI/8,Math.PI/6)[0];
		            //计算左边内弧的控制点
		            var pointC_l_inner = tmp._calculateIntersectionFromTwoCorner(pointU_C,pointU_4,Math.PI/8,Math.PI/16)[0];
		            //计算右边外弧的控制点
		            var pointC_r_out = tmp._calculateIntersectionFromTwoCorner(pointU_2,pointU_3,Math.PI/8,Math.PI/6)[1];
		            //计算右边内弧的控制点
		            var pointC_r_inner = tmp._calculateIntersectionFromTwoCorner(pointU_C,pointU_3,Math.PI/8,Math.PI/16)[1];
		
		            //
		
		            var v_l_out = new Aqsc.Point(pointC_l_out.x-pointU_4.x,pointC_l_out.y-pointU_4.y);
		            var d_l_out = Math.sqrt(v_l_out.x*v_l_out.x+v_l_out.y*v_l_out.y);
		            //单位向量
		            var v_l_out_1 = new Aqsc.Point(v_l_out.x/d_l_out,v_l_out.y/d_l_out);
		
		            var v_l_inner = new Aqsc.Point(pointC_l_inner.x-pointU_4.x,pointC_l_inner.y-pointU_4.y);
		            var d_l_inner = Math.sqrt(v_l_inner.x*v_l_inner.x+v_l_inner.y*v_l_inner.y);
		            //单位向量
		            var v_l_inner_1 = new Aqsc.Point(v_l_inner.x/d_l_inner,v_l_inner.y/d_l_inner);
		
		            //定义箭头头部的大小比例
		            var ab = 0.25;
		
		            //取最短的，除以5是一个经验值，这样效果比较好
		            var d_l_a = d_l_out<d_l_inner?d_l_out*ab:d_l_inner*ab;
		            //
		            var pointC_l_out_2 = new Aqsc.Point(v_l_out_1.x*d_l_a+pointU_4.x,v_l_out_1.y*d_l_a+pointU_4.y);
		            var pointC_l_inner_2 = new Aqsc.Point(v_l_inner_1.x*d_l_a+pointU_4.x,v_l_inner_1.y*d_l_a+pointU_4.y);
		
		            //左箭头左边点
		            var pointC_l_a_l = new Aqsc.Point(pointC_l_out_2.x*1.5-pointC_l_inner_2.x*0.5,pointC_l_out_2.y*1.5-pointC_l_inner_2.y*0.5);
		            //左箭头右边点
		            var pointC_l_a_r = new Aqsc.Point(pointC_l_inner_2.x*1.5-pointC_l_out_2.x*0.5,pointC_l_inner_2.y*1.5-pointC_l_out_2.y*0.5);
		
		            var v_r_out = new Aqsc.Point(pointC_r_out.x-pointU_3.x,pointC_r_out.y-pointU_3.y);
		            var d_r_out = Math.sqrt(v_r_out.x*v_r_out.x+v_r_out.y*v_r_out.y);
		            var v_r_out_1 = new Aqsc.Point(v_r_out.x/d_r_out,v_r_out.y/d_r_out);
		
		            var v_r_inner = new Aqsc.Point(pointC_r_inner.x-pointU_3.x,pointC_r_inner.y-pointU_3.y);
		            var d_r_inner = Math.sqrt(v_r_inner.x*v_r_inner.x+v_r_inner.y*v_r_inner.y);
		            var v_r_inner_1 = new Aqsc.Point(v_r_inner.x/d_r_inner,v_r_inner.y/d_r_inner);
		
		            //取最短的，除以5是一个经验值，这样效果比较好
		            var d_r_a = d_r_out<d_r_inner?d_r_out*ab:d_r_inner*ab;
		            var pointC_r_out_2 = new Aqsc.Point(v_r_out_1.x*d_r_a+pointU_3.x,v_r_out_1.y*d_r_a+pointU_3.y);
		            var pointC_r_inner_2 = new Aqsc.Point(v_r_inner_1.x*d_r_a+pointU_3.x,v_r_inner_1.y*d_r_a+pointU_3.y);
		
		            //右箭头箭头右边点
		            var pointC_r_a_r = new Aqsc.Point(pointC_r_out_2.x*1.5-pointC_r_inner_2.x*0.5,pointC_r_out_2.y*1.5-pointC_r_inner_2.y*0.5);
		            //左箭头左边点
		            var pointC_r_a_l = new Aqsc.Point(pointC_r_inner_2.x*1.5-pointC_r_out_2.x*0.5,pointC_r_inner_2.y*1.5-pointC_r_out_2.y*0.5);
		
		            //计算坐边外弧所有点
		            var points_l = tmp._createBezier2([pointU_1,pointC_l_out,pointC_l_out_2]);
		
		            //计算控制点
		            //定义向量
		            var v_U_4_3 = new Aqsc.Point(pointU_3.x-pointU_4.x,pointU_3.y-pointU_4.y);
		
		            //取部分
		            //需要优化，不能左右都取一样，需要按照左右的长度取值，这样更合理一些
		            //取u4和C的向量模
		            //取u3和C的向量模
		            //根据模的大小来取左右向量的长度，；来定位置
		            var v_U_4_C = new Aqsc.Point(pointU_C.x-pointU_4.x,pointU_C.y-pointU_4.y);
		            //求模
		            var d_U_4_C = Math.sqrt(v_U_4_C.x*v_U_4_C.x+v_U_4_C.y*v_U_4_C.y);
		            var v_U_3_C = new Aqsc.Point(pointU_C.x-pointU_3.x,pointU_C.y-pointU_3.y);
		            //求模
		            var d_U_3_C = Math.sqrt(v_U_3_C.x*v_U_3_C.x+v_U_3_C.y*v_U_3_C.y);
		
		            var percent = 0.4;
		            var v_U_4_3_ = new Aqsc.Point(v_U_4_3.x*percent,v_U_4_3.y*percent);
		            var v_U_4_3_l = new Aqsc.Point(v_U_4_3_.x*d_U_4_C/(d_U_4_C+d_U_3_C),v_U_4_3_.y*d_U_4_C/(d_U_4_C+d_U_3_C));
		            var v_U_4_3_r = new Aqsc.Point(v_U_4_3_.x*d_U_3_C/(d_U_4_C+d_U_3_C),v_U_4_3_.y*d_U_3_C/(d_U_4_C+d_U_3_C));
		            //中心点的左控制点
		            var pointC_c_l = new Aqsc.Point(pointU_C.x-v_U_4_3_l.x,pointU_C.y-v_U_4_3_l.y);
		            //中心点右边的控制点
		            var pointC_c_r = new Aqsc.Point(pointU_C.x+v_U_4_3_r.x,pointU_C.y+v_U_4_3_r.y);
		
		            //测试
		            var arr = [pointC_l_inner_2,pointC_l_inner,pointC_c_l,pointU_C,pointC_c_r,pointC_r_inner,pointC_r_inner_2];
		
		            var points_c = tmp._createBezier1(arr,0,20);
		            //var points_c = HX.Geometry.LineString.createBezier(arr,0.05).components;
		
		            //计算右边外弧的所有点
		            var points_r = tmp._createBezier2([pointC_r_out_2,pointC_r_out,pointU_2]);
		
		            //定义结果数组
		            var result = points_l;
		            result.push(pointC_l_a_l);
		            result.push(pointU_4);
		            result.push(pointC_l_a_r);
		            result = result.concat(points_c);
		            result.push(pointC_r_a_l);
		            result.push(pointU_3);
		            result.push(pointC_r_a_r);
		            result = result.concat(points_r);
		            if(tmp.map.map){
		            	tmp.movePolygon = new Aqsc.Polygon(result, tmp.layerStyle);
						tmp.movePolygon.addToMap();
						tmp.movePolygon.polygon.editVertexs = [pointU_1,pointU_2,pointU_3,pointU_4];// 设置edit顶点vertexs
						tmp.movePolygon.polygon.vertexs = result;// 设置顶点vertexs
						//设置tmp.shape 为setStyle
						tmp.shape = tmp.movePolygon.polygon;
//						tmp.shape.addTo(tmp.map.map);
		            }else{
		            	var latlngs = [];
						for(var i = 0; i < tmp.points_xy.length; i++) {
							var latlng = [tmp.points_xy[i].y, tmp.points_xy[i].x];
							latlngs.push(latlng);
						}
						
						tmp.movePolygon = L.polygon(latlngs, tmp.layerStyle);
						tmp.movePolygon.addTo(tmp.map);
						tmp.movePolygon.editVertexs = [pointU_1,pointU_2,pointU_3,pointU_4];// 设置edit顶点vertexs
						tmp.movePolygon.vertexs = result;// 设置顶点vertexs
						//设置tmp.shape 为setStyle
						tmp.shape = tmp.movePolygon;
//						tmp.shape.addTo(tmp.map);
		            }
//		            tmp.map.fire('draw:created', {
//			  			layer: tmp.shape ,
//			  			layerType: tmp.type
//			  		});
		            return result;
					break;
				default:break;	
			}
		} else {
			switch(tmp.type) {
				case "djt": //单箭头
					if(tmp.points_xy.length > 1) {
						var startP = tmp.points_xy[tmp.points_xy.length - 2];
						var endP = tmp.points_xy[tmp.points_xy.length - 1];
						//箭头
						//var arrowLines=this.calculateArrowLines(startP,endP,10);
						var ratio = 10; // 这个参数可以放到options中
						var angle = Math.PI / 6; // 这个参数可以放到options中
						var dictance = tmp._calculateDistance(startP, endP);
						var vector = new Aqsc.Point(startP.x - endP.x, startP.y - endP.y);
						var vectorArrows = tmp._calculateVector(vector, angle, dictance / ratio);
						var arrowLineP_l = new Aqsc.Point(vectorArrows[0].x + endP.x, vectorArrows[0].y + endP.y);
						var arrowLineP_r = new Aqsc.Point(vectorArrows[1].x + endP.x, vectorArrows[1].y + endP.y);
						//直线
						if(tmp.map.map) { //aqsc平台
							// 直线
							
							tmp.movePolygon = new Aqsc.Polyline(tmp.points_xy, tmp.layerStyle);
							tmp.movePolygon.addToMap();
							// 箭头
							tmp.line_l = new Aqsc.Polyline([endP, arrowLineP_l], tmp.layerStyle);
							tmp.line_r = new Aqsc.Polyline([endP, arrowLineP_r], tmp.layerStyle);
							tmp.line_l.addToMap();
							tmp.line_r.addToMap();
							
							tmp.movePolygon.polyline.editVertexs = tmp.points_xy;// 设置edit顶点vertexs
							tmp.movePolygon.polyline.vertexs = tmp.points_xy;// 设置顶点vertexs
							tmp.movePolygon.polyline.line_l = tmp.line_l;// 
							tmp.movePolygon.polyline.line_r = tmp.line_r;// 
							tmp.movePolygon.polyline.point_l = arrowLineP_l;// 箭头左顶点
							tmp.movePolygon.polyline.point_r = arrowLineP_r;// 箭头左顶点
							tmp.movePolygon.polyline.point_end = endP;// 箭头左顶点
							
							
							tmp.movePolygon.polyline.point_l = arrowLineP_l;// 箭头左顶点
							tmp.movePolygon.polyline.point_r = arrowLineP_r;// 箭头右顶点
							tmp.movePolygon.polyline.point_end = endP;// 箭头最后一个点
							
							//tmp.shape 为setStyle作准备
							tmp.shape = L.featureGroup([tmp.movePolygon.polyline,tmp.line_l.polyline,tmp.line_r.polyline]);
//							tmp.shape.addTo(tmp.map.map);
						} else { //leaflet api
							var latlngs = [];
							for(var i = 0; i < tmp.points_xy.length; i++) {
								var latlng = [tmp.points_xy[i].y, tmp.points_xy[i].x];
								latlngs.push(latlng);
							}
							
							tmp.movePolygon = L.polyline(latlngs, tmp.layerStyle);
							tmp.movePolygon.addTo(tmp.map);

							tmp.line_l = L.polyline([
								[endP.y, endP.x],
								[arrowLineP_l.y, arrowLineP_l.x]
							],tmp.layerStyle);
							tmp.line_r = L.polyline([
								[endP.y, endP.x],
								[arrowLineP_r.y, arrowLineP_r.x]
							],tmp.layerStyle);
							tmp.line_l.addTo(tmp.map);
							tmp.line_r.addTo(tmp.map);
							
							tmp.movePolygon.editVertexs = tmp.points_xy;// 设置edit顶点vertexs
							tmp.movePolygon.vertexs = tmp.points_xy;// 设置顶点vertexs
							tmp.movePolygon.line_l = tmp.line_l;// 
							tmp.movePolygon.line_r = tmp.line_r;// 
							tmp.movePolygon.point_l = arrowLineP_l;// 箭头左顶点
							tmp.movePolygon.point_r = arrowLineP_r;// 箭头左顶点
							tmp.movePolygon.point_end = endP;// 箭头左顶点
							
							tmp.point_l = arrowLineP_l;// 箭头左顶点
							tmp.point_r = arrowLineP_r;// 箭头右顶点
							tmp.point_end = endP;// 箭头最后一个点
							
							//tmp.shape 为setStyle作准备
							tmp.shape = L.featureGroup([tmp.movePolygon,tmp.line_l,tmp.line_r]);
//							tmp.shape.addTo(tmp.map);
						}
						
						return tmp.points_xy;
					}
					break;
				case "jhq":
					if(tmp.points_xy.length > 1) {
						//取第一个点作为第一控制点
						var originP = tmp.points_xy[0];
						//取最后一个作为第二控制点
						var lastP = tmp.points_xy[tmp.points_xy.length - 1];
						var points = [];
						// 向量originP_lastP
						var vectorOL = new Aqsc.Point(lastP.x - originP.x, lastP.y - originP.y);
						// 向量originP_lastP的模
						var dOL = Math.sqrt(vectorOL.x * vectorOL.x + vectorOL.y * vectorOL.y);

						//计算第一个插值控制点
						//向量originP_P1以originP为起点，与向量originP_lastP的夹角设为30，模为√3/12*dOL，
						var v_O_P1_lr = tmp._calculateVector(vectorOL, Math.PI / 3, Math.sqrt(3) / 12 * dOL);
						//取左边的向量作为向量originP_P1
						var originP_P1 = v_O_P1_lr[0];
						var p1 = new Aqsc.Point(originP_P1.x + originP.x, originP_P1.y + originP.y);

						//计算第二个插值控制点，取第一控制点和第二控制点的中点为第二个插值控制点
						var p2 = new Aqsc.Point((originP.x + lastP.x) / 2, (originP.y + lastP.y) / 2);

						//计算第三个插值控制点
						//向量originP_P3以lastP为起点，与向量originP_lastP的夹角设为150°，模为√3/12*dOL，
						var v_L_P3_lr = tmp._calculateVector(vectorOL, Math.PI * 2 / 3, Math.sqrt(3) / 12 * dOL);
						//取左边的向量作为向量originP_P1
						var lastP_P3 = v_L_P3_lr[0];
						var p3 = new Aqsc.Point(lastP_P3.x + lastP.x, lastP_P3.y + lastP.y);

						//计算第四个插值控制点
						//向量originP_P4以向量originP_lastP中点为起点，与向量originP_lastP的夹角设为90°，模为1/2*dOL，
						var v_O_P5_lr = tmp._calculateVector(vectorOL, Math.PI / 2, 1 / 2 * dOL);
						//取左边的向量作为向量originP_P1
						var v_O_P5 = v_O_P5_lr[1];
						var p5 = new Aqsc.Point(v_O_P5.x + p2.x, v_O_P5.y + p2.y);

						var P0 = originP.clone();
						var P4 = lastP.clone();
						points.push(P0, p1, p2, p3, P4, p5);

						var cardinalPoints = tmp._createCloseCardinal(points);
						cardinalPoints = tmp._createBezier3(cardinalPoints, 100);
						if(tmp.map.map) {
							
							tmp.movePolygon = new Aqsc.Polygon(cardinalPoints, tmp.layerStyle);
							tmp.movePolygon.addToMap();
							tmp.movePolygon.polygon.editVertexs = tmp.points_xy;// 设置edit顶点vertexs
							tmp.movePolygon.polygon.vertexs = cardinalPoints;// 设置顶点vertexs
							//tmp.shape 为setStyle作准备
							tmp.shape = tmp.movePolygon.polygon;
//							tmp.shape.addTo(tmp.map.map);
						} else {
							var latlngs = [];
							for(var i = 0; i < cardinalPoints.length; i++) {
								var latlng = [cardinalPoints[i].y, cardinalPoints[i].x];
								latlngs.push(latlng);
							}
							
							tmp.movePolygon = L.polygon(latlngs, tmp.layerStyle);
							tmp.movePolygon.addTo(tmp.map);
							tmp.movePolygon.editVertexs = tmp.points_xy;// 设置edit顶点vertexs
							tmp.movePolygon.vertexs = cardinalPoints;// 设置顶点vertexs
							//tmp.shape 为setStyle作准备
							tmp.shape = tmp.movePolygon;
//							tmp.shape.addTo(tmp.map);
						}
						return cardinalPoints;
					}
					break;
				case "qxqz":
					if(tmp.points_xy.length > 1) {
						//取第一个
						var startPoint = tmp.points_xy[0];
						//取最后一个
						var endPoint = tmp.points_xy[tmp.points_xy.length - 1];
						//上曲线起始点
						var point1 = startPoint;
						//上曲线第一控制点
						var point2 = new Aqsc.Point((endPoint.x - startPoint.x) / 4 + startPoint.x, (endPoint.y - startPoint.y) / 8 + startPoint.y);
						//上曲线第二个点
						var point3 = new Aqsc.Point((startPoint.x + endPoint.x) / 2, startPoint.y);
						//上曲线第二控制点
						var point4 = new Aqsc.Point((endPoint.x - startPoint.x) * 3 / 4 + startPoint.x, -(endPoint.y - startPoint.y) / 8 + startPoint.y);
						//上曲线结束点
						var point5 = new Aqsc.Point(endPoint.x, startPoint.y);

						//下曲线结束点
						var point6 = new Aqsc.Point(endPoint.x, (startPoint.y + endPoint.y) / 2);
						//下曲线第二控制点
						var point7 = new Aqsc.Point((endPoint.x - startPoint.x) * 3 / 4 + startPoint.x, (endPoint.y - startPoint.y) * 3 / 8 + startPoint.y);
						//下曲线第二个点
						var point8 = new Aqsc.Point((startPoint.x + endPoint.x) / 2, (startPoint.y + endPoint.y) / 2);
						//下曲线第一控制点
						var point9 = new Aqsc.Point((endPoint.x - startPoint.x) / 4 + startPoint.x, (endPoint.y - startPoint.y) * 5 / 8 + startPoint.y);
						//下曲线起始点
						var point10 = new Aqsc.Point(startPoint.x, (startPoint.y + endPoint.y) / 2);
						//旗杆底部点
						var point11 = new Aqsc.Point(startPoint.x, endPoint.y);
						//计算上曲线
						var curve1 = tmp._createBezier2([point1, point2, point3, point4, point5]);
						//计算下曲线
						var curve2 = tmp._createBezier2([point6, point7, point8, point9, point10]);

						//合并
						var points = curve1.concat(curve2);
						points.push(point11);
						if(tmp.map.map) {
							
							tmp.movePolygon = new Aqsc.Polygon(points, tmp.layerStyle);
							tmp.movePolygon.addToMap();
							//tmp.shape 为setStyle作准备
							tmp.shape = tmp.movePolygon.polygon;
//							tmp.shape.addTo(tmp.map.map);
						} else {
							var latlngs = [];
							for(var i = 0; i < points.length; i++) {
								var latlng = [points[i].y, points[i].x];
								latlngs.push(latlng);
							}
							
							tmp.movePolygon = L.polygon(latlngs, tmp.layerStyle);
							tmp.movePolygon.addTo(tmp.map);
							//tmp.shape 为setStyle作准备
							tmp.shape = tmp.movePolygon;
//							tmp.shape.addTo(tmp.map);
						}
					}
					break;
				case "jxqz":
				case "sjqz":
					if(tmp.points_xy.length > 1) {
						//取第一个
						var startPoint = tmp.points_xy[0];
						//取最后一个
						var endPoint = tmp.points_xy[tmp.points_xy.length - 1];
						var point1 = startPoint.clone();

						var point2 = new Aqsc.Point(endPoint.x, startPoint.y);
						var point3 = new Aqsc.Point(endPoint.x, (startPoint.y + endPoint.y) / 2);
						var point4 = new Aqsc.Point(startPoint.x, (startPoint.y + endPoint.y) / 2);
						var point5 = new Aqsc.Point(startPoint.x, endPoint.y);
						var points = [];
						if(tmp.type == "jxqz") {
							points = [point1, point2, point3, point4, point5];
						} else {
							points = [point1, point3, point4, point5];
						}
						
						if(tmp.map.map) {
							tmp.movePolygon = new Aqsc.Polygon(points, tmp.layerStyle);
							tmp.movePolygon.addToMap();
							//tmp.shape 为setStyle作准备
							tmp.shape = tmp.movePolygon.polygon;
//							tmp.shape.addTo(tmp.map.map);
						} else {
							var latlngs = [];
							for(var i = 0; i < points.length; i++) {
								var latlng = [points[i].y, points[i].x];
								latlngs.push(latlng);
							}
							tmp.movePolygon = L.polygon(latlngs, tmp.layerStyle);
							tmp.movePolygon.addTo(tmp.map);
							//tmp.shape 为setStyle作准备
							tmp.shape = tmp.movePolygon;
//							tmp.shape.addTo(tmp.map);
						}
					}
					break;
				default:
					break;
			}
		}

	},
	 /**
     * Method: calculateIntersectionFromTwoCorner
     * 通过三角形的底边两端点坐标以及底边两夹角，计算第三个点坐标
     *
     * Parameters:
     * pointS - {<Aqsc.Point>} 底边第一个点
     * pointE - {<Aqsc.Point>} 底边第二个点
     * a_S - {Number} 底边和第一个点所在的另一条边的夹角
     * a_E - {Number} 底边和第二个点所在的另一条边的夹角
     *
     * Returns:
     * {Array(<Aqsc.Point>)} 返回顶点（理论上存在两个值）
     */
    _calculateIntersectionFromTwoCorner: function(pointS, pointE, a_S, a_E){
        if(!a_S) {a_S = Math.PI/4;}
        if(!a_E) {a_E = Math.PI/4;}

        //起始点、结束点、交点加起来三个点，形成一个三角形
        //斜边（起始点到结束点）的向量为
        var v_SE = new Aqsc.Point(pointE.x-pointS.x,pointE.y-pointS.y);
        //计算起始点、交点的单位向量
        var v_SI_lr = this._calculateVector(v_SE,a_S,1);
        //获取
        var v_SI_l = v_SI_lr[0];
        var v_SI_r = v_SI_lr[1];
        //计算结束点、交点的单位向量
        var v_EI_lr = this._calculateVector(v_SE,Math.PI-a_S,1);
        //获取
        var v_EI_l = v_EI_lr[0];
        var v_EI_r = v_EI_lr[1];
        //求左边的交点
        var pointI_l = this._calculateIntersection(v_SI_l,v_EI_l,pointS,pointE);
        //计算右边的交点
        var pointI_r = this._calculateIntersection(v_SI_r,v_EI_r,pointS,pointE);
        return [pointI_l,pointI_r];
    },
	/**
	 * Method: calculateDistance
	 * 计算两点间的距离
	 *
	 * Parameters:
	 * pointA - {<Aqsc.Point>} 第一个点
	 * pointB -  {<Aqsc.Point>} 第二个点
	 *
	 * Returns:
	 * {<Aqsc.Point>} 返回两点间的距离值
	 */
	_calculateDistance: function(pointA, pointB) {
		var distance = Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
		return distance;

	},
	/**
	 * Method: calculateVector
	 * 计算和基准向量v夹角为a、长度为d的目标向量（理论上有两个，一左一右）
	 *
	 * Parameters:
	 * v - {Object} 基准向量 {x:xxx,y:xxx}
	 * a - {Number} 目标向量和基准向量的夹角，默认为90度，这里的单位使用弧度
	 * d - {Number} 目标向量的长度，即模，默认为1，即单位向量
	 *
	 * Returns:
	 * {Array(<Object>)} 回目标向量数组 （就两个向量，一左一右）
	 */
	_calculateVector: function(v, a, d) {
		if(!a) {a = Math.PI / 2;}
		if(!d) {d = 1;}

		//定义目标向量的头部   x 坐标
		var x_1;
		var x_2;
		//定义目标向量的头部   y 坐标
		var y_1;
		var y_2;
		//定义目标向量，一左一右
		var v_l;
		var v_r;

		//计算基准向量v的模
		var d_v = Math.sqrt(v.x * v.x + v.y * v.y);

		//基准向量的斜率为0时，y值不能作为除数，所以需要特别处理
		if(v.y == 0) {
			//计算x,会有两个值
			x_1 = x_2 = d_v * d * Math.cos(a) / v.x;
			//根据v.x的正负判断目标向量的左右之分
			if(v.x > 0) {
				//计算y
				y_1 = Math.sqrt(d * d - x_1 * x_1);
				y_2 = -y_1;
			} else if(v.x < 0) {
				//计算y
				y_2 = Math.sqrt(d * d - x_1 * x_1);
				y_1 = -y_2;
			}
			v_l = new Aqsc.Point(x_1, y_1);
			v_r = new Aqsc.Point(x_2, y_2);
		}
		//此为大多数情况
		else {
			//转换为y=nx+m形式
			var n = -v.x / v.y;
			var m = d * d_v * Math.cos(a) / v.y;
			//
			//x*x + y*y = d*d
			//转换为a*x*x + b*x + c = 0
			var a = 1 + n * n;
			var b = 2 * n * m;
			var c = m * m - d * d;
			//计算x,会有两个值
			x_1 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
			x_2 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
			//计算y
			y_1 = n * x_1 + m;
			y_2 = n * x_2 + m;
			//当向量向上时
			if(v.y >= 0) {
				v_l = new Aqsc.Point(x_1, y_1);
				v_r = new Aqsc.Point(x_2, y_2);
			}
			//当向量向下时
			else if(v.y < 0) {
				v_l = new Aqsc.Point(x_2, y_2);
				v_r = new Aqsc.Point(x_1, y_1);
			}
		}
		return [v_l, v_r];
	},
	/**
	 * Method: calculateIntersection
	 * 计算两条直线的交点
	 * 通过向量的思想进行计算，需要提供两个向量以及两条直线上各自一个点
	 *
	 * Parameters:
	 * v_1 - {<Aqsc.Point>} 直线1的向量
	 * v_2 - {<Aqsc.Point>} 直线2的向量
	 * points1 - {<Aqsc.Point>} 直线1上的任意一点
	 * points2 - {<Aqsc.Point>} 直线2上的任意一点
	 *
	 * Returns:
	 * {Array(<Aqsc.Point>)} 返回交点
	 */
	_calculateIntersection: function(v_1, v_2, point1, point2) {
		//定义交点的坐标
		var x;
		var y;
		//如果向量v_1和v_2平行
		if(v_1.y * v_2.x - v_1.x * v_2.y == 0) {
			//平行也有两种情况
			//同向
			if(v_1.x * v_2.x > 0 || v_1.y * v_2.y > 0) {
				//同向直接取两个点的中点
				x = (point1.x + point2.x) / 2;
				y = (point1.y + point2.y) / 2;
			}
			//反向
			else {
				//如果反向直接返回后面的点位置
				x = point2.x;
				y = point2.y;
			}
		} else {
			//
			x = (v_1.x * v_2.x * (point2.y - point1.y) + point1.x * v_1.y * v_2.x - point2.x * v_2.y * v_1.x) / (v_1.y * v_2.x - v_1.x * v_2.y);
			if(v_1.x != 0) {
				y = (x - point1.x) * v_1.y / v_1.x + point1.y;
			}
			//不可能v_1.x和v_2.x同时为0
			else {
				y = (x - point2.x) * v_2.y / v_2.x + point2.y;
			}
		}
		return new Aqsc.Point(x, y);
	},
	_GetBezierGap : function(a, c) {
		var e = 0;
		for (var d = 1; d < 4; d++) {
			if (Math.abs(a[c + d].x - a[c + d - 1].x) > e) {
				e = Math.abs(a[c + d].x - a[c + d - 1].x)
			}
			if (Math.abs(a[c + d].y - a[c + d - 1].y) > e) {
				e = Math.abs(a[c + d].y - a[c + d - 1].y)
			}
		}
		return e
	},
	_InciseBezier : function(c, d, f) {
		var a = [];
		a[0] = [];
		a[1] = [];
		a[2] = [];
		var e;
		for (e = 0; e < 3; e++) {
			a[0][e] = new Aqsc.Point;
			a[0][e].x = (c[d + e].x + c[d + e + 1].x) / 2;
			a[0][e].y = (c[d + e].y + c[d + e + 1].y) / 2
		}
		for (e = 0; e < 2; e++) {
			a[1][e] = new Aqsc.Point;
			a[1][e].x = (a[0][e].x + a[0][e + 1].x) / 2;
			a[1][e].y = (a[0][e].y + a[0][e + 1].y) / 2
		}
		a[2][0] = new Aqsc.Point;
		a[2][0].x = (a[1][0].x + a[1][1].x) / 2;
		a[2][0].y = (a[1][0].y + a[1][1].y) / 2;
		f[0] = c[d];
		f[1] = a[0][0];
		f[2] = a[1][0];
		f[3] = a[2][0];
		f[4] = a[1][1];
		f[5] = a[0][2];
		f[6] = c[d + 3];
		return true
	},
	_createBezier1:function(p, l, a) {
		if (a) {
			return this._createBezier3(p, a);
		}
		var c = [];
		for (var e = 0; e < p.length; e++) {
			c[e] = p[e]
		}
		var h;
		var f;
		var g = 0;
		var q;
		var n = c.length;
		var d = [];
		var o = true;
		while (o) {
			q = true;
			for (h = 0; h < n - 3; h += 3) {
				if (this._GetBezierGap(c, h) > l) {
					q = false;
					this._InciseBezier(c, h, d);
					c.splice(h + 1, 2);
					for (f = 0; f < 5; f++) {
						c.splice(h + 1 + f, 0, d[f + 1])
					}
					h -= 3;
					n = c.length;
				}
				if (q) {
					break
				}
			}
			while (g < n - 1) {
				if (c[g] === c[g + 1]) {
					c.splice(g + 1, 1);
					n--
				}
				g++
			}
			o = false
		}
		return c;
//		return new HX.Geometry.LineString(c);
	},
	/**
	 * 二维贝塞尔曲线
	 * @param {Array<Aqsc.Point>} points
	 * @param {Number} part 平滑度。取值越大，曲线越平滑
	 */
	_createBezier2: function(m, a) {
		if(!a) {
			a = 20
		}
		var c = [];
		var e = 0.05;
		if(a > 0) {
			e = 1 / a
		}
		for(var g = 0; g < m.length - 2;) {
			var d = m[g];
			var p = m[g + 1];
			var l = m[g + 2];
			c.push(d);
			for(var o = 0; o < 1;) {
				var j = (1 - o) * (1 - o) * d.x + 2 * o * (1 - o) * p.x + o * o * l.x;
				var h = (1 - o) * (1 - o) * d.y + 2 * o * (1 - o) * p.y + o * o * l.y;
				var k = new Aqsc.Point(j, h);
				c.push(k);
				o += e
			}
			g += 2;
			if(g >= m.length) {
				c.push(d)
			}
		}
		var f = c[c.length - 1];
		var n = m[m.length - 1];
		if(!f.equals(n)) {
			c.push(n.clone())
		}
		return c;
	},
	_createBezier3: function(o, a) {
		if(!a) {
			a = 20
		}
		var c = [];
		var e = 0.05;
		if(a > 0) {
			e = 1 / a
		}
		for(var g = 0; g < o.length - 3;) {
			var d = o[g];
			var j = o[g + 1];
			var h = o[g + 2];
			var n = o[g + 3];
			c.push(d);
			for(var q = 0; q < 1;) {
				var l = (1 - q) * (1 - q) * (1 - q) * d.x + 3 * q * (1 - q) * (1 - q) * j.x + 3 * q * q * (1 - q) * h.x + q * q * q * n.x;
				var k = (1 - q) * (1 - q) * (1 - q) * d.y + 3 * q * (1 - q) * (1 - q) * j.y + 3 * q * q * (1 - q) * h.y + q * q * q * n.y;
				var m = new Aqsc.Point(l, k);
				c.push(m);
				q += e
			}
			g += 3;
			if(g >= o.length) {
				c.push(d)
			}
		}
		var f = c[c.length - 1];
		var p = o[o.length - 1];
		if(!f.equals(p)) {
			c.push(p.clone())
		}
		return c;
	},
	_createCloseCardinal: function(x) {
		if(x == null || x.length < 3) {
			return x
		}
		var p = x[0];
		x.push(p);
		var y = x;
		var j = [];
		var q = 0.4;
		var C = 0.5;
		var z = 0.005;
		var v = y.length - 1;
		for(var w = 0; w <= v - 1; w++) {
			if(w == v - 1) {
				var g = y[v - 1];
				var f = y[0];
				var d = y[1]
			} else {
				var g = y[w];
				var f = y[w + 1];
				var d = y[w + 2]
			}
			var m = new Aqsc.Point(0,0);
			var h = new Aqsc.Point(0,0);
			var A = new Aqsc.Point(f.x - g.x, f.y - g.y);
			var a = new Aqsc.Point(d.x - f.x, d.y - f.y);
			var u = Math.sqrt(A.x * A.x + A.y * A.y);
			var D = Math.sqrt(a.x * a.x + a.y * a.y);
			var s = new Aqsc.Point(A.x / u, A.y / u);
			var l = new Aqsc.Point(a.x / D, a.y / D);
			var B = new Aqsc.Point(s.x + l.x, s.y + l.y);
			var c = Math.sqrt(B.x * B.x + B.y * B.y);
			var r = new Aqsc.Point(B.x / c, B.y / c);
			var o = (s.x * l.x + s.y * l.y) / 1;
			if(Math.abs(1 - o) < z) {
				m.x = f.x - l.x * u * q;
				m.y = f.y - l.y * u * q;
				h.x = f.x + s.x * D * q;
				h.y = f.y + s.y * D * q
			} else {
				m.x = f.x - r.x * u * q;
				m.y = f.y - r.y * u * q;
				h.x = f.x + r.x * D * q;
				h.y = f.y + r.y * D * q
			}
			if(w == v - 1) {
				j[0] = f;
				j[1] = h;
				j[(v - 2) * 3 + 2 + 3] = m;
				j[(v - 2) * 3 + 2 + 4] = y[v]
			} else {
				j[w * 3 + 2 + 0] = m;
				j[w * 3 + 2 + 1] = f;
				j[w * 3 + 2 + 2] = h
			}
		}
		return j;
	},
	/**
	 * Method: _calculateAngularBisector
	 * 计算两个向量的角平分线向量
	 *
	 * Parameters:
	 * v1 - {<Aqsc.Point>} 向量1
	 * v2 - {<Aqsc.Point>} 向量2
	 *
	 * Returns:
	 * {Array(<Aqsc.Point>)} 返回角平分线向量
	 */
	_calculateAngularBisector: function(v1, v2) {
		//计算角平分线的思想是取两个向量的单位向量，然后相加
		var d1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
		var d2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
		return new Aqsc.Point(v1.x / d1 + v2.x / d2, v1.y / d1 + v2.y / d2);
	},
	_calculateTwoPoints: function(tmp) {
		var controlPois = tmp.points_xy;
		var _tailRatio = 5; //箭头起始两个节点长度与箭头尾巴的比值,这个参数也可以放到options中
		var _ratio = 6; //箭头长度与宽度的比值，箭头三角形需要占用总长度的1/_ratio,这个参数也可以放到options中
		var allPoint = []; //图形点集合
		switch(tmp.type) {
			case "wjt": //尾箭头
			case "zjt": //直箭头
				//var controlPois = tmp.points_xy;
				//取出第一和第二两个点
				var pointS = controlPois[0];
				var pointE = controlPois[1];
				//计算箭头总长度，即两个控制点的距离
				var l = Math.sqrt((pointE.y - pointS.y) * (pointE.y - pointS.y) + (pointE.x - pointS.x) * (pointE.x - pointS.x));
				//计算燕尾直箭头的宽
				var w = l / _ratio;

				//计算三角形的底边中心点坐标
				var x_ = pointS.x + (pointE.x - pointS.x) * (_ratio - 1) / _ratio;
				var y_ = pointS.y + (pointE.y - pointS.y) * (_ratio - 1) / _ratio;
				//计算与基本向量夹角90度的，长度为w/2的向量数组
				var v_lr = tmp._calculateVector(new Aqsc.Point(pointE.x - pointS.x, pointE.y - pointS.y), Math.PI / 2, w / 2);
				//获取左右向量
				var v_l = v_lr[0];
				var v_r = v_lr[1];
				//左1点
				var point1 = new Aqsc.Point(pointS.x + v_l.x, pointS.y + v_l.y);
				//左2点
				var point2 = new Aqsc.Point(x_ + point1.x - pointS.x, y_ + point1.y - pointS.y);
				//左3点
				var point3 = new Aqsc.Point(2 * point2.x - x_, 2 * point2.y - y_);
				//顶点
				var point4 = new Aqsc.Point(pointE.x, pointE.y);
				//右3点
				var point7 = new Aqsc.Point(pointS.x + v_r.x, pointS.y + v_r.y);
				//右2点
				var point6 = new Aqsc.Point(x_ + point7.x - pointS.x, y_ + point7.y - pointS.y);
				//右1点
				var point5 = new Aqsc.Point(2 * point6.x - x_, 2 * point6.y - y_);
				//在尾部两个中间插入一个点，是pointS往pointE平移的一个点，为了制作尾巴的效果
				var point_tail = new Aqsc.Point((pointE.x - pointS.x) / _tailRatio + pointS.x, (pointE.y - pointS.y) / _tailRatio + pointS.y);
				//所有点
				if(tmp.type == "wjt") { // 尾箭头
					allPoint = [point_tail, point1, point2, point3, point4, point5, point6, point7];
				} else { // 直箭头
					allPoint = [point1, point2, point3, point4, point5, point6, point7];
				}
				break;
			case "zwjt": //自定义尾箭头
				//取出首尾两个点
				var pointS = controlPois[0];
				var pointE = controlPois[1];
				//计算箭头总长度
				var l = Math.sqrt((pointE.y - pointS.y) * (pointE.y - pointS.y) + (pointE.x - pointS.x) * (pointE.x - pointS.x));
				//计算直箭头的宽
				var w = l / _ratio;

				//计算三角形的底边中心点坐标
				var x_ = pointS.x + (pointE.x - pointS.x) * (_ratio - 1) / _ratio;
				var y_ = pointS.y + (pointE.y - pointS.y) * (_ratio - 1) / _ratio;
				var point_o = new Aqsc.Point(x_, y_);

				//计算
				var v_lr_ = tmp._calculateVector(new Aqsc.Point(pointE.x - pointS.x, pointE.y - pointS.y), Math.PI / 2, w / 2);
				//获取左边尾部向量
				var v_l_ = v_lr_[0];
				//获取右边尾部向量
				var v_r_ = v_lr_[1];
				//获取左边尾部点
				var point_l = new Aqsc.Point(v_l_.x + pointS.x, v_l_.y + pointS.y);
				//获取右边尾部点
				var point_r = new Aqsc.Point(v_r_.x + pointS.x, v_r_.y + pointS.y);
				//在尾部两个中间插入一个点，是pointS往pointE平移的一个点，为了制作尾巴的效果
				var point_tail = new Aqsc.Point((pointE.x - pointS.x) / _tailRatio + pointS.x, (pointE.y - pointS.y) / _tailRatio + pointS.y);

				var point_h_l = new Aqsc.Point(v_l_.x / _ratio + x_, v_l_.y / _ratio + y_);
				var point_h_r = new Aqsc.Point(v_r_.x / _ratio + x_, v_r_.y / _ratio + y_);

				//计算三角形左边点
				var point_a_l = new Aqsc.Point(point_h_l.x * 2 - point_h_r.x, point_h_l.y * 2 - point_h_r.y);
				//计算三角形右边点
				var point_a_r = new Aqsc.Point(point_h_r.x * 2 - point_h_l.x, point_h_r.y * 2 - point_h_l.y);
				//所有点
				allPoint = [point_tail, point_l, point_h_l, point_a_l, pointE, point_a_r, point_h_r, point_r];
				break;
			case "djt": //单线箭头
				break;
			case "sjt": //双箭头
				break;
			case "jhq": //集合区
				break;
			case "qxqz": //曲线旗帜
				break;
			case "jxqz": //矩形旗帜
				break;
			case "sjqz": //三角旗帜
				break;
			default:
				break;
		}
		// 往结果集中添加
		tmp.pointsResult_xy.push.apply(tmp.pointsResult_xy, allPoint);
		
		if(tmp.map.map) {
			var pts = [];
			for(var i = 0; i < tmp.pointsResult_xy.length; i++) {
				var pt = new Aqsc.Point(tmp.pointsResult_xy[i].x, tmp.pointsResult_xy[i].y);
				pts.push(pt);
			}
			tmp.movePolygon = new Aqsc.Polygon(pts, tmp.layerStyle);
			tmp.movePolygon.addToMap();
			tmp.movePolygon.polygon.editVertexs = tmp.points_xy;// 设置edit顶点vertexs
			tmp.movePolygon.polygon.vertexs = tmp.pointsResult_xy;// 设置顶点vertexs
			tmp.movePolygon.polygon.vertexType = "two";
			//tmp.shape为setStyle作准备
			tmp.shape = tmp.movePolygon.polygon;
//			tmp.shape.addTo(tmp.map.map);
		} else {
			var latlngs = [];
			for(var i = 0; i < tmp.pointsResult_xy.length; i++) {
				var latlng = [tmp.pointsResult_xy[i].y, tmp.pointsResult_xy[i].x];
				latlngs.push(latlng);
			}
			tmp.movePolygon = L.polygon(latlngs, tmp.layerStyle);
			tmp.movePolygon.addTo(tmp.map);
			tmp.movePolygon.editVertexs = tmp.points_xy;// 设置edit顶点vertexs
			tmp.movePolygon.vertexs = tmp.pointsResult_xy;// 设置顶点vertexs
			tmp.movePolygon.vertexType = "two";
			//tmp.shape为setStyle作准备
			tmp.shape = tmp.movePolygon;
//			tmp.shape.addTo(tmp.map);
		}
		return tmp.pointsResult_xy;
	},
	_calculateMorePoints: function(tmp) {
		var controlPois = tmp.points_xy;
		var _tailRatio = 5; //箭头起始两个节点长度与箭头尾巴的比值
		var _ratio = 6; //箭头长度与宽度的比值，箭头三角形需要占用总长度的1/_ratio
		var pointsR = []; //图形点集合
		switch(tmp.type) {
			case "wjt": //尾箭头
			case "zjt": //直箭头
				//计算箭头总长度
				var l = 0;
				//计算燕尾直箭头的宽
				var w = 0;
				//在尾部两个中间插入一个点，是pointS往pointE平移的一个点，为了制作尾巴的效果
				var point_tail;
				for(var i = 0; i < controlPois.length - 1; i++) {
					//取出首尾两个点
					var pointS = controlPois[i];
					var pointE = controlPois[i + 1];
					l += Math.sqrt((pointE.y - pointS.y) * (pointE.y - pointS.y) + (pointE.x - pointS.x) * (pointE.x - pointS.x));
					if(tmp.type == "wjt" && i == 0) {
						// if(i == 0) {
							point_tail = new Aqsc.Point((pointE.x - pointS.x) / _tailRatio + pointS.x, (pointE.y - pointS.y) / _tailRatio + pointS.y);
						// }
					}
				}
				w = l / _ratio;
				//定义左右控制点集合
				var points_C_l = [];
				var points_C_r = [];
				//定义尾部左右的起始点
				var point_t_l = null;
				var point_t_r = null;
				//计算中间的所有交点
				for(var j = 0; j < controlPois.length - 2; j++) {
					var pointU_1 = controlPois[j]; //第一个用户传入的点
					var pointU_2 = controlPois[j + 1]; //第二个用户传入的点
					var pointU_3 = controlPois[j + 2]; //第三个用户传入的点

					//计算向量
					var v_U_1_2 = new Aqsc.Point(pointU_2.x - pointU_1.x, pointU_2.y - pointU_1.y);
					var v_U_2_3 = new Aqsc.Point(pointU_3.x - pointU_2.x, pointU_3.y - pointU_2.y);

					var v_lr_1_2 = tmp._calculateVector(v_U_1_2, Math.PI / 2, w / 2);
					var v_l_1_2 = v_lr_1_2[0];
					var v_r_1_2 = v_lr_1_2[1];
					var v_lr_2_3 = tmp._calculateVector(v_U_2_3, Math.PI / 2, w / 2);
					var v_l_2_3 = v_lr_2_3[0];
					var v_r_2_3 = v_lr_2_3[1];
					//获取左右
					var point_l_1 = new Aqsc.Point(pointU_1.x + v_l_1_2.x, pointU_1.y + v_l_1_2.y);
					var point_r_1 = new Aqsc.Point(pointU_1.x + v_r_1_2.x, pointU_1.y + v_r_1_2.y);
					var point_l_2 = new Aqsc.Point(pointU_2.x + v_l_2_3.x, pointU_2.y + v_l_2_3.y);
					var point_r_2 = new Aqsc.Point(pointU_2.x + v_r_2_3.x, pointU_2.y + v_r_2_3.y);
					//向量v_U_1_2和向量v-point_l_1和point_r_1是平行的
					//如果向量a=(x1，y1)，b=(x2，y2)，则a//b等价于x1y2－x2y1=0
					//得到(x-point_l_1.x)*v_U_1_2.y=v_U_1_2.x*(y-point_l_1.y)
					//得到(point_l_2.x-x)*v_U_2_3.y=v_U_2_3.x*(point_l_2.y-y)
					//可以求出坐边的交点(x,y)，即控制点
					var point_C_l = tmp._calculateIntersection(v_U_1_2, v_U_2_3, point_l_1, point_l_2);
					var point_C_r = tmp._calculateIntersection(v_U_1_2, v_U_2_3, point_r_1, point_r_2);
					//定义中间的控制点
					var point_C_l_c;
					var point_C_r_c;
					if(j == 0) {
						//记录下箭头尾部的左右两个端点
						point_t_l = point_l_1;
						point_t_r = point_r_1;
						//计算第一个曲线控制点
						point_C_l_c = new Aqsc.Point((point_t_l.x + point_C_l.x) / 2, (point_t_l.y + point_C_l.y) / 2);
						point_C_r_c = new Aqsc.Point((point_t_r.x + point_C_r.x) / 2, (point_t_r.y + point_C_r.y) / 2);
						//添加两个拐角控制点中间的中间控制点
						points_C_l.push(point_C_l_c);
						points_C_r.push(point_C_r_c);
					} else {
						//获取前一个拐角控制点
						var point_C_l_q = points_C_l[points_C_l.length - 1];
						var point_C_r_q = points_C_r[points_C_r.length - 1];
						//计算两个拐角之间的中心控制点
						point_C_l_c = new Aqsc.Point((point_C_l_q.x + point_C_l.x) / 2, (point_C_l_q.y + point_C_l.y) / 2);
						point_C_r_c = new Aqsc.Point((point_C_r_q.x + point_C_r.x) / 2, (point_C_r_q.y + point_C_r.y) / 2);
						//添加两个拐角控制点中间的中间控制点
						points_C_l.push(point_C_l_c);
						points_C_r.push(point_C_r_c);
					}
					//添加后面的拐角控制点
					points_C_l.push(point_C_l);
					points_C_r.push(point_C_r);
				}
				//计算

				//进入计算头部
				//计算一下头部的长度
				var pointU_E2 = controlPois[controlPois.length - 2]; //倒数第二个用户点
				var pointU_E1 = controlPois[controlPois.length - 1]; //最后一个用户点
				//
				var v_U_E2_E1 = new Aqsc.Point(pointU_E1.x - pointU_E2.x, pointU_E1.y - pointU_E2.y);
				var head_d = Math.sqrt(v_U_E2_E1.x * v_U_E2_E1.x + v_U_E2_E1.y * v_U_E2_E1.y);
				//定义头部的左右两结束点
				var point_h_l;
				var point_h_r;

				//头部左右两向量数组
				var v_lr_h = [];
				var v_l_h = null;
				var v_r_h = null;
				//定义曲线最后一个控制点，也就是头部结束点和最后一个拐角点的中点
				var point_C_l_e = null;
				var point_C_r_e = null;
				//定义三角形的左右两个点
				var point_triangle_l = null;
				var point_triangle_r = null;

				//获取当前的最后的控制点，也就是之前计算的拐角点
				var point_C_l_eq = points_C_l[points_C_l.length - 1];
				var point_C_r_eq = points_C_r[points_C_r.length - 1];

				//三角的高度都不够
				if(head_d <= w) {
					v_lr_h = tmp._calculateVector(v_U_E2_E1, Math.PI / 2, w / 2);
					v_l_h = v_lr_h[0];
					v_r_h = v_lr_h[1];
					//获取头部的左右两结束点
					point_h_l = new Aqsc.Point(pointU_E2.x + v_l_h.x, pointU_E2.y + v_l_h.y);
					point_h_r = new Aqsc.Point(pointU_E2.x + v_r_h.x, pointU_E2.y + v_r_h.y);

					//计算最后的控制点
					point_C_l_e = new Aqsc.Point((point_C_l_eq.x + point_h_l.x) / 2, (point_C_l_eq.y + point_h_l.y) / 2);
					point_C_r_e = new Aqsc.Point((point_C_r_eq.x + point_h_r.x) / 2, (point_C_r_eq.y + point_h_r.y) / 2);

					//添加最后的控制点（中心点）
					points_C_l.push(point_C_l_e);
					points_C_r.push(point_C_r_e);

					//计算三角形的左右两点
					point_triangle_l = new Aqsc.Point(2 * point_h_l.x - pointU_E2.x, 2 * point_h_l.y - pointU_E2.y);
					point_triangle_r = new Aqsc.Point(2 * point_h_r.x - pointU_E2.x, 2 * point_h_r.y - pointU_E2.y);
				}
				//足够三角的高度
				else {
					//由于够了三角的高度，所以首先去掉三角的高度

					//计算向量
					var v_E2_E1 = new Aqsc.Point(pointU_E1.x - pointU_E2.x, pointU_E1.y - pointU_E2.y);
					//取模
					var v_E2_E1_d = Math.sqrt(v_E2_E1.x * v_E2_E1.x + v_E2_E1.y * v_E2_E1.y);
					//首先需要计算三角形的底部中心点
					var point_c = new Aqsc.Point(pointU_E1.x - v_E2_E1.x * w / v_E2_E1_d, pointU_E1.y - v_E2_E1.y * w / v_E2_E1_d);
					//计算出在三角形上底边上头部结束点

					v_lr_h = tmp._calculateVector(v_U_E2_E1, Math.PI / 2, w / 2);
					v_l_h = v_lr_h[0];
					v_r_h = v_lr_h[1];
					//获取头部的左右两结束点
					point_h_l = new Aqsc.Point(point_c.x + v_l_h.x, point_c.y + v_l_h.y);
					point_h_r = new Aqsc.Point(point_c.x + v_r_h.x, point_c.y + v_r_h.y);

					//计算最后的控制点
					point_C_l_e = new Aqsc.Point((point_C_l_eq.x + point_h_l.x) / 2, (point_C_l_eq.y + point_h_l.y) / 2);
					point_C_r_e = new Aqsc.Point((point_C_r_eq.x + point_h_r.x) / 2, (point_C_r_eq.y + point_h_r.y) / 2);

					//添加最后的控制点（中心点）
					points_C_l.push(point_C_l_e);
					points_C_r.push(point_C_r_e);

					//计算三角形的左右点
					point_triangle_l = new Aqsc.Point(2 * point_h_l.x - point_c.x, 2 * point_h_l.y - point_c.y);
					point_triangle_r = new Aqsc.Point(2 * point_h_r.x - point_c.x, 2 * point_h_r.y - point_c.y);
				}

				//使用控制点计算差值
				//计算贝塞尔的控制点
				var points_BC_l = tmp._createBezier2(points_C_l);
				var points_BC_r = tmp._createBezier2(points_C_r);
				//组合左右点集和三角形三个点
				pointsR = [point_t_l];
				//首先连接左边的差值曲线
				pointsR = pointsR.concat(points_BC_l);
				//添加左边头部结束点
				pointsR.push(point_h_l);
				//添加三角形左边点
				pointsR.push(point_triangle_l);
				//添加三角形顶点
				pointsR.push(pointU_E1);
				//添加三角形右边点
				pointsR.push(point_triangle_r);
				//添加右边头部结束点
				pointsR.push(point_h_r);
				//合并右边的所有点（先把右边的点倒序）
				pointsR = pointsR.concat(points_BC_r.reverse());

				//添加右边尾部起始点
				pointsR.push(point_t_r);
				if(tmp.type == "wjt") {
					//添加尾巴点
					pointsR.push(point_tail);
				}
				break;
			case "zwjt": //自定义尾箭头
				//计算箭头总长度
				var l = 0;
				//计算直箭头的宽
				var w = 0;
				//在尾部两个中间插入一个点，是pointS往pointE平移的一个点，为了制作尾巴的效果
				var point_tail;
				for(var i = 0; i < controlPois.length - 1; i++) {
					//取出首尾两个点
					var pointS = controlPois[i];
					var pointE = controlPois[i + 1];
					l += Math.sqrt((pointE.y - pointS.y) * (pointE.y - pointS.y) + (pointE.x - pointS.x) * (pointE.x - pointS.x));
					if(i == 0) {
						point_tail = new Aqsc.Point((pointE.x - pointS.x) / _tailRatio + pointS.x, (pointE.y - pointS.y) / _tailRatio + pointS.y);
					}
				}
				w = l / _ratio;

				var a = Math.atan(w / (2 * l));

				//定义左右控制点集合
				var points_C_l = [];
				var points_C_r = [];
				//定义尾部左右的起始点
				var point_t_l = null;
				var point_t_r = null;

				//计算中间的所有交点
				for(var j = 0; j < controlPois.length - 2; j++) {
					var pointU_1 = controlPois[j]; //第一个用户传入的点
					var pointU_2 = controlPois[j + 1]; //第二个用户传入的点
					var pointU_3 = controlPois[j + 2]; //第三个用户传入的点

					//计算向量
					var v_U_1_2 = new Aqsc.Point(pointU_2.x - pointU_1.x, pointU_2.y - pointU_1.y);
					var v_U_2_3 = new Aqsc.Point(pointU_3.x - pointU_2.x, pointU_3.y - pointU_2.y);

					//定义左边第一个控制点
					var point_l_1 = null;
					//定义右边第一个控制点
					var point_r_1 = null;
					//如果j=0时，左右第一个控制点需要计算
					if(j == 0) {
						var v_lr_ = tmp._calculateVector(v_U_1_2, Math.PI / 2, w / 2);
						//获取左边尾部点
						var v_l_ = v_lr_[0];
						//获取右边尾部点
						var v_r_ = v_lr_[1];
						//获取左边尾部点
						point_t_l = point_l_1 = new Aqsc.Point(v_l_.x + pointU_1.x, v_l_.y + pointU_1.y);
						//获取右边尾部点
						point_t_r = point_r_1 = new Aqsc.Point(v_r_.x + pointU_1.x, v_r_.y + pointU_1.y);
					}
					//否则获取上一次的记录
					else {
						point_l_1 = points_C_l[points_C_l.length - 1];
						point_r_1 = points_C_r[points_C_r.length - 1];
					}
					var v_lr = tmp._calculateVector(v_U_1_2, a, 1);
					//这里的向量需要反过来
					//获取左边向量
					var v_l = v_lr[1];
					//获取右边向量
					var v_r = v_lr[0];
					//定义角平分线向量
					var v_angularBisector = tmp._calculateAngularBisector(new Aqsc.Point(-v_U_1_2.x, -v_U_1_2.y), v_U_2_3);
					//求交点
					//计算左边第二个控制点
					var point_l_2 = tmp._calculateIntersection(v_l, v_angularBisector, point_l_1, pointU_2);
					var point_r_2 = tmp._calculateIntersection(v_r, v_angularBisector, point_r_1, pointU_2);

					//添加后面的拐角控制点
					points_C_l.push(new Aqsc.Point((point_l_1.x + point_l_2.x) / 2, (point_l_1.y + point_l_2.y) / 2));
					points_C_l.push(point_l_2);
					points_C_r.push(new Aqsc.Point((point_r_1.x + point_r_2.x) / 2, (point_r_1.y + point_r_2.y) / 2));
					points_C_r.push(point_r_2);
				}

				//进入计算头部
				//计算一下头部的长度
				var pointU_E2 = controlPois[controlPois.length - 2]; //倒数第二个用户点
				var pointU_E1 = controlPois[controlPois.length - 1]; //最后一个用户点
				var head_d = Math.sqrt((pointU_E2.x - pointU_E1.x) * (pointU_E2.x - pointU_E1.x) + (pointU_E2.y - pointU_E1.y) * (pointU_E2.y - pointU_E1.y));
				//定义头部的左右两结束点
				var point_h_l = null;
				var point_h_r = null;
				//三角形左右两点数组
				var point_lr_t = [];
				//定义曲线最后一个控制点，也就是头部结束点和最后一个拐角点的中点
				var point_C_l_e = null;
				var point_C_r_e = null;
				//定义三角形的左右两个点
				var point_triangle_l = null;
				var point_triangle_r = null;

				//获取当前的最后的控制点，也就是之前计算的拐角点
				var point_C_l_eq = points_C_l[points_C_l.length - 1];
				var point_C_r_eq = points_C_r[points_C_r.length - 1];
				//申明三角形的两边向量
				var v_l_t = null;
				var v_r_t = null;
				//三角的高度都不够
				if(head_d <= w) {
					point_lr_t = tmp._calculateVector(new Aqsc.Point(pointU_E1.x - pointU_E2.x, pointU_E1.y - pointU_E2.y), Math.PI / 2, w / 2);
					//获取三角形左右两个向量
					v_l_t = point_lr_t[0];
					v_r_t = point_lr_t[1];

					point_h_l = new Aqsc.Point(v_l_t.x / _ratio + pointU_E2.x, v_l_t.y / _ratio + pointU_E2.y);
					point_h_r = new Aqsc.Point(v_r_t.x / _ratio + pointU_E2.x, v_r_t.y / _ratio + pointU_E2.y);
					//计算三角形的左右两点
					point_triangle_l = new Aqsc.Point(point_h_l.x * 2 - point_h_r.x, point_h_l.y * 2 - point_h_r.y);
					point_triangle_r = new Aqsc.Point(point_h_r.x * 2 - point_h_l.x, point_h_r.y * 2 - point_h_l.y);

					//计算最后的控制点
					point_C_l_e = new Aqsc.Point((point_C_l_eq.x + point_h_l.x) / 2, (point_C_l_eq.y + point_h_l.y) / 2);
					point_C_r_e = new Aqsc.Point((point_C_r_eq.x + point_h_r.x) / 2, (point_C_r_eq.y + point_h_r.y) / 2);

					//添加最后的控制点（中心点）
					points_C_l.push(point_C_l_e);
					points_C_r.push(point_C_r_e);

				}
				//足够三角的高度
				else {
					//由于够了三角的高度，所以首先去掉三角的高度

					//计算向量
					var v_E2_E1 = new Aqsc.Point(pointU_E1.x - pointU_E2.x, pointU_E1.y - pointU_E2.y);
					//取模
					var v_E2_E1_d = Math.sqrt(v_E2_E1.x * v_E2_E1.x + v_E2_E1.y * v_E2_E1.y);
					//首先需要计算三角形的底部中心点
					var point_c = new Aqsc.Point(pointU_E1.x - v_E2_E1.x * w / v_E2_E1_d, pointU_E1.y - v_E2_E1.y * w / v_E2_E1_d); //TODO

					//计算出在三角形上底边上头部结束点
					point_lr_t = tmp._calculateVector(new Aqsc.Point(pointU_E1.x - point_c.x, pointU_E1.y - point_c.y), Math.PI / 2, w / 2);
					//获取三角形左右两个向量
					v_l_t = point_lr_t[0];
					v_r_t = point_lr_t[1];

					point_h_l = new Aqsc.Point(v_l_t.x / _ratio + point_c.x, v_l_t.y / _ratio + point_c.y);
					point_h_r = new Aqsc.Point(v_r_t.x / _ratio + point_c.x, v_r_t.y / _ratio + point_c.y);
					//计算三角形的左右两点
					point_triangle_l = new Aqsc.Point(point_h_l.x * 2 - point_h_r.x, point_h_l.y * 2 - point_h_r.y);
					point_triangle_r = new Aqsc.Point(point_h_r.x * 2 - point_h_l.x, point_h_r.y * 2 - point_h_l.y);

					//计算最后的控制点
					point_C_l_e = new Aqsc.Point((point_C_l_eq.x + point_h_l.x) / 2, (point_C_l_eq.y + point_h_l.y) / 2);
					point_C_r_e = new Aqsc.Point((point_C_r_eq.x + point_h_r.x) / 2, (point_C_r_eq.y + point_h_r.y) / 2);

					//添加最后的控制点（中心点）
					points_C_l.push(point_C_l_e);
					points_C_r.push(point_C_r_e);
				}
				//使用控制点计算差值
				//计算贝塞尔的控制点
				var points_BC_l = tmp._createBezier2(points_C_l);
				var points_BC_r = tmp._createBezier2(points_C_r);
				//组合左右点集和三角形三个点
				var pointsR = [point_t_l];
				//首先连接左边的差值曲线
				pointsR = pointsR.concat(points_BC_l);
				//添加左边头部结束点
				pointsR.push(point_h_l);
				//添加三角形左边点
				pointsR.push(point_triangle_l);
				//添加三角形顶点
				pointsR.push(pointU_E1);
				//添加三角形右边点
				pointsR.push(point_triangle_r);
				//添加右边头部结束点
				pointsR.push(point_h_r);
				//合并右边的所有点
				for(var k = points_BC_r.length - 1; k >= 0; k--) {
					pointsR.push(points_BC_r[k]);
				}
				//添加右边尾部起始点
				pointsR.push(point_t_r);
				//添加尾巴点
				pointsR.push(point_tail);
				break;
			case "djt": //单线箭头
				break;
			case "sjt": //双箭头
				break;
			case "jhq": //集合区
				break;
			case "qxqz": //曲线旗帜
				break;
			case "jxqz": //矩形旗帜
				break;
			case "sjqz": //三角旗帜
				break;
			default:
				break;
		}
		// 往结果集中添加
		tmp.pointsResult_xy.push.apply(tmp.pointsResult_xy, pointsR);
		
		if(this.map.map) { //aqsc平台
			var pts = [];
			for(var i = 0; i < tmp.pointsResult_xy.length; i++) {
				var pt = new Aqsc.Point(tmp.pointsResult_xy[i].x, tmp.pointsResult_xy[i].y);
				pts.push(pt);
			}
			tmp.movePolygon = new Aqsc.Polygon(pts, tmp.layerStyle);
			tmp.movePolygon.addToMap();
			tmp.movePolygon.polygon.editVertexs = tmp.points_xy;// 设置edit顶点vertexs
			tmp.movePolygon.polygon.vertexs = tmp.pointsResult_xy;// 设置顶点vertexs
			tmp.movePolygon.polygon.vertexType = "three";
			
			//tmp.shape为setStyle作准备
			tmp.shape = tmp.movePolygon.polygon;
//			tmp.shape.addTo(tmp.map.map);
//			setTimeout(function(){
//				tmp.movePolygon.polygon.addEventListener("click",function(e){
//					var edit = new L.Edit.PolyVerticesEdit(tmp.movePolygon.polygon,tmp.movePolygon.polygon._latlngs[0]);
//					edit.addHooks();
//					edit._initMarkers();
//				});
//			},1500);
		} else { // leaflet
			var latlngs = [];
			for(var i = 0; i < tmp.pointsResult_xy.length; i++) {
				var latlng = [tmp.pointsResult_xy[i].y, tmp.pointsResult_xy[i].x];
				latlngs.push(latlng);
			}
			tmp.movePolygon = L.polygon(latlngs, tmp.layerStyle);
			tmp.movePolygon.addTo(tmp.map);
			tmp.movePolygon.editVertexs = tmp.points_xy;// 设置edit顶点vertexs
			tmp.movePolygon.vertexs = tmp.pointsResult_xy;// 设置顶点vertexs
			tmp.movePolygon.vertexType = "three";
			//tmp.shape为setStyle作准备
			tmp.shape = tmp.movePolygon;
//			tmp.shape.addTo(tmp.map);
		}
		return tmp.pointsResult_xy;
	},
	setEditNodeSize:function(size){
		this.editSize = size;
	},
	onDrawSucceeded:function(fun){
		var tmp = this;
		if(tmp.map.map){//安全生产GIS平台
			tmp.map.map.on('draw:created', function(event) {
					if(!tmp.isCreate) {
						if(event.layer.toGeoJSON){
							event.geojson = event.layer.toGeoJSON();
							event.sourceTarget = tmp;
						}
						fun(event);
						tmp.isCreate = true;
					}
				});
		}else{
			tmp.map.on('draw:created', function(event) {
				if(!tmp.isCreate) {
					if(event.layer.toGeoJSON){
						event.geojson = event.layer.toGeoJSON();
					}
					fun(event);
					tmp.isCreate = true;
				}
			});
		}
	},
	/**
	 * 将经纬度坐标转换为像素坐标，对像素坐标做偏移，在转换为经纬度坐标返回
	 * @param {Array} cornerLatlng
	 * @param {Number} x
	 * @param {Number} y
	 */
	_translate: function(cornerLatlng, x, y) {
		var layerPt = null,latLng = null;
		if(this.map.map){
			layerPt = this.map.map.latLngToLayerPoint(cornerLatlng);
			layerPt.x = layerPt.x + x;
			layerPt.y = layerPt.y - y;
			latLng = this.map.map.layerPointToLatLng(layerPt);
		}else{
			layerPt = this.map.latLngToLayerPoint(cornerLatlng);
			layerPt.x = layerPt.x + x;
			layerPt.y = layerPt.y - y;
			latLng = this.map.layerPointToLatLng(layerPt);
		}
		return latLng;
	},
	enable: function() {
		this.points_xy = []; // 绘制图形构成中心线点
		this.pointsResult_xy = []; // 绘制图形结果点
		this.points_length = 0; // 绘制图形构成中心线点长度
		this.line_l; //单箭头时的左侧三角线
		this.line_r; //单箭头时的右侧三角线
		this.enabled = true;
		this.clickFlag = null;
		this.clickTimes = 1;
		this.isDoubleClick = false;
		this.isClickListener = false;
		this.editMouseout = false;
		if(this.map.map){
			this.container = this.map.map._container;
		}else{
			this.container = this.map._container;
		}
		this.container.style.cursor = "crosshair";
		var isDrag = false;
		var tmp = this;
		if(tmp.map.map){
			tmp.tip = new L.Draw.Tooltip(tmp.map.map);
		}else{
			tmp.tip = new L.Draw.Tooltip(tmp.map);
		}
		tmp.map.addEventListener("mousemove",function(e){
			if(tmp.type == "sjt"){
				tmp.tip.updateContent({
					text: "单击地图拖拉绘制",
				});
				tmp.tip.updatePosition(e.latlng);
			}else{
				tmp.tip.updatePosition(e.latlng);
				if(tmp.type == "wjt"||tmp.type == "zwjt"||
					tmp.type == "djt"||tmp.type == "zjt"){
					tmp.tip.updateContent({
						text: "单击地图拖拉绘制",
					});
				}else{
					tmp.tip.updateContent({
						text: "单击地图拖拉绘制，双击结束",
						//subtext:"我是中国人",
					});
				}
			}
		});
		this.map.addEventListener("mousedown", function(e) {
			if(tmp.clickFlag) {clearTimeout(tmp.clickFlag);}
			tmp.clickFlag = setTimeout(function() {
				if(tmp.clickTimes == 1 && !isDrag && tmp.enabled) { // 在移动结束后以及是单击事件时
					if(tmp.points_xy.length == 0) {
						tmp.points_xy.push(new Aqsc.Point(e.latlng.lng, e.latlng.lat));
					}
					tmp.points_length = tmp.points_xy.length;
					tmp.map.addEventListener("mousemove", function(e1) {
						// 清除
						if(tmp.map.map) { //Aqsc平台
							// 添加图形 ,可以不添加图形，双击结束绘制，通过isDoubleClick判断是否双击结束，
							// 双击结束后，再重新绘制，在mousemove事件不移除图形
							if(!tmp.isDoubleClick) {
								if(tmp.movePolygon){(tmp.movePolygon.remove());}
								// 单箭头部分
								if(tmp.line_l){(tmp.line_l.remove());}
								if(tmp.line_r){(tmp.line_r.remove());}
							}
						} else { //原始leaflet 
							if(!tmp.isDoubleClick) {
								if(tmp.movePolygon) {tmp.map.removeLayer(tmp.movePolygon);}
								// 单箭头部分
								if(tmp.line_l) {tmp.map.removeLayer(tmp.line_l);}
								if(tmp.line_r) {tmp.map.removeLayer(tmp.line_r);}
							}
						}
						// polyline 重新添加移动的点到点集合中
						var offsetLatLng = tmp._translate(e1.latlng,-15,-15);
						var movePt = new Aqsc.Point(offsetLatLng.lng, offsetLatLng.lat);
						if(!tmp.points_xy[tmp.points_length - 1].equals(movePt)) {
							tmp.points_xy[tmp.points_length] = movePt;
							if(tmp.type == "sjt"){
								tmp.tip.updatePosition(e1.latlng);
								if(tmp.points_xy.length > 3){
									tmp.tip.updateContent({
										text: "接着再点击地图绘制第二个箭头",
									});
								}else{
									if(tmp.points_xy.length > 2){
										tmp.tip.updateContent({
											text: "随后点击地图绘制第一个箭头",
										});
									}else{
										tmp.tip.updateContent({
											text: "再点击地图后拖动会生成一个图形",
										});
									}
								}
							}else{
								if(tmp.type == "wjt"||tmp.type == "zwjt"||
									tmp.type == "djt"||tmp.type == "zjt"){
									tmp.tip.updateContent({
										text: "单击地图拖拉继续绘制，双击地图结束绘制",
									});
								}
							}
						}
						tmp._calculateParts(tmp);
						tmp.isDoubleClick = false;
					});
				}
			}, 300);
		});
		tmp.map.addEventListener("dblclick", function(e0) {
			if(tmp.points_xy.length) {
				tmp.clickTimes = 2;
//				tmp.container.style.cursor = "";
				var tmpMovePolygon = null;
				if(tmp.map.map){//安全生产GIS平台
					if(tmp.movePolygon.polygon){
						tmpMovePolygon = tmp.movePolygon.polygon;
					}else{
						tmpMovePolygon = tmp.movePolygon.polyline;
					}
					tmp.map.map.fire('draw:created', {
			  			layer: tmp.shape,
			  			layerType: tmp.type
			  		});
				}else{//原生leaflet
					tmpMovePolygon = tmp.movePolygon;
					tmp.map.fire('draw:created', {
			  			layer: tmp.shape,
			  			layerType: tmp.type
			  		});
				}
				tmp.shape.type ="militaryPlot";
				tmp.shape.plotType = tmp.type;
				//点击编辑图形
				tmpMovePolygon.addEventListener("click",function(e){
					if(!tmp.isClickListener&&tmp.isEdit){
						switch (tmp.type){
							case "jxqz":
								tmp.edit = new Aqsc.MilitaryQzEdit(tmp.map,tmpMovePolygon,{"type":"jxqz","editSize":tmp.editSize},tmp.moveImgUrl);
								tmp.edit.initMarkers();
								break;
							case "qxqz":
								tmp.edit = new Aqsc.MilitaryQzEdit(tmp.map,tmpMovePolygon,{"type":"qxqz","editSize":tmp.editSize},tmp.moveImgUrl);
								tmp.edit.initMarkers();
								break;
							case "sjqz":
								tmp.edit = new Aqsc.MilitaryQzEdit(tmp.map,tmpMovePolygon,{"type":"sjqz","editSize":tmp.editSize},tmp.moveImgUrl);
								tmp.edit.initMarkers();
								break;
							case "wjt":
								tmp.edit = new Aqsc.MilitaryTxEdit(tmp.map,tmpMovePolygon,{"type":"wjt","editSize":tmp.editSize},tmp.moveImgUrl);
								tmp.edit.initMarkers();
								break;	
							case "zwjt":
								tmp.edit = new Aqsc.MilitaryTxEdit(tmp.map,tmpMovePolygon,{"type":"zwjt","editSize":tmp.editSize},tmp.moveImgUrl);
								tmp.edit.initMarkers();
								break;		
							case "zjt":
								tmp.edit = new Aqsc.MilitaryTxEdit(tmp.map,tmpMovePolygon,{"type":"zjt","editSize":tmp.editSize},tmp.moveImgUrl);
								tmp.edit.initMarkers();
								break;
							case "djt":
								tmp.edit = new Aqsc.MilitaryTxEdit(tmp.map,tmpMovePolygon,{"type":"djt","editSize":tmp.editSize},tmp.moveImgUrl);
								tmp.edit.initMarkers();
								//矢量编辑工具中的线编辑方法启用
//								var options = {
//							  		icon: new L.DivIcon({
//							  			iconSize: new L.Point(8, 8),
//							  			className: 'aqsc-div-icon aqsc-editing-icon'
//							  		}),
//							  		touchIcon: new L.DivIcon({
//							  			iconSize: new L.Point(8, 8),
//							  			className: 'aqsc-div-icon aqsc-editing-icon aqsc-touch-icon'
//							  		}),
//							  		drawError: {
//							  			color: '#b00b00',
//							  			timeout: 1000
//							  		}
//							  	}
//								tmp.edit = new L.Edit.PolyVerticesEdit(tmpMovePolygon,tmpMovePolygon.getLatLngs(),options);
//								tmp.edit.addHooks();
//								tmp.edit._initMarkers();
								break;			
							case "sjt":
								tmp.edit = new Aqsc.MilitaryTxEdit(tmp.map,tmpMovePolygon,{"type":"sjt","editSize":tmp.editSize});
								tmp.edit.initMarkers();
								break;
							case "jhq":
								tmp.edit = new Aqsc.MilitaryTxEdit(tmp.map,tmpMovePolygon,{"type":"jhq","editSize":tmp.editSize});
								tmp.edit.initMarkers();
								break;
							default:
								break;
						}
						tmp.isClickListener = true;
						tmp.editMouseout = false;
						//移出图形
						tmpMovePolygon.addEventListener("mouseout",function(e){
							//移除图形后点击地图
							tmp.map.addEventListener("click",function(e){
								if(tmp.editMouseout&&tmp.edit){
									tmp.edit.removeHooks();
									tmp.isClickListener = false;
								}
							});
							tmp.editMouseout = true;
						});
						//移动到图形
						tmpMovePolygon.addEventListener("mouseover",function(e){
							tmp.editMouseout = false;
						});
					}
				});
				tmp.shape.setStyle(tmp.layerStyle);
				/*设置填充样式*/
//				tmp._setPlotPolygonFillEffect(tmp,tmpMovePolygon);
				/*设置渐变样式*/
//				tmp._setPlotPolygonShadeEffect(tmp,tmpMovePolygon);
				// 移除事件
				tmp.map.removeEventListener("mousemove");
				setTimeout(function() {
					tmp.isDoubleClick = true;
					tmp.clickTimes = 1;
					tmp.points_xy = [];
					tmp.enabled = false;
					tmp.disable();
				}, 300);
			}
		});
		this.map.addEventListener("movestart", function(e) {
			isDrag = true;
		});
		this.map.addEventListener("moveend", function(e) {
			isDrag = false;
		});
	},
	disable: function() {
		this.enabled = false;
		this.map.removeEventListener("dblclick");
		if(!this.isDoubleClick&&this.movePolygon) {
			this.movePolygon.remove();//移除移动图形
		}
		this.map.removeEventListener("mousemove");//移除事件
		this.container.style.cursor = "";
		this.tip.dispose();
	},
	setStyle: function(style) {
		this.layerStyle = Aqsc.Util.mergeProperty(this.layerStyle,style);
		if(this.shape) {
//			var _style = {};
//			_style.color = style.color?style.color:this.shape.options.color;
//			_style.weight = style.weight?style.weight:this.shape.options.weight;
//			_style.opacity = style.opacity?style.opacity:this.shape.options.opacity;
//			if(this.fillEffect){//如果有填充效果
//				this.setStyleFillEffect(this.effect);
//			}else{
//				if(this.shadeEffect){//如果有阴影效果
//					//this.setStyleFillEffect(this.effect);
//				}else{
//					_style.fill = style.fill?style.fill:this.shape.options.fill;
//					_style.fillColor = style.fillColor?style.fillColor:this.shape.options.fillColor;
//				}
//			}
//			_style.fillOpacity = style.fillOpacity?style.color:this.shape.options.fillOpacity;
//			this.shape.setStyle(_style);
			this.shape.setStyle(this.layerStyle);
		}
	},
	/**
	 * 设置标绘图形的填充效果
	 * @param {Object} tmp
	 * @param {Object} tmpMovePolygon
	 */
	_setPlotPolygonFillEffect:function(tmp,tmpMovePolygon){
		if(tmp.fillEffect){
			var id = tmp.shape.options.id;
			tmpMovePolygon.setStyle({
				"fillColor": "url(#" + id + ")"
			});
			var mPlotParent = null;
			try{
				mPlotParent = document.getElementById(id+"_path").parentNode; //获取svg的位置
			}catch(err){
				console.log(err+"：请在leaflet源码svg类中得方法_initPath中添加path.id=layer.options.id!");
				return;
			}
			var pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
			pattern.setAttribute("id", id);
			pattern.setAttribute("patternUnits", "userSpaceOnUse");
			var rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			switch(tmp.effect){
				case "htw":
					pattern.setAttribute("width", 20);
					pattern.setAttribute("height", 4);
					
					rectangle.setAttribute("x", 0);
					rectangle.setAttribute("y", 1);
					rectangle.setAttribute("width", 2000);
					rectangle.setAttribute("height", 1);
					rectangle.setAttribute("fill", tmp.layerStyle.fillColor);
					pattern.appendChild(rectangle);
					break;
				case "stw":
					pattern.setAttribute("width", 4);
					pattern.setAttribute("height", 20);
					
					rectangle.setAttribute("x", 0);
					rectangle.setAttribute("y", 1);
					rectangle.setAttribute("width", 1);
					rectangle.setAttribute("height", 2000);
					rectangle.setAttribute("fill", tmp.layerStyle.fillColor);
					pattern.appendChild(rectangle);
					break;
				case "zxtw":
					pattern.setAttribute("width", 6);
					pattern.setAttribute("height", 6);
					
					path.setAttribute("d","M 6 0 L 6 0 L 0 6 z");
				    path.setAttribute("stroke-width","1");
				    path.setAttribute("stroke",tmp.layerStyle.fillColor);
				    pattern.appendChild(path);
					break;
				case "yxtw":
					pattern.setAttribute("width", 6);
					pattern.setAttribute("height", 6);
					
					path.setAttribute("d","M 0 0 L 0 0 L 100 100 z");
				    path.setAttribute("stroke-width","1");
				    path.setAttribute("stroke",tmp.layerStyle.color);
				    pattern.appendChild(path);
					break;
				default:break;	
			}
			mPlotParent.appendChild(pattern);
		}
	},
	/**
	 * 设置标绘图形渐变效果
	 * @param {Object} tmp
	 * @param {Object} tmpMovePolygon
	 */
	_setPlotPolygonShadeEffect:function(tmp,tmpMovePolygon){
		if(tmp.shadeEffect){
			var id = tmp.shape.options.id;
			tmpMovePolygon.setStyle({
				"fillColor": "url(#" + id + ")"
			});
			var mPlotParent = null;
			try{
				mPlotParent = document.getElementById(id+"_path").parentNode; //获取svg的位置
			}catch(err){
				console.log(err+"：请在leaflet源码svg类中得方法_initPath中添加path.id=layer.options.id!");
				return;
			}
			var linearGradient = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
			linearGradient.setAttribute("id", id);
			var stop1 = document.createElementNS('http://www.w3.org/2000/svg','stop');
			var stop2 = document.createElementNS('http://www.w3.org/2000/svg','stop');
			var amination = document.createElementNS('http://www.w3.org/2000/svg','animate');
			switch (tmp.effect){
				case "zdy"://从左到右
					if(tmp.styleShadeEffect.amination){
						linearGradient.setAttribute("x1","0%");
						linearGradient.setAttribute("y1","0%");
						linearGradient.setAttribute("x2","200%");
						linearGradient.setAttribute("y2","0%");
						stop1.setAttribute("offset","0%");
						stop1.setAttribute("style","stop-color:"+tmp.styleShadeEffect.jbColor1+";"+"stop-opacity:1");
						stop2.setAttribute("offset","10%");
						stop2.setAttribute("style","stop-color:"+tmp.styleShadeEffect.jbColor2+";"+"stop-opacity:1");
						amination.setAttribute('attributeName','offset');
						amination.setAttribute('values','0.1;0.2;0.3;0.40;0.5;0.60;0.7;0.80;0.9;1.0');
						amination.setAttribute('dur','2s');
						amination.setAttribute('repeatCount','indefinite');
						stop2.appendChild(amination);
						linearGradient.appendChild(stop1);
						linearGradient.appendChild(stop2);
					}else{
						linearGradient.setAttribute("x1","0%");
						linearGradient.setAttribute("y1","0%");
						linearGradient.setAttribute("x2","100%");
						linearGradient.setAttribute("y2","0%");
						stop1.setAttribute("offset","0%");
						stop1.setAttribute("style","stop-color:"+tmp.styleShadeEffect.jbColor1+";"+"stop-opacity:1");
						stop2.setAttribute("offset","100%");
						stop2.setAttribute("style","stop-color:"+tmp.styleShadeEffect.jbColor2+";"+"stop-opacity:1");
						linearGradient.appendChild(stop1);
						linearGradient.appendChild(stop2);
					}
					break;
				case "sdx"://从上到下
					if(tmp.styleShadeEffect.amination){
						linearGradient.setAttribute("x1","0%");
						linearGradient.setAttribute("y1","0%");
						linearGradient.setAttribute("x2","0%");
						linearGradient.setAttribute("y2","100%");
						stop1.setAttribute("offset","0%");
						stop1.setAttribute("style","stop-color:"+tmp.styleShadeEffect.jbColor1+";"+"stop-opacity:1");
						stop2.setAttribute("offset","10%");
						stop2.setAttribute("style","stop-color:"+tmp.styleShadeEffect.jbColor2+";"+"stop-opacity:1");
						amination.setAttribute('attributeName','offset');
						amination.setAttribute('values','0.1;0.2;0.3;0.40;0.5;0.60;0.7;0.80;0.9;1.0');
						amination.setAttribute('dur','2s');
						amination.setAttribute('repeatCount','indefinite');
						stop2.appendChild(amination);
						linearGradient.appendChild(stop1);
						linearGradient.appendChild(stop2);
					}else{
						linearGradient.setAttribute("x1","0%");
						linearGradient.setAttribute("y1","0%");
						linearGradient.setAttribute("x2","0%");
						linearGradient.setAttribute("y2","70%");
						stop1.setAttribute("offset","0%");
						stop1.setAttribute("style","stop-color:"+tmp.styleShadeEffect.jbColor1+";"+"stop-opacity:1");
						stop2.setAttribute("offset","100%");
						stop2.setAttribute("style","stop-color:"+tmp.styleShadeEffect.jbColor2+";"+"stop-opacity:1");
						linearGradient.appendChild(stop1);
						linearGradient.appendChild(stop2);
					}
					break;	
				default:
					break;
			}
			mPlotParent.appendChild(linearGradient);
		}
	},
	/**
	 * 设置填充效果
	 * @param {String} effect
	 */
	setStyleFillEffect:function(effect){
		var tmp = this;
		if(tmp.fillEffect){//绘制前已经设置，重新设置
			var pattern = document.getElementById(tmp.shape.options.id);
			var path = pattern.parentNode;
			var rectangle = pattern.childNodes[0];
			switch (effect){
				case "htw":
					pattern.setAttribute("width", 20);
					pattern.setAttribute("height", 4);
					
					rectangle.setAttribute("x", 0);
					rectangle.setAttribute("y", 1);
					rectangle.setAttribute("width", 2000);
					rectangle.setAttribute("height", 1);
					rectangle.setAttribute("fill", tmp.layerStyle.fillColor);
					break;
				case "stw":
					pattern.setAttribute("width", 4);
					pattern.setAttribute("height", 20);
					
					rectangle.setAttribute("x", 0);
					rectangle.setAttribute("y", 1);
					rectangle.setAttribute("width", 1);
					rectangle.setAttribute("height", 2000);
					rectangle.setAttribute("fill", tmp.layerStyle.fillColor);
					break;
				case "zxtw":
					pattern.setAttribute("width", 6);
					pattern.setAttribute("height", 6);
					
					path.setAttribute("d","M 6 0 L 6 0 L 0 6 z");
				    path.setAttribute("stroke-width","1");
				    path.setAttribute("stroke",tmp.layerStyle.fillColor);
					break;
				case "yxtw":
					pattern.setAttribute("width", 6);
					pattern.setAttribute("height", 6);
					
					path.setAttribute("d","M 0 0 L 0 0 L 100 100 z");
				    path.setAttribute("stroke-width","1");
				    path.setAttribute("stroke",tmp.layerStyle.fillColor);
					break;	
				default:
					break;
			}
		}else{
			if(effect=="htw"||effect=="stw"||effect=="zxtw"||effect=="yxtw"){
				tmp.effect = effect;
				tmp.fillEffect = true;
				//如果是阴影效果，切换到填充效果
				if(tmp.shadeEffect){
					//1.移除填充效果
					var child=document.getElementById(tmp.shape.options.id);
					child.parentNode.removeChild(child);
					//2.去除填充效果的fill属性
					tmp.shape.setStyle({fillColor:'red'});
					tmp._setPlotPolygonFillEffect(tmp,tmp.shape);
				}
				tmp.shadeEffect = false;
			}else{
				confirm("effect参数值异常，effect参数值为'htw'或'stw'或'zxtw'或'yxtw'");
			}
			if(tmp.shape){
				tmp._setPlotPolygonFillEffect(tmp,tmp.shape);
			}
		}
	},
	/**
	 * 设置渐变效果
	 * @param {String} effect
	 * @param {String} jbColor1
	 * @param {String} jbColor2
	 * @param {Boolean} amination
	 */
	setStyleShadeEffect:function(effect,jbColor1,jbColor2,amination){
		var tmp = this;
		if(tmp.shadeEffect){//绘制前已经设置，重新设置
			var linearGradient = document.getElementById(tmp.shape.options.id);
			var stop1 = linearGradient.childNodes[0];
			var stop2 = linearGradient.childNodes[1];
			var amination = stop2.childNodes[0];
			switch (effect){
				case "zdy"://从左到右
					if(tmp.styleShadeEffect.amination){
						linearGradient.setAttribute("x1","0%");
						linearGradient.setAttribute("y1","0%");
						linearGradient.setAttribute("x2","200%");
						linearGradient.setAttribute("y2","0%");
						stop1.setAttribute("offset","0%");
						stop1.setAttribute("style","stop-color:"+jbColor1+";"+"stop-opacity:1");
						stop2.setAttribute("offset","10%");
						stop2.setAttribute("style","stop-color:"+jbColor2+";"+"stop-opacity:1");
						amination.setAttribute('attributeName','offset');
						amination.setAttribute('values','0.1;0.2;0.3;0.40;0.5;0.60;0.7;0.80;0.9;1.0');
						amination.setAttribute('dur','2s');
						amination.setAttribute('repeatCount','indefinite');
					}else{
						linearGradient.setAttribute("x1","0%");
						linearGradient.setAttribute("y1","0%");
						linearGradient.setAttribute("x2","100%");
						linearGradient.setAttribute("y2","0%");
						stop1.setAttribute("offset","0%");
						stop1.setAttribute("style","stop-color:"+jbColor1+";"+"stop-opacity:1");
						stop2.setAttribute("offset","100%");
						stop2.setAttribute("style","stop-color:"+jbColor2+";"+"stop-opacity:1");
					}
					break;
				case "sdx"://从上到下
					if(tmp.styleShadeEffect.amination){
						linearGradient.setAttribute("x1","0%");
						linearGradient.setAttribute("y1","0%");
						linearGradient.setAttribute("x2","0%");
						linearGradient.setAttribute("y2","100%");
						stop1.setAttribute("offset","0%");
						stop1.setAttribute("style","stop-color:"+jbColor1+";"+"stop-opacity:1");
						stop2.setAttribute("offset","10%");
						stop2.setAttribute("style","stop-color:"+jbColor2+";"+"stop-opacity:1");
						amination.setAttribute('attributeName','offset');
						amination.setAttribute('values','0.1;0.2;0.3;0.40;0.5;0.60;0.7;0.80;0.9;1.0');
						amination.setAttribute('dur','2s');
						amination.setAttribute('repeatCount','indefinite');
					}else{
						linearGradient.setAttribute("x1","0%");
						linearGradient.setAttribute("y1","0%");
						linearGradient.setAttribute("x2","0%");
						linearGradient.setAttribute("y2","70%");
						stop1.setAttribute("offset","0%");
						stop1.setAttribute("style","stop-color:"+jbColor1+";"+"stop-opacity:1");
						stop2.setAttribute("offset","100%");
						stop2.setAttribute("style","stop-color:"+jbColor2+";"+"stop-opacity:1");
					}
					break;	
				default:
					break;
			}
		}else{
			if(effect=="sdx"||effect=="zdy"){
				tmp.layerStyle.id = Aqsc.Util.guid();
				tmp.effect = effect;
				tmp.styleShadeEffect = {
					jbColor1:jbColor1,
					jbColor2:jbColor2,
					amination:amination
				}
				tmp.shadeEffect = true;
				//如果是填充效果，切换到阴影效果
				if(tmp.fillEffect){
					//1.移除填充效果
					var child=document.getElementById(tmp.shape.options.id);
					child.parentNode.removeChild(child);
					//2.去除填充效果的fill属性
					tmp.shape.setStyle({fillColor:'red'});
					tmp._setPlotPolygonShadeEffect(tmp,tmp.shape);
				}
				tmp.fillEffect = false;
			}else{
				confirm("effect参数值异常，effect参数值为'sdx'或'zdy'");
			}
		}
	},
});

//Aqsc.MilitaryPlot.prototype = {
//	
//}

/**
 * 军事标绘编辑类
 */
Aqsc.MilitaryPlotEdit = L.Class.extend({
	options: {
		moveIcon: new L.DivIcon({
			iconSize: new L.Point(15, 15),
			className: 'aqsc-div-icon aqsc-editing-icon aqsc-edit-move'
		}),
		resizeIcon: new L.DivIcon({
			iconSize: new L.Point(15, 15),
			className: 'aqsc-div-icon aqsc-editing-icon aqsc-edit-resize'
		}),
		touchMoveIcon: new L.DivIcon({
			iconSize: new L.Point(57.5, 57.5),
			className: 'aqsc-div-icon aqsc-editing-icon aqsc-edit-move aqsc-touch-icon'
		}),
		touchResizeIcon: new L.DivIcon({
			iconSize: new L.Point(57.5, 57.5),
			className: 'aqsc-div-icon aqsc-editing-icon aqsc-edit-resize aqsc-touch-icon'
		}),
		deleteIcon:"deleteIcon.png"
	},
	initialize:function(map, shape, options,moveImgUrl){
		options = options || {};
		this._shape = shape;
		if(map.map){
//			options.moveIcon = new L.DivIcon({
//				iconSize: new L.Point(options.editSize.width, options.editSize.height),
//				className: 'aqsc-div-icon aqsc-editing-icon aqsc-edit-move'
//			});
			options.moveIcon = L.icon({
				iconUrl: moveImgUrl ? moveImgUrl : (Aqsc.Util.getBaseImgPath() + "move.png"),
				iconSize:[options.editSize.width*2, options.editSize.height*2]
			});
			options.resizeIcon = new L.DivIcon({
				iconSize: new L.Point(options.editSize.width, options.editSize.height),
				className: 'aqsc-div-icon aqsc-editing-icon aqsc-edit-resize'
			});
			options.touchMoveIcon = new L.DivIcon({
				iconSize: new L.Point(options.editSize.width*2.5, options.editSize.height*2.5),
				className: 'aqsc-div-icon aqsc-editing-icon aqsc-edit-move aqsc-touch-icon'
			});
			options.touchMoveIcon = new L.DivIcon({
				iconSize: new L.Point(options.editSize.width*2.5, options.editSize.height*2.5),
				className: 'aqsc-div-icon aqsc-editing-icon aqsc-edit-resize aqsc-touch-icon'
			});
			options.deleteIcon = L.icon({
				iconUrl:options.deleteIconPath?options.deleteIconPath:Aqsc.Util.getBaseImgPath() + this.options.deleteIcon,
				iconSize:[16,16]
			});
		}else{
			options.moveIcon = new L.DivIcon({
				iconSize: new L.Point(options.editSize.width, options.editSize.height),
				className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move'
			});
			options.resizeIcon = new L.DivIcon({
				iconSize: new L.Point(options.editSize.width, options.editSize.height),
				className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-resize'
			});
			options.touchMoveIcon = new L.DivIcon({
				iconSize: new L.Point(options.editSize.width*2.5, options.editSize.height*2.5),
				className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move leaflet-touch-icon'
			});
			options.touchMoveIcon = new L.DivIcon({
				iconSize: new L.Point(options.editSize.width*2.5, options.editSize.height*2.5),
				className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-resize leaflet-touch-icon'
			});
			options.deleteIcon = new L.DivIcon({
				iconSize: new L.Point(options.editSize.width, options.editSize.height),
				className: 'leaflet-zoom-box leaflet-editing-icon leaflet-edit-resize'
			});
		}
		L.Util.setOptions(this, options);
		
//		var shape = this._shape;
//		if(this._shape._map) {
//			this._map = this._shape._map;
//			shape.setStyle(shape.options.editing);
//
//			if(shape._map) {
//				this._map = shape._map;
//				if(!this._markerGroup) {
//					this.initMarkers();
//				}
//				this._map.addLayer(this._markerGroup);
//			}
//		}
	},
	initMarkers: function() {
		var shape = this._shape;
		if(this._shape._map) {
			this._map = this._shape._map;
			shape.setStyle(shape.options);
			if(shape._map) {
				this._map = shape._map;
				if(!this._markerGroup) {
					if(!this._markerGroup) {
						this._markerGroup = new L.LayerGroup();
					}
					// 创建移动点
					this._createMoveMarker();
					// 创建拖动点
					this._createResizeMarker();
					
					this._createDeleteMarker();
				}
				this._map.addLayer(this._markerGroup);
			}
		}
	},
	removeHooks: function() {
		if(this._resizeMarkers){
			var shape = this._shape;

			shape.setStyle(shape.options.original);
	
			if(shape._map) {
				this._unbindMarker(this._moveMarker);
	
				for(var i = 0, l = this._resizeMarkers.length; i < l; i++) {
					this._unbindMarker(this._resizeMarkers[i]);
				}
				this._resizeMarkers = null;
	
				this._map.removeLayer(this._markerGroup);
				delete this._markerGroup;
			}
	
			this._map = null;
		}
	},
	// @method updateMarkers(): void
  	// Remove the edit markers from this layer
  	updateMarkers: function() {
  		this._markerGroup.clearLayers();
  		this.initMarkers();
  	},
	_createMoveMarker: function() {
		// Children override
	},
	_createResizeMarker: function() {
		// Children override
	},
	_createDeleteMarker:function(){
		// Children override
	},
	_createMarker: function(latlng, icon) {
		// Extending L.Marker in TouchEvents.js to include touch.
		var marker = new L.Marker.Touch(latlng, {
			draggable: true,
			icon: icon,
			zIndexOffset: 10
		});

		this._bindMarker(marker);

		this._markerGroup.addLayer(marker);

		return marker;
	},
	_bindMarker: function(marker) {
		marker
			.on('dragstart', this._onMarkerDragStart, this)
			.on('drag', this._onMarkerDrag, this)
			.on('dragend', this._onMarkerDragEnd, this)
			.on('touchstart', this._onTouchStart, this)
			.on('touchmove', this._onTouchMove, this)
			.on('MSPointerMove', this._onTouchMove, this)
			.on('touchend', this._onTouchEnd, this)
			.on('MSPointerUp', this._onTouchEnd, this);
	},

	_unbindMarker: function(marker) {
		marker
			.off('dragstart', this._onMarkerDragStart, this)
			.off('drag', this._onMarkerDrag, this)
			.off('dragend', this._onMarkerDragEnd, this)
			.off('touchstart', this._onTouchStart, this)
			.off('touchmove', this._onTouchMove, this)
			.off('MSPointerMove', this._onTouchMove, this)
			.off('touchend', this._onTouchEnd, this)
			.off('MSPointerUp', this._onTouchEnd, this);
	},
	_onMarkerDragStart: function(e) {
		var marker = e.target;
		marker.setOpacity(0);

		this._shape.fire('editstart');
	},

	_fireEdit: function() {
		this._shape.edited = true;
		this._shape.fire('edit');
	},
	
	_onMarkerDrag: function(e) {
		var marker = e.target,
			latlng = marker.getLatLng();

		if(marker === this._moveMarker) {
			this._move(latlng);
		} else {
			
			if(this.options.type.indexOf("qz")!=-1){
				this._resize(latlng);
			}else{
				var marker = e.target,
				currentCornerIndex = marker._cornerIndex;
				this._resize(marker.getLatLng(),this._shape,currentCornerIndex);
			}
		}

		this._shape.redraw();
		this._shape.fire('editdrag');
	},

	_onMarkerDragEnd: function(e) {
		var marker = e.target;
		marker.setOpacity(1);

		this._fireEdit();
	},
	_onTouchStart: function(e) {
		Aqsc.MilitaryPlotEdit.prototype._onMarkerDragStart.call(this, e);

		if(typeof(this._getCorners) === 'function') {
			// Save a reference to the opposite point
			var corners = this._getCorners(),
				marker = e.target,
				currentCornerIndex = marker._cornerIndex;

			marker.setOpacity(0);

			// Copyed from Edit.Rectangle.js line 23 _onMarkerDragStart()
			// Latlng is null otherwise.
			this._oppositeCorner = corners[(currentCornerIndex + 2) % 4];
			this._toggleCornerMarkers(0, currentCornerIndex);
		}

		this._shape.fire('editstart');
	},

	_onTouchMove: function(e) {
		var layerPoint = this._map.mouseEventToLayerPoint(e.originalEvent.touches[0]),
			latlng = this._map.layerPointToLatLng(layerPoint),
			marker = e.target;

		if(marker === this._moveMarker) {
			this._move(latlng);
		} else {
			this._resize(latlng);
		}

		this._shape.redraw();

		// prevent touchcancel in IOS
		// e.preventDefault();
		return false;
	},

	_onTouchEnd: function(e) {
		var marker = e.target;
		marker.setOpacity(1);
		this.updateMarkers();
		this._fireEdit();
	},
	_move: function() {
  		// Children override
  	},

  	_resize: function() {
  		// Children override
  	},
  	/**
  	 * 获取删除点得latLng
  	 * @param {L.latLng} cornerLatlng
  	 */
  	_getDeleteMarkerLatlng:function(cornerLatlng){
		var layerPt = this._map.latLngToLayerPoint(L.latLng(cornerLatlng[0],cornerLatlng[1]));
		layerPt.x = layerPt.x + 30;
		layerPt.y = layerPt.y - 30;
		var latLng = this._map.layerPointToLatLng(layerPt);
		return latLng;
	}
});

/**
 * 军事标绘图形编辑类
 * 继承于Aqsc.MilitaryPlotEdit类
 */
Aqsc.MilitaryTxEdit = Aqsc.MilitaryPlotEdit.extend({
	_createMoveMarker: function() {
		var bounds = this._shape.getBounds(),
			center = bounds.getCenter();

		this._moveMarker = this._createMarker(center, this.options.moveIcon);
	},
	_createResizeMarker: function() {
		// 在绘制图形polygon中赋予属性vertexs
		var corners = this._shape.editVertexs;
		this.cornersLatlngs = [];
		for(var i = 0; i < corners.length; i++){
			this.cornersLatlngs.push([corners[i].y,corners[i].x]);
		}

		this._resizeMarkers = [];

		for(var i = 0, l = this.cornersLatlngs.length; i < l; i++) {
			this._resizeMarkers.push(this._createMarker(this.cornersLatlngs[i], this.options.resizeIcon));
			// // 创建每个拖动点的标记
			this._resizeMarkers[i]._cornerIndex = i;
		}
	},
	/**
	 * 创建删除点marker
	 */
	_createDeleteMarker:function(){
		var tmp = this;
		tmp._deleteMarker = tmp._createMarker(tmp._getDeleteMarkerLatlng(tmp.cornersLatlngs[tmp.cornersLatlngs.length-1]), tmp.options.deleteIcon);
		tmp._deleteMarker.on("click",function(){
			tmp._map.removeLayer(tmp._shape);
			tmp._map.removeLayer(tmp._deleteMarker);
			for(var i =0;i<tmp._resizeMarkers.length;i++){
				tmp._map.removeLayer(tmp._resizeMarkers[i]);
			}
			tmp._map.removeLayer(tmp._moveMarker);
			if(tmp.options.type == "djt"){
				if(tmp._shape.line_l.polyline){
					tmp._map.removeLayer(tmp._shape.line_l.polyline);
					tmp._map.removeLayer(tmp._shape.line_r.polyline);
				}else{
					tmp._map.removeLayer(tmp._shape.line_l);
					tmp._map.removeLayer(tmp._shape.line_r);
				}
			}
		});
		tmp._map.addLayer(tmp._deleteMarker);
	},
	_onMarkerDragStart: function(e) {
		Aqsc.MilitaryPlotEdit.prototype._onMarkerDragStart.call(this, e);

		// 获取相对点
		var corners = this.cornersLatlngs,
			marker = e.target,
			currentCornerIndex = marker._cornerIndex;
		// 暂时注释
		//this._oppositeCorner = corners[(currentCornerIndex + 2) % 4];

		this._toggleCornerMarkers(0, currentCornerIndex);
	},
	_onMarkerDragEnd: function(e) {
		var marker = e.target,
			bounds, center;

		// 重新设置中心移动点的位置
		if(marker === this._moveMarker) {
			bounds = this._shape.getBounds();
			center = bounds.getCenter();

			marker.setLatLng(center);
		}

		this._toggleCornerMarkers(1);
		
		// 获取移动后的编辑顶点
		var editLatlngs = [];
		for (var i = 0, l=this._shape.editVertexs.length;i <l ;i++) {
			editLatlngs.push([this._shape.editVertexs[i].y,this._shape.editVertexs[i].x]);
		}
		this._repositionCornerMarkers(editLatlngs,"dragend");

		Aqsc.MilitaryPlotEdit.prototype._onMarkerDragEnd.call(this, e);
	},
	_move: function(newCenter) {
		var latlngs = this._shape._defaultShape ? this._shape._defaultShape() : this._shape.getLatLngs(),
			bounds = this._shape.getBounds(),
			center = bounds.getCenter(),
			offset, newLatLngs = [];
		
		// 获取编辑顶点
		var editPts = this._shape.editVertexs;
		var newEditLatlngs = [];//新的编辑点latlng形式
		var newEditPts = [];//新的编辑点
		var newPts = [];//新顶点
		
		// 获取移动后编辑顶点
		for(var i = 0; i < editPts.length; i++){
			offset = [editPts[i].y - center.lat, editPts[i].x - center.lng];
			newEditLatlngs.push([newCenter.lat + offset[0], newCenter.lng + offset[1]]);
			newEditPts.push(new Aqsc.Point(newCenter.lng + offset[1],newCenter.lat + offset[0]));
		}
		// 顶点相对于中心点的移动量
		for(var i = 0, l = latlngs.length; i < l; i++) {
			offset = [latlngs[i].lat - center.lat, latlngs[i].lng - center.lng];
			newLatLngs.push([newCenter.lat + offset[0], newCenter.lng + offset[1]]);
			newPts.push(new Aqsc.Point(newCenter.lng + offset[1],newCenter.lat + offset[0]));
		}
		
		this._shape.setLatLngs(newLatLngs);
		this._shape.editVertexs = newEditPts;
		
		// 重新确定拖动变形点的位置
		this._repositionCornerMarkers(newEditLatlngs,"drag");
		
		// 当为单箭头时改变原箭头
		if(this.options.type == "djt"){
			offset = [this._shape.point_l.y - center.lat, this._shape.point_l.x - center.lng];
			var l = L.latLng(newCenter.lat + offset[0], newCenter.lng + offset[1]);
			
			offset = [this._shape.point_r.y - center.lat, this._shape.point_r.x - center.lng];
			var r = L.latLng(newCenter.lat + offset[0], newCenter.lng + offset[1]);
			
			offset = [this._shape.point_end.y - center.lat, this._shape.point_end.x - center.lng];
			var end = L.latLng(newCenter.lat + offset[0], newCenter.lng + offset[1]);
			
			if(this._shape.line_l.polyline){
				this._shape.line_l.polyline.setLatLngs([l,end]);
				this._shape.line_r.polyline.setLatLngs([r,end]);
			}else{
				this._shape.line_l.setLatLngs([l,end]);
				this._shape.line_r.setLatLngs([r,end]);
			}
			//重新赋值
			this._shape.point_l.y = l.lat;
			this._shape.point_l.x = l.lng;
			
			this._shape.point_r.y = r.lat;
			this._shape.point_r.x = r.lng;
			
			this._shape.point_end.y = end.lat;
			this._shape.point_end.x = end.lng;
		}
		this._map.fire('draw:editmove', {
			layer: this._shape
		});
	},
	
	_resize: function(latlng,shape,currentCornerIndex) {
		var newPoint = new Aqsc.Point(latlng.lng,latlng.lat);
		var newResizePoints = shape.editVertexs;
		newResizePoints[currentCornerIndex] = newPoint;
		// 当为单箭头时，移动后删除圆图形的箭头部分，后续重新生成
		if(this.options.type == "djt"){
			if(this._shape.line_l.polyline){
				this._map.removeLayer(this._shape.line_l.polyline);//移除图形
				this._map.removeLayer(this._shape.line_r.polyline);//移除图形
			}else{
				this._map.removeLayer(this._shape.line_l);//移除图形
				this._map.removeLayer(this._shape.line_r);//移除图形
			}
		}
		// 重新绘制实例化
		var tmp = {};
		switch (this.options.type){
			case "wjt":
				tmp = new Aqsc.MilitaryPlot(this._map,"wjt");
				break;
			case "zwjt":
				tmp = new Aqsc.MilitaryPlot(this._map,"zwjt");
				break;
			case "zjt":
				tmp = new Aqsc.MilitaryPlot(this._map,"zjt");
				break;
			case "djt":
				tmp = new Aqsc.MilitaryPlot(this._map,"djt");
				break;		
			case "sjt":
				tmp = new Aqsc.MilitaryPlot(this._map,"sjt");
				break;
			case "jhq":
				tmp = new Aqsc.MilitaryPlot(this._map,"jhq");
				break;		
			default:
				break;
		}
		tmp.movePolygon = null;
		tmp.points_xy = newResizePoints;
		tmp.pointsResult_xy = [];
		
		var resultPts = [];
		var latlngArr = [];
		
		resultPts = tmp._calculateParts(tmp);
		// 获取标准的leaflet的latlng
		for (var i = 0; i < resultPts.length; i++) {
			latlngArr.push(L.latLng(resultPts[i].y,resultPts[i].x)); 
		}
		
		this._map.removeLayer(tmp.movePolygon);//移除图形
		this._shape.setLatLngs(latlngArr);//重新设置坐标
		
		// 为单箭头时将重新绘制实例化的赋值给shape
		if(this.options.type == "djt"){
			this._shape.line_l = tmp.line_l;
			this._shape.line_r = tmp.line_r;
			
			this._shape.point_l.y = tmp.line_l.getLatLngs()[1].lat;
			this._shape.point_l.x = tmp.line_l.getLatLngs()[1].lng;
			
			this._shape.point_r.y = tmp.line_r.getLatLngs()[1].lat;
			this._shape.point_r.x = tmp.line_r.getLatLngs()[1].lng;
			
			this._shape.point_end.y = tmp.line_l.getLatLngs()[0].lat;
			this._shape.point_end.x = tmp.line_l.getLatLngs()[0].lng;
		}
		//重新定位移动的marker
		bounds = this._shape.getBounds();
		this._moveMarker.setLatLng(bounds.getCenter());
		
		//20180718 注释，启用上句
//		this._moveMarker.setLatLng(this._shape.getCenter());

		this._map.fire('draw:editresize', {
			layer: this._shape
		});
		
	},
	
	_toggleCornerMarkers: function(opacity) {
		for(var i = 0, l = this._resizeMarkers.length; i < l; i++) {
			this._resizeMarkers[i].setOpacity(opacity);
		}
	},

	_repositionCornerMarkers: function(newEditLatlngs,dragParam) {
		var corners = newEditLatlngs;
		for(var i = 0, l = this._resizeMarkers.length; i < l; i++) {
			this._resizeMarkers[i].setLatLng(corners[i]);
		}
		if(dragParam == "dragend"){
			this._deleteMarker.setLatLng(this._getDeleteMarkerLatlng(newEditLatlngs[newEditLatlngs.length-1]));
		}
	}
});

/**
 * 军事标绘旗帜编辑类
 * 继承于Aqsc.MilitaryPlotEdit类
 */
Aqsc.MilitaryQzEdit = Aqsc.MilitaryPlotEdit.extend({
	_createMoveMarker: function() {
		var bounds = this._shape.getBounds(),
			center = bounds.getCenter();

		this._moveMarker = this._createMarker(center, this.options.moveIcon);
	},

	_createResizeMarker: function() {
		var corners = this._getCorners();

		this._resizeMarkers = [];

		for(var i = 0, l = corners.length; i < l; i++) {
			this._resizeMarkers.push(this._createMarker(corners[i], this.options.resizeIcon));
			// 创建每个拖动点的标记
			this._resizeMarkers[i]._cornerIndex = i;
		}
	},
	/**
	 * 创建删除点区域，一个白色marker+一个红色圆点，叠加在一起就是删除符号
	 */
	_createDeleteMarker:function(){
		var tmp = this;
		var tmpLatlng = [this._getCorners()[this._getCorners().length-2].lat,this._getCorners()[this._getCorners().length-2].lng];
		tmp._deleteMarker = tmp._createMarker(tmp._getDeleteMarkerLatlng(tmpLatlng), tmp.options.deleteIcon);
		tmp._deleteMarker.on("click",function(){
			tmp._map.removeLayer(tmp._shape);
			tmp._map.removeLayer(tmp._deleteMarker);
			for(var i =0;i<tmp._resizeMarkers.length;i++){
				tmp._map.removeLayer(tmp._resizeMarkers[i]);
			}
			tmp._map.removeLayer(tmp._moveMarker);
		});
		tmp._map.addLayer(tmp._deleteMarker);
	},
	_onMarkerDragStart: function(e) {
		Aqsc.MilitaryPlotEdit.prototype._onMarkerDragStart.call(this, e);

		// 获取边角点
		var corners = this._getCorners(),
			marker = e.target,
			currentCornerIndex = marker._cornerIndex;

		this._oppositeCorner = corners[(currentCornerIndex + 2) % 4];

		this._toggleCornerMarkers(0, currentCornerIndex);
	},

	_onMarkerDragEnd: function(e) {
		var marker = e.target,
			bounds, center;

		// 重新设置中心移动点的位置
		if(marker === this._moveMarker) {
			bounds = this._shape.getBounds();
			center = bounds.getCenter();

			marker.setLatLng(center);
		}

		this._toggleCornerMarkers(1);

		this._repositionCornerMarkers("dragend");

		Aqsc.MilitaryPlotEdit.prototype._onMarkerDragEnd.call(this, e);
	},

	_move: function(newCenter) {
		var latlngs = this._shape._defaultShape ? this._shape._defaultShape() : this._shape.getLatLngs(),
			bounds = this._shape.getBounds(),
			center = bounds.getCenter(),
			offset, newLatLngs = [];

		// 相对于中心点的移动量
		for(var i = 0, l = latlngs.length; i < l; i++) {
			offset = [latlngs[i].lat - center.lat, latlngs[i].lng - center.lng];
			newLatLngs.push([newCenter.lat + offset[0], newCenter.lng + offset[1]]);
		}

		this._shape.setLatLngs(newLatLngs);

		// 重新确定拖动变形点的位置
		this._repositionCornerMarkers("drag");

		this._map.fire('draw:editmove', {
			layer: this._shape
		});
	},

	_resize: function(latlng) {
		var bounds;
		function toLatLngBounds(a, b) {
			if (a instanceof L.latLngBounds) {
				return a;
			}
			return L.latLngBounds(a, b);
		}
		// 修改polygon区域轮廓
		// this._shape.setBounds(L.latLngBounds(latlng, this._oppositeCorner));
		
		var oldBounds = L.latLngBounds(latlng, this._oppositeCorner);
		latLngBounds = toLatLngBounds(oldBounds);
		
		var latlngArr = [];
		if(this.options.type!="qxqz"){
			//矩形旗帜第一个点
			var latlng1 = L.latLng(latLngBounds._northEast.lat,latLngBounds._southWest.lng);
			//矩形旗帜第二个点
			var latlng2 = latLngBounds._northEast;
			//矩形旗帜第三个点
			var latlng3 = L.latLng((latlng2.lat + latLngBounds._southWest.lat)/2,latLngBounds._northEast.lng);
			//矩形旗帜第四个点
			var latlng4 = L.latLng((latlng1.lat + latLngBounds._southWest.lat)/2,latLngBounds._southWest.lng);
			//矩形旗帜第五个点
			var latlng5 = latLngBounds._southWest;
			switch (this.options.type){
				case "jxqz":
					latlngArr.push.apply(latlngArr,[latlng1,latlng2,latlng3,latlng4,latlng5]);
					break;
				case "sjqz":
					latlngArr.push.apply(latlngArr,[latlng1,latlng3,latlng4,latlng5]);
					break;
				default:
					break;
			}
		}else{
			//取第一个
			var startPoint = new Aqsc.Point(latLngBounds._southWest.lng,latLngBounds._northEast.lat);
			//取最后一个
			var endPoint = new Aqsc.Point(latLngBounds._northEast.lng,latLngBounds._southWest.lat);
			//上曲线起始点
			var point1 = startPoint;
			//上曲线第一控制点
			var point2 = new Aqsc.Point((endPoint.x - startPoint.x) / 4 + startPoint.x, (endPoint.y - startPoint.y) / 8 + startPoint.y);
			//上曲线第二个点
			var point3 = new Aqsc.Point((startPoint.x + endPoint.x) / 2, startPoint.y);
			//上曲线第二控制点
			var point4 = new Aqsc.Point((endPoint.x - startPoint.x) * 3 / 4 + startPoint.x, -(endPoint.y - startPoint.y) / 8 + startPoint.y);
			//上曲线结束点
			var point5 = new Aqsc.Point(endPoint.x, startPoint.y);

			//下曲线结束点
			var point6 = new Aqsc.Point(endPoint.x, (startPoint.y + endPoint.y) / 2);
			//下曲线第二控制点
			var point7 = new Aqsc.Point((endPoint.x - startPoint.x) * 3 / 4 + startPoint.x, (endPoint.y - startPoint.y) * 3 / 8 + startPoint.y);
			//下曲线第二个点
			var point8 = new Aqsc.Point((startPoint.x + endPoint.x) / 2, (startPoint.y + endPoint.y) / 2);
			//下曲线第一控制点
			var point9 = new Aqsc.Point((endPoint.x - startPoint.x) / 4 + startPoint.x, (endPoint.y - startPoint.y) * 5 / 8 + startPoint.y);
			//下曲线起始点
			var point10 = new Aqsc.Point(startPoint.x, (startPoint.y + endPoint.y) / 2);
			//旗杆底部点
			var point11 = new Aqsc.Point(startPoint.x, endPoint.y);
			
			var qxqzPlot = new Aqsc.MilitaryPlot(this._shape._map,"qxqz");
			//计算上曲线
			var curve1 = qxqzPlot._createBezier2([point1, point2, point3, point4, point5]);
			//计算下曲线
			var curve2 = qxqzPlot._createBezier2([point6, point7, point8, point9, point10]);

			//合并
			var points = curve1.concat(curve2);
			points.push(point11);
			for(var i = 0; i < points.length; i++) {
				var latlng = [points[i].y, points[i].x];
				latlngArr.push(latlng);
			}
		}
		this._shape.setLatLngs(latlngArr);

		//重新定位移动的marker
//		bounds = this._shape.getBounds();
//		this._moveMarker.setLatLng(bounds.getCenter());
		
		this._moveMarker.setLatLng(latLngBounds.getCenter());

		this._map.fire('draw:editresize', {
			layer: this._shape
		});
	},

	_getCorners: function() {
		var bounds = this._shape.getBounds(),
			nw = bounds.getNorthWest(),
			ne = bounds.getNorthEast(),
			se = bounds.getSouthEast(),
			sw = bounds.getSouthWest();

		return [nw, ne, se, sw];
	},

	_toggleCornerMarkers: function(opacity) {
		for(var i = 0, l = this._resizeMarkers.length; i < l; i++) {
			this._resizeMarkers[i].setOpacity(opacity);
		}
	},

	_repositionCornerMarkers: function(dragParam) {
		var corners = this._getCorners();

		for(var i = 0, l = this._resizeMarkers.length; i < l; i++) {
			this._resizeMarkers[i].setLatLng(corners[i]);
		}
		if(dragParam == "dragend"){
			this._deleteMarker.setLatLng(this._getDeleteMarkerLatlng([corners[corners.length-2].lat,corners[corners.length-2].lng]));
		}
	}
});