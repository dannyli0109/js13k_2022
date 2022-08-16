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
}