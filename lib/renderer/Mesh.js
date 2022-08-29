"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mesh = void 0;
require("../mathLib/Mat4");
require("./Material");
var Renderer_1 = require("./Renderer");
var Mesh = (function () {
    function Mesh(meshDatas, indices, attributes) {
        this._attributes = attributes;
        this.indices = indices;
        this.vao = this.createVao();
        this.bind();
        this.ibo = this.createIbo(this.indices);
        this.vbo = this.createVbo(meshDatas);
        this.unbind();
    }
    Mesh.prototype.createVao = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        var vao = gl.createVertexArray();
        return vao;
    };
    Mesh.prototype.createVbo = function (meshDatas) {
        var dataSize = 0;
        for (var i = 0; i < this._attributes.length; i++) {
            dataSize += this._attributes[i];
        }
        dataSize *= Float32Array.BYTES_PER_ELEMENT;
        var dv = new DataView(new ArrayBuffer(dataSize * meshDatas.length));
        var offset = 0;
        for (var i = 0; i < meshDatas.length; i++) {
            var meshData = meshDatas[i];
            for (var i_1 = 0; i_1 < meshData.length; i_1++) {
                dv.setFloat32(offset, meshData[i_1], true);
                offset += Float32Array.BYTES_PER_ELEMENT;
            }
        }
        var gl = Renderer_1.Renderer.instance.gl;
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, dv, gl.STATIC_DRAW);
        for (var i = 0; i < this._attributes.length; i++) {
            gl.vertexAttribPointer(i, this._attributes[i], gl.FLOAT, false, dataSize, this._attributes.slice(0, i).reduce(function (a, b) { return a + b; }, 0) *
                Float32Array.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(i);
        }
        return vbo;
    };
    Mesh.prototype.createIbo = function (data) {
        var gl = Renderer_1.Renderer.instance.gl;
        var ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
        return ibo;
    };
    Mesh.prototype.bind = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        gl.bindVertexArray(this.vao);
    };
    Mesh.prototype.unbind = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        gl.bindVertexArray(null);
    };
    return Mesh;
}());
exports.Mesh = Mesh;
