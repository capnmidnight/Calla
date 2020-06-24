import { Source } from "./source.js";
import { Destination } from "./destination.js";

const BUFFER_SIZE = 1024,
    audioActivityEvt = Object.assign(new Event("audioActivity", {
        id: null,
        isActive: false
    }));


export class Manager extends EventTarget {
    constructor() {
        super();
        this.sourceLookup = {};
        this.sourceList = [];
        this.destination = new Destination();
        this.origin = null;

        this.updater = () => {
            requestAnimationFrame(this.updater);
            this.destination.update();
            for (let source of this.sourceList) {
                source.update();
            }
        };
        requestAnimationFrame(this.updater);
    }


    getSource(userID) {
        if (!this.sourceLookup[userID]) {
            const elementID = `#participant_${userID} audio`,
                audio = document.querySelector(elementID);

            if (!!audio) {
                const source = this.sourceLookup[userID] = new Source(userID, audio, this.destination, BUFFER_SIZE);
                source.addEventListener("audioActivity", (evt) => {
                    audioActivityEvt.id = evt.id;
                    audioActivityEvt.isActive = evt.isActive;
                    this.dispatchEvent(audioActivityEvt);
                });
                this.sourceList.push(source);
            }
        }

        const source = this.sourceLookup[userID];
        if (!source) {
            console.warn(`no audio for user ${userID}`);
        }
        return source;
    }

    setUserPosition(evt) {
        const source = this.getSource(evt.id);
        if (!!source) {
            source.setPosition(evt);
        }
    }

    setLocalPosition(evt) {
        this.destination.setPosition(evt);
    }

    setAudioProperties(evt) {
        this.origin = evt.origin;

        this.destination.setProperties(evt);

        for (let source of sourceList) {
            source.panner.refDistance = destination.minDistance;
            source.panner.rolloffFactor = destination.rolloff;
        }
    }
}