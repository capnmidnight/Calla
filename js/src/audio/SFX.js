import { Audio, Source } from "../html/tags.js";
import { controls, src } from "../html/attrs.js";


export class SFX extends EventTarget {
    constructor() {
        super();

        /** @type {Map.<string, Audio>} */
        this.clips = new Map();
    }

    /**
     * @param {string} name
     * @param {string[]} paths
     * @returns {SFX}
     */
    add(name, ...paths) {
        const sources = paths
            .map((p) => src(p))
            .map((s) => Source(s));
        const elem = Audio(
            controls(false),
            ...sources);

        this.clips.set(name, elem);
        return this;
    }

    /**
     * @param {string} name
     */
    play(name, volume = 1) {
        if (this.clips.has(name)) {
            const clip = this.clips.get(name);
            clip.volume = volume;
            clip.play();
        }
    }
}