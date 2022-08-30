"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = exports.MouseButton = exports.Keycode = void 0;
var Vec2_1 = require("../mathLib/Vec2");
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
        this.reset();
        document.addEventListener("keydown", function (e) {
            _this._keys[e.code] = true;
        });
        document.addEventListener("keyup", function (e) {
            _this._keys[e.code] = false;
        });
        Renderer_1.Renderer.instance.canvas.addEventListener("mousemove", function (e) {
            _this._mouseDelta = new Vec2_1.Vec2(e.movementX, e.movementY);
            _this._mousePosition = new Vec2_1.Vec2(e.clientX, e.clientY);
            Events_1.Events.dispatch("mousemove", e);
        }, true);
        Renderer_1.Renderer.instance.canvas.addEventListener("mousedown", function (e) {
            _this._mouse[e.button] = true;
            Events_1.Events.dispatch("mousedown", e);
        }, true);
        Renderer_1.Renderer.instance.canvas.addEventListener("mouseup", function (e) {
            _this._mouse[e.button] = false;
            Events_1.Events.dispatch("mouseup", e);
        }, true);
        Renderer_1.Renderer.instance.canvas.addEventListener("blur", function () {
            _this.reset();
        });
        Renderer_1.Renderer.instance.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };
    };
    Input.prototype.reset = function () {
        this._keys = {};
        this._mouse = {};
    };
    Object.defineProperty(Input.prototype, "mouseDelta", {
        get: function () {
            return this._mouseDelta;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "mousePosition", {
        get: function () {
            return this._mousePosition;
        },
        enumerable: false,
        configurable: true
    });
    Input.prototype.onKeyDown = function (callback) {
        return Events_1.Events.add("keydown", callback);
    };
    Input.prototype.onMouseClick = function (button, callback) {
        return Events_1.Events.add("mousedown", callback);
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
