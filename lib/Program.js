import { Mat4 } from "./mathLib/Mat4";
import { degToRad } from "./mathLib/Util";
import { Renderer } from "./renderer/Renderer";
import { ShaderProgram } from "./ShaderProgram";
import { vsPhongSource, fsPhongSource, vsFrameBufferSource, fsFrameBufferSource } from "./ShaderSources";
const alphabets = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
];
export class Program {
    constructor() {
        this._then = 0;
        this._cubeRotation = 0;
        this._frameTimes = [];
        this._frameCursor = 0;
        this._numFrames = 0;
        this._maxFrames = 60;
        this._totalFPS = 0;
        this._fps = 0;
    }
    init() {
        let gl = Renderer.instance.gl;
        this._textCanvas = document.getElementById("textCanvas");
        this._textContext = this._textCanvas.getContext("2d");
        this._buffers = {};
        this._shaders = {};
        this._shaders.phong = new ShaderProgram();
        this._shaders.phong.initShaderProgram(gl, vsPhongSource, fsPhongSource);
        this._shaders.quad = new ShaderProgram();
        this._shaders.quad.initShaderProgram(gl, vsFrameBufferSource, fsFrameBufferSource);
        this.createCubebuffer();
        this.createQuadbuffer();
        let canvas = Renderer.instance.canvas;
        this.createFramebuffer(canvas.width, canvas.height);
        window.addEventListener('resize', this.onCanvasResize.bind(this), false);
        this.onCanvasResize();
        this._texture = this.loadTexture("./working/tile000.png");
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    }
    onCanvasResize() {
        let gl = Renderer.instance.gl;
        let canvas = Renderer.instance.canvas;
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        this.createFramebuffer(gl.canvas.width, gl.canvas.height);
    }
    update() {
        this._then = Date.now();
        requestAnimationFrame(this.updateFrame.bind(this));
    }
    updateFrame(now) {
        let gl = Renderer.instance.gl;
        this._elapsed = now - this._then;
        if (this._elapsed == 0) {
            this._fps = 0;
        }
        else {
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
    getFps() {
        this._totalFPS += this._fps - (this._frameTimes[this._frameCursor] || 0);
        this._frameTimes[this._frameCursor++] = this._fps;
        this._numFrames = Math.max(this._numFrames, this._frameCursor);
        this._frameCursor %= this._maxFrames;
        return this._totalFPS / this._numFrames;
    }
    end() {
    }
    loadTexture(url) {
        let gl = Renderer.instance.gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
        const image = new Image();
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        };
        image.src = url;
        return texture;
    }
    isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }
    createCubebuffer() {
        let gl = Renderer.instance.gl;
        {
            let cubeVertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
            let vertices = [
                -0.5, -0.5, 0.5,
                0.5, -0.5, 0.5,
                0.5, 0.5, 0.5,
                -0.5, 0.5, 0.5,
                -0.5, -0.5, -0.5,
                -0.5, 0.5, -0.5,
                0.5, 0.5, -0.5,
                0.5, -0.5, -0.5,
                -0.5, 0.5, -0.5,
                -0.5, 0.5, 0.5,
                0.5, 0.5, 0.5,
                0.5, 0.5, -0.5,
                -0.5, -0.5, -0.5,
                0.5, -0.5, -0.5,
                0.5, -0.5, 0.5,
                -0.5, -0.5, 0.5,
                0.5, -0.5, -0.5,
                0.5, 0.5, -0.5,
                0.5, 0.5, 0.5,
                0.5, -0.5, 0.5,
                -0.5, -0.5, -0.5,
                -0.5, -0.5, 0.5,
                -0.5, 0.5, 0.5,
                -0.5, 0.5, -0.5
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            this._buffers.cubeVertexPositionBuffer = cubeVertexPositionBuffer;
        }
        {
            let cubeVertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
            const textureCoordinates = [
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
            this._buffers.cubeVertexTextureCoordBuffer = cubeVertexTextureCoordBuffer;
        }
        {
            let cubeIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
            let cubeVertexIndices = [
                0, 1, 2, 0, 2, 3,
                4, 5, 6, 4, 6, 7,
                8, 9, 10, 8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                20, 21, 22, 20, 22, 23
            ];
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
            this._buffers.cubeVertexIndexBuffer = cubeIndexBuffer;
        }
    }
    createQuadbuffer() {
        let gl = Renderer.instance.gl;
        let quadPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionBuffer);
        let vertices = [
            -1, -1, 0,
            1, -1, 0,
            1, 1, 0,
            -1, -1, 0,
            1, 1, 0,
            -1, 1, 0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this._buffers.quadPositionBuffer = quadPositionBuffer;
        let quadTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadTextureCoordBuffer);
        let textureCoordinates = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
        this._buffers.quadTextureCoordBuffer = quadTextureCoordBuffer;
    }
    drawQuad() {
        let gl = Renderer.instance.gl;
        gl.useProgram(this._shaders.quad.program);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(1, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        let positionLocation = gl.getAttribLocation(this._shaders.quad.program, 'a_position');
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.quadPositionBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);
        let textureLocation = gl.getAttribLocation(this._shaders.quad.program, 'a_textureCoord');
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.quadTextureCoordBuffer);
        const num = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(textureLocation, num, type, normalize, stride, offset);
        gl.enableVertexAttribArray(textureLocation);
        let sampler = gl.getUniformLocation(this._shaders.quad.program, 'u_sampler');
        gl.uniform1i(sampler, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    deleteFramebuffer() {
        let gl = Renderer.instance.gl;
        if (this._buffers.framebuffer)
            gl.deleteFramebuffer(this._buffers.framebuffer);
        if (this._frameBufferTexture)
            gl.deleteTexture(this._frameBufferTexture);
        this._buffers.framebuffer = null;
        this._frameBufferTexture = null;
    }
    createFramebuffer(width, height) {
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
    drawScene(deltaTime) {
        let gl = Renderer.instance.gl;
        let speed = 60 * deltaTime;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 1, 1, 1);
        gl.enable(gl.BLEND);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        {
            const size = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            let positionLocation = gl.getAttribLocation(this._shaders.phong.program, 'a_position');
            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.cubeVertexPositionBuffer);
            gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
            gl.enableVertexAttribArray(positionLocation);
        }
        {
            const num = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            let textureLocation = gl.getAttribLocation(this._shaders.phong.program, 'a_textureCoord');
            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.cubeVertexTextureCoordBuffer);
            gl.vertexAttribPointer(textureLocation, num, type, normalize, stride, offset);
            gl.enableVertexAttribArray(textureLocation);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers.cubeVertexIndexBuffer);
        {
            gl.useProgram(this._shaders.phong.program);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            let sampler = gl.getUniformLocation(this._shaders.phong.program, 'u_sampler');
            gl.uniform1i(sampler, 0);
        }
        const fieldOfView = degToRad(45);
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100;
        let projectionMatrix = Mat4.perspective(fieldOfView, aspect, zNear, zFar);
        let modelViewMatrix = new Mat4();
        modelViewMatrix.translate(0, 0, -6);
        modelViewMatrix.scale(0.5, 0.5, 0.5);
        modelViewMatrix.rotateX(degToRad(this._cubeRotation));
        modelViewMatrix.rotateY(degToRad(this._cubeRotation));
        modelViewMatrix.rotateZ(degToRad(this._cubeRotation));
        var projectionMatrixLocation = gl.getUniformLocation(this._shaders.phong.program, "u_projectionMatrix");
        var modelViewMatrixLocation = gl.getUniformLocation(this._shaders.phong.program, "u_modelViewMatrix");
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.values);
        gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix.values);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 36;
        gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);
        modelViewMatrix.translate(1, 0, 0);
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.values);
        gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix.values);
        this._cubeRotation += speed;
    }
}
