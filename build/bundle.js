(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
require("./gameplay/Input");
var Mat4_1 = require("./mathLib/Mat4");
var Util_1 = require("./mathLib/Util");
require("./renderer/Camera");
var Mesh_1 = require("./renderer/Mesh");
var MeshData_1 = require("./renderer/MeshData");
var Renderer_1 = require("./renderer/Renderer");
var ShaderSources_1 = require("./renderer/ShaderSources");
var Texture_1 = require("./renderer/Texture");
var alphabets = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
];
var Program = (function () {
    function Program() {
        this._then = 0;
        this._cubeRotation = 0;
        this._frameTimes = [];
        this._frameCursor = 0;
        this._numFrames = 0;
        this._maxFrames = 60;
        this._totalFPS = 0;
        this._fps = 0;
    }
    Program.prototype.init = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        this._textCanvas = document.getElementById("textCanvas");
        this._textContext = this._textCanvas.getContext("2d");
        this._buffers = {};
        this._shaders = {};
        this._shaders.phong = Renderer_1.Renderer.instance.loadShader("phong", ShaderSources_1.vsPhongSource, ShaderSources_1.fsPhongSource);
        this._shaders.quad = Renderer_1.Renderer.instance.loadShader("quad", ShaderSources_1.vsFrameBufferSource, ShaderSources_1.fsFrameBufferSource);
        this._cubeMesh = new Mesh_1.Mesh(MeshData_1.CubeMeshData.vertices, MeshData_1.CubeMeshData.indices, [4, 3, 2]);
        this._quadMesh = new Mesh_1.Mesh(MeshData_1.QuadMeshData.vertices, MeshData_1.QuadMeshData.indices, [4, 2]);
        var canvas = Renderer_1.Renderer.instance.canvas;
        this.createFramebuffer(canvas.width, canvas.height);
        window.addEventListener("resize", this.onCanvasResize.bind(this), false);
        this.onCanvasResize();
        this._texture = new Texture_1.Texture();
        this._texture.load("./working/tile000.png");
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
    };
    Program.prototype.onKeyDown = function () {
        console.log("keydown");
    };
    Program.prototype.onCanvasResize = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        var canvas = Renderer_1.Renderer.instance.canvas;
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        this.createFramebuffer(gl.canvas.width, gl.canvas.height);
    };
    Program.prototype.processInput = function (dt) {
    };
    Program.prototype.update = function () {
        this._then = Date.now();
        requestAnimationFrame(this.updateFrame.bind(this));
    };
    Program.prototype.updateFrame = function (now) {
        var gl = Renderer_1.Renderer.instance.gl;
        this._elapsed = now - this._then;
        if (this._elapsed == 0) {
            this._fps = 0;
        }
        else {
            this._fps = 1000 / this._elapsed;
        }
        this._then = now;
        var dt = this._elapsed / 1000;
        Renderer_1.Renderer.instance.editorCamera.update(dt);
        this._textContext.clearRect(0, 0, this._textCanvas.width, this._textCanvas.height);
        this._textContext.fillText("FPS: " + this.getFps().toFixed(1), 10, 10);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._buffers.framebuffer);
        this.drawScene(dt);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.drawQuad();
        requestAnimationFrame(this.updateFrame.bind(this));
    };
    Program.prototype.getFps = function () {
        this._totalFPS += this._fps - (this._frameTimes[this._frameCursor] || 0);
        this._frameTimes[this._frameCursor++] = this._fps;
        this._numFrames = Math.max(this._numFrames, this._frameCursor);
        this._frameCursor %= this._maxFrames;
        return this._totalFPS / this._numFrames;
    };
    Program.prototype.end = function () { };
    Program.prototype.drawQuad = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        gl.useProgram(this._shaders.quad.program);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var textureLocation = gl.getAttribLocation(this._shaders.quad.program, "a_textureCoord");
        gl.enableVertexAttribArray(textureLocation);
        this._shaders.quad.bindTexture("u_sampler", this._frameBufferTexture, 0);
        this._quadMesh.bind();
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);
    };
    Program.prototype.deleteFramebuffer = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        if (this._buffers.framebuffer)
            gl.deleteFramebuffer(this._buffers.framebuffer);
        if (this._frameBufferTexture)
            gl.deleteTexture(this._frameBufferTexture.texture);
        this._buffers.framebuffer = null;
        this._frameBufferTexture = null;
    };
    Program.prototype.createFramebuffer = function (width, height) {
        var gl = Renderer_1.Renderer.instance.gl;
        this.deleteFramebuffer();
        this._frameBufferTexture = new Texture_1.Texture();
        this._frameBufferTexture.initTexture(width, height);
        gl.bindTexture(gl.TEXTURE_2D, this._frameBufferTexture.texture);
        this._buffers.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._buffers.framebuffer);
        var attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this._frameBufferTexture.texture, 0);
        this._buffers.depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this._buffers.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._buffers.depthBuffer);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    Program.prototype.drawScene = function (deltaTime) {
        var gl = Renderer_1.Renderer.instance.gl;
        var speed = 60 * deltaTime;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearDepth(1);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this._shaders.phong.program);
        this._cubeMesh.bind();
        this._shaders.phong.bindTexture("u_sampler", this._texture, 0);
        var modelMatrix = new Mat4_1.Mat4();
        modelMatrix.translate(0, 0, -6);
        modelMatrix.scale(0.5, 0.5, 0.5);
        modelMatrix.rotateX((0, Util_1.degToRad)(this._cubeRotation));
        modelMatrix.rotateY((0, Util_1.degToRad)(this._cubeRotation));
        modelMatrix.rotateZ((0, Util_1.degToRad)(this._cubeRotation));
        var projectionMatrixLocation = gl.getUniformLocation(this._shaders.phong.program, "u_projectionMatrix");
        var modelMatrixLocation = gl.getUniformLocation(this._shaders.phong.program, "u_modelMatrix");
        var viewMatrixLocation = gl.getUniformLocation(this._shaders.phong.program, "u_viewMatrix");
        gl.uniformMatrix4fv(projectionMatrixLocation, false, Renderer_1.Renderer.instance.editorCamera.projectionMatrix.values);
        gl.uniformMatrix4fv(viewMatrixLocation, false, Renderer_1.Renderer.instance.editorCamera.viewMatrix.values);
        gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.values);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 36;
        gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);
        this._cubeMesh.unbind();
        gl.bindTexture(gl.TEXTURE_2D, null);
        this._cubeRotation += speed;
    };
    return Program;
}());
exports.Program = Program;

},{"./gameplay/Input":3,"./mathLib/Mat4":5,"./mathLib/Util":6,"./renderer/Camera":9,"./renderer/Mesh":11,"./renderer/MeshData":12,"./renderer/Renderer":13,"./renderer/ShaderSources":15,"./renderer/Texture":16}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
var Events;
(function (Events) {
    var _events = {};
    var Listener = (function () {
        function Listener(event, callback) {
            this._event = event;
            this._callback = callback;
        }
        Listener.prototype.disconnect = function () {
            remove(this._event, this._callback);
        };
        ;
        Object.defineProperty(Listener.prototype, "callback", {
            get: function () { return this._callback; },
            enumerable: false,
            configurable: true
        });
        return Listener;
    }());
    Events.Listener = Listener;
    function add(event, callback) {
        if (!_events[event]) {
            _events[event] = [];
        }
        var listener = new Listener(event, callback);
        _events[event].push(listener);
        return listener;
    }
    Events.add = add;
    function remove(event, callback) {
        if (!_events[event]) {
            return;
        }
        for (var i = 0; i < _events[event].length; i++) {
            if (_events[event][i].callback === callback) {
                _events[event].splice(i, 1);
                return;
            }
        }
    }
    function dispatch(event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (_events[event]) {
            for (var _a = 0, _b = _events[event]; _a < _b.length; _a++) {
                var listener = _b[_a];
                listener.callback.apply(listener, args);
            }
        }
    }
    Events.dispatch = dispatch;
})(Events = exports.Events || (exports.Events = {}));

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = exports.MouseButton = exports.Keycode = void 0;
var Vec2_1 = require("../mathLib/Vec2");
var Renderer_1 = require("../renderer/Renderer");
var Events_1 = require("./Events");
var Keycode;
(function (Keycode) {
    Keycode["W"] = "KeyW";
    Keycode["A"] = "KeyA";
    Keycode["S"] = "KeyS";
    Keycode["D"] = "KeyD";
})(Keycode = exports.Keycode || (exports.Keycode = {}));
var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["Left"] = 0] = "Left";
    MouseButton[MouseButton["Middle"] = 1] = "Middle";
    MouseButton[MouseButton["Right"] = 2] = "Right";
})(MouseButton = exports.MouseButton || (exports.MouseButton = {}));
var Input = (function () {
    function Input() {
    }
    Object.defineProperty(Input, "instance", {
        get: function () {
            if (!Input._instance) {
                Input._instance = new Input();
                Input._instance.init();
            }
            return Input._instance;
        },
        enumerable: false,
        configurable: true
    });
    Input.prototype.init = function () {
        var _this = this;
        this.reset();
        document.addEventListener("keydown", function (e) {
            _this._keys[e.code] = true;
        });
        document.addEventListener("keyup", function (e) {
            _this._keys[e.code] = false;
        });
        Renderer_1.Renderer.instance.canvas.addEventListener("mousemove", function (e) {
            _this._mouseDelta = new Vec2_1.Vec2(e.movementX, e.movementY);
            _this._mousePosition = new Vec2_1.Vec2(e.clientX, e.clientY);
            Events_1.Events.dispatch("mousemove", e);
        }, true);
        Renderer_1.Renderer.instance.canvas.addEventListener("mousedown", function (e) {
            _this._mouse[e.button] = true;
            Events_1.Events.dispatch("mousedown", e);
        }, true);
        Renderer_1.Renderer.instance.canvas.addEventListener("mouseup", function (e) {
            _this._mouse[e.button] = false;
            Events_1.Events.dispatch("mouseup", e);
        }, true);
        Renderer_1.Renderer.instance.canvas.addEventListener("blur", function () {
            _this.reset();
        });
        Renderer_1.Renderer.instance.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };
    };
    Input.prototype.reset = function () {
        this._keys = {};
        this._mouse = {};
    };
    Object.defineProperty(Input.prototype, "mouseDelta", {
        get: function () {
            return this._mouseDelta;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "mousePosition", {
        get: function () {
            return this._mousePosition;
        },
        enumerable: false,
        configurable: true
    });
    Input.prototype.onKeyDown = function (callback) {
        return Events_1.Events.add("keydown", callback);
    };
    Input.prototype.onMouseClick = function (button, callback) {
        return Events_1.Events.add("mousedown", callback);
    };
    Input.prototype.onMouseMove = function (callback) {
        return Events_1.Events.add("mousemove", callback);
    };
    Input.prototype.isKeyDown = function (key) {
        return this._keys[key];
    };
    Input.prototype.isMouseDown = function (button) {
        return this._mouse[button];
    };
    Input._instance = null;
    return Input;
}());
exports.Input = Input;

},{"../mathLib/Vec2":7,"../renderer/Renderer":13,"./Events":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Program_1 = require("./Program");
var program = new Program_1.Program();
program.init();
program.update();

},{"./Program":1}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mat4 = void 0;
var Mat4 = (function () {
    function Mat4() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        if (values.length === 1) {
            this._values = [
                values[0],
                values[0],
                values[0],
                values[0],
                values[0],
                values[0],
                values[0],
                values[0],
                values[0],
                values[0],
                values[0],
                values[0],
                values[0],
                values[0],
                values[0],
                values[0],
            ];
        }
        else if (values.length === 16) {
            this._values = values;
        }
        else if (values.length === 0) {
            this._values = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        }
        else {
            throw new Error("Invalid number of values");
        }
    }
    Object.defineProperty(Mat4.prototype, "values", {
        get: function () {
            return this._values;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m00", {
        get: function () {
            return this._values[0];
        },
        set: function (value) {
            this._values[0] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m01", {
        get: function () {
            return this._values[1];
        },
        set: function (value) {
            this._values[1] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m02", {
        get: function () {
            return this._values[2];
        },
        set: function (value) {
            this._values[2] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m03", {
        get: function () {
            return this._values[3];
        },
        set: function (value) {
            this._values[3] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m10", {
        get: function () {
            return this._values[4];
        },
        set: function (value) {
            this._values[4] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m11", {
        get: function () {
            return this._values[5];
        },
        set: function (value) {
            this._values[5] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m12", {
        get: function () {
            return this._values[6];
        },
        set: function (value) {
            this._values[6] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m13", {
        get: function () {
            return this._values[7];
        },
        set: function (value) {
            this._values[7] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m20", {
        get: function () {
            return this._values[8];
        },
        set: function (value) {
            this._values[8] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m21", {
        get: function () {
            return this._values[9];
        },
        set: function (value) {
            this._values[9] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m22", {
        get: function () {
            return this._values[10];
        },
        set: function (value) {
            this._values[10] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m23", {
        get: function () {
            return this._values[11];
        },
        set: function (value) {
            this._values[11] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m30", {
        get: function () {
            return this._values[12];
        },
        set: function (value) {
            this._values[12] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m31", {
        get: function () {
            return this._values[13];
        },
        set: function (value) {
            this._values[13] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m32", {
        get: function () {
            return this._values[14];
        },
        set: function (value) {
            this._values[14] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "m33", {
        get: function () {
            return this._values[15];
        },
        set: function (value) {
            this._values[15] = value;
        },
        enumerable: false,
        configurable: true
    });
    Mat4.prototype.multiply = function (other) {
        var m00 = other.m00 * this.m00 +
            other.m01 * this.m10 +
            other.m02 * this.m20 +
            other.m03 * this.m30;
        var m01 = other.m00 * this.m01 +
            other.m01 * this.m11 +
            other.m02 * this.m21 +
            other.m03 * this.m31;
        var m02 = other.m00 * this.m02 +
            other.m01 * this.m12 +
            other.m02 * this.m22 +
            other.m03 * this.m32;
        var m03 = other.m00 * this.m03 +
            other.m01 * this.m13 +
            other.m02 * this.m23 +
            other.m03 * this.m33;
        var m10 = other.m10 * this.m00 +
            other.m11 * this.m10 +
            other.m12 * this.m20 +
            other.m13 * this.m30;
        var m11 = other.m10 * this.m01 +
            other.m11 * this.m11 +
            other.m12 * this.m21 +
            other.m13 * this.m31;
        var m12 = other.m10 * this.m02 +
            other.m11 * this.m12 +
            other.m12 * this.m22 +
            other.m13 * this.m32;
        var m13 = other.m10 * this.m03 +
            other.m11 * this.m13 +
            other.m12 * this.m23 +
            other.m13 * this.m33;
        var m20 = other.m20 * this.m00 +
            other.m21 * this.m10 +
            other.m22 * this.m20 +
            other.m23 * this.m30;
        var m21 = other.m20 * this.m01 +
            other.m21 * this.m11 +
            other.m22 * this.m21 +
            other.m23 * this.m31;
        var m22 = other.m20 * this.m02 +
            other.m21 * this.m12 +
            other.m22 * this.m22 +
            other.m23 * this.m32;
        var m23 = other.m20 * this.m03 +
            other.m21 * this.m13 +
            other.m22 * this.m23 +
            other.m23 * this.m33;
        var m30 = other.m30 * this.m00 +
            other.m31 * this.m10 +
            other.m32 * this.m20 +
            other.m33 * this.m30;
        var m31 = other.m30 * this.m01 +
            other.m31 * this.m11 +
            other.m32 * this.m21 +
            other.m33 * this.m31;
        var m32 = other.m30 * this.m02 +
            other.m31 * this.m12 +
            other.m32 * this.m22 +
            other.m33 * this.m32;
        var m33 = other.m30 * this.m03 +
            other.m31 * this.m13 +
            other.m32 * this.m23 +
            other.m33 * this.m33;
        this._values[0] = m00;
        this._values[1] = m01;
        this._values[2] = m02;
        this._values[3] = m03;
        this._values[4] = m10;
        this._values[5] = m11;
        this._values[6] = m12;
        this._values[7] = m13;
        this._values[8] = m20;
        this._values[9] = m21;
        this._values[10] = m22;
        this._values[11] = m23;
        this._values[12] = m30;
        this._values[13] = m31;
        this._values[14] = m32;
        this._values[15] = m33;
        return this;
    };
    Mat4.prototype.equals = function (other, tolerance) {
        if (tolerance === void 0) { tolerance = 0.00001; }
        for (var i = 0; i < 9; i++) {
            if (Math.abs(this._values[i] - other._values[i]) > tolerance) {
                return false;
            }
        }
        return true;
    };
    Mat4.translation = function (x, y, z) {
        return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1);
    };
    Mat4.prototype.translate = function (x, y, z) {
        var translationMatrix = Mat4.translation(x, y, z);
        return this.multiply(translationMatrix);
    };
    Mat4.xRotation = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return new Mat4(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
    };
    Mat4.prototype.rotateX = function (angle) {
        var rotationMatrix = Mat4.xRotation(angle);
        return this.multiply(rotationMatrix);
    };
    Mat4.yRotation = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return new Mat4(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
    };
    Mat4.prototype.rotateY = function (angle) {
        var rotationMatrix = Mat4.yRotation(angle);
        return this.multiply(rotationMatrix);
    };
    Mat4.zRotation = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return new Mat4(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    };
    Mat4.prototype.rotateZ = function (angle) {
        var rotationMatrix = Mat4.zRotation(angle);
        return this.multiply(rotationMatrix);
    };
    Mat4.scaling = function (x, y, z) {
        return new Mat4(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    };
    Mat4.prototype.scale = function (x, y, z) {
        var scaleMatrix = Mat4.scaling(x, y, z);
        return this.multiply(scaleMatrix);
    };
    Mat4.orthographic = function (left, right, bottom, top, near, far) {
        var rl = right - left;
        var tb = top - bottom;
        var fn = far - near;
        return new Mat4(2 / rl, 0, 0, 0, 0, 2 / tb, 0, 0, 0, 0, -2 / fn, 0, -(right + left) / rl, -(top + bottom) / tb, -(far + near) / fn, 1);
    };
    Mat4.perspective = function (fov, aspect, near, far) {
        var f = 1.0 / Math.tan(fov / 2);
        var nf = 1 / (near - far);
        return new Mat4(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0);
    };
    Mat4.lookAt = function (position, target, up) {
        var z = position.subtract(target).normalize();
        var x = up.cross(z).normalize();
        var y = z.cross(x).normalize();
        return new Mat4(x.x, y.x, z.x, 0, x.y, y.y, z.y, 0, x.z, y.z, z.z, 0, -x.dot(position), -y.dot(position), -z.dot(position), 1);
    };
    return Mat4;
}());
exports.Mat4 = Mat4;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.degToRad = exports.radToDeg = void 0;
function radToDeg(rad) {
    return rad * 180 / Math.PI;
}
exports.radToDeg = radToDeg;
function degToRad(deg) {
    return deg * Math.PI / 180;
}
exports.degToRad = degToRad;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vec2 = void 0;
var Vec2 = (function () {
    function Vec2() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        if (values.length === 1) {
            this._values = [values[0], values[0]];
        }
        else if (values.length === 2) {
            this._values = values;
        }
        else if (values.length === 0) {
            this._values = [0, 0];
        }
        else {
            throw new Error("Invalid number of values");
        }
    }
    Object.defineProperty(Vec2.prototype, "x", {
        get: function () {
            return this._values[0];
        },
        set: function (value) {
            this._values[0] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2.prototype, "y", {
        get: function () {
            return this._values[1];
        },
        set: function (value) {
            this._values[1] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2.prototype, "values", {
        get: function () {
            return this._values;
        },
        enumerable: false,
        configurable: true
    });
    return Vec2;
}());
exports.Vec2 = Vec2;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vec3 = void 0;
var Vec3 = (function () {
    function Vec3() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        if (values.length === 1) {
            this._values = [values[0], values[0], values[0]];
        }
        else if (values.length === 3) {
            this._values = values;
        }
        else if (values.length === 0) {
            this._values = [0, 0, 0];
        }
        else {
            throw new Error("Invalid number of values");
        }
    }
    Object.defineProperty(Vec3.prototype, "x", {
        get: function () {
            return this._values[0];
        },
        set: function (value) {
            this._values[0] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec3.prototype, "y", {
        get: function () {
            return this._values[1];
        },
        set: function (value) {
            this._values[1] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec3.prototype, "z", {
        get: function () {
            return this._values[2];
        },
        set: function (value) {
            this._values[2] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec3.prototype, "values", {
        get: function () {
            return this._values;
        },
        enumerable: false,
        configurable: true
    });
    Vec3.prototype.add = function (other) {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    };
    Vec3.prototype.subtract = function (other) {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    };
    Vec3.prototype.multiply = function (other) {
        if (typeof other === "number") {
            return new Vec3(this.x * other, this.y * other, this.z * other);
        }
        else {
            return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);
        }
    };
    Vec3.prototype.dot = function (other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    };
    Vec3.prototype.cross = function (other) {
        return new Vec3(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
    };
    Object.defineProperty(Vec3.prototype, "length", {
        get: function () {
            return Math.sqrt(this.dot(this));
        },
        enumerable: false,
        configurable: true
    });
    Vec3.prototype.normalize = function () {
        var length = this.length;
        return new Vec3(this.x / length, this.y / length, this.z / length);
    };
    return Vec3;
}());
exports.Vec3 = Vec3;

},{}],9:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorPerspectiveCamera = exports.Camera = exports.CameraMovement = void 0;
var Input_1 = require("../gameplay/Input");
var Mat4_1 = require("../mathLib/Mat4");
var Util_1 = require("../mathLib/Util");
var Vec3_1 = require("../mathLib/Vec3");
var Renderer_1 = require("./Renderer");
var YAW = -90.0;
var PITCH = 0.0;
var SPEED = 2.5;
var SENSITIVITY = 0.1;
var ZOOM = 45.0;
var NEAR = 0.1;
var FAR = 1000.0;
var FOV = 60;
var CameraMovement;
(function (CameraMovement) {
    CameraMovement[CameraMovement["FORWARD"] = 0] = "FORWARD";
    CameraMovement[CameraMovement["BACKWARD"] = 1] = "BACKWARD";
    CameraMovement[CameraMovement["LEFT"] = 2] = "LEFT";
    CameraMovement[CameraMovement["RIGHT"] = 3] = "RIGHT";
})(CameraMovement = exports.CameraMovement || (exports.CameraMovement = {}));
var Camera = (function () {
    function Camera() {
    }
    return Camera;
}());
exports.Camera = Camera;
var EditorPerspectiveCamera = (function (_super) {
    __extends(EditorPerspectiveCamera, _super);
    function EditorPerspectiveCamera(position, up, yaw, pitch, front, fov, near, far, movementSpeed, mouseSensitivity, zoom) {
        if (position === void 0) { position = new Vec3_1.Vec3(0, 0, 0); }
        if (up === void 0) { up = new Vec3_1.Vec3(0, 1, 0); }
        if (yaw === void 0) { yaw = YAW; }
        if (pitch === void 0) { pitch = PITCH; }
        if (front === void 0) { front = new Vec3_1.Vec3(0, 0, -1); }
        if (fov === void 0) { fov = FOV; }
        if (near === void 0) { near = NEAR; }
        if (far === void 0) { far = FAR; }
        if (movementSpeed === void 0) { movementSpeed = SPEED; }
        if (mouseSensitivity === void 0) { mouseSensitivity = SENSITIVITY; }
        if (zoom === void 0) { zoom = ZOOM; }
        var _this = _super.call(this) || this;
        _this._position = position;
        _this._front = front;
        _this._worldUp = up;
        _this._yaw = yaw;
        _this._pitch = pitch;
        _this._fov = fov;
        _this._near = near;
        _this._far = far;
        _this._movementSpeed = movementSpeed;
        _this._mouseSensitivity = mouseSensitivity;
        _this._zoom = zoom;
        _this._moveVec = new Vec3_1.Vec3();
        _this.updateVectors();
        Input_1.Input.instance.onMouseMove(function (e) {
            if (Input_1.Input.instance.isMouseDown(Input_1.MouseButton.Right)) {
                var xDelta = e.movementX;
                var yDelta = -e.movementY;
                _this.processMouseMovement(xDelta, yDelta);
            }
        });
        return _this;
    }
    Object.defineProperty(EditorPerspectiveCamera.prototype, "viewMatrix", {
        get: function () {
            return Mat4_1.Mat4.lookAt(this._position, this._position.add(this._front), this._up);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EditorPerspectiveCamera.prototype, "projectionMatrix", {
        get: function () {
            var gl = Renderer_1.Renderer.instance.gl;
            var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            return Mat4_1.Mat4.perspective((0, Util_1.degToRad)(this._fov), aspect, this._near, this._far);
        },
        enumerable: false,
        configurable: true
    });
    EditorPerspectiveCamera.prototype.updateVectors = function () {
        var front = new Vec3_1.Vec3();
        front.x = Math.cos((0, Util_1.degToRad)(this._yaw)) * Math.cos((0, Util_1.degToRad)(this._pitch));
        front.y = Math.sin((0, Util_1.degToRad)(this._pitch));
        front.z = Math.sin((0, Util_1.degToRad)(this._yaw)) * Math.cos((0, Util_1.degToRad)(this._pitch));
        this._front = front.normalize();
        this._right = this._front.cross(this._worldUp).normalize();
        this._up = this._right.cross(this._front).normalize();
    };
    EditorPerspectiveCamera.prototype.processKeyboard = function (dir, dt) {
        var velocity = this._movementSpeed * dt;
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
    };
    EditorPerspectiveCamera.prototype.update = function (dt) {
        if (Input_1.Input.instance.isKeyDown(Input_1.Keycode.W))
            this.processKeyboard(CameraMovement.FORWARD, dt);
        if (Input_1.Input.instance.isKeyDown(Input_1.Keycode.S))
            this.processKeyboard(CameraMovement.BACKWARD, dt);
        if (Input_1.Input.instance.isKeyDown(Input_1.Keycode.A))
            this.processKeyboard(CameraMovement.LEFT, dt);
        if (Input_1.Input.instance.isKeyDown(Input_1.Keycode.D))
            this.processKeyboard(CameraMovement.RIGHT, dt);
    };
    EditorPerspectiveCamera.prototype.processMouseMovement = function (xoffset, yoffset, constrainPitch) {
        if (constrainPitch === void 0) { constrainPitch = true; }
        xoffset *= this._mouseSensitivity;
        yoffset *= this._mouseSensitivity;
        this._yaw += xoffset;
        this._pitch += yoffset;
        if (constrainPitch) {
            if (this._pitch > 89.0)
                this._pitch = 89.0;
            if (this._pitch < -89.0)
                this._pitch = -89.0;
        }
        this.updateVectors();
    };
    return EditorPerspectiveCamera;
}(Camera));
exports.EditorPerspectiveCamera = EditorPerspectiveCamera;

},{"../gameplay/Input":3,"../mathLib/Mat4":5,"../mathLib/Util":6,"../mathLib/Vec3":8,"./Renderer":13}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Material = exports.MaterialAttribute = exports.MaterialAttributeType = void 0;
var MaterialAttributeType;
(function (MaterialAttributeType) {
    MaterialAttributeType[MaterialAttributeType["Texture"] = 0] = "Texture";
    MaterialAttributeType[MaterialAttributeType["Float"] = 1] = "Float";
    MaterialAttributeType[MaterialAttributeType["Int"] = 2] = "Int";
    MaterialAttributeType[MaterialAttributeType["Vector2"] = 3] = "Vector2";
    MaterialAttributeType[MaterialAttributeType["Vector3"] = 4] = "Vector3";
    MaterialAttributeType[MaterialAttributeType["Mat4"] = 5] = "Mat4";
    MaterialAttributeType[MaterialAttributeType["Bool"] = 6] = "Bool";
    MaterialAttributeType[MaterialAttributeType["None"] = 7] = "None";
})(MaterialAttributeType = exports.MaterialAttributeType || (exports.MaterialAttributeType = {}));
var MaterialAttribute = (function () {
    function MaterialAttribute(name, type, value) {
        this.name = name;
        this.type = type;
        this.value = value;
    }
    return MaterialAttribute;
}());
exports.MaterialAttribute = MaterialAttribute;
var Material = (function () {
    function Material(program) {
        this._program = program;
        this._parameters = [];
    }
    Object.defineProperty(Material.prototype, "program", {
        get: function () {
            return this._program;
        },
        enumerable: false,
        configurable: true
    });
    Material.prototype.addAttribute = function (attribute) {
        if (this.find(attribute.name) === -1) {
            this._parameters.push(attribute);
        }
    };
    Material.prototype.find = function (name) {
        for (var i = 0; i < this._parameters.length; i++) {
            if (this._parameters[i].name === name) {
                return i;
            }
        }
        return -1;
    };
    Material.prototype.bind = function () {
        for (var i = 0; i < this._parameters.length; i++) {
            var parameter = this._parameters[i];
        }
    };
    return Material;
}());
exports.Material = Material;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mesh = void 0;
require("../mathLib/Mat4");
require("./Material");
var Renderer_1 = require("./Renderer");
var Mesh = (function () {
    function Mesh(meshDatas, indices, attributes) {
        this._attributes = attributes;
        this.indices = indices;
        this.vao = this.createVao();
        this.bind();
        this.ibo = this.createIbo(this.indices);
        this.vbo = this.createVbo(meshDatas);
        this.unbind();
    }
    Mesh.prototype.createVao = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        var vao = gl.createVertexArray();
        return vao;
    };
    Mesh.prototype.createVbo = function (meshDatas) {
        var dataSize = 0;
        for (var i = 0; i < this._attributes.length; i++) {
            dataSize += this._attributes[i];
        }
        dataSize *= Float32Array.BYTES_PER_ELEMENT;
        var dv = new DataView(new ArrayBuffer(dataSize * meshDatas.length));
        var offset = 0;
        for (var i = 0; i < meshDatas.length; i++) {
            var meshData = meshDatas[i];
            for (var i_1 = 0; i_1 < meshData.length; i_1++) {
                dv.setFloat32(offset, meshData[i_1], true);
                offset += Float32Array.BYTES_PER_ELEMENT;
            }
        }
        var gl = Renderer_1.Renderer.instance.gl;
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, dv, gl.STATIC_DRAW);
        for (var i = 0; i < this._attributes.length; i++) {
            gl.vertexAttribPointer(i, this._attributes[i], gl.FLOAT, false, dataSize, this._attributes.slice(0, i).reduce(function (a, b) { return a + b; }, 0) *
                Float32Array.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(i);
        }
        return vbo;
    };
    Mesh.prototype.createIbo = function (data) {
        var gl = Renderer_1.Renderer.instance.gl;
        var ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
        return ibo;
    };
    Mesh.prototype.bind = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        gl.bindVertexArray(this.vao);
    };
    Mesh.prototype.unbind = function () {
        var gl = Renderer_1.Renderer.instance.gl;
        gl.bindVertexArray(null);
    };
    return Mesh;
}());
exports.Mesh = Mesh;

},{"../mathLib/Mat4":5,"./Material":10,"./Renderer":13}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuadMeshData = exports.CubeMeshData = void 0;
exports.CubeMeshData = {
    vertices: [
        [-0.5, -0.5, 0.5, 1, 0, 0, 1, 0, 0],
        [0.5, -0.5, 0.5, 1, 0, 0, 1, 1, 0],
        [0.5, 0.5, 0.5, 1, 0, 0, 1, 1, 1],
        [-0.5, 0.5, 0.5, 1, 0, 0, 1, 0, 1],
        [-0.5, -0.5, -0.5, 1, 0, 0, -1, 0, 0],
        [0.5, -0.5, -0.5, 1, 0, 0, -1, 1, 0],
        [0.5, 0.5, -0.5, 1, 0, 0, -1, 1, 1],
        [-0.5, 0.5, -0.5, 1, 0, 0, -1, 0, 1],
        [-0.5, 0.5, -0.5, 1, 0, -1, 0, 0, 0],
        [0.5, 0.5, -0.5, 1, 0, -1, 0, 1, 0],
        [0.5, 0.5, 0.5, 1, 0, -1, 0, 1, 1],
        [-0.5, 0.5, 0.5, 1, 0, -1, 0, 0, 1],
        [-0.5, -0.5, -0.5, 1, 0, 1, 0, 0, 0],
        [0.5, -0.5, -0.5, 1, 0, 1, 0, 1, 0],
        [0.5, -0.5, 0.5, 1, 0, 1, 0, 1, 1],
        [-0.5, -0.5, 0.5, 1, 0, 1, 0, 0, 1],
        [0.5, -0.5, -0.5, 1, 1, 0, 0, 0, 0],
        [0.5, 0.5, -0.5, 1, 1, 0, 0, 1, 0],
        [0.5, 0.5, 0.5, 1, 1, 0, 0, 1, 1],
        [0.5, -0.5, 0.5, 1, 1, 0, 0, 0, 1],
        [-0.5, -0.5, -0.5, 1, -1, 0, 0, 0, 0],
        [-0.5, 0.5, -0.5, 1, -1, 0, 0, 1, 0],
        [-0.5, 0.5, 0.5, 1, -1, 0, 0, 1, 1],
        [-0.5, -0.5, 0.5, 1, -1, 0, 0, 0, 1],
    ],
    indices: [
        0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18,
        16, 18, 19, 20, 21, 22, 20, 22, 23,
    ],
};
exports.QuadMeshData = {
    vertices: [
        [-0.5, -0.5, 0, 1, 0, 0],
        [0.5, -0.5, 0, 1, 1, 0],
        [0.5, 0.5, 0, 1, 1, 1],
        [-0.5, 0.5, 0, 1, 0, 1],
    ],
    indices: [0, 1, 2, 0, 2, 3],
};

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
var ShaderProgram_1 = require("./ShaderProgram");
var Camera_1 = require("./Camera");
var Renderer = (function () {
    function Renderer() {
    }
    Object.defineProperty(Renderer, "instance", {
        get: function () {
            if (!Renderer._instance) {
                Renderer._instance = new Renderer();
                Renderer._instance.init();
            }
            return Renderer._instance;
        },
        enumerable: false,
        configurable: true
    });
    Renderer.prototype.init = function () {
        this._canvas = document.getElementById("canvas");
        this._gl = this._canvas.getContext("webgl2", {
            premultipliedAlpha: false,
        });
        if (!this._gl) {
            alert("unable to initialise webgl");
        }
        this._shaders = {};
        this._editorCamera = new Camera_1.EditorPerspectiveCamera();
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
    };
    Renderer.prototype.loadShader = function (shaderName, vertexShaderSource, fragmentShaderSource) {
        if (!this._shaders[shaderName]) {
            this._shaders[shaderName] = new ShaderProgram_1.ShaderProgram();
            this._shaders[shaderName].initShaderProgram(this._gl, vertexShaderSource, fragmentShaderSource);
        }
        return this._shaders[shaderName];
    };
    Object.defineProperty(Renderer.prototype, "gl", {
        get: function () {
            return this._gl;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "canvas", {
        get: function () {
            return this._canvas;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "shaders", {
        get: function () {
            return this._shaders;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "editorCamera", {
        get: function () {
            return this._editorCamera;
        },
        enumerable: false,
        configurable: true
    });
    Renderer._instance = null;
    return Renderer;
}());
exports.Renderer = Renderer;

},{"./Camera":9,"./ShaderProgram":14}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShaderProgram = void 0;
var Renderer_1 = require("./Renderer");
var ShaderProgram = (function () {
    function ShaderProgram() {
        this._uniforms = {};
    }
    Object.defineProperty(ShaderProgram.prototype, "program", {
        get: function () {
            return this._program;
        },
        enumerable: false,
        configurable: true
    });
    ShaderProgram.prototype.initShaderProgram = function (gl, vertexShaderSource, fragmentShaderSource) {
        var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        this._program = gl.createProgram();
        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);
        gl.linkProgram(this._program);
        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: ".concat(gl.getProgramInfoLog(this._program)));
        }
    };
    ShaderProgram.prototype.loadShader = function (gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: ".concat(gl.getShaderInfoLog(shader)));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };
    ShaderProgram.prototype.use = function () {
        Renderer_1.Renderer.instance.gl.useProgram(this._program);
    };
    ShaderProgram.prototype.getUniformLocation = function (name) {
        var gl = Renderer_1.Renderer.instance.gl;
        if (!this._uniforms[name]) {
            this._uniforms[name] = gl.getUniformLocation(this._program, name);
        }
        return this._uniforms[name];
    };
    ShaderProgram.prototype.setUniformMatrix4fv = function (name, value) {
        var gl = Renderer_1.Renderer.instance.gl;
        this.use();
        var location = this.getUniformLocation(name);
        gl.uniformMatrix4fv(location, false, value);
        this._uniforms[name] = location;
    };
    ShaderProgram.prototype.setUniform1i = function (name, value) {
        var gl = Renderer_1.Renderer.instance.gl;
        var location = this.getUniformLocation(name);
        gl.uniform1i(location, value);
        this._uniforms[name] = location;
    };
    ShaderProgram.prototype.bindTexture = function (name, texture, textureUnit) {
        var gl = Renderer_1.Renderer.instance.gl;
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, texture.texture);
        this.setUniform1i(name, textureUnit);
    };
    return ShaderProgram;
}());
exports.ShaderProgram = ShaderProgram;

},{"./Renderer":13}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fsFrameBufferSource = exports.vsFrameBufferSource = exports.fsPhongSource = exports.vsPhongSource = void 0;
exports.vsPhongSource = "#version 300 es\n    in vec4 a_position;\n    in vec3 a_normal;\n    in vec2 a_textureCoord;\n    uniform mat4 u_projectionMatrix;\n    uniform mat4 u_modelMatrix;\n    uniform mat4 u_viewMatrix;\n\n    out vec2 v_textureCoord;\n\n    void main() {\n        gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;\n        v_textureCoord = a_textureCoord;\n    }\n";
exports.fsPhongSource = "#version 300 es\n    precision highp float;\n    in vec2 v_textureCoord;\n    uniform sampler2D u_sampler;\n    out vec4 out_color;\n\n    void main()\n    {\n        highp vec4 color = texture(u_sampler, v_textureCoord);\n        if (color.a == 0.0) { discard; }\n        out_color = color;\n    }\n";
exports.vsFrameBufferSource = "#version 300 es\n    in vec4 a_position;\n    in vec2 a_textureCoord;\n    out vec2 v_textureCoord;\n\n    void main() {\n        vec4 pos = vec4(a_position.x * 2.0, a_position.y * 2.0, a_position.z * 2.0, 1.0);\n        gl_Position = pos;\n        v_textureCoord = a_textureCoord;\n    }\n";
exports.fsFrameBufferSource = "#version 300 es\n    precision highp float;\n    in vec2 v_textureCoord;\n    uniform sampler2D u_sampler;\n    out vec4 out_color;\n\n    void main()\n    {\n        highp vec4 color = texture(u_sampler, v_textureCoord);\n        out_color = vec4(color.r, color.g, color.b, color.a);\n    }\n";

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Texture = void 0;
var Renderer_1 = require("./Renderer");
var Texture = (function () {
    function Texture() {
    }
    Texture.prototype.load = function (url) {
        var _this = this;
        this.initTexture(1, 1);
        var image = new Image();
        image.onload = function () {
            var gl = Renderer_1.Renderer.instance.gl;
            gl.bindTexture(gl.TEXTURE_2D, _this._texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        image.src = url;
    };
    Texture.prototype.initTexture = function (width, height) {
        var gl = Renderer_1.Renderer.instance.gl;
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this._texture = texture;
    };
    Object.defineProperty(Texture.prototype, "texture", {
        get: function () {
            return this._texture;
        },
        enumerable: false,
        configurable: true
    });
    return Texture;
}());
exports.Texture = Texture;

},{"./Renderer":13}]},{},[4])
//# sourceMappingURL=bundle.js.map
