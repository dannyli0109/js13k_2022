import { ShaderProgram } from "../ShaderProgram";
export var Renderer;
(function (Renderer) {
    let _canvas = document.getElementById("canvas");
    let _gl = _canvas.getContext("webgl2", {
        premultipliedAlpha: false
    });
    if (!_gl) {
        alert("unable to initialise webgl");
    }
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;
    const _shaders = {};
    Renderer.instance = {
        get gl() { return _gl; },
        get canvas() { return _canvas; },
        loadShader(shaderName, vertexShaderSource, fragmentShaderSource) {
            if (!_shaders[shaderName]) {
                _shaders[shaderName] = new ShaderProgram();
                _shaders[shaderName].initShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
            }
            return _shaders[shaderName];
        },
        get shaders() { return _shaders; }
    };
})(Renderer || (Renderer = {}));
