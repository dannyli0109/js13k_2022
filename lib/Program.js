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
    createCubeBuffer() {
        let gl = this._gl;
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
    drawScene(deltaTime) {
        let gl = this._gl;
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
            let positionLocation = gl.getAttribLocation(this._shaderProgram.program, 'a_position');
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
            let textureLocation = gl.getAttribLocation(this._shaderProgram.program, 'a_textureCoord');
            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.cubeVertexTextureCoordBuffer);
            gl.vertexAttribPointer(textureLocation, num, type, normalize, stride, offset);
            gl.enableVertexAttribArray(textureLocation);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers.cubeVertexIndexBuffer);
        {
            gl.useProgram(this._shaderProgram.program);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            let sampler = gl.getUniformLocation(this._shaderProgram.program, 'u_sampler');
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
        var projectionMatrixLocation = gl.getUniformLocation(this._shaderProgram.program, "u_projectionMatrix");
        var modelViewMatrixLocation = gl.getUniformLocation(this._shaderProgram.program, "u_modelViewMatrix");
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.values);
        gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix.values);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 36;
        gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);
        this._cubeRotation += speed;
    }
}
