import { Mat4 } from "./mathLib/Mat4";
import { degToRad } from "./mathLib/Util";
import { Renderer } from "./renderer/Renderer";
import { ShaderProgram } from "./ShaderProgram";
import { vsPhongSource, fsPhongSource, vsFrameBufferSource, fsFrameBufferSource } from "./ShaderSources";


type Buffers = { 
    [bufferName: string]: WebGLBuffer;
}

type Shaders = {
    [shaderName: string]: ShaderProgram;
}

type TextTexture = {
    texture: WebGLTexture,
    width: number,
    height: number
}

const alphabets = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
];

export class Program
{
    // private _canvas: HTMLCanvasElement;
    private _textCanvas: HTMLCanvasElement;
    private _textContext: CanvasRenderingContext2D;
    // private _gl: WebGL2RenderingContext;
    private _shaders: Shaders;
    private _buffers: Buffers;
    private _then: number = 0;
    private _elapsed: number;
    private _texture: WebGLTexture;
    private _frameBufferTexture: WebGLTexture;
    private _cubeRotation: number = 0;
    private _frameTimes: number[] = [];
    private _frameCursor = 0;
    private _numFrames = 0;
    private _maxFrames = 60;
    private _totalFPS = 0;
    private _fps = 0;
    private _textTextures: TextTexture[];

    init()
    {
        let gl = Renderer.instance.gl;
        
        this._textCanvas = document.getElementById("textCanvas") as HTMLCanvasElement;
        this._textContext = this._textCanvas.getContext("2d");
        this._buffers = {};
        this._shaders = {};

        this._shaders.phong = new ShaderProgram();
        this._shaders.phong.initShaderProgram(gl, vsPhongSource, fsPhongSource);

        this._shaders.quad = new ShaderProgram();
        this._shaders.quad.initShaderProgram(gl, vsFrameBufferSource, fsFrameBufferSource);

        this.createCubebuffer();
        this.createQuadbuffer();
        // this.createTextTextures();
        let canvas = Renderer.instance.canvas;

        this.createFramebuffer(canvas.width, canvas.height);


        window.addEventListener('resize', this.onCanvasResize.bind(this), false);
        this.onCanvasResize();
        
        this._texture = this.loadTexture("./working/tile000.png");
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    }
    
    private onCanvasResize()
    {
        let gl = Renderer.instance.gl;
        let canvas = Renderer.instance.canvas;
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        this.createFramebuffer(gl.canvas.width, gl.canvas.height);
    }
    
    update()
    {
        this._then = Date.now();
        requestAnimationFrame(this.updateFrame.bind(this));
    }

    
    updateFrame(now: number)
    {
        let gl = Renderer.instance.gl;
        this._elapsed = now - this._then;
        if (this._elapsed == 0) 
        {
            this._fps = 0;
        }
        else
        {
            this._fps = 1000 / this._elapsed;
        }
        this._then = now;
        
        this._textContext.clearRect(0, 0, this._textCanvas.width, this._textCanvas.height);
        this._textContext.fillText("FPS: " + this.getFps().toFixed(1), 10, 10);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._buffers.framebuffer);
        this.drawScene(this._elapsed / 1000);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, this._frameBufferTexture);
        this.drawQuad();
        requestAnimationFrame(this.updateFrame.bind(this));
    }

    getFps(): number
    {
        this._totalFPS += this._fps - (this._frameTimes[this._frameCursor] || 0);
        this._frameTimes[this._frameCursor++] = this._fps;
        this._numFrames = Math.max(this._numFrames, this._frameCursor);
        this._frameCursor %= this._maxFrames;
        return this._totalFPS / this._numFrames;
    }

    end()
    {

    }

    loadTexture(url: string): WebGLTexture{
        let gl = Renderer.instance.gl;
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

    private createCubebuffer()
    {
        let gl = Renderer.instance.gl;

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

    private createQuadbuffer()
    {
        let gl = Renderer.instance.gl;
        let quadPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionBuffer);
        let vertices = [
            -1, -1, 0,
            1, -1,  0,
            1,  1,  0,
            -1, -1,  0,
            1,  1,  0,
            -1,  1,  0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this._buffers.quadPositionBuffer = quadPositionBuffer;
        let quadTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadTextureCoordBuffer);
        let textureCoordinates = [
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  0.0,
            1.0,  1.0,
            0.0,  1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
        this._buffers.quadTextureCoordBuffer = quadTextureCoordBuffer;
    }

    // private makeTextCanvas(text: string, width: number, height: number)
    // {
    //     this._textContext.canvas.width = width;
    //     this._textContext.canvas.height = height;
    //     this._textContext.font = "20px monospace";
    //     this._textContext.textAlign = "center";
    //     this._textContext.textBaseline = "middle";
    //     this._textContext.fillStyle = "white";
    //     this._textContext.clearRect(0, 0, width, height);
    //     this._textContext.fillText(text, width / 2, height / 2);
    //     return this._textContext.canvas;
    // }

    // private createTextTextures()
    // {
    //     let gl = this._gl;
    //     this._textTextures = alphabets.map(alphabet => {
    //         let textCanvas = this.makeTextCanvas(alphabet, 10, 26);
    //         let textWidth = textCanvas.width;
    //         let textHeight = textCanvas.height;
    //         let textTex = gl.createTexture();
    //         gl.bindTexture(gl.TEXTURE_2D, textTex);
    //         gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    //         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    //         // make sure we can render it even if it's not a power of 2
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //         return {
    //           texture: textTex,
    //           width: textWidth,
    //           height: textHeight,
    //         };
    //     });
    // }

    // private renderText(text: string, x: number, y: number)
    // {
    //     let gl = this._gl;
    //     for (let i = 0; i < text.length; i++) {
    //         let letter = text.charCodeAt(i);
    //         let letterIndex = letter - "a".charCodeAt(0);
    //         if (letterIndex < 0 || letterIndex >= alphabets.length) {
    //             continue;
    //         }
    //         let tex = this._textTextures[letterIndex];
    //         gl.activeTexture(gl.TEXTURE0);
    //         gl.bindTexture(gl.TEXTURE_2D, tex.texture);
    //         // gl.uniform1i(this._uniforms.uSampler, 0);
    //     }
    // }

    private drawQuad()
    {
        let gl = Renderer.instance.gl;
        gl.useProgram(this._shaders.quad.program);
        gl.viewport(0, 0,  gl.canvas.width, gl.canvas.height);
        gl.clearColor(1, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        let positionLocation = gl.getAttribLocation(this._shaders.quad.program, 'a_position');
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.quadPositionBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);
        let textureLocation = gl.getAttribLocation(this._shaders.quad.program, 'a_textureCoord');
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.quadTextureCoordBuffer);
        const num = 2; // every coordinate composed of 2 values
        const type = gl.FLOAT; // the data in the buffer is 32-bit float
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set to the next
        const offset = 0; // how many bytes inside the buffer to start from
        gl.vertexAttribPointer(textureLocation, num, type, normalize, stride, offset);
        gl.enableVertexAttribArray(textureLocation);
        let sampler = gl.getUniformLocation(this._shaders.quad.program, 'u_sampler');
        gl.uniform1i(sampler, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    private deleteFramebuffer()
    {
        let gl = Renderer.instance.gl;
        if (this._buffers.framebuffer) gl.deleteFramebuffer(this._buffers.framebuffer);
        if (this._frameBufferTexture) gl.deleteTexture(this._frameBufferTexture);
        this._buffers.framebuffer = null;
        this._frameBufferTexture = null;
    }

    private createFramebuffer(width: number, height: number)
    {
        let gl = Renderer.instance.gl;
        this.deleteFramebuffer();

        this._frameBufferTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._frameBufferTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        this._buffers.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._buffers.framebuffer);
        const attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this._frameBufferTexture, 0);
        
        this._buffers.depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this._buffers.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._buffers.depthBuffer);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    private drawScene(deltaTime: number)
    {
        let gl = Renderer.instance.gl;
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
            let positionLocation = gl.getAttribLocation(this._shaders.phong.program, 'a_position');
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
            let textureLocation = gl.getAttribLocation(this._shaders.phong.program, 'a_textureCoord');
            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.cubeVertexTextureCoordBuffer);
            gl.vertexAttribPointer(textureLocation, num, type, normalize, stride, offset);
            gl.enableVertexAttribArray(textureLocation);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers.cubeVertexIndexBuffer);

        {
            
            gl.useProgram(this._shaders.phong.program);


            // Tell WebGL we want to affect texture unit 0
            gl.activeTexture(gl.TEXTURE0);

            // // Bind the texture to texture unit 0
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            let sampler = gl.getUniformLocation(this._shaders.phong.program, 'u_sampler');
            
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



        var projectionMatrixLocation = gl.getUniformLocation(this._shaders.phong.program, "u_projectionMatrix");
        var modelViewMatrixLocation = gl.getUniformLocation(this._shaders.phong.program, "u_modelViewMatrix");
        // Set the matrix.
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.values);
        gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix.values);
    
        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 36;

        // projectionMatrix = Mat4.orthographic(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
        gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);
        modelViewMatrix.translate(1, 0, 0);
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.values);
        gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix.values);
        this._cubeRotation += speed;
      }
}