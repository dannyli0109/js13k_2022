(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Program = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Mat = require("./mathLib/Mat4");

var _Util = require("./mathLib/Util");

var _ShaderProgram = require("./ShaderProgram");

var _ShaderSources = require("./ShaderSources");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Program = exports.Program = function () {
    function Program() {
        _classCallCheck(this, Program);

        this._then = 0;
        this._cubeRotation = 0;
    }

    _createClass(Program, [{
        key: "init",
        value: function init() {
            this._canvas = document.getElementById("canvas");
            this._gl = this._canvas.getContext("webgl", {
                premultipliedAlpha: false
            });
            if (this._gl == null) {
                alert("unable to initialise webgl");
                return;
            }
            this._buffers = {};
            this._shaderProgram = new _ShaderProgram.ShaderProgram();
            this._shaderProgram.initShaderProgram(this._gl, _ShaderSources.vsSource, _ShaderSources.fsSource);
            this.createCubeBuffer();
            window.addEventListener('resize', this.onCanvasResize.bind(this), false);
            this.onCanvasResize();
            this._texture = this.loadTexture("./working/tile000.png");
            this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, true);
            this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        }
    }, {
        key: "onCanvasResize",
        value: function onCanvasResize() {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
        }
    }, {
        key: "update",
        value: function update(fps) {
            this._fpsInterval = 1000 / fps;
            this._then = Date.now();
            this.updateFrame();
        }
    }, {
        key: "updateFrame",
        value: function updateFrame() {
            requestAnimationFrame(this.updateFrame.bind(this));
            this._now = Date.now();
            this._elapsed = this._now - this._then;
            if (this._elapsed > this._fpsInterval) {
                this._then = this._now - this._elapsed % this._fpsInterval;
                this.drawScene(this._fpsInterval / 1000);
            }
        }
    }, {
        key: "end",
        value: function end() {}
    }, {
        key: "loadTexture",
        value: function loadTexture(url) {
            var _this = this;

            var gl = this._gl;
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            var level = 0;
            var internalFormat = gl.RGBA;
            var width = 1;
            var height = 1;
            var border = 0;
            var srcFormat = gl.RGBA;
            var srcType = gl.UNSIGNED_BYTE;
            var pixel = new Uint8Array([0, 0, 255, 255]);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
            var image = new Image();
            image.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
                if (_this.isPowerOf2(image.width) && _this.isPowerOf2(image.height)) {
                    gl.generateMipmap(gl.TEXTURE_2D);
                } else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                }
            };
            image.src = url;
            return texture;
        }
    }, {
        key: "isPowerOf2",
        value: function isPowerOf2(value) {
            return (value & value - 1) === 0;
        }
    }, {
        key: "createCubeBuffer",
        value: function createCubeBuffer() {
            var gl = this._gl;
            {
                var cubeVertexPositionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
                var vertices = [-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
                this._buffers.cubeVertexPositionBuffer = cubeVertexPositionBuffer;
            }
            {
                var cubeVertexTextureCoordBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
                var textureCoordinates = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
                this._buffers.cubeVertexTextureCoordBuffer = cubeVertexTextureCoordBuffer;
            }
            {
                var cubeIndexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
                var cubeVertexIndices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
                this._buffers.cubeVertexIndexBuffer = cubeIndexBuffer;
            }
        }
    }, {
        key: "drawScene",
        value: function drawScene(deltaTime) {
            var gl = this._gl;
            var speed = 60 * deltaTime;
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.clearColor(0, 1, 1, 1);
            gl.enable(gl.BLEND);
            gl.clearDepth(1);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            {
                var size = 3;
                var type = gl.FLOAT;
                var normalize = false;
                var stride = 0;
                var _offset = 0;
                var positionLocation = gl.getAttribLocation(this._shaderProgram.program, 'a_position');
                gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.cubeVertexPositionBuffer);
                gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, _offset);
                gl.enableVertexAttribArray(positionLocation);
            }
            {
                var num = 2;
                var _type = gl.FLOAT;
                var _normalize = false;
                var _stride = 0;
                var _offset2 = 0;
                var textureLocation = gl.getAttribLocation(this._shaderProgram.program, 'a_textureCoord');
                gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.cubeVertexTextureCoordBuffer);
                gl.vertexAttribPointer(textureLocation, num, _type, _normalize, _stride, _offset2);
                gl.enableVertexAttribArray(textureLocation);
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers.cubeVertexIndexBuffer);
            {
                gl.useProgram(this._shaderProgram.program);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this._texture);
                var sampler = gl.getUniformLocation(this._shaderProgram.program, 'u_sampler');
                gl.uniform1i(sampler, 0);
            }
            var fieldOfView = (0, _Util.degToRad)(45);
            var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            var zNear = 0.1;
            var zFar = 100;
            var projectionMatrix = _Mat.Mat4.perspective(fieldOfView, aspect, zNear, zFar);
            var modelViewMatrix = new _Mat.Mat4();
            modelViewMatrix.translate(0, 0, -6);
            modelViewMatrix.scale(0.5, 0.5, 0.5);
            modelViewMatrix.rotateX((0, _Util.degToRad)(this._cubeRotation));
            modelViewMatrix.rotateY((0, _Util.degToRad)(this._cubeRotation));
            modelViewMatrix.rotateZ((0, _Util.degToRad)(this._cubeRotation));
            var projectionMatrixLocation = gl.getUniformLocation(this._shaderProgram.program, "u_projectionMatrix");
            var modelViewMatrixLocation = gl.getUniformLocation(this._shaderProgram.program, "u_modelViewMatrix");
            gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.values);
            gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix.values);
            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = 36;
            gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);
            this._cubeRotation += speed;
        }
    }]);

    return Program;
}();

},{"./ShaderProgram":2,"./ShaderSources":3,"./mathLib/Mat4":5,"./mathLib/Util":6}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShaderProgram = exports.ShaderProgram = function () {
    function ShaderProgram() {
        _classCallCheck(this, ShaderProgram);
    }

    _createClass(ShaderProgram, [{
        key: "initShaderProgram",
        value: function initShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
            var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
            var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
            this._program = gl.createProgram();
            gl.attachShader(this._program, vertexShader);
            gl.attachShader(this._program, fragmentShader);
            gl.linkProgram(this._program);
            if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
                alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(this._program));
            }
        }
    }, {
        key: "loadShader",
        value: function loadShader(gl, type, source) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }
    }, {
        key: "program",
        get: function get() {
            return this._program;
        }
    }]);

    return ShaderProgram;
}();

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var vsSource = exports.vsSource = "\n    attribute vec4 a_position;\n    attribute vec2 a_textureCoord;\n    uniform mat4 u_projectionMatrix;\n    uniform mat4 u_modelViewMatrix;\n\n    varying highp vec2 v_textureCoord;\n\n    void main() {\n        gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;\n        v_textureCoord = a_textureCoord;\n    }\n";
var fsSource = exports.fsSource = "\n    varying highp vec2 v_textureCoord;\n    uniform sampler2D u_sampler;\n\n    void main()\n    {\n        gl_FragColor = texture2D(u_sampler, v_textureCoord);\n    }\n";

},{}],4:[function(require,module,exports){
"use strict";

var _Program = require("./Program");

var program = new _Program.Program();
program.init();
program.update(60);

},{"./Program":1}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mat4 = exports.Mat4 = function () {
    function Mat4() {
        _classCallCheck(this, Mat4);

        for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
            values[_key] = arguments[_key];
        }

        if (values.length === 1) {
            this._values = [values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0], values[0]];
        } else if (values.length === 16) {
            this._values = values;
        } else if (values.length === 0) {
            this._values = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        } else {
            throw new Error("Invalid number of values");
        }
    }

    _createClass(Mat4, [{
        key: "multiply",
        value: function multiply(other) {
            var m00 = other.m00 * this.m00 + other.m01 * this.m10 + other.m02 * this.m20 + other.m03 * this.m30;
            var m01 = other.m00 * this.m01 + other.m01 * this.m11 + other.m02 * this.m21 + other.m03 * this.m31;
            var m02 = other.m00 * this.m02 + other.m01 * this.m12 + other.m02 * this.m22 + other.m03 * this.m32;
            var m03 = other.m00 * this.m03 + other.m01 * this.m13 + other.m02 * this.m23 + other.m03 * this.m33;
            var m10 = other.m10 * this.m00 + other.m11 * this.m10 + other.m12 * this.m20 + other.m13 * this.m30;
            var m11 = other.m10 * this.m01 + other.m11 * this.m11 + other.m12 * this.m21 + other.m13 * this.m31;
            var m12 = other.m10 * this.m02 + other.m11 * this.m12 + other.m12 * this.m22 + other.m13 * this.m32;
            var m13 = other.m10 * this.m03 + other.m11 * this.m13 + other.m12 * this.m23 + other.m13 * this.m33;
            var m20 = other.m20 * this.m00 + other.m21 * this.m10 + other.m22 * this.m20 + other.m23 * this.m30;
            var m21 = other.m20 * this.m01 + other.m21 * this.m11 + other.m22 * this.m21 + other.m23 * this.m31;
            var m22 = other.m20 * this.m02 + other.m21 * this.m12 + other.m22 * this.m22 + other.m23 * this.m32;
            var m23 = other.m20 * this.m03 + other.m21 * this.m13 + other.m22 * this.m23 + other.m23 * this.m33;
            var m30 = other.m30 * this.m00 + other.m31 * this.m10 + other.m32 * this.m20 + other.m33 * this.m30;
            var m31 = other.m30 * this.m01 + other.m31 * this.m11 + other.m32 * this.m21 + other.m33 * this.m31;
            var m32 = other.m30 * this.m02 + other.m31 * this.m12 + other.m32 * this.m22 + other.m33 * this.m32;
            var m33 = other.m30 * this.m03 + other.m31 * this.m13 + other.m32 * this.m23 + other.m33 * this.m33;
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
        }
    }, {
        key: "equals",
        value: function equals(other) {
            var tolerance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.00001;

            for (var i = 0; i < 9; i++) {
                if (Math.abs(this._values[i] - other._values[i]) > tolerance) {
                    return false;
                }
            }
            return true;
        }
    }, {
        key: "translate",
        value: function translate(x, y, z) {
            var translationMatrix = Mat4.translation(x, y, z);
            return this.multiply(translationMatrix);
        }
    }, {
        key: "rotateX",
        value: function rotateX(angle) {
            var rotationMatrix = Mat4.xRotation(angle);
            return this.multiply(rotationMatrix);
        }
    }, {
        key: "rotateY",
        value: function rotateY(angle) {
            var rotationMatrix = Mat4.yRotation(angle);
            return this.multiply(rotationMatrix);
        }
    }, {
        key: "rotateZ",
        value: function rotateZ(angle) {
            var rotationMatrix = Mat4.zRotation(angle);
            return this.multiply(rotationMatrix);
        }
    }, {
        key: "scale",
        value: function scale(x, y, z) {
            var scaleMatrix = Mat4.scaling(x, y, z);
            return this.multiply(scaleMatrix);
        }
    }, {
        key: "values",
        get: function get() {
            return this._values;
        }
    }, {
        key: "m00",
        get: function get() {
            return this._values[0];
        },
        set: function set(value) {
            this._values[0] = value;
        }
    }, {
        key: "m01",
        get: function get() {
            return this._values[1];
        },
        set: function set(value) {
            this._values[1] = value;
        }
    }, {
        key: "m02",
        get: function get() {
            return this._values[2];
        },
        set: function set(value) {
            this._values[2] = value;
        }
    }, {
        key: "m03",
        get: function get() {
            return this._values[3];
        },
        set: function set(value) {
            this._values[3] = value;
        }
    }, {
        key: "m10",
        get: function get() {
            return this._values[4];
        },
        set: function set(value) {
            this._values[4] = value;
        }
    }, {
        key: "m11",
        get: function get() {
            return this._values[5];
        },
        set: function set(value) {
            this._values[5] = value;
        }
    }, {
        key: "m12",
        get: function get() {
            return this._values[6];
        },
        set: function set(value) {
            this._values[6] = value;
        }
    }, {
        key: "m13",
        get: function get() {
            return this._values[7];
        },
        set: function set(value) {
            this._values[7] = value;
        }
    }, {
        key: "m20",
        get: function get() {
            return this._values[8];
        },
        set: function set(value) {
            this._values[8] = value;
        }
    }, {
        key: "m21",
        get: function get() {
            return this._values[9];
        },
        set: function set(value) {
            this._values[9] = value;
        }
    }, {
        key: "m22",
        get: function get() {
            return this._values[10];
        },
        set: function set(value) {
            this._values[10] = value;
        }
    }, {
        key: "m23",
        get: function get() {
            return this._values[11];
        },
        set: function set(value) {
            this._values[11] = value;
        }
    }, {
        key: "m30",
        get: function get() {
            return this._values[12];
        },
        set: function set(value) {
            this._values[12] = value;
        }
    }, {
        key: "m31",
        get: function get() {
            return this._values[13];
        },
        set: function set(value) {
            this._values[13] = value;
        }
    }, {
        key: "m32",
        get: function get() {
            return this._values[14];
        },
        set: function set(value) {
            this._values[14] = value;
        }
    }, {
        key: "m33",
        get: function get() {
            return this._values[15];
        },
        set: function set(value) {
            this._values[15] = value;
        }
    }], [{
        key: "translation",
        value: function translation(x, y, z) {
            return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1);
        }
    }, {
        key: "xRotation",
        value: function xRotation(angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            return new Mat4(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
        }
    }, {
        key: "yRotation",
        value: function yRotation(angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            return new Mat4(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
        }
    }, {
        key: "zRotation",
        value: function zRotation(angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            return new Mat4(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
    }, {
        key: "scaling",
        value: function scaling(x, y, z) {
            return new Mat4(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
        }
    }, {
        key: "orthographic",
        value: function orthographic(wdith, height, depth) {
            return new Mat4(2 / wdith, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 2 / depth, 0, -1, 1, 0, 1);
        }
    }, {
        key: "perspective",
        value: function perspective(fov, aspect, near, far) {
            var f = 1.0 / Math.tan(fov / 2);
            var nf = 1 / (near - far);
            return new Mat4(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0);
        }
    }]);

    return Mat4;
}();

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.radToDeg = radToDeg;
exports.degToRad = degToRad;
function radToDeg(rad) {
    return rad * 180 / Math.PI;
}
function degToRad(deg) {
    return deg * Math.PI / 180;
}

},{}]},{},[4])//# sourceMappingURL=bundle.js.map
