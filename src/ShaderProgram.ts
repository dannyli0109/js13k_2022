import { Renderer } from "./renderer/Renderer";

type Uniforms = {
    [key: string]: WebGLUniformLocation;
}

export class ShaderProgram
{
    private _program: WebGLProgram; 
    private _uniforms: Uniforms;
    constructor()
    {
        this._uniforms = {};
    }

    public get program(): WebGLProgram
    {
        return this._program;
    }

    initShaderProgram(gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string)
    {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        this._program = gl.createProgram();
        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);
        gl.linkProgram(this._program);

        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS))
        {
            alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(this._program)}`);
        }
    }

    loadShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader
    {
        const shader: WebGLShader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader)
            return null;
        }
        return shader;
    }

    use()
    {
        Renderer.instance.gl.useProgram(this._program);
    }

    getUniformLocation(name: string): WebGLUniformLocation
    {
        let gl = Renderer.instance.gl;
        if (!this._uniforms[name])
        {
            this._uniforms[name] = gl.getUniformLocation(this._program, name);
        }
        return this._uniforms[name];
    }

    setUniformMatrix4fv(name: string, value: number[])
    {
        let gl = Renderer.instance.gl;
        this.use();
        let location = this.getUniformLocation(name);
        gl.uniformMatrix4fv(location, false, value);
        this._uniforms[name] = location;
    }

    setUniform1i(name: string, value: number)
    {
        let gl = Renderer.instance.gl;
        let location = this.getUniformLocation(name);
        gl.uniform1i(location, value);
        this._uniforms[name] = location;
    }
}