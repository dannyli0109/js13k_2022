export class ShaderProgram
{
    private _program: WebGLProgram; 
    public get program(): WebGLProgram
    {
        return this._program;
    }
    initShaderProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string)
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

    loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader
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
}