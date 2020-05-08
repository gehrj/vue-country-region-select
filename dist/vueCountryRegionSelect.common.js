module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "07e3":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "0a49":
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__("9b43");
var IObject = __webpack_require__("626a");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var asc = __webpack_require__("cd1c");
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "0fc9":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("3a38");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "1169":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("2d95");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "1691":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "1bc3":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("f772");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "1ec9":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("f772");
var document = __webpack_require__("e53d").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "241e":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("25eb");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "25eb":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "294c":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var $toString = __webpack_require__("fa5b");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "2f21":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("79e5");

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};


/***/ }),

/***/ "2fdb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __webpack_require__("5ca1");
var context = __webpack_require__("d2c8");
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__("5147")(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "32a6":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("241e");
var $keys = __webpack_require__("c3a1");

__webpack_require__("ce7e")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "335c":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("6b4c");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "355d":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "35e8":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("d9f6");
var createDesc = __webpack_require__("aebd");
module.exports = __webpack_require__("8e60") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "36c3":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("335c");
var defined = __webpack_require__("25eb");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "3a38":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "5147":
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),

/***/ "5176":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("51b6");

/***/ }),

/***/ "51b6":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("a3c3");
module.exports = __webpack_require__("584a").Object.assign;


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5559":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("dbdb")('keys');
var uid = __webpack_require__("62a0");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "55dd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("5ca1");
var aFunction = __webpack_require__("d8e8");
var toObject = __webpack_require__("4bf8");
var fails = __webpack_require__("79e5");
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__("2f21")($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),

/***/ "584a":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "5b4e":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("36c3");
var toLength = __webpack_require__("b447");
var toAbsoluteIndex = __webpack_require__("0fc9");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "62a0":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "63b6":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("e53d");
var core = __webpack_require__("584a");
var ctx = __webpack_require__("d864");
var hide = __webpack_require__("35e8");
var has = __webpack_require__("07e3");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "6762":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __webpack_require__("5ca1");
var $includes = __webpack_require__("c366")(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__("9c6c")('includes');


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "6b4c":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "7514":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__("5ca1");
var $find = __webpack_require__("0a49")(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("9c6c")(KEY);


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "794b":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("8e60") && !__webpack_require__("294c")(function () {
  return Object.defineProperty(__webpack_require__("1ec9")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "79aa":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "7f7f":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("9e1e") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8aae":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("32a6");
module.exports = __webpack_require__("584a").Object.keys;


/***/ }),

/***/ "8e60":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("294c")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "9306":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__("c3a1");
var gOPS = __webpack_require__("9aa9");
var pIE = __webpack_require__("355d");
var toObject = __webpack_require__("241e");
var IObject = __webpack_require__("335c");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__("294c")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ "9aa9":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a3c3":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__("63b6");

$export($export.S + $export.F, 'Object', { assign: __webpack_require__("9306") });


/***/ }),

/***/ "a4bb":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("8aae");

/***/ }),

/***/ "aae3":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("d3f4");
var cof = __webpack_require__("2d95");
var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "aebd":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "b447":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("3a38");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "b8e3":
/***/ (function(module, exports) {

module.exports = true;


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c3a1":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("e6f3");
var enumBugKeys = __webpack_require__("1691");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "cd1c":
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__("e853");

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "ce7e":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("63b6");
var core = __webpack_require__("584a");
var fails = __webpack_require__("294c");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "d2c8":
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__("aae3");
var defined = __webpack_require__("be13");

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d864":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("79aa");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "d9f6":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("e4ae");
var IE8_DOM_DEFINE = __webpack_require__("794b");
var toPrimitive = __webpack_require__("1bc3");
var dP = Object.defineProperty;

exports.f = __webpack_require__("8e60") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "dbdb":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("584a");
var global = __webpack_require__("e53d");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("b8e3") ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "e4ae":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("f772");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "e53d":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "e6f3":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("07e3");
var toIObject = __webpack_require__("36c3");
var arrayIndexOf = __webpack_require__("5b4e")(false);
var IE_PROTO = __webpack_require__("5559")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "e853":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var isArray = __webpack_require__("1169");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "f772":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "fa5b":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("5537")('native-function-to-string', Function.toString);


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("f6fd")
  }

  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("7f7f");

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/keys.js
var keys = __webpack_require__("a4bb");
var keys_default = /*#__PURE__*/__webpack_require__.n(keys);

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"6dc7dc89-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/country-select.vue?vue&type=template&id=5877af1e&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('select',{class:_vm.className,on:{"change":function($event){_vm.onChange($event.target.value)}}},[(!_vm.disablePlaceholder && !_vm.removePlaceholder)?_c('option',{attrs:{"value":""}},[_vm._v(_vm._s(_vm.placeholder))]):_vm._e(),(_vm.disablePlaceholder && !_vm.removePlaceholder)?_c('option',{attrs:{"value":"","disabled":"","selected":""}},[_vm._v(_vm._s(_vm.placeholder))]):_vm._e(),(_vm.topCountry)?_c('option',{domProps:{"value":_vm.firstCountry,"selected":_vm.country === _vm.firstCountry}},[_vm._v(_vm._s(_vm.topCountryName()))]):_vm._e(),_vm._l((_vm.countries),function(region,index){return _c('option',{key:index,domProps:{"value":region[_vm.valueType],"selected":_vm.country === region[_vm.valueType]}},[_vm._v(_vm._s(_vm.shortCodeDropdown ? region.countryShortCode : region.countryName))])})],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/country-select.vue?vue&type=template&id=5877af1e&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find.js
var es6_array_find = __webpack_require__("7514");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.sort.js
var es6_array_sort = __webpack_require__("55dd");

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/assign.js
var object_assign = __webpack_require__("5176");
var assign_default = /*#__PURE__*/__webpack_require__.n(object_assign);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.array.includes.js
var es7_array_includes = __webpack_require__("6762");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.includes.js
var es6_string_includes = __webpack_require__("2fdb");

// CONCATENATED MODULE: ./src/data.js
/* harmony default export */ var src_data = ([{
  "countryName": "Afghanistan",
  "countryShortCode": "AF",
  "regions": [{
    "name": "Badakhshan",
    "shortCode": "BDS"
  }, {
    "name": "Badghis",
    "shortCode": "BDG"
  }, {
    "name": "Baghlan",
    "shortCode": "BGL"
  }, {
    "name": "Balkh",
    "shortCode": "BAL"
  }, {
    "name": "Bamyan",
    "shortCode": "BAM"
  }, {
    "name": "Daykundi",
    "shortCode": "DAY"
  }, {
    "name": "Farah",
    "shortCode": "FRA"
  }, {
    "name": "Faryab",
    "shortCode": "FYB"
  }, {
    "name": "Ghazni",
    "shortCode": "GHA"
  }, {
    "name": "Ghor",
    "shortCode": "GHO"
  }, {
    "name": "Helmand",
    "shortCode": "HEL"
  }, {
    "name": "Herat",
    "shortCode": "HER"
  }, {
    "name": "Jowzjan",
    "shortCode": "JOW"
  }, {
    "name": "Kabul",
    "shortCode": "KAB"
  }, {
    "name": "Kandahar",
    "shortCode": "KAN"
  }, {
    "name": "Kapisa",
    "shortCode": "KAP"
  }, {
    "name": "Khost",
    "shortCode": "KHO"
  }, {
    "name": "Kunar",
    "shortCode": "KNR"
  }, {
    "name": "Kunduz",
    "shortCode": "KDZ"
  }, {
    "name": "Laghman",
    "shortCode": "LAG"
  }, {
    "name": "Logar",
    "shortCode": "LOW"
  }, {
    "name": "Maidan Wardak",
    "shortCode": "WAR"
  }, {
    "name": "Nangarhar",
    "shortCode": "NAN"
  }, {
    "name": "Nimruz",
    "shortCode": "NIM"
  }, {
    "name": "Nuristan",
    "shortCode": "NUR"
  }, {
    "name": "Paktia",
    "shortCode": "PIA"
  }, {
    "name": "Paktika",
    "shortCode": "PKA"
  }, {
    "name": "Panjshir",
    "shortCode": "PAN"
  }, {
    "name": "Parwan",
    "shortCode": "PAR"
  }, {
    "name": "Samangan",
    "shortCode": "SAM"
  }, {
    "name": "Sar-e Pol",
    "shortCode": "SAR"
  }, {
    "name": "Takhar",
    "shortCode": "TAK"
  }, {
    "name": "Urozgan",
    "shortCode": "ORU"
  }, {
    "name": "Zabul",
    "shortCode": "ZAB"
  }]
}, {
  "countryName": "Åland Islands",
  "countryShortCode": "AX",
  "regions": [{
    "name": "Brändö",
    "shortCode": "BR"
  }, {
    "name": "Eckerö",
    "shortCode": "EC"
  }, {
    "name": "Finström",
    "shortCode": "FN"
  }, {
    "name": "Föglö",
    "shortCode": "FG"
  }, {
    "name": "Geta",
    "shortCode": "GT"
  }, {
    "name": "Hammarland",
    "shortCode": "HM"
  }, {
    "name": "Jomala",
    "shortCode": "JM"
  }, {
    "name": "Kumlinge",
    "shortCode": "KM"
  }, {
    "name": "Kökar",
    "shortCode": "KK"
  }, {
    "name": "Lemland",
    "shortCode": "LE"
  }, {
    "name": "Lumparland",
    "shortCode": "LU"
  }, {
    "name": "Mariehamn",
    "shortCode": "MH"
  }, {
    "name": "Saltvik",
    "shortCode": "SV"
  }, {
    "name": "Sottunga",
    "shortCode": "ST"
  }, {
    "name": "Sund",
    "shortCode": "SD"
  }, {
    "name": "Vårdö",
    "shortCode": "VR"
  }]
}, {
  "countryName": "Albania",
  "countryShortCode": "AL",
  "regions": [{
    "name": "Berat",
    "shortCode": "01"
  }, {
    "name": "Dibër",
    "shortCode": "09"
  }, {
    "name": "Durrës",
    "shortCode": "02"
  }, {
    "name": "Elbasan",
    "shortCode": "03"
  }, {
    "name": "Fier",
    "shortCode": "04"
  }, {
    "name": "Gjirokastër",
    "shortCode": "05"
  }, {
    "name": "Korçë",
    "shortCode": "06"
  }, {
    "name": "Kukës",
    "shortCode": "07"
  }, {
    "name": "Lezhë",
    "shortCode": "08"
  }, {
    "name": "Shkodër",
    "shortCode": "10"
  }, {
    "name": "Tirana",
    "shortCode": "11"
  }, {
    "name": "Vlorë",
    "shortCode": "12"
  }]
}, {
  "countryName": "Algeria",
  "countryShortCode": "DZ",
  "regions": [{
    "name": "Adrar",
    "shortCode": "01"
  }, {
    "name": "Aïn Defla",
    "shortCode": "44"
  }, {
    "name": "Aïn Témouchent",
    "shortCode": "46"
  }, {
    "name": "Algiers",
    "shortCode": "16"
  }, {
    "name": "Annaba",
    "shortCode": "23"
  }, {
    "name": "Batna",
    "shortCode": "05"
  }, {
    "name": "Béchar",
    "shortCode": "08"
  }, {
    "name": "Béjaïa",
    "shortCode": "06"
  }, {
    "name": "Biskra",
    "shortCode": "07"
  }, {
    "name": "Blida",
    "shortCode": "09"
  }, {
    "name": "Bordj Bou Arréridj",
    "shortCode": "34"
  }, {
    "name": "Bouïra",
    "shortCode": "10"
  }, {
    "name": "Boumerdès",
    "shortCode": "35"
  }, {
    "name": "Chlef",
    "shortCode": "02"
  }, {
    "name": "Constantine",
    "shortCode": "25"
  }, {
    "name": "Djelfa",
    "shortCode": "17"
  }, {
    "name": "El Bayadh",
    "shortCode": "32"
  }, {
    "name": "El Oued",
    "shortCode": "39"
  }, {
    "name": "El Tarf",
    "shortCode": "36"
  }, {
    "name": "Ghardaïa",
    "shortCode": "47"
  }, {
    "name": "Guelma",
    "shortCode": "24"
  }, {
    "name": "Illizi",
    "shortCode": "33"
  }, {
    "name": "Jijel",
    "shortCode": "18"
  }, {
    "name": "Khenchela",
    "shortCode": "40"
  }, {
    "name": "Laghouat",
    "shortCode": "03"
  }, {
    "name": "Mascara",
    "shortCode": "29"
  }, {
    "name": "Médéa",
    "shortCode": "26"
  }, {
    "name": "Mila",
    "shortCode": "43"
  }, {
    "name": "Mostaganem",
    "shortCode": "27"
  }, {
    "name": "Msila",
    "shortCode": "28"
  }, {
    "name": "Naâma",
    "shortCode": "45"
  }, {
    "name": "Oran",
    "shortCode": "31"
  }, {
    "name": "Ouargla",
    "shortCode": "30"
  }, {
    "name": "Oum el Bouaghi",
    "shortCode": "04"
  }, {
    "name": "Relizane",
    "shortCode": "48"
  }, {
    "name": "Saïda",
    "shortCode": "20"
  }, {
    "name": "Sétif",
    "shortCode": "19"
  }, {
    "name": "Sidi Bel Abbès",
    "shortCode": "22"
  }, {
    "name": "Skikda",
    "shortCode": "21"
  }, {
    "name": "Souk Ahras",
    "shortCode": "41"
  }, {
    "name": "Tamanghasset",
    "shortCode": "11"
  }, {
    "name": "Tébessa",
    "shortCode": "12"
  }, {
    "name": "Tiaret",
    "shortCode": "14"
  }, {
    "name": "Tindouf",
    "shortCode": "37"
  }, {
    "name": "Tipaza",
    "shortCode": "42"
  }, {
    "name": "Tissemsilt",
    "shortCode": "38"
  }, {
    "name": "Tizi Ouzou",
    "shortCode": "15"
  }, {
    "name": "Tlemcen",
    "shortCode": "13"
  }]
}, {
  "countryName": "American Samoa",
  "countryShortCode": "AS",
  "regions": [{
    "name": "Tutuila",
    "shortCode": "01"
  }, {
    "name": "Aunu'u",
    "shortCode": "02"
  }, {
    "name": "Ta'ū",
    "shortCode": "03"
  }, {
    "name": "Ofu‑Olosega",
    "shortCode": "04"
  }, {
    "name": "Rose Atoll",
    "shortCode": "21"
  }, {
    "name": "Swains Island",
    "shortCode": "22"
  }]
}, {
  "countryName": "Andorra",
  "countryShortCode": "AD",
  "regions": [{
    "name": "Andorra la Vella",
    "shortCode": "07"
  }, {
    "name": "Canillo",
    "shortCode": "02"
  }, {
    "name": "Encamp",
    "shortCode": "03"
  }, {
    "name": "Escaldes-Engordany",
    "shortCode": "08"
  }, {
    "name": "La Massana",
    "shortCode": "04"
  }, {
    "name": "Ordino",
    "shortCode": "05"
  }, {
    "name": "Sant Julià de Lòria",
    "shortCode": "06"
  }]
}, {
  "countryName": "Angola",
  "countryShortCode": "AO",
  "regions": [{
    "name": "Bengo",
    "shortCode": "BGO"
  }, {
    "name": "Benguela",
    "shortCode": "BGU"
  }, {
    "name": "Bié",
    "shortCode": "BIE"
  }, {
    "name": "Cabinda",
    "shortCode": "CAB"
  }, {
    "name": "Cuando Cubango",
    "shortCode": "CCU"
  }, {
    "name": "Cuanza Norte",
    "shortCode": "CNO"
  }, {
    "name": "Cuanza Sul",
    "shortCode": "CUS"
  }, {
    "name": "Cunene",
    "shortCode": "CNN"
  }, {
    "name": "Huambo",
    "shortCode": "HUA"
  }, {
    "name": "Huíla",
    "shortCode": "HUI"
  }, {
    "name": "Luanda",
    "shortCode": "LUA"
  }, {
    "name": "Lunda Norte",
    "shortCode": "LNO"
  }, {
    "name": "Lunda Sul",
    "shortCode": "LSU"
  }, {
    "name": "Malanje",
    "shortCode": "MAL"
  }, {
    "name": "Moxico",
    "shortCode": "MOX"
  }, {
    "name": "Namibe",
    "shortCode": "NAM"
  }, {
    "name": "Uíge",
    "shortCode": "UIG"
  }, {
    "name": "Zaire",
    "shortCode": "ZAI"
  }]
}, {
  "countryName": "Anguilla",
  "countryShortCode": "AI",
  "regions": [{
    "name": "Anguilla",
    "shortCode": "01"
  }, {
    "name": "Anguillita Island",
    "shortCode": "02"
  }, {
    "name": "Blowing Rock",
    "shortCode": "03"
  }, {
    "name": "Cove Cay",
    "shortCode": "04"
  }, {
    "name": "Crocus Cay",
    "shortCode": "05"
  }, {
    "name": "Deadman's Cay",
    "shortCode": "06"
  }, {
    "name": "Dog Island",
    "shortCode": "07"
  }, {
    "name": "East Cay",
    "shortCode": "08"
  }, {
    "name": "Little Island",
    "shortCode": "09"
  }, {
    "name": "Little Scrub Island",
    "shortCode": "10"
  }, {
    "name": "Mid Cay",
    "shortCode": "11"
  }, {
    "name": "North Cay",
    "shortCode": "12"
  }, {
    "name": "Prickly Pear Cays",
    "shortCode": "13"
  }, {
    "name": "Rabbit Island",
    "shortCode": "14"
  }, {
    "name": "Sandy Island/Sand Island",
    "shortCode": "15"
  }, {
    "name": "Scilly Cay",
    "shortCode": "16"
  }, {
    "name": "Scrub Island",
    "shortCode": "17"
  }, {
    "name": "Seal Island",
    "shortCode": "18"
  }, {
    "name": "Sombrero/Hat Island",
    "shortCode": "19"
  }, {
    "name": "South Cay",
    "shortCode": "20"
  }, {
    "name": "South Wager Island",
    "shortCode": "21"
  }, {
    "name": "West Cay",
    "shortCode": "22"
  }]
}, {
  "countryName": "Antarctica",
  "countryShortCode": "AQ",
  "regions": [{
    "name": "Antarctica",
    "shortCode": "AQ"
  }]
}, {
  "countryName": "Antigua and Barbuda",
  "countryShortCode": "AG",
  "regions": [{
    "name": "Antigua Island",
    "shortCode": "01"
  }, {
    "name": "Barbuda Island",
    "shortCode": "02"
  }, {
    "name": "Bird Island",
    "shortCode": "04"
  }, {
    "name": "Bishop Island",
    "shortCode": "05"
  }, {
    "name": "Blake Island",
    "shortCode": "06"
  }, {
    "name": "Crump Island",
    "shortCode": "09"
  }, {
    "name": "Dulcina Island",
    "shortCode": "10"
  }, {
    "name": "Exchange Island",
    "shortCode": "11"
  }, {
    "name": "Five Islands",
    "shortCode": "12"
  }, {
    "name": "Great Bird Island",
    "shortCode": "13"
  }, {
    "name": "Green Island",
    "shortCode": "14"
  }, {
    "name": "Guiana Island",
    "shortCode": "15"
  }, {
    "name": "Hawes Island",
    "shortCode": "17"
  }, {
    "name": "Hells Gate Island",
    "shortCode": "16"
  }, {
    "name": "Henry Island",
    "shortCode": "18"
  }, {
    "name": "Johnson Island",
    "shortCode": "19"
  }, {
    "name": "Kid Island",
    "shortCode": "20"
  }, {
    "name": "Lobster Island",
    "shortCode": "22"
  }, {
    "name": "Maiden Island",
    "shortCode": "24"
  }, {
    "name": "Moor Island",
    "shortCode": "25"
  }, {
    "name": "Nanny Island",
    "shortCode": "26"
  }, {
    "name": "Pelican Island",
    "shortCode": "27"
  }, {
    "name": "Prickly Pear Island",
    "shortCode": "28"
  }, {
    "name": "Rabbit Island",
    "shortCode": "29"
  }, {
    "name": "Red Head Island",
    "shortCode": "31"
  }, {
    "name": "Redonda Island",
    "shortCode": "03"
  }, {
    "name": "Sandy Island",
    "shortCode": "32"
  }, {
    "name": "Smith Island",
    "shortCode": "33"
  }, {
    "name": "The Sisters",
    "shortCode": "34"
  }, {
    "name": "Vernon Island",
    "shortCode": "35"
  }, {
    "name": "Wicked Will Island",
    "shortCode": "36"
  }, {
    "name": "York Island",
    "shortCode": "37"
  }]
}, {
  "countryName": "Argentina",
  "countryShortCode": "AR",
  "regions": [{
    "name": "Buenos Aires",
    "shortCode": "B"
  }, {
    "name": "Capital Federal",
    "shortCode": "C"
  }, {
    "name": "Catamarca",
    "shortCode": "K"
  }, {
    "name": "Chaco",
    "shortCode": "H"
  }, {
    "name": "Chubut",
    "shortCode": "U"
  }, {
    "name": "Córdoba",
    "shortCode": "X"
  }, {
    "name": "Corrientes",
    "shortCode": "W"
  }, {
    "name": "Entre Ríos",
    "shortCode": "E"
  }, {
    "name": "Formosa",
    "shortCode": "P"
  }, {
    "name": "Jujuy",
    "shortCode": "Y"
  }, {
    "name": "La Pampa",
    "shortCode": "L"
  }, {
    "name": "La Rioja",
    "shortCode": "F"
  }, {
    "name": "Mendoza",
    "shortCode": "M"
  }, {
    "name": "Misiones",
    "shortCode": "N"
  }, {
    "name": "Neuquén",
    "shortCode": "Q"
  }, {
    "name": "Río Negro",
    "shortCode": "R"
  }, {
    "name": "Salta",
    "shortCode": "A"
  }, {
    "name": "San Juan",
    "shortCode": "J"
  }, {
    "name": "San Luis",
    "shortCode": "D"
  }, {
    "name": "Santa Cruz",
    "shortCode": "Z"
  }, {
    "name": "Santa Fe",
    "shortCode": "S"
  }, {
    "name": "Santiago del Estero",
    "shortCode": "G"
  }, {
    "name": "Tierra del Fuego",
    "shortCode": "V"
  }, {
    "name": "Tucumán",
    "shortCode": "T"
  }]
}, {
  "countryName": "Armenia",
  "countryShortCode": "AM",
  "regions": [{
    "name": "Aragatsotn",
    "shortCode": "AG"
  }, {
    "name": "Ararat",
    "shortCode": "AR"
  }, {
    "name": "Armavir",
    "shortCode": "AV"
  }, {
    "name": "Gegharkunik",
    "shortCode": "GR"
  }, {
    "name": "Kotayk",
    "shortCode": "KT"
  }, {
    "name": "Lori",
    "shortCode": "LO"
  }, {
    "name": "Shirak",
    "shortCode": "SH"
  }, {
    "name": "Syunik",
    "shortCode": "SU"
  }, {
    "name": "Tavush",
    "shortCode": "TV"
  }, {
    "name": "Vayots Dzor",
    "shortCode": "VD"
  }, {
    "name": "Yerevan",
    "shortCode": "ER"
  }]
}, {
  "countryName": "Aruba",
  "countryShortCode": "AW",
  "regions": [{
    "name": "Aruba",
    "shortCode": "AW"
  }]
}, {
  "countryName": "Australia",
  "countryShortCode": "AU",
  "regions": [{
    "name": "Australian Capital Territory",
    "shortCode": "ACT"
  }, {
    "name": "New South Wales",
    "shortCode": "NSW"
  }, {
    "name": "Northern Territory",
    "shortCode": "NT"
  }, {
    "name": "Queensland",
    "shortCode": "QLD"
  }, {
    "name": "South Australia",
    "shortCode": "SA"
  }, {
    "name": "Tasmania",
    "shortCode": "TAS"
  }, {
    "name": "Victoria",
    "shortCode": "VIC"
  }, {
    "name": "Western Australia",
    "shortCode": "WA"
  }]
}, {
  "countryName": "Austria",
  "countryShortCode": "AT",
  "regions": [{
    "name": "Burgenland",
    "shortCode": "1"
  }, {
    "name": "Kärnten",
    "shortCode": "2"
  }, {
    "name": "Niederösterreich",
    "shortCode": "3"
  }, {
    "name": "Oberösterreich",
    "shortCode": "4"
  }, {
    "name": "Salzburg",
    "shortCode": "5"
  }, {
    "name": "Steiermark",
    "shortCode": "6"
  }, {
    "name": "Tirol",
    "shortCode": "7"
  }, {
    "name": "Vorarlberg",
    "shortCode": "8"
  }, {
    "name": "Wien",
    "shortCode": "9"
  }]
}, {
  "countryName": "Azerbaijan",
  "countryShortCode": "AZ",
  "regions": [{
    "name": "Abşeron",
    "shortCode": "ABS"
  }, {
    "name": "Ağcabədi",
    "shortCode": "AGC"
  }, {
    "name": "Ağdam",
    "shortCode": "AGM"
  }, {
    "name": "Ağdaş",
    "shortCode": "AGS"
  }, {
    "name": "Ağstafa",
    "shortCode": "AGA"
  }, {
    "name": "Ağsu",
    "shortCode": "AGU"
  }, {
    "name": "Astara",
    "shortCode": "AST"
  }, {
    "name": "Bakı",
    "shortCode": "BAK"
  }, {
    "name": "Babək",
    "shortCode": "BAB"
  }, {
    "name": "Balakən",
    "shortCode": "BAL"
  }, {
    "name": "Bərdə",
    "shortCode": "BAR"
  }, {
    "name": "Beyləqan",
    "shortCode": "BEY"
  }, {
    "name": "Biləsuvar",
    "shortCode": "BIL"
  }, {
    "name": "Cəbrayıl",
    "shortCode": "CAB"
  }, {
    "name": "Cəlilabad",
    "shortCode": "CAL"
  }, {
    "name": "Culfa",
    "shortCode": "CUL"
  }, {
    "name": "Daşkəsən",
    "shortCode": "DAS"
  }, {
    "name": "Füzuli",
    "shortCode": "FUZ"
  }, {
    "name": "Gədəbəy",
    "shortCode": "GAD"
  }, {
    "name": "Goranboy",
    "shortCode": "GOR"
  }, {
    "name": "Göyçay",
    "shortCode": "GOY"
  }, {
    "name": "Göygöl",
    "shortCode": "GYG"
  }, {
    "name": "Hacıqabul",
    "shortCode": "HAC"
  }, {
    "name": "İmişli",
    "shortCode": "IMI"
  }, {
    "name": "İsmayıllı",
    "shortCode": "ISM"
  }, {
    "name": "Kəlbəcər",
    "shortCode": "KAL"
  }, {
    "name": "Kǝngǝrli",
    "shortCode": "KAN"
  }, {
    "name": "Kürdəmir",
    "shortCode": "KUR"
  }, {
    "name": "Laçın",
    "shortCode": "LAC"
  }, {
    "name": "Lənkəran",
    "shortCode": "LAN"
  }, {
    "name": "Lerik",
    "shortCode": "LER"
  }, {
    "name": "Masallı",
    "shortCode": "MAS"
  }, {
    "name": "Neftçala",
    "shortCode": "NEF"
  }, {
    "name": "Oğuz",
    "shortCode": "OGU"
  }, {
    "name": "Ordubad",
    "shortCode": "ORD"
  }, {
    "name": "Qəbələ",
    "shortCode": "QAB"
  }, {
    "name": "Qax",
    "shortCode": "QAX"
  }, {
    "name": "Qazax",
    "shortCode": "QAZ"
  }, {
    "name": "Qobustan",
    "shortCode": "QOB"
  }, {
    "name": "Quba",
    "shortCode": "QBA"
  }, {
    "name": "Qubadli",
    "shortCode": "QBI"
  }, {
    "name": "Qusar",
    "shortCode": "QUS"
  }, {
    "name": "Saatlı",
    "shortCode": "SAT"
  }, {
    "name": "Sabirabad",
    "shortCode": "SAB"
  }, {
    "name": "Şabran",
    "shortCode": "SBN"
  }, {
    "name": "Sədərək",
    "shortCode": "SAD"
  }, {
    "name": "Şahbuz",
    "shortCode": "SAH"
  }, {
    "name": "Şəki",
    "shortCode": "SAK"
  }, {
    "name": "Salyan",
    "shortCode": "SAL"
  }, {
    "name": "Şamaxı",
    "shortCode": "SMI"
  }, {
    "name": "Şəmkir",
    "shortCode": "SKR"
  }, {
    "name": "Samux",
    "shortCode": "SMX"
  }, {
    "name": "Şərur",
    "shortCode": "SAR"
  }, {
    "name": "Siyəzən",
    "shortCode": "SIY"
  }, {
    "name": "Şuşa",
    "shortCode": "SUS"
  }, {
    "name": "Tərtər",
    "shortCode": "TAR"
  }, {
    "name": "Tovuz",
    "shortCode": "TOV"
  }, {
    "name": "Ucar",
    "shortCode": "UCA"
  }, {
    "name": "Xaçmaz",
    "shortCode": "XAC"
  }, {
    "name": "Xızı",
    "shortCode": "XIZ"
  }, {
    "name": "Xocalı",
    "shortCode": "XCI"
  }, {
    "name": "Xocavənd",
    "shortCode": "XVD"
  }, {
    "name": "Yardımlı",
    "shortCode": "YAR"
  }, {
    "name": "Yevlax",
    "shortCode": "YEV"
  }, {
    "name": "Zəngilan",
    "shortCode": "ZAN"
  }, {
    "name": "Zaqatala",
    "shortCode": "ZAQ"
  }, {
    "name": "Zərdab",
    "shortCode": "ZAR"
  }]
}, {
  "countryName": "Bahamas",
  "countryShortCode": "BS",
  "regions": [{
    "name": "Acklins Island",
    "shortCode": "01"
  }, {
    "name": "Berry Islands",
    "shortCode": "22"
  }, {
    "name": "Bimini",
    "shortCode": "02"
  }, {
    "name": "Black Point",
    "shortCode": "23"
  }, {
    "name": "Cat Island",
    "shortCode": "03"
  }, {
    "name": "Central Abaco",
    "shortCode": "24"
  }, {
    "name": "Crooked Island and Long Cay",
    "shortCode": "28"
  }, {
    "name": "East Grand Bahama",
    "shortCode": "29"
  }, {
    "name": "Exuma",
    "shortCode": "04"
  }, {
    "name": "Freeport",
    "shortCode": "05"
  }, {
    "name": "Fresh Creek",
    "shortCode": "06"
  }, {
    "name": "Governor's Harbour",
    "shortCode": "07"
  }, {
    "name": "Green Turtle Cay",
    "shortCode": "08"
  }, {
    "name": "Harbour Island",
    "shortCode": "09"
  }, {
    "name": "High Rock",
    "shortCode": "10"
  }, {
    "name": "Inagua",
    "shortCode": "11"
  }, {
    "name": "Kemps Bay",
    "shortCode": "12"
  }, {
    "name": "Long Island",
    "shortCode": "13"
  }, {
    "name": "Marsh Harbour",
    "shortCode": "14"
  }, {
    "name": "Mayaguana",
    "shortCode": "15"
  }, {
    "name": "Moore’s Island",
    "shortCode": "40"
  }, {
    "name": "New Providence",
    "shortCode": "16"
  }, {
    "name": "Nichollstown and Berry Islands",
    "shortCode": "17"
  }, {
    "name": "North Abaco",
    "shortCode": "42"
  }, {
    "name": "North Andros",
    "shortCode": "41"
  }, {
    "name": "North Eleuthera",
    "shortCode": "33"
  }, {
    "name": "Ragged Island",
    "shortCode": "18"
  }, {
    "name": "Rock Sound",
    "shortCode": "19"
  }, {
    "name": "San Salvador and Rum Cay",
    "shortCode": "20"
  }, {
    "name": "Sandy Point",
    "shortCode": "21"
  }, {
    "name": "South Abaco",
    "shortCode": "35"
  }, {
    "name": "South Andros",
    "shortCode": "36"
  }, {
    "name": "South Eleuthera",
    "shortCode": "37"
  }, {
    "name": "West Grand Bahama",
    "shortCode": "39"
  }]
}, {
  "countryName": "Bahrain",
  "countryShortCode": "BH",
  "regions": [{
    "name": "Al Janūbīyah",
    "shortCode": "14"
  }, {
    "name": "Al Manāmah",
    "shortCode": "13"
  }, {
    "name": "Al Muḩarraq",
    "shortCode": "15"
  }, {
    "name": "Al Wusţá",
    "shortCode": "16"
  }, {
    "name": "Ash Shamālīyah",
    "shortCode": "17"
  }]
}, {
  "countryName": "Bangladesh",
  "countryShortCode": "BD",
  "regions": [{
    "name": "Barisal",
    "shortCode": "A"
  }, {
    "name": "Chittagong",
    "shortCode": "B"
  }, {
    "name": "Dhaka",
    "shortCode": "C"
  }, {
    "name": "Khulna",
    "shortCode": "D"
  }, {
    "name": "Mymensingh",
    "shortCode": "M"
  }, {
    "name": "Rajshahi",
    "shortCode": "E"
  }, {
    "name": "Rangpur",
    "shortCode": "F"
  }, {
    "name": "Sylhet",
    "shortCode": "G"
  }]
}, {
  "countryName": "Barbados",
  "countryShortCode": "BB",
  "regions": [{
    "name": "Christ Church",
    "shortCode": "01"
  }, {
    "name": "Saint Andrew",
    "shortCode": "02"
  }, {
    "name": "Saint George",
    "shortCode": "03"
  }, {
    "name": "Saint James",
    "shortCode": "04"
  }, {
    "name": "Saint John",
    "shortCode": "05"
  }, {
    "name": "Saint Joseph",
    "shortCode": "06"
  }, {
    "name": "Saint Lucy",
    "shortCode": "07"
  }, {
    "name": "Saint Michael",
    "shortCode": "08"
  }, {
    "name": "Saint Peter",
    "shortCode": "09"
  }, {
    "name": "Saint Philip",
    "shortCode": "10"
  }, {
    "name": "Saint Thomas",
    "shortCode": "11"
  }]
}, {
  "countryName": "Belarus",
  "countryShortCode": "BY",
  "regions": [{
    "name": "Brest voblast",
    "shortCode": "BR"
  }, {
    "name": "Gorod Minsk",
    "shortCode": "HM"
  }, {
    "name": "Homiel voblast",
    "shortCode": "HO"
  }, {
    "name": "Hrodna voblast",
    "shortCode": "HR"
  }, {
    "name": "Mahilyow voblast",
    "shortCode": "MA"
  }, {
    "name": "Minsk voblast",
    "shortCode": "MI"
  }, {
    "name": "Vitsebsk voblast",
    "shortCode": "VI"
  }]
}, {
  "countryName": "Belgium",
  "countryShortCode": "BE",
  "regions": [{
    "name": "Bruxelles-Capitale",
    "shortCode": "BRU"
  }, {
    "name": "Région Flamande",
    "shortCode": "VLG"
  }, {
    "name": "Région Wallonië",
    "shortCode": "WAL"
  }]
}, {
  "countryName": "Belize",
  "countryShortCode": "BZ",
  "regions": [{
    "name": "Belize District",
    "shortCode": "BZ"
  }, {
    "name": "Cayo District",
    "shortCode": "CY"
  }, {
    "name": "Corozal District",
    "shortCode": "CZL"
  }, {
    "name": "Orange Walk District",
    "shortCode": "OW"
  }, {
    "name": "Stann Creek District",
    "shortCode": "SC"
  }, {
    "name": "Toledo District",
    "shortCode": "TOL"
  }]
}, {
  "countryName": "Benin",
  "countryShortCode": "BJ",
  "regions": [{
    "name": "Alibori",
    "shortCode": "AL"
  }, {
    "name": "Atakora",
    "shortCode": "AK"
  }, {
    "name": "Atlantique",
    "shortCode": "AQ"
  }, {
    "name": "Borgou",
    "shortCode": "BO"
  }, {
    "name": "Collines Department",
    "shortCode": "CO"
  }, {
    "name": "Donga",
    "shortCode": "DO"
  }, {
    "name": "Kouffo",
    "shortCode": "KO"
  }, {
    "name": "Littoral Department",
    "shortCode": "LI"
  }, {
    "name": "Mono Department",
    "shortCode": "MO"
  }, {
    "name": "Ouémé",
    "shortCode": "OU"
  }, {
    "name": "Plateau",
    "shortCode": "PL"
  }, {
    "name": "Zou",
    "shortCode": "ZO"
  }]
}, {
  "countryName": "Bermuda",
  "countryShortCode": "BM",
  "regions": [{
    "name": "City of Hamilton",
    "shortCode": "03"
  }, {
    "name": "Devonshire Parish",
    "shortCode": "01"
  }, {
    "name": "Hamilton Parish",
    "shortCode": "02"
  }, {
    "name": "Paget Parish",
    "shortCode": "04"
  }, {
    "name": "Pembroke Parish",
    "shortCode": "05"
  }, {
    "name": "Sandys Parish",
    "shortCode": "08"
  }, {
    "name": "Smith's Parish",
    "shortCode": "09"
  }, {
    "name": "Southampton Parish",
    "shortCode": "10"
  }, {
    "name": "St. George's Parish",
    "shortCode": "07"
  }, {
    "name": "Town of St. George",
    "shortCode": "06"
  }, {
    "name": "Warwick Parish",
    "shortCode": "11"
  }]
}, {
  "countryName": "Bhutan",
  "countryShortCode": "BT",
  "regions": [{
    "name": "Bumthang",
    "shortCode": "33"
  }, {
    "name": "Chhukha",
    "shortCode": "12"
  }, {
    "name": "Dagana",
    "shortCode": "22"
  }, {
    "name": "Gasa",
    "shortCode": "GA"
  }, {
    "name": "Haa",
    "shortCode": "13"
  }, {
    "name": "Lhuntse",
    "shortCode": "44"
  }, {
    "name": "Mongar",
    "shortCode": "42"
  }, {
    "name": "Paro",
    "shortCode": "11"
  }, {
    "name": "Pemagatshel",
    "shortCode": "43"
  }, {
    "name": "Punakha",
    "shortCode": "23"
  }, {
    "name": "Samdrup Jongkhar",
    "shortCode": "45"
  }, {
    "name": "Samtse",
    "shortCode": "14"
  }, {
    "name": "Sarpang",
    "shortCode": "31"
  }, {
    "name": "Thimphu",
    "shortCode": "15"
  }, {
    "name": "Trashigang",
    "shortCode": "41"
  }, {
    "name": "Trashiyangtse",
    "shortCode": "TY"
  }, {
    "name": "Trongsa",
    "shortCode": "32"
  }, {
    "name": "Tsirang",
    "shortCode": "21"
  }, {
    "name": "Wangdue Phodrang",
    "shortCode": "24"
  }, {
    "name": "Zhemgang",
    "shortCode": "34"
  }]
}, {
  "countryName": "Bolivia",
  "countryShortCode": "BO",
  "regions": [{
    "name": "Beni",
    "shortCode": "B"
  }, {
    "name": "Chuquisaca",
    "shortCode": "H"
  }, {
    "name": "Cochabamba",
    "shortCode": "C"
  }, {
    "name": "La Paz",
    "shortCode": "L"
  }, {
    "name": "Oruro",
    "shortCode": "O"
  }, {
    "name": "Pando",
    "shortCode": "N"
  }, {
    "name": "Potosí",
    "shortCode": "P"
  }, {
    "name": "Santa Cruz",
    "shortCode": "S"
  }, {
    "name": "Tarija",
    "shortCode": "T"
  }]
}, {
  "countryName": "Bonaire, Sint Eustatius and Saba",
  "countryShortCode": "BQ",
  "regions": [{
    "name": "Bonaire",
    "shortCode": "BO"
  }, {
    "name": "Saba Isand",
    "shortCode": "SA"
  }, {
    "name": "Sint Eustatius",
    "shortCode": "SE"
  }]
}, {
  "countryName": "Bosnia and Herzegovina",
  "countryShortCode": "BA",
  "regions": [{
    "name": "Brčko Distrikt",
    "shortCode": "BRC"
  }, {
    "name": "Federacija Bosne i Hercegovine",
    "shortCode": "BIH"
  }, {
    "name": "Republika Srpska",
    "shortCode": "SRP"
  }]
}, {
  "countryName": "Botswana",
  "countryShortCode": "BW",
  "regions": [{
    "name": "Central",
    "shortCode": "CE"
  }, {
    "name": "Ghanzi",
    "shortCode": "GH"
  }, {
    "name": "Kgalagadi",
    "shortCode": "KG"
  }, {
    "name": "Kgatleng",
    "shortCode": "KL"
  }, {
    "name": "Kweneng",
    "shortCode": "KW"
  }, {
    "name": "North West",
    "shortCode": "NW"
  }, {
    "name": "North-East",
    "shortCode": "NE"
  }, {
    "name": "South East",
    "shortCode": "SE"
  }, {
    "name": "Southern",
    "shortCode": "SO"
  }]
}, {
  "countryName": "Bouvet Island",
  "countryShortCode": "BV",
  "regions": [{
    "name": "Bouvet Island",
    "shortCode": "BV"
  }]
}, {
  "countryName": "Brazil",
  "countryShortCode": "BR",
  "regions": [{
    "name": "Acre",
    "shortCode": "AC"
  }, {
    "name": "Alagoas",
    "shortCode": "AL"
  }, {
    "name": "Amapá",
    "shortCode": "AP"
  }, {
    "name": "Amazonas",
    "shortCode": "AM"
  }, {
    "name": "Bahia",
    "shortCode": "BA"
  }, {
    "name": "Ceará",
    "shortCode": "CE"
  }, {
    "name": "Distrito Federal",
    "shortCode": "DF"
  }, {
    "name": "Espírito Santo",
    "shortCode": "ES"
  }, {
    "name": "Goiás",
    "shortCode": "GO"
  }, {
    "name": "Maranhão",
    "shortCode": "MA"
  }, {
    "name": "Mato Grosso",
    "shortCode": "MT"
  }, {
    "name": "Mato Grosso do Sul",
    "shortCode": "MS"
  }, {
    "name": "Minas Gerais",
    "shortCode": "MG"
  }, {
    "name": "Pará",
    "shortCode": "PA"
  }, {
    "name": "Paraíba",
    "shortCode": "PB"
  }, {
    "name": "Paraná",
    "shortCode": "PR"
  }, {
    "name": "Pernambuco",
    "shortCode": "PE"
  }, {
    "name": "Piauí",
    "shortCode": "PI"
  }, {
    "name": "Rio de Janeiro",
    "shortCode": "RJ"
  }, {
    "name": "Rio Grande do Norte",
    "shortCode": "RN"
  }, {
    "name": "Rio Grande do Sul",
    "shortCode": "RS"
  }, {
    "name": "Rondônia",
    "shortCode": "RO"
  }, {
    "name": "Roraima",
    "shortCode": "RR"
  }, {
    "name": "Santa Catarina",
    "shortCode": "SC"
  }, {
    "name": "São Paulo",
    "shortCode": "SP"
  }, {
    "name": "Sergipe",
    "shortCode": "SE"
  }, {
    "name": "Tocantins",
    "shortCode": "TO"
  }]
}, {
  "countryName": "British Indian Ocean Territory",
  "countryShortCode": "IO",
  "regions": [{
    "name": "British Indian Ocean Territory",
    "shortCode": "IO"
  }]
}, {
  "countryName": "Brunei Darussalam",
  "countryShortCode": "BN",
  "regions": [{
    "name": "Belait",
    "shortCode": "BE"
  }, {
    "name": "Brunei Muara",
    "shortCode": "BM"
  }, {
    "name": "Temburong",
    "shortCode": "TE"
  }, {
    "name": "Tutong",
    "shortCode": "TU"
  }]
}, {
  "countryName": "Bulgaria",
  "countryShortCode": "BG",
  "regions": [{
    "name": "Blagoevgrad",
    "shortCode": "01"
  }, {
    "name": "Burgas",
    "shortCode": "02"
  }, {
    "name": "Dobrich",
    "shortCode": "08"
  }, {
    "name": "Gabrovo",
    "shortCode": "07"
  }, {
    "name": "Jambol",
    "shortCode": "28"
  }, {
    "name": "Khaskovo",
    "shortCode": "26"
  }, {
    "name": "Kjustendil",
    "shortCode": "10"
  }, {
    "name": "Kurdzhali",
    "shortCode": "09"
  }, {
    "name": "Lovech",
    "shortCode": "11"
  }, {
    "name": "Montana",
    "shortCode": "12"
  }, {
    "name": "Pazardzhik",
    "shortCode": "13"
  }, {
    "name": "Pernik",
    "shortCode": "14"
  }, {
    "name": "Pleven",
    "shortCode": "15"
  }, {
    "name": "Plovdiv",
    "shortCode": "16"
  }, {
    "name": "Razgrad",
    "shortCode": "17"
  }, {
    "name": "Ruse",
    "shortCode": "18"
  }, {
    "name": "Shumen",
    "shortCode": "27"
  }, {
    "name": "Silistra",
    "shortCode": "19"
  }, {
    "name": "Sliven",
    "shortCode": "20"
  }, {
    "name": "Smoljan",
    "shortCode": "21"
  }, {
    "name": "Sofija",
    "shortCode": "23"
  }, {
    "name": "Sofija-Grad",
    "shortCode": "22"
  }, {
    "name": "Stara Zagora",
    "shortCode": "24"
  }, {
    "name": "Turgovishhe",
    "shortCode": "25"
  }, {
    "name": "Varna",
    "shortCode": "03"
  }, {
    "name": "Veliko Turnovo",
    "shortCode": "04"
  }, {
    "name": "Vidin",
    "shortCode": "05"
  }, {
    "name": "Vraca",
    "shortCode": "06"
  }]
}, {
  "countryName": "Burkina Faso",
  "countryShortCode": "BF",
  "regions": [{
    "name": "Balé",
    "shortCode": "BAL"
  }, {
    "name": "Bam/Lake Bam",
    "shortCode": "BAM"
  }, {
    "name": "Banwa Province",
    "shortCode": "BAN"
  }, {
    "name": "Bazèga",
    "shortCode": "BAZ"
  }, {
    "name": "Bougouriba",
    "shortCode": "BGR"
  }, {
    "name": "Boulgou Province",
    "shortCode": "BLG"
  }, {
    "name": "Boulkiemdé",
    "shortCode": "BLK"
  }, {
    "name": "Comoé/Komoe",
    "shortCode": "COM"
  }, {
    "name": "Ganzourgou Province",
    "shortCode": "GAN"
  }, {
    "name": "Gnagna",
    "shortCode": "GNA"
  }, {
    "name": "Gourma Province",
    "shortCode": "GOU"
  }, {
    "name": "Houet",
    "shortCode": "HOU"
  }, {
    "name": "Ioba",
    "shortCode": "IOB"
  }, {
    "name": "Kadiogo",
    "shortCode": "KAD"
  }, {
    "name": "Kénédougou",
    "shortCode": "KEN"
  }, {
    "name": "Komondjari",
    "shortCode": "KMD"
  }, {
    "name": "Kompienga",
    "shortCode": "KMP"
  }, {
    "name": "Kossi Province",
    "shortCode": "KOS"
  }, {
    "name": "Koulpélogo",
    "shortCode": "KOP"
  }, {
    "name": "Kouritenga",
    "shortCode": "KOT"
  }, {
    "name": "Kourwéogo",
    "shortCode": "KOW"
  }, {
    "name": "Léraba",
    "shortCode": "LER"
  }, {
    "name": "Loroum",
    "shortCode": "LOR"
  }, {
    "name": "Mouhoun",
    "shortCode": "MOU"
  }, {
    "name": "Namentenga",
    "shortCode": "NAM"
  }, {
    "name": "Naouri/Nahouri",
    "shortCode": "NAO"
  }, {
    "name": "Nayala",
    "shortCode": "NAY"
  }, {
    "name": "Noumbiel",
    "shortCode": "NOU"
  }, {
    "name": "Oubritenga",
    "shortCode": "OUB"
  }, {
    "name": "Oudalan",
    "shortCode": "OUD"
  }, {
    "name": "Passoré",
    "shortCode": "PAS"
  }, {
    "name": "Poni",
    "shortCode": "PON"
  }, {
    "name": "Sanguié",
    "shortCode": "SNG"
  }, {
    "name": "Sanmatenga",
    "shortCode": "SMT"
  }, {
    "name": "Séno",
    "shortCode": "SEN"
  }, {
    "name": "Sissili",
    "shortCode": "SIS"
  }, {
    "name": "Soum",
    "shortCode": "SOM"
  }, {
    "name": "Sourou",
    "shortCode": "SOR"
  }, {
    "name": "Tapoa",
    "shortCode": "TAP"
  }, {
    "name": "Tui/Tuy",
    "shortCode": "TUI"
  }, {
    "name": "Yagha",
    "shortCode": "YAG"
  }, {
    "name": "Yatenga",
    "shortCode": "YAT"
  }, {
    "name": "Ziro",
    "shortCode": "ZIR"
  }, {
    "name": "Zondoma",
    "shortCode": "ZON"
  }, {
    "name": "Zoundwéogo",
    "shortCode": "ZOU"
  }]
}, {
  "countryName": "Burundi",
  "countryShortCode": "BI",
  "regions": [{
    "name": "Bubanza",
    "shortCode": "BB"
  }, {
    "name": "Bujumbura Mairie",
    "shortCode": "BM"
  }, {
    "name": "Bujumbura Rural",
    "shortCode": "BL"
  }, {
    "name": "Bururi",
    "shortCode": "BR"
  }, {
    "name": "Cankuzo",
    "shortCode": "CA"
  }, {
    "name": "Cibitoke",
    "shortCode": "CI"
  }, {
    "name": "Gitega",
    "shortCode": "GI"
  }, {
    "name": "Karuzi",
    "shortCode": "KR"
  }, {
    "name": "Kayanza",
    "shortCode": "KY"
  }, {
    "name": "Kirundo",
    "shortCode": "KI"
  }, {
    "name": "Makamba",
    "shortCode": "MA"
  }, {
    "name": "Muramvya",
    "shortCode": "MU"
  }, {
    "name": "Muyinga",
    "shortCode": "MY"
  }, {
    "name": "Mwaro",
    "shortCode": "MW"
  }, {
    "name": "Ngozi",
    "shortCode": "NG"
  }, {
    "name": "Rutana",
    "shortCode": "RT"
  }, {
    "name": "Ruyigi",
    "shortCode": "RY"
  }]
}, {
  "countryName": "Cambodia",
  "countryShortCode": "KH",
  "regions": [{
    "name": "Baat Dambang",
    "shortCode": "2"
  }, {
    "name": "Banteay Mean Chey",
    "shortCode": "1"
  }, {
    "name": "Kampong Chaam",
    "shortCode": "3"
  }, {
    "name": "Kampong Chhnang",
    "shortCode": "4"
  }, {
    "name": "Kampong Spueu",
    "shortCode": "5"
  }, {
    "name": "Kampong Thum",
    "shortCode": "6"
  }, {
    "name": "Kampot",
    "shortCode": "7"
  }, {
    "name": "Kandaal",
    "shortCode": "8"
  }, {
    "name": "Kaoh Kong",
    "shortCode": "9"
  }, {
    "name": "Kracheh",
    "shortCode": "10"
  }, {
    "name": "Krong Kaeb",
    "shortCode": "23"
  }, {
    "name": "Krong Pailin",
    "shortCode": "24"
  }, {
    "name": "Krong Preah Sihanouk",
    "shortCode": "18"
  }, {
    "name": "Mondol Kiri",
    "shortCode": "11"
  }, {
    "name": "Otdar Mean Chey",
    "shortCode": "22"
  }, {
    "name": "Phnom Penh",
    "shortCode": "12"
  }, {
    "name": "Pousaat",
    "shortCode": "15"
  }, {
    "name": "Preah Vihear",
    "shortCode": "13"
  }, {
    "name": "Prey Veaeng",
    "shortCode": "14"
  }, {
    "name": "Rotanah Kiri",
    "shortCode": "16"
  }, {
    "name": "Siem Reab",
    "shortCode": "17"
  }, {
    "name": "Stueng Treng",
    "shortCode": "19"
  }, {
    "name": "Svaay Rieng",
    "shortCode": "20"
  }, {
    "name": "Taakaev",
    "shortCode": "21"
  }, {
    "name": "Tbong Khmum",
    "shortCode": "25"
  }]
}, {
  "countryName": "Cameroon",
  "countryShortCode": "CM",
  "regions": [{
    "name": "Adamaoua",
    "shortCode": "AD"
  }, {
    "name": "Centre",
    "shortCode": "CE"
  }, {
    "name": "Est",
    "shortCode": "ES"
  }, {
    "name": "Extrême-Nord",
    "shortCode": "EN"
  }, {
    "name": "Littoral",
    "shortCode": "LT"
  }, {
    "name": "Nord",
    "shortCode": "NO"
  }, {
    "name": "Nord-Ouest",
    "shortCode": "NW"
  }, {
    "name": "Ouest",
    "shortCode": "OU"
  }, {
    "name": "Sud",
    "shortCode": "SU"
  }, {
    "name": "Sud-Ouest",
    "shortCode": "SW"
  }]
}, {
  "countryName": "Canada",
  "countryShortCode": "CA",
  "regions": [{
    "name": "Alberta",
    "shortCode": "AB"
  }, {
    "name": "British Columbia",
    "shortCode": "BC"
  }, {
    "name": "Manitoba",
    "shortCode": "MB"
  }, {
    "name": "New Brunswick",
    "shortCode": "NB"
  }, {
    "name": "Newfoundland and Labrador",
    "shortCode": "NL"
  }, {
    "name": "Northwest Territories",
    "shortCode": "NT"
  }, {
    "name": "Nova Scotia",
    "shortCode": "NS"
  }, {
    "name": "Nunavut",
    "shortCode": "NU"
  }, {
    "name": "Ontario",
    "shortCode": "ON"
  }, {
    "name": "Prince Edward Island",
    "shortCode": "PE"
  }, {
    "name": "Quebec",
    "shortCode": "QC"
  }, {
    "name": "Saskatchewan",
    "shortCode": "SK"
  }, {
    "name": "Yukon",
    "shortCode": "YT"
  }]
}, {
  "countryName": "Cape Verde",
  "countryShortCode": "CV",
  "regions": [{
    "name": "Boa Vista",
    "shortCode": "BV"
  }, {
    "name": "Brava",
    "shortCode": "BR"
  }, {
    "name": "Calheta de São Miguel",
    "shortCode": "CS"
  }, {
    "name": "Maio",
    "shortCode": "MA"
  }, {
    "name": "Mosteiros",
    "shortCode": "MO"
  }, {
    "name": "Paúl",
    "shortCode": "PA"
  }, {
    "name": "Porto Novo",
    "shortCode": "PN"
  }, {
    "name": "Praia",
    "shortCode": "PR"
  }, {
    "name": "Ribeira Brava",
    "shortCode": "RB"
  }, {
    "name": "Ribeira Grande",
    "shortCode": "RG"
  }, {
    "name": "Sal",
    "shortCode": "SL"
  }, {
    "name": "Santa Catarina",
    "shortCode": "CA"
  }, {
    "name": "Santa Cruz",
    "shortCode": "CR"
  }, {
    "name": "São Domingos",
    "shortCode": "SD"
  }, {
    "name": "São Filipe",
    "shortCode": "SF"
  }, {
    "name": "São Nicolau",
    "shortCode": "SN"
  }, {
    "name": "São Vicente",
    "shortCode": "SV"
  }, {
    "name": "Tarrafal",
    "shortCode": "TA"
  }, {
    "name": "Tarrafal de São Nicolau",
    "shortCode": "TS"
  }]
}, {
  "countryName": "Cayman Islands",
  "countryShortCode": "KY",
  "regions": [{
    "name": "Creek"
  }, {
    "name": "Eastern"
  }, {
    "name": "Midland"
  }, {
    "name": "South Town"
  }, {
    "name": "Spot Bay"
  }, {
    "name": "Stake Bay"
  }, {
    "name": "West End"
  }, {
    "name": "Western"
  }]
}, {
  "countryName": "Central African Republic",
  "countryShortCode": "CF",
  "regions": [{
    "name": "Bamingui-Bangoran",
    "shortCode": "BB"
  }, {
    "name": "Bangui",
    "shortCode": "BGF"
  }, {
    "name": "Basse-Kotto",
    "shortCode": "BK"
  }, {
    "name": "Haute-Kotto",
    "shortCode": "HK"
  }, {
    "name": "Haut-Mbomou",
    "shortCode": "HM"
  }, {
    "name": "Kémo",
    "shortCode": "KG"
  }, {
    "name": "Lobaye",
    "shortCode": "LB"
  }, {
    "name": "Mambéré-Kadéï",
    "shortCode": "HS"
  }, {
    "name": "Mbomou",
    "shortCode": "MB"
  }, {
    "name": "Nana-Grebizi",
    "shortCode": "10"
  }, {
    "name": "Nana-Mambéré",
    "shortCode": "NM"
  }, {
    "name": "Ombella-M'Poko",
    "shortCode": "MP"
  }, {
    "name": "Ouaka",
    "shortCode": "UK"
  }, {
    "name": "Ouham",
    "shortCode": "AC"
  }, {
    "name": "Ouham Péndé",
    "shortCode": "OP"
  }, {
    "name": "Sangha-Mbaéré",
    "shortCode": "SE"
  }, {
    "name": "Vakaga",
    "shortCode": "VK"
  }]
}, {
  "countryName": "Chad",
  "countryShortCode": "TD",
  "regions": [{
    "name": "Bahr el Ghazal",
    "shortCode": "BG"
  }, {
    "name": "Batha",
    "shortCode": "BA"
  }, {
    "name": "Borkou",
    "shortCode": "BO"
  }, {
    "name": "Chari-Baguirmi",
    "shortCode": "CB"
  }, {
    "name": "Ennedi-Est",
    "shortCode": "EE"
  }, {
    "name": "Ennedi-Ouest",
    "shortCode": "EO"
  }, {
    "name": "Guéra",
    "shortCode": "GR"
  }, {
    "name": "Hadjer Lamis",
    "shortCode": "HL"
  }, {
    "name": "Kanem",
    "shortCode": "KA"
  }, {
    "name": "Lac",
    "shortCode": "LC"
  }, {
    "name": "Logone Occidental",
    "shortCode": "LO"
  }, {
    "name": "Logone Oriental",
    "shortCode": "LR"
  }, {
    "name": "Mondoul",
    "shortCode": "MA"
  }, {
    "name": "Mayo-Kébbi-Est",
    "shortCode": "ME"
  }, {
    "name": "Moyen-Chari",
    "shortCode": "MC"
  }, {
    "name": "Ouaddai",
    "shortCode": "OD"
  }, {
    "name": "Salamat",
    "shortCode": "SA"
  }, {
    "name": "Sila",
    "shortCode": "SI"
  }, {
    "name": "Tandjilé",
    "shortCode": "TA"
  }, {
    "name": "Tibesti",
    "shortCode": "TI"
  }, {
    "name": "Ville de Ndjamena",
    "shortCode": "ND"
  }, {
    "name": "Wadi Fira",
    "shortCode": "WF"
  }]
}, {
  "countryName": "Chile",
  "countryShortCode": "CL",
  "regions": [{
    "name": "Aisén del General Carlos Ibáñez del Campo",
    "shortCode": "AI"
  }, {
    "name": "Antofagasta",
    "shortCode": "AN"
  }, {
    "name": "Araucanía",
    "shortCode": "AR"
  }, {
    "name": "Arica y Parinacota",
    "shortCode": "AP"
  }, {
    "name": "Atacama",
    "shortCode": "AT"
  }, {
    "name": "Bío-Bío",
    "shortCode": "BI"
  }, {
    "name": "Coquimbo",
    "shortCode": "CO"
  }, {
    "name": "Libertador General Bernardo O'Higgins",
    "shortCode": "LI"
  }, {
    "name": "Los Lagos",
    "shortCode": "LL"
  }, {
    "name": "Los Ríos",
    "shortCode": "LR"
  }, {
    "name": "Magallanes y Antartica Chilena",
    "shortCode": "MA"
  }, {
    "name": "Marga-Marga",
    "shortCode": ""
  }, {
    "name": "Maule",
    "shortCode": "ML"
  }, {
    "name": "Ñuble",
    "shortCode": "NB"
  }, {
    "name": "Región Metropolitana de Santiago",
    "shortCode": "RM"
  }, {
    "name": "Tarapacá",
    "shortCode": "TA"
  }, {
    "name": "Valparaíso",
    "shortCode": "VS"
  }]
}, {
  "countryName": "China",
  "countryShortCode": "CN",
  "regions": [{
    "name": "Anhui",
    "shortCode": "34"
  }, {
    "name": "Beijing",
    "shortCode": "11"
  }, {
    "name": "Chongqing",
    "shortCode": "50"
  }, {
    "name": "Fujian",
    "shortCode": "35"
  }, {
    "name": "Gansu",
    "shortCode": "62"
  }, {
    "name": "Guangdong",
    "shortCode": "44"
  }, {
    "name": "Guangxi",
    "shortCode": "45"
  }, {
    "name": "Guizhou",
    "shortCode": "52"
  }, {
    "name": "Hainan",
    "shortCode": "46"
  }, {
    "name": "Hebei",
    "shortCode": "13"
  }, {
    "name": "Heilongjiang",
    "shortCode": "23"
  }, {
    "name": "Henan",
    "shortCode": "41"
  }, {
    "name": "Hong Kong",
    "shortCode": "91"
  }, {
    "name": "Hubei",
    "shortCode": "42"
  }, {
    "name": "Hunan",
    "shortCode": "43"
  }, {
    "name": "Inner Mongolia",
    "shortCode": "15"
  }, {
    "name": "Jiangsu",
    "shortCode": "32"
  }, {
    "name": "Jiangxi",
    "shortCode": "36"
  }, {
    "name": "Jilin",
    "shortCode": "22"
  }, {
    "name": "Liaoning",
    "shortCode": "21"
  }, {
    "name": "Macau",
    "shortCode": "92"
  }, {
    "name": "Ningxia",
    "shortCode": "64"
  }, {
    "name": "Qinghai",
    "shortCode": "63"
  }, {
    "name": "Shaanxi",
    "shortCode": "61"
  }, {
    "name": "Shandong",
    "shortCode": "37"
  }, {
    "name": "Shanghai",
    "shortCode": "31"
  }, {
    "name": "Shanxi",
    "shortCode": "14"
  }, {
    "name": "Sichuan",
    "shortCode": "51"
  }, {
    "name": "Tianjin",
    "shortCode": "12"
  }, {
    "name": "Tibet",
    "shortCode": "54"
  }, {
    "name": "Xinjiang",
    "shortCode": "65"
  }, {
    "name": "Yunnan",
    "shortCode": "53"
  }, {
    "name": "Zhejiang",
    "shortCode": "33"
  }]
}, {
  "countryName": "Christmas Island",
  "countryShortCode": "CX",
  "regions": [{
    "name": "Christmas Island",
    "shortCode": "CX"
  }]
}, {
  "countryName": "Cocos (Keeling) Islands",
  "countryShortCode": "CC",
  "regions": [{
    "name": "Direction Island",
    "shortCode": "DI"
  }, {
    "name": "Home Island",
    "shortCode": "HM"
  }, {
    "name": "Horsburgh Island",
    "shortCode": "HR"
  }, {
    "name": "North Keeling Island",
    "shortCode": "NK"
  }, {
    "name": "South Island",
    "shortCode": "SI"
  }, {
    "name": "West Island",
    "shortCode": "WI"
  }]
}, {
  "countryName": "Colombia",
  "countryShortCode": "CO",
  "regions": [{
    "name": "Amazonas",
    "shortCode": "AMA"
  }, {
    "name": "Antioquia",
    "shortCode": "ANT"
  }, {
    "name": "Arauca",
    "shortCode": "ARA"
  }, {
    "name": "Archipiélago de San Andrés",
    "shortCode": "SAP"
  }, {
    "name": "Atlántico",
    "shortCode": "ATL"
  }, {
    "name": "Bogotá D.C.",
    "shortCode": "DC"
  }, {
    "name": "Bolívar",
    "shortCode": "BOL"
  }, {
    "name": "Boyacá",
    "shortCode": "BOY"
  }, {
    "name": "Caldas",
    "shortCode": "CAL"
  }, {
    "name": "Caquetá",
    "shortCode": "CAQ"
  }, {
    "name": "Casanare",
    "shortCode": "CAS"
  }, {
    "name": "Cauca",
    "shortCode": "CAU"
  }, {
    "name": "Cesar",
    "shortCode": "CES"
  }, {
    "name": "Chocó",
    "shortCode": "CHO"
  }, {
    "name": "Córdoba",
    "shortCode": "COR"
  }, {
    "name": "Cundinamarca",
    "shortCode": "CUN"
  }, {
    "name": "Guainía",
    "shortCode": "GUA"
  }, {
    "name": "Guaviare",
    "shortCode": "GUV"
  }, {
    "name": "Huila",
    "shortCode": "HUI"
  }, {
    "name": "La Guajira",
    "shortCode": "LAG"
  }, {
    "name": "Magdalena",
    "shortCode": "MAG"
  }, {
    "name": "Meta",
    "shortCode": "MET"
  }, {
    "name": "Nariño",
    "shortCode": "NAR"
  }, {
    "name": "Norte de Santander",
    "shortCode": "NSA"
  }, {
    "name": "Putumayo",
    "shortCode": "PUT"
  }, {
    "name": "Quindío",
    "shortCode": "QUI"
  }, {
    "name": "Risaralda",
    "shortCode": "RIS"
  }, {
    "name": "Santander",
    "shortCode": "SAN"
  }, {
    "name": "Sucre",
    "shortCode": "SUC"
  }, {
    "name": "Tolima",
    "shortCode": "TOL"
  }, {
    "name": "Valle del Cauca",
    "shortCode": "VAC"
  }, {
    "name": "Vaupés",
    "shortCode": "VAU"
  }, {
    "name": "Vichada",
    "shortCode": "VID"
  }]
}, {
  "countryName": "Comoros",
  "countryShortCode": "KM",
  "regions": [{
    "name": "Andjazîdja",
    "shortCode": "G"
  }, {
    "name": "Andjouân",
    "shortCode": "A"
  }, {
    "name": "Moûhîlî",
    "shortCode": "M"
  }]
}, {
  "countryName": "Congo, Republic of the (Brazzaville)",
  "countryShortCode": "CG",
  "regions": [{
    "name": "Bouenza",
    "shortCode": "11"
  }, {
    "name": "Brazzaville",
    "shortCode": "BZV"
  }, {
    "name": "Cuvette",
    "shortCode": "8"
  }, {
    "name": "Cuvette-Ouest",
    "shortCode": "15"
  }, {
    "name": "Kouilou",
    "shortCode": "5"
  }, {
    "name": "Lékoumou",
    "shortCode": "2"
  }, {
    "name": "Likouala",
    "shortCode": "7"
  }, {
    "name": "Niari",
    "shortCode": "9"
  }, {
    "name": "Plateaux",
    "shortCode": "14"
  }, {
    "name": "Pointe-Noire",
    "shortCode": "16"
  }, {
    "name": "Pool",
    "shortCode": "12"
  }, {
    "name": "Sangha",
    "shortCode": "13"
  }]
}, {
  "countryName": "Congo, the Democratic Republic of the (Kinshasa)",
  "countryShortCode": "CD",
  "regions": [{
    "name": "Bandundu",
    "shortCode": "BN"
  }, {
    "name": "Bas-Congo",
    "shortCode": "BC"
  }, {
    "name": "Équateur",
    "shortCode": "EQ"
  }, {
    "name": "Kasaï-Occidental",
    "shortCode": "KE"
  }, {
    "name": "Kasaï-Oriental",
    "shortCode": "KW"
  }, {
    "name": "Katanga",
    "shortCode": "KA"
  }, {
    "name": "Kinshasa",
    "shortCode": "KN"
  }, {
    "name": "Maniema",
    "shortCode": "MA"
  }, {
    "name": "Nord-Kivu",
    "shortCode": "NK"
  }, {
    "name": "Orientale",
    "shortCode": "OR"
  }, {
    "name": "Sud-Kivu",
    "shortCode": "SK"
  }]
}, {
  "countryName": "Cook Islands",
  "countryShortCode": "CK",
  "regions": [{
    "name": "Aitutaki"
  }, {
    "name": "Atiu"
  }, {
    "name": "Avarua"
  }, {
    "name": "Mangaia"
  }, {
    "name": "Manihiki"
  }, {
    "name": "Ma'uke"
  }, {
    "name": "Mitiaro"
  }, {
    "name": "Nassau"
  }, {
    "name": "Palmerston"
  }, {
    "name": "Penrhyn"
  }, {
    "name": "Pukapuka"
  }, {
    "name": "Rakahanga"
  }]
}, {
  "countryName": "Costa Rica",
  "countryShortCode": "CR",
  "regions": [{
    "name": "Alajuela",
    "shortCode": "2"
  }, {
    "name": "Cartago",
    "shortCode": "3"
  }, {
    "name": "Guanacaste",
    "shortCode": "5"
  }, {
    "name": "Heredia",
    "shortCode": "4"
  }, {
    "name": "Limón",
    "shortCode": "7"
  }, {
    "name": "Puntarenas",
    "shortCode": "6"
  }, {
    "name": "San José",
    "shortCode": "1"
  }]
}, {
  "countryName": "Côte d'Ivoire, Republic of",
  "countryShortCode": "CI",
  "regions": [{
    "name": "Agnéby",
    "shortCode": "16"
  }, {
    "name": "Bafing",
    "shortCode": "17"
  }, {
    "name": "Bas-Sassandra",
    "shortCode": "09"
  }, {
    "name": "Denguélé",
    "shortCode": "10"
  }, {
    "name": "Dix-Huit Montagnes",
    "shortCode": "06"
  }, {
    "name": "Fromager",
    "shortCode": "18"
  }, {
    "name": "Haut-Sassandra",
    "shortCode": "02"
  }, {
    "name": "Lacs",
    "shortCode": "07"
  }, {
    "name": "Lagunes",
    "shortCode": "01"
  }, {
    "name": "Marahoué",
    "shortCode": "12"
  }, {
    "name": "Moyen-Cavally",
    "shortCode": "19"
  }, {
    "name": "Moyen-Comoé",
    "shortCode": "05"
  }, {
    "name": "N'zi-Comoé",
    "shortCode": "11"
  }, {
    "name": "Savanes",
    "shortCode": "03"
  }, {
    "name": "Sud-Bandama",
    "shortCode": "15"
  }, {
    "name": "Sud-Comoé",
    "shortCode": "13"
  }, {
    "name": "Vallée du Bandama",
    "shortCode": "04"
  }, {
    "name": "Worodougou",
    "shortCode": "14"
  }, {
    "name": "Zanzan",
    "shortCode": "08"
  }]
}, {
  "countryName": "Croatia",
  "countryShortCode": "HR",
  "regions": [{
    "name": "Bjelovarsko-Bilogorska Županija",
    "shortCode": "07"
  }, {
    "name": "Brodsko-Posavska Županija",
    "shortCode": "12"
  }, {
    "name": "Dubrovačko-Neretvanska Županija",
    "shortCode": "19"
  }, {
    "name": "Grad Zagreb",
    "shortCode": "21"
  }, {
    "name": "Istarska Županija",
    "shortCode": "18"
  }, {
    "name": "Karlovačka Županija",
    "shortCode": "04"
  }, {
    "name": "Koprivničko-Krizevačka Županija",
    "shortCode": "06"
  }, {
    "name": "Krapinsko-Zagorska Županija",
    "shortCode": "02"
  }, {
    "name": "Ličko-Senjska Županija",
    "shortCode": "09"
  }, {
    "name": "Međimurska Županija",
    "shortCode": "20"
  }, {
    "name": "Osječko-Baranjska Županija",
    "shortCode": "14"
  }, {
    "name": "Požeško-Slavonska Županija",
    "shortCode": "11"
  }, {
    "name": "Primorsko-Goranska Županija",
    "shortCode": "08"
  }, {
    "name": "Sisačko-Moslavačka Županija",
    "shortCode": "03"
  }, {
    "name": "Splitsko-Dalmatinska Županija",
    "shortCode": "17"
  }, {
    "name": "Sibensko-Kninska Županija",
    "shortCode": "15"
  }, {
    "name": "Varaždinska Županija",
    "shortCode": "05"
  }, {
    "name": "Virovitičko-Podravska Županija",
    "shortCode": "10"
  }, {
    "name": "Vukovarsko-Srijemska Županija",
    "shortCode": "16"
  }, {
    "name": "Zadarska Županija",
    "shortCode": "13"
  }, {
    "name": "Zagrebacka Zupanija",
    "shortCode": "01"
  }]
}, {
  "countryName": "Cuba",
  "countryShortCode": "CU",
  "regions": [{
    "name": "Artemisa",
    "shortCode": "15"
  }, {
    "name": "Camagüey",
    "shortCode": "09"
  }, {
    "name": "Ciego de Ávila",
    "shortCode": "08"
  }, {
    "name": "Cienfuegos",
    "shortCode": "06"
  }, {
    "name": "Granma",
    "shortCode": "12"
  }, {
    "name": "Guantánamo",
    "shortCode": "14"
  }, {
    "name": "Holguín",
    "shortCode": "11"
  }, {
    "name": "Isla de la Juventud",
    "shortCode": "99"
  }, {
    "name": "La Habana",
    "shortCode": "03"
  }, {
    "name": "Las Tunas",
    "shortCode": "10"
  }, {
    "name": "Matanzas",
    "shortCode": "04"
  }, {
    "name": "Mayabeque",
    "shortCode": "16"
  }, {
    "name": "Pinar del Río",
    "shortCode": "01"
  }, {
    "name": "Sancti Spíritus",
    "shortCode": "07"
  }, {
    "name": "Santiago de Cuba",
    "shortCode": "13"
  }, {
    "name": "Villa Clara",
    "shortCode": "05"
  }]
}, {
  "countryName": "Curaçao",
  "countryShortCode": "CW",
  "regions": [{
    "name": "Curaçao",
    "shortCode": "CW"
  }]
}, {
  "countryName": "Cyprus",
  "countryShortCode": "CY",
  "regions": [{
    "name": "Ammochostos",
    "shortCode": "04"
  }, {
    "name": "Keryneia",
    "shortCode": "05"
  }, {
    "name": "Larnaka",
    "shortCode": "03"
  }, {
    "name": "Lefkosia",
    "shortCode": "01"
  }, {
    "name": "Lemesos",
    "shortCode": "02"
  }, {
    "name": "Pafos",
    "shortCode": "05"
  }]
}, {
  "countryName": "Czech Republic",
  "countryShortCode": "CZ",
  "regions": [{
    "name": "Hlavní město Praha",
    "shortCode": "PR"
  }, {
    "name": "Jihočeský kraj",
    "shortCode": "JC"
  }, {
    "name": "Jihomoravský kraj",
    "shortCode": "JM"
  }, {
    "name": "Karlovarský kraj",
    "shortCode": "KA"
  }, {
    "name": "Královéhradecký kraj",
    "shortCode": "KR"
  }, {
    "name": "Liberecký kraj",
    "shortCode": "LI"
  }, {
    "name": "Moravskoslezský kraj",
    "shortCode": "MO"
  }, {
    "name": "Olomoucký kraj",
    "shortCode": "OL"
  }, {
    "name": "Pardubický kraj",
    "shortCode": "PA"
  }, {
    "name": "Plzeňský kraj",
    "shortCode": "PL"
  }, {
    "name": "Středočeský kraj",
    "shortCode": "ST"
  }, {
    "name": "Ústecký kraj",
    "shortCode": "US"
  }, {
    "name": "Vysočina",
    "shortCode": "VY"
  }, {
    "name": "Zlínský kraj",
    "shortCode": "ZL"
  }]
}, {
  "countryName": "Denmark",
  "countryShortCode": "DK",
  "regions": [{
    "name": "Hovedstaden",
    "shortCode": "84"
  }, {
    "name": "Kujalleq",
    "shortCode": "GL-KU"
  }, {
    "name": "Midtjylland",
    "shortCode": "82"
  }, {
    "name": "Norderøerne",
    "shortCode": "FO-01"
  }, {
    "name": "Nordjylland",
    "shortCode": "81"
  }, {
    "name": "Østerø",
    "shortCode": "FO-06"
  }, {
    "name": "Qaasuitsup",
    "shortCode": "GL-QA"
  }, {
    "name": "Qeqqata",
    "shortCode": "GL-QE"
  }, {
    "name": "Sandø",
    "shortCode": "FO-02"
  }, {
    "name": "Sermersooq",
    "shortCode": "GL-SM"
  }, {
    "name": "Sjælland",
    "shortCode": "85"
  }, {
    "name": "Strømø",
    "shortCode": "FO-03"
  }, {
    "name": "Suderø",
    "shortCode": "FO-04"
  }, {
    "name": "Syddanmark",
    "shortCode": "83"
  }, {
    "name": "Vågø",
    "shortCode": "FO-05"
  }]
}, {
  "countryName": "Djibouti",
  "countryShortCode": "DJ",
  "regions": [{
    "name": "Ali Sabieh",
    "shortCode": "AS"
  }, {
    "name": "Arta",
    "shortCode": "AR"
  }, {
    "name": "Dikhil",
    "shortCode": "DI"
  }, {
    "name": "Obock",
    "shortCode": "OB"
  }, {
    "name": "Tadjourah",
    "shortCode": "TA"
  }]
}, {
  "countryName": "Dominica",
  "countryShortCode": "DM",
  "regions": [{
    "name": "Saint Andrew Parish",
    "shortCode": "02"
  }, {
    "name": "Saint David Parish",
    "shortCode": "03"
  }, {
    "name": "Saint George Parish",
    "shortCode": "04"
  }, {
    "name": "Saint John Parish",
    "shortCode": "05"
  }, {
    "name": "Saint Joseph Parish",
    "shortCode": "06"
  }, {
    "name": "Saint Luke Parish",
    "shortCode": "07"
  }, {
    "name": "Saint Mark Parish",
    "shortCode": "08"
  }, {
    "name": "Saint Patrick Parish",
    "shortCode": "09"
  }, {
    "name": "Saint Paul Parish",
    "shortCode": "10"
  }, {
    "name": "Saint Peter Parish",
    "shortCode": "11"
  }]
}, {
  "countryName": "Dominican Republic",
  "countryShortCode": "DO",
  "regions": [{
    "name": "Cibao Central",
    "shortCode": "02"
  }, {
    "name": "Del Valle",
    "shortCode": "37"
  }, {
    "name": "Distrito Nacional",
    "shortCode": "01"
  }, {
    "name": "Enriquillo",
    "shortCode": "38"
  }, {
    "name": "Norcentral",
    "shortCode": "04"
  }, {
    "name": "Nordeste",
    "shortCode": "34"
  }, {
    "name": "Noroeste",
    "shortCode": "34"
  }, {
    "name": "Norte",
    "shortCode": "35"
  }, {
    "name": "Valdesia",
    "shortCode": "42"
  }]
}, {
  "countryName": "Ecuador",
  "countryShortCode": "EC",
  "regions": [{
    "name": "Azuay",
    "shortCode": "A"
  }, {
    "name": "Bolívar",
    "shortCode": "B"
  }, {
    "name": "Cañar",
    "shortCode": "F"
  }, {
    "name": "Carchi",
    "shortCode": "C"
  }, {
    "name": "Chimborazo",
    "shortCode": "H"
  }, {
    "name": "Cotopaxi",
    "shortCode": "X"
  }, {
    "name": "El Oro",
    "shortCode": "O"
  }, {
    "name": "Esmeraldas",
    "shortCode": "E"
  }, {
    "name": "Galápagos",
    "shortCode": "W"
  }, {
    "name": "Guayas",
    "shortCode": "G"
  }, {
    "name": "Imbabura",
    "shortCode": "I"
  }, {
    "name": "Loja",
    "shortCode": "L"
  }, {
    "name": "Los Ríos",
    "shortCode": "R"
  }, {
    "name": "Manabí",
    "shortCode": "M"
  }, {
    "name": "Morona-Santiago",
    "shortCode": "S"
  }, {
    "name": "Napo",
    "shortCode": "N"
  }, {
    "name": "Orellana",
    "shortCode": "D"
  }, {
    "name": "Pastaza",
    "shortCode": "Y"
  }, {
    "name": "Pichincha",
    "shortCode": "P"
  }, {
    "name": "Santa Elena",
    "shortCode": "SE"
  }, {
    "name": "Santo Domingo de los Tsáchilas",
    "shortCode": "SD"
  }, {
    "name": "Sucumbíos",
    "shortCode": "U"
  }, {
    "name": "Tungurahua",
    "shortCode": "T"
  }, {
    "name": "Zamora-Chinchipe",
    "shortCode": "Z"
  }]
}, {
  "countryName": "Egypt",
  "countryShortCode": "EG",
  "regions": [{
    "name": "Alexandria",
    "shortCode": "ALX"
  }, {
    "name": "Aswan",
    "shortCode": "ASN"
  }, {
    "name": "Asyout",
    "shortCode": "AST"
  }, {
    "name": "Bani Sueif",
    "shortCode": "BNS"
  }, {
    "name": "Beheira",
    "shortCode": "BH"
  }, {
    "name": "Cairo",
    "shortCode": "C"
  }, {
    "name": "Daqahlia",
    "shortCode": "DK"
  }, {
    "name": "Dumiat",
    "shortCode": "DT"
  }, {
    "name": "El Bahr El Ahmar",
    "shortCode": "BA"
  }, {
    "name": "El Ismailia",
    "shortCode": "IS"
  }, {
    "name": "El Suez",
    "shortCode": "SUZ"
  }, {
    "name": "El Wadi El Gedeed",
    "shortCode": "WAD"
  }, {
    "name": "Fayoum",
    "shortCode": "FYM"
  }, {
    "name": "Gharbia",
    "shortCode": "GH"
  }, {
    "name": "Giza",
    "shortCode": "SUZ"
  }, {
    "name": "Helwan",
    "shortCode": "HU"
  }, {
    "name": "Kafr El Sheikh",
    "shortCode": "KFS"
  }, {
    "name": "Luxor",
    "shortCode": "LX"
  }, {
    "name": "Matrouh",
    "shortCode": "MT"
  }, {
    "name": "Menia",
    "shortCode": "MN"
  }, {
    "name": "Menofia",
    "shortCode": "MNF"
  }, {
    "name": "North Sinai",
    "shortCode": "SIN"
  }, {
    "name": "Port Said",
    "shortCode": "PTS"
  }, {
    "name": "Qalubia",
    "shortCode": "KB"
  }, {
    "name": "Qena",
    "shortCode": "KN"
  }, {
    "name": "Sharqia",
    "shortCode": "SHR"
  }, {
    "name": "Sixth of October",
    "shortCode": "SU"
  }, {
    "name": "Sohag",
    "shortCode": "SHG"
  }, {
    "name": "South Sinai",
    "shortCode": "JS"
  }]
}, {
  "countryName": "El Salvador",
  "countryShortCode": "SV",
  "regions": [{
    "name": "Ahuachapán",
    "shortCode": "AH"
  }, {
    "name": "Cabañas",
    "shortCode": "CA"
  }, {
    "name": "Cuscatlán",
    "shortCode": "CU"
  }, {
    "name": "Chalatenango",
    "shortCode": "CH"
  }, {
    "name": "La Libertad",
    "shortCode": "LI"
  }, {
    "name": "La Paz",
    "shortCode": "PA"
  }, {
    "name": "La Unión",
    "shortCode": "UN"
  }, {
    "name": "Morazán",
    "shortCode": "MO"
  }, {
    "name": "San Miguel",
    "shortCode": "SM"
  }, {
    "name": "San Salvador",
    "shortCode": "SS"
  }, {
    "name": "Santa Ana",
    "shortCode": "SA"
  }, {
    "name": "San Vicente",
    "shortCode": "SV"
  }, {
    "name": "Sonsonate",
    "shortCode": "SO"
  }, {
    "name": "Usulután",
    "shortCode": "US"
  }]
}, {
  "countryName": "Equatorial Guinea",
  "countryShortCode": "GQ",
  "regions": [{
    "name": "Annobón",
    "shortCode": "AN"
  }, {
    "name": "Bioko Norte",
    "shortCode": "BN"
  }, {
    "name": "Bioko Sur",
    "shortCode": "BS"
  }, {
    "name": "Centro Sur",
    "shortCode": "CS"
  }, {
    "name": "Kié-Ntem",
    "shortCode": "KN"
  }, {
    "name": "Litoral",
    "shortCode": "LI"
  }, {
    "name": "Wele-Nzas",
    "shortCode": "WN"
  }]
}, {
  "countryName": "Eritrea",
  "countryShortCode": "ER",
  "regions": [{
    "name": "Anseba",
    "shortCode": "AN"
  }, {
    "name": "Debub",
    "shortCode": "DU"
  }, {
    "name": "Debub-Keih-Bahri",
    "shortCode": "DK"
  }, {
    "name": "Gash-Barka",
    "shortCode": "GB"
  }, {
    "name": "Maekel",
    "shortCode": "MA"
  }, {
    "name": "Semien-Keih-Bahri",
    "shortCode": "SK"
  }]
}, {
  "countryName": "Estonia",
  "countryShortCode": "EE",
  "regions": [{
    "name": "Harjumaa (Tallinn)",
    "shortCode": "37"
  }, {
    "name": "Hiiumaa (Kardla)",
    "shortCode": "39"
  }, {
    "name": "Ida-Virumaa (Johvi)",
    "shortCode": "44"
  }, {
    "name": "Järvamaa (Paide)",
    "shortCode": "41"
  }, {
    "name": "Jõgevamaa (Jogeva)",
    "shortCode": "49"
  }, {
    "name": "Läänemaa",
    "shortCode": "57"
  }, {
    "name": "Lääne-Virumaa (Rakvere)",
    "shortCode": "59"
  }, {
    "name": "Pärnumaa (Parnu)",
    "shortCode": "67"
  }, {
    "name": "Põlvamaa (Polva)",
    "shortCode": "65"
  }, {
    "name": "Raplamaa (Rapla)",
    "shortCode": "70"
  }, {
    "name": "Saaremaa (Kuessaare)",
    "shortCode": "74"
  }, {
    "name": "Tartumaa (Tartu)",
    "shortCode": "78"
  }, {
    "name": "Valgamaa (Valga)",
    "shortCode": "82"
  }, {
    "name": "Viljandimaa (Viljandi)",
    "shortCode": "84"
  }, {
    "name": "Võrumaa (Voru)",
    "shortCode": "86"
  }]
}, {
  "countryName": "Ethiopia",
  "countryShortCode": "ET",
  "regions": [{
    "name": "Addis Ababa",
    "shortCode": "AA"
  }, {
    "name": "Afar",
    "shortCode": "AF"
  }, {
    "name": "Amhara",
    "shortCode": "AM"
  }, {
    "name": "Benshangul-Gumaz",
    "shortCode": "BE"
  }, {
    "name": "Dire Dawa",
    "shortCode": "DD"
  }, {
    "name": "Gambela",
    "shortCode": "GA"
  }, {
    "name": "Harari",
    "shortCode": "HA"
  }, {
    "name": "Oromia",
    "shortCode": "OR"
  }, {
    "name": "Somali",
    "shortCode": "SO"
  }, {
    "name": "Southern Nations Nationalities and People's Region",
    "shortCode": "SN"
  }, {
    "name": "Tigray",
    "shortCode": "TI"
  }]
}, {
  "countryName": "Falkland Islands (Islas Malvinas)",
  "countryShortCode": "FK",
  "regions": [{
    "name": "Falkland Islands (Islas Malvinas)"
  }]
}, {
  "countryName": "Faroe Islands",
  "countryShortCode": "FO",
  "regions": [{
    "name": "Bordoy"
  }, {
    "name": "Eysturoy"
  }, {
    "name": "Mykines"
  }, {
    "name": "Sandoy"
  }, {
    "name": "Skuvoy"
  }, {
    "name": "Streymoy"
  }, {
    "name": "Suduroy"
  }, {
    "name": "Tvoroyri"
  }, {
    "name": "Vagar"
  }]
}, {
  "countryName": "Fiji",
  "countryShortCode": "FJ",
  "regions": [{
    "name": "Ba",
    "shortCode": "01"
  }, {
    "name": "Bua",
    "shortCode": "01"
  }, {
    "name": "Cakaudrove",
    "shortCode": "03"
  }, {
    "name": "Kadavu",
    "shortCode": "04"
  }, {
    "name": "Lau",
    "shortCode": "05"
  }, {
    "name": "Lomaiviti",
    "shortCode": "06"
  }, {
    "name": "Macuata",
    "shortCode": "07"
  }, {
    "name": "Nadroga and Navosa",
    "shortCode": "08"
  }, {
    "name": "Naitasiri",
    "shortCode": "09"
  }, {
    "name": "Namosi",
    "shortCode": "10"
  }, {
    "name": "Ra",
    "shortCode": "011"
  }, {
    "name": "Rewa",
    "shortCode": "12"
  }, {
    "name": "Rotuma",
    "shortCode": "R"
  }, {
    "name": "Serua",
    "shortCode": "12"
  }, {
    "name": "Tailevu",
    "shortCode": "14"
  }]
}, {
  "countryName": "Finland",
  "countryShortCode": "FI",
  "regions": [{
    "name": "Ahvenanmaan lääni",
    "shortCode": "AL"
  }, {
    "name": "Etelä-Suomen lääni",
    "shortCode": "ES"
  }, {
    "name": "Itä-Suomen lääni",
    "shortCode": "IS"
  }, {
    "name": "Länsi-Suomen lääni",
    "shortCode": "LS"
  }, {
    "name": "Lapin lääni",
    "shortCode": "LL"
  }, {
    "name": "Oulun lääni",
    "shortCode": "OL"
  }]
}, {
  "countryName": "France",
  "countryShortCode": "FR",
  "regions": [{
    "name": "Auvergne-Rhône-Alpes",
    "shortCode": "ARA"
  }, {
    "name": "Bourgogne-Franche-Comté",
    "shortCode": "BFC"
  }, {
    "name": "Bretagne",
    "shortCode": "BRE"
  }, {
    "name": "Centre-Val de Loire",
    "shortCode": "CVL"
  }, {
    "name": "Corse",
    "shortCode": "COR"
  }, {
    "name": "Grand Est",
    "shortCode": "GES"
  }, {
    "name": "Hauts-de-France",
    "shortCode": "HDF"
  }, {
    "name": "Île-de-France",
    "shortCode": "IDF"
  }, {
    "name": "Normandie",
    "shortCode": "NOR"
  }, {
    "name": "Nouvelle-Aquitaine",
    "shortCode": "NAQ"
  }, {
    "name": "Occitanie",
    "shortCode": "OCC"
  }, {
    "name": "Pays de la Loire",
    "shortCode": "PDL"
  }, {
    "name": "Provence-Alpes-Cote d'Azur",
    "shortCode": "PAC"
  }, {
    "name": "Clipperton",
    "shortCode": "CP"
  }, {
    "name": "Guadeloupe",
    "shortCode": "GP"
  }, {
    "name": "Guyane",
    "shortCode": "GF"
  }, {
    "name": "Martinique",
    "shortCode": "MQ"
  }, {
    "name": "Mayotte",
    "shortCode": "YT"
  }, {
    "name": "Novelle-Calédonie",
    "shortCode": "NC"
  }, {
    "name": "Polynésie",
    "shortCode": "PF"
  }, {
    "name": "Saint-Pierre-et-Miquelon",
    "shortCode": "PM"
  }, {
    "name": "Saint Barthélemy",
    "shortCode": "BL"
  }, {
    "name": "Saint Martin",
    "shortCode": "MF"
  }, {
    "name": "Réunion",
    "shortCode": "RE"
  }, {
    "name": "Terres Australes Françaises",
    "shortCode": "TF"
  }, {
    "name": "Wallis-et-Futuna",
    "shortCode": "WF"
  }]
}, {
  "countryName": "French Guiana",
  "countryShortCode": "GF",
  "regions": [{
    "name": "French Guiana"
  }]
}, {
  "countryName": "French Polynesia",
  "countryShortCode": "PF",
  "regions": [{
    "name": "Archipel des Marquises"
  }, {
    "name": "Archipel des Tuamotu"
  }, {
    "name": "Archipel des Tubuai"
  }, {
    "name": "Iles du Vent"
  }, {
    "name": "Iles Sous-le-Vent"
  }]
}, {
  "countryName": "French Southern and Antarctic Lands",
  "countryShortCode": "TF",
  "regions": [{
    "name": "Adelie Land"
  }, {
    "name": "Ile Crozet"
  }, {
    "name": "Iles Kerguelen"
  }, {
    "name": "Iles Saint-Paul et Amsterdam"
  }]
}, {
  "countryName": "Gabon",
  "countryShortCode": "GA",
  "regions": [{
    "name": "Estuaire",
    "shortCode": "1"
  }, {
    "name": "Haut-Ogooué",
    "shortCode": "2"
  }, {
    "name": "Moyen-Ogooué",
    "shortCode": "3"
  }, {
    "name": "Ngounié",
    "shortCode": "4"
  }, {
    "name": "Nyanga",
    "shortCode": "5"
  }, {
    "name": "Ogooué-Ivindo",
    "shortCode": "6"
  }, {
    "name": "Ogooué-Lolo",
    "shortCode": "7"
  }, {
    "name": "Ogooué-Maritime",
    "shortCode": "8"
  }, {
    "name": "Woleu-Ntem",
    "shortCode": "9"
  }]
}, {
  "countryName": "Gambia, The",
  "countryShortCode": "GM",
  "regions": [{
    "name": "Banjul",
    "shortCode": "B"
  }, {
    "name": "Central River",
    "shortCode": "M"
  }, {
    "name": "Lower River",
    "shortCode": "L"
  }, {
    "name": "North Bank",
    "shortCode": "N"
  }, {
    "name": "Upper River",
    "shortCode": "U"
  }, {
    "name": "Western",
    "shortCode": "W"
  }]
}, {
  "countryName": "Georgia",
  "countryShortCode": "GE",
  "regions": [{
    "name": "Abkhazia (Sokhumi)",
    "shortCode": "AB"
  }, {
    "name": "Ajaria (Bat'umi)",
    "shortCode": "AJ"
  }, {
    "name": "Guria",
    "shortCode": "GU"
  }, {
    "name": "Imereti",
    "shortCode": "IM"
  }, {
    "name": "K'akheti",
    "shortCode": "KA"
  }, {
    "name": "Kvemo Kartli",
    "shortCode": "KK"
  }, {
    "name": "Mtshkheta-Mtianeti",
    "shortCode": "MM"
  }, {
    "name": "Rach'a-Lexhkumi-KvemoSvaneti",
    "shortCode": "RL"
  }, {
    "name": "Samegrelo-Zemo Svaneti",
    "shortCode": "SZ"
  }, {
    "name": "Samtskhe-Javakheti",
    "shortCode": "SJ"
  }, {
    "name": "Shida Kartli",
    "shortCode": "SK"
  }, {
    "name": "Tbilisi",
    "shortCode": "TB"
  }]
}, {
  "countryName": "Germany",
  "countryShortCode": "DE",
  "regions": [{
    "name": "Baden-Württemberg",
    "shortCode": "BW"
  }, {
    "name": "Bayern",
    "shortCode": "BY"
  }, {
    "name": "Berlin",
    "shortCode": "BE"
  }, {
    "name": "Brandenburg",
    "shortCode": "BB"
  }, {
    "name": "Bremen",
    "shortCode": "HB"
  }, {
    "name": "Hamburg",
    "shortCode": "HH"
  }, {
    "name": "Hessen",
    "shortCode": "HE"
  }, {
    "name": "Mecklenburg-Vorpommern",
    "shortCode": "MV"
  }, {
    "name": "Niedersachsen",
    "shortCode": "NI"
  }, {
    "name": "Nordrhein-Westfalen",
    "shortCode": "NW"
  }, {
    "name": "Rheinland-Pfalz",
    "shortCode": "RP"
  }, {
    "name": "Saarland",
    "shortCode": "SL"
  }, {
    "name": "Sachsen",
    "shortCode": "SN"
  }, {
    "name": "Sachsen-Anhalt",
    "shortCode": "ST"
  }, {
    "name": "Schleswig-Holstein",
    "shortCode": "SH"
  }, {
    "name": "Thüringen",
    "shortCode": "TH"
  }]
}, {
  "countryName": "Ghana",
  "countryShortCode": "GH",
  "regions": [{
    "name": "Ahafo"
  }, {
    "name": "Ashanti",
    "shortCode": "AH"
  }, {
    "name": "Bono"
  }, {
    "name": "Bono East"
  }, {
    "name": "Central",
    "shortCode": "CP"
  }, {
    "name": "Eastern",
    "shortCode": "EP"
  }, {
    "name": "Greater Accra",
    "shortCode": "AA"
  }, {
    "name": "Northern",
    "shortCode": "NP"
  }, {
    "name": "North East"
  }, {
    "name": "Oti"
  }, {
    "name": "Savannah"
  }, {
    "name": "Upper East",
    "shortCode": "UE"
  }, {
    "name": "Upper West",
    "shortCode": "UW"
  }, {
    "name": "Volta",
    "shortCode": "TV"
  }, {
    "name": "Western",
    "shortCode": "WP"
  }, {
    "name": "Western North"
  }]
}, {
  "countryName": "Gibraltar",
  "countryShortCode": "GI",
  "regions": [{
    "name": "Gibraltar"
  }]
}, {
  "countryName": "Greece",
  "countryShortCode": "GR",
  "regions": [{
    "name": "Anatolikí Makedonía kai Thráki",
    "shortCode": "A"
  }, {
    "name": "Attikḯ",
    "shortCode": "I"
  }, {
    "name": "Dytikí Elláda",
    "shortCode": "G"
  }, {
    "name": "Dytikí Makedonía",
    "shortCode": "C"
  }, {
    "name": "Ionía Nísia",
    "shortCode": "F"
  }, {
    "name": "Kentrikí Makedonía",
    "shortCode": "B"
  }, {
    "name": "Krítí",
    "shortCode": "M"
  }, {
    "name": "Notío Aigaío",
    "shortCode": "L"
  }, {
    "name": "Peloponnísos",
    "shortCode": "J"
  }, {
    "name": "Stereá Elláda",
    "shortCode": "H"
  }, {
    "name": "Thessalía",
    "shortCode": "E"
  }, {
    "name": "Voreío Aigaío",
    "shortCode": "K"
  }, {
    "name": "Ípeiros",
    "shortCode": "D"
  }, {
    "name": "Ágion Óros",
    "shortCode": "69"
  }]
}, {
  "countryName": "Greenland",
  "countryShortCode": "GL",
  "regions": [{
    "name": "Kommune Kujalleq",
    "shortCode": "KU"
  }, {
    "name": "Kommuneqarfik Sermersooq",
    "shortCode": "SM"
  }, {
    "name": "Qaasuitsup Kommunia",
    "shortCode": "QA"
  }, {
    "name": "Qeqqata Kommunia",
    "shortCode": "QE"
  }]
}, {
  "countryName": "Grenada",
  "countryShortCode": "GD",
  "regions": [{
    "name": "Saint Andrew",
    "shortCode": "01"
  }, {
    "name": "Saint David",
    "shortCode": "02"
  }, {
    "name": "Saint George",
    "shortCode": "03"
  }, {
    "name": "Saint John",
    "shortCode": "04"
  }, {
    "name": "Saint Mark",
    "shortCode": "05"
  }, {
    "name": "Saint Patrick",
    "shortCode": "06"
  }, {
    "name": "Southern Grenadine Islands",
    "shortCode": "10"
  }]
}, {
  "countryName": "Guadeloupe",
  "countryShortCode": "GP",
  "regions": [{
    "name": "Guadeloupe"
  }]
}, {
  "countryName": "Guam",
  "countryShortCode": "GU",
  "regions": [{
    "name": "Guam"
  }]
}, {
  "countryName": "Guatemala",
  "countryShortCode": "GT",
  "regions": [{
    "name": "Alta Verapaz",
    "shortCode": "AV"
  }, {
    "name": "Baja Verapaz",
    "shortCode": "BV"
  }, {
    "name": "Chimaltenango",
    "shortCode": "CM"
  }, {
    "name": "Chiquimula",
    "shortCode": "CQ"
  }, {
    "name": "El Progreso",
    "shortCode": "PR"
  }, {
    "name": "Escuintla",
    "shortCode": "ES"
  }, {
    "name": "Guatemala",
    "shortCode": "GU"
  }, {
    "name": "Huehuetenango",
    "shortCode": "HU"
  }, {
    "name": "Izabal",
    "shortCode": "IZ"
  }, {
    "name": "Jalapa",
    "shortCode": "JA"
  }, {
    "name": "Jutiapa",
    "shortCode": "JU"
  }, {
    "name": "Petén",
    "shortCode": "PE"
  }, {
    "name": "Quetzaltenango",
    "shortCode": "QZ"
  }, {
    "name": "Quiché",
    "shortCode": "QC"
  }, {
    "name": "Retalhuleu",
    "shortCode": "Re"
  }, {
    "name": "Sacatepéquez",
    "shortCode": "SA"
  }, {
    "name": "San Marcos",
    "shortCode": "SM"
  }, {
    "name": "Santa Rosa",
    "shortCode": "SR"
  }, {
    "name": "Sololá",
    "shortCode": "SO"
  }, {
    "name": "Suchitepéquez",
    "shortCode": "SU"
  }, {
    "name": "Totonicapán",
    "shortCode": "TO"
  }, {
    "name": "Zacapa",
    "shortCode": "ZA"
  }]
}, {
  "countryName": "Guernsey",
  "countryShortCode": "GG",
  "regions": [{
    "name": "Castel"
  }, {
    "name": "Forest"
  }, {
    "name": "St. Andrew"
  }, {
    "name": "St. Martin"
  }, {
    "name": "St. Peter Port"
  }, {
    "name": "St. Pierre du Bois"
  }, {
    "name": "St. Sampson"
  }, {
    "name": "St. Saviour"
  }, {
    "name": "Torteval"
  }, {
    "name": "Vale"
  }]
}, {
  "countryName": "Guinea",
  "countryShortCode": "GN",
  "regions": [{
    "name": "Boké",
    "shortCode": "B"
  }, {
    "name": "Conakry",
    "shortCode": "C"
  }, {
    "name": "Faranah",
    "shortCode": "F"
  }, {
    "name": "Kankan",
    "shortCode": "K"
  }, {
    "name": "Kindia",
    "shortCode": "D"
  }, {
    "name": "Labé",
    "shortCode": "L"
  }, {
    "name": "Mamou",
    "shortCode": "M"
  }, {
    "name": "Nzérékoré",
    "shortCode": "N"
  }]
}, {
  "countryName": "Guinea-Bissau",
  "countryShortCode": "GW",
  "regions": [{
    "name": "Bafatá",
    "shortCode": "BA"
  }, {
    "name": "Biombo",
    "shortCode": "BM"
  }, {
    "name": "Bissau",
    "shortCode": "BS"
  }, {
    "name": "Bolama-Bijagos",
    "shortCode": "BL"
  }, {
    "name": "Cacheu",
    "shortCode": "CA"
  }, {
    "name": "Gabú",
    "shortCode": "GA"
  }, {
    "name": "Oio",
    "shortCode": "OI"
  }, {
    "name": "Quinara",
    "shortCode": "QU"
  }, {
    "name": "Tombali",
    "shortCode": "TO"
  }]
}, {
  "countryName": "Guyana",
  "countryShortCode": "GY",
  "regions": [{
    "name": "Barima-Waini",
    "shortCode": "BA"
  }, {
    "name": "Cuyuni-Mazaruni",
    "shortCode": "CU"
  }, {
    "name": "Demerara-Mahaica",
    "shortCode": "DE"
  }, {
    "name": "East Berbice-Corentyne",
    "shortCode": "EB"
  }, {
    "name": "Essequibo Islands-West Demerara",
    "shortCode": "ES"
  }, {
    "name": "Mahaica-Berbice",
    "shortCode": "MA"
  }, {
    "name": "Pomeroon-Supenaam",
    "shortCode": "PM"
  }, {
    "name": "Potaro-Siparuni",
    "shortCode": "PT"
  }, {
    "name": "Upper Demerara-Berbice",
    "shortCode": "UD"
  }, {
    "name": "Upper Takutu-Upper Essequibo",
    "shortCode": "UT"
  }]
}, {
  "countryName": "Haiti",
  "countryShortCode": "HT",
  "regions": [{
    "name": "Artibonite",
    "shortCode": "AR"
  }, {
    "name": "Centre",
    "shortCode": "CE"
  }, {
    "name": "Grand'Anse",
    "shortCode": "GA"
  }, {
    "name": "Nippes",
    "shortCode": "NI"
  }, {
    "name": "Nord",
    "shortCode": "ND"
  }, {
    "name": "Nord-Est",
    "shortCode": "NE"
  }, {
    "name": "Nord-Ouest",
    "shortCode": "NO"
  }, {
    "name": "Ouest",
    "shortCode": "OU"
  }, {
    "name": "Sud",
    "shortCode": "SD"
  }, {
    "name": "Sud-Est",
    "shortCode": "SE"
  }]
}, {
  "countryName": "Heard Island and McDonald Islands",
  "countryShortCode": "HM",
  "regions": [{
    "name": "Heard Island and McDonald Islands"
  }]
}, {
  "countryName": "Holy See (Vatican City)",
  "countryShortCode": "VA",
  "regions": [{
    "name": "Holy See (Vatican City)",
    "shortCode": "01"
  }]
}, {
  "countryName": "Honduras",
  "countryShortCode": "HN",
  "regions": [{
    "name": "Atlántida",
    "shortCode": "AT"
  }, {
    "name": "Choluteca",
    "shortCode": "CH"
  }, {
    "name": "Colón",
    "shortCode": "CL"
  }, {
    "name": "Comayagua",
    "shortCode": "CM"
  }, {
    "name": "Copán",
    "shortCode": "CP"
  }, {
    "name": "Cortés",
    "shortCode": "CR"
  }, {
    "name": "El Paraíso",
    "shortCode": "EP"
  }, {
    "name": "Francisco Morazan",
    "shortCode": "FM"
  }, {
    "name": "Gracias a Dios",
    "shortCode": "GD"
  }, {
    "name": "Intibucá",
    "shortCode": "IN"
  }, {
    "name": "Islas de la Bahía",
    "shortCode": "IB"
  }, {
    "name": "La Paz",
    "shortCode": "LP"
  }, {
    "name": "Lempira",
    "shortCode": "LE"
  }, {
    "name": "Ocotepeque",
    "shortCode": "OC"
  }, {
    "name": "Olancho",
    "shortCode": "OL"
  }, {
    "name": "Santa Bárbara",
    "shortCode": "SB"
  }, {
    "name": "Valle",
    "shortCode": "VA"
  }, {
    "name": "Yoro",
    "shortCode": "YO"
  }]
}, {
  "countryName": "Hong Kong",
  "countryShortCode": "HK",
  "regions": [{
    "name": "Hong Kong",
    "shortCode": "HK"
  }]
}, {
  "countryName": "Hungary",
  "countryShortCode": "HU",
  "regions": [{
    "name": "Bács-Kiskun",
    "shortCode": "BK"
  }, {
    "name": "Baranya",
    "shortCode": "BA"
  }, {
    "name": "Békés",
    "shortCode": "BE"
  }, {
    "name": "Békéscsaba",
    "shortCode": "BC"
  }, {
    "name": "Borsod-Abauj-Zemplen",
    "shortCode": "BZ"
  }, {
    "name": "Budapest",
    "shortCode": "BU"
  }, {
    "name": "Csongrád",
    "shortCode": "CS"
  }, {
    "name": "Debrecen",
    "shortCode": "DE"
  }, {
    "name": "Dunaújváros",
    "shortCode": "DU"
  }, {
    "name": "Eger",
    "shortCode": "EG"
  }, {
    "name": "Érd",
    "shortCode": "ER"
  }, {
    "name": "Fejér",
    "shortCode": "FE"
  }, {
    "name": "Győr",
    "shortCode": "GY"
  }, {
    "name": "Győr-Moson-Sopron",
    "shortCode": "GS"
  }, {
    "name": "Hajdú-Bihar",
    "shortCode": "HB"
  }, {
    "name": "Heves",
    "shortCode": "HE"
  }, {
    "name": "Hódmezővásárhely",
    "shortCode": "HV"
  }, {
    "name": "Jász-Nagykun-Szolnok",
    "shortCode": "N"
  }, {
    "name": "Kaposvár",
    "shortCode": "KV"
  }, {
    "name": "Kecskemét",
    "shortCode": "KM"
  }, {
    "name": "Komárom-Esztergom",
    "shortCode": "KE"
  }, {
    "name": "Miskolc",
    "shortCode": "MI"
  }, {
    "name": "Nagykanizsa",
    "shortCode": "NK"
  }, {
    "name": "Nógrád",
    "shortCode": "NO"
  }, {
    "name": "Nyíregyháza",
    "shortCode": "NY"
  }, {
    "name": "Pécs",
    "shortCode": "PS"
  }, {
    "name": "Pest",
    "shortCode": "PE"
  }, {
    "name": "Salgótarján",
    "shortCode": "ST"
  }, {
    "name": "Somogy",
    "shortCode": "SO"
  }, {
    "name": "Sopron",
    "shortCode": "SN"
  }, {
    "name": "Szabolcs-á-Bereg",
    "shortCode": "SZ"
  }, {
    "name": "Szeged",
    "shortCode": "SD"
  }, {
    "name": "Székesfehérvár",
    "shortCode": "SF"
  }, {
    "name": "Szekszárd",
    "shortCode": "SS"
  }, {
    "name": "Szolnok",
    "shortCode": "SK"
  }, {
    "name": "Szombathely",
    "shortCode": "SH"
  }, {
    "name": "Tatabánya",
    "shortCode": "TB"
  }, {
    "name": "Tolna",
    "shortCode": "TO"
  }, {
    "name": "Vas",
    "shortCode": "VA"
  }, {
    "name": "Veszprém",
    "shortCode": "VE"
  }, {
    "name": "Veszprém (City)",
    "shortCode": "VM"
  }, {
    "name": "Zala",
    "shortCode": "ZA"
  }, {
    "name": "Zalaegerszeg",
    "shortCode": "ZE"
  }]
}, {
  "countryName": "Iceland",
  "countryShortCode": "IS",
  "regions": [{
    "name": "Austurland",
    "shortCode": "7"
  }, {
    "name": "Höfuðborgarsvæði utan Reykjavíkur",
    "shortCode": "1"
  }, {
    "name": "Norðurland eystra",
    "shortCode": "6"
  }, {
    "name": "Norðurland vestra",
    "shortCode": "5"
  }, {
    "name": "Suðurland",
    "shortCode": "8"
  }, {
    "name": "Suðurnes",
    "shortCode": "2"
  }, {
    "name": "Vestfirðir",
    "shortCode": "4"
  }, {
    "name": "Vesturland",
    "shortCode": "3"
  }]
}, {
  "countryName": "India",
  "countryShortCode": "IN",
  "regions": [{
    "name": "Andaman and Nicobar Islands",
    "shortCode": "AN"
  }, {
    "name": "Andhra Pradesh",
    "shortCode": "AP"
  }, {
    "name": "Arunachal Pradesh",
    "shortCode": "AR"
  }, {
    "name": "Assam",
    "shortCode": "AS"
  }, {
    "name": "Bihar",
    "shortCode": "BR"
  }, {
    "name": "Chandigarh",
    "shortCode": "CH"
  }, {
    "name": "Chhattisgarh",
    "shortCode": "CT"
  }, {
    "name": "Dadra and Nagar Haveli",
    "shortCode": "DN"
  }, {
    "name": "Daman and Diu",
    "shortCode": "DD"
  }, {
    "name": "Delhi",
    "shortCode": "DL"
  }, {
    "name": "Goa",
    "shortCode": "GA"
  }, {
    "name": "Gujarat",
    "shortCode": "GJ"
  }, {
    "name": "Haryana",
    "shortCode": "HR"
  }, {
    "name": "Himachal Pradesh",
    "shortCode": "HP"
  }, {
    "name": "Jammu and Kashmir",
    "shortCode": "JK"
  }, {
    "name": "Jharkhand",
    "shortCode": "JH"
  }, {
    "name": "Karnataka",
    "shortCode": "KA"
  }, {
    "name": "Kerala",
    "shortCode": "KL"
  }, {
    "name": "Lakshadweep",
    "shortCode": "LD"
  }, {
    "name": "Madhya Pradesh",
    "shortCode": "MP"
  }, {
    "name": "Maharashtra",
    "shortCode": "MH"
  }, {
    "name": "Manipur",
    "shortCode": "MN"
  }, {
    "name": "Meghalaya",
    "shortCode": "ML"
  }, {
    "name": "Mizoram",
    "shortCode": "MZ"
  }, {
    "name": "Nagaland",
    "shortCode": "NL"
  }, {
    "name": "Odisha",
    "shortCode": "OR"
  }, {
    "name": "Puducherry",
    "shortCode": "PY"
  }, {
    "name": "Punjab",
    "shortCode": "PB"
  }, {
    "name": "Rajasthan",
    "shortCode": "RJ"
  }, {
    "name": "Sikkim",
    "shortCode": "WK"
  }, {
    "name": "Tamil Nadu",
    "shortCode": "TN"
  }, {
    "name": "Telangana",
    "shortCode": "TG"
  }, {
    "name": "Tripura",
    "shortCode": "TR"
  }, {
    "name": "Uttarakhand",
    "shortCode": "UT"
  }, {
    "name": "Uttar Pradesh",
    "shortCode": "UP"
  }, {
    "name": "West Bengal",
    "shortCode": "WB"
  }]
}, {
  "countryName": "Indonesia",
  "countryShortCode": "ID",
  "regions": [{
    "name": "Aceh",
    "shortCode": "AC"
  }, {
    "name": "Bali",
    "shortCode": "BA"
  }, {
    "name": "Bangka Belitung",
    "shortCode": "BB"
  }, {
    "name": "Banten",
    "shortCode": "BT"
  }, {
    "name": "Bengkulu",
    "shortCode": "BE"
  }, {
    "name": "Gorontalo",
    "shortCode": "GO"
  }, {
    "name": "Jakarta Raya",
    "shortCode": "JK"
  }, {
    "name": "Jambi",
    "shortCode": "JA"
  }, {
    "name": "Jawa Barat",
    "shortCode": "JB"
  }, {
    "name": "Jawa Tengah",
    "shortCode": "JT"
  }, {
    "name": "Jawa Timur",
    "shortCode": "JI"
  }, {
    "name": "Kalimantan Barat",
    "shortCode": "KB"
  }, {
    "name": "Kalimantan Selatan",
    "shortCode": "KS"
  }, {
    "name": "Kalimantan Tengah",
    "shortCode": "KT"
  }, {
    "name": "Kalimantan Timur",
    "shortCode": "KI"
  }, {
    "name": "Kalimantan Utara",
    "shortCode": "KU"
  }, {
    "name": "Kepulauan Riau",
    "shortCode": "KR"
  }, {
    "name": "Lampung",
    "shortCode": "LA"
  }, {
    "name": "Maluku",
    "shortCode": "MA"
  }, {
    "name": "Maluku Utara",
    "shortCode": "MU"
  }, {
    "name": "Nusa Tenggara Barat",
    "shortCode": "NB"
  }, {
    "name": "Nusa Tenggara Timur",
    "shortCode": "NT"
  }, {
    "name": "Papua",
    "shortCode": "PA"
  }, {
    "name": "Papua Barat",
    "shortCode": "PB"
  }, {
    "name": "Riau",
    "shortCode": "RI"
  }, {
    "name": "Sulawesi Selatan",
    "shortCode": "SR"
  }, {
    "name": "Sulawesi Tengah",
    "shortCode": "ST"
  }, {
    "name": "Sulawesi Tenggara",
    "shortCode": "SG"
  }, {
    "name": "Sulawesi Utara",
    "shortCode": "SA"
  }, {
    "name": "Sumatera Barat",
    "shortCode": "SB"
  }, {
    "name": "Sumatera Selatan",
    "shortCode": "SS"
  }, {
    "name": "Sumatera Utara",
    "shortCode": "SU"
  }, {
    "name": "Yogyakarta",
    "shortCode": "YO"
  }]
}, {
  "countryName": "Iran, Islamic Republic of",
  "countryShortCode": "IR",
  "regions": [{
    "name": "Alborz",
    "shortCode": "32"
  }, {
    "name": "Ardabīl",
    "shortCode": "03"
  }, {
    "name": "Āz̄arbāyjān-e Gharbī",
    "shortCode": "02"
  }, {
    "name": "Āz̄arbāyjān-e Sharqī",
    "shortCode": "01"
  }, {
    "name": "Būshehr",
    "shortCode": "06"
  }, {
    "name": "Chahār Maḩāl va Bakhtīārī",
    "shortCode": "08"
  }, {
    "name": "Eşfahān",
    "shortCode": "04"
  }, {
    "name": "Fārs",
    "shortCode": "14"
  }, {
    "name": "Gīlān",
    "shortCode": "19"
  }, {
    "name": "Golestān",
    "shortCode": "27"
  }, {
    "name": "Hamadān",
    "shortCode": "24"
  }, {
    "name": "Hormozgān",
    "shortCode": "23"
  }, {
    "name": "Īlām",
    "shortCode": "05"
  }, {
    "name": "Kermān",
    "shortCode": "15"
  }, {
    "name": "Kermānshāh",
    "shortCode": "17"
  }, {
    "name": "Khorāsān-e Jonūbī",
    "shortCode": "29"
  }, {
    "name": "Khorāsān-e Raẕavī",
    "shortCode": "30"
  }, {
    "name": "Khorāsān-e Shomālī",
    "shortCode": "61"
  }, {
    "name": "Khūzestān",
    "shortCode": "10"
  }, {
    "name": "Kohgīlūyeh va Bowyer Aḩmad",
    "shortCode": "18"
  }, {
    "name": "Kordestān",
    "shortCode": "16"
  }, {
    "name": "Lorestān",
    "shortCode": "20"
  }, {
    "name": "Markazi",
    "shortCode": "22"
  }, {
    "name": "Māzandarān",
    "shortCode": "21"
  }, {
    "name": "Qazvīn",
    "shortCode": "28"
  }, {
    "name": "Qom",
    "shortCode": "26"
  }, {
    "name": "Semnān",
    "shortCode": "12"
  }, {
    "name": "Sīstān va Balūchestān",
    "shortCode": "13"
  }, {
    "name": "Tehrān",
    "shortCode": "07"
  }, {
    "name": "Yazd",
    "shortCode": "25"
  }, {
    "name": "Zanjān",
    "shortCode": "11"
  }]
}, {
  "countryName": "Iraq",
  "countryShortCode": "IQ",
  "regions": [{
    "name": "Al Anbār",
    "shortCode": "AN"
  }, {
    "name": "Al Başrah",
    "shortCode": "BA"
  }, {
    "name": "Al Muthanná",
    "shortCode": "MU"
  }, {
    "name": "Al Qādisīyah",
    "shortCode": "QA"
  }, {
    "name": "An Najaf",
    "shortCode": "NA"
  }, {
    "name": "Arbīl",
    "shortCode": "AR"
  }, {
    "name": "As Sulaymānīyah",
    "shortCode": "SU"
  }, {
    "name": "Bābil",
    "shortCode": "BB"
  }, {
    "name": "Baghdād",
    "shortCode": "BG"
  }, {
    "name": "Dohuk",
    "shortCode": "DA"
  }, {
    "name": "Dhī Qār",
    "shortCode": "DQ"
  }, {
    "name": "Diyālá",
    "shortCode": "DI"
  }, {
    "name": "Karbalā'",
    "shortCode": "KA"
  }, {
    "name": "Kirkuk",
    "shortCode": "KI"
  }, {
    "name": "Maysān",
    "shortCode": "MA"
  }, {
    "name": "Nīnawá",
    "shortCode": "NI"
  }, {
    "name": "Şalāḩ ad Dīn",
    "shortCode": "SD"
  }, {
    "name": "Wāsiţ",
    "shortCode": "WA"
  }]
}, {
  "countryName": "Ireland",
  "countryShortCode": "IE",
  "regions": [{
    "name": "Carlow",
    "shortCode": "CW"
  }, {
    "name": "Cavan",
    "shortCode": "CN"
  }, {
    "name": "Clare",
    "shortCode": "CE"
  }, {
    "name": "Cork",
    "shortCode": "CO"
  }, {
    "name": "Donegal",
    "shortCode": "DL"
  }, {
    "name": "Dublin",
    "shortCode": "D"
  }, {
    "name": "Galway",
    "shortCode": "G"
  }, {
    "name": "Kerry",
    "shortCode": "KY"
  }, {
    "name": "Kildare",
    "shortCode": "KE"
  }, {
    "name": "Kilkenny",
    "shortCode": "KK"
  }, {
    "name": "Laois",
    "shortCode": "LS"
  }, {
    "name": "Leitrim",
    "shortCode": "LM"
  }, {
    "name": "Limerick",
    "shortCode": "LK"
  }, {
    "name": "Longford",
    "shortCode": "LD"
  }, {
    "name": "Louth",
    "shortCode": "LH"
  }, {
    "name": "Mayo",
    "shortCode": "MO"
  }, {
    "name": "Meath",
    "shortCode": "MH"
  }, {
    "name": "Monaghan",
    "shortCode": "MN"
  }, {
    "name": "Offaly",
    "shortCode": "OY"
  }, {
    "name": "Roscommon",
    "shortCode": "RN"
  }, {
    "name": "Sligo",
    "shortCode": "SO"
  }, {
    "name": "Tipperary",
    "shortCode": "TA"
  }, {
    "name": "Waterford",
    "shortCode": "WD"
  }, {
    "name": "Westmeath",
    "shortCode": "WH"
  }, {
    "name": "Wexford",
    "shortCode": "WX"
  }, {
    "name": "Wicklow",
    "shortCode": "WW"
  }]
}, {
  "countryName": "Isle of Man",
  "countryShortCode": "IM",
  "regions": [{
    "name": "Isle of Man"
  }]
}, {
  "countryName": "Israel",
  "countryShortCode": "IL",
  "regions": [{
    "name": "HaDarom",
    "shortCode": "D"
  }, {
    "name": "HaMerkaz",
    "shortCode": "M"
  }, {
    "name": "HaTsafon",
    "shortCode": "Z"
  }, {
    "name": "H̱efa",
    "shortCode": "HA"
  }, {
    "name": "Tel-Aviv",
    "shortCode": "TA"
  }, {
    "name": "Yerushalayim",
    "shortCode": "JM"
  }]
}, {
  "countryName": "Italy",
  "countryShortCode": "IT",
  "regions": [{
    "name": "Abruzzo",
    "shortCode": "65"
  }, {
    "name": "Basilicata",
    "shortCode": "77"
  }, {
    "name": "Calabria",
    "shortCode": "78"
  }, {
    "name": "Campania",
    "shortCode": "72"
  }, {
    "name": "Emilia-Romagna",
    "shortCode": "45"
  }, {
    "name": "Friuli-Venezia Giulia",
    "shortCode": "36"
  }, {
    "name": "Lazio",
    "shortCode": "62"
  }, {
    "name": "Liguria",
    "shortCode": "42"
  }, {
    "name": "Lombardia",
    "shortCode": "25"
  }, {
    "name": "Marche",
    "shortCode": "57"
  }, {
    "name": "Molise",
    "shortCode": "67"
  }, {
    "name": "Piemonte",
    "shortCode": "21"
  }, {
    "name": "Puglia",
    "shortCode": "75"
  }, {
    "name": "Sardegna",
    "shortCode": "88"
  }, {
    "name": "Sicilia",
    "shortCode": "82"
  }, {
    "name": "Toscana",
    "shortCode": "52"
  }, {
    "name": "Trentino-Alto Adige",
    "shortCode": "32"
  }, {
    "name": "Umbria",
    "shortCode": "55"
  }, {
    "name": "Valle d'Aosta",
    "shortCode": "23"
  }, {
    "name": "Veneto",
    "shortCode": "34"
  }]
}, {
  "countryName": "Jamaica",
  "countryShortCode": "JM",
  "regions": [{
    "name": "Clarendon",
    "shortCode": "13"
  }, {
    "name": "Hanover",
    "shortCode": "09"
  }, {
    "name": "Kingston",
    "shortCode": "01"
  }, {
    "name": "Manchester",
    "shortCode": "12"
  }, {
    "name": "Portland",
    "shortCode": "04"
  }, {
    "name": "Saint Andrew",
    "shortCode": "02"
  }, {
    "name": "Saint Ann",
    "shortCode": "06"
  }, {
    "name": "Saint Catherine",
    "shortCode": "14"
  }, {
    "name": "Saint Elizabeth",
    "shortCode": "11"
  }, {
    "name": "Saint James",
    "shortCode": "08"
  }, {
    "name": "Saint Mary",
    "shortCode": "05"
  }, {
    "name": "Saint Thomas",
    "shortCode": "03"
  }, {
    "name": "Trelawny",
    "shortCode": "07"
  }, {
    "name": "Westmoreland",
    "shortCode": "10"
  }]
}, {
  "countryName": "Japan",
  "countryShortCode": "JP",
  "regions": [{
    "name": "Aichi",
    "shortCode": "23"
  }, {
    "name": "Akita",
    "shortCode": "05"
  }, {
    "name": "Aomori",
    "shortCode": "02"
  }, {
    "name": "Chiba",
    "shortCode": "12"
  }, {
    "name": "Ehime",
    "shortCode": "38"
  }, {
    "name": "Fukui",
    "shortCode": "18"
  }, {
    "name": "Fukuoka",
    "shortCode": "40"
  }, {
    "name": "Fukushima",
    "shortCode": "07"
  }, {
    "name": "Gifu",
    "shortCode": "21"
  }, {
    "name": "Gunma",
    "shortCode": "10"
  }, {
    "name": "Hiroshima",
    "shortCode": "34"
  }, {
    "name": "Hokkaido",
    "shortCode": "01"
  }, {
    "name": "Hyogo",
    "shortCode": "28"
  }, {
    "name": "Ibaraki",
    "shortCode": "08"
  }, {
    "name": "Ishikawa",
    "shortCode": "17"
  }, {
    "name": "Iwate",
    "shortCode": "03"
  }, {
    "name": "Kagawa",
    "shortCode": "37"
  }, {
    "name": "Kagoshima",
    "shortCode": "46"
  }, {
    "name": "Kanagawa",
    "shortCode": "14"
  }, {
    "name": "Kochi",
    "shortCode": "39"
  }, {
    "name": "Kumamoto",
    "shortCode": "43"
  }, {
    "name": "Kyoto",
    "shortCode": "26"
  }, {
    "name": "Mie",
    "shortCode": "24"
  }, {
    "name": "Miyagi",
    "shortCode": "04"
  }, {
    "name": "Miyazaki",
    "shortCode": "45"
  }, {
    "name": "Nagano",
    "shortCode": "20"
  }, {
    "name": "Nagasaki",
    "shortCode": "42"
  }, {
    "name": "Nara",
    "shortCode": "29"
  }, {
    "name": "Niigata",
    "shortCode": "15"
  }, {
    "name": "Oita",
    "shortCode": "44"
  }, {
    "name": "Okayama",
    "shortCode": "33"
  }, {
    "name": "Okinawa",
    "shortCode": "47"
  }, {
    "name": "Osaka",
    "shortCode": "27"
  }, {
    "name": "Saga",
    "shortCode": "41"
  }, {
    "name": "Saitama",
    "shortCode": "11"
  }, {
    "name": "Shiga",
    "shortCode": "25"
  }, {
    "name": "Shimane",
    "shortCode": "32"
  }, {
    "name": "Shizuoka",
    "shortCode": "22"
  }, {
    "name": "Tochigi",
    "shortCode": "09"
  }, {
    "name": "Tokushima",
    "shortCode": "36"
  }, {
    "name": "Tokyo",
    "shortCode": "13"
  }, {
    "name": "Tottori",
    "shortCode": "31"
  }, {
    "name": "Toyama",
    "shortCode": "16"
  }, {
    "name": "Wakayama",
    "shortCode": "30"
  }, {
    "name": "Yamagata",
    "shortCode": "06"
  }, {
    "name": "Yamaguchi",
    "shortCode": "35"
  }, {
    "name": "Yamanashi",
    "shortCode": "19"
  }]
}, {
  "countryName": "Jersey",
  "countryShortCode": "JE",
  "regions": [{
    "name": "Jersey"
  }]
}, {
  "countryName": "Jordan",
  "countryShortCode": "JO",
  "regions": [{
    "name": "‘Ajlūn",
    "shortCode": "AJ"
  }, {
    "name": "Al 'Aqabah",
    "shortCode": "AQ"
  }, {
    "name": "Al Balqā’",
    "shortCode": "BA"
  }, {
    "name": "Al Karak",
    "shortCode": "KA"
  }, {
    "name": "Al Mafraq",
    "shortCode": "MA"
  }, {
    "name": "Al ‘A̅şimah",
    "shortCode": "AM"
  }, {
    "name": "Aţ Ţafīlah",
    "shortCode": "AT"
  }, {
    "name": "Az Zarqā’",
    "shortCode": "AZ"
  }, {
    "name": "Irbid",
    "shortCode": "IR"
  }, {
    "name": "Jarash",
    "shortCode": "JA"
  }, {
    "name": "Ma‘ān",
    "shortCode": "MN"
  }, {
    "name": "Mādabā",
    "shortCode": "MD"
  }]
}, {
  "countryName": "Kazakhstan",
  "countryShortCode": "KZ",
  "regions": [{
    "name": "Almaty",
    "shortCode": "ALA"
  }, {
    "name": "Aqmola",
    "shortCode": "AKM"
  }, {
    "name": "Aqtobe",
    "shortCode": "AKT"
  }, {
    "name": "Astana",
    "shortCode": "AST"
  }, {
    "name": "Atyrau",
    "shortCode": "ATY"
  }, {
    "name": "Batys Qazaqstan",
    "shortCode": "ZAP"
  }, {
    "name": "Bayqongyr"
  }, {
    "name": "Mangghystau",
    "shortCode": "MAN"
  }, {
    "name": "Ongtustik Qazaqstan",
    "shortCode": "YUZ"
  }, {
    "name": "Pavlodar",
    "shortCode": "PAV"
  }, {
    "name": "Qaraghandy",
    "shortCode": "KAR"
  }, {
    "name": "Qostanay",
    "shortCode": "KUS"
  }, {
    "name": "Qyzylorda",
    "shortCode": "KZY"
  }, {
    "name": "Shyghys Qazaqstan",
    "shortCode": "VOS"
  }, {
    "name": "Soltustik Qazaqstan",
    "shortCode": "SEV"
  }, {
    "name": "Zhambyl",
    "shortCode": "ZHA"
  }]
}, {
  "countryName": "Kenya",
  "countryShortCode": "KE",
  "regions": [{
    "name": "Baringo",
    "shortCode": "01"
  }, {
    "name": "Bomet",
    "shortCode": "02"
  }, {
    "name": "Bungoma",
    "shortCode": "03"
  }, {
    "name": "Busia",
    "shortCode": "04"
  }, {
    "name": "Eleyo/Marakwet",
    "shortCode": "05"
  }, {
    "name": "Embu",
    "shortCode": "06"
  }, {
    "name": "Garissa",
    "shortCode": "07"
  }, {
    "name": "Homa Bay",
    "shortCode": "08"
  }, {
    "name": "Isiolo",
    "shortCode": "09"
  }, {
    "name": "Kajiado",
    "shortCode": "10"
  }, {
    "name": "Kakamega",
    "shortCode": "11"
  }, {
    "name": "Kericho",
    "shortCode": "12"
  }, {
    "name": "Kiambu",
    "shortCode": "13"
  }, {
    "name": "Kilifi",
    "shortCode": "14"
  }, {
    "name": "Kirinyaga",
    "shortCode": "15"
  }, {
    "name": "Kisii",
    "shortCode": "16"
  }, {
    "name": "Kisumu",
    "shortCode": "17"
  }, {
    "name": "Kitui",
    "shortCode": "18"
  }, {
    "name": "Kwale",
    "shortCode": "19"
  }, {
    "name": "Laikipia",
    "shortCode": "20"
  }, {
    "name": "Lamu",
    "shortCode": "21"
  }, {
    "name": "Machakos",
    "shortCode": "22"
  }, {
    "name": "Makueni",
    "shortCode": "23"
  }, {
    "name": "Mandera",
    "shortCode": "24"
  }, {
    "name": "Marsabit",
    "shortCode": "25"
  }, {
    "name": "Meru",
    "shortCode": "26"
  }, {
    "name": "Migori",
    "shortCode": "27"
  }, {
    "name": "Mombasa",
    "shortCode": "28"
  }, {
    "name": "Murang'a",
    "shortCode": "29"
  }, {
    "name": "Nairobi City",
    "shortCode": "30"
  }, {
    "name": "Nakuru",
    "shortCode": "31"
  }, {
    "name": "Nandi",
    "shortCode": "32"
  }, {
    "name": "Narok",
    "shortCode": "33"
  }, {
    "name": "Nyamira",
    "shortCode": "34"
  }, {
    "name": "Nyandarua",
    "shortCode": "35"
  }, {
    "name": "Nyeri",
    "shortCode": "36"
  }, {
    "name": "Samburu",
    "shortCode": "37"
  }, {
    "name": "Siaya",
    "shortCode": "38"
  }, {
    "name": "Taita/Taveta",
    "shortCode": "39"
  }, {
    "name": "Tana River",
    "shortCode": "40"
  }, {
    "name": "Tharaka-Nithi",
    "shortCode": "41"
  }, {
    "name": "Trans Nzoia",
    "shortCode": "42"
  }, {
    "name": "Turkana",
    "shortCode": "43"
  }, {
    "name": "Uasin Gishu",
    "shortCode": "44"
  }, {
    "name": "Vihiga",
    "shortCode": "45"
  }, {
    "name": "Wajir",
    "shortCode": "46"
  }, {
    "name": "West Pokot",
    "shortCode": "47"
  }]
}, {
  "countryName": "Kiribati",
  "countryShortCode": "KI",
  "regions": [{
    "name": "Abaiang"
  }, {
    "name": "Abemama"
  }, {
    "name": "Aranuka"
  }, {
    "name": "Arorae"
  }, {
    "name": "Banaba"
  }, {
    "name": "Beru"
  }, {
    "name": "Butaritari"
  }, {
    "name": "Central Gilberts"
  }, {
    "name": "Gilbert Islands",
    "shortCode": "G"
  }, {
    "name": "Kanton"
  }, {
    "name": "Kiritimati"
  }, {
    "name": "Kuria"
  }, {
    "name": "Line Islands",
    "shortCode": "L"
  }, {
    "name": "Maiana"
  }, {
    "name": "Makin"
  }, {
    "name": "Marakei"
  }, {
    "name": "Nikunau"
  }, {
    "name": "Nonouti"
  }, {
    "name": "Northern Gilberts"
  }, {
    "name": "Onotoa"
  }, {
    "name": "Phoenix Islands",
    "shortCode": "P"
  }, {
    "name": "Southern Gilberts"
  }, {
    "name": "Tabiteuea"
  }, {
    "name": "Tabuaeran"
  }, {
    "name": "Tamana"
  }, {
    "name": "Tarawa"
  }, {
    "name": "Teraina"
  }]
}, {
  "countryName": "Korea, Democratic People's Republic of",
  "countryShortCode": "KP",
  "regions": [{
    "name": "Chagang-do (Chagang Province)",
    "shortCode": "04"
  }, {
    "name": "Hamgyong-bukto (North Hamgyong Province)",
    "shortCode": "09"
  }, {
    "name": "Hamgyong-namdo (South Hamgyong Province)",
    "shortCode": "08"
  }, {
    "name": "Hwanghae-bukto (North Hwanghae Province)",
    "shortCode": "06"
  }, {
    "name": "Hwanghae-namdo (South Hwanghae Province)",
    "shortCode": "05"
  }, {
    "name": "Kangwon-do (Kangwon Province)",
    "shortCode": "07"
  }, {
    "name": "Nasŏn (Najin-Sŏnbong)",
    "shortCode": "13"
  }, {
    "name": "P'yongan-bukto (North P'yongan Province)",
    "shortCode": "03"
  }, {
    "name": "P'yongan-namdo (South P'yongan Province)",
    "shortCode": "02"
  }, {
    "name": "P'yongyang-si (P'yongyang City)",
    "shortCode": "01"
  }, {
    "name": "Yanggang-do (Yanggang Province)",
    "shortCode": "10"
  }]
}, {
  "countryName": "Korea, Republic of",
  "countryShortCode": "KR",
  "regions": [{
    "name": "Ch'ungch'ongbuk-do",
    "shortCode": "43"
  }, {
    "name": "Ch'ungch'ongnam-do",
    "shortCode": "44"
  }, {
    "name": "Cheju-do",
    "shortCode": "49"
  }, {
    "name": "Chollabuk-do",
    "shortCode": "45"
  }, {
    "name": "Chollanam-do",
    "shortCode": "46"
  }, {
    "name": "Inch'on-Kwangyokhi",
    "shortCode": "28"
  }, {
    "name": "Kang-won-do",
    "shortCode": "42"
  }, {
    "name": "Kwangju-Kwangyokshi",
    "shortCode": "28"
  }, {
    "name": "Kyonggi-do",
    "shortCode": "41"
  }, {
    "name": "Kyongsangbuk-do",
    "shortCode": "47"
  }, {
    "name": "Kyongsangnam-do",
    "shortCode": "48"
  }, {
    "name": "Pusan-Kwangyokshi",
    "shortCode": "26"
  }, {
    "name": "Seoul-T'ukpyolshi",
    "shortCode": "11"
  }, {
    "name": "Sejong",
    "shortCode": "50"
  }, {
    "name": "Taegu-Kwangyokshi",
    "shortCode": "27"
  }, {
    "name": "Taejon-Kwangyokshi",
    "shortCode": "30"
  }, {
    "name": "Ulsan-Kwangyokshi",
    "shortCode": "31"
  }]
}, {
  "countryName": "Kuwait",
  "countryShortCode": "KW",
  "regions": [{
    "name": "Al Aḩmadi",
    "shortCode": "AH"
  }, {
    "name": "Al Farwānīyah",
    "shortCode": "FA"
  }, {
    "name": "Al Jahrā’",
    "shortCode": "JA"
  }, {
    "name": "Al ‘Āşimah",
    "shortCode": "KU"
  }, {
    "name": "Ḩawallī",
    "shortCode": "HA"
  }, {
    "name": "Mubārak al Kabir",
    "shortCode": "MU"
  }]
}, {
  "countryName": "Kyrgyzstan",
  "countryShortCode": "KG",
  "regions": [{
    "name": "Batken Oblasty",
    "shortCode": "B"
  }, {
    "name": "Bishkek Shaary",
    "shortCode": "GB"
  }, {
    "name": "Chuy Oblasty (Bishkek)",
    "shortCode": "C"
  }, {
    "name": "Jalal-Abad Oblasty",
    "shortCode": "J"
  }, {
    "name": "Naryn Oblasty",
    "shortCode": "N"
  }, {
    "name": "Osh Oblasty",
    "shortCode": "O"
  }, {
    "name": "Talas Oblasty",
    "shortCode": "T"
  }, {
    "name": "Ysyk-Kol Oblasty (Karakol)",
    "shortCode": "Y"
  }]
}, {
  "countryName": "Laos",
  "countryShortCode": "LA",
  "regions": [{
    "name": "Attapu",
    "shortCode": "AT"
  }, {
    "name": "Bokèo",
    "shortCode": "BK"
  }, {
    "name": "Bolikhamxai",
    "shortCode": "BL"
  }, {
    "name": "Champasak",
    "shortCode": "CH"
  }, {
    "name": "Houaphan",
    "shortCode": "HO"
  }, {
    "name": "Khammouan",
    "shortCode": "KH"
  }, {
    "name": "Louang Namtha",
    "shortCode": "LM"
  }, {
    "name": "Louangphabang",
    "shortCode": "LP"
  }, {
    "name": "Oudômxai",
    "shortCode": "OU"
  }, {
    "name": "Phôngsali",
    "shortCode": "PH"
  }, {
    "name": "Salavan",
    "shortCode": "SL"
  }, {
    "name": "Savannakhét",
    "shortCode": "SV"
  }, {
    "name": "Vientiane",
    "shortCode": "VI"
  }, {
    "name": "Xaignabouli",
    "shortCode": "XA"
  }, {
    "name": "Xékong",
    "shortCode": "XE"
  }, {
    "name": "Xaisomboun",
    "shortCode": "XS"
  }, {
    "name": "Xiangkhouang",
    "shortCode": "XI"
  }]
}, {
  "countryName": "Latvia",
  "countryShortCode": "LV",
  "regions": [{
    "name": "Aglona",
    "shortCode": "001"
  }, {
    "name": "Aizkraukle",
    "shortCode": "002"
  }, {
    "name": "Aizpute",
    "shortCode": "003"
  }, {
    "name": "Aknīste",
    "shortCode": "004"
  }, {
    "name": "Aloja",
    "shortCode": "005"
  }, {
    "name": "Alsunga",
    "shortCode": "06"
  }, {
    "name": "Alūksne",
    "shortCode": "007"
  }, {
    "name": "Amata",
    "shortCode": "008"
  }, {
    "name": "Ape",
    "shortCode": "009"
  }, {
    "name": "Auce",
    "shortCode": "010"
  }, {
    "name": "Ādaži",
    "shortCode": "011"
  }, {
    "name": "Babīte",
    "shortCode": "012"
  }, {
    "name": "Baldone",
    "shortCode": "013"
  }, {
    "name": "Baltinava",
    "shortCode": "014"
  }, {
    "name": "Balvi",
    "shortCode": "015"
  }, {
    "name": "Bauska",
    "shortCode": "016"
  }, {
    "name": "Beverīna",
    "shortCode": "017"
  }, {
    "name": "Brocēni",
    "shortCode": "018"
  }, {
    "name": "Burtnieki",
    "shortCode": "019"
  }, {
    "name": "Carnikava",
    "shortCode": "020"
  }, {
    "name": "Cesvaine",
    "shortCode": "021"
  }, {
    "name": "Cēsis",
    "shortCode": "022"
  }, {
    "name": "Cibla",
    "shortCode": "023"
  }, {
    "name": "Dagda",
    "shortCode": "024"
  }, {
    "name": "Daugavpils",
    "shortCode": "025"
  }, {
    "name": "Daugavpils (City)",
    "shortCode": "DGV"
  }, {
    "name": "Dobele",
    "shortCode": "026"
  }, {
    "name": "Dundaga",
    "shortCode": "027"
  }, {
    "name": "Durbe",
    "shortCode": "028"
  }, {
    "name": "Engure",
    "shortCode": "029"
  }, {
    "name": "Ērgļi",
    "shortCode": "030"
  }, {
    "name": "Garkalne",
    "shortCode": "031"
  }, {
    "name": "Grobiņa",
    "shortCode": "032"
  }, {
    "name": "Gulbene",
    "shortCode": "033"
  }, {
    "name": "Iecava",
    "shortCode": "034"
  }, {
    "name": "Ikšķile",
    "shortCode": "035"
  }, {
    "name": "Ilūkste",
    "shortCode": "036"
  }, {
    "name": "Inčukalns",
    "shortCode": "037"
  }, {
    "name": "Jaunjelgava",
    "shortCode": "038"
  }, {
    "name": "Jaunpiebalga",
    "shortCode": "039"
  }, {
    "name": "Jaunpils",
    "shortCode": "040"
  }, {
    "name": "Jelgava",
    "shortCode": "041"
  }, {
    "name": "Jelgava (City)",
    "shortCode": "JEL"
  }, {
    "name": "Jēkabpils",
    "shortCode": "042"
  }, {
    "name": "Jēkabpils (City)",
    "shortCode": "JKB"
  }, {
    "name": "Jūrmala (City)",
    "shortCode": "JUR"
  }, {
    "name": "Kandava",
    "shortCode": "043"
  }, {
    "name": "Kārsava",
    "shortCode": "044"
  }, {
    "name": "Kocēni",
    "shortCode": "045"
  }, {
    "name": "Koknese",
    "shortCode": "046"
  }, {
    "name": "Krāslava",
    "shortCode": "047"
  }, {
    "name": "Krimulda",
    "shortCode": "048"
  }, {
    "name": "Krustpils",
    "shortCode": "049"
  }, {
    "name": "Kuldīga",
    "shortCode": "050"
  }, {
    "name": "Ķegums",
    "shortCode": "051"
  }, {
    "name": "Ķekava",
    "shortCode": "052"
  }, {
    "name": "Lielvārde",
    "shortCode": "053"
  }, {
    "name": "Liepāja",
    "shortCode": "LPX"
  }, {
    "name": "Limbaži",
    "shortCode": "054"
  }, {
    "name": "Līgatne",
    "shortCode": "055"
  }, {
    "name": "Līvāni",
    "shortCode": "056"
  }, {
    "name": "Lubāna",
    "shortCode": "057"
  }, {
    "name": "Ludza",
    "shortCode": "058"
  }, {
    "name": "Madona",
    "shortCode": "059"
  }, {
    "name": "Mazsalaca",
    "shortCode": "060"
  }, {
    "name": "Mālpils",
    "shortCode": "061"
  }, {
    "name": "Mārupe",
    "shortCode": "062"
  }, {
    "name": "Mērsrags",
    "shortCode": "063"
  }, {
    "name": "Naukšēni",
    "shortCode": "064"
  }, {
    "name": "Nereta",
    "shortCode": "065"
  }, {
    "name": "Nīca",
    "shortCode": "066"
  }, {
    "name": "Ogre",
    "shortCode": "067"
  }, {
    "name": "Olaine",
    "shortCode": "068"
  }, {
    "name": "Ozolnieki",
    "shortCode": "069"
  }, {
    "name": "Pārgauja",
    "shortCode": "070"
  }, {
    "name": "Pāvilosta",
    "shortCode": "071"
  }, {
    "name": "Pļaviņas",
    "shortCode": "072"
  }, {
    "name": "Preiļi",
    "shortCode": "073"
  }, {
    "name": "Priekule",
    "shortCode": "074"
  }, {
    "name": "Priekuļi",
    "shortCode": "075"
  }, {
    "name": "Rauna",
    "shortCode": "076"
  }, {
    "name": "Rēzekne",
    "shortCode": "077"
  }, {
    "name": "Rēzekne (City)",
    "shortCode": "REZ"
  }, {
    "name": "Riebiņi",
    "shortCode": "078"
  }, {
    "name": "Rīga",
    "shortCode": "RIX"
  }, {
    "name": "Roja",
    "shortCode": "079"
  }, {
    "name": "Ropaži",
    "shortCode": "080"
  }, {
    "name": "Rucava",
    "shortCode": "081"
  }, {
    "name": "Rugāji",
    "shortCode": "082"
  }, {
    "name": "Rundāle",
    "shortCode": "083"
  }, {
    "name": "Rūjiena",
    "shortCode": "084"
  }, {
    "name": "Sala",
    "shortCode": "085"
  }, {
    "name": "Salacgrīva",
    "shortCode": "086"
  }, {
    "name": "Salaspils",
    "shortCode": "087"
  }, {
    "name": "Saldus",
    "shortCode": "088"
  }, {
    "name": "Saulkrasti",
    "shortCode": "089"
  }, {
    "name": "Sēja",
    "shortCode": "090"
  }, {
    "name": "Sigulda",
    "shortCode": "091"
  }, {
    "name": "Skrīveri",
    "shortCode": "092"
  }, {
    "name": "Skrunda",
    "shortCode": "093"
  }, {
    "name": "Smiltene",
    "shortCode": "094"
  }, {
    "name": "Stopiņi",
    "shortCode": "095"
  }, {
    "name": "Strenči",
    "shortCode": "096"
  }, {
    "name": "Talsi",
    "shortCode": "097"
  }, {
    "name": "Tērvete",
    "shortCode": "098"
  }, {
    "name": "Tukums",
    "shortCode": "099"
  }, {
    "name": "Vaiņode",
    "shortCode": "100"
  }, {
    "name": "Valka",
    "shortCode": "101"
  }, {
    "name": "Valmiera",
    "shortCode": "VMR"
  }, {
    "name": "Varakļāni",
    "shortCode": "102"
  }, {
    "name": "Vārkava",
    "shortCode": "103"
  }, {
    "name": "Vecpiebalga",
    "shortCode": "104"
  }, {
    "name": "Vecumnieki",
    "shortCode": "105"
  }, {
    "name": "Ventspils",
    "shortCode": "106"
  }, {
    "name": "Ventspils (City)",
    "shortCode": "VEN"
  }, {
    "name": "Viesīte",
    "shortCode": "107"
  }, {
    "name": "Viļaka",
    "shortCode": "108"
  }, {
    "name": "Viļāni",
    "shortCode": "109"
  }, {
    "name": "Zilupe",
    "shortCode": "110"
  }]
}, {
  "countryName": "Lebanon",
  "countryShortCode": "LB",
  "regions": [{
    "name": "Aakkâr",
    "shortCode": "AK"
  }, {
    "name": "Baalbelk-Hermel",
    "shortCode": "BH"
  }, {
    "name": "Béqaa",
    "shortCode": "BI"
  }, {
    "name": "Beyrouth",
    "shortCode": "BA"
  }, {
    "name": "Liban-Nord",
    "shortCode": "AS"
  }, {
    "name": "Liban-Sud",
    "shortCode": "JA"
  }, {
    "name": "Mont-Liban",
    "shortCode": "JL"
  }, {
    "name": "Nabatîyé",
    "shortCode": "NA"
  }]
}, {
  "countryName": "Lesotho",
  "countryShortCode": "LS",
  "regions": [{
    "name": "Berea",
    "shortCode": "D"
  }, {
    "name": "Butha-Buthe",
    "shortCode": "B"
  }, {
    "name": "Leribe",
    "shortCode": "C"
  }, {
    "name": "Mafeteng",
    "shortCode": "E"
  }, {
    "name": "Maseru",
    "shortCode": "A"
  }, {
    "name": "Mohales Hoek",
    "shortCode": "F"
  }, {
    "name": "Mokhotlong",
    "shortCode": "J"
  }, {
    "name": "Qacha's Nek",
    "shortCode": "H"
  }, {
    "name": "Quthing",
    "shortCode": "G"
  }, {
    "name": "Thaba-Tseka",
    "shortCode": "K"
  }]
}, {
  "countryName": "Liberia",
  "countryShortCode": "LR",
  "regions": [{
    "name": "Bomi",
    "shortCode": "BM"
  }, {
    "name": "Bong",
    "shortCode": "BG"
  }, {
    "name": "Gbarpolu",
    "shortCode": "GP"
  }, {
    "name": "Grand Bassa",
    "shortCode": "GB"
  }, {
    "name": "Grand Cape Mount",
    "shortCode": "CM"
  }, {
    "name": "Grand Gedeh",
    "shortCode": "GG"
  }, {
    "name": "Grand Kru",
    "shortCode": "GK"
  }, {
    "name": "Lofa",
    "shortCode": "LO"
  }, {
    "name": "Margibi",
    "shortCode": "MG"
  }, {
    "name": "Maryland",
    "shortCode": "MY"
  }, {
    "name": "Montserrado",
    "shortCode": "MO"
  }, {
    "name": "Nimba",
    "shortCode": "NI"
  }, {
    "name": "River Cess",
    "shortCode": "RI"
  }, {
    "name": "River Geee",
    "shortCode": "RG"
  }, {
    "name": "Sinoe",
    "shortCode": "SI"
  }]
}, {
  "countryName": "Libya",
  "countryShortCode": "LY",
  "regions": [{
    "name": "Al Buţnān",
    "shortCode": "BU"
  }, {
    "name": "Al Jabal al Akhḑar",
    "shortCode": "JA"
  }, {
    "name": "Al Jabal al Gharbī",
    "shortCode": "JG"
  }, {
    "name": "Al Jafārah",
    "shortCode": "JA"
  }, {
    "name": "Al Jufrah",
    "shortCode": "JU"
  }, {
    "name": "Al Kufrah",
    "shortCode": "FK"
  }, {
    "name": "Al Marj",
    "shortCode": "MJ"
  }, {
    "name": "Al Marquab",
    "shortCode": "MB"
  }, {
    "name": "Al Wāḩāt",
    "shortCode": "WA"
  }, {
    "name": "An Nuqaţ al Khams",
    "shortCode": "NQ"
  }, {
    "name": "Az Zāwiyah",
    "shortCode": "ZA"
  }, {
    "name": "Banghāzī",
    "shortCode": "BA"
  }, {
    "name": "Darnah",
    "shortCode": "DR"
  }, {
    "name": "Ghāt",
    "shortCode": "GH"
  }, {
    "name": "Mişrātah",
    "shortCode": "MI"
  }, {
    "name": "Murzuq",
    "shortCode": "MQ"
  }, {
    "name": "Nālūt",
    "shortCode": "NL"
  }, {
    "name": "Sabhā",
    "shortCode": "SB"
  }, {
    "name": "Surt",
    "shortCode": "SR"
  }, {
    "name": "Ţarābulus",
    "shortCode": "TB"
  }, {
    "name": "Yafran",
    "shortCode": "WD"
  }, {
    "name": "Wādī ash Shāţiʾ",
    "shortCode": "WS"
  }]
}, {
  "countryName": "Liechtenstein",
  "countryShortCode": "LI",
  "regions": [{
    "name": "Balzers",
    "shortCode": "01"
  }, {
    "name": "Eschen",
    "shortCode": "02"
  }, {
    "name": "Gamprin",
    "shortCode": "03"
  }, {
    "name": "Mauren",
    "shortCode": "04"
  }, {
    "name": "Planken",
    "shortCode": "05"
  }, {
    "name": "Ruggell",
    "shortCode": "06"
  }, {
    "name": "Schaan",
    "shortCode": "07"
  }, {
    "name": "Schellenberg",
    "shortCode": "08"
  }, {
    "name": "Triesen",
    "shortCode": "09"
  }, {
    "name": "Triesenberg",
    "shortCode": "10"
  }, {
    "name": "Vaduz",
    "shortCode": "11"
  }]
}, {
  "countryName": "Lithuania",
  "countryShortCode": "LT",
  "regions": [{
    "name": "Alytaus",
    "shortCode": "AL"
  }, {
    "name": "Kauno",
    "shortCode": "KU"
  }, {
    "name": "Klaipėdos",
    "shortCode": "KL"
  }, {
    "name": "Marijampolės",
    "shortCode": "MR"
  }, {
    "name": "Panevėžio",
    "shortCode": "PN"
  }, {
    "name": "Šiaulių",
    "shortCode": "SA"
  }, {
    "name": "Tauragės",
    "shortCode": "TA"
  }, {
    "name": "Telšių",
    "shortCode": "TE"
  }, {
    "name": "Utenos",
    "shortCode": "UT"
  }, {
    "name": "Vilniaus",
    "shortCode": "VL"
  }]
}, {
  "countryName": "Luxembourg",
  "countryShortCode": "LU",
  "regions": [{
    "name": "Capellen",
    "shortCode": "CA"
  }, {
    "name": "Clevaux",
    "shortCode": "CL"
  }, {
    "name": "Diekirch",
    "shortCode": "DI"
  }, {
    "name": "Echternach",
    "shortCode": "EC"
  }, {
    "name": "Esch-sur-Alzette",
    "shortCode": "ES"
  }, {
    "name": "Grevenmacher",
    "shortCode": "GR"
  }, {
    "name": "Luxembourg",
    "shortCode": "LU"
  }, {
    "name": "Mersch",
    "shortCode": "ME"
  }, {
    "name": "Redange",
    "shortCode": "RD"
  }, {
    "name": "Remich",
    "shortCode": "RM"
  }, {
    "name": "Vianden",
    "shortCode": "VD"
  }, {
    "name": "Wiltz",
    "shortCode": "WI"
  }]
}, {
  "countryName": "Macao",
  "countryShortCode": "MO",
  "regions": [{
    "name": "Macao"
  }]
}, {
  "countryName": "Macedonia, Republic of",
  "countryShortCode": "MK",
  "regions": [{
    "name": "Aračinovo",
    "shortCode": "02"
  }, {
    "name": "Berovo",
    "shortCode": "03"
  }, {
    "name": "Bitola",
    "shortCode": "04"
  }, {
    "name": "Bogdanci",
    "shortCode": "05"
  }, {
    "name": "Bogovinje",
    "shortCode": "06"
  }, {
    "name": "Bosilovo",
    "shortCode": "07"
  }, {
    "name": "Brvenica",
    "shortCode": "08"
  }, {
    "name": "Centar Župa",
    "shortCode": "78"
  }, {
    "name": "Čaška",
    "shortCode": "08"
  }, {
    "name": "Češinovo-Obleševo",
    "shortCode": "81"
  }, {
    "name": "Čučer Sandevo",
    "shortCode": "82"
  }, {
    "name": "Debar",
    "shortCode": "21"
  }, {
    "name": "Debarca",
    "shortCode": "22"
  }, {
    "name": "Delčevo",
    "shortCode": "23"
  }, {
    "name": "Demir Hisar",
    "shortCode": "25"
  }, {
    "name": "Demir Kapija",
    "shortCode": "24"
  }, {
    "name": "Doran",
    "shortCode": "26"
  }, {
    "name": "Dolneni",
    "shortCode": "27"
  }, {
    "name": "Gevgelija",
    "shortCode": "18"
  }, {
    "name": "Gostivar",
    "shortCode": "19"
  }, {
    "name": "Gradsko",
    "shortCode": "20"
  }, {
    "name": "Ilinden",
    "shortCode": "34"
  }, {
    "name": "Jegunovce",
    "shortCode": "35"
  }, {
    "name": "Karbinci",
    "shortCode": "37"
  }, {
    "name": "Kavadarci",
    "shortCode": "36"
  }, {
    "name": "Kičevo",
    "shortCode": "40"
  }, {
    "name": "Kočani",
    "shortCode": "42"
  }, {
    "name": "Konče",
    "shortCode": "41"
  }, {
    "name": "Kratovo",
    "shortCode": "43"
  }, {
    "name": "Kriva Palanka",
    "shortCode": "44"
  }, {
    "name": "Krivogaštani",
    "shortCode": "45"
  }, {
    "name": "Kruševo",
    "shortCode": "46"
  }, {
    "name": "Kumanovo",
    "shortCode": "47"
  }, {
    "name": "Lipkovo",
    "shortCode": "48"
  }, {
    "name": "Lozovo",
    "shortCode": "49"
  }, {
    "name": "Makedonska Kamenica",
    "shortCode": "51"
  }, {
    "name": "Makedonski Brod",
    "shortCode": "52"
  }, {
    "name": "Mavrovo i Rostuša",
    "shortCode": "50"
  }, {
    "name": "Mogila",
    "shortCode": "53"
  }, {
    "name": "Negotino",
    "shortCode": "54"
  }, {
    "name": "Novaci",
    "shortCode": "55"
  }, {
    "name": "Novo Selo",
    "shortCode": "56"
  }, {
    "name": "Ohrid",
    "shortCode": "58"
  }, {
    "name": "Pehčevo",
    "shortCode": "60"
  }, {
    "name": "Petrovec",
    "shortCode": "59"
  }, {
    "name": "Plasnica",
    "shortCode": "61"
  }, {
    "name": "Prilep",
    "shortCode": "62"
  }, {
    "name": "Probištip",
    "shortCode": "63"
  }, {
    "name": "Radoviš",
    "shortCode": ""
  }, {
    "name": "Rankovce",
    "shortCode": "65"
  }, {
    "name": "Resen",
    "shortCode": "66"
  }, {
    "name": "Rosoman",
    "shortCode": "67"
  }, {
    "name": "Skopje",
    "shortCode": "85"
  }, {
    "name": "Sopište",
    "shortCode": "70"
  }, {
    "name": "Staro Nagoričane",
    "shortCode": "71"
  }, {
    "name": "Struga",
    "shortCode": "72"
  }, {
    "name": "Strumica",
    "shortCode": "73"
  }, {
    "name": "Studeničani",
    "shortCode": "74"
  }, {
    "name": "Sveti Nikole",
    "shortCode": "69"
  }, {
    "name": "Štip",
    "shortCode": "83"
  }, {
    "name": "Tearce",
    "shortCode": "75"
  }, {
    "name": "Tetovo",
    "shortCode": "76"
  }, {
    "name": "Valandovo",
    "shortCode": "10"
  }, {
    "name": "Vasilevo",
    "shortCode": "11"
  }, {
    "name": "Veles",
    "shortCode": "13"
  }, {
    "name": "Vevčani",
    "shortCode": "12"
  }, {
    "name": "Vinica",
    "shortCode": "14"
  }, {
    "name": "Vrapčište",
    "shortCode": "16"
  }, {
    "name": "Zelenikovo",
    "shortCode": "32"
  }, {
    "name": "Zrnovci",
    "shortCode": "33"
  }, {
    "name": "Želino",
    "shortCode": "30"
  }]
}, {
  "countryName": "Madagascar",
  "countryShortCode": "MG",
  "regions": [{
    "name": "Antananarivo",
    "shortCode": "T"
  }, {
    "name": "Antsiranana",
    "shortCode": "D"
  }, {
    "name": "Fianarantsoa",
    "shortCode": "F"
  }, {
    "name": "Mahajanga",
    "shortCode": "M"
  }, {
    "name": "Toamasina",
    "shortCode": "A"
  }, {
    "name": "Toliara",
    "shortCode": "U"
  }]
}, {
  "countryName": "Malawi",
  "countryShortCode": "MW",
  "regions": [{
    "name": "Balaka",
    "shortCode": "BA"
  }, {
    "name": "Blantyre",
    "shortCode": "BL"
  }, {
    "name": "Chikwawa",
    "shortCode": "CK"
  }, {
    "name": "Chiradzulu",
    "shortCode": "CR"
  }, {
    "name": "Chitipa",
    "shortCode": "CT"
  }, {
    "name": "Dedza",
    "shortCode": "DE"
  }, {
    "name": "Dowa",
    "shortCode": "DO"
  }, {
    "name": "Karonga",
    "shortCode": "KR"
  }, {
    "name": "Kasungu",
    "shortCode": "KS"
  }, {
    "name": "Likoma",
    "shortCode": "LK"
  }, {
    "name": "Lilongwe",
    "shortCode": "LI"
  }, {
    "name": "Machinga",
    "shortCode": "MH"
  }, {
    "name": "Mangochi",
    "shortCode": "MG"
  }, {
    "name": "Mchinji",
    "shortCode": "MC"
  }, {
    "name": "Mulanje",
    "shortCode": "MU"
  }, {
    "name": "Mwanza",
    "shortCode": "MW"
  }, {
    "name": "Mzimba",
    "shortCode": "MZ"
  }, {
    "name": "Nkhata Bay",
    "shortCode": "NE"
  }, {
    "name": "Nkhotakota",
    "shortCode": "NB"
  }, {
    "name": "Nsanje",
    "shortCode": "NS"
  }, {
    "name": "Ntcheu",
    "shortCode": "NU"
  }, {
    "name": "Ntchisi",
    "shortCode": "NI"
  }, {
    "name": "Phalombe",
    "shortCode": "PH"
  }, {
    "name": "Rumphi",
    "shortCode": "RU"
  }, {
    "name": "Salima",
    "shortCode": "SA"
  }, {
    "name": "Thyolo",
    "shortCode": "TH"
  }, {
    "name": "Zomba",
    "shortCode": "ZO"
  }]
}, {
  "countryName": "Malaysia",
  "countryShortCode": "MY",
  "regions": [{
    "name": "Johor",
    "shortCode": "01"
  }, {
    "name": "Kedah",
    "shortCode": "02"
  }, {
    "name": "Kelantan",
    "shortCode": "03"
  }, {
    "name": "Melaka",
    "shortCode": "04"
  }, {
    "name": "Negeri Sembilan",
    "shortCode": "05"
  }, {
    "name": "Pahang",
    "shortCode": "06"
  }, {
    "name": "Perak",
    "shortCode": "08"
  }, {
    "name": "Perlis",
    "shortCode": "09"
  }, {
    "name": "Pulau Pinang",
    "shortCode": "07"
  }, {
    "name": "Sabah",
    "shortCode": "12"
  }, {
    "name": "Sarawak",
    "shortCode": "13"
  }, {
    "name": "Selangor",
    "shortCode": "10"
  }, {
    "name": "Terengganu",
    "shortCode": "11"
  }, {
    "name": "Wilayah Persekutuan (Kuala Lumpur)",
    "shortCode": "14"
  }, {
    "name": "Wilayah Persekutuan (Labuan)",
    "shortCode": "15"
  }, {
    "name": "Wilayah Persekutuan (Putrajaya)",
    "shortCode": "16"
  }]
}, {
  "countryName": "Maldives",
  "countryShortCode": "MV",
  "regions": [{
    "name": "Alifu Alifu",
    "shortCode": "02"
  }, {
    "name": "Alifu Dhaalu",
    "shortCode": "00"
  }, {
    "name": "Baa",
    "shortCode": "20"
  }, {
    "name": "Dhaalu",
    "shortCode": "17"
  }, {
    "name": "Faafu",
    "shortCode": "14"
  }, {
    "name": "Gaafu Alifu",
    "shortCode": "27"
  }, {
    "name": "Gaafu Dhaalu",
    "shortCode": "28"
  }, {
    "name": "Gnaviyani",
    "shortCode": "29"
  }, {
    "name": "Haa Alifu",
    "shortCode": "07"
  }, {
    "name": "Haa Dhaalu",
    "shortCode": "23"
  }, {
    "name": "Kaafu",
    "shortCode": "29"
  }, {
    "name": "Laamu",
    "shortCode": "05"
  }, {
    "name": "Lhaviyani",
    "shortCode": "03"
  }, {
    "name": "Malé",
    "shortCode": "MLE"
  }, {
    "name": "Meemu",
    "shortCode": "12"
  }, {
    "name": "Noonu",
    "shortCode": "25"
  }, {
    "name": "Raa",
    "shortCode": "13"
  }, {
    "name": "Seenu",
    "shortCode": "01"
  }, {
    "name": "Shaviyani",
    "shortCode": "24"
  }, {
    "name": "Thaa",
    "shortCode": "08"
  }, {
    "name": "Vaavu",
    "shortCode": "04"
  }]
}, {
  "countryName": "Mali",
  "countryShortCode": "ML",
  "regions": [{
    "name": "Bamako",
    "shortCode": "BKO"
  }, {
    "name": "Gao",
    "shortCode": "7"
  }, {
    "name": "Kayes",
    "shortCode": "1"
  }, {
    "name": "Kidal",
    "shortCode": "8"
  }, {
    "name": "Koulikoro",
    "shortCode": "2"
  }, {
    "name": "Mopti",
    "shortCode": "5"
  }, {
    "name": "Segou",
    "shortCode": "4"
  }, {
    "name": "Sikasso",
    "shortCode": "3"
  }, {
    "name": "Tombouctou",
    "shortCode": "6"
  }]
}, {
  "countryName": "Malta",
  "countryShortCode": "MT",
  "regions": [{
    "name": "Attard",
    "shortCode": "01"
  }, {
    "name": "Balzan",
    "shortCode": "02"
  }, {
    "name": "Birgu",
    "shortCode": "03"
  }, {
    "name": "Birkirkara",
    "shortCode": "04"
  }, {
    "name": "Birżebbuġa",
    "shortCode": "05"
  }, {
    "name": "Bormla",
    "shortCode": "06"
  }, {
    "name": "Dingli",
    "shortCode": "07"
  }, {
    "name": "Fgura",
    "shortCode": "08"
  }, {
    "name": "Floriana",
    "shortCode": "09"
  }, {
    "name": "Fontana",
    "shortCode": "10"
  }, {
    "name": "Guda",
    "shortCode": "11"
  }, {
    "name": "Gżira",
    "shortCode": "12"
  }, {
    "name": "Għajnsielem",
    "shortCode": "13"
  }, {
    "name": "Għarb",
    "shortCode": "14"
  }, {
    "name": "Għargħur",
    "shortCode": "15"
  }, {
    "name": "Għasri",
    "shortCode": "16"
  }, {
    "name": "Għaxaq",
    "shortCode": "17"
  }, {
    "name": "Ħamrun",
    "shortCode": "18"
  }, {
    "name": "Iklin",
    "shortCode": "19"
  }, {
    "name": "Isla",
    "shortCode": "20"
  }, {
    "name": "Kalkara",
    "shortCode": "21"
  }, {
    "name": "Kerċem",
    "shortCode": "22"
  }, {
    "name": "Kirkop",
    "shortCode": "23"
  }, {
    "name": "Lija",
    "shortCode": "24"
  }, {
    "name": "Luqa",
    "shortCode": "25"
  }, {
    "name": "Marsa",
    "shortCode": "26"
  }, {
    "name": "Marsaskala",
    "shortCode": "27"
  }, {
    "name": "Marsaxlokk",
    "shortCode": "28"
  }, {
    "name": "Mdina",
    "shortCode": "29"
  }, {
    "name": "Mellieħa",
    "shortCode": "30"
  }, {
    "name": "Mġarr",
    "shortCode": "31"
  }, {
    "name": "Mosta",
    "shortCode": "32"
  }, {
    "name": "Mqabba",
    "shortCode": "33"
  }, {
    "name": "Msida",
    "shortCode": "34"
  }, {
    "name": "Mtarfa",
    "shortCode": "35"
  }, {
    "name": "Munxar",
    "shortCode": "36"
  }, {
    "name": "Nadur",
    "shortCode": "37"
  }, {
    "name": "Naxxar",
    "shortCode": "38"
  }, {
    "name": "Paola",
    "shortCode": "39"
  }, {
    "name": "Pembroke",
    "shortCode": "40"
  }, {
    "name": "Pietà",
    "shortCode": "41"
  }, {
    "name": "Qala",
    "shortCode": "42"
  }, {
    "name": "Qormi",
    "shortCode": "43"
  }, {
    "name": "Qrendi",
    "shortCode": "44"
  }, {
    "name": "Rabat Għawdex",
    "shortCode": "45"
  }, {
    "name": "Rabat Malta",
    "shortCode": "46"
  }, {
    "name": "Safi",
    "shortCode": "47"
  }, {
    "name": "San Ġiljan",
    "shortCode": "48"
  }, {
    "name": "San Ġwann",
    "shortCode": "49"
  }, {
    "name": "San Lawrenz",
    "shortCode": "50"
  }, {
    "name": "San Pawl il-Baħar",
    "shortCode": "51"
  }, {
    "name": "Sannat",
    "shortCode": "52"
  }, {
    "name": "Santa Luċija",
    "shortCode": "53"
  }, {
    "name": "Santa Venera",
    "shortCode": "54"
  }, {
    "name": "Siġġiewi",
    "shortCode": "55"
  }, {
    "name": "Sliema",
    "shortCode": "56"
  }, {
    "name": "Swieqi",
    "shortCode": "57"
  }, {
    "name": "Tai Xbiex",
    "shortCode": "58"
  }, {
    "name": "Tarzien",
    "shortCode": "59"
  }, {
    "name": "Valletta",
    "shortCode": "60"
  }, {
    "name": "Xagħra",
    "shortCode": "61"
  }, {
    "name": "Xewkija",
    "shortCode": "62"
  }, {
    "name": "Xgħajra",
    "shortCode": "63"
  }, {
    "name": "Żabbar",
    "shortCode": "64"
  }, {
    "name": "Żebbuġ Għawde",
    "shortCode": "65"
  }, {
    "name": "Żebbuġ Malta",
    "shortCode": "66"
  }, {
    "name": "Żejtun",
    "shortCode": "67"
  }, {
    "name": "Żurrieq",
    "shortCode": "68"
  }]
}, {
  "countryName": "Marshall Islands",
  "countryShortCode": "MH",
  "regions": [{
    "name": "Ailinglaplap",
    "shortCode": "ALL"
  }, {
    "name": "Ailuk",
    "shortCode": "ALK"
  }, {
    "name": "Arno",
    "shortCode": "ARN"
  }, {
    "name": "Aur",
    "shortCode": "AUR"
  }, {
    "name": "Bikini and Kili",
    "shortCode": "KIL"
  }, {
    "name": "Ebon",
    "shortCode": "EBO"
  }, {
    "name": "Jabat",
    "shortCode": "JAB"
  }, {
    "name": "Jaluit",
    "shortCode": "JAL"
  }, {
    "name": "Kwajalein",
    "shortCode": "KWA"
  }, {
    "name": "Lae",
    "shortCode": "LAE"
  }, {
    "name": "Lib",
    "shortCode": "LIB"
  }, {
    "name": "Likiep",
    "shortCode": "LIK"
  }, {
    "name": "Majuro",
    "shortCode": "MAJ"
  }, {
    "name": "Maloelap",
    "shortCode": "MAL"
  }, {
    "name": "Mejit",
    "shortCode": "MEJ"
  }, {
    "name": "Namdrik",
    "shortCode": "NMK"
  }, {
    "name": "Namu",
    "shortCode": "NMU"
  }, {
    "name": "Rongelap",
    "shortCode": "RON"
  }, {
    "name": "Ujae",
    "shortCode": "UJA"
  }, {
    "name": "Utrik",
    "shortCode": "UTI"
  }, {
    "name": "Wotho",
    "shortCode": "WTH"
  }, {
    "name": "Wotje",
    "shortCode": "WTJ"
  }]
}, {
  "countryName": "Martinique",
  "countryShortCode": "MQ",
  "regions": [{
    "name": "Martinique"
  }]
}, {
  "countryName": "Mauritania",
  "countryShortCode": "MR",
  "regions": [{
    "name": "Adrar",
    "shortCode": "07"
  }, {
    "name": "Assaba",
    "shortCode": "03"
  }, {
    "name": "Brakna",
    "shortCode": "05"
  }, {
    "name": "Dakhlet Nouadhibou",
    "shortCode": "08"
  }, {
    "name": "Gorgol",
    "shortCode": "04"
  }, {
    "name": "Guidimaka",
    "shortCode": "10"
  }, {
    "name": "Hodh Ech Chargui",
    "shortCode": "01"
  }, {
    "name": "Hodh El Gharbi",
    "shortCode": "02"
  }, {
    "name": "Inchiri",
    "shortCode": "12"
  }, {
    "name": "Nouakchott Nord",
    "shortCode": "14"
  }, {
    "name": "Nouakchott Ouest",
    "shortCode": "13"
  }, {
    "name": "Nouakchott Sud",
    "shortCode": "15"
  }, {
    "name": "Tagant",
    "shortCode": "09"
  }, {
    "name": "Tiris Zemmour",
    "shortCode": "11"
  }, {
    "name": "Trarza",
    "shortCode": "06"
  }]
}, {
  "countryName": "Mauritius",
  "countryShortCode": "MU",
  "regions": [{
    "name": "Agalega Islands",
    "shortCode": "AG"
  }, {
    "name": "Beau Bassin-Rose Hill",
    "shortCode": "BR"
  }, {
    "name": "Black River",
    "shortCode": "BL"
  }, {
    "name": "Cargados Carajos Shoals",
    "shortCode": "CC"
  }, {
    "name": "Curepipe",
    "shortCode": "CU"
  }, {
    "name": "Flacq",
    "shortCode": "FL"
  }, {
    "name": "Grand Port",
    "shortCode": "GP"
  }, {
    "name": "Moka",
    "shortCode": "MO"
  }, {
    "name": "Pamplemousses",
    "shortCode": "PA"
  }, {
    "name": "Plaines Wilhems",
    "shortCode": "PW"
  }, {
    "name": "Port Louis (City)",
    "shortCode": "PU"
  }, {
    "name": "Port Louis",
    "shortCode": "PL"
  }, {
    "name": "Riviere du Rempart",
    "shortCode": "RR"
  }, {
    "name": "Rodrigues Island",
    "shortCode": "RO"
  }, {
    "name": "Savanne",
    "shortCode": "SA"
  }, {
    "name": "Vacoas-Phoenix",
    "shortCode": "CP"
  }]
}, {
  "countryName": "Mayotte",
  "countryShortCode": "YT",
  "regions": [{
    "name": "Dzaoudzi",
    "shortCode": "01"
  }, {
    "name": "Pamandzi",
    "shortCode": "02"
  }, {
    "name": "Mamoudzou",
    "shortCode": "03"
  }, {
    "name": "Dembeni",
    "shortCode": "04"
  }, {
    "name": "Bandrélé",
    "shortCode": "05"
  }, {
    "name": "Kani-Kéli",
    "shortCode": "06"
  }, {
    "name": "Bouéni",
    "shortCode": "07"
  }, {
    "name": "Chirongui",
    "shortCode": "08"
  }, {
    "name": "Sada",
    "shortCode": "09"
  }, {
    "name": "Ouangani",
    "shortCode": "10"
  }, {
    "name": "Chiconi",
    "shortCode": "11"
  }, {
    "name": "Tsingoni",
    "shortCode": "12"
  }, {
    "name": "M'Tsangamouji",
    "shortCode": "13"
  }, {
    "name": "Acoua",
    "shortCode": "14"
  }, {
    "name": "Mtsamboro",
    "shortCode": "15"
  }, {
    "name": "Bandraboua",
    "shortCode": "16"
  }, {
    "name": "Koungou",
    "shortCode": "17"
  }]
}, {
  "countryName": "Mexico",
  "countryShortCode": "MX",
  "regions": [{
    "name": "Aguascalientes",
    "shortCode": "AGU"
  }, {
    "name": "Baja California",
    "shortCode": "BCN"
  }, {
    "name": "Baja California Sur",
    "shortCode": "BCS"
  }, {
    "name": "Campeche",
    "shortCode": "CAM"
  }, {
    "name": "Ciudad de México",
    "shortCode": "DIF"
  }, {
    "name": "Chiapas",
    "shortCode": "CHP"
  }, {
    "name": "Chihuahua",
    "shortCode": "CHH"
  }, {
    "name": "Coahuila de Zaragoza",
    "shortCode": "COA"
  }, {
    "name": "Colima",
    "shortCode": "COL"
  }, {
    "name": "Durango",
    "shortCode": "DUR"
  }, {
    "name": "Estado de México",
    "shortCode": "MEX"
  }, {
    "name": "Guanajuato",
    "shortCode": "GUA"
  }, {
    "name": "Guerrero",
    "shortCode": "GRO"
  }, {
    "name": "Hidalgo",
    "shortCode": "HID"
  }, {
    "name": "Jalisco",
    "shortCode": "JAL"
  }, {
    "name": "Michoacán de Ocampo",
    "shortCode": "MIC"
  }, {
    "name": "Morelos",
    "shortCode": "MOR"
  }, {
    "name": "Nayarit",
    "shortCode": "NAY"
  }, {
    "name": "Nuevo León",
    "shortCode": "NLE"
  }, {
    "name": "Oaxaca",
    "shortCode": "OAX"
  }, {
    "name": "Puebla",
    "shortCode": "PUE"
  }, {
    "name": "Querétaro de Arteaga",
    "shortCode": "QUE"
  }, {
    "name": "Quintana Roo",
    "shortCode": "ROO"
  }, {
    "name": "San Luis Potosí",
    "shortCode": "SLP"
  }, {
    "name": "Sinaloa",
    "shortCode": "SIN"
  }, {
    "name": "Sonora",
    "shortCode": "SON"
  }, {
    "name": "Tabasco",
    "shortCode": "TAB"
  }, {
    "name": "Tamaulipas",
    "shortCode": "TAM"
  }, {
    "name": "Tlaxcala",
    "shortCode": "TLA"
  }, {
    "name": "Veracruz",
    "shortCode": "VER"
  }, {
    "name": "Yucatán",
    "shortCode": "YUC"
  }, {
    "name": "Zacatecas",
    "shortCode": "ZAC"
  }]
}, {
  "countryName": "Micronesia, Federated States of",
  "countryShortCode": "FM",
  "regions": [{
    "name": "Chuuk (Truk)",
    "shortCode": "TRK"
  }, {
    "name": "Kosrae",
    "shortCode": "KSA"
  }, {
    "name": "Pohnpei",
    "shortCode": "PNI"
  }, {
    "name": "Yap",
    "shortCode": "YAP"
  }]
}, {
  "countryName": "Moldova",
  "countryShortCode": "MD",
  "regions": [{
    "name": "Aenii Noi",
    "shortCode": "AN"
  }, {
    "name": "Basarabeasca",
    "shortCode": "BS"
  }, {
    "name": "Bălți",
    "shortCode": "BA"
  }, {
    "name": "Bender",
    "shortCode": "BD"
  }, {
    "name": "Briceni",
    "shortCode": "BR"
  }, {
    "name": "Cahul",
    "shortCode": "CA"
  }, {
    "name": "Cantemir",
    "shortCode": "CT"
  }, {
    "name": "Călărași",
    "shortCode": "CL"
  }, {
    "name": "Căușeni",
    "shortCode": "CS"
  }, {
    "name": "Chișinău",
    "shortCode": "CU"
  }, {
    "name": "Cimișlia",
    "shortCode": "CM"
  }, {
    "name": "Criuleni",
    "shortCode": "CR"
  }, {
    "name": "Dondușeni",
    "shortCode": "DO"
  }, {
    "name": "Drochia",
    "shortCode": "DR"
  }, {
    "name": "Dubăsari",
    "shortCode": "DU"
  }, {
    "name": "Edineț",
    "shortCode": "ED"
  }, {
    "name": "Fălești",
    "shortCode": "FA"
  }, {
    "name": "Florești",
    "shortCode": "FL"
  }, {
    "name": "Găgăuzia",
    "shortCode": "GA"
  }, {
    "name": "Glodeni",
    "shortCode": "GL"
  }, {
    "name": "Hîncești",
    "shortCode": "HI"
  }, {
    "name": "Ialoveni",
    "shortCode": "IA"
  }, {
    "name": "Leova",
    "shortCode": "LE"
  }, {
    "name": "Nisporeni",
    "shortCode": "NI"
  }, {
    "name": "Ocnița",
    "shortCode": "OC"
  }, {
    "name": "Orhei",
    "shortCode": "OR"
  }, {
    "name": "Rezina",
    "shortCode": "RE"
  }, {
    "name": "Rîșcani",
    "shortCode": "RI"
  }, {
    "name": "Sîngerei",
    "shortCode": "SI"
  }, {
    "name": "Soroca",
    "shortCode": "SO"
  }, {
    "name": "Stînga Nistrului",
    "shortCode": "SN"
  }, {
    "name": "Strășeni",
    "shortCode": "ST"
  }, {
    "name": "Șoldănești",
    "shortCode": "SD"
  }, {
    "name": "Ștefan Vodă",
    "shortCode": "SV"
  }, {
    "name": "Taraclia",
    "shortCode": "TA"
  }, {
    "name": "Telenești",
    "shortCode": "TE"
  }, {
    "name": "Ungheni",
    "shortCode": "UN"
  }]
}, {
  "countryName": "Monaco",
  "countryShortCode": "MC",
  "regions": [{
    "name": "Colle",
    "shortCode": "CL"
  }, {
    "name": "Condamine",
    "shortCode": "CO"
  }, {
    "name": "Fontvieille",
    "shortCode": "FO"
  }, {
    "name": "Gare",
    "shortCode": "GA"
  }, {
    "name": "Jardin Exotique",
    "shortCode": "JE"
  }, {
    "name": "Larvotto",
    "shortCode": "LA"
  }, {
    "name": "Malbousquet",
    "shortCode": "MA"
  }, {
    "name": "Monaco-Ville",
    "shortCode": "MO"
  }, {
    "name": "Moneghetti",
    "shortCode": "MG"
  }, {
    "name": "Monte-Carlo",
    "shortCode": "MC"
  }, {
    "name": "Moulins",
    "shortCode": "MU"
  }, {
    "name": "Port-Hercule",
    "shortCode": "PH"
  }, {
    "name": "Saint-Roman",
    "shortCode": "SR"
  }, {
    "name": "Sainte-Dévote",
    "shortCode": "SD"
  }, {
    "name": "Source",
    "shortCode": "SO"
  }, {
    "name": "Spélugues",
    "shortCode": "SP"
  }, {
    "name": "Vallon de la Rousse",
    "shortCode": "VR"
  }]
}, {
  "countryName": "Mongolia",
  "countryShortCode": "MN",
  "regions": [{
    "name": "Arhangay",
    "shortCode": "073"
  }, {
    "name": "Bayan-Olgiy",
    "shortCode": "071"
  }, {
    "name": "Bayanhongor",
    "shortCode": "069"
  }, {
    "name": "Bulgan",
    "shortCode": "067"
  }, {
    "name": "Darhan",
    "shortCode": "037"
  }, {
    "name": "Dornod",
    "shortCode": "061"
  }, {
    "name": "Dornogovi",
    "shortCode": "063"
  }, {
    "name": "Dundgovi",
    "shortCode": "059"
  }, {
    "name": "Dzavhan",
    "shortCode": "065"
  }, {
    "name": "Govi-Altay",
    "shortCode": "065"
  }, {
    "name": "Govi-Sumber",
    "shortCode": "064"
  }, {
    "name": "Hovd",
    "shortCode": "043"
  }, {
    "name": "Hovsgol",
    "shortCode": "041"
  }, {
    "name": "Omnogovi",
    "shortCode": "053"
  }, {
    "name": "Ovorhangay",
    "shortCode": "055"
  }, {
    "name": "Selenge",
    "shortCode": "049"
  }, {
    "name": "Suhbaatar",
    "shortCode": "051"
  }, {
    "name": "Tov",
    "shortCode": "047"
  }, {
    "name": "Ulaanbaatar",
    "shortCode": "1"
  }, {
    "name": "Uvs",
    "shortCode": "046"
  }]
}, {
  "countryName": "Montenegro",
  "countryShortCode": "ME",
  "regions": [{
    "name": "Andrijevica",
    "shortCode": "01"
  }, {
    "name": "Bar",
    "shortCode": "02"
  }, {
    "name": "Berane",
    "shortCode": "03"
  }, {
    "name": "Bijelo Polje",
    "shortCode": "04"
  }, {
    "name": "Budva",
    "shortCode": "05"
  }, {
    "name": "Cetinje",
    "shortCode": "06"
  }, {
    "name": "Danilovgrad",
    "shortCode": "07"
  }, {
    "name": "Gusinje",
    "shortCode": "22"
  }, {
    "name": "Herceg Novi",
    "shortCode": "08"
  }, {
    "name": "Kolašin",
    "shortCode": "09"
  }, {
    "name": "Kotor",
    "shortCode": "10"
  }, {
    "name": "Mojkovac",
    "shortCode": "11"
  }, {
    "name": "Nikšić",
    "shortCode": "12"
  }, {
    "name": "Petnica",
    "shortCode": "23"
  }, {
    "name": "Plav",
    "shortCode": "13"
  }, {
    "name": "Plužine",
    "shortCode": "14"
  }, {
    "name": "Pljevlja",
    "shortCode": "15"
  }, {
    "name": "Podgorica",
    "shortCode": "16"
  }, {
    "name": "Rožaje",
    "shortCode": "17"
  }, {
    "name": "Šavnik",
    "shortCode": "18"
  }, {
    "name": "Tivat",
    "shortCode": "19"
  }, {
    "name": "Ulcinj",
    "shortCode": "20"
  }, {
    "name": "Žabljak",
    "shortCode": "21"
  }]
}, {
  "countryName": "Montserrat",
  "countryShortCode": "MS",
  "regions": [{
    "name": "Saint Anthony"
  }, {
    "name": "Saint Georges"
  }, {
    "name": "Saint Peter's"
  }]
}, {
  "countryName": "Morocco",
  "countryShortCode": "MA",
  "regions": [{
    "name": "Chaouia-Ouardigha",
    "shortCode": "09"
  }, {
    "name": "Doukhala-Abda",
    "shortCode": "10"
  }, {
    "name": "Fès-Boulemane",
    "shortCode": "05"
  }, {
    "name": "Gharb-Chrarda-Beni Hssen",
    "shortCode": "02"
  }, {
    "name": "Grand Casablanca",
    "shortCode": "08"
  }, {
    "name": "Guelmim-Es Semara",
    "shortCode": "14"
  }, {
    "name": "Laâyoune-Boujdour-Sakia el Hamra",
    "shortCode": "15"
  }, {
    "name": "Marrakech-Tensift-Al Haouz",
    "shortCode": "11"
  }, {
    "name": "Meknès-Tafilalet",
    "shortCode": "06"
  }, {
    "name": "Oriental",
    "shortCode": "04"
  }, {
    "name": "Oued ed Dahab-Lagouira",
    "shortCode": "16"
  }, {
    "name": "Souss-Massa-Drâa",
    "shortCode": "13"
  }, {
    "name": "Tadla-Azilal",
    "shortCode": "12"
  }, {
    "name": "Tanger-Tétouan",
    "shortCode": "01"
  }, {
    "name": "Taza-Al Hoceima-Taounate",
    "shortCode": "03"
  }]
}, {
  "countryName": "Mozambique",
  "countryShortCode": "MZ",
  "regions": [{
    "name": "Cabo Delgado",
    "shortCode": "P"
  }, {
    "name": "Gaza",
    "shortCode": "G"
  }, {
    "name": "Inhambane",
    "shortCode": "I"
  }, {
    "name": "Manica",
    "shortCode": "B"
  }, {
    "name": "Maputo",
    "shortCode": "L"
  }, {
    "name": "Maputo (City)",
    "shortCode": "MPM"
  }, {
    "name": "Nampula",
    "shortCode": "N"
  }, {
    "name": "Niassa",
    "shortCode": "A"
  }, {
    "name": "Sofala",
    "shortCode": "S"
  }, {
    "name": "Tete",
    "shortCode": "T"
  }, {
    "name": "Zambezia",
    "shortCode": "Q"
  }]
}, {
  "countryName": "Myanmar",
  "countryShortCode": "MM",
  "regions": [{
    "name": "Ayeyarwady",
    "shortCode": "07"
  }, {
    "name": "Bago",
    "shortCode": "02"
  }, {
    "name": "Chin",
    "shortCode": "14"
  }, {
    "name": "Kachin",
    "shortCode": "11"
  }, {
    "name": "Kayah",
    "shortCode": "12"
  }, {
    "name": "Kayin",
    "shortCode": "13"
  }, {
    "name": "Magway",
    "shortCode": "03"
  }, {
    "name": "Mandalay",
    "shortCode": "04"
  }, {
    "name": "Mon",
    "shortCode": "15"
  }, {
    "name": "Nay Pyi Taw",
    "shortCode": "18"
  }, {
    "name": "Rakhine",
    "shortCode": "16"
  }, {
    "name": "Sagaing",
    "shortCode": "01"
  }, {
    "name": "Shan",
    "shortCode": "17"
  }, {
    "name": "Tanintharyi",
    "shortCode": "05"
  }, {
    "name": "Yangon",
    "shortCode": "06"
  }]
}, {
  "countryName": "Namibia",
  "countryShortCode": "NA",
  "regions": [{
    "name": "Erongo",
    "shortCode": "ER"
  }, {
    "name": "Hardap",
    "shortCode": "HA"
  }, {
    "name": "Kavango East",
    "shortCode": "KE"
  }, {
    "name": "Kavango West",
    "shortCode": "KW"
  }, {
    "name": "Karas",
    "shortCode": "KA"
  }, {
    "name": "Khomas",
    "shortCode": "KH"
  }, {
    "name": "Kunene",
    "shortCode": "KU"
  }, {
    "name": "Ohangwena",
    "shortCode": "OW"
  }, {
    "name": "Omaheke",
    "shortCode": "OH"
  }, {
    "name": "Omusati",
    "shortCode": "OS"
  }, {
    "name": "Oshana",
    "shortCode": "ON"
  }, {
    "name": "Oshikoto",
    "shortCode": "OT"
  }, {
    "name": "Otjozondjupa",
    "shortCode": "OD"
  }, {
    "name": "Zambezi",
    "shortCode": "CA"
  }]
}, {
  "countryName": "Nauru",
  "countryShortCode": "NR",
  "regions": [{
    "name": "Aiwo",
    "shortCode": "01"
  }, {
    "name": "Anabar",
    "shortCode": "02"
  }, {
    "name": "Anetan",
    "shortCode": "03"
  }, {
    "name": "Anibare",
    "shortCode": "04"
  }, {
    "name": "Baiti",
    "shortCode": "05"
  }, {
    "name": "Boe",
    "shortCode": "06"
  }, {
    "name": "Buada",
    "shortCode": "07"
  }, {
    "name": "Denigomodu",
    "shortCode": "08"
  }, {
    "name": "Ewa",
    "shortCode": "09"
  }, {
    "name": "Ijuw",
    "shortCode": "10"
  }, {
    "name": "Meneng",
    "shortCode": "11"
  }, {
    "name": "Nibok",
    "shortCode": "12"
  }, {
    "name": "Uaboe",
    "shortCode": "13"
  }, {
    "name": "Yaren",
    "shortCode": "14"
  }]
}, {
  "countryName": "Nepal",
  "countryShortCode": "NP",
  "regions": [{
    "name": "Bagmati",
    "shortCode": "BA"
  }, {
    "name": "Bheri",
    "shortCode": "BH"
  }, {
    "name": "Dhawalagiri",
    "shortCode": "DH"
  }, {
    "name": "Gandaki",
    "shortCode": "GA"
  }, {
    "name": "Janakpur",
    "shortCode": "JA"
  }, {
    "name": "Karnali",
    "shortCode": "KA"
  }, {
    "name": "Kosi",
    "shortCode": "KO"
  }, {
    "name": "Lumbini",
    "shortCode": "LU"
  }, {
    "name": "Mahakali",
    "shortCode": "MA"
  }, {
    "name": "Mechi",
    "shortCode": "ME"
  }, {
    "name": "Narayani",
    "shortCode": "NA"
  }, {
    "name": "Rapti",
    "shortCode": "RA"
  }, {
    "name": "Sagarmatha",
    "shortCode": "SA"
  }, {
    "name": "Seti",
    "shortCode": "SE"
  }]
}, {
  "countryName": "Netherlands",
  "countryShortCode": "NL",
  "regions": [{
    "name": "Drenthe",
    "shortCode": "DR"
  }, {
    "name": "Flevoland",
    "shortCode": "FL"
  }, {
    "name": "Friesland",
    "shortCode": "FR"
  }, {
    "name": "Gelderland",
    "shortCode": "GE"
  }, {
    "name": "Groningen",
    "shortCode": "GR"
  }, {
    "name": "Limburg",
    "shortCode": "LI"
  }, {
    "name": "Noord-Brabant",
    "shortCode": "NB"
  }, {
    "name": "Noord-Holland",
    "shortCode": "NH"
  }, {
    "name": "Overijssel",
    "shortCode": "OV"
  }, {
    "name": "Utrecht",
    "shortCode": "UT"
  }, {
    "name": "Zeeland",
    "shortCode": "ZE"
  }, {
    "name": "Zuid-Holland",
    "shortCode": "ZH"
  }]
}, {
  "countryName": "New Caledonia",
  "countryShortCode": "NC",
  "regions": [{
    "name": "Iles Loyaute"
  }, {
    "name": "Nord"
  }, {
    "name": "Sud"
  }]
}, {
  "countryName": "New Zealand",
  "countryShortCode": "NZ",
  "regions": [{
    "name": "Auckland",
    "shortCode": "AUK"
  }, {
    "name": "Bay of Plenty",
    "shortCode": "BOP"
  }, {
    "name": "Canterbury",
    "shortCode": "CAN"
  }, {
    "name": "Gisborne",
    "shortCode": "GIS"
  }, {
    "name": "Hawke's Bay",
    "shortCode": "HKB"
  }, {
    "name": "Marlborough",
    "shortCode": "MBH"
  }, {
    "name": "Manawatu-Wanganui",
    "shortCode": "MWT"
  }, {
    "name": "Northland",
    "shortCode": "NTL"
  }, {
    "name": "Nelson",
    "shortCode": "NSN"
  }, {
    "name": "Otago",
    "shortCode": "OTA"
  }, {
    "name": "Southland",
    "shortCode": "STL"
  }, {
    "name": "Taranaki",
    "shortCode": "TKI"
  }, {
    "name": "Tasman",
    "shortCode": "TAS"
  }, {
    "name": "Waikato",
    "shortCode": "WKO"
  }, {
    "name": "Wellington",
    "shortCode": "WGN"
  }, {
    "name": "West Coast",
    "shortCode": "WTC"
  }, {
    "name": "Chatham Islands Territory",
    "shortCode": "CIT"
  }]
}, {
  "countryName": "Nicaragua",
  "countryShortCode": "NI",
  "regions": [{
    "name": "Boaco",
    "shortCode": "BO"
  }, {
    "name": "Carazo",
    "shortCode": "CA"
  }, {
    "name": "Chinandega",
    "shortCode": "CI"
  }, {
    "name": "Chontales",
    "shortCode": "CO"
  }, {
    "name": "Estelí",
    "shortCode": "ES"
  }, {
    "name": "Granada",
    "shortCode": "GR"
  }, {
    "name": "Jinotega",
    "shortCode": "JI"
  }, {
    "name": "León",
    "shortCode": "LE"
  }, {
    "name": "Madriz",
    "shortCode": "MD"
  }, {
    "name": "Managua",
    "shortCode": "MN"
  }, {
    "name": "Masaya",
    "shortCode": "MS"
  }, {
    "name": "Matagalpa",
    "shortCode": "MT"
  }, {
    "name": "Nueva Segovia",
    "shortCode": "NS"
  }, {
    "name": "Río San Juan",
    "shortCode": "SJ"
  }, {
    "name": "Rivas",
    "shortCode": "RI"
  }, {
    "name": "Atlántico Norte",
    "shortCode": "AN"
  }, {
    "name": "Atlántico Sur",
    "shortCode": "AS"
  }]
}, {
  "countryName": "Niger",
  "countryShortCode": "NE",
  "regions": [{
    "name": "Agadez",
    "shortCode": "1"
  }, {
    "name": "Diffa",
    "shortCode": "2"
  }, {
    "name": "Dosso",
    "shortCode": "3"
  }, {
    "name": "Maradi",
    "shortCode": "4"
  }, {
    "name": "Niamey",
    "shortCode": "8"
  }, {
    "name": "Tahoua",
    "shortCode": "5"
  }, {
    "name": "Tillabéri",
    "shortCode": "6"
  }, {
    "name": "Zinder",
    "shortCode": "7"
  }]
}, {
  "countryName": "Nigeria",
  "countryShortCode": "NG",
  "regions": [{
    "name": "Abia",
    "shortCode": "AB"
  }, {
    "name": "Abuja Federal Capital Territory",
    "shortCode": "FC"
  }, {
    "name": "Adamawa",
    "shortCode": "AD"
  }, {
    "name": "Akwa Ibom",
    "shortCode": "AK"
  }, {
    "name": "Anambra",
    "shortCode": "AN"
  }, {
    "name": "Bauchi",
    "shortCode": "BA"
  }, {
    "name": "Bayelsa",
    "shortCode": "BY"
  }, {
    "name": "Benue",
    "shortCode": "BE"
  }, {
    "name": "Borno",
    "shortCode": "BO"
  }, {
    "name": "Cross River",
    "shortCode": "CR"
  }, {
    "name": "Delta",
    "shortCode": "DE"
  }, {
    "name": "Ebonyi",
    "shortCode": "EB"
  }, {
    "name": "Edo",
    "shortCode": "ED"
  }, {
    "name": "Ekiti",
    "shortCode": "EK"
  }, {
    "name": "Enugu",
    "shortCode": "EN"
  }, {
    "name": "Gombe",
    "shortCode": "GO"
  }, {
    "name": "Imo",
    "shortCode": "IM"
  }, {
    "name": "Jigawa",
    "shortCode": "JI"
  }, {
    "name": "Kaduna",
    "shortCode": "KD"
  }, {
    "name": "Kano",
    "shortCode": "KN"
  }, {
    "name": "Katsina",
    "shortCode": "KT"
  }, {
    "name": "Kebbi",
    "shortCode": "KE"
  }, {
    "name": "Kogi",
    "shortCode": "KO"
  }, {
    "name": "Kwara",
    "shortCode": "KW"
  }, {
    "name": "Lagos",
    "shortCode": "LA"
  }, {
    "name": "Nassarawa",
    "shortCode": "NA"
  }, {
    "name": "Niger",
    "shortCode": "NI"
  }, {
    "name": "Ogun",
    "shortCode": "OG"
  }, {
    "name": "Ondo",
    "shortCode": "ON"
  }, {
    "name": "Osun",
    "shortCode": "OS"
  }, {
    "name": "Oyo",
    "shortCode": "OY"
  }, {
    "name": "Plateau",
    "shortCode": "PL"
  }, {
    "name": "Rivers",
    "shortCode": "RI"
  }, {
    "name": "Sokoto",
    "shortCode": "SO"
  }, {
    "name": "Taraba",
    "shortCode": "TA"
  }, {
    "name": "Yobe",
    "shortCode": "YO"
  }, {
    "name": "Zamfara",
    "shortCode": "ZA"
  }]
}, {
  "countryName": "Niue",
  "countryShortCode": "NU",
  "regions": [{
    "name": "Niue"
  }]
}, {
  "countryName": "Norfolk Island",
  "countryShortCode": "NF",
  "regions": [{
    "name": "Norfolk Island"
  }]
}, {
  "countryName": "Northern Mariana Islands",
  "countryShortCode": "MP",
  "regions": [{
    "name": "Northern Islands"
  }, {
    "name": "Rota"
  }, {
    "name": "Saipan"
  }, {
    "name": "Tinian"
  }]
}, {
  "countryName": "Norway",
  "countryShortCode": "NO",
  "regions": [{
    "name": "Akershus",
    "shortCode": "02"
  }, {
    "name": "Aust-Agder",
    "shortCode": "09"
  }, {
    "name": "Buskerud",
    "shortCode": "06"
  }, {
    "name": "Finnmark",
    "shortCode": "20"
  }, {
    "name": "Hedmark",
    "shortCode": "04"
  }, {
    "name": "Hordaland",
    "shortCode": "12"
  }, {
    "name": "Møre og Romsdal",
    "shortCode": "15"
  }, {
    "name": "Nordland",
    "shortCode": "18"
  }, {
    "name": "Nord-Trøndelag",
    "shortCode": "17"
  }, {
    "name": "Oppland",
    "shortCode": "05"
  }, {
    "name": "Oslo",
    "shortCode": "03"
  }, {
    "name": "Rogaland",
    "shortCode": "11"
  }, {
    "name": "Sogn og Fjordane",
    "shortCode": "14"
  }, {
    "name": "Sør-Trøndelag",
    "shortCode": "16"
  }, {
    "name": "Telemark",
    "shortCode": "08"
  }, {
    "name": "Troms",
    "shortCode": "19"
  }, {
    "name": "Vest-Agder",
    "shortCode": "10"
  }, {
    "name": "Vestfold",
    "shortCode": "07"
  }, {
    "name": "Østfold",
    "shortCode": "01"
  }, {
    "name": "Jan Mayen",
    "shortCode": "22"
  }, {
    "name": "Svalbard",
    "shortCode": "21"
  }]
}, {
  "countryName": "Oman",
  "countryShortCode": "OM",
  "regions": [{
    "name": "Ad Dakhiliyah",
    "shortCode": "DA"
  }, {
    "name": "Al Buraymi",
    "shortCode": "BU"
  }, {
    "name": "Al Wusta",
    "shortCode": "WU"
  }, {
    "name": "Az Zahirah",
    "shortCode": "ZA"
  }, {
    "name": "Janub al Batinah",
    "shortCode": "BS"
  }, {
    "name": "Janub ash Sharqiyah",
    "shortCode": "SS"
  }, {
    "name": "Masqat",
    "shortCode": "MA"
  }, {
    "name": "Musandam",
    "shortCode": "MU"
  }, {
    "name": "Shamal al Batinah",
    "shortCode": "BJ"
  }, {
    "name": "Shamal ash Sharqiyah",
    "shortCode": "SJ"
  }, {
    "name": "Zufar",
    "shortCode": "ZU"
  }]
}, {
  "countryName": "Pakistan",
  "countryShortCode": "PK",
  "regions": [{
    "name": "Āzād Kashmīr",
    "shortCode": "JK"
  }, {
    "name": "Balōchistān",
    "shortCode": "BA"
  }, {
    "name": "Gilgit-Baltistān",
    "shortCode": "GB"
  }, {
    "name": "Islāmābād",
    "shortCode": "IS"
  }, {
    "name": "Khaībar Pakhtūnkhwās",
    "shortCode": "KP"
  }, {
    "name": "Punjāb",
    "shortCode": "PB"
  }, {
    "name": "Sindh",
    "shortCode": "SD"
  }, {
    "name": "Federally Administered Tribal Areas",
    "shortCode": "TA"
  }]
}, {
  "countryName": "Palau",
  "countryShortCode": "PW",
  "regions": [{
    "name": "Aimeliik",
    "shortCode": "002"
  }, {
    "name": "Airai",
    "shortCode": "004"
  }, {
    "name": "Angaur",
    "shortCode": "010"
  }, {
    "name": "Hatobohei",
    "shortCode": "050"
  }, {
    "name": "Kayangel",
    "shortCode": "100"
  }, {
    "name": "Koror",
    "shortCode": "150"
  }, {
    "name": "Melekeok",
    "shortCode": "212"
  }, {
    "name": "Ngaraard",
    "shortCode": "214"
  }, {
    "name": "Ngarchelong",
    "shortCode": "218"
  }, {
    "name": "Ngardmau",
    "shortCode": "222"
  }, {
    "name": "Ngatpang",
    "shortCode": "224"
  }, {
    "name": "Ngchesar",
    "shortCode": "226"
  }, {
    "name": "Ngeremlengui",
    "shortCode": "227"
  }, {
    "name": "Ngiwal",
    "shortCode": "228"
  }, {
    "name": "Peleliu",
    "shortCode": "350"
  }, {
    "name": "Sonsoral",
    "shortCode": "350"
  }]
}, {
  "countryName": "Palestine, State of",
  "countryShortCode": "PS",
  "regions": [{
    "name": "Ak Khalīl",
    "shortCode": "HBN"
  }, {
    "name": "Al Quds",
    "shortCode": "JEM"
  }, {
    "name": "Arīḩā wal Aghwār",
    "shortCode": "JRH"
  }, {
    "name": "Bayt Laḩm",
    "shortCode": "BTH"
  }, {
    "name": "Dayr al Balaḩ",
    "shortCode": "DEB"
  }, {
    "name": "Ghazzah",
    "shortCode": "GZA"
  }, {
    "name": "Janīn",
    "shortCode": "JEN"
  }, {
    "name": "Khān Yūnis",
    "shortCode": "KYS"
  }, {
    "name": "Nāblus",
    "shortCode": "NBS"
  }, {
    "name": "Qalqīyah",
    "shortCode": "QQA"
  }, {
    "name": "Rafaḩ",
    "shortCode": "RFH"
  }, {
    "name": "Rām Allāh wal Bīrah",
    "shortCode": "RBH"
  }, {
    "name": "Salfīt",
    "shortCode": "SLT"
  }, {
    "name": "Shamāl Ghazzah",
    "shortCode": "NGZ"
  }, {
    "name": "Ţūbās",
    "shortCode": "TBS"
  }, {
    "name": "Ţūlkarm",
    "shortCode": "TKM"
  }]
}, {
  "countryName": "Panama",
  "countryShortCode": "PA",
  "regions": [{
    "name": "Bocas del Toro",
    "shortCode": "1"
  }, {
    "name": "Chiriquí",
    "shortCode": "4"
  }, {
    "name": "Coclé",
    "shortCode": "2"
  }, {
    "name": "Colón",
    "shortCode": "3"
  }, {
    "name": "Darién",
    "shortCode": "5"
  }, {
    "name": "Emberá",
    "shortCode": "EM"
  }, {
    "name": "Herrera",
    "shortCode": "6"
  }, {
    "name": "Kuna Yala",
    "shortCode": "KY"
  }, {
    "name": "Los Santos",
    "shortCode": "7"
  }, {
    "name": "Ngäbe-Buglé",
    "shortCode": "NB"
  }, {
    "name": "Panamá",
    "shortCode": "8"
  }, {
    "name": "Panamá Oeste",
    "shortCode": "10"
  }, {
    "name": "Veraguas",
    "shortCode": "9"
  }]
}, {
  "countryName": "Papua New Guinea",
  "countryShortCode": "PG",
  "regions": [{
    "name": "Bougainville",
    "shortCode": "NSB"
  }, {
    "name": "Central",
    "shortCode": "CPM"
  }, {
    "name": "Chimbu",
    "shortCode": "CPK"
  }, {
    "name": "East New Britain",
    "shortCode": "EBR"
  }, {
    "name": "East Sepik",
    "shortCode": "ESW"
  }, {
    "name": "Eastern Highlands",
    "shortCode": "EHG"
  }, {
    "name": "Enga",
    "shortCode": "EPW"
  }, {
    "name": "Gulf",
    "shortCode": "GPK"
  }, {
    "name": "Hela",
    "shortCode": "HLA"
  }, {
    "name": "Jiwaka",
    "shortCode": "JWK"
  }, {
    "name": "Madang",
    "shortCode": "MOM"
  }, {
    "name": "Manus",
    "shortCode": "MRL"
  }, {
    "name": "Milne Bay",
    "shortCode": "MBA"
  }, {
    "name": "Morobe",
    "shortCode": "MPL"
  }, {
    "name": "Port Moresby",
    "shortCode": "NCD"
  }, {
    "name": "New Ireland",
    "shortCode": "NIK"
  }, {
    "name": "Northern",
    "shortCode": "NPP"
  }, {
    "name": "Southern Highlands",
    "shortCode": "SHM"
  }, {
    "name": "West New Britain",
    "shortCode": "WBK"
  }, {
    "name": "West Sepik",
    "shortCode": "SAN"
  }, {
    "name": "Western",
    "shortCode": "WPD"
  }, {
    "name": "Western Highlands",
    "shortCode": "WHM"
  }]
}, {
  "countryName": "Paraguay",
  "countryShortCode": "PY",
  "regions": [{
    "name": "Alto Paraguay",
    "shortCode": "16"
  }, {
    "name": "Alto Parana",
    "shortCode": "10"
  }, {
    "name": "Amambay",
    "shortCode": "13"
  }, {
    "name": "Asuncion",
    "shortCode": "ASU"
  }, {
    "name": "Caaguazu",
    "shortCode": "5"
  }, {
    "name": "Caazapa",
    "shortCode": "6"
  }, {
    "name": "Canindeyu",
    "shortCode": "14"
  }, {
    "name": "Central",
    "shortCode": "11"
  }, {
    "name": "Concepcion",
    "shortCode": "1"
  }, {
    "name": "Cordillera",
    "shortCode": "3"
  }, {
    "name": "Guaira",
    "shortCode": "4"
  }, {
    "name": "Itapua",
    "shortCode": "7"
  }, {
    "name": "Misiones",
    "shortCode": "8"
  }, {
    "name": "Neembucu",
    "shortCode": "12"
  }, {
    "name": "Paraguari",
    "shortCode": "9"
  }, {
    "name": "Presidente Hayes",
    "shortCode": "15"
  }, {
    "name": "San Pedro",
    "shortCode": "2"
  }]
}, {
  "countryName": "Peru",
  "countryShortCode": "PE",
  "regions": [{
    "name": "Amazonas",
    "shortCode": "AMA"
  }, {
    "name": "Ancash",
    "shortCode": "ANC"
  }, {
    "name": "Apurimac",
    "shortCode": "APU"
  }, {
    "name": "Arequipa",
    "shortCode": "ARE"
  }, {
    "name": "Ayacucho",
    "shortCode": "AYA"
  }, {
    "name": "Cajamarca",
    "shortCode": "CAJ"
  }, {
    "name": "Callao",
    "shortCode": "CAL"
  }, {
    "name": "Cusco",
    "shortCode": "CUS"
  }, {
    "name": "Huancavelica",
    "shortCode": "HUV"
  }, {
    "name": "Huanuco",
    "shortCode": "HUC"
  }, {
    "name": "Ica",
    "shortCode": "ICA"
  }, {
    "name": "Junin",
    "shortCode": "JUN"
  }, {
    "name": "La Libertad",
    "shortCode": "LAL"
  }, {
    "name": "Lambayeque",
    "shortCode": "LAM"
  }, {
    "name": "Lima",
    "shortCode": "LIM"
  }, {
    "name": "Loreto",
    "shortCode": "LOR"
  }, {
    "name": "Madre de Dios",
    "shortCode": "MDD"
  }, {
    "name": "Moquegua",
    "shortCode": "MOQ"
  }, {
    "name": "Municipalidad Metropolitana de Lima",
    "shortCode": "LMA"
  }, {
    "name": "Pasco",
    "shortCode": "PAS"
  }, {
    "name": "Piura",
    "shortCode": "PIU"
  }, {
    "name": "Puno",
    "shortCode": "PUN"
  }, {
    "name": "San Martin",
    "shortCode": "SAM"
  }, {
    "name": "Tacna",
    "shortCode": "TAC"
  }, {
    "name": "Tumbes",
    "shortCode": "TUM"
  }, {
    "name": "Ucayali",
    "shortCode": "UCA"
  }]
}, {
  "countryName": "Philippines",
  "countryShortCode": "PH",
  "regions": [{
    "name": "Abra",
    "shortCode": "ABR"
  }, {
    "name": "Agusan del Norte",
    "shortCode": "AGN"
  }, {
    "name": "Agusan del Sur",
    "shortCode": "AGS"
  }, {
    "name": "Aklan",
    "shortCode": "AKL"
  }, {
    "name": "Albay",
    "shortCode": "ALB"
  }, {
    "name": "Antique",
    "shortCode": "ANT"
  }, {
    "name": "Apayao",
    "shortCode": "APA"
  }, {
    "name": "Aurora",
    "shortCode": "AUR"
  }, {
    "name": "Basilan",
    "shortCode": "BAS"
  }, {
    "name": "Bataan",
    "shortCode": "BAN"
  }, {
    "name": "Batanes",
    "shortCode": "BTN"
  }, {
    "name": "Batangas",
    "shortCode": "BTG"
  }, {
    "name": "Benguet",
    "shortCode": "BEN"
  }, {
    "name": "Biliran",
    "shortCode": "BIL"
  }, {
    "name": "Bohol",
    "shortCode": "BOH"
  }, {
    "name": "Bukidnon",
    "shortCode": "BUK"
  }, {
    "name": "Bulacan",
    "shortCode": "BUL"
  }, {
    "name": "Cagayan",
    "shortCode": "CAG"
  }, {
    "name": "Camarines Norte",
    "shortCode": "CAN"
  }, {
    "name": "Camarines Sur",
    "shortCode": "CAS"
  }, {
    "name": "Camiguin",
    "shortCode": "CAM"
  }, {
    "name": "Capiz",
    "shortCode": "CAP"
  }, {
    "name": "Catanduanes",
    "shortCode": "CAT"
  }, {
    "name": "Cavite",
    "shortCode": "CAV"
  }, {
    "name": "Cebu",
    "shortCode": "CEB"
  }, {
    "name": "Compostela",
    "shortCode": "COM"
  }, {
    "name": "Cotabato",
    "shortCode": "NCO"
  }, {
    "name": "Davao del Norte",
    "shortCode": "DAV"
  }, {
    "name": "Davao del Sur",
    "shortCode": "DAS"
  }, {
    "name": "Davao Occidental",
    "shortCode": "DVO"
  }, {
    "name": "Davao Oriental",
    "shortCode": "DAO"
  }, {
    "name": "Dinagat Islands",
    "shortCode": "DIN"
  }, {
    "name": "Eastern Samar",
    "shortCode": "EAS"
  }, {
    "name": "Guimaras",
    "shortCode": "GUI"
  }, {
    "name": "Ifugao",
    "shortCode": "IFU"
  }, {
    "name": "Ilocos Norte",
    "shortCode": "ILN"
  }, {
    "name": "Ilocos Sur",
    "shortCode": "ILS"
  }, {
    "name": "Iloilo",
    "shortCode": "ILI"
  }, {
    "name": "Isabela",
    "shortCode": "ISA"
  }, {
    "name": "Kalinga",
    "shortCode": "KAL"
  }, {
    "name": "La Union",
    "shortCode": "LUN"
  }, {
    "name": "Laguna",
    "shortCode": "LAG"
  }, {
    "name": "Lanao del Norte",
    "shortCode": "LAN"
  }, {
    "name": "Lanao del Sur",
    "shortCode": "LAS"
  }, {
    "name": "Leyte",
    "shortCode": "LEY"
  }, {
    "name": "Maguindanao",
    "shortCode": "MAG"
  }, {
    "name": "Masbate",
    "shortCode": "MAS"
  }, {
    "name": "Metro Manila",
    "shortCode": "00"
  }, {
    "name": "Mindoro Occidental",
    "shortCode": "MDC"
  }, {
    "name": "Mindoro Oriental",
    "shortCode": "MDR"
  }, {
    "name": "Misamis Occidental",
    "shortCode": "MSC"
  }, {
    "name": "Misamis Oriental",
    "shortCode": "MSR"
  }, {
    "name": "Mountain Province",
    "shortCode": "MOU"
  }, {
    "name": "Negros Occidental",
    "shortCode": "NEC"
  }, {
    "name": "Negros Oriental",
    "shortCode": "NER"
  }, {
    "name": "Northern Samar",
    "shortCode": "NSA"
  }, {
    "name": "Nueva Ecija",
    "shortCode": "NUE"
  }, {
    "name": "Nueva Vizcaya",
    "shortCode": "NUV"
  }, {
    "name": "Palawan",
    "shortCode": "PLW"
  }, {
    "name": "Pampanga",
    "shortCode": "PAM"
  }, {
    "name": "Pangasinan",
    "shortCode": "PAN"
  }, {
    "name": "Quezon",
    "shortCode": "QUE"
  }, {
    "name": "Quirino",
    "shortCode": "QUI"
  }, {
    "name": "Rizal",
    "shortCode": "RIZ"
  }, {
    "name": "Romblon",
    "shortCode": "ROM"
  }, {
    "name": "Samar",
    "shortCode": "WSA"
  }, {
    "name": "Sarangani",
    "shortCode": "SAR"
  }, {
    "name": "Siquijor",
    "shortCode": "SIG"
  }, {
    "name": "Sorsogon",
    "shortCode": "SOR"
  }, {
    "name": "Southern Leyte",
    "shortCode": "SLE"
  }, {
    "name": "Sultan Kudarat",
    "shortCode": "AUK"
  }, {
    "name": "Sulu",
    "shortCode": "SLU"
  }, {
    "name": "Surigao del Norte",
    "shortCode": "SUN"
  }, {
    "name": "Surigao del Sur",
    "shortCode": "SUR"
  }, {
    "name": "Tarlac",
    "shortCode": "TAR"
  }, {
    "name": "Tawi-Tawi",
    "shortCode": "TAW"
  }, {
    "name": "Zambales",
    "shortCode": "ZMB"
  }, {
    "name": "Zamboanga del Norte",
    "shortCode": "ZAN"
  }, {
    "name": "Zamboanga del Sur",
    "shortCode": "ZAS"
  }, {
    "name": "Zamboanga Sibugay",
    "shortCode": "ZSI"
  }]
}, {
  "countryName": "Pitcairn",
  "countryShortCode": "PN",
  "regions": [{
    "name": "Pitcairn Islands"
  }]
}, {
  "countryName": "Poland",
  "countryShortCode": "PL",
  "regions": [{
    "name": "Dolnośląskie",
    "shortCode": "DS"
  }, {
    "name": "Kujawsko-pomorskie",
    "shortCode": "KP"
  }, {
    "name": "Łódzkie",
    "shortCode": "LD"
  }, {
    "name": "Lubelskie",
    "shortCode": "LU"
  }, {
    "name": "Lubuskie",
    "shortCode": "LB"
  }, {
    "name": "Malopolskie",
    "shortCode": "MA"
  }, {
    "name": "Mazowieckie",
    "shortCode": "MZ"
  }, {
    "name": "Opolskie",
    "shortCode": "OP"
  }, {
    "name": "Podkarpackie",
    "shortCode": "PK"
  }, {
    "name": "Podlaskie",
    "shortCode": "PD"
  }, {
    "name": "Pomorskie",
    "shortCode": "PM"
  }, {
    "name": "Śląskie",
    "shortCode": "SL"
  }, {
    "name": "Świętokrzyskie",
    "shortCode": "SK"
  }, {
    "name": "Warmińsko-mazurskie",
    "shortCode": "WN"
  }, {
    "name": "Wielkopolskie",
    "shortCode": "WP"
  }, {
    "name": "Zachodniopomorskie",
    "shortCode": "ZP"
  }]
}, {
  "countryName": "Portugal",
  "countryShortCode": "PT",
  "regions": [{
    "name": "Açores",
    "shortCode": "20"
  }, {
    "name": "Aveiro",
    "shortCode": "01"
  }, {
    "name": "Beja",
    "shortCode": "02"
  }, {
    "name": "Braga",
    "shortCode": "03"
  }, {
    "name": "Bragança",
    "shortCode": "04"
  }, {
    "name": "Castelo Branco",
    "shortCode": "05"
  }, {
    "name": "Coimbra",
    "shortCode": "06"
  }, {
    "name": "Évora",
    "shortCode": "07"
  }, {
    "name": "Faro",
    "shortCode": "08"
  }, {
    "name": "Guarda",
    "shortCode": "09"
  }, {
    "name": "Leiria",
    "shortCode": "10"
  }, {
    "name": "Lisboa",
    "shortCode": "11"
  }, {
    "name": "Madeira",
    "shortCode": "30"
  }, {
    "name": "Portalegre",
    "shortCode": "12"
  }, {
    "name": "Porto",
    "shortCode": "13"
  }, {
    "name": "Santarém",
    "shortCode": "14"
  }, {
    "name": "Setúbal",
    "shortCode": "15"
  }, {
    "name": "Viana do Castelo",
    "shortCode": "16"
  }, {
    "name": "Vila Real",
    "shortCode": "17"
  }, {
    "name": "Viseu",
    "shortCode": "18"
  }]
}, {
  "countryName": "Puerto Rico",
  "countryShortCode": "PR",
  "regions": [{
    "name": "Adjuntas"
  }, {
    "name": "Aguada"
  }, {
    "name": "Aguadilla"
  }, {
    "name": "Aguas Buenas"
  }, {
    "name": "Aibonito"
  }, {
    "name": "Anasco"
  }, {
    "name": "Arecibo"
  }, {
    "name": "Arroyo"
  }, {
    "name": "Barceloneta"
  }, {
    "name": "Barranquitas"
  }, {
    "name": "Bayamon"
  }, {
    "name": "Cabo Rojo"
  }, {
    "name": "Caguas"
  }, {
    "name": "Camuy"
  }, {
    "name": "Canovanas"
  }, {
    "name": "Carolina"
  }, {
    "name": "Cat"
  }, {
    "name": "Ceiba"
  }, {
    "name": "Ciales"
  }, {
    "name": "Cidra"
  }, {
    "name": "Coamo"
  }, {
    "name": "Comerio"
  }, {
    "name": "Corozal"
  }, {
    "name": "Culebra"
  }, {
    "name": "Dorado"
  }, {
    "name": "Fajardo"
  }, {
    "name": "Florida"
  }, {
    "name": "Guanica"
  }, {
    "name": "Guayama"
  }, {
    "name": "Guayanilla"
  }, {
    "name": "Guaynabo"
  }, {
    "name": "Gurabo"
  }, {
    "name": "Hatillo"
  }, {
    "name": "Hormigueros"
  }, {
    "name": "Humacao"
  }, {
    "name": "Isabe"
  }, {
    "name": "Juana Diaz"
  }, {
    "name": "Juncos"
  }, {
    "name": "Lajas"
  }, {
    "name": "Lares"
  }, {
    "name": "Las Marias"
  }, {
    "name": "Las oiza"
  }, {
    "name": "Luquillo"
  }, {
    "name": "Manati"
  }, {
    "name": "Maricao"
  }, {
    "name": "Maunabo"
  }, {
    "name": "Mayaguez"
  }, {
    "name": "Moca"
  }, {
    "name": "Morovis"
  }, {
    "name": "Naguabo"
  }, {
    "name": "Naranjito"
  }, {
    "name": "Orocovis"
  }, {
    "name": "Patillas"
  }, {
    "name": "Penuelas"
  }, {
    "name": "Ponce"
  }, {
    "name": "Quebradillas"
  }, {
    "name": "Rincon"
  }, {
    "name": "Rio Grande"
  }, {
    "name": "Sabana linas"
  }, {
    "name": "San German"
  }, {
    "name": "San Juan"
  }, {
    "name": "San Lorenzo"
  }, {
    "name": "San Sebastian"
  }, {
    "name": "Santa Isabel"
  }, {
    "name": "Toa Alta"
  }, {
    "name": "Toa Baja"
  }, {
    "name": "Trujillo Alto"
  }, {
    "name": "Utuado"
  }, {
    "name": "Vega Alta"
  }, {
    "name": "Vega ues"
  }, {
    "name": "Villalba"
  }, {
    "name": "Yabucoa"
  }, {
    "name": "Yauco"
  }]
}, {
  "countryName": "Qatar",
  "countryShortCode": "QA",
  "regions": [{
    "name": "Ad Dawḩah",
    "shortCode": "DA"
  }, {
    "name": "Al Khawr wa adh Dhakhīrah",
    "shortCode": "KH"
  }, {
    "name": "Al Wakrah",
    "shortCode": "WA"
  }, {
    "name": "Ar Rayyān",
    "shortCode": "RA"
  }, {
    "name": "Ash Shamāl",
    "shortCode": "MS"
  }, {
    "name": "Az̧ Za̧`āyin",
    "shortCode": "ZA"
  }, {
    "name": "Umm Şalāl",
    "shortCode": "US"
  }]
}, {
  "countryName": "Réunion",
  "countryShortCode": "RE",
  "regions": [{
    "name": "Réunion"
  }]
}, {
  "countryName": "Romania",
  "countryShortCode": "RO",
  "regions": [{
    "name": "Alba",
    "shortCode": "AB"
  }, {
    "name": "Arad",
    "shortCode": "AR"
  }, {
    "name": "Arges",
    "shortCode": "AG"
  }, {
    "name": "Bacau",
    "shortCode": "BC"
  }, {
    "name": "Bihor",
    "shortCode": "BH"
  }, {
    "name": "Bistrita-Nasaud",
    "shortCode": "BN"
  }, {
    "name": "Botosani",
    "shortCode": "BT"
  }, {
    "name": "Braila",
    "shortCode": "BR"
  }, {
    "name": "Brasov",
    "shortCode": "BV"
  }, {
    "name": "Bucuresti",
    "shortCode": "B"
  }, {
    "name": "Buzau",
    "shortCode": "BZ"
  }, {
    "name": "Calarasi",
    "shortCode": "CL"
  }, {
    "name": "Caras-Severin",
    "shortCode": "CS"
  }, {
    "name": "Cluj",
    "shortCode": "CJ"
  }, {
    "name": "Constanta",
    "shortCode": "CT"
  }, {
    "name": "Covasna",
    "shortCode": "CV"
  }, {
    "name": "Dambovita",
    "shortCode": "DB"
  }, {
    "name": "Dolj",
    "shortCode": "DJ"
  }, {
    "name": "Galati",
    "shortCode": "GL"
  }, {
    "name": "Giurgiu",
    "shortCode": "GR"
  }, {
    "name": "Gorj",
    "shortCode": "GJ"
  }, {
    "name": "Harghita",
    "shortCode": "HR"
  }, {
    "name": "Hunedoara",
    "shortCode": "HD"
  }, {
    "name": "Ialomita",
    "shortCode": "IL"
  }, {
    "name": "Iasi",
    "shortCode": "IS"
  }, {
    "name": "Maramures",
    "shortCode": "MM"
  }, {
    "name": "Mehedinti",
    "shortCode": "MH"
  }, {
    "name": "Mures",
    "shortCode": "MS"
  }, {
    "name": "Neamt",
    "shortCode": "NT"
  }, {
    "name": "Olt",
    "shortCode": "OT"
  }, {
    "name": "Prahova",
    "shortCode": "PH"
  }, {
    "name": "Salaj",
    "shortCode": "SJ"
  }, {
    "name": "Satu Mare",
    "shortCode": "SM"
  }, {
    "name": "Sibiu",
    "shortCode": "SB"
  }, {
    "name": "Suceava",
    "shortCode": "SV"
  }, {
    "name": "Teleorman",
    "shortCode": "TR"
  }, {
    "name": "Timis",
    "shortCode": "TM"
  }, {
    "name": "Tulcea",
    "shortCode": "TL"
  }, {
    "name": "Valcea",
    "shortCode": "VL"
  }, {
    "name": "Vaslui",
    "shortCode": "VS"
  }, {
    "name": "Vrancea",
    "shortCode": "VN"
  }]
}, {
  "countryName": "Russian Federation",
  "countryShortCode": "RU",
  "regions": [{
    "name": "Republic of Adygea",
    "shortCode": "AD"
  }, {
    "name": "Republic of Altai (Gorno-Altaysk)",
    "shortCode": "AL"
  }, {
    "name": "Altai Krai",
    "shortCode": "ALT"
  }, {
    "name": "Amur Oblast",
    "shortCode": "AMU"
  }, {
    "name": "Arkhangelsk Oblast",
    "shortCode": "ARK"
  }, {
    "name": "Astrakhan Oblast",
    "shortCode": "AST"
  }, {
    "name": "Republic of Bashkortostan",
    "shortCode": "BA"
  }, {
    "name": "Belgorod Oblast",
    "shortCode": "BEL"
  }, {
    "name": "Bryansk Oblast",
    "shortCode": "BRY"
  }, {
    "name": "Republic of Buryatia",
    "shortCode": "BU"
  }, {
    "name": "Chechen Republic",
    "shortCode": "CE"
  }, {
    "name": "Chelyabinsk Oblast",
    "shortCode": "CHE"
  }, {
    "name": "Chukotka Autonomous Okrug",
    "shortCode": "CHU"
  }, {
    "name": "Chuvash Republic",
    "shortCode": "CU"
  }, {
    "name": "Republic of Dagestan",
    "shortCode": "DA"
  }, {
    "name": "Republic of Ingushetia",
    "shortCode": "IN"
  }, {
    "name": "Irkutsk Oblast",
    "shortCode": "IRK"
  }, {
    "name": "Ivanovo Oblast",
    "shortCode": "IVA"
  }, {
    "name": "Jewish Autonomous Oblast",
    "shortCode": "JEW"
  }, {
    "name": "Kabardino-Balkar Republic",
    "shortCode": "KB"
  }, {
    "name": "Kaliningrad Oblast",
    "shortCode": "KLN"
  }, {
    "name": "Republic of Kalmykia",
    "shortCode": "KL"
  }, {
    "name": "Kaluga Oblast",
    "shortCode": "KLU"
  }, {
    "name": "Kamchatka Krai",
    "shortCode": "KAM"
  }, {
    "name": "Karachay-Cherkess Republic",
    "shortCode": "KC"
  }, {
    "name": "Republic of Karelia",
    "shortCode": "KR"
  }, {
    "name": "Khabarovsk Krai",
    "shortCode": "KHA"
  }, {
    "name": "Republic of Khakassia",
    "shortCode": "KK"
  }, {
    "name": "Khanty-Mansi Autonomous Okrug - Yugra",
    "shortCode": "KHM"
  }, {
    "name": "Kemerovo Oblast",
    "shortCode": "KEM"
  }, {
    "name": "Kirov Oblast",
    "shortCode": "KIR"
  }, {
    "name": "Komi Republic",
    "shortCode": "KO"
  }, {
    "name": "Kostroma Oblast",
    "shortCode": "KOS"
  }, {
    "name": "Krasnodar Krai",
    "shortCode": "KDA"
  }, {
    "name": "Krasnoyarsk Krai",
    "shortCode": "KYA"
  }, {
    "name": "Kurgan Oblast",
    "shortCode": "KGN"
  }, {
    "name": "Kursk Oblast",
    "shortCode": "KRS"
  }, {
    "name": "Leningrad Oblast",
    "shortCode": "LEN"
  }, {
    "name": "Lipetsk Oblast",
    "shortCode": "LIP"
  }, {
    "name": "Magadan Oblast",
    "shortCode": "MAG"
  }, {
    "name": "Mari El Republic",
    "shortCode": "ME"
  }, {
    "name": "Republic of Mordovia",
    "shortCode": "MO"
  }, {
    "name": "Moscow Oblast",
    "shortCode": "MOS"
  }, {
    "name": "Moscow",
    "shortCode": "MOW"
  }, {
    "name": "Murmansk Oblast",
    "shortCode": "MU"
  }, {
    "name": "Nenets Autonomous Okrug",
    "shortCode": "NEN"
  }, {
    "name": "Nizhny Novgorod Oblast",
    "shortCode": "NIZ"
  }, {
    "name": "Novgorod Oblast",
    "shortCode": "NGR"
  }, {
    "name": "Novosibirsk Oblast",
    "shortCode": "NVS"
  }, {
    "name": "Omsk Oblast",
    "shortCode": "OMS"
  }, {
    "name": "Orenburg Oblast",
    "shortCode": "ORE"
  }, {
    "name": "Oryol Oblast",
    "shortCode": "ORL"
  }, {
    "name": "Penza Oblast",
    "shortCode": "PNZ"
  }, {
    "name": "Perm Krai",
    "shortCode": "PER"
  }, {
    "name": "Primorsky Krai",
    "shortCode": "PRI"
  }, {
    "name": "Pskov Oblast",
    "shortCode": "PSK"
  }, {
    "name": "Rostov Oblast",
    "shortCode": "ROS"
  }, {
    "name": "Ryazan Oblast",
    "shortCode": "RYA"
  }, {
    "name": "Saint Petersburg",
    "shortCode": "SPE"
  }, {
    "name": "Sakha (Yakutia) Republic",
    "shortCode": "SA"
  }, {
    "name": "Sakhalin Oblast",
    "shortCode": "SAK"
  }, {
    "name": "Samara Oblast",
    "shortCode": "SAM"
  }, {
    "name": "Saratov Oblast",
    "shortCode": "SAR"
  }, {
    "name": "Republic of North Ossetia-Alania",
    "shortCode": "NOA"
  }, {
    "name": "Smolensk Oblast",
    "shortCode": "SMO"
  }, {
    "name": "Stavropol Krai",
    "shortCode": "STA"
  }, {
    "name": "Sverdlovsk Oblast",
    "shortCode": "SVE"
  }, {
    "name": "Tambov Oblast",
    "shortCode": "TAM"
  }, {
    "name": "Republic of Tatarstan",
    "shortCode": "TA"
  }, {
    "name": "Tomsk Oblast",
    "shortCode": "TOM"
  }, {
    "name": "Tuva Republic",
    "shortCode": "TU"
  }, {
    "name": "Tula Oblast",
    "shortCode": "TUL"
  }, {
    "name": "Tver Oblast",
    "shortCode": "TVE"
  }, {
    "name": "Tyumen Oblast",
    "shortCode": "TYU"
  }, {
    "name": "Udmurt Republic",
    "shortCode": "UD"
  }, {
    "name": "Ulyanovsk Oblast",
    "shortCode": "ULY"
  }, {
    "name": "Vladimir Oblast",
    "shortCode": "VLA"
  }, {
    "name": "Volgograd Oblast",
    "shortCode": "VGG"
  }, {
    "name": "Vologda Oblast",
    "shortCode": "VLG"
  }, {
    "name": "Voronezh Oblast",
    "shortCode": "VOR"
  }, {
    "name": "Yamalo-Nenets Autonomous Okrug",
    "shortCode": "YAN"
  }, {
    "name": "Yaroslavl Oblast",
    "shortCode": "YAR"
  }, {
    "name": "Zabaykalsky Krai",
    "shortCode": "ZAB"
  }]
}, {
  "countryName": "Rwanda",
  "countryShortCode": "RW",
  "regions": [{
    "name": "Kigali",
    "shortCode": "01"
  }, {
    "name": "Eastern",
    "shortCode": "02"
  }, {
    "name": "Northern",
    "shortCode": "03"
  }, {
    "name": "Western",
    "shortCode": "04"
  }, {
    "name": "Southern",
    "shortCode": "05"
  }]
}, {
  "countryName": "Saint Barthélemy",
  "countryShortCode": "BL",
  "regions": [{
    "name": "Au Vent",
    "shortCode": "02"
  }, {
    "name": "Sous le Vent",
    "shortCode": "01"
  }]
}, {
  "countryName": "Saint Helena, Ascension and Tristan da Cunha",
  "countryShortCode": "SH",
  "regions": [{
    "name": "Ascension",
    "shortCode": "AC"
  }, {
    "name": "Saint Helena",
    "shortCode": "HL"
  }, {
    "name": "Tristan da Cunha",
    "shortCode": "TA"
  }]
}, {
  "countryName": "Saint Kitts and Nevis",
  "countryShortCode": "KN",
  "regions": [{
    "name": "Saint Kitts",
    "shortCode": "K"
  }, {
    "name": "Nevis",
    "shortCode": "N"
  }]
}, {
  "countryName": "Saint Lucia",
  "countryShortCode": "LC",
  "regions": [{
    "name": "Anse-la-Raye",
    "shortCode": "01"
  }, {
    "name": "Canaries",
    "shortCode": "12"
  }, {
    "name": "Castries",
    "shortCode": "02"
  }, {
    "name": "Choiseul",
    "shortCode": "03"
  }, {
    "name": "Dennery",
    "shortCode": "05"
  }, {
    "name": "Gros Islet",
    "shortCode": "06"
  }, {
    "name": "Laborie",
    "shortCode": "07"
  }, {
    "name": "Micoud",
    "shortCode": "08"
  }, {
    "name": "Soufriere",
    "shortCode": "10"
  }, {
    "name": "Vieux Fort",
    "shortCode": "11"
  }]
}, {
  "countryName": "Saint Martin",
  "countryShortCode": "MF",
  "regions": [{
    "name": "Saint Martin"
  }]
}, {
  "countryName": "Saint Pierre and Miquelon",
  "countryShortCode": "PM",
  "regions": [{
    "name": "Miquelon"
  }, {
    "name": "Saint Pierre"
  }]
}, {
  "countryName": "Saint Vincent and the Grenadines",
  "countryShortCode": "VC",
  "regions": [{
    "name": "Charlotte",
    "shortCode": "01"
  }, {
    "name": "Grenadines",
    "shortCode": "06"
  }, {
    "name": "Saint Andrew",
    "shortCode": "02"
  }, {
    "name": "Saint David",
    "shortCode": "03"
  }, {
    "name": "Saint George",
    "shortCode": "04"
  }, {
    "name": "Saint Patrick",
    "shortCode": "05"
  }]
}, {
  "countryName": "Samoa",
  "countryShortCode": "WS",
  "regions": [{
    "name": "A'ana",
    "shortCode": "AA"
  }, {
    "name": "Aiga-i-le-Tai",
    "shortCode": "AL"
  }, {
    "name": "Atua",
    "shortCode": "AT"
  }, {
    "name": "Fa'asaleleaga",
    "shortCode": "FA"
  }, {
    "name": "Gaga'emauga",
    "shortCode": "GE"
  }, {
    "name": "Gagaifomauga",
    "shortCode": "GI"
  }, {
    "name": "Palauli",
    "shortCode": "PA"
  }, {
    "name": "Satupa'itea",
    "shortCode": "SA"
  }, {
    "name": "Tuamasaga",
    "shortCode": "TU"
  }, {
    "name": "Va'a-o-Fonoti",
    "shortCode": "VF"
  }, {
    "name": "Vaisigano",
    "shortCode": "VS"
  }]
}, {
  "countryName": "San Marino",
  "countryShortCode": "SM",
  "regions": [{
    "name": "Acquaviva",
    "shortCode": "01"
  }, {
    "name": "Borgo Maggiore",
    "shortCode": "06"
  }, {
    "name": "Chiesanuova",
    "shortCode": "02"
  }, {
    "name": "Domagnano",
    "shortCode": "03"
  }, {
    "name": "Faetano",
    "shortCode": "04"
  }, {
    "name": "Fiorentino",
    "shortCode": "05"
  }, {
    "name": "Montegiardino",
    "shortCode": "08"
  }, {
    "name": "San Marino",
    "shortCode": "07"
  }, {
    "name": "Serravalle",
    "shortCode": "09"
  }]
}, {
  "countryName": "Sao Tome and Principe",
  "countryShortCode": "ST",
  "regions": [{
    "name": "Principe",
    "shortCode": "P"
  }, {
    "name": "Sao Tome",
    "shortCode": "S"
  }]
}, {
  "countryName": "Saudi Arabia",
  "countryShortCode": "SA",
  "regions": [{
    "name": "'Asir",
    "shortCode": "14"
  }, {
    "name": "Al Bahah",
    "shortCode": "11"
  }, {
    "name": "Al Hudud ash Shamaliyah",
    "shortCode": "08"
  }, {
    "name": "Al Jawf",
    "shortCode": "12"
  }, {
    "name": "Al Madinah al Munawwarah",
    "shortCode": "03"
  }, {
    "name": "Al Qasim",
    "shortCode": "05"
  }, {
    "name": "Ar Riyad",
    "shortCode": "01"
  }, {
    "name": "Ash Sharqiyah",
    "shortCode": "04"
  }, {
    "name": "Ha'il",
    "shortCode": "06"
  }, {
    "name": "Jazan",
    "shortCode": "09"
  }, {
    "name": "Makkah al Mukarramah",
    "shortCode": "02"
  }, {
    "name": "Najran",
    "shortCode": "10"
  }, {
    "name": "Tabuk",
    "shortCode": "07"
  }]
}, {
  "countryName": "Senegal",
  "countryShortCode": "SN",
  "regions": [{
    "name": "Dakar",
    "shortCode": "DK"
  }, {
    "name": "Diourbel",
    "shortCode": "DB"
  }, {
    "name": "Fatick",
    "shortCode": "FK"
  }, {
    "name": "Kaffrine",
    "shortCode": "KA"
  }, {
    "name": "Kaolack",
    "shortCode": "KL"
  }, {
    "name": "Kedougou",
    "shortCode": "KE"
  }, {
    "name": "Kolda",
    "shortCode": "KD"
  }, {
    "name": "Louga",
    "shortCode": "LG"
  }, {
    "name": "Matam",
    "shortCode": "MT"
  }, {
    "name": "Saint-Louis",
    "shortCode": "SL"
  }, {
    "name": "Sedhiou",
    "shortCode": "SE"
  }, {
    "name": "Tambacounda",
    "shortCode": "TC"
  }, {
    "name": "Thies",
    "shortCode": "TH"
  }, {
    "name": "Ziguinchor",
    "shortCode": "ZG"
  }]
}, {
  "countryName": "Serbia",
  "countryShortCode": "RS",
  "regions": [{
    "name": "Beograd (Belgrade)",
    "shortCode": "00"
  }, {
    "name": "Borski",
    "shortCode": "14"
  }, {
    "name": "Braničevski",
    "shortCode": "11"
  }, {
    "name": "Jablanički",
    "shortCode": "23"
  }, {
    "name": "Južnobački",
    "shortCode": "06"
  }, {
    "name": "Južnobanatski",
    "shortCode": "04"
  }, {
    "name": "Kolubarski",
    "shortCode": "09"
  }, {
    "name": "Kosovski",
    "shortCode": "25"
  }, {
    "name": "Kosovsko-Mitrovački",
    "shortCode": "28"
  }, {
    "name": "Kosovsko-Pomoravski",
    "shortCode": "29"
  }, {
    "name": "Mačvanski",
    "shortCode": "08"
  }, {
    "name": "Moravički",
    "shortCode": "17"
  }, {
    "name": "Nišavski",
    "shortCode": "20"
  }, {
    "name": "Pčinjski",
    "shortCode": "24"
  }, {
    "name": "Pećki",
    "shortCode": "26"
  }, {
    "name": "Pirotski",
    "shortCode": "22"
  }, {
    "name": "Podunavski",
    "shortCode": "10"
  }, {
    "name": "Pomoravski",
    "shortCode": "13"
  }, {
    "name": "Prizrenski",
    "shortCode": "27"
  }, {
    "name": "Rasinski",
    "shortCode": "19"
  }, {
    "name": "Raški",
    "shortCode": "18"
  }, {
    "name": "Severnobački",
    "shortCode": "01"
  }, {
    "name": "Severnobanatski",
    "shortCode": "03"
  }, {
    "name": "Srednjebanatski",
    "shortCode": "02"
  }, {
    "name": "Sremski",
    "shortCode": "07"
  }, {
    "name": "Šumadijski",
    "shortCode": "12"
  }, {
    "name": "Toplički",
    "shortCode": "21"
  }, {
    "name": "Zaječarski",
    "shortCode": "15"
  }, {
    "name": "Zapadnobački",
    "shortCode": "05"
  }, {
    "name": "Zlatiborski",
    "shortCode": "16"
  }]
}, {
  "countryName": "Seychelles",
  "countryShortCode": "SC",
  "regions": [{
    "name": "Anse aux Pins",
    "shortCode": "01"
  }, {
    "name": "Anse Boileau",
    "shortCode": "02"
  }, {
    "name": "Anse Etoile",
    "shortCode": "03"
  }, {
    "name": "Anse Royale",
    "shortCode": "05"
  }, {
    "name": "Anu Cap",
    "shortCode": "04"
  }, {
    "name": "Baie Lazare",
    "shortCode": "06"
  }, {
    "name": "Baie Sainte Anne",
    "shortCode": "07"
  }, {
    "name": "Beau Vallon",
    "shortCode": "08"
  }, {
    "name": "Bel Air",
    "shortCode": "09"
  }, {
    "name": "Bel Ombre",
    "shortCode": "10"
  }, {
    "name": "Cascade",
    "shortCode": "11"
  }, {
    "name": "Glacis",
    "shortCode": "12"
  }, {
    "name": "Grand'Anse Mahe",
    "shortCode": "13"
  }, {
    "name": "Grand'Anse Praslin",
    "shortCode": "14"
  }, {
    "name": "La Digue",
    "shortCode": "15"
  }, {
    "name": "La Riviere Anglaise",
    "shortCode": "16"
  }, {
    "name": "Les Mamelles",
    "shortCode": "24"
  }, {
    "name": "Mont Buxton",
    "shortCode": "17"
  }, {
    "name": "Mont Fleuri",
    "shortCode": "18"
  }, {
    "name": "Plaisance",
    "shortCode": "19"
  }, {
    "name": "Pointe La Rue",
    "shortCode": "20"
  }, {
    "name": "Port Glaud",
    "shortCode": "21"
  }, {
    "name": "Roche Caiman",
    "shortCode": "25"
  }, {
    "name": "Saint Louis",
    "shortCode": "22"
  }, {
    "name": "Takamaka",
    "shortCode": "23"
  }]
}, {
  "countryName": "Sierra Leone",
  "countryShortCode": "SL",
  "regions": [{
    "name": "Eastern",
    "shortCode": "E"
  }, {
    "name": "Northern",
    "shortCode": "N"
  }, {
    "name": "Southern",
    "shortCode": "S"
  }, {
    "name": "Western",
    "shortCode": "W"
  }]
}, {
  "countryName": "Singapore",
  "countryShortCode": "SG",
  "regions": [{
    "name": "Central Singapore",
    "shortCode": "01"
  }, {
    "name": "North East",
    "shortCode": "02"
  }, {
    "name": "North West",
    "shortCode": "03"
  }, {
    "name": "South East",
    "shortCode": "04"
  }, {
    "name": "South West",
    "shortCode": "05"
  }]
}, {
  "countryName": "Sint Maarten (Dutch part)",
  "countryShortCode": "SX",
  "regions": [{
    "name": "Sint Maarten"
  }]
}, {
  "countryName": "Slovakia",
  "countryShortCode": "SK",
  "regions": [{
    "name": "Banskobystricky",
    "shortCode": "BC"
  }, {
    "name": "Bratislavsky",
    "shortCode": "BL"
  }, {
    "name": "Kosicky",
    "shortCode": "KI"
  }, {
    "name": "Nitriansky",
    "shortCode": "NI"
  }, {
    "name": "Presovsky",
    "shortCode": "PV"
  }, {
    "name": "Trenciansky",
    "shortCode": "TC"
  }, {
    "name": "Trnavsky",
    "shortCode": "TA"
  }, {
    "name": "Zilinsky",
    "shortCode": "ZI"
  }]
}, {
  "countryName": "Slovenia",
  "countryShortCode": "SI",
  "regions": [{
    "name": "Ajdovscina",
    "shortCode": "001"
  }, {
    "name": "Apace",
    "shortCode": "195"
  }, {
    "name": "Beltinci",
    "shortCode": "002"
  }, {
    "name": "Benedikt",
    "shortCode": "148"
  }, {
    "name": "Bistrica ob Sotli",
    "shortCode": "149"
  }, {
    "name": "Bled",
    "shortCode": "003"
  }, {
    "name": "Bloke",
    "shortCode": "150"
  }, {
    "name": "Bohinj",
    "shortCode": "004"
  }, {
    "name": "Borovnica",
    "shortCode": "005"
  }, {
    "name": "Bovec",
    "shortCode": "006"
  }, {
    "name": "Braslovce",
    "shortCode": "151"
  }, {
    "name": "Brda",
    "shortCode": "007"
  }, {
    "name": "Brezice",
    "shortCode": "009"
  }, {
    "name": "Brezovica",
    "shortCode": "008"
  }, {
    "name": "Cankova",
    "shortCode": "152"
  }, {
    "name": "Celje",
    "shortCode": "011"
  }, {
    "name": "Cerklje na Gorenjskem",
    "shortCode": "012"
  }, {
    "name": "Cerknica",
    "shortCode": "013"
  }, {
    "name": "Cerkno",
    "shortCode": "014"
  }, {
    "name": "Cerkvenjak",
    "shortCode": "153"
  }, {
    "name": "Cirkulane",
    "shortCode": "196"
  }, {
    "name": "Crensovci",
    "shortCode": "015"
  }, {
    "name": "Crna na Koroskem",
    "shortCode": "016"
  }, {
    "name": "Crnomelj",
    "shortCode": "017"
  }, {
    "name": "Destrnik",
    "shortCode": "018"
  }, {
    "name": "Divaca",
    "shortCode": "019"
  }, {
    "name": "Dobje",
    "shortCode": "154"
  }, {
    "name": "Dobrepolje",
    "shortCode": "020"
  }, {
    "name": "Dobrna",
    "shortCode": "155"
  }, {
    "name": "Dobrova-Polhov Gradec",
    "shortCode": "021"
  }, {
    "name": "Dobrovnik",
    "shortCode": "156"
  }, {
    "name": "Dol pri Ljubljani",
    "shortCode": "022"
  }, {
    "name": "Dolenjske Toplice",
    "shortCode": "157"
  }, {
    "name": "Domzale",
    "shortCode": "023"
  }, {
    "name": "Dornava",
    "shortCode": "024"
  }, {
    "name": "Dravograd",
    "shortCode": "025"
  }, {
    "name": "Duplek",
    "shortCode": "026"
  }, {
    "name": "Gorenja Vas-Poljane",
    "shortCode": "027"
  }, {
    "name": "Gorisnica",
    "shortCode": "028"
  }, {
    "name": "Gorje",
    "shortCode": "207"
  }, {
    "name": "Gornja Radgona",
    "shortCode": "029"
  }, {
    "name": "Gornji Grad",
    "shortCode": "030"
  }, {
    "name": "Gornji Petrovci",
    "shortCode": "031"
  }, {
    "name": "Grad",
    "shortCode": "158"
  }, {
    "name": "Grosuplje",
    "shortCode": "032"
  }, {
    "name": "Hajdina",
    "shortCode": "159"
  }, {
    "name": "Hoce-Slivnica",
    "shortCode": "160"
  }, {
    "name": "Hodos",
    "shortCode": "161"
  }, {
    "name": "Horjul",
    "shortCode": "162"
  }, {
    "name": "Hrastnik",
    "shortCode": "034"
  }, {
    "name": "Hrpelje-Kozina",
    "shortCode": "035"
  }, {
    "name": "Idrija",
    "shortCode": "036"
  }, {
    "name": "Ig",
    "shortCode": "037"
  }, {
    "name": "Ilirska Bistrica",
    "shortCode": "038"
  }, {
    "name": "Ivancna Gorica",
    "shortCode": "039"
  }, {
    "name": "Izola",
    "shortCode": "040s"
  }, {
    "name": "Jesenice",
    "shortCode": "041"
  }, {
    "name": "Jursinci",
    "shortCode": "042"
  }, {
    "name": "Kamnik",
    "shortCode": "043"
  }, {
    "name": "Kanal",
    "shortCode": "044"
  }, {
    "name": "Kidricevo",
    "shortCode": "045"
  }, {
    "name": "Kobarid",
    "shortCode": "046"
  }, {
    "name": "Kobilje",
    "shortCode": "047"
  }, {
    "name": "Kocevje",
    "shortCode": "048"
  }, {
    "name": "Komen",
    "shortCode": "049"
  }, {
    "name": "Komenda",
    "shortCode": "164"
  }, {
    "name": "Koper",
    "shortCode": "050"
  }, {
    "name": "Kodanjevica na Krki",
    "shortCode": "197"
  }, {
    "name": "Kostel",
    "shortCode": "165"
  }, {
    "name": "Kozje",
    "shortCode": "051"
  }, {
    "name": "Kranj",
    "shortCode": "052"
  }, {
    "name": "Kranjska Gora",
    "shortCode": "053"
  }, {
    "name": "Krizevci",
    "shortCode": "166"
  }, {
    "name": "Krsko",
    "shortCode": "054"
  }, {
    "name": "Kungota",
    "shortCode": "055"
  }, {
    "name": "Kuzma",
    "shortCode": "056"
  }, {
    "name": "Lasko",
    "shortCode": "057"
  }, {
    "name": "Lenart",
    "shortCode": "058"
  }, {
    "name": "Lendava",
    "shortCode": "059"
  }, {
    "name": "Litija",
    "shortCode": "068"
  }, {
    "name": "Ljubljana",
    "shortCode": "061"
  }, {
    "name": "Ljubno",
    "shortCode": "062"
  }, {
    "name": "Ljutomer",
    "shortCode": "063"
  }, {
    "name": "Log-Dragomer",
    "shortCode": "208"
  }, {
    "name": "Logatec",
    "shortCode": "064"
  }, {
    "name": "Loska Dolina",
    "shortCode": "065"
  }, {
    "name": "Loski Potok",
    "shortCode": "066"
  }, {
    "name": "Lovrenc na Pohorju",
    "shortCode": "167"
  }, {
    "name": "Lukovica",
    "shortCode": "068"
  }, {
    "name": "Luce",
    "shortCode": "067"
  }, {
    "name": "Majsperk",
    "shortCode": "069"
  }, {
    "name": "Makole",
    "shortCode": "198"
  }, {
    "name": "Maribor",
    "shortCode": "070"
  }, {
    "name": "Markovci",
    "shortCode": "168"
  }, {
    "name": "Medvode",
    "shortCode": "071"
  }, {
    "name": "Menges",
    "shortCode": "072"
  }, {
    "name": "Metlika",
    "shortCode": "073"
  }, {
    "name": "Mezica",
    "shortCode": "074"
  }, {
    "name": "Miklavz na Dravskem Polju",
    "shortCode": "169"
  }, {
    "name": "Miren-Kostanjevica",
    "shortCode": "075"
  }, {
    "name": "Mirna",
    "shortCode": "212"
  }, {
    "name": "Mirna Pec",
    "shortCode": "170"
  }, {
    "name": "Mislinja",
    "shortCode": "076"
  }, {
    "name": "Mokronog-Trebelno",
    "shortCode": "199"
  }, {
    "name": "Moravce",
    "shortCode": "077"
  }, {
    "name": "Moravske Toplice",
    "shortCode": "078"
  }, {
    "name": "Mozirje",
    "shortCode": "079"
  }, {
    "name": "Murska Sobota",
    "shortCode": "080"
  }, {
    "name": "Naklo",
    "shortCode": "082"
  }, {
    "name": "Nazarje",
    "shortCode": "083"
  }, {
    "name": "Nova Gorica",
    "shortCode": "084"
  }, {
    "name": "Novo Mesto",
    "shortCode": "085"
  }, {
    "name": "Odranci",
    "shortCode": "086"
  }, {
    "name": "Ormoz",
    "shortCode": "087"
  }, {
    "name": "Osilnica",
    "shortCode": "088"
  }, {
    "name": "Pesnica",
    "shortCode": "089"
  }, {
    "name": "Piran",
    "shortCode": "090"
  }, {
    "name": "Pivka",
    "shortCode": "091"
  }, {
    "name": "Podcetrtek",
    "shortCode": "092"
  }, {
    "name": "Podlehnik",
    "shortCode": "172"
  }, {
    "name": "Podvelka",
    "shortCode": "093"
  }, {
    "name": "Poljcane",
    "shortCode": "200"
  }, {
    "name": "Postojna",
    "shortCode": "094"
  }, {
    "name": "Prebold",
    "shortCode": "174"
  }, {
    "name": "Preddvor",
    "shortCode": "095"
  }, {
    "name": "Prevalje",
    "shortCode": "175"
  }, {
    "name": "Ptuj",
    "shortCode": "096"
  }, {
    "name": "Race-Fram",
    "shortCode": "098"
  }, {
    "name": "Radece",
    "shortCode": "099"
  }, {
    "name": "Radenci",
    "shortCode": "100"
  }, {
    "name": "Radlje ob Dravi",
    "shortCode": "101"
  }, {
    "name": "Radovljica",
    "shortCode": "102"
  }, {
    "name": "Ravne na Koroskem",
    "shortCode": "103"
  }, {
    "name": "Razkrizje",
    "shortCode": "176"
  }, {
    "name": "Recica ob Savinji",
    "shortCode": "209"
  }, {
    "name": "Rence-Vogrsko",
    "shortCode": "201"
  }, {
    "name": "Ribnica",
    "shortCode": "104"
  }, {
    "name": "Ribnica na Poboriu",
    "shortCode": "177"
  }, {
    "name": "Rogaska Slatina",
    "shortCode": "106"
  }, {
    "name": "Rogasovci",
    "shortCode": "105"
  }, {
    "name": "Rogatec",
    "shortCode": "107"
  }, {
    "name": "Ruse",
    "shortCode": "108"
  }, {
    "name": "Salovci",
    "shortCode": "033"
  }, {
    "name": "Selnica ob Dravi",
    "shortCode": "178"
  }, {
    "name": "Semic",
    "shortCode": "109"
  }, {
    "name": "Sempeter-Vrtojba",
    "shortCode": "183"
  }, {
    "name": "Sencur",
    "shortCode": "117"
  }, {
    "name": "Sentilj",
    "shortCode": "118"
  }, {
    "name": "Sentjernej",
    "shortCode": "119"
  }, {
    "name": "Sentjur",
    "shortCode": "120"
  }, {
    "name": "Sentrupert",
    "shortCode": "211"
  }, {
    "name": "Sevnica",
    "shortCode": "110"
  }, {
    "name": "Sezana",
    "shortCode": "111"
  }, {
    "name": "Skocjan",
    "shortCode": "121"
  }, {
    "name": "Skofja Loka",
    "shortCode": "122"
  }, {
    "name": "Skofljica",
    "shortCode": "123"
  }, {
    "name": "Slovenj Gradec",
    "shortCode": "112"
  }, {
    "name": "Slovenska Bistrica",
    "shortCode": "113"
  }, {
    "name": "Slovenske Konjice",
    "shortCode": "114"
  }, {
    "name": "Smarje pri elsah",
    "shortCode": "124"
  }, {
    "name": "Smarjeske Toplice",
    "shortCode": "206"
  }, {
    "name": "Smartno ob Paki",
    "shortCode": "125"
  }, {
    "name": "Smartno pri Litiji",
    "shortCode": "194"
  }, {
    "name": "Sodrazica",
    "shortCode": "179"
  }, {
    "name": "Solcava",
    "shortCode": "180"
  }, {
    "name": "Sostanj",
    "shortCode": "126"
  }, {
    "name": "Sredisce ob Dravi",
    "shortCode": "202"
  }, {
    "name": "Starse",
    "shortCode": "115"
  }, {
    "name": "Store",
    "shortCode": "127"
  }, {
    "name": "Straza",
    "shortCode": "203"
  }, {
    "name": "Sveta Ana",
    "shortCode": "181"
  }, {
    "name": "Sveta Trojica v Slovenskih Goricah",
    "shortCode": "204"
  }, {
    "name": "Sveta Andraz v Slovenskih Goricah",
    "shortCode": "182"
  }, {
    "name": "Sveti Jurij",
    "shortCode": "116"
  }, {
    "name": "Sveti Jurij v Slovenskih Goricah",
    "shortCode": "210"
  }, {
    "name": "Sveti Tomaz",
    "shortCode": "205"
  }, {
    "name": "Tabor",
    "shortCode": "184"
  }, {
    "name": "Tisina",
    "shortCode": "128"
  }, {
    "name": "Tolmin",
    "shortCode": "128"
  }, {
    "name": "Trbovlje",
    "shortCode": "129"
  }, {
    "name": "Trebnje",
    "shortCode": "130"
  }, {
    "name": "Trnovska Vas",
    "shortCode": "185"
  }, {
    "name": "Trzin",
    "shortCode": "186"
  }, {
    "name": "Trzic",
    "shortCode": "131"
  }, {
    "name": "Turnisce",
    "shortCode": "132"
  }, {
    "name": "Velenje",
    "shortCode": "133"
  }, {
    "name": "Velika Polana",
    "shortCode": "187"
  }, {
    "name": "Velike Lasce",
    "shortCode": "134"
  }, {
    "name": "Verzej",
    "shortCode": "188"
  }, {
    "name": "Videm",
    "shortCode": "135"
  }, {
    "name": "Vipava",
    "shortCode": "136"
  }, {
    "name": "Vitanje",
    "shortCode": "137"
  }, {
    "name": "Vodice",
    "shortCode": "138"
  }, {
    "name": "Vojnik",
    "shortCode": "139"
  }, {
    "name": "Vransko",
    "shortCode": "189"
  }, {
    "name": "Vrhnika",
    "shortCode": "140"
  }, {
    "name": "Vuzenica",
    "shortCode": "141"
  }, {
    "name": "Zagorje ob Savi",
    "shortCode": "142"
  }, {
    "name": "Zavrc",
    "shortCode": "143"
  }, {
    "name": "Zrece",
    "shortCode": "144"
  }, {
    "name": "Zalec",
    "shortCode": "190"
  }, {
    "name": "Zelezniki",
    "shortCode": "146"
  }, {
    "name": "Zetale",
    "shortCode": "191"
  }, {
    "name": "Ziri",
    "shortCode": "147"
  }, {
    "name": "Zirovnica",
    "shortCode": "192"
  }, {
    "name": "Zuzemberk",
    "shortCode": "193"
  }]
}, {
  "countryName": "Solomon Islands",
  "countryShortCode": "SB",
  "regions": [{
    "name": "Central",
    "shortCode": "CE"
  }, {
    "name": "Choiseul",
    "shortCode": "CH"
  }, {
    "name": "Guadalcanal",
    "shortCode": "GU"
  }, {
    "name": "Honiara",
    "shortCode": "CT"
  }, {
    "name": "Isabel",
    "shortCode": "IS"
  }, {
    "name": "Makira-Ulawa",
    "shortCode": "MK"
  }, {
    "name": "Malaita",
    "shortCode": "ML"
  }, {
    "name": "Rennell and Bellona",
    "shortCode": "RB"
  }, {
    "name": "Temotu",
    "shortCode": "TE"
  }, {
    "name": "Western",
    "shortCode": "WE"
  }]
}, {
  "countryName": "Somalia",
  "countryShortCode": "SO",
  "regions": [{
    "name": "Awdal",
    "shortCode": "AW"
  }, {
    "name": "Bakool",
    "shortCode": "BK"
  }, {
    "name": "Banaadir",
    "shortCode": "BN"
  }, {
    "name": "Bari",
    "shortCode": "BR"
  }, {
    "name": "Bay",
    "shortCode": "BY"
  }, {
    "name": "Galguduud",
    "shortCode": "GA"
  }, {
    "name": "Gedo",
    "shortCode": "GE"
  }, {
    "name": "Hiiraan",
    "shortCode": "HI"
  }, {
    "name": "Jubbada Dhexe",
    "shortCode": "JD"
  }, {
    "name": "Jubbada Hoose",
    "shortCode": "JH"
  }, {
    "name": "Mudug",
    "shortCode": "MU"
  }, {
    "name": "Nugaal",
    "shortCode": "NU"
  }, {
    "name": "Sanaag",
    "shortCode": "SA"
  }, {
    "name": "Shabeellaha Dhexe",
    "shortCode": "SD"
  }, {
    "name": "Shabeellaha Hoose",
    "shortCode": "SH"
  }, {
    "name": "Sool",
    "shortCode": "SO"
  }, {
    "name": "Togdheer",
    "shortCode": "TO"
  }, {
    "name": "Woqooyi Galbeed",
    "shortCode": "WO"
  }]
}, {
  "countryName": "South Africa",
  "countryShortCode": "ZA",
  "regions": [{
    "name": "Eastern Cape",
    "shortCode": "EC"
  }, {
    "name": "Free State",
    "shortCode": "FS"
  }, {
    "name": "Gauteng",
    "shortCode": "GT"
  }, {
    "name": "KwaZulu-Natal",
    "shortCode": "NL"
  }, {
    "name": "Limpopo",
    "shortCode": "LP"
  }, {
    "name": "Mpumalanga",
    "shortCode": "MP"
  }, {
    "name": "Northern Cape",
    "shortCode": "NC"
  }, {
    "name": "North West",
    "shortCode": "NW"
  }, {
    "name": "Western Cape",
    "shortCode": "WC"
  }]
}, {
  "countryName": "South Georgia and South Sandwich Islands",
  "countryShortCode": "GS",
  "regions": [{
    "name": "Bird Island"
  }, {
    "name": "Bristol Island"
  }, {
    "name": "Clerke Rocks"
  }, {
    "name": "Montagu Island"
  }, {
    "name": "Saunders Island"
  }, {
    "name": "South Georgia"
  }, {
    "name": "Southern Thule"
  }, {
    "name": "Traversay Islands"
  }]
}, {
  "countryName": "South Sudan",
  "countryShortCode": "SS",
  "regions": [{
    "name": "Central Equatoria",
    "shortCode": "CE"
  }, {
    "name": "Eastern Equatoria",
    "shortCode": "EE"
  }, {
    "name": "Jonglei",
    "shortCode": "JG"
  }, {
    "name": "Lakes",
    "shortCode": "LK"
  }, {
    "name": "Northern Bahr el Ghazal",
    "shortCode": "BN"
  }, {
    "name": "Unity",
    "shortCode": "UY"
  }, {
    "name": "Upper Nile",
    "shortCode": "NU"
  }, {
    "name": "Warrap",
    "shortCode": "WR"
  }, {
    "name": "Western Bahr el Ghazal",
    "shortCode": "BW"
  }, {
    "name": "Western Equatoria",
    "shortCode": "EW"
  }]
}, {
  "countryName": "Spain",
  "countryShortCode": "ES",
  "regions": [{
    "name": "Albacete",
    "shortCode": "CM"
  }, {
    "name": "Alicante",
    "shortCode": "VC"
  }, {
    "name": "Almería",
    "shortCode": "AN"
  }, {
    "name": "Araba/Álava",
    "shortCode": "VI"
  }, {
    "name": "Asturias",
    "shortCode": "O"
  }, {
    "name": "Ávila",
    "shortCode": "AV"
  }, {
    "name": "Badajoz",
    "shortCode": "BA"
  }, {
    "name": "Barcelona",
    "shortCode": "B"
  }, {
    "name": "Bizkaia",
    "shortCode": "BI"
  }, {
    "name": "Burgos",
    "shortCode": "BU"
  }, {
    "name": "Cáceres",
    "shortCode": "CC"
  }, {
    "name": "Cádiz",
    "shortCode": "CA"
  }, {
    "name": "Cantabria",
    "shortCode": "S"
  }, {
    "name": "Castellón",
    "shortCode": "CS"
  }, {
    "name": "Cueta",
    "shortCode": "CU"
  }, {
    "name": "Ciudad Real",
    "shortCode": "CR"
  }, {
    "name": "Córdoba",
    "shortCode": "CO"
  }, {
    "name": "A Coruña",
    "shortCode": "C"
  }, {
    "name": "Cuenca",
    "shortCode": "CU"
  }, {
    "name": "Gipuzkoa",
    "shortCode": "SS"
  }, {
    "name": "Girona",
    "shortCode": "GI"
  }, {
    "name": "Granada",
    "shortCode": "GR"
  }, {
    "name": "Guadalajara",
    "shortCode": "GU"
  }, {
    "name": "Huelva",
    "shortCode": "H"
  }, {
    "name": "Huesca",
    "shortCode": "HU"
  }, {
    "name": "Illes Balears",
    "shortCode": "PM"
  }, {
    "name": "Jaén",
    "shortCode": "J"
  }, {
    "name": "León",
    "shortCode": "LE"
  }, {
    "name": "Lleida",
    "shortCode": "L"
  }, {
    "name": "Lugo",
    "shortCode": "LU"
  }, {
    "name": "Madrid",
    "shortCode": "M"
  }, {
    "name": "Málaga",
    "shortCode": "MA"
  }, {
    "name": "Melilla",
    "shortCode": "ML"
  }, {
    "name": "Murcia",
    "shortCode": "MU"
  }, {
    "name": "Navarre",
    "shortCode": "NA"
  }, {
    "name": "Ourense",
    "shortCode": "OR"
  }, {
    "name": "Palencia",
    "shortCode": "P"
  }, {
    "name": "Las Palmas",
    "shortCode": "GC"
  }, {
    "name": "Pontevedra",
    "shortCode": "PO"
  }, {
    "name": "La Rioja",
    "shortCode": "LO"
  }, {
    "name": "Salamanca",
    "shortCode": "SA"
  }, {
    "name": "Santa Cruz de Tenerife",
    "shortCode": "TF"
  }, {
    "name": "Segovia",
    "shortCode": "SG"
  }, {
    "name": "Sevilla",
    "shortCode": "SE"
  }, {
    "name": "Soria",
    "shortCode": "SO"
  }, {
    "name": "Tarragona",
    "shortCode": "T"
  }, {
    "name": "Teruel",
    "shortCode": "TE"
  }, {
    "name": "Toledo",
    "shortCode": "TO"
  }, {
    "name": "Valencia",
    "shortCode": "V"
  }, {
    "name": "Valladolid",
    "shortCode": "VA"
  }, {
    "name": "Zamora",
    "shortCode": "ZA"
  }, {
    "name": "Zaragoza",
    "shortCode": "Z"
  }]
}, {
  "countryName": "Sri Lanka",
  "countryShortCode": "LK",
  "regions": [{
    "name": "Basnahira",
    "shortCode": "1"
  }, {
    "name": "Dakunu",
    "shortCode": "3"
  }, {
    "name": "Madhyama",
    "shortCode": "2"
  }, {
    "name": "Naegenahira",
    "shortCode": "5"
  }, {
    "name": "Sabaragamuwa",
    "shortCode": "9"
  }, {
    "name": "Uturu",
    "shortCode": "4"
  }, {
    "name": "Uturumaeda",
    "shortCode": "7"
  }, {
    "name": "Vayamba",
    "shortCode": "6"
  }, {
    "name": "Uva",
    "shortCode": "8"
  }]
}, {
  "countryName": "Sudan",
  "countryShortCode": "SD",
  "regions": [{
    "name": "Al Bahr al Ahmar",
    "shortCode": "RS"
  }, {
    "name": "Al Jazirah",
    "shortCode": "GZ"
  }, {
    "name": "Al Khartum",
    "shortCode": "KH"
  }, {
    "name": "Al Qadarif",
    "shortCode": "GD"
  }, {
    "name": "An Nil al Abyad",
    "shortCode": "NW"
  }, {
    "name": "An Nil al Azraq",
    "shortCode": "NB"
  }, {
    "name": "Ash Shamaliyah",
    "shortCode": "NO"
  }, {
    "name": "Gharb Darfur",
    "shortCode": "DW"
  }, {
    "name": "Gharb Kurdufan",
    "shortCode": "GK"
  }, {
    "name": "Janub Darfur",
    "shortCode": "DS"
  }, {
    "name": "Janub Kurdufan",
    "shortCode": "KS"
  }, {
    "name": "Kassala",
    "shortCode": "KA"
  }, {
    "name": "Nahr an Nil",
    "shortCode": "NR"
  }, {
    "name": "Shamal Darfur",
    "shortCode": "DN"
  }, {
    "name": "Sharq Darfur",
    "shortCode": "DE"
  }, {
    "name": "Shiamal Kurdufan",
    "shortCode": "KN"
  }, {
    "name": "Sinnar",
    "shortCode": "SI"
  }, {
    "name": "Wasat Darfur Zalinjay",
    "shortCode": "DC"
  }]
}, {
  "countryName": "Suriname",
  "countryShortCode": "SR",
  "regions": [{
    "name": "Brokopondo",
    "shortCode": "BR"
  }, {
    "name": "Commewijne",
    "shortCode": "CM"
  }, {
    "name": "Coronie",
    "shortCode": "CR"
  }, {
    "name": "Marowijne",
    "shortCode": "MA"
  }, {
    "name": "Nickerie",
    "shortCode": "NI"
  }, {
    "name": "Para",
    "shortCode": "PR"
  }, {
    "name": "Paramaribo",
    "shortCode": "PM"
  }, {
    "name": "Saramacca",
    "shortCode": "SA"
  }, {
    "name": "Sipaliwini",
    "shortCode": "SI"
  }, {
    "name": "Wanica",
    "shortCode": "WA"
  }]
}, {
  "countryName": "Swaziland",
  "countryShortCode": "SZ",
  "regions": [{
    "name": "Hhohho",
    "shortCode": "HH"
  }, {
    "name": "Lubombo",
    "shortCode": "LU"
  }, {
    "name": "Manzini",
    "shortCode": "MA"
  }, {
    "name": "Shiselweni",
    "shortCode": "SH"
  }]
}, {
  "countryName": "Sweden",
  "countryShortCode": "SE",
  "regions": [{
    "name": "Blekinge",
    "shortCode": "K"
  }, {
    "name": "Dalarna",
    "shortCode": "W"
  }, {
    "name": "Gävleborg",
    "shortCode": "X"
  }, {
    "name": "Gotland",
    "shortCode": "I"
  }, {
    "name": "Halland",
    "shortCode": "N"
  }, {
    "name": "Jämtland",
    "shortCode": "Z"
  }, {
    "name": "Jönköping",
    "shortCode": "F"
  }, {
    "name": "Kalmar",
    "shortCode": "H"
  }, {
    "name": "Kronoberg",
    "shortCode": "G"
  }, {
    "name": "Norrbotten",
    "shortCode": "BD"
  }, {
    "name": "Örebro",
    "shortCode": "T"
  }, {
    "name": "Östergötland",
    "shortCode": "E"
  }, {
    "name": "Skåne",
    "shortCode": "M"
  }, {
    "name": "Södermanland",
    "shortCode": "D"
  }, {
    "name": "Stockholm",
    "shortCode": "AB"
  }, {
    "name": "Uppsala",
    "shortCode": "C"
  }, {
    "name": "Värmland",
    "shortCode": "S"
  }, {
    "name": "Västerbotten",
    "shortCode": "AC"
  }, {
    "name": "Västernorrland",
    "shortCode": "Y"
  }, {
    "name": "Västmanland",
    "shortCode": "U"
  }, {
    "name": "Västra Götaland",
    "shortCode": "O"
  }]
}, {
  "countryName": "Switzerland",
  "countryShortCode": "CH",
  "regions": [{
    "name": "Aargau",
    "shortCode": "AG"
  }, {
    "name": "Appenzell Ausserrhoden",
    "shortCode": "AR"
  }, {
    "name": "Appenzell Innerhoden",
    "shortCode": "AI"
  }, {
    "name": "Basel-Landschaft",
    "shortCode": "BL"
  }, {
    "name": "Basel-Stadt",
    "shortCode": "BS"
  }, {
    "name": "Bern",
    "shortCode": "BE"
  }, {
    "name": "Fribourg",
    "shortCode": "FR"
  }, {
    "name": "Genève",
    "shortCode": "GE"
  }, {
    "name": "Glarus",
    "shortCode": "GL"
  }, {
    "name": "Graubünden",
    "shortCode": "GR"
  }, {
    "name": "Jura",
    "shortCode": "JU"
  }, {
    "name": "Luzern",
    "shortCode": "LU"
  }, {
    "name": "Neuchâtel",
    "shortCode": "NE"
  }, {
    "name": "Nidwalden",
    "shortCode": "NW"
  }, {
    "name": "Obwalden",
    "shortCode": "OW"
  }, {
    "name": "Sankt Gallen",
    "shortCode": "SG"
  }, {
    "name": "Schaffhausen",
    "shortCode": "SH"
  }, {
    "name": "Schwyz",
    "shortCode": "SZ"
  }, {
    "name": "Solothurn",
    "shortCode": "SO"
  }, {
    "name": "Thurgau",
    "shortCode": "TG"
  }, {
    "name": "Ticino",
    "shortCode": "TI"
  }, {
    "name": "Uri",
    "shortCode": "UR"
  }, {
    "name": "Valais",
    "shortCode": "VS"
  }, {
    "name": "Vaud",
    "shortCode": "VD"
  }, {
    "name": "Zug",
    "shortCode": "ZG"
  }, {
    "name": "Zürich",
    "shortCode": "ZH"
  }]
}, {
  "countryName": "Syrian Arab Republic",
  "countryShortCode": "SY",
  "regions": [{
    "name": "Al Hasakah",
    "shortCode": "HA"
  }, {
    "name": "Al Ladhiqiyah",
    "shortCode": "LA"
  }, {
    "name": "Al Qunaytirah",
    "shortCode": "QU"
  }, {
    "name": "Ar Raqqah",
    "shortCode": "RA"
  }, {
    "name": "As Suwayda'",
    "shortCode": "SU"
  }, {
    "name": "Dar'a",
    "shortCode": "DR"
  }, {
    "name": "Dayr az Zawr",
    "shortCode": "DY"
  }, {
    "name": "Dimashq",
    "shortCode": "DI"
  }, {
    "name": "Halab",
    "shortCode": "HL"
  }, {
    "name": "Hamah",
    "shortCode": "HM"
  }, {
    "name": "Hims",
    "shortCode": "HI"
  }, {
    "name": "Idlib",
    "shortCode": "ID"
  }, {
    "name": "Rif Dimashq",
    "shortCode": "RD"
  }, {
    "name": "Tartus",
    "shortCode": "TA"
  }]
}, {
  "countryName": "Taiwan",
  "countryShortCode": "TW",
  "regions": [{
    "name": "Chang-hua",
    "shortCode": "CHA"
  }, {
    "name": "Chia-i",
    "shortCode": "CYQ"
  }, {
    "name": "Hsin-chu",
    "shortCode": "HSQ"
  }, {
    "name": "Hua-lien",
    "shortCode": "HUA"
  }, {
    "name": "Kao-hsiung",
    "shortCode": "KHH"
  }, {
    "name": "Keelung",
    "shortCode": "KEE"
  }, {
    "name": "Kinmen",
    "shortCode": "KIN"
  }, {
    "name": "Lienchiang",
    "shortCode": "LIE"
  }, {
    "name": "Miao-li",
    "shortCode": "MIA"
  }, {
    "name": "Nan-t'ou",
    "shortCode": "NAN"
  }, {
    "name": "P'eng-hu",
    "shortCode": "PEN"
  }, {
    "name": "New Taipei",
    "shortCode": "NWT"
  }, {
    "name": "P'ing-chung",
    "shortCode": "PIF"
  }, {
    "name": "T'ai-chung",
    "shortCode": "TXG"
  }, {
    "name": "T'ai-nan",
    "shortCode": "TNN"
  }, {
    "name": "T'ai-pei",
    "shortCode": "TPE"
  }, {
    "name": "T'ai-tung",
    "shortCode": "TTT"
  }, {
    "name": "T'ao-yuan",
    "shortCode": "TAO"
  }, {
    "name": "Yi-lan",
    "shortCode": "ILA"
  }, {
    "name": "Yun-lin",
    "shortCode": "YUN"
  }]
}, {
  "countryName": "Tajikistan",
  "countryShortCode": "TJ",
  "regions": [{
    "name": "Dushanbe",
    "shortCode": "DU"
  }, {
    "name": "Kŭhistoni Badakhshon",
    "shortCode": "GB"
  }, {
    "name": "Khatlon",
    "shortCode": "KT"
  }, {
    "name": "Sughd",
    "shortCode": "SU"
  }]
}, {
  "countryName": "Tanzania, United Republic of",
  "countryShortCode": "TZ",
  "regions": [{
    "name": "Arusha",
    "shortCode": "01"
  }, {
    "name": "Coast",
    "shortCode": "19"
  }, {
    "name": "Dar es Salaam",
    "shortCode": "02"
  }, {
    "name": "Dodoma",
    "shortCode": "03"
  }, {
    "name": "Iringa",
    "shortCode": "04"
  }, {
    "name": "Kagera",
    "shortCode": "05"
  }, {
    "name": "Kigoma",
    "shortCode": "08"
  }, {
    "name": "Kilimanjaro",
    "shortCode": "09"
  }, {
    "name": "Lindi",
    "shortCode": "12"
  }, {
    "name": "Manyara",
    "shortCode": "26"
  }, {
    "name": "Mara",
    "shortCode": "13"
  }, {
    "name": "Mbeya",
    "shortCode": "14"
  }, {
    "name": "Morogoro",
    "shortCode": "16"
  }, {
    "name": "Mtwara",
    "shortCode": "17"
  }, {
    "name": "Mwanza",
    "shortCode": "18"
  }, {
    "name": "Pemba North",
    "shortCode": "06"
  }, {
    "name": "Pemba South",
    "shortCode": "10"
  }, {
    "name": "Rukwa",
    "shortCode": "20"
  }, {
    "name": "Ruvuma",
    "shortCode": "21"
  }, {
    "name": "Shinyanga",
    "shortCode": "22"
  }, {
    "name": "Singida",
    "shortCode": "23"
  }, {
    "name": "Tabora",
    "shortCode": "24"
  }, {
    "name": "Tanga",
    "shortCode": "25"
  }, {
    "name": "Zanzibar North",
    "shortCode": "07"
  }, {
    "name": "Zanzibar Central/South",
    "shortCode": "11"
  }, {
    "name": "Zanzibar Urban/West",
    "shortCode": "15"
  }]
}, {
  "countryName": "Thailand",
  "countryShortCode": "TH",
  "regions": [{
    "name": "Amnat Charoen",
    "shortCode": "37"
  }, {
    "name": "Ang Thong",
    "shortCode": "15"
  }, {
    "name": "Bueng Kan",
    "shortCode": "38"
  }, {
    "name": "Buri Ram",
    "shortCode": "31"
  }, {
    "name": "Chachoengsao",
    "shortCode": "24"
  }, {
    "name": "Chai Nat",
    "shortCode": "18"
  }, {
    "name": "Chaiyaphum",
    "shortCode": "36"
  }, {
    "name": "Chanthaburi",
    "shortCode": "22"
  }, {
    "name": "Chiang Mai",
    "shortCode": "50"
  }, {
    "name": "Chiang Rai",
    "shortCode": "57"
  }, {
    "name": "Chon Buri",
    "shortCode": "20"
  }, {
    "name": "Chumphon",
    "shortCode": "86"
  }, {
    "name": "Kalasin",
    "shortCode": "46"
  }, {
    "name": "Kamphaeng Phet",
    "shortCode": "62"
  }, {
    "name": "Kanchanaburi",
    "shortCode": "71"
  }, {
    "name": "Khon Kaen",
    "shortCode": "40"
  }, {
    "name": "Krabi",
    "shortCode": "81"
  }, {
    "name": "Krung Thep Mahanakhon (Bangkok)",
    "shortCode": "10"
  }, {
    "name": "Lampang",
    "shortCode": "52"
  }, {
    "name": "Lamphun",
    "shortCode": "51"
  }, {
    "name": "Loei",
    "shortCode": "42"
  }, {
    "name": "Lop Buri",
    "shortCode": "16"
  }, {
    "name": "Mae Hong Son",
    "shortCode": "58"
  }, {
    "name": "Maha Sarakham",
    "shortCode": "44"
  }, {
    "name": "Mukdahan",
    "shortCode": "49"
  }, {
    "name": "Nakhon Nayok",
    "shortCode": "26"
  }, {
    "name": "Nakhon Phathom",
    "shortCode": "73"
  }, {
    "name": "Nakhon Phanom",
    "shortCode": "48"
  }, {
    "name": "Nakhon Ratchasima",
    "shortCode": "30"
  }, {
    "name": "Nakhon Sawan",
    "shortCode": "60"
  }, {
    "name": "Nakhon Si Thammarat",
    "shortCode": "80"
  }, {
    "name": "Nan",
    "shortCode": "55"
  }, {
    "name": "Narathiwat",
    "shortCode": "96"
  }, {
    "name": "Nong Bua Lam Phu",
    "shortCode": "39"
  }, {
    "name": "Nong Khai",
    "shortCode": "43"
  }, {
    "name": "Nonthaburi",
    "shortCode": "12"
  }, {
    "name": "Pathum Thani",
    "shortCode": "13"
  }, {
    "name": "Pattani",
    "shortCode": "94"
  }, {
    "name": "Phangnga",
    "shortCode": "82"
  }, {
    "name": "Phatthalung",
    "shortCode": "93"
  }, {
    "name": "Phayao",
    "shortCode": "56"
  }, {
    "name": "Phetchabun",
    "shortCode": "76"
  }, {
    "name": "Phetchaburi",
    "shortCode": "76"
  }, {
    "name": "Phichit",
    "shortCode": "66"
  }, {
    "name": "Phitsanulok",
    "shortCode": "65"
  }, {
    "name": "Phra Nakhon Si Ayutthaya",
    "shortCode": "14"
  }, {
    "name": "Phrae",
    "shortCode": "54"
  }, {
    "name": "Phuket",
    "shortCode": "83"
  }, {
    "name": "Prachin Buri",
    "shortCode": "25"
  }, {
    "name": "Prachuap Khiri Khan",
    "shortCode": "77"
  }, {
    "name": "Ranong",
    "shortCode": "85"
  }, {
    "name": "Ratchaburi",
    "shortCode": "70"
  }, {
    "name": "Rayong",
    "shortCode": "21"
  }, {
    "name": "Roi Et",
    "shortCode": "45"
  }, {
    "name": "Sa Kaeo",
    "shortCode": "27"
  }, {
    "name": "Sakon Nakhon",
    "shortCode": "47"
  }, {
    "name": "Samut Prakan",
    "shortCode": "11"
  }, {
    "name": "Samut Sakhon",
    "shortCode": "74"
  }, {
    "name": "Samut Songkhram",
    "shortCode": "75"
  }, {
    "name": "Saraburi",
    "shortCode": "19"
  }, {
    "name": "Satun",
    "shortCode": "91"
  }, {
    "name": "Sing Buri",
    "shortCode": "17"
  }, {
    "name": "Si Sa ket",
    "shortCode": "33"
  }, {
    "name": "Songkhla",
    "shortCode": "90"
  }, {
    "name": "Sukhothai",
    "shortCode": "64"
  }, {
    "name": "Suphan Buri",
    "shortCode": "72"
  }, {
    "name": "Surat Thani",
    "shortCode": "84"
  }, {
    "name": "Surin",
    "shortCode": "32"
  }, {
    "name": "Tak",
    "shortCode": "63"
  }, {
    "name": "Trang",
    "shortCode": "92"
  }, {
    "name": "Trat",
    "shortCode": "23"
  }, {
    "name": "Ubon Ratchathani",
    "shortCode": "34"
  }, {
    "name": "Udon Thani",
    "shortCode": "41"
  }, {
    "name": "Uthai Thani",
    "shortCode": "61"
  }, {
    "name": "Uttaradit",
    "shortCode": "53"
  }, {
    "name": "Yala",
    "shortCode": "95"
  }, {
    "name": "Yasothon",
    "shortCode": "35"
  }]
}, {
  "countryName": "Timor-Leste",
  "countryShortCode": "TL",
  "regions": [{
    "name": "Aileu",
    "shortCode": "AL"
  }, {
    "name": "Ainaro",
    "shortCode": "AN"
  }, {
    "name": "Baucau",
    "shortCode": "BA"
  }, {
    "name": "Bobonaro",
    "shortCode": "BO"
  }, {
    "name": "Cova Lima",
    "shortCode": "CO"
  }, {
    "name": "Dili",
    "shortCode": "DI"
  }, {
    "name": "Ermera",
    "shortCode": "ER"
  }, {
    "name": "Lautem",
    "shortCode": "LA"
  }, {
    "name": "Liquica",
    "shortCode": "LI"
  }, {
    "name": "Manatuto",
    "shortCode": "MT"
  }, {
    "name": "Manufahi",
    "shortCode": "MF"
  }, {
    "name": "Oecussi",
    "shortCode": "OE"
  }, {
    "name": "Viqueque",
    "shortCode": "VI"
  }]
}, {
  "countryName": "Togo",
  "countryShortCode": "TG",
  "regions": [{
    "name": "Centre",
    "shortCode": "C"
  }, {
    "name": "Kara",
    "shortCode": "K"
  }, {
    "name": "Maritime",
    "shortCode": "M"
  }, {
    "name": "Plateaux",
    "shortCode": "P"
  }, {
    "name": "Savannes",
    "shortCode": "S"
  }]
}, {
  "countryName": "Tokelau",
  "countryShortCode": "TK",
  "regions": [{
    "name": "Atafu"
  }, {
    "name": "Fakaofo"
  }, {
    "name": "Nukunonu"
  }]
}, {
  "countryName": "Tonga",
  "countryShortCode": "TO",
  "regions": [{
    "name": "'Eua",
    "shortCode": "01"
  }, {
    "name": "Ha'apai",
    "shortCode": "02"
  }, {
    "name": "Niuas",
    "shortCode": "03"
  }, {
    "name": "Tongatapu",
    "shortCode": "04"
  }, {
    "name": "Vava'u",
    "shortCode": "05"
  }]
}, {
  "countryName": "Trinidad and Tobago",
  "countryShortCode": "TT",
  "regions": [{
    "name": "Arima",
    "shortCode": "ARI"
  }, {
    "name": "Chaguanas",
    "shortCode": "CHA"
  }, {
    "name": "Couva-Tabaquite-Talparo",
    "shortCode": "CTT"
  }, {
    "name": "Diefo Martin",
    "shortCode": "DMN"
  }, {
    "name": "Mayaro-Rio Claro",
    "shortCode": "MRC"
  }, {
    "name": "Penal-Debe",
    "shortCode": "PED"
  }, {
    "name": "Point Fortin",
    "shortCode": "PTF"
  }, {
    "name": "Port-of-Spain",
    "shortCode": "POS"
  }, {
    "name": "Princes Town",
    "shortCode": "PRT"
  }, {
    "name": "San Fernando",
    "shortCode": "SFO"
  }, {
    "name": "San Juan-Laventille",
    "shortCode": "SJL"
  }, {
    "name": "Sangre Grande",
    "shortCode": "SGE"
  }, {
    "name": "Siparia",
    "shortCode": "SIP"
  }, {
    "name": "Tobago",
    "shortCode": "TOB"
  }, {
    "name": "Tunapuna-Piarco",
    "shortCode": "TUP"
  }]
}, {
  "countryName": "Tunisia",
  "countryShortCode": "TN",
  "regions": [{
    "name": "Ariana",
    "shortCode": "12"
  }, {
    "name": "Beja",
    "shortCode": "31"
  }, {
    "name": "Ben Arous",
    "shortCode": "13"
  }, {
    "name": "Bizerte",
    "shortCode": "23"
  }, {
    "name": "Gabes",
    "shortCode": "81"
  }, {
    "name": "Gafsa",
    "shortCode": "71"
  }, {
    "name": "Jendouba",
    "shortCode": "32"
  }, {
    "name": "Kairouan",
    "shortCode": "41"
  }, {
    "name": "Kasserine",
    "shortCode": "42"
  }, {
    "name": "Kebili",
    "shortCode": "73"
  }, {
    "name": "Kef",
    "shortCode": "33"
  }, {
    "name": "Mahdia",
    "shortCode": "53"
  }, {
    "name": "Medenine",
    "shortCode": "82"
  }, {
    "name": "Monastir",
    "shortCode": "52"
  }, {
    "name": "Nabeul",
    "shortCode": "21"
  }, {
    "name": "Sfax",
    "shortCode": "61"
  }, {
    "name": "Sidi Bouzid",
    "shortCode": "43"
  }, {
    "name": "Siliana",
    "shortCode": "34"
  }, {
    "name": "Sousse",
    "shortCode": "51"
  }, {
    "name": "Tataouine",
    "shortCode": "83"
  }, {
    "name": "Tozeur",
    "shortCode": "72"
  }, {
    "name": "Tunis",
    "shortCode": "11"
  }, {
    "name": "Zaghouan",
    "shortCode": "22"
  }]
}, {
  "countryName": "Turkey",
  "countryShortCode": "TR",
  "regions": [{
    "name": "Adana",
    "shortCode": "01"
  }, {
    "name": "Adiyaman",
    "shortCode": "02"
  }, {
    "name": "Afyonkarahisar",
    "shortCode": "03"
  }, {
    "name": "Agri",
    "shortCode": "04"
  }, {
    "name": "Aksaray",
    "shortCode": "68"
  }, {
    "name": "Amasya",
    "shortCode": "05"
  }, {
    "name": "Ankara",
    "shortCode": "06"
  }, {
    "name": "Antalya",
    "shortCode": "07"
  }, {
    "name": "Ardahan",
    "shortCode": "75"
  }, {
    "name": "Artvin",
    "shortCode": "08"
  }, {
    "name": "Aydin",
    "shortCode": "09"
  }, {
    "name": "Balikesir",
    "shortCode": "10"
  }, {
    "name": "Bartin",
    "shortCode": "74"
  }, {
    "name": "Batman",
    "shortCode": "72"
  }, {
    "name": "Bayburt",
    "shortCode": "69"
  }, {
    "name": "Bilecik",
    "shortCode": "11"
  }, {
    "name": "Bingol",
    "shortCode": "12"
  }, {
    "name": "Bitlis",
    "shortCode": "13"
  }, {
    "name": "Bolu",
    "shortCode": "14"
  }, {
    "name": "Burdur",
    "shortCode": "15"
  }, {
    "name": "Bursa",
    "shortCode": "16"
  }, {
    "name": "Canakkale",
    "shortCode": "17"
  }, {
    "name": "Cankiri",
    "shortCode": "18"
  }, {
    "name": "Corum",
    "shortCode": "19"
  }, {
    "name": "Denizli",
    "shortCode": "20"
  }, {
    "name": "Diyarbakir",
    "shortCode": "21"
  }, {
    "name": "Duzce",
    "shortCode": "81"
  }, {
    "name": "Edirne",
    "shortCode": "22"
  }, {
    "name": "Elazig",
    "shortCode": "23"
  }, {
    "name": "Erzincan",
    "shortCode": "24"
  }, {
    "name": "Erzurum",
    "shortCode": "25"
  }, {
    "name": "Eskisehir",
    "shortCode": "26"
  }, {
    "name": "Gaziantep",
    "shortCode": "27"
  }, {
    "name": "Giresun",
    "shortCode": "28"
  }, {
    "name": "Gumushane",
    "shortCode": "29"
  }, {
    "name": "Hakkari",
    "shortCode": "30"
  }, {
    "name": "Hatay",
    "shortCode": "31"
  }, {
    "name": "Igdir",
    "shortCode": "76"
  }, {
    "name": "Isparta",
    "shortCode": "32"
  }, {
    "name": "Istanbul",
    "shortCode": "34"
  }, {
    "name": "Izmir",
    "shortCode": "35"
  }, {
    "name": "Kahramanmaras",
    "shortCode": "46"
  }, {
    "name": "Karabuk",
    "shortCode": "78"
  }, {
    "name": "Karaman",
    "shortCode": "70"
  }, {
    "name": "Kars",
    "shortCode": "36"
  }, {
    "name": "Kastamonu",
    "shortCode": "37"
  }, {
    "name": "Kayseri",
    "shortCode": "38"
  }, {
    "name": "Kilis",
    "shortCode": "79"
  }, {
    "name": "Kirikkale",
    "shortCode": "71"
  }, {
    "name": "Kirklareli",
    "shortCode": "39"
  }, {
    "name": "Kirsehir",
    "shortCode": "40"
  }, {
    "name": "Kocaeli",
    "shortCode": "41"
  }, {
    "name": "Konya",
    "shortCode": "42"
  }, {
    "name": "Kutahya",
    "shortCode": "43"
  }, {
    "name": "Malatya",
    "shortCode": "44"
  }, {
    "name": "Manisa",
    "shortCode": "45"
  }, {
    "name": "Mardin",
    "shortCode": "47"
  }, {
    "name": "Mersin",
    "shortCode": "33"
  }, {
    "name": "Mugla",
    "shortCode": "48"
  }, {
    "name": "Mus",
    "shortCode": "49"
  }, {
    "name": "Nevsehir",
    "shortCode": "50"
  }, {
    "name": "Nigde",
    "shortCode": "51"
  }, {
    "name": "Ordu",
    "shortCode": "52"
  }, {
    "name": "Osmaniye",
    "shortCode": "80"
  }, {
    "name": "Rize",
    "shortCode": "53"
  }, {
    "name": "Sakarya",
    "shortCode": "54"
  }, {
    "name": "Samsun",
    "shortCode": "55"
  }, {
    "name": "Sanliurfa",
    "shortCode": "63"
  }, {
    "name": "Siirt",
    "shortCode": "56"
  }, {
    "name": "Sinop",
    "shortCode": "57"
  }, {
    "name": "Sirnak",
    "shortCode": "73"
  }, {
    "name": "Sivas",
    "shortCode": "58"
  }, {
    "name": "Tekirdag",
    "shortCode": "59"
  }, {
    "name": "Tokat",
    "shortCode": "60"
  }, {
    "name": "Trabzon",
    "shortCode": "61"
  }, {
    "name": "Tunceli",
    "shortCode": "62"
  }, {
    "name": "Usak",
    "shortCode": "64"
  }, {
    "name": "Van",
    "shortCode": "65"
  }, {
    "name": "Yalova",
    "shortCode": "77"
  }, {
    "name": "Yozgat",
    "shortCode": "66"
  }, {
    "name": "Zonguldak",
    "shortCode": "67"
  }]
}, {
  "countryName": "Turkmenistan",
  "countryShortCode": "TM",
  "regions": [{
    "name": "Ahal",
    "shortCode": "A"
  }, {
    "name": "Asgabat",
    "shortCode": "S"
  }, {
    "name": "Balkan",
    "shortCode": "B"
  }, {
    "name": "Dashoguz",
    "shortCode": "D"
  }, {
    "name": "Lebap",
    "shortCode": "L"
  }, {
    "name": "Mary",
    "shortCode": "M"
  }]
}, {
  "countryName": "Turks and Caicos Islands",
  "countryShortCode": "TC",
  "regions": [{
    "name": "Turks and Caicos Islands"
  }]
}, {
  "countryName": "Tuvalu",
  "countryShortCode": "TV",
  "regions": [{
    "name": "Funafuti",
    "shortCode": "FUN"
  }, {
    "name": "Nanumanga",
    "shortCode": "NMG"
  }, {
    "name": "Nanumea",
    "shortCode": "NMA"
  }, {
    "name": "Niutao",
    "shortCode": "NIT"
  }, {
    "name": "Nui",
    "shortCode": "NUI"
  }, {
    "name": "Nukufetau",
    "shortCode": "NKF"
  }, {
    "name": "Nukulaelae",
    "shortCode": "NKL"
  }, {
    "name": "Vaitupu",
    "shortCode": "VAU"
  }]
}, {
  "countryName": "Uganda",
  "countryShortCode": "UG",
  "regions": [{
    "name": "Abim",
    "shortCode": "317"
  }, {
    "name": "Adjumani",
    "shortCode": "301"
  }, {
    "name": "Amolatar",
    "shortCode": "314"
  }, {
    "name": "Amuria",
    "shortCode": "216"
  }, {
    "name": "Amuru",
    "shortCode": "319"
  }, {
    "name": "Apac",
    "shortCode": "302"
  }, {
    "name": "Arua",
    "shortCode": "303"
  }, {
    "name": "Budaka",
    "shortCode": "217"
  }, {
    "name": "Bududa",
    "shortCode": "223"
  }, {
    "name": "Bugiri",
    "shortCode": "201"
  }, {
    "name": "Bukedea",
    "shortCode": "224"
  }, {
    "name": "Bukwa",
    "shortCode": "218"
  }, {
    "name": "Buliisa",
    "shortCode": "419"
  }, {
    "name": "Bundibugyo",
    "shortCode": "401"
  }, {
    "name": "Bushenyi",
    "shortCode": "402"
  }, {
    "name": "Busia",
    "shortCode": "202"
  }, {
    "name": "Butaleja",
    "shortCode": "219"
  }, {
    "name": "Dokolo",
    "shortCode": "318"
  }, {
    "name": "Gulu",
    "shortCode": "304"
  }, {
    "name": "Hoima",
    "shortCode": "403"
  }, {
    "name": "Ibanda",
    "shortCode": "416"
  }, {
    "name": "Iganga",
    "shortCode": "203"
  }, {
    "name": "Isingiro",
    "shortCode": "417"
  }, {
    "name": "Jinja",
    "shortCode": "204"
  }, {
    "name": "Kaabong",
    "shortCode": "315"
  }, {
    "name": "Kabale",
    "shortCode": "404"
  }, {
    "name": "Kabarole",
    "shortCode": "405"
  }, {
    "name": "Kaberamaido",
    "shortCode": "213"
  }, {
    "name": "Kalangala",
    "shortCode": "101"
  }, {
    "name": "Kaliro",
    "shortCode": "220"
  }, {
    "name": "Kampala",
    "shortCode": "102"
  }, {
    "name": "Kamuli",
    "shortCode": "205"
  }, {
    "name": "Kamwenge",
    "shortCode": "413"
  }, {
    "name": "Kanungu",
    "shortCode": "414"
  }, {
    "name": "Kapchorwa",
    "shortCode": "206"
  }, {
    "name": "Kasese",
    "shortCode": "406"
  }, {
    "name": "Katakwi",
    "shortCode": "207"
  }, {
    "name": "Kayunga",
    "shortCode": "112"
  }, {
    "name": "Kibaale",
    "shortCode": "407"
  }, {
    "name": "Kiboga",
    "shortCode": "103"
  }, {
    "name": "Kiruhura",
    "shortCode": "418"
  }, {
    "name": "Kisoro",
    "shortCode": "408"
  }, {
    "name": "Kitgum",
    "shortCode": "305"
  }, {
    "name": "Koboko",
    "shortCode": "316"
  }, {
    "name": "Kotido",
    "shortCode": "306"
  }, {
    "name": "Kumi",
    "shortCode": "208"
  }, {
    "name": "Kyenjojo",
    "shortCode": "415"
  }, {
    "name": "Lira",
    "shortCode": "307"
  }, {
    "name": "Luwero",
    "shortCode": "104"
  }, {
    "name": "Lyantonde",
    "shortCode": "116"
  }, {
    "name": "Manafwa",
    "shortCode": "221"
  }, {
    "name": "Maracha",
    "shortCode": "320"
  }, {
    "name": "Masaka",
    "shortCode": "105"
  }, {
    "name": "Masindi",
    "shortCode": "409"
  }, {
    "name": "Mayuge",
    "shortCode": "214"
  }, {
    "name": "Mbale",
    "shortCode": "209"
  }, {
    "name": "Mbarara",
    "shortCode": "410"
  }, {
    "name": "Mityana",
    "shortCode": "114"
  }, {
    "name": "Moroto",
    "shortCode": "308"
  }, {
    "name": "Moyo",
    "shortCode": "309"
  }, {
    "name": "Mpigi",
    "shortCode": "106"
  }, {
    "name": "Mubende",
    "shortCode": "107"
  }, {
    "name": "Mukono",
    "shortCode": "108"
  }, {
    "name": "Nakapiripirit",
    "shortCode": "311"
  }, {
    "name": "Nakaseke",
    "shortCode": "115"
  }, {
    "name": "Nakasongola",
    "shortCode": "109"
  }, {
    "name": "Namutumba",
    "shortCode": "222"
  }, {
    "name": "Nebbi",
    "shortCode": "310"
  }, {
    "name": "Ntungamo",
    "shortCode": "411"
  }, {
    "name": "Oyam",
    "shortCode": "321"
  }, {
    "name": "Pader",
    "shortCode": "312"
  }, {
    "name": "Pallisa",
    "shortCode": "210"
  }, {
    "name": "Rakai",
    "shortCode": "110"
  }, {
    "name": "Rukungiri",
    "shortCode": "412"
  }, {
    "name": "Sembabule",
    "shortCode": "111"
  }, {
    "name": "Sironko",
    "shortCode": "215"
  }, {
    "name": "Soroti",
    "shortCode": "211"
  }, {
    "name": "Tororo",
    "shortCode": "212"
  }, {
    "name": "Wakiso",
    "shortCode": "113"
  }, {
    "name": "Yumbe",
    "shortCode": "313"
  }]
}, {
  "countryName": "Ukraine",
  "countryShortCode": "UA",
  "regions": [{
    "name": "Cherkasy",
    "shortCode": "71"
  }, {
    "name": "Chernihiv",
    "shortCode": "74"
  }, {
    "name": "Chernivtsi",
    "shortCode": "77"
  }, {
    "name": "Dnipropetrovsk",
    "shortCode": "12"
  }, {
    "name": "Donetsk",
    "shortCode": "14"
  }, {
    "name": "Ivano-Frankivsk",
    "shortCode": "26"
  }, {
    "name": "Kharkiv",
    "shortCode": "63"
  }, {
    "name": "Kherson",
    "shortCode": "65"
  }, {
    "name": "Khmelnytskyi",
    "shortCode": "68"
  }, {
    "name": "Kiev",
    "shortCode": "32"
  }, {
    "name": "Kirovohrad",
    "shortCode": "35"
  }, {
    "name": "Luhansk",
    "shortCode": "09"
  }, {
    "name": "Lviv",
    "shortCode": "46"
  }, {
    "name": "Mykolaiv",
    "shortCode": "48"
  }, {
    "name": "Odessa",
    "shortCode": "51"
  }, {
    "name": "Poltava",
    "shortCode": "53"
  }, {
    "name": "Rivne",
    "shortCode": "56"
  }, {
    "name": "Sumy",
    "shortCode": "59"
  }, {
    "name": "Ternopil",
    "shortCode": "61"
  }, {
    "name": "Vinnytsia",
    "shortCode": "05"
  }, {
    "name": "Volyn",
    "shortCode": "07"
  }, {
    "name": "Zakarpattia",
    "shortCode": "21"
  }, {
    "name": "Zaporizhia",
    "shortCode": "23"
  }, {
    "name": "Zhytomyr",
    "shortCode": "18"
  }, {
    "name": "Avtonomna Respublika Krym",
    "shortCode": "43"
  }, {
    "name": "Kyïv",
    "shortCode": "30"
  }, {
    "name": "Sevastopol",
    "shortCode": "40"
  }]
}, {
  "countryName": "United Arab Emirates",
  "countryShortCode": "AE",
  "regions": [{
    "name": "Abu Dhabi",
    "shortCode": "AZ"
  }, {
    "name": "Ajman",
    "shortCode": "AJ"
  }, {
    "name": "Dubai",
    "shortCode": "DU"
  }, {
    "name": "Fujairah",
    "shortCode": "FU"
  }, {
    "name": "Ras al Khaimah",
    "shortCode": "RK"
  }, {
    "name": "Sharjah",
    "shortCode": "SH"
  }, {
    "name": "Umm Al Quwain",
    "shortCode": "UQ"
  }]
}, {
  "countryName": "United Kingdom",
  "countryShortCode": "GB",
  "regions": [{
    "name": "Avon",
    "shortCode": "AVN"
  }, {
    "name": "Bedfordshire",
    "shortCode": "BDF"
  }, {
    "name": "Berkshire",
    "shortCode": "BRK"
  }, {
    "name": "Bristol, City of",
    "shortCode": "COB"
  }, {
    "name": "Buckinghamshire",
    "shortCode": "BKM"
  }, {
    "name": "Cambridgeshire",
    "shortCode": "CAM"
  }, {
    "name": "Cheshire",
    "shortCode": "CHS"
  }, {
    "name": "Cleveland",
    "shortCode": "CLV"
  }, {
    "name": "Cornwall",
    "shortCode": "CON"
  }, {
    "name": "Cumbria",
    "shortCode": "CMA"
  }, {
    "name": "Derbyshire",
    "shortCode": "DBY"
  }, {
    "name": "Devon",
    "shortCode": "DEV"
  }, {
    "name": "Dorset",
    "shortCode": "DOR"
  }, {
    "name": "Durham",
    "shortCode": "DUR"
  }, {
    "name": "East Sussex",
    "shortCode": "SXE"
  }, {
    "name": "Essex",
    "shortCode": "ESS"
  }, {
    "name": "Gloucestershire",
    "shortCode": "GLS"
  }, {
    "name": "Greater London",
    "shortCode": "LND"
  }, {
    "name": "Greater Manchester",
    "shortCode": "GTM"
  }, {
    "name": "Hampshire",
    "shortCode": "HAM"
  }, {
    "name": "Hereford and Worcester",
    "shortCode": "HWR"
  }, {
    "name": "Herefordshire",
    "shortCode": "HEF"
  }, {
    "name": "Hertfordshire",
    "shortCode": "HRT"
  }, {
    "name": "Isle of Wight",
    "shortCode": "IOW"
  }, {
    "name": "Kent",
    "shortCode": "KEN"
  }, {
    "name": "Lancashire",
    "shortCode": "LAN"
  }, {
    "name": "Leicestershire",
    "shortCode": "LEI"
  }, {
    "name": "Lincolnshire",
    "shortCode": "LIN"
  }, {
    "name": "London",
    "shortCode": "LDN"
  }, {
    "name": "Merseyside",
    "shortCode": "MSY"
  }, {
    "name": "Middlesex",
    "shortCode": "MDX"
  }, {
    "name": "Norfolk",
    "shortCode": "NFK"
  }, {
    "name": "Northamptonshire",
    "shortCode": "NTH"
  }, {
    "name": "Northumberland",
    "shortCode": "NBL"
  }, {
    "name": "North Humberside",
    "shortCode": "NHM"
  }, {
    "name": "North Yorkshire",
    "shortCode": "NYK"
  }, {
    "name": "Nottinghamshire",
    "shortCode": "NTT"
  }, {
    "name": "Oxfordshire",
    "shortCode": "OXF"
  }, {
    "name": "Rutland",
    "shortCode": "RUT"
  }, {
    "name": "Shropshire",
    "shortCode": "SAL"
  }, {
    "name": "Somerset",
    "shortCode": "SOM"
  }, {
    "name": "South Humberside",
    "shortCode": "SHM"
  }, {
    "name": "South Yorkshire",
    "shortCode": "SYK"
  }, {
    "name": "Staffordshire",
    "shortCode": "STS"
  }, {
    "name": "Suffolk",
    "shortCode": "SFK"
  }, {
    "name": "Surrey",
    "shortCode": "SRY"
  }, {
    "name": "Tyne and Wear",
    "shortCode": "TWR"
  }, {
    "name": "Warwickshire",
    "shortCode": "WAR"
  }, {
    "name": "West Midlands",
    "shortCode": "WMD"
  }, {
    "name": "West Sussex",
    "shortCode": "SXW"
  }, {
    "name": "West Yorkshire",
    "shortCode": "WYK"
  }, {
    "name": "Wiltshire",
    "shortCode": "WIL"
  }, {
    "name": "Worcestershire",
    "shortCode": "WOR"
  }, {
    "name": "Antrim",
    "shortCode": "ANT"
  }, {
    "name": "Armagh",
    "shortCode": "ARM"
  }, {
    "name": "Belfast, City of",
    "shortCode": "BLF"
  }, {
    "name": "Down",
    "shortCode": "DOW"
  }, {
    "name": "Fermanagh",
    "shortCode": "FER"
  }, {
    "name": "Londonderry",
    "shortCode": "LDY"
  }, {
    "name": "Derry, City of",
    "shortCode": "DRY"
  }, {
    "name": "Tyrone",
    "shortCode": "TYR"
  }, {
    "name": "Aberdeen, City of",
    "shortCode": "AN"
  }, {
    "name": "Aberdeenshire",
    "shortCode": "ABD"
  }, {
    "name": "Angus (Forfarshire)",
    "shortCode": "ANS"
  }, {
    "name": "Argyll",
    "shortCode": "AGB"
  }, {
    "name": "Ayrshire",
    "shortCode": "ARG"
  }, {
    "name": "Banffshire",
    "shortCode": "BAN"
  }, {
    "name": "Berwickshire",
    "shortCode": "BEW"
  }, {
    "name": "Bute",
    "shortCode": "BUT"
  }, {
    "name": "Caithness",
    "shortCode": "CAI"
  }, {
    "name": "Clackmannanshire",
    "shortCode": "CLK"
  }, {
    "name": "Cromartyshire",
    "shortCode": "COC"
  }, {
    "name": "Dumfriesshire",
    "shortCode": "DFS"
  }, {
    "name": "Dunbartonshire (Dumbarton)",
    "shortCode": "DNB"
  }, {
    "name": "Dundee, City of",
    "shortCode": "DD"
  }, {
    "name": "East Lothian (Haddingtonshire)",
    "shortCode": "ELN"
  }, {
    "name": "Edinburgh, City of",
    "shortCode": "EB"
  }, {
    "name": "Fife",
    "shortCode": "FIF"
  }, {
    "name": "Glasgow, City of",
    "shortCode": "GLA"
  }, {
    "name": "Inverness-shire",
    "shortCode": "INV"
  }, {
    "name": "Kincardineshire",
    "shortCode": "KCD"
  }, {
    "name": "Kinross-shire",
    "shortCode": "KRS"
  }, {
    "name": "Kirkcudbrightshire",
    "shortCode": "KKD"
  }, {
    "name": "Lanarkshire",
    "shortCode": "LKS"
  }, {
    "name": "Midlothian (County of Edinburgh)",
    "shortCode": "MLN"
  }, {
    "name": "Moray (Elginshire)",
    "shortCode": "MOR"
  }, {
    "name": "Nairnshire",
    "shortCode": "NAI"
  }, {
    "name": "Orkney",
    "shortCode": "OKI"
  }, {
    "name": "Peeblesshire",
    "shortCode": "PEE"
  }, {
    "name": "Perthshire",
    "shortCode": "PER"
  }, {
    "name": "Renfrewshire",
    "shortCode": "RFW"
  }, {
    "name": "Ross and Cromarty",
    "shortCode": "ROC"
  }, {
    "name": "Ross-shire",
    "shortCode": "ROS"
  }, {
    "name": "Roxburghshire",
    "shortCode": "ROX"
  }, {
    "name": "Selkirkshire",
    "shortCode": "SEL"
  }, {
    "name": "Shetland (Zetland)",
    "shortCode": "SHI"
  }, {
    "name": "Stirlingshire",
    "shortCode": "STI"
  }, {
    "name": "Sutherland",
    "shortCode": "SUT"
  }, {
    "name": "West Lothian (Linlithgowshire)",
    "shortCode": "WLN"
  }, {
    "name": "Wigtownshire",
    "shortCode": "WIG"
  }, {
    "name": "Clwyd",
    "shortCode": "CWD"
  }, {
    "name": "Dyfed",
    "shortCode": "DFD"
  }, {
    "name": "Gwent",
    "shortCode": "GNT"
  }, {
    "name": "Gwynedd",
    "shortCode": "GWN"
  }, {
    "name": "Mid Glamorgan",
    "shortCode": "MGM"
  }, {
    "name": "Powys",
    "shortCode": "POW"
  }, {
    "name": "South Glamorgan",
    "shortCode": "SGM"
  }, {
    "name": "West Glamorgan",
    "shortCode": "WGM"
  }]
}, {
  "countryName": "United States",
  "countryShortCode": "US",
  "regions": [{
    "name": "Alabama",
    "shortCode": "AL"
  }, {
    "name": "Alaska",
    "shortCode": "AK"
  }, {
    "name": "American Samoa",
    "shortCode": "AS"
  }, {
    "name": "Arizona",
    "shortCode": "AZ"
  }, {
    "name": "Arkansas",
    "shortCode": "AR"
  }, {
    "name": "California",
    "shortCode": "CA"
  }, {
    "name": "Colorado",
    "shortCode": "CO"
  }, {
    "name": "Connecticut",
    "shortCode": "CT"
  }, {
    "name": "Delaware",
    "shortCode": "DE"
  }, {
    "name": "District of Columbia",
    "shortCode": "DC"
  }, {
    "name": "Micronesia",
    "shortCode": "FM"
  }, {
    "name": "Florida",
    "shortCode": "FL"
  }, {
    "name": "Georgia",
    "shortCode": "GA"
  }, {
    "name": "Guam",
    "shortCode": "GU"
  }, {
    "name": "Hawaii",
    "shortCode": "HI"
  }, {
    "name": "Idaho",
    "shortCode": "ID"
  }, {
    "name": "Illinois",
    "shortCode": "IL"
  }, {
    "name": "Indiana",
    "shortCode": "IN"
  }, {
    "name": "Iowa",
    "shortCode": "IA"
  }, {
    "name": "Kansas",
    "shortCode": "KS"
  }, {
    "name": "Kentucky",
    "shortCode": "KY"
  }, {
    "name": "Louisiana",
    "shortCode": "LA"
  }, {
    "name": "Maine",
    "shortCode": "ME"
  }, {
    "name": "Marshall Islands",
    "shortCode": "MH"
  }, {
    "name": "Maryland",
    "shortCode": "MD"
  }, {
    "name": "Massachusetts",
    "shortCode": "MA"
  }, {
    "name": "Michigan",
    "shortCode": "MI"
  }, {
    "name": "Minnesota",
    "shortCode": "MN"
  }, {
    "name": "Mississippi",
    "shortCode": "MS"
  }, {
    "name": "Missouri",
    "shortCode": "MO"
  }, {
    "name": "Montana",
    "shortCode": "MT"
  }, {
    "name": "Nebraska",
    "shortCode": "NE"
  }, {
    "name": "Nevada",
    "shortCode": "NV"
  }, {
    "name": "New Hampshire",
    "shortCode": "NH"
  }, {
    "name": "New Jersey",
    "shortCode": "NJ"
  }, {
    "name": "New Mexico",
    "shortCode": "NM"
  }, {
    "name": "New York",
    "shortCode": "NY"
  }, {
    "name": "North Carolina",
    "shortCode": "NC"
  }, {
    "name": "North Dakota",
    "shortCode": "ND"
  }, {
    "name": "Northern Mariana Islands",
    "shortCode": "MP"
  }, {
    "name": "Ohio",
    "shortCode": "OH"
  }, {
    "name": "Oklahoma",
    "shortCode": "OK"
  }, {
    "name": "Oregon",
    "shortCode": "OR"
  }, {
    "name": "Palau",
    "shortCode": "PW"
  }, {
    "name": "Pennsylvania",
    "shortCode": "PA"
  }, {
    "name": "Puerto Rico",
    "shortCode": "PR"
  }, {
    "name": "Rhode Island",
    "shortCode": "RI"
  }, {
    "name": "South Carolina",
    "shortCode": "SC"
  }, {
    "name": "South Dakota",
    "shortCode": "SD"
  }, {
    "name": "Tennessee",
    "shortCode": "TN"
  }, {
    "name": "Texas",
    "shortCode": "TX"
  }, {
    "name": "Utah",
    "shortCode": "UT"
  }, {
    "name": "Vermont",
    "shortCode": "VT"
  }, {
    "name": "Virgin Islands",
    "shortCode": "VI"
  }, {
    "name": "Virginia",
    "shortCode": "VA"
  }, {
    "name": "Washington",
    "shortCode": "WA"
  }, {
    "name": "West Virginia",
    "shortCode": "WV"
  }, {
    "name": "Wisconsin",
    "shortCode": "WI"
  }, {
    "name": "Wyoming",
    "shortCode": "WY"
  }, {
    "name": "Armed Forces Americas",
    "shortCode": "AA"
  }, {
    "name": "Armed Forces Europe, Canada, Africa and Middle East",
    "shortCode": "AE"
  }, {
    "name": "Armed Forces Pacific",
    "shortCode": "AP"
  }]
}, {
  "countryName": "United States Minor Outlying Islands",
  "countryShortCode": "UM",
  "regions": [{
    "name": "Baker Island",
    "shortCode": "81"
  }, {
    "name": "Howland Island",
    "shortCode": "84"
  }, {
    "name": "Jarvis Island",
    "shortCode": "86"
  }, {
    "name": "Johnston Atoll",
    "shortCode": "67"
  }, {
    "name": "Kingman Reef",
    "shortCode": "89"
  }, {
    "name": "Midway Islands",
    "shortCode": "71"
  }, {
    "name": "Navassa Island",
    "shortCode": "76"
  }, {
    "name": "Palmyra Atoll",
    "shortCode": "95"
  }, {
    "name": "Wake Island",
    "shortCode": "79"
  }, {
    "name": "Bajo Nuevo Bank",
    "shortCode": "BN"
  }, {
    "name": "Serranilla Bank",
    "shortCode": "SB"
  }]
}, {
  "countryName": "Uruguay",
  "countryShortCode": "UY",
  "regions": [{
    "name": "Artigas",
    "shortCode": "AR"
  }, {
    "name": "Canelones",
    "shortCode": "CA"
  }, {
    "name": "Cerro Largo",
    "shortCode": "CL"
  }, {
    "name": "Colonia",
    "shortCode": "CO"
  }, {
    "name": "Durazno",
    "shortCode": "DU"
  }, {
    "name": "Flores",
    "shortCode": "FS"
  }, {
    "name": "Florida",
    "shortCode": "FD"
  }, {
    "name": "Lavalleja",
    "shortCode": "LA"
  }, {
    "name": "Maldonado",
    "shortCode": "MA"
  }, {
    "name": "Montevideo",
    "shortCode": "MO"
  }, {
    "name": "Paysandú",
    "shortCode": "PA"
  }, {
    "name": "Río Negro",
    "shortCode": "RN"
  }, {
    "name": "Rivera",
    "shortCode": "RV"
  }, {
    "name": "Rocha",
    "shortCode": "RO"
  }, {
    "name": "Salto",
    "shortCode": "SA"
  }, {
    "name": "San José",
    "shortCode": "SJ"
  }, {
    "name": "Soriano",
    "shortCode": "SO"
  }, {
    "name": "Tacuarembó",
    "shortCode": "TA"
  }, {
    "name": "Treinta y Tres",
    "shortCode": "TT"
  }]
}, {
  "countryName": "Uzbekistan",
  "countryShortCode": "UZ",
  "regions": [{
    "name": "Toshkent shahri",
    "shortCode": "TK"
  }, {
    "name": "Andijon",
    "shortCode": "AN"
  }, {
    "name": "Buxoro",
    "shortCode": "BU"
  }, {
    "name": "Farg‘ona",
    "shortCode": "FA"
  }, {
    "name": "Jizzax",
    "shortCode": "JI"
  }, {
    "name": "Namangan",
    "shortCode": "NG"
  }, {
    "name": "Navoiy",
    "shortCode": "NW"
  }, {
    "name": "Qashqadaryo (Qarshi)",
    "shortCode": "QA"
  }, {
    "name": "Samarqand",
    "shortCode": "SA"
  }, {
    "name": "Sirdaryo (Guliston)",
    "shortCode": "SI"
  }, {
    "name": "Surxondaryo (Termiz)",
    "shortCode": "SU"
  }, {
    "name": "Toshkent wiloyati",
    "shortCode": "TO"
  }, {
    "name": "Xorazm (Urganch)",
    "shortCode": "XO"
  }, {
    "name": "Qoraqalpog‘iston Respublikasi (Nukus)",
    "shortCode": "QR"
  }]
}, {
  "countryName": "Vanuatu",
  "countryShortCode": "VU",
  "regions": [{
    "name": "Malampa",
    "shortCode": "MAP"
  }, {
    "name": "Pénama",
    "shortCode": "PAM"
  }, {
    "name": "Sanma",
    "shortCode": "SAM"
  }, {
    "name": "Shéfa",
    "shortCode": "SEE"
  }, {
    "name": "Taféa",
    "shortCode": "TAE"
  }, {
    "name": "Torba",
    "shortCode": "TOB"
  }]
}, {
  "countryName": "Venezuela, Bolivarian Republic of",
  "countryShortCode": "VE",
  "regions": [{
    "name": "Dependencias Federales",
    "shortCode": "W"
  }, {
    "name": "Distrito Federal",
    "shortCode": "A"
  }, {
    "name": "Amazonas",
    "shortCode": "Z"
  }, {
    "name": "Anzoátegui",
    "shortCode": "B"
  }, {
    "name": "Apure",
    "shortCode": "C"
  }, {
    "name": "Aragua",
    "shortCode": "D"
  }, {
    "name": "Barinas",
    "shortCode": "E"
  }, {
    "name": "Bolívar",
    "shortCode": "F"
  }, {
    "name": "Carabobo",
    "shortCode": "G"
  }, {
    "name": "Cojedes",
    "shortCode": "H"
  }, {
    "name": "Delta Amacuro",
    "shortCode": "Y"
  }, {
    "name": "Falcón",
    "shortCode": "I"
  }, {
    "name": "Guárico",
    "shortCode": "J"
  }, {
    "name": "Lara",
    "shortCode": "K"
  }, {
    "name": "Mérida",
    "shortCode": "L"
  }, {
    "name": "Miranda",
    "shortCode": "M"
  }, {
    "name": "Monagas",
    "shortCode": "N"
  }, {
    "name": "Nueva Esparta",
    "shortCode": "O"
  }, {
    "name": "Portuguesa",
    "shortCode": "P"
  }, {
    "name": "Sucre",
    "shortCode": "R"
  }, {
    "name": "Táchira",
    "shortCode": "S"
  }, {
    "name": "Trujillo",
    "shortCode": "T"
  }, {
    "name": "Vargas",
    "shortCode": "X"
  }, {
    "name": "Yaracuy",
    "shortCode": "U"
  }, {
    "name": "Zulia",
    "shortCode": "V"
  }]
}, {
  "countryName": "Vietnam",
  "countryShortCode": "VN",
  "regions": [{
    "name": "Đồng Nai",
    "shortCode": "39"
  }, {
    "name": "Đồng Tháp",
    "shortCode": "45"
  }, {
    "name": "Gia Lai",
    "shortCode": "30"
  }, {
    "name": "Hà Giang",
    "shortCode": "03"
  }, {
    "name": "Hà Nam",
    "shortCode": "63"
  }, {
    "name": "Hà Tây",
    "shortCode": "15"
  }, {
    "name": "Hà Tĩnh",
    "shortCode": "23"
  }, {
    "name": "Hải Dương",
    "shortCode": "61"
  }, {
    "name": "Hậu Giang",
    "shortCode": "73"
  }, {
    "name": "Hòa Bình",
    "shortCode": "14"
  }, {
    "name": "Hưng Yên",
    "shortCode": "66"
  }, {
    "name": "Khánh Hòa",
    "shortCode": "34"
  }, {
    "name": "Kiên Giang",
    "shortCode": "47"
  }, {
    "name": "Kon Tum",
    "shortCode": "28"
  }, {
    "name": "Lai Châu",
    "shortCode": "01"
  }, {
    "name": "Lâm Đồng",
    "shortCode": "35"
  }, {
    "name": "Lạng Sơn",
    "shortCode": "09"
  }, {
    "name": "Lào Cai",
    "shortCode": "02"
  }, {
    "name": "Long An",
    "shortCode": "41"
  }, {
    "name": "Nam Định",
    "shortCode": "67"
  }, {
    "name": "Nghệ An",
    "shortCode": "22"
  }, {
    "name": "Ninh Bình",
    "shortCode": "18"
  }, {
    "name": "Ninh Thuận",
    "shortCode": "36"
  }, {
    "name": "Phú Thọ",
    "shortCode": "68"
  }, {
    "name": "Phú Yên",
    "shortCode": "32"
  }, {
    "name": "Quảng Bình",
    "shortCode": "24"
  }, {
    "name": "Quảng Nam",
    "shortCode": "27"
  }, {
    "name": "Quảng Ngãi",
    "shortCode": "29"
  }, {
    "name": "Quảng Ninh",
    "shortCode": "13"
  }, {
    "name": "Quảng Trị",
    "shortCode": "25"
  }, {
    "name": "Sóc Trăng",
    "shortCode": "52"
  }, {
    "name": "Sơn La",
    "shortCode": "05"
  }, {
    "name": "Tây Ninh",
    "shortCode": "37"
  }, {
    "name": "Thái Bình",
    "shortCode": "20"
  }, {
    "name": "Thái Nguyên",
    "shortCode": "69"
  }, {
    "name": "Thanh Hóa",
    "shortCode": "21"
  }, {
    "name": "Thừa Thiên–Huế",
    "shortCode": "26"
  }, {
    "name": "Tiền Giang",
    "shortCode": "46"
  }, {
    "name": "Trà Vinh",
    "shortCode": "51"
  }, {
    "name": "Tuyên Quang",
    "shortCode": "07"
  }, {
    "name": "Vĩnh Long",
    "shortCode": "49"
  }, {
    "name": "Vĩnh Phúc",
    "shortCode": "70"
  }, {
    "name": "Yên Bái",
    "shortCode": "06"
  }, {
    "name": "Cần Thơ",
    "shortCode": "CT"
  }, {
    "name": "Đà Nẵng",
    "shortCode": "DN"
  }, {
    "name": "Hà Nội",
    "shortCode": "HN"
  }, {
    "name": "Hải Phòng",
    "shortCode": "HP"
  }, {
    "name": "Hồ Chí Minh (Sài Gòn)",
    "shortCode": "SG"
  }]
}, {
  "countryName": "Virgin Islands, British",
  "countryShortCode": "VG",
  "regions": [{
    "name": "Anegada",
    "shortCode": "ANG"
  }, {
    "name": "Jost Van Dyke",
    "shortCode": "JVD"
  }, {
    "name": "Tortola",
    "shortCode": "TTA"
  }, {
    "name": "Virgin Gorda",
    "shortCode": "VGD"
  }]
}, {
  "countryName": "Virgin Islands, U.S.",
  "countryShortCode": "VI",
  "regions": [{
    "name": "St. Thomas",
    "shortCode": "STH"
  }, {
    "name": "St. John",
    "shortCode": "SJO"
  }, {
    "name": "St. Croix",
    "shortCode": "SCR"
  }]
}, {
  "countryName": "Wallis and Futuna",
  "countryShortCode": "WF",
  "regions": [{
    "name": "Alo",
    "shortCode": "ALO"
  }, {
    "name": "Sigave",
    "shortCode": "SIG"
  }, {
    "name": "Wallis",
    "shortCode": "WAL"
  }]
}, {
  "countryName": "Western Sahara",
  "countryShortCode": "EH",
  "regions": [{
    "name": "Es Smara",
    "shortCode": "ESM"
  }, {
    "name": "Boujdour",
    "shortCode": "BOD"
  }, {
    "name": "Laâyoune",
    "shortCode": "LAA"
  }, {
    "name": "Aousserd",
    "shortCode": "AOU"
  }, {
    "name": "Oued ed Dahab",
    "shortCode": "OUD"
  }]
}, {
  "countryName": "Yemen",
  "countryShortCode": "YE",
  "regions": [{
    "name": "Abyān",
    "shortCode": "AB"
  }, {
    "name": "'Adan",
    "shortCode": "AD"
  }, {
    "name": "Aḑ Ḑāli'",
    "shortCode": "DA"
  }, {
    "name": "Al Bayḑā'",
    "shortCode": "BA"
  }, {
    "name": "Al Ḩudaydah",
    "shortCode": "HU"
  }, {
    "name": "Al Jawf",
    "shortCode": "JA"
  }, {
    "name": "Al Mahrah",
    "shortCode": "MR"
  }, {
    "name": "Al Maḩwīt",
    "shortCode": "MW"
  }, {
    "name": "'Amrān",
    "shortCode": "AM"
  }, {
    "name": "Dhamār",
    "shortCode": "DH"
  }, {
    "name": "Ḩaḑramawt",
    "shortCode": "HD"
  }, {
    "name": "Ḩajjah",
    "shortCode": "HJ"
  }, {
    "name": "Ibb",
    "shortCode": "IB"
  }, {
    "name": "Laḩij",
    "shortCode": "LA"
  }, {
    "name": "Ma'rib",
    "shortCode": "MA"
  }, {
    "name": "Raymah",
    "shortCode": "RA"
  }, {
    "name": "Şā‘dah",
    "shortCode": "SD"
  }, {
    "name": "Şan‘ā'",
    "shortCode": "SN"
  }, {
    "name": "Shabwah",
    "shortCode": "SH"
  }, {
    "name": "Tā‘izz",
    "shortCode": "TA"
  }]
}, {
  "countryName": "Zambia",
  "countryShortCode": "ZM",
  "regions": [{
    "name": "Central",
    "shortCode": "02"
  }, {
    "name": "Copperbelt",
    "shortCode": "08"
  }, {
    "name": "Eastern",
    "shortCode": "03"
  }, {
    "name": "Luapula",
    "shortCode": "04"
  }, {
    "name": "Lusaka",
    "shortCode": "09"
  }, {
    "name": "Northern",
    "shortCode": "05"
  }, {
    "name": "North-Western",
    "shortCode": "06"
  }, {
    "name": "Southern",
    "shortCode": "07"
  }, {
    "name": "Western",
    "shortCode": "01"
  }]
}, {
  "countryName": "Zimbabwe",
  "countryShortCode": "ZW",
  "regions": [{
    "name": "Bulawayo",
    "shortCode": "BU"
  }, {
    "name": "Harare",
    "shortCode": "HA"
  }, {
    "name": "Manicaland",
    "shortCode": "MA"
  }, {
    "name": "Mashonaland Central",
    "shortCode": "MC"
  }, {
    "name": "Mashonaland East",
    "shortCode": "ME"
  }, {
    "name": "Mashonaland West",
    "shortCode": "MW"
  }, {
    "name": "Masvingo",
    "shortCode": "MV"
  }, {
    "name": "Matabeleland North",
    "shortCode": "MN"
  }, {
    "name": "Matabeleland South",
    "shortCode": "MS"
  }, {
    "name": "Midlands",
    "shortCode": "MI"
  }]
}]);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/country-select.vue?vue&type=script&lang=js&







/* harmony default export */ var country_selectvue_type_script_lang_js_ = ({
  name: 'CountrySelect',
  props: {
    country: String,
    countryName: Boolean,
    whiteList: Array,
    blackList: Array,
    className: String,
    shortCodeDropdown: Boolean,
    topCountry: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: 'Select Country'
    },
    disablePlaceholder: {
      type: Boolean,
      default: false
    },
    removePlaceholder: {
      type: Boolean,
      default: false
    },
    usei18n: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      ran: false
    };
  },
  computed: {
    countries: function countries() {
      var _this = this;

      var countryList = src_data.filter(function (region) {
        if (_this.countryName) {
          return region.countryName !== _this.firstCountry;
        } else {
          return region.countryShortCode !== _this.firstCountry;
        }
      });

      if (this.whiteList) {
        countryList = countryList.filter(function (country) {
          return _this.whiteList.includes(country.countryShortCode);
        });
      }

      if (this.blackList) {
        countryList = countryList.filter(function (country) {
          return !_this.blackList.includes(country.countryShortCode);
        });
      }

      if (this.$i18n && this.usei18n) {
        countryList = countryList.map(function (country) {
          var localeCountry = assign_default()({}, country);

          localeCountry.countryName = _this.$t(country.countryName);
          return localeCountry;
        });
        countryList.sort(function (country1, country2) {
          return country1.countryName > country2.countryName ? 1 : -1;
        });
      }

      if (this.removePlaceholder) {
        var c = this.firstCountry || countryList[0][this.valueType];
        this.onChange(c);
      }

      return countryList;
    },
    firstCountry: function firstCountry() {
      var _this2 = this;

      if (this.countryName) {
        if (this.topCountry.length === 2) {
          var regionObj = src_data.find(function (region) {
            return region.countryShortCode === _this2.topCountry;
          });
          return regionObj.countryName;
        } else {
          return this.topCountry;
        }
      }

      if (this.topCountry) {
        return this.topCountry;
      }

      return '';
    },
    name: function name() {
      return this.name;
    },
    value: function value() {
      return this.country;
    },
    valueType: function valueType() {
      return this.countryName ? 'countryName' : 'countryShortCode';
    }
  },
  methods: {
    onChange: function onChange(country) {
      this.$emit('input', country);
    },
    topCountryName: function topCountryName() {
      var _this3 = this;

      var regionObj = src_data.find(function (region) {
        if (_this3.countryName) {
          return region.countryName === _this3.firstCountry;
        } else {
          return region.countryShortCode === _this3.firstCountry;
        }
      });

      if (this.$i18n && this.usei18n) {
        return this.$t(regionObj.countryName);
      }

      return this.shortCodeDropdown ? regionObj.countryShortCode : regionObj.countryName;
    }
  }
});
// CONCATENATED MODULE: ./src/components/country-select.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_country_selectvue_type_script_lang_js_ = (country_selectvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/country-select.vue





/* normalize component */

var component = normalizeComponent(
  components_country_selectvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var country_select = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"6dc7dc89-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/region-select.vue?vue&type=template&id=72f206fe&
var region_selectvue_type_template_id_72f206fe_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('select',{class:_vm.className,on:{"change":function($event){_vm.onChange($event.target.value)}}},[(!_vm.disablePlaceholder && !_vm.removePlaceholder)?_c('option',{attrs:{"value":""}},[_vm._v(_vm._s(_vm.placeholder))]):_vm._e(),(_vm.disablePlaceholder && !_vm.removePlaceholder)?_c('option',{attrs:{"value":"","disabled":"","selected":""}},[_vm._v(_vm._s(_vm.placeholder))]):_vm._e(),_vm._l((_vm.shownRegions),function(place,index){return _c('option',{key:index,domProps:{"value":place[_vm.valueType],"selected":_vm.region === place[_vm.valueType]}},[_vm._v(_vm._s(_vm.shortCodeDropdown ? place.shortCode : place.name))])})],2)}
var region_selectvue_type_template_id_72f206fe_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/region-select.vue?vue&type=template&id=72f206fe&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/region-select.vue?vue&type=script&lang=js&







/* harmony default export */ var region_selectvue_type_script_lang_js_ = ({
  name: 'RegionSelect',
  props: {
    country: String,
    region: String,
    defaultRegion: String,
    countryName: Boolean,
    whiteList: Array,
    blackList: Array,
    regionName: Boolean,
    className: String,
    shortCodeDropdown: Boolean,
    placeholder: {
      type: String,
      default: 'Select Region'
    },
    disablePlaceholder: {
      type: Boolean,
      default: false
    },
    removePlaceholder: {
      type: Boolean,
      default: false
    },
    usei18n: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      shownRegions: [],
      regions: src_data,
      ran: false
    };
  },
  mounted: function mounted() {
    if (this.country) {
      this.getRegionWithCountry();
    } else {
      var findRegion = '';

      if (this.countryName) {
        findRegion = this.defaultRegion ? this.defaultRegion : 'United States';
      } else {
        findRegion = this.defaultRegion ? this.defaultRegion : 'US';
      }

      this.getRegionWithCountry(findRegion);
    }
  },
  computed: {
    name: function name() {
      return this.name;
    },
    value: function value() {
      return this.region;
    },
    valueType: function valueType() {
      return this.regionName ? 'name' : 'shortCode';
    }
  },
  methods: {
    onChange: function onChange(region) {
      this.$emit('input', region);
    },
    getRegionWithCountry: function getRegionWithCountry(country) {
      var _this = this;

      country = country || this.country;
      var countryRegions = src_data.find(function (elem) {
        if (_this.countryName) {
          return elem.countryName === country;
        } else {
          return elem.countryShortCode === country;
        }
      }).regions;

      if (this.$i18n && this.usei18n) {
        countryRegions = countryRegions.map(function (region) {
          var localeRegion = assign_default()({}, region);

          localeRegion.name = _this.$t(region.name);
          return localeRegion;
        });
        countryRegions.sort(function (region1, region2) {
          return region1.name > region2.name ? 1 : -1;
        });
      }

      if (this.whiteList) {
        countryRegions = countryRegions.filter(function (region) {
          return _this.whiteList.includes(region.shortCode);
        });
      }

      if (this.blackList) {
        countryRegions = countryRegions.filter(function (region) {
          return !_this.blackList.includes(region.shortCode);
        });
      }

      this.shownRegions = countryRegions;

      if (this.disablePlaceholder && this.ran) {
        this.onChange(this.shownRegions[0][this.valueType]);
      }

      if (this.removePlaceholder) {
        this.onChange(this.shownRegions[0][this.valueType]);
      }

      this.ran = true;
    }
  },
  watch: {
    country: function country(newVal, oldVal) {
      if (oldVal !== '') {
        this.onChange('');
      }

      if (this.country) {
        this.getRegionWithCountry();
      } else {
        this.shownRegions = [];
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/region-select.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_region_selectvue_type_script_lang_js_ = (region_selectvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/region-select.vue





/* normalize component */

var region_select_component = normalizeComponent(
  components_region_selectvue_type_script_lang_js_,
  region_selectvue_type_template_id_72f206fe_render,
  region_selectvue_type_template_id_72f206fe_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var region_select = (region_select_component.exports);
// CONCATENATED MODULE: ./src/index.js






var src_install = function install(Vue) {
  var components = {
    CountrySelect: country_select,
    RegionSelect: region_select
  };

  keys_default()(components).forEach(function (name) {
    Vue.component(name, components[name]);
  });
};

var VueCountryRegionSelect = {
  CountrySelect: country_select,
  RegionSelect: region_select,
  install: src_install
};
/* harmony default export */ var src = (VueCountryRegionSelect);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js
/* concated harmony reexport CountrySelect */__webpack_require__.d(__webpack_exports__, "CountrySelect", function() { return country_select; });
/* concated harmony reexport RegionSelect */__webpack_require__.d(__webpack_exports__, "RegionSelect", function() { return region_select; });


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src);



/***/ })

/******/ });
//# sourceMappingURL=vueCountryRegionSelect.common.js.map