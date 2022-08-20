import { Renderer } from "./Renderer";
export class MeshRenderer {
    constructor() { }
    static get instance() {
        if (!MeshRenderer._instance) {
            MeshRenderer._instance = new MeshRenderer();
        }
        return MeshRenderer._instance;
    }
    render(mesh, modelMatrix, camera) {
        const gl = Renderer.instance.gl;
        const program = mesh.material.program;
        program.use();
        mesh.bind();
        mesh.material.bind();
        program.setUniformMatrix4fv("u_model", modelMatrix.values);
        program.setUniformMatrix4fv("u_view", camera.viewMatrix.values);
        program.setUniformMatrix4fv("u_projection", camera.projectionMatrix.values);
        gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}