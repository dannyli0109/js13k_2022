export class Material {
    constructor(program, textures = []) {
        this._program = program;
        this._textures = textures;
    }
    get program() { return this._program; }
    get textures() { return this._textures; }
    bind() {
        for (let i = 0; i < this._textures.length; i++) {
            this._program.setUniform1i(this._textures[i].name, i);
        }
    }
}
