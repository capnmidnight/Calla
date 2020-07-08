import { Destination } from "./Destination.js";
import { BaseAudioClient } from "./BaseAudioClient.js";
import { WorkerTimer } from "../timers/WorkerTimer.js";

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
        this.sources = new Map();

        /** @type {BaseSpatializer[]} */
        this.sourceList = [];

        this.destination = new Destination();

        /** @type {Event[]} */
        const recreationQ = [];

        this.destination.addEventListener("contextDestroying", () => {
            for (let source of this.sources.values()) {
                source.removeEventListener("audioActivity", this.onAudioActivity);
                recreationQ.push({
                    id: source.id,
                    x: source.position.x,
                    y: source.position.y,
                    audio: source.audio
                });

                source.dispose();
            }

            this.sources.clear();
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

        this.timer = new WorkerTimer(250);
        this.timer.addEventListener("tick", () => {
            this.destination.update();
            for (let source of this.sources.values()) {
                source.update();
            }
        });

        Object.seal(this);
    }

    start() {
        this.destination.createContext();
        this.timer.start();
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
        this.sources.set(userID, source);
        return source;
    }

    setAudioOutputDevice(deviceID) {
        for (let source of this.sources.values()) {
            source.setAudioOutputDevice(deviceID);
        }
    }

    /**
     *
     * @param {string} userID
     */
    removeSource(userID) {
        if (this.sources.has(userID)) {
            const source = this.sources.get(userID);
            source.dispose();
            this.sources.delete(userID);
        }
    }

    setUserPosition(evt) {
        if (this.sources.has(evt.id)) {
            const source = this.sources.get(evt.id);
            source.setTarget(evt);
        }
    }

    setLocalPosition(evt) {
        this.destination.setTarget(evt);
    }

    setAudioProperties(evt) {
        this.destination.setAudioProperties(evt);
    }
}