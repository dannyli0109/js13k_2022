import { Input, Keycode, MouseButton } from "../gameplay/Input";
import { Mat4 } from "../mathLib/Mat4";
import { degToRad } from "../mathLib/Util";
import { Vec3 } from "../mathLib/Vec3";
import { Renderer } from "./Renderer";

const YAW = -90.0;
const PITCH = 0.0;
const SPEED = 2.5;
const SENSITIVITY = 0.1;
const ZOOM = 45.0;
const NEAR = 0.1;
const FAR = 1000.0;
const FOV = 60;

export enum CameraMovement {
    FORWARD,
    BACKWARD,
    LEFT,
    RIGHT,
}

export abstract class Camera {
    public abstract get viewMatrix(): Mat4;

    public abstract get projectionMatrix(): Mat4;
}

export class EditorPerspectiveCamera extends Camera {
    private _position: Vec3;
    private _front: Vec3;
    private _up: Vec3;
    private _right: Vec3;
    private _worldUp: Vec3;

    private _yaw: number;
    private _pitch: number;

    private _fov: number;
    private _near: number;
    private _far: number;

    private _movementSpeed: number;
    private _mouseSensitivity: number;
    private _zoom: number;

    constructor(
        position: Vec3 = new Vec3(0, 0, 0),
        up: Vec3 = new Vec3(0, 1, 0),
        yaw: number = YAW,
        pitch: number = PITCH,
        front: Vec3 = new Vec3(0, 0, -1),
        fov: number = FOV,
        near: number = NEAR,
        far: number = FAR,
        movementSpeed: number = SPEED,
        mouseSensitivity: number = SENSITIVITY,
        zoom: number = ZOOM
    ) {
        super();
        this._position = position;
        this._front = front;
        this._worldUp = up;
        this._yaw = yaw;
        this._pitch = pitch;

        this._fov = fov;
        this._near = near;
        this._far = far;

        this._movementSpeed = movementSpeed;
        this._mouseSensitivity = mouseSensitivity;
        this._zoom = zoom;
        this.updateVectors();

        Input.instance.onMouseMove(e => {
            if (Input.instance.isMouseDown(MouseButton.Right)) {
                let xDelta = e.movementX;
                let yDelta = -e.movementY;
                this.processMouseMovement(xDelta, yDelta);
            }
        });
    }

    public get viewMatrix(): Mat4 {
        return Mat4.lookAt(this._position, this._position.add(this._front), this._up);
    }

    public get projectionMatrix(): Mat4 {
        let gl = Renderer.instance.gl;
        let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        return Mat4.perspective(degToRad(this._fov), aspect, this._near, this._far);
    }

    private updateVectors(): void {
        let front: Vec3 = new Vec3();
        front.x = Math.cos(degToRad(this._yaw)) * Math.cos(degToRad(this._pitch));
        front.y = Math.sin(degToRad(this._pitch));
        front.z = Math.sin(degToRad(this._yaw)) * Math.cos(degToRad(this._pitch));
        this._front = front.normalize();
        this._right = this._front.cross(this._worldUp).normalize();
        this._up = this._right.cross(this._front).normalize();
    }

    public processKeyboard(dir: CameraMovement, dt: number) {
        let velocity = this._movementSpeed * dt;
        if (dir === CameraMovement.FORWARD) {
            this._position = this._position.add(this._front.multiply(velocity));
        }
        if (dir === CameraMovement.BACKWARD) {
            this._position = this._position.subtract(this._front.multiply(velocity));
        }
        if (dir === CameraMovement.LEFT) {
            this._position = this._position.subtract(this._right.multiply(velocity));
        }
        if (dir === CameraMovement.RIGHT) {
            this._position = this._position.add(this._right.multiply(velocity));
        }
    }

    public processMouseMovement(xoffset: number, yoffset: number, constrainPitch: boolean = true) {
        xoffset *= this._mouseSensitivity;
        yoffset *= this._mouseSensitivity;

        this._yaw += xoffset;
        this._pitch += yoffset;

        // make sure that when pitch is out of bounds, screen doesn't get flipped
        if (constrainPitch) {
            if (this._pitch > 89.0) this._pitch = 89.0;
            if (this._pitch < -89.0) this._pitch = -89.0;
        }

        // update Front, Right and Up Vectors using the updated Euler angles
        this.updateVectors();
    }
}
