"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
require("./gameplay/Input");
var Mat4_1 = require("./mathLib/Mat4");
var Util_1 = require("./mathLib/Util");
require("./renderer/Camera");
var Mesh_1 = require("./renderer/Mesh");
var MeshData_1 = require("./renderer/MeshData");
var Renderer_1 = require("./renderer/Renderer");
var ShaderSources_1 = require("./renderer/ShaderSources");
var Texture_1 = require("./renderer/Texture");
var alphabets = [
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
var Program = (function () {
    function Program() {
        this._then = 0;
        this._cubeRotation = 0;
        this._frameTimes = [];
        this._frameCursor = 0;
        this._numFrames = 0;
        this._maxFrames = 60;
        this._totalFPS = 0;
        this._fps = 0;
    }
    Program.prototype.init = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        this._textCanvas = document.getElementById("textCanvas");
        this._textContext = this._textCanvas.getContext("2d");
        this._buffers = {};
        this._shaders = {};
        this._shaders.phong = Renderer_1.Renderer.instance.loadShader("phong", ShaderSources_1.vsPhongSource, ShaderSources_1.fsPhongSource);
        this._shaders.quad = Renderer_1.Renderer.instance.loadShader("quad", ShaderSources_1.vsFrameBufferSource, ShaderSources_1.fsFrameBufferSource);
        this._cubeMesh = new Mesh_1.Mesh(MeshData_1.CubeMeshData.vertices, MeshData_1.CubeMeshData.indices, [4, 3, 2]);
        this._quadMesh = new Mesh_1.Mesh(MeshData_1.QuadMeshData.vertices, MeshData_1.QuadMeshData.indices, [4, 2]);
        var canvas = Renderer_1.Renderer.instance.canvas;
        this.createFramebuffer(canvas.width, canvas.height);
        window.addEventListener("resize", this.onCanvasResize.bind(this), false);
        this.onCanvasResize();
        this._texture = new Texture_1.Texture();
        this._texture.load("./working/tile000.png");
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
    };
    Program.prototype.onKeyDown = function () {
        console.log("keydown");
    };
    Program.prototype.onCanvasResize = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        var canvas = Renderer_1.Renderer.instance.canvas;
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        this.createFramebuffer(gl.canvas.width, gl.canvas.height);
    };
    Program.prototype.processInput = function (dt) {
    };
    Program.prototype.update = function () {
        this._then = Date.now();
        requestAnimationFrame(this.updateFrame.bind(this));
    };
    Program.prototype.updateFrame = function (now) {
        var gl = Renderer_1.Renderer.instance.gl;
        this._elapsed = now - this._then;
        if (this._elapsed == 0) {
            this._fps = 0;
        }
        else {
            this._fps = 1000 / this._elapsed;
        }
        this._then = now;
        var dt = this._elapsed / 1000;
        Renderer_1.Renderer.instance.editorCamera.update(dt);
        this._textContext.clearRect(0, 0, this._textCanvas.width, this._textCanvas.height);
        this._textContext.fillText("FPS: " + this.getFps().toFixed(1), 10, 10);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._buffers.framebuffer);
        this.drawScene(dt);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.drawQuad();
        requestAnimationFrame(this.updateFrame.bind(this));
    };
    Program.prototype.getFps = function () {
        this._totalFPS += this._fps - (this._frameTimes[this._frameCursor] || 0);
        this._frameTimes[this._frameCursor++] = this._fps;
        this._numFrames = Math.max(this._numFrames, this._frameCursor);
        this._frameCursor %= this._maxFrames;
        return this._totalFPS / this._numFrames;
    };
    Program.prototype.end = function () { };
    Program.prototype.drawQuad = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        gl.useProgram(this._shaders.quad.program);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var textureLocation = gl.getAttribLocation(this._shaders.quad.program, "a_textureCoord");
        gl.enableVertexAttribArray(textureLocation);
        this._shaders.quad.bindTexture("u_sampler", this._frameBufferTexture, 0);
        this._quadMesh.bind();
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);
    };
    Program.prototype.deleteFramebuffer = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        if (this._buffers.framebuffer)
            gl.deleteFramebuffer(this._buffers.framebuffer);
        if (this._frameBufferTexture)
            gl.deleteTexture(this._frameBufferTexture.texture);
        this._buffers.framebuffer = null;
        this._frameBufferTexture = null;
    };
    Program.prototype.createFramebuffer = function (width, height) {
        var gl = Renderer_1.Renderer.instance.gl;
        this.deleteFramebuffer();
        this._frameBufferTexture = new Texture_1.Texture();
        this._frameBufferTexture.initTexture(width, height);
        gl.bindTexture(gl.TEXTURE_2D, this._frameBufferTexture.texture);
        this._buffers.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._buffers.framebuffer);
        var attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this._frameBufferTexture.texture, 0);
        this._buffers.depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this._buffers.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._buffers.depthBuffer);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    Program.prototype.drawScene = function (deltaTime) {
        var gl = Renderer_1.Renderer.instance.gl;
        var speed = 60 * deltaTime;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearDepth(1);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this._shaders.phong.program);
        this._cubeMesh.bind();
        this._shaders.phong.bindTexture("u_sampler", this._texture, 0);
        var modelMatrix = new Mat4_1.Mat4();
        modelMatrix.translate(0, 0, -6);
        modelMatrix.scale(0.5, 0.5, 0.5);
        modelMatrix.rotateX((0, Util_1.degToRad)(this._cubeRotation));
        modelMatrix.rotateY((0, Util_1.degToRad)(this._cubeRotation));
        modelMatrix.rotateZ((0, Util_1.degToRad)(this._cubeRotation));
        var projectionMatrixLocation = gl.getUniformLocation(this._shaders.phong.program, "u_projectionMatrix");
        var modelMatrixLocation = gl.getUniformLocation(this._shaders.phong.program, "u_modelMatrix");
        var viewMatrixLocation = gl.getUniformLocation(this._shaders.phong.program, "u_viewMatrix");
        gl.uniformMatrix4fv(projectionMatrixLocation, false, Renderer_1.Renderer.instance.editorCamera.projectionMatrix.values);
        gl.uniformMatrix4fv(viewMatrixLocation, false, Renderer_1.Renderer.instance.editorCamera.viewMatrix.values);
        gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.values);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 36;
        gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);
        this._cubeMesh.unbind();
        gl.bindTexture(gl.TEXTURE_2D, null);
        this._cubeRotation += speed;
    };
    return Program;
}());
exports.Program = Program;
