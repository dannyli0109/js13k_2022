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
