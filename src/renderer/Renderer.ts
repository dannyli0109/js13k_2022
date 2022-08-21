export namespace Renderer
{
    let _canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let _gl = _canvas.getContext("webgl2", {
        premultipliedAlpha: false
    }) as WebGL2RenderingContext;
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;
    if (!_gl) {
        alert("unable to initialise webgl");
    }

    export const instance = {
        get gl() { return _gl; },
        get canvas() { return _canvas; }
    }
}