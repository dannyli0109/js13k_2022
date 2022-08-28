"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vec3 = void 0;
var Vec3 = (function () {
    function Vec3() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        if (values.length === 1) {
            this._values = [values[0], values[0], values[0]];
        }
        else if (values.length === 3) {
            this._values = values;
        }
        else if (values.length === 0) {
            this._values = [0, 0, 0];
        }
        else {
            throw new Error("Invalid number of values");
        }
    }
    Object.defineProperty(Vec3.prototype, "x", {
        get: function () {
            return this._values[0];
        },
        set: function (value) {
            this._values[0] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec3.prototype, "y", {
        get: function () {
            return this._values[1];
        },
        set: function (value) {
            this._values[1] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec3.prototype, "z", {
        get: function () {
            return this._values[2];
        },
        set: function (value) {
            this._values[2] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec3.prototype, "values", {
        get: function () {
            return this._values;
        },
        enumerable: false,
        configurable: true
    });
    Vec3.prototype.add = function (other) {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    };
    Vec3.prototype.subtract = function (other) {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    };
    Vec3.prototype.multiply = function (other) {
        if (typeof other === "number") {
            return new Vec3(this.x * other, this.y * other, this.z * other);
        }
        else {
            return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);
        }
    };
    Vec3.prototype.dot = function (other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    };
    Vec3.prototype.cross = function (other) {
        return new Vec3(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
    };
    Object.defineProperty(Vec3.prototype, "length", {
        get: function () {
            return Math.sqrt(this.dot(this));
        },
        enumerable: false,
        configurable: true
    });
    Vec3.prototype.normalize = function () {
        var length = this.length;
        return new Vec3(this.x / length, this.y / length, this.z / length);
    };
    return Vec3;
}());
exports.Vec3 = Vec3;
