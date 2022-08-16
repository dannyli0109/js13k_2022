export class Mat4 {
    constructor(...values) {
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
    get values() {
        return this._values;
    }
    get m00() { return this._values[0]; }
    get m01() { return this._values[1]; }
    get m02() { return this._values[2]; }
    get m03() { return this._values[3]; }
    get m10() { return this._values[4]; }
    get m11() { return this._values[5]; }
    get m12() { return this._values[6]; }
    get m13() { return this._values[7]; }
    get m20() { return this._values[8]; }
    get m21() { return this._values[9]; }
    get m22() { return this._values[10]; }
    get m23() { return this._values[11]; }
    get m30() { return this._values[12]; }
    get m31() { return this._values[13]; }
    get m32() { return this._values[14]; }
    get m33() { return this._values[15]; }
    set m00(value) { this._values[0] = value; }
    set m01(value) { this._values[1] = value; }
    set m02(value) { this._values[2] = value; }
    set m03(value) { this._values[3] = value; }
    set m10(value) { this._values[4] = value; }
    set m11(value) { this._values[5] = value; }
    set m12(value) { this._values[6] = value; }
    set m13(value) { this._values[7] = value; }
    set m20(value) { this._values[8] = value; }
    set m21(value) { this._values[9] = value; }
    set m22(value) { this._values[10] = value; }
    set m23(value) { this._values[11] = value; }
    set m30(value) { this._values[12] = value; }
    set m31(value) { this._values[13] = value; }
    set m32(value) { this._values[14] = value; }
    set m33(value) { this._values[15] = value; }
    multiply(other) {
        let m00 = other.m00 * this.m00 + other.m01 * this.m10 + other.m02 * this.m20 + other.m03 * this.m30;
        let m01 = other.m00 * this.m01 + other.m01 * this.m11 + other.m02 * this.m21 + other.m03 * this.m31;
        let m02 = other.m00 * this.m02 + other.m01 * this.m12 + other.m02 * this.m22 + other.m03 * this.m32;
        let m03 = other.m00 * this.m03 + other.m01 * this.m13 + other.m02 * this.m23 + other.m03 * this.m33;
        let m10 = other.m10 * this.m00 + other.m11 * this.m10 + other.m12 * this.m20 + other.m13 * this.m30;
        let m11 = other.m10 * this.m01 + other.m11 * this.m11 + other.m12 * this.m21 + other.m13 * this.m31;
        let m12 = other.m10 * this.m02 + other.m11 * this.m12 + other.m12 * this.m22 + other.m13 * this.m32;
        let m13 = other.m10 * this.m03 + other.m11 * this.m13 + other.m12 * this.m23 + other.m13 * this.m33;
        let m20 = other.m20 * this.m00 + other.m21 * this.m10 + other.m22 * this.m20 + other.m23 * this.m30;
        let m21 = other.m20 * this.m01 + other.m21 * this.m11 + other.m22 * this.m21 + other.m23 * this.m31;
        let m22 = other.m20 * this.m02 + other.m21 * this.m12 + other.m22 * this.m22 + other.m23 * this.m32;
        let m23 = other.m20 * this.m03 + other.m21 * this.m13 + other.m22 * this.m23 + other.m23 * this.m33;
        let m30 = other.m30 * this.m00 + other.m31 * this.m10 + other.m32 * this.m20 + other.m33 * this.m30;
        let m31 = other.m30 * this.m01 + other.m31 * this.m11 + other.m32 * this.m21 + other.m33 * this.m31;
        let m32 = other.m30 * this.m02 + other.m31 * this.m12 + other.m32 * this.m22 + other.m33 * this.m32;
        let m33 = other.m30 * this.m03 + other.m31 * this.m13 + other.m32 * this.m23 + other.m33 * this.m33;
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
    }
    equals(other, tolerance = 0.00001) {
        for (let i = 0; i < 9; i++) {
            if (Math.abs(this._values[i] - other._values[i]) > tolerance) {
                return false;
            }
        }
        return true;
    }
    static translation(x, y, z) {
        return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1);
    }
    translate(x, y, z) {
        let translationMatrix = Mat4.translation(x, y, z);
        return this.multiply(translationMatrix);
    }
    static xRotation(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        return new Mat4(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
    }
    rotateX(angle) {
        let rotationMatrix = Mat4.xRotation(angle);
        return this.multiply(rotationMatrix);
    }
    static yRotation(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        return new Mat4(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
    }
    rotateY(angle) {
        let rotationMatrix = Mat4.yRotation(angle);
        return this.multiply(rotationMatrix);
    }
    static zRotation(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        return new Mat4(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    rotateZ(angle) {
        let rotationMatrix = Mat4.zRotation(angle);
        return this.multiply(rotationMatrix);
    }
    static scaling(x, y, z) {
        return new Mat4(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    }
    scale(x, y, z) {
        let scaleMatrix = Mat4.scaling(x, y, z);
        return this.multiply(scaleMatrix);
    }
    static orthographic(wdith, height, depth) {
        return new Mat4(2 / wdith, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 2 / depth, 0, -1, 1, 0, 1);
    }
    static perspective(fov, aspect, near, far) {
        let f = 1.0 / Math.tan(fov / 2);
        let nf = 1 / (near - far);
        return new Mat4(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, (2 * far * near) * nf, 0);
    }
}
