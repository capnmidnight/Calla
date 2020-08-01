import { EventBase } from "../events/EventBase.js";
import { controls, playsInline, src } from "../html/attrs.js";
import { Audio, Source } from "../html/tags.js";

/**
 * A sound effects palette.
 **/
export class SFX extends EventBase {

    /**
     * Creates a new sound effects palette.
     * 
     * NOTE: sound effects are not spatialized.
     **/
    constructor() {
        super();

        /** @type {Map.<string, Audio>} */
        this.clips = new Map();

        Object.seal(this);
    }

    /**
     * Creates a new sound effect from a series of fallback paths
     * for media files.
     * @param {string} name - the name of the sound effect, to reference when executing playback.
     * @param {string[]} paths - a series of fallback paths for loading the media of the sound effect.
     * @returns {SFX}
     */
    add(name, ...paths) {
        const sources = paths
            .map((p) => src(p))
            .map((s) => Source(s));

        const elem = Audio(
            controls(false),
            playsInline,
            ...sources);

        this.clips.set(name, elem);
        return this;
    }

    /**
     * Plays a named sound effect.
     * @param {string} name - the name of the effect to play.
     * @param {number} [volume=1] - the volume at which to play the effect.
     */
    play(name, volume = 1) {
        if (this.clips.has(name)) {
            const clip = this.clips.get(name);
            clip.volume = volume;
            clip.play();
        }
    }
}