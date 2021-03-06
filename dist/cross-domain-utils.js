!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define("crossDomainUtils", [], factory) : "object" == typeof exports ? exports.crossDomainUtils = factory() : root.crossDomainUtils = factory();
}("undefined" != typeof self ? self : this, function() {
    return function(modules) {
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: !1,
                exports: {}
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.l = !0;
            return module.exports;
        }
        var installedModules = {};
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                configurable: !1,
                enumerable: !0,
                get: getter
            });
        };
        __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function() {
                return module.default;
            } : function() {
                return module;
            };
            __webpack_require__.d(getter, "a", getter);
            return getter;
        };
        __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = "./src/index.js");
    }({
        "./src/index.js": function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            var _utils = __webpack_require__("./src/utils.js");
            Object.keys(_utils).forEach(function(key) {
                "default" !== key && "__esModule" !== key && Object.defineProperty(exports, key, {
                    enumerable: !0,
                    get: function() {
                        return _utils[key];
                    }
                });
            });
            var _types = __webpack_require__("./src/types.js");
            Object.keys(_types).forEach(function(key) {
                "default" !== key && "__esModule" !== key && Object.defineProperty(exports, key, {
                    enumerable: !0,
                    get: function() {
                        return _types[key];
                    }
                });
            });
        },
        "./src/types.js": function(module, exports, __webpack_require__) {
            "use strict";
        },
        "./src/util.js": function(module, exports, __webpack_require__) {
            "use strict";
            function isRegex(item) {
                return "[object RegExp]" === Object.prototype.toString.call(item);
            }
            function noop() {}
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            exports.isRegex = isRegex;
            exports.noop = noop;
        },
        "./src/utils.js": function(module, exports, __webpack_require__) {
            "use strict";
            function isFileProtocol() {
                return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window).location.protocol === CONSTANTS.FILE_PROTOCOL;
            }
            function isAboutProtocol() {
                return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window).location.protocol === CONSTANTS.ABOUT_PROTOCOL;
            }
            function getParent(win) {
                if (win) try {
                    if (win.parent && win.parent !== win) return win.parent;
                } catch (err) {}
            }
            function getOpener(win) {
                if (win && !getParent(win)) try {
                    return win.opener;
                } catch (err) {}
            }
            function canReadFromWindow(win) {
                try {
                    (0, _util.noop)(win && win.location && win.location.href);
                    return !0;
                } catch (err) {}
                return !1;
            }
            function getActualDomain(win) {
                var location = win.location;
                if (!location) throw new Error("Can not read window location");
                var protocol = location.protocol;
                if (!protocol) throw new Error("Can not read window protocol");
                if (protocol === CONSTANTS.FILE_PROTOCOL) return CONSTANTS.FILE_PROTOCOL + "//";
                if (protocol === CONSTANTS.ABOUT_PROTOCOL) {
                    var parent = getParent(win);
                    return parent && canReadFromWindow(win) ? getActualDomain(parent) : CONSTANTS.ABOUT_PROTOCOL + "//";
                }
                var host = location.host;
                if (!host) throw new Error("Can not read window host");
                return protocol + "//" + host;
            }
            function getDomain(win) {
                win = win || window;
                var domain = getActualDomain(win);
                return domain && win.mockDomain && 0 === win.mockDomain.indexOf(CONSTANTS.MOCK_PROTOCOL) ? win.mockDomain : domain;
            }
            function isBlankDomain(win) {
                try {
                    if (!win.location.href) return !0;
                    if ("about:blank" === win.location.href) return !0;
                } catch (err) {}
                return !1;
            }
            function isActuallySameDomain(win) {
                try {
                    if (win === window) return !0;
                } catch (err) {}
                try {
                    var desc = Object.getOwnPropertyDescriptor(win, "location");
                    if (desc && !1 === desc.enumerable) return !1;
                } catch (err) {}
                try {
                    if (isAboutProtocol(win) && canReadFromWindow(win)) return !0;
                } catch (err) {}
                try {
                    if (getActualDomain(win) === getActualDomain(window)) return !0;
                } catch (err) {}
                return !1;
            }
            function isSameDomain(win) {
                if (!isActuallySameDomain(win)) return !1;
                try {
                    if (win === window) return !0;
                    if (isAboutProtocol(win) && canReadFromWindow(win)) return !0;
                    if (getDomain(window) === getDomain(win)) return !0;
                } catch (err) {}
                return !1;
            }
            function getParents(win) {
                var result = [];
                try {
                    for (;win.parent !== win; ) {
                        result.push(win.parent);
                        win = win.parent;
                    }
                } catch (err) {}
                return result;
            }
            function isAncestorParent(parent, child) {
                if (!parent || !child) return !1;
                var childParent = getParent(child);
                return childParent ? childParent === parent : -1 !== getParents(child).indexOf(parent);
            }
            function getFrames(win) {
                var result = [], frames = void 0;
                try {
                    frames = win.frames;
                } catch (err) {
                    frames = win;
                }
                var len = void 0;
                try {
                    len = frames.length;
                } catch (err) {}
                if (0 === len) return result;
                if (len) {
                    for (var i = 0; i < len; i++) {
                        var frame = void 0;
                        try {
                            frame = frames[i];
                        } catch (err) {
                            continue;
                        }
                        result.push(frame);
                    }
                    return result;
                }
                for (var _i = 0; _i < 100; _i++) {
                    var _frame = void 0;
                    try {
                        _frame = frames[_i];
                    } catch (err) {
                        return result;
                    }
                    if (!_frame) return result;
                    result.push(_frame);
                }
                return result;
            }
            function getAllChildFrames(win) {
                for (var result = [], _iterator = getFrames(win), _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
                    var _ref;
                    if (_isArray) {
                        if (_i2 >= _iterator.length) break;
                        _ref = _iterator[_i2++];
                    } else {
                        _i2 = _iterator.next();
                        if (_i2.done) break;
                        _ref = _i2.value;
                    }
                    var frame = _ref;
                    result.push(frame);
                    for (var _iterator2 = getAllChildFrames(frame), _isArray2 = Array.isArray(_iterator2), _i3 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator](); ;) {
                        var _ref2;
                        if (_isArray2) {
                            if (_i3 >= _iterator2.length) break;
                            _ref2 = _iterator2[_i3++];
                        } else {
                            _i3 = _iterator2.next();
                            if (_i3.done) break;
                            _ref2 = _i3.value;
                        }
                        var childFrame = _ref2;
                        result.push(childFrame);
                    }
                }
                return result;
            }
            function getTop(win) {
                if (win) {
                    try {
                        if (win.top) return win.top;
                    } catch (err) {}
                    if (getParent(win) === win) return win;
                    try {
                        if (isAncestorParent(window, win) && window.top) return window.top;
                    } catch (err) {}
                    try {
                        if (isAncestorParent(win, window) && window.top) return window.top;
                    } catch (err) {}
                    for (var _iterator3 = getAllChildFrames(win), _isArray3 = Array.isArray(_iterator3), _i4 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator](); ;) {
                        var _ref3;
                        if (_isArray3) {
                            if (_i4 >= _iterator3.length) break;
                            _ref3 = _iterator3[_i4++];
                        } else {
                            _i4 = _iterator3.next();
                            if (_i4.done) break;
                            _ref3 = _i4.value;
                        }
                        var frame = _ref3;
                        try {
                            if (frame.top) return frame.top;
                        } catch (err) {}
                        if (getParent(frame) === frame) return frame;
                    }
                }
            }
            function getAllFramesInWindow(win) {
                var top = getTop(win);
                return getAllChildFrames(top).concat(top);
            }
            function isTop(win) {
                return win === getTop(win);
            }
            function isFrameWindowClosed(frame) {
                if (!frame.contentWindow) return !0;
                if (!frame.parentNode) return !0;
                var doc = frame.ownerDocument;
                return !(!doc || !doc.body || doc.body.contains(frame));
            }
            function safeIndexOf(collection, item) {
                for (var i = 0; i < collection.length; i++) try {
                    if (collection[i] === item) return i;
                } catch (err) {}
                return -1;
            }
            function isWindowClosed(win) {
                var allowMock = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                try {
                    if (win === window) return !1;
                } catch (err) {
                    return !0;
                }
                try {
                    if (!win) return !0;
                } catch (err) {
                    return !0;
                }
                try {
                    if (win.closed) return !0;
                } catch (err) {
                    return !err || err.message !== IE_WIN_ACCESS_ERROR;
                }
                if (allowMock && isSameDomain(win)) try {
                    if (win.mockclosed) return !0;
                } catch (err) {}
                try {
                    if (!win.parent || !win.top) return !0;
                } catch (err) {}
                try {
                    (0, _util.noop)(win === win);
                } catch (err) {
                    return !0;
                }
                var iframeIndex = safeIndexOf(iframeWindows, win);
                if (-1 !== iframeIndex) {
                    var frame = iframeFrames[iframeIndex];
                    if (frame && isFrameWindowClosed(frame)) return !0;
                }
                return !1;
            }
            function cleanIframes() {
                for (var i = 0; i < iframeFrames.length; i++) if (isFrameWindowClosed(iframeFrames[i])) {
                    iframeFrames.splice(i, 1);
                    iframeWindows.splice(i, 1);
                }
                for (var _i5 = 0; _i5 < iframeWindows.length; _i5++) if (isWindowClosed(iframeWindows[_i5])) {
                    iframeFrames.splice(_i5, 1);
                    iframeWindows.splice(_i5, 1);
                }
            }
            function linkFrameWindow(frame) {
                cleanIframes();
                if (frame && frame.contentWindow) try {
                    iframeWindows.push(frame.contentWindow);
                    iframeFrames.push(frame);
                } catch (err) {}
            }
            function getUserAgent(win) {
                win = win || window;
                return win.navigator.mockUserAgent || win.navigator.userAgent;
            }
            function getFrameByName(win, name) {
                for (var winFrames = getFrames(win), _iterator4 = winFrames, _isArray4 = Array.isArray(_iterator4), _i6 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator](); ;) {
                    var _ref4;
                    if (_isArray4) {
                        if (_i6 >= _iterator4.length) break;
                        _ref4 = _iterator4[_i6++];
                    } else {
                        _i6 = _iterator4.next();
                        if (_i6.done) break;
                        _ref4 = _i6.value;
                    }
                    var childFrame = _ref4;
                    try {
                        if (isSameDomain(childFrame) && childFrame.name === name && -1 !== winFrames.indexOf(childFrame)) return childFrame;
                    } catch (err) {}
                }
                try {
                    if (-1 !== winFrames.indexOf(win.frames[name])) return win.frames[name];
                } catch (err) {}
                try {
                    if (-1 !== winFrames.indexOf(win[name])) return win[name];
                } catch (err) {}
            }
            function findChildFrameByName(win, name) {
                var frame = getFrameByName(win, name);
                if (frame) return frame;
                for (var _iterator5 = getFrames(win), _isArray5 = Array.isArray(_iterator5), _i7 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator](); ;) {
                    var _ref5;
                    if (_isArray5) {
                        if (_i7 >= _iterator5.length) break;
                        _ref5 = _iterator5[_i7++];
                    } else {
                        _i7 = _iterator5.next();
                        if (_i7.done) break;
                        _ref5 = _i7.value;
                    }
                    var childFrame = _ref5, namedFrame = findChildFrameByName(childFrame, name);
                    if (namedFrame) return namedFrame;
                }
            }
            function findFrameByName(win, name) {
                var frame = void 0;
                frame = getFrameByName(win, name);
                return frame || findChildFrameByName(getTop(win) || win, name);
            }
            function isParent(win, frame) {
                var frameParent = getParent(frame);
                if (frameParent) return frameParent === win;
                for (var _iterator6 = getFrames(win), _isArray6 = Array.isArray(_iterator6), _i8 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator](); ;) {
                    var _ref6;
                    if (_isArray6) {
                        if (_i8 >= _iterator6.length) break;
                        _ref6 = _iterator6[_i8++];
                    } else {
                        _i8 = _iterator6.next();
                        if (_i8.done) break;
                        _ref6 = _i8.value;
                    }
                    if (_ref6 === frame) return !0;
                }
                return !1;
            }
            function isOpener(parent, child) {
                return parent === getOpener(child);
            }
            function getAncestor(win) {
                win = win || window;
                var opener = getOpener(win);
                if (opener) return opener;
                var parent = getParent(win);
                return parent || void 0;
            }
            function getAncestors(win) {
                for (var results = [], ancestor = win; ancestor; ) {
                    ancestor = getAncestor(ancestor);
                    ancestor && results.push(ancestor);
                }
                return results;
            }
            function isAncestor(parent, child) {
                var actualParent = getAncestor(child);
                if (actualParent) return actualParent === parent;
                if (child === parent) return !1;
                if (getTop(child) === child) return !1;
                for (var _iterator7 = getFrames(parent), _isArray7 = Array.isArray(_iterator7), _i9 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator](); ;) {
                    var _ref7;
                    if (_isArray7) {
                        if (_i9 >= _iterator7.length) break;
                        _ref7 = _iterator7[_i9++];
                    } else {
                        _i9 = _iterator7.next();
                        if (_i9.done) break;
                        _ref7 = _i9.value;
                    }
                    if (_ref7 === child) return !0;
                }
                return !1;
            }
            function isPopup() {
                return Boolean(getOpener(window));
            }
            function isIframe() {
                return Boolean(getParent(window));
            }
            function isFullpage() {
                return Boolean(!isIframe() && !isPopup());
            }
            function anyMatch(collection1, collection2) {
                for (var _iterator8 = collection1, _isArray8 = Array.isArray(_iterator8), _i10 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator](); ;) {
                    var _ref8;
                    if (_isArray8) {
                        if (_i10 >= _iterator8.length) break;
                        _ref8 = _iterator8[_i10++];
                    } else {
                        _i10 = _iterator8.next();
                        if (_i10.done) break;
                        _ref8 = _i10.value;
                    }
                    for (var item1 = _ref8, _iterator9 = collection2, _isArray9 = Array.isArray(_iterator9), _i11 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator](); ;) {
                        var _ref9;
                        if (_isArray9) {
                            if (_i11 >= _iterator9.length) break;
                            _ref9 = _iterator9[_i11++];
                        } else {
                            _i11 = _iterator9.next();
                            if (_i11.done) break;
                            _ref9 = _i11.value;
                        }
                        if (item1 === _ref9) return !0;
                    }
                }
                return !1;
            }
            function getDistanceFromTop() {
                for (var win = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window, distance = 0, parent = win; parent; ) {
                    parent = getParent(parent);
                    parent && (distance += 1);
                }
                return distance;
            }
            function getNthParent(win) {
                for (var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, parent = win, i = 0; i < n; i++) {
                    if (!parent) return;
                    parent = getParent(parent);
                }
                return parent;
            }
            function getNthParentFromTop(win) {
                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
                return getNthParent(win, getDistanceFromTop(win) - n);
            }
            function isSameTopWindow(win1, win2) {
                var top1 = getTop(win1) || win1, top2 = getTop(win2) || win2;
                try {
                    if (top1 && top2) return top1 === top2;
                } catch (err) {}
                var allFrames1 = getAllFramesInWindow(win1), allFrames2 = getAllFramesInWindow(win2);
                if (anyMatch(allFrames1, allFrames2)) return !0;
                var opener1 = getOpener(top1), opener2 = getOpener(top2);
                return (!opener1 || !anyMatch(getAllFramesInWindow(opener1), allFrames2)) && (opener2 && anyMatch(getAllFramesInWindow(opener2), allFrames1), 
                !1);
            }
            function matchDomain(pattern, origin) {
                if ("string" == typeof pattern) {
                    if ("string" == typeof origin) return pattern === CONSTANTS.WILDCARD || origin === pattern;
                    if ((0, _util.isRegex)(origin)) return !1;
                    if (Array.isArray(origin)) return !1;
                }
                return (0, _util.isRegex)(pattern) ? (0, _util.isRegex)(origin) ? pattern.toString() === origin.toString() : !Array.isArray(origin) && Boolean(origin.match(pattern)) : !!Array.isArray(pattern) && (Array.isArray(origin) ? JSON.stringify(pattern) === JSON.stringify(origin) : !(0, 
                _util.isRegex)(origin) && pattern.some(function(subpattern) {
                    return matchDomain(subpattern, origin);
                }));
            }
            function stringifyDomainPattern(pattern) {
                return Array.isArray(pattern) ? "(" + pattern.join(" | ") + ")" : (0, _util.isRegex)(pattern) ? "RegExp(" + pattern.toString() : pattern.toString();
            }
            function getDomainFromUrl(url) {
                var domain = void 0;
                if (!url.match(/^(https?|mock|file):\/\//)) return getDomain();
                domain = url;
                domain = domain.split("/").slice(0, 3).join("/");
                return domain;
            }
            function onCloseWindow(win, callback) {
                var delay = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1e3, maxtime = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1 / 0, timeout = void 0;
                !function check() {
                    if (isWindowClosed(win)) {
                        timeout && clearTimeout(timeout);
                        return callback();
                    }
                    if (maxtime <= 0) clearTimeout(timeout); else {
                        maxtime -= delay;
                        timeout = setTimeout(check, delay);
                    }
                }();
                return {
                    cancel: function() {
                        timeout && clearTimeout(timeout);
                    }
                };
            }
            function isWindow(obj) {
                try {
                    if (obj === window) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if ("[object Window]" === Object.prototype.toString.call(obj)) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if (window.Window && obj instanceof window.Window) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if (obj && obj.self === obj) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if (obj && obj.parent === obj) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if (obj && obj.top === obj) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    (0, _util.noop)(obj === obj);
                } catch (err) {
                    return !0;
                }
                try {
                    (0, _util.noop)(obj && obj.__cross_domain_utils_window_check__);
                } catch (err) {
                    return !0;
                }
                return !1;
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            exports.isFileProtocol = isFileProtocol;
            exports.isAboutProtocol = isAboutProtocol;
            exports.getParent = getParent;
            exports.getOpener = getOpener;
            exports.canReadFromWindow = canReadFromWindow;
            exports.getActualDomain = getActualDomain;
            exports.getDomain = getDomain;
            exports.isBlankDomain = isBlankDomain;
            exports.isActuallySameDomain = isActuallySameDomain;
            exports.isSameDomain = isSameDomain;
            exports.getParents = getParents;
            exports.isAncestorParent = isAncestorParent;
            exports.getFrames = getFrames;
            exports.getAllChildFrames = getAllChildFrames;
            exports.getTop = getTop;
            exports.getAllFramesInWindow = getAllFramesInWindow;
            exports.isTop = isTop;
            exports.isFrameWindowClosed = isFrameWindowClosed;
            exports.isWindowClosed = isWindowClosed;
            exports.linkFrameWindow = linkFrameWindow;
            exports.getUserAgent = getUserAgent;
            exports.getFrameByName = getFrameByName;
            exports.findChildFrameByName = findChildFrameByName;
            exports.findFrameByName = findFrameByName;
            exports.isParent = isParent;
            exports.isOpener = isOpener;
            exports.getAncestor = getAncestor;
            exports.getAncestors = getAncestors;
            exports.isAncestor = isAncestor;
            exports.isPopup = isPopup;
            exports.isIframe = isIframe;
            exports.isFullpage = isFullpage;
            exports.getDistanceFromTop = getDistanceFromTop;
            exports.getNthParent = getNthParent;
            exports.getNthParentFromTop = getNthParentFromTop;
            exports.isSameTopWindow = isSameTopWindow;
            exports.matchDomain = matchDomain;
            exports.stringifyDomainPattern = stringifyDomainPattern;
            exports.getDomainFromUrl = getDomainFromUrl;
            exports.onCloseWindow = onCloseWindow;
            exports.isWindow = isWindow;
            var _util = __webpack_require__("./src/util.js"), CONSTANTS = {
                MOCK_PROTOCOL: "mock:",
                FILE_PROTOCOL: "file:",
                ABOUT_PROTOCOL: "about:",
                WILDCARD: "*"
            }, IE_WIN_ACCESS_ERROR = "Call was rejected by callee.\r\n", iframeWindows = [], iframeFrames = [];
        }
    });
});
//# sourceMappingURL=cross-domain-utils.js.map
//# sourceMappingURL=cross-domain-utils.js.map