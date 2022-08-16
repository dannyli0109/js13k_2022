import { Vec2 } from "Vec2"

/**
 * column-major 3x3 matrix class
 */
export class Mat3
{
    private _values: number[];
    constructor(...values: number[])
    {
        if (values.length === 1)
        {
            this._values = [values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0]];
        }
        else if (values.length === 9)
        {
            this._values = values;
        }
        else if (values.length === 0)
        {
            this._values = [1, 0, 0, 0, 1, 0, 0, 0, 1];
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
    public get m10(): number { return this._values[3]; }
    public get m11(): number { return this._values[4]; }
    public get m12(): number { return this._values[5]; }
    public get m20(): number { return this._values[6]; }
    public get m21(): number { return this._values[7]; }
    public get m22(): number { return this._values[8]; }

    public set m00(value: number) { this._values[0] = value; }
    public set m01(value: number) { this._values[1] = value; }
    public set m02(value: number) { this._values[2] = value; }
    public set m10(value: number) { this._values[3] = value; }
    public set m11(value: number) { this._values[4] = value; }
    public set m12(value: number) { this._values[5] = value; }
    public set m20(value: number) { this._values[6] = value; }
    public set m21(value: number) { this._values[7] = value; }
    public set m22(value: number) { this._values[8] = value; }

    public multiply(other: Mat3): Mat3
    {
        let m00 = other.m00 * this.m00 + other.m01 * this.m10 + other.m02 * this.m20;
        let m01 = other.m00 * this.m01 + other.m01 * this.m11 + other.m02 * this.m21;
        let m02 = other.m00 * this.m02 + other.m01 * this.m12 + other.m02 * this.m22;
        let m10 = other.m10 * this.m00 + other.m11 * this.m10 + other.m12 * this.m20;
        let m11 = other.m10 * this.m01 + other.m11 * this.m11 + other.m12 * this.m21;
        let m12 = other.m10 * this.m02 + other.m11 * this.m12 + other.m12 * this.m22;
        let m20 = other.m20 * this.m00 + other.m21 * this.m10 + other.m22 * this.m20;
        let m21 = other.m20 * this.m01 + other.m21 * this.m11 + other.m22 * this.m21;
        let m22 = other.m20 * this.m02 + other.m21 * this.m12 + other.m22 * this.m22;
        return new Mat3(m00, m01, m02, m10, m11, m12, m20, m21, m22);
    }

    /**
     * check if this matrix is equal to another matrix within a certain tolerance
     * @param other the other matrix to compare to
     * @param tolerance the tolerance to use when comparing each element
     * @returns true if the matrices are equal within the given tolerance
     */
    public equals(other: Mat3, tolerance: number = 0.00001): boolean
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

    public static translation(x: number, y: number): Mat3
    {
        return new Mat3(
            1, 0, 0, 
            0, 1, 0, 
            x, y, 1
        );
    }
    
    public translate(vec: Vec2): Mat3
    {
        let translationMatrix = Mat3.translation(vec.x, vec.y);
        return this.multiply(translationMatrix);
    }

    public static rotation(angle: number): Mat3
    {
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        return new Mat3(
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        );
    }

    public rotate(angle: number): Mat3
    {
        let rotationMatrix = Mat3.rotation(angle);
        return this.multiply(rotationMatrix);
    }

    public static scaling(x: number, y: number): Mat3
    {
        return new Mat3(
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        );
    }

    public scale(x: number, y: number): Mat3
    {
        let scaleMatrix = Mat3.scaling(x, y);
        return this.multiply(scaleMatrix);
    }
}

/**
 * test matrix 3 multiplication return true if correct
 */
export function testMat3Multiplication(): boolean
{
    let a = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
    let b = new Mat3(10, 11, 12, 13, 14, 15, 16, 17, 18);
    let c = a.multiply(b);
    let d = new Mat3(
        138, 171, 204, 174, 216, 258, 210, 261, 312
    );
    console.log(c);
    console.log(d);
    return c.equals(d);
}

