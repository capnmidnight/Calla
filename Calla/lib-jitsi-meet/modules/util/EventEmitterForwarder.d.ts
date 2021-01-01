import { EventEmitter } from "events";

export = EventEmitterForwarder;
/**
 * Implements utility to forward events from one eventEmitter to another.
 * @param src {object} instance of EventEmitter or another class that implements
 * addListener method which will register listener to EventEmitter instance.
 * @param dest {object} instance of EventEmitter or another class that
 * implements emit method which will emit an event.
 */
declare function EventEmitterForwarder(src: EventEmitter, dest: EventEmitter): void;
declare class EventEmitterForwarder {
    /**
     * Implements utility to forward events from one eventEmitter to another.
     * @param src {object} instance of EventEmitter or another class that implements
     * addListener method which will register listener to EventEmitter instance.
     * @param dest {object} instance of EventEmitter or another class that
     * implements emit method which will emit an event.
     */
    constructor(src: EventEmitter, dest: EventEmitter);
    src: any;
    dest: any;
    forward(...args: any[]): void;
}
