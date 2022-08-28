"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mat4 = void 0;
var Mat4 = (function () {
    function Mat4() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        if (values.length === 1) {
            this._values = [values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0]];
        }
        else if (values.length === 16) {
            this._values = values;
        }
        else if (values.length === 0) {
            this._values = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        }
        else {
            throw new Error("Invalid number of values");
        }
    }
    Object.defineProperty(Mat4.prototype, "values", {
        get: function () {
            return this._values;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m00", {
        get: function () { return this._values[0]; },
        set: function (value) { this._values[0] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m01", {
        get: function () { return this._values[1]; },
        set: function (value) { this._values[1] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m02", {
        get: function () { return this._values[2]; },
        set: function (value) { this._values[2] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m03", {
        get: function () { return this._values[3]; },
        set: function (value) { this._values[3] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m10", {
        get: function () { return this._values[4]; },
        set: function (value) { this._values[4] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m11", {
        get: function () { return this._values[5]; },
        set: function (value) { this._values[5] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m12", {
        get: function () { return this._values[6]; },
        set: function (value) { this._values[6] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m13", {
        get: function () { return this._values[7]; },
        set: function (value) { this._values[7] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m20", {
        get: function () { return this._values[8]; },
        set: function (value) { this._values[8] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m21", {
        get: function () { return this._values[9]; },
        set: function (value) { this._values[9] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m22", {
        get: function () { return this._values[10]; },
        set: function (value) { this._values[10] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m23", {
        get: function () { return this._values[11]; },
        set: function (value) { this._values[11] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m30", {
        get: function () { return this._values[12]; },
        set: function (value) { this._values[12] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m31", {
        get: function () { return this._values[13]; },
        set: function (value) { this._values[13] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m32", {
        get: function () { return this._values[14]; },
        set: function (value) { this._values[14] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m33", {
        get: function () { return this._values[15]; },
        set: function (value) { this._values[15] = value; },
        enumerable: false,
        configurable: true
    });
    Mat4.prototype.multiply = function (other) {
        var m00 = other.m00 * this.m00 + other.m01 * this.m10 + other.m02 * this.m20 + other.m03 * this.m30;
        var m01 = other.m00 * this.m01 + other.m01 * this.m11 + other.m02 * this.m21 + other.m03 * this.m31;
        var m02 = other.m00 * this.m02 + other.m01 * this.m12 + other.m02 * this.m22 + other.m03 * this.m32;
        var m03 = other.m00 * this.m03 + other.m01 * this.m13 + other.m02 * this.m23 + other.m03 * this.m33;
        var m10 = other.m10 * this.m00 + other.m11 * this.m10 + other.m12 * this.m20 + other.m13 * this.m30;
        var m11 = other.m10 * this.m01 + other.m11 * this.m11 + other.m12 * this.m21 + other.m13 * this.m31;
        var m12 = other.m10 * this.m02 + other.m11 * this.m12 + other.m12 * this.m22 + other.m13 * this.m32;
        var m13 = other.m10 * this.m03 + other.m11 * this.m13 + other.m12 * this.m23 + other.m13 * this.m33;
        var m20 = other.m20 * this.m00 + other.m21 * this.m10 + other.m22 * this.m20 + other.m23 * this.m30;
        var m21 = other.m20 * this.m01 + other.m21 * this.m11 + other.m22 * this.m21 + other.m23 * this.m31;
        var m22 = other.m20 * this.m02 + other.m21 * this.m12 + other.m22 * this.m22 + other.m23 * this.m32;
        var m23 = other.m20 * this.m03 + other.m21 * this.m13 + other.m22 * this.m23 + other.m23 * this.m33;
        var m30 = other.m30 * this.m00 + other.m31 * this.m10 + other.m32 * this.m20 + other.m33 * this.m30;
        var m31 = other.m30 * this.m01 + other.m31 * this.m11 + other.m32 * this.m21 + other.m33 * this.m31;
        var m32 = other.m30 * this.m02 + other.m31 * this.m12 + other.m32 * this.m22 + other.m33 * this.m32;
        var m33 = other.m30 * this.m03 + other.m31 * this.m13 + other.m32 * this.m23 + other.m33 * this.m33;
        this._values[0] = m00;
        this._values[1] = m01;
        this._values[2] = m02;
        this._values[3] = m03;
        this._values[4] = m10;
        this._values[5] = m11;
        this._values[6] = m12;
        this._values[7] = m13;
        this._values[8] = m20;
        this._values[9] = m21;
        this._values[10] = m22;
        this._values[11] = m23;
        this._values[12] = m30;
        this._values[13] = m31;
        this._values[14] = m32;
        this._values[15] = m33;
        return this;
    };
    Mat4.prototype.equals = function (other, tolerance) {
        if (tolerance === void 0) { tolerance = 0.00001; }
        for (var i = 0; i < 9; i++) {
            if (Math.abs(this._values[i] - other._values[i]) > tolerance) {
                return false;
            }
        }
        return true;
    };
    Mat4.translation = function (x, y, z) {
        return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1);
    };
    Mat4.prototype.translate = function (x, y, z) {
        var translationMatrix = Mat4.translation(x, y, z);
        return this.multiply(translationMatrix);
    };
    Mat4.xRotation = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return new Mat4(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
    };
    Mat4.prototype.rotateX = function (angle) {
        var rotationMatrix = Mat4.xRotation(angle);
        return this.multiply(rotationMatrix);
    };
    Mat4.yRotation = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return new Mat4(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
    };
    Mat4.prototype.rotateY = function (angle) {
        var rotationMatrix = Mat4.yRotation(angle);
        return this.multiply(rotationMatrix);
    };
    Mat4.zRotation = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return new Mat4(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    };
    Mat4.prototype.rotateZ = function (angle) {
        var rotationMatrix = Mat4.zRotation(angle);
        return this.multiply(rotationMatrix);
    };
    Mat4.scaling = function (x, y, z) {
        return new Mat4(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    };
    Mat4.prototype.scale = function (x, y, z) {
        var scaleMatrix = Mat4.scaling(x, y, z);
        return this.multiply(scaleMatrix);
    };
    Mat4.orthographic = function (left, right, bottom, top, near, far) {
        var rl = right - left;
        var tb = top - bottom;
        var fn = far - near;
        return new Mat4(2 / rl, 0, 0, 0, 0, 2 / tb, 0, 0, 0, 0, -2 / fn, 0, -(right + left) / rl, -(top + bottom) / tb, -(far + near) / fn, 1);
    };
    Mat4.perspective = function (fov, aspect, near, far) {
        var f = 1.0 / Math.tan(fov / 2);
        var nf = 1 / (near - far);
        return new Mat4(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, (2 * far * near) * nf, 0);
    };
    Mat4.lookAt = function (position, target, up) {
        var z = position.subtract(target).normalize();
        var x = up.cross(z).normalize();
        var y = z.cross(x).normalize();
        return new Mat4(x.x, y.x, z.x, 0, x.y, y.y, z.y, 0, x.z, y.z, z.z, 0, -x.dot(position), -y.dot(position), -z.dot(position), 1);
    };
    return Mat4;
}());
exports.Mat4 = Mat4;
