/**
 * @功能描述:haoutil
 * @author: CLS
 * @date: 14:06 2019/5/2
 */

var haoutil = haoutil || {};

haoutil.version = "2.3";
haoutil.name = "JS方法类库";
haoutil.author = "CLS";

haoutil.msg = function(msg) {
	if(window.toastr) //此方法需要引用toastr 
		toastr.info(msg);
	else if(window.layer)
		layer.msg(msg); //此方法需要引用layer.js
	else
		alert(msg);
};
haoutil.tip = haoutil.msg;

haoutil.alert = function(msg, title) {
	if(window.toastr) //此方法需要引用toastr 
		toastr.warning(msg, title);
	else if(window.layer) //此方法需要引用layer.js
		layer.alert(msg, {
			title: title || '提示',
			skin: 'layui-layer-lan layer-mars-dialog2',
			closeBtn: 0,
			anim: 0
		});
	else
		alert(msg);
};

haoutil.loading = {
	index: -1,
	show: function(param) {
		this.close();

		if(window.NProgress) { //此方法需要引用NProgress 
			param = param || {};
			if(param.color) {
				param.template = '<div class="bar ' + (param.className || '') + '" style="background-color:' + param.color + ';" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>';
			} else {
				param.template = '<div class="bar ' + (param.className || '') + '" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>';
			}

			NProgress.configure(param);
			NProgress.start();
		} else if(window.layer) { //此方法需要引用layer.js
			this.index = layer.load(2, {
				shade: [0.3, '#000000']
			});
		}
	},
	hide: function() {
		this.close();
	},
	close: function() {
		if(window.NProgress) {
			NProgress.done(true);
		} else if(window.layer) {
			if(this.index != -1)
				layer.close(this.index);
			this.index = -1;
		}
	}
};

if(window.noCopy) {
	function KeyDown() {
		//console.log("ASCII代码是："+event.keyCode);

		if(
			event.keyCode == 112 || //屏蔽 F1   
			event.keyCode == 123 || //屏蔽 F12 
			(event.ctrlKey && event.keyCode == 82) || //屏蔽 Ctrl + R
			(event.ctrlKey && event.keyCode == 78) || //屏蔽 Ctrl + N
			(event.shiftKey && event.keyCode == 121) || //屏蔽  shift+F10
			(event.altKey && event.keyCode == 115) || //屏蔽  Alt+F4
			(event.srcElement.tagName == "A" && event.shiftKey) //屏蔽 shift 加鼠标左键新开一网页
		) {
			event.keyCode = 0;
			event.returnValue = false;
			return false;
		}

		return true;
	}
	//键盘按下 
	document.onkeydown = KeyDown;
	document.oncontextmenu = function() {
		event.returnValue = false;
	};
	document.onselectstart = function() {
		event.returnValue = false;
	};
	document.oncopy = function() {
		event.returnValue = false;
	};
}

//function expose() {
//    var old = window.haoutil;

//    haoutil.noConflict = function () {
//        window.haoutil = old;
//        return this;
//    };

//    window.haoutil = haoutil;
//}

//// define haoutil for Node module pattern loaders, including Browserify
//if (typeof module === 'object' && typeof module.exports === 'object') {
//    module.exports = haoutil;

//    // define haoutil as an AMD module
//} else if (typeof define === 'function' && define.amd) {
//    define(haoutil);
//}

//// define gispace as a global haoutil variable, saving the original haoutil to restore later if needed
//if (typeof window !== 'undefined') {
//    expose();
//}
/* 2017-11-6 10:15:31 | 修改 CLS（QQ：1669209231） */
//js原生对象扩展

//标识是否扩展数组对象
if(!window.noArrayPrototype) {
	//扩展array数组方法,不要用for(var i in arr)来循环数组
	Array.prototype.indexOf = Array.prototype.indexOf || function(val) {
		for(var i = 0; i < this.length; i++) {
			if(this[i] == val) return i;
		}
		return -1;
	};
	Array.prototype.remove = Array.prototype.remove || function(val) {
		for(var i = 0; i < this.length; i++) {
			if(this[i] == val) {
				this.splice(i, 1);
				break;
			}
		}
	};
	Array.prototype.insert = Array.prototype.insert || function(item, index) {
		if(index == null) index = 0;
		this.splice(index, 0, item);
	};
}

String.prototype.startsWith = String.prototype.startsWith || function(str) {
	return this.slice(0, str.length) == str;
};
//判断当前字符串是否以str结束 
String.prototype.endsWith = String.prototype.endsWith || function(str) {
	return this.slice(-str.length) == str;
};
String.prototype.replaceAll = String.prototype.replaceAll || function(oldstring, newstring) {
	return this.replace(new RegExp(oldstring, "gm"), newstring);
}

/**  
 * 对Date的扩展，将 Date 转化为指定格式的String 
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符 
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
 * 
 * (new Date()).format("yyyy-M-d HH:mm:ss") ==> 2017-1-9 08:35:26
 * (new Date()).format("yyyy-M-d h:m:s.S") ==> 2016-7-2 8:9:4.18 
 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2016-07-02 08:09:04.423 
 * (new Date()).format("yyyy-MM-dd E HH:mm:ss") ==> 2016-03-10 二 20:09:04 
 * (new Date()).format("yyyy-MM-dd EE hh:mm:ss") ==> 2016-03-10 周二 08:09:04 
 * (new Date()).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2016-03-10 星期二 08:09:04 
 */
Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份       
		"d+": this.getDate(), //日       
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时       
		"H+": this.getHours(), //小时       
		"m+": this.getMinutes(), //分       
		"s+": this.getSeconds(), //秒       
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度       
		"S": this.getMilliseconds() //毫秒       
	};
	var week = {
		"0": "\u65e5",
		"1": "\u4e00",
		"2": "\u4e8c",
		"3": "\u4e09",
		"4": "\u56db",
		"5": "\u4e94",
		"6": "\u516d"
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if(/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};
/* 2017-12-8 09:39:39 | 修改 CLS（QQ：1669209231） */
haoutil.color = (function() {
	// "颜色 相关操作类";
	//============内部私有属性及方法============

	//随机颜色
	function random() {
		return '#' +

			(function(color) {

				return(color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : arguments.callee(color);

			})('');
	}

	//===========对外公开的属性及方法=========
	return {
		random: random
	};
})();
/* 2017-10-10 13:32:56 | 修改 CLS（QQ：1669209231） */
haoutil.cookie = (function() {
	//"cookie 相关操作类";
	//============内部私有属性及方法============ 
	var _isH5Mobile;

	function isH5Mobile(value) {
		_isH5Mobile = value;
	}

	//添加cookie
	function add(name, value, days) {

		//判断是否设置过期时间,0代表关闭浏览器时失效
		var date;
		if(days > 0) {
			date = new Date();
			date.setTime(date.getTime + days * 24 * 60 * 60 * 1000); //单位是天后失效
		} else {
			date = new Date(0x7fffffff * 1e3);
		}
		var cookieString = name + "=" + escape(value) + "; expires=" + date.toGMTString();

		if(_isH5Mobile && window['plus'] != null) {
			plus.navigator.setCookie(name, cookieString);
		} else {
			document.cookie = cookieString;
		}
	}

	//获取cookie
	function get(name) {
		var strCookie
		if(_isH5Mobile && window['plus'] != null) {
			strCookie = plus.navigator.getCookie(name);
			if(strCookie == null) return null;

		} else {
			strCookie = document.cookie;
		}

		var arrCookie = strCookie.split("; ");
		for(var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split("=");
			if(arr[0] == name) {
				return unescape(arr[1]);
			}
		}
		return null;
	}

	//删除cookie
	function del(name) {
		if(_isH5Mobile && window['plus'] != null) {
			plus.navigator.removeCookie(name);
		} else {
			var date = new Date();
			date.setTime(date.getTime() - 10000); //设定一个过去的时间即可
			document.cookie = name + "=v; expires=" + date.toGMTString();
		}
	}

	//===========对外公开的属性及方法=========
	return {
		isH5Mobile: isH5Mobile,
		add: add,
		get: get,
		del: del
	};
})();

/* 2017-8-31 17:26:30 | 修改 CLS（QQ：1669209231） */
haoutil.file = (function() {
	//"文件 相关操作类";
	//============内部私有属性及方法============

	function _download(fileName, blob) {
		var aLink = document.createElement('a');
		aLink.download = fileName;
		aLink.href = URL.createObjectURL(blob);
		document.body.appendChild(aLink);
		aLink.click();
		document.body.removeChild(aLink);
	}

	//下载保存文件
	function downloadFile(fileName, string) {
		var blob = new Blob([string]);
		_download(fileName, blob);
	}

	//下载导出图片
	function downloadImage(name, canvas) {
		var base64 = canvas.toDataURL("image/png");
		var blob = base64Img2Blob(base64);
		_download(name + '.png', blob);
	}

	function base64Img2Blob(code) {
		var parts = code.split(';base64,');
		var contentType = parts[0].split(':')[1];
		var raw = window.atob(parts[1]);
		var rawLength = raw.length;

		var uInt8Array = new Uint8Array(rawLength);
		for(var i = 0; i < rawLength; ++i) {
			uInt8Array[i] = raw.charCodeAt(i);
		}
		return new Blob([uInt8Array], {
			type: contentType
		});
	}

	//===========对外公开的属性及方法=========
	return {
		download: _download,
		downloadFile: downloadFile,
		downloadImage: downloadImage,
		base64Img2Blob: base64Img2Blob
	};
})();
/* 2017-12-5 13:38:32 | 修改 CLS（QQ：1669209231） */
haoutil.isutil = (function() {
	// "判断 相关操作类";

	//============内部私有属性及方法============
	function isArray(obj) {
		return(typeof obj == 'object') && obj.constructor == Array;
	}

	function isString(str) {
		return(typeof str == 'string') && str.constructor == String;
	}

	function isNumber(obj) {
		return(typeof obj == 'number') && obj.constructor == Number;
	}

	function isDate(obj) {
		return(typeof obj == 'object') && obj.constructor == Date;
	}

	function isFunction(obj) {
		return(typeof obj == 'function') && obj.constructor == Function;
	}

	function isObject(obj) {
		return(typeof obj == 'object') && obj.constructor == Object;
	}

	function isNull(value) {
		if(value == null) return true;
		if(isString(value) && value == "") return true;
		if(isNumber(value) && isNaN(value)) return true;

		return false;
	}

	function isNotNull(value) {
		return !isNull(value);
	}

	//===========对外公开的属性及方法=========
	return {
		isNull: isNull,
		isNotNull: isNotNull,
		isArray: isArray,
		isString: isString,
		isNumber: isNumber,
		isDate: isDate,
		isFunction: isFunction,
		isObject: isObject
	};
})();
/* 2017-8-10 13:50:49 | 修改 CLS（QQ：1669209231） */
haoutil.math = (function() {
	// "数学 相关操作类";
	//============内部私有属性及方法============

	function random(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	//随机数组中随机取1个元素
	function getArrayRandomOne(arr) {
		var n = random(0, arr.length - 1);
		return arr[n];
	}

	//补零padLeft0
	function padLeft0(numStr, len) {
		numStr = String(numStr);
		var len = numStr.length;
		while(len < n) {
			numStr = "0" + numStr;
			len++;
		}
		return numStr;
	}

	//===========对外公开的属性及方法=========
	return {
		getArrayRandomOne: getArrayRandomOne,
		random: random,
		padLeft0: padLeft0
	};
})();
haoutil.storage = (function() {
	//"localStorage 相关操作类";
	var _storage;

	//添加
	function add(name, data) {
		_storage = window.localStorage;
		_storage.setItem(name, data);
	}

	//获取cookie
	function get(name) {
		_storage = window.localStorage;
		var data = _storage.getItem(name);
		return data;
	}

	function del(name) {
		_storage = window.localStorage;
		_storage.removeItem(name);
	}

	//===========对外公开的属性及方法=========
	return {
		add: add,
		get: get,
		del: del
	};
})();

/* 2017-10-27 08:39:39 | 修改 CLS（QQ：1669209231） */
haoutil.str = (function() {
	// "字符串 相关操作类";
	//============内部私有属性及方法============

	//判断字符是否是中文字符 
	function isChinese(s) {
		var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
		if(!patrn.exec(s)) {
			return false;
		} else {
			return true;
		}
	}

	//格式化距离长度
	function formatLength(strlen) {
		var numlen = Number(strlen);

		if(numlen < 1000)
			return numlen.toFixed(2) + "米";
		else
			return(numlen / 1000).toFixed(2) + "千米";
	}

	//格式化面积
	function formatArea(strarea) {
		var numlen = Number(strarea);

		if(strarea < 1000000)
			return strarea.toFixed(2) + "平方米";
		else
			return(strarea / 1000000).toFixed(2) + "平方公里";
	}

	//格式化时间
	function formatTime(strtime) {
		var numtime = Number(strtime);

		if(strtime < 60)
			return strtime.toFixed(0) + "秒";
		else if(strtime >= 60 && strtime < 3600) {
			return Math.floor(strtime / 60) + "分钟" + Math.floor(strtime % 60) + "秒";
		} else {
			strtime = Math.floor(strtime / 60); //秒转分钟
			return Math.floor(strtime / 60) + "小时" + Math.floor(strtime % 60) + "分钟";
		}
	}

	var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""); //索引表

	/** 
	 * @description 将二进制序列转换为Base64编码
	 * @param {String}
	 * @return {String}
	 */
	function binToBase64(bitString) {
		var result = "";
		var tail = bitString.length % 6;
		var bitStringTemp1 = bitString.substr(0, bitString.length - tail);
		var bitStringTemp2 = bitString.substr(bitString.length - tail, tail);
		for(var i = 0; i < bitStringTemp1.length; i += 6) {
			var index = parseInt(bitStringTemp1.substr(i, 6), 2);
			result += code[index];
		}
		bitStringTemp2 += new Array(7 - tail).join("0");
		if(tail) {
			result += code[parseInt(bitStringTemp2, 2)];
			result += new Array((6 - tail) / 2 + 1).join("=");
		}
		return result;
	}

	/** 
	 * @description 将base64编码转换为二进制序列
	 * @param {String}
	 * @return {String}
	 */
	function base64ToBin(str) {
		var bitString = "";
		var tail = 0;
		for(var i = 0; i < str.length; i++) {
			if(str[i] != "=") {
				var decode = code.indexOf(str[i]).toString(2);
				bitString += (new Array(7 - decode.length)).join("0") + decode;
			} else {
				tail++;
			}
		}
		return bitString.substr(0, bitString.length - tail * 2);
	}

	/** 
	 * @description 将字符转换为二进制序列
	 * @param {String} str
	 * @return {String}  
	 */
	function stringToBin(str) {
		var result = "";
		for(var i = 0; i < str.length; i++) {
			var charCode = str.charCodeAt(i).toString(2);
			result += (new Array(9 - charCode.length).join("0") + charCode);
		}
		return result;
	}

	/** 
	 * @description 将二进制序列转换为字符串
	 * @param {String} Bin
	 */
	function BinToStr(Bin) {
		var result = "";
		for(var i = 0; i < Bin.length; i += 8) {
			result += String.fromCharCode(parseInt(Bin.substr(i, 8), 2));
		}
		return result;
	}

	function base64(str) {
		return binToBase64(stringToBin(str));
	}

	function decodeBase64(str) {
		return BinToStr(base64ToBin(str));
	}

	//===========对外公开的属性及方法=========
	return {
		isChinese: isChinese,
		formatLength: formatLength,
		formatArea: formatArea,
		formatTime: formatTime,
		base64: base64,
		decodeBase64: decodeBase64

	};

})();
/* 2017-10-27 08:31:05 | 修改 CLS（QQ：1669209231） */
haoutil.system = (function() {
	// 系统级  或 浏览器 相关操作类"; 
	//============内部私有属性及方法============

	//url参数获取
	function getRequest() {
		var url = location.search; //获取url中"?"符后的字串   
		var theRequest = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1);
			var strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	}

	function getRequestByName(name, defval) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return decodeURI(r[2]);
		return defval;
	}

	function getWindowSize() {
		if(typeof window.innerWidth != 'undefined') {
			return {
				width: window.innerWidth,
				height: window.innerHeight
			}
		} else {
			return {
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight
			}
		}
	}

	//获取浏览器类型及版本
	function getExplorerInfo() {
		var explorer = window.navigator.userAgent.toLowerCase();
		//ie 
		if(explorer.indexOf("msie") >= 0) {
			var ver = Number(explorer.match(/msie ([\d]+)/)[1]);
			return {
				type: "IE",
				version: ver
			};
		}
		//firefox 
		else if(explorer.indexOf("firefox") >= 0) {
			var ver = Number(explorer.match(/firefox\/([\d]+)/)[1]);
			return {
				type: "Firefox",
				version: ver
			};
		}
		//Chrome
		else if(explorer.indexOf("chrome") >= 0) {
			var ver = Number(explorer.match(/chrome\/([\d]+)/)[1]);
			return {
				type: "Chrome",
				version: ver
			};
		}
		//Opera
		else if(explorer.indexOf("opera") >= 0) {
			var ver = Number(explorer.match(/opera.([\d]+)/)[1]);
			return {
				type: "Opera",
				version: ver
			};
		}
		//Safari
		else if(explorer.indexOf("Safari") >= 0) {
			var ver = Number(explorer.match(/version\/([\d]+)/)[1]);
			return {
				type: "Safari",
				version: ver
			};
		}
		return {
			type: explorer,
			version: -1
		};
	}

	//浏览器
	function isPCBroswer() {
		var sUserAgent = navigator.userAgent.toLowerCase();

		var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
		var bIsIphoneOs = sUserAgent.match(/iphone/i) == "iphone";
		var bIsMidp = sUserAgent.match(/midp/i) == "midp";
		var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
		var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
		var bIsAndroid = sUserAgent.match(/android/i) == "android";
		var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
		var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
		if(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
			return false;
		} else {
			return true;
		}
	}

	function clone(from, to) {
		if(from == null || typeof from != "object") return from;
		if(from.constructor != Object && from.constructor != Array) return from;
		if(from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
			from.constructor == String || from.constructor == Number || from.constructor == Boolean)
			return new from.constructor(from);

		to = to || new from.constructor();

		for(var name in from) {
			to[name] = typeof to[name] == "undefined" ? clone(from[name], null) : to[name];
		}

		return to;
	}

	function jsonp(url, data, callback) {
		var jsonp = function(url, data, callback) {
			var fnSuffix = Math.random().toString().replace('.', '');
			var cbFuncName = 'my_json_cb_' + fnSuffix;
			// 不推荐
			window[cbFuncName] = callback;
			var querystring = url.indexOf('?') == -1 ? '?' : '&';
			for(var key in data) {
				if(data[key]) {
					querystring += key + '=' + data[key] + '&';
				}
			}
			querystring += 'callback=' + cbFuncName;
			var scriptElement = document.createElement('script');
			scriptElement.src = url + querystring;
			document.body.appendChild(scriptElement);
		};
		window.$jsonp = jsonp;
	}

	//公共方法
	function getHtml(url, callback) {
		$.ajax({
			url: url,
			type: "GET",
			dataType: 'html',
			timeout: 0, //永不超时
			success: function(data) {
				callback(data);
			}
		});
	}

	var nHead = document.head || document.getElementsByTagName('head')[0];
	// loadCss 用于载入css资源
	function loadCss(url, async) {
		var node = document.createElement('link');
		node.rel = 'stylesheet';
		node.async = async;
		node.href = url;
		nHead.appendChild(node);
	}

	// loadJs 用于载入js资源
	function loadJs(url, async) {
		var node = document.createElement('script');
		node.charset = 'utf-8';
		node.async = async;
		node.src = url;
		nHead.appendChild(node);
	}

	var cssExpr = new RegExp('\\.css');

	function loadResource(url, async) {
		if(cssExpr.test(url)) {
			loadCss(url, async);
		} else {
			loadJs(url, async);
		}
	}

	//===========对外公开的属性及方法=========
	return {
		getRequest: getRequest,
		getRequestByName: getRequestByName,
		getExplorerInfo: getExplorerInfo,
		isPCBroswer: isPCBroswer,
		clone: clone,
		jsonp: jsonp,
		getWindowSize: getWindowSize,
		getHtml: getHtml,
		loadCss: loadCss,
		loadJs: loadJs,
		loadResource: loadResource
	};
})();
/**
 * @功能描述:vew.work-src.js
 * @author: CLS
 * @date: 14:10 2019/5/2
 */
var thisWidget;

function initWidgetView(t) {
	//  thisWidget = t,
	$("#btn_plot_delall").click(function() {
		//      thisWidget.deleteAll(),
		//      plotEdit.stopEditing()
		//删除前使之处于未编辑状态 
		window.parent.plotOperate.setEdit(false); //当前绘制的对象的编辑状态
		window.parent.plotOperate.setEditAll(false); //非当前绘制的所有对象编辑状态
		if(window.parent.loadPlotShape) {
			window.parent.setLoadEdit(false);
		}
		$(".mp_tree").each(function() {
			$(this).hide();
		});
		$("#tab_plot").click(); //切换到标号
		$("#tab_latlng").hide(); //隐藏坐标tab
		$("#tab_attr").hide(); //隐藏属性tab
		//删除
		window.parent.plotOperate._deleteAll();
		//删除后重新处于isEdit为true
		window.parent.plotOperate.setEdit(true);
		if(window.parent.loadPlotShape) {
			window.parent.setLoadEdit(true);
		}
	});
	var e = !0;
	$("#btn_plot_isedit").click(function() {
			(e = !e) ? ($(this).removeClass("active"), $(this).children().removeClass("fa-lock").addClass("fa-unlock")) : ($(this).addClass("active"), $(this).children().removeClass("fa-unlock").addClass("fa-lock")),
			//      thisWidget.hasEdit(e)
			window.parent.isPlotEdit = e;
			window.parent.plotOperate.setEdit(e);
			window.parent.plotOperate.setEditAll(e);
			if(window.parent.loadPlotShape) { //如果有导入的geojson图形
				window.parent.setLoadEdit(e);
			}
			$(".mp_tree").each(function() {
				$(this).hide();
			});
			$("#tab_plot").click(); //切换到标号
			$("#tab_latlng").hide(); //隐藏坐标tab
			$("#tab_attr").hide(); //隐藏属性tab
		}),
		plotFile.initEvent(), //按钮部分初始化
		plotEdit.loadConfig() //图形操作div初始化
}
//按钮div类
var plotFile = {
		initEvent: function() {
			var i, n = this;
			$("#btn_plot_openfile").click(function() {
					//          i = !0,
					//          $("#input_plot_file").click()
					$("#btn_plot_delall").click();
					//			window.parent.plotOperate._deleteAll();
				}),
				$("#btn_plot_openfile2").click(function() {
					i = !1,
						$("#input_plot_file").click()
				}),
				$("#btn_plot_savefile").click(function() {
					//          var t = thisWidget.getGeoJson();
					//          null == t || "" == t ? toastr.warning("当前未标绘任何数据！") : haoutil.file.downloadFile("标绘.json", t)
					window.parent.plotOperate._getGeoJson();
				}),
				$("#input_plot_file").change(function(t) {
					var e = this.files[0],
						a = e.name;
					if("json" != a.substring(a.lastIndexOf(".") + 1, a.length).toLowerCase()) return toastr.error("文件类型不合法,请选择json格式标注文件！"),
						void n.clearPlotFile();
					if(window.FileReader) {
						var l = new FileReader;
						l.readAsText(e, "UTF-8"),
							l.onloadend = function(t) {
								var e = this.result;
								thisWidget.jsonToLayer(e, i, !0),
									n.clearPlotFile()
							}
					}
				})
		},
		clearPlotFile: function() {
			window.addEventListener ? document.getElementById("input_plot_file").value = "" : document.getElementById("input_plot_file").outerHTML += ""
		}
	},

	//按钮下操作菜单类
	plotlist = {
		bindSelList: function() {
			var i = this,
				n = $("#sel_plot_list");
			$.getJSON("config/plotlist.json",
				function(a) {
					var t, e = "";
					for(var l in a) {
						if(a[l]) {
							var pltoLength = a[l].length;
							/*获取下拉框中标绘类型的个数*/
							if(l == "图片点") {
								if(!window.parent.plotOperate.tpd) {
									continue;
								}
								if(window.parent.setMarkerImgs.length > 0 &&
									window.parent.addMarkerImgs.length > 0) {
									pltoLength = window.parent.setMarkerImgs.length + window.parent.addMarkerImgs.length;
								}
								if(window.parent.setMarkerImgs.length > 0 &&
									window.parent.addMarkerImgs.length == 0) {
									pltoLength = window.parent.setMarkerImgs.length;
								}
								if(window.parent.setMarkerImgs.length == 0 &&
									window.parent.addMarkerImgs.length > 0) {
									pltoLength = a[l].length + window.parent.addMarkerImgs.length;
								}
							}
							if(l == "字体点") {
								if(!window.parent.plotOperate.ztd) {
									continue;
								}
								if(window.parent.setMarkerIcons.length > 0 &&
									window.parent.addMarkerIcons.length > 0) {
									pltoLength = window.parent.setMarkerIcons.length + window.parent.addMarkerIcons.length;
								}
								if(window.parent.setMarkerIcons.length > 0 &&
									window.parent.addMarkerIcons.length == 0) {
									pltoLength = window.parent.setMarkerIcons.length;
								}
								if(window.parent.setMarkerIcons.length == 0 &&
									window.parent.addMarkerIcons.length > 0) {
									pltoLength = a[l].length + window.parent.addMarkerIcons.length;
								}
							}

							if(!window.parent.plotOperate.xm && l == "线面标号") {
								continue;
							}
							if(l == "图片") {
								if(!window.parent.plotOperate.tp) {
									continue;
								}
								if(window.parent.setImgs.length > 0 &&
									window.parent.addImgs.length > 0) {
									pltoLength = window.parent.setImgs.length + window.parent.addImgs.length;
								}
								if(window.parent.setImgs.length > 0 &&
									window.parent.addImgs.length == 0) {
									pltoLength = window.parent.setImgs.length;
								}
								if(window.parent.setImgs.length == 0 &&
									window.parent.addImgs.length > 0) {
									pltoLength = a[l].length + window.parent.addImgs.length;
								}
							}
							if(!window.parent.plotOperate.jb && l == "军事标绘") {
								continue;
							}
							if(l == "常用标号") {
								a[l] = window.parent.setCommonPlot;
								pltoLength = window.parent.setCommonPlot.length;
							}
							e += '<option value="' + l + '">' + l + "(" + pltoLength + ")</option>";
							null == t && (t = l);
							t && (i.showPlotList(a[t]), n.attr("data-value", t));
						}
					}
					n.html(e);
					n.select();
					n.change(function() {
						var t = $(this).attr("data-value"),
							e = a[t];
						i.showPlotList(e, t)
					})
				})
		},
		_listData: null,
		_isSetMarkerImgs: false,
		_isAddMarkerImgs: false,
		_isSetImgs: false,
		_isAddImgs: false,
		_isSetMarkerIcons: false,
		_isAddMarkerIcons: false,
		showPlotList: function(t, type) {
			this._listData = [];
			if(t.length > 0 && t[0].type == "marker" /*&&!this._isSetMarkerImgs*/ &&
				window.parent.setMarkerImgs.length > 0) {
				t = [];
				for(var k = 0; k < window.parent.setMarkerImgs.length; k++) {
					var eachObj = {
						name: window.parent.setMarkerImgs[k].name,
						style: {
							iconAnchor0: 16,
							iconAnchor1: 44,
							iconSize0: 36,
							iconSize1: 44,
							iconUrl: window.parent.setMarkerImgs[k].src,
						},
						type: "marker"
					}
					this._listData.push(eachObj);
					t = this._listData;
				}
				this._isSetMarkerImgs = true;
			}
			if(t.length > 0 && t[0].type == "marker" && !this._isAddMarkerImgs &&
				window.parent.addMarkerImgs.length > 0) {
				for(var k = 0; k < window.parent.addMarkerImgs.length; k++) {
					var eachObj = {
						name: window.parent.addMarkerImgs[k].name,
						style: {
							iconAnchor0: 16,
							iconAnchor1: 44,
							iconSize0: 36,
							iconSize1: 44,
							iconUrl: window.parent.addMarkerImgs[k].src,
						},
						type: "marker"
					}
					this._listData = t;
					this._listData.push(eachObj);
					t = this._listData;
				}
				this._isAddMarkerImgs = true;
			}
			if(t.length > 0 && t[0].type == "image" /*&&!this._isSetImgs*/ &&
				window.parent.setImgs.length > 0) {
				t = [];
				for(var k = 0; k < window.parent.setImgs.length; k++) {
					var eachObj = {
						name: window.parent.setImgs[k].name,
						style: {
							iconUrl: window.parent.setImgs[k].src,
						},
						type: "image"
					}
					this._listData.push(eachObj);
					t = this._listData;
				}
				this._isSetImgs = true;
			}
			if(t.length > 0 && t[0].type == "image" && !this._isAddImgs &&
				window.parent.addImgs.length > 0) {
				for(var k = 0; k < window.parent.addImgs.length; k++) {
					var eachObj = {
						name: window.parent.addImgs[k].name,
						style: {
							iconUrl: window.parent.addImgs[k].src,
						},
						type: "image"
					}
					this._listData = t;
					this._listData.push(eachObj);
					t = this._listData;
				}
				this._isAddImgs = true;
			}
			if(t.length > 0 && t[0].type == "font-marker" /*&&!this._isSetMarkerIcons*/ &&
				window.parent.setMarkerIcons.length > 0) {
				t = [];
				for(var k = 0; k < window.parent.setMarkerIcons.length; k++) {
					var eachObj = {
						name: window.parent.setMarkerIcons[k].name,
						style: window.parent.setMarkerIcons[k].style,
						type: "font-marker"
					}
					this._listData.push(eachObj);
					t = this._listData;
				}
				this._isSetMarkerIcons = true;
			}
			if(t.length > 0 && t[0].type == "font-marker" && !this._isAddMarkerIcons &&
				window.parent.addMarkerIcons.length > 0) {
				for(var k = 0; k < window.parent.addMarkerIcons.length; k++) {
					var eachObj = {
						name: window.parent.addMarkerIcons[k].name,
						style: window.parent.addMarkerIcons[k].style,
						type: "font-marker"
					}
					this._listData = t;
					this._listData.push(eachObj);
					t = this._listData;
				}
				this._isAddMarkerIcons = true;
			}

			this._listData = t;
			for(var e = "",
					a = 0; a < t.length; a++) {
				var l, i = t[a];
				if(plotEdit.defval[i.type]) l = (s = plotEdit.defval[i.type]).style.iconUrl;
				if(i.iconUrl && (l = i.iconUrl), i.style && i.style.iconUrl && (l = i.style.iconUrl), l) e += ' <li onclick="plotlist.startPlot(' + a + ',this)"> <i title="' + i.name + '"  > <img src="../../' + l + '" style="max-width: 50px;max-height: 50px;" /></i></li>';
				else {
					var n, s, r = "#000000";
					if(plotEdit.defval[i.type]) n = (s = plotEdit.defval[i.type]).style.iconClass,
						r = s.style.color;
					i.iconClass && (n = i.iconClass),
						i.style && i.style.iconClass && (n = i.style.iconClass),
						i.color && (r = i.color),
						i.style && i.style.color && (r = i.style.color),
						n && (e += '<li onclick="plotlist.startPlot(' + a + ',this)"><i title="' + i.name + '"  class="' + n + '" style="color:' + r + '"></i></li>')
				}
			}
			$("#plotlist").html(e)
		},
		_lastLi: null,
		startPlot: function(t, e) {
			var a = $(e);
			a.addClass("markon"),
				this._lastLi && this._lastLi.removeClass("markon"),
				this._lastLi = a;
			var l = this._listData[t], //l为plotlist.json
				i = haoutil.system.clone(plotEdit.defval[l.type] || {}); //plotEdit为attr.json
			if(l.style)
				for(var n in l.style) i.style[n] = l.style[n];
			if(l.attr)
				for(var n in l.attr) i.attr[n] = l.attr[n];
			i.name = i.name || l.name; //plotlist.json相应的绘图操作对应的某个对象
			//thisWidget.startDraw(i)
			//      window.parent.plotOperate.shapeEdit = window.parent.isPlotEdit;
			switch(i.type) {
				case "marker":
					window.parent.plotOperate.dotMarkerImgPt(i);
					break;
				case "font-marker":
					window.parent.plotOperate.dotMarkerIconPt(i);
					break;
				case "polyline":
					if(l.smallType) {
						i.smallType = l.smallType;
						i.name = l.name;
						window.parent.plotOperate.dotMilitaryPlotT(i);
					} else {
						window.parent.plotOperate.dotPolyline(i);
					}
					break;
				case "polygon":
					window.parent.plotOperate.dotPolygon(i);
					break;
				case "rectangle":
					window.parent.plotOperate.dotRectangle(i);
					break;
				case "circle":
					window.parent.plotOperate.dotCircle(i);
					break;
				case "image":
					window.parent.plotOperate.dotImg(i);
					break;
				case "text":
					window.parent.plotOperate.dotMarkerName(i);
					break;
				case "militaryPlot":
					i.smallType = l.smallType;
					i.name = l.name;
					window.parent.plotOperate.dotMilitaryPlotT(i);
					break;
				default:
					break;
			}
		},
		plotEnd: function() {
			this._lastLi && this._lastLi.removeClass("markon")
		}
	},

	plotEdit = {
		config: {},
		defval: {},
		loadConfig: function() {
			var s = this;
			$.getJSON("config/attr.json",
				function(t) {
					for(var e in s.config = t) {
						if(s.config[e]) {
							for(var a = {},l = 0; l < t[e].style.length; l++) {
								a[(n = t[e].style[l]).name] = n.defval
							}
							var i = {};
							for(l = 0; l < t[e].attr.length; l++) {
								var n;
								i[(n = t[e].attr[l]).name] = n.defval
							}
							s.defval[e] = {
								type: e,
								name: t[e].name,
								style: a,
								attr: i
							}
						}
					}
					plotlist.bindSelList()
				})
		},
		_last_attr: null,
		startEditing: function(t, e) {
			if(!t.shapeEdit) {
				return;
			} else {
				$("#tab_latlng").show(); //隐藏坐标tab
				$("#tab_attr").show(); //隐藏属性tab
				$("#tab_attr").click(); //隐藏属性tab
				$(".mp_tree").each(function() { //显示属性tab中内容
					$(this).show();
				});
			}
			this._last_attr = t;
			var a = this.config[t.type];
			a.name = t.name;
			this.updateLatlngsHtml(e); //显示坐标tab
			for(var l = [], i = "plot_attr_style_", n = '<tr><td class="nametd">类型：</td><td>' + (a.name || t.name) + "</td></tr>", s = 0; s < a.style.length; s++) {
				if("hidden" != (d = a.style[s]).type) {
					var r = d.name,
						o = t.style[r];
					(c = this.getAttrInput(i, r, o, d)).fun && l.push({
							parname: i,
							name: r,
							value: o,
							edit: d,
							fun: c.fun
						}),
						n += '<tr  id="' + i + "tr_" + r + '" > <td class="nametd">' + d.label + "</td>  <td>" + c.html + "</td>  </tr>"
				}
			}
			$("#talbe_style").html(n),
				i = "plot_attr_attr_",
				n = "";
			for(s = 0; s < a.attr.length; s++) {
				var d;
				if("hidden" != (d = a.attr[s]).type) {
					var c;
					r = d.name,
						o = t.attr[r];
					(c = this.getAttrInput(i, r, o, d)).fun && l.push({
							parname: i,
							name: r,
							value: o,
							edit: d,
							fun: c.fun
						}),
						n += '<tr  id="' + i + "tr_" + r + '" > <td class="nametd">' + d.label + "</td>  <td>" + c.html + "</td>  </tr>"
				}
			}
			$("#talbe_attr").html(n);
			for(s = 0; s < l.length; s++) {
				var p = l[s];
				p.fun(p.parname, p.name, p.value, p.edit)
			}
			tab2attr()
		},
		updateLatlngsHtml: function(t) {
			var e = "";
			if(t && 0 != t.length)
				if(1 == t.length) {
					e += ' <div class="mp_attr" style=" margin-top: 10px;"><table> <tr> <td class="nametd">经度：</td> <td><input id="plot_attr_jd_' + a + '" type="number" class="mp_input" readonly="readonly" value="' + (l = t[0]).lng.toFixed(6) + '"></td>  </tr> <tr>  <td class="nametd">纬度：</td> <td><input id="plot_attr_wd_' + a + '" type="number" class="mp_input" readonly="readonly" value="' + l.lat.toFixed(6) + '"></td> </tr>  </table> </div>'
				} else
					for(var a = 0; a < t.length; a++) {
						var l;
						e += '<div><div class="open"><i class="tree_icon">-</i>第' + (a + 1) + '点</div><div class="mp_attr"><table> <tr> <td class="nametd">经度：</td> <td><input id="plot_attr_jd_' + a + '" type="number" class="mp_input" readonly="readonly" value="' + (l = t[a]).lng.toFixed(6) + '"></td>  </tr> <tr>  <td class="nametd">纬度：</td> <td><input id="plot_attr_wd_' + a + '" type="number" class="mp_input" readonly="readonly" value="' + l.lat.toFixed(6) + '"></td> </tr>  </table> </div> </div>'
					} else;
			$("#view_latlngs").html(e),
				$("#view_latlngs .open").click(changeOpenShowHide)
		},
		stopEditing: function() {
			tab2plot(),
				$("#talbe_style").html(""),
				$("#talbe_attr").html(""),
				this._last_attr = null
		},
		getAttrInput: function(t, e, a, l) {
			var n = this,
				i = "",
				s = null;
			switch(l.type) {
				default:
					case "label":
					i = a;
				break;
				case "text":
						i = '<input id="' + t + e + '" type="text" value="' + a + '"   class="mp_input" />',
					s = function(a, l, t, e) {
						$("#" + a + l).on("input propertychange",
							function(t) {
								var e = $(this).val();
								n.updateAttr(a, l, e)
							})
					};
					break;
				case "textarea":
						i = '<textarea  id="' + t + e + '"     class="mp_input" style="height:50px;resize: none;" >' + (a = a.replace(new RegExp("<br />", "gm"), "\n")) + "</textarea>",
					s = function(a, l, t, e) {
						$("#" + a + l).on("input propertychange",
							function(t) {
								var e = $(this).val();
								0 == e.length && (e = "文字"),
									e = e.replace(/\n/g, "<br />"),
									n.updateAttr(a, l, e)
							})
					};
					break;
				case "number":
						i = '<input id="' + t + e + '" type="number" value="' + a + '"    class="mp_input"/>',
					s = function(a, l, t, e) {
						$("#" + a + l).on("input propertychange",
							function(t) {
								var e = Number($(this).val());
								n.updateAttr(a, l, e)
							})
					};
					break;
				case "combobox":
						i = '<select id="' + t + e + '" class="mp_select"    data-value="' + a + '" >';
					for(var r = 0; r < l.data.length; r++) {
						var o = l.data[r];
						i += '<option value="' + o.value + '">' + o.text + "</option>"
					}
					i += "</select>",
					s = function(e, a, t, l) {
						$("#" + e + a).select(),
							$("#" + e + a).change(function() {
								var t = $(this).attr("data-value");
								n.updateAttr(e, a, t)
							})
					};
					break;
				case "custom_radio":
						//定制 修改军事标绘中填充类型
						if(t + e == "plot_attr_style_fillType") {
							i = '<input   name="' + t + e + '" type="radio" value="1"  ' + (a ? 'checked="checked"' : "") + ' style="width:15px;" >单色填充  &nbsp;&nbsp; <input  name="' + t + e + '" type="radio" value="2"  ' + (a ? "" : 'checked="checked"') + ' style="width:15px;" >渐变填充';
						} else {
							i = '<input   name="' + t + e + '" type="radio" value="1"  ' + (a ? 'checked="checked"' : "") + ' style="width:15px;" >是  &nbsp;&nbsp; <input  name="' + t + e + '" type="radio" value="2"  ' + (a ? "" : 'checked="checked"') + ' style="width:15px;" >否';
						}
					s = function(e, a, t, l) {
						$('input:radio[name="' + e + a + '"]').change(function() {
							var t = "1" == $(this).val();
							n.updateAttr(e, a, t);
							if(l.pact) {
								n.changeViewByAttr1(e, l.pact, t);
							}
							n.changeViewByAttr(e, l.impact, t);

							if(a == "fill" && t && l.pact) {
								//单色填充勾选
								if(document.getElementsByName("plot_attr_style_fillType")[0].checked) {
									$("#plot_attr_style_tr_shadeEffectAmination").hide();
									$("#plot_attr_style_tr_shadeEffectType").hide();
									$("#plot_attr_style_tr_shadeColor1").hide();
									$("#plot_attr_style_tr_shadeColor2").hide();
								} else { //渐变填充
									$("#plot_attr_style_tr_fillMode").hide();
									$("#plot_attr_style_tr_fillColor").hide();
									$("#plot_attr_style_tr_fillOpacity").hide();
								}
								document.getElementsByName("plot_attr_style_strokeEffectType")[0]
							}
						});
						if(l.pact) {
							n.changeViewByAttr1(e, l.pact, t);
						}
						n.changeViewByAttr(e, l.impact, t);
					};
					break;
				case "radio":
						i = '<input   name="' + t + e + '" type="radio" value="1"  ' + (a ? 'checked="checked"' : "") + ' style="width:15px;" >是  &nbsp;&nbsp; <input  name="' + t + e + '" type="radio" value="2"  ' + (a ? "" : 'checked="checked"') + ' style="width:15px;" >否',
					s = function(e, a, t, l) {
						$('input:radio[name="' + e + a + '"]').change(function() {
								var t = "1" == $(this).val();
								n.updateAttr(e, a, t),
									n.changeViewByAttr(e, l.impact, t)
							}),
							n.changeViewByAttr(e, l.impact, t)
					};
					break;
				case "color":
						i = '<input id="' + t + e + '" type="text" class="mp_input" style="width: 100%;"  value="' + a + '" />',
					s = function(a, l, t, e) {
						$("#" + a + l).minicolors({
							position: "bottom right",
							control: "saturation",
							change: function(t, e) {
								n.updateAttr(a, l, t)
							}
						})
					};
					break;
				case "slider":
						i = '<input id="' + t + e + '"  type="text" value="' + 100 * a + '" />',
					s = function(e, a, t, l) {
						var i = .7 * $(".mp_tab_card").width() - 30;
						$("#" + e + a).progress(i),
							$("#" + e + a).change(function() {
								var t = Number($(this).val()) / 100;
								n.updateAttr(e, a, t)
							})
					}
			}
			return {
				html: i,
				fun: s
			}
		},
		changeViewByAttr: function(t, e, a) {
			if(e && 0 < e.length)
				for(var l = 0; l < e.length; l++) {
					var i = e[l];
					a ? $("#" + t + "tr_" + i).show() : $("#" + t + "tr_" + i).hide()
				}
		},
		/**
		 * 点击"是"的情况下隐藏input
		 * @param {Object} t
		 * @param {Object} e
		 * @param {Object} a
		 */
		changeViewByAttr1: function(t, e, a) {
			if(e && 0 < e.length)
				for(var l = 0; l < e.length; l++) {
					var i = e[l];
					!a ? $("#" + t + "tr_" + i).show() : $("#" + t + "tr_" + i).hide()
				}
		},
		updateAttr: function(t, e, a) {
			switch(t) {
				case "plot_attr_style_":
					this._last_attr.style[e] = a;
					break;
				case "plot_attr_attr_":
					this._last_attr.attr[e] = a
			}
			//      thisWidget.updateAttr2map(this._last_attr)
			//修改绘制图形属性
			if(window.parent.tempShape) {
				window.parent.plotOperate.setShapeStyle(this._last_attr, {
					plotOperate: window.parent.tempShape
				});
			} else {
				//加载的图形修改属性
				if(window.parent.loadPlotShape && this._last_attr.type1 == "load") {
					if(this._last_attr.type == "marker") {
						window.parent.setMarkerImgPtStyle(window.parent.loadPlotShape.shape, this._last_attr);
					} else if(this._last_attr.type == "font-marker") {
						window.parent.setMarkerIconPtStyle(window.parent.loadPlotShape.shape, this._last_attr);
					} else if(this._last_attr.type == "text") {
						window.parent.loadPlotShape.setFontStyle({
							fontFamily: this._last_attr.style.font_family,
							fontSize: this._last_attr.style.font_size,
							fontStyle: this._last_attr.style.font_style,
							fontWeight: this._last_attr.style.font_weight,
							text: this._last_attr.style.text
						});
						window.parent.loadPlotShape.setStyle({
							color: this._last_attr.style.color,
							fillOpacity: this._last_attr.style.opacity,
						});
					} else if(this._last_attr.type == "image") {
						window.parent.loadPlotShape.setOpacity(this._last_attr.style.opacity);
					} else if(this._last_attr.type == "militaryPlot") { //军事标绘除了单箭头外
						window.parent.loadPlotShape._shape.setStyle(this._last_attr.style);
					} else if(this._last_attr.type == "polyline" && window.parent.loadPlotShape._shape.editVertexs) { //军事标绘
						window.parent.loadPlotShape._shape.setStyle(this._last_attr.style);
						window.parent.loadPlotShape._shape.line_l.polyline.setStyle(this._last_attr.style);
						window.parent.loadPlotShape._shape.line_r.polyline.setStyle(this._last_attr.style);
					} else {
						window.parent.loadPlotShape.setStyle(this._last_attr.style);
					}
				}
			}
		}
	};

/**
 * @功能描述:vew.common-src
 * @author: CLS
 * @date: 14:07 2019/5/2
 */
function tab2plot() {
	$("#tab_attr").addClass("disabled"),
		$("#tab_latlng").addClass("disabled"),
		$("#tab_plot").click()
};
$(function() {
	$(window).resize(refHeight),
		refHeight(),
		$(".mp_icon_close").click(function() {
			$(this).parent().parent(".mp_box").hide()
		}),
		$(".mp_tab_tit li").click(function() {
			if($(this).hasClass("cur") || $(this).hasClass("disabled")) return !1;
			var e = $(this),
				i = e.index();
			e.addClass("cur").siblings("li").removeClass("cur"),
				e.parent().siblings(".mp_tab_con").children().eq(i).addClass("cur").siblings().removeClass("cur");
			var s = $(this).attr("id");
			"tab_plot" != s && (last_attr_tab = s)
		}),
		$(".open").click(changeOpenShowHide)
});
var last_attr_tab = "tab_attr";

function tab2attr() {
	$("#tab_attr").removeClass("disabled"),
		$("#tab_latlng").removeClass("disabled"),
		$("#tab_plot").hasClass("cur") && $("#" + last_attr_tab).click()
}

function changeOpenShowHide() {
	var e = $(this).siblings(),
		i = $(this).children(".tree_icon");
	e.toggle(),
		e.is(":hidden") ? i.html("+") : i.html("-")
}

function refHeight() {
	$(".mp_tab_card").height($(".mp_box").height() - $(".mp_head").height() - 1),
		$(".mp_tree").height($(".mp_tab_card").height() - 32),
		$(".mp_mark").height($(".mp_tab_card").height() - 80)
}! function(k) {
	var i = {
		select: "mp_select",
		select_text: "mp_select_text",
		select_ul: "mp_select_ul"
	};
	k.fn.extend({
		select: function(e) {
			var a = k.extend({},
				i, e);
			return this.each(function() {
				var s = k(this);
				void 0 !== s.data("value") && "" !== s.data("value") && s.val(s.data("value"));
				var i = [];
				i.push('<div class="' + s.attr("class") + '">'),
					i.push('<div class="' + a.select_text + '">' + s.find(":selected").text() + "</div>"),
					i.push('<ul class="' + a.select_ul + '">'),
					s.children("option").each(function() {
						var e = k(this);
						s.data("value"),
							e.val(),
							i.push('<li data-value="' + e.val() + '">' + e.text() + "</li>")
					}),
					i.push("</ul>"),
					i.push("</div>");
				var e = k(i.join("")),
					t = e.find("." + a.select_text),
					c = e.find("." + a.select_ul);
				s.after(e),
					s.hide(),
					e.click(function(e) {
						k(this).toggleClass("mp_selected"),
							k(this).find("." + a.select_ul).slideToggle().end().siblings("div." + a.select).find("." + a.select_ul).slideUp(),
							e.stopPropagation()
					}),
					k("body").click(function() {
						c.slideUp()
					}),
					c.on("click", "li",
						function() {
							var e = k(this),
								i = e.addClass("selecton").siblings("li").removeClass("selecton").end().data("value").toString();
							i !== s.attr("data-value") && (t.text(e.text()), s.attr("data-value", i), s.change())
						})
			})
		},
		checkbox: function() {
			return this.each(function() {
				var e = k(this),
					i = e.siblings("input");
				1 == i.prop("disabled") ? e.addClass("pnui-check-disbaled") : 1 == i.prop("checked") ? e.addClass("pnui-checked") : e.removeClass("pnui-checked"),
					e.on("click",
						function() {
							if(1 == i.prop("disabled")) return !1;
							e.hasClass("pnui-checked") ? (i.removeAttr("checked"), e.removeClass("pnui-checked")) : (i.attr("checked", "checked"), e.addClass("pnui-checked"))
						}),
					k(".checkall").click(function() {
						var e = k(this),
							i = e.parents(".checkallbox").find(".pnui-chkbox");
						e.toggleClass("pnui-checked"),
							i.each(function() {
								k(this).toggleClass("pnui-checked")
							}),
							e.hasClass("pnui-checked") ? (i.siblings("input").attr("checked", "checked"), i.addClass("pnui-checked")) : (i.siblings("input").removeAttr("checked"), i.removeClass("pnui-checked"))
					})
			})
		},
		radio: function() {
			return this.each(function() {
				var e = k(this);
				1 == e.children("input").prop("disabled") ? e.children(".pnui-rdobox").removeClass().addClass("pnui-rdobox pnui-radio-disbaled") : 1 == e.children("input").prop("checked") ? (e.siblings().children("input").removeAttr("checked"), e.siblings().children(".pnui-rdobox").removeClass("pnui-checked"), e.children(".pnui-rdobox").addClass("pnui-checked")) : (e.siblings().children("input").prop("checked", "checked"), e.siblings().children(".pnui-rdobox").addClass("pnui-checked"), e.children(".pnui-rdobox").removeClass("pnui-checked")),
					e.on("click",
						function() {
							var e = k(this);
							if(1 == e.children("input").prop("disabled")) return !1;
							1 == e.children("input").prop("checked") ? (e.siblings().children("input").prop("checked", "checked"), e.siblings().children(".pnui-rdobox").addClass("pnui-checked"), e.children("input").removeAttr("checked"), e.children(".pnui-rdobox").removeClass("pnui-checked")) : (e.siblings().children("input").removeAttr("checked"), e.siblings().children(".pnui-rdobox").removeClass("pnui-checked"), e.children("input").prop("checked", "checked"), e.children(".pnui-rdobox").addClass("pnui-checked"))
						})
			})
		},
		progress: function(p) {
			var u = "puiprogress",
				v = "puiprogress_bg",
				b = "puiprogress_btn",
				g = "puiprogress_bar",
				f = "puiprogress_text";
			return this.each(function() {
				var s = k(this),
					e = [];
				e.push('<div class="' + u + '">'),
					e.push('<div class="' + v + '">'),
					e.push('<div class="' + g + '"></div>'),
					e.push("</div>"),
					e.push('<div class="' + b + '"></div>'),
					e.push('<div class="' + f + '">' + s.val() + "%</div>"),
					e.push("</div>");
				var i = k(e.join("")),
					t = i.find("." + v),
					c = i.find("." + b),
					a = i.find("." + g),
					n = i.find("." + f);
				s.after(i),
					s.hide();
				var l = !1,
					d = 0,
					r = 0,
					h = 0;
				i.css("width", p);
				var o = Number(s.val());
				r = p * o / 100,
					c.css("left", r),
					a.width(r),
					n.html(parseInt(o) + "%"),
					c.mousedown(function(e) {
						d = e.pageX - r,
							l = !0
					}),
					k(document).mouseup(function() {
						l = !1
					}),
					i.mousemove(function(e) {
						if(l) {
							(r = e.pageX - d) <= 0 ? r = 0 : p < r && (r = p),
								c.css("left", r),
								a.width(r);
							var i = parseInt(r / p * 100);
							n.html(i + "%"),
								s.val(i),
								s.change()
						}
					}),
					t.click(function(e) {
						if(!l) {
							h = t.offset().left,
								(r = e.pageX - h) <= 0 ? r = 0 : p < r && (r = p),
								c.css("left", r),
								a.animate({
										width: r
									},
									p);
							var i = parseInt(r / p * 100);
							n.html(i + "%"),
								s.val(i),
								s.change()
						}
					})
			})
		}
	})
}(jQuery);