import { clamp, project } from "../math.js";

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
        this.audioContext = destination.audioContext;

        this.bufferSize = bufferSize;

        this.audio = audio;
        this.audio.volume = 0;

        this.panner = this.audioContext.createPanner();
        this.panner.panningModel = "HRTF";
        this.panner.distanceModel = "inverse";
        this.panner.refDistance = destination.minDistance;
        this.panner.rolloffFactor = destination.rolloff;
        this.panner.coneInnerAngle = 360;
        this.panner.coneOuterAngle = 0;
        this.panner.coneOuterGain = 0;
        this.panner.positionY.setValueAtTime(0, this.audioContext.currentTime);
        this.panner.connect(this.audioContext.destination);

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2 * this.bufferSize;
        this.analyser.smoothingTimeConstant = 0.2;

        this.buffer = new Float32Array(this.bufferSize);

        this.source = null;

        Object.seal(this);
    }

    dispose() {
        if (!!this.source) {
            this.source.disconnect(this.analyser);
            this.source.disconnect(this.panner);
            this.source = null;
        }

        this.panner.disconnect(this.audioContext.destination);
        this.audio.pause();

        this.destination = null;
        this.audioContext = null;
        this.audio = null;
        this.panner = null;
        this.analyser = null;
        this.buffer = null;
    }

    setAudioProperties(evt) {
        this.panner.refDistance = evt.minDistance;
        this.panner.rolloffFactor = evt.rolloff;
    }

    setPosition(evt) {
        const time = this.audioContext.currentTime + this.destination.transitionTime;
        // our 2D position is in X/Y coords, but our 3D position
        // along the horizontal plane is X/Z coords.
        this.panner.positionX.linearRampToValueAtTime(evt.x, time);
        this.panner.positionZ.linearRampToValueAtTime(evt.y, time);
    }

    isAudible() {
        const
            lx = this.destination.positionX,
            ly = this.destination.positionY,
            distX = this.panner.positionX.value - lx,
            distZ = this.panner.positionZ.value - ly,
            dist = Math.sqrt(distX * distX + distZ * distZ),
            range = clamp(project(dist, this.destination.minDistance, this.destination.maxDistance), 0, 1);

        return range < 1;
    }

    update() {
        if (!this.source) {
            try {
                const stream = !!this.audio.mozCaptureStream
                    ? this.audio.mozCaptureStream()
                    : this.audio.captureStream();

                this.source = this.audioContext.createMediaStreamSource(stream);
                this.source.connect(this.analyser);
                this.source.connect(this.panner);
            }
            catch (exp) {
                console.warn("Source isn't available yet. Will retry in a moment. Reason: ", exp);
            }
        }
        else {
            const audible = this.isAudible();
            if (audible !== this.lastAudible) {
                this.lastAudible = audible;
                if (audible) {
                    this.source.connect(this.panner);
                }
                else {
                    this.source.disconnect(this.panner);
                }
            }

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