"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Texture = void 0;
var Renderer_1 = require("./Renderer");
var Texture = (function () {
    function Texture() {
    }
    Texture.prototype.load = function (url) {
        var _this = this;
        this.initTexture(1, 1);
        var image = new Image();
        image.onload = function () {
            var gl = Renderer_1.Renderer.instance.gl;
            gl.bindTexture(gl.TEXTURE_2D, _this._texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        image.src = url;
    };
    Texture.prototype.initTexture = function (width, height) {
        var gl = Renderer_1.Renderer.instance.gl;
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this._texture = texture;
    };
    Object.defineProperty(Texture.prototype, "texture", {
        get: function () {
            return this._texture;
        },
        enumerable: false,
        configurable: true
    });
    return Texture;
}());
exports.Texture = Texture;
