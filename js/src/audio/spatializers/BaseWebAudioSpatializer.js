import { BaseSpatializer } from "./BaseSpatializer.js";
import { clamp } from "../../math.js";

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

export class BaseWebAudioSpatializer extends BaseSpatializer {

    constructor(userID, destination, audio, position, bufferSize, inNode, outNode) {
        super(userID, destination, audio, position);

        this.audio.volume = 0;

        this.bufferSize = bufferSize;
        this.buffer = new Float32Array(this.bufferSize);

        this.analyser = this.destination.audioContext.createAnalyser();
        this.analyser.fftSize = 2 * this.bufferSize;
        this.analyser.smoothingTimeConstant = 0.2;

        this.inNode = inNode;

        this.outNode = outNode || inNode;
        this.outNode.connect(this.destination.audioContext.destination);

        if (this.inNode !== this.outNode) {
            this.inNode.connect(this.outNode);
        }

        this.wasActive = false;
        this.lastAudible = true;
        this.activityCounter = 0;

        this.stream = null;
        this.source = null;
    }

    mute() {
        this.outNode.disconnect(this.destination.audioContext.destination);
    }

    unmute() {
        this.outNode.connect(this.destination.audioContext.destination);
    }

    update() {
        super.update();

        if (!this.source) {
            try {
                if (!this.stream) {
                    this.stream = !!this.audio.mozCaptureStream
                        ? this.audio.mozCaptureStream()
                        : this.audio.captureStream();
                }

                if (this.stream.active) {
                    this.source = this.destination.audioContext.createMediaStreamSource(this.stream);
                    this.source.connect(this.analyser);
                    this.source.connect(this.inNode);
                }
            }
            catch (exp) {
                console.warn("Source isn't available yet. Will retry in a moment. Reason: ", exp);
            }
        }

        if (!!this.source) {
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

    dispose() {
        if (!!this.source) {
            this.source.disconnect(this.analyser);
            this.source.disconnect(this.inNode);
        }

        this.outNode.disconnect(this.destination.audioContext.destination);

        if (this.inNode !== this.outNode) {
            this.inNode.disconnect(this.outNode);
        }

        this.source = null;
        this.stream = null;
        this.outNode = null;
        this.inNode = null;
        this.analyser = null;
        this.buffer = null;

        super.dispose();
    }
}