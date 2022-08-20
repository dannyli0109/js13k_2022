import { Vec3 } from "./Vec3";

/**
 * column-major 4x4 matrix class
 */
export class Mat4
{
    private _values: number[];
    constructor(...values: number[])
    {
        if (values.length === 1)
        {
            this._values = [values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0]];
        }
        else if (values.length === 16)
        {
            this._values = values;
        }
        else if (values.length === 0)
        {
           this._values = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        }
        else
        {
            throw new Error("Invalid number of values");
        }
    }
    public get values(): number[]
    {
        return this._values;
    }

    public get m00(): number { return this._values[0]; }
    public get m01(): number { return this._values[1]; }
    public get m02(): number { return this._values[2]; }
    public get m03(): number { return this._values[3]; }
    public get m10(): number { return this._values[4]; }
    public get m11(): number { return this._values[5]; }
    public get m12(): number { return this._values[6]; }
    public get m13(): number { return this._values[7]; }
    public get m20(): number { return this._values[8]; }
    public get m21(): number { return this._values[9]; }
    public get m22(): number { return this._values[10]; }
    public get m23(): number { return this._values[11]; }
    public get m30(): number { return this._values[12]; }
    public get m31(): number { return this._values[13]; }
    public get m32(): number { return this._values[14]; }
    public get m33(): number { return this._values[15]; }

    public set m00(value: number) { this._values[0] = value; }
    public set m01(value: number) { this._values[1] = value; }
    public set m02(value: number) { this._values[2] = value; }
    public set m03(value: number) { this._values[3] = value; }
    public set m10(value: number) { this._values[4] = value; }
    public set m11(value: number) { this._values[5] = value; }
    public set m12(value: number) { this._values[6] = value; }
    public set m13(value: number) { this._values[7] = value; }
    public set m20(value: number) { this._values[8] = value; }
    public set m21(value: number) { this._values[9] = value; }
    public set m22(value: number) { this._values[10] = value; }
    public set m23(value: number) { this._values[11] = value; }
    public set m30(value: number) { this._values[12] = value; }
    public set m31(value: number) { this._values[13] = value; }
    public set m32(value: number) { this._values[14] = value; }
    public set m33(value: number) { this._values[15] = value; }


    public multiply(other: Mat4): Mat4
    {
        let m00 = other.m00 * this.m00 + other.m01 * this.m10 + other.m02 * this.m20 + other.m03 * this.m30;
        let m01 = other.m00 * this.m01 + other.m01 * this.m11 + other.m02 * this.m21 + other.m03 * this.m31;
        let m02 = other.m00 * this.m02 + other.m01 * this.m12 + other.m02 * this.m22 + other.m03 * this.m32;
        let m03 = other.m00 * this.m03 + other.m01 * this.m13 + other.m02 * this.m23 + other.m03 * this.m33;
        let m10 = other.m10 * this.m00 + other.m11 * this.m10 + other.m12 * this.m20 + other.m13 * this.m30;
        let m11 = other.m10 * this.m01 + other.m11 * this.m11 + other.m12 * this.m21 + other.m13 * this.m31;
        let m12 = other.m10 * this.m02 + other.m11 * this.m12 + other.m12 * this.m22 + other.m13 * this.m32;
        let m13 = other.m10 * this.m03 + other.m11 * this.m13 + other.m12 * this.m23 + other.m13 * this.m33;
        let m20 = other.m20 * this.m00 + other.m21 * this.m10 + other.m22 * this.m20 + other.m23 * this.m30;
        let m21 = other.m20 * this.m01 + other.m21 * this.m11 + other.m22 * this.m21 + other.m23 * this.m31;
        let m22 = other.m20 * this.m02 + other.m21 * this.m12 + other.m22 * this.m22 + other.m23 * this.m32;
        let m23 = other.m20 * this.m03 + other.m21 * this.m13 + other.m22 * this.m23 + other.m23 * this.m33;
        let m30 = other.m30 * this.m00 + other.m31 * this.m10 + other.m32 * this.m20 + other.m33 * this.m30;
        let m31 = other.m30 * this.m01 + other.m31 * this.m11 + other.m32 * this.m21 + other.m33 * this.m31;
        let m32 = other.m30 * this.m02 + other.m31 * this.m12 + other.m32 * this.m22 + other.m33 * this.m32;
        let m33 = other.m30 * this.m03 + other.m31 * this.m13 + other.m32 * this.m23 + other.m33 * this.m33;
        this._values[0] = m00; this._values[1] = m01; this._values[2] = m02; this._values[3] = m03;
        this._values[4] = m10; this._values[5] = m11; this._values[6] = m12; this._values[7] = m13;
        this._values[8] = m20; this._values[9] = m21; this._values[10] = m22; this._values[11] = m23;
        this._values[12] = m30; this._values[13] = m31; this._values[14] = m32; this._values[15] = m33;
        return this;
    }

    /**
     * check if this matrix is equal to another matrix within a certain tolerance
     * @param other the other matrix to compare to
     * @param tolerance the tolerance to use when comparing each element
     * @returns true if the matrices are equal within the given tolerance
     */
    public equals(other: Mat4, tolerance: number = 0.00001): boolean
    {
        for (let i = 0; i < 9; i++)
        {
            if (Math.abs(this._values[i] - other._values[i]) > tolerance)
            {
                return false;
            }
        }
        return true;
    }

    public static translation(x: number, y: number, z: number): Mat4
    {
        return new Mat4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        );
    }
    
    public translate(x: number, y: number, z: number): Mat4
    {
        let translationMatrix = Mat4.translation(x, y, z);
        return this.multiply(translationMatrix);
    }

    public static xRotation(angle: number): Mat4
    {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        return new Mat4(
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        );
    }

    public rotateX(angle: number): Mat4
    {
        let rotationMatrix = Mat4.xRotation(angle);
        return this.multiply(rotationMatrix);
    }

    public static yRotation(angle: number): Mat4
    {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        return new Mat4(
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        );
    }

    public rotateY(angle: number): Mat4
    {
        let rotationMatrix = Mat4.yRotation(angle);
        return this.multiply(rotationMatrix);
    }

    public static zRotation(angle: number): Mat4
    {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        return new Mat4(
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    public rotateZ(angle: number): Mat4
    {
        let rotationMatrix = Mat4.zRotation(angle);
        return this.multiply(rotationMatrix);
    }

    public static scaling(x: number, y: number, z: number): Mat4
    {
        return new Mat4(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        );
    }

    public scale(x: number, y: number, z: number): Mat4
    {
        let scaleMatrix = Mat4.scaling(x, y, z);
        return this.multiply(scaleMatrix);
    }

    /**
     * create a orthographic projection matrix
     */
    public static orthographic(left: never, right: number, bottom: number, top: number, near: number, far: number): Mat4
    {
        let rl = right - left;
        let tb = top - bottom;
        let fn = far - near;
        return new Mat4(
            2 / rl, 0, 0, 0,
            0, 2 / tb, 0, 0,
            0, 0, -2 / fn, 0,
            -(right + left) / rl, -(top + bottom) / tb, -(far + near) / fn, 1
        );
    }

    public static perspective(fov: number, aspect: number, near: number, far: number): Mat4
    {
        let f = 1.0 / Math.tan(fov / 2);
        let nf = 1 / (near - far);
        return new Mat4(
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, (2 * far * near) * nf, 0
        );
    }

    public static lookAt(position: Vec3, target: Vec3, up: Vec3): Mat4
    {
        let z = position.subtract(target).normalize();
        let x = up.cross(z).normalize();
        let y = z.cross(x).normalize();
        return new Mat4(
            x.x, y.x, z.x, 0,
            x.y, y.y, z.y, 0,
            x.z, y.z, z.z, 0,
            -x.dot(position), -y.dot(position), -z.dot(position), 1
        );
    }
}


