export class Renderer {
    constructor() {
        let canvas = document.createElement("canvas");
        this._gl = null;
    }
    static get instance() {
        if (!Renderer._instance) {
            Renderer._instance = new Renderer();
        }
        return Renderer._instance;
    }
    get gl() {
        return this._gl;
    }
    onCanvasResize() {
        this._gl.canvas.width = window.innerWidth;
        this._gl.canvas.height = window.innerHeight;
    }
}
