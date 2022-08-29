import { Mat4 } from "../mathLib/Mat4";
import { Material } from "./Material";
import { Renderer } from "./Renderer";

export type MeshData = [number, number, number, number, number, number, number, number, number];
export type VertexAttribute = {
    size: number;
};
export class Mesh {
    public indices: number[];
    public vao: WebGLVertexArrayObject;
    public vbo: WebGLBuffer;
    public ibo: WebGLBuffer;
    private _attributes: number[];

    constructor(meshDatas: MeshData[], indices: number[], attributes: number[]) {
        this._attributes = attributes;
        this.indices = indices;
        this.vao = this.createVao();
        this.bind();
        this.ibo = this.createIbo(this.indices);
        this.vbo = this.createVbo(meshDatas);
        this.unbind();
    }

    private createVao(): WebGLVertexArrayObject {
        const gl = Renderer.instance.gl;
        const vao = gl.createVertexArray();
        return vao;
    }

    private createVbo(meshDatas: MeshData[]): WebGLBuffer {
        let dataSize = 0;
        for (let i = 0; i < this._attributes.length; i++) {
            dataSize += this._attributes[i];
        }
        dataSize *= Float32Array.BYTES_PER_ELEMENT;
        const dv = new DataView(new ArrayBuffer(dataSize * meshDatas.length));
        let offset = 0;

        for (let i = 0; i < meshDatas.length; i++) {
            let meshData = meshDatas[i];
            for (let i = 0; i < meshData.length; i++) {
                dv.setFloat32(offset, meshData[i], true);
                offset += Float32Array.BYTES_PER_ELEMENT;
            }
        }

        const gl = Renderer.instance.gl;
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, dv, gl.STATIC_DRAW);

        for (let i = 0; i < this._attributes.length; i++) {
            gl.vertexAttribPointer(
                i,
                this._attributes[i],
                gl.FLOAT,
                false,
                dataSize,
                this._attributes.slice(0, i).reduce((a, b) => a + b, 0) *
                    Float32Array.BYTES_PER_ELEMENT
            );
            gl.enableVertexAttribArray(i);
        }
        return vbo;
    }

    private createIbo(data: number[]): WebGLBuffer {
        const gl = Renderer.instance.gl;
        const ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
        return ibo;
    }

    public bind(): void {
        const gl = Renderer.instance.gl;
        gl.bindVertexArray(this.vao);
    }

    public unbind(): void {
        const gl = Renderer.instance.gl;
        gl.bindVertexArray(null);
    }
}
