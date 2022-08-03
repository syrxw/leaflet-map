import { isArray } from 'lodash-es';
import mitt from 'mitt';
import axios from 'axios';

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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
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

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct.bind();
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var fileMap = {
  coreStyle: "aqsc/core.min.css",
  coreScript: "aqsc/core.min.js",
  jquery: "aqsc/jquery-3.6.0.min.js",
  plotting: "aqsc/plotting.js",
  turf: "aqsc/turf.js",
  lasso: "aqsc/leaflet-lasso.min.js",
  antPath: "aqsc/leaflet-ant-path.js",
  arrowHead: "aqsc/leaflet-arrowheads.js",
  geometryutil: "aqsc/leaflet-geometryutil.js",
  arrowCircle: "aqsc/leaflet-arrowcircle.js"
};
function MapLoader(file) {
  createStyle(fileMap.coreStyle);
  var aqsc = new Promise(function (resolve, reject) {
    if (window.Aqsc) {
      resolve(window.Aqsc);
    } else {
      createScript(fileMap.coreScript, reject, function () {
        window.Aqsc.Util.getAqscMapAk = function () {
          return true;
        };

        resolve(window.Aqsc);
      });
    }
  });
  aqsc.then(function () {
    if (isArray(file) && file.length > 0) {
      file.forEach(function (item) {
        createScript(fileMap[item]);
      });
    }
  });
  return aqsc;
}
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

var MapDefaultConfig = {
  map: {
    mapType: "Tianditu|vec",
    mapLevel: 14,
    mapCenter: {
      lng: 117.285,
      lat: 31.8584
    },
    mapOptions: {
      minZoom: 6,
      maxZoom: 18,
      enableAutoResize: true,
      preferCanvas: true
    },
    mapExtra: []
  },
  autoLocation: false // 是否自动定位

};

var LayerConfig = {
  type: {
    WMS: "wms",
    WFS: "wfs"
  },
  layer: {
    Baidu: {
      vec: {
        func: "addBaiduBaseLayer"
      },
      img: {
        func: "addBaiduBaseLayer"
      },
      img_0: {
        func: "addBaiduBaseLayer"
      },
      customId: {
        func: "addBaiduCustomBaseLayer"
      }
    },
    Tianditu: {
      vec: {
        func: "addTiandituBaseLayer"
      },
      vec_0: {
        func: "addTiandituBaseLayer"
      },
      img: {
        func: "addTiandituBaseLayer"
      },
      img_0: {
        func: "addTiandituBaseLayer"
      },
      ter: {
        func: "addTiandituBaseLayer"
      }
    },
    Amap: {
      vec_0: {
        func: "addAMapBaseLayer"
      },
      img: {
        func: "addAMapBaseLayer"
      },
      img_0: {
        func: "addAMapBaseLayer"
      }
    }
  }
};

var Map = /*#__PURE__*/function () {
  function Map(config) {
    _classCallCheck(this, Map);

    // 全局的配置文件
    this.config = config || MapDefaultConfig.map; // 地图挂载的div 接收的是个id

    this.container = null; // 地图创建之后的实体

    this.map = null; // aqsc地图示例

    this.aqsc = null; // 地图的中心点位

    this.pt = null; // 地图的图层，以key作为索引存储

    this.layers = {}; // 地图的事件监听器

    this.emitter = mitt();
  }
  /**
   * 地图挂载创建
   * @param {*} container 地图挂载id
   * @returns
   */


  _createClass(Map, [{
    key: "mount",
    value: function mount(container) {
      this.container = container;
      this.loadMap();
      return this;
    }
    /**
     * 创建地图
     */

  }, {
    key: "loadMap",
    value: function () {
      var _loadMap = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return MapLoader(this.config.mapExtra);

              case 2:
                this.aqsc = _context.sent;
                this.pt = new this.aqsc.Point(this.config.mapCenter.lng, this.config.mapCenter.lat);

                if (!this.config.intranet) {
                  _context.next = 9;
                  break;
                }

                _context.next = 7;
                return this.intranet();

              case 7:
                _context.next = 11;
                break;

              case 9:
                _context.next = 11;
                return this.normalLoad(this.config.mapType);

              case 11:
                window.aqsc = this.aqsc;
                window.map = this.map;
                window._MAP = this.map.map; //    this.addScale()

                this.addZoom();
                this.emitter.emit("mapLoaded");

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadMap() {
        return _loadMap.apply(this, arguments);
      }

      return loadMap;
    }()
    /**
     * 一般加载底图
     * @param {*} type 底图类型
     */

  }, {
    key: "normalLoad",
    value: function normalLoad(type) {
      var mapType = type.match(/(\S*)\|/)[1];
      var layerType = type.match(/\|(\S*)/)[1];

      if (!LayerConfig.layer[mapType]) {
        throw new Error("错误的地图类型,正确的应为" + Object.keys(LayerConfig.layer));
      }

      if (!LayerConfig.layer[mapType][layerType]) {
        throw new Error("错误的图层类型,正确的应为" + Object.keys(LayerConfig.layer[mapType]));
      }

      this.destroy();
      this.map = new this.aqsc.Map(this.container, mapType, this.pt, this.config.mapLevel, this.config.mapOptions);
      this.map[LayerConfig.layer[mapType][layerType].func](this.container, layerType === "customId" ? this.config.mapCustomId : layerType);
    }
    /**
     * 内网地图加载
     * @param {*} type
     */

  }, {
    key: "intranet",
    value: function () {
      var _intranet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function intranet() {
        return _intranet.apply(this, arguments);
      }

      return intranet;
    }()
    /**
     * 添加地图缩放控件
     */

  }, {
    key: "addZoom",
    value: function addZoom() {
      var zoom = new this.aqsc.Zoom();
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

  }, {
    key: "addScale",
    value: function addScale() {
      var scale = new this.aqsc.Scale();
      scale.addToMap();
      scale.setAnchor("bottomright");
      scale.setMaxWidth(100);
      scale.setFeetShow(false);
    }
    /**
     * 地图实例销毁
     */

  }, {
    key: "destroy",
    value: function destroy() {
      var _this = this;

      if (this.map) {
        this.map.destroy();
      }

      Object.keys(this.layers).forEach(function (item) {
        var _this$layers$item;

        (_this$layers$item = _this.layers[item]) === null || _this$layers$item === void 0 ? void 0 : _this$layers$item.clear();
      });
    }
    /**
     * 地图缩放到图层可视区域
     * @param {*} currentLayer 计算图层
     */

  }, {
    key: "setFixView",
    value: function setFixView(currentLayer) {
      var sw = currentLayer.layer.getBounds()._southWest;

      var ne = currentLayer.layer.getBounds()._northEast;

      if (sw && ne) {
        var fitBounds = new this.aqsc.Bounds(new this.aqsc.Point(sw.lng, sw.lat), new this.aqsc.Point(ne.lng, ne.lat));
        this.map.fitBounds(fitBounds);
      }
    }
  }]);

  return Map;
}();

var service = axios.create({
  baseURL: "/api",
  timeout: 10000
});
service.interceptors.request.use(function (config) {
  return config;
}); // 响应拦截器

service.interceptors.response.use( /*#__PURE__*/function () {
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

var MapDraw = /*#__PURE__*/function (_Map) {
  _inherits(MapDraw, _Map);

  var _super = _createSuper(MapDraw);

  function MapDraw(config) {
    _classCallCheck(this, MapDraw);

    return _super.call(this, config);
  }
  /**
   * 创建渲染图层
   * @param {*} options 图层参数
   * @param {*} isPure 是否虚拟生成图层信息
   */


  _createClass(MapDraw, [{
    key: "createLayer",
    value: function createLayer(options, isPure) {
      this.layers[options.id] = {
        name: options.name,
        // 图层名称
        lenged: options.lenged,
        // 图层图例
        type: options.type,
        // 图层类型[lineString,point,ployon]
        style: options.style,
        // 图层装配样式
        isShow: true,
        // 是否展示
        renderData: options.renderData || [],
        // 渲染数据
        renderFunc: options.renderFunc,
        // 渲染函数
        layer: isPure ? options.layer : null
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

  }, {
    key: "createWFSLayer",
    value: function () {
      var _createWFSLayer = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(options) {
        var params, url, u, data, genJsonLayer;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // 向geoserver请求数据
                params = {
                  service: "WFS",
                  version: "1.1.0",
                  request: "GetFeature",
                  typeName: options.layer,
                  outputFormat: "application/json",
                  // maxFeatures: 32,
                  srsName: options.epsg
                }; // /geoserver/gis/ows

                url = options.url;
                u = url + window.L.Util.getParamString(params, url);
                _context.next = 5;
                return service.get(u);

              case 5:
                data = _context.sent;
                genJsonLayer = new window.L.geoJson(data, {
                  style: _objectSpread2(_objectSpread2({}, options.style), {}, {
                    renderer: window.L.canvas()
                  }),
                  onEachFeature: function onEachFeature() {}
                });
                genJsonLayer.addTo(this.map.map); // 请求回来的数据是geojson  用leaflet的geojson方法进行渲染

                this.createLayer({
                  id: options.layer,
                  name: options.name,
                  type: LayerConfig.type.WFS,
                  renderData: [],
                  renderFunc: null,
                  style: options.style,
                  layer: genJsonLayer
                }, true);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createWFSLayer(_x) {
        return _createWFSLayer.apply(this, arguments);
      }

      return createWFSLayer;
    }()
    /**
     * 创建WMS图层
     * @param {Object} options
     */

  }, {
    key: "createWMSLayer",
    value: function () {
      var _createWMSLayer = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(options) {
        var wmsLayer;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // /api/geoserver/gis/wms
                wmsLayer = window.L.tileLayer.wms(options.url, {
                  layers: options.layer,
                  format: "image/png",
                  transparent: true // crs: window.L.CRS.GCJ02

                });
                wmsLayer.addTo(this.map);
                this.createLayer({
                  id: options.layer,
                  name: options.name,
                  type: LayerConfig.type.WMS,
                  renderData: [],
                  renderFunc: null,
                  style: options.style,
                  layer: wmsLayer
                }, true);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function createWMSLayer(_x2) {
        return _createWMSLayer.apply(this, arguments);
      }

      return createWMSLayer;
    }()
    /**
     * 创建右键菜单
     * @param {*} data 右键菜单数据
     */

  }, {
    key: "createRightMenu",
    value: function createRightMenu(data) {
      var _this = this;

      var rightMenu = new this.aqsc.ContextRightMenu();
      data.map(function (item) {
        var rightMenuItem = new _this.aqsc.CustomRightMenuItem(item.name, function (e) {
          item.callback(e);
        }, item.options);
        rightMenu.addItem(rightMenuItem);
      });
      this.map.addContextRightMenu(rightMenu);
    }
    /**
     * 创建图片类型的点位
     * @param {Object} data
     * @returns
     */

  }, {
    key: "createImgPoint",
    value: function createImgPoint(data) {
      var point = _construct(this.aqsc.Point, _toConsumableArray(data.point));

      var markerPoint = new this.aqsc.MarkerCustomImg(point, _objectSpread2(_objectSpread2({}, data.options), {}, {
        imagePath: data.options.imagePath || "aqsc/images/marker-icon.png"
      }));
      return markerPoint;
    }
    /**
     * 渲染图层上的数据
     * @param {String} layerId
     */

  }, {
    key: "renderLayerById",
    value: function renderLayerById(layerId) {
      var layer = this.layers[layerId];

      if (layer.renderData.length > 0) {
        layer.renderFunc(layer.renderData);
      }
    }
  }]);

  return MapDraw;
}(Map);

var index = {
  Map: MapDraw,
  MapDefaultConfig: MapDefaultConfig,
  LayerConfig: LayerConfig
};

export { index as default };
