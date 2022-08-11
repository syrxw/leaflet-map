'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('leaflet');
require('leaflet/dist/leaflet.css');
require('leaflet.chinatmsproviders');
var mitt = require('mitt');
var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var mitt__default = /*#__PURE__*/_interopDefaultLegacy(mitt);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _regeneratorRuntime() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */

  _regeneratorRuntime = function () {
    return exports;
  };

  var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }

  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
    return generator._invoke = function (innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");

        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }

        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);

          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }

          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }(innerFn, self, context), generator;
  }

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  exports.wrap = wrap;
  var ContinueSentinel = {};

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {}

  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if ("throw" !== record.type) {
        var result = record.arg,
            value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }

      reject(record.arg);
    }

    var previousPromise;

    this._invoke = function (method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    };
  }

  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (undefined === method) {
      if (context.delegate = null, "throw" === context.method) {
        if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
        context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }

  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;

          return next.value = undefined, next.done = !0, next;
        };

        return next.next = next;
      }
    }

    return {
      next: doneResult
    };
  }

  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }

  return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (object) {
    var keys = [];

    for (var key in object) keys.push(key);

    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }

      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;

      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
            record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      }

      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

//坐标转换
L.CoordConver = function () {
  /**百度转84*/
  this.bd09_To_gps84 = function (lng, lat) {
    var gcj02 = this.bd09_To_gcj02(lng, lat);
    var map84 = this.gcj02_To_gps84(gcj02.lng, gcj02.lat);
    return map84;
  };
  /**84转百度*/


  this.gps84_To_bd09 = function (lng, lat) {
    var gcj02 = this.gps84_To_gcj02(lng, lat);
    var bd09 = this.gcj02_To_bd09(gcj02.lng, gcj02.lat);
    return bd09;
  };
  /**84转火星*/


  this.gps84_To_gcj02 = function (lng, lat) {
    var dLat = transformLat(lng - 105.0, lat - 35.0);
    var dLng = transformLng(lng - 105.0, lat - 35.0);
    var radLat = lat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = dLat * 180.0 / (a * (1 - ee) / (magic * sqrtMagic) * pi);
    dLng = dLng * 180.0 / (a / sqrtMagic * Math.cos(radLat) * pi);
    var mgLat = lat + dLat;
    var mgLng = lng + dLng;
    var newCoord = {
      lng: mgLng,
      lat: mgLat
    };
    return newCoord;
  };
  /**火星转84*/


  this.gcj02_To_gps84 = function (lng, lat) {
    var coord = transform(lng, lat);
    var lontitude = lng * 2 - coord.lng;
    var latitude = lat * 2 - coord.lat;
    var newCoord = {
      lng: lontitude,
      lat: latitude
    };
    return newCoord;
  };
  /**火星转百度*/


  this.gcj02_To_bd09 = function (x, y) {
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    var newCoord = {
      lng: bd_lng,
      lat: bd_lat
    };
    return newCoord;
  };
  /**百度转火星*/


  this.bd09_To_gcj02 = function (bd_lng, bd_lat) {
    var x = bd_lng - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    var newCoord = {
      lng: gg_lng,
      lat: gg_lat
    };
    return newCoord;
  };

  var pi = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;
  var x_pi = pi * 3000.0 / 180.0;

  function transform(lng, lat) {
    var dLat = transformLat(lng - 105.0, lat - 35.0);
    var dLng = transformLng(lng - 105.0, lat - 35.0);
    var radLat = lat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = dLat * 180.0 / (a * (1 - ee) / (magic * sqrtMagic) * pi);
    dLng = dLng * 180.0 / (a / sqrtMagic * Math.cos(radLat) * pi);
    var mgLat = lat + dLat;
    var mgLng = lng + dLng;
    var newCoord = {
      lng: mgLng,
      lat: mgLat
    };
    return newCoord;
  }

  function transformLat(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
  }

  function transformLng(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
  }
};

L.coordConver = function () {
  return new L.CoordConver();
};

L.tileLayer.chinaProvider = function (type, options) {
  options = options || {};
  options.corrdType = getCorrdType(type);
  return new L.TileLayer.ChinaProvider(type, options); //获取坐标类型

  function getCorrdType(type) {
    var parts = type.split(".");
    var providerName = parts[0];
    var zbName = "wgs84";

    switch (providerName) {
      case "Geoq":
      case "GaoDe":
      case "Google":
        zbName = "gcj02";
        break;

      case "Baidu":
        zbName = "bd09";
        break;

      case "OSM":
      case "TianDiTu":
        zbName = "wgs84";
        break;
    }

    return zbName;
  }
};

L.GridLayer.include({
  _setZoomTransform: function _setZoomTransform(level, _center, zoom) {
    var center = _center;

    if (center != undefined && this.options) {
      if (this.options.corrdType == "gcj02") {
        center = L.coordConver().gps84_To_gcj02(_center.lng, _center.lat);
      } else if (this.options.corrdType == "bd09") {
        center = L.coordConver().gps84_To_bd09(_center.lng, _center.lat);
      }
    }

    var scale = this._map.getZoomScale(zoom, level.zoom),
        translate = level.origin.multiplyBy(scale).subtract(this._map._getNewPixelOrigin(center, zoom)).round();

    if (L.Browser.any3d) {
      L.DomUtil.setTransform(level.el, translate, scale);
    } else {
      L.DomUtil.setPosition(level.el, translate);
    }
  },
  _getTiledPixelBounds: function _getTiledPixelBounds(_center) {
    var center = _center;

    if (center != undefined && this.options) {
      if (this.options.corrdType == "gcj02") {
        center = L.coordConver().gps84_To_gcj02(_center.lng, _center.lat);
      } else if (this.options.corrdType == "bd09") {
        center = L.coordConver().gps84_To_bd09(_center.lng, _center.lat);
      }
    }

    var map = this._map,
        mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(),
        scale = map.getZoomScale(mapZoom, this._tileZoom),
        pixelCenter = map.project(center, this._tileZoom).floor(),
        halfSize = map.getSize().divideBy(scale * 2);
    return new L.Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
  }
});

var config = {
  map: {
    container: "map",
    type: "GaoDe.Normal.Map",
    center: [31.8584, 117.285],
    zoom: 14,
    preferCanvas: true,
    minZoom: 6,
    maxZoom: 18,
    key: "6cb11577e3ac27bbe015669e413f6cc4"
  },
  control: {
    addAttribution: {
      enable: false
    },
    zoom: {
      enable: true
    }
  },
  autoLocation: false // 是否自动定位

};

var emitter = mitt__default["default"]();

var mapInstance$1;
/**
 * 控件模块
 */

function setControl(instance) {
  mapInstance$1 = instance;
  var _config$control = config.control,
      addAttributionConfig = _config$control.addAttribution,
      zoomConfig = _config$control.zoom; // 水印信息加载

  if (addAttributionConfig.enable) {
    addAttributionControl(addAttributionConfig);
  } // 缩放控件加载


  if (zoomConfig.enable) {
    addZoomControl(zoomConfig);
  }

  emitter.emit("controlLoaded");
}
/**
 * 右下角水印信息
 */

function addAttributionControl(options) {
  var mergeOptions = _objectSpread2({
    prefix: "",
    content: 'leaft-map &copy; <a href="https://www.osdiot.com/">Osdiot</a>'
  }, options);

  var attribution = mapInstance$1.attributionControl;
  attribution.setPrefix(mergeOptions.prefix);
  attribution.addAttribution(mergeOptions.content);
  return attribution;
}
/**
 * 缩放控件
 */


function addZoomControl(options) {
  var mergeOptions = _objectSpread2({}, options);

  var zoomControl = L.control.zoom(mergeOptions);
  mapInstance$1.addControl(zoomControl);
}

var mapInstance = null;
/**
 * 创建地图
 */

function createMap() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : config;
  var mapConfig = options.map,
      controlConfig = options.control;
  mapInstance = L.map(mapConfig.container, _objectSpread2({
    attributionControl: controlConfig.addAttribution.enable,
    zoomControl: false
  }, mapConfig));
  setControl(mapInstance);
  emitter.emit("mapLoaded");
  return mapInstance;
}
/**
 * 加载预置底图
 * @param {*} type 底图类型
 */

function addPresetTileLayer() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : config;
  var mapConfig = options.map;
  L.tileLayer.chinaProvider(mapConfig.type, _objectSpread2({}, mapConfig)).addTo(mapInstance);
  emitter.emit("tileLayerLoaded");
}

var base = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createMap: createMap,
  addPresetTileLayer: addPresetTileLayer
});

var service$1 = axios__default["default"].create({
  baseURL: "/api",
  timeout: 10000
});
service$1.interceptors.request.use(function (config) {
  return config;
}); // 响应拦截器

service$1.interceptors.response.use( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(response) {
    var res;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            response.config; // 服务状态

            if (!(response.status !== 200)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", Promise.reject(res));

          case 3:
            // 状态200 处理
            res = response.data;
            return _context.abrupt("return", Promise.resolve(res));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

function getGeoJson(_x) {
  return _getGeoJson.apply(this, arguments);
}
/**
 * 创建WFS图层
 * @param {Object} options
 */

function _getGeoJson() {
  _getGeoJson = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(options) {
    var params, url, u;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // 向geoserver请求数据
            params = _objectSpread2({
              service: "WFS",
              version: "1.1.0",
              request: "GetFeature",
              typeName: options.layer,
              outputFormat: "application/json"
            }, options);
            url = options.url;
            u = url + L.Util.getParamString(params, url);
            _context.next = 5;
            return service$1.get(u);

          case 5:
            return _context.abrupt("return", _context.sent);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getGeoJson.apply(this, arguments);
}

function createWFSLayer(options, data) {
  var wfsLayer = new L.geoJson(data, {
    style: _objectSpread2(_objectSpread2({}, options.style), {}, {
      renderer: L.canvas()
    }),
    onEachFeature: function onEachFeature() {}
  });
  return wfsLayer;
}
/**
 * 创建WMS图层
 * @param {Object} options
 */

function createWMSLayer(options) {
  var config = _objectSpread2({
    layers: options.layer,
    format: "image/png",
    transparent: true
  }, options);

  if (options.crs) config.crs = options.crs;
  var wmsLayer = L.tileLayer.wms(options.url, config);
  return wmsLayer;
}
function createImgPoint() {}

var layer = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getGeoJson: getGeoJson,
  createWFSLayer: createWFSLayer,
  createWMSLayer: createWMSLayer,
  createImgPoint: createImgPoint
});

var baseApi = "http://api.tianditu.gov.cn"; // 天地图查询
// poi搜索

function search(params) {
  return service$1.get("".concat(baseApi, "/v2/search"), {
    params: {
      postStr: JSON.stringify(params),
      type: "query",
      tk: params.tk
    }
  });
} // 地理编码查询

function geocoderLocation(params) {
  return service$1.get("".concat(baseApi, "/geocoder"), {
    params: {
      ds: JSON.stringify(params),
      tk: params.tk
    }
  });
} // 逆地理编码查询

function geocoderPoint(params) {
  return service$1.get("".concat(baseApi, "/geocoder"), {
    params: {
      type: "geocode",
      postStr: JSON.stringify(params),
      tk: params.tk
    }
  });
}

function localSearch(_x, _x2) {
  return _localSearch.apply(this, arguments);
} // 地理位置解析

function _localSearch() {
  _localSearch = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(map, params) {
    var level, _map$getBounds, _northEast, _southWest, mapBound, data;

    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            level = map.getZoom();
            _map$getBounds = map.getBounds(), _northEast = _map$getBounds._northEast, _southWest = _map$getBounds._southWest;
            mapBound = Object.values(_southWest).reverse().concat(Object.values(_northEast).reverse()).join();

            if (params.tk) {
              _context.next = 5;
              break;
            }

            throw new Error("请传入正确的key");

          case 5:
            _context.next = 7;
            return search(_objectSpread2(_objectSpread2({}, params), {}, {
              level: level,
              mapBound: mapBound,
              queryType: 1,
              start: 0
            }));

          case 7:
            data = _context.sent;

            if (!(data.status.infocode == 1000)) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return", data);

          case 12:
            throw new Error(data.status.cndesc);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _localSearch.apply(this, arguments);
}

function getLocation$1(_x3) {
  return _getLocation.apply(this, arguments);
} // 逆地理位置解析

function _getLocation() {
  _getLocation = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(params) {
    var data;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (params.tk) {
              _context2.next = 2;
              break;
            }

            throw new Error("请传入正确的key");

          case 2:
            _context2.next = 4;
            return geocoderLocation(params);

          case 4:
            data = _context2.sent;
            return _context2.abrupt("return", data);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getLocation.apply(this, arguments);
}

function getPoint(_x4) {
  return _getPoint.apply(this, arguments);
}

function _getPoint() {
  _getPoint = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(params) {
    var data;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (params.tk) {
              _context3.next = 2;
              break;
            }

            throw new Error("请传入正确的key");

          case 2:
            _context3.next = 4;
            return geocoderPoint(_objectSpread2(_objectSpread2({}, params), {}, {
              ver: 1
            }));

          case 4:
            data = _context3.sent;
            return _context3.abrupt("return", data);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getPoint.apply(this, arguments);
}

var service = /*#__PURE__*/Object.freeze({
  __proto__: null,
  localSearch: localSearch,
  getLocation: getLocation$1,
  getPoint: getPoint
});

var defaultConfig = {
  // 超时时间
  timeout: 3000,
  // 是否需要高精度定位
  enableHighAccuracy: false
};
/**
 * @description: html5定位
 * @param {*}timeout/超时时间
 * @param {*}enableHighAccuracy/是否需要高精度定位
 * @return {*}
 */

function getLocation(obj) {
  var _defaultConfig$obj = _objectSpread2(_objectSpread2({}, defaultConfig), obj),
      timeout = _defaultConfig$obj.timeout,
      enableHighAccuracy = _defaultConfig$obj.enableHighAccuracy;

  return new Promise(function (resolve, reject) {
    if (navigator.geolocation) {
      var id = navigator.geolocation.watchPosition(function (e) {
        // 纬度，经度
        var _e$coords = e.coords,
            latitude = _e$coords.latitude,
            longitude = _e$coords.longitude;
        navigator.geolocation.clearWatch(id);
        resolve({
          latitude: latitude,
          longitude: longitude
        });
      }, function (error) {
        navigator.geolocation.clearWatch(id);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject("html5已拒绝定位");
            break;

          case error.POSITION_UNAVAILABLE:
            reject("html5位置信息不可用");
            break;

          case error.TIMEOUT:
            reject("html5定位超时");
            break;

          case error.UNKNOWN_ERROR:
            reject("html5定位未知错误");
            break;
        }
      }, {
        enableHighAccuracy: enableHighAccuracy,
        timeout: timeout,
        maximumAge: 0
      });
      return;
    }

    reject("浏览器不支持HTML5定位");
  });
}
var location = {
  getLocation: getLocation
};

function createScript(src, reject, cb) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = src;
  script.onerror = reject;
  script.onload = cb;
  document.head.appendChild(script);
}
function createStyle(url) {
  var head = document.getElementsByTagName("head")[0];
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  head.appendChild(link);
}
var loadAssets = {
  createScript: createScript,
  createStyle: createStyle
};

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  location: location,
  loadAssets: loadAssets,
  emitter: emitter
});

var map = _objectSpread2(_objectSpread2({}, base), {}, {
  layer: layer,
  service: service
});

exports.map = map;
exports.utils = index;
