function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

function project(v, min, max) {
    return (v - min) / (max - min);
}

class BasePosition {
    get x() {
        throw new Error("Not implemented in base class.");
    }

    get y() {
        throw new Error("Not implemented in base class.");
    }

    setTarget(evt, t, dt) {
        throw new Error("Not implemented in base class.");
    }

    update(t) {
    }
}

class InterpolatedPosition extends BasePosition {

    constructor() {
        super();

        this._st
            = this._et
            = 0;
        this._x
            = this._tx
            = this._sx
            = 0;
        this._y
            = this._ty
            = this._sy
            = 0;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    setTarget(evt, t, dt) {
        this._st = t;
        this._et = t + dt;
        this._sx = this._x;
        this._sy = this._y;
        this._tx = evt.x;
        this._ty = evt.y;
    }

    update(t) {
        const p = project(t, this._st, this._et);
        if (p <= 1) {
            const deltaX = this._tx - this._sx,
                deltaY = this._ty - this._sy;
            this._x = this._sx + p * deltaX;
            this._y = this._sy + p * deltaY;
        }
    }
}

class WebAudioOldListenerPosition extends InterpolatedPosition {
    constructor(listener) {
        super();
        this.listener = listener;
        this.listener.setPosition(0, 0, 0);
        this.listener.setOrientation(0, 0, -1, 0, 1, 0);
    }

    update(t) {
        super.update(t);
        this.listener.setPosition(this.x, 0, this.y);
    }
}

class WebAudioNodePosition extends BasePosition {
    constructor(node) {
        super();

        this.node = node;
        this.node.positionX.setValueAtTime(0, 0);
        this.node.positionY.setValueAtTime(0, 0);
        this.node.positionZ.setValueAtTime(0, 0);
    }

    get x() {
        return this.node.positionX.value;
    }

    get y() {
        return this.node.positionZ.value;
    }

    setTarget(evt, t, dt) {
        const time = t + dt;
        // our 2D position is in X/Y coords, but our 3D position
        // along the horizontal plane is X/Z coords.
        this.node.positionX.linearRampToValueAtTime(evt.x, time);
        this.node.positionZ.linearRampToValueAtTime(evt.y, time);
    }
}

class WebAudioNewListenerPosition extends WebAudioNodePosition {
    constructor(node) {
        super(node);
        this.node.forwardX.setValueAtTime(0, 0);
        this.node.forwardY.setValueAtTime(0, 0);
        this.node.forwardZ.setValueAtTime(-1, 0);
        this.node.upX.setValueAtTime(0, 0);
        this.node.upY.setValueAtTime(1, 0);
        this.node.upZ.setValueAtTime(0, 0);
    }
}

class MockAudioContext {
    constructor() {
        this._t = Date.now() / 1000;
    }
    get currentTime() {
        return Date.now() / 1000 - this._t;
    }
}

class BaseSpatializer extends EventTarget {
    constructor(userID, destination, audio, position) {
        super();

        this.id = userID;
        this.destination = destination;
        this.audio = audio;
        this.position = position;
        this.volume = 1;
        this.pan = 0;
    }

    dispose() {
        this.audio.pause();

        this.position = null;
        this.audio = null;
        this.destination = null;
        this.id = null;
    }

    update() {
        this.position.update(this.destination.audioContext.currentTime);

        const lx = this.destination.position.x,
            ly = this.destination.position.y,
            distX = this.position.x - lx,
            distY = this.position.y - ly,
            dist = Math.sqrt(distX * distX + distY * distY);

        this.volume = 1 - clamp(project(dist, this.destination.minDistance, this.destination.maxDistance), 0, 1);
        this.pan = dist > 0
            ? distX / dist
            : 0;
    }

    setTarget(evt) {
        this.position.setTarget(evt, this.destination.audioContext.currentTime, this.destination.transitionTime);
    }
}

class VolumeOnlySpatializer extends BaseSpatializer {

    constructor(userID, destination, audio) {
        super(userID, destination, audio, new InterpolatedPosition());
        this.audio.play();

        Object.seal(this);
    }

    update() {
        super.update();
        this.audio.volume = this.volume;
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

class BaseWebAudioSpatializer extends BaseSpatializer {

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

class FullSpatializer extends BaseWebAudioSpatializer {

    constructor(userID, destination, audio, bufferSize) {
        const panner = destination.audioContext.createPanner(),
            position = new WebAudioNodePosition(panner);
        super(userID, destination, audio, position, bufferSize, panner);

        this.inNode.panningModel = "HRTF";
        this.inNode.distanceModel = "inverse";
        this.inNode.refDistance = destination.minDistance;
        this.inNode.rolloffFactor = destination.rolloff;
        this.inNode.coneInnerAngle = 360;
        this.inNode.coneOuterAngle = 0;
        this.inNode.coneOuterGain = 0;
        this.wasMuted = false;

        Object.seal(this);
    }

    update() {
        super.update();

        if (this.inNode.refDistance !== this.destination.minDistance) {
            this.inNode.refDistance = this.destination.minDistance;
        }

        if (this.inNode.rolloffFactor !== this.destination.rolloff) {
            this.inNode.rolloffFactor = this.destination.rolloff;
        }

        const muted = this.volume <= 0;

        if (!!this.source && muted !== this.wasMuted) {
            this.wasMuted = muted;
            if (muted) {
                this.source.disconnect(this.inNode);
            }
            else {
                this.source.connect(this.inNode);
            }
        }
    }
}

class StereoSpatializer extends BaseWebAudioSpatializer {

    constructor(userID, destination, audio, bufferSize) {
        super(userID, destination, audio, new InterpolatedPosition(), bufferSize,
            destination.audioContext.createStereoPanner(),
            destination.audioContext.createGain());

        Object.seal(this);
    }

    update() {
        super.update();
        this.inNode.pan.value = this.pan;
        this.outNode.gain.value = this.volume;
    }
}

/* global window, AudioListener, AudioContext, Event, EventTarget */

const contextDestroyingEvt = new Event("contextDestroying"),
    contextDestroyedEvt = new Event("contextDestroyed");

let hasWebAudioAPI = window.hasOwnProperty("AudioListener"),
    hasFullSpatializer = hasWebAudioAPI && window.hasOwnProperty("PannerNode"),
    isLatestWebAudioAPI = hasWebAudioAPI && AudioListener.prototype.hasOwnProperty("positionX");

class Destination extends EventTarget{

    constructor() {
        super();

        this.minDistance = 1;
        this.maxDistance = 10;
        this.rolloff = 1;
        this.transitionTime = 0.125;

        this.createContext();
    }

    createContext() {
        if (!this.audioContext) {
            try {
                if (hasWebAudioAPI) {
                    this.audioContext = new AudioContext();
                    try {
                        if (isLatestWebAudioAPI) {
                            this.position = new WebAudioNewListenerPosition(this.audioContext.listener);
                        }
                    }
                    catch (exp2) {
                        isLatestWebAudioAPI = false;
                        console.warn("No AudioListener.positionX property!", exp2);
                    }
                    finally {
                        if (!isLatestWebAudioAPI) {
                            this.position = new WebAudioOldListenerPosition(this.audioContext.listener);
                        }
                    }
                }
            }
            catch (exp1) {
                hasWebAudioAPI = false;
                console.warn("No WebAudio API!", exp1);
            }
            finally {
                if (!hasWebAudioAPI) {
                    this.audioContext = new MockAudioContext();
                    this.position = new InterpolatedPosition();
                }
            }
        }
    }

    setTarget(evt) {
        this.position.setTarget(evt, this.audioContext.currentTime, this.transitionTime);
    }

    setAudioProperties(evt) {
        this.minDistance = evt.minDistance;
        this.maxDistance = evt.maxDistance;
        this.transitionTime = evt.transitionTime;
        this.rolloff = evt.rolloff;
    }

    update() {
        this.position.update(this.audioContext.currentTime);
    }

    createSpatializer(userID, audio, bufferSize) {
        try {
            if (hasWebAudioAPI) {
                try {
                    if (hasFullSpatializer) {
                        return new FullSpatializer(userID, this, audio, bufferSize);
                    }
                }
                catch (exp2) {
                    hasFullSpatializer = false;
                    console.warn("No 360 spatializer support", exp2);
                }
                finally {
                    if (!hasFullSpatializer) {
                        return new StereoSpatializer(userID, this, audio, bufferSize);
                    }
                }
            }
        }
        catch (exp1) {
            hasWebAudioAPI = false;
            if (this.audioContext) {
                this.dispatchEvent(contextDestroyingEvt);
                this.audioContext.close();
                this.audioContext = null;
                this.position = null;
                this.dispatchEvent(contextDestroyedEvt);
            }
            console.warn("No WebAudio API!", exp1);
        }
        finally {
            if (!hasWebAudioAPI) {
                return new VolumeOnlySpatializer(userID, this, audio);
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

        this.onAudioActivity = (evt) => {
            audioActivityEvt$1.id = evt.id;
            audioActivityEvt$1.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt$1);
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

            this.sourceList.splice(0);
        });

        this.destination.addEventListener("contextDestroyed", () => {
            this.destination.createContext();

            for (let recreate of recreationQ) {
                const source = this.createSource(recreate.id, recreate.audio);
                source.setTarget(recreate);
            }
            recreationQ.splice(0);
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
                this.sourceList.splice(sourceIdx, 1);
            }

            source.dispose();
            this.sourceLookup.delete(evt.id);
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
                    origin = evt.value.origin;
                    console.log(origin);
                }
            }
        }
        catch (exp) {
            console.error(exp);
        }
    }
});
