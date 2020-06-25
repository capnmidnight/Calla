function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

function project(v, min, max) {
    return (v - min) / (max - min);
}

class BaseSpatializer {

    constructor(destination, audio, analyser, drain) {
        this.destination = destination;
        this.audio = audio;
        this.analyser = analyser;
        this.node = drain;
        this.node.connect(this.destination.audioContext.destination);
        this.source = null;
    }

    checkStream() {
        if (!this.source) {
            try {
                const stream = !!this.audio.mozCaptureStream
                    ? this.audio.mozCaptureStream()
                    : this.audio.captureStream();

                this.source = this.destination.audioContext.createMediaStreamSource(stream);
                this.source.connect(this.analyser);
                this.source.connect(this.node);
            }
            catch (exp) {
                console.warn("Source isn't available yet. Will retry in a moment. Reason: ", exp);
                return false;
            }
        }

        return true;
    }

    dispose() {
        if (!!this.source) {
            this.source.disconnect(this.analyser);
            this.source.disconnect(this.node);
            this.source = null;
        }

        this.node.disconnect(this.destination.audioContext.destination);
        this.node = null;
        this.audio = null;
        this.destination = null;
    }

    update() {
    }

    setAudioProperties(evt) {
        throw new Error("Not implemented in base class.");
    }

    setPosition(evt) {
        throw new Error("Not implemented in base class.");
    }

    get positionX() {
        throw new Error("Not implemented in base class.");
    }

    get positionY() {
        throw new Error("Not implemented in base class.");
    }
}

class FullSpatializer extends BaseSpatializer {

    constructor(destination, audio, analyser) {
        super(destination, audio, analyser, destination.audioContext.createPanner());

        this.node.panningModel = "HRTF";
        this.node.distanceModel = "inverse";
        this.node.refDistance = destination.minDistance;
        this.node.rolloffFactor = destination.rolloff;
        this.node.coneInnerAngle = 360;
        this.node.coneOuterAngle = 0;
        this.node.coneOuterGain = 0;
        this.node.positionY.setValueAtTime(0, this.destination.audioContext.currentTime);
        this.wasMuted = false;
    }

    setAudioProperties(evt) {
        this.node.refDistance = evt.minDistance;
        this.node.rolloffFactor = evt.rolloff;
    }

    setPosition(evt) {
        const time = this.destination.audioContext.currentTime + this.destination.transitionTime;
        // our 2D position is in X/Y coords, but our 3D position
        // along the horizontal plane is X/Z coords.
        this.node.positionX.linearRampToValueAtTime(evt.x, time);
        this.node.positionZ.linearRampToValueAtTime(evt.y, time);
    }

    get positionX() {
        return this.node.positionX.value;
    }

    get positionY() {
        return this.node.positionZ.value;
    }

    update() {
        if (!!this.source) {
            const lx = this.destination.positionX,
                ly = this.destination.positionY,
                distX = this.positionX - lx,
                distY = this.positionY - ly,
                dist = Math.sqrt(distX * distX + distY * distY),
                range = clamp(project(dist, this.destination.minDistance, this.destination.maxDistance), 0, 1),
                muted = range >= 1;

            if (muted !== this.wasMuted) {
                this.wasMuted = muted;
                if (muted) {
                    this.source.disconnect(this.node);
                }
                else {
                    this.source.connect(this.node);
                }
            }
        }
    }
}

const audioActivityEvt = Object.assign(new Event("audioActivity", {
    id: null,
    isActive: false
})),
    activityCounterMin = 0,
    activityCounterMax = 60,
    activityCounterThresh = 5;

function frequencyToIndex(frequency, sampleRate, bufferSize) {
    var nyquist = sampleRate / 2;
    var index = Math.round(frequency / nyquist * bufferSize);
    return clamp(index, 0, bufferSize)
}

function analyserFrequencyAverage(analyser, frequencies, minHz, maxHz, bufferSize) {
    const sampleRate = analyser.context.sampleRate,
        start = frequencyToIndex(minHz, sampleRate, bufferSize),
        end = frequencyToIndex(maxHz, sampleRate, bufferSize),
        count = end - start;
    let sum = 0;
    for (let i = start; i < end; ++i) {
        sum += frequencies[i];
    }
    return count === 0 ? 0 : (sum / count);
}

class Source extends EventTarget {
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

    update() {
        if (this.spatializer.checkStream()) {
            this.spatializer.update();

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

const isOldAudioAPI = !AudioListener.prototype.hasOwnProperty("positionX");

class Destination {
    constructor() {
        this.audioContext = new AudioContext();
        this.listener = this.audioContext.listener;

        this.minDistance = 1;
        this.maxDistance = 10;
        this.rolloff = 1;
        this.transitionTime = 0.125;

        if (isOldAudioAPI) {
            this.startMoveTime
                = this.endMoveTime
                = 0;

            this.listenerX
                = this.targetListenerX
                = this.startListenerX
                = 0;

            this.listenerY
                = this.targetListenerY
                = this.startListenerY
                = 0;

            this.listener.setPosition(0, 0, 0);
            this.listener.setOrientation(0, 0, -1, 0, 1, 0);
        }
        else {
            const time = this.audioContext.currentTime;
            this.listener.positionX.setValueAtTime(0, time);
            this.listener.positionY.setValueAtTime(0, time);
            this.listener.positionZ.setValueAtTime(0, time);
            this.listener.forwardX.setValueAtTime(0, time);
            this.listener.forwardY.setValueAtTime(0, time);
            this.listener.forwardZ.setValueAtTime(-1, time);
            this.listener.upX.setValueAtTime(0, time);
            this.listener.upY.setValueAtTime(1, time);
            this.listener.upZ.setValueAtTime(0, time);
        }
    }

    get positionX() {
        return isOldAudioAPI
            ? this.listenerX
            : this.audioContext.listener.positionX.value
    }

    get positionY() {
        return isOldAudioAPI
            ? this.listenerY
            : this.audioContext.listener.positionZ.value;
    }

    setPosition(evt) {
        const time = this.audioContext.currentTime + this.transitionTime;
        if (isOldAudioAPI) {
            this.startMoveTime = this.audioContext.currentTime;
            this.endMoveTime = time;
            this.startListenerX = this.listenerX;
            this.startListenerY = this.listenerY;
            this.targetListenerX = evt.x;
            this.targetListenerY = evt.y;
        }
        else {
            this.listener.positionX.linearRampToValueAtTime(evt.x, time);
            this.listener.positionZ.linearRampToValueAtTime(evt.y, time);
        }
    }

    setAudioProperties(evt) {
        this.minDistance = evt.minDistance;
        this.maxDistance = evt.maxDistance;
        this.transitionTime = evt.transitionTime;
        this.rolloff = evt.rolloff;
    }

    update() {
        if (isOldAudioAPI) {
            const time = this.audioContext.currentTime,
                p = project(time, this.startMoveTime, this.endMoveTime);

            if (p <= 1) {
                const deltaX = this.targetListenerX - this.startListenerX,
                    deltaY = this.targetListenerY - this.startListenerY;

                this.listenerX = this.startListenerX + p * deltaX;
                this.listenerY = this.startListenerY + p * deltaY;

                this.listener.setPosition(this.listenerX, 0, this.listenerY);
            }
        }
    }
}

const BUFFER_SIZE = 1024,
    audioActivityEvt$1 = Object.assign(new Event("audioActivity", {
        id: null,
        isActive: false
    }));


class AudioManager extends EventTarget {
    constructor() {
        super();
        this.sourceLookup = {};
        this.sourceList = [];
        this.destination = new Destination();

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
        if (!this.sourceLookup[userID]) {
            const elementID = `#participant_${userID} audio`,
                audio = document.querySelector(elementID);

            if (!!audio) {
                const source = this.sourceLookup[userID] = new Source(userID, audio, this.destination, BUFFER_SIZE);
                source.addEventListener("audioActivity", (evt) => {
                    audioActivityEvt$1.id = evt.id;
                    audioActivityEvt$1.isActive = evt.isActive;
                    this.dispatchEvent(audioActivityEvt$1);
                });
                this.sourceList.push(source);
            }
        }

        const source = this.sourceLookup[userID];
        if (!source) {
            console.warn(`no audio for user ${userID}`);
        }
        return source;
    }

    setUserPosition(evt) {
        const source = this.getSource(evt.id);
        if (!!source) {
            source.setPosition(evt);
        }
    }

    setLocalPosition(evt) {
        this.destination.setPosition(evt);
    }

    setAudioProperties(evt) {
        this.destination.setAudioProperties(evt);

        for (let source of this.sourceList) {
            source.setAudioProperties(evt);
        }
    }

    removeUser(evt) {
        const source = this.sourceLookup[evt.id];
        if (!!source) {
            const sourceIdx = this.sourceList.indexOf(source);
            if (sourceIdx > -1) {
                this.sourceList.splice(sourceIdx, 1);
            }

            source.dispose();
            delete this.sourceLookup[evt.id];
        }
    }
}

const FRONT_END_SERVER = "https://www.calla.chat",
    APP_FINGERPRINT = "Calla",
    manager = new AudioManager();

let origin = null;

manager.addEventListener("audioActivity", (evt) => {
    txJitsiHax("audioActivity", {
        id: evt.id,
        isActive: evt.isActive
    });
});

function txJitsiHax(command, value) {
    if (origin !== null) {
        const evt = {
            hax: APP_FINGERPRINT,
            command,
            value
        };
        window.parent.postMessage(JSON.stringify(evt), origin);
    }
}

window.addEventListener("message", (msg) => {
    const isLocalHost = msg.origin.match(/^https?:\/\/localhost\b/);

    if (msg.origin === FRONT_END_SERVER
        ||  isLocalHost) {
        try {
            const evt = JSON.parse(msg.data),
                isJitsiHax = evt.hax === APP_FINGERPRINT;

            if (isJitsiHax && !!manager[evt.command]) {
                manager[evt.command](evt.value);
                if (evt.command === "setAudioProperties") {
                    origin = evt.origin;
                }
            }
        }
        catch (exp) {
            console.error(exp);
        }
    }
});
