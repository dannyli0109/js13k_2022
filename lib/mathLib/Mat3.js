export class Mat3 {
    constructor(...values) {
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
    get values() {
        return this._values;
    }
    get m00() { return this._values[0]; }
    get m01() { return this._values[1]; }
    get m02() { return this._values[2]; }
    get m10() { return this._values[3]; }
    get m11() { return this._values[4]; }
    get m12() { return this._values[5]; }
    get m20() { return this._values[6]; }
    get m21() { return this._values[7]; }
    get m22() { return this._values[8]; }
    set m00(value) { this._values[0] = value; }
    set m01(value) { this._values[1] = value; }
    set m02(value) { this._values[2] = value; }
    set m10(value) { this._values[3] = value; }
    set m11(value) { this._values[4] = value; }
    set m12(value) { this._values[5] = value; }
    set m20(value) { this._values[6] = value; }
    set m21(value) { this._values[7] = value; }
    set m22(value) { this._values[8] = value; }
    multiply(other) {
        let m00 = other.m00 * this.m00 + other.m01 * this.m10 + other.m02 * this.m20;
        let m01 = other.m00 * this.m01 + other.m01 * this.m11 + other.m02 * this.m21;
        let m02 = other.m00 * this.m02 + other.m01 * this.m12 + other.m02 * this.m22;
        let m10 = other.m10 * this.m00 + other.m11 * this.m10 + other.m12 * this.m20;
        let m11 = other.m10 * this.m01 + other.m11 * this.m11 + other.m12 * this.m21;
        let m12 = other.m10 * this.m02 + other.m11 * this.m12 + other.m12 * this.m22;
        let m20 = other.m20 * this.m00 + other.m21 * this.m10 + other.m22 * this.m20;
        let m21 = other.m20 * this.m01 + other.m21 * this.m11 + other.m22 * this.m21;
        let m22 = other.m20 * this.m02 + other.m21 * this.m12 + other.m22 * this.m22;
        return new Mat3(m00, m01, m02, m10, m11, m12, m20, m21, m22);
    }
    equals(other, tolerance = 0.00001) {
        for (let i = 0; i < 9; i++) {
            if (Math.abs(this._values[i] - other._values[i]) > tolerance) {
                return false;
            }
        }
        return true;
    }
    static translation(x, y) {
        return new Mat3(1, 0, 0, 0, 1, 0, x, y, 1);
    }
    translate(vec) {
        let translationMatrix = Mat3.translation(vec.x, vec.y);
        return this.multiply(translationMatrix);
    }
    static rotation(angle) {
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        return new Mat3(c, -s, 0, s, c, 0, 0, 0, 1);
    }
    rotate(angle) {
        let rotationMatrix = Mat3.rotation(angle);
        return this.multiply(rotationMatrix);
    }
    static scaling(x, y) {
        return new Mat3(x, 0, 0, 0, y, 0, 0, 0, 1);
    }
    scale(x, y) {
        let scaleMatrix = Mat3.scaling(x, y);
        return this.multiply(scaleMatrix);
    }
}
export function testMat3Multiplication() {
    let a = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
    let b = new Mat3(10, 11, 12, 13, 14, 15, 16, 17, 18);
    let c = a.multiply(b);
    let d = new Mat3(138, 171, 204, 174, 216, 258, 210, 261, 312);
    console.log(c);
    console.log(d);
    return c.equals(d);
}
