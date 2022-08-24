'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('leaflet');
require('leaflet/dist/leaflet.css');
var mitt = require('mitt');
var axios = require('axios');
require('leaflet-draw');
require('leaflet-draw/dist/leaflet.draw-src.css');
var nanoid = require('nanoid');

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

// this L.CRS.Baidu from https://github.com/muyao1987/leaflet-tileLayer-baidugaode/blob/master/src/tileLayer.baidu.js
if (L.Proj) {
  L.CRS.Baidu = new L.Proj.CRS("EPSG:900913", "+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs", {
    resolutions: function () {
      var level = 19;
      var res = [];
      res[0] = Math.pow(2, 18);

      for (var i = 1; i < level; i++) {
        res[i] = Math.pow(2, 18 - i);
      }

      return res;
    }(),
    origin: [0, 0],
    bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
  });
}

L.TileLayer.ChinaProvider = L.TileLayer.extend({
  initialize: function initialize(type, options) {
    // (type, Object)
    var providers = L.TileLayer.ChinaProvider.providers;
    options = options || {};
    var parts = type.split(".");
    var providerName = parts[0];
    var mapName = parts[1];
    var mapType = parts[2];
    var url = providers[providerName][mapName][mapType];
    options.subdomains = providers[providerName].Subdomains;
    options.key = options.key || providers[providerName].key;

    if ("tms" in providers[providerName]) {
      options.tms = providers[providerName]["tms"];
    }

    L.TileLayer.prototype.initialize.call(this, url, options);
  },
  getTileUrl: function getTileUrl(coords) {
    var data = {
      s: this._getSubdomain(coords),
      x: coords.x,
      y: coords.y,
      z: this._getZoomForUrl()
    };

    if (this._map && !this._map.options.crs.infinite) {
      var invertedY = this._globalTileRange.max.y - coords.y;

      if (this.options.tms) {
        data["y"] = invertedY;
      }

      data["-y"] = invertedY;
    }

    data.sx = data.x >> 4;
    data.sy = (1 << data.z) - data.y >> 4;
    return L.Util.template(this._url, L.Util.extend(data, this.options));
  }
});
L.TileLayer.ChinaProvider.providers = {
  TianDiTu: {
    Normal: {
      Map: "//t{s}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={key}",
      Annotion: "//t{s}.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk={key}"
    },
    Satellite: {
      Map: "//t{s}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk={key}",
      Annotion: "//t{s}.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk={key}"
    },
    Terrain: {
      Map: "//t{s}.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk={key}",
      Annotion: "//t{s}.tianditu.gov.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk={key}"
    },
    Subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
    key: "174705aebfe31b79b3587279e211cb9a"
  },
  GaoDe: {
    Normal: {
      Map: "//webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
    },
    Satellite: {
      Map: "//webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
      Annotion: "//webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}"
    },
    Subdomains: ["1", "2", "3", "4"],
    Brief: {
      Map: "//webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
    }
  },
  Google: {
    Normal: {
      Map: "//www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
    },
    Satellite: {
      Map: "//www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
      Annotion: "//www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}"
    },
    Subdomains: []
  },
  Geoq: {
    Normal: {
      Map: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
      PurplishBlue: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      Gray: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
      Warm: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}"
    },
    Theme: {
      Hydro: "//thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer/tile/{z}/{y}/{x}"
    },
    Subdomains: []
  },
  OSM: {
    Normal: {
      Map: "//{s}.tile.osm.org/{z}/{x}/{y}.png"
    },
    Subdomains: ["a", "b", "c"]
  },
  Baidu: {
    Normal: {
      Map: "//online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1"
    },
    Satellite: {
      Map: "//shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
      Annotion: "//online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=020"
    },
    Subdomains: "0123456789",
    tms: true
  },
  Tencent: {
    Normal: {
      Map: "//rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={-y}&type=vector&styleid=3"
    },
    Satellite: {
      Map: "//p{s}.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{-y}.jpg"
    },
    Terrain: {
      Map: "//p{s}.map.gtimg.com/demTiles/{z}/{sx}/{sy}/{x}_{-y}.jpg"
    },
    Subdomains: "0123"
  }
};

L.tileLayer.chinaProvider = function (type, options) {
  return new L.TileLayer.ChinaProvider(type, options);
};

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

var mapInstance$4 = null;
/**
 * 创建地图
 */

function createMap() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : config;
  var mapConfig = options.map;
  mapInstance$4 = L.map(mapConfig.container, _objectSpread2({
    attributionControl: false,
    zoomControl: false
  }, mapConfig));
  emitter.emit("mapLoaded");
  return mapInstance$4;
}
/**
 * 加载预置底图
 * @param {*} type 底图类型
 */

function addPresetTileLayer() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : config;
  var mapConfig = options.map;
  L.tileLayer.chinaProvider(mapConfig.type, _objectSpread2({}, mapConfig)).addTo(mapInstance$4);
  emitter.emit("tileLayerLoaded");
}

var base = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createMap: createMap,
  addPresetTileLayer: addPresetTileLayer
});

/**
 * 右下角水印信息
 */
function attributionControl(options) {
  var mergeOptions = _objectSpread2({
    prefix: "",
    content: 'leaft-map &copy; <a href="https://www.osdiot.com/">Osdiot</a>'
  }, options);

  var attribution = L.control.attribution();
  attribution.setPrefix(mergeOptions.prefix);
  attribution.addAttribution(mergeOptions.content);
  return attribution;
}
/**
 * 缩放控件
 */

function zoomControl(options, map) {
  var mergeOptions = _objectSpread2({}, options);

  var zoomControl = L.control.zoom(mergeOptions);
  return zoomControl;
}
/**
 * 比例尺控件
 */

function scaleControl(options, map) {
  var mergeOptions = _objectSpread2({}, options);

  var scaleControl = L.control.scale(mergeOptions);
  return scaleControl;
}

var control = /*#__PURE__*/Object.freeze({
  __proto__: null,
  attributionControl: attributionControl,
  zoomControl: zoomControl,
  scaleControl: scaleControl
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
function getLocation$2() {
  return service$1.get("https://map.tianditu.gov.cn/data/getCityName");
}

function localSearch(_x, _x2) {
  return _localSearch.apply(this, arguments);
} // 地理位置解析

function _localSearch() {
  _localSearch = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(map, options) {
    var level, _map$getBounds, _northEast, _southWest, mapBound, data;

    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            level = map.getZoom();
            _map$getBounds = map.getBounds(), _northEast = _map$getBounds._northEast, _southWest = _map$getBounds._southWest;
            mapBound = Object.values(_southWest).reverse().concat(Object.values(_northEast).reverse()).join();

            if (options.tk) {
              _context.next = 5;
              break;
            }

            throw new Error("请传入正确的key");

          case 5:
            _context.next = 7;
            return search(_objectSpread2(_objectSpread2({}, options), {}, {
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
  _getLocation = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(options) {
    var data;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (options.tk) {
              _context2.next = 2;
              break;
            }

            throw new Error("请传入正确的key");

          case 2:
            _context2.next = 4;
            return geocoderLocation(options);

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
} // 根据ip获取位置

function _getPoint() {
  _getPoint = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(options) {
    var data;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (options.tk) {
              _context3.next = 2;
              break;
            }

            throw new Error("请传入正确的key");

          case 2:
            _context3.next = 4;
            return geocoderPoint(_objectSpread2(_objectSpread2({}, options), {}, {
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

function getLocationByIp(_x5) {
  return _getLocationByIp.apply(this, arguments);
}

function _getLocationByIp() {
  _getLocationByIp = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(params) {
    var data;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getLocation$2();

          case 2:
            data = _context4.sent;
            return _context4.abrupt("return", data);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getLocationByIp.apply(this, arguments);
}

var service = /*#__PURE__*/Object.freeze({
  __proto__: null,
  localSearch: localSearch,
  getLocation: getLocation$1,
  getPoint: getPoint,
  getLocationByIp: getLocationByIp
});

L.drawLocal = {
  draw: {
    toolbar: {
      // #TODO: this should be reorganized where actions are nested in actions
      // ex: actions.undo  or actions.cancel
      actions: {
        title: "取消绘图",
        //'Cancel drawing',
        text: "" //'Cancel'

      },
      finish: {
        title: "完成绘图",
        //'Finish drawing',
        text: "Finish"
      },
      undo: {
        title: "删除最后绘制的点",
        //'Delete last point drawn',
        text: "" //'Delete last point'

      },
      buttons: {
        polyline: "绘制一个多段线",
        //'Draw a polyline',
        polygon: "绘制一个多边形",
        //'Draw a polygon',
        rectangle: "绘制一个矩形",
        //'Draw a rectangle',
        circle: "绘制一个圆",
        //'Draw a circle',
        marker: "绘制一个标记",
        //'Draw a marker',
        circlemarker: "绘制一个圆形标记" //'Draw a circlemarker'

      }
    },
    handlers: {
      circle: {
        tooltip: {
          start: "单击并拖动以绘制圆" //'Click and drag to draw circle.'

        },
        radius: "半径"
      },
      circlemarker: {
        tooltip: {
          start: "单击“地图”以放置圆标记" //'Click map to place circle marker.'

        }
      },
      marker: {
        tooltip: {
          start: "单击“地图”以放置标记" //'Click map to place marker.'

        }
      },
      polygon: {
        tooltip: {
          start: "单击开始绘制形状",
          //'Click to start drawing shape.',
          cont: "单击继续绘制形状",
          //'Click to continue drawing shape.',
          end: "单击第一个点关闭此形状" //'Click first point to close this shape.'

        }
      },
      polyline: {
        error: "<strong>错误:</strong>形状边缘不能交叉！",
        //'<strong>Error:</strong> shape edges cannot cross!',
        tooltip: {
          start: "单击开始绘制线",
          //'Click to start drawing line.',
          cont: "单击以继续绘制线",
          //'Click to continue drawing line.',
          end: "双击地图或单击最后一个点结束绘制" //'Click last point to finish line.'

        }
      },
      rectangle: {
        tooltip: {
          start: "单击并拖动以绘制矩形" //'Click and drag to draw rectangle.'

        }
      },
      simpleshape: {
        tooltip: {
          end: "释放鼠标完成绘图" //'Release mouse to finish drawing.'

        }
      }
    }
  },
  edit: {
    toolbar: {
      actions: {
        save: {
          title: "保存更改",
          //'Save changes',
          text: "保存" //'Save'

        },
        cancel: {
          title: "取消编辑，放弃所有更改",
          //'Cancel editing, discards all changes',
          text: "取消" //'Cancel'

        },
        clearAll: {
          title: "清除所有图层",
          //'Clear all layers',
          text: "清除所有" //'Clear All'

        }
      },
      buttons: {
        edit: "编辑图层",
        //'Edit layers',
        editDisabled: "无可编辑的图层",
        //'No layers to edit',
        remove: "删除图层",
        //'Delete layers',
        removeDisabled: "无可删除的图层" //'No layers to delete'

      }
    },
    handlers: {
      edit: {
        tooltip: {
          text: "拖动控制柄或标记以编辑要素",
          //'Drag handles or markers to edit features.',
          subtext: "单击“取消”撤消更改" //'Click cancel to undo changes.'

        }
      },
      remove: {
        tooltip: {
          text: "单击要删除的要素" //'Click on a feature to remove.'

        }
      }
    }
  }
};

var mapInstance$3;
var layerGroup$3;
var drawControl$3;
var polylineDrawer;
var drawLayer$3 = {};
var currentLayerId$3 = null;

function enable$3() {
  polylineDrawer = new L.Draw.Polyline(mapInstance$3, drawControl$3.options.draw.polyline);
  polylineDrawer.enable();
}

function disable$3() {
  var _polylineDrawer;

  (_polylineDrawer = polylineDrawer) === null || _polylineDrawer === void 0 ? void 0 : _polylineDrawer.disable();
}

function initialize$3(instance) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    showMarker: false
  };
  mapInstance$3 = instance;
  layerGroup$3 = new L.FeatureGroup();
  mapInstance$3.addLayer(layerGroup$3); // 初始化图层数据

  currentLayerId$3 = nanoid.nanoid();
  drawLayer$3[currentLayerId$3] = {
    point: new L.FeatureGroup(),
    shape: new L.FeatureGroup()
  };
  drawControl$3 = new L.Control.Draw({
    edit: {
      featureGroup: layerGroup$3
    },
    draw: {
      polyline: _objectSpread2({
        icon: new L.DivIcon({
          iconSize: new L.Point(8, 8),
          className: "leaflet-div-icon leaflet-editing-icon measure-icon"
        }),
        shapeOptions: {
          stroke: true,
          color: "#f40",
          weight: 4,
          opacity: 1,
          fill: false,
          clickable: true
        }
      }, options)
    }
  });
  mapInstance$3.off(L.Draw.Event.CREATED).on(L.Draw.Event.CREATED, function (event) {
    event.layer.id = currentLayerId$3;
    drawLayer$3[currentLayerId$3].shape = event.layer;
    layerGroup$3.addLayer(drawLayer$3[currentLayerId$3].shape);

    if (options.showMarker) {
      setTimeout(function () {
        addMeasureEndMarker();
      }, 0);
    }

    emitter.emit("measure.polyline.created", event);
  });
  mapInstance$3.off(L.Draw.Event.DRAWVERTEX).on(L.Draw.Event.DRAWVERTEX, function (event) {
    if (options.showMarker) {
      addMeasureMarker$3(event.layers);
    }
  });
}

function addMeasureMarker$3(layerGroup) {
  var lines = [];
  layerGroup.eachLayer(function (e) {
    lines.push(e.getLatLng());
    var content = lines.length <= 1 ? buildHtml$3("起点") : buildHtml$3(formatLength(lines));
    e.bindTooltip(content, {
      permanent: true,
      direction: "right",
      className: "measure-tooltip"
    }).openTooltip();
  });
  drawLayer$3[currentLayerId$3].point = layerGroup;
}

function addMeasureEndMarker() {
  var i = 0;
  var lines = [];
  var point = drawLayer$3[currentLayerId$3].point;

  if (point) {
    point.eachLayer(function (e) {
      i += 1;
      lines.push(e.getLatLng());

      if (i === Object.keys(point.getLayers()).length) {
        e.setTooltipContent(buildHtml$3("共" + formatLength(lines) + "<div onclick='polyline.remove(\"" + currentLayerId$3 + "\")'>删除</div>"));
      }
    });
  }

  mapInstance$3.addLayer(point);
}

function remove$3(id) {
  Object.keys(drawLayer$3[id]).forEach(function (item) {
    drawLayer$3[id][item].remove();
  });
}

function removeAll$3() {
  Object.keys(drawLayer$3).forEach(function (item) {
    Object.keys(drawLayer$3[item]).forEach(function (sitem) {
      drawLayer$3[item][sitem].remove();
    });
  });
}

function buildHtml$3(content) {
  return "<div style='display:block;cursor:pointer;color:#f00'>".concat(content, "</div>");
}

function formatLength(line) {
  var dis = 0;

  for (var i = 0; i < line.length - 1; i++) {
    var start = line[i];
    var end = line[i + 1];
    dis += L.latLng([start.lat, start.lng]).distanceTo([end.lat, end.lng]);
  }

  return "".concat((dis / 10e2).toFixed(2), "km");
}

window.polyline = {};
window.polyline.remove = remove$3;
var polyline = {
  initialize: initialize$3,
  enable: enable$3,
  disable: disable$3,
  removeAll: removeAll$3
};

var mapInstance$2;
var layerGroup$2;
var drawControl$2;
var polygonDrawer;
var drawLayer$2 = {};
var currentLayerId$2 = null;

function enable$2() {
  polygonDrawer = new L.Draw.Polygon(mapInstance$2, drawControl$2.options.draw.polygon);
  polygonDrawer.enable();
}

function disable$2() {
  var _polygonDrawer;

  (_polygonDrawer = polygonDrawer) === null || _polygonDrawer === void 0 ? void 0 : _polygonDrawer.disable();
}

function initialize$2(instance) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    showMarker: false
  };
  mapInstance$2 = instance;
  layerGroup$2 = new L.FeatureGroup();
  mapInstance$2.addLayer(layerGroup$2); // 初始化图层数据

  currentLayerId$2 = nanoid.nanoid();
  drawLayer$2[currentLayerId$2] = {
    point: new L.FeatureGroup(),
    shape: new L.FeatureGroup()
  };
  drawControl$2 = new L.Control.Draw({
    edit: {
      featureGroup: layerGroup$2
    },
    draw: {
      polygon: _objectSpread2({
        icon: new L.DivIcon({
          iconSize: new L.Point(8, 8),
          className: "leaflet-div-icon leaflet-editing-icon measure-icon"
        }),
        shapeOptions: {
          stroke: true,
          color: "#f40",
          weight: 4,
          opacity: 1
        }
      }, options)
    }
  });
  mapInstance$2.off(L.Draw.Event.CREATED).on(L.Draw.Event.CREATED, function (event) {
    event.layer.id = currentLayerId$2;
    drawLayer$2[currentLayerId$2].shape = event.layer;
    layerGroup$2.addLayer(drawLayer$2[currentLayerId$2].shape);
    var latlng = drawLayer$2[currentLayerId$2].shape.getLatLngs()[0];

    if (options.showMarker) {
      addMeasureMarker$2(latlng);
    }

    emitter.emit("measure.polygon.created", event);
  });
  mapInstance$2.off(L.Draw.Event.DRAWVERTEX);
}

function addMeasureMarker$2(latlng) {
  var marker = L.marker(latlng[0], {
    icon: L.divIcon({
      className: "measure-div-icon"
    })
  });
  marker.bindTooltip(buildHtml$2("".concat(formatArea$2(latlng), "<div onclick=\"polygon.remove('").concat(currentLayerId$2, "')\">\u5220\u9664</div>")), {
    permanent: true,
    direction: "right",
    className: "measure-tooltip"
  }).openTooltip();
  drawLayer$2[currentLayerId$2].point.addLayer(marker);
  drawLayer$2[currentLayerId$2].point.addTo(mapInstance$2);
}

function remove$2(id) {
  Object.keys(drawLayer$2[id]).forEach(function (item) {
    drawLayer$2[id][item].remove();
  });
}

function removeAll$2() {
  Object.keys(drawLayer$2).forEach(function (item) {
    Object.keys(drawLayer$2[item]).forEach(function (sitem) {
      drawLayer$2[item][sitem].remove();
    });
  });
}

function buildHtml$2(content) {
  return "<div style='display:block;cursor:pointer;color:#f00'>".concat(content, "</div>");
}

function formatArea$2(polygon) {
  var seeArea = L.GeometryUtil.geodesicArea(polygon);
  var area = (seeArea / 10e5).toFixed(2) + "k㎡";
  return area;
}

window.polygon = {};
window.polygon.remove = remove$2;
var polygon = {
  initialize: initialize$2,
  enable: enable$2,
  disable: disable$2,
  removeAll: removeAll$2
};

var mapInstance$1;
var layerGroup$1;
var drawControl$1;
var circleDrawer;
var drawLayer$1 = {};
var currentLayerId$1 = null;

function enable$1() {
  circleDrawer = new L.Draw.Circle(mapInstance$1, drawControl$1.options.draw.circle);
  circleDrawer.enable();
}

function disable$1() {
  var _circleDrawer;

  (_circleDrawer = circleDrawer) === null || _circleDrawer === void 0 ? void 0 : _circleDrawer.disable();
}

function initialize$1(instance) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    showMarker: false
  };
  mapInstance$1 = instance;
  layerGroup$1 = new L.FeatureGroup();
  mapInstance$1.addLayer(layerGroup$1); // 初始化图层数据

  currentLayerId$1 = nanoid.nanoid();
  drawLayer$1[currentLayerId$1] = {
    point: new L.FeatureGroup(),
    shape: new L.FeatureGroup()
  };
  drawControl$1 = new L.Control.Draw({
    edit: {
      featureGroup: layerGroup$1
    },
    draw: {
      circle: _objectSpread2({
        icon: new L.DivIcon({
          iconSize: new L.Point(8, 8),
          className: "leaflet-div-icon leaflet-editing-icon measure-icon"
        }),
        shapeOptions: {
          stroke: true,
          color: "#f40",
          weight: 4,
          opacity: 1
        }
      }, options)
    }
  });
  mapInstance$1.off(L.Draw.Event.CREATED).on(L.Draw.Event.CREATED, function (event) {
    event.layer.id = currentLayerId$1;
    drawLayer$1[currentLayerId$1].shape = event.layer;
    layerGroup$1.addLayer(drawLayer$1[currentLayerId$1].shape);

    if (options.showMarker) {
      addMeasureMarker$1(event.layer.getRadius(), event.layer.getLatLng());
    }

    emitter.emit("measure.circle.created", event);
  });
  mapInstance$1.off(L.Draw.Event.DRAWVERTEX);
}

function addMeasureMarker$1(radius, latlng) {
  var marker = L.marker(latlng, {
    icon: L.divIcon({
      className: "measure-div-icon"
    })
  });
  marker.bindTooltip(buildHtml$1("".concat(formatArea$1(radius), "<div onclick=\"circle.remove('").concat(currentLayerId$1, "')\">\u5220\u9664</div>")), {
    permanent: true,
    direction: "right",
    className: "measure-tooltip"
  }).openTooltip();
  drawLayer$1[currentLayerId$1].point.addLayer(marker);
  drawLayer$1[currentLayerId$1].point.addTo(mapInstance$1);
}

function remove$1(id) {
  Object.keys(drawLayer$1[id]).forEach(function (item) {
    drawLayer$1[id][item].remove();
  });
}

function removeAll$1() {
  Object.keys(drawLayer$1).forEach(function (item) {
    Object.keys(drawLayer$1[item]).forEach(function (sitem) {
      drawLayer$1[item][sitem].remove();
    });
  });
}

function buildHtml$1(content) {
  return "<div style='display:block;cursor:pointer;color:#f00'>".concat(content, "</div>");
}

function formatArea$1(radius) {
  var area = (Math.PI * Math.pow(radius / 1000, 2)).toFixed(2) + "k㎡";
  return area;
}

window.circle = {};
window.circle.remove = remove$1;
var circle = {
  initialize: initialize$1,
  enable: enable$1,
  disable: disable$1,
  removeAll: removeAll$1
};

var mapInstance;
var layerGroup;
var drawControl;
var rectangleDrawer;
var drawLayer = {};
var currentLayerId = null;

function enable() {
  rectangleDrawer = new L.Draw.Rectangle(mapInstance, drawControl.options.draw.rectangle);
  rectangleDrawer.enable();
}

function disable() {
  var _rectangleDrawer;

  (_rectangleDrawer = rectangleDrawer) === null || _rectangleDrawer === void 0 ? void 0 : _rectangleDrawer.disable();
}

function initialize(instance) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    showMarker: false
  };
  mapInstance = instance;
  layerGroup = new L.FeatureGroup();
  mapInstance.addLayer(layerGroup); // 初始化图层数据

  currentLayerId = nanoid.nanoid();
  drawLayer[currentLayerId] = {
    point: new L.FeatureGroup(),
    shape: new L.FeatureGroup()
  };
  drawControl = new L.Control.Draw({
    edit: {
      featureGroup: layerGroup
    },
    draw: {
      rectangle: _objectSpread2({
        icon: new L.DivIcon({
          iconSize: new L.Point(8, 8),
          className: "leaflet-div-icon leaflet-editing-icon measure-icon"
        }),
        shapeOptions: {
          stroke: true,
          color: "#f40",
          weight: 4,
          opacity: 1
        },
        showArea: false
      }, options)
    }
  });
  mapInstance.off(L.Draw.Event.CREATED).on(L.Draw.Event.CREATED, function (event) {
    event.layer.id = currentLayerId;
    drawLayer[currentLayerId].shape = event.layer;
    layerGroup.addLayer(drawLayer[currentLayerId].shape);
    var latlng = drawLayer[currentLayerId].shape.getLatLngs()[0];

    if (options.showMarker) {
      addMeasureMarker(latlng, drawLayer[currentLayerId].shape.getCenter());
    }

    emitter.emit("measure.rectangle.created", event);
  });
  mapInstance.off(L.Draw.Event.DRAWVERTEX);
}

function addMeasureMarker(latlng, center) {
  var marker = L.marker(center, {
    icon: L.divIcon({
      className: "measure-div-icon"
    })
  });
  marker.bindTooltip(buildHtml("".concat(formatArea(latlng), "<div onclick=\"rectangle.remove('").concat(currentLayerId, "')\">\u5220\u9664</div>")), {
    permanent: true,
    direction: "right",
    className: "measure-tooltip"
  }).openTooltip();
  drawLayer[currentLayerId].point.addLayer(marker);
  drawLayer[currentLayerId].point.addTo(mapInstance);
}

function remove(id) {
  Object.keys(drawLayer[id]).forEach(function (item) {
    drawLayer[id][item].remove();
  });
}

function removeAll() {
  Object.keys(drawLayer).forEach(function (item) {
    Object.keys(drawLayer[item]).forEach(function (sitem) {
      drawLayer[item][sitem].remove();
    });
  });
}

function buildHtml(content) {
  return "<div style='display:block;cursor:pointer;color:#f00'>".concat(content, "</div>");
}

function formatArea(polygon) {
  var seeArea = L.GeometryUtil.geodesicArea(polygon);
  var area = (seeArea / 10e5).toFixed(2) + "k㎡";
  return area;
}

window.rectangle = {};
window.rectangle.remove = remove;
var rectangle = {
  initialize: initialize,
  enable: enable,
  disable: disable,
  removeAll: removeAll
};

var measure = /*#__PURE__*/Object.freeze({
  __proto__: null,
  polyline: polyline,
  polygon: polygon,
  circle: circle,
  rectangle: rectangle
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
  control: control,
  layer: layer,
  service: service,
  measure: measure
});

exports.map = map;
exports.utils = index;
