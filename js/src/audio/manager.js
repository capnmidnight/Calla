import { Source } from "./source.js";
import { Destination } from "./destination.js";

const BUFFER_SIZE = 1024,
    audioActivityEvt = Object.assign(new Event("audioActivity", {
        id: null,
        isActive: false
    }));

function updater() {
    requestAnimationFrame(updater);
    destination.update();
    for (let source of sourceList) {
        source.update();
    }
}

export class Manager extends EventTarget {
    constructor() {
        super();
        this.sourceLookup = {};
        this.sourceList = [];
        this.destination = null;
    }

    ensureDestination() {
        if (this.destination === null) {
            this.destination = new Destination();
            requestAnimationFrame(updater);
            window.destination = this.destination;
        }

        return this.destination;
    }


    getSource(userID) {
        if (!this.sourceLookup[userID]) {
            const elementID = `#participant_${userID} audio`,
                audio = document.querySelector(elementID);

            if (!!audio) {
                const source = this.sourceLookup[userID] = new Source(userID, audio, this.ensureDestination(), BUFFER_SIZE);
                source.addEventListener("audioActivity", (evt) => {
                    audioActivityEvt.id = evt.id;
                    audioActivityEvt.isActive = evt.isActive;
                    this.dispatchEvent(audioActivityEvt);
                });
                sourceList.push(source);
            }
        }

        const user = sourceLookup[userID];
        if (!user) {
            console.warn(`no audio for user ${userID}`);
        }
        return user;
    }

    setUserPosition(evt) {
        const source = this.getSource(evt.id);
        if (!!source) {
            source.setPosition(evt);
        }
    }

    setLocalPosition(evt) {
        this.ensureDestination()
            .setPosition(evt);
    }

    setAudioProperties(evt) {
        origin = evt.origin;

        this.ensureDestination()
            .setProperties(evt);

        for (let user of sourceList) {
            user.panner.refDistance = destination.minDistance;
            user.panner.rolloffFactor = destination.rolloff;
        }
    }
}