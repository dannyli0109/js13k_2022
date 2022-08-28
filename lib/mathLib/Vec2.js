"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vec2 = void 0;
var Vec2 = (function () {
    function Vec2() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        if (values.length === 1) {
            this._values = [values[0], values[0]];
        }
        else if (values.length === 2) {
            this._values = values;
        }
        else if (values.length === 0) {
            this._values = [0, 0];
        }
        else {
            throw new Error("Invalid number of values");
        }
    }
    Object.defineProperty(Vec2.prototype, "x", {
        get: function () {
            return this._values[0];
        },
        set: function (value) {
            this._values[0] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2.prototype, "y", {
        get: function () {
            return this._values[1];
        },
        set: function (value) {
            this._values[1] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2.prototype, "values", {
        get: function () {
            return this._values;
        },
        enumerable: false,
        configurable: true
    });
    return Vec2;
}());
exports.Vec2 = Vec2;
