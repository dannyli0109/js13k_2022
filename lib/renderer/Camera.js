"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorPerspectiveCamera = exports.Camera = exports.CameraMovement = void 0;
var Input_1 = require("../gameplay/Input");
var Mat4_1 = require("../mathLib/Mat4");
var Util_1 = require("../mathLib/Util");
var Vec3_1 = require("../mathLib/Vec3");
var Renderer_1 = require("./Renderer");
var YAW = -90.0;
var PITCH = 0.0;
var SPEED = 2.5;
var SENSITIVITY = 0.1;
var ZOOM = 45.0;
var NEAR = 0.1;
var FAR = 1000.0;
var FOV = 60;
var CameraMovement;
(function (CameraMovement) {
    CameraMovement[CameraMovement["FORWARD"] = 0] = "FORWARD";
    CameraMovement[CameraMovement["BACKWARD"] = 1] = "BACKWARD";
    CameraMovement[CameraMovement["LEFT"] = 2] = "LEFT";
    CameraMovement[CameraMovement["RIGHT"] = 3] = "RIGHT";
})(CameraMovement = exports.CameraMovement || (exports.CameraMovement = {}));
var Camera = (function () {
    function Camera() {
    }
    return Camera;
}());
exports.Camera = Camera;
var EditorPerspectiveCamera = (function (_super) {
    __extends(EditorPerspectiveCamera, _super);
    function EditorPerspectiveCamera(position, up, yaw, pitch, front, fov, near, far, movementSpeed, mouseSensitivity, zoom) {
        if (position === void 0) { position = new Vec3_1.Vec3(0, 0, 0); }
        if (up === void 0) { up = new Vec3_1.Vec3(0, 1, 0); }
        if (yaw === void 0) { yaw = YAW; }
        if (pitch === void 0) { pitch = PITCH; }
        if (front === void 0) { front = new Vec3_1.Vec3(0, 0, -1); }
        if (fov === void 0) { fov = FOV; }
        if (near === void 0) { near = NEAR; }
        if (far === void 0) { far = FAR; }
        if (movementSpeed === void 0) { movementSpeed = SPEED; }
        if (mouseSensitivity === void 0) { mouseSensitivity = SENSITIVITY; }
        if (zoom === void 0) { zoom = ZOOM; }
        var _this = _super.call(this) || this;
        _this._position = position;
        _this._front = front;
        _this._worldUp = up;
        _this._yaw = yaw;
        _this._pitch = pitch;
        _this._fov = fov;
        _this._near = near;
        _this._far = far;
        _this._movementSpeed = movementSpeed;
        _this._mouseSensitivity = mouseSensitivity;
        _this._zoom = zoom;
        _this._moveVec = new Vec3_1.Vec3();
        _this.updateVectors();
        Input_1.Input.instance.onMouseMove(function (e) {
            if (Input_1.Input.instance.isMouseDown(Input_1.MouseButton.Right)) {
                var xDelta = e.movementX;
                var yDelta = -e.movementY;
                _this.processMouseMovement(xDelta, yDelta);
            }
        });
        return _this;
    }
    Object.defineProperty(EditorPerspectiveCamera.prototype, "viewMatrix", {
        get: function () {
            return Mat4_1.Mat4.lookAt(this._position, this._position.add(this._front), this._up);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EditorPerspectiveCamera.prototype, "projectionMatrix", {
        get: function () {
            var gl = Renderer_1.Renderer.instance.gl;
            var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            return Mat4_1.Mat4.perspective((0, Util_1.degToRad)(this._fov), aspect, this._near, this._far);
        },
        enumerable: false,
        configurable: true
    });
    EditorPerspectiveCamera.prototype.updateVectors = function () {
        var front = new Vec3_1.Vec3();
        front.x = Math.cos((0, Util_1.degToRad)(this._yaw)) * Math.cos((0, Util_1.degToRad)(this._pitch));
        front.y = Math.sin((0, Util_1.degToRad)(this._pitch));
        front.z = Math.sin((0, Util_1.degToRad)(this._yaw)) * Math.cos((0, Util_1.degToRad)(this._pitch));
        this._front = front.normalize();
        this._right = this._front.cross(this._worldUp).normalize();
        this._up = this._right.cross(this._front).normalize();
    };
    EditorPerspectiveCamera.prototype.processKeyboard = function (dir, dt) {
        var velocity = this._movementSpeed * dt;
        if (dir === CameraMovement.FORWARD) {
            this._position = this._position.add(this._front.multiply(velocity));
        }
        if (dir === CameraMovement.BACKWARD) {
            this._position = this._position.subtract(this._front.multiply(velocity));
        }
        if (dir === CameraMovement.LEFT) {
            this._position = this._position.subtract(this._right.multiply(velocity));
        }
        if (dir === CameraMovement.RIGHT) {
            this._position = this._position.add(this._right.multiply(velocity));
        }
    };
    EditorPerspectiveCamera.prototype.update = function (dt) {
        if (Input_1.Input.instance.isKeyDown(Input_1.Keycode.W))
            this.processKeyboard(CameraMovement.FORWARD, dt);
        if (Input_1.Input.instance.isKeyDown(Input_1.Keycode.S))
            this.processKeyboard(CameraMovement.BACKWARD, dt);
        if (Input_1.Input.instance.isKeyDown(Input_1.Keycode.A))
            this.processKeyboard(CameraMovement.LEFT, dt);
        if (Input_1.Input.instance.isKeyDown(Input_1.Keycode.D))
            this.processKeyboard(CameraMovement.RIGHT, dt);
    };
    EditorPerspectiveCamera.prototype.processMouseMovement = function (xoffset, yoffset, constrainPitch) {
        if (constrainPitch === void 0) { constrainPitch = true; }
        xoffset *= this._mouseSensitivity;
        yoffset *= this._mouseSensitivity;
        this._yaw += xoffset;
        this._pitch += yoffset;
        if (constrainPitch) {
            if (this._pitch > 89.0)
                this._pitch = 89.0;
            if (this._pitch < -89.0)
                this._pitch = -89.0;
        }
        this.updateVectors();
    };
    return EditorPerspectiveCamera;
}(Camera));
exports.EditorPerspectiveCamera = EditorPerspectiveCamera;
