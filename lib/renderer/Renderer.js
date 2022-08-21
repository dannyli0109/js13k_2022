export var Renderer;
(function (Renderer) {
    let _canvas = document.getElementById("canvas");
    let _gl = _canvas.getContext("webgl2", {
        premultipliedAlpha: false
    });
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;
    if (!_gl) {
        alert("unable to initialise webgl");
    }
    Renderer.instance = {
        get gl() { return _gl; },
        get canvas() { return _canvas; }
    };
})(Renderer || (Renderer = {}));
