import { Mat4 } from "../mathLib/Mat4";
import { Camera } from "./Camera";
import { Mesh } from "./Mesh";
import { Renderer } from "./Renderer";

export class MeshRenderer {
    private constructor () {}
    private static _instance: MeshRenderer;
    public static get instance(): MeshRenderer {
        if (!MeshRenderer._instance) {
            MeshRenderer._instance = new MeshRenderer();
        }
        return MeshRenderer._instance;
    }
    public render(mesh: Mesh, modelMatrix: Mat4, camera: Camera): void {
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