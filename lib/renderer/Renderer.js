"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
var ShaderProgram_1 = require("./ShaderProgram");
var Camera_1 = require("./Camera");
var Renderer = (function () {
    function Renderer() {
    }
    Object.defineProperty(Renderer, "instance", {
        get: function () {
            if (!Renderer._instance) {
                Renderer._instance = new Renderer();
                Renderer._instance.init();
            }
            return Renderer._instance;
        },
        enumerable: false,
        configurable: true
    });
    Renderer.prototype.init = function () {
        this._canvas = document.getElementById("canvas");
        this._gl = this._canvas.getContext("webgl2", {
            premultipliedAlpha: false,
        });
        if (!this._gl) {
            alert("unable to initialise webgl");
        }
        this._shaders = {};
        this._editorCamera = new Camera_1.EditorPerspectiveCamera();
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
    };
    Renderer.prototype.loadShader = function (shaderName, vertexShaderSource, fragmentShaderSource) {
        if (!this._shaders[shaderName]) {
            this._shaders[shaderName] = new ShaderProgram_1.ShaderProgram();
            this._shaders[shaderName].initShaderProgram(this._gl, vertexShaderSource, fragmentShaderSource);
        }
        return this._shaders[shaderName];
    };
    Object.defineProperty(Renderer.prototype, "gl", {
        get: function () {
            return this._gl;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "canvas", {
        get: function () {
            return this._canvas;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "shaders", {
        get: function () {
            return this._shaders;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "editorCamera", {
        get: function () {
            return this._editorCamera;
        },
        enumerable: false,
        configurable: true
    });
    Renderer._instance = null;
    return Renderer;
}());
exports.Renderer = Renderer;
