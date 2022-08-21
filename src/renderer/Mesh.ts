import { Mat4 } from "../mathLib/Mat4";
import { Material } from "./Material";
import { Renderer } from "./Renderer";

export class Mesh
{
    public material: Material;
    public indices: number[];
    public vertices: number[];
    public uvs: number[];
    public normals: number[];
    public vao: WebGLVertexArrayObject;
    public vbo: WebGLBuffer;
    public ibo: WebGLBuffer;
    public texture: WebGLTexture;
    constructor(material: Material, vertices: number[], indices: number[], uvs: number[], normals: number[], texture: WebGLTexture)
    {
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

    private createVao(): WebGLVertexArrayObject
    {
        const gl = Renderer.instance.gl;
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        return vao;
    }

    private createVbo(data: number[]): WebGLBuffer
    {
        const gl = Renderer.instance.gl;
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
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
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    }
}