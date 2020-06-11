import EventEmitter from "events";

const emitter = new EventEmitter();
emitter.setMaxListeners(Infinity);

export const emit = emitter.emit.bind(emitter);
export const on = emitter.on.bind(emitter);
