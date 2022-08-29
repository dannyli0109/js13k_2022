"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShaderProgram = void 0;
var Renderer_1 = require("./Renderer");
var ShaderProgram = (function () {
    function ShaderProgram() {
        this._uniforms = {};
    }
    Object.defineProperty(ShaderProgram.prototype, "program", {
        get: function () {
            return this._program;
        },
        enumerable: false,
        configurable: true
    });
    ShaderProgram.prototype.initShaderProgram = function (gl, vertexShaderSource, fragmentShaderSource) {
        var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        this._program = gl.createProgram();
        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);
        gl.linkProgram(this._program);
        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: ".concat(gl.getProgramInfoLog(this._program)));
        }
    };
    ShaderProgram.prototype.loadShader = function (gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: ".concat(gl.getShaderInfoLog(shader)));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };
    ShaderProgram.prototype.use = function () {
        Renderer_1.Renderer.instance.gl.useProgram(this._program);
    };
    ShaderProgram.prototype.getUniformLocation = function (name) {
        var gl = Renderer_1.Renderer.instance.gl;
        if (!this._uniforms[name]) {
            this._uniforms[name] = gl.getUniformLocation(this._program, name);
        }
        return this._uniforms[name];
    };
    ShaderProgram.prototype.setUniformMatrix4fv = function (name, value) {
        var gl = Renderer_1.Renderer.instance.gl;
        this.use();
        var location = this.getUniformLocation(name);
        gl.uniformMatrix4fv(location, false, value);
        this._uniforms[name] = location;
    };
    ShaderProgram.prototype.setUniform1i = function (name, value) {
        var gl = Renderer_1.Renderer.instance.gl;
        var location = this.getUniformLocation(name);
        gl.uniform1i(location, value);
        this._uniforms[name] = location;
    };
    return ShaderProgram;
}());
exports.ShaderProgram = ShaderProgram;
