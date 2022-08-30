import { Vec2 } from "../mathLib/Vec2";
import { Renderer } from "../renderer/Renderer";
import { Events } from "./Events";

// define a enum for different keys with their corresponding keycode
export enum Keycode {
    W = "KeyW",
    A = "KeyA",
    S = "KeyS",
    D = "KeyD",
}

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
}

export class Input {
    private _keys: { [key: string]: boolean };
    private _mouse: { [key: string]: boolean };
    private _mousePosition: Vec2;
    private _mouseDelta: Vec2;

    private static _instance: Input = null;
    public static get instance(): Input {
        if (!Input._instance) {
            Input._instance = new Input();
            Input._instance.init();
        }
        return Input._instance;
    }

    private constructor() {}

    private init() {
        this.reset();
        document.addEventListener("keydown", e => {
            this._keys[e.code] = true;
        });

        document.addEventListener("keyup", e => {
            this._keys[e.code] = false;
        });

        Renderer.instance.canvas.addEventListener(
            "mousemove",
            e => {
                this._mouseDelta = new Vec2(e.movementX, e.movementY);
                this._mousePosition = new Vec2(e.clientX, e.clientY);
                Events.dispatch("mousemove", e);
            },
            true
        );

        Renderer.instance.canvas.addEventListener(
            "mousedown",
            e => {
                this._mouse[e.button] = true;
                Events.dispatch(`mousedown`, e);
            },
            true
        );

        Renderer.instance.canvas.addEventListener(
            "mouseup",
            e => {
                this._mouse[e.button] = false;
                Events.dispatch(`mouseup`, e);
            },
            true
        );

        Renderer.instance.canvas.addEventListener("blur", () => {
            this.reset();
        });

        Renderer.instance.canvas.oncontextmenu = e => {
            e.preventDefault();
        };
    }

    private reset() {
        this._keys = {};
        this._mouse = {};
    }

    public get mouseDelta(): Vec2 {
        return this._mouseDelta;
    }

    public get mousePosition(): Vec2 {
        return this._mousePosition;
    }

    onKeyDown(callback: (e: KeyboardEvent) => void): Events.Listener {
        return Events.add("keydown", callback);
    }

    onMouseClick(button: MouseButton, callback: (e: MouseEvent) => void): Events.Listener {
        return Events.add(`mousedown`, callback);
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
