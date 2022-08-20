export class Texture {
    constructor(name, texture, width, height) {
        this._name = name;
        this._texture = texture;
        this._width = width;
        this._height = height;
    }
    get name() { return this._name; }
    get texture() { return this._texture; }
    get width() { return this._width; }
    get height() { return this._height; }
}
