"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = exports.MouseButton = exports.Keycode = void 0;
var Renderer_1 = require("../renderer/Renderer");
var Events_1 = require("./Events");
var Keycode;
(function (Keycode) {
    Keycode["W"] = "KeyW";
    Keycode["A"] = "KeyA";
    Keycode["S"] = "KeyS";
    Keycode["D"] = "KeyD";
})(Keycode = exports.Keycode || (exports.Keycode = {}));
var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["Left"] = 0] = "Left";
    MouseButton[MouseButton["Middle"] = 1] = "Middle";
    MouseButton[MouseButton["Right"] = 2] = "Right";
})(MouseButton = exports.MouseButton || (exports.MouseButton = {}));
var Input = (function () {
    function Input() {
    }
    Object.defineProperty(Input, "instance", {
        get: function () {
            if (!Input._instance) {
                Input._instance = new Input();
                Input._instance.init();
            }
            return Input._instance;
        },
        enumerable: false,
        configurable: true
    });
    Input.prototype.init = function () {
        var _this = this;
        this._keys = {};
        this._mouse = {};
        addEventListener("keydown", function (e) {
            _this._keys[e.code] = true;
            Events_1.Events.dispatch(e.code, e);
        });
        addEventListener("keyup", function (e) {
            _this._keys[e.code] = false;
        });
        Renderer_1.Renderer.instance.canvas.addEventListener("mousemove", function (e) {
            e.preventDefault();
            Events_1.Events.dispatch("mousemove", e);
        });
        Renderer_1.Renderer.instance.canvas.addEventListener("mousedown", function (e) {
            e.preventDefault();
            _this._mouse[e.button] = true;
            Events_1.Events.dispatch("mouse".concat(e.button), e);
        });
        Renderer_1.Renderer.instance.canvas.addEventListener("mouseup", function (e) {
            e.preventDefault();
            _this._mouse[e.button] = false;
        });
        Renderer_1.Renderer.instance.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };
    };
    Object.defineProperty(Input.prototype, "mouseDelta", {
        get: function () { return this._mouseDelta; },
        enumerable: false,
        configurable: true
    });
    Input.prototype.onKey = function (key, callback) {
        return Events_1.Events.add(key, callback);
    };
    Input.prototype.onMouseClick = function (button, callback) {
        return Events_1.Events.add("mouse".concat(button), callback);
    };
    Input.prototype.onMouseMove = function (callback) {
        return Events_1.Events.add("mousemove", callback);
    };
    Input.prototype.isKeyDown = function (key) {
        return this._keys[key];
    };
    Input.prototype.isMouseDown = function (button) {
        return this._mouse[button];
    };
    Input._instance = null;
    return Input;
}());
exports.Input = Input;
