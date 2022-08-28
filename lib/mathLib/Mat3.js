"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testMat3Multiplication = exports.Mat3 = void 0;
var Mat3 = (function () {
    function Mat3() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        if (values.length === 1) {
            this._values = [values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0]];
        }
        else if (values.length === 9) {
            this._values = values;
        }
        else if (values.length === 0) {
            this._values = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        }
        else {
            throw new Error("Invalid number of values");
        }
    }
    Object.defineProperty(Mat3.prototype, "values", {
        get: function () {
            return this._values;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat3.prototype, "m00", {
        get: function () { return this._values[0]; },
        set: function (value) { this._values[0] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat3.prototype, "m01", {
        get: function () { return this._values[1]; },
        set: function (value) { this._values[1] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat3.prototype, "m02", {
        get: function () { return this._values[2]; },
        set: function (value) { this._values[2] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat3.prototype, "m10", {
        get: function () { return this._values[3]; },
        set: function (value) { this._values[3] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat3.prototype, "m11", {
        get: function () { return this._values[4]; },
        set: function (value) { this._values[4] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat3.prototype, "m12", {
        get: function () { return this._values[5]; },
        set: function (value) { this._values[5] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat3.prototype, "m20", {
        get: function () { return this._values[6]; },
        set: function (value) { this._values[6] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat3.prototype, "m21", {
        get: function () { return this._values[7]; },
        set: function (value) { this._values[7] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat3.prototype, "m22", {
        get: function () { return this._values[8]; },
        set: function (value) { this._values[8] = value; },
        enumerable: false,
        configurable: true
    });
    Mat3.prototype.multiply = function (other) {
        var m00 = other.m00 * this.m00 + other.m01 * this.m10 + other.m02 * this.m20;
        var m01 = other.m00 * this.m01 + other.m01 * this.m11 + other.m02 * this.m21;
        var m02 = other.m00 * this.m02 + other.m01 * this.m12 + other.m02 * this.m22;
        var m10 = other.m10 * this.m00 + other.m11 * this.m10 + other.m12 * this.m20;
        var m11 = other.m10 * this.m01 + other.m11 * this.m11 + other.m12 * this.m21;
        var m12 = other.m10 * this.m02 + other.m11 * this.m12 + other.m12 * this.m22;
        var m20 = other.m20 * this.m00 + other.m21 * this.m10 + other.m22 * this.m20;
        var m21 = other.m20 * this.m01 + other.m21 * this.m11 + other.m22 * this.m21;
        var m22 = other.m20 * this.m02 + other.m21 * this.m12 + other.m22 * this.m22;
        return new Mat3(m00, m01, m02, m10, m11, m12, m20, m21, m22);
    };
    Mat3.prototype.equals = function (other, tolerance) {
        if (tolerance === void 0) { tolerance = 0.00001; }
        for (var i = 0; i < 9; i++) {
            if (Math.abs(this._values[i] - other._values[i]) > tolerance) {
                return false;
            }
        }
        return true;
    };
    Mat3.translation = function (x, y) {
        return new Mat3(1, 0, 0, 0, 1, 0, x, y, 1);
    };
    Mat3.prototype.translate = function (vec) {
        var translationMatrix = Mat3.translation(vec.x, vec.y);
        return this.multiply(translationMatrix);
    };
    Mat3.rotation = function (angle) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);
        return new Mat3(c, -s, 0, s, c, 0, 0, 0, 1);
    };
    Mat3.prototype.rotate = function (angle) {
        var rotationMatrix = Mat3.rotation(angle);
        return this.multiply(rotationMatrix);
    };
    Mat3.scaling = function (x, y) {
        return new Mat3(x, 0, 0, 0, y, 0, 0, 0, 1);
    };
    Mat3.prototype.scale = function (x, y) {
        var scaleMatrix = Mat3.scaling(x, y);
        return this.multiply(scaleMatrix);
    };
    return Mat3;
}());
exports.Mat3 = Mat3;
function testMat3Multiplication() {
    var a = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
    var b = new Mat3(10, 11, 12, 13, 14, 15, 16, 17, 18);
    var c = a.multiply(b);
    var d = new Mat3(138, 171, 204, 174, 216, 258, 210, 261, 312);
    console.log(c);
    console.log(d);
    return c.equals(d);
}
exports.testMat3Multiplication = testMat3Multiplication;
