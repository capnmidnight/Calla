import { Destination } from "./Destination.js";

const BUFFER_SIZE = 1024,
    audioActivityEvt = Object.assign(new Event("audioActivity", {
        id: null,
        isActive: false
    }));


export class AudioManager extends EventTarget {
    constructor() {
        super();

        this.onAudioActivity = (evt) => {
            audioActivityEvt.id = evt.id;
            audioActivityEvt.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt);
        };

        this.sourceLookup = new Map();
        this.sourceList = [];
        this.destination = new Destination();
        const recreationQ = [];
        this.destination.addEventListener("contextDestroying", () => {
            for (let source of this.sourceList) {
                source.removeEventListener("audioActivity", this.onAudioActivity);
                recreationQ.push({
                    id: source.id,
                    x: source.position.x,
                    y: source.position.y,
                    audio: source.audio
                });

                this.sourceLookup.delete(source.id);

                source.dispose();
            }

            this.sourceList.clear();
        });

        this.destination.addEventListener("contextDestroyed", () => {
            this.destination.createContext();

            for (let recreate of recreationQ) {
                const source = this.createSource(recreate.id, recreate.audio);
                source.setTarget(recreate);
            }
            recreationQ.clear();
        });

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
        if (!this.sourceLookup.has(userID)) {
            const elementID = `#participant_${userID} audio`,
                audio = document.querySelector(elementID);

            if (!!audio) {
                this.createSource(userID, audio);
            }
        }

        const source = this.sourceLookup.get(userID);
        if (!source) {
            console.warn(`no audio for user ${userID}`);
        }
        return source;
    }

    createSource(userID, audio) {
        const source = this.destination.createSpatializer(userID, audio, BUFFER_SIZE);
        source.addEventListener("audioActivity", this.onAudioActivity);
        this.sourceList.push(source);
        this.sourceLookup.set(userID, source);
        return source;
    }

    setUserPosition(evt) {
        const source = this.getSource(evt.id);
        if (!!source) {
            source.setTarget(evt);
        }
    }

    setLocalPosition(evt) {
        this.destination.setTarget(evt);
    }

    setAudioProperties(evt) {
        this.destination.setAudioProperties(evt);
    }

    removeUser(evt) {
        if (this.sourceLookup.has(evt.id)) {
            const source = this.sourceLookup.get(evt.id),
                sourceIdx = this.sourceList.indexOf(source);

            if (sourceIdx > -1) {
                this.sourceList.removeAt(sourceIdx);
            }

            source.dispose();
            this.sourceLookup.delete(evt.id);
        }
    }
}