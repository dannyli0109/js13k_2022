export class Vec2 {
    constructor(...values) {
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
    get x() {
        return this._values[0];
    }
    get y() {
        return this._values[1];
    }
    set x(value) {
        this._values[0] = value;
    }
    set y(value) {
        this._values[1] = value;
    }
    get values() {
        return this._values;
    }
}
