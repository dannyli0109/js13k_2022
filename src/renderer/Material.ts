import type { ShaderProgram } from "../ShaderProgram";
import type { Texture } from "./Texture";



export class Material
{
    private _program: ShaderProgram;
    private _textures: Texture[];
    public constructor(program: ShaderProgram, textures: Texture[] = [])
    {
        this._program = program;
        this._textures = textures;
    }

    get program(): ShaderProgram { return this._program; }
    get textures(): WebGLTexture[] { return this._textures; }

    public bind()
    {
        for (let i = 0; i < this._textures.length; i++)
        {
            this._program.setUniform1i(this._textures[i].name, i);
        }
    }
}