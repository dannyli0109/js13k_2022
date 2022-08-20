export class Renderer
{
    private constructor () {
        let canvas = document.createElement("canvas") as HTMLCanvasElement;
        this._gl = null;
        // window.addEventListener('resize', this.onCanvasResize.bind(this), false);
    }
    private static _instance: Renderer;
    public static get instance(): Renderer {
        if (!Renderer._instance) {
            Renderer._instance = new Renderer();
        }
        return Renderer._instance;
    }

    private _gl: WebGL2RenderingContext;
    public get gl()
    {
        return this._gl;
    }

    private onCanvasResize()
    {
        this._gl.canvas.width = window.innerWidth;
        this._gl.canvas.height = window.innerHeight;
    }
}