"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Texture = void 0;
var Texture = (function () {
    function Texture(name, texture, width, height) {
        this._name = name;
        this._texture = texture;
        this._width = width;
        this._height = height;
    }
    Object.defineProperty(Texture.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "texture", {
        get: function () {
            return this._texture;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: false,
        configurable: true
    });
    return Texture;
}());
exports.Texture = Texture;
