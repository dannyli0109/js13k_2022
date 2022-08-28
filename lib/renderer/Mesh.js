"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mesh = void 0;
require("../mathLib/Mat4");
require("./Material");
var Renderer_1 = require("./Renderer");
var Mesh = (function () {
    function Mesh(meshDatas, indices) {
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
        var vertexSize = 4;
        var normalSize = 3;
        var texCoordSize = 2;
        var dataSize = vertexSize + normalSize + texCoordSize;
        dataSize *= Float32Array.BYTES_PER_ELEMENT;
        var dv = new DataView(new ArrayBuffer(dataSize * meshDatas.length));
        var offset = 0;
        for (var i = 0; i < meshDatas.length; i++) {
            var meshData = meshDatas[i];
            for (var i_1 = 0; i_1 < meshData.vertices.length; i_1++) {
                dv.setFloat32(offset, meshData.vertices[i_1], true);
                offset += Float32Array.BYTES_PER_ELEMENT;
            }
            for (var i_2 = 0; i_2 < meshData.normals.length; i_2++) {
                dv.setFloat32(offset, meshData.normals[i_2], true);
                offset += Float32Array.BYTES_PER_ELEMENT;
            }
            for (var i_3 = 0; i_3 < meshData.texCoords.length; i_3++) {
                dv.setFloat32(offset, meshData.texCoords[i_3], true);
                offset += Float32Array.BYTES_PER_ELEMENT;
            }
        }
        var gl = Renderer_1.Renderer.instance.gl;
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, dv, gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, vertexSize, gl.FLOAT, false, dataSize, 0);
        gl.vertexAttribPointer(1, normalSize, gl.FLOAT, false, dataSize, vertexSize * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribPointer(2, texCoordSize, gl.FLOAT, false, dataSize, (vertexSize + normalSize) * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        gl.enableVertexAttribArray(2);
        return vbo;
    };
    Mesh.prototype.createIbo = function (data) {
        var gl = Renderer_1.Renderer.instance.gl;
        var ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
        return ibo;
    };
    ;
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
