"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Material = void 0;
var Material = (function () {
    function Material(program, textures) {
        if (textures === void 0) { textures = []; }
        this._program = program;
        this._textures = textures;
    }
    Object.defineProperty(Material.prototype, "program", {
        get: function () {
            return this._program;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "textures", {
        get: function () {
            return this._textures;
        },
        enumerable: false,
        configurable: true
    });
    Material.prototype.bind = function () {
        for (var i = 0; i < this._textures.length; i++) {
            this._program.setUniform1i(this._textures[i].name, i);
        }
    };
    return Material;
}());
exports.Material = Material;
