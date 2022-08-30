import { Input, Keycode, MouseButton } from "./gameplay/Input";
import { Mat4 } from "./mathLib/Mat4";
import { degToRad } from "./mathLib/Util";
import { Camera, CameraMovement } from "./renderer/Camera";
import { Mesh, MeshData } from "./renderer/Mesh";
import { CubeMeshData, QuadMeshData } from "./renderer/MeshData";
import { Renderer } from "./renderer/Renderer";
import type { ShaderProgram } from "./renderer/ShaderProgram";
import {
    vsPhongSource,
    fsPhongSource,
    vsFrameBufferSource,
    fsFrameBufferSource,
} from "./renderer/ShaderSources";
import { Texture } from "./renderer/Texture";

type Buffers = {
    [bufferName: string]: WebGLBuffer;
};

type Shaders = {
    [shaderName: string]: ShaderProgram;
};

type TextTexture = {
    texture: WebGLTexture;
    width: number;
    height: number;
};

const alphabets = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
];

export class Program {
    // private _canvas: HTMLCanvasElement;
    private _textCanvas: HTMLCanvasElement;
    private _textContext: CanvasRenderingContext2D;
    // private _gl: WebGL2RenderingContext;
    private _shaders: Shaders;
    private _buffers: Buffers;
    private _then: number = 0;
    private _elapsed: number;
    private _texture: Texture;
    private _frameBufferTexture: Texture;
    private _cubeRotation: number = 0;
    private _frameTimes: number[] = [];
    private _frameCursor = 0;
    private _numFrames = 0;
    private _maxFrames = 60;
    private _totalFPS = 0;
    private _fps = 0;
    private _cubeMesh: Mesh;
    private _quadMesh: Mesh;
    private _textTextures: TextTexture[];

    init() {
        let gl = Renderer.instance.gl;
        // Input.instance.off(Keycode.W, this.onKeyDown.bind(this));
        // InputManager.instance.off(Keycode.W, this.onKeyDown);

        this._textCanvas = document.getElementById("textCanvas") as HTMLCanvasElement;
        this._textContext = this._textCanvas.getContext("2d");
        this._buffers = {};
        this._shaders = {};

        this._shaders.phong = Renderer.instance.loadShader("phong", vsPhongSource, fsPhongSource);
        this._shaders.quad = Renderer.instance.loadShader(
            "quad",
            vsFrameBufferSource,
            fsFrameBufferSource
        );

        this._cubeMesh = new Mesh(
            CubeMeshData.vertices as MeshData[],
            CubeMeshData.indices,
            [4, 3, 2]
        );
        this._quadMesh = new Mesh(
            QuadMeshData.vertices as MeshData[],
            QuadMeshData.indices,
            [4, 2]
        );
        let canvas = Renderer.instance.canvas;

        this.createFramebuffer(canvas.width, canvas.height);

        window.addEventListener("resize", this.onCanvasResize.bind(this), false);
        this.onCanvasResize();

        this._texture = new Texture();
        this._texture.load("./working/tile000.png");
        // this._texture = this.loadTexture("./working/tile000.png");
        // this._texture = this.loadTexture("./working/keyboard.jpg");
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST); // Enable depth testing

        // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    }

    onKeyDown() {
        console.log("keydown");
    }

    private onCanvasResize() {
        let gl = Renderer.instance.gl;
        let canvas = Renderer.instance.canvas;
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        this.createFramebuffer(gl.canvas.width, gl.canvas.height);
    }

    processInput(dt: number) {
        // Renderer.instance.editorCamera.update(dt);
    }

    update() {
        this._then = Date.now();
        requestAnimationFrame(this.updateFrame.bind(this));
    }

    updateFrame(now: number) {
        let gl = Renderer.instance.gl;
        this._elapsed = now - this._then;
        if (this._elapsed == 0) {
            this._fps = 0;
        } else {
            this._fps = 1000 / this._elapsed;
        }
        this._then = now;
        let dt = this._elapsed / 1000;
        Renderer.instance.editorCamera.update(dt);

        this._textContext.clearRect(0, 0, this._textCanvas.width, this._textCanvas.height);
        this._textContext.fillText("FPS: " + this.getFps().toFixed(1), 10, 10);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._buffers.framebuffer);
        this.drawScene(dt);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.drawQuad();
        requestAnimationFrame(this.updateFrame.bind(this));
    }

    getFps(): number {
        this._totalFPS += this._fps - (this._frameTimes[this._frameCursor] || 0);
        this._frameTimes[this._frameCursor++] = this._fps;
        this._numFrames = Math.max(this._numFrames, this._frameCursor);
        this._frameCursor %= this._maxFrames;
        return this._totalFPS / this._numFrames;
    }

    end() {}

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

    private drawQuad() {
        let gl = Renderer.instance.gl;
        gl.useProgram(this._shaders.quad.program);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        let textureLocation = gl.getAttribLocation(this._shaders.quad.program, "a_textureCoord");
        gl.enableVertexAttribArray(textureLocation);
        this._shaders.quad.bindTexture("u_sampler", this._frameBufferTexture, 0);
        this._quadMesh.bind();
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);
    }

    private deleteFramebuffer() {
        let gl = Renderer.instance.gl;
        if (this._buffers.framebuffer) gl.deleteFramebuffer(this._buffers.framebuffer);
        if (this._frameBufferTexture) gl.deleteTexture(this._frameBufferTexture.texture);
        this._buffers.framebuffer = null;
        this._frameBufferTexture = null;
    }

    private createFramebuffer(width: number, height: number) {
        let gl = Renderer.instance.gl;
        this.deleteFramebuffer();

        this._frameBufferTexture = new Texture();
        this._frameBufferTexture.initTexture(width, height);
        gl.bindTexture(gl.TEXTURE_2D, this._frameBufferTexture.texture);

        this._buffers.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._buffers.framebuffer);
        const attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            attachmentPoint,
            gl.TEXTURE_2D,
            this._frameBufferTexture.texture,
            0
        );

        this._buffers.depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this._buffers.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        gl.framebufferRenderbuffer(
            gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT,
            gl.RENDERBUFFER,
            this._buffers.depthBuffer
        );

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    private drawScene(deltaTime: number) {
        let gl = Renderer.instance.gl;
        let speed = 60 * deltaTime;
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearDepth(1); // Cl
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(this._shaders.phong.program);
        this._cubeMesh.bind();

        this._shaders.phong.bindTexture("u_sampler", this._texture, 0);

        // let projectionMatrix = Mat4.orthographic(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
        let modelMatrix = new Mat4();
        modelMatrix.translate(0, 0, -6);
        modelMatrix.scale(0.5, 0.5, 0.5);
        modelMatrix.rotateX(degToRad(this._cubeRotation));
        modelMatrix.rotateY(degToRad(this._cubeRotation));
        modelMatrix.rotateZ(degToRad(this._cubeRotation));

        // let projectionMatrix = Mat4.perspective(fieldOfView, aspect, zNear, zFar);
        var projectionMatrixLocation = gl.getUniformLocation(
            this._shaders.phong.program,
            "u_projectionMatrix"
        );
        var modelMatrixLocation = gl.getUniformLocation(
            this._shaders.phong.program,
            "u_modelMatrix"
        );
        var viewMatrixLocation = gl.getUniformLocation(this._shaders.phong.program, "u_viewMatrix");

        // Set the matrix.
        // Renderer.instance.editorCamera.projectionMatrix.values
        gl.uniformMatrix4fv(
            projectionMatrixLocation,
            false,
            Renderer.instance.editorCamera.projectionMatrix.values
        );
        gl.uniformMatrix4fv(
            viewMatrixLocation,
            false,
            Renderer.instance.editorCamera.viewMatrix.values
        );
        gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.values);

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 36;

        // projectionMatrix = Mat4.orthographic(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
        gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);
        this._cubeMesh.unbind();
        gl.bindTexture(gl.TEXTURE_2D, null);
        this._cubeRotation += speed;
    }
}
