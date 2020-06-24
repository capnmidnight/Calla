import { project } from "../math.js";

const isOldAudioAPI = !AudioListener.prototype.hasOwnProperty("positionX");

export class Destination {
    constructor() {
        this.audioContext = new AudioContext();
        this.listener = this.audioContext.listener;

        this.minDistance = 1;
        this.maxDistance = 10;
        this.rolloff = 1;
        this.transitionTime = 0.125;

        if (isOldAudioAPI) {
            this.startMoveTime
                = this.endMoveTime
                = 0;

            this.listenerX
                = this.targetListenerX
                = this.startListenerX
                = 0;

            this.listenerY
                = this.targetListenerY
                = this.startListenerY
                = 0;

            this.listener.setPosition(0, 0, 0);
            this.listener.setOrientation(0, 0, -1, 0, 1, 0);
        }
        else {
            const time = this.audioContext.currentTime;
            this.listener.positionX.setValueAtTime(0, time);
            this.listener.positionY.setValueAtTime(0, time);
            this.listener.positionZ.setValueAtTime(0, time);
            this.listener.forwardX.setValueAtTime(0, time);
            this.listener.forwardY.setValueAtTime(0, time);
            this.listener.forwardZ.setValueAtTime(-1, time);
            this.listener.upX.setValueAtTime(0, time);
            this.listener.upY.setValueAtTime(1, time);
            this.listener.upZ.setValueAtTime(0, time);
        }
    }

    get positionX() {
        return isOldAudioAPI
            ? this.listenerX
            : this.audioContext.listener.positionX.value
    }

    get positionY() {
        return isOldAudioAPI
            ? this.listenerY
            : this.audioContext.listener.positionZ.value;
    }

    setPosition(evt) {
        const time = this.audioContext.currentTime + this.transitionTime;
        if (isOldAudioAPI) {
            this.startMoveTime = this.audioContext.currentTime;
            this.endMoveTime = time;
            this.startListenerX = this.listenerX;
            this.startListenerY = this.listenerY;
            this.targetListenerX = evt.x;
            this.targetListenerY = evt.y;
        }
        else {
            this.listener.positionX.linearRampToValueAtTime(evt.x, time);
            this.listener.positionZ.linearRampToValueAtTime(evt.y, time);
        }
    }

    setAudioProperties(evt) {
        this.minDistance = evt.minDistance;
        this.maxDistance = evt.maxDistance;
        this.transitionTime = evt.transitionTime;
        this.rolloff = evt.rolloff;
    }

    update() {
        if (isOldAudioAPI) {
            const time = this.audioContext.currentTime,
                p = project(time, this.startMoveTime, this.endMoveTime);

            if (p <= 1) {
                const deltaX = this.targetListenerX - this.startListenerX,
                    deltaY = this.targetListenerY - this.startListenerY;

                this.listenerX = this.startListenerX + p * deltaX;
                this.listenerY = this.startListenerY + p * deltaY;

                this.listener.setPosition(this.listenerX, 0, this.listenerY);
            }
        }
    }
}