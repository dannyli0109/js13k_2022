import { Mat4 } from "./mathLib/Mat4";
import { degToRad } from "./mathLib/Util";
import { ShaderProgram } from "./ShaderProgram";
import { fsSource, vsSource } from "./ShaderSources";
export class Program {
    constructor() {
        this._then = 0;
        this._cubeRotation = 0;
    }
    init() {
        this._canvas = document.getElementById("canvas");
        this._gl = this._canvas.getContext("webgl", {
            premultipliedAlpha: false
        });
        if (this._gl == null) {
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
    onCanvasResize() {
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
    }
    update(fps) {
        this._fpsInterval = 1000 / fps;
        this._then = Date.now();
        this.updateFrame();
    }
    updateFrame() {
        requestAnimationFrame(this.updateFrame.bind(this));
        this._now = Date.now();
        this._elapsed = this._now - this._then;
        if (this._elapsed > this._fpsInterval) {
            this._then = this._now - (this._elapsed % this._fpsInterval);
            this.drawScene(this._fpsInterval / 1000);
        }
    }
    end() {
    }
    loadTexture(url) {
        let gl = this._gl;
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
    initBuffers(gl) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
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
        ]), gl.STATIC_DRAW);
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
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
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        const indices = [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        return {
            position: positionBuffer,
            texture: textureCoordBuffer,
            indices: indexBuffer
        };
    }
    drawScene(deltaTime) {
        let speed = 60 * deltaTime;
        this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
        this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
        this._gl.clearColor(0, 1, 1, 1);
        this._gl.enable(this._gl.BLEND);
        this._gl.clearDepth(1);
        this._gl.enable(this._gl.DEPTH_TEST);
        this._gl.depthFunc(this._gl.LEQUAL);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
        {
            const size = 3;
            const type = this._gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            let positionLocation = this._gl.getAttribLocation(this._shaderProgram.program, 'a_position');
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.position);
            this._gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
            this._gl.enableVertexAttribArray(positionLocation);
        }
        {
            const num = 2;
            const type = this._gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            let textureLocation = this._gl.getAttribLocation(this._shaderProgram.program, 'a_textureCoord');
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.texture);
            this._gl.vertexAttribPointer(textureLocation, num, type, normalize, stride, offset);
            this._gl.enableVertexAttribArray(textureLocation);
        }
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffers.indices);
        {
            this._gl.useProgram(this._shaderProgram.program);
            this._gl.activeTexture(this._gl.TEXTURE0);
            this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
            let sampler = this._gl.getUniformLocation(this._shaderProgram.program, 'u_sampler');
            this._gl.uniform1i(sampler, 0);
        }
        const fieldOfView = degToRad(45);
        const aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100;
        let projectionMatrix = Mat4.perspective(fieldOfView, aspect, zNear, zFar);
        let modelViewMatrix = new Mat4();
        modelViewMatrix.translate(0, 0, -6);
        modelViewMatrix.scale(0.5, 0.5, 0.5);
        var projectionMatrixLocation = this._gl.getUniformLocation(this._shaderProgram.program, "u_projectionMatrix");
        var modelViewMatrixLocation = this._gl.getUniformLocation(this._shaderProgram.program, "u_modelViewMatrix");
        this._gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.values);
        this._gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix.values);
        var primitiveType = this._gl.TRIANGLES;
        var offset = 0;
        var count = 36;
        this._gl.drawElements(primitiveType, count, this._gl.UNSIGNED_SHORT, offset);
        this._cubeRotation += speed;
    }
}
