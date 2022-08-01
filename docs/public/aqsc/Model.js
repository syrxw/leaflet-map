Aqsc.Model = L.Class.extend({
	options: {

	},
	initialize: function(map, pt, points, options) {
		this.map = map;
		this.pt = pt;
		this.points = points;
		this.options = Aqsc.Util.setOptions(this, options);
	},
	/**
	 * 添加到地图上
	 */
	addToMap: function() {

	},
	/**
	 * 从地图上移除
	 */
	remove: function() {
		
	},
	/**
	 * 转换坐标 米转化为度的参数 
	 * @param {Object} arr
	 * @param {Object} type
	 */
	_epsgTransUint: function(arr, type) {
		var returnArr = [];
		var returnLength;
		switch(type) {
			case "array":
				for(var i = 0; i < arr.length; i++) {
					returnArr[i] = arr[i] * (1 / 30.887) * (1 / 3600);// 经纬度坐标下米转化为度的参数 
				}
				return returnArr;
				break;
			case "length":
				return returnLength = arr * (1 / 30.887) * (1 / 3600);
				break;
			default:
				layer.msg('缺少相应参数，传参出错');
		}
	}
})
/*==================Aqsc.FireExplode====================start*/
/**
 * 火灾爆炸模型
 */
Aqsc.FireExplode = Aqsc.Model.extend({
	options: {
		deathRadius: 100,
		deathRadiusStyle: {
			fill: true,
			fillColor: "#F12423",
			fillOpacity: 0.5,
			color: "#F12423",
			width: 0,
			lineColor:'#F12423',//死亡折线的颜色
			lineWeight:2,//死亡折线的宽度
			dashArray :"0",//死亡折线的样式（一下为示例）
			isShowText:false,
			// dashArray = "1,10";——点线
			// dashArray = "10";——虚线
			// dashArray = "20,20";——长虚线
			// dashArray = "20, 10, 1, 10";——长点虚线
			// dashArray = "0";——实线
			textBackgroundColor:'#901615',// 标签背景颜色
			textBackgroundOpacity: 1,// 标签背景透明度
			textColor:'#DDDDDD',//标签的文字颜色
			font: "16px '宋体'", //设置字体和大小，单位为px；
			textBackgroundHeight:50,//标签的高度
			textBackgroundWidth: 173, //标签的宽度
			textBackgroundBorderWidth:1, //标签背景轮廓粗细
			textBackgroundBorderColor:"#F12423",//标签背景轮廓颜色
			delimiterColor: "#FFFFFF", //分隔符颜色
			textOffsetX: 0, //标签设置X轴偏移量；
			textOffsetY: -8, //标签设置y轴偏移量；
		},
		seriousInjuryRadius: 387,
		seriousInjuryRadiusStyle: {
			fill: true,
			fillColor: "#FFA319",
			fillOpacity: 0.5,
			color: "#FFA319",
			width: 0,
			lineColor:'#FFA319',//重伤折线的颜色
			lineWeight:2,//重伤折线的宽度
			dashArray :"0",//重伤折线的样式（一下为示例）
			isShowText:false,
			// dashArray = "1,10";——点线
			// dashArray = "10";——虚线
			// dashArray = "20,20";——长虚线
			// dashArray = "20, 10, 1, 10";——长点虚线
			// dashArray = "0";——实线
			textBackgroundColor:'#9A620F',// 标签背景颜色
			textBackgroundOpacity: 1,// 标签背景透明度
			textColor:'#DDDDDD',//标签的文字颜色
			font: "16px '宋体'", //设置字体和大小，单位为px；
			textBackgroundHeight:50,//标签的高度
			textBackgroundWidth: 173, //标签的宽度
			textBackgroundBorderWidth:1, //标签背景轮廓粗细
			textBackgroundBorderColor:"#FFA319",//标签背景轮廓颜色
			delimiterColor: "#FFFFFF", //分隔符颜色
			textOffsetX: -169, //标签设置X轴偏移量；
			textOffsetY: -8, //标签设置y轴偏移量；
		},
		minorWoundRadius: 450,
		minorWoundRadiusStyle: {
			fill: true,
			fillColor: "#00F5FF",
			fillOpacity: 0.4,
			color: "#00F5FF",
			width: 0,
			lineColor:'#00F5FF',//轻伤折线的颜色
			lineWeight:2,//轻伤折线的宽度
			dashArray : "0",//轻伤折线的样式（一下为示例）
			isShowText:false,
			// dashArray = "1,10";——点线
			// dashArray = "10";——虚线
			// dashArray = "20,20";——长虚线
			// dashArray = "20, 10, 1, 10";——长点虚线
			// dashArray = "0";——实线
			textBackgroundColor:'#009399',// 标签背景颜色
			textBackgroundOpacity: 1,// 标签背景透明度
			textColor:'#DDDDDD',//标签的文字颜色
			font: "16px '宋体'", //设置字体和大小，单位为px；
			textBackgroundHeight:50,//标签的高度
			textBackgroundWidth: 173, //标签的宽度
			textBackgroundBorderWidth:1, //标签背景轮廓粗细
			textBackgroundBorderColor:"#00F5FF",//标签背景轮廓颜色
			delimiterColor: "#FFFFFF", //分隔符颜色
			textOffsetX: -169, //标签设置X轴偏移量；
			textOffsetY: -8, //标签设置y轴偏移量；
		},
		safeRadius: 600,
		safeRadiusStyle: {
			fill: true,
			fillColor: "#0BE276",
			fillOpacity: 0.45,
			color: "#0BE276",
			width: 0,
			lineColor:'#0BE276',//安全折线的颜色
			lineWeight:2,//安全折线的宽度
			dashArray :"0",//安全折线的样式（一下为示例）
			isShowText:false,
			// dashArray = "1,10";——点线
			// dashArray = "10";——虚线
			// dashArray = "20,20";——长虚线
			// dashArray = "20, 10, 1, 10";——长点虚线
			// dashArray = "0";——实线
			textBackgroundColor:'#078847',// 标签背景颜色
			textBackgroundOpacity: 1,// 标签背景透明度
			textColor:'#DDDDDD',//标签的文字颜色
			font: "16px '宋体'", //设置字体和大小，单位为px；
			textBackgroundHeight:50,//标签的高度
			textBackgroundWidth: 173, //标签的宽度
			textBackgroundBorderWidth:1, //标签背景轮廓粗细
			textBackgroundBorderColor:"#0BE276",//标签背景轮廓颜色
			delimiterColor: "#FFFFFF", //分隔符颜色
			textOffsetX: 0, //标签设置X轴偏移量；
			textOffsetY: -8, //标签设置y轴偏移量；
		}
	},
	initialize: function(map ,pt, points, options) {
		// 参数赋值
		this.map =  map;
		this.pt = pt;
		this.points = points;
		this.isRemove = false;	//是否能调用了remove方法
		this.options = Aqsc.Util.setOptions(this, options);
		/*====================半径圆对象==========================start*/
		// 死亡半径
		this.deathRadiusOpts = this.options.deathRadiusStyle;
		this.deathRadiusOpts.radius = this.options.deathRadius;
		
		this.deathR = this.options.deathRadius;
		if(this.map.type = "CD_ESRI"){
			this.deathRadiusOpts.radius = this.deathRadiusOpts.radius * 1/(30.887*3600);
		}
		this.deathRadiusCircle = new Aqsc.Circle(pt, this.deathRadiusOpts);

		// 重伤半径
		this.seriousInjuryRadiusOpts = this.options.seriousInjuryRadiusStyle;
		this.seriousInjuryRadiusOpts.radius = this.options.seriousInjuryRadius;
		this.seriousInjuryRadiusCircle = new Aqsc.Circle(pt, this.seriousInjuryRadiusOpts);

		// 轻伤半径
		this.minorWoundRadiusOpts = this.options.minorWoundRadiusStyle;
		this.minorWoundRadiusOpts.radius = this.options.minorWoundRadius;
		this.minorWoundRadiusCircle = new Aqsc.Circle(pt, this.minorWoundRadiusOpts);

		// 安全半径
		this.safeRadiusOpts = this.options.safeRadiusStyle;
		this.safeRadiusOpts.radius = this.options.safeRadius;
		this.safeRadiusCircle = new Aqsc.Circle(pt, this.safeRadiusOpts);
		/*====================半径圆对象==========================end*/

		/*====================面积计算========================start*/
		var swArea = (Math.PI * Math.pow(this.deathR, 2));
		var zsArea = (Math.PI * Math.pow(this.seriousInjuryRadiusOpts.radius, 2));
		var qsArea = (Math.PI * Math.pow(this.minorWoundRadiusOpts.radius, 2));
		var aqArea = (Math.PI * Math.pow(this.safeRadiusOpts.radius, 2));

		var swAreaReal = swArea;
		var zsAreaReal = zsArea - swArea;
		var qsAreaReal = qsArea - zsArea;
		var aqAreaReal = aqArea - qsArea;

		this.swRadiusStr = '';
		this.swAreaStr = '';

		this.zsRadiusStr = '';
		this.zsAreaStr = '';

		this.qsRadiusStr = '';
		this.qsAreaStr = '';

		this.aqRadiusStr = '';
		this.aqAreaStr = '';

		// 死亡
		if(swAreaReal >= Math.pow(10, 6)) { // 平方千米判断
			swAreaReal = (swAreaReal / Math.pow(10, 6)).toFixed(2);
			swAreaReal = swAreaReal + '平方千米';
		} else {
			swAreaReal = swAreaReal.toFixed(2);
			swAreaReal = swAreaReal + '平方米';
		}
		
		
		this.swRadiusStr = '死亡：' + this.deathR + "米";
		this.swAreaStr = '面积：' + swAreaReal;
		
		// 重伤
		if(zsAreaReal >= Math.pow(10, 6)) { // 平方千米判断
			zsAreaReal = (zsAreaReal / Math.pow(10, 6)).toFixed(2);
			zsAreaReal = zsAreaReal + '平方千米';
		} else {
			zsAreaReal = zsAreaReal.toFixed(2);
			zsAreaReal = zsAreaReal + '平方米';
		}
		this.zsRadiusStr = '重伤：' + this.seriousInjuryRadiusOpts.radius + "米";
		this.zsAreaStr = '面积：' + zsAreaReal;

		// 轻伤
		if(qsAreaReal >= Math.pow(10, 6)) { // 平方千米判断
			qsAreaReal = (qsAreaReal / Math.pow(10, 6)).toFixed(2);
			qsAreaReal = qsAreaReal + '平方千米';
		} else {
			qsAreaReal = qsAreaReal.toFixed(2);
			qsAreaReal = qsAreaReal + '平方米';
		}
		this.qsRadiusStr = '轻伤：' + this.minorWoundRadiusOpts.radius + "米";
		this.qsAreaStr = '面积：' + qsAreaReal;

		// 安全
		if(aqAreaReal >= Math.pow(10, 6)) { // 平方千米判断
			aqAreaReal = (aqAreaReal / Math.pow(10, 6)).toFixed(2);
			aqAreaReal = aqAreaReal + '平方千米';
		} else {
			aqAreaReal = aqAreaReal.toFixed(2);
			aqAreaReal = aqAreaReal + '平方米'
		}
		this.aqRadiusStr = '安全：' + this.safeRadiusOpts.radius + "米";
		this.aqAreaStr = '面积：' + aqAreaReal;

		/*====================面积计算========================end*/

		/*====================弹出框==========================start*/
		// 弹出框位置
		var OBRadius = this.safeRadiusOpts.radius * (1+1/3);	//斜着的总长度
		var parallelX = this.safeRadiusOpts.radius * (1/3);		//横着的长度
		//第一象限的三个点坐标（死亡）
		var xRdeath1 = pt.x + this.deathRadiusOpts.radius * Math.cos(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));	//线中的第一个点的坐标
		var yRdeath1 = pt.y + this.deathRadiusOpts.radius * Math.sin(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600);
		
		var xRdeath2 = pt.x + OBRadius * Math.cos(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));		//线中的第二个点的坐标
		var yRdeath2 = pt.y + OBRadius * Math.sin(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600);
		
		var xRdeath3 = pt.x + (OBRadius * Math.cos(Math.PI/180*45) + parallelX) * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));		//线中的第三个点的坐标
		var yRdeath3 = pt.y + OBRadius * Math.sin(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600); 
		//生成点
		this.swCenterPt1 = new Aqsc.Point(xRdeath1, yRdeath1);
		this.swCenterPt2 = new Aqsc.Point(xRdeath2, yRdeath2);
		this.swCenterPt3 = new Aqsc.Point(xRdeath3, yRdeath3);

		// var xR1 = pt.x;
		// var yR1 = pt.y + this.deathRadiusOpts.radius * (1 / 30.922080775909325) * (1 / 3600);
		// this.swCenterPt = new Aqsc.Point(xR1, yR1);
		//第二象限的三个点坐标（重伤）
		var xRserious1 = pt.x - this.seriousInjuryRadiusOpts.radius * Math.cos(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));	//线中的第一个点的坐标
		var yRserious1 = pt.y + this.seriousInjuryRadiusOpts.radius * Math.sin(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600);
		
		var xRserious2 = pt.x - OBRadius * Math.cos(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));		//线中的第二个点的坐标
		var yRserious2 = pt.y + OBRadius * Math.sin(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600);
		
		var xRserious3 = pt.x - (OBRadius * Math.cos(Math.PI/180*45) + parallelX) * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));		//线中的第三个点的坐标
		var yRserious3 = pt.y + OBRadius * Math.sin(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600); 
		// var xRserious2 = pt.x + this.seriousInjuryRadiusOpts.radius * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));
		// var yRserious2 = pt.y;
		//生成点
		this.zsCenterPt1 = new Aqsc.Point(xRserious1, yRserious1);
		this.zsCenterPt2 = new Aqsc.Point(xRserious2, yRserious2);
		this.zsCenterPt3 = new Aqsc.Point(xRserious3, yRserious3);
		//第三象限的三个点（轻伤）
		var xRminor1 = pt.x - this.minorWoundRadiusOpts.radius * Math.cos(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));	//线中的第一个点的坐标
		var yRminor1 = pt.y - this.minorWoundRadiusOpts.radius * Math.sin(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600);
		
		var xRminor2 = pt.x - OBRadius * Math.cos(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));		//线中的第二个点的坐标
		var yRminor2 = pt.y - OBRadius * Math.sin(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600);
		
		var xRminor3 = pt.x - (OBRadius * Math.cos(Math.PI/180*45) + parallelX) * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));		//线中的第三个点的坐标
		var yRminor3 = pt.y - OBRadius * Math.sin(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600); 
		// var xRminor3 = pt.x;
		// var yRminor3 = pt.y - this.minorWoundRadiusOpts.radius * (1 / 30.922080775909325) * (1 / 3600);
		
		this.qsCenterPt1 = new Aqsc.Point(xRminor1, yRminor1);
		this.qsCenterPt2 = new Aqsc.Point(xRminor2, yRminor2);
		this.qsCenterPt3 = new Aqsc.Point(xRminor3, yRminor3);
		//第四象限的三个点坐标（安全）
		var xRsafe1 = pt.x + this.safeRadiusOpts.radius * Math.cos(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));	//线中的第一个点的坐标
		var yRsafe1 = pt.y - this.safeRadiusOpts.radius * Math.sin(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600);
		
		var xRsafe2 = pt.x + OBRadius * Math.cos(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));		//线中的第二个点的坐标
		var yRsafe2 = pt.y - OBRadius * Math.sin(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600);
		
		var xRsafe3 = pt.x + (OBRadius * Math.cos(Math.PI/180*45) + parallelX) * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));		//线中的第三个点的坐标
		var yRsafe3 = pt.y - OBRadius * Math.sin(Math.PI/180*45) * (1 / 30.922080775909325) * (1 / 3600); 
		// var xRsafe4 = pt.x - this.safeRadiusOpts.radius * (1 / 30.922080775909325) * (1 / 3600) * (1 / Math.cos((Math.PI / 180) * pt.y));
		// var yRsafe4 = pt.y;
		//生成点
		this.aqCenterPt1 = new Aqsc.Point(xRsafe1, yRsafe1);
		this.aqCenterPt2 = new Aqsc.Point(xRsafe2, yRsafe2);
		this.aqCenterPt3 = new Aqsc.Point(xRsafe3, yRsafe3);

		this.popUpArr = []; // 弹出框数组
		/*====================弹出框==========================end*/
		
		

		/* 点  start */
		//第一象限的点options（死亡）
		var optPoint1 = {
			radius:1,//设置点空心半径，单位为px；
			weight:6,//设置点宽度，单位为px；
			color:this.options.deathRadiusStyle.color,//设置点的颜色；
		}
		//第二象限的点options（重伤）
		var optPoint2 = {
			radius:1,//设置点空心半径，单位为px；
			weight:6,//设置点宽度，单位为px；
			color:this.options.seriousInjuryRadiusStyle.color,//设置点的颜色；
		}
		//第三象限的点options（轻伤）
		var optPoint3 = {
			radius:1,//设置点空心半径，单位为px；
			weight:6,//设置点宽度，单位为px；
			color:this.options.minorWoundRadiusStyle.color,//设置点的颜色；
		}
		//第四象限的点options（安全）
		var optPoint4 = {
			radius:1,//设置点空心半径，单位为px；
			weight:6,//设置点宽度，单位为px；
			color:this.options.safeRadiusStyle.color,//设置点的颜色；
		}
		//绘制各个交点
		this.ponint1 = new Aqsc.MarkerPoint(this.swCenterPt1,optPoint1);
		this.ponint2 = new Aqsc.MarkerPoint(this.zsCenterPt1,optPoint2);
		this.ponint3 = new Aqsc.MarkerPoint(this.qsCenterPt1,optPoint3);
		this.ponint4 = new Aqsc.MarkerPoint(this.aqCenterPt1,optPoint4);
		this.popUpArr.push(this.ponint1,this.ponint2,this.ponint3,this.ponint4);
		// console.log(123,this.ponint1);
		// this.ponint1.addToMap();
		/* 点  end */

		/* 添加环形面  start*/

		//调用割圆的方法，分割最外层一圈的点
		var xx = Aqsc.Util.cyclotomic(pt,this.deathRadiusOpts.radius,36*100);
		var xx1 = Aqsc.Util.cyclotomic(pt,this.seriousInjuryRadiusOpts.radius,36*100);
		var xx2 = Aqsc.Util.cyclotomic(pt,this.minorWoundRadiusOpts.radius,36*100);
		var xx3 = Aqsc.Util.cyclotomic(pt,this.safeRadiusOpts.radius,36*100);
		//利用大圆减小圆绘制环形
		var latlngs = [	//重伤的环形
			xx1, // outer ring
			xx // hole
		];
		var latlngs1 = [	//轻伤的环形
			xx2, // outer ring
			xx1 // hole
		];
		var latlngs2 = [	//安全的环形
			xx3,// outer ring
			xx2 // hole
		];
		// var latlngs3 = [	//安全的虚线
		// 	xx3// outer ring
		// ];
		var latlngs4 = [	//死亡的虚线
			xx
		];
		/* 设置参数并在地图上添加环形
		dashArray 虚线实线
		color 边框的颜色
		fillOpacity  填充的透明度
		fillColor  填充的颜色
		weight  边框的宽度
		 */
		this.polygon = L.polygon(latlngs, {dashArray:'10',color: this.options.seriousInjuryRadiusStyle.color,fillOpacity:this.options.seriousInjuryRadiusStyle.fillOpacity,fillColor:this.options.seriousInjuryRadiusStyle.fillColor,weight:this.options.seriousInjuryRadiusStyle.width});
		this.polygon1 = L.polygon(latlngs1, {dashArray:'10',color: this.options.minorWoundRadiusStyle.color,fillOpacity:this.options.minorWoundRadiusStyle.fillOpacity,fillColor:this.options.minorWoundRadiusStyle.fillColor,weight:this.options.minorWoundRadiusStyle.width});
		this.polygon2 = L.polygon(latlngs2, {dashArray:'10',color: this.options.safeRadiusStyle.color,fillOpacity:this.options.safeRadiusStyle.fillOpacity,fillColor:this.options.safeRadiusStyle.fillColor,weight:this.options.safeRadiusStyle.width});
		// this.polygon3 = L.polygon(latlngs3, {dashArray:'10',color: this.options.safeRadiusStyle.color,weight:this.options.safeRadiusStyle.width});
		this.polygon4 = L.polyline(latlngs4, {dashArray:'10',color: this.options.deathRadiusStyle.color,fillOpacity:this.options.deathRadiusStyle.fillOpacity,fillColor:this.options.deathRadiusStyle.fillColor,weight:this.options.deathRadiusStyle.width});
		// polygon4.addTo(map.map);  //死亡的虚线
		//添加到地图上
//		this.polygon2.addTo(map.map);// 安全的环形
//		this.polygon1.addTo(map.map);// 轻伤的环形 
//		this.polygon.addTo(map.map);// 重伤的环形
//		this.polygon4.addTo(map.map);// 死亡的虚线
		/* 添加环形面  end*/

		/* 折线   start*/
		//Point点类数组
		var coordinate1 =  xRdeath1 +',' + yRdeath1 +';'+ xRdeath2 +','+ yRdeath2 +';'+ xRdeath3 +','+ yRdeath3;
		var coordinate2 =  xRserious1 +',' + yRserious1 +';'+ xRserious2 +','+ yRserious2 +';'+ xRserious3 +','+ yRserious3;
		var coordinate3 =  xRminor1 +',' + yRminor1 +';'+ xRminor2 +','+ yRminor2 +';'+ xRminor3 +','+ yRminor3;
		var coordinate4 =  xRsafe1 +',' + yRsafe1 +';'+ xRsafe2 +','+ yRsafe2 +';'+ xRsafe3 +','+ yRsafe3;
		//设置options属性
		//第一象限的线options（死亡）
		var options1={
			color:this.options.deathRadiusStyle.lineColor,//设置线颜色
			weight:this.options.deathRadiusStyle.lineWeight,//设置线宽度，以像素为单位；
			dashArray:this.options.deathRadiusStyle.dashArray//轮廓线样式
		}
		//第二象限的线options（重伤）
		var options2={
			color:this.options.seriousInjuryRadiusStyle.lineColor,//设置线颜色
			weight:this.options.seriousInjuryRadiusStyle.lineWeight,//设置线宽度，以像素为单位；
			dashArray:this.options.seriousInjuryRadiusStyle.dashArray//轮廓线样式
		}
		//第三象限的线options（轻伤）
		var options3={
			color:this.options.minorWoundRadiusStyle.lineColor,//设置线颜色
			weight:this.options.minorWoundRadiusStyle.lineWeight,//设置线宽度，以像素为单位；
			dashArray:this.options.minorWoundRadiusStyle.dashArray//轮廓线样式
		}
		//第四象限的线options（安全）
		var options4={
			color:this.options.safeRadiusStyle.lineColor,//设置线颜色
			weight:this.options.safeRadiusStyle.lineWeight,//设置线宽度，以像素为单位；
			dashArray:this.options.safeRadiusStyle.dashArray//轮廓线样式
		}
		//创建一个地图折线实例，第一个参数为点类数组，第二个参数为可选参数
		this.polyline1 =  new Aqsc.Polyline(coordinate1,options1);//第一象限的线（死亡）
		this.polyline2 =  new Aqsc.Polyline(coordinate2,options2);//第一象限的线（死亡）
		this.polyline3 =  new Aqsc.Polyline(coordinate3,options3);//第一象限的线（死亡）
		this.polyline4 =  new Aqsc.Polyline(coordinate4,options4);//第一象限的线（死亡）
		/* 折线   end*/

		/* 添加缩放监听事件 当四个弹框有遮挡时全部清除否则显示*/
		var tmp = this;
		var isAddOrMove = true; //用来判断是否添加过，防止重复添加
		this.map.addEventListener('zoom',function(e){
			//将坐标点转换为像素点
			var projection =  L.CRS.EPSG3857;
			var xx = projection.latLngToPoint(L.latLng(yRserious3,xRserious3),e.target._zoom);
			var xx1 = projection.latLngToPoint(L.latLng(yRminor3,xRminor3),e.target._zoom);
			//判断重伤的点个轻伤的点是否会覆盖重合
			if(xx1.y - xx.y > tmp.options.safeRadiusStyle.textBackgroundHeight){
				if(isAddOrMove || tmp.isRemove){//判断是否添加过，添加过不再添加  且没有被remove移除
					return;
				}
				isAddOrMove = true;
				//折线的添加
				tmp.polyline1.addToMap();
				tmp.polyline2.addToMap();
				tmp.polyline3.addToMap();
				tmp.polyline4.addToMap();
				
				// tmp._inCircle(tmp.points);
				// 各个弹出框添加到地图上
				//marker文字的添加
				tmp._addPopUp(tmp.swCenterPt3, tmp.swRadiusStr, tmp.swAreaStr, tmp.popUpArr);
				tmp._addPopUp(tmp.zsCenterPt3, tmp.zsRadiusStr, tmp.zsAreaStr, tmp.popUpArr);
				tmp._addPopUp(tmp.qsCenterPt3, tmp.qsRadiusStr, tmp.qsAreaStr, tmp.popUpArr);
				tmp._addPopUp(tmp.aqCenterPt3, tmp.aqRadiusStr, tmp.aqAreaStr, tmp.popUpArr);
				//交点的添加
				tmp.ponint1.addToMap();
				tmp.ponint2.addToMap();
				tmp.ponint3.addToMap();
				tmp.ponint4.addToMap();
			}else{
				isAddOrMove = false;
				//折线的移除
				tmp.polyline1.remove(tmp.map);
				tmp.polyline2.remove(tmp.map);
				tmp.polyline3.remove(tmp.map);
				tmp.polyline4.remove(tmp.map);
				// 各个弹出框移除
				for(var i = 0; i < tmp.popUpArr.length; i++) {
					tmp.popUpArr[i].remove();
				}
				tmp.map.refresh();//地图的刷新
			}
		})

	},
	/**
	 * 添加气泡
	 * @param {Object} pt
	 * @param {Object} strDeathRadius 死亡半径
	 * @param {Object} strArea 死亡面积
	 */
	_addPopUp: function(pt, strDeathRadius, strArea, popUpArr) {
		//		var costomInfo = new Aqsc.CustomInfoWindow("hxGisWin");
		//		var strHtml = '<div class="costom-popup-rect">' +
		//						'<div class="costom-popup-content-wrapper" >' +
		//								'<div class="costom-popup-content" >' +
		//									'<div>'+ strDeathRadius +'</div>' +
		//									'<div>'+ strArea +'</div>' +
		//								'</div>' +
		//						'</div>' +
		//					  '</div>'
		//
		//		costomInfo.setContent(strHtml, 0, -18);
		//		costomInfo.setPosition(pt);
		//		costomInfo.openOnMap();

		// var strHtml = '<div class="costom-popup-content" >' +
		// 	'<div>' + strDeathRadius + '</div>' +
		// 	'<div>' + strArea + '</div>' +
		// 	'</div>';
		// var infowindow = new Aqsc.InfoWindow({
		// 	closeOnClick: false,
		// 	closeButton: false
		// });
		// infowindow.setTitleContent(["信息", ""]); //设置头部信息
		// infowindow.setPosition(pt); // 设置信息窗口的地理坐标；
		// infowindow.setContent(strHtml); // 设置信息窗口内容。支持HTML内容，也支持传入DOM结点。
		// infowindow.openOnMap(); // 将弹出窗口添加到地图并关闭前一个；
		var textM = strDeathRadius+';'+strArea;//拼接的text
		var textArr = strDeathRadius.split("：");//用来判断x是否需要偏移（即判断是哪个象限的）
		var options={
			radius:0,//设置点空心半径，单位为px；
			weight:0,//设置点宽度，单位为px；
			color:"#0A95FC",//设置点的颜色；
			//设置点右侧显示的文字内容，也可以通过setText设置；初始化有text属性时，text渲染速度较慢，
			//当超过10000个点时会卡死；故点较多时，请勿设置text,通过bindInfoWindow方法设置点的详细信息。
			text:textM
		};
		//创建一个地图图标标注点实例,第一个参数为点类，第二个参数为可选参数
		var markerPoint=new Aqsc.MarkerPoint(pt,options);
		//设置第一象限的文本options属性
		var textOptions1={
			showBackground: true,// 是否显示矩形背景
			stroke: false, //文字是否设置背景颜色，默认设置；
			strokeColor: "white", //文字背景填充色颜色
			color: this.options.deathRadiusStyle.textColor, //设置文字的颜色；
			backgroundColor: this.options.deathRadiusStyle.textBackgroundColor,// 背景颜色，值必须是十六进制
			backgroundOpacity: this.options.deathRadiusStyle.textBackgroundOpacity,// 背景透明度
			font: this.options.deathRadiusStyle.font, //设置字体和大小，单位为px；
			offsetX: this.options.deathRadiusStyle.textOffsetX, //设置X轴偏移量；
			offsetY: this.options.deathRadiusStyle.textOffsetY, //设置y轴偏移量；
			backgroundWidth: this.options.deathRadiusStyle.textBackgroundWidth + "px",
			backgroundHeight: this.options.deathRadiusStyle.textBackgroundHeight + "px",
			backgroundBorderWidth: this.options.deathRadiusStyle.textBackgroundBorderWidth, //背景轮廓粗细
			backgroundBorderColor: this.options.deathRadiusStyle.textBackgroundBorderColor, //背景轮廓颜色
			delimiter: true, //是否启用分隔符
			delimiterWidth: 0, //分隔符粗细
			delimiterColor: this.options.deathRadiusStyle.delimiterColor, //分隔符颜色
		}
		//设置第二象限的文本options属性
		var textOptions2={
			showBackground: true,// 是否显示矩形背景
			stroke: false, //文字是否设置背景颜色，默认设置；
			strokeColor: "white", //文字背景填充色颜色
			color: this.options.seriousInjuryRadiusStyle.textColor, //设置文字的颜色；
			backgroundColor: this.options.seriousInjuryRadiusStyle.textBackgroundColor,// 背景颜色，值必须是十六进制
			backgroundOpacity: this.options.seriousInjuryRadiusStyle.textBackgroundOpacity,// 背景透明度
			font: this.options.seriousInjuryRadiusStyle.font, //设置字体和大小，单位为px；
			offsetX: this.options.seriousInjuryRadiusStyle.textOffsetX, //设置X轴偏移量；
			offsetY: this.options.seriousInjuryRadiusStyle.textOffsetY, //设置y轴偏移量；
			backgroundWidth: this.options.seriousInjuryRadiusStyle.textBackgroundWidth + "px",
			backgroundHeight: this.options.seriousInjuryRadiusStyle.textBackgroundHeight + "px",
			backgroundBorderWidth: this.options.seriousInjuryRadiusStyle.textBackgroundBorderWidth, //背景轮廓粗细
			backgroundBorderColor: this.options.seriousInjuryRadiusStyle.textBackgroundBorderColor, //背景轮廓颜色
			delimiter: true, //是否启用分隔符
			delimiterWidth: 0, //分隔符粗细
			delimiterColor: this.options.seriousInjuryRadiusStyle.delimiterColor, //分隔符颜色
		}
		//设置第三象限的文本options属性
		var textOptions3={
			showBackground: true,// 是否显示矩形背景
			stroke: false, //文字是否设置背景颜色，默认设置；
			strokeColor: "white", //文字背景填充色颜色
			color: this.options.minorWoundRadiusStyle.textColor, //设置文字的颜色；
			backgroundColor: this.options.minorWoundRadiusStyle.textBackgroundColor,// 背景颜色，值必须是十六进制
			backgroundOpacity: this.options.minorWoundRadiusStyle.textBackgroundOpacity,// 背景透明度
			font: this.options.minorWoundRadiusStyle.font, //设置字体和大小，单位为px；
			offsetX: this.options.minorWoundRadiusStyle.textOffsetX, //设置X轴偏移量；
			offsetY: this.options.minorWoundRadiusStyle.textOffsetY, //设置y轴偏移量；
			backgroundWidth: this.options.minorWoundRadiusStyle.textBackgroundWidth + "px",
			backgroundHeight: this.options.minorWoundRadiusStyle.textBackgroundHeight + "px",
			backgroundBorderWidth: this.options.minorWoundRadiusStyle.textBackgroundBorderWidth, //背景轮廓粗细
			backgroundBorderColor: this.options.minorWoundRadiusStyle.textBackgroundBorderColor, //背景轮廓颜色
			delimiter: true, //是否启用分隔符
			delimiterWidth: 0, //分隔符粗细
			delimiterColor: this.options.minorWoundRadiusStyle.delimiterColor, //分隔符颜色
		}
		//设置第四象限的文本options属性
		var textOptions4={
			showBackground: true,// 是否显示矩形背景
			stroke: false, //文字是否设置背景颜色，默认设置；
			strokeColor: "white", //文字背景填充色颜色
			color: this.options.safeRadiusStyle.textColor, //设置文字的颜色；
			backgroundColor: this.options.safeRadiusStyle.textBackgroundColor,// 背景颜色，值必须是十六进制
			backgroundOpacity: this.options.safeRadiusStyle.textBackgroundOpacity,// 背景透明度
			font: this.options.safeRadiusStyle.font, //设置字体和大小，单位为px；
			offsetX: this.options.safeRadiusStyle.textOffsetX, //设置X轴偏移量；
			offsetY: this.options.safeRadiusStyle.textOffsetY, //设置y轴偏移量；
			backgroundWidth: this.options.safeRadiusStyle.textBackgroundWidth + "px",
			backgroundHeight: this.options.safeRadiusStyle.textBackgroundHeight + "px",
			backgroundBorderWidth: this.options.safeRadiusStyle.textBackgroundBorderWidth, //背景轮廓粗细
			backgroundBorderColor: this.options.safeRadiusStyle.textBackgroundBorderColor, //背景轮廓颜色
			delimiter: true, //是否启用分隔符
			delimiterWidth: 0, //分隔符粗细
			delimiterColor: this.options.safeRadiusStyle.delimiterColor, //分隔符颜色
		}
		//根据不同的象限添加不同的文本样式
		switch (textArr[0]){
			case '死亡':
				markerPoint.setTextStyle(textOptions1);// 设置文本样式
				markerPoint.addToMap(this.map);
				popUpArr.push(markerPoint); // 添加到数组
				break;

			case '重伤':
				markerPoint.setTextStyle(textOptions2);// 设置文本样式
				markerPoint.addToMap(this.map);
				popUpArr.push(markerPoint); // 添加到数组
				break;

			case '轻伤':
				markerPoint.setTextStyle(textOptions3);// 设置文本样式
				markerPoint.addToMap(this.map);
				popUpArr.push(markerPoint); // 添加到数组
				break;

			case '安全':
				markerPoint.setTextStyle(textOptions4);// 设置文本样式
				markerPoint.addToMap(this.map);
				popUpArr.push(markerPoint); // 添加到数组
				break;
			default:
				break;
		}
		// console.log('sb',this.map);
		// markerPoint.setTextStyle(textOptions1);// 设置文本样式
		// markerPoint.addToMap();
		// popUpArr.push(markerPoint); // 添加到数组
	},
	/**
	 * 添加到地图上
	 */
	addToMap: function(map) {
		//圆的添加
		//圆的添加
		if(this.options.safeRadius){
			this.polygon2.addTo(map?map.map:this.map.map);// 安全的环形
			if(this.options.safeRadiusStyle.isShowText){
				this.polyline4.addToMap(map?map:this.map);//交线的添加
				this.ponint4.addToMap(map?map:this.map);
				this._addPopUp(this.aqCenterPt3, this.aqRadiusStr, this.aqAreaStr, this.popUpArr);
			}
		}
		if(this.options.minorWoundRadius){
			this.polygon1.addTo(map?map.map:this.map.map);// 轻伤的环形 
			if(this.options.minorWoundRadiusStyle.isShowText){
				this.polyline3.addToMap(map?map:this.map);
				this.ponint3.addToMap(map?map:this.map);
				this._addPopUp(this.qsCenterPt3, this.qsRadiusStr, this.qsAreaStr, this.popUpArr);
			}
		}
		if(this.options.seriousInjuryRadius){
			this.polygon.addTo(map?map.map:this.map.map);// 重伤的环形
			if(this.options.seriousInjuryRadiusStyle.isShowText){
				this.polyline2.addToMap(map?map:this.map);
				this.ponint2.addToMap(map?map:this.map);
				this._addPopUp(this.zsCenterPt3, this.zsRadiusStr, this.zsAreaStr, this.popUpArr);
			}
		}
		if(this.options.deathRadius){
			this.deathRadiusCircle.addToMap(map?map:this.map);
			if(this.options.deathRadiusStyle.isShowText){
				this.polyline1.addToMap(map?map:this.map);
				this.ponint1.addToMap(map?map:this.map);// 交点的添加
				this._addPopUp(this.swCenterPt3, this.swRadiusStr, this.swAreaStr, this.popUpArr);
			}
		}
		
		//除了死亡的圆，其他的都隐藏
//		this.safeRadiusCircle.setStyle({fill:false,stroke:false});
//		this.minorWoundRadiusCircle.setStyle({fill:false,stroke:false});
//		this.seriousInjuryRadiusCircle.setStyle({fill:false,stroke:false});
//		this.deathRadiusCircle.setStyle({stroke:false});
		this._inCircle(this.points);
	},
	/**
	 * 判断点是否在圆中(内部方法)
	 * @param {Object} points
	 */
	_inCircle: function(points) {
		var deathPtArr = []; // 死亡半径包含点位数组
		var seriousInjuryPtArr = []; // 重伤半径包含点位数组获取
		var minorWoundPtArr = []; // 轻伤半径包含点位数组获取
		var safePtArr = []; // 安全半径包含点位数组获取
		var ptLength = points.length;
		// 循环遍历点位
		for(var i = 0; i < ptLength; i++) {
			// 死亡半径包含点位数组获取
			if(this.deathRadiusCircle.intersects(points[i])) {
				deathPtArr.push(points[i]);
			}
			// 重伤半径包含点位数组获取；在重伤圆内不在死亡圆内
			if(this.seriousInjuryRadiusCircle.intersects(points[i]) && !this.deathRadiusCircle.intersects(points[i])) {
				seriousInjuryPtArr.push(points[i]);
			}
			// 轻伤半径包含点位数组获取；在轻伤圆内不在重伤圆内
			if(this.minorWoundRadiusCircle.intersects(points[i]) && !this.deathRadiusCircle.intersects(points[i])) {
				minorWoundPtArr.push(points[i]);
			}
			// 安全半径包含点位数组获取；在安全半径但不在轻伤半径内
			if(this.safeRadiusCircle.intersects(points[i]) && !this.minorWoundRadiusCircle.intersects(points[i])) {
				safePtArr.push(points[i]);
			}
		}
		var EvtM1 = document.createEvent('Event'); //创建一个事件
		EvtM1.initEvent('addToMap', true, true); //初始化事件,给定事件名字
		EvtM1.info = {
			death: deathPtArr,
			seriousInjury: seriousInjuryPtArr,
			minorWound: minorWoundPtArr,
			safe: safePtArr
		};
		window.dispatchEvent(EvtM1); //触发自定义inputChangeEvt事件
	},
	/**
	 * 从地图上移除
	 */
	remove: function(map) {
		this.isRemove = true;	//调用了remove方法，防止监听时添加四个弹窗
		//圆的移除
		this.deathRadiusCircle.remove(map?map:this.map);
		this.seriousInjuryRadiusCircle.remove(map?map:this.map);
		this.minorWoundRadiusCircle.remove(map?map:this.map);
		this.safeRadiusCircle.remove(map?map:this.map);
		//交点的移除
		map?map.map.removeLayer(this.polyline1.T):this.map.map.removeLayer(this.polyline1.T);
		map?map.map.removeLayer(this.polyline2.T):this.map.map.removeLayer(this.polyline2.T);
		map?map.map.removeLayer(this.polyline3.T):this.map.map.removeLayer(this.polyline3.T);
		map?map.map.removeLayer(this.polyline4.T):this.map.map.removeLayer(this.polyline4.T);
		
//		this.polyline1.remove(map?map:this.map);
//		this.polyline2.remove(map?map:this.map);
//		this.polyline3.remove(map?map:this.map);
//		this.polyline4.remove(map?map:this.map);
		//圆环的移除
		this.polygon.remove(map?map:this.map);
		this.polygon1.remove(map?map:this.map);
		this.polygon2.remove(map?map:this.map);
		this.polygon4.remove(map?map:this.map);
		// 各个弹出框移除
		for(var i = 0; i < this.popUpArr.length; i++) {
			this.popUpArr[i].remove(map?map:this.map);
		}
		//地图刷新
		map?map.refresh():this.map.refresh();
	},
	/**
	 * 添加到地图上的监听事件
	 * @param {Object} fun
	 */
	addToMapSucceeded: function(fun) {
		window.addEventListener("addToMap", function(e) {
			fun(e);
		});
	}
})
/*==================Aqsc.FireExplode====================end*/

/**
 * 瞬时泄漏模型
 */
Aqsc.InstantModel = Aqsc.Model.extend({
	options: {
		arySize:[160,360,600,800,1080],// 半径间隔数组(累计，第一个圆圆心到第二个圆圆心为160，第一个圆圆心到第三个圆圆心为360米，后续以此类推)，单位为米
		aryRadius:[50,80,100,120,80,40],// 半径数组，单位为米
		angle:0,// 取值范围为360度，即泄漏模型扩散的方向
		style:{
			color:"#FE9898",
			fill:true,
			fillColor:"#FE9898",
			weight:2 ,
			fillOpacity:0.7
		},
		animationTime:10 // 播放时间，单位秒
	},
	/**
	 * 添加到地图上
	 */
	addToMap: function() {
		this.instantCircleArr = []; // 瞬时泄漏圆数组
		
		// 因为leaflet绘制圆的单位为米  所以无效转换半径数组
		this.options.arySize = this._epsgTransUint(this.options.arySize,'array');// 距离数组，转换为度
		
		this.setTime = (this.options.animationTime / this.options.aryRadius.length) * 1000; // 延迟时间
		
		this._getInstantCircle(this.options.aryRadius, this.pt, 0, this.options.angle, this.setTime, this.options.style); // 添加圆
	},
	/**
	 * 从地图上移除
	 */
	remove: function() {
		for(var i = 0, l = this.instantCircleArr.length; i < l; i++) {
			this.instantCircleArr[i].remove();
		}
	},
	/**
	 * 获取瞬时泄漏的圆
	 * @param {Array} arr 圆半径数组
	 * @param {Object} cp1LonLat 事故点圆心
	 * @param {Number} i 为半径数组的索引，则距离数组的索引为从1开始，且为i-1
	 * @param {Number} angle 角度
	 * @param {Number} time 每个延迟的时间
	 * @param {Object} style 样式
	 */
	_getInstantCircle:function(arr,cp1LonLat,i,angle,time,style){
		if(i >= arr.length) {
			return;
		}
		var circle = null;
		style.radius = arr[i];
		if(i == 0) {
			var cp1pt = this.pt;
			// 创建圆
			circle = new Aqsc.Circle(cp1pt,style);
			circle.addToMap();
			// 只有一个圆的情况 
			if(arr.length == 1) {
				// 定位
			    this.map.fitBounds(circle.getBounds());
			}
			
			// 受体分析
			var eachInCircleArr = [];// 在每个圆内的点位
			for (var j = 0,l = this.points.length; j < l; j++) {
				if(circle.intersects(this.points[j])){
					eachInCircleArr.push(this.points[j]);
				}
			}
			var EvtM2 = document.createEvent('Event'); //创建一个事件
			EvtM2.initEvent('addInstanCircleToMap', true, true); //初始化事件,给定事件名字
			EvtM2.info = {
				index:i,
				pts: eachInCircleArr,
				circle:circle
			};
			window.dispatchEvent(EvtM2); //触发自定义inputChangeEvt事件
		} else {
			var cp2Lon = cp1LonLat.x + this._getInstEachCircleXY(this.options.arySize[i - 1], angle)[0];
			var cp2Lat = cp1LonLat.y + this._getInstEachCircleXY(this.options.arySize[i - 1], angle)[1];
			var cp2pt = new Aqsc.Point(cp2Lon, cp2Lat);
			
			// 添加图形到地图上
			circle = new Aqsc.Circle(cp2pt,style);
			circle.addToMap();
			
			// 受体分析
			var eachInCircleArr = [];// 在每个圆内的点位
			for (var j = 0,l = this.points.length; j < l; j++) {
				if(circle.intersects(this.points[j])){
					eachInCircleArr.push(this.points[j]);
				}
			}
			var EvtM3 = document.createEvent('Event'); //创建一个事件
			EvtM3.initEvent('addInstanCircleToMap', true, true); //初始化事件,给定事件名字
			EvtM3.info = {
				index:i,
				pts: eachInCircleArr,
				circle:circle
			};
			window.dispatchEvent(EvtM3); //触发自定义inputChangeEvt事件
			
			// 定位
			this.map.fitBounds(circle.getBounds());
		}
		
		this.instantCircleArr.push(circle);// 存储数组
		var tmp = this;
		if(i == arr.length - 1) { // 最后一个圆
			// 显示所有圆后需要重新定位
			// 作为矩形的中间顶点 并以此构建矩形定位
			var pt1 = new Aqsc.Point(cp1LonLat.x + 0.0001,cp1LonLat.y);
			var pt2 = new Aqsc.Point(cp2Lon,cp2Lat);
			
			var rec = new Aqsc.Rectangle([pt1,pt2]);
			setTimeout(function(){
				tmp.map.fitBounds(rec.getBounds());
			},time);
		}
		setTimeout(function () { tmp._getInstantCircle(arr,cp1LonLat,i+1,angle,time,style); }, time);
	},
	/**
	 * 图形添加到地图成功后事件
	 * @param {Object} fun
	 */
	addEachCircleSucceeded:function(fun){
		window.addEventListener("addInstanCircleToMap", function(e) {
			fun(e);
		});
	},
	/**
	 * 功能描述：获取瞬时模拟每个间隔的x,y坐标
	 * 作者：CLS
	 * 时间：2020年4月19日 下午2:23:29
	 * @param instDistance
	 * @param angle
	 * @returns {Array}
	 */
	_getInstEachCircleXY: function(instDistance, angle) {
		var distance = [];
		//象限上
		switch(angle) {
			case 90:
				{
					distance[0] = -instDistance;
					distance[1] = 0;
					return distance;
					break;
				}
			case 180:
				{
					distance[0] = 0;
					distance[1] = instDistance;
					return distance;
					break;
				}
			case 270:
				{
					distance[0] = instDistance;
					distance[1] = 0;
					return distance;
					break;
				}
			case 360:
				{
					distance[0] = 0;
					distance[1] = -instDistance;
					return distance;
					break;
				}
			case 0:
				{
					distance[0] = 0;
					distance[1] = -instDistance;
					return distance;
					break;
				}
			default:
				break;	
		}
		//第一象限
		if(angle > 0 && (angle < 90)) {
			distance[0] = -instDistance * Math.sin(angle * Math.PI / 180);
			distance[1] = -instDistance * Math.cos(angle * Math.PI / 180);
		}
		//第二象限
		else if(angle > 90 && angle < 180) {
			angle = angle - 90;
			distance[0] = -instDistance * Math.cos(angle * Math.PI / 180);
			distance[1] = instDistance * Math.sin(angle * Math.PI / 180);
		}
		//第三象限
		else if(angle > 180 && angle < 270) {
			angle = angle - 180;
			distance[0] = instDistance * Math.sin(angle * Math.PI / 180);
			distance[1] = instDistance * Math.cos(angle * Math.PI / 180);
		}
		//第四象限
		else {
			angle = angle - 270;
			distance[0] = +instDistance * Math.cos(angle * Math.PI / 180);
			distance[1] = -instDistance * Math.sin(angle * Math.PI / 180);
		}
		return distance;
	}
})

/**
 * 连续泄漏模型
 */
Aqsc.ContinueModel = Aqsc.Model.extend({
	options: {
		combustionStep: 1.03, // 燃烧区步长，单位为米
		poisoningStep: 2.45, // 中毒区步长，单位为米
		combustionStart: 0, // 燃烧偏移量，单位为米
		combustionArea: 2997.82, // 燃烧区面积,单位平方米
		poisoningStart: 0, // 中毒偏移量，单位为米
		poisoningArea: 3087.83, // 中毒区面积
		strType: 0, // 展示类型，为0则展示燃烧和中毒，1为燃烧，2为中毒
		aryCombustion: [], // 燃烧区点位数组，纺锤体中心线每个步长到纺锤体弧边的距离，单位米
		aryPoisoning: [], //  中毒区点位数组，纺锤体中心线每个步长到纺锤体弧边的距离，单位米
		angle: 0, // 取值范围为360度，即泄漏模型扩散的方向
    isShowPopUp:true,
		combustionPgonStyle: {
			renderer: 'svg',
			weight: 0,
			color: "#D7873B",
			fillColor: "#D7873B",
			fillOpacity: 0.7
		},
		poisoningPgonStyle: {
			renderer: 'svg',
			weight: 0,
			color: "#DA48A6",
			fillColor: "#DA48A6",
			fillOpacity: 0.7
		}
	},
	/**
	 * 燃烧的翼展距离数组
	 */
	_defaultAryCombustion: function(aryPoisoning) {
		var aryCombustion = [];
		for(var i = 0; i < aryPoisoning.length; i++) {
			aryCombustion[i] = aryPoisoning[i] + 10;
		}
		aryCombustion[100] = 0;
		return aryCombustion;
	},
	/**
	 * 中毒的翼展距离数组
	 */
	_defaultAryPoisoning: function() {
		var aryPoisoning = [];
		aryPoisoning[0] = 0.0;
		aryPoisoning[1] = 1.9299999999999318;
		aryPoisoning[2] = 3.6199999999998957;
		aryPoisoning[3] = 4.979999999999867;
		aryPoisoning[4] = 6.159999999999842;
		aryPoisoning[5] = 7.20999999999982;
		aryPoisoning[6] = 8.1699999999998;
		aryPoisoning[7] = 9.05999999999978;
		aryPoisoning[8] = 9.889999999999763;
		aryPoisoning[9] = 10.669999999999746;
		aryPoisoning[10] = 11.40999999999973;
		aryPoisoning[11] = 12.109999999999715;
		aryPoisoning[12] = 12.779999999999724;
		aryPoisoning[13] = 13.419999999999824;
		aryPoisoning[14] = 14.02999999999992;
		aryPoisoning[15] = 14.620000000000012;
		aryPoisoning[16] = 15.1800000000001;
		aryPoisoning[17] = 15.730000000000185;
		aryPoisoning[18] = 16.250000000000266;
		aryPoisoning[19] = 16.750000000000345;
		aryPoisoning[20] = 17.24000000000042;
		aryPoisoning[21] = 17.710000000000495;
		aryPoisoning[22] = 18.160000000000565;
		aryPoisoning[23] = 18.590000000000632;
		aryPoisoning[24] = 19.010000000000698;
		aryPoisoning[25] = 19.41000000000076;
		aryPoisoning[26] = 19.80000000000082;
		aryPoisoning[27] = 20.18000000000088;
		aryPoisoning[28] = 20.540000000000937;
		aryPoisoning[29] = 20.89000000000099;
		aryPoisoning[30] = 21.220000000001043;
		aryPoisoning[31] = 21.540000000001093;
		aryPoisoning[32] = 21.850000000001142;
		aryPoisoning[33] = 22.140000000001187;
		aryPoisoning[34] = 22.42000000000123;
		aryPoisoning[35] = 22.690000000001273;
		aryPoisoning[36] = 22.950000000001314;
		aryPoisoning[37] = 23.200000000001353;
		aryPoisoning[38] = 23.43000000000139;
		aryPoisoning[39] = 23.650000000001423;
		aryPoisoning[40] = 23.860000000001456;
		aryPoisoning[41] = 24.060000000001487;
		aryPoisoning[42] = 24.240000000001515;
		aryPoisoning[43] = 24.420000000001544;
		aryPoisoning[44] = 24.58000000000157;
		aryPoisoning[45] = 24.730000000001592;
		aryPoisoning[46] = 24.860000000001612;
		aryPoisoning[47] = 24.990000000001633;
		aryPoisoning[48] = 25.10000000000165;
		aryPoisoning[49] = 25.210000000001667;
		aryPoisoning[50] = 25.30000000000168;
		aryPoisoning[51] = 25.370000000001692;
		aryPoisoning[52] = 25.440000000001703;
		aryPoisoning[53] = 25.49000000000171;
		aryPoisoning[54] = 25.530000000001717;
		aryPoisoning[55] = 25.560000000001722;
		aryPoisoning[56] = 25.580000000001725;
		aryPoisoning[57] = 25.580000000001725;
		aryPoisoning[58] = 25.570000000001723;
		aryPoisoning[59] = 25.55000000000172;
		aryPoisoning[60] = 25.510000000001714;
		aryPoisoning[61] = 25.460000000001706;
		aryPoisoning[62] = 25.400000000001697;
		aryPoisoning[63] = 25.320000000001684;
		aryPoisoning[64] = 25.23000000000167;
		aryPoisoning[65] = 25.120000000001653;
		aryPoisoning[66] = 25.000000000001634;
		aryPoisoning[67] = 24.860000000001612;
		aryPoisoning[68] = 24.71000000000159;
		aryPoisoning[69] = 24.540000000001562;
		aryPoisoning[70] = 24.360000000001534;
		aryPoisoning[71] = 24.160000000001503;
		aryPoisoning[72] = 23.94000000000147;
		aryPoisoning[73] = 23.70000000000143;
		aryPoisoning[74] = 23.450000000001392;
		aryPoisoning[75] = 23.170000000001348;
		aryPoisoning[76] = 22.880000000001303;
		aryPoisoning[77] = 22.560000000001253;
		aryPoisoning[78] = 22.2300000000012;
		aryPoisoning[79] = 21.870000000001145;
		aryPoisoning[80] = 21.480000000001084;
		aryPoisoning[81] = 21.07000000000102;
		aryPoisoning[82] = 20.640000000000953;
		aryPoisoning[83] = 20.17000000000088;
		aryPoisoning[84] = 19.680000000000803;
		aryPoisoning[85] = 19.16000000000072;
		aryPoisoning[86] = 18.590000000000632;
		aryPoisoning[87] = 18.00000000000054;
		aryPoisoning[88] = 17.36000000000044;
		aryPoisoning[89] = 16.670000000000332;
		aryPoisoning[90] = 15.940000000000218;
		aryPoisoning[91] = 15.150000000000095;
		aryPoisoning[92] = 14.299999999999962;
		aryPoisoning[93] = 13.369999999999816;
		aryPoisoning[94] = 12.34999999999971;
		aryPoisoning[95] = 11.239999999999734;
		aryPoisoning[96] = 9.97999999999976;
		aryPoisoning[97] = 8.55999999999979;
		aryPoisoning[98] = 6.8899999999998265;
		aryPoisoning[99] = 4.819999999999871;
		aryPoisoning[100] = 0;
		return aryPoisoning;
	},
	initialize: function(map, pt, points, options) {
		// 赋值
		this.map = map;
		this.pt = pt;
		this.points = points;

		this.options.aryPoisoning = this._defaultAryPoisoning();
		this.options.aryCombustion = this._defaultAryCombustion(this.options.aryPoisoning);

		// 重新设置options
		this.options = Aqsc.Util.setOptions(this, options);
		// 图层设置
		this.combustionPolygon = null;
		this.poisoningPolygon = null;
		this.polygonArr = []; // 图层数组

		// 弹窗数组
		this.popUpArr = [];
	},
	/**
	 * 增加图形流动动画
	 * @param {Number} angle 角度
	 * @param {Object} style 样式
	 * @param {String} aminationColor 颜色
	 */
	_setAminationDirection: function(angle, style, aminationColor) {
		style.shadeColor1 = style.fillColor;
		style.shadeColor2 = aminationColor;
		style.shadeEffectAmination = true;
		style.fillType = "2"
		switch (true) {
				//先判断是否在象限上
			case(angle == 0):
				//从上到下
				style.shadeEffectType = 'sdx';
				break;
			case(angle == 90):
				//从右到左
				style.shadeEffectType = 'ydz';
				break;
			case(angle == 180):
				//从下到上
				style.shadeEffectType = 'xds';
				break;
			case(angle == 270):
				//从左到右
				style.shadeEffectType = 'zdy';
				break;
			case(angle == 360):
				//从上到下
				style.shadeEffectType = 'sdx';
				break;
				//再判断是否在哪一象限
			case(angle > 0 && angle < 90):
				//从右到左
				style.shadeEffectType = 'ydz';
				break;
			case(angle > 90 && angle < 180):
				//从右到左
				style.shadeEffectType = 'ydz';
				break;
			case(angle > 180 && angle < 270):
				//从左到右
				style.shadeEffectType = 'zdy';
				break;
			case(angle > 270 && angle < 360):
				//从左到右
				style.shadeEffectType = 'zdy';
				break;
			default:
				console.log("setAminationDirection方法传参异常");
				break;
		}
		return style;
	},
	/**
	 * 功能描述：添加弹出框
	 * 作者：CLS
	 * 时间：2020年4月16日 下午2:23:29 
	 * @param {Object} pt
	 * @param {Object} str1
	 * @param {Object} str2
	 */
	_addPopUp: function(pt, str1, str2, popUpArr) {
		var strHtml = '<div class="costom-popup-content" >' +
			'<div>' + str1 + '</div>' +
			'<div>' + str2 + '</div>' +
			'</div>';
		var infowindow = new Aqsc.InfoWindow({
			closeOnClick: false,
			closeButton: false
		});
		infowindow.setTitleContent(["信息", ""]); //设置头部信息
		infowindow.setPosition(pt); //设置信息窗口的地理坐标；
		infowindow.setContent(strHtml); //设置信息窗口内容。支持HTML内容，也支持传入DOM结点。
		infowindow.openOnMap(); //将弹出窗口添加到地图并关闭前一个；
		popUpArr.push(infowindow); // 添加到數組
	},
	/**
	 * 功能描述：生成连续泄露模拟纺锤体
	 * 作者：CLS
	 * 时间：2020年4月16日 下午2:23:29 
	 * @param {Object} c_lon 纺锤体起点x坐标
	 * @param {Object} c_lat 纺锤体起点y坐标
	 * @param {Object} array 燃烧中毒点位数组
	 * @param {Object} step 步长
	 * @param {Object} angle 风向角度
	 * @param {Object} vector 纺锤体添加到的图层 
	 * @param {Object} style 仿锥体矢量feature样式
	 * @param {Object} type 是中毒仿锥体还是燃烧纺锤体
	 * @param {Object} length 长度
	 * @param {Object} area 面积
	 * @param {Object} aminationColor 动画流动颜色
	 */
	_createContinueModelPgn: function(c_lon, c_lat, array, step, angle, vector, style, type, length, area, aminationColor) {
		var plabel = null; // label的位置
		var pts = []; // 存储纺锤体的边的点数组
		var pt = null;
		var plonLat = new Aqsc.Point(c_lon, c_lat); // 起点
		plonLat.lon = plonLat.x;
		plonLat.lat = plonLat.y;

		// 设置纺锤体动画流动方向
		// TODO
	    style = this._setAminationDirection(angle, style, aminationColor);
		// 这里的象限存在逻辑缝隙，但是结果是对的！
		// 第四象限
		if(angle > 0 && (angle < 90 || angle == 360)) {
			//画上半部分
			for(var i = 0; i < array.length; i++) {
				//起点
				if(i == 0) {
					pt = new Aqsc.Point(c_lon, c_lat);
					pts.push(pt);
				} else {
					//斜边l
					var l = Math.sqrt(Math.pow(array[i], 2) + Math.pow(step * i, 2)); // l单位已转化为米
					var ag = Math.PI / 2 - Math.acos(step * i / l) - angle * Math.PI / 180;
					var plon = plonLat.lon - l * Math.cos(ag);
					var plat = plonLat.lat - l * Math.sin(ag);
					pt = new Aqsc.Point(plon, plat);
					plabel = new Aqsc.Point(plon, plat);
					pts.push(pt);
				}
			}
      if (this.options.isShowPopUp) {
        if(type == "1") {
          this._addPopUp(plabel, "燃烧距离:" + Number(length).toFixed(2) + "米", "面积:" + Number(area).toFixed(2) + "平方米", this.popUpArr);
        } else {
          this._addPopUp(plabel, "中毒距离:" + Number(length).toFixed(2) + "米", "面积:" + Number(area).toFixed(2) + "平方米", this.popUpArr);
        }
      }
			
			// 画下半部分
			for(var j = 1; j < array.length - 1; j++) {
				//斜边为点位数组中的点数值长度与相对应步长的斜边
				var l = Math.sqrt(Math.pow(array[array.length - j - 1], 2) + Math.pow(step * (array.length - j - 1), 2));
				var ag = angle * Math.PI / 180 - Math.acos(step * (array.length - j - 1) / l);
				var plon = plonLat.lon - l * Math.sin(ag);
				var plat = plonLat.lat - l * Math.cos(ag);
				pt = new Aqsc.Point(plon, plat);
				pll = new Aqsc.Point(plon, plat);
				pts.push(pt);
			}
		} else if(angle > 90 && angle < 180) { //第三象限
			angle = angle - 90;
			// 画上半部分
			for(var i = 0; i < array.length; i++) {
				// 起点
				if(i == 0) {
					pt = new Aqsc.Point(c_lon, c_lat);
					pts.push(pt);
				} else {
					// 斜边为点位数组中的点数值长度与相对应步长的斜边
					var l = Math.sqrt(Math.pow(array[i], 2) + Math.pow(step * i, 2)); //l单位已转化为米
					var ag = Math.PI / 2 - Math.acos(step * i / l) - angle * Math.PI / 180;
					var plon = plonLat.lon - l * Math.sin(ag);
					var plat = plonLat.lat + l * Math.cos(ag);
					// var xy_plonLat = new HX.LonLat(plon, plat);
					pt = new Aqsc.Point(plon, plat);
					plabel = new Aqsc.Point(plon, plat);
					pts.push(pt);
				}
			}
			if (this.options.isShowPopUp) {
        if(type == "1") {
          this._addPopUp(plabel, "燃烧距离:" + Number(length).toFixed(2) + "米", "面积:" + Number(area).toFixed(2) + "平方米", this.popUpArr);
        } else {
          this._addPopUp(plabel, "中毒距离:" + Number(length).toFixed(2) + "米", "面积:" + Number(area).toFixed(2) + "平方米", this.popUpArr);
        }
      }
			// 画下半部分
			for(var j = 1; j < array.length - 1; j++) {
				// 斜边为点位数组中的点数值长度与相对应步长的斜边
				var l = Math.sqrt(Math.pow(array[array.length - j - 1], 2) + Math.pow(step * (array.length - j - 1), 2));
				var ag = angle * Math.PI / 180 - Math.acos(step * (array.length - j - 1) / l);
				var plon = plonLat.lon - l * Math.cos(ag);
				var plat = plonLat.lat + l * Math.sin(ag);
				// var xy_plonLat = new HX.LonLat(plon, plat); //x,y坐标
				pt = new Aqsc.Point(plon, plat);
				pts.push(pt);
			}
		} else if(angle > 180 && angle < 270) { // 第二象限
			angle = angle - 180;
			// 画上半部分
			for(var i = 0; i < array.length; i++) {
				//起点
				if(i == 0) {
					pt = new Aqsc.Point(c_lon, c_lat);
					pts.push(pt);
				} else {
					//斜边为点位数组中的点数值长度与相对应步长的斜边
					var l = Math.sqrt(Math.pow(array[i], 2) + Math.pow(step * i, 2)); //l单位已转化为米
					var ag = angle * Math.PI / 180 - Math.acos(step * i / l);
					var plon = plonLat.lon + l * Math.sin(ag);
					var plat = plonLat.lat + l * Math.cos(ag);
					var xy_plonLat = new HX.LonLat(plon, plat);
					pt = new Aqsc.Point(plon, plat);
					plabel = new Aqsc.Point(plon, plat);
					pts.push(pt);
				}
			}
      if (this.options.isShowPopUp) {
        if(type == "1") {
          this._addPopUp(plabel, "燃烧距离:" + Number(length).toFixed(2) + "米", "面积:" + Number(area).toFixed(2) + "平方米", this.popUpArr);
        } else {
          this._addPopUp(plabel, "中毒距离:" + Number(length).toFixed(2) + "米", "面积:" + Number(area).toFixed(2) + "平方米", this.popUpArr);
        }
      }
			
			// 画下半部分
			for(var j = 1; j < array.length - 1; j++) {
				//斜边为点位数组中的点数值长度与相对应步长的斜边
				var l = Math.sqrt(Math.pow(array[array.length - j - 1], 2) + Math.pow(step * (array.length - j - 1), 2));
				var ag = Math.PI / 2 - angle * Math.PI / 180 - Math.acos(step * (array.length - j - 1) / l);
				var plon = plonLat.lon + l * Math.cos(ag);
				var plat = plonLat.lat + l * Math.sin(ag);
				pt = new Aqsc.Point(plon, plat);
				pts.push(pt);
			}
		} else { // 第一象限
			// 画上半部分
			angle = angle - 270;
			for(var i = 0; i < array.length; i++) {
				//起点
				if(i == 0) {
					pt = new Aqsc.Point(c_lon, c_lat);
					pts.push(pt);
				} else {
					//斜边为点位数组中的点数值长度与相对应步长的斜边
					var l = Math.sqrt(Math.pow(array[i], 2) + Math.pow(step * i, 2)); //l单位已转化为米
					var ag = angle * Math.PI / 180 - Math.acos(step * i / l);
					var plon = plonLat.lon + l * Math.cos(ag);
					var plat = plonLat.lat - l * Math.sin(ag);
					// var xy_plonLat = new HX.LonLat(plon, plat);
					pt = new Aqsc.Point(plon, plat);
					plabel = new Aqsc.Point(plon, plat);
					pts.push(pt);
				}
			}
      if (this.options.isShowPopUp) {
        if(type == "1") {
          this._addPopUp(plabel, "燃烧距离:" + Number(length).toFixed(2) + "米", "面积:" + Number(area).toFixed(2) + "平方米", this.popUpArr);
        } else {
          this._addPopUp(plabel, "中毒距离:" + Number(length).toFixed(2) + "米", "面积:" + Number(area).toFixed(2) + "平方米", this.popUpArr);
        }
      }
			
			// 画下半部分
			for(var j = 1; j < array.length - 1; j++) {
				// 斜边为点位数组中的点数值长度与相对应步长的斜边  索引从另一头过来
				var l = Math.sqrt(Math.pow(array[array.length - j - 1], 2) + Math.pow(step * (array.length - j - 1), 2));
				var ag = Math.PI / 2 - angle * Math.PI / 180 - Math.acos(step * (array.length - j - 1) / l);
				var plon = plonLat.lon + l * Math.sin(ag);
				var plat = plonLat.lat - l * Math.cos(ag);
				// var xy_plonLat = new HX.LonLat(plon, plat); //x,y坐标
				pt = new Aqsc.Point(plon, plat);
				pts.push(pt);
			}
		}
		// 添加到地图上
		vector = new Aqsc.Polygon(pts, style);
		vector.addToMap();
		vector.setStyle(style);
		this.polygonArr.push(vector);
	},
	/**
	 * 添加到地图上的监听事件
	 * @param {Object} fun
	 */
	addToMapSucceeded: function(fun) {
		window.addEventListener("addContinuePolygonToMap", function(e) {
			fun(e);
		});
	},
	/**
	 * 添加到地图上
	 */
	addToMap: function() {
		// 燃烧参数值
		var aryCombustion = this._epsgTransUint(this.options.aryCombustion, 'array');
		var dbCombustionStep = this._epsgTransUint(this.options.combustionStep, 'length');

		// 中毒参数值
		var aryPoisoning = this._epsgTransUint(this.options.aryPoisoning, 'array');
		var dbPoisoningStep = this._epsgTransUint(this.options.poisoningStep, 'length');

		var combustionArea = this.options.combustionArea; // 燃烧面积
		var combustionLength = (this.options.aryCombustion.length - 1) * this.options.combustionStep; // 燃烧距离

		var poisoningArea = this.options.poisoningArea; // 中毒面积
		var poisoningLength = (this.options.aryPoisoning.length - 1) * this.options.poisoningStep; // 中毒距离

		var angle = this.options.angle; // 旋转角度

		switch(this.options.strType) {
			case 0:
				// 创建燃烧图层
				this._createContinueModelPgn(this.pt.x, this.pt.y, aryCombustion, dbCombustionStep, angle, this.combustionPolygon, this.options.combustionPgonStyle, 1, combustionLength, combustionArea, '#FE1918');
				// 创建中毒图层
				this._createContinueModelPgn(this.pt.x, this.pt.y, aryPoisoning, dbPoisoningStep, angle, this.poisoningPolygon, this.options.poisoningPgonStyle, 2, poisoningLength, poisoningArea, '#FD68DD');
				break;
			case 1:
				// 创建单独燃烧图层
				this._createContinueModelPgn(this.pt.x, this.pt.y, aryCombustion, dbCombustionStep, angle, this.combustionPolygon, this.options.combustionPgonStyle, 1, combustionLength, combustionArea, '#FE1918');
				break;
			case 2:
				// 创建单独中毒图层
				this._createContinueModelPgn(this.pt.x, this.pt.y, aryPoisoning, dbPoisoningStep, angle, this.poisoningPolygon, this.options.poisoningPgonStyle, 2, poisoningLength, poisoningArea, '#FD68DD');
				break;
			default:
				console.warn('泄漏模型参数有误！');
				break;
		}
		// 受体分析
		this._inPolygon(this.points,combustionLength,poisoningLength);
	},
	_inPolygon:function(pts,combustionDis,poisoningDis){
		// 受体分析
		var eachInComPolygonArr = [];// 在中毒面内的点位
		var eachInPoiPolygonArr = [];// 在燃烧面内的点位
		
		var EvtM4 = document.createEvent('Event'); //创建一个事件
		EvtM4.initEvent('addContinuePolygonToMap', true, true); //初始化事件,给定事件名字
		/*=====燃烧中毒======*/
		if(this.polygonArr.length==2){
			for (var j = 0,l = this.points.length; j < l; j++) {
				if(this.polygonArr[0].intersects(this.points[j])){
					eachInComPolygonArr.push(this.points[j]);
				}
			}
			// TODO
			// 暂不区分 又在中毒又在烧热中 它属于的问题
			for (var j = 0,l = this.points.length; j < l; j++) {
				if(this.polygonArr[1].intersects(this.points[j])){
					eachInPoiPolygonArr.push(this.points[j]);
				}
			}
			EvtM4.info = {
				combustion: eachInComPolygonArr,
				poisoning: eachInPoiPolygonArr,
				combustionDis:combustionDis,
				poisoningDis:poisoningDis
			};
		}else{
			/*===燃烧===*/
			if(this.options.strType==1){
				for (var j = 0,l = this.points.length; j < l; j++) {
					if(this.polygonArr[0].intersects(this.points[j])){
						eachInComPolygonArr.push(this.points[j]);
					}
				}
				EvtM4.info = {
					combustion: eachInComPolygonArr,
					combustionDis:combustionDis
				};
			}
			/*===中毒===*/
			if(this.options.strType==2){
				for (var j = 0,l = this.points.length; j < l; j++) {
					if(this.polygonArr[0].intersects(this.points[j])){
						eachInPoiPolygonArr.push(this.points[j]);
					}
				}
				EvtM4.info = {
					poisoning: eachInPoiPolygonArr,
					poisoningDis:poisoningDis
				};
			}
		}
		window.dispatchEvent(EvtM4); //触发自定义inputChangeEvt事件
	},
	/**
	 * 从地图上移除
	 */
	remove: function() {
		// 图形的移除
		for (var i = 0; i < this.polygonArr.length; i++) {
			this.polygonArr[i].remove();
		}
		// 弹出框的移除
		// 各个弹出框移除
		for(var i = 0; i < this.popUpArr.length; i++) {
			this.popUpArr[i].removeFromMap();
		}
	}
})