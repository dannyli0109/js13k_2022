import type { ShaderProgram } from "./ShaderProgram";
import type { Texture } from "./Texture";

export enum MaterialAttributeType {
    Texture,
    Float,
    Int,
    Vector2,
    Vector3,
    Mat4,
    Bool,

    None,
}

export class MaterialAttribute {
    public name: string;
    public type: MaterialAttributeType;
    public value: any;
    public constructor(name: string, type: MaterialAttributeType, value: any) {
        this.name = name;
        this.type = type;
        this.value = value;
    }
}

export class Material {
    private _program: ShaderProgram;
    private _parameters: MaterialAttribute[];
    public constructor(program: ShaderProgram) {
        this._program = program;
        this._parameters = [];
    }

    get program(): ShaderProgram {
        return this._program;
    }

    public addAttribute(attribute: MaterialAttribute) {
        if (this.find(attribute.name) === -1) {
            this._parameters.push(attribute);
        }
    }

    public find(name: string): number {
        for (let i = 0; i < this._parameters.length; i++) {
            if (this._parameters[i].name === name) {
                return i;
            }
        }
        return -1;
    }

    public bind() {
        for (let i = 0; i < this._parameters.length; i++) {
            let parameter = this._parameters[i];
            //     switch (parameter.type) {
            //         case MaterialAttributeType.Texture:
            //             let texture = parameter.value as Texture;

            //             break;
            //         case MaterialAttributeType.Float:
            //             this.program.setUniform(parameter.name, parameter.value);
            //             break;
            //         case MaterialAttributeType.Int:
            //             this.program.setUniform(parameter.name, parameter.value);
            //             break;
            //         case MaterialAttributeType.Vector2:
            //             this.program.setUniform(parameter.name, parameter.value);
            //             break;
            //         case MaterialAttributeType.Vector3:
            //             this.program.setUniform(parameter.name, parameter.value);
            //             break;
            //         case MaterialAttributeType.Mat4:
            //             this.program.setUniform(parameter.name, parameter.value);
            //             break;
            //         case MaterialAttributeType.Bool:
            //             this.program.setUniform(parameter.name, parameter.value);
            //             break;
            //         case MaterialAttributeType.None:
            //             break;
            //     }
            // }
        }
    }
}
