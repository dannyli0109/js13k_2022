import { Mat4 } from "./mathLib/Mat4";
import { degToRad } from "./mathLib/Util";
import { ShaderProgram } from "./ShaderProgram";
import { fsSource, vsSource } from "./ShaderSources";

type WebGLProgramInfo = {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: number;
    };
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation;
        modelViewMatrix: WebGLUniformLocation;
    };
}

type Buffers = { 
    [bufferName: string]: WebGLBuffer;
}

export class Program
{
    private _canvas: HTMLCanvasElement;
    private _gl: WebGLRenderingContext;
    private _shaderProgram: ShaderProgram;
    private _programInfo: WebGLProgramInfo;
    private _buffers: Buffers;
    private _then: number = 0;
    private _cubeRotation: number = 0;
    private _fpsInterval: number;
    private _now: number;
    private _elapsed: number;
    private _texture: WebGLTexture;

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

        this._shaderProgram = new ShaderProgram();
        this._shaderProgram.initShaderProgram(this._gl, vsSource, fsSource);

        this._buffers = this.initBuffers(this._gl);

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

    private initBuffers(gl: WebGLRenderingContext): Buffers
    {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
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
            ]),
            gl.STATIC_DRAW
        );


        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

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


        const indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.
      
        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];
      
        // Now send the element array to GL
      
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        return {
            position: positionBuffer,
            texture: textureCoordBuffer,
            indices: indexBuffer
        }
    }

    private drawScene(deltaTime: number)
    {
        let speed = 60 * deltaTime;
        // Tell WebGL how to convert from clip space to pixels
        this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
        this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
        this._gl.clearColor(0, 1, 1, 1);
        this._gl.enable(this._gl.BLEND);
        // this._gl.colorMask(false, false, false, true);
        this._gl.clearDepth(1); // Clear everything
        // this._gl.enable(this._gl.CULL_FACE);
        // this._gl.cullFace(this._gl.FRONT_AND_BACK);
        this._gl.enable(this._gl.DEPTH_TEST); // Enable depth testing
        this._gl.depthFunc(this._gl.LEQUAL); // Near things obscure far things
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
        
        {

            // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            const size = 3;          // 3 components per iteration
            const type = this._gl.FLOAT;   // the data is 32bit floats
            const normalize = false; // don't normalize the data
            const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            const offset = 0;        // start at the beginning of the buffer
            let positionLocation = this._gl.getAttribLocation(this._shaderProgram.program, 'a_position');
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.position);
            this._gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
            this._gl.enableVertexAttribArray(positionLocation);
        }

        {
            const num = 2; // every coordinate composed of 2 values
            const type = this._gl.FLOAT; // the data in the buffer is 32-bit float
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set to the next
            const offset = 0; // how many bytes inside the buffer to start from
            let textureLocation = this._gl.getAttribLocation(this._shaderProgram.program, 'a_textureCoord');
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.texture);
            this._gl.vertexAttribPointer(textureLocation, num, type, normalize, stride, offset);
            this._gl.enableVertexAttribArray(textureLocation);
        }

        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffers.indices);

        {
            
            this._gl.useProgram(this._shaderProgram.program);


            // Tell WebGL we want to affect texture unit 0
            this._gl.activeTexture(this._gl.TEXTURE0);

            // Bind the texture to texture unit 0
            this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
            let sampler = this._gl.getUniformLocation(this._shaderProgram.program, 'u_sampler');
            
            // Tell the shader we bound the texture to texture unit 0
            
            this._gl.uniform1i(sampler, 0);
        }
        
        
        const fieldOfView = degToRad(45);   // in radians
        const aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100;

        // Compute the matrices
        let projectionMatrix = Mat4.perspective(fieldOfView, aspect, zNear, zFar);
        // let projectionMatrix = Mat4.orthographic(this._gl.canvas.clientWidth, this._gl.canvas.clientHeight, 400);
        let modelViewMatrix = new Mat4();
        modelViewMatrix.translate(0, 0, -6);
        modelViewMatrix.scale(0.5, 0.5, 0.5);
        // modelViewMatrix.rotateX(degToRad(this._cubeRotation));
        // modelViewMatrix.rotateY(degToRad(this._cubeRotation));
        // modelViewMatrix.rotateZ(degToRad(this._cubeRotation));

        // modelViewMatrix.translate(0, 0, -6);



        var projectionMatrixLocation = this._gl.getUniformLocation(this._shaderProgram.program, "u_projectionMatrix");
        var modelViewMatrixLocation = this._gl.getUniformLocation(this._shaderProgram.program, "u_modelViewMatrix");
        // Set the matrix.
        this._gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.values);
        this._gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix.values);
    
        // Draw the geometry.
        var primitiveType = this._gl.TRIANGLES;
        var offset = 0;
        var count = 36;

        // projectionMatrix = Mat4.orthographic(this._gl.canvas.clientWidth, this._gl.canvas.clientHeight, 400);
        this._gl.drawElements(primitiveType, count, this._gl.UNSIGNED_SHORT, offset);
        // modelViewMatrix.translate(3, 3, 0);
        // this._gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.values);
        // this._gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix.values);
        // this._gl.drawElements(primitiveType, count, this._gl.UNSIGNED_SHORT, offset);

        this._cubeRotation += speed;
      }
}