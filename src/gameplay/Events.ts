export namespace Events
{
    const _events: { [event: string]: Listener[] } = {};
    
    export class Listener {
        private _event: string;
        private _callback: Function;
        public constructor(event: string, callback: Function) {
            this._event = event;
            this._callback = callback;
        }
        public disconnect() {
            remove(this._event, this._callback);
        };

        public get callback(): Function { return this._callback; }
    }

    
    export function add(event: string, callback: Function) {
        if (!_events[event]) {
            _events[event] = [];
        }
        let listener = new Listener(event, callback);
        _events[event].push(listener);
        return listener;
    }

    function remove(event: string, callback: Function) {
        if (!_events[event]) {
            return;
        }
        for (let i = 0; i < _events[event].length; i++) {
            if (_events[event][i].callback === callback) {
                _events[event].splice(i, 1);
                return;
            }
        }
    }

    export function dispatch(event: string, ...args: any[]) {
        if (_events[event]) {
            for (let listener of _events[event]) {
                listener.callback(...args);
            }
        }
    }
}
