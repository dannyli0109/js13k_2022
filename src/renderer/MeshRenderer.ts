import type { Mat4 } from "../mathLib/Mat4";
// import { Camera } from "./Camera";
import type { Mesh } from "./Mesh";

export class MeshRenderer
{
    render (mesh: Mesh, modelMatrix: Mat4): void {
        // const gl = Renderer.instance.gl;
        // const program = mesh.material.program;
        // program.use();
        // mesh.bind();
        // mesh.material.bind();
        // program.setUniformMatrix4fv("u_model", modelMatrix.values);
        // // program.setUniformMatrix4fv("u_view", camera.viewMatrix.values);
        // // program.setUniformMatrix4fv("u_projection", camera.projectionMatrix.values);
        // gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
        // mesh.unbind();
    }
}