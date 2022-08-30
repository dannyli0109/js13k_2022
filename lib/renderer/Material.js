"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Material = exports.MaterialAttribute = exports.MaterialAttributeType = void 0;
var MaterialAttributeType;
(function (MaterialAttributeType) {
    MaterialAttributeType[MaterialAttributeType["Texture"] = 0] = "Texture";
    MaterialAttributeType[MaterialAttributeType["Float"] = 1] = "Float";
    MaterialAttributeType[MaterialAttributeType["Int"] = 2] = "Int";
    MaterialAttributeType[MaterialAttributeType["Vector2"] = 3] = "Vector2";
    MaterialAttributeType[MaterialAttributeType["Vector3"] = 4] = "Vector3";
    MaterialAttributeType[MaterialAttributeType["Mat4"] = 5] = "Mat4";
    MaterialAttributeType[MaterialAttributeType["Bool"] = 6] = "Bool";
    MaterialAttributeType[MaterialAttributeType["None"] = 7] = "None";
})(MaterialAttributeType = exports.MaterialAttributeType || (exports.MaterialAttributeType = {}));
var MaterialAttribute = (function () {
    function MaterialAttribute(name, type, value) {
        this.name = name;
        this.type = type;
        this.value = value;
    }
    return MaterialAttribute;
}());
exports.MaterialAttribute = MaterialAttribute;
var Material = (function () {
    function Material(program) {
        this._program = program;
        this._parameters = [];
    }
    Object.defineProperty(Material.prototype, "program", {
        get: function () {
            return this._program;
        },
        enumerable: false,
        configurable: true
    });
    Material.prototype.addAttribute = function (attribute) {
        if (this.find(attribute.name) === -1) {
            this._parameters.push(attribute);
        }
    };
    Material.prototype.find = function (name) {
        for (var i = 0; i < this._parameters.length; i++) {
            if (this._parameters[i].name === name) {
                return i;
            }
        }
        return -1;
    };
    Material.prototype.bind = function () {
        for (var i = 0; i < this._parameters.length; i++) {
            var parameter = this._parameters[i];
        }
    };
    return Material;
}());
exports.Material = Material;
