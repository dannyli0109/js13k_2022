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
