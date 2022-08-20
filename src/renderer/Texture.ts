export class Texture
{
    private _name: string;
    private _texture: WebGLTexture;
    private _width: number;
    private _height: number;

    public constructor(name: string, texture: WebGLTexture, width: number, height: number)
    {
        this._name = name;
        this._texture = texture;
        this._width = width;
        this._height = height;
    }
    public get name(): string { return this._name; }
    public get texture(): WebGLTexture { return this._texture; }
    public get width(): number { return this._width; }
    public get height(): number { return this._height; }
}