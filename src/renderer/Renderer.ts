import { ShaderProgram } from "../ShaderProgram";


export type Shaders = {
    [name: string]: ShaderProgram;
}

export namespace Renderer
{
    let _canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let _gl = _canvas.getContext("webgl2", {
        premultipliedAlpha: false
    }) as WebGL2RenderingContext;

    if (!_gl) {
        alert("unable to initialise webgl");
    }

    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;

    const _shaders: Shaders = {};

    export const instance = {
        get gl() { return _gl; },
        get canvas() { return _canvas; },
        loadShader(shaderName: string, vertexShaderSource: string, fragmentShaderSource: string) {
            if (!_shaders[shaderName]) {
                _shaders[shaderName] = new ShaderProgram();
                _shaders[shaderName].initShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
            }
            return _shaders[shaderName];
        },
        get shaders() { return _shaders; }
    }
}

// export const SINGLETON_KEY = Symbol();
// export type Singleton<T extends new (...args: any[]) => any> = T & {
//     [SINGLETON_KEY]: T extends new (...args: any[]) => infer I ? I : never
// };

// export class Singleton<T extends new (...args: any[]) => any>
// {
// 	public static _instance: any;

// 	public get instance(): T {
// 		let type: T;
// 		const proxyType = new Proxy(type, {
// 			// this will hijack the constructor
// 			construct(target: T, argsList, newTarget) {
// 				// we should skip the proxy for children of our target class
// 				if (target.prototype !== newTarget.prototype) {
// 					Singleton<T>._instance = Reflect.construct(target, argsList, newTarget);
// 				}
// 				// if our target class does not have an instance, create it
// 				if (!Singleton<T>._instance) {
// 					Singleton<T>._instance = Reflect.construct(target, argsList, newTarget);
// 				}
// 				// return the instance we created!
// 				return Singleton<T>._instance
// 			}
// 		});
// 		return proxyType;
// 	}
// }

// class a extends Singleton<any> {
// 	b: number;
// 	constructor()
// 	{
// 		super();
// 		this.b = 10;
// 	}
// }


// a.instance.b = 20;

// export const SINGLETON_KEY = Symbol();

// export type Singleton<T extends new (...args: any[]) => any> = T & {
//     [SINGLETON_KEY]: T extends new (...args: any[]) => infer I ? I : never
// };

// export const Singleton = <T extends new (...args: any[]) => any>(type: T) =>
// {
// 	const proxyType = new Proxy(type, {
// 		// this will hijack the constructor
// 		construct(target: Singleton<T>, argsList, newTarget) {
// 			// we should skip the proxy for children of our target class
// 			if (target.prototype !== newTarget.prototype) {
// 				return Reflect.construct(target, argsList, newTarget);
// 			}
// 			// if our target class does not have an instance, create it
// 			if (!target[SINGLETON_KEY]) {
// 				target[SINGLETON_KEY] = Reflect.construct(target, argsList, newTarget);
// 			}
// 			// return the instance we created!
// 			return target[SINGLETON_KEY];
// 		}
// 	});
	
// 	return proxyType;
// }

// Reflect.defineProperty(proxyType, "instance", {
// 	get() {
// 		if (!this[SINGLETON_KEY]) {
// 			new this();
// 		}
// 		return this[SINGLETON_KEY];
// 	},
// 	set(next) {
// 		this[SINGLETON_KEY] = next;
// 	}
// });
// return proxyType;