class MockAudioContext {
    constructor() {
        this._t = performance.now() / 1000;
    }

    get currentTime() {
        return performance.now() / 1000 - this._t;
    }

    /** @type {AudioDestinationNode} */
    get destination() {
        return null;
    }
}

function isGoodNumber(v) {
    return v !== null
        && v !== undefined
        && (typeof (v) === "number"
            || v instanceof Number)
        && !Number.isNaN(v);
}

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

/**
 * 
 * @param {number} a
 * @param {number} b
 * @param {number} p
 * @returns {number}
 */
function lerp(a, b, p) {
    return (1 - p) * a + p * b;
}

function project(v, min, max) {
    return (v - min) / (max - min);
}

class BasePosition {
    /** 
     *  The horizontal component of the position.
     *  @type {number} */
    get x() {
        throw new Error("Not implemented in base class.");
    }

    /** 
     *  The vertical component of the position.
     *  @type {number} */
    get y() {
        throw new Error("Not implemented in base class.");
    }

    /**
     * Set the target position
     * @param {Point} evt - the target position
     * @param {number} t - the current time, in seconds
     * @param {number} dt - the amount of time to take to transition, in seconds
     */
    setTarget(evt, t, dt) {
        throw new Error("Not implemented in base class.");
    }

    /**
     * Update the position.
     * @param {number} t - the current time, in seconds
     */
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

    /** @type {number} */
    get x() {
        return this._x;
    }

    /** @type {number} */
    get y() {
        return this._y;
    }

    /**
     * 
     * @param {UserPosition} evt
     * @param {number} t
     * @param {number} dt
     */
    setTarget(evt, t, dt) {
        this._st = t;
        this._et = t + dt;
        this._sx = this._x;
        this._sy = this._y;
        this._tx = evt.x;
        this._ty = evt.y;
    }

    /**
     * 
     * @param {number} t
     */
    update(t) {
        const p = project(t, this._st, this._et);
        if (p <= 1) {
            this._x = lerp(this._sx, this._tx, p);
            this._y = lerp(this._sy, this._ty, p);
        }
    }
}

class WebAudioOldListenerPosition extends InterpolatedPosition {

    /**
     * 
     * @param {AudioListener} listener
     */
    constructor(listener) {
        super();
        
        this.listener = listener;
        this.listener.setPosition(0, 0, 0);
        this.listener.setOrientation(0, 0, -1, 0, 1, 0);
    }

    /**
     * 
     * @param {number} t
     */
    update(t) {
        super.update(t);
        this.listener.setPosition(this.x, 0, this.y);
    }
}

class WebAudioNodePosition extends BasePosition {
    /**
     * 
     * @param {PannerNode|AudioListener} node
     * @param {boolean} forceInterpolation
     */
    constructor(node, forceInterpolation) {
        super();

        /** @type {BasePosition} */
        this._p = forceInterpolation ? new InterpolatedPosition() : null;
        this.node = node;
        this.node.positionX.setValueAtTime(0, 0);
        this.node.positionY.setValueAtTime(0, 0);
        this.node.positionZ.setValueAtTime(0, 0);
    }

    /** @type {number} */
    get x() {
        return this.node.positionX.value;
    }

    /** @type {number} */
    get y() {
        return this.node.positionZ.value;
    }

    /**
     *
     * @param {UserPosition} evt
     * @param {number} t
     * @param {number} dt
     */
    setTarget(evt, t, dt) {
        if (this._p) {
            this._p.setTarget(evt, t, dt);
        }
        else {
            const time = t + dt;
            // our 2D position is in X/Y coords, but our 3D position
            // along the horizontal plane is X/Z coords.
            this.node.positionX.linearRampToValueAtTime(evt.x, time);
            this.node.positionZ.linearRampToValueAtTime(evt.y, time);
        }
    }

    /**
     *
     * @param {number} t
     */
    update(t) {
        if (this._p) {
            this._p.update(t);
            this.node.positionX.linearRampToValueAtTime(this._p.x, 0);
            this.node.positionZ.linearRampToValueAtTime(this._p.y, 0);
        }
    }
}

class WebAudioNewListenerPosition extends WebAudioNodePosition {
    /**
     * 
     * @param {AudioListener} node
     * @param {boolean} forceInterpolation
     */
    constructor(node, forceInterpolation) {
        super(node, forceInterpolation);
        this.node.forwardX.setValueAtTime(0, 0);
        this.node.forwardY.setValueAtTime(0, 0);
        this.node.forwardZ.setValueAtTime(-1, 0);
        this.node.upX.setValueAtTime(0, 0);
        this.node.upY.setValueAtTime(1, 0);
        this.node.upZ.setValueAtTime(0, 0);
    }
}

/** Base class providing functionality for spatializers. */
class BaseSpatializer extends EventTarget {

    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {BasePosition} position
     */
    constructor(userID, destination, audio, position) {
        super();

        this.id = userID;
        this.destination = destination;
        this.audio = audio;
        this.position = position;
        this.volume = 1;
        this.pan = 0;
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        this.audio.pause();

        this.position = null;
        this.audio = null;
        this.destination = null;
        this.id = null;
    }

    /**
     * Run the position interpolation
     */
    update() {
        this.position.update(this.destination.audioContext.currentTime);

        const lx = this.destination.position.x,
            ly = this.destination.position.y,
            distX = this.position.x - lx,
            distY = this.position.y - ly,
            dist = Math.sqrt(distX * distX + distY * distY),
            projected = project(dist, this.destination.minDistance, this.destination.maxDistance);

        this.volume = 1 - clamp(projected, 0, 1);
        this.pan = dist > 0
            ? distX / dist
            : 0;
    }

    /**
     * Set the target position
     * @param {Point} evt
     */
    setTarget(evt) {
        this.position.setTarget(evt, this.destination.audioContext.currentTime, this.destination.transitionTime);
        this.update();
    }
}

class VolumeOnlySpatializer extends BaseSpatializer {

    /**
     *
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     */
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

/**
 * 
 * @param {number} frequency
 * @param {number} sampleRate
 * @param {number} bufferSize
 */
function frequencyToIndex(frequency, sampleRate, bufferSize) {
    var nyquist = sampleRate / 2;
    var index = Math.round(frequency / nyquist * bufferSize);
    return clamp(index, 0, bufferSize)
}

/**
 * 
 * @param {AnalyserNode} analyser
 * @param {Float32Array} frequencies
 * @param {number} minHz
 * @param {number} maxHz
 * @param {number} bufferSize
 */
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

    /**
     * 
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {BasePosition} position
     * @param {number} bufferSize
     * @param {PannerNode|StereoPannerNode} inNode
     * @param {GainNode=} outNode
     */
    constructor(userID, destination, audio, position, bufferSize, inNode, outNode) {
        super(userID, destination, audio, position);

        this.audio.volume = 0;

        this.bufferSize = bufferSize;
        this.buffer = new Float32Array(this.bufferSize);

        /** @type {AnalyserNode} */
        this.analyser = this.destination.audioContext.createAnalyser();
        this.analyser.fftSize = 2 * this.bufferSize;
        this.analyser.smoothingTimeConstant = 0.2;

        /** @type {PannerNode|StereoPannerNode} */
        this.inNode = inNode;

        this.outNode = outNode || inNode;
        this.outNode.connect(this.destination.audioContext.destination);

        if (this.inNode !== this.outNode) {
            this.inNode.connect(this.outNode);
        }

        /** @type {boolean} */
        this.wasActive = false;
        this.lastAudible = true;
        this.activityCounter = 0;

        /** @type {MediaStream} */
        this.stream = null;

        /** @type {MediaSource} */
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

    /**
     *
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     * @param {boolean} forceInterpolatedPosition
     */
    constructor(userID, destination, audio, bufferSize, forceInterpolatedPosition) {
        const panner = destination.audioContext.createPanner(),
            position = new WebAudioNodePosition(panner, forceInterpolatedPosition);
        super(userID, destination, audio, position, bufferSize, panner);

        this.inNode.panningModel = "HRTF";
        this.inNode.distanceModel = "inverse";
        this.inNode.refDistance = destination.minDistance;
        this.inNode.rolloffFactor = destination.rolloff;
        this.inNode.coneInnerAngle = 360;
        this.inNode.coneOuterAngle = 0;
        this.inNode.coneOuterGain = 0;

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
    }
}

class StereoSpatializer extends BaseWebAudioSpatializer {

    /**
     *
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     */
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

class GoogleResonanceAudioScene extends InterpolatedPosition {
    /**
     *
     * @param {AudioContext} audioContext
     */
    constructor(audioContext) {
        super();

        this.scene = new ResonanceAudio(audioContext, {
            ambisonicOrder: 3
        });
        this.scene.output.connect(audioContext.destination);

        this.position = new InterpolatedPosition();

        this.scene.setRoomProperties({
            width: 10,
            height: 5,
            depth: 10,
        }, {
            left: "transparent",
            right: "transparent",
            front: "transparent",
            back: "transparent",
            down: "grass",
            up: "transparent",
        });
    }

    update(t) {
        super.update(t);
        this.scene.setListenerPosition(this.x, 0, this.y);
    }
}

const audioActivityEvt$1 = Object.assign(new Event("audioActivity", {
    id: null,
    isActive: false
})),
    activityCounterMin$1 = 0,
    activityCounterMax$1 = 60,
    activityCounterThresh$1 = 5;

/**
 * 
 * @param {number} frequency
 * @param {number} sampleRate
 * @param {number} bufferSize
 */
function frequencyToIndex$1(frequency, sampleRate, bufferSize) {
    var nyquist = sampleRate / 2;
    var index = Math.round(frequency / nyquist * bufferSize);
    return clamp(index, 0, bufferSize)
}

/**
 * 
 * @param {AnalyserNode} analyser
 * @param {Float32Array} frequencies
 * @param {number} minHz
 * @param {number} maxHz
 * @param {number} bufferSize
 */
function analyserFrequencyAverage$1(analyser, frequencies, minHz, maxHz, bufferSize) {
    const sampleRate = analyser.context.sampleRate,
        start = frequencyToIndex$1(minHz, sampleRate, bufferSize),
        end = frequencyToIndex$1(maxHz, sampleRate, bufferSize),
        count = end - start;
    let sum = 0;
    for (let i = start; i < end; ++i) {
        sum += frequencies[i];
    }
    return count === 0 ? 0 : (sum / count);
}

class GoogleResonanceAudioSpatializer extends BaseSpatializer {

    /**
     * 
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     */
    constructor(userID, destination, audio, bufferSize) {
        const position = new InterpolatedPosition();
        super(userID, destination, audio, position);

        this.audio.volume = 0;

        this.bufferSize = bufferSize;
        this.buffer = new Float32Array(this.bufferSize);

        /** @type {AnalyserNode} */
        this.analyser = this.destination.audioContext.createAnalyser();
        this.analyser.fftSize = 2 * this.bufferSize;
        this.analyser.smoothingTimeConstant = 0.2;

        this.inNode = this.destination.position.scene.createSource();

        /** @type {boolean} */
        this.wasActive = false;
        this.lastAudible = true;
        this.activityCounter = 0;

        /** @type {MediaStream} */
        this.stream = null;

        /** @type {MediaSource} */
        this.source = null;
    }

    update() {
        super.update();

        this.inNode.setPosition(this.position.x, 0, this.position.y);

        if (!this.source) {
            try {
                if (!this.stream) {
                    this.stream = !!this.audio.mozCaptureStream
                        ? this.audio.mozCaptureStream()
                        : this.audio.captureStream();
                }

                if (this.stream.active) {
                    this.source = this.destination.audioContext.createMediaStreamSource(this.stream);
                    this.source.connect(this.inNode.input);
                }
            }
            catch (exp) {
                console.warn("Source isn't available yet. Will retry in a moment. Reason: ", exp);
            }
        }

        if (!!this.source) {
            this.analyser.getFloatFrequencyData(this.buffer);

            const average = 1.1 + analyserFrequencyAverage$1(this.analyser, this.buffer, 85, 255, this.bufferSize) / 100;
            if (average >= 0.5 && this.activityCounter < activityCounterMax$1) {
                this.activityCounter++;
            } else if (average < 0.5 && this.activityCounter > activityCounterMin$1) {
                this.activityCounter--;
            }

            const isActive = this.activityCounter > activityCounterThresh$1;
            if (this.wasActive !== isActive) {
                this.wasActive = isActive;
                audioActivityEvt$1.id = this.id;
                audioActivityEvt$1.isActive = isActive;
                this.dispatchEvent(audioActivityEvt$1);
            }
        }
    }

    dispose() {
        if (!!this.source) {
            this.source.disconnect(this.inNode.input);
        }

        this.source = null;
        this.stream = null;
        this.inNode = null;
        this.analyser = null;
        this.buffer = null;

        super.dispose();
    }
}

/* global window, AudioListener, AudioContext, Event, EventTarget */

const forceInterpolatedPosition = false,
    contextDestroyingEvt = new Event("contextDestroying"),
    contextDestroyedEvt = new Event("contextDestroyed");

let hasWebAudioAPI = window.hasOwnProperty("AudioListener"),
    hasFullSpatializer = hasWebAudioAPI && window.hasOwnProperty("PannerNode"),
    isLatestWebAudioAPI = hasWebAudioAPI && AudioListener.prototype.hasOwnProperty("positionX"),
    attemptResonanceAPI = true;

class Destination extends EventTarget {

    constructor() {
        super();

        this.minDistance = 1;
        this.maxDistance = 10;
        this.rolloff = 1;
        this.transitionTime = 0.125;

        /** @type {AudioContext|MockAudioContext} */
        this.audioContext = null;

        /** @type {BasePosition} */
        this.position = null;
    }

    createContext() {
        if (!this.audioContext) {
            try {
                if (hasWebAudioAPI) {
                    this.audioContext = new AudioContext();

                    try {
                        if (isLatestWebAudioAPI) {
                            try {
                                if (attemptResonanceAPI) {
                                    this.position = new GoogleResonanceAudioScene(this.audioContext);
                                }
                            }
                            catch (exp3) {
                                attemptResonanceAPI = false;
                                console.warn("Resonance Audio API not available!", exp3);
                            }
                            finally {
                                if (!attemptResonanceAPI) {
                                    this.position = new WebAudioNewListenerPosition(this.audioContext.listener, forceInterpolatedPosition);
                                }
                            }
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
        this.update();
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

    /**
     * 
     * @param {string} userID
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     * @return {BaseSpatializer}
     */
    createSpatializer(userID, audio, bufferSize) {
        try {
            if (hasWebAudioAPI) {
                try {
                    if (hasFullSpatializer) {
                        try {
                            if (attemptResonanceAPI) {
                                return new GoogleResonanceAudioSpatializer(userID, this, audio, bufferSize);
                            }
                        }
                        catch (exp3) {
                            attemptResonanceAPI = false;
                            console.warn("Resonance Audio API not available!", exp3);
                        }
                        finally {
                            if (!attemptResonanceAPI) {
                                return new FullSpatializer(userID, this, audio, bufferSize, forceInterpolatedPosition);
                            }
                        }
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

class BaseAudioClient extends EventTarget {

    constructor() {
        super();
    }

    /**
     * Set the position of the listener.
     * @param {Point} evt
     */
    setLocalPosition(evt) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set the position of an audio source.
     * @param {UserPosition} evt
     */
    setUserPosition(evt) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set audio parameters for the listener.
     * @param {any} evt
     */
    setAudioProperties(evt) {
        throw new Error("Not implemented in base class");
    }

    /**
     * 
     * @param {BaseUser} evt
     */
    removeUser(evt) {
        throw new Error("Not implemented in base class");
    }
}

const tickEvt = Object.assign(new Event("tick"), {
    dt: 0
});

class BaseTimer extends EventTarget {

    /**
     * 
     * @param {number} targetFrameRate
     */
    constructor(targetFrameRate) {
        super();
        this._lt = 0;
        this._timer = null;
        this.targetFrameRate = targetFrameRate;
    }

    /**
     * 
     * @param {number} dt
     */
    _onTick(dt) {
        tickEvt.dt = dt;
        this.dispatchEvent(tickEvt);
    }

    restart() {
        this.stop();
        this.start();
    }

    get isRunning() {
        return this._timer !== null;
    }

    start() {
        throw new Error("Not implemented in base class");
    }

    stop() {
        this._timer = null;
    }

    /** @type {number} */
    get targetFrameRate() {
        return this._targetFPS;
    }

    set targetFrameRate(fps) {
        this._targetFPS = fps;
        this._frameTime = 1000 / fps;
    }
}

// A few convenience methods for HTML elements.

Element.prototype.isOpen = function () {
    return this.style.display !== "none";
};

Element.prototype.setOpen = function (v, displayType = "") {
    this.style.display = v
        ? displayType
        : "none";
};

Element.prototype.setOpenWithLabel = function (v, label, enabledText, disabledText, bothText, displayType = "") {
    this.setOpen(v, displayType);
    label.updateLabel(this.isOpen(), enabledText, disabledText, bothText);
};

Element.prototype.updateLabel = function (isOpen, enabledText, disabledText, bothText) {
    bothText = bothText || "";
    if (this.accessKey) {
        bothText += ` <kbd>(ALT+${this.accessKey.toUpperCase()})</kbd>`;
    }
    this.innerHTML = (isOpen ? enabledText : disabledText) + bothText;
};

Element.prototype.toggleOpen = function (displayType = "") {
    this.setOpen(!this.isOpen(), displayType);
};

Element.prototype.toggleOpenWithLabel = function (label, enabledText, disabledText, bothText, displayType = "") {
    this.setOpenWithLabel(!this.isOpen(), label, enabledText, disabledText, bothText, displayType);
};

Element.prototype.show = function (displayType = "") {
    this.setOpen(true, displayType);
};

Element.prototype.hide = function () {
    this.setOpen(false);
};

Element.prototype.setLocked = function (value) {
    if (value) {
        this.lock();
    }
    else {
        this.unlock();
    }
};

Element.prototype.lock = function () {
    this.disabled = "disabled";
};

Element.prototype.unlock = function () {
    this.disabled = "";
};

Element.prototype.blinkBorder = function (times, color) {
    times = (times || 3) * 2;
    color = color || "rgb(255, 127, 127)";

    let state = false;
    const interval = setInterval(() => {
        state = !state;
        this.style.backgroundColor = state ? color : "";
        --times;
        if (times === 0) {
            clearInterval(interval);
        }
    }, 125);
};

HTMLCanvasElement.prototype.resize = function () {
    this.width = this.clientWidth * devicePixelRatio;
    this.height = this.clientHeight * devicePixelRatio;
};

const oldAddEventListener = HTMLInputElement.prototype.addEventListener;

HTMLInputElement.prototype.addEventListener = function (evtName, func, opts) {
    if (evtName === "enter") {
        oldAddEventListener.call(this, "keypress", function (evt) {
            if (evt.key === "Enter") {
                func(evt);
            }
        }, opts);
    }
    else {
        oldAddEventListener.call(this, evtName, func, opts);
    }
};

Response.prototype.xml = async function () {
    const text = await this.text(),
        parser = new DOMParser(),
        xml = parser.parseFromString(text, "text/xml");

    return xml.documentElement;
};

Response.prototype.html = async function () {
    const text = await this.text(),
        parser = new DOMParser(),
        xml = parser.parseFromString(text, "text/html");

    return xml.documentElement;
};

Array.prototype.random = function (defaultValue) {
    const offset = !!defaultValue ? 1 : 0,
        idx = Math.floor(Math.random() * (this.length + offset)) - offset;
    if (idx < 0) {
        return defaultValue;
    }
    else {
        return this[idx];
    }
};

HTMLSelectElement.prototype.setSelectedValue = function (value) {
    this.value = "";

    if (value !== null
        && value !== undefined) {
        value = value.toString();
        for (let option of this.options) {
            if (option.value === value) {
                this.value = value;
                return;
            }
        }
    }
};

Storage.prototype.getInt = function (name, defaultValue) {
    const n = parseFloat(this.getItem(name));
    if (!Number.isInteger(n)) {
        return defaultValue;
    }

    return n;
};

function add(a, b) {
    return evt => {
        a(evt);
        b(evt);
    };
}

Event.clone = function (target, ...objs) {
    for (let obj of objs) {
        for (let key in obj) {
            if (key !== "isTrusted"
                && !Event.prototype.hasOwnProperty(key)) {
                target[key] = obj[key];
            }
        }
    }

    return target;
};

EventTarget.prototype.once = function (resolveEvt, rejectEvt, timeout) {

    if (timeout === undefined
        && isGoodNumber(rejectEvt)) {
        timeout = rejectEvt;
        rejectEvt = undefined;
    }

    return new Promise((resolve, reject) => {
        const hasResolveEvt = resolveEvt !== undefined && resolveEvt !== null,
            removeResolve = () => {
                if (hasResolveEvt) {
                    this.removeEventListener(resolveEvt, resolve);
                }
            },
            hasRejectEvt = rejectEvt !== undefined && rejectEvt !== null,
            removeReject = () => {
                if (hasRejectEvt) {
                    this.removeEventListener(rejectEvt, reject);
                }
            },
            remove = add(removeResolve, removeReject);

        resolve = add(remove, resolve);
        reject = add(remove, reject);

        if (timeout !== undefined
            && timeout !== null) {
            const timer = setTimeout(() => {
                reject("Timeout");
            }, timeout),
                cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }

        if (hasResolveEvt) {
            this.addEventListener(resolveEvt, resolve);
        }

        if (hasRejectEvt) {
            this.addEventListener(rejectEvt, () => {
                reject("Rejection event found");
            });
        }
    });
};

EventTarget.prototype.until = function (untilEvt, callback, test, repeatTimeout, cancelTimeout) {
    return new Promise((resolve, reject) => {
        let timer = null,
            canceller = null;

        const cleanup = () => {
            if (timer !== null) {
                clearTimeout(timer);
            }

            if (canceller !== null) {
                clearTimeout(canceller);
            }

            this.removeEventListener(untilEvt, success);
        };

        function success(evt) {
            if (test(evt)) {
                cleanup();
                resolve(evt);
            }
        }

        this.addEventListener(untilEvt, success);

        if (repeatTimeout !== undefined) {
            if (cancelTimeout !== undefined) {
                canceller = setTimeout(() => {
                    cleanup();
                    reject("timeout");
                }, cancelTimeout);
            }

            function repeater() {
                callback();
                timer = setTimeout(repeater, repeatTimeout);
            }

            timer = setTimeout(repeater, 0);
        }
    });
};

EventTarget.prototype.addEventListeners = function (obj) {
    for (let evtName in obj) {
        let callback = obj[evtName];
        let opts = undefined;
        if (callback instanceof Array) {
            opts = callback[1];
            callback = callback[0];
        }

        this.addEventListener(evtName, callback, opts);
    }
};

Array.prototype.clear = function () {
    this.splice(0);
};

Array.prototype.removeAt = function (idx) {
    this.splice(idx, 1);
};

String.prototype.firstLetterToUpper = function () {
    return this[0].toLocaleUpperCase()
        + this.substring(1);
};

function isFunction(obj) {
    return typeof obj === "function"
        || obj instanceof Function;
}

function createWorker(script, stripFunc = true) {
    if (isFunction(script)) {
        script = script.toString();
        stripFunc = true;
    }
    else if (typeof script !== "string"
        && !(script instanceof String)) {
        throw new Error("Script parameter must be either a string or function");
    }

    if (stripFunc) {
        script = script.trim();
        const start = script.indexOf('{');
        script = script.substring(start + 1, script.length - 1);
    }

    const blob = new Blob([script], { type: "text/javascript" }),
        dataURI = URL.createObjectURL(blob);
    return new Worker(dataURI);
}

class WorkerTimer extends BaseTimer {

    constructor(targetFrameRate) {
        super(targetFrameRate);

        this._running = false;
        this._timer = createWorker(function () {
            let lt = 0,
                dt = null,
                running = false;
            onmessage = function (e) {
                if (e.data === "stop") {
                    running = false;
                } else {
                    const fps = parseFloat(e.data);
                    if (fps === Math.floor(fps)) {
                        dt = 1000 / fps;
                        if (!running) {
                            running = true;
                            loop();
                        }
                    }
                }
            };

            function loop() {
                while (running) {
                    var t = performance.now();
                    if (t - lt >= dt) {
                        postMessage("ok");
                        lt = t;
                    }
                }
            }
        });

        this._timer.onmessage = () => {
            const t = performance.now(),
                dt = t - this._lt;
            this._lt = t;
            this._onTick(dt);
        };
    }

    get targetFrameRate() {
        return super.targetFrameRate;
    }

    set targetFrameRate(fps) {
        super.targetFrameRate = fps;
        if (this.isRunning) {
            this._timer.postMessage(fps);
        }
    }

    start() {
        this._timer.postMessage(this.targetFrameRate);
    }

    stop() {
        if (this.isRunning) {
            this._timer.postMessage("stop");
        }
    }

    get isRunning() {
        return this._running;
    }
}

const BUFFER_SIZE = 1024,
    audioActivityEvt$2 = Object.assign(new Event("audioActivity", {
        id: null,
        isActive: false
    }));


class AudioManager extends BaseAudioClient {
    constructor() {
        super();

        this.onAudioActivity = (evt) => {
            audioActivityEvt$2.id = evt.id;
            audioActivityEvt$2.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt$2);
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

        this.timer = new WorkerTimer(250);
        this.timer.addEventListener("tick", () => {
            this.destination.update();
            for (let source of this.sourceList) {
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
