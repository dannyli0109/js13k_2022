import { Mat4 } from "./mathLib/Mat4";
import { degToRad } from "./mathLib/Util";
import { ShaderProgram } from "./ShaderProgram";
import { fsSource, vsSource } from "./ShaderSources";


type Buffers = { 
    [bufferName: string]: WebGLBuffer;
}

export class Program
{
    private _canvas: HTMLCanvasElement;
    private _gl: WebGLRenderingContext;
    private _shaderProgram: ShaderProgram;
    private _buffers: Buffers;
    private _then: number = 0;
    private _fpsInterval: number;
    private _now: number;
    private _elapsed: number;
    private _texture: WebGLTexture;
    private _cubeRotation: number = 0;

    init()
    {
        this._canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this._gl = this._canvas.getContext("webgl", {
            premultipliedAlpha: false
        });
        if (this._gl == null)
        {
            alert("unable to initialise webgl");
            return;
        }
        this._buffers = {};

        this._shaderProgram = new ShaderProgram();
        this._shaderProgram.initShaderProgram(this._gl, vsSource, fsSource);

        this.createCubeBuffer();

        window.addEventListener('resize', this.onCanvasResize.bind(this), false);
        this.onCanvasResize();
        
        this._texture = this.loadTexture("./working/tile000.png");
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, true);
        this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    }
    
    private onCanvasResize()
    {
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
    }
    
    update(fps: number)
    {
        this._fpsInterval = 1000 / fps;
        this._then = Date.now();
        this.updateFrame();
    }

    
    updateFrame()
    {
        requestAnimationFrame(this.updateFrame.bind(this));
        this._now = Date.now();
        this._elapsed = this._now - this._then;
        if (this._elapsed > this._fpsInterval)
        {
            this._then = this._now - (this._elapsed % this._fpsInterval);
            this.drawScene(this._fpsInterval / 1000);
            // Set the backbuffer's alpha to 1.0
        }
    }

    end()
    {

    }

    loadTexture(url: string): WebGLTexture{
        let gl = this._gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
      
        // Because images have to be downloaded over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                      width, height, border, srcFormat, srcType,
                      pixel);
      
        const image = new Image();
        image.onload = () => {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                        srcFormat, srcType, image);
      
          // WebGL1 has different requirements for power of 2 images
          // vs non power of 2 images so check if the image is a
          // power of 2 in both dimensions.
          if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
             // Yes, it's a power of 2. Generate mips.
             gl.generateMipmap(gl.TEXTURE_2D);
          } else {
             // No, it's not a power of 2. Turn off mips and set
             // wrapping to clamp to edge
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          }
        };
        image.src = url;
      
        return texture;
    }
      
    isPowerOf2(value: number): boolean {
        return (value & (value - 1)) === 0;
    }

    private createCubeBuffer()
    {
        let gl = this._gl;

        // cube vertex data
        {
            let cubeVertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
            let vertices = [
                // Front face
                -0.5, -0.5,  0.5,
                0.5, -0.5,  0.5,
                0.5,  0.5,  0.5,
                -0.5,  0.5,  0.5,
    
                // Back face
                -0.5, -0.5, -0.5,
                -0.5,  0.5, -0.5,
                0.5,  0.5, -0.5,
                0.5, -0.5, -0.5,
    
                // Top face
                -0.5,  0.5, -0.5,
                -0.5,  0.5,  0.5,
                0.5,  0.5,  0.5,
                0.5,  0.5, -0.5,
    
                // Bottom face
                -0.5, -0.5, -0.5,
                0.5, -0.5, -0.5,
                0.5, -0.5,  0.5,
                -0.5, -0.5,  0.5,
    
                // Right face
                0.5, -0.5, -0.5,
                0.5,  0.5, -0.5,
                0.5,  0.5,  0.5,
                0.5, -0.5,  0.5,
    
                // Left face
                -0.5, -0.5, -0.5,
                -0.5, -0.5,  0.5,
                -0.5,  0.5,  0.5,
                -0.5,  0.5, -0.5
            ]
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            this._buffers.cubeVertexPositionBuffer = cubeVertexPositionBuffer;
        }

        // cube texture data
        {
            let cubeVertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
            const textureCoordinates = [
                // Front
                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,
                // Back
                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,
                // Top
                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,
                // Bottom
                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,
                // Right
                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,
                // Left
                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
            this._buffers.cubeVertexTextureCoordBuffer = cubeVertexTextureCoordBuffer;
        }
        
        // cube index data
        {
            let cubeIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
            let cubeVertexIndices = [
                0, 1, 2,      0, 2, 3,    // Front face
                4, 5, 6,      4, 6, 7,    // Back face
                8, 9, 10,     8, 10, 11,  // Top face
                12, 13, 14,   12, 14, 15, // Bottom face
                16, 17, 18,   16, 18, 19, // Right face
                20, 21, 22,   20, 22, 23  // Left face
            ];
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
            this._buffers.cubeVertexIndexBuffer = cubeIndexBuffer;
        }
    }

    private drawScene(deltaTime: number)
    {
        let gl = this._gl;
        let speed = 60 * deltaTime;
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 1, 1, 1);
        gl.enable(gl.BLEND);
        // gl.colorMask(false, false, false, true);
        gl.clearDepth(1); // Clear everything
        // gl.enable(gl.CULL_FACE);
        // gl.cullFace(gl.FRONT_AND_BACK);
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        
        {
            // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            const size = 3;          // 3 components per iteration
            const type = gl.FLOAT;   // the data is 32bit floats
            const normalize = false; // don't normalize the data
            const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            const offset = 0;        // start at the beginning of the buffer
            let positionLocation = gl.getAttribLocation(this._shaderProgram.program, 'a_position');
            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.cubeVertexPositionBuffer);
            gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
            gl.enableVertexAttribArray(positionLocation);
        }

        {
            const num = 2; // every coordinate composed of 2 values
            const type = gl.FLOAT; // the data in the buffer is 32-bit float
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set to the next
            const offset = 0; // how many bytes inside the buffer to start from
            let textureLocation = gl.getAttribLocation(this._shaderProgram.program, 'a_textureCoord');
            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.cubeVertexTextureCoordBuffer);
            gl.vertexAttribPointer(textureLocation, num, type, normalize, stride, offset);
            gl.enableVertexAttribArray(textureLocation);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers.cubeVertexIndexBuffer);

        {
            
            gl.useProgram(this._shaderProgram.program);


            // Tell WebGL we want to affect texture unit 0
            gl.activeTexture(gl.TEXTURE0);

            // Bind the texture to texture unit 0
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            let sampler = gl.getUniformLocation(this._shaderProgram.program, 'u_sampler');
            
            // Tell the shader we bound the texture to texture unit 0
            
            gl.uniform1i(sampler, 0);
        }
        
        
        const fieldOfView = degToRad(45);   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100;

        // Compute the matrices
        let projectionMatrix = Mat4.perspective(fieldOfView, aspect, zNear, zFar);
        // let projectionMatrix = Mat4.orthographic(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
        let modelViewMatrix = new Mat4();
        modelViewMatrix.translate(0, 0, -6);
        modelViewMatrix.scale(0.5, 0.5, 0.5);
        modelViewMatrix.rotateX(degToRad(this._cubeRotation));
        modelViewMatrix.rotateY(degToRad(this._cubeRotation));
        modelViewMatrix.rotateZ(degToRad(this._cubeRotation));

        // modelViewMatrix.translate(0, 0, -6);



        var projectionMatrixLocation = gl.getUniformLocation(this._shaderProgram.program, "u_projectionMatrix");
        var modelViewMatrixLocation = gl.getUniformLocation(this._shaderProgram.program, "u_modelViewMatrix");
        // Set the matrix.
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.values);
        gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix.values);
    
        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 36;

        // projectionMatrix = Mat4.orthographic(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
        gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);
        // modelViewMatrix.translate(3, 3, 0);
        // gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.values);
        // gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix.values);
        // gl.drawElements(primitiveType, count, this._gl.UNSIGNED_SHORT, offset);

        this._cubeRotation += speed;
      }
}