import type { Vec2 } from "../mathLib/Vec2";
import { Renderer } from "../renderer/Renderer";
import { Events } from "./Events";


// define a enum for different keys with their corresponding keycode 
export enum Keycode {
    W = "KeyW",
    A = "KeyA",
    S = "KeyS",
    D = "KeyD"
}

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2
}

// const SingletonInstance = (target: any, memberName: string) => {
//     if (!target[memberName])
//     {
//         target[memberName] = new target();
//     }
//     return target[memberName];
// }

// export class Testt
// {
//     private constructor()
//     {
//         console.log("Test");
//     }

//     @SingletonInstance
//     public static instance: Testt;
// }


export class Input {
    private _keys: { [key: string]: boolean };
    private _mouse: { [key: string]: boolean };
    private _mousePosition: Vec2;
    private _mouseDelta: Vec2;

    private static _instance: Input = null;
    public static get instance(): Input
    {
        if (!Input._instance) {
            Input._instance = new Input();
            Input._instance.init();
        }
        return Input._instance;
    }

    private init()
    {
        this._keys = {};
        this._mouse = {};
        addEventListener("keydown", (e) => {
            this._keys[e.code] = true;
            Events.dispatch(e.code, e);
        });

        addEventListener("keyup", (e) => {
            this._keys[e.code] = false;
        });

        Renderer.instance.canvas.addEventListener("mousemove", (e) => {
            e.preventDefault();
            Events.dispatch("mousemove", e);
        });

        Renderer.instance.canvas.addEventListener("mousedown", (e) => {
            e.preventDefault();
            this._mouse[e.button] = true;
            Events.dispatch(`mouse${e.button}`, e);
        });

        Renderer.instance.canvas.addEventListener("mouseup", (e) => {
            e.preventDefault();
            this._mouse[e.button] = false;
        });

        Renderer.instance.canvas.oncontextmenu = (e) => {
            e.preventDefault();
        }
    }

    public get mouseDelta(): Vec2 { return this._mouseDelta; }

    private constructor()
    {
    }

    onKey(key: Keycode, callback: (e: KeyboardEvent) => void): Events.Listener {
        return Events.add(key, callback);
    }

    onMouseClick(button: MouseButton, callback: (e: MouseEvent) => void): Events.Listener {
        return Events.add(`mouse${button}`, callback);
    }

    onMouseMove(callback: (e: MouseEvent) => void): Events.Listener {
        return Events.add("mousemove", callback);
    }

    isKeyDown(key: Keycode): boolean {
        return this._keys[key];
    }

    isMouseDown(button: MouseButton): boolean {
        return this._mouse[button];
    }
}