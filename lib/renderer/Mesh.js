import { Renderer } from "./Renderer";
export class Mesh {
    constructor(material, vertices, indices, uvs, normals, texture) {
        this.material = material;
        this.indices = indices;
        this.vertices = vertices;
        this.uvs = uvs;
        this.normals = normals;
        this.texture = texture;
        this.vao = this.createVao();
        this.vbo = this.createVbo(this.vertices);
        this.ibo = this.createIbo(this.indices);
    }
    createVao() {
        const gl = Renderer.instance.gl;
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        return vao;
    }
    createVbo(data) {
        const gl = Renderer.instance.gl;
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        return vbo;
    }
    createIbo(data) {
        const gl = Renderer.instance.gl;
        const ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
        return ibo;
    }
    ;
    bind() {
        const gl = Renderer.instance.gl;
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    }
}
