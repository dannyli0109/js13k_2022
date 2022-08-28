import { ShaderProgram } from "../ShaderProgram";
import { EditorPerspectiveCamera } from "./Camera";


export type Shaders = {
    [name: string]: ShaderProgram;
}

export class Renderer {
    
    private _canvas: HTMLCanvasElement;
    private _gl: WebGL2RenderingContext;
    private _shaders: Shaders;
    private _editorCamera: EditorPerspectiveCamera;
    
    private static _instance: Renderer = null;
    public static get instance(): Renderer
    {
        if (!Renderer._instance) {
            Renderer._instance = new Renderer();
            Renderer._instance.init(); 
        }
        return Renderer._instance;
    }

    private init()
    {
        this._canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this._gl = this._canvas.getContext("webgl2", {
            premultipliedAlpha: false
        }) as WebGL2RenderingContext;
        
        if (!this._gl) {
            alert("unable to initialise webgl");
        }
        this._shaders = {};
        this._editorCamera = new EditorPerspectiveCamera();
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
    }

    private constructor() {}


    public loadShader(shaderName: string, vertexShaderSource: string, fragmentShaderSource: string){
        if (!this._shaders[shaderName]) {
            this._shaders[shaderName] = new ShaderProgram();
            this._shaders[shaderName].initShaderProgram(this._gl, vertexShaderSource, fragmentShaderSource);
        }
        return this._shaders[shaderName];
    }

    get gl() { return this._gl; }
    get canvas() { return this._canvas; }
    get shaders() { return this._shaders; }
    get editorCamera() { return this._editorCamera; }
}
