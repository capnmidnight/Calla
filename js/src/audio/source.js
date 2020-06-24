import { clamp } from "../math.js";

const audioActivityEvt = Object.assign(new Event("audioActivity", {
    id: null,
    isActive: false
})),
    activityCounterMin = 0,
    activityCounterMax = 60,
    activityCounterThresh = 5;

function frequencyToIndex(frequency, sampleRate) {
    var nyquist = sampleRate / 2
    var index = Math.round(frequency / nyquist * BUFFER_SIZE)
    return clamp(index, 0, BUFFER_SIZE)
}

function analyserFrequencyAverage(analyser, frequencies, minHz, maxHz) {
    const sampleRate = analyser.context.sampleRate,
        start = frequencyToIndex(minHz, sampleRate),
        end = frequencyToIndex(maxHz, sampleRate),
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

        this.audio = audio;
        this.destination = destination;
        this.audioContext = destination.audioContext;

        const stream = !!audio.mozCaptureStream
            ? audio.mozCaptureStream()
            : audio.captureStream();

        this.source = this.audioContext.createMediaStreamSource(stream);
        this.panner = this.audioContext.createPanner();
        this.analyser = this.audioContext.createAnalyser();
        this.buffer = new Float32Array(bufferSize);

        this.audio.volume = 0;

        this.panner.panningModel = "HRTF";
        this.panner.distanceModel = "inverse";
        this.panner.refDistance = destination.minDistance;
        this.panner.rolloffFactor = destination.rolloff;
        this.panner.coneInnerAngle = 360;
        this.panner.coneOuterAngle = 0;
        this.panner.coneOuterGain = 0;

        this.panner.positionY.setValueAtTime(0, this.audioContext.currentTime);

        this.analyser.fftSize = 2 * bufferSize;
        this.analyser.smoothingTimeConstant = 0.2;


        this.source.connect(this.analyser);
        this.source.connect(this.panner);
        this.panner.connect(this.audioContext.destination);
    }

    setPosition(evt) {
        const time = this.audioContext.currentTime + this.destination.transitionTime;
        // our 2D position is in X/Y coords, but our 3D position
        // along the horizontal plane is X/Z coords.
        this.panner.positionX.linearRampToValueAtTime(evt.data.x, time);
        this.panner.positionZ.linearRampToValueAtTime(evt.data.y, time);
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

        const average = 1.1 + analyserFrequencyAverage(this.analyser, this.buffer, 85, 255) / 100;
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