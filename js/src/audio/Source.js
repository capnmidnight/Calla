import { FullSpatializer } from "./FullSpatializer.js";
import { StereoSpatializer } from "./StereoSpatializer.js";

const audioActivityEvt = Object.assign(new Event("audioActivity", {
    id: null,
    isActive: false
}));

export class Source extends EventTarget {
    constructor(userID, audio, destination, bufferSize) {
        super();

        this.id = userID;
        this.lastAudible = true;
        this.activityCounter = 0;
        this.wasActive = false;

        this.destination = destination;

        this.audio = audio;
        this.audio.volume = 0;

        this.spatializer = new StereoSpatializer(this.destination, this.audio, bufferSize);
        this.spatializer.addEventListener("audioActivity", (evt) => {
            audioActivityEvt.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt);
        });

        Object.seal(this);
    }

    dispose() {
        this.spatializer.dispose();
        this.audio.pause();

        this.spatializer = null;
        this.destination = null;
        this.audio = null;
    }

    setAudioProperties(evt) {
        this.spatializer.setAudioProperties(evt);
    }

    setPosition(evt) {
        this.spatializer.setTarget(evt);
    }

    update() {
        this.spatializer.update();
    }
}