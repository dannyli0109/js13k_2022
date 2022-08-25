import { Mat4 } from "../mathLib/Mat4";
import { Material } from "./Material";
import { Renderer } from "./Renderer";

export type MeshData = {
    vertices: [number, number, number, number],
    normals: [number, number, number],
    texCoords: [number, number]
}


export class Mesh
{
    public indices: number[];
    public vao: WebGLVertexArrayObject;
    public vbo: WebGLBuffer;
    public ibo: WebGLBuffer;

    constructor(meshDatas: MeshData[], indices: number[])
    {
        this.indices = indices;
        this.vao = this.createVao();
        this.bind();
        this.ibo = this.createIbo(this.indices);
        this.vbo = this.createVbo(meshDatas);
        this.unbind();
    }

    private createVao(): WebGLVertexArrayObject
    {
        const gl = Renderer.instance.gl;
        const vao = gl.createVertexArray();
        return vao;
    }

    private createVbo(meshDatas: MeshData[]): WebGLBuffer
    {
        let vertexSize = 4;
        let normalSize = 3;
        let texCoordSize = 2;
        let dataSize = vertexSize + normalSize + texCoordSize;
        dataSize *= Float32Array.BYTES_PER_ELEMENT;
        const dv = new DataView(new ArrayBuffer(dataSize * meshDatas.length));
        let offset = 0;
        for (let i = 0; i < meshDatas.length; i++)
        {
            let meshData = meshDatas[i];
            for (let i = 0; i < meshData.vertices.length; i++)
            {
                dv.setFloat32(offset, meshData.vertices[i], true);
                offset += Float32Array.BYTES_PER_ELEMENT;
            }
            for (let i = 0; i < meshData.normals.length; i++)
            {
                dv.setFloat32(offset, meshData.normals[i], true);
                offset += Float32Array.BYTES_PER_ELEMENT;
            }
            for (let i = 0; i < meshData.texCoords.length; i++)
            {
                dv.setFloat32(offset, meshData.texCoords[i], true);
                offset += Float32Array.BYTES_PER_ELEMENT;           
            }
        }

        const gl = Renderer.instance.gl;
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, dv, gl.STATIC_DRAW);

        gl.vertexAttribPointer(0, vertexSize, gl.FLOAT, false, dataSize, 0);
        gl.vertexAttribPointer(1, normalSize, gl.FLOAT, false, dataSize, vertexSize * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribPointer(2, texCoordSize, gl.FLOAT, false, dataSize, (vertexSize + normalSize) * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        gl.enableVertexAttribArray(2);
        return vbo;
    }

    private createIbo(data: number[]): WebGLBuffer
    {
        const gl = Renderer.instance.gl;
        const ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
        return ibo;
    };

    public bind(): void
    {
        const gl = Renderer.instance.gl;
        gl.bindVertexArray(this.vao);
    }

    public unbind(): void
    {
        const gl = Renderer.instance.gl;
        gl.bindVertexArray(null);
    }
}