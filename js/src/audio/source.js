import { clamp, project } from "../math.js";
import { FullSpatializer } from "./FullSpatializer.js";

const audioActivityEvt = Object.assign(new Event("audioActivity", {
    id: null,
    isActive: false
})),
    activityCounterMin = 0,
    activityCounterMax = 60,
    activityCounterThresh = 5;

function frequencyToIndex(frequency, sampleRate, bufferSize) {
    var nyquist = sampleRate / 2
    var index = Math.round(frequency / nyquist * bufferSize)
    return clamp(index, 0, bufferSize)
}

function analyserFrequencyAverage(analyser, frequencies, minHz, maxHz, bufferSize) {
    const sampleRate = analyser.context.sampleRate,
        start = frequencyToIndex(minHz, sampleRate, bufferSize),
        end = frequencyToIndex(maxHz, sampleRate, bufferSize),
        count = end - start
    let sum = 0
    for (let i = start; i < end; ++i) {
        sum += frequencies[i];
    }
    return count === 0 ? 0 : (sum / count);
}

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

        this.bufferSize = bufferSize;
        this.buffer = new Float32Array(this.bufferSize);

        this.analyser = this.destination.audioContext.createAnalyser();
        this.analyser.fftSize = 2 * this.bufferSize;
        this.analyser.smoothingTimeConstant = 0.2;

        this.spatializer = new FullSpatializer(this.destination, this.audio, this.analyser);

        Object.seal(this);
    }

    dispose() {
        this.spatializer.dispose();
        this.audio.pause();

        this.spatializer = null;
        this.destination = null;
        this.audio = null;
        this.analyser = null;
        this.buffer = null;
    }

    setAudioProperties(evt) {
        this.spatializer.setAudioProperties(evt);
    }

    setPosition(evt) {
        this.spatializer.setPosition(evt);
    }

    isAudible() {
        const
            lx = this.destination.positionX,
            ly = this.destination.positionY,
            distX = this.spatializer.positionX - lx,
            distY = this.spatializer.positionY - ly,
            dist = Math.sqrt(distX * distX + distY * distY),
            range = clamp(project(dist, this.destination.minDistance, this.destination.maxDistance), 0, 1);

        return range < 1;
    }

    update() {
        if (this.spatializer.checkStream()) {
            this.spatializer.muted = !this.isAudible();

            this.analyser.getFloatFrequencyData(this.buffer);

            const average = 1.1 + analyserFrequencyAverage(this.analyser, this.buffer, 85, 255, this.bufferSize) / 100;
            if (average >= 0.5 && this.activityCounter < activityCounterMax) {
                this.activityCounter++;
            } else if (average < 0.5 && this.activityCounter > activityCounterMin) {
                this.activityCounter--;
            }

            const isActive = this.activityCounter > activityCounterThresh;
            if (this.wasActive !== isActive) {
                this.wasActive = isActive;
                audioActivityEvt.id = this.id;
                audioActivityEvt.isActive = isActive;
                this.dispatchEvent(audioActivityEvt);
            }
        }
    }
}