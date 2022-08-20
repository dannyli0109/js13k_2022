export class Vec3 {
    constructor(...values) {
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
    get x() {
        return this._values[0];
    }
    get y() {
        return this._values[1];
    }
    get z() {
        return this._values[2];
    }
    set x(value) {
        this._values[0] = value;
    }
    set y(value) {
        this._values[1] = value;
    }
    set z(value) {
        this._values[2] = value;
    }
    get values() {
        return this._values;
    }
    add(other) {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    subtract(other) {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    cross(other) {
        return new Vec3(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
    }
    get length() {
        return Math.sqrt(this.dot(this));
    }
    normalize() {
        let length = this.length;
        return new Vec3(this.x / length, this.y / length, this.z / length);
    }
}
