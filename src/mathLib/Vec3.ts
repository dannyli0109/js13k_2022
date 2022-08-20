export class Vec3
{
    private _values: number[];
    constructor(...values: number[])
    {
        if (values.length === 1)
        {
            this._values = [values[0], values[0], values[0]];
        }
        else if (values.length === 3)
        {
            this._values = values;
        }
        else if (values.length === 0)
        {
            this._values = [0, 0, 0];
        }
        else
        {
            throw new Error("Invalid number of values");
        }
    }

    public get x(): number
    {
        return this._values[0];
    }

    public get y(): number
    {
        return this._values[1];
    }

    public get z(): number
    {
        return this._values[2];
    }
    
    public set x(value: number)
    {
        this._values[0] = value;
    }

    public set y(value: number)
    {
        this._values[1] = value;
    }

    public set z(value: number)
    {
        this._values[2] = value;
    }


    get values(): number[]
    {
        return this._values;
    }

    public add(other: Vec3): Vec3
    {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    public subtract(other: Vec3): Vec3
    {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    public dot(other: Vec3): number
    {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    public cross(other: Vec3): Vec3
    {
        return new Vec3(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
    }

    public get length(): number
    {
        return Math.sqrt(this.dot(this));
    }

    public normalize(): Vec3
    {
        let length = this.length;
        return new Vec3(this.x / length, this.y / length, this.z / length);
    }
}