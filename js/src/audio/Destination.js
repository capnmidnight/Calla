import { WebAudioOldListenerPosition } from "./WebAudioOldListenerPosition.js";
import { WebAudioNewListenerPosition } from "./WebAudioNewListenerPosition.js";

const isLatestWebAudioAPI = AudioListener.prototype.hasOwnProperty("positionX");

export class Destination {
    constructor() {
        this.audioContext = new AudioContext();
        this.listener = this.audioContext.listener;

        this.minDistance = 1;
        this.maxDistance = 10;
        this.rolloff = 1;
        this.transitionTime = 0.125;

        if (isLatestWebAudioAPI) {
            this.position = new WebAudioNewListenerPosition(this.audioContext.listener);
        }
        else {
            this.position = new WebAudioOldListenerPosition(this.audioContext.listener);
        }
    }

    get positionX() {
        return this.position.x;
    }

    get positionY() {
        return this.position.y;
    }

    setTarget(evt) {
        this.position.setTarget(evt.x, evt.y, this.audioContext.currentTime, this.transitionTime);
    }

    setAudioProperties(evt) {
        this.minDistance = evt.minDistance;
        this.maxDistance = evt.maxDistance;
        this.transitionTime = evt.transitionTime;
        this.rolloff = evt.rolloff;
    }

    update() {
        this.position.update(this.audioContext.currentTime);
    }
}