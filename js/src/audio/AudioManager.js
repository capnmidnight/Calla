import { Destination } from "./Destination.js";
import { BaseAudioClient } from "./BaseAudioClient.js";
import { WorkerTimer as Timer } from "../timers/WorkerTimer.js";
//import { RequestAnimationFrameTimer as Timer } from "../timers/RequestAnimationFrameTimer.js";
import { BaseTimer } from "../timers/BaseTimer.js";
//import { SetIntervalTimer as Timer } from "../timers/SetIntervalTimer.js";
//import { SetTimeoutTimer as Timer } from "../timers/SetTimeoutTimer.js";

const BUFFER_SIZE = 1024,
    audioActivityEvt = Object.assign(new Event("audioActivity", {
        id: null,
        isActive: false
    }));


export class AudioManager extends BaseAudioClient {
    constructor() {
        super();

        this.onAudioActivity = (evt) => {
            audioActivityEvt.id = evt.id;
            audioActivityEvt.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt);
        };

        /** @type {Map.<string, BaseSpatializer>} */
        this.sourceLookup = new Map();

        /** @type {BaseSpatializer[]} */
        this.sourceList = [];

        this.destination = new Destination();

        /** @type {Event[]} */
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
            this.timer.stop();
            this.destination.createContext();

            for (let recreate of recreationQ) {
                const source = this.createSource(recreate.id, recreate.audio);
                source.setTarget(recreate);
            }
            recreationQ.clear();
            this.timer.start();
        });

        /** @type {BaseTimer} */
        this.timer = new Timer(250);
        this.timer.addEventListener("tick", () => {
            this.destination.update();
            for (let source of this.sourceList) {
                source.update();
            }
        });
        this.timer.start();

        Object.seal(this);
    }

    start() {
        this.destination.createContext();
    }

    /**
     * 
     * @param {string} userID
     * @return {BaseSpatializer}
     */
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

    /**
     *
     * @param {string} userID
     * @param {HTMLAudioElement} audio
     * @return {BaseSpatializer}
     */
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