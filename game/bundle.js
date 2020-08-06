const JITSI_HOST = "tele.calla.chat";
const JVB_HOST = JITSI_HOST;
const JVB_MUC = "conference." + JITSI_HOST;

/**
 * Empties out an array
 * @param {any[]} arr - the array to empty.
 * @returns {any[]} - the items that were in the array.
 */
function arrayClear(arr) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }
    return arr.splice(0);
}

/**
 * Returns a random item from an array of items.
 *
 * Provides an option to consider an additional item as part of the collection
 * for random selection.
 * @param {any[]} arr
 * @param {any} defaultValue
 */
function arrayRandom(arr, defaultValue) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }
    const offset = defaultValue ? 1 : 0,
        idx = Math.floor(Math.random() * (arr.length + offset)) - offset;
    if (idx < 0) {
        return defaultValue;
    }
    else {
        return arr[idx];
    }
}

/**
 * Removes an item at the given index from an array.
 * @param {any[]} arr
 * @param {number} idx
 * @returns {any} - the item that was removed.
 */
function arrayRemoveAt(arr, idx) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }
    return arr.splice(idx, 1);
}

/**
 * A test for filtering an array
 * @callback scanArrayCallback
 * @param {any} obj - an array item to check.
 * @param {number} idx - the index of the item that is being checked.
 * @param {any[]} arr - the full array that is being filtered.
 * @returns {boolean} whether or not the item matches the test.
 */

/**
 * Scans through a series of filters to find an item that matches
 * any of the filters. The first item of the first filter that matches
 * will be returned.
 * @param {any[]} arr - the array to scan
 * @param {...scanArrayCallback} tests - the filtering tests.
 * @returns {any}
 */
function arrayScan(arr, ...tests) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }

    for (let test of tests) {
        const filtered = arr.filter(test);
        if (filtered.length > 0) {
            return filtered[0];
        }
    }

    return null;
}

/**
 * An Event class for tracking changes to audio activity.
 **/
class AudioActivityEvent extends Event {
    /** Creates a new "audioActivity" event */
    constructor() {
        super("audioActivity");
        /** @type {string} */
        this.id = null;
        this.isActive = false;

        Object.seal(this);
    }

    /**
     * Sets the current state of the event
     * @param {string} id - the user for which the activity changed
     * @param {boolean} isActive - the new state of the activity
     */
    set(id, isActive) {
        this.id = id;
        this.isActive = isActive;
    }
}

function t(o, s, c) {
    return typeof o === s
        || o instanceof c;
}

function isFunction(obj) {
    return t(obj, "function", Function);
}

function isString(obj) {
    return t(obj, "string", String);
}

function isNumber(obj) {
    return t(obj, "number", Number);
}
function isBoolean(obj) {
    return t(obj, "boolean", Boolean);
}

const EventBase = (function () {
    try {
        new window.EventTarget();
        return class EventBase extends EventTarget {
            constructor() {
                super();
            }
        };
    } catch (exp) {

        /** @type {WeakMap<EventBase, Map<string, Listener[]>> */
        const selfs = new WeakMap();

        return class EventBase {

            constructor() {
                selfs.set(this, new Map());
            }

            /**
             * @param {string} type
             * @param {Function} callback
             * @param {any} options
             */
            addEventListener(type, callback, options) {
                if (isFunction(callback)) {
                    const self = selfs.get(this);
                    if (!self.has(type)) {
                        self.set(type, []);
                    }

                    const listeners = self.get(type);
                    if (!listeners.find(l => l.callback === callback)) {
                        listeners.push({
                            target: this,
                            callback,
                            options
                        });
                    }
                }
            }

            /**
             * @param {string} type
             * @param {Function} callback
             */
            removeEventListener(type, callback) {
                if (isFunction(callback)) {
                    const self = selfs.get(this);
                    if (self.has(type)) {
                        const listeners = self.get(type),
                            idx = listeners.findIndex(l => l.callback === callback);
                        if (idx >= 0) {
                            arrayRemoveAt(listeners, idx);
                        }
                    }
                }
            }

            /**
             * @param {Event} evt
             */
            dispatchEvent(evt) {
                const self = selfs.get(this);
                if (!self.has(evt.type)) {
                    return true;
                }
                else {
                    const listeners = self.get(evt.type);
                    for (let listener of listeners) {
                        if (listener.options && listener.options.once) {
                            this.removeEventListener(evt.type, listener.callback);
                        }
                        listener.callback.call(listener.target, evt);
                    }
                    return !evt.defaultPrevented;
                }
            }
        };
    }

})();

/**
 * A mocking class for providing the playback timing needed to synchronize motion and audio.
 **/
class MockAudioContext {
    /**
     * Starts the timer at "now".
     **/
    constructor() {
        this._t = performance.now() / 1000;

        Object.seal(this);
    }

    /**
     * Gets the current playback time.
     * @type {number}
     */
    get currentTime() {
        return performance.now() / 1000 - this._t;
    }

    /**
     * Returns nothing.
     * @type {AudioDestinationNode} */
    get destination() {
        return null;
    }
}

/**
 * Check a value to see if it is of a number type
 * and is not the special NaN value.
 * 
 * @param {any} v
 */
function isGoodNumber(v) {
    return isNumber(v)
        && !Number.isNaN(v);
}

/**
 * Force a value onto a range
 * 
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */
function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

/**
 * Translate a value into a range.
 * 
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */
function project(v, min, max) {
    const delta = max - min;
    if (delta === 0) {
        return 0;
    }
    else {
        return (v - min) / delta;
    }
}

/**
 * Translate a value out of a range.
 * 
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */
function unproject(v, min, max) {
    return v * (max - min) + min;
}

/**
 * Pick a value that is proportionally between two values.
 * 
 * @param {number} a
 * @param {number} b
 * @param {number} p
 * @returns {number}
 */
function lerp(a, b, p) {
    return (1 - p) * a + p * b;
}

/**
 * A 3D point.
 **/
class Vector {
    /**
     * Creates a new 3D point.
     **/
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        Object.seal(this);
    }

    /**
     * Sets the components of this vector.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Copies another vector into this vector.
     * @param {Vector} other
     */
    copy(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
    }

    /**
     * Performs a linear interpolation between two vectors,
     * storing the result in this vector.
     * @param {Vector} a
     * @param {Vector} b
     * @param {number} p
     */
    lerp(a, b, p) {
        this.x = lerp(a.x, b.x, p);
        this.y = lerp(a.y, b.y, p);
        this.z = lerp(a.z, b.z, p);
    }

    /**
     * Computes the dot product of this vector with another vector
     * @param {Vector} other
     */
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    /**
     * Subtracts two vectors and stores the result in this vector.
     * @param {Vector} a
     * @param {Vector} b
     */
    sub(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
    }

    /**
     * Performs a spherical linear interpolation between two vectors,
     * storing the result in this vector.
     * @param {Vector} a
     * @param {Vector} b
     * @param {number} p
     */
    slerp(a, b, p) {
        const dot = a.dot(b);
        const angle = Math.acos(dot);
        if (angle !== 0) {
            const c = Math.sin(angle);
            const pA = Math.sin((1 - p) * angle) / c;
            const pB = Math.sin(p * angle) / c;
            this.x = pA * a.x + pB * b.x;
            this.y = pA * a.y + pB * b.y;
            this.x = pA * a.z + pB * b.z;
        }
    }

    /**
     * Gets the squared length of the vector
     **/
    get lenSq() {
        return this.dot(this);
    }

    /**
     * Gets the length of the vector
     **/
    get len() {
        return Math.sqrt(this.lenSq);
    }

    /**
     * Makes this vector a unit vector
     **/
    normalize() {
        const len = this.len;
        if (len !== 0) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        }
    }
}

/**
 * A position and orientation, at a given time.
 **/
class Pose {
    /**
     * Creates a new position and orientation, at a given time.
     **/
    constructor() {
        this.t = 0;
        this.p = new Vector();
        this.f = new Vector();
        this.f.set(0, 0, -1);
        this.u = new Vector();
        this.u.set(0, 1, 0);

        Object.seal(this);
    }


    /**
     * Sets the components of the pose.
     * @param {number} px
     * @param {number} py
     * @param {number} pz
     * @param {number} fx
     * @param {number} fy
     * @param {number} fz
     * @param {number} ux
     * @param {number} uy
     * @param {number} uz
     */
    set(px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.p.set(px, py, pz);
        this.f.set(fx, fy, fz);
        this.u.set(ux, uy, uz);
    }

    /**
     * Copies the components of another pose into this pose.
     * @param {Pose} other
     */
    copy(other) {
        this.p.copy(other.p);
        this.f.copy(other.f);
        this.u.copy(other.u);
    }

    /**
     * Performs a lerp between two positions and a slerp between to orientations
     * and stores the result in this pose.
     * @param {Pose} a
     * @param {Pose} b
     * @param {number} p
     */
    interpolate(start, end, t) {
        if (t <= start.t) {
            this.copy(start);
        }
        else if (end.t <= t) {
            this.copy(end);
        }
        else if (start.t < t) {
            const p = project(t, start.t, end.t);
            this.p.lerp(start.p, end.p, p);
            this.f.slerp(start.f, end.f, p);
            this.u.slerp(start.u, end.u, p);
            this.t = t;
        }
    }
}

/** Base class providing functionality for spatializers. */
class BaseSpatializer extends EventBase {

    /**
     * Creates a spatializer that keeps track of position
     */
    constructor() {
        super();

        this.minDistance = 1;
        this.minDistanceSq = 1;
        this.maxDistance = 10;
        this.maxDistanceSq = 100;
        this.rolloff = 1;
        this.transitionTime = 0.5;
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     **/
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.transitionTime = transitionTime;
        this.rolloff = rolloff;
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
    }
}

/**
 * A position value that is blended from the current position to
 * a target position over time.
 */
class InterpolatedPose {

    /**
     * Creates a new position value that is blended from the current position to
     * a target position over time.
     **/
    constructor() {
        this.start = new Pose();
        this.current = new Pose();
        this.end = new Pose();

        /** @type {BaseSpatializer} */
        this._spatializer = null;

        Object.seal(this);
    }

    get spatializer() {
        return this._spatializer;
    }

    set spatializer(v) {
        if (this.spatializer !== v) {
            if (this._spatializer) {
                this._spatializer.dispose();
            }
            this._spatializer = v;
        }
    }

    dispose() {
        this.spatializer = null;
    }

    /**
     * Set the target position and orientation for the time `t + dt`.
     * @param {number} px - the horizontal component of the position.
     * @param {number} py - the vertical component of the position.
     * @param {number} pz - the lateral component of the position.
     * @param {number} fx - the horizontal component of the position.
     * @param {number} fy - the vertical component of the position.
     * @param {number} fz - the lateral component of the position.
     * @param {number} ux - the horizontal component of the position.
     * @param {number} uy - the vertical component of the position.
     * @param {number} uz - the lateral component of the position.
     * @param {number} t - the time at which to start the transition.
     * @param {number} dt - the amount of time to take making the transition.
     */
    setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, t, dt) {
        this.start.copy(this.current);
        this.start.t = t;
        this.end.set(px, py, pz, fx, fy, fz, ux, uy, uz);
        this.end.t = t + dt;
    }

    /**
     * Set the target position for the time `t + dt`.
     * @param {number} px - the horizontal component of the position.
     * @param {number} py - the vertical component of the position.
     * @param {number} pz - the lateral component of the position.
     * @param {number} t - the time at which to start the transition.
     * @param {number} dt - the amount of time to take making the transition.
     */
    setTargetPosition(px, py, pz, t, dt) {
        this.setTarget(
            px, py, pz,
            this.end.f.x, this.end.f.y, this.end.f.z,
            this.end.u.x, this.end.u.y, this.end.u.z,
            t, dt);
    }

    /**
     * Set the target orientation for the time `t + dt`.
     * @param {number} fx - the horizontal component of the position.
     * @param {number} fy - the vertical component of the position.
     * @param {number} fz - the lateral component of the position.
     * @param {number} ux - the horizontal component of the position.
     * @param {number} uy - the vertical component of the position.
     * @param {number} uz - the lateral component of the position.
     * @param {number} t - the time at which to start the transition.
     * @param {number} dt - the amount of time to take making the transition.
     */
    setTargetOrientation(fx, fy, fz, ux, uy, uz, t, dt) {
        this.setTarget(
            this.end.p.x, this.end.p.y, this.end.p.z,
            fx, fy, fz,
            ux, uy, uz,
            t, dt);
    }

    /**
     * Calculates the new position for the given time.
     * @protected
     * @param {number} t
     */
    update(t) {
        this.current.interpolate(this.start, this.end, t);
        if (this.spatializer) {
            this.spatializer.update(this.current);
        }
    }
}

/**
 * Indicates whether or not the current browser can change the destination device for audio output.
 * @constant
 * @type {boolean}
 **/
const canChangeAudioOutput = HTMLAudioElement.prototype["setSinkId"] instanceof Function;

/** Base class providing functionality for spatializers. */
class BaseSource extends BaseSpatializer {

    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     */
    constructor(id, stream) {
        super();

        this.id = id;

        /** @type {HTMLAudioElement} */
        this.audio = null;

        /** @type {MediaStream} */
        this.stream = null;

        this.volume = 1;

        if (stream instanceof HTMLAudioElement) {
            this.audio = stream;
        }
        else if (stream instanceof MediaStream) {
            this.stream = stream;
            this.audio = document.createElement("audio");
            this.audio.srcObject = this.stream;
        }
        else if (stream !== null) {
            throw new Error("Can't create a node from the given stream. Expected type HTMLAudioElement or MediaStream.");
        }

        this.audio.playsInline = true;
    }

    play() {
        if (this.audio) {
            this.audio.play();
        }
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
        this.stream = null;
        super.dispose();
    }

    /**
     * Changes the device to which audio will be output
     * @param {string} deviceID
     */
    setAudioOutputDevice(deviceID) {
        if (this.audio && canChangeAudioOutput) {
            this.audio.setSinkId(deviceID);
        }
    }
}

class ManualBase extends BaseSpatializer {
    /**
     * @param {Pose} dest
     */
    constructor(dest) {
        super(dest);
        this.dest = dest;
        this.delta = new Vector();
        this.volume = 1;
        this.pan = 0;

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);

        this.delta.sub(loc.p, this.dest.p);

        const dist = this.delta.len,
            distScale = project(dist, this.minDistance, this.maxDistance);
        this.volume = 1 - clamp(distScale, 0, 1);
        this.volume = Math.round(100 * this.volume * this.volume) / 100;
        this.pan = dist > 0
            ? this.delta.x / dist
            : 0;
    }
}

/**
 * A spatializer that only modifies volume.
 **/
class ManualVolume extends BaseSource {

    /**
     * Creates a new spatializer that only modifies volume.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {Pose} dest
     */
    constructor(id, stream, dest) {
        super(id, stream);
        this.audio.muted = false;
        this.audio.play();
        this.manual = new ManualBase(dest);

        /** @type {number} */
        this._lastVolume = null;

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        this.manual.update(loc);
        if (this._lastVolume !== this.manual.volume) {
            this._lastVolume
                = this.audio.volume
                = this.manual.volume;
        }
    }
}

const audioActivityEvt = new AudioActivityEvent(),
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

class BaseAnalyzed extends BaseSource {

    /**
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {AudioContext} audioContext
     * @param {PannerNode|StereoPannerNode} inNode
     */
    constructor(id, stream, bufferSize, audioContext, inNode) {
        super(id, stream);

        this.bufferSize = bufferSize;
        if (!isGoodNumber(this.bufferSize)
            || this.bufferSize <= 0) {
            this.buffer = null;
            this.analyser = null;
        }
        else {
            this.buffer = new Float32Array(this.bufferSize);

            /** @type {AnalyserNode} */
            this.analyser = audioContext.createAnalyser();
            this.analyser.fftSize = 2 * this.bufferSize;
            this.analyser.smoothingTimeConstant = 0.2;
        }

        /** @type {PannerNode|StereoPannerNode} */
        this.inNode = inNode;

        /** @type {boolean} */
        this.wasActive = false;
        this.lastAudible = true;
        this.activityCounter = 0;

        /** @type {MediaSource} */
        this.source = null;

        const checkSource = () => {
            if (!this.source) {
                if (this.stream) {
                    try {
                        if (this.stream.active) {
                            this.source = audioContext.createMediaStreamSource(this.stream);
                            this.source.connect(this.analyser);
                            this.source.connect(this.inNode);
                            setTimeout(checkSource, 0);
                        }
                    }
                    catch (exp) {
                        console.warn("Creating the media stream failed. Reason: ", exp);
                    }
                }
                else if (this.audio) {
                    try {
                        this.source = audioContext.createMediaElementSource(this.audio);
                        this.source.connect(this.inNode);
                        if (this.analyser) {
                            this.source.connect(this.analyser);
                        }
                    }
                    catch (exp) {
                        console.warn("Creating the media stream failed. Reason: ", exp);
                    }
                }
            }
        };

        checkSource();
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     * @fires BaseAnalyzedSpatializer#audioActivity
     */
    update(loc) {
        super.update(loc);

        if (this.analyser && this.source) {
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

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        if (this.source) {
            if (this.analyser) {
                this.source.disconnect(this.analyser);
            }
            this.source.disconnect(this.inNode);
        }

        this.source = null;
        this.inNode = null;
        this.analyser = null;
        this.buffer = null;

        super.dispose();
    }
}

/**
 * A spatializer that uses the WebAudio API.
 **/
class BaseWebAudio extends BaseAnalyzed {

    /**
     * Creates a new spatializer that uses the WebAudio API
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {AudioContext} audioContext
     * @param {PannerNode|StereoPannerNode} inNode
     * @param {GainNode=} outNode
     */
    constructor(id, stream, bufferSize, audioContext, inNode, outNode = null) {
        super(id, stream, bufferSize, audioContext, inNode);

        this.outNode = outNode || inNode;
        this.outNode.connect(audioContext.destination);

        if (this.inNode !== this.outNode) {
            this.inNode.connect(this.outNode);
        }
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        if (this.inNode !== this.outNode) {
            this.inNode.disconnect(this.outNode);
        }

        this.outNode.disconnect(this.outNode.context.destination);
        this.outNode = null;

        super.dispose();
    }
}

/**
 * A spatializer that performs stereo panning and volume scaling.
 **/
class ManualStereo extends BaseWebAudio {

    /**
     * Creates a new spatializer that performs stereo panning and volume scaling.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {AudioContext} audioContext
     * @param {Pose} dest
     */
    constructor(id, stream, bufferSize, audioContext, dest) {
        super(id, stream, bufferSize,
            audioContext,
            audioContext.createStereoPanner(),
            audioContext.createGain());
        this.manual = new ManualBase(dest);

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        this.manual.update(loc);
        this.inNode.pan.value = this.manual.pan;
        this.outNode.gain.value = this.manual.volume;
    }
}

let hasAudioContext = Object.prototype.hasOwnProperty.call(window, "AudioContext"),
    hasStereoPanner = hasAudioContext && Object.prototype.hasOwnProperty.call(window, "StereoPannerNode");

class BaseListener extends BaseSpatializer {
    /**
     * Creates a spatializer that keeps track of position
     */
    constructor() {
        super();
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @param {AudioContext} audioContext
     * @param {Pose} dest
     * @return {BaseSource}
     */
    createSource(id, stream, bufferSize, audioContext, dest) {
        if (hasStereoPanner) {
            try {
                return new ManualStereo(id, stream, bufferSize, audioContext, dest);
            }
            catch (exp) {
                hasStereoPanner = false;
                console.warn("Couldn't create a stereo panner. Reason:", exp);
            }
        }

        if (!hasStereoPanner) {
            return new ManualVolume(id, stream, dest);
        }
    }
}

/**
 * A spatializer that uses WebAudio's AudioListener
 **/
class AudioListenerBase extends BaseListener {

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param {AudioListener} listener
     */
    constructor(listener) {
        super();
        this.node = listener;
    }

    dispose() {
        this.node = null;
        super.dispose();
    }
}

/**
 * A spatializer that uses WebAudio's PannerNode
 **/
class PannerBase extends BaseWebAudio {

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {AudioContext} audioContext
     */
    constructor(id, stream, bufferSize, audioContext) {
        const panner = audioContext.createPanner();
        super(id, stream, bufferSize, audioContext, panner);

        this.inNode.panningModel = "HRTF";
        this.inNode.distanceModel = "inverse";
        this.inNode.coneInnerAngle = 360;
        this.inNode.coneOuterAngle = 0;
        this.inNode.coneOuterGain = 0;
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        this.inNode.refDistance = this.minDistance;
        this.inNode.rolloffFactor = this.rolloff;
    }
}

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
class PannerNew extends PannerBase {

    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {AudioContext} audioContext
     */
    constructor(id, stream, bufferSize, audioContext) {
        super(id, stream, bufferSize, audioContext);

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        const { p, f } = loc;
        this.inNode.positionX.setValueAtTime(p.x, 0);
        this.inNode.positionY.setValueAtTime(p.y, 0);
        this.inNode.positionZ.setValueAtTime(p.z, 0);
        this.inNode.orientationX.setValueAtTime(f.x, 0);
        this.inNode.orientationY.setValueAtTime(f.y, 0);
        this.inNode.orientationZ.setValueAtTime(f.z, 0);
    }
}

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
class AudioListenerNew extends AudioListenerBase {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     * @param {AudioListener} listener
     */
    constructor(listener) {
        super(listener);

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        const { p, f, u } = loc;
        this.node.positionX.setValueAtTime(p.x, 0);
        this.node.positionY.setValueAtTime(p.y, 0);
        this.node.positionZ.setValueAtTime(p.z, 0);
        this.node.forwardX.setValueAtTime(f.x, 0);
        this.node.forwardY.setValueAtTime(f.y, 0);
        this.node.forwardZ.setValueAtTime(f.z, 0);
        this.node.upX.setValueAtTime(u.x, 0);
        this.node.upY.setValueAtTime(u.y, 0);
        this.node.upZ.setValueAtTime(u.z, 0);
    }


    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @param {AudioContext} audioContext
     * @param {Pose} dest
     * @return {BaseSource}
     */
    createSource(id, stream, bufferSize, audioContext, dest) {
        return new PannerNew(id, stream, bufferSize, audioContext);
    }
}

/**
 * A positioner that uses the WebAudio API's old setPosition method.
 **/
class PannerOld extends PannerBase {

    /**
     * Creates a new positioner that uses the WebAudio API's old setPosition method.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {AudioContext} audioContext
     */
    constructor(id, stream, bufferSize, audioContext) {
        super(id, stream, bufferSize, audioContext);

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        const { p, f } = loc;
        this.inNode.setPosition(p.x, p.y, p.z);
        this.inNode.setOrientation(f.x, f.y, f.z);
    }
}

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
class AudioListenerOld extends AudioListenerBase {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     * @param {AudioListener} listener
     */
    constructor(listener) {
        super(listener);

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        const { p, f, u } = loc;
        this.node.setPosition(p.x, p.y, p.z);
        this.node.setOrientation(f.x, f.y, f.z, u.x, u.y, u.z);
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @param {AudioContext} audioContext
     * @param {Pose} dest
     * @return {BaseSource}
     */
    createSource(id, stream, bufferSize, audioContext, dest) {
        return new PannerOld(id, stream, bufferSize, audioContext);
    }
}

/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const Utils = {};
Utils.log = function() {
  const message = `[Omnitone] \
${Array.prototype.slice.call(arguments).join(' ')} \
(${performance.now().toFixed(2)}ms)`;
  window.console.log(message);
};
Utils.throw = function() {
  const message = `[Omnitone] \
${Array.prototype.slice.call(arguments).join(' ')} \
(${performance.now().toFixed(2)}ms)`;
  throw new Error(message);
};
let a00;
let a01;
let a02;
let a03;
let a10;
let a11;
let a12;
let a13;
let a20;
let a21;
let a22;
let a23;
let a30;
let a31;
let a32;
let a33;
let b00;
let b01;
let b02;
let b03;
let b04;
let b05;
let b06;
let b07;
let b08;
let b09;
let b10;
let b11;
let det;
Utils.invertMatrix4 = function(out, a) {
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  a30 = a[12];
  a31 = a[13];
  a32 = a[14];
  a33 = a[15];
  b00 = a00 * a11 - a01 * a10;
  b01 = a00 * a12 - a02 * a10;
  b02 = a00 * a13 - a03 * a10;
  b03 = a01 * a12 - a02 * a11;
  b04 = a01 * a13 - a03 * a11;
  b05 = a02 * a13 - a03 * a12;
  b06 = a20 * a31 - a21 * a30;
  b07 = a20 * a32 - a22 * a30;
  b08 = a20 * a33 - a23 * a30;
  b09 = a21 * a32 - a22 * a31;
  b10 = a21 * a33 - a23 * a31;
  b11 = a22 * a33 - a23 * a32;
  det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
};
Utils.isDefinedENUMEntry = function(enumDictionary, entryValue) {
  for (const enumKey in enumDictionary) {
    if (entryValue === enumDictionary[enumKey]) {
      return true;
    }
  }
  return false;
};
Utils.isAudioContext = function(context) {
  return context instanceof AudioContext ||
    context instanceof OfflineAudioContext;
};
Utils.isAudioBuffer = function(audioBuffer) {
  return audioBuffer instanceof AudioBuffer;
};
Utils.mergeBufferListByChannel = function(context, bufferList) {
  const bufferLength = bufferList[0].length;
  const bufferSampleRate = bufferList[0].sampleRate;
  let bufferNumberOfChannel = 0;
  for (let i = 0; i < bufferList.length; ++i) {
    if (bufferNumberOfChannel > 32) {
      Utils.throw('Utils.mergeBuffer: Number of channels cannot exceed 32.' +
          '(got ' + bufferNumberOfChannel + ')');
    }
    if (bufferLength !== bufferList[i].length) {
      Utils.throw('Utils.mergeBuffer: AudioBuffer lengths are ' +
          'inconsistent. (expected ' + bufferLength + ' but got ' +
          bufferList[i].length + ')');
    }
    if (bufferSampleRate !== bufferList[i].sampleRate) {
      Utils.throw('Utils.mergeBuffer: AudioBuffer sample rates are ' +
          'inconsistent. (expected ' + bufferSampleRate + ' but got ' +
          bufferList[i].sampleRate + ')');
    }
    bufferNumberOfChannel += bufferList[i].numberOfChannels;
  }
  const buffer = context.createBuffer(
      bufferNumberOfChannel, bufferLength, bufferSampleRate);
  let destinationChannelIndex = 0;
  for (let i = 0; i < bufferList.length; ++i) {
    for (let j = 0; j < bufferList[i].numberOfChannels; ++j) {
      buffer.getChannelData(destinationChannelIndex++).set(
          bufferList[i].getChannelData(j));
    }
  }
  return buffer;
};
Utils.splitBufferbyChannel = function(context, audioBuffer, splitBy) {
  if (audioBuffer.numberOfChannels <= splitBy) {
    Utils.throw('Utils.splitBuffer: Insufficient number of channels. (' +
        audioBuffer.numberOfChannels + ' splitted by ' + splitBy + ')');
  }
  let sourceChannelIndex = 0;
  const numberOfSplittedBuffer =
      Math.ceil(audioBuffer.numberOfChannels / splitBy);
  for (let i = 0; i < numberOfSplittedBuffer; ++i) {
    const buffer = context.createBuffer(
        splitBy, audioBuffer.length, audioBuffer.sampleRate);
    for (let j = 0; j < splitBy; ++j) {
      if (sourceChannelIndex < audioBuffer.numberOfChannels) {
        buffer.getChannelData(j).set(
            audioBuffer.getChannelData(sourceChannelIndex++));
      }
    }
  }
  return bufferList;
};
Utils.getArrayBufferFromBase64String = function(base64String) {
  const binaryString = window.atob(base64String);
  const byteArray = new Uint8Array(binaryString.length);
  byteArray.forEach(
      (value, index) => byteArray[index] = binaryString.charCodeAt(index));
  return byteArray.buffer;
};

const BufferDataType = {
  BASE64: 'base64',
  URL: 'url',
};
function BufferList(context, bufferData, options) {
  this._context = Utils.isAudioContext(context) ?
      context :
      Utils.throw('BufferList: Invalid BaseAudioContext.');
  this._options = {
    dataType: BufferDataType.BASE64,
    verbose: false,
  };
  if (options) {
    if (options.dataType &&
        Utils.isDefinedENUMEntry(BufferDataType, options.dataType)) {
      this._options.dataType = options.dataType;
    }
    if (options.verbose) {
      this._options.verbose = Boolean(options.verbose);
    }
  }
  this._bufferList = [];
  this._bufferData = this._options.dataType === BufferDataType.BASE64
      ? bufferData
      : bufferData.slice(0);
  this._numberOfTasks = this._bufferData.length;
  this._resolveHandler = null;
  this._rejectHandler = new Function();
}
BufferList.prototype.load = function() {
  return new Promise(this._promiseGenerator.bind(this));
};
BufferList.prototype._promiseGenerator = function(resolve, reject) {
  if (typeof resolve !== 'function') {
    Utils.throw('BufferList: Invalid Promise resolver.');
  } else {
    this._resolveHandler = resolve;
  }
  if (typeof reject === 'function') {
    this._rejectHandler = reject;
  }
  for (let i = 0; i < this._bufferData.length; ++i) {
    this._options.dataType === BufferDataType.BASE64
        ? this._launchAsyncLoadTask(i)
        : this._launchAsyncLoadTaskXHR(i);
  }
};
BufferList.prototype._launchAsyncLoadTask = function(taskId) {
  const that = this;
  this._context.decodeAudioData(
      Utils.getArrayBufferFromBase64String(this._bufferData[taskId]),
      function(audioBuffer) {
        that._updateProgress(taskId, audioBuffer);
      },
      function(errorMessage) {
        that._updateProgress(taskId, null);
        const message = 'BufferList: decoding ArrayByffer("' + taskId +
            '" from Base64-encoded data failed. (' + errorMessage + ')';
        that._rejectHandler(message);
        Utils.throw(message);
      });
};
BufferList.prototype._launchAsyncLoadTaskXHR = function(taskId) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', this._bufferData[taskId]);
  xhr.responseType = 'arraybuffer';
  const that = this;
  xhr.onload = function() {
    if (xhr.status === 200) {
      that._context.decodeAudioData(
          xhr.response,
          function(audioBuffer) {
            that._updateProgress(taskId, audioBuffer);
          },
          function(errorMessage) {
            that._updateProgress(taskId, null);
            const message = 'BufferList: decoding "' +
                that._bufferData[taskId] + '" failed. (' + errorMessage + ')';
            that._rejectHandler(message);
            Utils.log(message);
          });
    } else {
      const message = 'BufferList: XHR error while loading "' +
          that._bufferData[taskId] + '". (' + xhr.status + ' ' +
          xhr.statusText + ')';
      that._rejectHandler(message);
      Utils.log(message);
    }
  };
  xhr.onerror = function(event) {
    that._updateProgress(taskId, null);
    that._rejectHandler();
    Utils.log(
        'BufferList: XHR network failed on loading "' +
        that._bufferData[taskId] + '".');
  };
  xhr.send();
};
BufferList.prototype._updateProgress = function(taskId, audioBuffer) {
  this._bufferList[taskId] = audioBuffer;
  if (this._options.verbose) {
    const messageString = this._options.dataType === BufferDataType.BASE64
        ? 'ArrayBuffer(' + taskId + ') from Base64-encoded HRIR'
        : '"' + this._bufferData[taskId] + '"';
    Utils.log('BufferList: ' + messageString + ' successfully loaded.');
  }
  if (--this._numberOfTasks === 0) {
    const messageString = this._options.dataType === BufferDataType.BASE64
        ? this._bufferData.length + ' AudioBuffers from Base64-encoded HRIRs'
        : this._bufferData.length + ' files via XHR';
    Utils.log('BufferList: ' + messageString + ' loaded successfully.');
    this._resolveHandler(this._bufferList);
  }
};

const ChannelMap = {
  DEFAULT: [0, 1, 2, 3],
  SAFARI: [2, 0, 1, 3],
  FUMA: [0, 3, 1, 2],
};
function FOARouter(context, channelMap) {
  this._context = context;
  this._splitter = this._context.createChannelSplitter(4);
  this._merger = this._context.createChannelMerger(4);
  this.input = this._splitter;
  this.output = this._merger;
  this.setChannelMap(channelMap || ChannelMap.DEFAULT);
}
FOARouter.prototype.setChannelMap = function(channelMap) {
  if (!Array.isArray(channelMap)) {
    return;
  }
  this._channelMap = channelMap;
  this._splitter.disconnect();
  this._splitter.connect(this._merger, 0, this._channelMap[0]);
  this._splitter.connect(this._merger, 1, this._channelMap[1]);
  this._splitter.connect(this._merger, 2, this._channelMap[2]);
  this._splitter.connect(this._merger, 3, this._channelMap[3]);
};
FOARouter.ChannelMap = ChannelMap;

function FOARotator(context) {
  this._context = context;
  this._splitter = this._context.createChannelSplitter(4);
  this._inY = this._context.createGain();
  this._inZ = this._context.createGain();
  this._inX = this._context.createGain();
  this._m0 = this._context.createGain();
  this._m1 = this._context.createGain();
  this._m2 = this._context.createGain();
  this._m3 = this._context.createGain();
  this._m4 = this._context.createGain();
  this._m5 = this._context.createGain();
  this._m6 = this._context.createGain();
  this._m7 = this._context.createGain();
  this._m8 = this._context.createGain();
  this._outY = this._context.createGain();
  this._outZ = this._context.createGain();
  this._outX = this._context.createGain();
  this._merger = this._context.createChannelMerger(4);
  this._splitter.connect(this._inY, 1);
  this._splitter.connect(this._inZ, 2);
  this._splitter.connect(this._inX, 3);
  this._inY.gain.value = -1;
  this._inX.gain.value = -1;
  this._inY.connect(this._m0);
  this._inY.connect(this._m1);
  this._inY.connect(this._m2);
  this._inZ.connect(this._m3);
  this._inZ.connect(this._m4);
  this._inZ.connect(this._m5);
  this._inX.connect(this._m6);
  this._inX.connect(this._m7);
  this._inX.connect(this._m8);
  this._m0.connect(this._outY);
  this._m1.connect(this._outZ);
  this._m2.connect(this._outX);
  this._m3.connect(this._outY);
  this._m4.connect(this._outZ);
  this._m5.connect(this._outX);
  this._m6.connect(this._outY);
  this._m7.connect(this._outZ);
  this._m8.connect(this._outX);
  this._splitter.connect(this._merger, 0, 0);
  this._outY.connect(this._merger, 0, 1);
  this._outZ.connect(this._merger, 0, 2);
  this._outX.connect(this._merger, 0, 3);
  this._outY.gain.value = -1;
  this._outX.gain.value = -1;
  this.setRotationMatrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
  this.input = this._splitter;
  this.output = this._merger;
}
FOARotator.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  this._m0.gain.value = rotationMatrix3[0];
  this._m1.gain.value = rotationMatrix3[1];
  this._m2.gain.value = rotationMatrix3[2];
  this._m3.gain.value = rotationMatrix3[3];
  this._m4.gain.value = rotationMatrix3[4];
  this._m5.gain.value = rotationMatrix3[5];
  this._m6.gain.value = rotationMatrix3[6];
  this._m7.gain.value = rotationMatrix3[7];
  this._m8.gain.value = rotationMatrix3[8];
};
FOARotator.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  this._m0.gain.value = rotationMatrix4[0];
  this._m1.gain.value = rotationMatrix4[1];
  this._m2.gain.value = rotationMatrix4[2];
  this._m3.gain.value = rotationMatrix4[4];
  this._m4.gain.value = rotationMatrix4[5];
  this._m5.gain.value = rotationMatrix4[6];
  this._m6.gain.value = rotationMatrix4[8];
  this._m7.gain.value = rotationMatrix4[9];
  this._m8.gain.value = rotationMatrix4[10];
};
FOARotator.prototype.getRotationMatrix3 = function () {
  const rotationMatrix3 = new Float32Array(9);
  rotationMatrix3[0] = this._m0.gain.value;
  rotationMatrix3[1] = this._m1.gain.value;
  rotationMatrix3[2] = this._m2.gain.value;
  rotationMatrix3[3] = this._m3.gain.value;
  rotationMatrix3[4] = this._m4.gain.value;
  rotationMatrix3[5] = this._m5.gain.value;
  rotationMatrix3[6] = this._m6.gain.value;
  rotationMatrix3[7] = this._m7.gain.value;
  rotationMatrix3[8] = this._m8.gain.value;
  return rotationMatrix3;
};
FOARotator.prototype.getRotationMatrix4 = function() {
  const rotationMatrix4 = new Float32Array(16);
  rotationMatrix4[0] = this._m0.gain.value;
  rotationMatrix4[1] = this._m1.gain.value;
  rotationMatrix4[2] = this._m2.gain.value;
  rotationMatrix4[4] = this._m3.gain.value;
  rotationMatrix4[5] = this._m4.gain.value;
  rotationMatrix4[6] = this._m5.gain.value;
  rotationMatrix4[8] = this._m6.gain.value;
  rotationMatrix4[9] = this._m7.gain.value;
  rotationMatrix4[10] = this._m8.gain.value;
  return rotationMatrix4;
};

function FOAConvolver(context, hrirBufferList) {
  this._context = context;
  this._active = false;
  this._isBufferLoaded = false;
  this._buildAudioGraph();
  if (hrirBufferList) {
    this.setHRIRBufferList(hrirBufferList);
  }
  this.enable();
}
FOAConvolver.prototype._buildAudioGraph = function() {
  this._splitterWYZX = this._context.createChannelSplitter(4);
  this._mergerWY = this._context.createChannelMerger(2);
  this._mergerZX = this._context.createChannelMerger(2);
  this._convolverWY = this._context.createConvolver();
  this._convolverZX = this._context.createConvolver();
  this._splitterWY = this._context.createChannelSplitter(2);
  this._splitterZX = this._context.createChannelSplitter(2);
  this._inverter = this._context.createGain();
  this._mergerBinaural = this._context.createChannelMerger(2);
  this._summingBus = this._context.createGain();
  this._splitterWYZX.connect(this._mergerWY, 0, 0);
  this._splitterWYZX.connect(this._mergerWY, 1, 1);
  this._splitterWYZX.connect(this._mergerZX, 2, 0);
  this._splitterWYZX.connect(this._mergerZX, 3, 1);
  this._mergerWY.connect(this._convolverWY);
  this._mergerZX.connect(this._convolverZX);
  this._convolverWY.connect(this._splitterWY);
  this._convolverZX.connect(this._splitterZX);
  this._splitterWY.connect(this._mergerBinaural, 0, 0);
  this._splitterWY.connect(this._mergerBinaural, 0, 1);
  this._splitterWY.connect(this._mergerBinaural, 1, 0);
  this._splitterWY.connect(this._inverter, 1, 0);
  this._inverter.connect(this._mergerBinaural, 0, 1);
  this._splitterZX.connect(this._mergerBinaural, 0, 0);
  this._splitterZX.connect(this._mergerBinaural, 0, 1);
  this._splitterZX.connect(this._mergerBinaural, 1, 0);
  this._splitterZX.connect(this._mergerBinaural, 1, 1);
  this._convolverWY.normalize = false;
  this._convolverZX.normalize = false;
  this._inverter.gain.value = -1;
  this.input = this._splitterWYZX;
  this.output = this._summingBus;
};
FOAConvolver.prototype.setHRIRBufferList = function(hrirBufferList) {
  if (this._isBufferLoaded) {
    return;
  }
  this._convolverWY.buffer = hrirBufferList[0];
  this._convolverZX.buffer = hrirBufferList[1];
  this._isBufferLoaded = true;
};
FOAConvolver.prototype.enable = function() {
  this._mergerBinaural.connect(this._summingBus);
  this._active = true;
};
FOAConvolver.prototype.disable = function() {
  this._mergerBinaural.disconnect();
  this._active = false;
};

const OmnitoneFOAHrirBase64 = [
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wIA9v8QAPv/CwD+/wcA/v8MAP//AQD7/wEACAAEAPj/+v8YABAA7v/n//v/9P/M/8D//f34/R38EvzxAfEBtA2lDTcBJQFJ9T71FP0D/cD1tfVo/Wv9uPTO9PPmOufc/U/+agL3Aisc/RxuGKEZBv3j/iYMzQ2gAzsEQQUABiQFrASzA5cB2QmyCy0AtgR4AeYGtfgAA2j5OQHP+scArPsMBJgEggIEBtz6+QVq/pj/aPg8BPP3gQEi+jEAof0fA1v9+/7S+8IBjvwd/xD4IADL/Pf9zvs+/l3+wgB7/+L+7fzFADH9kf6A+n3+DP6+/TP9xP68/pn+w/26/i39YgA0/u790Pt9/kD+7v1s/Wb+8f4C/1P+pf/x/cT+6/3p/Xz9ff5F/0f9G/4r/6v/4P5L/sL+ff7c/pj+Ov7X/UT+9P5G/oz+6v6A/2D+9/6P/8r/bP7m/ij+C//e/tj/Gf4e/9v+FwDP/lz/sP7F/2H+rv/G/s7/Hf7y/4P+NAD9/k0AK/6w/zP/hACh/sX/gf44AOP+dgCm/iUAk/5qAOD+PwC+/jEAWP4CAAr/bQBw/vv/zf5iACD/OgCS/uD/Cv9oAAb/CgDK/kwA//5tACH/TgCg/h4AHP9aABP/JADP/hEAYv9gAAj/3f8m/ysAYv8gACX/8/8k/ysAXv8bABH//v8j/ygAa/8qAAD/9f9g/1YAWf8JACH/AgB2/z4AXP/w/z3/FgB2/ykAX//9/z//EwCV/zUAS//n/1T/GACK/x4ATv/0/4P/QQB4//v/WP/2/3X/HAB8//P/V//3/2f/AQBh/9v/Tf/x/5P/IwCI/wMAf/8hAKP/JACZ/xUAiv8nAK//HgCr/yMAm/8uAMz/OACi/yQAqf87AMT/MwCY/yUAtP9FAMH/KgCu/ycAyP85AMv/IwCz/xoA1f8qAMn/FgC8/xQA4/8nAMX/CwDJ/xQA4f8ZAMH/BgDO/xQA4f8WAMP/BwDU/xQA4P8QAMH/AQDb/xQA3P8JAMP/AgDh/xIA2v8EAMj/AgDk/w0A1f/+/8v/AwDm/wwA0v/+/9H/BgDl/wkAzv/8/9T/BwDk/wcAzv/8/9r/CQDi/wQAzf/8/9//CADf////0P/9/+L/BwDd//7/0////+T/BgDb//z/1f8AAOf/BQDZ//v/2v8CAOb/AwDY//v/3v8EAOb/AgDY//3/4f8FAOX/AQDZ//7/5P8GAOP/AADb/wAA5/8GAOH////d/wIA5/8FAOD////f/wMA6P8FAOD////h/wQA6P8EAN7////h/wUA4v8DANv/AQDd/wQA3P8CANn/AgDb/wMA2/8CANv/AgDd/wIA3v8CAOH/AQDj/wEA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAAAA/f8CAP//AQD//wEA//8BAP3/AAACAP7/+f8AAAIA/P8FAAQA8/8AABoA+f/V/wQAHQDO/xoAQQBO/ocA0Px1/ucHW/4UCm8HLO6kAjv8/fCRDdAAYfPiBIgFXveUCM0GBvh6/nz7rf0J/QcQSRVdBgoBSgFR62r9NP8m+LoEAvriBVAAiAPmABEGMf2l+SwBjva6/G4A//8P/CYDMgXm/R0CKAE6/fcBBwAtAND+kQA0A5UDhwFs/8IB8fydAEP/A/8v/e7/mP8j/2YBIwE3Av0AYv+uAOD8lgAg/wwAIf/L/n0Ae//OAJMB3P/XAF//XwCM/08AB/8NAEf/rf4jAT3/lgAJAP4AHgDpAO8AUf9L/07/Qf8KAOD/x/+D/3sATQCDAMoA0f79/+L/EQDt/7EAqv+S/7IAuv/o/wgAc//X//H/SwCm/+3/Yf/B/yoAAADI/7X/AwBg/5EATgCX/xYA/P+q/00AVACY/6v/BADD/zwALQCN/8z/KQDu/ygAEgCZ/6f/VQDC//T/KQCs/7P/UgAfAO7/NgC8/57/awAZAPP/+P/V/8z/bQBBAL//DgD0/+T/TABBAMz/CwAxAPz/SQBqALn/BgALAPz/EAA7AIz/3/8iAAUA//8kALf/y/9VABQA+v81AOj/0P9cAB4A+f8WAOr/vv83ABgAw/8JAOj/4f8nACIAsf/y/w4A3v8gACQAxP/n/ycA7P8WAC0Ayf/U/ycA9v/7/yUA0P/P/zUABADc/xUA5P/J/zcACwDS/xUA9P/m/zAACQDX/+3/9v/2/yQACgDZ/+P/AwAKABYA///b/9j/EQALABkADgD6/+7/GwD4/w4A8P/w//j/EgAEAAUA9f/1/wQAGgD4/wAA5////wAAGQD1////7f8FAAUAFQDv/wAA6v8LAAcAFQDs/wEA9P8SAAYACwDr//7/AQASAAYABQDv/wIAAwAWAAIAAgDv/wAABgATAAEA/f/u/wQABgAQAPr/+P/z/wUACQALAPj/9//4/wgABwAKAPT/+f/5/w4ABwAIAPT/+//9/w4AAwADAPH//f///w8A//8BAPP///8BAA0A/f/+//X/AgACAA0A+//8//b/BAADAAoA+f/7//n/BgADAAcA+P/7//v/BwABAAQA+P/8//3/CQABAAIA9//9////CQD/////+P///wAACAD9//7/+f8AAAAABwD8//3/+v8CAAAABgD7//z//P8EAAAABAD6//3//P8FAP//AgD6//7//v8FAP7/AQD7//////8GAP7/AAD7/wEA//8EAP3/AAD9/wEA/v8DAP3/AAD9/wIA/v8CAP3/AQD9/wIA/v8CAP7/AQD+/wEA",
];

const RenderingMode = {
  AMBISONIC: 'ambisonic',
  BYPASS: 'bypass',
  OFF: 'off',
};
function FOARenderer(context, config) {
  this._context = Utils.isAudioContext(context) ?
      context :
      Utils.throw('FOARenderer: Invalid BaseAudioContext.');
  this._config = {
    channelMap: FOARouter.ChannelMap.DEFAULT,
    renderingMode: RenderingMode.AMBISONIC,
  };
  if (config) {
    if (config.channelMap) {
      if (Array.isArray(config.channelMap) && config.channelMap.length === 4) {
        this._config.channelMap = config.channelMap;
      } else {
        Utils.throw(
            'FOARenderer: Invalid channel map. (got ' + config.channelMap
            + ')');
      }
    }
    if (config.hrirPathList) {
      if (Array.isArray(config.hrirPathList) &&
          config.hrirPathList.length === 2) {
        this._config.pathList = config.hrirPathList;
      } else {
        Utils.throw(
            'FOARenderer: Invalid HRIR URLs. It must be an array with ' +
            '2 URLs to HRIR files. (got ' + config.hrirPathList + ')');
      }
    }
    if (config.renderingMode) {
      if (Object.values(RenderingMode).includes(config.renderingMode)) {
        this._config.renderingMode = config.renderingMode;
      } else {
        Utils.log(
            'FOARenderer: Invalid rendering mode order. (got' +
            config.renderingMode + ') Fallbacks to the mode "ambisonic".');
      }
    }
  }
  this._buildAudioGraph();
  this._tempMatrix4 = new Float32Array(16);
  this._isRendererReady = false;
}
FOARenderer.prototype._buildAudioGraph = function() {
  this.input = this._context.createGain();
  this.output = this._context.createGain();
  this._bypass = this._context.createGain();
  this._foaRouter = new FOARouter(this._context, this._config.channelMap);
  this._foaRotator = new FOARotator(this._context);
  this._foaConvolver = new FOAConvolver(this._context);
  this.input.connect(this._foaRouter.input);
  this.input.connect(this._bypass);
  this._foaRouter.output.connect(this._foaRotator.input);
  this._foaRotator.output.connect(this._foaConvolver.input);
  this._foaConvolver.output.connect(this.output);
  this.input.channelCount = 4;
  this.input.channelCountMode = 'explicit';
  this.input.channelInterpretation = 'discrete';
};
FOARenderer.prototype._initializeCallback = function(resolve, reject) {
  const bufferList = this._config.pathList
      ? new BufferList(this._context, this._config.pathList, {dataType: 'url'})
      : new BufferList(this._context, OmnitoneFOAHrirBase64);
  bufferList.load().then(
      function(hrirBufferList) {
        this._foaConvolver.setHRIRBufferList(hrirBufferList);
        this.setRenderingMode(this._config.renderingMode);
        this._isRendererReady = true;
        Utils.log('FOARenderer: HRIRs loaded successfully. Ready.');
        resolve();
      }.bind(this),
      function() {
        const errorMessage = 'FOARenderer: HRIR loading/decoding failed.';
        reject(errorMessage);
        Utils.throw(errorMessage);
      });
};
FOARenderer.prototype.initialize = function() {
  Utils.log(
      'FOARenderer: Initializing... (mode: ' + this._config.renderingMode +
      ')');
  return new Promise(this._initializeCallback.bind(this));
};
FOARenderer.prototype.setChannelMap = function(channelMap) {
  if (!this._isRendererReady) {
    return;
  }
  if (channelMap.toString() !== this._config.channelMap.toString()) {
    Utils.log(
        'Remapping channels ([' + this._config.channelMap.toString() +
        '] -> [' + channelMap.toString() + ']).');
    this._config.channelMap = channelMap.slice();
    this._foaRouter.setChannelMap(this._config.channelMap);
  }
};
FOARenderer.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  if (!this._isRendererReady) {
    return;
  }
  this._foaRotator.setRotationMatrix3(rotationMatrix3);
};
FOARenderer.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  if (!this._isRendererReady) {
    return;
  }
  this._foaRotator.setRotationMatrix4(rotationMatrix4);
};
FOARenderer.prototype.setRotationMatrixFromCamera = function(cameraMatrix) {
  if (!this._isRendererReady) {
    return;
  }
  Utils.invertMatrix4(this._tempMatrix4, cameraMatrix.elements);
  this._foaRotator.setRotationMatrix4(this._tempMatrix4);
};
FOARenderer.prototype.setRenderingMode = function(mode) {
  if (mode === this._config.renderingMode) {
    return;
  }
  switch (mode) {
    case RenderingMode.AMBISONIC:
      this._foaConvolver.enable();
      this._bypass.disconnect();
      break;
    case RenderingMode.BYPASS:
      this._foaConvolver.disable();
      this._bypass.connect(this.output);
      break;
    case RenderingMode.OFF:
      this._foaConvolver.disable();
      this._bypass.disconnect();
      break;
    default:
      Utils.log(
          'FOARenderer: Rendering mode "' + mode + '" is not ' +
          'supported.');
      return;
  }
  this._config.renderingMode = mode;
  Utils.log('FOARenderer: Rendering mode changed. (' + mode + ')');
};

function HOAConvolver(context, ambisonicOrder, hrirBufferList) {
  this._context = context;
  this._active = false;
  this._isBufferLoaded = false;
  this._ambisonicOrder = ambisonicOrder;
  this._numberOfChannels =
      (this._ambisonicOrder + 1) * (this._ambisonicOrder + 1);
  this._buildAudioGraph();
  if (hrirBufferList) {
    this.setHRIRBufferList(hrirBufferList);
  }
  this.enable();
}
HOAConvolver.prototype._buildAudioGraph = function() {
  const numberOfStereoChannels = Math.ceil(this._numberOfChannels / 2);
  this._inputSplitter =
      this._context.createChannelSplitter(this._numberOfChannels);
  this._stereoMergers = [];
  this._convolvers = [];
  this._stereoSplitters = [];
  this._positiveIndexSphericalHarmonics = this._context.createGain();
  this._negativeIndexSphericalHarmonics = this._context.createGain();
  this._inverter = this._context.createGain();
  this._binauralMerger = this._context.createChannelMerger(2);
  this._outputGain = this._context.createGain();
  for (let i = 0; i < numberOfStereoChannels; ++i) {
    this._stereoMergers[i] = this._context.createChannelMerger(2);
    this._convolvers[i] = this._context.createConvolver();
    this._stereoSplitters[i] = this._context.createChannelSplitter(2);
    this._convolvers[i].normalize = false;
  }
  for (let l = 0; l <= this._ambisonicOrder; ++l) {
    for (let m = -l; m <= l; m++) {
      const acnIndex = l * l + l + m;
      const stereoIndex = Math.floor(acnIndex / 2);
      this._inputSplitter.connect(
          this._stereoMergers[stereoIndex], acnIndex, acnIndex % 2);
      this._stereoMergers[stereoIndex].connect(this._convolvers[stereoIndex]);
      this._convolvers[stereoIndex].connect(this._stereoSplitters[stereoIndex]);
      if (m >= 0) {
        this._stereoSplitters[stereoIndex].connect(
            this._positiveIndexSphericalHarmonics, acnIndex % 2);
      } else {
        this._stereoSplitters[stereoIndex].connect(
            this._negativeIndexSphericalHarmonics, acnIndex % 2);
      }
    }
  }
  this._positiveIndexSphericalHarmonics.connect(this._binauralMerger, 0, 0);
  this._positiveIndexSphericalHarmonics.connect(this._binauralMerger, 0, 1);
  this._negativeIndexSphericalHarmonics.connect(this._binauralMerger, 0, 0);
  this._negativeIndexSphericalHarmonics.connect(this._inverter);
  this._inverter.connect(this._binauralMerger, 0, 1);
  this._inverter.gain.value = -1;
  this.input = this._inputSplitter;
  this.output = this._outputGain;
};
HOAConvolver.prototype.setHRIRBufferList = function(hrirBufferList) {
  if (this._isBufferLoaded) {
    return;
  }
  for (let i = 0; i < hrirBufferList.length; ++i) {
    this._convolvers[i].buffer = hrirBufferList[i];
  }
  this._isBufferLoaded = true;
};
HOAConvolver.prototype.enable = function() {
  this._binauralMerger.connect(this._outputGain);
  this._active = true;
};
HOAConvolver.prototype.disable = function() {
  this._binauralMerger.disconnect();
  this._active = false;
};

function getKroneckerDelta(i, j) {
  return i === j ? 1 : 0;
}
function setCenteredElement(matrix, l, i, j, gainValue) {
  const index = (j + l) * (2 * l + 1) + (i + l);
  matrix[l - 1][index].gain.value = gainValue;
}
function getCenteredElement(matrix, l, i, j) {
  const index = (j + l) * (2 * l + 1) + (i + l);
  return matrix[l - 1][index].gain.value;
}
function getP(matrix, i, a, b, l) {
  if (b === l) {
    return getCenteredElement(matrix, 1, i, 1) *
        getCenteredElement(matrix, l - 1, a, l - 1) -
        getCenteredElement(matrix, 1, i, -1) *
        getCenteredElement(matrix, l - 1, a, -l + 1);
  } else if (b === -l) {
    return getCenteredElement(matrix, 1, i, 1) *
        getCenteredElement(matrix, l - 1, a, -l + 1) +
        getCenteredElement(matrix, 1, i, -1) *
        getCenteredElement(matrix, l - 1, a, l - 1);
  } else {
    return getCenteredElement(matrix, 1, i, 0) *
        getCenteredElement(matrix, l - 1, a, b);
  }
}
function getU(matrix, m, n, l) {
  return getP(matrix, 0, m, n, l);
}
function getV(matrix, m, n, l) {
  if (m === 0) {
    return getP(matrix, 1, 1, n, l) + getP(matrix, -1, -1, n, l);
  } else if (m > 0) {
    const d = getKroneckerDelta(m, 1);
    return getP(matrix, 1, m - 1, n, l) * Math.sqrt(1 + d) -
        getP(matrix, -1, -m + 1, n, l) * (1 - d);
  } else {
    const d = getKroneckerDelta(m, -1);
    return getP(matrix, 1, m + 1, n, l) * (1 - d) +
        getP(matrix, -1, -m - 1, n, l) * Math.sqrt(1 + d);
  }
}
function getW(matrix, m, n, l) {
  if (m === 0) {
    return 0;
  }
  return m > 0 ? getP(matrix, 1, m + 1, n, l) + getP(matrix, -1, -m - 1, n, l) :
                 getP(matrix, 1, m - 1, n, l) - getP(matrix, -1, -m + 1, n, l);
}
function computeUVWCoeff(m, n, l) {
  const d = getKroneckerDelta(m, 0);
  const reciprocalDenominator =
      Math.abs(n) === l ? 1 / (2 * l * (2 * l - 1)) : 1 / ((l + n) * (l - n));
  return [
    Math.sqrt((l + m) * (l - m) * reciprocalDenominator),
    0.5 * (1 - 2 * d) * Math.sqrt((1 + d) *
                                  (l + Math.abs(m) - 1) *
                                  (l + Math.abs(m)) *
                                  reciprocalDenominator),
    -0.5 * (1 - d) * Math.sqrt((l - Math.abs(m) - 1) * (l - Math.abs(m))) *
        reciprocalDenominator,
  ];
}
function computeBandRotation(matrix, l) {
  for (let m = -l; m <= l; m++) {
    for (let n = -l; n <= l; n++) {
      const uvwCoefficients = computeUVWCoeff(m, n, l);
      if (Math.abs(uvwCoefficients[0]) > 0) {
        uvwCoefficients[0] *= getU(matrix, m, n, l);
      }
      if (Math.abs(uvwCoefficients[1]) > 0) {
        uvwCoefficients[1] *= getV(matrix, m, n, l);
      }
      if (Math.abs(uvwCoefficients[2]) > 0) {
        uvwCoefficients[2] *= getW(matrix, m, n, l);
      }
      setCenteredElement(
          matrix, l, m, n,
          uvwCoefficients[0] + uvwCoefficients[1] + uvwCoefficients[2]);
    }
  }
}
function computeHOAMatrices(matrix) {
  for (let i = 2; i <= matrix.length; i++) {
    computeBandRotation(matrix, i);
  }
}
function HOARotator(context, ambisonicOrder) {
  this._context = context;
  this._ambisonicOrder = ambisonicOrder;
  const numberOfChannels = (ambisonicOrder + 1) * (ambisonicOrder + 1);
  this._splitter = this._context.createChannelSplitter(numberOfChannels);
  this._merger = this._context.createChannelMerger(numberOfChannels);
  this._gainNodeMatrix = [];
  let orderOffset;
  let rows;
  let inputIndex;
  let outputIndex;
  let matrixIndex;
  for (let i = 1; i <= ambisonicOrder; i++) {
    orderOffset = i * i;
    rows = (2 * i + 1);
    this._gainNodeMatrix[i - 1] = [];
    for (let j = 0; j < rows; j++) {
      inputIndex = orderOffset + j;
      for (let k = 0; k < rows; k++) {
        outputIndex = orderOffset + k;
        matrixIndex = j * rows + k;
        this._gainNodeMatrix[i - 1][matrixIndex] = this._context.createGain();
        this._splitter.connect(
            this._gainNodeMatrix[i - 1][matrixIndex], inputIndex);
        this._gainNodeMatrix[i - 1][matrixIndex].connect(
            this._merger, 0, outputIndex);
      }
    }
  }
  this._splitter.connect(this._merger, 0, 0);
  this.setRotationMatrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
  this.input = this._splitter;
  this.output = this._merger;
}
HOARotator.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  this._gainNodeMatrix[0][0].gain.value = rotationMatrix3[0];
  this._gainNodeMatrix[0][1].gain.value = rotationMatrix3[1];
  this._gainNodeMatrix[0][2].gain.value = rotationMatrix3[2];
  this._gainNodeMatrix[0][3].gain.value = rotationMatrix3[3];
  this._gainNodeMatrix[0][4].gain.value = rotationMatrix3[4];
  this._gainNodeMatrix[0][5].gain.value = rotationMatrix3[5];
  this._gainNodeMatrix[0][6].gain.value = rotationMatrix3[6];
  this._gainNodeMatrix[0][7].gain.value = rotationMatrix3[7];
  this._gainNodeMatrix[0][8].gain.value = rotationMatrix3[8];
  computeHOAMatrices(this._gainNodeMatrix);
};
HOARotator.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  this._gainNodeMatrix[0][0].gain.value = rotationMatrix4[0];
  this._gainNodeMatrix[0][1].gain.value = rotationMatrix4[1];
  this._gainNodeMatrix[0][2].gain.value = rotationMatrix4[2];
  this._gainNodeMatrix[0][3].gain.value = rotationMatrix4[4];
  this._gainNodeMatrix[0][4].gain.value = rotationMatrix4[5];
  this._gainNodeMatrix[0][5].gain.value = rotationMatrix4[6];
  this._gainNodeMatrix[0][6].gain.value = rotationMatrix4[8];
  this._gainNodeMatrix[0][7].gain.value = rotationMatrix4[9];
  this._gainNodeMatrix[0][8].gain.value = rotationMatrix4[10];
  computeHOAMatrices(this._gainNodeMatrix);
};
HOARotator.prototype.getRotationMatrix3 = function() {
  const rotationMatrix3 = new Float32Array(9);
  rotationMatrix3[0] = this._gainNodeMatrix[0][0].gain.value;
  rotationMatrix3[1] = this._gainNodeMatrix[0][1].gain.value;
  rotationMatrix3[2] = this._gainNodeMatrix[0][2].gain.value;
  rotationMatrix3[3] = this._gainNodeMatrix[0][3].gain.value;
  rotationMatrix3[4] = this._gainNodeMatrix[0][4].gain.value;
  rotationMatrix3[5] = this._gainNodeMatrix[0][5].gain.value;
  rotationMatrix3[6] = this._gainNodeMatrix[0][6].gain.value;
  rotationMatrix3[7] = this._gainNodeMatrix[0][7].gain.value;
  rotationMatrix3[8] = this._gainNodeMatrix[0][8].gain.value;
  return rotationMatrix3;
};
HOARotator.prototype.getRotationMatrix4 = function() {
  const rotationMatrix4 = new Float32Array(16);
  rotationMatrix4[0] = this._gainNodeMatrix[0][0].gain.value;
  rotationMatrix4[1] = this._gainNodeMatrix[0][1].gain.value;
  rotationMatrix4[2] = this._gainNodeMatrix[0][2].gain.value;
  rotationMatrix4[4] = this._gainNodeMatrix[0][3].gain.value;
  rotationMatrix4[5] = this._gainNodeMatrix[0][4].gain.value;
  rotationMatrix4[6] = this._gainNodeMatrix[0][5].gain.value;
  rotationMatrix4[8] = this._gainNodeMatrix[0][6].gain.value;
  rotationMatrix4[9] = this._gainNodeMatrix[0][7].gain.value;
  rotationMatrix4[10] = this._gainNodeMatrix[0][8].gain.value;
  return rotationMatrix4;
};
HOARotator.prototype.getAmbisonicOrder = function() {
  return this._ambisonicOrder;
};

const OmnitoneTOAHrirBase64 = [
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wQA8/8YAP3/CgACAAAA//8CAAYA8/8AAPH/CgDv/97/e/+y/9P+UQDwAHUBEwV7/pP8P/y09bsDwAfNBGYIFf/Y+736+fP890Hv8AGcC3T/vwYy+S70AAICA3AD4AagBw0R4w3ZEAcN8RVYAV8Q8P2z+kECHwdK/jIG0QNKAYUElf8IClj7BgjX+/f8j/l3/5f/6fkK+xz8FP0v/nj/Mf/n/FcBPfvH/1H3+gBP/Hf8cfiCAR/54QBh+UQAcvkzAWL8TP13+iD/V/73+wv9Kv+Y/hv+xPz7/UL83//a/z/9AP6R/5L+jf26/P3+rP26/tD8nP7B/Pv+WP1V/sP9gv91/3P9xP3J/nv/GP5S/sb+IP8v/9j/dv7U/pr+6v+u/Z3/sv5cAOr9Q/83/+n/zP5x/57+2//k/nwA/v01//L+SACB/sD/Ff81AJT+TgDp/ocAm/5dAFT+MgD+/pMAW/7o/yH/xQDA/kkA9P6LAL3+pAC0/iQAz/5UALD+UwAt/3UAhf4UAA//pwC+/joAz/5aAAv/fwDY/iMAIf+uAPP+ZAAc/0QAy/4xAB7/TgDs/goADP8wAEL/NwDo/ub/Uf9BAC3/+v9F/y4ARP9HAFP/EQA3/xMATP81AG3/HQAu/wgAaP9FACb/9f9B/y0AUP8rAED/CwBV/z4AW/8TAGH/BQBK/xsAfv8eAFn/AgB3/zwAff8RAGj//v+E/yAAb//0/3n/FwBz/xcAiv8PAHn/FQCJ/xgAg//x/3j/EQCa/ycAff/w/47/HwCI//X/iv/7/43/JQCM/+n/kP8AAJb/JACj//7/oP8ZAML/SwCo/w4Atv8tAMb/PACr/xcAwP9HAMP/OADF/y4A0f9IANL/NwC//zEA0f9LAMb/MAC8/y4A3f9GAMH/FQDQ/yYA2/8sAMT/AwDX/xkA3v8SAM3/9v/c/w8A4f8LAMj/8f/h/xQA2P8CAMn/8//j/xQA0v/7/9H//P/i/xEA0v/1/9L//f/j/w0A0f/x/9f//v/k/wgAz//u/9z/AwDg/wMA0P/v/9//BQDf////0v/y/+D/CADc//3/0v/2/+L/CgDa//r/1v/5/+T/CgDY//j/2f/9/+T/CADY//f/3P8AAOT/BwDY//f/4P8EAOP/BADZ//j/4v8GAOL/AwDa//r/5f8IAOH/AQDc//3/5v8JAOD//v/f////5v8IAOD//v/h/wIA5/8HAOD//f/j/wMA5/8GAOD//f/l/wYA5v8EAOD//v/m/wYA5f8CAOL////n/wYA5P8BAOH/AADl/wUA4f///+H/AQDk/wMA4f///+T/AQDm/wEA5////+r/AADt/wAA7/////P/AAD1////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////v///wAAAAAAAAAAAQAAAAAA///9/wAABAD+//n/AgAJAAAA+v/+//f/DAAdAPv/+v+l/8L+jf/4/vgAdwVPAQACLQBo+Qj/Ev7o/N3/VgCbA08Bxf+L+yn9J/2HCU8FmgBvDe30Rv5h/LT09gi5CxkA5gOi8/30kwEM+4YJMf2nBmkJJAQQBLoFtvvv+m4A7PF6/R0Bif3qAuf8WARAAf4GyABG/BIAwvr4Acv8U//c/yIC8AEn/B8Daf2CAgMBAf3MAN38vgLK/UT/QwCyAPYClPyvAW/+pQAoASD+zP+R/IYC1f7C/nEBQP96AZb+1QAIAM//yQE7/tkAZ/7TAXL/w/8+AIsAtwB7/24A4v9a/z4A7v4iADb/dwCj/23/kgBOANUAIv8lAKEAxP9gAK7/BwCP/5kA7/9v/0wAzv9DAGT/3/9vAHv/6P+q/xUA7P8XAO//uv/g/2UAEgCV/wEATADM/+7/+//j/+D/9v/i//j/IgD+/xoAxf/6/z4A5/+8/9D/QwDq/+3/OQDT/zUAIgA/APP/PgAjAPD/BwAGACAADAC3//b/HAA3AN//RgDN/w8AIAACAN//GQBDACEAIwA+ACoAJQAeAPz/KgAYAPr/DgAEABYAIgAcAMT/7f8OAOL/5P/2//L/9P8GAPT/7v/8/+7/6v/t//z/AgAUAOL//P8VAAMA4/8IAPb/+P8MAAoA5v8NAAsA9v///wEAAAD9//n/9/8JAAYA7v/6/wMA+f8GAAEA7f/7/xgACAD4/w8A///3/w0A+f8BAAIA/P/5/xIA///9//r/7v/+/xYACQD///H/CwDz/wEADgAHAPP/FADn/+3/AQD5//f/AgD7/wEABwAMAAEADQD8//n/8f8OAPX/BAD+//X/+v8WAAQA+f8CAAEA7/8QAAEA/P8DAAUA9f8KAAwA9v8DAAUA+f8OAAoA9f/7/w0A+v8EAAgA8P/6/woA+//8/wkA+P/3/woA+//8/wcA9//1/woAAwD5/wcA/P/3/w0AAwD3/wEABAD2/wkABgD3/wEABQD3/wUABQD3//v/BwD3/wMABQD3//r/CQD7////BQD6//n/CQD9//3/BAD9//j/BwAAAPv/AwD///j/BwABAPn/AQABAPn/BQACAPn///8DAPr/AwADAPr//v8EAPv/AQADAPv//P8FAP3///8DAPz/+/8FAP7//f8CAP7/+/8EAP///P8BAP//+/8DAAEA+/8AAAEA+/8CAAIA+////wIA/f8AAAIA/P/+/wIA/f8AAAIA/f/9/wMA/////wEA///+/wIA/////wAAAAD+/wAAAAD/////AAD//wAA//8AAP//AAD//wAA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD////////+//////8AAP////8AAP//AAAAAPz//f8IAAMA9////w4AAQD6/wwA8//+/y8Afv/0/2H/UP5gAbH+2QG1B2cAVAIh/l32FPyM/nACPQDV/+UEo/Q6AQwCu/oLD9kF8QJA/Uz+Wf2KCOcC+wUKBsL5aQBQ97rwOPiPAvn5CAl8AHEDkQPcAA8Bn/lIAdz7HQF1+xz9cAM4/94E4gDKAun+cgPYAYr9JgJr/bf+ivxz/MoBgv5UA8EBSgAQAJ7/UgEk/cQB7f63/sD/vf4XAhT/BQFCADYAnQGI/9EBtv3hALD/vP+c/3H/TgIN/1sBpf8yAP3/4f8qABr+1f8OAJ3/dwAGADEBnv9JAPz/IQBwAIH/jgAS/4wAsACTAOn/DQDCALn/ZQCSAAIAAwD1/9//jv9aADQA/v9EAB0AfgA8AAQACgB9APr/IAARAPT/5v9xACAABAAHAGUAt/89AC4ACgAjAMP/+v/9/xYA7f/1/+D/7P87AC0Auv8RAAcA9/8FAC8A2//y/xIAEwAaADQAJADp/zoAAgAfABIA2f/e/zUA+P/6/w4A9//A/zcA4//P//T/5f/R////EwDb/w4A8/8BABkANADh/xEA+f/0/wIAHADc//j/GwD1//f/GADs/+v/EAAAAPz/EgD3/+r/FgAMAAkAGAD9/+z/IQAQAPH/GQD3//z/CgAfAOX/AgD8//H/BAATAOv/+v///wIABAAdAOj/BQAPAAcAAQATAOz/8/8JAAkA6f8VAOv/+f8QABUA/v8OAO3/+P8KABUA9f8FAPv/5/8TAA0A7f8XAAkAAQAJABYA4/8WAAcACgANABEA7v8EAP7/AAD+/wMA9//7/xAAAQD8/wQA+f/7/wMABgDq/wAA+v/3/wYACQD1//3/BAD9/wgADgDw//r/AgD6/wEACADv//j/BQD///X/BwDu//j/AgACAPP/BAD2//n/BAAGAPb/BAD8//3/BQAJAPL/AwD+//3/BAAIAPP//f8DAPz/AAAGAPP/+/8CAP7//f8FAPX/+f8DAAAA/P8EAPf/+v8GAAMA+/8EAPv/+/8GAAQA+v8CAP///P8EAAUA+f8AAP///f8CAAUA+P///wEA/v8BAAUA+f/+/wIAAAD//wUA+v/9/wMAAQD9/wQA+//9/wMAAgD8/wMA/P/9/wMAAwD7/wEA/v/+/wIAAwD6/wEA///+/wAABAD6/wAAAQD//wAAAwD7////AQAAAP//AwD8//7/AgABAP3/AgD9//7/AQABAP3/AQD+//7/AAACAPz/AAD+//////8BAP3/AAD//wAA//8BAP7/AAD//wAA/v8AAP7/AAD//wAA//8AAP//",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////P/9//3//////wAAAAAAAAIAAgACAP//CAAEAEEA//+cAAUAb/8HAAH9+P9eARkAogQUAJn8BwCd/gX/+QQNAKoC9gFdAtb/b/vd/936TP/6AsD/nfqn/un1W/0dA8IEsQLvAJv2bP72+WMAkP8dAcX+nQO2AIr6bP/EABX+NgK/Bdj2IQv2AE4EUAiD/xQAnwIm/B0B/wGNAoH7sQaP/b8CiQakAqD+R/9xA477KQL//6r75v/O/pcCgQCtAiMCBQAkANAARwHf//39hgBl/kUAJgEtAUEATgA/AgoASADK/zUAJv29/vL+l/9c/0cAUwBBAE8A6QE5/87/Wv9NAOf+5v7P/5P/4/9BAKYAQwDD/zYB5v+r/zYATwAp/1v/WQAEAB0AhwA0AA0AIAA3AAEAzv/u/+//5v9m/zwAIADQ/8T/SABiANb/SwAbAFf/MQDX/7L/hP8TAPr/AgAMAAsAHwAZAI3/VgDC/9v/5//x/6P/AwBlAMv/yf82AB4A+P9WAPj/NwDi/1EA0v9JANj/JwAcAAEADABYANj/4f8MAEwAmP82AN//3P8UADYA7//6/wIACADU/ygAyv82AN7/9v/2/ygAxv/9/+3/5//n/zUA6//g/y4ADgD5/wsABwDv/xIADwAGACoAJQD3/zIA+/8FABsAFgDO/zAAHAAIABQALADp/xcACAAAAPH/GADs/wkACQAFAAgAFQDp/wIAHAD1//P/EQDw/+3/GAD9/+f/HAD8//T/DAAQAPH/HwD4//r/DwAPAOj/EQACAOn/DAAXAOX/BAAOANH/9/8MAO//9f8LANT/9f8EAO//6f8NANb/+P8KAOz/5v8MAOD/7f8UAO//7//+//7/9v8YAPj/9f/z/wsA+v8SAPD/+v/x/xYA+f8SAPb/9//3/xEABQACAPn/9//y/xQACQD///b//v/7/xIACQD9//H/AAD7/xEAAgD5//P/AwD9/w8AAgD3//D/BAD//wUA/v/0//D/BgADAAMA/P/2//f/BwAGAP7/+//2//j/CAAFAPv/+f/5//v/BwAHAPn/9//7//7/BQAFAPf/9//+/wEABAACAPf/+P8BAAIAAgAAAPj/9/8CAAMAAAD+//n/+f8EAAQA/v/8//r/+/8EAAMA/P/7//z//P8EAAIA/P/5//7//v8DAAEA+//5//////8CAAAA+//5/wEAAAABAP//+//6/wIAAQD///3//P/7/wMAAQD///3//f/9/wIAAQD9//3//v/9/wMAAQD9//z/AAD//wEAAAD9//z/AAAAAAAA///9//3/AAD//wAA/v////7/AAD//wAA////////AAD//wAA//8AAP//",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+////+f////v//v///wAA/////wUAAQAIAAIABwACAHkATAAOAaMAAf9C/9X6QvwhArAAtghABW37nv/y+0wAWQNcAE8JRwSOC6AEJe8P8S/zrPWaBI/+LQA/+0L+P/4K8AgAb/8uCh78BQtC614GaQWfAin5UfzN8Tf+GQizAZ4MCQMbGJ4BoRS7AvcHyQARA6n9ZwHZ/z4DvwAZAlAB6gbNAS4GFADFATL7E/2K+j37C/xp/SD9Uv0VAOsDs//WAd3+bv7F/f79mP2X/KH+FwC0/1n+VgFcATABHQGaAET+nf8Y/hoAovpqAXj9CQKW/lsCl/4RApj+bAHk/RcAlv4BAG/+DgDi//3/GwAOAEIAq/+y/3z/8v8+/7T/Tv8//27/mgDZ/1sA+P+cAAAA/P/i/yMAi/85AMP/KgDM/9MA9P+QABoA4QAiACwACwBdAP7/TQDb/y0Ayf+SAA0AZwDg/4wA+/8/AAMAgQDp/w0ADAAQAAoANgAgAA4AKABIAB4A4v/3/+f/+v/c/+n/EADn/wgAFAAqAOz/IwDc/9//3f8XAND/2v/a/w0A5v8BANb/9P/m/wAA8P8ZAN3/RwAGAEsABgB/AP7/NAASAEgABAA3AP3/KgD9/1sA8P8lAOr/FgD1/xAA4/8kAOv/AwD4/xEA5f8NAPT/+v/3/x8A7f8PAPj/IwD5/yAA9/8ZAAEAGgD4/xoA9f8HAAMACAD0/xgA+P8AAPr/IQDp/w4A8v8HAPX/IgD1/wYA+P8GAPX/GgD3/woABQASAAcAGQDw/+v/9P8bAP3/HADs/+f/7/8LAPr//v/0//T/AgD2/wsA6P///+P/CADY//7/5v/3/wQA/v8LAPD/GgD1/yMA/P8QAOv/LADw/yQA+P8XAO7/MQD9/yEAAQAcAPD/IgD9/xMA+/8OAO//FQABAAoA+/8PAPP/FQABAAQA9/8PAPX/CAADAAEA+P8NAPv/CAAGAAUA9/8JAP//AAAFAPz/+f8HAAQA/f8FAP3//P8FAAYA+P8DAP7/+/8AAAcA9/8BAP///f///wgA9//+/wAA/v/8/wUA9//8/wIA///7/wUA+v/7/wIAAAD6/wMA/P/6/wEAAQD6/wEA/v/7/wIAAgD6////AAD7/wEAAgD7//7/AQD8/wAAAwD8//3/AwD9/wAAAgD9//z/AwD/////AgD+//z/AwAAAP7/AQD///3/AgABAP3/AAAAAP3/AgACAPz///8BAP3/AQACAP3//v8BAP7/AAABAP3//v8CAP7///8BAP7//f8CAP////8AAAAA/v8CAAAAAAAAAAAA/v8BAAAAAAD//wAA//8AAP//AAD//wAA//8AAP//",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAP//AAD//wAA//8AAAAA/////wAAAQD+////AAAGAP3/OAABAIIAAwBv//f/E/0QAK0ADQCzA/7/8P4u/0cBDQCJA6ABbQDg/w7/z/9o+Vn/SPnL/1//Ef+2+jr9RfZgA5QFZwILDFj+PAb2/nEFKgKk/R0Dlv6b/FUDsP6YAoj9SgAT/iL/tAPwAv8A0P6zAr7/dwAnAf39uP22/skA2v///2YCoP4UAUsAZgF2AJH+4P70/rz9+f+U/Xv/8v7CAcb+TACS/kwAv/+x/tX9oP71/oL/1f8nAEUAZwGtAAgAIgC/AD4BaP8GAGH/dQDF/64Arf8nAakAhAH9/+kAQQD3AFb/q/8p/yIAR/8FAPD/ZAA/AIYA3v8tADQADQBp/3f/CwABAP3/Wf8OANj/WwDH/xoAe/8DAKz/zv96/z8A3f/J/5X/IAD5//j/q//c/+//RADq//D/vv8pADUAFQDI/y8ACAAbANb/OwD3/+3/9f/e/wcAIAAeAMH/8/8xAC0AEADW/+3/HAADAPv/8P8DAOL/OwD3/xcACQAHAM//5f8XAAcAz//T/9D/HgD9////yf/e//v/AgD//9H/6/////H/+/8hAAIA9//7/w0AFgAQAPL/2v/8/xsAGQABANz/9P8YAAQA/v/y/wMA5v8YAAkAAAAAAAMA7/8KABgADwDs//j/BwATABsA8P/1//z/BAAMAAAA9P/s/xAA/v8GAAkA/v/p/wMACwALAP7/9P/p/wcADQAFAPb/7//4/w0ACAD8//b//v/1/wMACwD1//T/8P/8/wAACQDz/+f/5P8GAAkABQD5//D/+v8FAA0AAwD///T/AgACABAA/v8CAPD/+/8FAAoA9f/3//f//v8GAP7/9v/t//z/+f8AAPj/+v/3/wEA+v8HAPr//P/5/wQA//8DAPr/+P/3/wYA///+//X/+//5/wQA/f/7//X/+//4/wMA/f/8//j//v/9/wYA///8//f/AgAAAAUA/f/6//n/AwACAAIA/f/7//z/AwACAAAA/f/6//3/AgADAP7//f/7/wAAAwAFAPz////8/wMAAgAEAPv//v/+/wMAAgADAPv//v///wMAAQABAPv//f8AAAIAAAD///v//f8BAAIA///+//z//v8CAAIA/v/9//3///8CAAEA/v/9//7/AAACAAAA/v/9////AAABAAAA/f/9/wAAAQABAP///f/+/wEAAQAAAP///v/+/wEAAQD///7//v///wEAAQD///7//v///wEAAAD+//7///8AAAAAAAD+//7///8AAAAA///+//7///8AAAAA////////AAAAAP////////////8AAP//////////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAAAAAAABAAAAAAD//////////////v////3/////////+//8////AQD9//z/9f8BAAIA+f8dACgAWQBxAJX/qv+Y/uz9aP9k/7UDUQQBAiQA4Pgi/AkB0gKaBsD/+fxp/vz9CQSp/I/+ywDO+vMD0fzK/PABcgBeBfoBv/+uAuH9Sf5gAy39awMmBWUBuP9fA9/9fgDj/2/+EACaACcCSv9Z/2j/rv7hAA0AWf55/7L84P7E/SIAT/67AMv/tf+FAA7/1v+7/gv/IP+E/sQA+P5aAXz/tP9XAFX/tP8o/4r/j//e/yQAMv9mAJT/rgCr/9X/EwCb//H/9f7F/6D/EAAoAK3//v+e/zsAh/+B/7r/if/C/2r/4P/z/6//HwCy/0IA7/9ZALT/y/80ACgA9v/J/9//DgA5ADUALQARADIACwAfAOf/NgArACMACQBBAEcAGAAjAC4AWQBUAHcAAAAfACEAIAAcAPj/CADk/yQA7v89AEEAFwD5/xYA6f8aAOX/AADF/zQADwAUAOT/BQDr/yUA6P8XAOf/HADR/0AA8P8nAAgACQDt/ycAKAAHAPH/IQDz/xsACADn//n/DgADAA4A8P///8z/GgDN/yMA/f8QANj/MwACAC0ACwAOAO3/JgAZAAUACgAAAA4AIgAaAAkADwACAAAAHQATAAUABQACAAgACwAjAO////8AAA8ABQAPAPL//f8GAAsABgAGAPD/8v8GAPz/CAD6//H/6v8PAAgABgD4//3/9v8aAAgABwD1//7//v8QAAoACAD//wUA9v8QAAoABAAFAAgAAgAJAAoAAwD//w0AAgD//wcA/v8DAAoABQAFABUABAAKAAYABwAHAA8ACgAGAAwADwAMAAkAEAAJAAgADwAMAAgADgAJAAUACQAPAAUACwAHAAEABgAIAAEABAAGAP//AgAJAAAAAgAEAP7///8IAAIA//8GAAEAAQAJAAIA/v8EAAMA//8JAAEA/v8DAAMA/v8HAAMA/f8BAAUA/v8FAAMA/v8BAAcA//8DAAMA/v8BAAYA//8CAAMA/////wcAAAAAAAMAAAD//wYAAQD+/wMAAQD//wUAAQD+/wIAAgD//wQAAgD+/wEAAwD//wMAAwD+/wEAAwD//wIAAwD//wEABAAAAAEABAD//wAABAABAAAAAwAAAAAABAABAP//AwABAAAAAwACAP//AgACAAAAAwACAP//AgACAAAAAgACAAAAAQADAAAAAQACAAAAAQADAAAAAQACAAAAAAACAAEAAAACAAEAAAACAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAAAAAAAAAAAAAAA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAP//AAD//wAA//8AAAAA//8AAP//AAACAAAA+f8BAAYA///4/wIA//8AAA8A/v/V/wEAEwA9AAEBRwA2AF7/kfog/3gBwv99CDYBU/qtAUX/AP7OAfkAX/o9B38FSfwaAuT14/60BAr8CQAI/tfyIQTzAXP+egdUBBwBof7TBMT8bAWi/5EEWwBRAAAKyfxE/8b88vp6ACP+PAF4/qD8MQNM/ygCJ/2XAPD9kP5gAVT/iP9I/lEB4P8qAD0BFAGa/+7/DgB2AOP98gFm/u/+Vv5/AG8ASP9gAM//qv9w//oAcv+2/jIBHgA7/6D/oAAGAKH/lADT/wAAggC8AAYAkP9yAEcAkf8BAOD/RAAr/zUANwDt/xQAJQAkAMT/zwA/AOH/xv9zAGsANQBTAIcALAAvACIATACy/xMADADg/xcAWABvAJL/7f9VAPb/EgDt/wcA4f8kAPP/5P+h/wgACQDy//r/LgAQAMn/8/9CAOX/5v/S/9//3P8pABYAuP/s/w8AFgDt/+3/7v/w/9j/5/8GAOf/2P/2//P//v8kABMAuf/m/xoADADZ/+r/3P8KAAUAKwDe/wsA3P8VAAAADgAfAB0ACAAMAF4AGgAhAPL/MwDz/0kABAAKAPX/LwAbAAkA9v/s/+3/8/8CABAAAADm//n/BQALAAUAAQDj//n/JQAVAPX/9v/+/wIAEQABAPP/8P/1/wAABgD6/+3/7//o//j/DAD8/+b/8P8IAAkABgD4//D/8P8UAAoAAwD4/wAA+f8OAAcAAAAFAPX/9v8TAAkA8v8EAPb/9/8dAA0A7/8CAPn/+f8SAAQA8/8CAOf/+v8DAAgA9P////H//P8IAAUA8//0/wIAAQAGAAgA9//7/wAA+/8EAP//+P/+////AgACAAsA8v/+/wIABQD7/wgA9v/7/wMABAD5/wAA/P/3/wEAAQD7//7//P/1/wQA///3//r////3/wMAAwD1//r/AwD6////AgD4//n/AwD8//7/AgD4//n/AwD+//3/AQD4//n/BQD///n/AAD6//j/BAABAPj/AAD9//v/AwADAPj//v/+//z/AwAEAPj//v8BAP7/AQADAPj//f8CAP////8EAPr//P8DAAAA/v8CAPv//P8DAAEA/f8BAP3//f8DAAIA/P8AAP7//f8DAAIA/P///wAA/f8BAAIA+//+/wEA//8AAAEA+//+/wEA/////wEA/P/+/wEA///+/wAA/f/9/wEAAAD9/wAA/f/+/wEAAQD8/////v/+/wAAAQD8////////////AQD9////AAD/////AAD+////AAAAAP//AAD///////8AAP//AAD//wAA//8AAP//",
];

const OmnitoneSOAHrirBase64 = [
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wQA8/8ZAPr/DAD+/wMA/v8KAAQA/f8DAAMABADs//z/8v/z/8f/R/90/ob+//zAAWsDAwY3DKn9//tu93DvkwI6An4CuwJ0/BH7VPux92X0Gu7N/EX9mgfqCkkIiRMgBd4NQQGL/c0G/xBxAKELZATUA/sIHRSx+fkCyAUmBNEJIARlAdHz2AjNACcIsAW4AlECsvtJ/P/7K/tf++n8aP4W+g0FXAElAMn8nQHn/sT+Zv7N+9X2xvzM/O3+EvpqBBD7SQLd+vb/sPlw/JD72/3n+Rr+L/wS/vz6UQGg/Nf+Av5L/5X9Gv2//SP+mf3j/lf+v/2B/ZH/5P05/iL9MP9F/uf9UP4v/qv9mv7o/Xn+wP2k/8L+uP5J/tD+Dv/Y/bL+mP72/n3+pP+7/hAA+/5zAGH+Z/+u/g8Azv2y/6L+//9o/iIADP8VACz/CwCN/pb/1v4yAFP+wf+4/jsAcf5VAP3+bADa/nMA6f4sAOT+IQBd/v7/7v6aAIL+QADe/nEA0P4yAKz+CQCo/moAuf5xAN7+mAC8/jcANf9eAPX+IAA1/1kAAP9hAMz+PQD5/m0A2/4gAPr+UQDh/jQAEv9BAPH+FABN/zkASv9DADP/BABe/1IAGf8oAE3/RQAw/zIAQf8mADn/GgBE/xIAR/8hAD7/BABy/zEAKP/0/07/GwBX/z4ARf8mAFr/QQBV/zUAVP8eAFz/JABt/0EAUP8MAHz/KgBr/ycAYv8EAH3/MABl/x8Agv8bAIj/GgBv//z/ff8AAJX/IABu/+T/jv/r/4z/9/9n/77/pP8JAJD/EQCJ//r/q/8WAJ//GQCU/xYAtv8qAKr/PQCW/ysAwf8+ALb/OgC3/ygAz/8uAM7/OgDH/ygAz/8kAMz/OgC//xsA1f8qAMn/LwDN/xcA1f8oAMv/JQDR/xMAzf8bAM//HgDU/wUA2v8ZANL/EwDW/wEA1f8ZAMz/BwDX/wIA0v8SANT/BQDW/wMA0/8PANT/AADY/wIA1f8MANX/+f/a/wUA0v8IANf/+//Y/wUA0/8DANr/+f/Y/wQA1v8BANr/+f/Z/wUA1//8/9z/+v/Y/wYA2f/8/93//v/Y/wUA2v/9/93////Z/wUA3P/8/97/AgDa/wMA3v/8/97/AwDb/wIA3//9/97/BADd/wEA4f///9//BQDf/wAA4v8AAN//BQDf/wAA4/8CAN//BADh/wAA4/8DAOD/BADi////4/8DAOH/AwDk/wAA5P8FAOL/AgDl/wEA5P8FAOL/AQDl/wEA4/8EAOL/AQDj/wIA4P8DAN//AADg/wIA3v8CAOD/AADh/wEA4v8AAOP/AADm/wAA6P8AAOz/AADu/wAA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////f/+//7///8AAP////8BAAEA/f8AAAEAAQAFAAUA9//6/x0A2f/9/xMA3P+jAE//of9HAKP//gCj/77/Z/vi/28D9/ywDJAJIvr6AsX0Xec4BhcGzf23DZP7yfZ6C1//nwBDBIHyYgob/Tf3sQ41ANoKRA/A+E7yffAa9gD5EQUBDMwMygiqAHMAqPqhAGUB2/gE+a78H/+4APT6DwIUAA0HNwMhBfL8E/90A5n7dP9cALIC+v5C/q0AOv9kAogBHv01/+3/qAQD/ub8T/4vAOUA5P6KATv+ywEYAeT+KP6i/3gCFP6h/hr/+P83ACL/VADn/8UARQJI/4MAu/8qAlj+wf4iAPb/LgFJ/8QAUABAAI4ABf+k/3X/YgFK/ij/j/9HADoAi/+WAA0BVwC/ACL/LACe//cARv9i/xgAUgA0ACj/FgBgAIj/5P9M/7z/zv8/AKz/gv8sAEQA6/+I/yYAawDL/7T/xf8qAOv/FQCu/5n/EgAyAO3/i/9LAE4A+//R//P/FgDe/8z/u/8DADIALAAZALL/TAA8ABwAo//1/xwA/P/L/z0A6P8jAN7/7v+a/zAAwf/7/3//KQAuACwA9v8RAGYAIwBNADgAKgASAF0ADgANACEAMQDH//H/LQACAB0Ay////x0APAABAAQA2v8iAAcAEgDE/+v/FQD+/+P/DAD1/97/6v/4//X/EwD4/+7/5P8cAA0ACQDH//7/CQAXAAEA/P/5//j/CwAWAAEABQD9//n/AQAWAB0A7v/k/wAACQAmAP//9/8AAPn/8/8aAO//6/8fAOv/5v8hAP//5/8PAOf/AAAGAPn/6v8JAAYABgABAOv/1//1//L/+P8DABcA6f/8/wMACgD7/xAA3v/2//z/DADu//z/5v/5/wEA/P/6//7/7v/x/wQABgD5/wAA8v/w/wkAEQD2//j/+v8EAAcAEAD3//v/+v8CAAAACQD3//v//v/9/wUADAD2//X/AgAHAAAABwD2//T/BgAKAP7/AQD4//r/BAAIAPn/AAD3//f/BQAHAPv//v/7//n/BQAJAPj/+v/9//7/AgAGAPj/+f8BAAEAAgAFAPn/+v8BAAIAAAAEAPn/+f8CAAQA/v8BAPr/+v8CAAQA/P////v//P8CAAQA+//+//3//f8CAAUA+v/9//////8AAAQA+v/8////AAD//wIA+//8/wAAAQD+/wEA+//8/wAAAgD9/////P/9/wEAAgD8//7//f/9/wAAAgD8//3//v/+////AQD8//z/////////AAD8//3///8AAP7/AAD9//7///8AAP7////+//////8AAP7////+////////////////////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////v8AAP///////wAAAAAAAP7/AQABAAAABwD///X/BQAjAPL/CQDb/9D/GAAb/7sAYwCW/z0BcP/X/7T/2QDW+wH8yANCCCUJ5QT++UXmhPwhA78FuAxH+p78ifudBlAG9vmu/lAK2fdlB///cfjoCa0E7Akn9Yb/zvba+AkAHPywBGEBFwUNAL8AXAAGA20DFvmR/kz+F/06Ag/+GwHl/5EEKgJd/q0AP/ym/9n6EfxY/2H+/QFtAC4C6QBDAaMCo/20/+3/3f/p/fL9rv9V/6cBhQHuAX4AcwJYAaH/IP/P/gsApP0LAe7/sQBuAI0AAgGDAE4BzACe/5X//v+v/+f+Zf+gAOv/5QBhAOIApAANASYAuP+h/8b/HQBr/9//bACWAGEAFAB5AD0AWQDU/+D/Yf/p//D/s/+R/4QAMQBvABEAkQBfABQAJgDW/wwA8/8XALz/vf8zAFAAKwD1/zEAPwDJ/x0A7/8LAOX/FwDR//H/EQAdAO//6P8QAFEA2f8WABEAMgDy/xIA+f/s/xAALgDv////HQAvAPT/+f8iAAYAEgAFABoAGgD//w0A+f/0/xsAHgDx/9f/GAACAPH/8f8JAPf/GwALABEA7/8cAPT/CgD2//j/BQD8/+3/OgAgAAYA9f8PAN7/DgD9/9r/1//3/+3/9//1//b/8//5//f/AgAJAOf/+v8OAAMACwD9/+7/5f8eAAEA9//q//7/8P8WAP7/+//4/wIA+f8TAAIA9f/5/wcA+P8iAAgA9v/n/xoA//8gAAUABwDj/wAA9v8BAAUAFQDn/wMA7v8QABAAEQDm/wwA8f8aAAAABwDu/wcACgASAAEA7//w//f/BgARAAkA6P/3/wcADgAKAAYA4f/4/wYADgAAAPr/8P/9/xQACgAHAPn/7//9/xEAAgD+//L/8v/8/xUAAwDw//H/9f8CAAsA/v/q//L/+f8FAAYA/P/r//j///8GAAkA+//o//j/AQAIAP//+v/o//v/CAAIAPv/+P/w/wEACQAHAPj/+f/0/wIACwAFAPb/+f/4/wQACwACAPP/+f/+/wYACAD///L/+/8BAAYABQD9//P//P8FAAUAAgD7//T//f8HAAQA///7//f///8IAAMA/P/6//r/AQAIAAEA+v/6//3/AgAHAAAA+f/7/wAAAwAFAP7/+P/8/wIAAgACAP3/+f/9/wMAAwAAAPz/+v/+/wQAAgD+//z/+/8AAAQAAQD8//z//f8BAAQAAAD7//3///8BAAMA///7//3/AAACAAEA/v/7//7/AQABAAAA/v/9////AQAAAP///v/+////AAD/////////////////////////////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD////////+//////8AAAAA/v/+/wAAAQD8//3/CQAJAP3/+v8PAAcApABlABkBkwCO/i//lfqa/HQAcf/3BdkCzwJcBCMC0wMN/9/9wgI7AaECYfxV/Tf83vhn/xrt8Owx/8n7cgHABYb43QcZDh4WugNrA7P74gHu/9z/zv0t/acCiQHY/iv4qQOl/ysCE/0//XT9Sf4O//j9xfupAn394gHO+rsCXAFIAxQC9wIXBgcD2AQuAnb/9gJh/6wAVfxEAI4Bvf7oAFv/bALsAMQBe/88/joAT/4dAH39/v9LAXn/gwDI//QBdABcAA0A7f4lAMn///+9/tv/iABp/13/pP/dALv/w/8MAHv//f+y/6////7U/5AAZP+Z/8r/nQDR/5r/DwDr/xAA4v+s/3z/+P9uAOv/t/82AGcAHgCb/yQAFQBGAM7/CgD3/xoAegAaAOz/CgBHAA8Adv8/AAAABQC2/xIAAAA7ABQAKgCj/z4AAQAXAJz/JAADAAcA8f/1/2AAAQAlAPD/NgDx/1wA7v/4/wMAZADv//3/HQAkAFoA8P9FAPv/FgBIAPf/WQAHAEUACQD0/xIAQwDu/wMAwP9VALn/XwCw/yEA5f8sAPj/FgDD/1YAyv8rAOX/HQDo//j/IQAQACAAHwD9/yQAHQBAABgABQAiAAUAKAD3/wkACwAKAAMABwAJAPb/+f8GAOr/JQAHABMA6P8TAA4AGgD//woA8/8ZAP//GADu/w0A9v8SAAMABwD4/wQA5P8XAAQACgDq/wUA+/8VAAcACADs/xIAAAATAPH/+v/1//T/7f///+z/+v/y/+//9/8KAAcACgAJAPT/BAAKAAAABgAIAPL/9v8KAAMABAACAPr/9v8OAAIA+P/x//v/+f8MAPb/+P/w/wQA9f8MAPn////7/woA/v8PAAEAAgD1/xAAAQAPAP//AwD//xQABwALAAAABgADABAAAgAHAAAACAABAA8ABQAFAAMABwAEAA4ABwADAAEACQAFAAoAAwD//wAACQADAAUAAQD/////CAABAAMAAAD/////BwACAAEAAAD/////BwACAP7///8BAAAABgABAP7///8CAAAABAAAAP7///8DAAAAAwAAAP3///8DAAAAAQAAAP3//v8EAAAAAAD+//////8EAP/////+/wAA/v8EAP/////+/wEA/v8EAP///v/+/wIA//8DAP///v/+/wIA//8BAP///v/+/wMA//8BAP/////+/wMA//8AAP//AAD+/wQA//8AAP7/AQD//wIA////////AQD//wIA////////AQAAAAEAAAAAAP//AQD//wEAAAAAAP//AQAAAAEAAAAAAAAA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wAA+v8AAPz/AAD//wAA/f8AAAEAAAD+/wAACQAAAAQAAAAZAAAAtgAAAFsBAABW/gAAH/oAAGcBAABoBwAAlAAAAO3/AAARAQAA+wIAAEoEAACe/gAAiv4AALD0AADJ8wAAkQQAAF34AABi8QAAPQAAAAH2AAD19AAADAMAAJwGAACTEAAA0AwAAJkHAACOBwAAuQEAANcDAAC6AgAAHwUAAHEFAAB0AwAAbgEAADz+AADYAQAAGAAAAJwCAADgAAAA//0AAMn+AAAT/AAAwP8AAOn9AAAJAAAAewEAAOn+AACN/wAAOv0AAO3+AADN/gAAcP8AACj/AACq/gAA+f4AAML9AACa/wAA/f4AAN7/AABo/wAA6/4AAE//AAAC/wAAEQAAAHX/AAB0AAAA5f8AAEwAAAB3AAAA5/8AAMIAAABCAAAAzgAAAE8AAAB3AAAAKAAAADMAAACqAAAALwAAAK4AAAASAAAAVgAAACgAAAAtAAAATAAAAP3/AAA7AAAA2/8AACQAAADw/wAALQAAADEAAAAlAAAAbAAAADMAAABUAAAAEAAAACgAAAD1/wAA9v8AAPr/AADu/wAALgAAABIAAABUAAAARAAAAGUAAABGAAAAOAAAAGAAAAAuAAAARQAAACEAAAAfAAAAAAAAAAkAAAAQAAAAAwAAABIAAADs/wAAEAAAAAYAAAASAAAAIgAAABEAAAADAAAABAAAAA8AAAD4/wAAHQAAAAsAAAAIAAAADgAAAP//AAAcAAAADwAAAAYAAAASAAAAFwAAAAMAAAAYAAAAEgAAAPr/AAAQAAAADQAAAAoAAAD3/wAABgAAAPb/AADf/wAA/v8AAPL/AAD6/wAAFAAAAAQAAAAEAAAAGwAAAAEAAAAMAAAAIAAAAAIAAAAdAAAAGAAAAAIAAAAcAAAAEgAAAAcAAAAeAAAADwAAAAQAAAAeAAAABAAAAAYAAAAZAAAAAQAAAA4AAAATAAAA/v8AAAoAAAAOAAAA+/8AAAsAAAAJAAAA+f8AAAsAAAABAAAA+f8AAAoAAAD9/wAA+v8AAAcAAAD5/wAA+v8AAAUAAAD3/wAA/f8AAAQAAAD2/wAAAAAAAAEAAAD3/wAAAgAAAAAAAAD4/wAAAwAAAP7/AAD6/wAABAAAAP3/AAD8/wAABAAAAPv/AAD+/wAAAwAAAPv/AAD//wAAAQAAAPv/AAAAAAAAAAAAAPv/AAACAAAA//8AAPz/AAACAAAA/v8AAP3/AAACAAAA/f8AAP7/AAABAAAA/f8AAP//AAABAAAA/f8AAAAAAAAAAAAA/v8AAAEAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
];

const RenderingMode$1 = {
  AMBISONIC: 'ambisonic',
  BYPASS: 'bypass',
  OFF: 'off',
};
const SupportedAmbisonicOrder = [2, 3];
function HOARenderer(context, config) {
  this._context = Utils.isAudioContext(context) ?
      context :
      Utils.throw('HOARenderer: Invalid BaseAudioContext.');
  this._config = {
    ambisonicOrder: 3,
    renderingMode: RenderingMode$1.AMBISONIC,
  };
  if (config && config.ambisonicOrder) {
    if (SupportedAmbisonicOrder.includes(config.ambisonicOrder)) {
      this._config.ambisonicOrder = config.ambisonicOrder;
    } else {
      Utils.log(
          'HOARenderer: Invalid ambisonic order. (got ' +
          config.ambisonicOrder + ') Fallbacks to 3rd-order ambisonic.');
    }
  }
  this._config.numberOfChannels =
      (this._config.ambisonicOrder + 1) * (this._config.ambisonicOrder + 1);
  this._config.numberOfStereoChannels =
      Math.ceil(this._config.numberOfChannels / 2);
  if (config && config.hrirPathList) {
    if (Array.isArray(config.hrirPathList) &&
        config.hrirPathList.length === this._config.numberOfStereoChannels) {
      this._config.pathList = config.hrirPathList;
    } else {
      Utils.throw(
          'HOARenderer: Invalid HRIR URLs. It must be an array with ' +
          this._config.numberOfStereoChannels + ' URLs to HRIR files.' +
          ' (got ' + config.hrirPathList + ')');
    }
  }
  if (config && config.renderingMode) {
    if (Object.values(RenderingMode$1).includes(config.renderingMode)) {
      this._config.renderingMode = config.renderingMode;
    } else {
      Utils.log(
          'HOARenderer: Invalid rendering mode. (got ' +
          config.renderingMode + ') Fallbacks to "ambisonic".');
    }
  }
  this._buildAudioGraph();
  this._isRendererReady = false;
}
HOARenderer.prototype._buildAudioGraph = function() {
  this.input = this._context.createGain();
  this.output = this._context.createGain();
  this._bypass = this._context.createGain();
  this._hoaRotator = new HOARotator(this._context, this._config.ambisonicOrder);
  this._hoaConvolver =
      new HOAConvolver(this._context, this._config.ambisonicOrder);
  this.input.connect(this._hoaRotator.input);
  this.input.connect(this._bypass);
  this._hoaRotator.output.connect(this._hoaConvolver.input);
  this._hoaConvolver.output.connect(this.output);
  this.input.channelCount = this._config.numberOfChannels;
  this.input.channelCountMode = 'explicit';
  this.input.channelInterpretation = 'discrete';
};
HOARenderer.prototype._initializeCallback = function(resolve, reject) {
  let bufferList;
  if (this._config.pathList) {
    bufferList =
        new BufferList(this._context, this._config.pathList, {dataType: 'url'});
  } else {
    bufferList = this._config.ambisonicOrder === 2
        ? new BufferList(this._context, OmnitoneSOAHrirBase64)
        : new BufferList(this._context, OmnitoneTOAHrirBase64);
  }
  bufferList.load().then(
      function(hrirBufferList) {
        this._hoaConvolver.setHRIRBufferList(hrirBufferList);
        this.setRenderingMode(this._config.renderingMode);
        this._isRendererReady = true;
        Utils.log('HOARenderer: HRIRs loaded successfully. Ready.');
        resolve();
      }.bind(this),
      function() {
        const errorMessage = 'HOARenderer: HRIR loading/decoding failed.';
        reject(errorMessage);
        Utils.throw(errorMessage);
      });
};
HOARenderer.prototype.initialize = function() {
  Utils.log(
      'HOARenderer: Initializing... (mode: ' + this._config.renderingMode +
      ', ambisonic order: ' + this._config.ambisonicOrder + ')');
  return new Promise(this._initializeCallback.bind(this));
};
HOARenderer.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  if (!this._isRendererReady) {
    return;
  }
  this._hoaRotator.setRotationMatrix3(rotationMatrix3);
};
HOARenderer.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  if (!this._isRendererReady) {
    return;
  }
  this._hoaRotator.setRotationMatrix4(rotationMatrix4);
};
HOARenderer.prototype.setRenderingMode = function(mode) {
  if (mode === this._config.renderingMode) {
    return;
  }
  switch (mode) {
    case RenderingMode$1.AMBISONIC:
      this._hoaConvolver.enable();
      this._bypass.disconnect();
      break;
    case RenderingMode$1.BYPASS:
      this._hoaConvolver.disable();
      this._bypass.connect(this.output);
      break;
    case RenderingMode$1.OFF:
      this._hoaConvolver.disable();
      this._bypass.disconnect();
      break;
    default:
      Utils.log(
          'HOARenderer: Rendering mode "' + mode + '" is not ' +
          'supported.');
      return;
  }
  this._config.renderingMode = mode;
  Utils.log('HOARenderer: Rendering mode changed. (' + mode + ')');
};

const Polyfill = {};
Polyfill.getBrowserInfo = function() {
  const ua = navigator.userAgent;
  let M = ua.match(
      /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) ||
      [];
  let tem;
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {name: 'IE', version: (tem[1] || '')};
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/);
    if (tem != null) {
      return {name: 'Opera', version: tem[1]};
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/([\d.]+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  let platform = ua.match(/android|ipad|iphone/i);
  if (!platform) {
    platform = ua.match(/cros|linux|mac os x|windows/i);
  }
  return {
    name: M[0],
    version: M[1],
    platform: platform ? platform[0] : 'unknown',
  };
};
Polyfill.patchSafari = function() {
  if (window.webkitAudioContext && window.webkitOfflineAudioContext) {
    window.AudioContext = window.webkitAudioContext;
    window.OfflineAudioContext = window.webkitOfflineAudioContext;
  }
};

const Version = '1.3.0';

const Omnitone = {};
Omnitone.browserInfo = Polyfill.getBrowserInfo();
Omnitone.createBufferList = function(context, bufferData, options) {
  const bufferList =
      new BufferList(context, bufferData, options || {dataType: 'url'});
  return bufferList.load();
};
Omnitone.mergeBufferListByChannel = Utils.mergeBufferListByChannel;
Omnitone.splitBufferbyChannel = Utils.splitBufferbyChannel;
Omnitone.createFOAConvolver = function(context, hrirBufferList) {
  return new FOAConvolver(context, hrirBufferList);
};
Omnitone.createFOARouter = function(context, channelMap) {
  return new FOARouter(context, channelMap);
};
Omnitone.createFOARotator = function(context) {
  return new FOARotator(context);
};
Omnitone.createHOARotator = function(context, ambisonicOrder) {
  return new HOARotator(context, ambisonicOrder);
};
Omnitone.createHOAConvolver = function(
    context, ambisonicOrder, hrirBufferList) {
  return new HOAConvolver(context, ambisonicOrder, hrirBufferList);
};
Omnitone.createFOARenderer = function(context, config) {
  return new FOARenderer(context, config);
};
Omnitone.createHOARenderer = function(context, config) {
  return new HOARenderer(context, config);
};
(function() {
  Utils.log(`Version ${Version} (running ${Omnitone.browserInfo.name} \
${Omnitone.browserInfo.version} on ${Omnitone.browserInfo.platform})`);
  if (Omnitone.browserInfo.name.toLowerCase() === 'safari') {
    Polyfill.patchSafari();
    Utils.log(`${Omnitone.browserInfo.name} detected. Polyfill applied.`);
  }
})();

/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Pre-computed lookup tables for encoding ambisonic sources.
 * @author Andrew Allen <bitllama@google.com>
 */



/**
 * Pre-computed Spherical Harmonics Coefficients.
 *
 * This function generates an efficient lookup table of SH coefficients. It
 * exploits the way SHs are generated (i.e. Ylm = Nlm * Plm * Em). Since Nlm
 * & Plm coefficients only depend on theta, and Em only depends on phi, we
 * can separate the equation along these lines. Em does not depend on
 * degree, so we only need to compute (2 * l) per azimuth Em total and
 * Nlm * Plm is symmetrical across indexes, so only positive indexes are
 * computed ((l + 1) * (l + 2) / 2 - 1) per elevation.
 * @type {Float32Array}
 */
const SPHERICAL_HARMONICS =
[
  [
    [0.000000, 0.000000, 0.000000, 1.000000, 1.000000, 1.000000],
    [0.052336, 0.034899, 0.017452, 0.999848, 0.999391, 0.998630],
    [0.104528, 0.069756, 0.034899, 0.999391, 0.997564, 0.994522],
    [0.156434, 0.104528, 0.052336, 0.998630, 0.994522, 0.987688],
    [0.207912, 0.139173, 0.069756, 0.997564, 0.990268, 0.978148],
    [0.258819, 0.173648, 0.087156, 0.996195, 0.984808, 0.965926],
    [0.309017, 0.207912, 0.104528, 0.994522, 0.978148, 0.951057],
    [0.358368, 0.241922, 0.121869, 0.992546, 0.970296, 0.933580],
    [0.406737, 0.275637, 0.139173, 0.990268, 0.961262, 0.913545],
    [0.453990, 0.309017, 0.156434, 0.987688, 0.951057, 0.891007],
    [0.500000, 0.342020, 0.173648, 0.984808, 0.939693, 0.866025],
    [0.544639, 0.374607, 0.190809, 0.981627, 0.927184, 0.838671],
    [0.587785, 0.406737, 0.207912, 0.978148, 0.913545, 0.809017],
    [0.629320, 0.438371, 0.224951, 0.974370, 0.898794, 0.777146],
    [0.669131, 0.469472, 0.241922, 0.970296, 0.882948, 0.743145],
    [0.707107, 0.500000, 0.258819, 0.965926, 0.866025, 0.707107],
    [0.743145, 0.529919, 0.275637, 0.961262, 0.848048, 0.669131],
    [0.777146, 0.559193, 0.292372, 0.956305, 0.829038, 0.629320],
    [0.809017, 0.587785, 0.309017, 0.951057, 0.809017, 0.587785],
    [0.838671, 0.615661, 0.325568, 0.945519, 0.788011, 0.544639],
    [0.866025, 0.642788, 0.342020, 0.939693, 0.766044, 0.500000],
    [0.891007, 0.669131, 0.358368, 0.933580, 0.743145, 0.453990],
    [0.913545, 0.694658, 0.374607, 0.927184, 0.719340, 0.406737],
    [0.933580, 0.719340, 0.390731, 0.920505, 0.694658, 0.358368],
    [0.951057, 0.743145, 0.406737, 0.913545, 0.669131, 0.309017],
    [0.965926, 0.766044, 0.422618, 0.906308, 0.642788, 0.258819],
    [0.978148, 0.788011, 0.438371, 0.898794, 0.615661, 0.207912],
    [0.987688, 0.809017, 0.453990, 0.891007, 0.587785, 0.156434],
    [0.994522, 0.829038, 0.469472, 0.882948, 0.559193, 0.104528],
    [0.998630, 0.848048, 0.484810, 0.874620, 0.529919, 0.052336],
    [1.000000, 0.866025, 0.500000, 0.866025, 0.500000, 0.000000],
    [0.998630, 0.882948, 0.515038, 0.857167, 0.469472, -0.052336],
    [0.994522, 0.898794, 0.529919, 0.848048, 0.438371, -0.104528],
    [0.987688, 0.913545, 0.544639, 0.838671, 0.406737, -0.156434],
    [0.978148, 0.927184, 0.559193, 0.829038, 0.374607, -0.207912],
    [0.965926, 0.939693, 0.573576, 0.819152, 0.342020, -0.258819],
    [0.951057, 0.951057, 0.587785, 0.809017, 0.309017, -0.309017],
    [0.933580, 0.961262, 0.601815, 0.798636, 0.275637, -0.358368],
    [0.913545, 0.970296, 0.615661, 0.788011, 0.241922, -0.406737],
    [0.891007, 0.978148, 0.629320, 0.777146, 0.207912, -0.453990],
    [0.866025, 0.984808, 0.642788, 0.766044, 0.173648, -0.500000],
    [0.838671, 0.990268, 0.656059, 0.754710, 0.139173, -0.544639],
    [0.809017, 0.994522, 0.669131, 0.743145, 0.104528, -0.587785],
    [0.777146, 0.997564, 0.681998, 0.731354, 0.069756, -0.629320],
    [0.743145, 0.999391, 0.694658, 0.719340, 0.034899, -0.669131],
    [0.707107, 1.000000, 0.707107, 0.707107, 0.000000, -0.707107],
    [0.669131, 0.999391, 0.719340, 0.694658, -0.034899, -0.743145],
    [0.629320, 0.997564, 0.731354, 0.681998, -0.069756, -0.777146],
    [0.587785, 0.994522, 0.743145, 0.669131, -0.104528, -0.809017],
    [0.544639, 0.990268, 0.754710, 0.656059, -0.139173, -0.838671],
    [0.500000, 0.984808, 0.766044, 0.642788, -0.173648, -0.866025],
    [0.453990, 0.978148, 0.777146, 0.629320, -0.207912, -0.891007],
    [0.406737, 0.970296, 0.788011, 0.615661, -0.241922, -0.913545],
    [0.358368, 0.961262, 0.798636, 0.601815, -0.275637, -0.933580],
    [0.309017, 0.951057, 0.809017, 0.587785, -0.309017, -0.951057],
    [0.258819, 0.939693, 0.819152, 0.573576, -0.342020, -0.965926],
    [0.207912, 0.927184, 0.829038, 0.559193, -0.374607, -0.978148],
    [0.156434, 0.913545, 0.838671, 0.544639, -0.406737, -0.987688],
    [0.104528, 0.898794, 0.848048, 0.529919, -0.438371, -0.994522],
    [0.052336, 0.882948, 0.857167, 0.515038, -0.469472, -0.998630],
    [0.000000, 0.866025, 0.866025, 0.500000, -0.500000, -1.000000],
    [-0.052336, 0.848048, 0.874620, 0.484810, -0.529919, -0.998630],
    [-0.104528, 0.829038, 0.882948, 0.469472, -0.559193, -0.994522],
    [-0.156434, 0.809017, 0.891007, 0.453990, -0.587785, -0.987688],
    [-0.207912, 0.788011, 0.898794, 0.438371, -0.615661, -0.978148],
    [-0.258819, 0.766044, 0.906308, 0.422618, -0.642788, -0.965926],
    [-0.309017, 0.743145, 0.913545, 0.406737, -0.669131, -0.951057],
    [-0.358368, 0.719340, 0.920505, 0.390731, -0.694658, -0.933580],
    [-0.406737, 0.694658, 0.927184, 0.374607, -0.719340, -0.913545],
    [-0.453990, 0.669131, 0.933580, 0.358368, -0.743145, -0.891007],
    [-0.500000, 0.642788, 0.939693, 0.342020, -0.766044, -0.866025],
    [-0.544639, 0.615661, 0.945519, 0.325568, -0.788011, -0.838671],
    [-0.587785, 0.587785, 0.951057, 0.309017, -0.809017, -0.809017],
    [-0.629320, 0.559193, 0.956305, 0.292372, -0.829038, -0.777146],
    [-0.669131, 0.529919, 0.961262, 0.275637, -0.848048, -0.743145],
    [-0.707107, 0.500000, 0.965926, 0.258819, -0.866025, -0.707107],
    [-0.743145, 0.469472, 0.970296, 0.241922, -0.882948, -0.669131],
    [-0.777146, 0.438371, 0.974370, 0.224951, -0.898794, -0.629320],
    [-0.809017, 0.406737, 0.978148, 0.207912, -0.913545, -0.587785],
    [-0.838671, 0.374607, 0.981627, 0.190809, -0.927184, -0.544639],
    [-0.866025, 0.342020, 0.984808, 0.173648, -0.939693, -0.500000],
    [-0.891007, 0.309017, 0.987688, 0.156434, -0.951057, -0.453990],
    [-0.913545, 0.275637, 0.990268, 0.139173, -0.961262, -0.406737],
    [-0.933580, 0.241922, 0.992546, 0.121869, -0.970296, -0.358368],
    [-0.951057, 0.207912, 0.994522, 0.104528, -0.978148, -0.309017],
    [-0.965926, 0.173648, 0.996195, 0.087156, -0.984808, -0.258819],
    [-0.978148, 0.139173, 0.997564, 0.069756, -0.990268, -0.207912],
    [-0.987688, 0.104528, 0.998630, 0.052336, -0.994522, -0.156434],
    [-0.994522, 0.069756, 0.999391, 0.034899, -0.997564, -0.104528],
    [-0.998630, 0.034899, 0.999848, 0.017452, -0.999391, -0.052336],
    [-1.000000, 0.000000, 1.000000, 0.000000, -1.000000, -0.000000],
    [-0.998630, -0.034899, 0.999848, -0.017452, -0.999391, 0.052336],
    [-0.994522, -0.069756, 0.999391, -0.034899, -0.997564, 0.104528],
    [-0.987688, -0.104528, 0.998630, -0.052336, -0.994522, 0.156434],
    [-0.978148, -0.139173, 0.997564, -0.069756, -0.990268, 0.207912],
    [-0.965926, -0.173648, 0.996195, -0.087156, -0.984808, 0.258819],
    [-0.951057, -0.207912, 0.994522, -0.104528, -0.978148, 0.309017],
    [-0.933580, -0.241922, 0.992546, -0.121869, -0.970296, 0.358368],
    [-0.913545, -0.275637, 0.990268, -0.139173, -0.961262, 0.406737],
    [-0.891007, -0.309017, 0.987688, -0.156434, -0.951057, 0.453990],
    [-0.866025, -0.342020, 0.984808, -0.173648, -0.939693, 0.500000],
    [-0.838671, -0.374607, 0.981627, -0.190809, -0.927184, 0.544639],
    [-0.809017, -0.406737, 0.978148, -0.207912, -0.913545, 0.587785],
    [-0.777146, -0.438371, 0.974370, -0.224951, -0.898794, 0.629320],
    [-0.743145, -0.469472, 0.970296, -0.241922, -0.882948, 0.669131],
    [-0.707107, -0.500000, 0.965926, -0.258819, -0.866025, 0.707107],
    [-0.669131, -0.529919, 0.961262, -0.275637, -0.848048, 0.743145],
    [-0.629320, -0.559193, 0.956305, -0.292372, -0.829038, 0.777146],
    [-0.587785, -0.587785, 0.951057, -0.309017, -0.809017, 0.809017],
    [-0.544639, -0.615661, 0.945519, -0.325568, -0.788011, 0.838671],
    [-0.500000, -0.642788, 0.939693, -0.342020, -0.766044, 0.866025],
    [-0.453990, -0.669131, 0.933580, -0.358368, -0.743145, 0.891007],
    [-0.406737, -0.694658, 0.927184, -0.374607, -0.719340, 0.913545],
    [-0.358368, -0.719340, 0.920505, -0.390731, -0.694658, 0.933580],
    [-0.309017, -0.743145, 0.913545, -0.406737, -0.669131, 0.951057],
    [-0.258819, -0.766044, 0.906308, -0.422618, -0.642788, 0.965926],
    [-0.207912, -0.788011, 0.898794, -0.438371, -0.615661, 0.978148],
    [-0.156434, -0.809017, 0.891007, -0.453990, -0.587785, 0.987688],
    [-0.104528, -0.829038, 0.882948, -0.469472, -0.559193, 0.994522],
    [-0.052336, -0.848048, 0.874620, -0.484810, -0.529919, 0.998630],
    [-0.000000, -0.866025, 0.866025, -0.500000, -0.500000, 1.000000],
    [0.052336, -0.882948, 0.857167, -0.515038, -0.469472, 0.998630],
    [0.104528, -0.898794, 0.848048, -0.529919, -0.438371, 0.994522],
    [0.156434, -0.913545, 0.838671, -0.544639, -0.406737, 0.987688],
    [0.207912, -0.927184, 0.829038, -0.559193, -0.374607, 0.978148],
    [0.258819, -0.939693, 0.819152, -0.573576, -0.342020, 0.965926],
    [0.309017, -0.951057, 0.809017, -0.587785, -0.309017, 0.951057],
    [0.358368, -0.961262, 0.798636, -0.601815, -0.275637, 0.933580],
    [0.406737, -0.970296, 0.788011, -0.615661, -0.241922, 0.913545],
    [0.453990, -0.978148, 0.777146, -0.629320, -0.207912, 0.891007],
    [0.500000, -0.984808, 0.766044, -0.642788, -0.173648, 0.866025],
    [0.544639, -0.990268, 0.754710, -0.656059, -0.139173, 0.838671],
    [0.587785, -0.994522, 0.743145, -0.669131, -0.104528, 0.809017],
    [0.629320, -0.997564, 0.731354, -0.681998, -0.069756, 0.777146],
    [0.669131, -0.999391, 0.719340, -0.694658, -0.034899, 0.743145],
    [0.707107, -1.000000, 0.707107, -0.707107, -0.000000, 0.707107],
    [0.743145, -0.999391, 0.694658, -0.719340, 0.034899, 0.669131],
    [0.777146, -0.997564, 0.681998, -0.731354, 0.069756, 0.629320],
    [0.809017, -0.994522, 0.669131, -0.743145, 0.104528, 0.587785],
    [0.838671, -0.990268, 0.656059, -0.754710, 0.139173, 0.544639],
    [0.866025, -0.984808, 0.642788, -0.766044, 0.173648, 0.500000],
    [0.891007, -0.978148, 0.629320, -0.777146, 0.207912, 0.453990],
    [0.913545, -0.970296, 0.615661, -0.788011, 0.241922, 0.406737],
    [0.933580, -0.961262, 0.601815, -0.798636, 0.275637, 0.358368],
    [0.951057, -0.951057, 0.587785, -0.809017, 0.309017, 0.309017],
    [0.965926, -0.939693, 0.573576, -0.819152, 0.342020, 0.258819],
    [0.978148, -0.927184, 0.559193, -0.829038, 0.374607, 0.207912],
    [0.987688, -0.913545, 0.544639, -0.838671, 0.406737, 0.156434],
    [0.994522, -0.898794, 0.529919, -0.848048, 0.438371, 0.104528],
    [0.998630, -0.882948, 0.515038, -0.857167, 0.469472, 0.052336],
    [1.000000, -0.866025, 0.500000, -0.866025, 0.500000, 0.000000],
    [0.998630, -0.848048, 0.484810, -0.874620, 0.529919, -0.052336],
    [0.994522, -0.829038, 0.469472, -0.882948, 0.559193, -0.104528],
    [0.987688, -0.809017, 0.453990, -0.891007, 0.587785, -0.156434],
    [0.978148, -0.788011, 0.438371, -0.898794, 0.615661, -0.207912],
    [0.965926, -0.766044, 0.422618, -0.906308, 0.642788, -0.258819],
    [0.951057, -0.743145, 0.406737, -0.913545, 0.669131, -0.309017],
    [0.933580, -0.719340, 0.390731, -0.920505, 0.694658, -0.358368],
    [0.913545, -0.694658, 0.374607, -0.927184, 0.719340, -0.406737],
    [0.891007, -0.669131, 0.358368, -0.933580, 0.743145, -0.453990],
    [0.866025, -0.642788, 0.342020, -0.939693, 0.766044, -0.500000],
    [0.838671, -0.615661, 0.325568, -0.945519, 0.788011, -0.544639],
    [0.809017, -0.587785, 0.309017, -0.951057, 0.809017, -0.587785],
    [0.777146, -0.559193, 0.292372, -0.956305, 0.829038, -0.629320],
    [0.743145, -0.529919, 0.275637, -0.961262, 0.848048, -0.669131],
    [0.707107, -0.500000, 0.258819, -0.965926, 0.866025, -0.707107],
    [0.669131, -0.469472, 0.241922, -0.970296, 0.882948, -0.743145],
    [0.629320, -0.438371, 0.224951, -0.974370, 0.898794, -0.777146],
    [0.587785, -0.406737, 0.207912, -0.978148, 0.913545, -0.809017],
    [0.544639, -0.374607, 0.190809, -0.981627, 0.927184, -0.838671],
    [0.500000, -0.342020, 0.173648, -0.984808, 0.939693, -0.866025],
    [0.453990, -0.309017, 0.156434, -0.987688, 0.951057, -0.891007],
    [0.406737, -0.275637, 0.139173, -0.990268, 0.961262, -0.913545],
    [0.358368, -0.241922, 0.121869, -0.992546, 0.970296, -0.933580],
    [0.309017, -0.207912, 0.104528, -0.994522, 0.978148, -0.951057],
    [0.258819, -0.173648, 0.087156, -0.996195, 0.984808, -0.965926],
    [0.207912, -0.139173, 0.069756, -0.997564, 0.990268, -0.978148],
    [0.156434, -0.104528, 0.052336, -0.998630, 0.994522, -0.987688],
    [0.104528, -0.069756, 0.034899, -0.999391, 0.997564, -0.994522],
    [0.052336, -0.034899, 0.017452, -0.999848, 0.999391, -0.998630],
    [0.000000, -0.000000, 0.000000, -1.000000, 1.000000, -1.000000],
    [-0.052336, 0.034899, -0.017452, -0.999848, 0.999391, -0.998630],
    [-0.104528, 0.069756, -0.034899, -0.999391, 0.997564, -0.994522],
    [-0.156434, 0.104528, -0.052336, -0.998630, 0.994522, -0.987688],
    [-0.207912, 0.139173, -0.069756, -0.997564, 0.990268, -0.978148],
    [-0.258819, 0.173648, -0.087156, -0.996195, 0.984808, -0.965926],
    [-0.309017, 0.207912, -0.104528, -0.994522, 0.978148, -0.951057],
    [-0.358368, 0.241922, -0.121869, -0.992546, 0.970296, -0.933580],
    [-0.406737, 0.275637, -0.139173, -0.990268, 0.961262, -0.913545],
    [-0.453990, 0.309017, -0.156434, -0.987688, 0.951057, -0.891007],
    [-0.500000, 0.342020, -0.173648, -0.984808, 0.939693, -0.866025],
    [-0.544639, 0.374607, -0.190809, -0.981627, 0.927184, -0.838671],
    [-0.587785, 0.406737, -0.207912, -0.978148, 0.913545, -0.809017],
    [-0.629320, 0.438371, -0.224951, -0.974370, 0.898794, -0.777146],
    [-0.669131, 0.469472, -0.241922, -0.970296, 0.882948, -0.743145],
    [-0.707107, 0.500000, -0.258819, -0.965926, 0.866025, -0.707107],
    [-0.743145, 0.529919, -0.275637, -0.961262, 0.848048, -0.669131],
    [-0.777146, 0.559193, -0.292372, -0.956305, 0.829038, -0.629320],
    [-0.809017, 0.587785, -0.309017, -0.951057, 0.809017, -0.587785],
    [-0.838671, 0.615661, -0.325568, -0.945519, 0.788011, -0.544639],
    [-0.866025, 0.642788, -0.342020, -0.939693, 0.766044, -0.500000],
    [-0.891007, 0.669131, -0.358368, -0.933580, 0.743145, -0.453990],
    [-0.913545, 0.694658, -0.374607, -0.927184, 0.719340, -0.406737],
    [-0.933580, 0.719340, -0.390731, -0.920505, 0.694658, -0.358368],
    [-0.951057, 0.743145, -0.406737, -0.913545, 0.669131, -0.309017],
    [-0.965926, 0.766044, -0.422618, -0.906308, 0.642788, -0.258819],
    [-0.978148, 0.788011, -0.438371, -0.898794, 0.615661, -0.207912],
    [-0.987688, 0.809017, -0.453990, -0.891007, 0.587785, -0.156434],
    [-0.994522, 0.829038, -0.469472, -0.882948, 0.559193, -0.104528],
    [-0.998630, 0.848048, -0.484810, -0.874620, 0.529919, -0.052336],
    [-1.000000, 0.866025, -0.500000, -0.866025, 0.500000, 0.000000],
    [-0.998630, 0.882948, -0.515038, -0.857167, 0.469472, 0.052336],
    [-0.994522, 0.898794, -0.529919, -0.848048, 0.438371, 0.104528],
    [-0.987688, 0.913545, -0.544639, -0.838671, 0.406737, 0.156434],
    [-0.978148, 0.927184, -0.559193, -0.829038, 0.374607, 0.207912],
    [-0.965926, 0.939693, -0.573576, -0.819152, 0.342020, 0.258819],
    [-0.951057, 0.951057, -0.587785, -0.809017, 0.309017, 0.309017],
    [-0.933580, 0.961262, -0.601815, -0.798636, 0.275637, 0.358368],
    [-0.913545, 0.970296, -0.615661, -0.788011, 0.241922, 0.406737],
    [-0.891007, 0.978148, -0.629320, -0.777146, 0.207912, 0.453990],
    [-0.866025, 0.984808, -0.642788, -0.766044, 0.173648, 0.500000],
    [-0.838671, 0.990268, -0.656059, -0.754710, 0.139173, 0.544639],
    [-0.809017, 0.994522, -0.669131, -0.743145, 0.104528, 0.587785],
    [-0.777146, 0.997564, -0.681998, -0.731354, 0.069756, 0.629320],
    [-0.743145, 0.999391, -0.694658, -0.719340, 0.034899, 0.669131],
    [-0.707107, 1.000000, -0.707107, -0.707107, 0.000000, 0.707107],
    [-0.669131, 0.999391, -0.719340, -0.694658, -0.034899, 0.743145],
    [-0.629320, 0.997564, -0.731354, -0.681998, -0.069756, 0.777146],
    [-0.587785, 0.994522, -0.743145, -0.669131, -0.104528, 0.809017],
    [-0.544639, 0.990268, -0.754710, -0.656059, -0.139173, 0.838671],
    [-0.500000, 0.984808, -0.766044, -0.642788, -0.173648, 0.866025],
    [-0.453990, 0.978148, -0.777146, -0.629320, -0.207912, 0.891007],
    [-0.406737, 0.970296, -0.788011, -0.615661, -0.241922, 0.913545],
    [-0.358368, 0.961262, -0.798636, -0.601815, -0.275637, 0.933580],
    [-0.309017, 0.951057, -0.809017, -0.587785, -0.309017, 0.951057],
    [-0.258819, 0.939693, -0.819152, -0.573576, -0.342020, 0.965926],
    [-0.207912, 0.927184, -0.829038, -0.559193, -0.374607, 0.978148],
    [-0.156434, 0.913545, -0.838671, -0.544639, -0.406737, 0.987688],
    [-0.104528, 0.898794, -0.848048, -0.529919, -0.438371, 0.994522],
    [-0.052336, 0.882948, -0.857167, -0.515038, -0.469472, 0.998630],
    [-0.000000, 0.866025, -0.866025, -0.500000, -0.500000, 1.000000],
    [0.052336, 0.848048, -0.874620, -0.484810, -0.529919, 0.998630],
    [0.104528, 0.829038, -0.882948, -0.469472, -0.559193, 0.994522],
    [0.156434, 0.809017, -0.891007, -0.453990, -0.587785, 0.987688],
    [0.207912, 0.788011, -0.898794, -0.438371, -0.615661, 0.978148],
    [0.258819, 0.766044, -0.906308, -0.422618, -0.642788, 0.965926],
    [0.309017, 0.743145, -0.913545, -0.406737, -0.669131, 0.951057],
    [0.358368, 0.719340, -0.920505, -0.390731, -0.694658, 0.933580],
    [0.406737, 0.694658, -0.927184, -0.374607, -0.719340, 0.913545],
    [0.453990, 0.669131, -0.933580, -0.358368, -0.743145, 0.891007],
    [0.500000, 0.642788, -0.939693, -0.342020, -0.766044, 0.866025],
    [0.544639, 0.615661, -0.945519, -0.325568, -0.788011, 0.838671],
    [0.587785, 0.587785, -0.951057, -0.309017, -0.809017, 0.809017],
    [0.629320, 0.559193, -0.956305, -0.292372, -0.829038, 0.777146],
    [0.669131, 0.529919, -0.961262, -0.275637, -0.848048, 0.743145],
    [0.707107, 0.500000, -0.965926, -0.258819, -0.866025, 0.707107],
    [0.743145, 0.469472, -0.970296, -0.241922, -0.882948, 0.669131],
    [0.777146, 0.438371, -0.974370, -0.224951, -0.898794, 0.629320],
    [0.809017, 0.406737, -0.978148, -0.207912, -0.913545, 0.587785],
    [0.838671, 0.374607, -0.981627, -0.190809, -0.927184, 0.544639],
    [0.866025, 0.342020, -0.984808, -0.173648, -0.939693, 0.500000],
    [0.891007, 0.309017, -0.987688, -0.156434, -0.951057, 0.453990],
    [0.913545, 0.275637, -0.990268, -0.139173, -0.961262, 0.406737],
    [0.933580, 0.241922, -0.992546, -0.121869, -0.970296, 0.358368],
    [0.951057, 0.207912, -0.994522, -0.104528, -0.978148, 0.309017],
    [0.965926, 0.173648, -0.996195, -0.087156, -0.984808, 0.258819],
    [0.978148, 0.139173, -0.997564, -0.069756, -0.990268, 0.207912],
    [0.987688, 0.104528, -0.998630, -0.052336, -0.994522, 0.156434],
    [0.994522, 0.069756, -0.999391, -0.034899, -0.997564, 0.104528],
    [0.998630, 0.034899, -0.999848, -0.017452, -0.999391, 0.052336],
    [1.000000, 0.000000, -1.000000, -0.000000, -1.000000, 0.000000],
    [0.998630, -0.034899, -0.999848, 0.017452, -0.999391, -0.052336],
    [0.994522, -0.069756, -0.999391, 0.034899, -0.997564, -0.104528],
    [0.987688, -0.104528, -0.998630, 0.052336, -0.994522, -0.156434],
    [0.978148, -0.139173, -0.997564, 0.069756, -0.990268, -0.207912],
    [0.965926, -0.173648, -0.996195, 0.087156, -0.984808, -0.258819],
    [0.951057, -0.207912, -0.994522, 0.104528, -0.978148, -0.309017],
    [0.933580, -0.241922, -0.992546, 0.121869, -0.970296, -0.358368],
    [0.913545, -0.275637, -0.990268, 0.139173, -0.961262, -0.406737],
    [0.891007, -0.309017, -0.987688, 0.156434, -0.951057, -0.453990],
    [0.866025, -0.342020, -0.984808, 0.173648, -0.939693, -0.500000],
    [0.838671, -0.374607, -0.981627, 0.190809, -0.927184, -0.544639],
    [0.809017, -0.406737, -0.978148, 0.207912, -0.913545, -0.587785],
    [0.777146, -0.438371, -0.974370, 0.224951, -0.898794, -0.629320],
    [0.743145, -0.469472, -0.970296, 0.241922, -0.882948, -0.669131],
    [0.707107, -0.500000, -0.965926, 0.258819, -0.866025, -0.707107],
    [0.669131, -0.529919, -0.961262, 0.275637, -0.848048, -0.743145],
    [0.629320, -0.559193, -0.956305, 0.292372, -0.829038, -0.777146],
    [0.587785, -0.587785, -0.951057, 0.309017, -0.809017, -0.809017],
    [0.544639, -0.615661, -0.945519, 0.325568, -0.788011, -0.838671],
    [0.500000, -0.642788, -0.939693, 0.342020, -0.766044, -0.866025],
    [0.453990, -0.669131, -0.933580, 0.358368, -0.743145, -0.891007],
    [0.406737, -0.694658, -0.927184, 0.374607, -0.719340, -0.913545],
    [0.358368, -0.719340, -0.920505, 0.390731, -0.694658, -0.933580],
    [0.309017, -0.743145, -0.913545, 0.406737, -0.669131, -0.951057],
    [0.258819, -0.766044, -0.906308, 0.422618, -0.642788, -0.965926],
    [0.207912, -0.788011, -0.898794, 0.438371, -0.615661, -0.978148],
    [0.156434, -0.809017, -0.891007, 0.453990, -0.587785, -0.987688],
    [0.104528, -0.829038, -0.882948, 0.469472, -0.559193, -0.994522],
    [0.052336, -0.848048, -0.874620, 0.484810, -0.529919, -0.998630],
    [0.000000, -0.866025, -0.866025, 0.500000, -0.500000, -1.000000],
    [-0.052336, -0.882948, -0.857167, 0.515038, -0.469472, -0.998630],
    [-0.104528, -0.898794, -0.848048, 0.529919, -0.438371, -0.994522],
    [-0.156434, -0.913545, -0.838671, 0.544639, -0.406737, -0.987688],
    [-0.207912, -0.927184, -0.829038, 0.559193, -0.374607, -0.978148],
    [-0.258819, -0.939693, -0.819152, 0.573576, -0.342020, -0.965926],
    [-0.309017, -0.951057, -0.809017, 0.587785, -0.309017, -0.951057],
    [-0.358368, -0.961262, -0.798636, 0.601815, -0.275637, -0.933580],
    [-0.406737, -0.970296, -0.788011, 0.615661, -0.241922, -0.913545],
    [-0.453990, -0.978148, -0.777146, 0.629320, -0.207912, -0.891007],
    [-0.500000, -0.984808, -0.766044, 0.642788, -0.173648, -0.866025],
    [-0.544639, -0.990268, -0.754710, 0.656059, -0.139173, -0.838671],
    [-0.587785, -0.994522, -0.743145, 0.669131, -0.104528, -0.809017],
    [-0.629320, -0.997564, -0.731354, 0.681998, -0.069756, -0.777146],
    [-0.669131, -0.999391, -0.719340, 0.694658, -0.034899, -0.743145],
    [-0.707107, -1.000000, -0.707107, 0.707107, -0.000000, -0.707107],
    [-0.743145, -0.999391, -0.694658, 0.719340, 0.034899, -0.669131],
    [-0.777146, -0.997564, -0.681998, 0.731354, 0.069756, -0.629320],
    [-0.809017, -0.994522, -0.669131, 0.743145, 0.104528, -0.587785],
    [-0.838671, -0.990268, -0.656059, 0.754710, 0.139173, -0.544639],
    [-0.866025, -0.984808, -0.642788, 0.766044, 0.173648, -0.500000],
    [-0.891007, -0.978148, -0.629320, 0.777146, 0.207912, -0.453990],
    [-0.913545, -0.970296, -0.615661, 0.788011, 0.241922, -0.406737],
    [-0.933580, -0.961262, -0.601815, 0.798636, 0.275637, -0.358368],
    [-0.951057, -0.951057, -0.587785, 0.809017, 0.309017, -0.309017],
    [-0.965926, -0.939693, -0.573576, 0.819152, 0.342020, -0.258819],
    [-0.978148, -0.927184, -0.559193, 0.829038, 0.374607, -0.207912],
    [-0.987688, -0.913545, -0.544639, 0.838671, 0.406737, -0.156434],
    [-0.994522, -0.898794, -0.529919, 0.848048, 0.438371, -0.104528],
    [-0.998630, -0.882948, -0.515038, 0.857167, 0.469472, -0.052336],
    [-1.000000, -0.866025, -0.500000, 0.866025, 0.500000, -0.000000],
    [-0.998630, -0.848048, -0.484810, 0.874620, 0.529919, 0.052336],
    [-0.994522, -0.829038, -0.469472, 0.882948, 0.559193, 0.104528],
    [-0.987688, -0.809017, -0.453990, 0.891007, 0.587785, 0.156434],
    [-0.978148, -0.788011, -0.438371, 0.898794, 0.615661, 0.207912],
    [-0.965926, -0.766044, -0.422618, 0.906308, 0.642788, 0.258819],
    [-0.951057, -0.743145, -0.406737, 0.913545, 0.669131, 0.309017],
    [-0.933580, -0.719340, -0.390731, 0.920505, 0.694658, 0.358368],
    [-0.913545, -0.694658, -0.374607, 0.927184, 0.719340, 0.406737],
    [-0.891007, -0.669131, -0.358368, 0.933580, 0.743145, 0.453990],
    [-0.866025, -0.642788, -0.342020, 0.939693, 0.766044, 0.500000],
    [-0.838671, -0.615661, -0.325568, 0.945519, 0.788011, 0.544639],
    [-0.809017, -0.587785, -0.309017, 0.951057, 0.809017, 0.587785],
    [-0.777146, -0.559193, -0.292372, 0.956305, 0.829038, 0.629320],
    [-0.743145, -0.529919, -0.275637, 0.961262, 0.848048, 0.669131],
    [-0.707107, -0.500000, -0.258819, 0.965926, 0.866025, 0.707107],
    [-0.669131, -0.469472, -0.241922, 0.970296, 0.882948, 0.743145],
    [-0.629320, -0.438371, -0.224951, 0.974370, 0.898794, 0.777146],
    [-0.587785, -0.406737, -0.207912, 0.978148, 0.913545, 0.809017],
    [-0.544639, -0.374607, -0.190809, 0.981627, 0.927184, 0.838671],
    [-0.500000, -0.342020, -0.173648, 0.984808, 0.939693, 0.866025],
    [-0.453990, -0.309017, -0.156434, 0.987688, 0.951057, 0.891007],
    [-0.406737, -0.275637, -0.139173, 0.990268, 0.961262, 0.913545],
    [-0.358368, -0.241922, -0.121869, 0.992546, 0.970296, 0.933580],
    [-0.309017, -0.207912, -0.104528, 0.994522, 0.978148, 0.951057],
    [-0.258819, -0.173648, -0.087156, 0.996195, 0.984808, 0.965926],
    [-0.207912, -0.139173, -0.069756, 0.997564, 0.990268, 0.978148],
    [-0.156434, -0.104528, -0.052336, 0.998630, 0.994522, 0.987688],
    [-0.104528, -0.069756, -0.034899, 0.999391, 0.997564, 0.994522],
    [-0.052336, -0.034899, -0.017452, 0.999848, 0.999391, 0.998630],
  ],
  [
    [-1.000000, -0.000000, 1.000000, -0.000000, 0.000000,
     -1.000000, -0.000000, 0.000000, -0.000000],
    [-0.999848, 0.017452, 0.999543, -0.030224, 0.000264,
     -0.999086, 0.042733, -0.000590, 0.000004],
    [-0.999391, 0.034899, 0.998173, -0.060411, 0.001055,
     -0.996348, 0.085356, -0.002357, 0.000034],
    [-0.998630, 0.052336, 0.995891, -0.090524, 0.002372,
     -0.991791, 0.127757, -0.005297, 0.000113],
    [-0.997564, 0.069756, 0.992701, -0.120527, 0.004214,
     -0.985429, 0.169828, -0.009400, 0.000268],
    [-0.996195, 0.087156, 0.988606, -0.150384, 0.006578,
     -0.977277, 0.211460, -0.014654, 0.000523],
    [-0.994522, 0.104528, 0.983611, -0.180057, 0.009462,
     -0.967356, 0.252544, -0.021043, 0.000903],
    [-0.992546, 0.121869, 0.977722, -0.209511, 0.012862,
     -0.955693, 0.292976, -0.028547, 0.001431],
    [-0.990268, 0.139173, 0.970946, -0.238709, 0.016774,
     -0.942316, 0.332649, -0.037143, 0.002131],
    [-0.987688, 0.156434, 0.963292, -0.267617, 0.021193,
     -0.927262, 0.371463, -0.046806, 0.003026],
    [-0.984808, 0.173648, 0.954769, -0.296198, 0.026114,
     -0.910569, 0.409317, -0.057505, 0.004140],
    [-0.981627, 0.190809, 0.945388, -0.324419, 0.031530,
     -0.892279, 0.446114, -0.069209, 0.005492],
    [-0.978148, 0.207912, 0.935159, -0.352244, 0.037436,
     -0.872441, 0.481759, -0.081880, 0.007105],
    [-0.974370, 0.224951, 0.924096, -0.379641, 0.043823,
     -0.851105, 0.516162, -0.095481, 0.008999],
    [-0.970296, 0.241922, 0.912211, -0.406574, 0.050685,
     -0.828326, 0.549233, -0.109969, 0.011193],
    [-0.965926, 0.258819, 0.899519, -0.433013, 0.058013,
     -0.804164, 0.580889, -0.125300, 0.013707],
    [-0.961262, 0.275637, 0.886036, -0.458924, 0.065797,
     -0.778680, 0.611050, -0.141427, 0.016556],
    [-0.956305, 0.292372, 0.871778, -0.484275, 0.074029,
     -0.751940, 0.639639, -0.158301, 0.019758],
    [-0.951057, 0.309017, 0.856763, -0.509037, 0.082698,
     -0.724012, 0.666583, -0.175868, 0.023329],
    [-0.945519, 0.325568, 0.841008, -0.533178, 0.091794,
     -0.694969, 0.691816, -0.194075, 0.027281],
    [-0.939693, 0.342020, 0.824533, -0.556670, 0.101306,
     -0.664885, 0.715274, -0.212865, 0.031630],
    [-0.933580, 0.358368, 0.807359, -0.579484, 0.111222,
     -0.633837, 0.736898, -0.232180, 0.036385],
    [-0.927184, 0.374607, 0.789505, -0.601592, 0.121529,
     -0.601904, 0.756637, -0.251960, 0.041559],
    [-0.920505, 0.390731, 0.770994, -0.622967, 0.132217,
     -0.569169, 0.774442, -0.272143, 0.047160],
    [-0.913545, 0.406737, 0.751848, -0.643582, 0.143271,
     -0.535715, 0.790270, -0.292666, 0.053196],
    [-0.906308, 0.422618, 0.732091, -0.663414, 0.154678,
     -0.501627, 0.804083, -0.313464, 0.059674],
    [-0.898794, 0.438371, 0.711746, -0.682437, 0.166423,
     -0.466993, 0.815850, -0.334472, 0.066599],
    [-0.891007, 0.453990, 0.690839, -0.700629, 0.178494,
     -0.431899, 0.825544, -0.355623, 0.073974],
    [-0.882948, 0.469472, 0.669395, -0.717968, 0.190875,
     -0.396436, 0.833145, -0.376851, 0.081803],
    [-0.874620, 0.484810, 0.647439, -0.734431, 0.203551,
     -0.360692, 0.838638, -0.398086, 0.090085],
    [-0.866025, 0.500000, 0.625000, -0.750000, 0.216506,
     -0.324760, 0.842012, -0.419263, 0.098821],
    [-0.857167, 0.515038, 0.602104, -0.764655, 0.229726,
     -0.288728, 0.843265, -0.440311, 0.108009],
    [-0.848048, 0.529919, 0.578778, -0.778378, 0.243192,
     -0.252688, 0.842399, -0.461164, 0.117644],
    [-0.838671, 0.544639, 0.555052, -0.791154, 0.256891,
     -0.216730, 0.839422, -0.481753, 0.127722],
    [-0.829038, 0.559193, 0.530955, -0.802965, 0.270803,
     -0.180944, 0.834347, -0.502011, 0.138237],
    [-0.819152, 0.573576, 0.506515, -0.813798, 0.284914,
     -0.145420, 0.827194, -0.521871, 0.149181],
    [-0.809017, 0.587785, 0.481763, -0.823639, 0.299204,
     -0.110246, 0.817987, -0.541266, 0.160545],
    [-0.798636, 0.601815, 0.456728, -0.832477, 0.313658,
     -0.075508, 0.806757, -0.560132, 0.172317],
    [-0.788011, 0.615661, 0.431441, -0.840301, 0.328257,
     -0.041294, 0.793541, -0.578405, 0.184487],
    [-0.777146, 0.629320, 0.405934, -0.847101, 0.342984,
     -0.007686, 0.778379, -0.596021, 0.197040],
    [-0.766044, 0.642788, 0.380236, -0.852869, 0.357821,
     0.025233, 0.761319, -0.612921, 0.209963],
    [-0.754710, 0.656059, 0.354380, -0.857597, 0.372749,
     0.057383, 0.742412, -0.629044, 0.223238],
    [-0.743145, 0.669131, 0.328396, -0.861281, 0.387751,
     0.088686, 0.721714, -0.644334, 0.236850],
    [-0.731354, 0.681998, 0.302317, -0.863916, 0.402807,
     0.119068, 0.699288, -0.658734, 0.250778],
    [-0.719340, 0.694658, 0.276175, -0.865498, 0.417901,
     0.148454, 0.675199, -0.672190, 0.265005],
    [-0.707107, 0.707107, 0.250000, -0.866025, 0.433013,
     0.176777, 0.649519, -0.684653, 0.279508],
    [-0.694658, 0.719340, 0.223825, -0.865498, 0.448125,
     0.203969, 0.622322, -0.696073, 0.294267],
    [-0.681998, 0.731354, 0.197683, -0.863916, 0.463218,
     0.229967, 0.593688, -0.706405, 0.309259],
    [-0.669131, 0.743145, 0.171604, -0.861281, 0.478275,
     0.254712, 0.563700, -0.715605, 0.324459],
    [-0.656059, 0.754710, 0.145620, -0.857597, 0.493276,
     0.278147, 0.532443, -0.723633, 0.339844],
    [-0.642788, 0.766044, 0.119764, -0.852869, 0.508205,
     0.300221, 0.500009, -0.730451, 0.355387],
    [-0.629320, 0.777146, 0.094066, -0.847101, 0.523041,
     0.320884, 0.466490, -0.736025, 0.371063],
    [-0.615661, 0.788011, 0.068559, -0.840301, 0.537768,
     0.340093, 0.431982, -0.740324, 0.386845],
    [-0.601815, 0.798636, 0.043272, -0.832477, 0.552367,
     0.357807, 0.396584, -0.743320, 0.402704],
    [-0.587785, 0.809017, 0.018237, -0.823639, 0.566821,
     0.373991, 0.360397, -0.744989, 0.418613],
    [-0.573576, 0.819152, -0.006515, -0.813798, 0.581112,
     0.388612, 0.323524, -0.745308, 0.434544],
    [-0.559193, 0.829038, -0.030955, -0.802965, 0.595222,
     0.401645, 0.286069, -0.744262, 0.450467],
    [-0.544639, 0.838671, -0.055052, -0.791154, 0.609135,
     0.413066, 0.248140, -0.741835, 0.466352],
    [-0.529919, 0.848048, -0.078778, -0.778378, 0.622833,
     0.422856, 0.209843, -0.738017, 0.482171],
    [-0.515038, 0.857167, -0.102104, -0.764655, 0.636300,
     0.431004, 0.171288, -0.732801, 0.497894],
    [-0.500000, 0.866025, -0.125000, -0.750000, 0.649519,
     0.437500, 0.132583, -0.726184, 0.513490],
    [-0.484810, 0.874620, -0.147439, -0.734431, 0.662474,
     0.442340, 0.093837, -0.718167, 0.528929],
    [-0.469472, 0.882948, -0.169395, -0.717968, 0.675150,
     0.445524, 0.055160, -0.708753, 0.544183],
    [-0.453990, 0.891007, -0.190839, -0.700629, 0.687531,
     0.447059, 0.016662, -0.697950, 0.559220],
    [-0.438371, 0.898794, -0.211746, -0.682437, 0.699602,
     0.446953, -0.021550, -0.685769, 0.574011],
    [-0.422618, 0.906308, -0.232091, -0.663414, 0.711348,
     0.445222, -0.059368, -0.672226, 0.588528],
    [-0.406737, 0.913545, -0.251848, -0.643582, 0.722755,
     0.441884, -0.096684, -0.657339, 0.602741],
    [-0.390731, 0.920505, -0.270994, -0.622967, 0.733809,
     0.436964, -0.133395, -0.641130, 0.616621],
    [-0.374607, 0.927184, -0.289505, -0.601592, 0.744496,
     0.430488, -0.169397, -0.623624, 0.630141],
    [-0.358368, 0.933580, -0.307359, -0.579484, 0.754804,
     0.422491, -0.204589, -0.604851, 0.643273],
    [-0.342020, 0.939693, -0.324533, -0.556670, 0.764720,
     0.413008, -0.238872, -0.584843, 0.655990],
    [-0.325568, 0.945519, -0.341008, -0.533178, 0.774231,
     0.402081, -0.272150, -0.563635, 0.668267],
    [-0.309017, 0.951057, -0.356763, -0.509037, 0.783327,
     0.389754, -0.304329, -0.541266, 0.680078],
    [-0.292372, 0.956305, -0.371778, -0.484275, 0.791997,
     0.376077, -0.335319, -0.517778, 0.691399],
    [-0.275637, 0.961262, -0.386036, -0.458924, 0.800228,
     0.361102, -0.365034, -0.493216, 0.702207],
    [-0.258819, 0.965926, -0.399519, -0.433013, 0.808013,
     0.344885, -0.393389, -0.467627, 0.712478],
    [-0.241922, 0.970296, -0.412211, -0.406574, 0.815340,
     0.327486, -0.420306, -0.441061, 0.722191],
    [-0.224951, 0.974370, -0.424096, -0.379641, 0.822202,
     0.308969, -0.445709, -0.413572, 0.731327],
    [-0.207912, 0.978148, -0.435159, -0.352244, 0.828589,
     0.289399, -0.469527, -0.385215, 0.739866],
    [-0.190809, 0.981627, -0.445388, -0.324419, 0.834495,
     0.268846, -0.491693, -0.356047, 0.747790],
    [-0.173648, 0.984808, -0.454769, -0.296198, 0.839912,
     0.247382, -0.512145, -0.326129, 0.755082],
    [-0.156434, 0.987688, -0.463292, -0.267617, 0.844832,
     0.225081, -0.530827, -0.295521, 0.761728],
    [-0.139173, 0.990268, -0.470946, -0.238709, 0.849251,
     0.202020, -0.547684, -0.264287, 0.767712],
    [-0.121869, 0.992546, -0.477722, -0.209511, 0.853163,
     0.178279, -0.562672, -0.232494, 0.773023],
    [-0.104528, 0.994522, -0.483611, -0.180057, 0.856563,
     0.153937, -0.575747, -0.200207, 0.777648],
    [-0.087156, 0.996195, -0.488606, -0.150384, 0.859447,
     0.129078, -0.586872, -0.167494, 0.781579],
    [-0.069756, 0.997564, -0.492701, -0.120527, 0.861811,
     0.103786, -0.596018, -0.134426, 0.784806],
    [-0.052336, 0.998630, -0.495891, -0.090524, 0.863653,
     0.078146, -0.603158, -0.101071, 0.787324],
    [-0.034899, 0.999391, -0.498173, -0.060411, 0.864971,
     0.052243, -0.608272, -0.067500, 0.789126],
    [-0.017452, 0.999848, -0.499543, -0.030224, 0.865762,
     0.026165, -0.611347, -0.033786, 0.790208],
    [0.000000, 1.000000, -0.500000, 0.000000, 0.866025,
     -0.000000, -0.612372, 0.000000, 0.790569],
    [0.017452, 0.999848, -0.499543, 0.030224, 0.865762,
     -0.026165, -0.611347, 0.033786, 0.790208],
    [0.034899, 0.999391, -0.498173, 0.060411, 0.864971,
     -0.052243, -0.608272, 0.067500, 0.789126],
    [0.052336, 0.998630, -0.495891, 0.090524, 0.863653,
     -0.078146, -0.603158, 0.101071, 0.787324],
    [0.069756, 0.997564, -0.492701, 0.120527, 0.861811,
     -0.103786, -0.596018, 0.134426, 0.784806],
    [0.087156, 0.996195, -0.488606, 0.150384, 0.859447,
     -0.129078, -0.586872, 0.167494, 0.781579],
    [0.104528, 0.994522, -0.483611, 0.180057, 0.856563,
     -0.153937, -0.575747, 0.200207, 0.777648],
    [0.121869, 0.992546, -0.477722, 0.209511, 0.853163,
     -0.178279, -0.562672, 0.232494, 0.773023],
    [0.139173, 0.990268, -0.470946, 0.238709, 0.849251,
     -0.202020, -0.547684, 0.264287, 0.767712],
    [0.156434, 0.987688, -0.463292, 0.267617, 0.844832,
     -0.225081, -0.530827, 0.295521, 0.761728],
    [0.173648, 0.984808, -0.454769, 0.296198, 0.839912,
     -0.247382, -0.512145, 0.326129, 0.755082],
    [0.190809, 0.981627, -0.445388, 0.324419, 0.834495,
     -0.268846, -0.491693, 0.356047, 0.747790],
    [0.207912, 0.978148, -0.435159, 0.352244, 0.828589,
     -0.289399, -0.469527, 0.385215, 0.739866],
    [0.224951, 0.974370, -0.424096, 0.379641, 0.822202,
     -0.308969, -0.445709, 0.413572, 0.731327],
    [0.241922, 0.970296, -0.412211, 0.406574, 0.815340,
     -0.327486, -0.420306, 0.441061, 0.722191],
    [0.258819, 0.965926, -0.399519, 0.433013, 0.808013,
     -0.344885, -0.393389, 0.467627, 0.712478],
    [0.275637, 0.961262, -0.386036, 0.458924, 0.800228,
     -0.361102, -0.365034, 0.493216, 0.702207],
    [0.292372, 0.956305, -0.371778, 0.484275, 0.791997,
     -0.376077, -0.335319, 0.517778, 0.691399],
    [0.309017, 0.951057, -0.356763, 0.509037, 0.783327,
     -0.389754, -0.304329, 0.541266, 0.680078],
    [0.325568, 0.945519, -0.341008, 0.533178, 0.774231,
     -0.402081, -0.272150, 0.563635, 0.668267],
    [0.342020, 0.939693, -0.324533, 0.556670, 0.764720,
     -0.413008, -0.238872, 0.584843, 0.655990],
    [0.358368, 0.933580, -0.307359, 0.579484, 0.754804,
     -0.422491, -0.204589, 0.604851, 0.643273],
    [0.374607, 0.927184, -0.289505, 0.601592, 0.744496,
     -0.430488, -0.169397, 0.623624, 0.630141],
    [0.390731, 0.920505, -0.270994, 0.622967, 0.733809,
     -0.436964, -0.133395, 0.641130, 0.616621],
    [0.406737, 0.913545, -0.251848, 0.643582, 0.722755,
     -0.441884, -0.096684, 0.657339, 0.602741],
    [0.422618, 0.906308, -0.232091, 0.663414, 0.711348,
     -0.445222, -0.059368, 0.672226, 0.588528],
    [0.438371, 0.898794, -0.211746, 0.682437, 0.699602,
     -0.446953, -0.021550, 0.685769, 0.574011],
    [0.453990, 0.891007, -0.190839, 0.700629, 0.687531,
     -0.447059, 0.016662, 0.697950, 0.559220],
    [0.469472, 0.882948, -0.169395, 0.717968, 0.675150,
     -0.445524, 0.055160, 0.708753, 0.544183],
    [0.484810, 0.874620, -0.147439, 0.734431, 0.662474,
     -0.442340, 0.093837, 0.718167, 0.528929],
    [0.500000, 0.866025, -0.125000, 0.750000, 0.649519,
     -0.437500, 0.132583, 0.726184, 0.513490],
    [0.515038, 0.857167, -0.102104, 0.764655, 0.636300,
     -0.431004, 0.171288, 0.732801, 0.497894],
    [0.529919, 0.848048, -0.078778, 0.778378, 0.622833,
     -0.422856, 0.209843, 0.738017, 0.482171],
    [0.544639, 0.838671, -0.055052, 0.791154, 0.609135,
     -0.413066, 0.248140, 0.741835, 0.466352],
    [0.559193, 0.829038, -0.030955, 0.802965, 0.595222,
     -0.401645, 0.286069, 0.744262, 0.450467],
    [0.573576, 0.819152, -0.006515, 0.813798, 0.581112,
     -0.388612, 0.323524, 0.745308, 0.434544],
    [0.587785, 0.809017, 0.018237, 0.823639, 0.566821,
     -0.373991, 0.360397, 0.744989, 0.418613],
    [0.601815, 0.798636, 0.043272, 0.832477, 0.552367,
     -0.357807, 0.396584, 0.743320, 0.402704],
    [0.615661, 0.788011, 0.068559, 0.840301, 0.537768,
     -0.340093, 0.431982, 0.740324, 0.386845],
    [0.629320, 0.777146, 0.094066, 0.847101, 0.523041,
     -0.320884, 0.466490, 0.736025, 0.371063],
    [0.642788, 0.766044, 0.119764, 0.852869, 0.508205,
     -0.300221, 0.500009, 0.730451, 0.355387],
    [0.656059, 0.754710, 0.145620, 0.857597, 0.493276,
     -0.278147, 0.532443, 0.723633, 0.339844],
    [0.669131, 0.743145, 0.171604, 0.861281, 0.478275,
     -0.254712, 0.563700, 0.715605, 0.324459],
    [0.681998, 0.731354, 0.197683, 0.863916, 0.463218,
     -0.229967, 0.593688, 0.706405, 0.309259],
    [0.694658, 0.719340, 0.223825, 0.865498, 0.448125,
     -0.203969, 0.622322, 0.696073, 0.294267],
    [0.707107, 0.707107, 0.250000, 0.866025, 0.433013,
     -0.176777, 0.649519, 0.684653, 0.279508],
    [0.719340, 0.694658, 0.276175, 0.865498, 0.417901,
     -0.148454, 0.675199, 0.672190, 0.265005],
    [0.731354, 0.681998, 0.302317, 0.863916, 0.402807,
     -0.119068, 0.699288, 0.658734, 0.250778],
    [0.743145, 0.669131, 0.328396, 0.861281, 0.387751,
     -0.088686, 0.721714, 0.644334, 0.236850],
    [0.754710, 0.656059, 0.354380, 0.857597, 0.372749,
     -0.057383, 0.742412, 0.629044, 0.223238],
    [0.766044, 0.642788, 0.380236, 0.852869, 0.357821,
     -0.025233, 0.761319, 0.612921, 0.209963],
    [0.777146, 0.629320, 0.405934, 0.847101, 0.342984,
     0.007686, 0.778379, 0.596021, 0.197040],
    [0.788011, 0.615661, 0.431441, 0.840301, 0.328257,
     0.041294, 0.793541, 0.578405, 0.184487],
    [0.798636, 0.601815, 0.456728, 0.832477, 0.313658,
     0.075508, 0.806757, 0.560132, 0.172317],
    [0.809017, 0.587785, 0.481763, 0.823639, 0.299204,
     0.110246, 0.817987, 0.541266, 0.160545],
    [0.819152, 0.573576, 0.506515, 0.813798, 0.284914,
     0.145420, 0.827194, 0.521871, 0.149181],
    [0.829038, 0.559193, 0.530955, 0.802965, 0.270803,
     0.180944, 0.834347, 0.502011, 0.138237],
    [0.838671, 0.544639, 0.555052, 0.791154, 0.256891,
     0.216730, 0.839422, 0.481753, 0.127722],
    [0.848048, 0.529919, 0.578778, 0.778378, 0.243192,
     0.252688, 0.842399, 0.461164, 0.117644],
    [0.857167, 0.515038, 0.602104, 0.764655, 0.229726,
     0.288728, 0.843265, 0.440311, 0.108009],
    [0.866025, 0.500000, 0.625000, 0.750000, 0.216506,
     0.324760, 0.842012, 0.419263, 0.098821],
    [0.874620, 0.484810, 0.647439, 0.734431, 0.203551,
     0.360692, 0.838638, 0.398086, 0.090085],
    [0.882948, 0.469472, 0.669395, 0.717968, 0.190875,
     0.396436, 0.833145, 0.376851, 0.081803],
    [0.891007, 0.453990, 0.690839, 0.700629, 0.178494,
     0.431899, 0.825544, 0.355623, 0.073974],
    [0.898794, 0.438371, 0.711746, 0.682437, 0.166423,
     0.466993, 0.815850, 0.334472, 0.066599],
    [0.906308, 0.422618, 0.732091, 0.663414, 0.154678,
     0.501627, 0.804083, 0.313464, 0.059674],
    [0.913545, 0.406737, 0.751848, 0.643582, 0.143271,
     0.535715, 0.790270, 0.292666, 0.053196],
    [0.920505, 0.390731, 0.770994, 0.622967, 0.132217,
     0.569169, 0.774442, 0.272143, 0.047160],
    [0.927184, 0.374607, 0.789505, 0.601592, 0.121529,
     0.601904, 0.756637, 0.251960, 0.041559],
    [0.933580, 0.358368, 0.807359, 0.579484, 0.111222,
     0.633837, 0.736898, 0.232180, 0.036385],
    [0.939693, 0.342020, 0.824533, 0.556670, 0.101306,
     0.664885, 0.715274, 0.212865, 0.031630],
    [0.945519, 0.325568, 0.841008, 0.533178, 0.091794,
     0.694969, 0.691816, 0.194075, 0.027281],
    [0.951057, 0.309017, 0.856763, 0.509037, 0.082698,
     0.724012, 0.666583, 0.175868, 0.023329],
    [0.956305, 0.292372, 0.871778, 0.484275, 0.074029,
     0.751940, 0.639639, 0.158301, 0.019758],
    [0.961262, 0.275637, 0.886036, 0.458924, 0.065797,
     0.778680, 0.611050, 0.141427, 0.016556],
    [0.965926, 0.258819, 0.899519, 0.433013, 0.058013,
     0.804164, 0.580889, 0.125300, 0.013707],
    [0.970296, 0.241922, 0.912211, 0.406574, 0.050685,
     0.828326, 0.549233, 0.109969, 0.011193],
    [0.974370, 0.224951, 0.924096, 0.379641, 0.043823,
     0.851105, 0.516162, 0.095481, 0.008999],
    [0.978148, 0.207912, 0.935159, 0.352244, 0.037436,
     0.872441, 0.481759, 0.081880, 0.007105],
    [0.981627, 0.190809, 0.945388, 0.324419, 0.031530,
     0.892279, 0.446114, 0.069209, 0.005492],
    [0.984808, 0.173648, 0.954769, 0.296198, 0.026114,
     0.910569, 0.409317, 0.057505, 0.004140],
    [0.987688, 0.156434, 0.963292, 0.267617, 0.021193,
     0.927262, 0.371463, 0.046806, 0.003026],
    [0.990268, 0.139173, 0.970946, 0.238709, 0.016774,
     0.942316, 0.332649, 0.037143, 0.002131],
    [0.992546, 0.121869, 0.977722, 0.209511, 0.012862,
     0.955693, 0.292976, 0.028547, 0.001431],
    [0.994522, 0.104528, 0.983611, 0.180057, 0.009462,
     0.967356, 0.252544, 0.021043, 0.000903],
    [0.996195, 0.087156, 0.988606, 0.150384, 0.006578,
     0.977277, 0.211460, 0.014654, 0.000523],
    [0.997564, 0.069756, 0.992701, 0.120527, 0.004214,
     0.985429, 0.169828, 0.009400, 0.000268],
    [0.998630, 0.052336, 0.995891, 0.090524, 0.002372,
     0.991791, 0.127757, 0.005297, 0.000113],
    [0.999391, 0.034899, 0.998173, 0.060411, 0.001055,
     0.996348, 0.085356, 0.002357, 0.000034],
    [0.999848, 0.017452, 0.999543, 0.030224, 0.000264,
     0.999086, 0.042733, 0.000590, 0.000004],
    [1.000000, -0.000000, 1.000000, -0.000000, 0.000000,
     1.000000, -0.000000, 0.000000, -0.000000],
  ],
];


/** @type {Number} */
const SPHERICAL_HARMONICS_AZIMUTH_RESOLUTION =
  SPHERICAL_HARMONICS[0].length;


/** @type {Number} */
const SPHERICAL_HARMONICS_ELEVATION_RESOLUTION =
  SPHERICAL_HARMONICS[1].length;


/**
 * The maximum allowed ambisonic order.
 * @type {Number}
 */
const SPHERICAL_HARMONICS_MAX_ORDER =
  SPHERICAL_HARMONICS[0][0].length / 2;


/**
 * Pre-computed per-band weighting coefficients for producing energy-preserving
 * Max-Re sources.
 */
const MAX_RE_WEIGHTS =
[
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.003236, 1.002156, 0.999152, 0.990038],
  [1.032370, 1.021194, 0.990433, 0.898572],
  [1.062694, 1.040231, 0.979161, 0.799806],
  [1.093999, 1.058954, 0.964976, 0.693603],
  [1.126003, 1.077006, 0.947526, 0.579890],
  [1.158345, 1.093982, 0.926474, 0.458690],
  [1.190590, 1.109437, 0.901512, 0.330158],
  [1.222228, 1.122890, 0.872370, 0.194621],
  [1.252684, 1.133837, 0.838839, 0.052614],
  [1.281987, 1.142358, 0.801199, 0.000000],
  [1.312073, 1.150207, 0.760839, 0.000000],
  [1.343011, 1.157424, 0.717799, 0.000000],
  [1.374649, 1.163859, 0.671999, 0.000000],
  [1.406809, 1.169354, 0.623371, 0.000000],
  [1.439286, 1.173739, 0.571868, 0.000000],
  [1.471846, 1.176837, 0.517465, 0.000000],
  [1.504226, 1.178465, 0.460174, 0.000000],
  [1.536133, 1.178438, 0.400043, 0.000000],
  [1.567253, 1.176573, 0.337165, 0.000000],
  [1.597247, 1.172695, 0.271688, 0.000000],
  [1.625766, 1.166645, 0.203815, 0.000000],
  [1.652455, 1.158285, 0.133806, 0.000000],
  [1.676966, 1.147506, 0.061983, 0.000000],
  [1.699006, 1.134261, 0.000000, 0.000000],
  [1.720224, 1.119789, 0.000000, 0.000000],
  [1.741631, 1.104810, 0.000000, 0.000000],
  [1.763183, 1.089330, 0.000000, 0.000000],
  [1.784837, 1.073356, 0.000000, 0.000000],
  [1.806548, 1.056898, 0.000000, 0.000000],
  [1.828269, 1.039968, 0.000000, 0.000000],
  [1.849952, 1.022580, 0.000000, 0.000000],
  [1.871552, 1.004752, 0.000000, 0.000000],
  [1.893018, 0.986504, 0.000000, 0.000000],
  [1.914305, 0.967857, 0.000000, 0.000000],
  [1.935366, 0.948837, 0.000000, 0.000000],
  [1.956154, 0.929471, 0.000000, 0.000000],
  [1.976625, 0.909790, 0.000000, 0.000000],
  [1.996736, 0.889823, 0.000000, 0.000000],
  [2.016448, 0.869607, 0.000000, 0.000000],
  [2.035721, 0.849175, 0.000000, 0.000000],
  [2.054522, 0.828565, 0.000000, 0.000000],
  [2.072818, 0.807816, 0.000000, 0.000000],
  [2.090581, 0.786964, 0.000000, 0.000000],
  [2.107785, 0.766051, 0.000000, 0.000000],
  [2.124411, 0.745115, 0.000000, 0.000000],
  [2.140439, 0.724196, 0.000000, 0.000000],
  [2.155856, 0.703332, 0.000000, 0.000000],
  [2.170653, 0.682561, 0.000000, 0.000000],
  [2.184823, 0.661921, 0.000000, 0.000000],
  [2.198364, 0.641445, 0.000000, 0.000000],
  [2.211275, 0.621169, 0.000000, 0.000000],
  [2.223562, 0.601125, 0.000000, 0.000000],
  [2.235230, 0.581341, 0.000000, 0.000000],
  [2.246289, 0.561847, 0.000000, 0.000000],
  [2.256751, 0.542667, 0.000000, 0.000000],
  [2.266631, 0.523826, 0.000000, 0.000000],
  [2.275943, 0.505344, 0.000000, 0.000000],
  [2.284707, 0.487239, 0.000000, 0.000000],
  [2.292939, 0.469528, 0.000000, 0.000000],
  [2.300661, 0.452225, 0.000000, 0.000000],
  [2.307892, 0.435342, 0.000000, 0.000000],
  [2.314654, 0.418888, 0.000000, 0.000000],
  [2.320969, 0.402870, 0.000000, 0.000000],
  [2.326858, 0.387294, 0.000000, 0.000000],
  [2.332343, 0.372164, 0.000000, 0.000000],
  [2.337445, 0.357481, 0.000000, 0.000000],
  [2.342186, 0.343246, 0.000000, 0.000000],
  [2.346585, 0.329458, 0.000000, 0.000000],
  [2.350664, 0.316113, 0.000000, 0.000000],
  [2.354442, 0.303208, 0.000000, 0.000000],
  [2.357937, 0.290738, 0.000000, 0.000000],
  [2.361168, 0.278698, 0.000000, 0.000000],
  [2.364152, 0.267080, 0.000000, 0.000000],
  [2.366906, 0.255878, 0.000000, 0.000000],
  [2.369446, 0.245082, 0.000000, 0.000000],
  [2.371786, 0.234685, 0.000000, 0.000000],
  [2.373940, 0.224677, 0.000000, 0.000000],
  [2.375923, 0.215048, 0.000000, 0.000000],
  [2.377745, 0.205790, 0.000000, 0.000000],
  [2.379421, 0.196891, 0.000000, 0.000000],
  [2.380959, 0.188342, 0.000000, 0.000000],
  [2.382372, 0.180132, 0.000000, 0.000000],
  [2.383667, 0.172251, 0.000000, 0.000000],
  [2.384856, 0.164689, 0.000000, 0.000000],
  [2.385945, 0.157435, 0.000000, 0.000000],
  [2.386943, 0.150479, 0.000000, 0.000000],
  [2.387857, 0.143811, 0.000000, 0.000000],
  [2.388694, 0.137421, 0.000000, 0.000000],
  [2.389460, 0.131299, 0.000000, 0.000000],
  [2.390160, 0.125435, 0.000000, 0.000000],
  [2.390801, 0.119820, 0.000000, 0.000000],
  [2.391386, 0.114445, 0.000000, 0.000000],
  [2.391921, 0.109300, 0.000000, 0.000000],
  [2.392410, 0.104376, 0.000000, 0.000000],
  [2.392857, 0.099666, 0.000000, 0.000000],
  [2.393265, 0.095160, 0.000000, 0.000000],
  [2.393637, 0.090851, 0.000000, 0.000000],
  [2.393977, 0.086731, 0.000000, 0.000000],
  [2.394288, 0.082791, 0.000000, 0.000000],
  [2.394571, 0.079025, 0.000000, 0.000000],
  [2.394829, 0.075426, 0.000000, 0.000000],
  [2.395064, 0.071986, 0.000000, 0.000000],
  [2.395279, 0.068699, 0.000000, 0.000000],
  [2.395475, 0.065558, 0.000000, 0.000000],
  [2.395653, 0.062558, 0.000000, 0.000000],
  [2.395816, 0.059693, 0.000000, 0.000000],
  [2.395964, 0.056955, 0.000000, 0.000000],
  [2.396099, 0.054341, 0.000000, 0.000000],
  [2.396222, 0.051845, 0.000000, 0.000000],
  [2.396334, 0.049462, 0.000000, 0.000000],
  [2.396436, 0.047186, 0.000000, 0.000000],
  [2.396529, 0.045013, 0.000000, 0.000000],
  [2.396613, 0.042939, 0.000000, 0.000000],
  [2.396691, 0.040959, 0.000000, 0.000000],
  [2.396761, 0.039069, 0.000000, 0.000000],
  [2.396825, 0.037266, 0.000000, 0.000000],
  [2.396883, 0.035544, 0.000000, 0.000000],
  [2.396936, 0.033901, 0.000000, 0.000000],
  [2.396984, 0.032334, 0.000000, 0.000000],
  [2.397028, 0.030838, 0.000000, 0.000000],
  [2.397068, 0.029410, 0.000000, 0.000000],
  [2.397104, 0.028048, 0.000000, 0.000000],
  [2.397137, 0.026749, 0.000000, 0.000000],
  [2.397167, 0.025509, 0.000000, 0.000000],
  [2.397194, 0.024326, 0.000000, 0.000000],
  [2.397219, 0.023198, 0.000000, 0.000000],
  [2.397242, 0.022122, 0.000000, 0.000000],
  [2.397262, 0.021095, 0.000000, 0.000000],
  [2.397281, 0.020116, 0.000000, 0.000000],
  [2.397298, 0.019181, 0.000000, 0.000000],
  [2.397314, 0.018290, 0.000000, 0.000000],
  [2.397328, 0.017441, 0.000000, 0.000000],
  [2.397341, 0.016630, 0.000000, 0.000000],
  [2.397352, 0.015857, 0.000000, 0.000000],
  [2.397363, 0.015119, 0.000000, 0.000000],
  [2.397372, 0.014416, 0.000000, 0.000000],
  [2.397381, 0.013745, 0.000000, 0.000000],
  [2.397389, 0.013106, 0.000000, 0.000000],
  [2.397396, 0.012496, 0.000000, 0.000000],
  [2.397403, 0.011914, 0.000000, 0.000000],
  [2.397409, 0.011360, 0.000000, 0.000000],
  [2.397414, 0.010831, 0.000000, 0.000000],
  [2.397419, 0.010326, 0.000000, 0.000000],
  [2.397424, 0.009845, 0.000000, 0.000000],
  [2.397428, 0.009387, 0.000000, 0.000000],
  [2.397432, 0.008949, 0.000000, 0.000000],
  [2.397435, 0.008532, 0.000000, 0.000000],
  [2.397438, 0.008135, 0.000000, 0.000000],
  [2.397441, 0.007755, 0.000000, 0.000000],
  [2.397443, 0.007394, 0.000000, 0.000000],
  [2.397446, 0.007049, 0.000000, 0.000000],
  [2.397448, 0.006721, 0.000000, 0.000000],
  [2.397450, 0.006407, 0.000000, 0.000000],
  [2.397451, 0.006108, 0.000000, 0.000000],
  [2.397453, 0.005824, 0.000000, 0.000000],
  [2.397454, 0.005552, 0.000000, 0.000000],
  [2.397456, 0.005293, 0.000000, 0.000000],
  [2.397457, 0.005046, 0.000000, 0.000000],
  [2.397458, 0.004811, 0.000000, 0.000000],
  [2.397459, 0.004586, 0.000000, 0.000000],
  [2.397460, 0.004372, 0.000000, 0.000000],
  [2.397461, 0.004168, 0.000000, 0.000000],
  [2.397461, 0.003974, 0.000000, 0.000000],
  [2.397462, 0.003788, 0.000000, 0.000000],
  [2.397463, 0.003611, 0.000000, 0.000000],
  [2.397463, 0.003443, 0.000000, 0.000000],
  [2.397464, 0.003282, 0.000000, 0.000000],
  [2.397464, 0.003129, 0.000000, 0.000000],
  [2.397465, 0.002983, 0.000000, 0.000000],
  [2.397465, 0.002844, 0.000000, 0.000000],
  [2.397465, 0.002711, 0.000000, 0.000000],
  [2.397466, 0.002584, 0.000000, 0.000000],
  [2.397466, 0.002464, 0.000000, 0.000000],
  [2.397466, 0.002349, 0.000000, 0.000000],
  [2.397466, 0.002239, 0.000000, 0.000000],
  [2.397467, 0.002135, 0.000000, 0.000000],
  [2.397467, 0.002035, 0.000000, 0.000000],
  [2.397467, 0.001940, 0.000000, 0.000000],
  [2.397467, 0.001849, 0.000000, 0.000000],
  [2.397467, 0.001763, 0.000000, 0.000000],
  [2.397467, 0.001681, 0.000000, 0.000000],
  [2.397468, 0.001602, 0.000000, 0.000000],
  [2.397468, 0.001527, 0.000000, 0.000000],
  [2.397468, 0.001456, 0.000000, 0.000000],
  [2.397468, 0.001388, 0.000000, 0.000000],
  [2.397468, 0.001323, 0.000000, 0.000000],
  [2.397468, 0.001261, 0.000000, 0.000000],
  [2.397468, 0.001202, 0.000000, 0.000000],
  [2.397468, 0.001146, 0.000000, 0.000000],
  [2.397468, 0.001093, 0.000000, 0.000000],
  [2.397468, 0.001042, 0.000000, 0.000000],
  [2.397468, 0.000993, 0.000000, 0.000000],
  [2.397468, 0.000947, 0.000000, 0.000000],
  [2.397468, 0.000902, 0.000000, 0.000000],
  [2.397468, 0.000860, 0.000000, 0.000000],
  [2.397468, 0.000820, 0.000000, 0.000000],
  [2.397469, 0.000782, 0.000000, 0.000000],
  [2.397469, 0.000745, 0.000000, 0.000000],
  [2.397469, 0.000710, 0.000000, 0.000000],
  [2.397469, 0.000677, 0.000000, 0.000000],
  [2.397469, 0.000646, 0.000000, 0.000000],
  [2.397469, 0.000616, 0.000000, 0.000000],
  [2.397469, 0.000587, 0.000000, 0.000000],
  [2.397469, 0.000559, 0.000000, 0.000000],
  [2.397469, 0.000533, 0.000000, 0.000000],
  [2.397469, 0.000508, 0.000000, 0.000000],
  [2.397469, 0.000485, 0.000000, 0.000000],
  [2.397469, 0.000462, 0.000000, 0.000000],
  [2.397469, 0.000440, 0.000000, 0.000000],
  [2.397469, 0.000420, 0.000000, 0.000000],
  [2.397469, 0.000400, 0.000000, 0.000000],
  [2.397469, 0.000381, 0.000000, 0.000000],
  [2.397469, 0.000364, 0.000000, 0.000000],
  [2.397469, 0.000347, 0.000000, 0.000000],
  [2.397469, 0.000330, 0.000000, 0.000000],
  [2.397469, 0.000315, 0.000000, 0.000000],
  [2.397469, 0.000300, 0.000000, 0.000000],
  [2.397469, 0.000286, 0.000000, 0.000000],
  [2.397469, 0.000273, 0.000000, 0.000000],
  [2.397469, 0.000260, 0.000000, 0.000000],
  [2.397469, 0.000248, 0.000000, 0.000000],
  [2.397469, 0.000236, 0.000000, 0.000000],
  [2.397469, 0.000225, 0.000000, 0.000000],
  [2.397469, 0.000215, 0.000000, 0.000000],
  [2.397469, 0.000205, 0.000000, 0.000000],
  [2.397469, 0.000195, 0.000000, 0.000000],
  [2.397469, 0.000186, 0.000000, 0.000000],
  [2.397469, 0.000177, 0.000000, 0.000000],
  [2.397469, 0.000169, 0.000000, 0.000000],
  [2.397469, 0.000161, 0.000000, 0.000000],
  [2.397469, 0.000154, 0.000000, 0.000000],
  [2.397469, 0.000147, 0.000000, 0.000000],
  [2.397469, 0.000140, 0.000000, 0.000000],
  [2.397469, 0.000133, 0.000000, 0.000000],
  [2.397469, 0.000127, 0.000000, 0.000000],
  [2.397469, 0.000121, 0.000000, 0.000000],
  [2.397469, 0.000115, 0.000000, 0.000000],
  [2.397469, 0.000110, 0.000000, 0.000000],
  [2.397469, 0.000105, 0.000000, 0.000000],
  [2.397469, 0.000100, 0.000000, 0.000000],
  [2.397469, 0.000095, 0.000000, 0.000000],
  [2.397469, 0.000091, 0.000000, 0.000000],
  [2.397469, 0.000087, 0.000000, 0.000000],
  [2.397469, 0.000083, 0.000000, 0.000000],
  [2.397469, 0.000079, 0.000000, 0.000000],
  [2.397469, 0.000075, 0.000000, 0.000000],
  [2.397469, 0.000071, 0.000000, 0.000000],
  [2.397469, 0.000068, 0.000000, 0.000000],
  [2.397469, 0.000065, 0.000000, 0.000000],
  [2.397469, 0.000062, 0.000000, 0.000000],
  [2.397469, 0.000059, 0.000000, 0.000000],
  [2.397469, 0.000056, 0.000000, 0.000000],
  [2.397469, 0.000054, 0.000000, 0.000000],
  [2.397469, 0.000051, 0.000000, 0.000000],
  [2.397469, 0.000049, 0.000000, 0.000000],
  [2.397469, 0.000046, 0.000000, 0.000000],
  [2.397469, 0.000044, 0.000000, 0.000000],
  [2.397469, 0.000042, 0.000000, 0.000000],
  [2.397469, 0.000040, 0.000000, 0.000000],
  [2.397469, 0.000038, 0.000000, 0.000000],
  [2.397469, 0.000037, 0.000000, 0.000000],
  [2.397469, 0.000035, 0.000000, 0.000000],
  [2.397469, 0.000033, 0.000000, 0.000000],
  [2.397469, 0.000032, 0.000000, 0.000000],
  [2.397469, 0.000030, 0.000000, 0.000000],
  [2.397469, 0.000029, 0.000000, 0.000000],
  [2.397469, 0.000027, 0.000000, 0.000000],
  [2.397469, 0.000026, 0.000000, 0.000000],
  [2.397469, 0.000025, 0.000000, 0.000000],
  [2.397469, 0.000024, 0.000000, 0.000000],
  [2.397469, 0.000023, 0.000000, 0.000000],
  [2.397469, 0.000022, 0.000000, 0.000000],
  [2.397469, 0.000021, 0.000000, 0.000000],
  [2.397469, 0.000020, 0.000000, 0.000000],
  [2.397469, 0.000019, 0.000000, 0.000000],
  [2.397469, 0.000018, 0.000000, 0.000000],
  [2.397469, 0.000017, 0.000000, 0.000000],
  [2.397469, 0.000016, 0.000000, 0.000000],
  [2.397469, 0.000015, 0.000000, 0.000000],
  [2.397469, 0.000015, 0.000000, 0.000000],
  [2.397469, 0.000014, 0.000000, 0.000000],
  [2.397469, 0.000013, 0.000000, 0.000000],
  [2.397469, 0.000013, 0.000000, 0.000000],
  [2.397469, 0.000012, 0.000000, 0.000000],
  [2.397469, 0.000012, 0.000000, 0.000000],
  [2.397469, 0.000011, 0.000000, 0.000000],
  [2.397469, 0.000011, 0.000000, 0.000000],
  [2.397469, 0.000010, 0.000000, 0.000000],
  [2.397469, 0.000010, 0.000000, 0.000000],
  [2.397469, 0.000009, 0.000000, 0.000000],
  [2.397469, 0.000009, 0.000000, 0.000000],
  [2.397469, 0.000008, 0.000000, 0.000000],
  [2.397469, 0.000008, 0.000000, 0.000000],
  [2.397469, 0.000008, 0.000000, 0.000000],
  [2.397469, 0.000007, 0.000000, 0.000000],
  [2.397469, 0.000007, 0.000000, 0.000000],
  [2.397469, 0.000007, 0.000000, 0.000000],
  [2.397469, 0.000006, 0.000000, 0.000000],
  [2.397469, 0.000006, 0.000000, 0.000000],
  [2.397469, 0.000006, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000001, 0.000000, 0.000000],
  [2.397469, 0.000001, 0.000000, 0.000000],
  [2.397469, 0.000001, 0.000000, 0.000000],
];

/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file ResonanceAudio library common utilities, mathematical constants,
 * and default values.
 * @author Andrew Allen <bitllama@google.com>
 */



/**
 * @file utils.js
 * @description A set of defaults, constants and utility functions.
 */


/**
 * Default input gain (linear).
 * @type {Number}
 */
const DEFAULT_SOURCE_GAIN = 1;


/**
 * Maximum outside-the-room distance to attenuate far-field listener by.
 * @type {Number}
 */
const LISTENER_MAX_OUTSIDE_ROOM_DISTANCE = 1;


/**
 * Maximum outside-the-room distance to attenuate far-field sources by.
 * @type {Number}
 */
const SOURCE_MAX_OUTSIDE_ROOM_DISTANCE = 1;


/** @type {Float32Array} */
const DEFAULT_POSITION = [0, 0, 0];


/** @type {Float32Array} */
const DEFAULT_FORWARD = [0, 0, -1];


/** @type {Float32Array} */
const DEFAULT_UP = [0, 1, 0];


/**
 * @type {Number}
 */
const DEFAULT_SPEED_OF_SOUND = 343;


/** Rolloff models (e.g. 'logarithmic', 'linear', or 'none').
 * @type {Array}
 */
const ATTENUATION_ROLLOFFS = ['logarithmic', 'linear', 'none'];


/** Default rolloff model ('logarithmic').
 * @type {string}
 */
const DEFAULT_ATTENUATION_ROLLOFF = 'logarithmic';


/** @type {Number} */
const DEFAULT_MIN_DISTANCE = 1;


/** @type {Number} */
const DEFAULT_MAX_DISTANCE = 1000;


/**
 * The default alpha (i.e. microphone pattern).
 * @type {Number}
 */
const DEFAULT_DIRECTIVITY_ALPHA = 0;


/**
 * The default pattern sharpness (i.e. pattern exponent).
 * @type {Number}
 */
const DEFAULT_DIRECTIVITY_SHARPNESS = 1;


/**
 * Default azimuth (in degrees). Suitable range is 0 to 360.
 * @type {Number}
 */
const DEFAULT_AZIMUTH = 0;


/**
 * Default elevation (in degres).
 * Suitable range is from -90 (below) to 90 (above).
 * @type {Number}
 */
const DEFAULT_ELEVATION = 0;


/**
 * The default ambisonic order.
 * @type {Number}
 */
const DEFAULT_AMBISONIC_ORDER = 1;


/**
 * The default source width.
 * @type {Number}
 */
const DEFAULT_SOURCE_WIDTH = 0;


/**
 * The maximum delay (in seconds) of a single wall reflection.
 * @type {Number}
 */
const DEFAULT_REFLECTION_MAX_DURATION = 0.5;


/**
 * The -12dB cutoff frequency (in Hertz) for the lowpass filter applied to
 * all reflections.
 * @type {Number}
 */
const DEFAULT_REFLECTION_CUTOFF_FREQUENCY = 6400; // Uses -12dB cutoff.


/**
 * The default reflection coefficients (where 0 = no reflection, 1 = perfect
 * reflection, -1 = mirrored reflection (180-degrees out of phase)).
 * @type {Object}
 */
const DEFAULT_REFLECTION_COEFFICIENTS = {
    left: 0, right: 0, front: 0, back: 0, down: 0, up: 0,
};


/**
 * The minimum distance we consider the listener to be to any given wall.
 * @type {Number}
 */
const DEFAULT_REFLECTION_MIN_DISTANCE = 1;


/**
 * Default room dimensions (in meters).
 * @type {Object}
 */
const DEFAULT_ROOM_DIMENSIONS = {
    width: 0, height: 0, depth: 0,
};


/**
 * The multiplier to apply to distances from the listener to each wall.
 * @type {Number}
 */
const DEFAULT_REFLECTION_MULTIPLIER = 1;


/** The default bandwidth (in octaves) of the center frequencies.
 * @type {Number}
 */
const DEFAULT_REVERB_BANDWIDTH = 1;


/** The default multiplier applied when computing tail lengths.
 * @type {Number}
 */
const DEFAULT_REVERB_DURATION_MULTIPLIER = 1;


/**
 * The late reflections pre-delay (in milliseconds).
 * @type {Number}
 */
const DEFAULT_REVERB_PREDELAY = 1.5;


/**
 * The length of the beginning of the impulse response to apply a
 * half-Hann window to.
 * @type {Number}
 */
const DEFAULT_REVERB_TAIL_ONSET = 3.8;


/**
 * The default gain (linear).
 * @type {Number}
 */
const DEFAULT_REVERB_GAIN = 0.01;


/**
 * The maximum impulse response length (in seconds).
 * @type {Number}
 */
const DEFAULT_REVERB_MAX_DURATION = 3;


/**
 * Center frequencies of the multiband late reflections.
 * Nine bands are computed by: 31.25 * 2^(0:8).
 * @type {Array}
 */
const DEFAULT_REVERB_FREQUENCY_BANDS = [
    31.25, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000,
];


/**
 * The number of frequency bands.
 */
const NUMBER_REVERB_FREQUENCY_BANDS =
    DEFAULT_REVERB_FREQUENCY_BANDS.length;


/**
 * The default multiband RT60 durations (in seconds).
 * @type {Float32Array}
 */
const DEFAULT_REVERB_DURATIONS =
    new Float32Array(NUMBER_REVERB_FREQUENCY_BANDS);


/**
 * Pre-defined frequency-dependent absorption coefficients for listed materials.
 * Currently supported materials are:
 * <ul>
 * <li>'transparent'</li>
 * <li>'acoustic-ceiling-tiles'</li>
 * <li>'brick-bare'</li>
 * <li>'brick-painted'</li>
 * <li>'concrete-block-coarse'</li>
 * <li>'concrete-block-painted'</li>
 * <li>'curtain-heavy'</li>
 * <li>'fiber-glass-insulation'</li>
 * <li>'glass-thin'</li>
 * <li>'glass-thick'</li>
 * <li>'grass'</li>
 * <li>'linoleum-on-concrete'</li>
 * <li>'marble'</li>
 * <li>'metal'</li>
 * <li>'parquet-on-concrete'</li>
 * <li>'plaster-smooth'</li>
 * <li>'plywood-panel'</li>
 * <li>'polished-concrete-or-tile'</li>
 * <li>'sheetrock'</li>
 * <li>'water-or-ice-surface'</li>
 * <li>'wood-ceiling'</li>
 * <li>'wood-panel'</li>
 * <li>'uniform'</li>
 * </ul>
 * @type {Object}
 */
const ROOM_MATERIAL_COEFFICIENTS = {
    'transparent':
        [1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000],
    'acoustic-ceiling-tiles':
        [0.672, 0.675, 0.700, 0.660, 0.720, 0.920, 0.880, 0.750, 1.000],
    'brick-bare':
        [0.030, 0.030, 0.030, 0.030, 0.030, 0.040, 0.050, 0.070, 0.140],
    'brick-painted':
        [0.006, 0.007, 0.010, 0.010, 0.020, 0.020, 0.020, 0.030, 0.060],
    'concrete-block-coarse':
        [0.360, 0.360, 0.360, 0.440, 0.310, 0.290, 0.390, 0.250, 0.500],
    'concrete-block-painted':
        [0.092, 0.090, 0.100, 0.050, 0.060, 0.070, 0.090, 0.080, 0.160],
    'curtain-heavy':
        [0.073, 0.106, 0.140, 0.350, 0.550, 0.720, 0.700, 0.650, 1.000],
    'fiber-glass-insulation':
        [0.193, 0.220, 0.220, 0.820, 0.990, 0.990, 0.990, 0.990, 1.000],
    'glass-thin':
        [0.180, 0.169, 0.180, 0.060, 0.040, 0.030, 0.020, 0.020, 0.040],
    'glass-thick':
        [0.350, 0.350, 0.350, 0.250, 0.180, 0.120, 0.070, 0.040, 0.080],
    'grass':
        [0.050, 0.050, 0.150, 0.250, 0.400, 0.550, 0.600, 0.600, 0.600],
    'linoleum-on-concrete':
        [0.020, 0.020, 0.020, 0.030, 0.030, 0.030, 0.030, 0.020, 0.040],
    'marble':
        [0.010, 0.010, 0.010, 0.010, 0.010, 0.010, 0.020, 0.020, 0.040],
    'metal':
        [0.030, 0.035, 0.040, 0.040, 0.050, 0.050, 0.050, 0.070, 0.090],
    'parquet-on-concrete':
        [0.028, 0.030, 0.040, 0.040, 0.070, 0.060, 0.060, 0.070, 0.140],
    'plaster-rough':
        [0.017, 0.018, 0.020, 0.030, 0.040, 0.050, 0.040, 0.030, 0.060],
    'plaster-smooth':
        [0.011, 0.012, 0.013, 0.015, 0.020, 0.030, 0.040, 0.050, 0.100],
    'plywood-panel':
        [0.400, 0.340, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
    'polished-concrete-or-tile':
        [0.008, 0.008, 0.010, 0.010, 0.015, 0.020, 0.020, 0.020, 0.040],
    'sheet-rock':
        [0.290, 0.279, 0.290, 0.100, 0.050, 0.040, 0.070, 0.090, 0.180],
    'water-or-ice-surface':
        [0.006, 0.006, 0.008, 0.008, 0.013, 0.015, 0.020, 0.025, 0.050],
    'wood-ceiling':
        [0.150, 0.147, 0.150, 0.110, 0.100, 0.070, 0.060, 0.070, 0.140],
    'wood-panel':
        [0.280, 0.280, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
    'uniform':
        [0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500],
};


/**
 * Default materials that use strings from
 * {@linkcode Utils.MATERIAL_COEFFICIENTS MATERIAL_COEFFICIENTS}
 * @type {Object}
 */
const DEFAULT_ROOM_MATERIALS = {
    left: 'transparent', right: 'transparent', front: 'transparent',
    back: 'transparent', down: 'transparent', up: 'transparent',
};


/**
 * The number of bands to average over when computing reflection coefficients.
 * @type {Number}
 */
const NUMBER_REFLECTION_AVERAGING_BANDS = 3;


/**
 * The starting band to average over when computing reflection coefficients.
 * @type {Number}
 */
const ROOM_STARTING_AVERAGING_BAND = 4;


/**
 * The minimum threshold for room volume.
 * Room model is disabled if volume is below this value.
 * @type {Number} */
const ROOM_MIN_VOLUME = 1e-4;


/**
 * Air absorption coefficients per frequency band.
 * @type {Float32Array}
 */
const ROOM_AIR_ABSORPTION_COEFFICIENTS =
    [0.0006, 0.0006, 0.0007, 0.0008, 0.0010, 0.0015, 0.0026, 0.0060, 0.0207];


/**
 * A scalar correction value to ensure Sabine and Eyring produce the same RT60
 * value at the cross-over threshold.
 * @type {Number}
 */
const ROOM_EYRING_CORRECTION_COEFFICIENT = 1.38;


/**
 * @type {Number}
 * @private
 */
const TWO_PI = 6.28318530717959;


/**
 * @type {Number}
 * @private
 */
const TWENTY_FOUR_LOG10 = 55.2620422318571;


/**
 * @type {Number}
 * @private
 */
const LOG1000 = 6.90775527898214;


/**
 * @type {Number}
 * @private
 */
const LOG2_DIV2 = 0.346573590279973;


/**
 * @type {Number}
 * @private
 */
const RADIANS_TO_DEGREES = 57.295779513082323;


/**
 * @type {Number}
 * @private
 */
const EPSILON_FLOAT = 1e-8;


/**
 * Properties describing the geometry of a room.
 * @typedef {Object} Utils~RoomDimensions
 * @property {Number} width (in meters).
 * @property {Number} height (in meters).
 * @property {Number} depth (in meters).
 */

/**
 * Properties describing the wall materials (from
 * {@linkcode Utils.ROOM_MATERIAL_COEFFICIENTS ROOM_MATERIAL_COEFFICIENTS})
 * of a room.
 * @typedef {Object} Utils~RoomMaterials
 * @property {String} left Left-wall material name.
 * @property {String} right Right-wall material name.
 * @property {String} front Front-wall material name.
 * @property {String} back Back-wall material name.
 * @property {String} up Up-wall material name.
 * @property {String} down Down-wall material name.
 */

/**
 * ResonanceAudio library logging function.
 * @type {Function}
 * @param {any} Message to be printed out.
 * @private
 */
const log = function () {
    window.console.log.apply(window.console, [
        '%c[ResonanceAudio]%c '
        + Array.prototype.slice.call(arguments).join(' ') + ' %c(@'
        + performance.now().toFixed(2) + 'ms)',
        'background: #BBDEFB; color: #FF5722; font-weight: 700',
        'font-weight: 400',
        'color: #AAA',
    ]);
};


/**
 * Normalize a 3-d vector.
 * @param {Float32Array} v 3-element vector.
 * @return {Float32Array} 3-element vector.
 * @private
 */
const normalizeVector = function (v) {
    let n = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (n > EPSILON_FLOAT) {
        n = 1 / n;
        v[0] *= n;
        v[1] *= n;
        v[2] *= n;
    }
    return v;
};


/**
 * Cross-product between two 3-d vectors.
 * @param {Float32Array} a 3-element vector.
 * @param {Float32Array} b 3-element vector.
 * @return {Float32Array}
 * @private
 */
const crossProduct = function (a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
};

/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @class Encoder
 * @description Spatially encodes input using weighted spherical harmonics.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.ambisonicOrder
 * Desired ambisonic order. Defaults to
 * {@linkcode Utils.DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
 * @param {Number} options.azimuth
 * Azimuth (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_AZIMUTH DEFAULT_AZIMUTH}.
 * @param {Number} options.elevation
 * Elevation (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_ELEVATION DEFAULT_ELEVATION}.
 * @param {Number} options.sourceWidth
 * Source width (in degrees). Where 0 degrees is a point source and 360 degrees
 * is an omnidirectional source. Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_WIDTH DEFAULT_SOURCE_WIDTH}.
 */
class Encoder {
    constructor(context, options) {
        // Public variables.
        /**
         * Mono (1-channel) input {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} input
         * @memberof Encoder
         * @instance
         */
        /**
         * Ambisonic (multichannel) output {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} output
         * @memberof Encoder
         * @instance
         */

        // Use defaults for undefined arguments.
        if (options == undefined) {
            options = {};
        }
        if (options.ambisonicOrder == undefined) {
            options.ambisonicOrder = DEFAULT_AMBISONIC_ORDER;
        }
        if (options.azimuth == undefined) {
            options.azimuth = DEFAULT_AZIMUTH;
        }
        if (options.elevation == undefined) {
            options.elevation = DEFAULT_ELEVATION;
        }
        if (options.sourceWidth == undefined) {
            options.sourceWidth = DEFAULT_SOURCE_WIDTH;
        }

        this._context = context;

        // Create I/O nodes.
        this.input = context.createGain();
        this._channelGain = [];
        this._merger = undefined;
        this.output = context.createGain();

        // Set initial order, angle and source width.
        this.setAmbisonicOrder(options.ambisonicOrder);
        this._azimuth = options.azimuth;
        this._elevation = options.elevation;
        this.setSourceWidth(options.sourceWidth);
    }

    /**
     * Set the desired ambisonic order.
     * @param {Number} ambisonicOrder Desired ambisonic order.
     */
    setAmbisonicOrder(ambisonicOrder) {
        this._ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);

        this.input.disconnect();
        for (let i = 0; i < this._channelGain.length; i++) {
            this._channelGain[i].disconnect();
        }
        if (this._merger != undefined) {
            this._merger.disconnect();
        }
        delete this._channelGain;
        delete this._merger;

        // Create audio graph.
        let numChannels = (this._ambisonicOrder + 1) * (this._ambisonicOrder + 1);
        this._merger = this._context.createChannelMerger(numChannels);
        this._channelGain = new Array(numChannels);
        for (let i = 0; i < numChannels; i++) {
            this._channelGain[i] = this._context.createGain();
            this.input.connect(this._channelGain[i]);
            this._channelGain[i].connect(this._merger, 0, i);
        }
        this._merger.connect(this.output);
    }


    /**
     * Set the direction of the encoded source signal.
     * @param {Number} azimuth
     * Azimuth (in degrees). Defaults to
     * {@linkcode Utils.DEFAULT_AZIMUTH DEFAULT_AZIMUTH}.
     * @param {Number} elevation
     * Elevation (in degrees). Defaults to
     * {@linkcode Utils.DEFAULT_ELEVATION DEFAULT_ELEVATION}.
     */
    setDirection(azimuth, elevation) {
        // Format input direction to nearest indices.
        if (azimuth == undefined || isNaN(azimuth)) {
            azimuth = DEFAULT_AZIMUTH;
        }
        if (elevation == undefined || isNaN(elevation)) {
            elevation = DEFAULT_ELEVATION;
        }

        // Store the formatted input (for updating source width).
        this._azimuth = azimuth;
        this._elevation = elevation;

        // Format direction for index lookups.
        azimuth = Math.round(azimuth % 360);
        if (azimuth < 0) {
            azimuth += 360;
        }
        elevation = Math.round(Math.min(90, Math.max(-90, elevation))) + 90;

        // Assign gains to each output.
        this._channelGain[0].gain.value = MAX_RE_WEIGHTS[this._spreadIndex][0];
        for (let i = 1; i <= this._ambisonicOrder; i++) {
            let degreeWeight = MAX_RE_WEIGHTS[this._spreadIndex][i];
            for (let j = -i; j <= i; j++) {
                let acnChannel = (i * i) + i + j;
                let elevationIndex = i * (i + 1) / 2 + Math.abs(j) - 1;
                let val = SPHERICAL_HARMONICS[1][elevation][elevationIndex];
                if (j != 0) {
                    let azimuthIndex = SPHERICAL_HARMONICS_MAX_ORDER + j - 1;
                    if (j < 0) {
                        azimuthIndex = SPHERICAL_HARMONICS_MAX_ORDER + j;
                    }
                    val *= SPHERICAL_HARMONICS[0][azimuth][azimuthIndex];
                }
                this._channelGain[acnChannel].gain.value = val * degreeWeight;
            }
        }
    }


    /**
     * Set the source width (in degrees). Where 0 degrees is a point source and 360
     * degrees is an omnidirectional source.
     * @param {Number} sourceWidth (in degrees).
     */
    setSourceWidth(sourceWidth) {
        // The MAX_RE_WEIGHTS is a 360 x (Tables.SPHERICAL_HARMONICS_MAX_ORDER+1)
        // size table.
        this._spreadIndex = Math.min(359, Math.max(0, Math.round(sourceWidth)));
        this.setDirection(this._azimuth, this._elevation);
    }
}


/**
 * Validate the provided ambisonic order.
 * @param {Number} ambisonicOrder Desired ambisonic order.
 * @return {Number} Validated/adjusted ambisonic order.
 * @private
 */
Encoder.validateAmbisonicOrder = function (ambisonicOrder) {
    if (isNaN(ambisonicOrder) || ambisonicOrder == undefined) {
        log('Error: Invalid ambisonic order',
            options.ambisonicOrder, '\nUsing ambisonicOrder=1 instead.');
        ambisonicOrder = 1;
    } else if (ambisonicOrder < 1) {
        log('Error: Unable to render ambisonic order',
            options.ambisonicOrder, '(Min order is 1)',
            '\nUsing min order instead.');
        ambisonicOrder = 1;
    } else if (ambisonicOrder > SPHERICAL_HARMONICS_MAX_ORDER) {
        log('Error: Unable to render ambisonic order',
            options.ambisonicOrder, '(Max order is',
            SPHERICAL_HARMONICS_MAX_ORDER, ')\nUsing max order instead.');
        options.ambisonicOrder = SPHERICAL_HARMONICS_MAX_ORDER;
    }
    return ambisonicOrder;
};

/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @class Listener
 * @description Listener model to spatialize sources in an environment.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.ambisonicOrder
 * Desired ambisonic order. Defaults to
 * {@linkcode Utils.DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
 * @param {Float32Array} options.position
 * Initial position (in meters), where origin is the center of
 * the room. Defaults to
 * {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Float32Array} options.forward
 * The listener's initial forward vector. Defaults to
 * {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @param {Float32Array} options.up
 * The listener's initial up vector. Defaults to
 * {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 */
class Listener {
    constructor(context, options) {
        // Public variables.
        /**
         * Position (in meters).
         * @member {Float32Array} position
         * @memberof Listener
         * @instance
         */
        /**
         * Ambisonic (multichannel) input {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} input
         * @memberof Listener
         * @instance
         */
        /**
         * Binaurally-rendered stereo (2-channel) output {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} output
         * @memberof Listener
         * @instance
         */
        /**
         * Ambisonic (multichannel) output {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} ambisonicOutput
         * @memberof Listener
         * @instance
         */
        // Use defaults for undefined arguments.
        if (options == undefined) {
            options = {};
        }
        if (options.ambisonicOrder == undefined) {
            options.ambisonicOrder = DEFAULT_AMBISONIC_ORDER;
        }
        if (options.position == undefined) {
            options.position = DEFAULT_POSITION.slice();
        }
        if (options.forward == undefined) {
            options.forward = DEFAULT_FORWARD.slice();
        }
        if (options.up == undefined) {
            options.up = DEFAULT_UP.slice();
        }

        // Member variables.
        this.position = new Float32Array(3);
        this._tempMatrix3 = new Float32Array(9);

        // Select the appropriate HRIR filters using 2-channel chunks since
        // multichannel audio is not yet supported by a majority of browsers.
        this._ambisonicOrder =
            Encoder.validateAmbisonicOrder(options.ambisonicOrder);

        // Create audio nodes.
        this._context = context;
        if (this._ambisonicOrder == 1) {
            this._renderer = Omnitone.createFOARenderer(context, {});
        } else if (this._ambisonicOrder > 1) {
            this._renderer = Omnitone.createHOARenderer(context, {
                ambisonicOrder: this._ambisonicOrder,
            });
        }

        // These nodes are created in order to safely asynchronously load Omnitone
        // while the rest of the scene is being created.
        this.input = context.createGain();
        this.output = context.createGain();
        this.ambisonicOutput = context.createGain();

        // Initialize Omnitone (async) and connect to audio graph when complete.
        let that = this;
        this._renderer.initialize().then(function () {
            // Connect pre-rotated soundfield to renderer.
            that.input.connect(that._renderer.input);

            // Connect rotated soundfield to ambisonic output.
            if (that._ambisonicOrder > 1) {
                that._renderer._hoaRotator.output.connect(that.ambisonicOutput);
            } else {
                that._renderer._foaRotator.output.connect(that.ambisonicOutput);
            }

            // Connect binaurally-rendered soundfield to binaural output.
            that._renderer.output.connect(that.output);
        });

        // Set orientation and update rotation matrix accordingly.
        this.setOrientation(
            options.forward[0], options.forward[1], options.forward[2],
            options.up[0], options.up[1], options.up[2]);
    }


    /**
     * Set the source's orientation using forward and up vectors.
     * @param {Number} forwardX
     * @param {Number} forwardY
     * @param {Number} forwardZ
     * @param {Number} upX
     * @param {Number} upY
     * @param {Number} upZ
     */
    setOrientation(forwardX, forwardY, forwardZ,
        upX, upY, upZ) {
        let right = crossProduct([forwardX, forwardY, forwardZ],
            [upX, upY, upZ]);
        this._tempMatrix3[0] = right[0];
        this._tempMatrix3[1] = right[1];
        this._tempMatrix3[2] = right[2];
        this._tempMatrix3[3] = upX;
        this._tempMatrix3[4] = upY;
        this._tempMatrix3[5] = upZ;
        this._tempMatrix3[6] = forwardX;
        this._tempMatrix3[7] = forwardY;
        this._tempMatrix3[8] = forwardZ;
        this._renderer.setRotationMatrix3(this._tempMatrix3);
    }


    /**
     * Set the listener's position and orientation using a Three.js Matrix4 object.
     * @param {Object} matrix4
     * The Three.js Matrix4 object representing the listener's world transform.
     */
    setFromMatrix(matrix4) {
        // Update ambisonic rotation matrix internally.
        this._renderer.setRotationMatrix4(matrix4.elements);

        // Extract position from matrix.
        this.position[0] = matrix4.elements[12];
        this.position[1] = matrix4.elements[13];
        this.position[2] = matrix4.elements[14];
    }
}

/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @class Directivity
 * @description Directivity/occlusion filter.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.alpha
 * Determines directivity pattern (0 to 1). See
 * {@link Directivity#setPattern setPattern} for more details. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_ALPHA DEFAULT_DIRECTIVITY_ALPHA}.
 * @param {Number} options.sharpness
 * Determines the sharpness of the directivity pattern (1 to Inf). See
 * {@link Directivity#setPattern setPattern} for more details. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_SHARPNESS
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 */
class Directivity {
    constructor(context, options) {
        // Public variables.
        /**
         * Mono (1-channel) input {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} input
         * @memberof Directivity
         * @instance
         */
        /**
         * Mono (1-channel) output {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} output
         * @memberof Directivity
         * @instance
         */

        // Use defaults for undefined arguments.
        if (options == undefined) {
            options = {};
        }
        if (options.alpha == undefined) {
            options.alpha = DEFAULT_DIRECTIVITY_ALPHA;
        }
        if (options.sharpness == undefined) {
            options.sharpness = DEFAULT_DIRECTIVITY_SHARPNESS;
        }

        // Create audio node.
        this._context = context;
        this._lowpass = context.createBiquadFilter();

        // Initialize filter coefficients.
        this._lowpass.type = 'lowpass';
        this._lowpass.Q.value = 0;
        this._lowpass.frequency.value = context.sampleRate * 0.5;

        this._cosTheta = 0;
        this.setPattern(options.alpha, options.sharpness);

        // Input/Output proxy.
        this.input = this._lowpass;
        this.output = this._lowpass;
    }


    /**
     * Compute the filter using the source's forward orientation and the listener's
     * position.
     * @param {Float32Array} forward The source's forward vector.
     * @param {Float32Array} direction The direction from the source to the
     * listener.
     */
    computeAngle(forward, direction) {
        let forwardNorm = normalizeVector(forward);
        let directionNorm = normalizeVector(direction);
        let coeff = 1;
        if (this._alpha > EPSILON_FLOAT) {
            let cosTheta = forwardNorm[0] * directionNorm[0] +
                forwardNorm[1] * directionNorm[1] + forwardNorm[2] * directionNorm[2];
            coeff = (1 - this._alpha) + this._alpha * cosTheta;
            coeff = Math.pow(Math.abs(coeff), this._sharpness);
        }
        this._lowpass.frequency.value = this._context.sampleRate * 0.5 * coeff;
    }


    /**
     * Set source's directivity pattern (defined by alpha), where 0 is an
     * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
     * pattern. The sharpness of the pattern is increased exponenentially.
     * @param {Number} alpha
     * Determines directivity pattern (0 to 1).
     * @param {Number} sharpness
     * Determines the sharpness of the directivity pattern (1 to Inf).
     * DEFAULT_DIRECTIVITY_SHARPNESS}.
     */
    setPattern(alpha, sharpness) {
        // Clamp and set values.
        this._alpha = Math.min(1, Math.max(0, alpha));
        this._sharpness = Math.max(1, sharpness);

        // Update angle calculation using new values.
        this.computeAngle([this._cosTheta * this._cosTheta, 0, 0], [1, 0, 0]);
    }
}

/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @class Attenuation
 * @description Distance-based attenuation filter.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.minDistance
 * Min. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MIN_DISTANCE DEFAULT_MIN_DISTANCE}.
 * @param {Number} options.maxDistance
 * Max. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MAX_DISTANCE DEFAULT_MAX_DISTANCE}.
 * @param {string} options.rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}. Defaults to
 * {@linkcode Utils.DEFAULT_ATTENUATION_ROLLOFF DEFAULT_ATTENUATION_ROLLOFF}.
 */
class Attenuation {
    constructor(context, options) {
        // Public variables.
        /**
         * Min. distance (in meters).
         * @member {Number} minDistance
         * @memberof Attenuation
         * @instance
         */
        /**
         * Max. distance (in meters).
         * @member {Number} maxDistance
         * @memberof Attenuation
         * @instance
         */
        /**
         * Mono (1-channel) input {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} input
         * @memberof Attenuation
         * @instance
         */
        /**
         * Mono (1-channel) output {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} output
         * @memberof Attenuation
         * @instance
         */

        // Use defaults for undefined arguments.
        if (options == undefined) {
            options = {};
        }
        if (options.minDistance == undefined) {
            options.minDistance = DEFAULT_MIN_DISTANCE;
        }
        if (options.maxDistance == undefined) {
            options.maxDistance = DEFAULT_MAX_DISTANCE;
        }
        if (options.rolloff == undefined) {
            options.rolloff = DEFAULT_ATTENUATION_ROLLOFF;
        }

        // Assign values.
        this.minDistance = options.minDistance;
        this.maxDistance = options.maxDistance;
        this.setRolloff(options.rolloff);

        // Create node.
        this._gainNode = context.createGain();

        // Initialize distance to max distance.
        this.setDistance(options.maxDistance);

        // Input/Output proxy.
        this.input = this._gainNode;
        this.output = this._gainNode;
    }


    /**
     * Set distance from the listener.
     * @param {Number} distance Distance (in meters).
     */
    setDistance(distance) {
        let gain = 1;
        if (this._rolloff == 'logarithmic') {
            if (distance > this.maxDistance) {
                gain = 0;
            } else if (distance > this.minDistance) {
                let range = this.maxDistance - this.minDistance;
                if (range > EPSILON_FLOAT) {
                    // Compute the distance attenuation value by the logarithmic curve
                    // "1 / (d + 1)" with an offset of |minDistance|.
                    let relativeDistance = distance - this.minDistance;
                    let attenuation = 1 / (relativeDistance + 1);
                    let attenuationMax = 1 / (range + 1);
                    gain = (attenuation - attenuationMax) / (1 - attenuationMax);
                }
            }
        } else if (this._rolloff == 'linear') {
            if (distance > this.maxDistance) {
                gain = 0;
            } else if (distance > this.minDistance) {
                let range = this.maxDistance - this.minDistance;
                if (range > EPSILON_FLOAT) {
                    gain = (this.maxDistance - distance) / range;
                }
            }
        }
        this._gainNode.gain.value = gain;
    }


    /**
     * Set rolloff.
     * @param {string} rolloff
     * Rolloff model to use, chosen from options in
     * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
     */
    setRolloff(rolloff) {
        let isValidModel = ~ATTENUATION_ROLLOFFS.indexOf(rolloff);
        if (rolloff == undefined || !isValidModel) {
            if (!isValidModel) {
                log('Invalid rolloff model (\"' + rolloff +
                    '\"). Using default: \"' + DEFAULT_ATTENUATION_ROLLOFF + '\".');
            }
            rolloff = DEFAULT_ATTENUATION_ROLLOFF;
        } else {
            rolloff = rolloff.toString().toLowerCase();
        }
        this._rolloff = rolloff;
    }
}

/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Options for constructing a new Source.
 * @typedef {Object} Source~SourceOptions
 * @property {Float32Array} position
 * The source's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @property {Float32Array} forward
 * The source's initial forward vector. Defaults to
 * {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @property {Float32Array} up
 * The source's initial up vector. Defaults to
 * {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 * @property {Number} minDistance
 * Min. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MIN_DISTANCE DEFAULT_MIN_DISTANCE}.
 * @property {Number} maxDistance
 * Max. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MAX_DISTANCE DEFAULT_MAX_DISTANCE}.
 * @property {string} rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}. Defaults to
 * {@linkcode Utils.DEFAULT_ATTENUATION_ROLLOFF DEFAULT_ATTENUATION_ROLLOFF}.
 * @property {Number} gain Input gain (linear). Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_GAIN DEFAULT_SOURCE_GAIN}.
 * @property {Number} alpha Directivity alpha. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_ALPHA DEFAULT_DIRECTIVITY_ALPHA}.
 * @property {Number} sharpness Directivity sharpness. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_SHARPNESS
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 * @property {Number} sourceWidth
 * Source width (in degrees). Where 0 degrees is a point source and 360 degrees
 * is an omnidirectional source. Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_WIDTH DEFAULT_SOURCE_WIDTH}.
 */


/**
 * Determine the distance a source is outside of a room. Attenuate gain going
 * to the reflections and reverb when the source is outside of the room.
 * @param {Number} distance Distance in meters.
 * @return {Number} Gain (linear) of source.
 * @private
 */
function _computeDistanceOutsideRoom(distance) {
    // We apply a linear ramp from 1 to 0 as the source is up to 1m outside.
    let gain = 1;
    if (distance > EPSILON_FLOAT) {
        gain = 1 - distance / SOURCE_MAX_OUTSIDE_ROOM_DISTANCE;

        // Clamp gain between 0 and 1.
        gain = Math.max(0, Math.min(1, gain));
    }
    return gain;
}

/**
 * @class Source
 * @description Source model to spatialize an audio buffer.
 * @param {ResonanceAudio} scene Associated {@link ResonanceAudio
 * ResonanceAudio} instance.
 * @param {Source~SourceOptions} options
 * Options for constructing a new Source.
 */
class Source {
    constructor(scene, options) {
        // Public variables.
        /**
         * Mono (1-channel) input {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} input
         * @memberof Source
         * @instance
         */
        /**
         *
         */

        // Use defaults for undefined arguments.
        if (options == undefined) {
            options = {};
        }
        if (options.position == undefined) {
            options.position = DEFAULT_POSITION.slice();
        }
        if (options.forward == undefined) {
            options.forward = DEFAULT_FORWARD.slice();
        }
        if (options.up == undefined) {
            options.up = DEFAULT_UP.slice();
        }
        if (options.minDistance == undefined) {
            options.minDistance = DEFAULT_MIN_DISTANCE;
        }
        if (options.maxDistance == undefined) {
            options.maxDistance = DEFAULT_MAX_DISTANCE;
        }
        if (options.rolloff == undefined) {
            options.rolloff = DEFAULT_ATTENUATION_ROLLOFF;
        }
        if (options.gain == undefined) {
            options.gain = DEFAULT_SOURCE_GAIN;
        }
        if (options.alpha == undefined) {
            options.alpha = DEFAULT_DIRECTIVITY_ALPHA;
        }
        if (options.sharpness == undefined) {
            options.sharpness = DEFAULT_DIRECTIVITY_SHARPNESS;
        }
        if (options.sourceWidth == undefined) {
            options.sourceWidth = DEFAULT_SOURCE_WIDTH;
        }

        // Member variables.
        this._scene = scene;
        this._position = options.position;
        this._forward = options.forward;
        this._up = options.up;
        this._dx = new Float32Array(3);
        this._right = crossProduct(this._forward, this._up);

        // Create audio nodes.
        let context = scene._context;
        this.input = context.createGain();
        this._directivity = new Directivity(context, {
            alpha: options.alpha,
            sharpness: options.sharpness,
        });
        this._toEarly = context.createGain();
        this._toLate = context.createGain();
        this._attenuation = new Attenuation(context, {
            minDistance: options.minDistance,
            maxDistance: options.maxDistance,
            rolloff: options.rolloff,
        });
        this._encoder = new Encoder(context, {
            ambisonicOrder: scene._ambisonicOrder,
            sourceWidth: options.sourceWidth,
        });

        // Connect nodes.
        this.input.connect(this._toLate);
        this._toLate.connect(scene._room.late.input);

        this.input.connect(this._attenuation.input);
        this._attenuation.output.connect(this._toEarly);
        this._toEarly.connect(scene._room.early.input);

        this._attenuation.output.connect(this._directivity.input);
        this._directivity.output.connect(this._encoder.input);

        this._encoder.output.connect(scene._listener.input);

        // Assign initial conditions.
        this.setPosition(
            options.position[0], options.position[1], options.position[2]);
        this.input.gain.value = options.gain;
    }


    /**
     * Set source's position (in meters), where origin is the center of
     * the room.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */
    setPosition(x, y, z) {
        // Assign new position.
        this._position[0] = x;
        this._position[1] = y;
        this._position[2] = z;

        // Handle far-field effect.
        let distance = this._scene._room.getDistanceOutsideRoom(
            this._position[0], this._position[1], this._position[2]);
        let gain = _computeDistanceOutsideRoom(distance);
        this._toLate.gain.value = gain;
        this._toEarly.gain.value = gain;

        this._update();
    }


    // Update the source when changing the listener's position.
    _update() {
        // Compute distance to listener.
        for (let i = 0; i < 3; i++) {
            this._dx[i] = this._position[i] - this._scene._listener.position[i];
        }
        let distance = Math.sqrt(this._dx[0] * this._dx[0] +
            this._dx[1] * this._dx[1] + this._dx[2] * this._dx[2]);
        if (distance > 0) {
            // Normalize direction vector.
            this._dx[0] /= distance;
            this._dx[1] /= distance;
            this._dx[2] /= distance;
        }

        // Compuete angle of direction vector.
        let azimuth = Math.atan2(-this._dx[0], this._dx[2]) *
            RADIANS_TO_DEGREES;
        let elevation = Math.atan2(this._dx[1], Math.sqrt(this._dx[0] * this._dx[0] +
            this._dx[2] * this._dx[2])) * RADIANS_TO_DEGREES;

        // Set distance/directivity/direction values.
        this._attenuation.setDistance(distance);
        this._directivity.computeAngle(this._forward, this._dx);
        this._encoder.setDirection(azimuth, elevation);
    }


    /**
     * Set source's rolloff.
     * @param {string} rolloff
     * Rolloff model to use, chosen from options in
     * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
     */
    setRolloff(rolloff) {
        this._attenuation.setRolloff(rolloff);
    }


    /**
     * Set source's minimum distance (in meters).
     * @param {Number} minDistance
     */
    setMinDistance(minDistance) {
        this._attenuation.minDistance = minDistance;
    }


    /**
     * Set source's maximum distance (in meters).
     * @param {Number} maxDistance
     */
    setMaxDistance(maxDistance) {
        this._attenuation.maxDistance = maxDistance;
    }


    /**
     * Set source's gain (linear).
     * @param {Number} gain
     */
    setGain(gain) {
        this.input.gain.value = gain;
    }


    /**
     * Set the source's orientation using forward and up vectors.
     * @param {Number} forwardX
     * @param {Number} forwardY
     * @param {Number} forwardZ
     * @param {Number} upX
     * @param {Number} upY
     * @param {Number} upZ
     */
    setOrientation(forwardX, forwardY, forwardZ,
        upX, upY, upZ) {
        this._forward[0] = forwardX;
        this._forward[1] = forwardY;
        this._forward[2] = forwardZ;
        this._up[0] = upX;
        this._up[1] = upY;
        this._up[2] = upZ;
        this._right = crossProduct(this._forward, this._up);
    }


    // TODO(bitllama): Make sure this works with Three.js as intended.
    /**
     * Set source's position and orientation using a
     * Three.js modelViewMatrix object.
     * @param {Float32Array} matrix4
     * The Matrix4 representing the object position and rotation in world space.
     */
    setFromMatrix(matrix4) {
        this._right[0] = matrix4.elements[0];
        this._right[1] = matrix4.elements[1];
        this._right[2] = matrix4.elements[2];
        this._up[0] = matrix4.elements[4];
        this._up[1] = matrix4.elements[5];
        this._up[2] = matrix4.elements[6];
        this._forward[0] = matrix4.elements[8];
        this._forward[1] = matrix4.elements[9];
        this._forward[2] = matrix4.elements[10];

        // Normalize to remove scaling.
        this._right = normalizeVector(this._right);
        this._up = normalizeVector(this._up);
        this._forward = normalizeVector(this._forward);

        // Update position.
        this.setPosition(
            matrix4.elements[12], matrix4.elements[13], matrix4.elements[14]);
    }


    /**
     * Set the source width (in degrees). Where 0 degrees is a point source and 360
     * degrees is an omnidirectional source.
     * @param {Number} sourceWidth (in degrees).
     */
    setSourceWidth(sourceWidth) {
        this._encoder.setSourceWidth(sourceWidth);
        this.setPosition(this._position[0], this._position[1], this._position[2]);
    }


    /**
     * Set source's directivity pattern (defined by alpha), where 0 is an
     * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
     * pattern. The sharpness of the pattern is increased exponentially.
     * @param {Number} alpha
     * Determines directivity pattern (0 to 1).
     * @param {Number} sharpness
     * Determines the sharpness of the directivity pattern (1 to Inf).
     */
    setDirectivityPattern(alpha, sharpness) {
        this._directivity.setPattern(alpha, sharpness);
        this.setPosition(this._position[0], this._position[1], this._position[2]);
    }
}

/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @class LateReflections
 * @description Late-reflections reverberation filter for Ambisonic content.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Array} options.durations
 * Multiband RT60 durations (in seconds) for each frequency band, listed as
 * {@linkcode Utils.DEFAULT_REVERB_FREQUENCY_BANDS
 * FREQUDEFAULT_REVERB_FREQUENCY_BANDSENCY_BANDS}. Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_DURATIONS DEFAULT_REVERB_DURATIONS}.
 * @param {Number} options.predelay Pre-delay (in milliseconds). Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_PREDELAY DEFAULT_REVERB_PREDELAY}.
 * @param {Number} options.gain Output gain (linear). Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_GAIN DEFAULT_REVERB_GAIN}.
 * @param {Number} options.bandwidth Bandwidth (in octaves) for each frequency
 * band. Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_BANDWIDTH DEFAULT_REVERB_BANDWIDTH}.
 * @param {Number} options.tailonset Length (in milliseconds) of impulse
 * response to apply a half-Hann window. Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_TAIL_ONSET DEFAULT_REVERB_TAIL_ONSET}.
 */
class LateReflections {
    constructor(context, options) {
        // Public variables.
        /**
         * Mono (1-channel) input {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} input
         * @memberof LateReflections
         * @instance
         */
        /**
         * Mono (1-channel) output {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} output
         * @memberof LateReflections
         * @instance
         */

        // Use defaults for undefined arguments.
        if (options == undefined) {
            options = {};
        }
        if (options.durations == undefined) {
            options.durations = DEFAULT_REVERB_DURATIONS.slice();
        }
        if (options.predelay == undefined) {
            options.predelay = DEFAULT_REVERB_PREDELAY;
        }
        if (options.gain == undefined) {
            options.gain = DEFAULT_REVERB_GAIN;
        }
        if (options.bandwidth == undefined) {
            options.bandwidth = DEFAULT_REVERB_BANDWIDTH;
        }
        if (options.tailonset == undefined) {
            options.tailonset = DEFAULT_REVERB_TAIL_ONSET;
        }

        // Assign pre-computed variables.
        let delaySecs = options.predelay / 1000;
        this._bandwidthCoeff = options.bandwidth * LOG2_DIV2;
        this._tailonsetSamples = options.tailonset / 1000;

        // Create nodes.
        this._context = context;
        this.input = context.createGain();
        this._predelay = context.createDelay(delaySecs);
        this._convolver = context.createConvolver();
        this.output = context.createGain();

        // Set reverb attenuation.
        this.output.gain.value = options.gain;

        // Disable normalization.
        this._convolver.normalize = false;

        // Connect nodes.
        this.input.connect(this._predelay);
        this._predelay.connect(this._convolver);
        this._convolver.connect(this.output);

        // Compute IR using RT60 values.
        this.setDurations(options.durations);
    }


    /**
     * Re-compute a new impulse response by providing Multiband RT60 durations.
     * @param {Array} durations
     * Multiband RT60 durations (in seconds) for each frequency band, listed as
     * {@linkcode Utils.DEFAULT_REVERB_FREQUENCY_BANDS
     * DEFAULT_REVERB_FREQUENCY_BANDS}.
     */
    setDurations(durations) {
        if (durations.length !== NUMBER_REVERB_FREQUENCY_BANDS) {
            log('Warning: invalid number of RT60 values provided to reverb.');
            return;
        }

        // Compute impulse response.
        let durationsSamples =
            new Float32Array(NUMBER_REVERB_FREQUENCY_BANDS);
        let sampleRate = this._context.sampleRate;

        for (let i = 0; i < durations.length; i++) {
            // Clamp within suitable range.
            durations[i] =
                Math.max(0, Math.min(DEFAULT_REVERB_MAX_DURATION, durations[i]));

            // Convert seconds to samples.
            durationsSamples[i] = Math.round(durations[i] * sampleRate *
                DEFAULT_REVERB_DURATION_MULTIPLIER);
        }
        // Determine max RT60 length in samples.
        let durationsSamplesMax = 0;
        for (let i = 0; i < durationsSamples.length; i++) {
            if (durationsSamples[i] > durationsSamplesMax) {
                durationsSamplesMax = durationsSamples[i];
            }
        }

        // Skip this step if there is no reverberation to compute.
        if (durationsSamplesMax < 1) {
            durationsSamplesMax = 1;
        }

        // Create impulse response buffer.
        let buffer = this._context.createBuffer(1, durationsSamplesMax, sampleRate);
        let bufferData = buffer.getChannelData(0);

        // Create noise signal (computed once, referenced in each band's routine).
        let noiseSignal = new Float32Array(durationsSamplesMax);
        for (let i = 0; i < durationsSamplesMax; i++) {
            noiseSignal[i] = Math.random() * 2 - 1;
        }

        // Compute the decay rate per-band and filter the decaying noise signal.
        for (let i = 0; i < NUMBER_REVERB_FREQUENCY_BANDS; i++) {
            // Compute decay rate.
            let decayRate = -LOG1000 / durationsSamples[i];

            // Construct a standard one-zero, two-pole bandpass filter:
            // H(z) = (b0 * z^0 + b1 * z^-1 + b2 * z^-2) / (1 + a1 * z^-1 + a2 * z^-2)
            let omega = TWO_PI *
                DEFAULT_REVERB_FREQUENCY_BANDS[i] / sampleRate;
            let sinOmega = Math.sin(omega);
            let alpha = sinOmega * Math.sinh(this._bandwidthCoeff * omega / sinOmega);
            let a0CoeffReciprocal = 1 / (1 + alpha);
            let b0Coeff = alpha * a0CoeffReciprocal;
            let a1Coeff = -2 * Math.cos(omega) * a0CoeffReciprocal;
            let a2Coeff = (1 - alpha) * a0CoeffReciprocal;

            // We optimize since b2 = -b0, b1 = 0.
            // Update equation for two-pole bandpass filter:
            //   u[n] = x[n] - a1 * x[n-1] - a2 * x[n-2]
            //   y[n] = b0 * (u[n] - u[n-2])
            let um1 = 0;
            let um2 = 0;
            for (let j = 0; j < durationsSamples[i]; j++) {
                // Exponentially-decaying white noise.
                let x = noiseSignal[j] * Math.exp(decayRate * j);

                // Filter signal with bandpass filter and add to output.
                let u = x - a1Coeff * um1 - a2Coeff * um2;
                bufferData[j] += b0Coeff * (u - um2);

                // Update coefficients.
                um2 = um1;
                um1 = u;
            }
        }

        // Create and apply half of a Hann window to the beginning of the
        // impulse response.
        let halfHannLength =
            Math.round(this._tailonsetSamples);
        for (let i = 0; i < Math.min(bufferData.length, halfHannLength); i++) {
            let halfHann =
                0.5 * (1 - Math.cos(TWO_PI * i / (2 * halfHannLength - 1)));
            bufferData[i] *= halfHann;
        }
        this._convolver.buffer = buffer;
    }
}

/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @class EarlyReflections
 * @description Ray-tracing-based early reflections model.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Utils~RoomDimensions} options.dimensions
 * Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} options.coefficients
 * Frequency-independent reflection coeffs per wall. Defaults to
 * {@linkcode Utils.DEFAULT_REFLECTION_COEFFICIENTS
 * DEFAULT_REFLECTION_COEFFICIENTS}.
 * @param {Number} options.speedOfSound
 * (in meters / second). Defaults to {@linkcode Utils.DEFAULT_SPEED_OF_SOUND
 * DEFAULT_SPEED_OF_SOUND}.
 * @param {Float32Array} options.listenerPosition
 * (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 */
class EarlyReflections {
    constructor(context, options) {
        // Public variables.
        /**
         * The room's speed of sound (in meters/second).
         * @member {Number} speedOfSound
         * @memberof EarlyReflections
         * @instance
         */
        /**
         * Mono (1-channel) input {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} input
         * @memberof EarlyReflections
         * @instance
         */
        /**
         * First-order ambisonic (4-channel) output {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} output
         * @memberof EarlyReflections
         * @instance
         */

        // Use defaults for undefined arguments.
        if (options == undefined) {
            options = {};
        }
        if (options.speedOfSound == undefined) {
            options.speedOfSound = DEFAULT_SPEED_OF_SOUND;
        }
        if (options.listenerPosition == undefined) {
            options.listenerPosition = DEFAULT_POSITION.slice();
        }
        if (options.coefficients == undefined) {
            options.coefficients = {};
            Object.assign(options.coefficients, DEFAULT_REFLECTION_COEFFICIENTS);
        }

        // Assign room's speed of sound.
        this.speedOfSound = options.speedOfSound;

        // Create nodes.
        this.input = context.createGain();
        this.output = context.createGain();
        this._lowpass = context.createBiquadFilter();
        this._delays = {};
        this._gains = {}; // gainPerWall = (ReflectionCoeff / Attenuation)
        this._inverters = {}; // 3 of these are needed for right/back/down walls.
        this._merger = context.createChannelMerger(4); // First-order encoding only.

        // Connect audio graph for each wall reflection.
        for (let property in DEFAULT_REFLECTION_COEFFICIENTS) {
            if (DEFAULT_REFLECTION_COEFFICIENTS
                .hasOwnProperty(property)) {
                this._delays[property] =
                    context.createDelay(DEFAULT_REFLECTION_MAX_DURATION);
                this._gains[property] = context.createGain();
            }
        }
        this._inverters.right = context.createGain();
        this._inverters.down = context.createGain();
        this._inverters.back = context.createGain();

        // Initialize lowpass filter.
        this._lowpass.type = 'lowpass';
        this._lowpass.frequency.value = DEFAULT_REFLECTION_CUTOFF_FREQUENCY;
        this._lowpass.Q.value = 0;

        // Initialize encoder directions, set delay times and gains to 0.
        for (let property in DEFAULT_REFLECTION_COEFFICIENTS) {
            if (DEFAULT_REFLECTION_COEFFICIENTS
                .hasOwnProperty(property)) {
                this._delays[property].delayTime.value = 0;
                this._gains[property].gain.value = 0;
            }
        }

        // Initialize inverters for opposite walls ('right', 'down', 'back' only).
        this._inverters.right.gain.value = -1;
        this._inverters.down.gain.value = -1;
        this._inverters.back.gain.value = -1;

        // Connect nodes.
        this.input.connect(this._lowpass);
        for (let property in DEFAULT_REFLECTION_COEFFICIENTS) {
            if (DEFAULT_REFLECTION_COEFFICIENTS
                .hasOwnProperty(property)) {
                this._lowpass.connect(this._delays[property]);
                this._delays[property].connect(this._gains[property]);
                this._gains[property].connect(this._merger, 0, 0);
            }
        }

        // Connect gains to ambisonic channel output.
        // Left: [1 1 0 0]
        // Right: [1 -1 0 0]
        // Up: [1 0 1 0]
        // Down: [1 0 -1 0]
        // Front: [1 0 0 1]
        // Back: [1 0 0 -1]
        this._gains.left.connect(this._merger, 0, 1);

        this._gains.right.connect(this._inverters.right);
        this._inverters.right.connect(this._merger, 0, 1);

        this._gains.up.connect(this._merger, 0, 2);

        this._gains.down.connect(this._inverters.down);
        this._inverters.down.connect(this._merger, 0, 2);

        this._gains.front.connect(this._merger, 0, 3);

        this._gains.back.connect(this._inverters.back);
        this._inverters.back.connect(this._merger, 0, 3);
        this._merger.connect(this.output);

        // Initialize.
        this._listenerPosition = options.listenerPosition;
        this.setRoomProperties(options.dimensions, options.coefficients);
    }


    /**
     * Set the listener's position (in meters),
     * where [0,0,0] is the center of the room.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */
    setListenerPosition(x, y, z) {
        // Assign listener position.
        this._listenerPosition = [x, y, z];

        // Determine distances to each wall.
        let distances = {
            left: DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
                this._halfDimensions.width + x) + DEFAULT_REFLECTION_MIN_DISTANCE,
            right: DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
                this._halfDimensions.width - x) + DEFAULT_REFLECTION_MIN_DISTANCE,
            front: DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
                this._halfDimensions.depth + z) + DEFAULT_REFLECTION_MIN_DISTANCE,
            back: DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
                this._halfDimensions.depth - z) + DEFAULT_REFLECTION_MIN_DISTANCE,
            down: DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
                this._halfDimensions.height + y) + DEFAULT_REFLECTION_MIN_DISTANCE,
            up: DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
                this._halfDimensions.height - y) + DEFAULT_REFLECTION_MIN_DISTANCE,
        };

        // Assign delay & attenuation values using distances.
        for (let property in DEFAULT_REFLECTION_COEFFICIENTS) {
            if (DEFAULT_REFLECTION_COEFFICIENTS
                .hasOwnProperty(property)) {
                // Compute and assign delay (in seconds).
                let delayInSecs = distances[property] / this.speedOfSound;
                this._delays[property].delayTime.value = delayInSecs;

                // Compute and assign gain, uses logarithmic rolloff: "g = R / (d + 1)"
                let attenuation = this._coefficients[property] / distances[property];
                this._gains[property].gain.value = attenuation;
            }
        }
    }


    /**
     * Set the room's properties which determines the characteristics of
     * reflections.
     * @param {Utils~RoomDimensions} dimensions
     * Room dimensions (in meters). Defaults to
     * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
     * @param {Object} coefficients
     * Frequency-independent reflection coeffs per wall. Defaults to
     * {@linkcode Utils.DEFAULT_REFLECTION_COEFFICIENTS
     * DEFAULT_REFLECTION_COEFFICIENTS}.
     */
    setRoomProperties(dimensions, coefficients) {
        if (dimensions == undefined) {
            dimensions = {};
            Object.assign(dimensions, DEFAULT_ROOM_DIMENSIONS);
        }
        if (coefficients == undefined) {
            coefficients = {};
            Object.assign(coefficients, DEFAULT_REFLECTION_COEFFICIENTS);
        }
        this._coefficients = coefficients;

        // Sanitize dimensions and store half-dimensions.
        this._halfDimensions = {};
        this._halfDimensions.width = dimensions.width * 0.5;
        this._halfDimensions.height = dimensions.height * 0.5;
        this._halfDimensions.depth = dimensions.depth * 0.5;

        // Update listener position with new room properties.
        this.setListenerPosition(this._listenerPosition[0],
            this._listenerPosition[1], this._listenerPosition[2]);
    }
}

/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Generate absorption coefficients from material names.
 * @param {Object} materials
 * @return {Object}
 */
function _getCoefficientsFromMaterials(materials) {
    // Initialize coefficients to use defaults.
    let coefficients = {};
    for (let property in DEFAULT_ROOM_MATERIALS) {
        if (DEFAULT_ROOM_MATERIALS.hasOwnProperty(property)) {
            coefficients[property] = ROOM_MATERIAL_COEFFICIENTS[
                DEFAULT_ROOM_MATERIALS[property]];
        }
    }

    // Sanitize materials.
    if (materials == undefined) {
        materials = {};
        Object.assign(materials, DEFAULT_ROOM_MATERIALS);
    }

    // Assign coefficients using provided materials.
    for (let property in DEFAULT_ROOM_MATERIALS) {
        if (DEFAULT_ROOM_MATERIALS.hasOwnProperty(property) &&
            materials.hasOwnProperty(property)) {
            if (materials[property] in ROOM_MATERIAL_COEFFICIENTS) {
                coefficients[property] =
                    ROOM_MATERIAL_COEFFICIENTS[materials[property]];
            } else {
                log('Material \"' + materials[property] + '\" on wall \"' +
                    property + '\" not found. Using \"' +
                    DEFAULT_ROOM_MATERIALS[property] + '\".');
            }
        } else {
            log('Wall \"' + property + '\" is not defined. Default used.');
        }
    }
    return coefficients;
}

/**
 * Sanitize coefficients.
 * @param {Object} coefficients
 * @return {Object}
 */
function _sanitizeCoefficients(coefficients) {
    if (coefficients == undefined) {
        coefficients = {};
    }
    for (let property in DEFAULT_ROOM_MATERIALS) {
        if (!(coefficients.hasOwnProperty(property))) {
            // If element is not present, use default coefficients.
            coefficients[property] = ROOM_MATERIAL_COEFFICIENTS[
                DEFAULT_ROOM_MATERIALS[property]];
        }
    }
    return coefficients;
}

/**
 * Sanitize dimensions.
 * @param {Utils~RoomDimensions} dimensions
 * @return {Utils~RoomDimensions}
 */
function _sanitizeDimensions(dimensions) {
    if (dimensions == undefined) {
        dimensions = {};
    }
    for (let property in DEFAULT_ROOM_DIMENSIONS) {
        if (!(dimensions.hasOwnProperty(property))) {
            dimensions[property] = DEFAULT_ROOM_DIMENSIONS[property];
        }
    }
    return dimensions;
}

/**
 * Compute frequency-dependent reverb durations.
 * @param {Utils~RoomDimensions} dimensions
 * @param {Object} coefficients
 * @param {Number} speedOfSound
 * @return {Array}
 */
function _getDurationsFromProperties(dimensions, coefficients, speedOfSound) {
    let durations = new Float32Array(NUMBER_REVERB_FREQUENCY_BANDS);

    // Sanitize inputs.
    dimensions = _sanitizeDimensions(dimensions);
    coefficients = _sanitizeCoefficients(coefficients);
    if (speedOfSound == undefined) {
        speedOfSound = DEFAULT_SPEED_OF_SOUND;
    }

    // Acoustic constant.
    let k = TWENTY_FOUR_LOG10 / speedOfSound;

    // Compute volume, skip if room is not present.
    let volume = dimensions.width * dimensions.height * dimensions.depth;
    if (volume < ROOM_MIN_VOLUME) {
        return durations;
    }

    // Room surface area.
    let leftRightArea = dimensions.width * dimensions.height;
    let floorCeilingArea = dimensions.width * dimensions.depth;
    let frontBackArea = dimensions.depth * dimensions.height;
    let totalArea = 2 * (leftRightArea + floorCeilingArea + frontBackArea);
    for (let i = 0; i < NUMBER_REVERB_FREQUENCY_BANDS; i++) {
        // Effective absorptive area.
        let absorbtionArea =
            (coefficients.left[i] + coefficients.right[i]) * leftRightArea +
            (coefficients.down[i] + coefficients.up[i]) * floorCeilingArea +
            (coefficients.front[i] + coefficients.back[i]) * frontBackArea;
        let meanAbsorbtionArea = absorbtionArea / totalArea;

        // Compute reverberation using Eyring equation [1].
        // [1] Beranek, Leo L. "Analysis of Sabine and Eyring equations and their
        //     application to concert hall audience and chair absorption." The
        //     Journal of the Acoustical Society of America, Vol. 120, No. 3.
        //     (2006), pp. 1399-1399.
        durations[i] = ROOM_EYRING_CORRECTION_COEFFICIENT * k * volume /
            (-totalArea * Math.log(1 - meanAbsorbtionArea) + 4 *
                ROOM_AIR_ABSORPTION_COEFFICIENTS[i] * volume);
    }
    return durations;
}


/**
 * Compute reflection coefficients from absorption coefficients.
 * @param {Object} absorptionCoefficients
 * @return {Object}
 */
function _computeReflectionCoefficients(absorptionCoefficients) {
    let reflectionCoefficients = [];
    for (let property in DEFAULT_REFLECTION_COEFFICIENTS) {
        if (DEFAULT_REFLECTION_COEFFICIENTS
            .hasOwnProperty(property)) {
            // Compute average absorption coefficient (per wall).
            reflectionCoefficients[property] = 0;
            for (let j = 0; j < NUMBER_REFLECTION_AVERAGING_BANDS; j++) {
                let bandIndex = j + ROOM_STARTING_AVERAGING_BAND;
                reflectionCoefficients[property] +=
                    absorptionCoefficients[property][bandIndex];
            }
            reflectionCoefficients[property] /=
                NUMBER_REFLECTION_AVERAGING_BANDS;

            // Convert absorption coefficient to reflection coefficient.
            reflectionCoefficients[property] =
                Math.sqrt(1 - reflectionCoefficients[property]);
        }
    }
    return reflectionCoefficients;
}


/**
 * @class Room
 * @description Model that manages early and late reflections using acoustic
 * properties and listener position relative to a rectangular room.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Float32Array} options.listenerPosition
 * The listener's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Utils~RoomDimensions} options.dimensions Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Utils~RoomMaterials} options.materials Named acoustic materials per wall.
 * Defaults to {@linkcode Utils.DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
 * @param {Number} options.speedOfSound
 * (in meters/second). Defaults to
 * {@linkcode Utils.DEFAULT_SPEED_OF_SOUND DEFAULT_SPEED_OF_SOUND}.
 */
class Room {
    constructor(context, options) {
        // Public variables.
        /**
         * EarlyReflections {@link EarlyReflections EarlyReflections} submodule.
         * @member {AudioNode} early
         * @memberof Room
         * @instance
         */
        /**
         * LateReflections {@link LateReflections LateReflections} submodule.
         * @member {AudioNode} late
         * @memberof Room
         * @instance
         */
        /**
         * Ambisonic (multichannel) output {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} output
         * @memberof Room
         * @instance
         */

        // Use defaults for undefined arguments.
        if (options == undefined) {
            options = {};
        }
        if (options.listenerPosition == undefined) {
            options.listenerPosition = DEFAULT_POSITION.slice();
        }
        if (options.dimensions == undefined) {
            options.dimensions = {};
            Object.assign(options.dimensions, DEFAULT_ROOM_DIMENSIONS);
        }
        if (options.materials == undefined) {
            options.materials = {};
            Object.assign(options.materials, DEFAULT_ROOM_MATERIALS);
        }
        if (options.speedOfSound == undefined) {
            options.speedOfSound = DEFAULT_SPEED_OF_SOUND;
        }

        // Sanitize room-properties-related arguments.
        options.dimensions = _sanitizeDimensions(options.dimensions);
        let absorptionCoefficients = _getCoefficientsFromMaterials(options.materials);
        let reflectionCoefficients =
            _computeReflectionCoefficients(absorptionCoefficients);
        let durations = _getDurationsFromProperties(options.dimensions,
            absorptionCoefficients, options.speedOfSound);

        // Construct submodules for early and late reflections.
        this.early = new EarlyReflections(context, {
            dimensions: options.dimensions,
            coefficients: reflectionCoefficients,
            speedOfSound: options.speedOfSound,
            listenerPosition: options.listenerPosition,
        });
        this.late = new LateReflections(context, {
            durations: durations,
        });

        this.speedOfSound = options.speedOfSound;

        // Construct auxillary audio nodes.
        this.output = context.createGain();
        this.early.output.connect(this.output);
        this._merger = context.createChannelMerger(4);

        this.late.output.connect(this._merger, 0, 0);
        this._merger.connect(this.output);
    }


    /**
     * Set the room's dimensions and wall materials.
     * @param {Utils~RoomDimensions} dimensions Room dimensions (in meters). Defaults to
     * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
     * @param {Utils~RoomMaterials} materials Named acoustic materials per wall. Defaults to
     * {@linkcode Utils.DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
     */
    setProperties(dimensions, materials) {
        // Compute late response.
        let absorptionCoefficients = _getCoefficientsFromMaterials(materials);
        let durations = _getDurationsFromProperties(dimensions,
            absorptionCoefficients, this.speedOfSound);
        this.late.setDurations(durations);

        // Compute early response.
        this.early.speedOfSound = this.speedOfSound;
        let reflectionCoefficients =
            _computeReflectionCoefficients(absorptionCoefficients);
        this.early.setRoomProperties(dimensions, reflectionCoefficients);
    }


    /**
     * Set the listener's position (in meters), where origin is the center of
     * the room.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */
    setListenerPosition(x, y, z) {
        this.early.speedOfSound = this.speedOfSound;
        this.early.setListenerPosition(x, y, z);

        // Disable room effects if the listener is outside the room boundaries.
        let distance = this.getDistanceOutsideRoom(x, y, z);
        let gain = 1;
        if (distance > EPSILON_FLOAT) {
            gain = 1 - distance / LISTENER_MAX_OUTSIDE_ROOM_DISTANCE;

            // Clamp gain between 0 and 1.
            gain = Math.max(0, Math.min(1, gain));
        }
        this.output.gain.value = gain;
    }


    /**
     * Compute distance outside room of provided position (in meters).
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @return {Number}
     * Distance outside room (in meters). Returns 0 if inside room.
     */
    getDistanceOutsideRoom(x, y, z) {
        let dx = Math.max(0, -this.early._halfDimensions.width - x,
            x - this.early._halfDimensions.width);
        let dy = Math.max(0, -this.early._halfDimensions.height - y,
            y - this.early._halfDimensions.height);
        let dz = Math.max(0, -this.early._halfDimensions.depth - z,
            z - this.early._halfDimensions.depth);
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}

/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Options for constructing a new ResonanceAudio scene.
 * @typedef {Object} ResonanceAudio~ResonanceAudioOptions
 * @property {Number} ambisonicOrder
 * Desired ambisonic Order. Defaults to
 * {@linkcode Utils.DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
 * @property {Float32Array} listenerPosition
 * The listener's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @property {Float32Array} listenerForward
 * The listener's initial forward vector.
 * Defaults to {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @property {Float32Array} listenerUp
 * The listener's initial up vector.
 * Defaults to {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 * @property {Utils~RoomDimensions} dimensions Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @property {Utils~RoomMaterials} materials Named acoustic materials per wall.
 * Defaults to {@linkcode Utils.DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
 * @property {Number} speedOfSound
 * (in meters/second). Defaults to
 * {@linkcode Utils.DEFAULT_SPEED_OF_SOUND DEFAULT_SPEED_OF_SOUND}.
 */


/**
 * @class ResonanceAudio
 * @description Main class for managing sources, room and listener models.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {ResonanceAudio~ResonanceAudioOptions} options
 * Options for constructing a new ResonanceAudio scene.
 */
class ResonanceAudio {
    constructor(context, options) {
        // Public variables.
        /**
         * Binaurally-rendered stereo (2-channel) output {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
         * @member {AudioNode} output
         * @memberof ResonanceAudio
         * @instance
         */
        /**
         * Ambisonic (multichannel) input {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}
         * (For rendering input soundfields).
         * @member {AudioNode} ambisonicInput
         * @memberof ResonanceAudio
         * @instance
         */
        /**
         * Ambisonic (multichannel) output {@link
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}
         * (For allowing external rendering / post-processing).
         * @member {AudioNode} ambisonicOutput
         * @memberof ResonanceAudio
         * @instance
         */

        // Use defaults for undefined arguments.
        if (options == undefined) {
            options = {};
        }
        if (options.ambisonicOrder == undefined) {
            options.ambisonicOrder = DEFAULT_AMBISONIC_ORDER;
        }
        if (options.listenerPosition == undefined) {
            options.listenerPosition = DEFAULT_POSITION.slice();
        }
        if (options.listenerForward == undefined) {
            options.listenerForward = DEFAULT_FORWARD.slice();
        }
        if (options.listenerUp == undefined) {
            options.listenerUp = DEFAULT_UP.slice();
        }
        if (options.dimensions == undefined) {
            options.dimensions = {};
            Object.assign(options.dimensions, DEFAULT_ROOM_DIMENSIONS);
        }
        if (options.materials == undefined) {
            options.materials = {};
            Object.assign(options.materials, DEFAULT_ROOM_MATERIALS);
        }
        if (options.speedOfSound == undefined) {
            options.speedOfSound = DEFAULT_SPEED_OF_SOUND;
        }

        // Create member submodules.
        this._ambisonicOrder = Encoder.validateAmbisonicOrder(options.ambisonicOrder);
        this._sources = [];
        this._room = new Room(context, {
            listenerPosition: options.listenerPosition,
            dimensions: options.dimensions,
            materials: options.materials,
            speedOfSound: options.speedOfSound,
        });
        this._listener = new Listener(context, {
            ambisonicOrder: options.ambisonicOrder,
            position: options.listenerPosition,
            forward: options.listenerForward,
            up: options.listenerUp,
        });

        // Create auxillary audio nodes.
        this._context = context;
        this.output = context.createGain();
        this.ambisonicOutput = context.createGain();
        this.ambisonicInput = this._listener.input;

        // Connect audio graph.
        this._room.output.connect(this._listener.input);
        this._listener.output.connect(this.output);
        this._listener.ambisonicOutput.connect(this.ambisonicOutput);
    }


    /**
     * Create a new source for the scene.
     * @param {Source~SourceOptions} options
     * Options for constructing a new Source.
     * @return {Source}
     */
    createSource(options) {
        // Create a source and push it to the internal sources array, returning
        // the object's reference to the user.
        let source = new Source(this, options);
        this._sources[this._sources.length] = source;
        return source;
    }


    /**
     * Set the scene's desired ambisonic order.
     * @param {Number} ambisonicOrder Desired ambisonic order.
     */
    setAmbisonicOrder(ambisonicOrder) {
        this._ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);
    }


    /**
     * Set the room's dimensions and wall materials.
     * @param {Object} dimensions Room dimensions (in meters).
     * @param {Object} materials Named acoustic materials per wall.
     */
    setRoomProperties(dimensions, materials) {
        this._room.setProperties(dimensions, materials);
    }


    /**
     * Set the listener's position (in meters), where origin is the center of
     * the room.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */
    setListenerPosition(x, y, z) {
        // Update listener position.
        this._listener.position[0] = x;
        this._listener.position[1] = y;
        this._listener.position[2] = z;
        this._room.setListenerPosition(x, y, z);

        // Update sources with new listener position.
        this._sources.forEach(function (element) {
            element._update();
        });
    }


    /**
     * Set the source's orientation using forward and up vectors.
     * @param {Number} forwardX
     * @param {Number} forwardY
     * @param {Number} forwardZ
     * @param {Number} upX
     * @param {Number} upY
     * @param {Number} upZ
     */
    setListenerOrientation(forwardX, forwardY,
        forwardZ, upX, upY, upZ) {
        this._listener.setOrientation(forwardX, forwardY, forwardZ, upX, upY, upZ);
    }


    /**
     * Set the listener's position and orientation using a Three.js Matrix4 object.
     * @param {Object} matrix
     * The Three.js Matrix4 object representing the listener's world transform.
     */
    setListenerFromMatrix(matrix) {
        this._listener.setFromMatrix(matrix);

        // Update the rest of the scene using new listener position.
        this.setListenerPosition(this._listener.position[0],
            this._listener.position[1], this._listener.position[2]);
    }


    /**
     * Set the speed of sound.
     * @param {Number} speedOfSound
     */
    setSpeedOfSound(speedOfSound) {
        this._room.speedOfSound = speedOfSound;
    }
}

/**
 * A spatializer that uses Google's Resonance Audio library.
 **/
class ResonanceSource extends BaseAnalyzed {

    /**
     * Creates a new spatializer that uses Google's Resonance Audio library.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {AudioContext} audioContext
     * @param {ResonanceAudio} res
     */
    constructor(id, stream, bufferSize, audioContext, res) {
        const resNode = res.createSource();
        super(id, stream, bufferSize, audioContext, resNode.input);

        this.resNode = resNode;

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        const { p, f, u } = loc;
        this.resNode.setMinDistance(this.minDistance);
        this.resNode.setMaxDistance(this.maxDistance);
        this.resNode.setPosition(p.x, p.y, p.z);
        this.resNode.setOrientation(f.x, f.y, f.z, u.x, u.y, u.z);
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        this.resNode = null;
        super.dispose();
    }
}

/* global ResonanceAudio */

/**
 * An audio positioner that uses Google's Resonance Audio library
 **/
class ResonanceScene extends BaseListener {
    /**
     * Creates a new audio positioner that uses Google's Resonance Audio library
     * @param {AudioContext} audioContext
     */
    constructor(audioContext) {
        super();

        this.scene = new ResonanceAudio(audioContext, {
            ambisonicOrder: 3
        });
        this.scene.output.connect(audioContext.destination);

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

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        const { p, f, u } = loc;
        this.scene.setListenerPosition(p.x, p.y, p.z);
        this.scene.setListenerOrientation(f.x, f.y, f.z, u.x, u.y, u.z);
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @param {AudioContext} audioContext
     * @param {Pose} dest
     * @return {BaseSource}
     */
    createSource(id, stream, bufferSize, audioContext, dest) {
        return new ResonanceSource(id, stream, bufferSize, audioContext, this.scene);
    }
}

const BUFFER_SIZE = 1024,
    audioActivityEvt$1 = new AudioActivityEvent();

let hasAudioContext$1 = Object.prototype.hasOwnProperty.call(window, "AudioContext"),
    hasAudioListener = hasAudioContext$1 && Object.prototype.hasOwnProperty.call(window, "AudioListener"),
    hasOldAudioListener = hasAudioListener && Object.prototype.hasOwnProperty.call(AudioListener.prototype, "setPosition"),
    hasNewAudioListener = hasAudioListener && Object.prototype.hasOwnProperty.call(AudioListener.prototype, "positionX"),
    attemptResonanceAPI = hasAudioListener;

/**
 * A manager of audio sources, destinations, and their spatialization.
 **/
class AudioManager extends EventBase {

    /**
     * Creates a new manager of audio sources, destinations, and their spatialization.
     **/
    constructor() {
        super();

        this.minDistance = 1;
        this.minDistanceSq = 1;
        this.maxDistance = 10;
        this.maxDistanceSq = 100;
        this.rolloff = 1;
        this.transitionTime = 0.5;

        /** @type {InterpolatedPose} */
        this.pose = new InterpolatedPose();

        /** @type {Map.<string, InterpolatedPose>} */
        this.users = new Map();

        /** @type {Map.<string, InterpolatedPose>} */
        this.clips = new Map();

        /**
         * Forwards on the audioActivity of an audio source.
         * @param {AudioActivityEvent} evt
         * @fires AudioManager#audioActivity
         */
        this.onAudioActivity = (evt) => {
            audioActivityEvt$1.id = evt.id;
            audioActivityEvt$1.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt$1);
        };

        /** @type {AudioContext} */
        this.audioContext = null;

        /** @type {BaseListener} */
        this.listener = null;

        Object.seal(this);
    }

    /** 
     * Perform the audio system initialization, after a user gesture 
     **/
    start() {
        this.createContext();
    }

    update() {
        if (this.audioContext) {
            this.pose.update(this.currentTime);
            for (let pose of this.users.values()) {
                pose.update(this.currentTime);
            }
            for (let pose of this.clips.values()) {
                pose.update(this.currentTime);
            }
        }
    }

    /**
     * If no audio context is currently available, creates one, and initializes the
     * spatialization of its listener.
     * 
     * If WebAudio isn't available, a mock audio context is created that provides
     * ersatz playback timing.
     **/
    createContext() {
        if (!this.audioContext) {
            if (hasAudioContext$1) {
                try {
                    this.audioContext = new AudioContext();
                }
                catch (exp) {
                    hasAudioContext$1 = false;
                    console.warn("Could not create WebAudio AudioContext", exp);
                }
            }

            if (!hasAudioContext$1) {
                this.audioContext = new MockAudioContext();
            }

            if (hasAudioContext$1 && attemptResonanceAPI) {
                try {
                    this.listener = new ResonanceScene(this.audioContext);
                }
                catch (exp) {
                    attemptResonanceAPI = false;
                    console.warn("Resonance Audio API not available!", exp);
                }
            }

            if (hasAudioContext$1 && !attemptResonanceAPI && hasNewAudioListener) {
                try {
                    this.listener = new AudioListenerNew(this.audioContext.listener);
                }
                catch (exp) {
                    hasNewAudioListener = false;
                    console.warn("No AudioListener.positionX property!", exp);
                }
            }

            if (hasAudioContext$1 && !attemptResonanceAPI && !hasNewAudioListener && hasOldAudioListener) {
                try {
                    this.listener = new AudioListenerOld(this.audioContext.listener);
                }
                catch (exp) {
                    hasOldAudioListener = false;
                    console.warn("No WebAudio API!", exp);
                }
            }

            if (!hasOldAudioListener || !hasAudioContext$1) {
                this.listener = new BaseListener();
            }

            this.pose.spatializer = this.listener;
        }
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @return {BaseSource}
     */
    createSpatializer(id, stream, bufferSize) {
        if (!stream) {
            return Promise.reject("No stream or audio element given.");
        }
        else {
            const creator = (resolve) => {
                if (this.listener) {
                    resolve(this.listener.createSource(id, stream, bufferSize, this.audioContext, this.pose.current));
                }
                else {
                    setTimeout(creator, 0, resolve);
                }
            };
            return new Promise(creator);
        }
    }

    /**
     * Creates a new sound effect from a series of fallback paths
     * for media files.
     * @param {string} name - the name of the sound effect, to reference when executing playback.
     * @param {string[]} paths - a series of fallback paths for loading the media of the sound effect.
     * @returns {AudioManager}
     */
    addClip(name, ...paths) {
        const pose = new InterpolatedPose();

        const sources = paths
            .map((p) => {
                const s = document.createElement("source");
                s.src = p;
                return s;
            });

        const elem = document.createElement("audio");
        elem.controls = false;
        elem.playsInline = true;
        elem.append(...sources);

        this.createSpatializer(name, elem)
            .then((source) => pose.spatializer = source);

        this.clips.set(name, pose);
        return this;
    }

    /**
     * Plays a named sound effect.
     * @param {string} name - the name of the effect to play.
     * @param {number} [volume=1] - the volume at which to play the effect.
     */
    playClip(name, volume = 1) {
        if (this.clips.has(name)) {
            const pose = this.clips.get(name);
            const clip = pose.spatializer;
            clip.volume = volume;
            clip.play();
        }
    }

    /**
     * Gets the current playback time.
     * @type {number}
     */
    get currentTime() {
        return this.audioContext.currentTime;
    }

    /**
     * Create a new user for audio processing.
     * @param {string} id
     * @returns {InterpolatedPose}
     */
    createUser(id) {
        if (!this.users.has(id)) {
            this.users.set(id, new InterpolatedPose());
        }
        return this.users.get(id);
    }

    /**
     * Remove a user from audio processing.
     * @param {string} id - the id of the user to remove
     **/
    removeUser(id) {
        if (this.users.has(id)) {
            const pose = this.users.get(id);
            pose.dispose();
            this.users.delete(id);
        }
    }

    /**
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     **/
    setSource(id, stream) {
        if (this.users.has(id)) {
            const pose = this.users.get(id);
            if (pose.spatializer) {
                pose.spatializer.removeEventListener("audioActivity", this.onAudioActivity);
                pose.spatializer = null;
            }

            if (stream) {
                this.createSpatializer(id, stream, BUFFER_SIZE)
                    .then((source) => {
                        pose.spatializer = source;
                        if (source) {
                            if (source.audio) {
                                source.audio.autoPlay = true;
                                source.audio.muted = !(source instanceof ManualVolume);
                                source.audio.addEventListener("onloadedmetadata", () =>
                                    source.audio.play());
                                source.audio.play();
                            }
                            source.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.transitionTime);
                            source.addEventListener("audioActivity", this.onAudioActivity);
                        }
                    });
            }
        }
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     **/
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.transitionTime = transitionTime;
        this.rolloff = rolloff;

        for (let pose of this.users.values()) {
            if (pose.spatializer) {
                pose.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.transitionTime);
            }
        }
    }

    /**
     * Set the position of the listener.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} z - the lateral component of the position.
     */
    setLocalPosition(x, y, z) {
        this.pose.setTargetPosition(x, y, z, this.currentTime, this.transitionTime);
    }


    /**
     * @returns {Pose}
     **/
    getLocalPose() {
        return this.pose.end;
    }

    /**
     * Set the position of an audio source.
     * @param {string} id - the id of the user for which to set the position.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} z - the lateral component of the position.
     **/
    setUserPosition(id, x, y, z) {
        if (this.users.has(id)) {
            const pose = this.users.get(id);
            pose.setTargetPosition(x, y, z, this.currentTime, this.transitionTime);
        }
    }
}

/**
 * 
 * @param {Function} a
 * @param {Function} b
 */
function add(a, b) {
    return evt => {
        a(evt);
        b(evt);
    };
}

/**
 * 
 * @param {EventBase|EventTarget} target
 * @param {any} obj
 */
function addEventListeners(target, obj) {
    for (let evtName in obj) {
        let callback = obj[evtName];
        let opts = undefined;
        if (callback instanceof Array) {
            opts = callback[1];
            callback = callback[0];
        }

        target.addEventListener(evtName, callback, opts);
    }
}

/**
 * Wait for a specific event, one time.
 * @param {EventBase|EventTarget} target - the event target.
 * @param {string} resolveEvt - the name of the event that will resolve the Promise this method creates.
 * @param {string} rejectEvt - the name of the event that could reject the Promise this method creates.
 * @param {number} timeout - the number of milliseconds to wait for the resolveEvt, before rejecting.
 */
function once(target, resolveEvt, rejectEvt, timeout) {

    if (timeout === undefined
        && isGoodNumber(rejectEvt)) {
        timeout = rejectEvt;
        rejectEvt = undefined;
    }

    return new Promise((resolve, reject) => {
        const hasResolveEvt = isString(resolveEvt);
        if (hasResolveEvt) {
            const oldResolve = resolve;
            const remove = () => {
                target.removeEventListener(resolveEvt, oldResolve);
            };
            resolve = add(remove, resolve);
            reject = add(remove, reject);
        }

        const hasRejectEvt = isString(rejectEvt);
        if (hasRejectEvt) {
            const oldReject = reject;
            const remove = () => {
                target.removeEventListener(rejectEvt, oldReject);
            };

            resolve = add(remove, resolve);
            reject = add(remove, reject);
        }

        if (isNumber(timeout)) {
            const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`),
                cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }

        if (hasResolveEvt) {
            target.addEventListener(resolveEvt, resolve);
        }

        if (hasRejectEvt) {
            target.addEventListener(rejectEvt, () => {
                reject("Rejection event found");
            });
        }
    });
}

/**
 * 
 * @param {EventBase|EventTarget} target
 * @param {string} untilEvt
 * @param {Function} callback
 * @param {Function} test
 * @param {number?} repeatTimeout
 * @param {number?} cancelTimeout
 */
function until(target, untilEvt, callback, test, repeatTimeout, cancelTimeout) {
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

            target.removeEventListener(untilEvt, success);
        };

        function success(evt) {
            if (test(evt)) {
                cleanup();
                resolve(evt);
            }
        }

        target.addEventListener(untilEvt, success);

        if (repeatTimeout !== undefined) {
            if (cancelTimeout !== undefined) {
                canceller = setTimeout(() => {
                    cleanup();
                    reject(`'${untilEvt}' has timed out.`);
                }, cancelTimeout);
            }

            const repeater = () => {
                callback();
                timer = setTimeout(repeater, repeatTimeout);
            };

            timer = setTimeout(repeater, 0);
        }
    });
}

/**
 * 
 * @param {EventBase|EventTarget} target
 * @param {string} resolveEvt
 * @param {Function} filterTest
 * @param {number?} timeout
 */
function when(target, resolveEvt, filterTest, timeout) {

    if (!isString(resolveEvt)) {
        throw new Error("Need an event name on which to resolve the operation.");
    }

    if (!isFunction(filterTest)) {
        throw new Error("Filtering tests function is required. Otherwise, use `once`.");
    }

    return new Promise((resolve, reject) => {
        const remove = () => {
            target.removeEventListener(resolveEvt, resolve);
        };

        resolve = add(remove, resolve);
        reject = add(remove, reject);

        if (isNumber(timeout)) {
            const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`),
                cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }

        target.addEventListener(resolveEvt, resolve);
    });
}

/*! jQuery v3.5.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(e,t){"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e);}("undefined"!=typeof window?window:undefined,function(C,e){var t=[],r=Object.getPrototypeOf,s=t.slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat.apply([],e)},u=t.push,i=t.indexOf,n={},o=n.toString,v=n.hasOwnProperty,a=v.toString,l=a.call(Object),y={},m=function(e){return "function"==typeof e&&"number"!=typeof e.nodeType},x=function(e){return null!=e&&e===e.window},E=C.document,c={type:!0,src:!0,nonce:!0,noModule:!0};function b(e,t,n){var r,i,o=(n=n||E).createElement("script");if(o.text=e,t)for(r in c)(i=t[r]||t.getAttribute&&t.getAttribute(r))&&o.setAttribute(r,i);n.head.appendChild(o).parentNode.removeChild(o);}function w(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?n[o.call(e)]||"object":typeof e}var f="3.5.1",S=function(e,t){return new S.fn.init(e,t)};function p(e){var t=!!e&&"length"in e&&e.length,n=w(e);return !m(e)&&!x(e)&&("array"===n||0===t||"number"==typeof t&&0<t&&t-1 in e)}S.fn=S.prototype={jquery:f,constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)},map:function(n){return this.pushStack(S.map(this,function(e,t){return n.call(e,t,e)}))},slice:function(){return this.pushStack(s.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(S.grep(this,function(e,t){return (t+1)%2}))},odd:function(){return this.pushStack(S.grep(this,function(e,t){return t%2}))},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(0<=n&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:u,sort:t.sort,splice:t.splice},S.extend=S.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||m(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)r=e[t],"__proto__"!==t&&a!==r&&(l&&r&&(S.isPlainObject(r)||(i=Array.isArray(r)))?(n=a[t],o=i&&!Array.isArray(n)?[]:i||S.isPlainObject(n)?n:{},i=!1,a[t]=S.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},S.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return !(!e||"[object Object]"!==o.call(e))&&(!(t=r(e))||"function"==typeof(n=v.call(t,"constructor")&&t.constructor)&&a.call(n)===l)},isEmptyObject:function(e){var t;for(t in e)return !1;return !0},globalEval:function(e,t,n){b(e,{nonce:t&&t.nonce},n);},each:function(e,t){var n,r=0;if(p(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},makeArray:function(e,t){var n=t||[];return null!=e&&(p(Object(e))?S.merge(n,"string"==typeof e?[e]:e):u.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:i.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r=[],i=0,o=e.length,a=!n;i<o;i++)!t(e[i],i)!==a&&r.push(e[i]);return r},map:function(e,t,n){var r,i,o=0,a=[];if(p(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&a.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&a.push(i);return g(a)},guid:1,support:y}),"function"==typeof Symbol&&(S.fn[Symbol.iterator]=t[Symbol.iterator]),S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){n["[object "+t+"]"]=t.toLowerCase();});var d=function(n){var e,d,b,o,i,h,f,g,w,u,l,T,C,a,E,v,s,c,y,S="sizzle"+1*new Date,p=n.document,k=0,r=0,m=ue(),x=ue(),A=ue(),N=ue(),D=function(e,t){return e===t&&(l=!0),0},j={}.hasOwnProperty,t=[],q=t.pop,L=t.push,H=t.push,O=t.slice,P=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return -1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",I="(?:\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",W="\\["+M+"*("+I+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+I+"))|)"+M+"*\\]",F=":("+I+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+W+")*)|.*)\\)|)",B=new RegExp(M+"+","g"),$=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),_=new RegExp("^"+M+"*,"+M+"*"),z=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=new RegExp(M+"|>"),X=new RegExp(F),V=new RegExp("^"+I+"$"),G={ID:new RegExp("^#("+I+")"),CLASS:new RegExp("^\\.("+I+")"),TAG:new RegExp("^("+I+"|[*])"),ATTR:new RegExp("^"+W),PSEUDO:new RegExp("^"+F),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+R+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Y=/HTML$/i,Q=/^(?:input|select|textarea|button)$/i,J=/^h\d$/i,K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\([^\\r\\n\\f])","g"),ne=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},re=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ie=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},oe=function(){T();},ae=be(function(e){return !0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{H.apply(t=O.call(p.childNodes),p.childNodes),t[p.childNodes.length].nodeType;}catch(e){H={apply:t.length?function(e,t){L.apply(e,O.call(t));}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1;}};}function se(t,e,n,r){var i,o,a,s,u,l,c,f=e&&e.ownerDocument,p=e?e.nodeType:9;if(n=n||[],"string"!=typeof t||!t||1!==p&&9!==p&&11!==p)return n;if(!r&&(T(e),e=e||C,E)){if(11!==p&&(u=Z.exec(t)))if(i=u[1]){if(9===p){if(!(a=e.getElementById(i)))return n;if(a.id===i)return n.push(a),n}else if(f&&(a=f.getElementById(i))&&y(e,a)&&a.id===i)return n.push(a),n}else {if(u[2])return H.apply(n,e.getElementsByTagName(t)),n;if((i=u[3])&&d.getElementsByClassName&&e.getElementsByClassName)return H.apply(n,e.getElementsByClassName(i)),n}if(d.qsa&&!N[t+" "]&&(!v||!v.test(t))&&(1!==p||"object"!==e.nodeName.toLowerCase())){if(c=t,f=e,1===p&&(U.test(t)||z.test(t))){(f=ee.test(t)&&ye(e.parentNode)||e)===e&&d.scope||((s=e.getAttribute("id"))?s=s.replace(re,ie):e.setAttribute("id",s=S)),o=(l=h(t)).length;while(o--)l[o]=(s?"#"+s:":scope")+" "+xe(l[o]);c=l.join(",");}try{return H.apply(n,f.querySelectorAll(c)),n}catch(e){N(t,!0);}finally{s===S&&e.removeAttribute("id");}}}return g(t.replace($,"$1"),e,n,r)}function ue(){var r=[];return function e(t,n){return r.push(t+" ")>b.cacheLength&&delete e[r.shift()],e[t+" "]=n}}function le(e){return e[S]=!0,e}function ce(e){var t=C.createElement("fieldset");try{return !!e(t)}catch(e){return !1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null;}}function fe(e,t){var n=e.split("|"),r=n.length;while(r--)b.attrHandle[n[r]]=t;}function pe(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return -1;return e?1:-1}function de(t){return function(e){return "input"===e.nodeName.toLowerCase()&&e.type===t}}function he(n){return function(e){var t=e.nodeName.toLowerCase();return ("input"===t||"button"===t)&&e.type===n}}function ge(t){return function(e){return "form"in e?e.parentNode&&!1===e.disabled?"label"in e?"label"in e.parentNode?e.parentNode.disabled===t:e.disabled===t:e.isDisabled===t||e.isDisabled!==!t&&ae(e)===t:e.disabled===t:"label"in e&&e.disabled===t}}function ve(a){return le(function(o){return o=+o,le(function(e,t){var n,r=a([],e.length,o),i=r.length;while(i--)e[n=r[i]]&&(e[n]=!(t[n]=e[n]));})})}function ye(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}for(e in d=se.support={},i=se.isXML=function(e){var t=e.namespaceURI,n=(e.ownerDocument||e).documentElement;return !Y.test(t||n&&n.nodeName||"HTML")},T=se.setDocument=function(e){var t,n,r=e?e.ownerDocument||e:p;return r!=C&&9===r.nodeType&&r.documentElement&&(a=(C=r).documentElement,E=!i(C),p!=C&&(n=C.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",oe,!1):n.attachEvent&&n.attachEvent("onunload",oe)),d.scope=ce(function(e){return a.appendChild(e).appendChild(C.createElement("div")),"undefined"!=typeof e.querySelectorAll&&!e.querySelectorAll(":scope fieldset div").length}),d.attributes=ce(function(e){return e.className="i",!e.getAttribute("className")}),d.getElementsByTagName=ce(function(e){return e.appendChild(C.createComment("")),!e.getElementsByTagName("*").length}),d.getElementsByClassName=K.test(C.getElementsByClassName),d.getById=ce(function(e){return a.appendChild(e).id=S,!C.getElementsByName||!C.getElementsByName(S).length}),d.getById?(b.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n=t.getElementById(e);return n?[n]:[]}}):(b.filter.ID=function(e){var n=e.replace(te,ne);return function(e){var t="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return t&&t.value===n}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return [o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return [o]}return []}}),b.find.TAG=d.getElementsByTagName?function(e,t){return "undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):d.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},b.find.CLASS=d.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&E)return t.getElementsByClassName(e)},s=[],v=[],(d.qsa=K.test(C.querySelectorAll))&&(ce(function(e){var t;a.appendChild(e).innerHTML="<a id='"+S+"'></a><select id='"+S+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&v.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||v.push("\\["+M+"*(?:value|"+R+")"),e.querySelectorAll("[id~="+S+"-]").length||v.push("~="),(t=C.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||v.push("\\["+M+"*name"+M+"*="+M+"*(?:''|\"\")"),e.querySelectorAll(":checked").length||v.push(":checked"),e.querySelectorAll("a#"+S+"+*").length||v.push(".#.+[+~]"),e.querySelectorAll("\\\f"),v.push("[\\r\\n\\f]");}),ce(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=C.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&v.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&v.push(":enabled",":disabled"),a.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&v.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),v.push(",.*:");})),(d.matchesSelector=K.test(c=a.matches||a.webkitMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.msMatchesSelector))&&ce(function(e){d.disconnectedMatch=c.call(e,"*"),c.call(e,"[s!='']:x"),s.push("!=",F);}),v=v.length&&new RegExp(v.join("|")),s=s.length&&new RegExp(s.join("|")),t=K.test(a.compareDocumentPosition),y=t||K.test(a.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return !0;return !1},D=t?function(e,t){if(e===t)return l=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(1&(n=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!d.sortDetached&&t.compareDocumentPosition(e)===n?e==C||e.ownerDocument==p&&y(p,e)?-1:t==C||t.ownerDocument==p&&y(p,t)?1:u?P(u,e)-P(u,t):0:4&n?-1:1)}:function(e,t){if(e===t)return l=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e==C?-1:t==C?1:i?-1:o?1:u?P(u,e)-P(u,t):0;if(i===o)return pe(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?pe(a[r],s[r]):a[r]==p?-1:s[r]==p?1:0}),C},se.matches=function(e,t){return se(e,null,null,t)},se.matchesSelector=function(e,t){if(T(e),d.matchesSelector&&E&&!N[t+" "]&&(!s||!s.test(t))&&(!v||!v.test(t)))try{var n=c.call(e,t);if(n||d.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(e){N(t,!0);}return 0<se(t,C,null,[e]).length},se.contains=function(e,t){return (e.ownerDocument||e)!=C&&T(e),y(e,t)},se.attr=function(e,t){(e.ownerDocument||e)!=C&&T(e);var n=b.attrHandle[t.toLowerCase()],r=n&&j.call(b.attrHandle,t.toLowerCase())?n(e,t,!E):void 0;return void 0!==r?r:d.attributes||!E?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},se.escape=function(e){return (e+"").replace(re,ie)},se.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},se.uniqueSort=function(e){var t,n=[],r=0,i=0;if(l=!d.detectDuplicates,u=!d.sortStable&&e.slice(0),e.sort(D),l){while(t=e[i++])t===e[i]&&(r=n.push(i));while(r--)e.splice(n[r],1);}return u=null,e},o=se.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e);}else if(3===i||4===i)return e.nodeValue}else while(t=e[r++])n+=o(t);return n},(b=se.selectors={cacheLength:50,createPseudo:le,match:G,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||se.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&se.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return G.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=h(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return "*"===e?function(){return !0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=m[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&m(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(n,r,i){return function(e){var t=se.attr(e,n);return null==t?"!="===r:!r||(t+="","="===r?t===i:"!="===r?t!==i:"^="===r?i&&0===t.indexOf(i):"*="===r?i&&-1<t.indexOf(i):"$="===r?i&&t.slice(-i.length)===i:"~="===r?-1<(" "+t.replace(B," ")+" ").indexOf(i):"|="===r&&(t===i||t.slice(0,i.length+1)===i+"-"))}},CHILD:function(h,e,t,g,v){var y="nth"!==h.slice(0,3),m="last"!==h.slice(-4),x="of-type"===e;return 1===g&&0===v?function(e){return !!e.parentNode}:function(e,t,n){var r,i,o,a,s,u,l=y!==m?"nextSibling":"previousSibling",c=e.parentNode,f=x&&e.nodeName.toLowerCase(),p=!n&&!x,d=!1;if(c){if(y){while(l){a=e;while(a=a[l])if(x?a.nodeName.toLowerCase()===f:1===a.nodeType)return !1;u=l="only"===h&&!u&&"nextSibling";}return !0}if(u=[m?c.firstChild:c.lastChild],m&&p){d=(s=(r=(i=(o=(a=c)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1])&&r[2],a=s&&c.childNodes[s];while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if(1===a.nodeType&&++d&&a===e){i[h]=[k,s,d];break}}else if(p&&(d=s=(r=(i=(o=(a=e)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1]),!1===d)while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if((x?a.nodeName.toLowerCase()===f:1===a.nodeType)&&++d&&(p&&((i=(o=a[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]=[k,d]),a===e))break;return (d-=v)===g||d%g==0&&0<=d/g}}},PSEUDO:function(e,o){var t,a=b.pseudos[e]||b.setFilters[e.toLowerCase()]||se.error("unsupported pseudo: "+e);return a[S]?a(o):1<a.length?(t=[e,e,"",o],b.setFilters.hasOwnProperty(e.toLowerCase())?le(function(e,t){var n,r=a(e,o),i=r.length;while(i--)e[n=P(e,r[i])]=!(t[n]=r[i]);}):function(e){return a(e,0,t)}):a}},pseudos:{not:le(function(e){var r=[],i=[],s=f(e.replace($,"$1"));return s[S]?le(function(e,t,n,r){var i,o=s(e,null,r,[]),a=e.length;while(a--)(i=o[a])&&(e[a]=!(t[a]=i));}):function(e,t,n){return r[0]=e,s(r,null,n,i),r[0]=null,!i.pop()}}),has:le(function(t){return function(e){return 0<se(t,e).length}}),contains:le(function(t){return t=t.replace(te,ne),function(e){return -1<(e.textContent||o(e)).indexOf(t)}}),lang:le(function(n){return V.test(n||"")||se.error("unsupported lang: "+n),n=n.replace(te,ne).toLowerCase(),function(e){var t;do{if(t=E?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return (t=t.toLowerCase())===n||0===t.indexOf(n+"-")}while((e=e.parentNode)&&1===e.nodeType);return !1}}),target:function(e){var t=n.location&&n.location.hash;return t&&t.slice(1)===e.id},root:function(e){return e===a},focus:function(e){return e===C.activeElement&&(!C.hasFocus||C.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:ge(!1),disabled:ge(!0),checked:function(e){var t=e.nodeName.toLowerCase();return "input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return !1;return !0},parent:function(e){return !b.pseudos.empty(e)},header:function(e){return J.test(e.nodeName)},input:function(e){return Q.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return "input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return "input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:ve(function(){return [0]}),last:ve(function(e,t){return [t-1]}),eq:ve(function(e,t,n){return [n<0?n+t:n]}),even:ve(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:ve(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:ve(function(e,t,n){for(var r=n<0?n+t:t<n?t:n;0<=--r;)e.push(r);return e}),gt:ve(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=b.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})b.pseudos[e]=de(e);for(e in {submit:!0,reset:!0})b.pseudos[e]=he(e);function me(){}function xe(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function be(s,e,t){var u=e.dir,l=e.next,c=l||u,f=t&&"parentNode"===c,p=r++;return e.first?function(e,t,n){while(e=e[u])if(1===e.nodeType||f)return s(e,t,n);return !1}:function(e,t,n){var r,i,o,a=[k,p];if(n){while(e=e[u])if((1===e.nodeType||f)&&s(e,t,n))return !0}else while(e=e[u])if(1===e.nodeType||f)if(i=(o=e[S]||(e[S]={}))[e.uniqueID]||(o[e.uniqueID]={}),l&&l===e.nodeName.toLowerCase())e=e[u]||e;else {if((r=i[c])&&r[0]===k&&r[1]===p)return a[2]=r[2];if((i[c]=a)[2]=s(e,t,n))return !0}return !1}}function we(i){return 1<i.length?function(e,t,n){var r=i.length;while(r--)if(!i[r](e,t,n))return !1;return !0}:i[0]}function Te(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Ce(d,h,g,v,y,e){return v&&!v[S]&&(v=Ce(v)),y&&!y[S]&&(y=Ce(y,e)),le(function(e,t,n,r){var i,o,a,s=[],u=[],l=t.length,c=e||function(e,t,n){for(var r=0,i=t.length;r<i;r++)se(e,t[r],n);return n}(h||"*",n.nodeType?[n]:n,[]),f=!d||!e&&h?c:Te(c,s,d,n,r),p=g?y||(e?d:l||v)?[]:t:f;if(g&&g(f,p,n,r),v){i=Te(p,u),v(i,[],n,r),o=i.length;while(o--)(a=i[o])&&(p[u[o]]=!(f[u[o]]=a));}if(e){if(y||d){if(y){i=[],o=p.length;while(o--)(a=p[o])&&i.push(f[o]=a);y(null,p=[],i,r);}o=p.length;while(o--)(a=p[o])&&-1<(i=y?P(e,a):s[o])&&(e[i]=!(t[i]=a));}}else p=Te(p===t?p.splice(l,p.length):p),y?y(null,t,p,r):H.apply(t,p);})}function Ee(e){for(var i,t,n,r=e.length,o=b.relative[e[0].type],a=o||b.relative[" "],s=o?1:0,u=be(function(e){return e===i},a,!0),l=be(function(e){return -1<P(i,e)},a,!0),c=[function(e,t,n){var r=!o&&(n||t!==w)||((i=t).nodeType?u(e,t,n):l(e,t,n));return i=null,r}];s<r;s++)if(t=b.relative[e[s].type])c=[be(we(c),t)];else {if((t=b.filter[e[s].type].apply(null,e[s].matches))[S]){for(n=++s;n<r;n++)if(b.relative[e[n].type])break;return Ce(1<s&&we(c),1<s&&xe(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace($,"$1"),t,s<n&&Ee(e.slice(s,n)),n<r&&Ee(e=e.slice(n)),n<r&&xe(e))}c.push(t);}return we(c)}return me.prototype=b.filters=b.pseudos,b.setFilters=new me,h=se.tokenize=function(e,t){var n,r,i,o,a,s,u,l=x[e+" "];if(l)return t?0:l.slice(0);a=e,s=[],u=b.preFilter;while(a){for(o in n&&!(r=_.exec(a))||(r&&(a=a.slice(r[0].length)||a),s.push(i=[])),n=!1,(r=z.exec(a))&&(n=r.shift(),i.push({value:n,type:r[0].replace($," ")}),a=a.slice(n.length)),b.filter)!(r=G[o].exec(a))||u[o]&&!(r=u[o](r))||(n=r.shift(),i.push({value:n,type:o,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?se.error(e):x(e,s).slice(0)},f=se.compile=function(e,t){var n,v,y,m,x,r,i=[],o=[],a=A[e+" "];if(!a){t||(t=h(e)),n=t.length;while(n--)(a=Ee(t[n]))[S]?i.push(a):o.push(a);(a=A(e,(v=o,m=0<(y=i).length,x=0<v.length,r=function(e,t,n,r,i){var o,a,s,u=0,l="0",c=e&&[],f=[],p=w,d=e||x&&b.find.TAG("*",i),h=k+=null==p?1:Math.random()||.1,g=d.length;for(i&&(w=t==C||t||i);l!==g&&null!=(o=d[l]);l++){if(x&&o){a=0,t||o.ownerDocument==C||(T(o),n=!E);while(s=v[a++])if(s(o,t||C,n)){r.push(o);break}i&&(k=h);}m&&((o=!s&&o)&&u--,e&&c.push(o));}if(u+=l,m&&l!==u){a=0;while(s=y[a++])s(c,f,t,n);if(e){if(0<u)while(l--)c[l]||f[l]||(f[l]=q.call(r));f=Te(f);}H.apply(r,f),i&&!e&&0<f.length&&1<u+y.length&&se.uniqueSort(r);}return i&&(k=h,w=p),c},m?le(r):r))).selector=e;}return a},g=se.select=function(e,t,n,r){var i,o,a,s,u,l="function"==typeof e&&e,c=!r&&h(e=l.selector||e);if(n=n||[],1===c.length){if(2<(o=c[0]=c[0].slice(0)).length&&"ID"===(a=o[0]).type&&9===t.nodeType&&E&&b.relative[o[1].type]){if(!(t=(b.find.ID(a.matches[0].replace(te,ne),t)||[])[0]))return n;l&&(t=t.parentNode),e=e.slice(o.shift().value.length);}i=G.needsContext.test(e)?0:o.length;while(i--){if(a=o[i],b.relative[s=a.type])break;if((u=b.find[s])&&(r=u(a.matches[0].replace(te,ne),ee.test(o[0].type)&&ye(t.parentNode)||t))){if(o.splice(i,1),!(e=r.length&&xe(o)))return H.apply(n,r),n;break}}}return (l||f(e,c))(r,t,!E,n,!t||ee.test(e)&&ye(t.parentNode)||t),n},d.sortStable=S.split("").sort(D).join("")===S,d.detectDuplicates=!!l,T(),d.sortDetached=ce(function(e){return 1&e.compareDocumentPosition(C.createElement("fieldset"))}),ce(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||fe("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),d.attributes&&ce(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||fe("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ce(function(e){return null==e.getAttribute("disabled")})||fe(R,function(e,t,n){var r;if(!n)return !0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),se}(C);S.find=d,S.expr=d.selectors,S.expr[":"]=S.expr.pseudos,S.uniqueSort=S.unique=d.uniqueSort,S.text=d.getText,S.isXMLDoc=d.isXML,S.contains=d.contains,S.escapeSelector=d.escape;var h=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&S(e).is(n))break;r.push(e);}return r},T=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},k=S.expr.match.needsContext;function A(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var N=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function D(e,n,r){return m(n)?S.grep(e,function(e,t){return !!n.call(e,t,e)!==r}):n.nodeType?S.grep(e,function(e){return e===n!==r}):"string"!=typeof n?S.grep(e,function(e){return -1<i.call(n,e)!==r}):S.filter(n,e,r)}S.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?S.find.matchesSelector(r,e)?[r]:[]:S.find.matches(e,S.grep(t,function(e){return 1===e.nodeType}))},S.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(S(e).filter(function(){for(t=0;t<r;t++)if(S.contains(i[t],this))return !0}));for(n=this.pushStack([]),t=0;t<r;t++)S.find(e,i[t],n);return 1<r?S.uniqueSort(n):n},filter:function(e){return this.pushStack(D(this,e||[],!1))},not:function(e){return this.pushStack(D(this,e||[],!0))},is:function(e){return !!D(this,"string"==typeof e&&k.test(e)?S(e):e||[],!1).length}});var j,q=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(S.fn.init=function(e,t,n){var r,i;if(!e)return this;if(n=n||j,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&3<=e.length?[null,e,null]:q.exec(e))||!r[1]&&t)return !t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof S?t[0]:t,S.merge(this,S.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:E,!0)),N.test(r[1])&&S.isPlainObject(t))for(r in t)m(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return (i=E.getElementById(r[2]))&&(this[0]=i,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):m(e)?void 0!==n.ready?n.ready(e):e(S):S.makeArray(e,this)}).prototype=S.fn,j=S(E);var L=/^(?:parents|prev(?:Until|All))/,H={children:!0,contents:!0,next:!0,prev:!0};function O(e,t){while((e=e[t])&&1!==e.nodeType);return e}S.fn.extend({has:function(e){var t=S(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(S.contains(this,t[e]))return !0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&S(e);if(!k.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?-1<a.index(n):1===n.nodeType&&S.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(1<o.length?S.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?i.call(S(e),this[0]):i.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(S.uniqueSort(S.merge(this.get(),S(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),S.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return h(e,"parentNode")},parentsUntil:function(e,t,n){return h(e,"parentNode",n)},next:function(e){return O(e,"nextSibling")},prev:function(e){return O(e,"previousSibling")},nextAll:function(e){return h(e,"nextSibling")},prevAll:function(e){return h(e,"previousSibling")},nextUntil:function(e,t,n){return h(e,"nextSibling",n)},prevUntil:function(e,t,n){return h(e,"previousSibling",n)},siblings:function(e){return T((e.parentNode||{}).firstChild,e)},children:function(e){return T(e.firstChild)},contents:function(e){return null!=e.contentDocument&&r(e.contentDocument)?e.contentDocument:(A(e,"template")&&(e=e.content||e),S.merge([],e.childNodes))}},function(r,i){S.fn[r]=function(e,t){var n=S.map(this,i,e);return "Until"!==r.slice(-5)&&(t=e),t&&"string"==typeof t&&(n=S.filter(t,n)),1<this.length&&(H[r]||S.uniqueSort(n),L.test(r)&&n.reverse()),this.pushStack(n)};});var P=/[^\x20\t\r\n\f]+/g;function R(e){return e}function M(e){throw e}function I(e,t,n,r){var i;try{e&&m(i=e.promise)?i.call(e).done(t).fail(n):e&&m(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r));}catch(e){n.apply(void 0,[e]);}}S.Callbacks=function(r){var e,n;r="string"==typeof r?(e=r,n={},S.each(e.match(P)||[],function(e,t){n[t]=!0;}),n):S.extend({},r);var i,t,o,a,s=[],u=[],l=-1,c=function(){for(a=a||r.once,o=i=!0;u.length;l=-1){t=u.shift();while(++l<s.length)!1===s[l].apply(t[0],t[1])&&r.stopOnFalse&&(l=s.length,t=!1);}r.memory||(t=!1),i=!1,a&&(s=t?[]:"");},f={add:function(){return s&&(t&&!i&&(l=s.length-1,u.push(t)),function n(e){S.each(e,function(e,t){m(t)?r.unique&&f.has(t)||s.push(t):t&&t.length&&"string"!==w(t)&&n(t);});}(arguments),t&&!i&&c()),this},remove:function(){return S.each(arguments,function(e,t){var n;while(-1<(n=S.inArray(t,s,n)))s.splice(n,1),n<=l&&l--;}),this},has:function(e){return e?-1<S.inArray(e,s):0<s.length},empty:function(){return s&&(s=[]),this},disable:function(){return a=u=[],s=t="",this},disabled:function(){return !s},lock:function(){return a=u=[],t||i||(s=t=""),this},locked:function(){return !!a},fireWith:function(e,t){return a||(t=[e,(t=t||[]).slice?t.slice():t],u.push(t),i||c()),this},fire:function(){return f.fireWith(this,arguments),this},fired:function(){return !!o}};return f},S.extend({Deferred:function(e){var o=[["notify","progress",S.Callbacks("memory"),S.Callbacks("memory"),2],["resolve","done",S.Callbacks("once memory"),S.Callbacks("once memory"),0,"resolved"],["reject","fail",S.Callbacks("once memory"),S.Callbacks("once memory"),1,"rejected"]],i="pending",a={state:function(){return i},always:function(){return s.done(arguments).fail(arguments),this},"catch":function(e){return a.then(null,e)},pipe:function(){var i=arguments;return S.Deferred(function(r){S.each(o,function(e,t){var n=m(i[t[4]])&&i[t[4]];s[t[1]](function(){var e=n&&n.apply(this,arguments);e&&m(e.promise)?e.promise().progress(r.notify).done(r.resolve).fail(r.reject):r[t[0]+"With"](this,n?[e]:arguments);});}),i=null;}).promise()},then:function(t,n,r){var u=0;function l(i,o,a,s){return function(){var n=this,r=arguments,e=function(){var e,t;if(!(i<u)){if((e=a.apply(n,r))===o.promise())throw new TypeError("Thenable self-resolution");t=e&&("object"==typeof e||"function"==typeof e)&&e.then,m(t)?s?t.call(e,l(u,o,R,s),l(u,o,M,s)):(u++,t.call(e,l(u,o,R,s),l(u,o,M,s),l(u,o,R,o.notifyWith))):(a!==R&&(n=void 0,r=[e]),(s||o.resolveWith)(n,r));}},t=s?e:function(){try{e();}catch(e){S.Deferred.exceptionHook&&S.Deferred.exceptionHook(e,t.stackTrace),u<=i+1&&(a!==M&&(n=void 0,r=[e]),o.rejectWith(n,r));}};i?t():(S.Deferred.getStackHook&&(t.stackTrace=S.Deferred.getStackHook()),C.setTimeout(t));}}return S.Deferred(function(e){o[0][3].add(l(0,e,m(r)?r:R,e.notifyWith)),o[1][3].add(l(0,e,m(t)?t:R)),o[2][3].add(l(0,e,m(n)?n:M));}).promise()},promise:function(e){return null!=e?S.extend(e,a):a}},s={};return S.each(o,function(e,t){var n=t[2],r=t[5];a[t[1]]=n.add,r&&n.add(function(){i=r;},o[3-e][2].disable,o[3-e][3].disable,o[0][2].lock,o[0][3].lock),n.add(t[3].fire),s[t[0]]=function(){return s[t[0]+"With"](this===s?void 0:this,arguments),this},s[t[0]+"With"]=n.fireWith;}),a.promise(s),e&&e.call(s,s),s},when:function(e){var n=arguments.length,t=n,r=Array(t),i=s.call(arguments),o=S.Deferred(),a=function(t){return function(e){r[t]=this,i[t]=1<arguments.length?s.call(arguments):e,--n||o.resolveWith(r,i);}};if(n<=1&&(I(e,o.done(a(t)).resolve,o.reject,!n),"pending"===o.state()||m(i[t]&&i[t].then)))return o.then();while(t--)I(i[t],a(t),o.reject);return o.promise()}});var W=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;S.Deferred.exceptionHook=function(e,t){C.console&&C.console.warn&&e&&W.test(e.name)&&C.console.warn("jQuery.Deferred exception: "+e.message,e.stack,t);},S.readyException=function(e){C.setTimeout(function(){throw e});};var F=S.Deferred();function B(){E.removeEventListener("DOMContentLoaded",B),C.removeEventListener("load",B),S.ready();}S.fn.ready=function(e){return F.then(e)["catch"](function(e){S.readyException(e);}),this},S.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--S.readyWait:S.isReady)||(S.isReady=!0)!==e&&0<--S.readyWait||F.resolveWith(E,[S]);}}),S.ready.then=F.then,"complete"===E.readyState||"loading"!==E.readyState&&!E.documentElement.doScroll?C.setTimeout(S.ready):(E.addEventListener("DOMContentLoaded",B),C.addEventListener("load",B));var $=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===w(n))for(s in i=!0,n)$(e,t,s,n[s],!0,o,a);else if(void 0!==r&&(i=!0,m(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(S(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},_=/^-ms-/,z=/-([a-z])/g;function U(e,t){return t.toUpperCase()}function X(e){return e.replace(_,"ms-").replace(z,U)}var V=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function G(){this.expando=S.expando+G.uid++;}G.uid=1,G.prototype={cache:function(e){var t=e[this.expando];return t||(t={},V(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[X(t)]=n;else for(r in t)i[X(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][X(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(X):(t=X(t))in r?[t]:t.match(P)||[]).length;while(n--)delete r[t[n]];}(void 0===t||S.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando]);}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!S.isEmptyObject(t)}};var Y=new G,Q=new G,J=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,K=/[A-Z]/g;function Z(e,t,n){var r,i;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(K,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n="true"===(i=n)||"false"!==i&&("null"===i?null:i===+i+""?+i:J.test(i)?JSON.parse(i):i);}catch(e){}Q.set(e,t,n);}else n=void 0;return n}S.extend({hasData:function(e){return Q.hasData(e)||Y.hasData(e)},data:function(e,t,n){return Q.access(e,t,n)},removeData:function(e,t){Q.remove(e,t);},_data:function(e,t,n){return Y.access(e,t,n)},_removeData:function(e,t){Y.remove(e,t);}}),S.fn.extend({data:function(n,e){var t,r,i,o=this[0],a=o&&o.attributes;if(void 0===n){if(this.length&&(i=Q.get(o),1===o.nodeType&&!Y.get(o,"hasDataAttrs"))){t=a.length;while(t--)a[t]&&0===(r=a[t].name).indexOf("data-")&&(r=X(r.slice(5)),Z(o,r,i[r]));Y.set(o,"hasDataAttrs",!0);}return i}return "object"==typeof n?this.each(function(){Q.set(this,n);}):$(this,function(e){var t;if(o&&void 0===e)return void 0!==(t=Q.get(o,n))?t:void 0!==(t=Z(o,n))?t:void 0;this.each(function(){Q.set(this,n,e);});},null,e,1<arguments.length,null,!0)},removeData:function(e){return this.each(function(){Q.remove(this,e);})}}),S.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=Y.get(e,t),n&&(!r||Array.isArray(n)?r=Y.access(e,t,S.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=S.queue(e,t),r=n.length,i=n.shift(),o=S._queueHooks(e,t);"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,function(){S.dequeue(e,t);},o)),!r&&o&&o.empty.fire();},_queueHooks:function(e,t){var n=t+"queueHooks";return Y.get(e,n)||Y.access(e,n,{empty:S.Callbacks("once memory").add(function(){Y.remove(e,[t+"queue",n]);})})}}),S.fn.extend({queue:function(t,n){var e=2;return "string"!=typeof t&&(n=t,t="fx",e--),arguments.length<e?S.queue(this[0],t):void 0===n?this:this.each(function(){var e=S.queue(this,t,n);S._queueHooks(this,t),"fx"===t&&"inprogress"!==e[0]&&S.dequeue(this,t);})},dequeue:function(e){return this.each(function(){S.dequeue(this,e);})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=S.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o]);};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=Y.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var ee=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,te=new RegExp("^(?:([+-])=|)("+ee+")([a-z%]*)$","i"),ne=["Top","Right","Bottom","Left"],re=E.documentElement,ie=function(e){return S.contains(e.ownerDocument,e)},oe={composed:!0};re.getRootNode&&(ie=function(e){return S.contains(e.ownerDocument,e)||e.getRootNode(oe)===e.ownerDocument});var ae=function(e,t){return "none"===(e=t||e).style.display||""===e.style.display&&ie(e)&&"none"===S.css(e,"display")};function se(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return S.css(e,t,"")},u=s(),l=n&&n[3]||(S.cssNumber[t]?"":"px"),c=e.nodeType&&(S.cssNumber[t]||"px"!==l&&+u)&&te.exec(S.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)S.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,S.style(e,t,c+l),n=n||[];}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var ue={};function le(e,t){for(var n,r,i,o,a,s,u,l=[],c=0,f=e.length;c<f;c++)(r=e[c]).style&&(n=r.style.display,t?("none"===n&&(l[c]=Y.get(r,"display")||null,l[c]||(r.style.display="")),""===r.style.display&&ae(r)&&(l[c]=(u=a=o=void 0,a=(i=r).ownerDocument,s=i.nodeName,(u=ue[s])||(o=a.body.appendChild(a.createElement(s)),u=S.css(o,"display"),o.parentNode.removeChild(o),"none"===u&&(u="block"),ue[s]=u)))):"none"!==n&&(l[c]="none",Y.set(r,"display",n)));for(c=0;c<f;c++)null!=l[c]&&(e[c].style.display=l[c]);return e}S.fn.extend({show:function(){return le(this,!0)},hide:function(){return le(this)},toggle:function(e){return "boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?S(this).show():S(this).hide();})}});var ce,fe,pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,he=/^$|^module$|\/(?:java|ecma)script/i;ce=E.createDocumentFragment().appendChild(E.createElement("div")),(fe=E.createElement("input")).setAttribute("type","radio"),fe.setAttribute("checked","checked"),fe.setAttribute("name","t"),ce.appendChild(fe),y.checkClone=ce.cloneNode(!0).cloneNode(!0).lastChild.checked,ce.innerHTML="<textarea>x</textarea>",y.noCloneChecked=!!ce.cloneNode(!0).lastChild.defaultValue,ce.innerHTML="<option></option>",y.option=!!ce.lastChild;var ge={thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function ve(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&A(e,t)?S.merge([e],n):n}function ye(e,t){for(var n=0,r=e.length;n<r;n++)Y.set(e[n],"globalEval",!t||Y.get(t[n],"globalEval"));}ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td,y.option||(ge.optgroup=ge.option=[1,"<select multiple='multiple'>","</select>"]);var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===w(o))S.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+S.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;S.merge(p,a.childNodes),(a=f.firstChild).textContent="";}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&-1<S.inArray(o,r))i&&i.push(o);else if(l=ie(o),a=ve(f.appendChild(o),"script"),l&&ye(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o);}return f}var be=/^key/,we=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Te=/^([^.]*)(?:\.(.+)|)/;function Ce(){return !0}function Ee(){return !1}function Se(e,t){return e===function(){try{return E.activeElement}catch(e){}}()==("focus"===t)}function ke(e,t,n,r,i,o){var a,s;if("object"==typeof t){for(s in "string"!=typeof n&&(r=r||n,n=void 0),t)ke(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=Ee;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return S().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=S.guid++)),e.each(function(){S.event.add(this,t,i,r,n);})}function Ae(e,i,o){o?(Y.set(e,i,!1),S.event.add(e,i,{namespace:!1,handler:function(e){var t,n,r=Y.get(this,i);if(1&e.isTrigger&&this[i]){if(r.length)(S.event.special[i]||{}).delegateType&&e.stopPropagation();else if(r=s.call(arguments),Y.set(this,i,r),t=o(this,i),this[i](),r!==(n=Y.get(this,i))||t?Y.set(this,i,!1):n={},r!==n)return e.stopImmediatePropagation(),e.preventDefault(),n.value}else r.length&&(Y.set(this,i,{value:S.event.trigger(S.extend(r[0],S.Event.prototype),r.slice(1),this)}),e.stopImmediatePropagation());}})):void 0===Y.get(e,i)&&S.event.add(e,i,Ce);}S.event={global:{},add:function(t,e,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.get(t);if(V(t)){n.handler&&(n=(o=n).handler,i=o.selector),i&&S.find.matchesSelector(re,i),n.guid||(n.guid=S.guid++),(u=v.events)||(u=v.events=Object.create(null)),(a=v.handle)||(a=v.handle=function(e){return "undefined"!=typeof S&&S.event.triggered!==e.type?S.event.dispatch.apply(t,arguments):void 0}),l=(e=(e||"").match(P)||[""]).length;while(l--)d=g=(s=Te.exec(e[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=S.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=S.event.special[d]||{},c=S.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&S.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(t,r,h,a)||t.addEventListener&&t.addEventListener(d,a)),f.add&&(f.add.call(t,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),S.event.global[d]=!0);}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.hasData(e)&&Y.get(e);if(v&&(u=v.events)){l=(t=(t||"").match(P)||[""]).length;while(l--)if(d=g=(s=Te.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d){f=S.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||S.removeEvent(e,d,v.handle),delete u[d]);}else for(d in u)S.event.remove(e,d+t[l],n,r,!0);S.isEmptyObject(u)&&Y.remove(e,"handle events");}},dispatch:function(e){var t,n,r,i,o,a,s=new Array(arguments.length),u=S.event.fix(e),l=(Y.get(this,"events")||Object.create(null))[u.type]||[],c=S.event.special[u.type]||{};for(s[0]=u,t=1;t<arguments.length;t++)s[t]=arguments[t];if(u.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,u)){a=S.event.handlers.call(this,u,l),t=0;while((i=a[t++])&&!u.isPropagationStopped()){u.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!u.isImmediatePropagationStopped())u.rnamespace&&!1!==o.namespace&&!u.rnamespace.test(o.namespace)||(u.handleObj=o,u.data=o.data,void 0!==(r=((S.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,s))&&!1===(u.result=r)&&(u.preventDefault(),u.stopPropagation()));}return c.postDispatch&&c.postDispatch.call(this,u),u.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&1<=e.button))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?-1<S(i,this).index(l):S.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o});}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(t,e){Object.defineProperty(S.Event.prototype,t,{enumerable:!0,configurable:!0,get:m(e)?function(){if(this.originalEvent)return e(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[t]},set:function(e){Object.defineProperty(this,t,{enumerable:!0,configurable:!0,writable:!0,value:e});}});},fix:function(e){return e[S.expando]?e:new S.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Ae(t,"click",Ce),!1},trigger:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Ae(t,"click"),!0},_default:function(e){var t=e.target;return pe.test(t.type)&&t.click&&A(t,"input")&&Y.get(t,"click")||A(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result);}}}},S.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n);},S.Event=function(e,t){if(!(this instanceof S.Event))return new S.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ce:Ee,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&S.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[S.expando]=!0;},S.Event.prototype={constructor:S.Event,isDefaultPrevented:Ee,isPropagationStopped:Ee,isImmediatePropagationStopped:Ee,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ce,e&&!this.isSimulated&&e.preventDefault();},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ce,e&&!this.isSimulated&&e.stopPropagation();},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ce,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation();}},S.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&be.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&we.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},S.event.addProp),S.each({focus:"focusin",blur:"focusout"},function(e,t){S.event.special[e]={setup:function(){return Ae(this,e,Se),!1},trigger:function(){return Ae(this,e),!0},delegateType:t};}),S.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,i){S.event.special[e]={delegateType:i,bindType:i,handle:function(e){var t,n=e.relatedTarget,r=e.handleObj;return n&&(n===this||S.contains(this,n))||(e.type=r.origType,t=r.handler.apply(this,arguments),e.type=i),t}};}),S.fn.extend({on:function(e,t,n,r){return ke(this,e,t,n,r)},one:function(e,t,n,r){return ke(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,S(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return !1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=Ee),this.each(function(){S.event.remove(this,e,n,t);})}});var Ne=/<script|<style|<link/i,De=/checked\s*(?:[^=]|=\s*.checked.)/i,je=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function qe(e,t){return A(e,"table")&&A(11!==t.nodeType?t:t.firstChild,"tr")&&S(e).children("tbody")[0]||e}function Le(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function He(e){return "true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Oe(e,t){var n,r,i,o,a,s;if(1===t.nodeType){if(Y.hasData(e)&&(s=Y.get(e).events))for(i in Y.remove(t,"handle events"),s)for(n=0,r=s[i].length;n<r;n++)S.event.add(t,i,s[i][n]);Q.hasData(e)&&(o=Q.access(e),a=S.extend({},o),Q.set(t,a));}}function Pe(n,r,i,o){r=g(r);var e,t,a,s,u,l,c=0,f=n.length,p=f-1,d=r[0],h=m(d);if(h||1<f&&"string"==typeof d&&!y.checkClone&&De.test(d))return n.each(function(e){var t=n.eq(e);h&&(r[0]=d.call(this,e,t.html())),Pe(t,r,i,o);});if(f&&(t=(e=xe(r,n[0].ownerDocument,!1,n,o)).firstChild,1===e.childNodes.length&&(e=t),t||o)){for(s=(a=S.map(ve(e,"script"),Le)).length;c<f;c++)u=e,c!==p&&(u=S.clone(u,!0,!0),s&&S.merge(a,ve(u,"script"))),i.call(n[c],u,c);if(s)for(l=a[a.length-1].ownerDocument,S.map(a,He),c=0;c<s;c++)u=a[c],he.test(u.type||"")&&!Y.access(u,"globalEval")&&S.contains(l,u)&&(u.src&&"module"!==(u.type||"").toLowerCase()?S._evalUrl&&!u.noModule&&S._evalUrl(u.src,{nonce:u.nonce||u.getAttribute("nonce")},l):b(u.textContent.replace(je,""),u,l));}return n}function Re(e,t,n){for(var r,i=t?S.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||S.cleanData(ve(r)),r.parentNode&&(n&&ie(r)&&ye(ve(r,"script")),r.parentNode.removeChild(r));return e}S.extend({htmlPrefilter:function(e){return e},clone:function(e,t,n){var r,i,o,a,s,u,l,c=e.cloneNode(!0),f=ie(e);if(!(y.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||S.isXMLDoc(e)))for(a=ve(c),r=0,i=(o=ve(e)).length;r<i;r++)s=o[r],u=a[r],"input"===(l=u.nodeName.toLowerCase())&&pe.test(s.type)?u.checked=s.checked:"input"!==l&&"textarea"!==l||(u.defaultValue=s.defaultValue);if(t)if(n)for(o=o||ve(e),a=a||ve(c),r=0,i=o.length;r<i;r++)Oe(o[r],a[r]);else Oe(e,c);return 0<(a=ve(c,"script")).length&&ye(a,!f&&ve(e,"script")),c},cleanData:function(e){for(var t,n,r,i=S.event.special,o=0;void 0!==(n=e[o]);o++)if(V(n)){if(t=n[Y.expando]){if(t.events)for(r in t.events)i[r]?S.event.remove(n,r):S.removeEvent(n,r,t.handle);n[Y.expando]=void 0;}n[Q.expando]&&(n[Q.expando]=void 0);}}}),S.fn.extend({detach:function(e){return Re(this,e,!0)},remove:function(e){return Re(this,e)},text:function(e){return $(this,function(e){return void 0===e?S.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e);})},null,e,arguments.length)},append:function(){return Pe(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||qe(this,e).appendChild(e);})},prepend:function(){return Pe(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=qe(this,e);t.insertBefore(e,t.firstChild);}})},before:function(){return Pe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this);})},after:function(){return Pe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling);})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(S.cleanData(ve(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return S.clone(this,e,t)})},html:function(e){return $(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Ne.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=S.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(S.cleanData(ve(t,!1)),t.innerHTML=e);t=0;}catch(e){}}t&&this.empty().append(e);},null,e,arguments.length)},replaceWith:function(){var n=[];return Pe(this,arguments,function(e){var t=this.parentNode;S.inArray(this,n)<0&&(S.cleanData(ve(this)),t&&t.replaceChild(e,this));},n)}}),S.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,a){S.fn[e]=function(e){for(var t,n=[],r=S(e),i=r.length-1,o=0;o<=i;o++)t=o===i?this:this.clone(!0),S(r[o])[a](t),u.apply(n,t.get());return this.pushStack(n)};});var Me=new RegExp("^("+ee+")(?!px)[a-z%]+$","i"),Ie=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=C),t.getComputedStyle(e)},We=function(e,t,n){var r,i,o={};for(i in t)o[i]=e.style[i],e.style[i]=t[i];for(i in r=n.call(e),t)e.style[i]=o[i];return r},Fe=new RegExp(ne.join("|"),"i");function Be(e,t,n){var r,i,o,a,s=e.style;return (n=n||Ie(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||ie(e)||(a=S.style(e,t)),!y.pixelBoxStyles()&&Me.test(a)&&Fe.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function $e(e,t){return {get:function(){if(!e())return (this.get=t).apply(this,arguments);delete this.get;}}}!function(){function e(){if(l){u.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",l.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",re.appendChild(u).appendChild(l);var e=C.getComputedStyle(l);n="1%"!==e.top,s=12===t(e.marginLeft),l.style.right="60%",o=36===t(e.right),r=36===t(e.width),l.style.position="absolute",i=12===t(l.offsetWidth/3),re.removeChild(u),l=null;}}function t(e){return Math.round(parseFloat(e))}var n,r,i,o,a,s,u=E.createElement("div"),l=E.createElement("div");l.style&&(l.style.backgroundClip="content-box",l.cloneNode(!0).style.backgroundClip="",y.clearCloneStyle="content-box"===l.style.backgroundClip,S.extend(y,{boxSizingReliable:function(){return e(),r},pixelBoxStyles:function(){return e(),o},pixelPosition:function(){return e(),n},reliableMarginLeft:function(){return e(),s},scrollboxSize:function(){return e(),i},reliableTrDimensions:function(){var e,t,n,r;return null==a&&(e=E.createElement("table"),t=E.createElement("tr"),n=E.createElement("div"),e.style.cssText="position:absolute;left:-11111px",t.style.height="1px",n.style.height="9px",re.appendChild(e).appendChild(t).appendChild(n),r=C.getComputedStyle(t),a=3<parseInt(r.height),re.removeChild(e)),a}}));}();var _e=["Webkit","Moz","ms"],ze=E.createElement("div").style,Ue={};function Xe(e){var t=S.cssProps[e]||Ue[e];return t||(e in ze?e:Ue[e]=function(e){var t=e[0].toUpperCase()+e.slice(1),n=_e.length;while(n--)if((e=_e[n]+t)in ze)return e}(e)||e)}var Ve=/^(none|table(?!-c[ea]).+)/,Ge=/^--/,Ye={position:"absolute",visibility:"hidden",display:"block"},Qe={letterSpacing:"0",fontWeight:"400"};function Je(e,t,n){var r=te.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Ke(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=S.css(e,n+ne[a],!0,i)),r?("content"===n&&(u-=S.css(e,"padding"+ne[a],!0,i)),"margin"!==n&&(u-=S.css(e,"border"+ne[a]+"Width",!0,i))):(u+=S.css(e,"padding"+ne[a],!0,i),"padding"!==n?u+=S.css(e,"border"+ne[a]+"Width",!0,i):s+=S.css(e,"border"+ne[a]+"Width",!0,i));return !r&&0<=o&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))||0),u}function Ze(e,t,n){var r=Ie(e),i=(!y.boxSizingReliable()||n)&&"border-box"===S.css(e,"boxSizing",!1,r),o=i,a=Be(e,t,r),s="offset"+t[0].toUpperCase()+t.slice(1);if(Me.test(a)){if(!n)return a;a="auto";}return (!y.boxSizingReliable()&&i||!y.reliableTrDimensions()&&A(e,"tr")||"auto"===a||!parseFloat(a)&&"inline"===S.css(e,"display",!1,r))&&e.getClientRects().length&&(i="border-box"===S.css(e,"boxSizing",!1,r),(o=s in e)&&(a=e[s])),(a=parseFloat(a)||0)+Ke(e,t,n||(i?"border":"content"),o,r,a)+"px"}function et(e,t,n,r,i){return new et.prototype.init(e,t,n,r,i)}S.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Be(e,"opacity");return ""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=X(t),u=Ge.test(t),l=e.style;if(u||(t=Xe(s)),a=S.cssHooks[t]||S.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"===(o=typeof n)&&(i=te.exec(n))&&i[1]&&(n=se(e,t,i),o="number"),null!=n&&n==n&&("number"!==o||u||(n+=i&&i[3]||(S.cssNumber[s]?"":"px")),y.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n));}},css:function(e,t,n,r){var i,o,a,s=X(t);return Ge.test(t)||(t=Xe(s)),(a=S.cssHooks[t]||S.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=Be(e,t,r)),"normal"===i&&t in Qe&&(i=Qe[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),S.each(["height","width"],function(e,u){S.cssHooks[u]={get:function(e,t,n){if(t)return !Ve.test(S.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?Ze(e,u,n):We(e,Ye,function(){return Ze(e,u,n)})},set:function(e,t,n){var r,i=Ie(e),o=!y.scrollboxSize()&&"absolute"===i.position,a=(o||n)&&"border-box"===S.css(e,"boxSizing",!1,i),s=n?Ke(e,u,n,a,i):0;return a&&o&&(s-=Math.ceil(e["offset"+u[0].toUpperCase()+u.slice(1)]-parseFloat(i[u])-Ke(e,u,"border",!1,i)-.5)),s&&(r=te.exec(t))&&"px"!==(r[3]||"px")&&(e.style[u]=t,t=S.css(e,u)),Je(0,t,s)}};}),S.cssHooks.marginLeft=$e(y.reliableMarginLeft,function(e,t){if(t)return (parseFloat(Be(e,"marginLeft"))||e.getBoundingClientRect().left-We(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),S.each({margin:"",padding:"",border:"Width"},function(i,o){S.cssHooks[i+o]={expand:function(e){for(var t=0,n={},r="string"==typeof e?e.split(" "):[e];t<4;t++)n[i+ne[t]+o]=r[t]||r[t-2]||r[0];return n}},"margin"!==i&&(S.cssHooks[i+o].set=Je);}),S.fn.extend({css:function(e,t){return $(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=Ie(e),i=t.length;a<i;a++)o[t[a]]=S.css(e,t[a],!1,r);return o}return void 0!==n?S.style(e,t,n):S.css(e,t)},e,t,1<arguments.length)}}),((S.Tween=et).prototype={constructor:et,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||S.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(S.cssNumber[n]?"":"px");},cur:function(){var e=et.propHooks[this.prop];return e&&e.get?e.get(this):et.propHooks._default.get(this)},run:function(e){var t,n=et.propHooks[this.prop];return this.options.duration?this.pos=t=S.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):et.propHooks._default.set(this),this}}).init.prototype=et.prototype,(et.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=S.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){S.fx.step[e.prop]?S.fx.step[e.prop](e):1!==e.elem.nodeType||!S.cssHooks[e.prop]&&null==e.elem.style[Xe(e.prop)]?e.elem[e.prop]=e.now:S.style(e.elem,e.prop,e.now+e.unit);}}}).scrollTop=et.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now);}},S.easing={linear:function(e){return e},swing:function(e){return .5-Math.cos(e*Math.PI)/2},_default:"swing"},S.fx=et.prototype.init,S.fx.step={};var tt,nt,rt,it,ot=/^(?:toggle|show|hide)$/,at=/queueHooks$/;function st(){nt&&(!1===E.hidden&&C.requestAnimationFrame?C.requestAnimationFrame(st):C.setTimeout(st,S.fx.interval),S.fx.tick());}function ut(){return C.setTimeout(function(){tt=void 0;}),tt=Date.now()}function lt(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=ne[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function ct(e,t,n){for(var r,i=(ft.tweeners[t]||[]).concat(ft.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function ft(o,e,t){var n,a,r=0,i=ft.prefilters.length,s=S.Deferred().always(function(){delete u.elem;}),u=function(){if(a)return !1;for(var e=tt||ut(),t=Math.max(0,l.startTime+l.duration-e),n=1-(t/l.duration||0),r=0,i=l.tweens.length;r<i;r++)l.tweens[r].run(n);return s.notifyWith(o,[l,n,t]),n<1&&i?t:(i||s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l]),!1)},l=s.promise({elem:o,props:S.extend({},e),opts:S.extend(!0,{specialEasing:{},easing:S.easing._default},t),originalProperties:e,originalOptions:t,startTime:tt||ut(),duration:t.duration,tweens:[],createTween:function(e,t){var n=S.Tween(o,l.opts,e,t,l.opts.specialEasing[e]||l.opts.easing);return l.tweens.push(n),n},stop:function(e){var t=0,n=e?l.tweens.length:0;if(a)return this;for(a=!0;t<n;t++)l.tweens[t].run(1);return e?(s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l,e])):s.rejectWith(o,[l,e]),this}}),c=l.props;for(!function(e,t){var n,r,i,o,a;for(n in e)if(i=t[r=X(n)],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=S.cssHooks[r])&&"expand"in a)for(n in o=a.expand(o),delete e[r],o)n in e||(e[n]=o[n],t[n]=i);else t[r]=i;}(c,l.opts.specialEasing);r<i;r++)if(n=ft.prefilters[r].call(l,o,c,l.opts))return m(n.stop)&&(S._queueHooks(l.elem,l.opts.queue).stop=n.stop.bind(n)),n;return S.map(c,ct,l),m(l.opts.start)&&l.opts.start.call(o,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),S.fx.timer(S.extend(u,{elem:o,anim:l,queue:l.opts.queue})),l}S.Animation=S.extend(ft,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return se(n.elem,e,te.exec(t),n),n}]},tweener:function(e,t){m(e)?(t=e,e=["*"]):e=e.match(P);for(var n,r=0,i=e.length;r<i;r++)n=e[r],ft.tweeners[n]=ft.tweeners[n]||[],ft.tweeners[n].unshift(t);},prefilters:[function(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),v=Y.get(e,"fxshow");for(r in n.queue||(null==(a=S._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s();}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,S.queue(e,"fx").length||a.empty.fire();});})),t)if(i=t[r],ot.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!v||void 0===v[r])continue;g=!0;}d[r]=v&&v[r]||S.style(e,r);}if((u=!S.isEmptyObject(t))||!S.isEmptyObject(d))for(r in f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=v&&v.display)&&(l=Y.get(e,"display")),"none"===(c=S.css(e,"display"))&&(l?c=l:(le([e],!0),l=e.style.display||l,c=S.css(e,"display"),le([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===S.css(e,"float")&&(u||(p.done(function(){h.display=l;}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2];})),u=!1,d)u||(v?"hidden"in v&&(g=v.hidden):v=Y.access(e,"fxshow",{display:l}),o&&(v.hidden=!g),g&&le([e],!0),p.done(function(){for(r in g||le([e]),Y.remove(e,"fxshow"),d)S.style(e,r,d[r]);})),u=ct(g?v[r]:0,r,p),r in v||(v[r]=u.start,g&&(u.end=u.start,u.start=0));}],prefilter:function(e,t){t?ft.prefilters.unshift(e):ft.prefilters.push(e);}}),S.speed=function(e,t,n){var r=e&&"object"==typeof e?S.extend({},e):{complete:n||!n&&t||m(e)&&e,duration:e,easing:n&&t||t&&!m(t)&&t};return S.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in S.fx.speeds?r.duration=S.fx.speeds[r.duration]:r.duration=S.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){m(r.old)&&r.old.call(this),r.queue&&S.dequeue(this,r.queue);},r},S.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(t,e,n,r){var i=S.isEmptyObject(t),o=S.speed(e,n,r),a=function(){var e=ft(this,S.extend({},t),o);(i||Y.get(this,"finish"))&&e.stop(!0);};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(i,e,o){var a=function(e){var t=e.stop;delete e.stop,t(o);};return "string"!=typeof i&&(o=e,e=i,i=void 0),e&&this.queue(i||"fx",[]),this.each(function(){var e=!0,t=null!=i&&i+"queueHooks",n=S.timers,r=Y.get(this);if(t)r[t]&&r[t].stop&&a(r[t]);else for(t in r)r[t]&&r[t].stop&&at.test(t)&&a(r[t]);for(t=n.length;t--;)n[t].elem!==this||null!=i&&n[t].queue!==i||(n[t].anim.stop(o),e=!1,n.splice(t,1));!e&&o||S.dequeue(this,i);})},finish:function(a){return !1!==a&&(a=a||"fx"),this.each(function(){var e,t=Y.get(this),n=t[a+"queue"],r=t[a+"queueHooks"],i=S.timers,o=n?n.length:0;for(t.finish=!0,S.queue(this,a,[]),r&&r.stop&&r.stop.call(this,!0),e=i.length;e--;)i[e].elem===this&&i[e].queue===a&&(i[e].anim.stop(!0),i.splice(e,1));for(e=0;e<o;e++)n[e]&&n[e].finish&&n[e].finish.call(this);delete t.finish;})}}),S.each(["toggle","show","hide"],function(e,r){var i=S.fn[r];S.fn[r]=function(e,t,n){return null==e||"boolean"==typeof e?i.apply(this,arguments):this.animate(lt(r,!0),e,t,n)};}),S.each({slideDown:lt("show"),slideUp:lt("hide"),slideToggle:lt("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,r){S.fn[e]=function(e,t,n){return this.animate(r,e,t,n)};}),S.timers=[],S.fx.tick=function(){var e,t=0,n=S.timers;for(tt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||S.fx.stop(),tt=void 0;},S.fx.timer=function(e){S.timers.push(e),S.fx.start();},S.fx.interval=13,S.fx.start=function(){nt||(nt=!0,st());},S.fx.stop=function(){nt=null;},S.fx.speeds={slow:600,fast:200,_default:400},S.fn.delay=function(r,e){return r=S.fx&&S.fx.speeds[r]||r,e=e||"fx",this.queue(e,function(e,t){var n=C.setTimeout(e,r);t.stop=function(){C.clearTimeout(n);};})},rt=E.createElement("input"),it=E.createElement("select").appendChild(E.createElement("option")),rt.type="checkbox",y.checkOn=""!==rt.value,y.optSelected=it.selected,(rt=E.createElement("input")).value="t",rt.type="radio",y.radioValue="t"===rt.value;var pt,dt=S.expr.attrHandle;S.fn.extend({attr:function(e,t){return $(this,S.attr,e,t,1<arguments.length)},removeAttr:function(e){return this.each(function(){S.removeAttr(this,e);})}}),S.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return "undefined"==typeof e.getAttribute?S.prop(e,t,n):(1===o&&S.isXMLDoc(e)||(i=S.attrHooks[t.toLowerCase()]||(S.expr.match.bool.test(t)?pt:void 0)),void 0!==n?null===n?void S.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=S.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!y.radioValue&&"radio"===t&&A(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(P);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n);}}),pt={set:function(e,t,n){return !1===t?S.removeAttr(e,n):e.setAttribute(n,n),n}},S.each(S.expr.match.bool.source.match(/\w+/g),function(e,t){var a=dt[t]||S.find.attr;dt[t]=function(e,t,n){var r,i,o=t.toLowerCase();return n||(i=dt[o],dt[o]=r,r=null!=a(e,t,n)?o:null,dt[o]=i),r};});var ht=/^(?:input|select|textarea|button)$/i,gt=/^(?:a|area)$/i;function vt(e){return (e.match(P)||[]).join(" ")}function yt(e){return e.getAttribute&&e.getAttribute("class")||""}function mt(e){return Array.isArray(e)?e:"string"==typeof e&&e.match(P)||[]}S.fn.extend({prop:function(e,t){return $(this,S.prop,e,t,1<arguments.length)},removeProp:function(e){return this.each(function(){delete this[S.propFix[e]||e];})}}),S.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&S.isXMLDoc(e)||(t=S.propFix[t]||t,i=S.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=S.find.attr(e,"tabindex");return t?parseInt(t,10):ht.test(e.nodeName)||gt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),y.optSelected||(S.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex);}}),S.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){S.propFix[this.toLowerCase()]=this;}),S.fn.extend({addClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).addClass(t.call(this,e,yt(this)));});if((e=mt(t)).length)while(n=this[u++])if(i=yt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=e[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=vt(r))&&n.setAttribute("class",s);}return this},removeClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).removeClass(t.call(this,e,yt(this)));});if(!arguments.length)return this.attr("class","");if((e=mt(t)).length)while(n=this[u++])if(i=yt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=e[a++])while(-1<r.indexOf(" "+o+" "))r=r.replace(" "+o+" "," ");i!==(s=vt(r))&&n.setAttribute("class",s);}return this},toggleClass:function(i,t){var o=typeof i,a="string"===o||Array.isArray(i);return "boolean"==typeof t&&a?t?this.addClass(i):this.removeClass(i):m(i)?this.each(function(e){S(this).toggleClass(i.call(this,e,yt(this),t),t);}):this.each(function(){var e,t,n,r;if(a){t=0,n=S(this),r=mt(i);while(e=r[t++])n.hasClass(e)?n.removeClass(e):n.addClass(e);}else void 0!==i&&"boolean"!==o||((e=yt(this))&&Y.set(this,"__className__",e),this.setAttribute&&this.setAttribute("class",e||!1===i?"":Y.get(this,"__className__")||""));})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&-1<(" "+vt(yt(n))+" ").indexOf(t))return !0;return !1}});var xt=/\r/g;S.fn.extend({val:function(n){var r,e,i,t=this[0];return arguments.length?(i=m(n),this.each(function(e){var t;1===this.nodeType&&(null==(t=i?n.call(this,e,S(this).val()):n)?t="":"number"==typeof t?t+="":Array.isArray(t)&&(t=S.map(t,function(e){return null==e?"":e+""})),(r=S.valHooks[this.type]||S.valHooks[this.nodeName.toLowerCase()])&&"set"in r&&void 0!==r.set(this,t,"value")||(this.value=t));})):t?(r=S.valHooks[t.type]||S.valHooks[t.nodeName.toLowerCase()])&&"get"in r&&void 0!==(e=r.get(t,"value"))?e:"string"==typeof(e=t.value)?e.replace(xt,""):null==e?"":e:void 0}}),S.extend({valHooks:{option:{get:function(e){var t=S.find.attr(e,"value");return null!=t?t:vt(S.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!A(n.parentNode,"optgroup"))){if(t=S(n).val(),a)return t;s.push(t);}return s},set:function(e,t){var n,r,i=e.options,o=S.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=-1<S.inArray(S.valHooks.option.get(r),o))&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),S.each(["radio","checkbox"],function(){S.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=-1<S.inArray(S(e).val(),t)}},y.checkOn||(S.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value});}),y.focusin="onfocusin"in C;var bt=/^(?:focusinfocus|focusoutblur)$/,wt=function(e){e.stopPropagation();};S.extend(S.event,{trigger:function(e,t,n,r){var i,o,a,s,u,l,c,f,p=[n||E],d=v.call(e,"type")?e.type:e,h=v.call(e,"namespace")?e.namespace.split("."):[];if(o=f=a=n=n||E,3!==n.nodeType&&8!==n.nodeType&&!bt.test(d+S.event.triggered)&&(-1<d.indexOf(".")&&(d=(h=d.split(".")).shift(),h.sort()),u=d.indexOf(":")<0&&"on"+d,(e=e[S.expando]?e:new S.Event(d,"object"==typeof e&&e)).isTrigger=r?2:3,e.namespace=h.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=n),t=null==t?[e]:S.makeArray(t,[e]),c=S.event.special[d]||{},r||!c.trigger||!1!==c.trigger.apply(n,t))){if(!r&&!c.noBubble&&!x(n)){for(s=c.delegateType||d,bt.test(s+d)||(o=o.parentNode);o;o=o.parentNode)p.push(o),a=o;a===(n.ownerDocument||E)&&p.push(a.defaultView||a.parentWindow||C);}i=0;while((o=p[i++])&&!e.isPropagationStopped())f=o,e.type=1<i?s:c.bindType||d,(l=(Y.get(o,"events")||Object.create(null))[e.type]&&Y.get(o,"handle"))&&l.apply(o,t),(l=u&&o[u])&&l.apply&&V(o)&&(e.result=l.apply(o,t),!1===e.result&&e.preventDefault());return e.type=d,r||e.isDefaultPrevented()||c._default&&!1!==c._default.apply(p.pop(),t)||!V(n)||u&&m(n[d])&&!x(n)&&((a=n[u])&&(n[u]=null),S.event.triggered=d,e.isPropagationStopped()&&f.addEventListener(d,wt),n[d](),e.isPropagationStopped()&&f.removeEventListener(d,wt),S.event.triggered=void 0,a&&(n[u]=a)),e.result}},simulate:function(e,t,n){var r=S.extend(new S.Event,n,{type:e,isSimulated:!0});S.event.trigger(r,null,t);}}),S.fn.extend({trigger:function(e,t){return this.each(function(){S.event.trigger(e,t,this);})},triggerHandler:function(e,t){var n=this[0];if(n)return S.event.trigger(e,t,n,!0)}}),y.focusin||S.each({focus:"focusin",blur:"focusout"},function(n,r){var i=function(e){S.event.simulate(r,e.target,S.event.fix(e));};S.event.special[r]={setup:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r);t||e.addEventListener(n,i,!0),Y.access(e,r,(t||0)+1);},teardown:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r)-1;t?Y.access(e,r,t):(e.removeEventListener(n,i,!0),Y.remove(e,r));}};});var Tt=C.location,Ct={guid:Date.now()},Et=/\?/;S.parseXML=function(e){var t;if(!e||"string"!=typeof e)return null;try{t=(new C.DOMParser).parseFromString(e,"text/xml");}catch(e){t=void 0;}return t&&!t.getElementsByTagName("parsererror").length||S.error("Invalid XML: "+e),t};var St=/\[\]$/,kt=/\r?\n/g,At=/^(?:submit|button|image|reset|file)$/i,Nt=/^(?:input|select|textarea|keygen)/i;function Dt(n,e,r,i){var t;if(Array.isArray(e))S.each(e,function(e,t){r||St.test(n)?i(n,t):Dt(n+"["+("object"==typeof t&&null!=t?e:"")+"]",t,r,i);});else if(r||"object"!==w(e))i(n,e);else for(t in e)Dt(n+"["+t+"]",e[t],r,i);}S.param=function(e,t){var n,r=[],i=function(e,t){var n=m(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n);};if(null==e)return "";if(Array.isArray(e)||e.jquery&&!S.isPlainObject(e))S.each(e,function(){i(this.name,this.value);});else for(n in e)Dt(n,e[n],t,i);return r.join("&")},S.fn.extend({serialize:function(){return S.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=S.prop(this,"elements");return e?S.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!S(this).is(":disabled")&&Nt.test(this.nodeName)&&!At.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=S(this).val();return null==n?null:Array.isArray(n)?S.map(n,function(e){return {name:t.name,value:e.replace(kt,"\r\n")}}):{name:t.name,value:n.replace(kt,"\r\n")}}).get()}});var jt=/%20/g,qt=/#.*$/,Lt=/([?&])_=[^&]*/,Ht=/^(.*?):[ \t]*([^\r\n]*)$/gm,Ot=/^(?:GET|HEAD)$/,Pt=/^\/\//,Rt={},Mt={},It="*/".concat("*"),Wt=E.createElement("a");function Ft(o){return function(e,t){"string"!=typeof e&&(t=e,e="*");var n,r=0,i=e.toLowerCase().match(P)||[];if(m(t))while(n=i[r++])"+"===n[0]?(n=n.slice(1)||"*",(o[n]=o[n]||[]).unshift(t)):(o[n]=o[n]||[]).push(t);}}function Bt(t,i,o,a){var s={},u=t===Mt;function l(e){var r;return s[e]=!0,S.each(t[e]||[],function(e,t){var n=t(i,o,a);return "string"!=typeof n||u||s[n]?u?!(r=n):void 0:(i.dataTypes.unshift(n),l(n),!1)}),r}return l(i.dataTypes[0])||!s["*"]&&l("*")}function $t(e,t){var n,r,i=S.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&S.extend(!0,e,r),e}Wt.href=Tt.href,S.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Tt.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Tt.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":It,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":S.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?$t($t(e,S.ajaxSettings),t):$t(S.ajaxSettings,e)},ajaxPrefilter:Ft(Rt),ajaxTransport:Ft(Mt),ajax:function(e,t){"object"==typeof e&&(t=e,e=void 0),t=t||{};var c,f,p,n,d,r,h,g,i,o,v=S.ajaxSetup({},t),y=v.context||v,m=v.context&&(y.nodeType||y.jquery)?S(y):S.event,x=S.Deferred(),b=S.Callbacks("once memory"),w=v.statusCode||{},a={},s={},u="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(h){if(!n){n={};while(t=Ht.exec(p))n[t[1].toLowerCase()+" "]=(n[t[1].toLowerCase()+" "]||[]).concat(t[2]);}t=n[e.toLowerCase()+" "];}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return h?p:null},setRequestHeader:function(e,t){return null==h&&(e=s[e.toLowerCase()]=s[e.toLowerCase()]||e,a[e]=t),this},overrideMimeType:function(e){return null==h&&(v.mimeType=e),this},statusCode:function(e){var t;if(e)if(h)T.always(e[T.status]);else for(t in e)w[t]=[w[t],e[t]];return this},abort:function(e){var t=e||u;return c&&c.abort(t),l(0,t),this}};if(x.promise(T),v.url=((e||v.url||Tt.href)+"").replace(Pt,Tt.protocol+"//"),v.type=t.method||t.type||v.method||v.type,v.dataTypes=(v.dataType||"*").toLowerCase().match(P)||[""],null==v.crossDomain){r=E.createElement("a");try{r.href=v.url,r.href=r.href,v.crossDomain=Wt.protocol+"//"+Wt.host!=r.protocol+"//"+r.host;}catch(e){v.crossDomain=!0;}}if(v.data&&v.processData&&"string"!=typeof v.data&&(v.data=S.param(v.data,v.traditional)),Bt(Rt,v,t,T),h)return T;for(i in (g=S.event&&v.global)&&0==S.active++&&S.event.trigger("ajaxStart"),v.type=v.type.toUpperCase(),v.hasContent=!Ot.test(v.type),f=v.url.replace(qt,""),v.hasContent?v.data&&v.processData&&0===(v.contentType||"").indexOf("application/x-www-form-urlencoded")&&(v.data=v.data.replace(jt,"+")):(o=v.url.slice(f.length),v.data&&(v.processData||"string"==typeof v.data)&&(f+=(Et.test(f)?"&":"?")+v.data,delete v.data),!1===v.cache&&(f=f.replace(Lt,"$1"),o=(Et.test(f)?"&":"?")+"_="+Ct.guid+++o),v.url=f+o),v.ifModified&&(S.lastModified[f]&&T.setRequestHeader("If-Modified-Since",S.lastModified[f]),S.etag[f]&&T.setRequestHeader("If-None-Match",S.etag[f])),(v.data&&v.hasContent&&!1!==v.contentType||t.contentType)&&T.setRequestHeader("Content-Type",v.contentType),T.setRequestHeader("Accept",v.dataTypes[0]&&v.accepts[v.dataTypes[0]]?v.accepts[v.dataTypes[0]]+("*"!==v.dataTypes[0]?", "+It+"; q=0.01":""):v.accepts["*"]),v.headers)T.setRequestHeader(i,v.headers[i]);if(v.beforeSend&&(!1===v.beforeSend.call(y,T,v)||h))return T.abort();if(u="abort",b.add(v.complete),T.done(v.success),T.fail(v.error),c=Bt(Mt,v,t,T)){if(T.readyState=1,g&&m.trigger("ajaxSend",[T,v]),h)return T;v.async&&0<v.timeout&&(d=C.setTimeout(function(){T.abort("timeout");},v.timeout));try{h=!1,c.send(a,l);}catch(e){if(h)throw e;l(-1,e);}}else l(-1,"No Transport");function l(e,t,n,r){var i,o,a,s,u,l=t;h||(h=!0,d&&C.clearTimeout(d),c=void 0,p=r||"",T.readyState=0<e?4:0,i=200<=e&&e<300||304===e,n&&(s=function(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else {for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i);}o=o||a;}if(o)return o!==u[0]&&u.unshift(o),n[o]}(v,T,n)),!i&&-1<S.inArray("script",v.dataTypes)&&(v.converters["text script"]=function(){}),s=function(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t);}catch(e){return {state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return {state:"success",data:t}}(v,s,T,i),i?(v.ifModified&&((u=T.getResponseHeader("Last-Modified"))&&(S.lastModified[f]=u),(u=T.getResponseHeader("etag"))&&(S.etag[f]=u)),204===e||"HEAD"===v.type?l="nocontent":304===e?l="notmodified":(l=s.state,o=s.data,i=!(a=s.error))):(a=l,!e&&l||(l="error",e<0&&(e=0))),T.status=e,T.statusText=(t||l)+"",i?x.resolveWith(y,[o,l,T]):x.rejectWith(y,[T,l,a]),T.statusCode(w),w=void 0,g&&m.trigger(i?"ajaxSuccess":"ajaxError",[T,v,i?o:a]),b.fireWith(y,[T,l]),g&&(m.trigger("ajaxComplete",[T,v]),--S.active||S.event.trigger("ajaxStop")));}return T},getJSON:function(e,t,n){return S.get(e,t,n,"json")},getScript:function(e,t){return S.get(e,void 0,t,"script")}}),S.each(["get","post"],function(e,i){S[i]=function(e,t,n,r){return m(t)&&(r=r||n,n=t,t=void 0),S.ajax(S.extend({url:e,type:i,dataType:r,data:t,success:n},S.isPlainObject(e)&&e))};}),S.ajaxPrefilter(function(e){var t;for(t in e.headers)"content-type"===t.toLowerCase()&&(e.contentType=e.headers[t]||"");}),S._evalUrl=function(e,t,n){return S.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){S.globalEval(e,t,n);}})},S.fn.extend({wrapAll:function(e){var t;return this[0]&&(m(e)&&(e=e.call(this[0])),t=S(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(n){return m(n)?this.each(function(e){S(this).wrapInner(n.call(this,e));}):this.each(function(){var e=S(this),t=e.contents();t.length?t.wrapAll(n):e.append(n);})},wrap:function(t){var n=m(t);return this.each(function(e){S(this).wrapAll(n?t.call(this,e):t);})},unwrap:function(e){return this.parent(e).not("body").each(function(){S(this).replaceWith(this.childNodes);}),this}}),S.expr.pseudos.hidden=function(e){return !S.expr.pseudos.visible(e)},S.expr.pseudos.visible=function(e){return !!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},S.ajaxSettings.xhr=function(){try{return new C.XMLHttpRequest}catch(e){}};var _t={0:200,1223:204},zt=S.ajaxSettings.xhr();y.cors=!!zt&&"withCredentials"in zt,y.ajax=zt=!!zt,S.ajaxTransport(function(i){var o,a;if(y.cors||zt&&!i.crossDomain)return {send:function(e,t){var n,r=i.xhr();if(r.open(i.type,i.url,i.async,i.username,i.password),i.xhrFields)for(n in i.xhrFields)r[n]=i.xhrFields[n];for(n in i.mimeType&&r.overrideMimeType&&r.overrideMimeType(i.mimeType),i.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest"),e)r.setRequestHeader(n,e[n]);o=function(e){return function(){o&&(o=a=r.onload=r.onerror=r.onabort=r.ontimeout=r.onreadystatechange=null,"abort"===e?r.abort():"error"===e?"number"!=typeof r.status?t(0,"error"):t(r.status,r.statusText):t(_t[r.status]||r.status,r.statusText,"text"!==(r.responseType||"text")||"string"!=typeof r.responseText?{binary:r.response}:{text:r.responseText},r.getAllResponseHeaders()));}},r.onload=o(),a=r.onerror=r.ontimeout=o("error"),void 0!==r.onabort?r.onabort=a:r.onreadystatechange=function(){4===r.readyState&&C.setTimeout(function(){o&&a();});},o=o("abort");try{r.send(i.hasContent&&i.data||null);}catch(e){if(o)throw e}},abort:function(){o&&o();}}}),S.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1);}),S.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return S.globalEval(e),e}}}),S.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET");}),S.ajaxTransport("script",function(n){var r,i;if(n.crossDomain||n.scriptAttrs)return {send:function(e,t){r=S("<script>").attr(n.scriptAttrs||{}).prop({charset:n.scriptCharset,src:n.url}).on("load error",i=function(e){r.remove(),i=null,e&&t("error"===e.type?404:200,e.type);}),E.head.appendChild(r[0]);},abort:function(){i&&i();}}});var Ut,Xt=[],Vt=/(=)\?(?=&|$)|\?\?/;S.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Xt.pop()||S.expando+"_"+Ct.guid++;return this[e]=!0,e}}),S.ajaxPrefilter("json jsonp",function(e,t,n){var r,i,o,a=!1!==e.jsonp&&(Vt.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Vt.test(e.data)&&"data");if(a||"jsonp"===e.dataTypes[0])return r=e.jsonpCallback=m(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,a?e[a]=e[a].replace(Vt,"$1"+r):!1!==e.jsonp&&(e.url+=(Et.test(e.url)?"&":"?")+e.jsonp+"="+r),e.converters["script json"]=function(){return o||S.error(r+" was not called"),o[0]},e.dataTypes[0]="json",i=C[r],C[r]=function(){o=arguments;},n.always(function(){void 0===i?S(C).removeProp(r):C[r]=i,e[r]&&(e.jsonpCallback=t.jsonpCallback,Xt.push(r)),o&&m(i)&&i(o[0]),o=i=void 0;}),"script"}),y.createHTMLDocument=((Ut=E.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===Ut.childNodes.length),S.parseHTML=function(e,t,n){return "string"!=typeof e?[]:("boolean"==typeof t&&(n=t,t=!1),t||(y.createHTMLDocument?((r=(t=E.implementation.createHTMLDocument("")).createElement("base")).href=E.location.href,t.head.appendChild(r)):t=E),o=!n&&[],(i=N.exec(e))?[t.createElement(i[1])]:(i=xe([e],t,o),o&&o.length&&S(o).remove(),S.merge([],i.childNodes)));var r,i,o;},S.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return -1<s&&(r=vt(e.slice(s)),e=e.slice(0,s)),m(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),0<a.length&&S.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?S("<div>").append(S.parseHTML(e)).find(r):e);}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e]);});}),this},S.expr.pseudos.animated=function(t){return S.grep(S.timers,function(e){return t===e.elem}).length},S.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l=S.css(e,"position"),c=S(e),f={};"static"===l&&(e.style.position="relative"),s=c.offset(),o=S.css(e,"top"),u=S.css(e,"left"),("absolute"===l||"fixed"===l)&&-1<(o+u).indexOf("auto")?(a=(r=c.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),m(t)&&(t=t.call(e,n,S.extend({},s))),null!=t.top&&(f.top=t.top-s.top+a),null!=t.left&&(f.left=t.left-s.left+i),"using"in t?t.using.call(e,f):("number"==typeof f.top&&(f.top+="px"),"number"==typeof f.left&&(f.left+="px"),c.css(f));}},S.fn.extend({offset:function(t){if(arguments.length)return void 0===t?this:this.each(function(e){S.offset.setOffset(this,t,e);});var e,n,r=this[0];return r?r.getClientRects().length?(e=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:e.top+n.pageYOffset,left:e.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===S.css(r,"position"))t=r.getBoundingClientRect();else {t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===S.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=S(e).offset()).top+=S.css(e,"borderTopWidth",!0),i.left+=S.css(e,"borderLeftWidth",!0));}return {top:t.top-i.top-S.css(r,"marginTop",!0),left:t.left-i.left-S.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===S.css(e,"position"))e=e.offsetParent;return e||re})}}),S.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,i){var o="pageYOffset"===i;S.fn[t]=function(e){return $(this,function(e,t,n){var r;if(x(e)?r=e:9===e.nodeType&&(r=e.defaultView),void 0===n)return r?r[i]:e[t];r?r.scrollTo(o?r.pageXOffset:n,o?n:r.pageYOffset):e[t]=n;},t,e,arguments.length)};}),S.each(["top","left"],function(e,n){S.cssHooks[n]=$e(y.pixelPosition,function(e,t){if(t)return t=Be(e,n),Me.test(t)?S(e).position()[n]+"px":t});}),S.each({Height:"height",Width:"width"},function(a,s){S.each({padding:"inner"+a,content:s,"":"outer"+a},function(r,o){S.fn[o]=function(e,t){var n=arguments.length&&(r||"boolean"!=typeof e),i=r||(!0===e||!0===t?"margin":"border");return $(this,function(e,t,n){var r;return x(e)?0===o.indexOf("outer")?e["inner"+a]:e.document.documentElement["client"+a]:9===e.nodeType?(r=e.documentElement,Math.max(e.body["scroll"+a],r["scroll"+a],e.body["offset"+a],r["offset"+a],r["client"+a])):void 0===n?S.css(e,t,i):S.style(e,t,n,i)},s,n?e:void 0,n)};});}),S.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){S.fn[t]=function(e){return this.on(t,e)};}),S.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,n){S.fn[n]=function(e,t){return 0<arguments.length?this.on(n,null,e,t):this.trigger(n)};});var Gt=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;S.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),m(e))return r=s.call(arguments,2),(i=function(){return e.apply(t||this,r.concat(s.call(arguments)))}).guid=e.guid=e.guid||S.guid++,i},S.holdReady=function(e){e?S.readyWait++:S.ready(!0);},S.isArray=Array.isArray,S.parseJSON=JSON.parse,S.nodeName=A,S.isFunction=m,S.isWindow=x,S.camelCase=X,S.type=w,S.now=Date.now,S.isNumeric=function(e){var t=S.type(e);return ("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},S.trim=function(e){return null==e?"":(e+"").replace(Gt,"")},"function"==typeof define&&define.amd&&define("jquery",[],function(){return S});var Yt=C.jQuery,Qt=C.$;return S.noConflict=function(e){return C.$===S&&(C.$=Qt),e&&C.jQuery===S&&(C.jQuery=Yt),S},"undefined"==typeof e&&(C.jQuery=C.$=S),S});

const versionString = "Calla v0.5.8";

/* global JitsiMeetJS */

console.info(versionString);

class CallaClientEvent extends Event {
    constructor(command, id, value) {
        super(command);
        this.id = id;
        for (let key in value) {
            if (key !== "isTrusted"
                && !Object.prototype.hasOwnProperty.call(Event.prototype, key)) {
                this[key] = value[key];
            }
        }
    }
}

// helps us filter out data channel messages that don't belong to us
const eventNames = [
    "userMoved",
    "emote",
    "userInitRequest",
    "userInitResponse",
    "audioMuteStatusChanged",
    "videoMuteStatusChanged",
    "localAudioMuteStatusChanged",
    "localVideoMuteStatusChanged",
    "videoConferenceJoined",
    "videoConferenceLeft",
    "participantJoined",
    "participantLeft",
    "avatarChanged",
    "displayNameChange",
    "audioActivity",
    "setAvatarEmoji",
    "deviceListChanged",
    "participantRoleChanged",
    "audioAdded",
    "videoAdded",
    "audioRemoved",
    "videoRemoved",
    "audioChanged",
    "videoChanged"
];



/**
 * @typedef {object} JitsiTrack
 * @property {Function} getParticipantId
 * @property {Function} getType
 * @property {Function} isMuted
 * @property {Function} isLocal
 * @property {Function} addEventListener
 * @property {Function} dispose
 * @property {MediaStream} stream
 **/

/** @type {Map<string, Map<string, JitsiTrack>>} */
const userInputs = new Map();

const audioActivityEvt$2 = new AudioActivityEvent();

function logger(source, evtName) {
    if (window.location.hostname === "localhost") {
        const handler = (...rest) => {
            if (evtName === "conference.endpoint_message_received"
                && rest.length >= 2
                && (rest[1].type === "e2e-ping-request"
                    || rest[1].type === "e2e-ping-response"
                    || rest[1].type === "stats")) {
                return;
            }
            console.log(evtName, ...rest);
        };

        source.addEventListener(evtName, handler);
    }
}

function setLoggers(source, evtObj) {
    for (let evtName of Object.values(evtObj)) {
        if (evtName.indexOf("audioLevelsChanged") === -1) {
            logger(source, evtName);
        }
    }
}

// Manages communication between Jitsi Meet and Calla
class CallaClient extends EventBase {

    /**
     * @param {string} JITSI_HOST
     * @param {string} JVB_HOST
     * @param {string} JVB_MUC
     */
    constructor(JITSI_HOST, JVB_HOST, JVB_MUC) {
        super();

        this.host = JITSI_HOST;
        this.bridgeHost = JVB_HOST;
        this.bridgeMUC = JVB_MUC;

        this._prepTask = null;
        this.joined = false;
        this.connection = null;
        this.conference = null;
        this.audio = new AudioManager();
        this.audio.addEventListener("audioActivity", (evt) => {
            audioActivityEvt$2.id = evt.id;
            audioActivityEvt$2.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt$2);
        });

        this.hasAudioPermission = false;
        this.hasVideoPermission = false;

        /** @type {String} */
        this.localUser = null;

        this.preInitEvtQ = [];

        /** @type {String} */
        this.preferredAudioOutputID = null;

        /** @type {String} */
        this.preferredAudioInputID = null;

        /** @type {String} */
        this.preferredVideoInputID = null;

        this.addEventListener("participantJoined", (evt) => {
            this.userInitRequest(evt.id);
        });

        this.addEventListener("userInitRequest", (evt) => {
            const pose = this.audio.getLocalPose();
            const { p } = pose;
            this.userInitResponse(evt.id, {
                id: this.localUser,
                x: p.x,
                y: p.y,
                z: p.z
            });
        });

        this.addEventListener("userInitResponse", (evt) => {
            if (isNumber(evt.x)
                && isNumber(evt.y)
                && isNumber(evt.z)) {
                this.setUserPosition(evt.id, evt.x, evt.y, evt.z);
            }
        });

        this.addEventListener("userMoved", (evt) => {
            this.setUserPosition(evt.id, evt.x, evt.y, evt.z);
        });

        this.addEventListener("participantLeft", (evt) => {
            this.removeUser(evt.id);
        });

        const onAudioChange = (evt) => {
            const evt2 = Object.assign(new Event("audioChanged"), {
                id: evt.id,
                stream: evt.stream
            });
            this.dispatchEvent(evt2);
        };

        const onVideoChange = (evt) => {
            const evt2 = Object.assign(new Event("videoChanged"), {
                id: evt.id,
                stream: evt.stream
            });
            this.dispatchEvent(evt2);
        };

        this.addEventListener("audioAdded", onAudioChange);
        this.addEventListener("audioRemoved", onAudioChange);
        this.addEventListener("videoAdded", onVideoChange);
        this.addEventListener("videoRemoved", onVideoChange);

        this.addEventListener("audioMuteStatusChanged", (evt) => {
            if (evt.id === this.localUser) {
                const evt2 = Object.assign(new Event("localAudioMuteStatusChanged"), {
                    id: evt.id,
                    muted: evt.muted
                });
                this.dispatchEvent(evt2);
            }
        });

        this.addEventListener("videoMuteStatusChanged", (evt) => {
            if (evt.id === this.localUser) {
                const evt2 = Object.assign(new Event("localVideoMuteStatusChanged"), {
                    id: evt.id,
                    muted: evt.muted
                });
                this.dispatchEvent(evt2);
            }
        });

        const dispose = () => this.dispose();
        window.addEventListener("beforeunload", dispose);
        window.addEventListener("unload", dispose);
        window.addEventListener("pagehide", dispose);

        Object.seal(this);
    }

    get appFingerPrint() {
        return "Calla";
    }

    userIDs() {
        return Object.keys(this.conference.participants);
    }

    userExists(id) {
        return !!this.conference.participants[id];
    }

    users() {
        return Object.keys(this.conference.participants)
            .map(k => [k, this.conference.participants[k].getDisplayName()]);
    }

    update() {
        this.audio.update();
    }

    _prepareAsync() {
        if(!this._prepTask) {
            console.info("Connecting to:", this.host);
            this._prepTask = import(`https://${this.host}/libs/lib-jitsi-meet.min.js`);
        }
        return this._prepTask;
    }

    /**
     * @param {string} roomName
     * @param {string} userName
     */
    async join(roomName, userName) {
        await this.leaveAsync();

        await this._prepareAsync();

        roomName = roomName.toLocaleLowerCase();

        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
        JitsiMeetJS.init();

        this.connection = new JitsiMeetJS.JitsiConnection(null, null, {
            hosts: {
                domain: this.bridgeHost,
                muc: this.bridgeMUC
            },
            serviceUrl: `https://${this.host}/http-bind`,
            enableLipSync: true
        });

        const {
            CONNECTION_ESTABLISHED,
            CONNECTION_FAILED,
            CONNECTION_DISCONNECTED
        } = JitsiMeetJS.events.connection;

        setLoggers(this.connection, JitsiMeetJS.events.connection);

        const onConnect = (connectionID) => {
            this.conference = this.connection.initJitsiConference(roomName, {
                openBridgeChannel: true
            });

            const {
                TRACK_ADDED,
                TRACK_REMOVED,
                CONFERENCE_JOINED,
                CONFERENCE_LEFT,
                USER_JOINED,
                USER_LEFT,
                DISPLAY_NAME_CHANGED,
                ENDPOINT_MESSAGE_RECEIVED
            } = JitsiMeetJS.events.conference;

            setLoggers(this.conference, JitsiMeetJS.events.conference);

            this.conference.addEventListener(CONFERENCE_JOINED, async () => {
                const id = this.conference.myUserId();
                this.joined = true;
                this.setDisplayName(userName);
                this.dispatchEvent(Object.assign(
                    new Event("videoConferenceJoined"), {
                    id,
                    roomName,
                    displayName: userName,
                    pose: this.audio.pose
                }));
                await this.setPreferredDevicesAsync();
            });

            this.conference.addEventListener(CONFERENCE_LEFT, () => {
                this.dispatchEvent(Object.assign(
                    new Event("videoConferenceLeft"), {
                    roomName
                }));
                this.conference = null;
                this.joined = false;
            });

            const onTrackMuteChanged = (track, muted) => {
                const userID = track.getParticipantId() || this.localUser,
                    trackKind = track.getType(),
                    muteChangedEvtName = trackKind + "MuteStatusChanged",
                    evt = Object.assign(
                        new Event(muteChangedEvtName), {
                        id: userID,
                        muted
                    });

                this.dispatchEvent(evt);
            };

            const onTrackChanged = (track) => {
                onTrackMuteChanged(track, track.isMuted());
            };

            this.conference.addEventListener(USER_JOINED, (id, user) => {
                const evt = Object.assign(
                    new Event("participantJoined"), {
                    id,
                    displayName: user.getDisplayName(),
                    pose: this.audio.createUser(id)
                });
                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(USER_LEFT, (id) => {
                const evt = Object.assign(
                    new Event("participantLeft"), {
                    id
                });

                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(DISPLAY_NAME_CHANGED, (id, displayName) => {
                const evt = Object.assign(
                    new Event("displayNameChange"), {
                    id,
                    displayName
                });

                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(TRACK_ADDED, (track) => {
                const userID = track.getParticipantId() || this.localUser,
                    isLocal = track.isLocal(),
                    trackKind = track.getType(),
                    trackAddedEvt = Object.assign(new Event(trackKind + "Added"), {
                        id: userID,
                        stream: track.stream
                    });

                setLoggers(track, JitsiMeetJS.events.track);

                track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, onTrackChanged);

                if (!userInputs.has(userID)) {
                    userInputs.set(userID, new Map());
                }

                const inputs = userInputs.get(userID);
                if (inputs.has(trackKind)) {
                    inputs.get(trackKind).dispose();
                    inputs.delete(trackKind);
                }

                inputs.set(trackKind, track);

                if (trackKind === "audio" && !isLocal) {
                    this.audio.setSource(userID, track.stream);
                }

                this.dispatchEvent(trackAddedEvt);

                onTrackMuteChanged(track, false);
            });

            this.conference.addEventListener(TRACK_REMOVED, (track) => {

                const userID = track.getParticipantId() || this.localUser,
                    isLocal = track.isLocal(),
                    trackKind = track.getType(),
                    trackRemovedEvt = Object.assign(new Event(trackKind + "Removed"), {
                        id: userID,
                        stream: null
                    });

                if (userInputs.has(userID)) {
                    const inputs = userInputs.get(userID);
                    if (inputs.has(trackKind)) {
                        inputs.get(trackKind).dispose();
                        inputs.delete(trackKind);
                    }
                }

                if (trackKind === "audio" && !isLocal) {
                    this.audio.setSource(userID, null);
                }

                track.dispose();

                onTrackMuteChanged(track, true);
                this.dispatchEvent(trackRemovedEvt);
            });

            this.conference.addEventListener(ENDPOINT_MESSAGE_RECEIVED, (user, data) => {
                this.rxGameData({ user, data });
            });

            this.conference.join();
        };

        const onFailed = (evt) => {
            console.error("Connection failed", evt);
            onDisconnect();
        };

        const onDisconnect = () => {
            this.connection.removeEventListener(CONNECTION_ESTABLISHED, onConnect);
            this.connection.removeEventListener(CONNECTION_FAILED, onFailed);
            this.connection.removeEventListener(CONNECTION_DISCONNECTED, onDisconnect);
            this.connection = null;
        };

        this.connection.addEventListener(CONNECTION_ESTABLISHED, onConnect);
        this.connection.addEventListener(CONNECTION_FAILED, onFailed);
        this.connection.addEventListener(CONNECTION_DISCONNECTED, onDisconnect);

        setLoggers(JitsiMeetJS.mediaDevices, JitsiMeetJS.events.mediaDevices);

        this.connection.connect();
    }

    dispatchEvent(evt) {
        if (this.localUser !== null) {
            if (evt.id === null
                || evt.id === undefined
                || evt.id === "local") {
                evt.id = this.localUser;
            }

            super.dispatchEvent(evt);
            if (evt.type === "videoConferenceLeft") {
                this.localUser = null;
            }
        }
        else if (evt.type === "videoConferenceJoined") {
            this.localUser = evt.id;

            this.dispatchEvent(evt);
            for (evt of this.preInitEvtQ) {
                this.dispatchEvent(evt);
            }

            arrayClear(this.preInitEvtQ);
        }
        else {
            this.preInitEvtQ.push(evt);
        }
    }

    async setPreferredDevicesAsync() {
        await this.setPreferredAudioInputAsync(true);
        await this.setPreferredVideoInputAsync(false);
        await this.setPreferredAudioOutputAsync(true);
    }

    /**
     * @param {boolean} allowAny
     */
    async getPreferredAudioOutputAsync(allowAny) {
        const devices = await this.getAudioOutputDevicesAsync();
        const device = arrayScan(
            devices,
            (d) => d.deviceId === this.preferredAudioOutputID,
            (d) => d.deviceId === "communications",
            (d) => d.deviceId === "default",
            (d) => allowAny && d && d.deviceId);
        return device;
    }

    /**
     * @param {boolean} allowAny
     */
    async setPreferredAudioOutputAsync(allowAny) {
        const device = await this.getPreferredAudioOutputAsync(allowAny);
        if (device) {
            await this.setAudioOutputDeviceAsync(device);
        }
    }

    /**
     * @param {boolean} allowAny
     */
    async getPreferredAudioInputAsync(allowAny) {
        const devices = await this.getAudioInputDevicesAsync();
        const device = arrayScan(
            devices,
            (d) => d.deviceId === this.preferredAudioInputID,
            (d) => d.deviceId === "communications",
            (d) => d.deviceId === "default",
            (d) => allowAny && d && d.deviceId);
        return device;
    }

    /**
     * @param {boolean} allowAny
     */
    async setPreferredAudioInputAsync(allowAny) {
        const device = await this.getPreferredAudioInputAsync(allowAny);
        if (device) {
            await this.setAudioInputDeviceAsync(device);
        }
    }

    /**
     * @param {boolean} allowAny
     */
    async getPreferredVideoInputAsync(allowAny) {
        const devices = await this.getVideoInputDevicesAsync();
        const device = arrayScan(devices,
            (d) => d.deviceId === this.preferredVideoInputID,
            (d) => allowAny && d && /front/i.test(d.label),
            (d) => allowAny && d && d.deviceId);
        return device;
    }

    /**
     * @param {boolean} allowAny
     */
    async setPreferredVideoInputAsync(allowAny) {
        const device = await this.getPreferredVideoInputAsync(allowAny);
        if (device) {
            await this.setVideoInputDeviceAsync(device);
        }
    }

    dispose() {
        if (this.localUser && userInputs.has(this.localUser)) {
            const tracks = userInputs.get(this.localUser);
            for (const track of tracks.values()) {
                track.dispose();
            }
        }
    }

    /**
     * 
     * @param {string} userName
     */
    setDisplayName(userName) {
        this.conference.setDisplayName(userName);
    }

    async leaveAsync() {
        if (this.conference) {
            if (this.localUser !== null && userInputs.has(this.localUser)) {
                const inputs = userInputs.get(this.localUser);

                if (inputs.has("video")) {
                    const removeTrackTask = once(this, "videoRemoved");
                    this.conference.removeTrack(inputs.get("video"));
                    await removeTrackTask;
                }

                if (inputs.has("audio")) {
                    const removeTrackTask = once(this, "audioRemoved");
                    this.conference.removeTrack(inputs.get("audio"));
                    await removeTrackTask;
                }
            }

            await this.conference.leave();
            await this.connection.disconnect();
        }
    }

    async _getDevicesAsync() {
        await this._prepareAsync();
        const devices = await navigator.mediaDevices.enumerateDevices();
        for (let device of devices) {
            if (device.deviceId.length > 0) {
                this.hasAudioPermission |= device.kind === "audioinput" && device.label.length > 0;
                this.hasVideoPermission |= device.kind === "videoinput" && device.label.length > 0;
            }
        }

        return devices;
    }

    async getAvailableDevicesAsync() {
        let devices = await this._getDevicesAsync();

        for (let i = 0; i < 3 && !this.hasAudioPermission; ++i) {
            devices = null;
            try {
                const _ = await navigator.mediaDevices.getUserMedia({ audio: !this.hasAudioPermission, video: !this.hasVideoPermission });
            }
            catch (exp) {
                console.warn(exp);
            }

            devices = await this._getDevicesAsync();
        }

        return {
            audioOutput: canChangeAudioOutput ? devices.filter(d => d.kind === "audiooutput") : [],
            audioInput: devices.filter(d => d.kind === "audioinput"),
            videoInput: devices.filter(d => d.kind === "videoinput")
        };
    }

    async getAudioOutputDevicesAsync() {
        if (!canChangeAudioOutput) {
            return [];
        }
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.audioOutput || [];
    }

    async getAudioInputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.audioInput || [];
    }

    async getVideoInputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.videoInput || [];
    }

    /**
     * 
     * @param {MediaDeviceInfo} device
     */
    async setAudioOutputDeviceAsync(device) {
        if (!canChangeAudioOutput) {
            return;
        }
        this.preferredAudioOutputID = device && device.deviceId || null;
        await JitsiMeetJS.mediaDevices.setAudioOutputDevice(this.preferredAudioOutputID);
    }

    taskOf(evt) {
        return when(this, evt, (evt) => evt.id === this.localUser, 5000);
    }

    getCurrentMediaTrack(type) {
        if (this.localUser === null) {
            return null;
        }

        if (!userInputs.has(this.localUser)) {
            return null;
        }

        const inputs = userInputs.get(this.localUser);
        if (!inputs.has(type)) {
            return null;
        }

        return inputs.get(type);
    }

    /**
     *
     * @param {MediaDeviceInfo} device
     */
    async setAudioInputDeviceAsync(device) {
        this.preferredAudioInputID = device && device.deviceId || null;

        const cur = this.getCurrentMediaTrack("audio");
        if (cur) {
            const removeTask = this.taskOf("audioRemoved");
            this.conference.removeTrack(cur);
            await removeTask;
        }

        if (this.joined && this.preferredAudioInputID) {
            const addTask = this.taskOf("audioAdded");
            const tracks = await JitsiMeetJS.createLocalTracks({
                devices: ["audio"],
                micDeviceId: this.preferredAudioInputID
            });

            for (let track of tracks) {
                this.conference.addTrack(track);
            }

            await addTask;
        }
    }

    /**
     *
     * @param {MediaDeviceInfo} device
     */
    async setVideoInputDeviceAsync(device) {
        this.preferredVideoInputID = device && device.deviceId || null;

        const cur = this.getCurrentMediaTrack("video");
        if (cur) {
            const removeTask = this.taskOf("videoRemoved");
            this.conference.removeTrack(cur);
            await removeTask;
        }

        if (this.joined && this.preferredVideoInputID) {
            const addTask = this.taskOf("videoAdded");
            const tracks = await JitsiMeetJS.createLocalTracks({
                devices: ["video"],
                cameraDeviceId: this.preferredVideoInputID
            });

            for (let track of tracks) {
                this.conference.addTrack(track);
            }

            await addTask;
        }
    }

    async getCurrentAudioInputDeviceAsync() {
        const cur = this.getCurrentMediaTrack("audio"),
            devices = await this.getAudioInputDevicesAsync(),
            device = devices.filter((d) => cur !== null && d.deviceId === cur.deviceId);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    /**
     * @return {Promise.<MediaDeviceInfo>} */
    async getCurrentAudioOutputDeviceAsync() {
        if (!canChangeAudioOutput) {
            return null;
        }
        const deviceId = JitsiMeetJS.mediaDevices.getAudioOutputDevice(),
            devices = await this.getAudioOutputDevicesAsync(),
            device = devices.filter((d) => d.deviceId === deviceId);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    async getCurrentVideoInputDeviceAsync() {
        const cur = this.getCurrentMediaTrack("video"),
            devices = await this.getVideoInputDevicesAsync(),
            device = devices.filter((d) => cur !== null && d.deviceId === cur.deviceId);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    async toggleAudioMutedAsync() {
        const changeTask = this.taskOf("audioMuteStatusChanged");
        const cur = this.getCurrentMediaTrack("audio");
        if (cur) {
            const muted = cur.isMuted();
            if (muted) {
                await cur.unmute();
            }
            else {
                await cur.mute();
            }
        }
        else {
            await this.setPreferredAudioInputAsync(true);
        }

        const evt = await changeTask;
        return evt.muted;
    }

    async toggleVideoMutedAsync() {
        const changeTask = this.taskOf("videoMuteStatusChanged");
        const cur = this.getCurrentMediaTrack("video");
        if (cur) {
            await this.setVideoInputDeviceAsync(null);
        }
        else {
            await this.setPreferredVideoInputAsync(true);
        }

        const evt = await changeTask;
        return evt.muted;
    }

    isMediaMuted(type) {
        const cur = this.getCurrentMediaTrack(type);
        return cur === null
            || cur.isMuted();
    }

    get isAudioMuted() {
        return this.isMediaMuted("audio");
    }

    get isVideoMuted() {
        return this.isMediaMuted("video");
    }

    txGameData(toUserID, data) {
        this.conference.sendMessage(data, toUserID);
    }

    /// A listener to add to JitsiExternalAPI::endpointTextMessageReceived event
    /// to receive Calla messages from the Jitsi Meet data channel.
    rxGameData(evt) {
        if (evt.data.hax === this.appFingerPrint) {
            this.receiveMessageFrom(evt.user.getId(), evt.data.command, evt.data.value);
        }
    }

    /// Send a Calla message through the Jitsi Meet data channel.
    sendMessageTo(toUserID, command, value) {
        this.txGameData(toUserID, {
            hax: this.appFingerPrint,
            command,
            value
        });
    }

    receiveMessageFrom(fromUserID, command, value) {
        const evt = new CallaClientEvent(command, fromUserID, value);
        this.dispatchEvent(evt);
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     */
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        this.audio.setAudioProperties(minDistance, maxDistance, rolloff, transitionTime);
    }

    /**
     * Set the position of the listener.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     */
    setLocalPosition(x, y, z) {
        this.audio.setLocalPosition(x, y, z);
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "userMoved", { x, y, z });
        }
    }

    /**
     * Set the position of an audio source.
     * @param {string} id - the id of the user for which to set the position.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} z - the lateral component of the position.
     */
    setUserPosition(id, x, y, z) {
        this.audio.setUserPosition(id, x, y, z);
    }

    removeUser(id) {
        this.audio.removeUser(id);
    }

    /**
     *
     * @param {boolean} muted
     */
    async setAudioMutedAsync(muted) {
        let isMuted = this.isAudioMuted;
        if (muted !== isMuted) {
            isMuted = await this.toggleAudioMutedAsync();
        }
        return isMuted;
    }

    /**
     *
     * @param {boolean} muted
     */
    async setVideoMutedAsync(muted) {
        let isMuted = this.isVideoMuted;
        if (muted !== isMuted) {
            isMuted = await this.toggleVideoMutedAsync();
        }
        return isMuted;
    }

    /// Add a listener for Calla events that come through the Jitsi Meet data channel.
    /**
     * 
     * @param {string} evtName
     * @param {function} callback
     * @param {AddEventListenerOptions} opts
     */
    addEventListener(evtName, callback, opts) {
        if (eventNames.indexOf(evtName) === -1) {
            throw new Error(`Unsupported event type: ${evtName}`);
        }

        super.addEventListener(evtName, callback, opts);
    }

    /**
     * 
     * @param {string} toUserID
     */
    userInitRequest(toUserID) {
        this.sendMessageTo(toUserID, "userInitRequest");
    }

    /**
     * 
     * @param {string} toUserID
     */
    async userInitRequestAsync(toUserID) {
        return await until(this, "userInitResponse",
            () => this.userInitRequest(toUserID),
            (evt) => evt.id === toUserID
                && isGoodNumber(evt.x)
                && isGoodNumber(evt.y)
                && isGoodNumber(evt.z),
            1000);
    }

    /**
     * 
     * @param {string} toUserID
     * @param {User} fromUserState
     */
    userInitResponse(toUserID, fromUserState) {
        this.sendMessageTo(toUserID, "userInitResponse", fromUserState);
    }

    set avatarEmoji(emoji) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "setAvatarEmoji", emoji);
        }
    }

    set avatarURL(url) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "avatarChanged", { url });
        }
    }

    emote(emoji) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "emote", emoji);
        }
    }

    startAudio() {
        this.audio.start();
    }
}

/**
 * Unicode-standardized pictograms.
 **/
class Emoji {
    /**
     * Creates a new Unicode-standardized pictograms.
     * @param {string} value - a Unicode sequence.
     * @param {string} desc - an English text description of the pictogram.
     */
    constructor(value, desc) {
        this.value = value;
        this.desc = desc;
    }

    /**
     * Determines of the provided Emoji or EmojiGroup is a subset of
     * this emoji.
     * @param {(Emoji|EmojiGroup)} e
     */
    contains(e) {
        return this.value.indexOf(e.value) >= 0;
    }
}

/**
 * Shorthand for `new Emoji`, which saves significantly on bundle size.
 * @param {string} v - a Unicode sequence.
 * @param {string} d - an English text description of the pictogram.
 * @param {any} [o=null] - an optional set of properties to set on the Emoji object.
 */
function e(v, d, o = null) {
    return Object.assign(new Emoji(v, d), o);
}

class EmojiGroup extends Emoji {
    /**
     * Groupings of Unicode-standardized pictograms.
     * @param {string} value - a Unicode sequence.
     * @param {string} desc - an English text description of the pictogram.
     * @param {Emoji[]} rest - Emojis in this group.
     */
    constructor(value, desc, ...rest) {
        super(value, desc);
        /** @type {Emoji[]} */
        this.alts = rest;
        /** @type {string} */
        this.width = null;
    }

    /**
     * Selects a random emoji out of the collection.
     * @returns {(Emoji|EmojiGroup)}
     **/
    random() {
        const selection = arrayRandom(this.alts);
        if (selection instanceof EmojiGroup) {
            return selection.random();
        }
        else {
            return selection;
        }
    }

    /**
     *
     * @param {(Emoji|EmojiGroup)} e
     */
    contains(e) {
        return super.contains(e)
            || this.alts.reduce((a, b) => a || b.contains(e), false);
    }
}


/**
 * Shorthand for `new EmojiGroup`, which saves significantly on bundle size.
 * @param {string} v - a Unicode sequence.
 * @param {string} d - an English text description of the pictogram.
 * @param {...(Emoji|EmojiGroup)} r - the emoji that are contained in this group.
 * @returns {EmojiGroup}
 */
function g(v, d, ...r) {
    return new EmojiGroup(v, d, ...r);
}

/**
 * A shorthand for `new EmojiGroup` that allows for setting optional properties
 * on the EmojiGroup object.
 * @param {string} v - a Unicode sequence.
 * @param {string} d - an English text description of the pictogram.
 * @param {any} o - a set of properties to set on the Emoji object.
 * @param {...(Emoji|EmojiGroup)} r - the emoji that are contained in this group.
 * @returns {EmojiGroup}
 */
function gg(v, d, o, ...r) {
    return Object.assign(
        g(
            v,
            d,
            ...Object
                .values(o)
                .filter(v => v instanceof Emoji),
            ...r),
        o);
}

const textStyle = e("\u{FE0E}", "Variation Selector-15: text style");
const emojiStyle = e("\u{FE0F}", "Variation Selector-16: emoji style");
const zeroWidthJoiner = e("\u{200D}", "Zero Width Joiner");
const combiningEnclosingCircleBackslash = e("\u{20E3}", "Combining Enclosing Circle Backslash");
const combiningEnclosingKeycap = e("\u{20E3}", "Combining Enclosing Keycap");

const female = e("\u{2640}\u{FE0F}", "Female");
const male = e("\u{2642}\u{FE0F}", "Male");
const skinL = e("\u{1F3FB}", "Light Skin Tone");
const skinML = e("\u{1F3FC}", "Medium-Light Skin Tone");
const skinM = e("\u{1F3FD}", "Medium Skin Tone");
const skinMD = e("\u{1F3FE}", "Medium-Dark Skin Tone");
const skinD = e("\u{1F3FF}", "Dark Skin Tone");
const hairRed = e("\u{1F9B0}", "Red Hair");
const hairCurly = e("\u{1F9B1}", "Curly Hair");
const hairWhite = e("\u{1F9B3}", "White Hair");
const hairBald = e("\u{1F9B2}", "Bald");

function combo(a, b) {
    if (a instanceof Array) {
        return a.map(c => combo(c, b));
    }
    else if (a instanceof EmojiGroup) {
        const { value, desc } = combo(e(a.value, a.desc), b);
        return g(value, desc, ...combo(a.alts, b));
    }
    else if (b instanceof Array) {
        return b.map(c => combo(a, c));
    }
    else {
        return e(a.value + b.value, a.desc + ": " + b.desc);
    }
}

function join(a, b) {
    if (a instanceof Array) {
        return a.map(c => join(c, b));
    }
    else if (a instanceof EmojiGroup) {
        const { value, desc } = join(e(a.value, a.desc), b);
        return g(value, desc, ...join(a.alts, b));
    }
    else if (b instanceof Array) {
        return b.map(c => join(a, c));
    }
    else {
        return e(a.value + zeroWidthJoiner.value + b.value, a.desc + ": " + b.desc);
    }
}

/**
 * Check to see if a given Emoji walks on water.
 * @param {Emoji} e
 */
function isSurfer(e) {
    return surfers.contains(e)
        || rowers.contains(e)
        || swimmers.contains(e)
        || merpeople.contains(e);
}

function skin(v, d, ...rest) {
    const person = e(v, d),
        light = combo(person, skinL),
        mediumLight = combo(person, skinML),
        medium = combo(person, skinM),
        mediumDark = combo(person, skinMD),
        dark = combo(person, skinD);
    return gg(person.value, person.desc, {
        default: person,
        light,
        mediumLight,
        medium,
        mediumDark,
        dark
    }, ...rest);
}

function sex(person) {
    const man = join(person, male),
        woman = join(person, female);

    return gg(person.value, person.desc, {
        default: person,
        man,
        woman
    });
}

function skinAndSex(v, d) {
    return sex(skin(v, d));
}

function skinAndHair(v, d, ...rest) {
    const people = skin(v, d),
        red = join(people, hairRed),
        curly = join(people, hairCurly),
        white = join(people, hairWhite),
        bald = join(people, hairBald);
    return gg(people.value, people.desc, {
        default: people,
        red,
        curly,
        white,
        bald
    }, ...rest);
}

function sym(symbol, name) {
    const j = e(symbol.value, name),
        men = join(man.default, j),
        women = join(woman.default, j);
    return gg(symbol.value, symbol.desc, {
        symbol,
        men,
        women
    });
}

const frowners = skinAndSex("\u{1F64D}", "Frowning");
const pouters = skinAndSex("\u{1F64E}", "Pouting");
const gesturingNo = skinAndSex("\u{1F645}", "Gesturing NO");
const gesturingOK = skinAndSex("\u{1F646}", "Gesturing OK");
const tippingHand = skinAndSex("\u{1F481}", "Tipping Hand");
const raisingHand = skinAndSex("\u{1F64B}", "Raising Hand");
const bowing = skinAndSex("\u{1F647}", "Bowing");
const facePalming = skinAndSex("\u{1F926}", "Facepalming");
const shrugging = skinAndSex("\u{1F937}", "Shrugging");
const cantHear = skinAndSex("\u{1F9CF}", "Can't Hear");
const gettingMassage = skinAndSex("\u{1F486}", "Getting Massage");
const gettingHaircut = skinAndSex("\u{1F487}", "Getting Haircut");

const constructionWorkers = skinAndSex("\u{1F477}", "Construction Worker");
const guards = skinAndSex("\u{1F482}", "Guard");
const spies = skinAndSex("\u{1F575}", "Spy");
const police = skinAndSex("\u{1F46E}", "Police");
const wearingTurban = skinAndSex("\u{1F473}", "Wearing Turban");
const superheroes = skinAndSex("\u{1F9B8}", "Superhero");
const supervillains = skinAndSex("\u{1F9B9}", "Supervillain");
const mages = skinAndSex("\u{1F9D9}", "Mage");
const fairies = skinAndSex("\u{1F9DA}", "Fairy");
const vampires = skinAndSex("\u{1F9DB}", "Vampire");
const merpeople = skinAndSex("\u{1F9DC}", "Merperson");
const elves = skinAndSex("\u{1F9DD}", "Elf");
const walking = skinAndSex("\u{1F6B6}", "Walking");
const standing = skinAndSex("\u{1F9CD}", "Standing");
const kneeling = skinAndSex("\u{1F9CE}", "Kneeling");
const runners = skinAndSex("\u{1F3C3}", "Running");

const gestures = g(
    "Gestures", "Gestures",
    frowners,
    pouters,
    gesturingNo,
    gesturingOK,
    tippingHand,
    raisingHand,
    bowing,
    facePalming,
    shrugging,
    cantHear,
    gettingMassage,
    gettingHaircut);


const baby = skin("\u{1F476}", "Baby");
const child = skin("\u{1F9D2}", "Child");
const boy = skin("\u{1F466}", "Boy");
const girl = skin("\u{1F467}", "Girl");
const children = gg(child.value, child.desc, {
    default: child,
    male: boy,
    female: girl
});


const blondes = skinAndSex("\u{1F471}", "Blond Person");
const person = skin("\u{1F9D1}", "Person", blondes.default, wearingTurban.default);

const beardedMan = skin("\u{1F9D4}", "Bearded Man");
const manInSuitLevitating = e("\u{1F574}\u{FE0F}", "Man in Suit, Levitating");
const manWithChineseCap = skin("\u{1F472}", "Man With Chinese Cap");
const manInTuxedo = skin("\u{1F935}", "Man in Tuxedo");
const man = skinAndHair("\u{1F468}", "Man",
    blondes.man,
    beardedMan,
    manInSuitLevitating,
    manWithChineseCap,
    wearingTurban.man,
    manInTuxedo);

const pregnantWoman = skin("\u{1F930}", "Pregnant Woman");
const breastFeeding = skin("\u{1F931}", "Breast-Feeding");
const womanWithHeadscarf = skin("\u{1F9D5}", "Woman With Headscarf");
const brideWithVeil = skin("\u{1F470}", "Bride With Veil");
const woman = skinAndHair("\u{1F469}", "Woman",
    blondes.woman,
    pregnantWoman,
    breastFeeding,
    womanWithHeadscarf,
    wearingTurban.woman,
    brideWithVeil);
const adults = gg(
    person.value, "Adult", {
    default: person,
    male: man,
    female: woman
});

const olderPerson = skin("\u{1F9D3}", "Older Person");
const oldMan = skin("\u{1F474}", "Old Man");
const oldWoman = skin("\u{1F475}", "Old Woman");
const elderly = gg(
    olderPerson.value, olderPerson.desc, {
    default: olderPerson,
    male: oldMan,
    female: oldWoman
});

const medical = e("\u{2695}\u{FE0F}", "Medical");
const healthCareWorkers = sym(medical, "Health Care");

const graduationCap = e("\u{1F393}", "Graduation Cap");
const students = sym(graduationCap, "Student");

const school = e("\u{1F3EB}", "School");
const teachers = sym(school, "Teacher");

const balanceScale = e("\u{2696}\u{FE0F}", "Balance Scale");
const judges = sym(balanceScale, "Judge");

const sheafOfRice = e("\u{1F33E}", "Sheaf of Rice");
const farmers = sym(sheafOfRice, "Farmer");

const cooking = e("\u{1F373}", "Cooking");
const cooks = sym(cooking, "Cook");

const wrench = e("\u{1F527}", "Wrench");
const mechanics = sym(wrench, "Mechanic");

const factory = e("\u{1F3ED}", "Factory");
const factoryWorkers = sym(factory, "Factory Worker");

const briefcase = e("\u{1F4BC}", "Briefcase");
const officeWorkers = sym(briefcase, "Office Worker");

const fireEngine = e("\u{1F692}", "Fire Engine");
const fireFighters = sym(fireEngine, "Fire Fighter");

const rocket = e("\u{1F680}", "Rocket");
const astronauts = sym(rocket, "Astronaut");

const airplane = e("\u{2708}\u{FE0F}", "Airplane");
const pilots = sym(airplane, "Pilot");

const artistPalette = e("\u{1F3A8}", "Artist Palette");
const artists = sym(artistPalette, "Artist");

const microphone = e("\u{1F3A4}", "Microphone");
const singers = sym(microphone, "Singer");

const laptop = e("\u{1F4BB}", "Laptop");
const technologists = sym(laptop, "Technologist");

const microscope = e("\u{1F52C}", "Microscope");
const scientists = sym(microscope, "Scientist");

const crown = e("\u{1F451}", "Crown");
const prince = skin("\u{1F934}", "Prince");
const princess = skin("\u{1F478}", "Princess");
const royalty = gg(
    crown.value, crown.desc, {
    symbol: crown,
    male: prince,
    female: princess
});

const roles = gg(
    "Roles", "Depictions of people working", {
    healthCareWorkers,
    students,
    teachers,
    judges,
    farmers,
    cooks,
    mechanics,
    factoryWorkers,
    officeWorkers,
    scientists,
    technologists,
    singers,
    artists,
    pilots,
    astronauts,
    fireFighters,
    spies,
    guards,
    constructionWorkers,
    royalty
});

const cherub = skin("\u{1F47C}", "Cherub");
const santaClaus = skin("\u{1F385}", "Santa Claus");
const mrsClaus = skin("\u{1F936}", "Mrs. Claus");

const genies = sex(e("\u{1F9DE}", "Genie"));
const zombies = sex(e("\u{1F9DF}", "Zombie"));

const fantasy = gg(
    "Fantasy", "Depictions of fantasy characters", {
    cherub,
    santaClaus,
    mrsClaus,
    superheroes,
    supervillains,
    mages,
    fairies,
    vampires,
    merpeople,
    elves,
    genies,
    zombies
});

const whiteCane = e("\u{1F9AF}", "Probing Cane");
const withProbingCane = sym(whiteCane, "Probing");

const motorizedWheelchair = e("\u{1F9BC}", "Motorized Wheelchair");
const inMotorizedWheelchair = sym(motorizedWheelchair, "In Motorized Wheelchair");

const manualWheelchair = e("\u{1F9BD}", "Manual Wheelchair");
const inManualWheelchair = sym(manualWheelchair, "In Manual Wheelchair");


const manDancing = skin("\u{1F57A}", "Man Dancing");
const womanDancing = skin("\u{1F483}", "Woman Dancing");
const dancers = gg(
    manDancing.value, "Dancing", {
    male: manDancing,
    female: womanDancing
});

const jugglers = skinAndSex("\u{1F939}", "Juggler");

const climbers = skinAndSex("\u{1F9D7}", "Climber");
const fencer = e("\u{1F93A}", "Fencer");
const jockeys = skin("\u{1F3C7}", "Jockey");
const skier = e("\u{26F7}\u{FE0F}", "Skier");
const snowboarders = skin("\u{1F3C2}", "Snowboarder");
const golfers = skinAndSex("\u{1F3CC}\u{FE0F}", "Golfer");
const surfers = skinAndSex("\u{1F3C4}", "Surfing");
const rowers = skinAndSex("\u{1F6A3}", "Rowing Boat");
const swimmers = skinAndSex("\u{1F3CA}", "Swimming");
const basketballers = skinAndSex("\u{26F9}\u{FE0F}", "Basket Baller");
const weightLifters = skinAndSex("\u{1F3CB}\u{FE0F}", "Weight Lifter");
const bikers = skinAndSex("\u{1F6B4}", "Biker");
const mountainBikers = skinAndSex("\u{1F6B5}", "Mountain Biker");
const cartwheelers = skinAndSex("\u{1F938}", "Cartwheeler");
const wrestlers = sex(e("\u{1F93C}", "Wrestler"));
const waterPoloers = skinAndSex("\u{1F93D}", "Water Polo Player");
const handBallers = skinAndSex("\u{1F93E}", "Hand Baller");

const inMotion = gg(
    "In Motion", "Depictions of people in motion", {
    walking,
    standing,
    kneeling,
    withProbingCane,
    inMotorizedWheelchair,
    inManualWheelchair,
    dancers,
    jugglers,
    climbers,
    fencer,
    jockeys,
    skier,
    snowboarders,
    golfers,
    surfers,
    rowers,
    swimmers,
    runners,
    basketballers,
    weightLifters,
    bikers,
    mountainBikers,
    cartwheelers,
    wrestlers,
    waterPoloers,
    handBallers
});

const inLotusPosition = skinAndSex("\u{1F9D8}", "In Lotus Position");
const inBath = skin("\u{1F6C0}", "In Bath");
const inBed = skin("\u{1F6CC}", "In Bed");
const inSauna = skinAndSex("\u{1F9D6}", "In Sauna");
const resting = gg(
    "Resting", "Depictions of people at rest", {
    inLotusPosition,
    inBath,
    inBed,
    inSauna
});

const babies = g(baby.value, baby.desc, baby, cherub);
const people = gg(
    "People", "People", {
    babies,
    children,
    adults,
    elderly
});

const allPeople = gg(
    "All People", "All People", {
    people,
    gestures,
    inMotion,
    resting,
    roles,
    fantasy
});

const ogre = e("\u{1F479}", "Ogre");
const goblin = e("\u{1F47A}", "Goblin");
const ghost = e("\u{1F47B}", "Ghost");
const alien = e("\u{1F47D}", "Alien");
const alienMonster = e("\u{1F47E}", "Alien Monster");
const angryFaceWithHorns = e("\u{1F47F}", "Angry Face with Horns");
const skull = e("\u{1F480}", "Skull");
const pileOfPoo = e("\u{1F4A9}", "Pile of Poo");
const grinningFace = e("\u{1F600}", "Grinning Face");
const beamingFaceWithSmilingEyes = e("\u{1F601}", "Beaming Face with Smiling Eyes");
const faceWithTearsOfJoy = e("\u{1F602}", "Face with Tears of Joy");
const grinningFaceWithBigEyes = e("\u{1F603}", "Grinning Face with Big Eyes");
const grinningFaceWithSmilingEyes = e("\u{1F604}", "Grinning Face with Smiling Eyes");
const grinningFaceWithSweat = e("\u{1F605}", "Grinning Face with Sweat");
const grinningSquitingFace = e("\u{1F606}", "Grinning Squinting Face");
const smillingFaceWithHalo = e("\u{1F607}", "Smiling Face with Halo");
const smilingFaceWithHorns = e("\u{1F608}", "Smiling Face with Horns");
const winkingFace = e("\u{1F609}", "Winking Face");
const smilingFaceWithSmilingEyes = e("\u{1F60A}", "Smiling Face with Smiling Eyes");
const faceSavoringFood = e("\u{1F60B}", "Face Savoring Food");
const relievedFace = e("\u{1F60C}", "Relieved Face");
const smilingFaceWithHeartEyes = e("\u{1F60D}", "Smiling Face with Heart-Eyes");
const smilingFaceWithSunglasses = e("\u{1F60E}", "Smiling Face with Sunglasses");
const smirkingFace = e("\u{1F60F}", "Smirking Face");
const neutralFace = e("\u{1F610}", "Neutral Face");
const expressionlessFace = e("\u{1F611}", "Expressionless Face");
const unamusedFace = e("\u{1F612}", "Unamused Face");
const downcastFaceWithSweat = e("\u{1F613}", "Downcast Face with Sweat");
const pensiveFace = e("\u{1F614}", "Pensive Face");
const confusedFace = e("\u{1F615}", "Confused Face");
const confoundedFace = e("\u{1F616}", "Confounded Face");
const kissingFace = e("\u{1F617}", "Kissing Face");
const faceBlowingAKiss = e("\u{1F618}", "Face Blowing a Kiss");
const kissingFaceWithSmilingEyes = e("\u{1F619}", "Kissing Face with Smiling Eyes");
const kissingFaceWithClosedEyes = e("\u{1F61A}", "Kissing Face with Closed Eyes");
const faceWithTongue = e("\u{1F61B}", "Face with Tongue");
const winkingFaceWithTongue = e("\u{1F61C}", "Winking Face with Tongue");
const squintingFaceWithTongue = e("\u{1F61D}", "Squinting Face with Tongue");
const disappointedFace = e("\u{1F61E}", "Disappointed Face");
const worriedFace = e("\u{1F61F}", "Worried Face");
const angryFace = e("\u{1F620}", "Angry Face");
const poutingFace = e("\u{1F621}", "Pouting Face");
const cryingFace = e("\u{1F622}", "Crying Face");
const perseveringFace = e("\u{1F623}", "Persevering Face");
const faceWithSteamFromNose = e("\u{1F624}", "Face with Steam From Nose");
const sadButRelievedFace = e("\u{1F625}", "Sad but Relieved Face");
const frowningFaceWithOpenMouth = e("\u{1F626}", "Frowning Face with Open Mouth");
const anguishedFace = e("\u{1F627}", "Anguished Face");
const fearfulFace = e("\u{1F628}", "Fearful Face");
const wearyFace = e("\u{1F629}", "Weary Face");
const sleepyFace = e("\u{1F62A}", "Sleepy Face");
const tiredFace = e("\u{1F62B}", "Tired Face");
const grimacingFace = e("\u{1F62C}", "Grimacing Face");
const loudlyCryingFace = e("\u{1F62D}", "Loudly Crying Face");
const faceWithOpenMouth = e("\u{1F62E}", "Face with Open Mouth");
const hushedFace = e("\u{1F62F}", "Hushed Face");
const anxiousFaceWithSweat = e("\u{1F630}", "Anxious Face with Sweat");
const faceScreamingInFear = e("\u{1F631}", "Face Screaming in Fear");
const astonishedFace = e("\u{1F632}", "Astonished Face");
const flushedFace = e("\u{1F633}", "Flushed Face");
const sleepingFace = e("\u{1F634}", "Sleeping Face");
const dizzyFace = e("\u{1F635}", "Dizzy Face");
const faceWithoutMouth = e("\u{1F636}", "Face Without Mouth");
const faceWithMedicalMask = e("\u{1F637}", "Face with Medical Mask");
const grinningCatWithSmilingEyes = e("\u{1F638}", "Grinning Cat with Smiling Eyes");
const catWithTearsOfJoy = e("\u{1F639}", "Cat with Tears of Joy");
const grinningCat = e("\u{1F63A}", "Grinning Cat");
const smilingCatWithHeartEyes = e("\u{1F63B}", "Smiling Cat with Heart-Eyes");
const catWithWrySmile = e("\u{1F63C}", "Cat with Wry Smile");
const kissingCat = e("\u{1F63D}", "Kissing Cat");
const poutingCat = e("\u{1F63E}", "Pouting Cat");
const cryingCat = e("\u{1F63F}", "Crying Cat");
const wearyCat = e("\u{1F640}", "Weary Cat");
const slightlyFrowningFace = e("\u{1F641}", "Slightly Frowning Face");
const slightlySmilingFace = e("\u{1F642}", "Slightly Smiling Face");
const updisdeDownFace = e("\u{1F643}", "Upside-Down Face");
const faceWithRollingEyes = e("\u{1F644}", "Face with Rolling Eyes");
const seeNoEvilMonkey = e("\u{1F648}", "See-No-Evil Monkey");
const hearNoEvilMonkey = e("\u{1F649}", "Hear-No-Evil Monkey");
const speakNoEvilMonkey = e("\u{1F64A}", "Speak-No-Evil Monkey");
const zipperMouthFace = e("\u{1F910}", "Zipper-Mouth Face");
const moneyMouthFace = e("\u{1F911}", "Money-Mouth Face");
const faceWithThermometer = e("\u{1F912}", "Face with Thermometer");
const nerdFace = e("\u{1F913}", "Nerd Face");
const thinkingFace = e("\u{1F914}", "Thinking Face");
const faceWithHeadBandage = e("\u{1F915}", "Face with Head-Bandage");
const robot = e("\u{1F916}", "Robot");
const huggingFace = e("\u{1F917}", "Hugging Face");
const cowboyHatFace = e("\u{1F920}", "Cowboy Hat Face");
const clownFace = e("\u{1F921}", "Clown Face");
const nauseatedFace = e("\u{1F922}", "Nauseated Face");
const rollingOnTheFloorLaughing = e("\u{1F923}", "Rolling on the Floor Laughing");
const droolingFace = e("\u{1F924}", "Drooling Face");
const lyingFace = e("\u{1F925}", "Lying Face");
const sneezingFace = e("\u{1F927}", "Sneezing Face");
const faceWithRaisedEyebrow = e("\u{1F928}", "Face with Raised Eyebrow");
const starStruck = e("\u{1F929}", "Star-Struck");
const zanyFace = e("\u{1F92A}", "Zany Face");
const shushingFace = e("\u{1F92B}", "Shushing Face");
const faceWithSymbolsOnMouth = e("\u{1F92C}", "Face with Symbols on Mouth");
const faceWithHandOverMouth = e("\u{1F92D}", "Face with Hand Over Mouth");
const faceVomitting = e("\u{1F92E}", "Face Vomiting");
const explodingHead = e("\u{1F92F}", "Exploding Head");
const smilingFaceWithHearts = e("\u{1F970}", "Smiling Face with Hearts");
const yawningFace = e("\u{1F971}", "Yawning Face");
const smilingFaceWithTear = e("\u{1F972}", "Smiling Face with Tear");
const partyingFace = e("\u{1F973}", "Partying Face");
const woozyFace = e("\u{1F974}", "Woozy Face");
const hotFace = e("\u{1F975}", "Hot Face");
const coldFace = e("\u{1F976}", "Cold Face");
const disguisedFace = e("\u{1F978}", "Disguised Face");
const pleadingFace = e("\u{1F97A}", "Pleading Face");
const faceWithMonocle = e("\u{1F9D0}", "Face with Monocle");
const skullAndCrossbones = e("\u{2620}\u{FE0F}", "Skull and Crossbones");
const frowningFace = e("\u{2639}\u{FE0F}", "Frowning Face");
const fmilingFace = e("\u{263A}\u{FE0F}", "Smiling Face");
const speakingHead = e("\u{1F5E3}\u{FE0F}", "Speaking Head");
const bust = e("\u{1F464}", "Bust in Silhouette");
const faces = gg(
    "Faces", "Round emoji faces", {
    ogre,
    goblin,
    ghost,
    alien,
    alienMonster,
    angryFaceWithHorns,
    skull,
    pileOfPoo,
    grinningFace,
    beamingFaceWithSmilingEyes,
    faceWithTearsOfJoy,
    grinningFaceWithBigEyes,
    grinningFaceWithSmilingEyes,
    grinningFaceWithSweat,
    grinningSquitingFace,
    smillingFaceWithHalo,
    smilingFaceWithHorns,
    winkingFace,
    smilingFaceWithSmilingEyes,
    faceSavoringFood,
    relievedFace,
    smilingFaceWithHeartEyes,
    smilingFaceWithSunglasses,
    smirkingFace,
    neutralFace,
    expressionlessFace,
    unamusedFace,
    downcastFaceWithSweat,
    pensiveFace,
    confusedFace,
    confoundedFace,
    kissingFace,
    faceBlowingAKiss,
    kissingFaceWithSmilingEyes,
    kissingFaceWithClosedEyes,
    faceWithTongue,
    winkingFaceWithTongue,
    squintingFaceWithTongue,
    disappointedFace,
    worriedFace,
    angryFace,
    poutingFace,
    cryingFace,
    perseveringFace,
    faceWithSteamFromNose,
    sadButRelievedFace,
    frowningFaceWithOpenMouth,
    anguishedFace,
    fearfulFace,
    wearyFace,
    sleepyFace,
    tiredFace,
    grimacingFace,
    loudlyCryingFace,
    faceWithOpenMouth,
    hushedFace,
    anxiousFaceWithSweat,
    faceScreamingInFear,
    astonishedFace,
    flushedFace,
    sleepingFace,
    dizzyFace,
    faceWithoutMouth,
    faceWithMedicalMask,
    grinningCatWithSmilingEyes,
    catWithTearsOfJoy,
    grinningCat,
    smilingCatWithHeartEyes,
    catWithWrySmile,
    kissingCat,
    poutingCat,
    cryingCat,
    wearyCat,
    slightlyFrowningFace,
    slightlySmilingFace,
    updisdeDownFace,
    faceWithRollingEyes,
    seeNoEvilMonkey,
    hearNoEvilMonkey,
    speakNoEvilMonkey,
    zipperMouthFace,
    moneyMouthFace,
    faceWithThermometer,
    nerdFace,
    thinkingFace,
    faceWithHeadBandage,
    robot,
    huggingFace,
    cowboyHatFace,
    clownFace,
    nauseatedFace,
    rollingOnTheFloorLaughing,
    droolingFace,
    lyingFace,
    sneezingFace,
    faceWithRaisedEyebrow,
    starStruck,
    zanyFace,
    shushingFace,
    faceWithSymbolsOnMouth,
    faceWithHandOverMouth,
    faceVomitting,
    explodingHead,
    smilingFaceWithHearts,
    yawningFace,
    smilingFaceWithTear,
    partyingFace,
    woozyFace,
    hotFace,
    coldFace,
    disguisedFace,
    pleadingFace,
    faceWithMonocle,
    skullAndCrossbones,
    frowningFace,
    fmilingFace,
    speakingHead,
    bust,
});

const kissMark = e("\u{1F48B}", "Kiss Mark");
const loveLetter = e("\u{1F48C}", "Love Letter");
const beatingHeart = e("\u{1F493}", "Beating Heart");
const brokenHeart = e("\u{1F494}", "Broken Heart");
const twoHearts = e("\u{1F495}", "Two Hearts");
const sparklingHeart = e("\u{1F496}", "Sparkling Heart");
const growingHeart = e("\u{1F497}", "Growing Heart");
const heartWithArrow = e("\u{1F498}", "Heart with Arrow");
const blueHeart = e("\u{1F499}", "Blue Heart");
const greenHeart = e("\u{1F49A}", "Green Heart");
const yellowHeart = e("\u{1F49B}", "Yellow Heart");
const purpleHeart = e("\u{1F49C}", "Purple Heart");
const heartWithRibbon = e("\u{1F49D}", "Heart with Ribbon");
const revolvingHearts = e("\u{1F49E}", "Revolving Hearts");
const heartDecoration = e("\u{1F49F}", "Heart Decoration");
const blackHeart = e("\u{1F5A4}", "Black Heart");
const whiteHeart = e("\u{1F90D}", "White Heart");
const brownHeart = e("\u{1F90E}", "Brown Heart");
const orangeHeart = e("\u{1F9E1}", "Orange Heart");
const heartExclamation = e("\u{2763}\u{FE0F}", "Heart Exclamation");
const redHeart = e("\u{2764}\u{FE0F}", "Red Heart");
const love = gg(
    "Love", "Hearts and kisses", {
    kissMark,
    loveLetter,
    beatingHeart,
    brokenHeart,
    twoHearts,
    sparklingHeart,
    growingHeart,
    heartWithArrow,
    blueHeart,
    greenHeart,
    yellowHeart,
    purpleHeart,
    heartWithRibbon,
    revolvingHearts,
    heartDecoration,
    blackHeart,
    whiteHeart,
    brownHeart,
    orangeHeart,
    heartExclamation,
    redHeart,
});

const cartoon = g(
    "Cartoon", "Cartoon symbols",
    e("\u{1F4A2}", "Anger Symbol"),
    e("\u{1F4A3}", "Bomb"),
    e("\u{1F4A4}", "Zzz"),
    e("\u{1F4A5}", "Collision"),
    e("\u{1F4A6}", "Sweat Droplets"),
    e("\u{1F4A8}", "Dashing Away"),
    e("\u{1F4AB}", "Dizzy"),
    e("\u{1F4AC}", "Speech Balloon"),
    e("\u{1F4AD}", "Thought Balloon"),
    e("\u{1F4AF}", "Hundred Points"),
    e("\u{1F573}\u{FE0F}", "Hole"),
    e("\u{1F5E8}\u{FE0F}", "Left Speech Bubble"),
    e("\u{1F5EF}\u{FE0F}", "Right Anger Bubble"));

const hands = g(
    "Hands", "Hands pointing at things",
    e("\u{1F446}", "Backhand Index Pointing Up"),
    e("\u{1F447}", "Backhand Index Pointing Down"),
    e("\u{1F448}", "Backhand Index Pointing Left"),
    e("\u{1F449}", "Backhand Index Pointing Right"),
    e("\u{1F44A}", "Oncoming Fist"),
    e("\u{1F44B}", "Waving Hand"),
    e("\u{1F44C}", "OK Hand"),
    e("\u{1F44D}", "Thumbs Up"),
    e("\u{1F44E}", "Thumbs Down"),
    e("\u{1F44F}", "Clapping Hands"),
    e("\u{1F450}", "Open Hands"),
    e("\u{1F485}", "Nail Polish"),
    e("\u{1F590}\u{FE0F}", "Hand with Fingers Splayed"),
    e("\u{1F595}", "Middle Finger"),
    e("\u{1F596}", "Vulcan Salute"),
    e("\u{1F64C}", "Raising Hands"),
    e("\u{1F64F}", "Folded Hands"),
    e("\u{1F90C}", "Pinched Fingers"),
    e("\u{1F90F}", "Pinching Hand"),
    e("\u{1F918}", "Sign of the Horns"),
    e("\u{1F919}", "Call Me Hand"),
    e("\u{1F91A}", "Raised Back of Hand"),
    e("\u{1F91B}", "Left-Facing Fist"),
    e("\u{1F91C}", "Right-Facing Fist"),
    e("\u{1F91D}", "Handshake"),
    e("\u{1F91E}", "Crossed Fingers"),
    e("\u{1F91F}", "Love-You Gesture"),
    e("\u{1F932}", "Palms Up Together"),
    e("\u{261D}\u{FE0F}", "Index Pointing Up"),
    e("\u{270A}", "Raised Fist"),
    e("\u{270B}", "Raised Hand"),
    e("\u{270C}\u{FE0F}", "Victory Hand"),
    e("\u{270D}\u{FE0F}", "Writing Hand"));

const bodyParts = g(
    "Body Parts", "General body parts",
    e("\u{1F440}", "Eyes"),
    e("\u{1F441}\u{FE0F}", "Eye"),
    e("\u{1F441}\u{FE0F}\u{200D}\u{1F5E8}\u{FE0F}", "Eye in Speech Bubble"),
    e("\u{1F442}", "Ear"),
    e("\u{1F443}", "Nose"),
    e("\u{1F444}", "Mouth"),
    e("\u{1F445}", "Tongue"),
    e("\u{1F4AA}", "Flexed Biceps"),
    e("\u{1F933}", "Selfie"),
    e("\u{1F9B4}", "Bone"),
    e("\u{1F9B5}", "Leg"),
    e("\u{1F9B6}", "Foot"),
    e("\u{1F9B7}", "Tooth"),
    e("\u{1F9BB}", "Ear with Hearing Aid"),
    e("\u{1F9BE}", "Mechanical Arm"),
    e("\u{1F9BF}", "Mechanical Leg"),
    e("\u{1F9E0}", "Brain"),
    e("\u{1FAC0}", "Anatomical Heart"),
    e("\u{1FAC1}", "Lungs"));

const animals = g(
    "Animals", "Animals and insects",
    e("\u{1F400}", "Rat"),
    e("\u{1F401}", "Mouse"),
    e("\u{1F402}", "Ox"),
    e("\u{1F403}", "Water Buffalo"),
    e("\u{1F404}", "Cow"),
    e("\u{1F405}", "Tiger"),
    e("\u{1F406}", "Leopard"),
    e("\u{1F407}", "Rabbit"),
    e("\u{1F408}", "Cat"),
    e("\u{1F408}\u{200D}\u{2B1B}", "Black Cat"),
    e("\u{1F409}", "Dragon"),
    e("\u{1F40A}", "Crocodile"),
    e("\u{1F40B}", "Whale"),
    e("\u{1F40C}", "Snail"),
    e("\u{1F40D}", "Snake"),
    e("\u{1F40E}", "Horse"),
    e("\u{1F40F}", "Ram"),
    e("\u{1F410}", "Goat"),
    e("\u{1F411}", "Ewe"),
    e("\u{1F412}", "Monkey"),
    e("\u{1F413}", "Rooster"),
    e("\u{1F414}", "Chicken"),
    e("\u{1F415}", "Dog"),
    e("\u{1F415}\u{200D}\u{1F9BA}", "Service Dog"),
    e("\u{1F416}", "Pig"),
    e("\u{1F417}", "Boar"),
    e("\u{1F418}", "Elephant"),
    e("\u{1F419}", "Octopus"),
    e("\u{1F41A}", "Spiral Shell"),
    e("\u{1F41B}", "Bug"),
    e("\u{1F41C}", "Ant"),
    e("\u{1F41D}", "Honeybee"),
    e("\u{1F41E}", "Lady Beetle"),
    e("\u{1F41F}", "Fish"),
    e("\u{1F420}", "Tropical Fish"),
    e("\u{1F421}", "Blowfish"),
    e("\u{1F422}", "Turtle"),
    e("\u{1F423}", "Hatching Chick"),
    e("\u{1F424}", "Baby Chick"),
    e("\u{1F425}", "Front-Facing Baby Chick"),
    e("\u{1F426}", "Bird"),
    e("\u{1F427}", "Penguin"),
    e("\u{1F428}", "Koala"),
    e("\u{1F429}", "Poodle"),
    e("\u{1F42A}", "Camel"),
    e("\u{1F42B}", "Two-Hump Camel"),
    e("\u{1F42C}", "Dolphin"),
    e("\u{1F42D}", "Mouse Face"),
    e("\u{1F42E}", "Cow Face"),
    e("\u{1F42F}", "Tiger Face"),
    e("\u{1F430}", "Rabbit Face"),
    e("\u{1F431}", "Cat Face"),
    e("\u{1F432}", "Dragon Face"),
    e("\u{1F433}", "Spouting Whale"),
    e("\u{1F434}", "Horse Face"),
    e("\u{1F435}", "Monkey Face"),
    e("\u{1F436}", "Dog Face"),
    e("\u{1F437}", "Pig Face"),
    e("\u{1F438}", "Frog"),
    e("\u{1F439}", "Hamster"),
    e("\u{1F43A}", "Wolf"),
    e("\u{1F43B}", "Bear"),
    e("\u{1F43B}\u{200D}\u{2744}\u{FE0F}", "Polar Bear"),
    e("\u{1F43C}", "Panda"),
    e("\u{1F43D}", "Pig Nose"),
    e("\u{1F43E}", "Paw Prints"),
    e("\u{1F43F}\u{FE0F}", "Chipmunk"),
    e("\u{1F54A}\u{FE0F}", "Dove"),
    e("\u{1F577}\u{FE0F}", "Spider"),
    e("\u{1F578}\u{FE0F}", "Spider Web"),
    e("\u{1F981}", "Lion"),
    e("\u{1F982}", "Scorpion"),
    e("\u{1F983}", "Turkey"),
    e("\u{1F984}", "Unicorn"),
    e("\u{1F985}", "Eagle"),
    e("\u{1F986}", "Duck"),
    e("\u{1F987}", "Bat"),
    e("\u{1F988}", "Shark"),
    e("\u{1F989}", "Owl"),
    e("\u{1F98A}", "Fox"),
    e("\u{1F98B}", "Butterfly"),
    e("\u{1F98C}", "Deer"),
    e("\u{1F98D}", "Gorilla"),
    e("\u{1F98E}", "Lizard"),
    e("\u{1F98F}", "Rhinoceros"),
    e("\u{1F992}", "Giraffe"),
    e("\u{1F993}", "Zebra"),
    e("\u{1F994}", "Hedgehog"),
    e("\u{1F995}", "Sauropod"),
    e("\u{1F996}", "T-Rex"),
    e("\u{1F997}", "Cricket"),
    e("\u{1F998}", "Kangaroo"),
    e("\u{1F999}", "Llama"),
    e("\u{1F99A}", "Peacock"),
    e("\u{1F99B}", "Hippopotamus"),
    e("\u{1F99C}", "Parrot"),
    e("\u{1F99D}", "Raccoon"),
    e("\u{1F99F}", "Mosquito"),
    e("\u{1F9A0}", "Microbe"),
    e("\u{1F9A1}", "Badger"),
    e("\u{1F9A2}", "Swan"),
    e("\u{1F9A3}", "Mammoth"),
    e("\u{1F9A4}", "Dodo"),
    e("\u{1F9A5}", "Sloth"),
    e("\u{1F9A6}", "Otter"),
    e("\u{1F9A7}", "Orangutan"),
    e("\u{1F9A8}", "Skunk"),
    e("\u{1F9A9}", "Flamingo"),
    e("\u{1F9AB}", "Beaver"),
    e("\u{1F9AC}", "Bison"),
    e("\u{1F9AD}", "Seal"),
    e("\u{1F9AE}", "Guide Dog"),
    e("\u{1FAB0}", "Fly"),
    e("\u{1FAB1}", "Worm"),
    e("\u{1FAB2}", "Beetle"),
    e("\u{1FAB3}", "Cockroach"),
    e("\u{1FAB6}", "Feather"));

const whiteFlower = e("\u{1F4AE}", "White Flower");
const plants = g(
    "Plants", "Flowers, trees, and things",
    e("\u{1F331}", "Seedling"),
    e("\u{1F332}", "Evergreen Tree"),
    e("\u{1F333}", "Deciduous Tree"),
    e("\u{1F334}", "Palm Tree"),
    e("\u{1F335}", "Cactus"),
    e("\u{1F337}", "Tulip"),
    e("\u{1F338}", "Cherry Blossom"),
    e("\u{1F339}", "Rose"),
    e("\u{1F33A}", "Hibiscus"),
    e("\u{1F33B}", "Sunflower"),
    e("\u{1F33C}", "Blossom"),
    sheafOfRice,
    e("\u{1F33F}", "Herb"),
    e("\u{1F340}", "Four Leaf Clover"),
    e("\u{1F341}", "Maple Leaf"),
    e("\u{1F342}", "Fallen Leaf"),
    e("\u{1F343}", "Leaf Fluttering in Wind"),
    e("\u{1F3F5}\u{FE0F}", "Rosette"),
    e("\u{1F490}", "Bouquet"),
    whiteFlower,
    e("\u{1F940}", "Wilted Flower"),
    e("\u{1FAB4}", "Potted Plant"),
    e("\u{2618}\u{FE0F}", "Shamrock"));

const banana = e("\u{1F34C}", "Banana");
const food = g(
    "Food", "Food, drink, and utensils",
    e("\u{1F32D}", "Hot Dog"),
    e("\u{1F32E}", "Taco"),
    e("\u{1F32F}", "Burrito"),
    e("\u{1F330}", "Chestnut"),
    e("\u{1F336}\u{FE0F}", "Hot Pepper"),
    e("\u{1F33D}", "Ear of Corn"),
    e("\u{1F344}", "Mushroom"),
    e("\u{1F345}", "Tomato"),
    e("\u{1F346}", "Eggplant"),
    e("\u{1F347}", "Grapes"),
    e("\u{1F348}", "Melon"),
    e("\u{1F349}", "Watermelon"),
    e("\u{1F34A}", "Tangerine"),
    e("\u{1F34B}", "Lemon"),
    banana,
    e("\u{1F34D}", "Pineapple"),
    e("\u{1F34E}", "Red Apple"),
    e("\u{1F34F}", "Green Apple"),
    e("\u{1F350}", "Pear"),
    e("\u{1F351}", "Peach"),
    e("\u{1F352}", "Cherries"),
    e("\u{1F353}", "Strawberry"),
    e("\u{1F354}", "Hamburger"),
    e("\u{1F355}", "Pizza"),
    e("\u{1F356}", "Meat on Bone"),
    e("\u{1F357}", "Poultry Leg"),
    e("\u{1F358}", "Rice Cracker"),
    e("\u{1F359}", "Rice Ball"),
    e("\u{1F35A}", "Cooked Rice"),
    e("\u{1F35B}", "Curry Rice"),
    e("\u{1F35C}", "Steaming Bowl"),
    e("\u{1F35D}", "Spaghetti"),
    e("\u{1F35E}", "Bread"),
    e("\u{1F35F}", "French Fries"),
    e("\u{1F360}", "Roasted Sweet Potato"),
    e("\u{1F361}", "Dango"),
    e("\u{1F362}", "Oden"),
    e("\u{1F363}", "Sushi"),
    e("\u{1F364}", "Fried Shrimp"),
    e("\u{1F365}", "Fish Cake with Swirl"),
    e("\u{1F371}", "Bento Box"),
    e("\u{1F372}", "Pot of Food"),
    cooking,
    e("\u{1F37F}", "Popcorn"),
    e("\u{1F950}", "Croissant"),
    e("\u{1F951}", "Avocado"),
    e("\u{1F952}", "Cucumber"),
    e("\u{1F953}", "Bacon"),
    e("\u{1F954}", "Potato"),
    e("\u{1F955}", "Carrot"),
    e("\u{1F956}", "Baguette Bread"),
    e("\u{1F957}", "Green Salad"),
    e("\u{1F958}", "Shallow Pan of Food"),
    e("\u{1F959}", "Stuffed Flatbread"),
    e("\u{1F95A}", "Egg"),
    e("\u{1F95C}", "Peanuts"),
    e("\u{1F95D}", "Kiwi Fruit"),
    e("\u{1F95E}", "Pancakes"),
    e("\u{1F95F}", "Dumpling"),
    e("\u{1F960}", "Fortune Cookie"),
    e("\u{1F961}", "Takeout Box"),
    e("\u{1F963}", "Bowl with Spoon"),
    e("\u{1F965}", "Coconut"),
    e("\u{1F966}", "Broccoli"),
    e("\u{1F968}", "Pretzel"),
    e("\u{1F969}", "Cut of Meat"),
    e("\u{1F96A}", "Sandwich"),
    e("\u{1F96B}", "Canned Food"),
    e("\u{1F96C}", "Leafy Green"),
    e("\u{1F96D}", "Mango"),
    e("\u{1F96E}", "Moon Cake"),
    e("\u{1F96F}", "Bagel"),
    e("\u{1F980}", "Crab"),
    e("\u{1F990}", "Shrimp"),
    e("\u{1F991}", "Squid"),
    e("\u{1F99E}", "Lobster"),
    e("\u{1F9AA}", "Oyster"),
    e("\u{1F9C0}", "Cheese Wedge"),
    e("\u{1F9C2}", "Salt"),
    e("\u{1F9C4}", "Garlic"),
    e("\u{1F9C5}", "Onion"),
    e("\u{1F9C6}", "Falafel"),
    e("\u{1F9C7}", "Waffle"),
    e("\u{1F9C8}", "Butter"),
    e("\u{1FAD0}", "Blueberries"),
    e("\u{1FAD1}", "Bell Pepper"),
    e("\u{1FAD2}", "Olive"),
    e("\u{1FAD3}", "Flatbread"),
    e("\u{1FAD4}", "Tamale"),
    e("\u{1FAD5}", "Fondue"),
    e("\u{1F366}", "Soft Ice Cream"),
    e("\u{1F367}", "Shaved Ice"),
    e("\u{1F368}", "Ice Cream"),
    e("\u{1F369}", "Doughnut"),
    e("\u{1F36A}", "Cookie"),
    e("\u{1F36B}", "Chocolate Bar"),
    e("\u{1F36C}", "Candy"),
    e("\u{1F36D}", "Lollipop"),
    e("\u{1F36E}", "Custard"),
    e("\u{1F36F}", "Honey Pot"),
    e("\u{1F370}", "Shortcake"),
    e("\u{1F382}", "Birthday Cake"),
    e("\u{1F967}", "Pie"),
    e("\u{1F9C1}", "Cupcake"),
    e("\u{1F375}", "Teacup Without Handle"),
    e("\u{1F376}", "Sake"),
    e("\u{1F377}", "Wine Glass"),
    e("\u{1F378}", "Cocktail Glass"),
    e("\u{1F379}", "Tropical Drink"),
    e("\u{1F37A}", "Beer Mug"),
    e("\u{1F37B}", "Clinking Beer Mugs"),
    e("\u{1F37C}", "Baby Bottle"),
    e("\u{1F37E}", "Bottle with Popping Cork"),
    e("\u{1F942}", "Clinking Glasses"),
    e("\u{1F943}", "Tumbler Glass"),
    e("\u{1F95B}", "Glass of Milk"),
    e("\u{1F964}", "Cup with Straw"),
    e("\u{1F9C3}", "Beverage Box"),
    e("\u{1F9C9}", "Mate"),
    e("\u{1F9CA}", "Ice"),
    e("\u{1F9CB}", "Bubble Tea"),
    e("\u{1FAD6}", "Teapot"),
    e("\u{2615}", "Hot Beverage"),
    e("\u{1F374}", "Fork and Knife"),
    e("\u{1F37D}\u{FE0F}", "Fork and Knife with Plate"),
    e("\u{1F3FA}", "Amphora"),
    e("\u{1F52A}", "Kitchen Knife"),
    e("\u{1F944}", "Spoon"),
    e("\u{1F962}", "Chopsticks"));

const nations = g(
    "National Flags", "Flags of countries from around the world",
    e("\u{1F1E6}\u{1F1E8}", "Flag: Ascension Island"),
    e("\u{1F1E6}\u{1F1E9}", "Flag: Andorra"),
    e("\u{1F1E6}\u{1F1EA}", "Flag: United Arab Emirates"),
    e("\u{1F1E6}\u{1F1EB}", "Flag: Afghanistan"),
    e("\u{1F1E6}\u{1F1EC}", "Flag: Antigua & Barbuda"),
    e("\u{1F1E6}\u{1F1EE}", "Flag: Anguilla"),
    e("\u{1F1E6}\u{1F1F1}", "Flag: Albania"),
    e("\u{1F1E6}\u{1F1F2}", "Flag: Armenia"),
    e("\u{1F1E6}\u{1F1F4}", "Flag: Angola"),
    e("\u{1F1E6}\u{1F1F6}", "Flag: Antarctica"),
    e("\u{1F1E6}\u{1F1F7}", "Flag: Argentina"),
    e("\u{1F1E6}\u{1F1F8}", "Flag: American Samoa"),
    e("\u{1F1E6}\u{1F1F9}", "Flag: Austria"),
    e("\u{1F1E6}\u{1F1FA}", "Flag: Australia"),
    e("\u{1F1E6}\u{1F1FC}", "Flag: Aruba"),
    e("\u{1F1E6}\u{1F1FD}", "Flag: Åland Islands"),
    e("\u{1F1E6}\u{1F1FF}", "Flag: Azerbaijan"),
    e("\u{1F1E7}\u{1F1E6}", "Flag: Bosnia & Herzegovina"),
    e("\u{1F1E7}\u{1F1E7}", "Flag: Barbados"),
    e("\u{1F1E7}\u{1F1E9}", "Flag: Bangladesh"),
    e("\u{1F1E7}\u{1F1EA}", "Flag: Belgium"),
    e("\u{1F1E7}\u{1F1EB}", "Flag: Burkina Faso"),
    e("\u{1F1E7}\u{1F1EC}", "Flag: Bulgaria"),
    e("\u{1F1E7}\u{1F1ED}", "Flag: Bahrain"),
    e("\u{1F1E7}\u{1F1EE}", "Flag: Burundi"),
    e("\u{1F1E7}\u{1F1EF}", "Flag: Benin"),
    e("\u{1F1E7}\u{1F1F1}", "Flag: St. Barthélemy"),
    e("\u{1F1E7}\u{1F1F2}", "Flag: Bermuda"),
    e("\u{1F1E7}\u{1F1F3}", "Flag: Brunei"),
    e("\u{1F1E7}\u{1F1F4}", "Flag: Bolivia"),
    e("\u{1F1E7}\u{1F1F6}", "Flag: Caribbean Netherlands"),
    e("\u{1F1E7}\u{1F1F7}", "Flag: Brazil"),
    e("\u{1F1E7}\u{1F1F8}", "Flag: Bahamas"),
    e("\u{1F1E7}\u{1F1F9}", "Flag: Bhutan"),
    e("\u{1F1E7}\u{1F1FB}", "Flag: Bouvet Island"),
    e("\u{1F1E7}\u{1F1FC}", "Flag: Botswana"),
    e("\u{1F1E7}\u{1F1FE}", "Flag: Belarus"),
    e("\u{1F1E7}\u{1F1FF}", "Flag: Belize"),
    e("\u{1F1E8}\u{1F1E6}", "Flag: Canada"),
    e("\u{1F1E8}\u{1F1E8}", "Flag: Cocos (Keeling) Islands"),
    e("\u{1F1E8}\u{1F1E9}", "Flag: Congo - Kinshasa"),
    e("\u{1F1E8}\u{1F1EB}", "Flag: Central African Republic"),
    e("\u{1F1E8}\u{1F1EC}", "Flag: Congo - Brazzaville"),
    e("\u{1F1E8}\u{1F1ED}", "Flag: Switzerland"),
    e("\u{1F1E8}\u{1F1EE}", "Flag: Côte d’Ivoire"),
    e("\u{1F1E8}\u{1F1F0}", "Flag: Cook Islands"),
    e("\u{1F1E8}\u{1F1F1}", "Flag: Chile"),
    e("\u{1F1E8}\u{1F1F2}", "Flag: Cameroon"),
    e("\u{1F1E8}\u{1F1F3}", "Flag: China"),
    e("\u{1F1E8}\u{1F1F4}", "Flag: Colombia"),
    e("\u{1F1E8}\u{1F1F5}", "Flag: Clipperton Island"),
    e("\u{1F1E8}\u{1F1F7}", "Flag: Costa Rica"),
    e("\u{1F1E8}\u{1F1FA}", "Flag: Cuba"),
    e("\u{1F1E8}\u{1F1FB}", "Flag: Cape Verde"),
    e("\u{1F1E8}\u{1F1FC}", "Flag: Curaçao"),
    e("\u{1F1E8}\u{1F1FD}", "Flag: Christmas Island"),
    e("\u{1F1E8}\u{1F1FE}", "Flag: Cyprus"),
    e("\u{1F1E8}\u{1F1FF}", "Flag: Czechia"),
    e("\u{1F1E9}\u{1F1EA}", "Flag: Germany"),
    e("\u{1F1E9}\u{1F1EC}", "Flag: Diego Garcia"),
    e("\u{1F1E9}\u{1F1EF}", "Flag: Djibouti"),
    e("\u{1F1E9}\u{1F1F0}", "Flag: Denmark"),
    e("\u{1F1E9}\u{1F1F2}", "Flag: Dominica"),
    e("\u{1F1E9}\u{1F1F4}", "Flag: Dominican Republic"),
    e("\u{1F1E9}\u{1F1FF}", "Flag: Algeria"),
    e("\u{1F1EA}\u{1F1E6}", "Flag: Ceuta & Melilla"),
    e("\u{1F1EA}\u{1F1E8}", "Flag: Ecuador"),
    e("\u{1F1EA}\u{1F1EA}", "Flag: Estonia"),
    e("\u{1F1EA}\u{1F1EC}", "Flag: Egypt"),
    e("\u{1F1EA}\u{1F1ED}", "Flag: Western Sahara"),
    e("\u{1F1EA}\u{1F1F7}", "Flag: Eritrea"),
    e("\u{1F1EA}\u{1F1F8}", "Flag: Spain"),
    e("\u{1F1EA}\u{1F1F9}", "Flag: Ethiopia"),
    e("\u{1F1EA}\u{1F1FA}", "Flag: European Union"),
    e("\u{1F1EB}\u{1F1EE}", "Flag: Finland"),
    e("\u{1F1EB}\u{1F1EF}", "Flag: Fiji"),
    e("\u{1F1EB}\u{1F1F0}", "Flag: Falkland Islands"),
    e("\u{1F1EB}\u{1F1F2}", "Flag: Micronesia"),
    e("\u{1F1EB}\u{1F1F4}", "Flag: Faroe Islands"),
    e("\u{1F1EB}\u{1F1F7}", "Flag: France"),
    e("\u{1F1EC}\u{1F1E6}", "Flag: Gabon"),
    e("\u{1F1EC}\u{1F1E7}", "Flag: United Kingdom"),
    e("\u{1F1EC}\u{1F1E9}", "Flag: Grenada"),
    e("\u{1F1EC}\u{1F1EA}", "Flag: Georgia"),
    e("\u{1F1EC}\u{1F1EB}", "Flag: French Guiana"),
    e("\u{1F1EC}\u{1F1EC}", "Flag: Guernsey"),
    e("\u{1F1EC}\u{1F1ED}", "Flag: Ghana"),
    e("\u{1F1EC}\u{1F1EE}", "Flag: Gibraltar"),
    e("\u{1F1EC}\u{1F1F1}", "Flag: Greenland"),
    e("\u{1F1EC}\u{1F1F2}", "Flag: Gambia"),
    e("\u{1F1EC}\u{1F1F3}", "Flag: Guinea"),
    e("\u{1F1EC}\u{1F1F5}", "Flag: Guadeloupe"),
    e("\u{1F1EC}\u{1F1F6}", "Flag: Equatorial Guinea"),
    e("\u{1F1EC}\u{1F1F7}", "Flag: Greece"),
    e("\u{1F1EC}\u{1F1F8}", "Flag: South Georgia & South Sandwich Islands"),
    e("\u{1F1EC}\u{1F1F9}", "Flag: Guatemala"),
    e("\u{1F1EC}\u{1F1FA}", "Flag: Guam"),
    e("\u{1F1EC}\u{1F1FC}", "Flag: Guinea-Bissau"),
    e("\u{1F1EC}\u{1F1FE}", "Flag: Guyana"),
    e("\u{1F1ED}\u{1F1F0}", "Flag: Hong Kong SAR China"),
    e("\u{1F1ED}\u{1F1F2}", "Flag: Heard & McDonald Islands"),
    e("\u{1F1ED}\u{1F1F3}", "Flag: Honduras"),
    e("\u{1F1ED}\u{1F1F7}", "Flag: Croatia"),
    e("\u{1F1ED}\u{1F1F9}", "Flag: Haiti"),
    e("\u{1F1ED}\u{1F1FA}", "Flag: Hungary"),
    e("\u{1F1EE}\u{1F1E8}", "Flag: Canary Islands"),
    e("\u{1F1EE}\u{1F1E9}", "Flag: Indonesia"),
    e("\u{1F1EE}\u{1F1EA}", "Flag: Ireland"),
    e("\u{1F1EE}\u{1F1F1}", "Flag: Israel"),
    e("\u{1F1EE}\u{1F1F2}", "Flag: Isle of Man"),
    e("\u{1F1EE}\u{1F1F3}", "Flag: India"),
    e("\u{1F1EE}\u{1F1F4}", "Flag: British Indian Ocean Territory"),
    e("\u{1F1EE}\u{1F1F6}", "Flag: Iraq"),
    e("\u{1F1EE}\u{1F1F7}", "Flag: Iran"),
    e("\u{1F1EE}\u{1F1F8}", "Flag: Iceland"),
    e("\u{1F1EE}\u{1F1F9}", "Flag: Italy"),
    e("\u{1F1EF}\u{1F1EA}", "Flag: Jersey"),
    e("\u{1F1EF}\u{1F1F2}", "Flag: Jamaica"),
    e("\u{1F1EF}\u{1F1F4}", "Flag: Jordan"),
    e("\u{1F1EF}\u{1F1F5}", "Flag: Japan"),
    e("\u{1F1F0}\u{1F1EA}", "Flag: Kenya"),
    e("\u{1F1F0}\u{1F1EC}", "Flag: Kyrgyzstan"),
    e("\u{1F1F0}\u{1F1ED}", "Flag: Cambodia"),
    e("\u{1F1F0}\u{1F1EE}", "Flag: Kiribati"),
    e("\u{1F1F0}\u{1F1F2}", "Flag: Comoros"),
    e("\u{1F1F0}\u{1F1F3}", "Flag: St. Kitts & Nevis"),
    e("\u{1F1F0}\u{1F1F5}", "Flag: North Korea"),
    e("\u{1F1F0}\u{1F1F7}", "Flag: South Korea"),
    e("\u{1F1F0}\u{1F1FC}", "Flag: Kuwait"),
    e("\u{1F1F0}\u{1F1FE}", "Flag: Cayman Islands"),
    e("\u{1F1F0}\u{1F1FF}", "Flag: Kazakhstan"),
    e("\u{1F1F1}\u{1F1E6}", "Flag: Laos"),
    e("\u{1F1F1}\u{1F1E7}", "Flag: Lebanon"),
    e("\u{1F1F1}\u{1F1E8}", "Flag: St. Lucia"),
    e("\u{1F1F1}\u{1F1EE}", "Flag: Liechtenstein"),
    e("\u{1F1F1}\u{1F1F0}", "Flag: Sri Lanka"),
    e("\u{1F1F1}\u{1F1F7}", "Flag: Liberia"),
    e("\u{1F1F1}\u{1F1F8}", "Flag: Lesotho"),
    e("\u{1F1F1}\u{1F1F9}", "Flag: Lithuania"),
    e("\u{1F1F1}\u{1F1FA}", "Flag: Luxembourg"),
    e("\u{1F1F1}\u{1F1FB}", "Flag: Latvia"),
    e("\u{1F1F1}\u{1F1FE}", "Flag: Libya"),
    e("\u{1F1F2}\u{1F1E6}", "Flag: Morocco"),
    e("\u{1F1F2}\u{1F1E8}", "Flag: Monaco"),
    e("\u{1F1F2}\u{1F1E9}", "Flag: Moldova"),
    e("\u{1F1F2}\u{1F1EA}", "Flag: Montenegro"),
    e("\u{1F1F2}\u{1F1EB}", "Flag: St. Martin"),
    e("\u{1F1F2}\u{1F1EC}", "Flag: Madagascar"),
    e("\u{1F1F2}\u{1F1ED}", "Flag: Marshall Islands"),
    e("\u{1F1F2}\u{1F1F0}", "Flag: North Macedonia"),
    e("\u{1F1F2}\u{1F1F1}", "Flag: Mali"),
    e("\u{1F1F2}\u{1F1F2}", "Flag: Myanmar (Burma)"),
    e("\u{1F1F2}\u{1F1F3}", "Flag: Mongolia"),
    e("\u{1F1F2}\u{1F1F4}", "Flag: Macao Sar China"),
    e("\u{1F1F2}\u{1F1F5}", "Flag: Northern Mariana Islands"),
    e("\u{1F1F2}\u{1F1F6}", "Flag: Martinique"),
    e("\u{1F1F2}\u{1F1F7}", "Flag: Mauritania"),
    e("\u{1F1F2}\u{1F1F8}", "Flag: Montserrat"),
    e("\u{1F1F2}\u{1F1F9}", "Flag: Malta"),
    e("\u{1F1F2}\u{1F1FA}", "Flag: Mauritius"),
    e("\u{1F1F2}\u{1F1FB}", "Flag: Maldives"),
    e("\u{1F1F2}\u{1F1FC}", "Flag: Malawi"),
    e("\u{1F1F2}\u{1F1FD}", "Flag: Mexico"),
    e("\u{1F1F2}\u{1F1FE}", "Flag: Malaysia"),
    e("\u{1F1F2}\u{1F1FF}", "Flag: Mozambique"),
    e("\u{1F1F3}\u{1F1E6}", "Flag: Namibia"),
    e("\u{1F1F3}\u{1F1E8}", "Flag: New Caledonia"),
    e("\u{1F1F3}\u{1F1EA}", "Flag: Niger"),
    e("\u{1F1F3}\u{1F1EB}", "Flag: Norfolk Island"),
    e("\u{1F1F3}\u{1F1EC}", "Flag: Nigeria"),
    e("\u{1F1F3}\u{1F1EE}", "Flag: Nicaragua"),
    e("\u{1F1F3}\u{1F1F1}", "Flag: Netherlands"),
    e("\u{1F1F3}\u{1F1F4}", "Flag: Norway"),
    e("\u{1F1F3}\u{1F1F5}", "Flag: Nepal"),
    e("\u{1F1F3}\u{1F1F7}", "Flag: Nauru"),
    e("\u{1F1F3}\u{1F1FA}", "Flag: Niue"),
    e("\u{1F1F3}\u{1F1FF}", "Flag: New Zealand"),
    e("\u{1F1F4}\u{1F1F2}", "Flag: Oman"),
    e("\u{1F1F5}\u{1F1E6}", "Flag: Panama"),
    e("\u{1F1F5}\u{1F1EA}", "Flag: Peru"),
    e("\u{1F1F5}\u{1F1EB}", "Flag: French Polynesia"),
    e("\u{1F1F5}\u{1F1EC}", "Flag: Papua New Guinea"),
    e("\u{1F1F5}\u{1F1ED}", "Flag: Philippines"),
    e("\u{1F1F5}\u{1F1F0}", "Flag: Pakistan"),
    e("\u{1F1F5}\u{1F1F1}", "Flag: Poland"),
    e("\u{1F1F5}\u{1F1F2}", "Flag: St. Pierre & Miquelon"),
    e("\u{1F1F5}\u{1F1F3}", "Flag: Pitcairn Islands"),
    e("\u{1F1F5}\u{1F1F7}", "Flag: Puerto Rico"),
    e("\u{1F1F5}\u{1F1F8}", "Flag: Palestinian Territories"),
    e("\u{1F1F5}\u{1F1F9}", "Flag: Portugal"),
    e("\u{1F1F5}\u{1F1FC}", "Flag: Palau"),
    e("\u{1F1F5}\u{1F1FE}", "Flag: Paraguay"),
    e("\u{1F1F6}\u{1F1E6}", "Flag: Qatar"),
    e("\u{1F1F7}\u{1F1EA}", "Flag: Réunion"),
    e("\u{1F1F7}\u{1F1F4}", "Flag: Romania"),
    e("\u{1F1F7}\u{1F1F8}", "Flag: Serbia"),
    e("\u{1F1F7}\u{1F1FA}", "Flag: Russia"),
    e("\u{1F1F7}\u{1F1FC}", "Flag: Rwanda"),
    e("\u{1F1F8}\u{1F1E6}", "Flag: Saudi Arabia"),
    e("\u{1F1F8}\u{1F1E7}", "Flag: Solomon Islands"),
    e("\u{1F1F8}\u{1F1E8}", "Flag: Seychelles"),
    e("\u{1F1F8}\u{1F1E9}", "Flag: Sudan"),
    e("\u{1F1F8}\u{1F1EA}", "Flag: Sweden"),
    e("\u{1F1F8}\u{1F1EC}", "Flag: Singapore"),
    e("\u{1F1F8}\u{1F1ED}", "Flag: St. Helena"),
    e("\u{1F1F8}\u{1F1EE}", "Flag: Slovenia"),
    e("\u{1F1F8}\u{1F1EF}", "Flag: Svalbard & Jan Mayen"),
    e("\u{1F1F8}\u{1F1F0}", "Flag: Slovakia"),
    e("\u{1F1F8}\u{1F1F1}", "Flag: Sierra Leone"),
    e("\u{1F1F8}\u{1F1F2}", "Flag: San Marino"),
    e("\u{1F1F8}\u{1F1F3}", "Flag: Senegal"),
    e("\u{1F1F8}\u{1F1F4}", "Flag: Somalia"),
    e("\u{1F1F8}\u{1F1F7}", "Flag: Suriname"),
    e("\u{1F1F8}\u{1F1F8}", "Flag: South Sudan"),
    e("\u{1F1F8}\u{1F1F9}", "Flag: São Tomé & Príncipe"),
    e("\u{1F1F8}\u{1F1FB}", "Flag: El Salvador"),
    e("\u{1F1F8}\u{1F1FD}", "Flag: Sint Maarten"),
    e("\u{1F1F8}\u{1F1FE}", "Flag: Syria"),
    e("\u{1F1F8}\u{1F1FF}", "Flag: Eswatini"),
    e("\u{1F1F9}\u{1F1E6}", "Flag: Tristan Da Cunha"),
    e("\u{1F1F9}\u{1F1E8}", "Flag: Turks & Caicos Islands"),
    e("\u{1F1F9}\u{1F1E9}", "Flag: Chad"),
    e("\u{1F1F9}\u{1F1EB}", "Flag: French Southern Territories"),
    e("\u{1F1F9}\u{1F1EC}", "Flag: Togo"),
    e("\u{1F1F9}\u{1F1ED}", "Flag: Thailand"),
    e("\u{1F1F9}\u{1F1EF}", "Flag: Tajikistan"),
    e("\u{1F1F9}\u{1F1F0}", "Flag: Tokelau"),
    e("\u{1F1F9}\u{1F1F1}", "Flag: Timor-Leste"),
    e("\u{1F1F9}\u{1F1F2}", "Flag: Turkmenistan"),
    e("\u{1F1F9}\u{1F1F3}", "Flag: Tunisia"),
    e("\u{1F1F9}\u{1F1F4}", "Flag: Tonga"),
    e("\u{1F1F9}\u{1F1F7}", "Flag: Turkey"),
    e("\u{1F1F9}\u{1F1F9}", "Flag: Trinidad & Tobago"),
    e("\u{1F1F9}\u{1F1FB}", "Flag: Tuvalu"),
    e("\u{1F1F9}\u{1F1FC}", "Flag: Taiwan"),
    e("\u{1F1F9}\u{1F1FF}", "Flag: Tanzania"),
    e("\u{1F1FA}\u{1F1E6}", "Flag: Ukraine"),
    e("\u{1F1FA}\u{1F1EC}", "Flag: Uganda"),
    e("\u{1F1FA}\u{1F1F2}", "Flag: U.S. Outlying Islands"),
    e("\u{1F1FA}\u{1F1F3}", "Flag: United Nations"),
    e("\u{1F1FA}\u{1F1F8}", "Flag: United States"),
    e("\u{1F1FA}\u{1F1FE}", "Flag: Uruguay"),
    e("\u{1F1FA}\u{1F1FF}", "Flag: Uzbekistan"),
    e("\u{1F1FB}\u{1F1E6}", "Flag: Vatican City"),
    e("\u{1F1FB}\u{1F1E8}", "Flag: St. Vincent & Grenadines"),
    e("\u{1F1FB}\u{1F1EA}", "Flag: Venezuela"),
    e("\u{1F1FB}\u{1F1EC}", "Flag: British Virgin Islands"),
    e("\u{1F1FB}\u{1F1EE}", "Flag: U.S. Virgin Islands"),
    e("\u{1F1FB}\u{1F1F3}", "Flag: Vietnam"),
    e("\u{1F1FB}\u{1F1FA}", "Flag: Vanuatu"),
    e("\u{1F1FC}\u{1F1EB}", "Flag: Wallis & Futuna"),
    e("\u{1F1FC}\u{1F1F8}", "Flag: Samoa"),
    e("\u{1F1FD}\u{1F1F0}", "Flag: Kosovo"),
    e("\u{1F1FE}\u{1F1EA}", "Flag: Yemen"),
    e("\u{1F1FE}\u{1F1F9}", "Flag: Mayotte"),
    e("\u{1F1FF}\u{1F1E6}", "Flag: South Africa"),
    e("\u{1F1FF}\u{1F1F2}", "Flag: Zambia"),
    e("\u{1F1FF}\u{1F1FC}", "Flag: Zimbabwe"));

const flags = g(
    "Flags", "Basic flags",
    e("\u{1F38C}", "Crossed Flags"),
    e("\u{1F3C1}", "Chequered Flag"),
    e("\u{1F3F3}\u{FE0F}", "White Flag"),
    e("\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}", "Rainbow Flag"),
    e("\u{1F3F3}\u{FE0F}\u{200D}\u{26A7}\u{FE0F}", "Transgender Flag"),
    e("\u{1F3F4}", "Black Flag"),
    e("\u{1F3F4}\u{200D}\u{2620}\u{FE0F}", "Pirate Flag"),
    e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", "Flag: England"),
    e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", "Flag: Scotland"),
    e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", "Flag: Wales"),
    e("\u{1F6A9}", "Triangular Flag"));

const motorcycle = e("\u{1F3CD}\u{FE0F}", "Motorcycle");
const racingCar = e("\u{1F3CE}\u{FE0F}", "Racing Car");
const seat = e("\u{1F4BA}", "Seat");
const helicopter = e("\u{1F681}", "Helicopter");
const locomotive = e("\u{1F682}", "Locomotive");
const railwayCar = e("\u{1F683}", "Railway Car");
const highspeedTrain = e("\u{1F684}", "High-Speed Train");
const bulletTrain = e("\u{1F685}", "Bullet Train");
const train = e("\u{1F686}", "Train");
const metro = e("\u{1F687}", "Metro");
const lightRail = e("\u{1F688}", "Light Rail");
const station = e("\u{1F689}", "Station");
const tram = e("\u{1F68A}", "Tram");
const tramCar = e("\u{1F68B}", "Tram Car");
const bus = e("\u{1F68C}", "Bus");
const oncomingBus = e("\u{1F68D}", "Oncoming Bus");
const trolleyBus = e("\u{1F68E}", "Trolleybus");
const busStop = e("\u{1F68F}", "Bus Stop");
const miniBus = e("\u{1F690}", "Minibus");
const ambulance = e("\u{1F691}", "Ambulance");
const policeCar = e("\u{1F693}", "Police Car");
const oncomingPoliceCar = e("\u{1F694}", "Oncoming Police Car");
const taxi = e("\u{1F695}", "Taxi");
const oncomingTaxi = e("\u{1F696}", "Oncoming Taxi");
const automobile = e("\u{1F697}", "Automobile");
const oncomingAutomobile = e("\u{1F698}", "Oncoming Automobile");
const sportUtilityVehicle = e("\u{1F699}", "Sport Utility Vehicle");
const deliveryTruck = e("\u{1F69A}", "Delivery Truck");
const articulatedLorry = e("\u{1F69B}", "Articulated Lorry");
const tractor = e("\u{1F69C}", "Tractor");
const monorail = e("\u{1F69D}", "Monorail");
const mountainRailway = e("\u{1F69E}", "Mountain Railway");
const suspensionRailway = e("\u{1F69F}", "Suspension Railway");
const mountainCableway = e("\u{1F6A0}", "Mountain Cableway");
const aerialTramway = e("\u{1F6A1}", "Aerial Tramway");
const ship = e("\u{1F6A2}", "Ship");
const speedBoat = e("\u{1F6A4}", "Speedboat");
const horizontalTrafficLight = e("\u{1F6A5}", "Horizontal Traffic Light");
const verticalTrafficLight = e("\u{1F6A6}", "Vertical Traffic Light");
const construction = e("\u{1F6A7}", "Construction");
const policeCarLight = e("\u{1F6A8}", "Police Car Light");
const bicycle = e("\u{1F6B2}", "Bicycle");
const stopSign = e("\u{1F6D1}", "Stop Sign");
const oilDrum = e("\u{1F6E2}\u{FE0F}", "Oil Drum");
const motorway = e("\u{1F6E3}\u{FE0F}", "Motorway");
const railwayTrack = e("\u{1F6E4}\u{FE0F}", "Railway Track");
const motorBoat = e("\u{1F6E5}\u{FE0F}", "Motor Boat");
const smallAirplane = e("\u{1F6E9}\u{FE0F}", "Small Airplane");
const airplaneDeparture = e("\u{1F6EB}", "Airplane Departure");
const airplaneArrival = e("\u{1F6EC}", "Airplane Arrival");
const satellite = e("\u{1F6F0}\u{FE0F}", "Satellite");
const passengerShip = e("\u{1F6F3}\u{FE0F}", "Passenger Ship");
const kickScooter = e("\u{1F6F4}", "Kick Scooter");
const motorScooter = e("\u{1F6F5}", "Motor Scooter");
const canoe = e("\u{1F6F6}", "Canoe");
const flyingSaucer = e("\u{1F6F8}", "Flying Saucer");
const skateboard = e("\u{1F6F9}", "Skateboard");
const autoRickshaw = e("\u{1F6FA}", "Auto Rickshaw");
const pickupTruck = e("\u{1F6FB}", "Pickup Truck");
const rollerSkate = e("\u{1F6FC}", "Roller Skate");
const parachute = e("\u{1FA82}", "Parachute");
const anchor = e("\u{2693}", "Anchor");
const ferry = e("\u{26F4}\u{FE0F}", "Ferry");
const sailboat = e("\u{26F5}", "Sailboat");
const fuelPump = e("\u{26FD}", "Fuel Pump");
const vehicles = g(
    "Vehicles", "Things that go",
    motorcycle,
    racingCar,
    seat,
    rocket,
    helicopter,
    locomotive,
    railwayCar,
    highspeedTrain,
    bulletTrain,
    train,
    metro,
    lightRail,
    station,
    tram,
    tramCar,
    bus,
    oncomingBus,
    trolleyBus,
    busStop,
    miniBus,
    ambulance,
    fireEngine,
    taxi,
    oncomingTaxi,
    automobile,
    oncomingAutomobile,
    sportUtilityVehicle,
    deliveryTruck,
    articulatedLorry,
    tractor,
    monorail,
    mountainRailway,
    suspensionRailway,
    mountainCableway,
    aerialTramway,
    ship,
    speedBoat,
    horizontalTrafficLight,
    verticalTrafficLight,
    construction,
    bicycle,
    stopSign,
    oilDrum,
    motorway,
    railwayTrack,
    motorBoat,
    smallAirplane,
    airplaneDeparture,
    airplaneArrival,
    satellite,
    passengerShip,
    kickScooter,
    motorScooter,
    canoe,
    flyingSaucer,
    skateboard,
    autoRickshaw,
    pickupTruck,
    rollerSkate,
    motorizedWheelchair,
    manualWheelchair,
    parachute,
    anchor,
    ferry,
    sailboat,
    fuelPump,
    airplane);

const bloodTypes = g(
    "Blood Types", "Blood types",
    e("\u{1F170}", "A Button (Blood Type)"),
    e("\u{1F171}", "B Button (Blood Type)"),
    e("\u{1F17E}", "O Button (Blood Type)"),
    e("\u{1F18E}", "AB Button (Blood Type)"));

const regionIndicators = g(
    "Regions", "Region indicators",
    e("\u{1F1E6}", "Regional Indicator Symbol Letter A"),
    e("\u{1F1E7}", "Regional Indicator Symbol Letter B"),
    e("\u{1F1E8}", "Regional Indicator Symbol Letter C"),
    e("\u{1F1E9}", "Regional Indicator Symbol Letter D"),
    e("\u{1F1EA}", "Regional Indicator Symbol Letter E"),
    e("\u{1F1EB}", "Regional Indicator Symbol Letter F"),
    e("\u{1F1EC}", "Regional Indicator Symbol Letter G"),
    e("\u{1F1ED}", "Regional Indicator Symbol Letter H"),
    e("\u{1F1EE}", "Regional Indicator Symbol Letter I"),
    e("\u{1F1EF}", "Regional Indicator Symbol Letter J"),
    e("\u{1F1F0}", "Regional Indicator Symbol Letter K"),
    e("\u{1F1F1}", "Regional Indicator Symbol Letter L"),
    e("\u{1F1F2}", "Regional Indicator Symbol Letter M"),
    e("\u{1F1F3}", "Regional Indicator Symbol Letter N"),
    e("\u{1F1F4}", "Regional Indicator Symbol Letter O"),
    e("\u{1F1F5}", "Regional Indicator Symbol Letter P"),
    e("\u{1F1F6}", "Regional Indicator Symbol Letter Q"),
    e("\u{1F1F7}", "Regional Indicator Symbol Letter R"),
    e("\u{1F1F8}", "Regional Indicator Symbol Letter S"),
    e("\u{1F1F9}", "Regional Indicator Symbol Letter T"),
    e("\u{1F1FA}", "Regional Indicator Symbol Letter U"),
    e("\u{1F1FB}", "Regional Indicator Symbol Letter V"),
    e("\u{1F1FC}", "Regional Indicator Symbol Letter W"),
    e("\u{1F1FD}", "Regional Indicator Symbol Letter X"),
    e("\u{1F1FE}", "Regional Indicator Symbol Letter Y"),
    e("\u{1F1FF}", "Regional Indicator Symbol Letter Z"));

const japanese = g(
    "Japanese", "Japanse symbology",
    e("\u{1F530}", "Japanese Symbol for Beginner"),
    e("\u{1F201}", "Japanese “Here” Button"),
    e("\u{1F202}\u{FE0F}", "Japanese “Service Charge” Button"),
    e("\u{1F21A}", "Japanese “Free of Charge” Button"),
    e("\u{1F22F}", "Japanese “Reserved” Button"),
    e("\u{1F232}", "Japanese “Prohibited” Button"),
    e("\u{1F233}", "Japanese “Vacancy” Button"),
    e("\u{1F234}", "Japanese “Passing Grade” Button"),
    e("\u{1F235}", "Japanese “No Vacancy” Button"),
    e("\u{1F236}", "Japanese “Not Free of Charge” Button"),
    e("\u{1F237}\u{FE0F}", "Japanese “Monthly Amount” Button"),
    e("\u{1F238}", "Japanese “Application” Button"),
    e("\u{1F239}", "Japanese “Discount” Button"),
    e("\u{1F23A}", "Japanese “Open for Business” Button"),
    e("\u{1F250}", "Japanese “Bargain” Button"),
    e("\u{1F251}", "Japanese “Acceptable” Button"),
    e("\u{3297}\u{FE0F}", "Japanese “Congratulations” Button"),
    e("\u{3299}\u{FE0F}", "Japanese “Secret” Button"));

const clocks = g(
    "Clocks", "Time-keeping pieces",
    e("\u{1F550}", "One O’Clock"),
    e("\u{1F551}", "Two O’Clock"),
    e("\u{1F552}", "Three O’Clock"),
    e("\u{1F553}", "Four O’Clock"),
    e("\u{1F554}", "Five O’Clock"),
    e("\u{1F555}", "Six O’Clock"),
    e("\u{1F556}", "Seven O’Clock"),
    e("\u{1F557}", "Eight O’Clock"),
    e("\u{1F558}", "Nine O’Clock"),
    e("\u{1F559}", "Ten O’Clock"),
    e("\u{1F55A}", "Eleven O’Clock"),
    e("\u{1F55B}", "Twelve O’Clock"),
    e("\u{1F55C}", "One-Thirty"),
    e("\u{1F55D}", "Two-Thirty"),
    e("\u{1F55E}", "Three-Thirty"),
    e("\u{1F55F}", "Four-Thirty"),
    e("\u{1F560}", "Five-Thirty"),
    e("\u{1F561}", "Six-Thirty"),
    e("\u{1F562}", "Seven-Thirty"),
    e("\u{1F563}", "Eight-Thirty"),
    e("\u{1F564}", "Nine-Thirty"),
    e("\u{1F565}", "Ten-Thirty"),
    e("\u{1F566}", "Eleven-Thirty"),
    e("\u{1F567}", "Twelve-Thirty"),
    e("\u{1F570}\u{FE0F}", "Mantelpiece Clock"),
    e("\u{231A}", "Watch"),
    e("\u{23F0}", "Alarm Clock"),
    e("\u{23F1}\u{FE0F}", "Stopwatch"),
    e("\u{23F2}\u{FE0F}", "Timer Clock"),
    e("\u{231B}", "Hourglass Done"),
    e("\u{23F3}", "Hourglass Not Done"));

const downRightArrow = e("\u{2198}", "Down-Right Arrow");
const downRightArrowText = e("\u{2198}\u{FE0E}", "Down-Right Arrow");
const downRightArrowEmoji = e("\u{2198}\u{FE0F}", "Down-Right Arrow");
const arrows = g(
    "Arrows", "Arrows pointing in different directions",
    e("\u{1F503}\u{FE0F}", "Clockwise Vertical Arrows"),
    e("\u{1F504}\u{FE0F}", "Counterclockwise Arrows Button"),
    e("\u{2194}\u{FE0F}", "Left-Right Arrow"),
    e("\u{2195}\u{FE0F}", "Up-Down Arrow"),
    e("\u{2196}\u{FE0F}", "Up-Left Arrow"),
    e("\u{2197}\u{FE0F}", "Up-Right Arrow"),
    downRightArrowEmoji,
    e("\u{2199}\u{FE0F}", "Down-Left Arrow"),
    e("\u{21A9}\u{FE0F}", "Right Arrow Curving Left"),
    e("\u{21AA}\u{FE0F}", "Left Arrow Curving Right"),
    e("\u{27A1}\u{FE0F}", "Right Arrow"),
    e("\u{2934}\u{FE0F}", "Right Arrow Curving Up"),
    e("\u{2935}\u{FE0F}", "Right Arrow Curving Down"),
    e("\u{2B05}\u{FE0F}", "Left Arrow"),
    e("\u{2B06}\u{FE0F}", "Up Arrow"),
    e("\u{2B07}\u{FE0F}", "Down Arrow"));

const shapes = g(
    "Shapes", "Colored shapes",
    e("\u{1F534}", "Red Circle"),
    e("\u{1F535}", "Blue Circle"),
    e("\u{1F536}", "Large Orange Diamond"),
    e("\u{1F537}", "Large Blue Diamond"),
    e("\u{1F538}", "Small Orange Diamond"),
    e("\u{1F539}", "Small Blue Diamond"),
    e("\u{1F53A}", "Red Triangle Pointed Up"),
    e("\u{1F53B}", "Red Triangle Pointed Down"),
    e("\u{1F7E0}", "Orange Circle"),
    e("\u{1F7E1}", "Yellow Circle"),
    e("\u{1F7E2}", "Green Circle"),
    e("\u{1F7E3}", "Purple Circle"),
    e("\u{1F7E4}", "Brown Circle"),
    e("\u{2B55}", "Hollow Red Circle"),
    e("\u{26AA}", "White Circle"),
    e("\u{26AB}", "Black Circle"),
    e("\u{1F7E5}", "Red Square"),
    e("\u{1F7E6}", "Blue Square"),
    e("\u{1F7E7}", "Orange Square"),
    e("\u{1F7E8}", "Yellow Square"),
    e("\u{1F7E9}", "Green Square"),
    e("\u{1F7EA}", "Purple Square"),
    e("\u{1F7EB}", "Brown Square"),
    e("\u{1F532}", "Black Square Button"),
    e("\u{1F533}", "White Square Button"),
    e("\u{25AA}\u{FE0F}", "Black Small Square"),
    e("\u{25AB}\u{FE0F}", "White Small Square"),
    e("\u{25FD}", "White Medium-Small Square"),
    e("\u{25FE}", "Black Medium-Small Square"),
    e("\u{25FB}\u{FE0F}", "White Medium Square"),
    e("\u{25FC}\u{FE0F}", "Black Medium Square"),
    e("\u{2B1B}", "Black Large Square"),
    e("\u{2B1C}", "White Large Square"),
    e("\u{2B50}", "Star"),
    e("\u{1F4A0}", "Diamond with a Dot"));

const shuffleTracksButton = e("\u{1F500}", "Shuffle Tracks Button");
const repeatButton = e("\u{1F501}", "Repeat Button");
const repeatSingleButton = e("\u{1F502}", "Repeat Single Button");
const upwardsButton = e("\u{1F53C}", "Upwards Button");
const downwardsButton = e("\u{1F53D}", "Downwards Button");
const playButton = e("\u{25B6}\u{FE0F}", "Play Button");
const reverseButton = e("\u{25C0}\u{FE0F}", "Reverse Button");
const ejectButton = e("\u{23CF}\u{FE0F}", "Eject Button");
const fastForwardButton = e("\u{23E9}", "Fast-Forward Button");
const fastReverseButton = e("\u{23EA}", "Fast Reverse Button");
const fastUpButton = e("\u{23EB}", "Fast Up Button");
const fastDownButton = e("\u{23EC}", "Fast Down Button");
const nextTrackButton = e("\u{23ED}\u{FE0F}", "Next Track Button");
const lastTrackButton = e("\u{23EE}\u{FE0F}", "Last Track Button");
const playOrPauseButton = e("\u{23EF}\u{FE0F}", "Play or Pause Button");
const pauseButton = e("\u{23F8}\u{FE0F}", "Pause Button");
const stopButton = e("\u{23F9}\u{FE0F}", "Stop Button");
const recordButton = e("\u{23FA}\u{FE0F}", "Record Button");


const buttons = g(
    "Buttons", "Buttons",
    e("\u{1F191}", "CL Button"),
    e("\u{1F192}", "Cool Button"),
    e("\u{1F193}", "Free Button"),
    e("\u{1F194}", "ID Button"),
    e("\u{1F195}", "New Button"),
    e("\u{1F196}", "NG Button"),
    e("\u{1F197}", "OK Button"),
    e("\u{1F198}", "SOS Button"),
    e("\u{1F199}", "Up! Button"),
    e("\u{1F19A}", "Vs Button"),
    e("\u{1F518}", "Radio Button"),
    e("\u{1F519}", "Back Arrow"),
    e("\u{1F51A}", "End Arrow"),
    e("\u{1F51B}", "On! Arrow"),
    e("\u{1F51C}", "Soon Arrow"),
    e("\u{1F51D}", "Top Arrow"),
    e("\u{2611}\u{FE0F}", "Check Box with Check"),
    e("\u{1F520}", "Input Latin Uppercase"),
    e("\u{1F521}", "Input Latin Lowercase"),
    e("\u{1F522}", "Input Numbers"),
    e("\u{1F523}", "Input Symbols"),
    e("\u{1F524}", "Input Latin Letters"),
    shuffleTracksButton,
    repeatButton,
    repeatSingleButton,
    upwardsButton,
    downwardsButton,
    pauseButton,
    reverseButton,
    ejectButton,
    fastForwardButton,
    fastReverseButton,
    fastUpButton,
    fastDownButton,
    nextTrackButton,
    lastTrackButton,
    playOrPauseButton,
    pauseButton,
    stopButton,
    recordButton);

const zodiac = g(
    "Zodiac", "The symbology of astrology",
    e("\u{2648}", "Aries"),
    e("\u{2649}", "Taurus"),
    e("\u{264A}", "Gemini"),
    e("\u{264B}", "Cancer"),
    e("\u{264C}", "Leo"),
    e("\u{264D}", "Virgo"),
    e("\u{264E}", "Libra"),
    e("\u{264F}", "Scorpio"),
    e("\u{2650}", "Sagittarius"),
    e("\u{2651}", "Capricorn"),
    e("\u{2652}", "Aquarius"),
    e("\u{2653}", "Pisces"),
    e("\u{26CE}", "Ophiuchus"));

const numbers = g(
    "Numbers", "Numbers",
    e("\u{30}\u{FE0F}", "Digit Zero"),
    e("\u{31}\u{FE0F}", "Digit One"),
    e("\u{32}\u{FE0F}", "Digit Two"),
    e("\u{33}\u{FE0F}", "Digit Three"),
    e("\u{34}\u{FE0F}", "Digit Four"),
    e("\u{35}\u{FE0F}", "Digit Five"),
    e("\u{36}\u{FE0F}", "Digit Six"),
    e("\u{37}\u{FE0F}", "Digit Seven"),
    e("\u{38}\u{FE0F}", "Digit Eight"),
    e("\u{39}\u{FE0F}", "Digit Nine"),
    e("\u{2A}\u{FE0F}", "Asterisk"),
    e("\u{23}\u{FE0F}", "Number Sign"),
    e("\u{30}\u{FE0F}\u{20E3}", "Keycap Digit Zero"),
    e("\u{31}\u{FE0F}\u{20E3}", "Keycap Digit One"),
    e("\u{32}\u{FE0F}\u{20E3}", "Keycap Digit Two"),
    e("\u{33}\u{FE0F}\u{20E3}", "Keycap Digit Three"),
    e("\u{34}\u{FE0F}\u{20E3}", "Keycap Digit Four"),
    e("\u{35}\u{FE0F}\u{20E3}", "Keycap Digit Five"),
    e("\u{36}\u{FE0F}\u{20E3}", "Keycap Digit Six"),
    e("\u{37}\u{FE0F}\u{20E3}", "Keycap Digit Seven"),
    e("\u{38}\u{FE0F}\u{20E3}", "Keycap Digit Eight"),
    e("\u{39}\u{FE0F}\u{20E3}", "Keycap Digit Nine"),
    e("\u{2A}\u{FE0F}\u{20E3}", "Keycap Asterisk"),
    e("\u{23}\u{FE0F}\u{20E3}", "Keycap Number Sign"),
    e("\u{1F51F}", "Keycap: 10"));

const tags = g(
    "Tags", "Tags",
    e("\u{E0020}", "Tag Space"),
    e("\u{E0021}", "Tag Exclamation Mark"),
    e("\u{E0022}", "Tag Quotation Mark"),
    e("\u{E0023}", "Tag Number Sign"),
    e("\u{E0024}", "Tag Dollar Sign"),
    e("\u{E0025}", "Tag Percent Sign"),
    e("\u{E0026}", "Tag Ampersand"),
    e("\u{E0027}", "Tag Apostrophe"),
    e("\u{E0028}", "Tag Left Parenthesis"),
    e("\u{E0029}", "Tag Right Parenthesis"),
    e("\u{E002A}", "Tag Asterisk"),
    e("\u{E002B}", "Tag Plus Sign"),
    e("\u{E002C}", "Tag Comma"),
    e("\u{E002D}", "Tag Hyphen-Minus"),
    e("\u{E002E}", "Tag Full Stop"),
    e("\u{E002F}", "Tag Solidus"),
    e("\u{E0030}", "Tag Digit Zero"),
    e("\u{E0031}", "Tag Digit One"),
    e("\u{E0032}", "Tag Digit Two"),
    e("\u{E0033}", "Tag Digit Three"),
    e("\u{E0034}", "Tag Digit Four"),
    e("\u{E0035}", "Tag Digit Five"),
    e("\u{E0036}", "Tag Digit Six"),
    e("\u{E0037}", "Tag Digit Seven"),
    e("\u{E0038}", "Tag Digit Eight"),
    e("\u{E0039}", "Tag Digit Nine"),
    e("\u{E003A}", "Tag Colon"),
    e("\u{E003B}", "Tag Semicolon"),
    e("\u{E003C}", "Tag Less-Than Sign"),
    e("\u{E003D}", "Tag Equals Sign"),
    e("\u{E003E}", "Tag Greater-Than Sign"),
    e("\u{E003F}", "Tag Question Mark"),
    e("\u{E0040}", "Tag Commercial at"),
    e("\u{E0041}", "Tag Latin Capital Letter a"),
    e("\u{E0042}", "Tag Latin Capital Letter B"),
    e("\u{E0043}", "Tag Latin Capital Letter C"),
    e("\u{E0044}", "Tag Latin Capital Letter D"),
    e("\u{E0045}", "Tag Latin Capital Letter E"),
    e("\u{E0046}", "Tag Latin Capital Letter F"),
    e("\u{E0047}", "Tag Latin Capital Letter G"),
    e("\u{E0048}", "Tag Latin Capital Letter H"),
    e("\u{E0049}", "Tag Latin Capital Letter I"),
    e("\u{E004A}", "Tag Latin Capital Letter J"),
    e("\u{E004B}", "Tag Latin Capital Letter K"),
    e("\u{E004C}", "Tag Latin Capital Letter L"),
    e("\u{E004D}", "Tag Latin Capital Letter M"),
    e("\u{E004E}", "Tag Latin Capital Letter N"),
    e("\u{E004F}", "Tag Latin Capital Letter O"),
    e("\u{E0050}", "Tag Latin Capital Letter P"),
    e("\u{E0051}", "Tag Latin Capital Letter Q"),
    e("\u{E0052}", "Tag Latin Capital Letter R"),
    e("\u{E0053}", "Tag Latin Capital Letter S"),
    e("\u{E0054}", "Tag Latin Capital Letter T"),
    e("\u{E0055}", "Tag Latin Capital Letter U"),
    e("\u{E0056}", "Tag Latin Capital Letter V"),
    e("\u{E0057}", "Tag Latin Capital Letter W"),
    e("\u{E0058}", "Tag Latin Capital Letter X"),
    e("\u{E0059}", "Tag Latin Capital Letter Y"),
    e("\u{E005A}", "Tag Latin Capital Letter Z"),
    e("\u{E005B}", "Tag Left Square Bracket"),
    e("\u{E005C}", "Tag Reverse Solidus"),
    e("\u{E005D}", "Tag Right Square Bracket"),
    e("\u{E005E}", "Tag Circumflex Accent"),
    e("\u{E005F}", "Tag Low Line"),
    e("\u{E0060}", "Tag Grave Accent"),
    e("\u{E0061}", "Tag Latin Small Letter a"),
    e("\u{E0062}", "Tag Latin Small Letter B"),
    e("\u{E0063}", "Tag Latin Small Letter C"),
    e("\u{E0064}", "Tag Latin Small Letter D"),
    e("\u{E0065}", "Tag Latin Small Letter E"),
    e("\u{E0066}", "Tag Latin Small Letter F"),
    e("\u{E0067}", "Tag Latin Small Letter G"),
    e("\u{E0068}", "Tag Latin Small Letter H"),
    e("\u{E0069}", "Tag Latin Small Letter I"),
    e("\u{E006A}", "Tag Latin Small Letter J"),
    e("\u{E006B}", "Tag Latin Small Letter K"),
    e("\u{E006C}", "Tag Latin Small Letter L"),
    e("\u{E006D}", "Tag Latin Small Letter M"),
    e("\u{E006E}", "Tag Latin Small Letter N"),
    e("\u{E006F}", "Tag Latin Small Letter O"),
    e("\u{E0070}", "Tag Latin Small Letter P"),
    e("\u{E0071}", "Tag Latin Small Letter Q"),
    e("\u{E0072}", "Tag Latin Small Letter R"),
    e("\u{E0073}", "Tag Latin Small Letter S"),
    e("\u{E0074}", "Tag Latin Small Letter T"),
    e("\u{E0075}", "Tag Latin Small Letter U"),
    e("\u{E0076}", "Tag Latin Small Letter V"),
    e("\u{E0077}", "Tag Latin Small Letter W"),
    e("\u{E0078}", "Tag Latin Small Letter X"),
    e("\u{E0079}", "Tag Latin Small Letter Y"),
    e("\u{E007A}", "Tag Latin Small Letter Z"),
    e("\u{E007B}", "Tag Left Curly Bracket"),
    e("\u{E007C}", "Tag Vertical Line"),
    e("\u{E007D}", "Tag Right Curly Bracket"),
    e("\u{E007E}", "Tag Tilde"),
    e("\u{E007F}", "Cancel Tag"));

const math = g(
    "Math", "Math",
    e("\u{2716}\u{FE0F}", "Multiply"),
    e("\u{2795}", "Plus"),
    e("\u{2796}", "Minus"),
    e("\u{2797}", "Divide"));

const games = g(
    "Games", "Games",
    e("\u{2660}\u{FE0F}", "Spade Suit"),
    e("\u{2663}\u{FE0F}", "Club Suit"),
    e("\u{2665}\u{FE0F}", "Heart Suit", { color: "red" }),
    e("\u{2666}\u{FE0F}", "Diamond Suit", { color: "red" }),
    e("\u{1F004}", "Mahjong Red Dragon"),
    e("\u{1F0CF}", "Joker"),
    e("\u{1F3AF}", "Direct Hit"),
    e("\u{1F3B0}", "Slot Machine"),
    e("\u{1F3B1}", "Pool 8 Ball"),
    e("\u{1F3B2}", "Game Die"),
    e("\u{1F3B3}", "Bowling"),
    e("\u{1F3B4}", "Flower Playing Cards"),
    e("\u{1F9E9}", "Puzzle Piece"),
    e("\u{265F}\u{FE0F}", "Chess Pawn"),
    e("\u{1FA80}", "Yo-Yo"),
    e("\u{1FA81}", "Kite"),
    e("\u{1FA83}", "Boomerang"),
    e("\u{1FA86}", "Nesting Dolls"));

const sportsEquipment = g(
    "Sports Equipment", "Sports equipment",
    e("\u{1F3BD}", "Running Shirt"),
    e("\u{1F3BE}", "Tennis"),
    e("\u{1F3BF}", "Skis"),
    e("\u{1F3C0}", "Basketball"),
    e("\u{1F3C5}", "Sports Medal"),
    e("\u{1F3C6}", "Trophy"),
    e("\u{1F3C8}", "American Football"),
    e("\u{1F3C9}", "Rugby Football"),
    e("\u{1F3CF}", "Cricket Game"),
    e("\u{1F3D0}", "Volleyball"),
    e("\u{1F3D1}", "Field Hockey"),
    e("\u{1F3D2}", "Ice Hockey"),
    e("\u{1F3D3}", "Ping Pong"),
    e("\u{1F3F8}", "Badminton"),
    e("\u{1F6F7}", "Sled"),
    e("\u{1F945}", "Goal Net"),
    e("\u{1F947}", "1st Place Medal"),
    e("\u{1F948}", "2nd Place Medal"),
    e("\u{1F949}", "3rd Place Medal"),
    e("\u{1F94A}", "Boxing Glove"),
    e("\u{1F94C}", "Curling Stone"),
    e("\u{1F94D}", "Lacrosse"),
    e("\u{1F94E}", "Softball"),
    e("\u{1F94F}", "Flying Disc"),
    e("\u{26BD}", "Soccer Ball"),
    e("\u{26BE}", "Baseball"),
    e("\u{26F8}\u{FE0F}", "Ice Skate"));

const clothing = g(
    "Clothing", "Clothing",
    e("\u{1F3A9}", "Top Hat"),
    e("\u{1F93F}", "Diving Mask"),
    e("\u{1F452}", "Woman’s Hat"),
    e("\u{1F453}", "Glasses"),
    e("\u{1F576}\u{FE0F}", "Sunglasses"),
    e("\u{1F454}", "Necktie"),
    e("\u{1F455}", "T-Shirt"),
    e("\u{1F456}", "Jeans"),
    e("\u{1F457}", "Dress"),
    e("\u{1F458}", "Kimono"),
    e("\u{1F459}", "Bikini"),
    e("\u{1F45A}", "Woman’s Clothes"),
    e("\u{1F45B}", "Purse"),
    e("\u{1F45C}", "Handbag"),
    e("\u{1F45D}", "Clutch Bag"),
    e("\u{1F45E}", "Man’s Shoe"),
    e("\u{1F45F}", "Running Shoe"),
    e("\u{1F460}", "High-Heeled Shoe"),
    e("\u{1F461}", "Woman’s Sandal"),
    e("\u{1F462}", "Woman’s Boot"),
    e("\u{1F94B}", "Martial Arts Uniform"),
    e("\u{1F97B}", "Sari"),
    e("\u{1F97C}", "Lab Coat"),
    e("\u{1F97D}", "Goggles"),
    e("\u{1F97E}", "Hiking Boot"),
    e("\u{1F97F}", "Flat Shoe"),
    whiteCane,
    e("\u{1F9BA}", "Safety Vest"),
    e("\u{1F9E2}", "Billed Cap"),
    e("\u{1F9E3}", "Scarf"),
    e("\u{1F9E4}", "Gloves"),
    e("\u{1F9E5}", "Coat"),
    e("\u{1F9E6}", "Socks"),
    e("\u{1F9FF}", "Nazar Amulet"),
    e("\u{1FA70}", "Ballet Shoes"),
    e("\u{1FA71}", "One-Piece Swimsuit"),
    e("\u{1FA72}", "Briefs"),
    e("\u{1FA73}", "Shorts"),
    e("\u{1FA74}", "Thong Sandal"));

const town = g(
    "Town", "Town",
    e("\u{1F3D7}\u{FE0F}", "Building Construction"),
    e("\u{1F3D8}\u{FE0F}", "Houses"),
    e("\u{1F3D9}\u{FE0F}", "Cityscape"),
    e("\u{1F3DA}\u{FE0F}", "Derelict House"),
    e("\u{1F3DB}\u{FE0F}", "Classical Building"),
    e("\u{1F3DC}\u{FE0F}", "Desert"),
    e("\u{1F3DD}\u{FE0F}", "Desert Island"),
    e("\u{1F3DE}\u{FE0F}", "National Park"),
    e("\u{1F3DF}\u{FE0F}", "Stadium"),
    e("\u{1F3E0}", "House"),
    e("\u{1F3E1}", "House with Garden"),
    e("\u{1F3E2}", "Office Building"),
    e("\u{1F3E3}", "Japanese Post Office"),
    e("\u{1F3E4}", "Post Office"),
    e("\u{1F3E5}", "Hospital"),
    e("\u{1F3E6}", "Bank"),
    e("\u{1F3E7}", "ATM Sign"),
    e("\u{1F3E8}", "Hotel"),
    e("\u{1F3E9}", "Love Hotel"),
    e("\u{1F3EA}", "Convenience Store"),
    school,
    e("\u{1F3EC}", "Department Store"),
    factory,
    e("\u{1F309}", "Bridge at Night"),
    e("\u{26F2}", "Fountain"),
    e("\u{1F6CD}\u{FE0F}", "Shopping Bags"),
    e("\u{1F9FE}", "Receipt"),
    e("\u{1F6D2}", "Shopping Cart"),
    e("\u{1F488}", "Barber Pole"),
    e("\u{1F492}", "Wedding"),
    e("\u{1F6D6}", "Hut"),
    e("\u{1F6D7}", "Elevator"),
    e("\u{1F5F3}\u{FE0F}", "Ballot Box with Ballot"));

const music = g(
    "Music", "Music",
    e("\u{1F3BC}", "Musical Score"),
    e("\u{1F3B6}", "Musical Notes"),
    e("\u{1F3B5}", "Musical Note"),
    e("\u{1F3B7}", "Saxophone"),
    e("\u{1F3B8}", "Guitar"),
    e("\u{1F3B9}", "Musical Keyboard"),
    e("\u{1F3BA}", "Trumpet"),
    e("\u{1F3BB}", "Violin"),
    e("\u{1F941}", "Drum"),
    e("\u{1FA95}", "Banjo"),
    e("\u{1FA97}", "Accordion"),
    e("\u{1FA98}", "Long Drum"));

const weather = g(
    "Weather", "Weather",
    e("\u{1F304}", "Sunrise Over Mountains"),
    e("\u{1F305}", "Sunrise"),
    e("\u{1F306}", "Cityscape at Dusk"),
    e("\u{1F307}", "Sunset"),
    e("\u{1F303}", "Night with Stars"),
    e("\u{1F302}", "Closed Umbrella"),
    e("\u{2602}\u{FE0F}", "Umbrella"),
    e("\u{2614}\u{FE0F}", "Umbrella with Rain Drops"),
    e("\u{2603}\u{FE0F}", "Snowman"),
    e("\u{26C4}", "Snowman Without Snow"),
    e("\u{2600}\u{FE0F}", "Sun"),
    e("\u{2601}\u{FE0F}", "Cloud"),
    e("\u{1F324}\u{FE0F}", "Sun Behind Small Cloud"),
    e("\u{26C5}", "Sun Behind Cloud"),
    e("\u{1F325}\u{FE0F}", "Sun Behind Large Cloud"),
    e("\u{1F326}\u{FE0F}", "Sun Behind Rain Cloud"),
    e("\u{1F327}\u{FE0F}", "Cloud with Rain"),
    e("\u{1F328}\u{FE0F}", "Cloud with Snow"),
    e("\u{1F329}\u{FE0F}", "Cloud with Lightning"),
    e("\u{26C8}\u{FE0F}", "Cloud with Lightning and Rain"),
    e("\u{2744}\u{FE0F}", "Snowflake"),
    e("\u{1F300}", "Cyclone"),
    e("\u{1F32A}\u{FE0F}", "Tornado"),
    e("\u{1F32C}\u{FE0F}", "Wind Face"),
    e("\u{1F30A}", "Water Wave"),
    e("\u{1F32B}\u{FE0F}", "Fog"),
    e("\u{1F301}", "Foggy"),
    e("\u{1F308}", "Rainbow"),
    e("\u{1F321}\u{FE0F}", "Thermometer"));

const astro = g(
    "Astronomy", "Astronomy",
    e("\u{1F30C}", "Milky Way"),
    e("\u{1F30D}", "Globe Showing Europe-Africa"),
    e("\u{1F30E}", "Globe Showing Americas"),
    e("\u{1F30F}", "Globe Showing Asia-Australia"),
    e("\u{1F310}", "Globe with Meridians"),
    e("\u{1F311}", "New Moon"),
    e("\u{1F312}", "Waxing Crescent Moon"),
    e("\u{1F313}", "First Quarter Moon"),
    e("\u{1F314}", "Waxing Gibbous Moon"),
    e("\u{1F315}", "Full Moon"),
    e("\u{1F316}", "Waning Gibbous Moon"),
    e("\u{1F317}", "Last Quarter Moon"),
    e("\u{1F318}", "Waning Crescent Moon"),
    e("\u{1F319}", "Crescent Moon"),
    e("\u{1F31A}", "New Moon Face"),
    e("\u{1F31B}", "First Quarter Moon Face"),
    e("\u{1F31C}", "Last Quarter Moon Face"),
    e("\u{1F31D}", "Full Moon Face"),
    e("\u{1F31E}", "Sun with Face"),
    e("\u{1F31F}", "Glowing Star"),
    e("\u{1F320}", "Shooting Star"),
    e("\u{2604}\u{FE0F}", "Comet"),
    e("\u{1FA90}", "Ringed Planet"));

const finance = g(
    "Finance", "Finance",
    e("\u{1F4B0}", "Money Bag"),
    e("\u{1F4B1}", "Currency Exchange"),
    e("\u{1F4B2}", "Heavy Dollar Sign"),
    e("\u{1F4B3}", "Credit Card"),
    e("\u{1F4B4}", "Yen Banknote"),
    e("\u{1F4B5}", "Dollar Banknote"),
    e("\u{1F4B6}", "Euro Banknote"),
    e("\u{1F4B7}", "Pound Banknote"),
    e("\u{1F4B8}", "Money with Wings"),
    e("\u{1F4B9}", "Chart Increasing with Yen"),
    e("\u{1FA99}", "Coin"));

const writing = g(
    "Writing", "Writing",
    e("\u{1F58A}\u{FE0F}", "Pen"),
    e("\u{1F58B}\u{FE0F}", "Fountain Pen"),
    e("\u{1F58C}\u{FE0F}", "Paintbrush"),
    e("\u{1F58D}\u{FE0F}", "Crayon"),
    e("\u{270F}\u{FE0F}", "Pencil"),
    e("\u{2712}\u{FE0F}", "Black Nib"));

const alembic = e("\u{2697}\u{FE0F}", "Alembic");
const gear = e("\u{2699}\u{FE0F}", "Gear");
const atomSymbol = e("\u{269B}\u{FE0F}", "Atom Symbol");
const keyboard = e("\u{2328}\u{FE0F}", "Keyboard");
const telephone = e("\u{260E}\u{FE0F}", "Telephone");
const studioMicrophone = e("\u{1F399}\u{FE0F}", "Studio Microphone");
const levelSlider = e("\u{1F39A}\u{FE0F}", "Level Slider");
const controlKnobs = e("\u{1F39B}\u{FE0F}", "Control Knobs");
const movieCamera = e("\u{1F3A5}", "Movie Camera");
const headphone = e("\u{1F3A7}", "Headphone");
const videoGame = e("\u{1F3AE}", "Video Game");
const lightBulb = e("\u{1F4A1}", "Light Bulb");
const computerDisk = e("\u{1F4BD}", "Computer Disk");
const floppyDisk = e("\u{1F4BE}", "Floppy Disk");
const opticalDisk = e("\u{1F4BF}", "Optical Disk");
const dvd = e("\u{1F4C0}", "DVD");
const telephoneReceiver = e("\u{1F4DE}", "Telephone Receiver");
const pager = e("\u{1F4DF}", "Pager");
const faxMachine = e("\u{1F4E0}", "Fax Machine");
const satelliteAntenna = e("\u{1F4E1}", "Satellite Antenna");
const loudspeaker = e("\u{1F4E2}", "Loudspeaker");
const megaphone = e("\u{1F4E3}", "Megaphone");
const mobilePhone = e("\u{1F4F1}", "Mobile Phone");
const mobilePhoneWithArrow = e("\u{1F4F2}", "Mobile Phone with Arrow");
const mobilePhoneVibrating = e("\u{1F4F3}", "Mobile Phone Vibrating");
const mobilePhoneOff = e("\u{1F4F4}", "Mobile Phone Off");
const noMobilePhone = e("\u{1F4F5}", "No Mobile Phone");
const antennaBars = e("\u{1F4F6}", "Antenna Bars");
const camera = e("\u{1F4F7}", "Camera");
const cameraWithFlash = e("\u{1F4F8}", "Camera with Flash");
const videoCamera = e("\u{1F4F9}", "Video Camera");
const television = e("\u{1F4FA}", "Television");
const radio = e("\u{1F4FB}", "Radio");
const videocassette = e("\u{1F4FC}", "Videocassette");
const filmProjector = e("\u{1F4FD}\u{FE0F}", "Film Projector");
const portableStereo = e("\u{1F4FE}\u{FE0F}", "Portable Stereo");
const dimButton = e("\u{1F505}", "Dim Button");
const brightButton = e("\u{1F506}", "Bright Button");
const mutedSpeaker = e("\u{1F507}", "Muted Speaker");
const speakerLowVolume = e("\u{1F508}", "Speaker Low Volume");
const speakerMediumVolume = e("\u{1F509}", "Speaker Medium Volume");
const speakerHighVolume = e("\u{1F50A}", "Speaker High Volume");
const battery = e("\u{1F50B}", "Battery");
const electricPlug = e("\u{1F50C}", "Electric Plug");
const magnifyingGlassTiltedLeft = e("\u{1F50D}", "Magnifying Glass Tilted Left");
const magnifyingGlassTiltedRight = e("\u{1F50E}", "Magnifying Glass Tilted Right");
const lockedWithPen = e("\u{1F50F}", "Locked with Pen");
const lockedWithKey = e("\u{1F510}", "Locked with Key");
const key = e("\u{1F511}", "Key");
const locked = e("\u{1F512}", "Locked");
const unlocked = e("\u{1F513}", "Unlocked");
const bell = e("\u{1F514}", "Bell");
const bellWithSlash = e("\u{1F515}", "Bell with Slash");
const bookmark = e("\u{1F516}", "Bookmark");
const link = e("\u{1F517}", "Link");
const joystick = e("\u{1F579}\u{FE0F}", "Joystick");
const desktopComputer = e("\u{1F5A5}\u{FE0F}", "Desktop Computer");
const printer = e("\u{1F5A8}\u{FE0F}", "Printer");
const computerMouse = e("\u{1F5B1}\u{FE0F}", "Computer Mouse");
const trackball = e("\u{1F5B2}\u{FE0F}", "Trackball");
const blackFolder = e("\u{1F5BF}", "Black Folder");
const folder = e("\u{1F5C0}", "Folder");
const openFolder = e("\u{1F5C1}", "Open Folder");
const cardIndexDividers = e("\u{1F5C2}", "Card Index Dividers");
const cardFileBox = e("\u{1F5C3}", "Card File Box");
const fileCabinet = e("\u{1F5C4}", "File Cabinet");
const emptyNote = e("\u{1F5C5}", "Empty Note");
const emptyNotePage = e("\u{1F5C6}", "Empty Note Page");
const emptyNotePad = e("\u{1F5C7}", "Empty Note Pad");
const note = e("\u{1F5C8}", "Note");
const notePage = e("\u{1F5C9}", "Note Page");
const notePad = e("\u{1F5CA}", "Note Pad");
const emptyDocument = e("\u{1F5CB}", "Empty Document");
const emptyPage = e("\u{1F5CC}", "Empty Page");
const emptyPages = e("\u{1F5CD}", "Empty Pages");
const documentIcon = e("\u{1F5CE}", "Document");
const page = e("\u{1F5CF}", "Page");
const pages = e("\u{1F5D0}", "Pages");
const wastebasket = e("\u{1F5D1}", "Wastebasket");
const spiralNotePad = e("\u{1F5D2}", "Spiral Note Pad");
const spiralCalendar = e("\u{1F5D3}", "Spiral Calendar");
const desktopWindow = e("\u{1F5D4}", "Desktop Window");
const minimize = e("\u{1F5D5}", "Minimize");
const maximize = e("\u{1F5D6}", "Maximize");
const overlap = e("\u{1F5D7}", "Overlap");
const reload = e("\u{1F5D8}", "Reload");
const close = e("\u{1F5D9}", "Close");
const increaseFontSize = e("\u{1F5DA}", "Increase Font Size");
const decreaseFontSize = e("\u{1F5DB}", "Decrease Font Size");
const compression = e("\u{1F5DC}", "Compression");
const oldKey = e("\u{1F5DD}", "Old Key");
const tech = g(
    "Technology", "Technology",
    joystick,
    videoGame,
    lightBulb,
    laptop,
    briefcase,
    computerDisk,
    floppyDisk,
    opticalDisk,
    dvd,
    desktopComputer,
    keyboard,
    printer,
    computerMouse,
    trackball,
    telephone,
    telephoneReceiver,
    pager,
    faxMachine,
    satelliteAntenna,
    loudspeaker,
    megaphone,
    television,
    radio,
    videocassette,
    filmProjector,
    studioMicrophone,
    levelSlider,
    controlKnobs,
    microphone,
    movieCamera,
    headphone,
    camera,
    cameraWithFlash,
    videoCamera,
    mobilePhone,
    mobilePhoneOff,
    mobilePhoneWithArrow,
    lockedWithPen,
    lockedWithKey,
    locked,
    unlocked,
    bell,
    bellWithSlash,
    bookmark,
    link,
    mobilePhoneVibrating,
    antennaBars,
    dimButton,
    brightButton,
    mutedSpeaker,
    speakerLowVolume,
    speakerMediumVolume,
    speakerHighVolume,
    battery,
    electricPlug);

const mail = g(
    "Mail", "Mail",
    e("\u{1F4E4}", "Outbox Tray"),
    e("\u{1F4E5}", "Inbox Tray"),
    e("\u{1F4E6}", "Package"),
    e("\u{1F4E7}", "E-Mail"),
    e("\u{1F4E8}", "Incoming Envelope"),
    e("\u{1F4E9}", "Envelope with Arrow"),
    e("\u{1F4EA}", "Closed Mailbox with Lowered Flag"),
    e("\u{1F4EB}", "Closed Mailbox with Raised Flag"),
    e("\u{1F4EC}", "Open Mailbox with Raised Flag"),
    e("\u{1F4ED}", "Open Mailbox with Lowered Flag"),
    e("\u{1F4EE}", "Postbox"),
    e("\u{1F4EF}", "Postal Horn"));

const celebration = g(
    "Celebration", "Celebration",
    e("\u{1FA85}", "Piñata"),
    e("\u{1F380}", "Ribbon"),
    e("\u{1F381}", "Wrapped Gift"),
    e("\u{1F383}", "Jack-O-Lantern"),
    e("\u{1F384}", "Christmas Tree"),
    e("\u{1F9E8}", "Firecracker"),
    e("\u{1F386}", "Fireworks"),
    e("\u{1F387}", "Sparkler"),
    e("\u{2728}", "Sparkles"),
    e("\u{2747}\u{FE0F}", "Sparkle"),
    e("\u{1F388}", "Balloon"),
    e("\u{1F389}", "Party Popper"),
    e("\u{1F38A}", "Confetti Ball"),
    e("\u{1F38B}", "Tanabata Tree"),
    e("\u{1F38D}", "Pine Decoration"),
    e("\u{1F38E}", "Japanese Dolls"),
    e("\u{1F38F}", "Carp Streamer"),
    e("\u{1F390}", "Wind Chime"),
    e("\u{1F391}", "Moon Viewing Ceremony"),
    e("\u{1F392}", "Backpack"),
    graduationCap,
    e("\u{1F9E7}", "Red Envelope"),
    e("\u{1F3EE}", "Red Paper Lantern"),
    e("\u{1F396}\u{FE0F}", "Military Medal"));

const tools = g(
    "Tools", "Tools",
    e("\u{1F3A3}", "Fishing Pole"),
    e("\u{1F526}", "Flashlight"),
    wrench,
    e("\u{1F528}", "Hammer"),
    e("\u{1F529}", "Nut and Bolt"),
    e("\u{1F6E0}\u{FE0F}", "Hammer and Wrench"),
    e("\u{1F9ED}", "Compass"),
    e("\u{1F9EF}", "Fire Extinguisher"),
    e("\u{1F9F0}", "Toolbox"),
    e("\u{1F9F1}", "Brick"),
    e("\u{1FA93}", "Axe"),
    e("\u{2692}\u{FE0F}", "Hammer and Pick"),
    e("\u{26CF}\u{FE0F}", "Pick"),
    e("\u{26D1}\u{FE0F}", "Rescue Worker’s Helmet"),
    e("\u{26D3}\u{FE0F}", "Chains"),
    compression,
    e("\u{1FA9A}", "Carpentry Saw"),
    e("\u{1FA9B}", "Screwdriver"),
    e("\u{1FA9C}", "Ladder"),
    e("\u{1FA9D}", "Hook"));

const office = g(
    "Office", "Office",
    e("\u{1F4C1}", "File Folder"),
    e("\u{1F4C2}", "Open File Folder"),
    e("\u{1F4C3}", "Page with Curl"),
    e("\u{1F4C4}", "Page Facing Up"),
    e("\u{1F4C5}", "Calendar"),
    e("\u{1F4C6}", "Tear-Off Calendar"),
    e("\u{1F4C7}", "Card Index"),
    cardIndexDividers,
    cardFileBox,
    fileCabinet,
    wastebasket,
    spiralNotePad,
    spiralCalendar,
    e("\u{1F4C8}", "Chart Increasing"),
    e("\u{1F4C9}", "Chart Decreasing"),
    e("\u{1F4CA}", "Bar Chart"),
    e("\u{1F4CB}", "Clipboard"),
    e("\u{1F4CC}", "Pushpin"),
    e("\u{1F4CD}", "Round Pushpin"),
    e("\u{1F4CE}", "Paperclip"),
    e("\u{1F587}\u{FE0F}", "Linked Paperclips"),
    e("\u{1F4CF}", "Straight Ruler"),
    e("\u{1F4D0}", "Triangular Ruler"),
    e("\u{1F4D1}", "Bookmark Tabs"),
    e("\u{1F4D2}", "Ledger"),
    e("\u{1F4D3}", "Notebook"),
    e("\u{1F4D4}", "Notebook with Decorative Cover"),
    e("\u{1F4D5}", "Closed Book"),
    e("\u{1F4D6}", "Open Book"),
    e("\u{1F4D7}", "Green Book"),
    e("\u{1F4D8}", "Blue Book"),
    e("\u{1F4D9}", "Orange Book"),
    e("\u{1F4DA}", "Books"),
    e("\u{1F4DB}", "Name Badge"),
    e("\u{1F4DC}", "Scroll"),
    e("\u{1F4DD}", "Memo"),
    e("\u{2702}\u{FE0F}", "Scissors"),
    e("\u{2709}\u{FE0F}", "Envelope"));

const signs = g(
    "Signs", "Signs",
    e("\u{1F3A6}", "Cinema"),
    noMobilePhone,
    e("\u{1F51E}", "No One Under Eighteen"),
    e("\u{1F6AB}", "Prohibited"),
    e("\u{1F6AC}", "Cigarette"),
    e("\u{1F6AD}", "No Smoking"),
    e("\u{1F6AE}", "Litter in Bin Sign"),
    e("\u{1F6AF}", "No Littering"),
    e("\u{1F6B0}", "Potable Water"),
    e("\u{1F6B1}", "Non-Potable Water"),
    e("\u{1F6B3}", "No Bicycles"),
    e("\u{1F6B7}", "No Pedestrians"),
    e("\u{1F6B8}", "Children Crossing"),
    e("\u{1F6B9}", "Men’s Room"),
    e("\u{1F6BA}", "Women’s Room"),
    e("\u{1F6BB}", "Restroom"),
    e("\u{1F6BC}", "Baby Symbol"),
    e("\u{1F6BE}", "Water Closet"),
    e("\u{1F6C2}", "Passport Control"),
    e("\u{1F6C3}", "Customs"),
    e("\u{1F6C4}", "Baggage Claim"),
    e("\u{1F6C5}", "Left Luggage"),
    e("\u{1F17F}\u{FE0F}", "Parking Button"),
    e("\u{267F}", "Wheelchair Symbol"),
    e("\u{2622}\u{FE0F}", "Radioactive"),
    e("\u{2623}\u{FE0F}", "Biohazard"),
    e("\u{26A0}\u{FE0F}", "Warning"),
    e("\u{26A1}", "High Voltage"),
    e("\u{26D4}", "No Entry"),
    e("\u{267B}\u{FE0F}", "Recycling Symbol"),
    female,
    male,
    e("\u{26A7}\u{FE0F}", "Transgender Symbol"));

const religion = g(
    "Religion", "Religion",
    e("\u{1F52F}", "Dotted Six-Pointed Star"),
    e("\u{2721}\u{FE0F}", "Star of David"),
    e("\u{1F549}\u{FE0F}", "Om"),
    e("\u{1F54B}", "Kaaba"),
    e("\u{1F54C}", "Mosque"),
    e("\u{1F54D}", "Synagogue"),
    e("\u{1F54E}", "Menorah"),
    e("\u{1F6D0}", "Place of Worship"),
    e("\u{1F6D5}", "Hindu Temple"),
    e("\u{2626}\u{FE0F}", "Orthodox Cross"),
    e("\u{271D}\u{FE0F}", "Latin Cross"),
    e("\u{262A}\u{FE0F}", "Star and Crescent"),
    e("\u{262E}\u{FE0F}", "Peace Symbol"),
    e("\u{262F}\u{FE0F}", "Yin Yang"),
    e("\u{2638}\u{FE0F}", "Wheel of Dharma"),
    e("\u{267E}\u{FE0F}", "Infinity"),
    e("\u{1FA94}", "Diya Lamp"),
    e("\u{26E9}\u{FE0F}", "Shinto Shrine"),
    e("\u{26EA}", "Church"),
    e("\u{2734}\u{FE0F}", "Eight-Pointed Star"),
    e("\u{1F4FF}", "Prayer Beads"));

const door = e("\u{1F6AA}", "Door");
const household = g(
    "Household", "Household",
    e("\u{1F484}", "Lipstick"),
    e("\u{1F48D}", "Ring"),
    e("\u{1F48E}", "Gem Stone"),
    e("\u{1F4F0}", "Newspaper"),
    key,
    e("\u{1F525}", "Fire"),
    e("\u{1FAA8}", "Rock"),
    e("\u{1FAB5}", "Wood"),
    e("\u{1F52B}", "Pistol"),
    e("\u{1F56F}\u{FE0F}", "Candle"),
    e("\u{1F5BC}\u{FE0F}", "Framed Picture"),
    oldKey,
    e("\u{1F5DE}\u{FE0F}", "Rolled-Up Newspaper"),
    e("\u{1F5FA}\u{FE0F}", "World Map"),
    door,
    e("\u{1F6BD}", "Toilet"),
    e("\u{1F6BF}", "Shower"),
    e("\u{1F6C1}", "Bathtub"),
    e("\u{1F6CB}\u{FE0F}", "Couch and Lamp"),
    e("\u{1F6CF}\u{FE0F}", "Bed"),
    e("\u{1F9F4}", "Lotion Bottle"),
    e("\u{1F9F5}", "Thread"),
    e("\u{1F9F6}", "Yarn"),
    e("\u{1F9F7}", "Safety Pin"),
    e("\u{1F9F8}", "Teddy Bear"),
    e("\u{1F9F9}", "Broom"),
    e("\u{1F9FA}", "Basket"),
    e("\u{1F9FB}", "Roll of Paper"),
    e("\u{1F9FC}", "Soap"),
    e("\u{1F9FD}", "Sponge"),
    e("\u{1FA91}", "Chair"),
    e("\u{1FA92}", "Razor"),
    e("\u{1FA9E}", "Mirror"),
    e("\u{1FA9F}", "Window"),
    e("\u{1FAA0}", "Plunger"),
    e("\u{1FAA1}", "Sewing Needle"),
    e("\u{1FAA2}", "Knot"),
    e("\u{1FAA3}", "Bucket"),
    e("\u{1FAA4}", "Mouse Trap"),
    e("\u{1FAA5}", "Toothbrush"),
    e("\u{1FAA6}", "Headstone"),
    e("\u{1FAA7}", "Placard"),
    e("\u{1F397}\u{FE0F}", "Reminder Ribbon"));

const activities = g(
    "Activities", "Activities",
    e("\u{1F39E}\u{FE0F}", "Film Frames"),
    e("\u{1F39F}\u{FE0F}", "Admission Tickets"),
    e("\u{1F3A0}", "Carousel Horse"),
    e("\u{1F3A1}", "Ferris Wheel"),
    e("\u{1F3A2}", "Roller Coaster"),
    artistPalette,
    e("\u{1F3AA}", "Circus Tent"),
    e("\u{1F3AB}", "Ticket"),
    e("\u{1F3AC}", "Clapper Board"),
    e("\u{1F3AD}", "Performing Arts"));

const travel = g(
    "Travel", "Travel",
    e("\u{1F3F7}\u{FE0F}", "Label"),
    e("\u{1F30B}", "Volcano"),
    e("\u{1F3D4}\u{FE0F}", "Snow-Capped Mountain"),
    e("\u{26F0}\u{FE0F}", "Mountain"),
    e("\u{1F3D5}\u{FE0F}", "Camping"),
    e("\u{1F3D6}\u{FE0F}", "Beach with Umbrella"),
    e("\u{26F1}\u{FE0F}", "Umbrella on Ground"),
    e("\u{1F3EF}", "Japanese Castle"),
    e("\u{1F463}", "Footprints"),
    e("\u{1F5FB}", "Mount Fuji"),
    e("\u{1F5FC}", "Tokyo Tower"),
    e("\u{1F5FD}", "Statue of Liberty"),
    e("\u{1F5FE}", "Map of Japan"),
    e("\u{1F5FF}", "Moai"),
    e("\u{1F6CE}\u{FE0F}", "Bellhop Bell"),
    e("\u{1F9F3}", "Luggage"),
    e("\u{26F3}", "Flag in Hole"),
    e("\u{26FA}", "Tent"),
    e("\u{2668}\u{FE0F}", "Hot Springs"));

const medieval = g(
    "Medieval", "Medieval",
    e("\u{1F3F0}", "Castle"),
    e("\u{1F3F9}", "Bow and Arrow"),
    crown,
    e("\u{1F531}", "Trident Emblem"),
    e("\u{1F5E1}\u{FE0F}", "Dagger"),
    e("\u{1F6E1}\u{FE0F}", "Shield"),
    e("\u{1F52E}", "Crystal Ball"),
    e("\u{1FA84}", "Magic Wand"),
    e("\u{2694}\u{FE0F}", "Crossed Swords"),
    e("\u{269C}\u{FE0F}", "Fleur-de-lis"),
    e("\u{1FA96}", "Military Helmet"));

const doubleExclamationMark = e("\u{203C}\u{FE0F}", "Double Exclamation Mark");
const interrobang = e("\u{2049}\u{FE0F}", "Exclamation Question Mark");
const information = e("\u{2139}\u{FE0F}", "Information");
const circledM = e("\u{24C2}\u{FE0F}", "Circled M");
const checkMarkButton = e("\u{2705}", "Check Mark Button");
const checkMark = e("\u{2714}\u{FE0F}", "Check Mark");
const eightSpokedAsterisk = e("\u{2733}\u{FE0F}", "Eight-Spoked Asterisk");
const crossMark = e("\u{274C}", "Cross Mark");
const crossMarkButton = e("\u{274E}", "Cross Mark Button");
const questionMark = e("\u{2753}", "Question Mark");
const whiteQuestionMark = e("\u{2754}", "White Question Mark");
const whiteExclamationMark = e("\u{2755}", "White Exclamation Mark");
const exclamationMark = e("\u{2757}", "Exclamation Mark");
const curlyLoop = e("\u{27B0}", "Curly Loop");
const doubleCurlyLoop = e("\u{27BF}", "Double Curly Loop");
const wavyDash = e("\u{3030}\u{FE0F}", "Wavy Dash");
const partAlternationMark = e("\u{303D}\u{FE0F}", "Part Alternation Mark");
const tradeMark = e("\u{2122}\u{FE0F}", "Trade Mark");
const copyright = e("\u{A9}\u{FE0F}", "Copyright");
const registered = e("\u{AE}\u{FE0F}", "Registered");
const squareFourCourners = e("\u{26F6}\u{FE0F}", "Square: Four Corners");

const marks = gg(
    "Marks", "Marks", {
    doubleExclamationMark,
    interrobang,
    information,
    circledM,
    checkMarkButton,
    checkMark,
    eightSpokedAsterisk,
    crossMark,
    crossMarkButton,
    questionMark,
    whiteQuestionMark,
    whiteExclamationMark,
    exclamationMark,
    curlyLoop,
    doubleCurlyLoop,
    wavyDash,
    partAlternationMark,
    tradeMark,
    copyright,
    registered,
});

const droplet = e("\u{1F4A7}", "Droplet");
const dropOfBlood = e("\u{1FA78}", "Drop of Blood");
const adhesiveBandage = e("\u{1FA79}", "Adhesive Bandage");
const stethoscope = e("\u{1FA7A}", "Stethoscope");
const syringe = e("\u{1F489}", "Syringe");
const pill = e("\u{1F48A}", "Pill");
const testTube = e("\u{1F9EA}", "Test Tube");
const petriDish = e("\u{1F9EB}", "Petri Dish");
const dna = e("\u{1F9EC}", "DNA");
const abacus = e("\u{1F9EE}", "Abacus");
const magnet = e("\u{1F9F2}", "Magnet");
const telescope = e("\u{1F52D}", "Telescope");

const science = gg(
    "Science", "Science", {
    droplet,
    dropOfBlood,
    adhesiveBandage,
    stethoscope,
    syringe,
    pill,
    microscope,
    testTube,
    petriDish,
    dna,
    abacus,
    magnet,
    telescope,
    medical,
    balanceScale,
    alembic,
    gear,
    atomSymbol,
    magnifyingGlassTiltedLeft,
    magnifyingGlassTiltedRight,
});
const whiteChessKing = e("\u{2654}", "White Chess King");
const whiteChessQueen = e("\u{2655}", "White Chess Queen");
const whiteChessRook = e("\u{2656}", "White Chess Rook");
const whiteChessBishop = e("\u{2657}", "White Chess Bishop");
const whiteChessKnight = e("\u{2658}", "White Chess Knight");
const whiteChessPawn = e("\u{2659}", "White Chess Pawn");
const whiteChessPieces = gg(whiteChessKing.value + whiteChessQueen.value + whiteChessRook.value + whiteChessBishop.value + whiteChessKnight.value + whiteChessPawn.value, "White Chess Pieces", {
    width: "auto",
    king: whiteChessKing,
    queen: whiteChessQueen,
    rook: whiteChessRook,
    bishop: whiteChessBishop,
    knight: whiteChessKnight,
    pawn: whiteChessPawn
});
const blackChessKing = e("\u{265A}", "Black Chess King");
const blackChessQueen = e("\u{265B}", "Black Chess Queen");
const blackChessRook = e("\u{265C}", "Black Chess Rook");
const blackChessBishop = e("\u{265D}", "Black Chess Bishop");
const blackChessKnight = e("\u{265E}", "Black Chess Knight");
const blackChessPawn = e("\u{265F}", "Black Chess Pawn");
const blackChessPieces = gg(blackChessKing.value + blackChessQueen.value + blackChessRook.value + blackChessBishop.value + blackChessKnight.value + blackChessPawn.value, "Black Chess Pieces", {
    width: "auto",
    king: blackChessKing,
    queen: blackChessQueen,
    rook: blackChessRook,
    bishop: blackChessBishop,
    knight: blackChessKnight,
    pawn: blackChessPawn
});
const chessPawns = gg(whiteChessPawn.value + blackChessPawn.value, "Chess Pawns", {
    width: "auto",
    white: whiteChessPawn,
    black: blackChessPawn
});
const chessRooks = gg(whiteChessRook.value + blackChessRook.value, "Chess Rooks", {
    width: "auto",
    white: whiteChessRook,
    black: blackChessRook
});
const chessBishops = gg(whiteChessBishop.value + blackChessBishop.value, "Chess Bishops", {
    width: "auto",
    white: whiteChessBishop,
    black: blackChessBishop
});
const chessKnights = gg(whiteChessKnight.value + blackChessKnight.value, "Chess Knights", {
    width: "auto",
    white: whiteChessKnight,
    black: blackChessKnight
});
const chessQueens = gg(whiteChessQueen.value + blackChessQueen.value, "Chess Queens", {
    width: "auto",
    white: whiteChessQueen,
    black: blackChessQueen
});
const chessKings = gg(whiteChessKing.value + blackChessKing.value, "Chess Kings", {
    width: "auto",
    white: whiteChessKing,
    black: blackChessKing
});

const chess = gg("Chess Pieces", "Chess Pieces", {
    width: "auto",
    white: whiteChessPieces,
    black: blackChessPieces,
    pawns: chessPawns,
    rooks: chessRooks,
    bishops: chessBishops,
    knights: chessKnights,
    queens: chessQueens,
    kings: chessKings
});

const dice1 = e("\u2680", "Dice: Side 1");
const dice2 = e("\u2681", "Dice: Side 2");
const dice3 = e("\u2682", "Dice: Side 3");
const dice4 = e("\u2683", "Dice: Side 4");
const dice5 = e("\u2684", "Dice: Side 5");
const dice6 = e("\u2685", "Dice: Side 6");
const dice = gg("Dice", "Dice", {
    dice1,
    dice2,
    dice3,
    dice4,
    dice5,
    dice6
});

const allIcons = gg(
    "All Icons", "All Icons", {
    faces,
    love,
    cartoon,
    hands,
    bodyParts,
    people,
    gestures,
    inMotion,
    resting,
    roles,
    fantasy,
    animals,
    plants,
    food,
    flags,
    vehicles,
    clocks,
    arrows,
    shapes,
    buttons,
    zodiac,
    chess,
    dice,
    math,
    games,
    sportsEquipment,
    clothing,
    town,
    music,
    weather,
    astro,
    finance,
    writing,
    science,
    tech,
    mail,
    celebration,
    tools,
    office,
    signs,
    religion,
    household,
    activities,
    travel,
    medieval
});

/**
 * A setter functor for HTML attributes.
 **/
class HtmlAttr {
    /**
     * Creates a new setter functor for HTML Attributes
     * @param {string} key - the attribute name.
     * @param {string} value - the value to set for the attribute.
     * @param {...string} tags - the HTML tags that support this attribute.
     */
    constructor(key, value, ...tags) {
        this.key = key;
        this.value = value;
        this.tags = tags.map(t => t.toLocaleUpperCase());
        Object.freeze(this);
    }

    /**
     * Set the attribute value on an HTMLElement
     * @param {HTMLElement} elem - the element on which to set the attribute.
     */
    apply(elem) {
        const isValid = this.tags.length === 0
            || this.tags.indexOf(elem.tagName) > -1;

        if (!isValid) {
            console.warn(`Element ${elem.tagName} does not support Attribute ${this.key}`);
        }
        else if (this.key === "style") {
            Object.assign(elem[this.key], this.value);
        }
        else if (!isBoolean(value)) {
            elem[this.key] = this.value;
        }
        else if (this.value) {
            elem.setAttribute(this.key, "");
        }
        else {
            elem.removeAttribute(this.key);
        }
    }
}

/**
 * Alternative text in case an image can't be displayed.
 * @param {string} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function alt(value) { return new HtmlAttr("alt", value, "applet", "area", "img", "input"); }

/**
 * The audio or video should play as soon as possible.
 * @param {boolean} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function autoPlay(value) { return new HtmlAttr("autoplay", value, "audio", "video"); }

/**
 * Often used with CSS to style elements with common properties.
 * @param {string} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function className(value) { return new HtmlAttr("className", value); }

/**
 * Indicates whether the user can interact with the element.
 * @param {boolean} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function disabled(value) { return new HtmlAttr("disabled", value, "button", "command", "fieldset", "input", "keygen", "optgroup", "option", "select", "textarea"); }

/**
 * Describes elements which belongs to this one.
 * @param {string} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function htmlFor(value) { return new HtmlAttr("htmlFor", value, "label", "output"); }

/**
 * Specifies the height of elements listed here. For all other elements, use the CSS height property.
 * @param {number} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function height(value) { return new HtmlAttr("height", value, "canvas", "embed", "iframe", "img", "input", "object", "video"); }

/**
 * The URL of a linked resource.
 * @param {string} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function href(value) { return new HtmlAttr("href", value, "a", "area", "base", "link"); }

/**
 * Often used with CSS to style a specific element. The value of this attribute must be unique.
 * @param {string} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function id(value) { return new HtmlAttr("id", value); }

/**
 * Indicates the maximum value allowed.
 * @param {number} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function max(value) { return new HtmlAttr("max", value, "input", "meter", "progress"); }

/**
 * Indicates the minimum value allowed.
 * @param {number} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function min(value) { return new HtmlAttr("min", value, "input", "meter"); }

/**
 * Indicates whether the audio will be initially silenced on page load.
 * @param {boolean} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function muted(value) { return new HtmlAttr("muted", value, "audio", "video"); }

/**
 * Provides a hint to the user of what can be entered in the field.
 * @param {string} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function placeHolder(value) { return new HtmlAttr("placeholder", value, "input", "textarea"); }

/**
 * Indicates that the media element should play automatically on iOS.
 * @param {boolean} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function playsInline(value) { return new HtmlAttr("playsInline", value, "audio", "video"); }

/**
 * Defines the number of rows in a text area.
 * @param {string} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function role(value) { return new HtmlAttr("role", value); }

/**
 * The URL of the embeddable content.
 * @param {string} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function src(value) { return new HtmlAttr("src", value, "audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"); }

/**
 * A MediaStream object to use as a source for an HTML video or audio element
 * @param {string} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function srcObject(value) { return new HtmlAttr("srcObject", value, "audio", "video"); }

/**
 * The step attribute
 * @param {number} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function step(value) { return new HtmlAttr("step", value, "input"); }

/**
 * Text to be displayed in a tooltip when hovering over the element.
 * @param {string} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function title(value) { return new HtmlAttr("title", value); }

/**
 * Defines the type of the element.
 * @param {string} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function type(value) { return new HtmlAttr("type", value, "button", "input", "command", "embed", "object", "script", "source", "style", "menu"); }

/**
 * Defines a default value which will be displayed in the element on page load.
 * @param {string} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function value(value) { return new HtmlAttr("value", value, "button", "data", "input", "li", "meter", "option", "progress", "param"); }

/**
 * setting the volume at which a media element plays.
 * @param {number} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function volume(value) { return new HtmlAttr("volume", value, "audio", "video"); }

/**
 * For the elements listed here, this establishes the element's width.
 * @param {number} value - the value to set on the attribute.
 * @returns {HtmlAttr}
 **/
function width(value) { return new HtmlAttr("width", value, "canvas", "embed", "iframe", "img", "input", "object", "video"); }

/**
 * A CSS property that will be applied to an element's style attribute.
 **/
class CssProp {
    /**
     * Creates a new CSS property that will be applied to an element's style attribute.
     * @param {string} key - the property name.
     * @param {string} value - the value to set for the property.
     */
    constructor(key, value) {
        this.key = key;
        this.value = value;
        Object.freeze(this);
    }

    /**
     * Set the attribute value on an HTMLElement
     * @param {HTMLElement} elem - the element on which to set the attribute.
     */
    apply(elem) {
        elem.style[this.key] = this.value;
    }
}

class CssPropSet {
    /**
     * @param {...(CssProp|CssPropSet)} rest
     */
    constructor(...rest) {
        this.set = new Map();
        const set = (key, value) => {
            if (value || isBoolean(value)) {
                this.set.set(key, value);
            }
            else if (this.set.has(key)) {
                this.set.delete(key);
            }
        };
        for (let prop of rest) {
            if (prop instanceof CssProp) {
                const { key, value } = prop;
                set(key, value);
            }
            else if (prop instanceof CssPropSet) {
                for (let subProp of prop.set.entries()) {
                    const [key, value] = subProp;
                    set(key, value);
                }
            }
        }
    }

    /**
     * Set the attribute value on an HTMLElement
     * @param {HTMLElement} elem - the element on which to set the attribute.
     */
    apply(elem) {
        for (let prop of this.set.entries()) {
            const [key, value] = prop;
            elem.style[key] = value;
        }
    }
}

/**
 * Combine style properties.
 * @param {...CssProp} rest
 * @returns {CssPropSet}
 */
function styles(...rest) {
    return new CssPropSet(...rest);
}

/**
 * Creates a style attribute with a backgroundColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function backgroundColor(v) { return new CssProp("backgroundColor", v); }

/**
 * Creates a style attribute with a borderBottom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function borderBottom(v) { return new CssProp("borderBottom", v); }

/**
 * Creates a style attribute with a borderBottomColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function borderBottomColor(v) { return new CssProp("borderBottomColor", v); }

/**
 * Creates a style attribute with a borderLeft property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function borderLeft(v) { return new CssProp("borderLeft", v); }

/**
 * Creates a style attribute with a borderRight property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function borderRight(v) { return new CssProp("borderRight", v); }

/**
 * Creates a style attribute with a borderStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function borderStyle(v) { return new CssProp("borderStyle", v); }

/**
 * Creates a style attribute with a borderTop property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function borderTop(v) { return new CssProp("borderTop", v); }

/**
 * Creates a style attribute with a borderWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function borderWidth(v) { return new CssProp("borderWidth", v); }

/**
 * Creates a style attribute with a color property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function color(v) { return new CssProp("color", v); }

/**
 * Creates a style attribute with a columnGap property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function columnGap(v) { return new CssProp("columnGap", v); }

/**
 * Creates a style attribute with a display property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function display(v) { return new CssProp("display", v); }

/**
 * Creates a style attribute with a flexDirection property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function flexDirection(v) { return new CssProp("flexDirection", v); }

/**
 * Creates a style attribute with a fontFamily property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function fontFamily(v) { return new CssProp("fontFamily", v); }

/**
 * Creates a style attribute with a fontSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function fontSize(v) { return new CssProp("fontSize", v); }

/**
 * Creates a style attribute with a gridArea property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function gridArea(v) { return new CssProp("gridArea", v); }

/**
 * Creates a style attribute with a gridColumn property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function gridColumn(v) { return new CssProp("gridColumn", v); }

/**
 * Creates a style attribute with a gridRow property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function gridRow(v) { return new CssProp("gridRow", v); }

/**
 * Creates a style attribute with a gridTemplateColumns property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function gridTemplateColumns(v) { return new CssProp("gridTemplateColumns", v); }

/**
 * Creates a style attribute with a gridTemplateRows property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function gridTemplateRows(v) { return new CssProp("gridTemplateRows", v); }

/**
 * Creates a style attribute with a height property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function cssHeight(v) { return new CssProp("height", v); }

/**
 * Creates a style attribute with a margin property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function margin(v) { return new CssProp("margin", v); }

/**
 * Creates a style attribute with a marginBottom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function marginBottom(v) { return new CssProp("marginBottom", v); }

/**
 * Creates a style attribute with a overflowY property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function overflowY(v) { return new CssProp("overflowY", v); }

/**
 * Creates a style attribute with a padding property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function padding(v) { return new CssProp("padding", v); }

/**
 * Creates a style attribute with a pointerEvents property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function pointerEvents(v) { return new CssProp("pointerEvents", v); }

/**
 * Creates a style attribute with a textAlign property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function textAlign(v) { return new CssProp("textAlign", v); }

/**
 * Creates a style attribute with a textDecoration property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function textDecoration(v) { return new CssProp("textDecoration", v); }

/**
 * Creates a style attribute with a textTransform property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function textTransform(v) { return new CssProp("textTransform", v); }

/**
 * Creates a style attribute with a touchAction property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function touchAction(v) { return new CssProp("touchAction", v); }

/**
 * Creates a style attribute with a width property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function cssWidth(v) { return new CssProp("width", v); }

/**
 * Creates a style attribute with a zIndex property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
function zIndex(v) { return new CssProp("zIndex", v); }


// A selection of fonts for preferred monospace rendering.
const monospaceFonts = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
const monospaceFamily = fontFamily(monospaceFonts);
// A selection of fonts that should match whatever the user's operating system normally uses.
const systemFonts = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
const systemFamily = fontFamily(systemFonts);

/**
 * A setter functor for HTML element events.
 **/
class HtmlEvt {
    /**
     * Creates a new setter functor for an HTML element event.
     * @param {string} name - the name of the event to attach to.
     * @param {Function} callback - the callback function to use with the event handler.
     * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
     */
    constructor(name, callback, opts) {
        if (!isFunction(callback)) {
            throw new Error("A function instance is required for this parameter");
        }

        this.name = name;
        this.callback = callback;
        this.opts = opts;
        Object.freeze(this);
    }

    /**
     * Add the encapsulate callback as an event listener to the give HTMLElement
     * @param {HTMLElement} elem
     */
    add(elem) {
        elem.addEventListener(this.name, this.callback, this.opts);
    }

    /**
     * Remove the encapsulate callback as an event listener from the give HTMLElement
     * @param {HTMLElement} elem
     */
    remove(elem) {
        elem.removeEventListener(this.name, this.callback);
    }
}

/**
 * The click event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
function onClick(callback, opts) { return new HtmlEvt("click", callback, opts); }

/**
 * The input event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
function onInput(callback, opts) { return new HtmlEvt("input", callback, opts); }

/**
 * The keyup event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
function onKeyUp(callback, opts) { return new HtmlEvt("keyup", callback, opts); }

/**
 * The mouseout event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
function onMouseOut(callback, opts) { return new HtmlEvt("mouseout", callback, opts); }

/**
 * The mouseover event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
function onMouseOver(callback, opts) { return new HtmlEvt("mouseover", callback, opts); }

/**
 * Constructs a CSS grid area definition.
 * @param {number} x - the starting horizontal cell for the element.
 * @param {number} y - the starting vertical cell for the element.
 * @param {number} [w=null] - the number of cells wide the element should cover.
 * @param {number} [h=null] - the number of cells tall the element should cover.
 * @returns {CssProp}
 */
function gridPos(x, y, w = null, h = null) {
    if (w === null) {
        w = 1;
    }
    if (h === null) {
        h = 1;
    }
    return gridArea(`${y}/${x}/${y + h}/${x + w}`);
}
/**
 * Constructs a CSS grid column definition
 * @param {number} x - the starting horizontal cell for the element.
 * @param {number} [w=null] - the number of cells wide the element should cover.
 * @returns {CssProp}
 */
function col(x, w = null) {
    if (w === null) {
        w = 1;
    }
    return gridColumn(`${x}/${x + w}`);
}
/**
 * Constructs a CSS grid row definition
 * @param {number} y - the starting vertical cell for the element.
 * @param {number} [h=null] - the number of cells tall the element should cover.
 * @returns {CssProp}
 */
function row(y, h = null) {
    if (h === null) {
        h = 1;
    }
    return gridRow(`${y}/${y + h}`);
}
/**
 * Create the gridTemplateColumns and gridTemplateRows styles.
 * @param {string[]} cols
 * @param {string[]} rows
 * @returns {CssPropSet}
 */
function gridDef(cols, rows) {
    return styles(
        gridColsDef(...cols),
        gridRowsDef(...rows));
}

const displayGrid = display("grid");

/**
 * Create the gridTemplateColumns style attribute, with display set to grid.
 * @param {...string} cols
 * @returns {CssPropSet}
 */
function gridColsDef(...cols) {
    return styles(
        displayGrid,
        gridTemplateColumns(cols.join(" ")));
}
/**
 * Create the gridTemplateRows style attribute, with display set to grid.
 * @param {...string} rows
 * @returns {CssPropSet}
 */
function gridRowsDef(...rows) {
    return styles(
        displayGrid,
        gridTemplateRows(rows.join(" ")));
}

function isOpen(target) {
    if (target.isOpen) {
        return target.isOpen();
    }
    else {
        return target.style.display !== "none";
    }
}

/**
 * Sets the element's style's display property to "none"
 * when `v` is false, or `displayType` when `v` is true.
 * @memberof Element
 * @param {boolean} v
 * @param {string} [displayType=""]
 */
function setOpen(target, v, displayType = "") {
    if (target.setOpen) {
        target.setOpen(v, displayType);
    }
    else if (v) {
        show(target, displayType);
    }
    else {
        hide(target);
    }
}

function updateLabel(target, open, enabledText, disabledText, bothText) {
    bothText = bothText || "";
    if (target.accessKey) {
        bothText += ` <kbd>(ALT+${target.accessKey.toUpperCase()})</kbd>`;
    }
    if (target.updateLabel) {
        target.updateLabel(open, enabledText, disabledText, bothText);
    }
    else {
        target.innerHTML = (open ? enabledText : disabledText) + bothText;
    }
}

function toggleOpen(target, displayType = "") {
    if (target.toggleOpen) {
        target.toggleOpen(displayType);
    }
    else if (isOpen(target)) {
        hide(target);
    }
    else {
        show(target);
    }
}

function show(target, displayType = "") {
    if (target.show) {
        target.show();
    }
    else {
        target.style.display = displayType;
    }
}

function hide(target) {
    if (target.hide) {
        target.hide();
    }
    else {
        target.style.display = "none";
    }
}
const disabler = disabled(true),
    enabler = disabled(false);

function setLocked(target, value) {
    if (target.setLocked) {
        target.setLocked(value);
    }
    else if (value) {
        disabler.apply(target);
    }
    else {
        enabler.apply(target);
    }
}

/**
 * @typedef {(Element|HtmlAttr|HtmlEvt|string|number|boolean|Date)} TagChild
 **/

/**
 * Creates an HTML element for a given tag name.
 * 
 * Boolean attributes that you want to default to true can be passed
 * as just the attribute creating function, 
 *   e.g. `Audio(autoPlay)` vs `Audio(autoPlay(true))`
 * @param {string} name - the name of the tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
function tag(name, ...rest) {
    const elem = document.createElement(name);

    for (let i = 0; i < rest.length; ++i) {
        // 
        if (isFunction(rest[i])) {
            rest[i] = rest[i](true);
        }
    }

    for (let x of rest) {
        if (x !== null && x !== undefined) {
            if (isString(x)
                || isNumber(x)
                || isBoolean(x)
                || x instanceof Date) {
                elem.appendChild(document.createTextNode(x));
            }
            else if (x instanceof Element) {
                elem.appendChild(x);
            }
            else if (x instanceof HtmlCustomTag) {
                elem.appendChild(x.element);
            }
            else if (x instanceof HtmlAttr
                || x instanceof CssProp
                || x instanceof CssPropSet) {
                x.apply(elem);
            }
            else if (x instanceof HtmlEvt) {
                x.add(elem);
            }
            else {
                console.trace(`Skipping ${x}: unsupported value type.`, x);
            }
        }
    }

    return elem;
}

/**
 * A pseudo-element that is made out of other elements.
 **/
class HtmlCustomTag extends EventBase {
    /**
     * Creates a new pseudo-element
     * @param {string} tagName - the type of tag that will contain the elements in the custom tag.
     * @param {...TagChild} rest - optional attributes, child elements, and text
     */
    constructor(tagName, ...rest) {
        super();
        if (rest.length === 1
            && rest[0] instanceof Element) {
            /** @type {HTMLElement} */
            this.element = rest[0];
        }
        else {
            /** @type {HTMLElement} */
            this.element = tag(tagName, ...rest);
        }
    }

    /**
     * Gets the ID attribute of the container element.
     * @type {string}
     **/
    get id() {
        return this.element.id;
    }

    /**
     * Retrieves the desired element for attaching events.
     * @returns {HTMLElement}
     **/
    get eventTarget() {
        return this.element;
    }

    /**
     * Determine if an event type should be forwarded to the container element.
     * @param {string} name
     * @returns {boolean}
     */
    isForwardedEvent(name) {
        return true;
    }

    /**
     * Adds an event listener to the container element.
     * @param {string} name - the name of the event to attach to.
     * @param {Function} callback - the callback function to use with the event handler.
     * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
     */
    addEventListener(name, callback, opts) {
        if (this.isForwardedEvent(name)) {
            this.eventTarget.addEventListener(name, callback, opts);
        }
        else {
            super.addEventListener(name, callback, opts);
        }
    }

    /**
     * Removes an event listener from the container element.
     * @param {string} name - the name of the event to attach to.
     * @param {Function} callback - the callback function to use with the event handler.
     */
    removeEventListener(name, callback) {
        if (this.isForwardedEvent(name)) {
            this.eventTarget.removeEventListener(name, callback);
        }
        else {
            super.removeEventListener(name, callback);
        }
    }

    /**
     * Gets the style attribute of the underlying select box.
     * @type {ElementCSSInlineStyle}
     */
    get style() {
        return this.element.style;
    }

    get tagName() {
        return this.element.tagName;
    }

    get disabled() {
        return this.element.disabled;
    }

    set disabled(v) {
        this.element.disabled = v;
    }

    /**
     * Moves cursor focus to the underyling element.
     **/
    focus() {
        this.element.focus();
    }

    /**
     * Removes cursor focus from the underlying element.
     **/
    blur() {
        this.element.blur();
    }
}

/**
 * An input box that has a label attached to it.
 **/
class LabeledInputTag extends HtmlCustomTag {
    /**
     * Creates an input box that has a label attached to it.
     * @param {string} id - the ID to use for the input box
     * @param {string} inputType - the type to use for the input box (number, text, etc.)
     * @param {string} labelText - the text to display in the label
     * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
     * @returns {LabeledInputTag}
     */
    constructor(id, inputType, labelText, ...rest) {
        super("div");

        this.label = Label(
            htmlFor(id),
            labelText);

        this.input = Input(
            type(inputType),
            ...rest);

        this.element.append(
            this.label,
            this.input);

        Object.seal(this);
    }

    /**
     * Retrieves the desired element for attaching events.
     * @returns {HTMLElement}
     **/
    get eventTarget() {
        return this.input;
    }

    /**
     * Gets the value attribute of the input element
     * @type {string}
     */
    get value() {
        return this.input.value;
    }

    /**
     * Sets the value attribute of the input element
     * @param {string} v
     */
    set value(v) {
        this.input.value = v;
    }

    /**
     * Gets whether or not the input element is checked, if it's a checkbox or radio button.
     * @type {boolean}
     */
    get checked() {
        return this.input.checked;
    }

    /**
     * Sets whether or not the input element is checked, if it's a checkbox or radio button.
     * @param {boolean} v
     */
    set checked(v) {
        this.input.checked = v;
    }

    /**
     * Sets whether or not the input element should be disabled.
     * @param {boolean} value
     */
    setLocked(value) {
        setLocked(this.input, value);
    }
}

class LabeledSelectBoxTag extends HtmlCustomTag {
    /**
     * Creates a select box that can bind to collections, with a label set on the side.
     * @param {string} tagId - the ID to use for the select box.
     * @param {any} labelText - the text to put in the label.
     * @param {string} noSelectionText - the text to display when no items are available.
     * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
     * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
     * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
     */
    constructor(tagId, labelText, noSelectionText, makeID, makeLabel, ...rest) {
        super("div");

        this.label = Label(
            htmlFor(tagId),
            labelText);

        /** @type {SelectBox} */
        this.select = new SelectBox(noSelectionText, makeID, makeLabel, id(tagId), ...rest);

        this.element.append(
            this.label,
            this.select.element);

        Object.seal(this);
    }

    /**
     * Retrieves the desired element for attaching events.
     * @returns {HTMLElement}
     **/
    get eventTarget() {
        return this.select;
    }

    /**
     * Gets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @type {boolean}
     **/
    get emptySelectionEnabled() {
        return this.select.emptySelectionEnabled;
    }

    /**
     * Sets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @param {boolean} value
     **/
    set emptySelectionEnabled(value) {
        this.select.emptySelectionEnabled = value;
    }

    /**
     * Gets the collection to which the select box was databound
     **/
    get values() {
        return this.select.values;
    }

    /**
     * Sets the collection to which the select box will be databound
     **/
    set values(values) {
        this.select.values = values;
    }

    /**
     * Returns the collection of HTMLOptionElements that are stored in the select box
     * @type {HTMLOptionsCollection}
     */
    get options() {
        return this.select.options;
    }

    /**
     * Gets the index of the item that is currently selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
     * @type {number}
     */
    get selectedIndex() {
        return this.select.selectedIndex;
    }
    /**
    * Sets the index of the item that should be selected in the select box.
    * The index is offset by -1 if the select box has `emptySelectionEnabled`
    * set to true, so that the indices returned are always in range of the collection
    * to which the select box was databound
    * @param {number} i
    */
    set selectedIndex(i) {
        this.select.selectedIndex = i;
    }

    /**
     * Gets the item at `selectedIndex` in the collection to which the select box was databound
     * @type {any}
     */
    get selectedValue() {
        return this.select.selectedValue;
    }
    /**
    * Gets the index of the given item in the select box's databound collection, then
    * sets that index as the `selectedIndex`.
     * @param {any) value
    */
    set selectedValue(v) {
        this.select.selectedValue = v;
    }

    /**
     * Returns the index of the given item in the select box's databound collection.
     * @param {any} value
     * @returns {number}
     */
    indexOf(value) {
        return this.select.indexOf(value);
    }

    /**
     * Checks to see if the value exists in the databound collection.
     * @param {any} value
     * @returns {boolean}
     */
    contains(value) {
        return this.select.contains(value);
    }
}

const selectEvt = new Event("select");

/**
 * A panel and a button that opens it.
 **/
class OptionPanelTag extends HtmlCustomTag {

    /**
     * Creates a new panel that can be opened with a button click, 
     * living in a collection of panels that will be hidden when
     * this panel is opened.
     * @param {string} panelID - the ID to use for the panel element.
     * @param {string} name - the text to use on the button.
     * @param {...any} rest
     */
    constructor(panelID, name, ...rest) {
        super("div",
            id(panelID),
            padding("1em"),
            P(...rest));

        this.button = Button(
            id(panelID + "Btn"),
            onClick(() => this.dispatchEvent(selectEvt)),
            name);
    }

    isForwardedEvent(name) {
        return name !== "select";
    }

    /**
     * Gets whether or not the panel is visible
     * @type {boolean}
     **/
    get visible() {
        return this.element.style.display !== null;
    }

    /**
     * Sets whether or not the panel is visible
     * @param {boolean} v
     **/
    set visible(v) {
        setOpen(this.element, v);
        styles(
            borderStyle("solid"),
            borderWidth("2px"),
            backgroundColor(v ? "#ddd" : "transparent"),
            borderTop(v ? "" : "none"),
            borderRight(v ? "" : "none"),
            borderBottomColor(v ? "#ddd" : ""),
            borderLeft(v ? "" : "none"))
            .apply(this.button);
    }
}

const disabler$1 = disabled(true),
    enabler$1 = disabled(false);

/** @type {WeakMap<SelectBoxTag, any[]>} */
const values = new WeakMap();

function render(self) {
    clear(self.element);
    if (self.values.length === 0) {
        self.element.append(Option(self.noSelectionText));
        disabler$1.apply(self.element);
    }
    else {
        if (self.emptySelectionEnabled) {
            self.element.append(Option(self.noSelectionText));
        }
        for (let v of self.values) {
            self.element.append(
                Option(
                    value(self.makeID(v)),
                    self.makeLabel(v)));
        }

        enabler$1.apply(self.element);
    }
}

/**
 * A select box that can be databound to collections.
 **/
class SelectBoxTag extends HtmlCustomTag {

    /**
     * Creates a select box that can bind to collections
     * @param {string} noSelectionText - the text to display when no items are available.
     * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
     * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
     * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
     */
    constructor(noSelectionText, makeID, makeLabel, ...rest) {
        super("select", ...rest);

        if (!isFunction(makeID)) {
            throw new Error("makeID parameter must be a Function");
        }

        if (!isFunction(makeLabel)) {
            throw new Error("makeLabel parameter must be a Function");
        }

        this.noSelectionText = noSelectionText;
        this.makeID = (v) => v !== null && makeID(v) || null;
        this.makeLabel = (v) => v !== null && makeLabel(v) || "None";
        this.emptySelectionEnabled = true;

        Object.seal(this);
    }

    /**
     * Gets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @type {boolean}
     **/
    get emptySelectionEnabled() {
        return this._emptySelectionEnabled;
    }

    /**
     * Sets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @param {boolean} value
     **/
    set emptySelectionEnabled(value) {
        this._emptySelectionEnabled = value;
        render(this);
    }

    /**
     * Gets the collection to which the select box was databound
     **/
    get values() {
        if (!values.has(this)) {
            values.set(this, []);
        }
        return values.get(this);
    }

    /**
     * Sets the collection to which the select box will be databound
     **/
    set values(newItems) {
        const curValue = this.selectedValue;
        const values = this.values;
        values.splice(0, values.length, ...newItems);
        render(this);
        this.selectedValue = curValue;
    }

    /**
     * Returns the collection of HTMLOptionElements that are stored in the select box
     * @type {HTMLOptionsCollection}
     */
    get options() {
        return this.element.options;
    }

    /**
     * Gets the index of the item that is currently selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
     * @type {number}
     */
    get selectedIndex() {
        let i = this.element.selectedIndex;
        if (this.emptySelectionEnabled) {
            --i;
        }
        return i;
    }

    /**
     * Sets the index of the item that should be selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
     * @param {number} i
     */
    set selectedIndex(i) {
        if (this.emptySelectionEnabled) {
            ++i;
        }
        this.element.selectedIndex = i;
    }

    /**
     * Gets the item at `selectedIndex` in the collection to which the select box was databound
     * @type {any}
     */
    get selectedValue() {
        if (0 <= this.selectedIndex && this.selectedIndex < this.values.length) {
            return this.values[this.selectedIndex];
        }
        else {
            return null;
        }
    }

    /**
     * Gets the index of the given item in the select box's databound collection, then
     * sets that index as the `selectedIndex`.
     * @param {any) value
     */
    set selectedValue(value) {
        this.selectedIndex = this.indexOf(value);
    }

    /**
     * Returns the index of the given item in the select box's databound collection.
     * @param {any} value
     * @returns {number}
     */
    indexOf(value) {
        return this.values
            .findIndex(v =>
                value !== null
                && this.makeID(value) === this.makeID(v));
    }

    /**
     * Checks to see if the value exists in the databound collection.
     * @param {any} value
     * @returns {boolean}
     */
    contains(value) {
        return this.indexOf(value) >= 0.
    }
}

/**
 * Empty an element of all children. This is faster than
 * setting `innerHTML = ""`.
 * @param {any} elem
 */
function clear(elem) {
    while (elem.lastChild) {
        elem.lastChild.remove();
    }
}

/**
 * creates an HTML A tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLAnchorElement}
 */
function A(...rest) { return tag("a", ...rest); }

/**
 * creates an HTML HtmlButton tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLButtonElement}
 */
function ButtonRaw(...rest) { return tag("button", ...rest); }

/**
 * creates an HTML Button tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLButtonElement}
 */
function Button(...rest) { return ButtonRaw(...rest, type("button")); }

/**
 * creates an HTML Canvas tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLCanvasElement}
 */
function Canvas(...rest) { return tag("canvas", ...rest); }

/**
 * creates an HTML Div tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDivElement}
 */
function Div(...rest) { return tag("div", ...rest); }

/**
 * creates an HTML H1 tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
function H1(...rest) { return tag("h1", ...rest); }

/**
 * creates an HTML H2 tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
function H2(...rest) { return tag("h2", ...rest); }

/**
 * creates an HTML Img tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLImageElement}
 */
function Img(...rest) { return tag("img", ...rest); }

/**
 * creates an HTML Input tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
function Input(...rest) { return tag("input", ...rest); }

/**
 * creates an HTML Input tag that is a URL entry field.
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
function InputURL(...rest) { return Input(type("url"), ...rest) }

/**
 * creates an HTML Label tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLLabelElement}
 */
function Label(...rest) { return tag("label", ...rest); }

/**
 * creates an HTML LI tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLLIElement}
 */
function LI(...rest) { return tag("li", ...rest); }

/**
 * creates an HTML Option tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLOptionElement}
 */
function Option(...rest) { return tag("option", ...rest); }

/**
 * creates an HTML P tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLParagraphElement}
 */
function P(...rest) { return tag("p", ...rest); }

/**
 * creates an HTML Span tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLSpanElement}
 */
function Span(...rest) { return tag("span", ...rest); }

/**
 * creates an HTML UL tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLUListElement}
 */
function UL(...rest) { return tag("ul", ...rest); }

/**
 * creates an HTML Video tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLVideoElement}
 */
function Video(...rest) { return tag("video", ...rest); }

/**
 * Creates an offscreen canvas element, if they are available. Otherwise, returns an HTMLCanvasElement.
 * @param {number} w - the width of the canvas
 * @param {number} h - the height of the canvas
 * @param {...TagChild} rest - optional HTML attributes and child elements, to use in constructing the HTMLCanvasElement if OffscreenCanvas is not available.
 * @returns {OffscreenCanvas|HTMLCanvasElement}
 */
function CanvasOffscreen(w, h, ...rest) {
    if (window.OffscreenCanvas) {
        return new OffscreenCanvas(w, h);
    }
    else {
        return Canvas(...rest, width(w), height(h));
    }
}

/**
 * Creates an input box that has a label attached to it.
 * @param {string} id - the ID to use for the input box
 * @param {string} inputType - the type to use for the input box (number, text, etc.)
 * @param {string} labelText - the text to display in the label
 * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
 * @returns {LabeledInputTag}
 */
function LabeledInput(id, inputType, labelText, ...rest) {
    return new LabeledInputTag(id, inputType, labelText, ...rest);
}

/**
 * Creates a string from a list item to use as the item's ID or label in a select box.
 * @callback makeItemValueCallback
 * @param {any} obj - the object
 * @returns {string}
 */

/**
 * Creates a select box that can bind to collections
 * @param {string} noSelectionText - the text to display when no items are available.
 * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
 * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
 * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
 * @returns {SelectBoxTag}
 */
function SelectBox(noSelectionText, makeID, makeLabel, ...rest) {
    return new SelectBoxTag(noSelectionText, makeID, makeLabel, ...rest);
}

/**
 * Creates a select box, with a label attached to it, that can bind to collections
 * @param {string} id - the ID to use for the input box
 * @param {string} labelText - the text to display in the label
 * @param {string} noSelectionText - the text to display when no items are available.
 * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
 * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
 * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
 * @returns {LabeledSelectBoxTag}
 */
function LabeledSelectBox(id, labelText, noSelectionText, makeID, makeLabel, ...rest) {
    return new LabeledSelectBoxTag(id, labelText, noSelectionText, makeID, makeLabel, ...rest);
}

/**
 * Creates an OptionPanelTag element
 * @param {string} id - the ID to use for the content element of the option panel
 * @param {string} name - the text to use in the button that triggers displaying the content element
 * @param {...TagChild} rest - optional attributes, child elements, and text to use on the content element
 */
function OptionPanel(id, name, ...rest) {
    return new OptionPanelTag(id, name, ...rest);
}

/**
 * Creates a Div element with margin: auto.
 * @param {...any} rest
 * @returns {HTMLDivElement}
 */
function Run(...rest) {
    return Div(
        margin("auto"),
        ...rest);
}

const hiddenEvt = new Event("hidden"),
    shownEvt = new Event("shown");

class FormDialog extends EventBase {
    constructor(name, header) {
        super();

        const formStyle = styles(
            gridDef(
                ["5fr", "1fr", "1fr"],
                ["auto", "auto", "1fr", "auto", "auto"]),
            overflowY("hidden"));

        this.element = document.getElementById(name) ||
            Div(
                id(name),
                className("dialog"),
                Div(
                    gridColsDef("1fr", "auto"),
                    col(1, 3),
                    H1(
                        col(1),
                        margin("0"),
                        header),
                    Button(
                        col(2),
                        padding("1em"),
                        close.value,
                        onClick(() =>
                            hide(this)))));

        formStyle.apply(this.element);

        this.header = this.element.querySelector(".header")
            || this.element.appendChild(Div(className("header")));

        gridPos(1, 2, 3, 1).apply(this.header);

        this.content = this.element.querySelector(".content")
            || this.element.appendChild(Div(className("content")));

        styles(
            gridPos(1, 3, 3, 1),
            overflowY("scroll"))
            .apply(this.content);

        this.footer = this.element.querySelector(".footer")
            || this.element.appendChild(Div(className("footer")));

        styles(
            gridPos(1, 4, 3, 1),
            display("flex"),
            flexDirection("row-reverse"))
            .apply(this.footer);
    }

    get tagName() {
        return this.element.tagName;
    }

    get disabled() {
        return this.element.disabled;
    }

    set disabled(v) {
        this.element.disabled = v;
    }

    get style() {
        return this.element.style;
    }

    appendChild(child) {
        return this.element.appendChild(child);
    }

    append(...rest) {
        this.element.append(...rest);
    }

    show() {
        show(this.element, "grid");
        this.dispatchEvent(shownEvt);
    }

    async showAsync() {
        show(this);
        await once(this, "hidden");
    }

    hide() {
        hide(this.element);
        this.dispatchEvent(hiddenEvt);
    }
}

const headerStyle = styles(
    textDecoration("none"),
    color("black"),
    textTransform("capitalize"));
const buttonStyle = styles(
    fontSize("200%"),
    cssWidth("2em"));

const disabler$2 = disabled(true),
    enabler$2 = disabled(false);

const cancelEvt = new Event("emojiCanceled");

class EmojiForm extends FormDialog {
    constructor() {
        super("emoji", "Emoji");

        this.header.append(
            H2("Recent"),
            this.recent = P("(None)"));

        const previousEmoji = [],
            allAlts = [];

        let selectedEmoji = null,
            idCounter = 0;

        const closeAll = () => {
            for (let alt of allAlts) {
                hide(alt);
            }
        };

        function combine(a, b) {
            let left = a.value;

            let idx = left.indexOf(emojiStyle.value);
            if (idx === -1) {
                idx = left.indexOf(textStyle.value);
            }
            if (idx >= 0) {
                left = left.substring(0, idx);
            }

            return {
                value: left + b.value,
                desc: a.desc + "/" + b.desc
            };
        }

        /**
         * 
         * @param {EmojiGroup} group
         * @param {HTMLElement} container
         * @param {boolean} isAlts
         */
        const addIconsToContainer = (group, container, isAlts) => {
            const alts = group.alts || group;
            for (let icon of alts) {
                const btn = Button(
                    title(icon.desc),
                    buttonStyle,
                    onClick((evt) => {
                        selectedEmoji = selectedEmoji && evt.ctrlKey
                            ? combine(selectedEmoji, icon)
                            : icon;
                        this.preview.innerHTML = `${selectedEmoji.value} - ${selectedEmoji.desc}`;
                        enabler$2.apply(this.confirmButton);

                        if (alts) {
                            toggleOpen(alts);
                            btn.innerHTML = icon.value + (isOpen(alts) ? "-" : "+");
                        }
                    }), icon.value);

                let alts = null;

                /** @type {HTMLUListElement|HTMLSpanElement} */
                let g = null;

                if (isAlts) {
                    btn.id = `emoji-with-alt-${idCounter++}`;
                    g = UL(
                        LI(btn,
                            Label(htmlFor(btn.id),
                                icon.desc)));
                }
                else {
                    g = Span(btn);
                }

                if (icon.alts) {
                    alts = Div();
                    allAlts.push(alts);
                    addIconsToContainer(icon, alts, true);
                    hide(alts);
                    g.appendChild(alts);
                    btn.style.width = "3em";
                    btn.innerHTML += "+";
                }

                if (icon.width) {
                    btn.style.width = icon.width;
                }

                if (icon.color) {
                    btn.style.color = icon.color;
                }

                container.appendChild(g);
            }
        };

        for (let group of Object.values(allIcons)) {
            if (group instanceof EmojiGroup) {
                const header = H1(),
                    container = P(),
                    headerButton = A(
                        href("javascript:undefined"),
                        title(group.desc),
                        headerStyle,
                        onClick(() => {
                            toggleOpen(container);
                            headerButton.innerHTML = group.value + (isOpen(container) ? " -" : " +");
                        }),
                        group.value + " -");

                addIconsToContainer(group, container);
                header.appendChild(headerButton);
                this.content.appendChild(header);
                this.content.appendChild(container);
            }
        }

        this.footer.append(

            this.confirmButton = Button(className("confirm"),
                "OK",
                onClick(() => {
                    const idx = previousEmoji.indexOf(selectedEmoji);
                    if (idx === -1) {
                        previousEmoji.push(selectedEmoji);
                        this.recent.innerHTML = "";
                        addIconsToContainer(previousEmoji, this.recent);
                    }

                    this.dispatchEvent(new EmojiSelectedEvent(selectedEmoji));
                    hide(this);
                })),

            Button(className("cancel"),
                "Cancel",
                onClick(() => {
                    disabler$2.apply(this.confirmButton);
                    this.dispatchEvent(cancelEvt);
                    hide(this);
                })),

            this.preview = Span(gridPos(1, 4, 3, 1)));

        disabler$2.apply(this.confirmButton);

        this.selectAsync = () => {
            return new Promise((resolve, reject) => {
                let yes = null,
                    no = null;

                const done = () => {
                    this.removeEventListener("emojiSelected", yes);
                    this.removeEventListener("emojiCanceled", no);
                    this.removeEventListener("hidden", no);
                };

                yes = (evt) => {
                    done();
                    try {
                        resolve(evt.emoji);
                    }
                    catch (exp) {
                        reject(exp);
                    }
                };

                no = () => {
                    done();
                    resolve(null);
                };

                this.addEventListener("emojiSelected", yes);
                this.addEventListener("emojiCanceled", no);
                this.addEventListener("hidden", no);

                closeAll();
                show(this);
            });
        };
    }
}

class EmojiSelectedEvent extends Event {
    constructor(emoji) {
        super("emojiSelected");
        this.emoji = emoji;
    }
}

const toggleAudioEvt = new Event("toggleAudio"),
    toggleVideoEvt = new Event("toggleVideo"),
    emoteEvt = new Event("emote"),
    selectEmojiEvt = new Event("selectEmoji"),
    subelStyle = styles(
        fontSize("1.25em"),
        cssWidth("3em"),
        cssHeight("100%")),
    pointerEventsAll = pointerEvents("all"),
    subButtonStyle = styles(
        fontSize("1.25em"),
        cssHeight("100%")),
    buttonLabelStyle = fontSize("12px");

class FooterBar extends EventBase {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        /** @type {HTMLButtonElement} */
        this.muteAudioButton = null;

        this.element = Div(
            id("footbar"),
            gridColsDef("auto", "1fr", "auto"),
            padding("4px"),
            cssWidth("100%"),
            columnGap("5px"),
            backgroundColor("transparent"),
            pointerEvents("none"),

            Button(
                title("Toggle audio mute/unmute"),
                onClick(_(toggleAudioEvt)),
                gridPos(1, 1),
                subelStyle,
                pointerEventsAll,
                this.muteAudioButton = Run(speakerHighVolume.value),
                Run(buttonLabelStyle, "Audio")),

            this.emojiControl = Span(
                gridPos(2, 1),
                textAlign("center"),
                subButtonStyle,
                Button(
                    title("Emote"),
                    onClick(_(emoteEvt)),
                    subButtonStyle,
                    pointerEventsAll,
                    borderRight("none"),
                    this.emoteButton = Run(whiteFlower.value),
                    Run(buttonLabelStyle, "Emote")),
                Button(
                    title("Select Emoji"),
                    onClick(_(selectEmojiEvt)),
                    subButtonStyle,
                    pointerEventsAll,
                    borderLeft("none"),
                    Run(upwardsButton.value),
                    Run(buttonLabelStyle, "Change"))),


            Button(
                title("Toggle video mute/unmute"),
                onClick(_(toggleVideoEvt)),
                gridPos(3, 1),
                subelStyle,
                pointerEventsAll,
                this.muteVideoButton = Run(noMobilePhone.value),
                Run(buttonLabelStyle, "Video")));

        this._audioEnabled = true;
        this._videoEnabled = false;

        Object.seal(this);
    }

    get enabled() {
        return !this.muteAudioButton.disabled;
    }

    set enabled(v) {
        for (let button of this.element.querySelectorAll("button")) {
            button.disabled = !v;
        }
    }

    get audioEnabled() {
        return this._audioEnabled;
    }

    set audioEnabled(value) {
        this._audioEnabled = value;
        updateLabel(
            this.muteAudioButton,
            value,
            speakerHighVolume.value,
            mutedSpeaker.value);
    }

    get videoEnabled() {
        return this._videoEnabled;
    }

    set videoEnabled(value) {
        this._videoEnabled = value;
        updateLabel(
            this.muteVideoButton,
            value,
            videoCamera.value,
            noMobilePhone.value);
    }

    setEmojiButton(key, emoji) {
        this.emoteButton.innerHTML = emoji.value;
    }
}

const toggleOptionsEvt = new Event("toggleOptions"),
    tweetEvt = new Event("tweet"),
    leaveEvt = new Event("leave"),
    toggleFullscreenEvt = new Event("toggleFullscreen"),
    toggleInstructionsEvt = new Event("toggleInstructions"),
    toggleUserDirectoryEvt = new Event("toggleUserDirectory"),
    subelStyle$1 = styles(
        pointerEvents("all"),
        fontSize("1.25em"),
        cssWidth("3em"),
        cssHeight("100%")),
    buttonLabelStyle$1 = fontSize("12px");

class HeaderBar extends EventBase {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.element = Div(
            id("headbar"),
            gridColsDef("auto", "auto", "auto", "auto", "1fr", "auto", "auto"),
            padding("4px"),
            cssWidth("100%"),
            columnGap("5px"),
            backgroundColor("transparent"),
            pointerEvents("none"),

            this.optionsButton = Button(
                title("Show/hide options"),
                onClick(_(toggleOptionsEvt)),
                subelStyle$1,
                gridPos(1, 1),
                Run(gear.value),
                Run(buttonLabelStyle$1, "Options")),

            this.instructionsButton = Button(
                title("Show/hide instructions"),
                onClick(_(toggleInstructionsEvt)),
                subelStyle$1,
                gridPos(2, 1),
                Run(questionMark.value),
                Run(buttonLabelStyle$1, "Info")),

            Button(
                title("Share your current room to twitter"),
                onClick(_(tweetEvt)),
                subelStyle$1,
                gridPos(3, 1),
                Img(src("https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png"),
                    alt("icon"),
                    role("presentation"),
                    cssHeight("25px"),
                    marginBottom("-7px")),
                Run(buttonLabelStyle$1, "Tweet")),

            Button(
                title("View user directory"),
                onClick(_(toggleUserDirectoryEvt)),
                subelStyle$1,
                gridPos(4, 1),
                Run(speakingHead.value),
                Run(buttonLabelStyle$1, "Users")),


            this.fullscreenButton = Button(
                title("Toggle fullscreen"),
                onClick(_(toggleFullscreenEvt)),
                onClick(() => this.isFullscreen = !this.isFullscreen),
                subelStyle$1,
                gridPos(6, 1),
                Run(squareFourCourners.value),
                Run(buttonLabelStyle$1, "Expand")),


            Button(
                title("Leave the room"),
                onClick(_(leaveEvt)),
                subelStyle$1,
                gridPos(7, 1),
                Run(door.value),
                Run(buttonLabelStyle$1, "Leave")));

        Object.seal(this);
    }

    get isFullscreen() {
        return document.fullscreenElement !== null;
    }

    set isFullscreen(value) {
        if (value) {
            document.body.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
        updateLabel(
            this.fullscreenButton,
            value,
            downRightArrow.value,
            squareFourCourners.value);
    }

    get enabled() {
        return !this.instructionsButton.disabled;
    }

    set enabled(v) {
        for (let button of this.element.querySelectorAll("button")) {
            button.disabled = !v;
        }
    }
}

const defaultRooms = new Map([
    ["calla", "Calla"],
    ["island", "Island"],
    ["alxcc", "Alexandria Code & Coffee"],
    ["vurv", "Vurv"]]);

/** @type {WeakMap<LoginForm, LoginFormPrivate>} */
const selfs = new WeakMap();

class LoginFormPrivate {
    constructor(parent) {
        this.ready = false;
        this.connecting = false;
        this.connected = false;

        this.parent = parent;
    }

    validate() {
        const canConnect = this.parent.roomName.length > 0
            && this.parent.userName.length > 0;

        setLocked(
            this.parent.connectButton,
            !this.ready
            || this.connecting
            || this.connected
            || !canConnect);
        this.parent.connectButton.innerHTML =
            this.connected
                ? "Connected"
                : this.connecting
                    ? "Connecting..."
                    : this.ready
                        ? "Connect"
                        : "Loading...";
    }
}

class LoginForm extends FormDialog {
    constructor() {
        super("login", "Login");
        const self = new LoginFormPrivate(this);
        selfs.set(this, self);

        const validate = () => self.validate();

        this.addEventListener("shown", () => self.ready = true);

        this.roomLabel = this.element.querySelector("label[for='roomSelector']");

        this.roomSelect = SelectBox(
            "No rooms available",
            v => v,
            k => defaultRooms.get(k),
            this.element.querySelector("#roomSelector"));
        this.roomSelect.addEventListener("input", validate);
        this.roomSelect.emptySelectionEnabled = false;
        this.roomSelect.values = defaultRooms.keys();
        this.roomSelect.selectedIndex = 0;

        this.roomInput = this.element.querySelector("#roomName");
        this.roomInput.addEventListener("input", validate);
        this.roomInput.addEventListener("keypress", (evt) => {
            if (evt.key === "Enter") {
                this.userNameInput.focus();
            }
        });

        this.userNameInput = this.element.querySelector("#userName");
        this.userNameInput.addEventListener("input", validate);
        this.userNameInput.addEventListener("keypress", (evt) => {
            if (evt.key === "Enter") {
                if (this.userName.length === 0) {
                    this.userNameInput.focus();
                }
                else if (this.roomName.length === 0) {
                    if (this.roomSelectMode) {
                        this.roomSelect.focus();
                    }
                    else {
                        this.roomInput.focus();
                    }
                }
            }
        });

        this.createRoomButton = this.element.querySelector("#createNewRoom");
        this.createRoomButton.addEventListener("click", () => {
            this.roomSelectMode = !this.roomSelectMode;
        });

        this.connectButton = this.element.querySelector("#connect");
        this.addEventListener("login", () => {
            this.connecting = true;
        });

        this.roomSelectMode = true;

        self.validate();
    }

    addEventListener(evtName, callback, options) {
        if (evtName === "login") {
            this.connectButton.addEventListener("click", callback, options);
        }
        else {
            super.addEventListener(evtName, callback, options);
        }
    }

    removeEventListener(evtName, callback) {
        if (evtName === "login") {
            this.connectButton.removeEventListener("click", callback);
        }
        else {
            super.removeEventListener(evtName, callback);
        }
    }

    get roomSelectMode() {
        return this.roomSelect.style.display !== "none";
    }

    set roomSelectMode(value) {
        const self = selfs.get(this);
        setOpen(this.roomSelect, value);
        setOpen(this.roomInput, !value);
        this.createRoomButton.innerHTML = value
            ? "New"
            : "Cancel";

        if (value) {
            this.roomLabel.htmlFor = this.roomSelect.id;
            this.roomSelect.selectedValue = this.roomInput.value.toLocaleLowerCase();
        }
        else if (this.roomSelect.selectedIndex >= 0) {
            this.roomLabel.htmlFor = this.roomInput.id;
            this.roomInput.value = this.roomSelect.selectedValue;
        }

        self.validate();
    }

    get roomName() {
        const room = this.roomSelectMode
            ? this.roomSelect.selectedValue
            : this.roomInput.value;

        return room && room.toLocaleLowerCase() || "";
    }

    set roomName(v) {
        if (v === null
            || v === undefined
            || v.length === 0) {
            v = defaultRooms.keys().next();
        }

        this.roomInput.value = v;
        this.roomSelect.selectedValue = v;
        this.roomSelectMode = this.roomSelect.contains(v);
        selfs.get(this).validate();
    }

    set userName(value) {
        this.userNameInput.value = value;
        selfs.get(this).validate();
    }

    get userName() {
        return this.userNameInput.value;
    }

    get connectButtonText() {
        return this.connectButton.innerText
            || this.connectButton.textContent;
    }

    set connectButtonText(str) {
        this.connectButton.innerHTML = str;
    }

    get ready() {
        const self = selfs.get(this);
        return self.ready;
    }

    set ready(v) {
        const self = selfs.get(this);
        self.ready = v;
        self.validate();
    }

    get connecting() {
        const self = selfs.get(this);
        return self.connecting;
    }

    set connecting(v) {
        const self = selfs.get(this);
        self.connecting = v;
        self.validate();
    }

    get connected() {
        const self = selfs.get(this);
        return self.connected;
    }

    set connected(v) {
        const self = selfs.get(this);
        self.connected = v;
        this.connecting = false;
    }
}

const gamepadStates = new Map();

class EventedGamepad extends EventBase {
    constructor(pad) {
        super();
        if (!(pad instanceof Gamepad)) {
            throw new Error("Value must be a Gamepad");
        }

        this.id = pad.id;
        this.displayId = pad.displayId;

        this.connected = pad.connected;
        this.hand = pad.hand;
        this.pose = pad.pose;

        const self = {
            btnDownEvts: [],
            btnUpEvts: [],
            btnState: [],
            axisMaxed: [],
            axisMaxEvts: [],
            sticks: []
        };

        this.lastButtons = [];
        this.buttons = [];
        this.axes = [];
        this.hapticActuators = [];
        this.axisThresholdMax = 0.9;
        this.axisThresholdMin = 0.1;

        this._isStick = (a) => a % 2 === 0 && a < pad.axes.length - 1;

        for (let b = 0; b < pad.buttons.length; ++b) {
            self.btnDownEvts[b] = Object.assign(new Event("gamepadbuttondown"), {
                button: b
            });
            self.btnUpEvts[b] = Object.assign(new Event("gamepadbuttonup"), {
                button: b
            });
            self.btnState[b] = false;

            this.lastButtons[b] = null;
            this.buttons[b] = pad.buttons[b];
        }

        for (let a = 0; a < pad.axes.length; ++a) {
            self.axisMaxEvts[a] = Object.assign(new Event("gamepadaxismaxed"), {
                axis: a
            });
            self.axisMaxed[a] = false;
            if (this._isStick(a)) {
                self.sticks[a / 2] = { x: 0, y: 0 };
            }

            this.axes[a] = pad.axes[a];
        }

        if (pad.hapticActuators !== undefined) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }

        Object.seal(this);
        gamepadStates.set(this, self);
    }

    dispose() {
        gamepadStates.delete(this);
    }

    update(pad) {
        if (!(pad instanceof Gamepad)) {
            throw new Error("Value must be a Gamepad");
        }

        this.connected = pad.connected;
        this.hand = pad.hand;
        this.pose = pad.pose;

        const self = gamepadStates.get(this);

        for (let b = 0; b < pad.buttons.length; ++b) {
            const wasPressed = self.btnState[b],
                pressed = pad.buttons[b].pressed;
            if (pressed !== wasPressed) {
                self.btnState[b] = pressed;
                this.dispatchEvent((pressed
                    ? self.btnDownEvts
                    : self.btnUpEvts)[b]);
            }

            this.lastButtons[b] = this.buttons[b];
            this.buttons[b] = pad.buttons[b];
        }

        for (let a = 0; a < pad.axes.length; ++a) {
            const wasMaxed = self.axisMaxed[a],
                val = pad.axes[a],
                dir = Math.sign(val),
                mag = Math.abs(val),
                maxed = mag >= this.axisThresholdMax,
                mined = mag <= this.axisThresholdMin;
            if (maxed && !wasMaxed) {
                this.dispatchEvent(self.axisMaxEvts[a]);
            }

            this.axes[a] = dir * (maxed ? 1 : (mined ? 0 : mag));
        }

        for (let a = 0; a < this.axes.length - 1; a += 2) {
            const stick = self.sticks[a / 2];
            stick.x = this.axes[a];
            stick.y = this.axes[a + 1];
        }

        if (pad.hapticActuators !== undefined) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }
    }
}

/**
 * Types of avatars.
 * @enum {string}
 **/
const AvatarMode = Object.freeze({
    none: null,
    emoji: "emoji",
    photo: "photo",
    video: "video"
});

/**
 * A base class for different types of avatars.
 **/
class BaseAvatar {

    /**
     * Encapsulates a resource to use as an avatar.
     * @param {boolean} canSwim
     */
    constructor(canSwim) {
        this.canSwim = canSwim;
        this.element = Canvas(128, 128);
        this.g = this.element.getContext("2d");
    }

    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g - the context to render to
     * @param {number} width - the width the avatar should be rendered at
     * @param {number} height - the height the avatar should be rendered at.
     * @param {boolean} isMe - whether the avatar is the local user
     */
    draw(g, width, height, isMe) {
        const aspectRatio = this.element.width / this.element.height,
            w = aspectRatio > 1 ? width : aspectRatio * height,
            h = aspectRatio > 1 ? width / aspectRatio : height,
            dx = (width - w) / 2,
            dy = (height - h) / 2;
        g.drawImage(
            this.element,
            dx, dy,
            w, h);
    }
}

/**
 * Returns true if the given object is either an HTMLCanvasElement or an OffscreenCanvas.
 * @param {any} obj
 * @returns {boolean}
 */

/**
 * Resizes a canvas element
 * @param {HTMLCanvasElement|OffscreenCanvas} canv
 * @param {number} w - the new width of the canvas
 * @param {number} h - the new height of the canvas
 * @param {number} [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns {boolean} - true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
function setCanvasSize(canv, w, h, superscale = 1) {
    w = Math.floor(w * superscale);
    h = Math.floor(h * superscale);
    if (canv.width != w
        || canv.height != h) {
        canv.width = w;
        canv.height = h;
        return true;
    }
    return false;
}

/**
 * Resizes the canvas element of a given rendering context.
 * 
 * Note: the imageSmoothingEnabled, textBaseline, textAlign, and font 
 * properties of the context will be restored after the context is resized,
 * as these values are usually reset to their default values when a canvas
 * is resized.
 * @param {RenderingContext} ctx
 * @param {number} w - the new width of the canvas
 * @param {number} h - the new height of the canvas
 * @param {number} [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns {boolean} - true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
function setContextSize(ctx, w, h, superscale = 1) {
    const oldImageSmoothingEnabled = ctx.imageSmoothingEnabled,
        oldTextBaseline = ctx.textBaseline,
        oldTextAlign = ctx.textAlign,
        oldFont = ctx.font,
        resized = setCanvasSize(
            ctx.canvas,
            w,
            h,
            superscale);

    if (resized) {
        ctx.imageSmoothingEnabled = oldImageSmoothingEnabled;
        ctx.textBaseline = oldTextBaseline;
        ctx.textAlign = oldTextAlign;
        ctx.font = oldFont;
    }

    return resized;
}

/**
 * Resizes a canvas element to match the proportions of the size of the element in the DOM.
 * @param {HTMLCanvasElement} canv
 * @param {number} [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns {boolean} - true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
function resizeCanvas(canv, superscale = 1) {
    return setCanvasSize(
        canv,
        canv.clientWidth,
        canv.clientHeight,
        superscale);
}

/**
 * @type {WeakMap<TextImage, TextImagePrivate>}
 **/
const selfs$1 = new WeakMap();

class TextImagePrivate {
    /**
     * @param {string} fontFamily
     */
    constructor(fontFamily) {
        /** @type {string} */
        this.fontFamily = fontFamily;

        /** @type {string} */
        this.color = "black";

        /** @type {number} */
        this.fontSize = null;

        /** @type {number} */
        this.scale = 1;

        /** @type {string} */
        this.value = null;

        this.canvas = CanvasOffscreen(10, 10);
        this.g = this.canvas.getContext("2d");
        this.g.textBaseline = "top";
    }

    redraw() {
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.fontFamily
            && this.fontSize
            && this.color
            && this.scale
            && this.value) {
            const fontHeight = this.fontSize * this.scale;
            this.g.font = `${fontHeight}px ${this.fontFamily}`;

            const metrics = this.g.measureText(this.value);
            let dx = 0,
                dy = 0,
                trueWidth = metrics.width,
                trueHeight = fontHeight;
            if (metrics.actualBoundingBoxLeft) {
                dy = metrics.actualBoundingBoxAscent;
                trueWidth = metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft;
                trueHeight = metrics.actualBoundingBoxDescent + metrics.actualBoundingBoxAscent;
            }
            setContextSize(this.g, trueWidth, trueHeight);
            this.g.fillStyle = this.color;
            this.g.fillText(this.value, dx, dy);
        }
    }
}

class TextImage {
    /**
     * @param {string} fontFamily
     */
    constructor(fontFamily) {
        selfs$1.set(this, new TextImagePrivate(fontFamily));
    }

    get width() {
        const self = selfs$1.get(this);
        return self.canvas.width / self.scale;
    }

    get height() {
        const self = selfs$1.get(this);
        return self.canvas.height / self.scale;
    }

    get fontSize() {
        return selfs$1.get(this).fontSize;
    }

    set fontSize(v) {
        if (this.fontSize !== v) {
            const self = selfs$1.get(this);
            self.fontSize = v;
            self.redraw();
        }
    }

    get scale() {
        return selfs$1.get(this).scale;
    }

    set scale(v) {
        if (this.scale !== v) {
            const self = selfs$1.get(this);
            self.scale = v;
            self.redraw();
        }
    }


    get fontFamily() {
        return selfs$1.get(this).fontFamily;
    }

    set fontFamily(v) {
        if (this.fontFamily !== v) {
            const self = selfs$1.get(this);
            self.fontFamily = v;
            self.redraw();
        }
    }

    get color() {
        return selfs$1.get(this).color;
    }

    set color(v) {
        if (this.color !== v) {
            const self = selfs$1.get(this);
            self.color = v;
            self.redraw();
        }
    }

    get value() {
        return selfs$1.get(this).value;
    }

    set value(v) {
        if (this.value !== v) {
            const self = selfs$1.get(this);
            self.value = v;
            self.redraw();
        }
    }

    /**
     *
     * @param {CanvasRenderingContext2D} g - the canvas to which to render the text.
     * @param {number} x
     * @param {number} y
     */
    draw(g, x, y) {
        const self = selfs$1.get(this);
        if (self.canvas.width > 0
            && self.canvas.height > 0) {
            g.drawImage(self.canvas, x, y, this.width, this.height);
        }
    }
}

/**
 * An avatar that uses a Unicode emoji as its representation
 **/
class EmojiAvatar extends BaseAvatar {

    /**
     * Creatse a new avatar that uses a Unicode emoji as its representation.
     * @param {Emoji} emoji
     */
    constructor(emoji) {
        super(isSurfer(emoji));

        this.value = emoji.value;
        this.desc = emoji.desc;

        const emojiText = new TextImage("sans-serif");

        emojiText.color = emoji.color || "black";
        emojiText.fontSize = 256;
        emojiText.value = this.value;
        setContextSize(this.g, emojiText.width, emojiText.height);
        emojiText.draw(this.g, 0, 0);
    }
}

/**
 * An avatar that uses an Image as its representation.
 **/
class PhotoAvatar extends BaseAvatar {

    /**
     * Creates a new avatar that uses an Image as its representation.
     * @param {(URL|string)} url
     */
    constructor(url) {
        super(false);

        const img = new Image();
        img.addEventListener("load", () => {
            const offset = (img.width - img.height) / 2,
                sx = Math.max(0, offset),
                sy = Math.max(0, -offset),
                dim = Math.min(img.width, img.height);
            setContextSize(this.g, dim, dim);
            this.g.drawImage(img,
                sx, sy,
                dim, dim,
                0, 0,
                dim, dim);
        });

        /** @type {string} */
        this.url
            = img.src
            = url && url.href || url;
    }
}

const isFirefox = typeof InstallTrigger !== "undefined";
const isIOS = ["iPad", "iPhone", "iPod"].indexOf(navigator.platform) >= 0;

/**
 * An avatar that uses an HTML Video element as its representation.
 **/
class VideoAvatar extends BaseAvatar {
    /**
     * Creates a new avatar that uses a MediaStream as its representation.
     * @param {MediaStream|HTMLVideoElement} stream
     */
    constructor(stream) {
        super(false);

        let video = null;
        if (stream instanceof HTMLVideoElement) {
            video = stream;
        }
        else if (stream instanceof MediaStream) {
            video = Video(
                autoPlay,
                playsInline,
                muted,
                volume(0),
                srcObject(stream));
        }
        else {
            throw new Error("Can only create a video avatar from an HTMLVideoElement or MediaStream.");
        }

        this.video = video;

        if (!isIOS) {
            video.play();
            once(video, "canplay")
                .then(() => video.play());
        }
    }

    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g - the context to render to
     * @param {number} width - the width the avatar should be rendered at
     * @param {number} height - the height the avatar should be rendered at.
     * @param {boolean} isMe - whether the avatar is the local user
     */
    draw(g, width, height, isMe) {
        if (this.video.videoWidth > 0
            && this.video.videoHeight > 0) {
            const offset = (this.video.videoWidth - this.video.videoHeight) / 2,
                sx = Math.max(0, offset),
                sy = Math.max(0, -offset),
                dim = Math.min(this.video.videoWidth, this.video.videoHeight);
            setContextSize(this.g, dim, dim);
            this.g.save();
            if (isMe) {
                this.g.translate(dim, 0);
                this.g.scale(-1, 1);
            }
            this.g.drawImage(
                this.video,
                sx, sy,
                dim, dim,
                0, 0,
                dim, dim);
            this.g.restore();
        }

        super.draw(g, width, height, isMe);
    }
}

let _getTransform = null;

if (!Object.prototype.hasOwnProperty.call(CanvasRenderingContext2D.prototype, "getTransform")
    && Object.prototype.hasOwnProperty.call(CanvasRenderingContext2D.prototype, "mozCurrentTransform")) {

    class MockDOMMatrix {
        constructor(trans) {
            this.a = trans[0];
            this.b = trans[1];
            this.c = trans[2];
            this.d = trans[3];
            this.e = trans[4];
            this.f = trans[5];
        }

        get is2D() {
            return true;
        }

        get isIdentity() {
            return this.a === 1
                && this.b === 0
                && this.c === 0
                && this.d === 1
                && this.e === 0
                && this.f === 0;
        }

        transformPoint(p) {
            return {
                x: p.x * this.a + p.y * this.c + this.e,
                y: p.x * this.b + p.y * this.d + this.f
            }
        }
    }

    /**
     * @param {CanvasRenderingContext2D} g
     */
    _getTransform = (g) => {
        return new MockDOMMatrix(g.mozCurrentTransform);
    };
}
else {
    /**
     * @param {CanvasRenderingContext2D} g
     */
    _getTransform = (g) => {
        return g.getTransform();
    };
}

function getTransform(g) {
    return _getTransform(g);
}

const POSITION_REQUEST_DEBOUNCE_TIME = 1,
    STACKED_USER_OFFSET_X = 5,
    STACKED_USER_OFFSET_Y = 5,
    eventNames$1 = ["userMoved", "userPositionNeeded"],
    muteAudioIcon = new TextImage("sans-serif"),
    speakerActivityIcon = new TextImage("sans-serif");

muteAudioIcon.value = mutedSpeaker.value;
speakerActivityIcon.value = speakerMediumVolume.value;

class User extends EventBase {
    /**
     * 
     * @param {string} id
     * @param {string} displayName
     * @param {Pose} pose
     * @param {boolean} isMe
     */
    constructor(id, displayName, pose, isMe) {
        super();

        this.id = id;
        this.pose = pose;
        this.label = isMe ? "(Me)" : `(${this.id})`;

        /** @type {AvatarMode} */
        this.setAvatarVideo(null);
        this.avatarImage = null;
        this.avatarEmoji = bust;

        this.audioMuted = false;
        this.videoMuted = true;
        this.isMe = isMe;
        this.isActive = false;
        this.stackUserCount = 1;
        this.stackIndex = 0;
        this.stackAvatarHeight = 0;
        this.stackAvatarWidth = 0;
        this.stackOffsetX = 0;
        this.stackOffsetY = 0;
        this.lastPositionRequestTime = performance.now() / 1000 - POSITION_REQUEST_DEBOUNCE_TIME;
        this.visible = true;
        this.userNameText = new TextImage("sans-serif");
        this.userNameText.color = "white";
        this.userNameText.fontSize = 128;
        this._displayName = null;
        this.displayName = displayName;
        Object.seal(this);
    }

    get x() {
        return this.pose.current.p.x;
    }

    get y() {
        return this.pose.current.p.z;
    }

    get gridX() {
        return this.pose.end.p.x;
    }

    get gridY() {
        return this.pose.end.p.z;
    }

    deserialize(evt) {
        switch (evt.avatarMode) {
            case AvatarMode.emoji:
                this.avatarEmoji = evt.avatarID;
                break;
            case AvatarMode.photo:
                this.avatarImage = evt.avatarID;
                break;
        }
    }

    serialize() {
        return {
            id: this.id,
            avatarMode: this.avatarMode,
            avatarID: this.avatarID
        };
    }

    /**
     * An avatar using a live video.
     * @type {PhotoAvatar}
     **/
    get avatarVideo() {
        return this._avatarVideo;
    }

    /**
     * Set the current video element used as the avatar.
     * @param {MediaStream} stream
     **/
    setAvatarVideo(stream) {
        if (stream instanceof MediaStream) {
            this._avatarVideo = new VideoAvatar(stream);
        }
        else {
            this._avatarVideo = null;
        }
    }

    /**
     * An avatar using a photo
     * @type {string}
     **/
    get avatarImage() {
        return this._avatarImage
            && this._avatarImage.url
            || null;
    }

    /**
     * Set the URL of the photo to use as an avatar.
     * @param {string} url
     */
    set avatarImage(url) {
        if (isString(url)
            && url.length > 0) {
            this._avatarImage = new PhotoAvatar(url);
        }
        else {
            this._avatarImage = null;
        }
    }

    /**
     * An avatar using a Unicode emoji.
     * @type {EmojiAvatar}
     **/
    get avatarEmoji() {
        return this._avatarEmoji;
    }

    /**
     * Set the emoji to use as an avatar.
     * @param {Emoji} emoji
     */
    set avatarEmoji(emoji) {
        if (emoji
            && emoji.value
            && emoji.desc) {
            this._avatarEmoji = new EmojiAvatar(emoji);
        }
        else {
            this._avatarEmoji = null;
        }
    }

    /**
     * Returns the type of avatar that is currently active.
     * @returns {AvatarMode}
     **/
    get avatarMode() {
        if (this._avatarVideo) {
            return AvatarMode.video;
        }
        else if (this._avatarImage) {
            return AvatarMode.photo;
        }
        else if (this._avatarEmoji) {
            return AvatarMode.emoji;
        }
        else {
            return AvatarMode.none;
        }
    }

    /**
     * Returns a serialized representation of the current avatar,
     * if such a representation exists.
     * @returns {string}
     **/
    get avatarID() {
        switch (this.avatarMode) {
            case AvatarMode.emoji:
                return { value: this.avatarEmoji.value, desc: this.avatarEmoji.desc };
            case AvatarMode.photo:
                return this.avatarImage;
            default:
                return null;
        }
    }

    /**
     * Returns the current avatar
     * @returns {BaseAvatar}
     **/
    get avatar() {
        switch (this.avatarMode) {
            case AvatarMode.emoji:
                return this._avatarEmoji;
            case AvatarMode.photo:
                return this._avatarImage;
            case AvatarMode.video:
                return this._avatarVideo;
            default:
                return null;
        }
    }

    addEventListener(evtName, func, opts) {
        if (eventNames$1.indexOf(evtName) === -1) {
            throw new Error(`Unrecognized event type: ${evtName}`);
        }

        super.addEventListener(evtName, func, opts);
    }

    get displayName() {
        return this._displayName || this.label;
    }

    set displayName(name) {
        this._displayName = name;
        this.userNameText.value = this.displayName;
    }

    moveTo(x, y) {
        if (this.isMe) {
            this.moveEvent.x = x;
            this.moveEvent.y = y;
            this.dispatchEvent(this.moveEvent);
        }
    }

    update(map, users) {
        const t = performance.now() / 1000;

        this.stackUserCount = 0;
        this.stackIndex = 0;
        for (let user of users.values()) {
            if (user.gridX === this.gridX
                && user.gridY === this.gridY) {
                if (user.id === this.id) {
                    this.stackIndex = this.stackUserCount;
                }
                ++this.stackUserCount;
            }
        }

        this.stackAvatarWidth = map.tileWidth - (this.stackUserCount - 1) * STACKED_USER_OFFSET_X;
        this.stackAvatarHeight = map.tileHeight - (this.stackUserCount - 1) * STACKED_USER_OFFSET_Y;
        this.stackOffsetX = this.stackIndex * STACKED_USER_OFFSET_X;
        this.stackOffsetY = this.stackIndex * STACKED_USER_OFFSET_Y;
    }

    drawShadow(g, map) {
        const scale = getTransform(g).a,
            x = this.x * map.tileWidth,
            y = this.y * map.tileHeight,
            t = getTransform(g),
            p = t.transformPoint({ x, y });

        this.visible = -map.tileWidth <= p.x
            && p.x < g.canvas.width
            && -map.tileHeight <= p.y
            && p.y < g.canvas.height;

        if (this.visible) {
            g.save();
            {
                g.shadowColor = "rgba(0, 0, 0, 0.5)";
                g.shadowOffsetX = 3 * scale;
                g.shadowOffsetY = 3 * scale;
                g.shadowBlur = 3 * scale;

                this.innerDraw(g, map);
            }
            g.restore();
        }
    }

    drawAvatar(g, map) {
        if (this.visible) {
            g.save();
            {
                this.innerDraw(g, map);
                if (this.isActive && !this.audioMuted) {
                    const height = this.stackAvatarHeight / 2,
                        scale = getTransform(g).a;
                    speakerActivityIcon.fontSize = height;
                    speakerActivityIcon.scale = scale;
                    speakerActivityIcon.draw(g, this.stackAvatarWidth - speakerActivityIcon.width, 0);
                }
            }
            g.restore();
        }
    }

    innerDraw(g, map) {
        g.translate(
            this.x * map.tileWidth + this.stackOffsetX,
            this.y * map.tileHeight + this.stackOffsetY);
        g.fillStyle = "black";
        g.textBaseline = "top";

        if (this.avatar) {
            this.avatar.draw(g, this.stackAvatarWidth, this.stackAvatarHeight, this.isMe);
        }

        if (this.audioMuted || !this.videoMuted) {

            const height = this.stackAvatarHeight / 2,
                scale = getTransform(g).a;

            if (this.audioMuted) {
                muteAudioIcon.fontSize = height;
                muteAudioIcon.scale = scale;
                muteAudioIcon.draw(g, this.stackAvatarWidth - muteAudioIcon.width, 0);
            }
        }
    }

    drawName(g, map, fontSize) {
        if (this.visible) {
            const scale = getTransform(g).a;
            g.save();
            {
                g.translate(
                    this.x * map.tileWidth + this.stackOffsetX,
                    this.y * map.tileHeight + this.stackOffsetY);
                g.shadowColor = "black";
                g.shadowOffsetX = 3 * scale;
                g.shadowOffsetY = 3 * scale;
                g.shadowBlur = 3 * scale;

                const textScale = fontSize / this.userNameText.fontSize;
                g.scale(textScale, textScale);
                this.userNameText.draw(g, 0, -this.userNameText.height);
            }
            g.restore();
        }
    }

    drawHearingTile(g, map, dx, dy, p) {
        g.save();
        {
            g.translate(
                (this.gridX + dx) * map.tileWidth,
                (this.gridY + dy) * map.tileHeight);
            g.strokeStyle = `rgba(0, 255, 0, ${(1 - p) / 2})`;
            g.strokeRect(0, 0, map.tileWidth, map.tileHeight);
        }
        g.restore();
    }

    drawHearingRange(g, map, minDist, maxDist) {
        const scale = getTransform(g).a,
            tw = Math.min(maxDist, Math.ceil(g.canvas.width / (2 * map.tileWidth * scale))),
            th = Math.min(maxDist, Math.ceil(g.canvas.height / (2 * map.tileHeight * scale)));

        for (let dy = 0; dy < th; ++dy) {
            for (let dx = 0; dx < tw; ++dx) {
                const dist = Math.sqrt(dx * dx + dy * dy),
                    p = project(dist, minDist, maxDist);
                if (p <= 1) {
                    this.drawHearingTile(g, map, dx, dy, p);
                    if (dy != 0) {
                        this.drawHearingTile(g, map, dx, -dy, p);
                    }
                    if (dx != 0) {
                        this.drawHearingTile(g, map, -dx, dy, p);
                    }
                    if (dx != 0 && dy != 0) {
                        this.drawHearingTile(g, map, -dx, -dy, p);
                    }
                }
            }
        }
    }
}

const inputBindingChangedEvt = new Event("inputBindingChanged");

class InputBinding extends EventBase {
    constructor() {
        super();

        const bindings = new Map([
            ["keyButtonUp", "ArrowUp"],
            ["keyButtonDown", "ArrowDown"],
            ["keyButtonLeft", "ArrowLeft"],
            ["keyButtonRight", "ArrowRight"],
            ["keyButtonEmote", "e"],
            ["keyButtonToggleAudio", "a"],

            ["gpAxisLeftRight", 0],
            ["gpAxisUpDown", 1],

            ["gpButtonUp", 12],
            ["gpButtonDown", 13],
            ["gpButtonLeft", 14],
            ["gpButtonRight", 15],
            ["gpButtonEmote", 0],
            ["gpButtonToggleAudio", 1]
        ]);

        for (let id of bindings.keys()) {
            Object.defineProperty(this, id, {
                get: () => bindings.get(id),
                set: (v) => {
                    if (bindings.has(id)
                        && v !== bindings.get(id)) {
                        bindings.set(id, v);
                        this.dispatchEvent(inputBindingChangedEvt);
                    }
                }
            });
        }

        this.clone = () => {
            const c = {};
            for (let kp of bindings.entries()) {
                c[kp[0]] = kp[1];
            }
            return c;
        };

        Object.freeze(this);
    }
}

const keyWidthStyle = cssWidth("7em"),
    numberWidthStyle = cssWidth("3em"),
    avatarUrlChangedEvt = new Event("avatarURLChanged"),
    gamepadChangedEvt = new Event("gamepadChanged"),
    selectAvatarEvt = new Event("selectAvatar"),
    fontSizeChangedEvt = new Event("fontSizeChanged"),
    inputBindingChangedEvt$1 = new Event("inputBindingChanged"),
    audioPropsChangedEvt = new Event("audioPropertiesChanged"),
    toggleDrawHearingEvt = new Event("toggleDrawHearing"),
    audioInputChangedEvt = new Event("audioInputChanged"),
    audioOutputChangedEvt = new Event("audioOutputChanged"),
    videoInputChangedEvt = new Event("videoInputChanged"),
    toggleVideoEvt$1 = new Event("toggleVideo"),
    gamepadButtonUpEvt = Object.assign(new Event("gamepadbuttonup"), {
        button: 0
    }),
    gamepadAxisMaxedEvt = Object.assign(new Event("gamepadaxismaxed"), {
        axis: 0
    });

const disabler$3 = disabled(true),
    enabler$3 = disabled(false);

/** @type {WeakMap<OptionsForm, OptionsFormPrivate>} */
const selfs$2 = new WeakMap();

class OptionsFormPrivate {
    constructor() {
        this.inputBinding = new InputBinding();
        /** @type {EventedGamepad} */
        this.pad = null;
    }
}

class OptionsForm extends FormDialog {
    constructor() {
        super("options", "Options");

        const _ = (evt) => () => this.dispatchEvent(evt);

        const self = new OptionsFormPrivate();
        selfs$2.set(this, self);

        const audioPropsChanged = onInput(_(audioPropsChangedEvt));

        const makeKeyboardBinder = (id, label) => {
            const key = LabeledInput(
                id,
                "text",
                label,
                keyWidthStyle,
                onKeyUp((evt) => {
                    if (evt.key !== "Tab"
                        && evt.key !== "Shift") {
                        key.value
                            = self.inputBinding[id]
                            = evt.key;
                        this.dispatchEvent(inputBindingChangedEvt$1);
                    }
                }));
            key.value = self.inputBinding[id];
            return key;
        };

        const makeGamepadButtonBinder = (id, label) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle);
            this.addEventListener("gamepadbuttonup", (evt) => {
                if (document.activeElement === gp.input) {
                    gp.value
                        = self.inputBinding[id]
                        = evt.button;
                    this.dispatchEvent(inputBindingChangedEvt$1);
                }
            });
            gp.value = self.inputBinding[id];
            return gp;
        };

        const makeGamepadAxisBinder = (id, label) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle);
            this.addEventListener("gamepadaxismaxed", (evt) => {
                if (document.activeElement === gp.input) {
                    gp.value
                        = self.inputBinding[id]
                        = evt.axis;
                    this.dispatchEvent(inputBindingChangedEvt$1);
                }
            });
            gp.value = self.inputBinding[id];
            return gp;
        };

        const panels = [
            OptionPanel("avatar", "Avatar",
                Div(
                    Label(
                        htmlFor("selectAvatarEmoji"),
                        "Emoji: "),
                    Button(
                        id("selectAvatarEmoji"),
                        "Select",
                        onClick(_(selectAvatarEvt)))),
                " or ",
                Div(
                    Label(
                        htmlFor("setAvatarURL"),
                        "Photo: "),

                    this.avatarURLInput = InputURL(
                        placeHolder("https://example.com/me.png")),
                    Button(
                        id("setAvatarURL"),
                        "Set",
                        onClick(() => {
                            this.avatarURL = this.avatarURLInput.value;
                            this.dispatchEvent(avatarUrlChangedEvt);
                        })),
                    this.clearAvatarURLButton = Button(
                        disabled,
                        "Clear",
                        onClick(() => {
                            this.avatarURL = null;
                            this.dispatchEvent(avatarUrlChangedEvt);
                        }))),
                " or ",
                Div(
                    Label(
                        htmlFor("videoAvatarButton"),
                        "Video: "),
                    this.useVideoAvatarButton = Button(
                        id("videoAvatarButton"),
                        "Use video",
                        onClick(_(toggleVideoEvt$1)))),
                this.avatarPreview = Canvas(
                    width(256),
                    height(256))),

            OptionPanel("interface", "Interface",
                this.fontSizeInput = LabeledInput(
                    "fontSize",
                    "number",
                    "Font size: ",
                    value(10),
                    min(5),
                    max(32),
                    numberWidthStyle,
                    onInput(_(fontSizeChangedEvt))),
                P(
                    this.drawHearingCheck = LabeledInput(
                        "drawHearing",
                        "checkbox",
                        "Draw hearing range: ",
                        onInput(() => {
                            this.drawHearing = !this.drawHearing;
                            this.dispatchEvent(toggleDrawHearingEvt);
                        })),
                    this.audioMinInput = LabeledInput(
                        "minAudio",
                        "number",
                        "Min: ",
                        value(1),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.audioMaxInput = LabeledInput(
                        "maxAudio",
                        "number",
                        "Min: ",
                        value(10),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.audioRolloffInput = LabeledInput(
                        "rollof",
                        "number",
                        "Rollof: ",
                        value(1),
                        min(0.1),
                        max(10),
                        step(0.1),
                        numberWidthStyle,
                        audioPropsChanged))),

            OptionPanel("keyboard", "Keyboard",
                this.keyButtonUp = makeKeyboardBinder("keyButtonUp", "Up: "),
                this.keyButtonDown = makeKeyboardBinder("keyButtonDown", "Down: "),
                this.keyButtonLeft = makeKeyboardBinder("keyButtonLeft", "Left: "),
                this.keyButtonRight = makeKeyboardBinder("keyButtonRight", "Right: "),
                this.keyButtonEmote = makeKeyboardBinder("keyButtonEmote", "Emote: "),
                this.keyButtonToggleAudio = makeKeyboardBinder("keyButtonToggleAudio", "Toggle audio: ")),

            OptionPanel("gamepad", "Gamepad",
                this.gpSelect = LabeledSelectBox(
                    "gamepads",
                    "Use gamepad: ",
                    "No gamepad",
                    gp => gp.id,
                    gp => gp.id,
                    onInput(_(gamepadChangedEvt))),
                this.gpAxisLeftRight = makeGamepadAxisBinder("gpAxisLeftRight", "Left/Right axis:"),
                this.gpAxisUpDown = makeGamepadAxisBinder("gpAxisUpDown", "Up/Down axis:"),
                this.gpButtonUp = makeGamepadButtonBinder("gpButtonUp", "Up button: "),
                this.gpButtonDown = makeGamepadButtonBinder("gpButtonDown", "Down button: "),
                this.gpButtonLeft = makeGamepadButtonBinder("gpButtonLeft", "Left button: "),
                this.gpButtonRight = makeGamepadButtonBinder("gpButtonRight", "Right button: "),
                this.gpButtonEmote = makeGamepadButtonBinder("gpButtonEmote", "Emote button: "),
                this.gpButtonToggleAudio = makeGamepadButtonBinder("gpButtonToggleAudio", "Toggle audio button: ")),

            OptionPanel("devices", "Devices",
                this.videoInputSelect = LabeledSelectBox(
                    "videoInputDevices",
                    "Video Input: ",
                    "No video input",
                    d => d.deviceId,
                    d => d.label,
                    onInput(_(videoInputChangedEvt))),
                this.audioInputSelect = LabeledSelectBox(
                    "audioInputDevices",
                    "Audio Input: ",
                    "No audio input",
                    d => d.deviceId,
                    d => d.label,
                    onInput(_(audioInputChangedEvt))),
                this.audioOutputSelect = LabeledSelectBox(
                    "audioOutputDevices",
                    "Audio Output: ",
                    "No audio output",
                    d => d.deviceId,
                    d => d.label,
                    onInput(_(audioOutputChangedEvt))))
        ];

        const cols = [];
        for (let i = 0; i < panels.length; ++i) {
            cols[i] = "1fr";
            panels[i].element.style.gridColumnStart = i + 1;
            panels[i].button.style.fontSize = "3.5vw";
        }

        gridColsDef(...cols).apply(this.header);

        this.header.append(...panels.map(p => p.button));
        this.content.append(...panels.map(p => p.element));
        styles(
            backgroundColor("#ddd"),
            borderLeft("solid 2px black"),
            borderRight("solid 2px black"),
            borderBottom("solid 2px black"))
            .apply(this.content);

        const showPanel = (p) =>
            () => {
                for (let i = 0; i < panels.length; ++i) {
                    panels[i].visible = i === p;
                }
            };

        for (let i = 0; i < panels.length; ++i) {
            panels[i].visible = i === 0;
            panels[i].addEventListener("select", showPanel(i));
        }

        self.inputBinding.addEventListener("inputBindingChanged", () => {
            for (let id of Object.getOwnPropertyNames(self.inputBinding)) {
                if (value[id] !== undefined
                    && this[id] != undefined) {
                    this[id].value = value[id];
                }
            }
        });

        this.gamepads = [];
        this.audioInputDevices = [];
        this.audioOutputDevices = [];
        this.videoInputDevices = [];

        this._drawHearing = false;

        /** @type {User} */
        this.user = null;
        this._avatarG = this.avatarPreview.getContext("2d");

        Object.seal(this);
    }

    update() {
        if (isOpen(this)) {
            const pad = this.currentGamepad;
            if (pad) {
                if (self.pad) {
                    self.pad.update(pad);
                }
                else {
                    self.pad = new EventedGamepad(pad);
                    self.pad.addEventListener("gamepadbuttonup", (evt) => {
                        gamepadButtonUpEvt.button = evt.button;
                        this.dispatchEvent(gamepadButtonUpEvt);
                    });
                    self.pad.addEventListener("gamepadaxismaxed", (evt) => {
                        gamepadAxisMaxedEvt.axis = evt.axis;
                        this.dispatchEvent(gamepadAxisMaxedEvt);
                    });
                }
            }

            if (this.user && this.user.avatar) {
                this._avatarG.clearRect(0, 0, this.avatarPreview.width, this.avatarPreview.height);
                this.user.avatar.draw(this._avatarG, this.avatarPreview.width, this.avatarPreview.height, true);
            }
        }
    }

    get avatarURL() {
        if (this.avatarURLInput.value.length === 0) {
            return null;
        }
        else {
            return this.avatarURLInput.value;
        }
    }

    set avatarURL(v) {
        if (isString(v)) {
            this.avatarURLInput.value = v;
            enabler$3.apply(this.clearAvatarURLButton);
        }
        else {
            this.avatarURLInput.value = "";
            disabler$3.apply(this.clearAvatarURLButton);
        }
    }


    setAvatarVideo(v) {
        if (v !== null) {
            this.useVideoAvatarButton.innerHTML = "Remove video";
        }
        else {
            this.useVideoAvatarButton.innerHTML = "Use video";
        }
    }

    get inputBinding() {
        const self = selfs$2.get(this);
        return self.inputBinding.clone();
    }

    set inputBinding(value) {
        const self = selfs$2.get(this);
        for (let id of Object.getOwnPropertyNames(value)) {
            if (self.inputBinding[id] !== undefined
                && value[id] !== undefined
                && this[id] != undefined) {
                self.inputBinding[id]
                    = this[id].value
                    = value[id];
            }
        }
    }

    get gamepads() {
        return this.gpSelect.values;
    }

    set gamepads(values) {
        const disable = values.length === 0;
        this.gpSelect.values = values;
        setLocked(this.gpAxisLeftRight, disable);
        setLocked(this.gpAxisUpDown, disable);
        setLocked(this.gpButtonUp, disable);
        setLocked(this.gpButtonDown, disable);
        setLocked(this.gpButtonLeft, disable);
        setLocked(this.gpButtonRight, disable);
        setLocked(this.gpButtonEmote, disable);
        setLocked(this.gpButtonToggleAudio, disable);
    }

    get currentGamepadIndex() {
        return this.gpSelect.selectedIndex;
    }

    get currentGamepad() {
        if (this.currentGamepadIndex < 0) {
            return null;
        }
        else {
            return navigator.getGamepads()[this.currentGamepadIndex];
        }
    }

    get audioInputDevices() {
        return this.audioInputSelect.values;
    }

    set audioInputDevices(values) {
        this.audioInputSelect.values = values;
    }

    get currentAudioInputDevice() {
        return this.audioInputSelect.selectedValue;
    }

    set currentAudioInputDevice(value) {
        this.audioInputSelect.selectedValue = value;
    }


    get audioOutputDevices() {
        return this.audioOutputSelect.values;
    }

    set audioOutputDevices(values) {
        this.audioOutputSelect.values = values;
    }

    get currentAudioOutputDevice() {
        return this.audioOutputSelect.selectedValue;
    }

    set currentAudioOutputDevice(value) {
        this.audioOutputSelect.selectedValue = value;
    }


    get videoInputDevices() {
        return this.videoInputSelect.values;
    }

    set videoInputDevices(values) {
        this.videoInputSelect.values = values;
    }

    get currentVideoInputDevice() {
        return this.videoInputSelect.selectedValue;
    }

    set currentVideoInputDevice(value) {
        this.videoInputSelect.selectedValue = value;
    }

    get gamepadIndex() {
        return this.gpSelect.selectedIndex;
    }

    set gamepadIndex(value) {
        this.gpSelect.selectedIndex = value;
    }

    get drawHearing() {
        return this._drawHearing;
    }

    set drawHearing(value) {
        this._drawHearing = value;
        this.drawHearingCheck.checked = value;
    }

    get audioDistanceMin() {
        const value = parseFloat(this.audioMinInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 1;
        }
    }

    set audioDistanceMin(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.audioMinInput.value = value;
            if (this.audioDistanceMin > this.audioDistanceMax) {
                this.audioDistanceMax = this.audioDistanceMin;
            }
        }
    }


    get audioDistanceMax() {
        const value = parseFloat(this.audioMaxInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 10;
        }
    }

    set audioDistanceMax(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.audioMaxInput.value = value;
            if (this.audioDistanceMin > this.audioDistanceMax) {
                this.audioDistanceMin = this.audioDistanceMax;
            }
        }
    }


    get audioRolloff() {
        const value = parseFloat(this.audioRolloffInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 1;
        }
    }

    set audioRolloff(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.audioRolloffInput.value = value;
        }
    }


    get fontSize() {
        const value = parseFloat(this.fontSizeInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 16;
        }
    }

    set fontSize(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.fontSizeInput.value = value;
        }
    }
}

const newRowColor = backgroundColor("lightgreen");
const hoveredColor = backgroundColor("rgba(65, 255, 202, 0.25)");
const unhoveredColor = backgroundColor("transparent");
const warpToEvt = Object.assign(
    new Event("warpTo"),
    {
        id: null
    });

const ROW_TIMEOUT = 3000;

class UserDirectoryForm extends FormDialog {

    constructor() {
        super("users", "Users");

        /** @type {Map.<string, Element[]>} */
        this.rows = new Map();

        /** @type {Map<string, User>} */
        this.users = new Map();

        /** @type {Map<string, CanvasRenderingContext2D>} */
        this.avatarGs = new Map();

        this.content.append(
            this.table = Div(
                gridDef(
                    ["auto", "1fr"],
                    ["min-content"]),
                columnGap("5px"),
                cssWidth("100%")));
    }

    update() {
        if (isOpen(this)) {
            for (let entries of this.users.entries()) {
                const [id, user] = entries;
                if (this.avatarGs.has(id) && user.avatar) {
                    const g = this.avatarGs.get(id);
                    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
                    user.avatar.draw(g, g.canvas.width, g.canvas.height);
                }
            }
        }
    }

    /**
     * 
     * @param {User} user
     */
    set(user) {
        const isNew = !this.rows.has(user.id);
        this.delete(user.id);
        const row = this.rows.size + 1;

        if (isNew) {
            const elem = Div(
                gridPos(1, row, 2, 1),
                zIndex(-1),
                newRowColor);
            setTimeout(() => {
                this.table.removeChild(elem);
            }, ROW_TIMEOUT);
            this.table.append(elem);
            this.users.set(user.id, user);
            this.avatarGs.set(
                user.id,
                Canvas(
                    width(32),
                    height(32))
                    .getContext("2d"));
        }

        const avatar = this.avatarGs.get(user.id).canvas;

        const elems = [
            Div(gridPos(1, row), zIndex(0), avatar),
            Div(gridPos(2, row), zIndex(0), user.displayName),
            Div(
                gridPos(1, row, 2, 1), zIndex(1),
                unhoveredColor,
                onMouseOver(function () {
                    hoveredColor.apply(this);
                }),
                onMouseOut(function () {
                    unhoveredColor.apply(this);
                }),
                onClick(() => {
                    hide(this);
                    warpToEvt.id = user.id;
                    this.dispatchEvent(warpToEvt);
                }))];

        this.rows.set(user.id, elems);
        this.table.append(...elems);
    }

    delete(userID) {
        if (this.rows.has(userID)) {
            const elems = this.rows.get(userID);
            this.rows.delete(userID);
            for (let elem of elems) {
                this.table.removeChild(elem);
            }

            let rowCount = 1;
            for (let elems of this.rows.values()) {
                const r = row(rowCount++);
                for (let elem of elems) {
                    r.apply(elem);
                }
            }
        }
    }

    clear() {
        for (let id of this.rows.keys()) {
            this.delete(id);
        }
    }

    warn(...rest) {
        const elem = Div(
            gridPos(1, this.rows.size + 1, 2, 1),
            backgroundColor("yellow"),
            ...rest.map(i => i.toString()));

        this.table.append(elem);

        setTimeout(() => {
            this.table.removeChild(elem);
        }, 5000);
    }
}

const EMOJI_LIFE = 3;

class Emote {
    constructor(emoji, x, y) {
        this.emoji = emoji;
        this.x = x;
        this.y = y;
        this.dx = Math.random() - 0.5;
        this.dy = -Math.random() * 0.5 - 0.5;
        this.life = 1;
        this.width = -1;
        this.emoteText = new TextImage("sans-serif");
        this.emoteText.value = emoji.value;
    }

    isDead() {
        return this.life <= 0.01;
    }

    update(dt) {
        this.life -= dt / EMOJI_LIFE;
        this.dx *= 0.99;
        this.dy *= 0.99;
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    }

    drawShadow(g, map) {
        const scale = getTransform(g).a;
        g.save();
        {
            g.shadowColor = "rgba(0, 0, 0, 0.5)";
            g.shadowOffsetX = 3 * scale;
            g.shadowOffsetY = 3 * scale;
            g.shadowBlur = 3 * scale;

            this.drawEmote(g, map);
        }
        g.restore();
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} g
     * @param {any} map
     */
    drawEmote(g, map) {
        const oldAlpha = g.globalAlpha,
            scale = getTransform(g).a;
        g.globalAlpha = this.life;
        this.emoteText.fontSize = map.tileHeight / 2;
        this.emoteText.scale = scale;
        this.emoteText.draw(g,
            this.x * map.tileWidth - this.width / 2,
            this.y * map.tileHeight);
        g.globalAlpha = oldAlpha;
    }
}

// javascript-astar 0.4.1
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Implements the astar search algorithm in javascript using a Binary Heap.
// Includes Binary Heap (with modifications) from Marijn Haverbeke.
// http://eloquentjavascript.net/appendix2.html

// edits to work with JS modules by STM/capnmidnight 2020-07-20

function pathTo(node) {
  var curr = node;
  var path = [];
  while (curr.parent) {
    path.unshift(curr);
    curr = curr.parent;
  }
  return path;
}

function getHeap() {
  return new BinaryHeap(function(node) {
    return node.f;
  });
}

var astar = {
  /**
  * Perform an A* Search on a graph given a start and end node.
  * @param {Graph} graph
  * @param {GridNode} start
  * @param {GridNode} end
  * @param {Object} [options]
  * @param {bool} [options.closest] Specifies whether to return the
             path to the closest node if the target is unreachable.
  * @param {Function} [options.heuristic] Heuristic function (see
  *          astar.heuristics).
  */
  search: function(graph, start, end, options) {
    graph.cleanDirty();
    options = options || {};
    var heuristic = options.heuristic || astar.heuristics.manhattan;
    var closest = options.closest || false;

    var openHeap = getHeap();
    var closestNode = start; // set the start node to be the closest if required

    start.h = heuristic(start, end);
    graph.markDirty(start);

    openHeap.push(start);

    while (openHeap.size() > 0) {

      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      var currentNode = openHeap.pop();

      // End case -- result has been found, return the traced path.
      if (currentNode === end) {
        return pathTo(currentNode);
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.closed = true;

      // Find all neighbors for the current node.
      var neighbors = graph.neighbors(currentNode);

      for (var i = 0, il = neighbors.length; i < il; ++i) {
        var neighbor = neighbors[i];

        if (neighbor.closed || neighbor.isWall()) {
          // Not a valid node to process, skip to next neighbor.
          continue;
        }

        // The g score is the shortest distance from start to current node.
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
        var gScore = currentNode.g + neighbor.getCost(currentNode);
        var beenVisited = neighbor.visited;

        if (!beenVisited || gScore < neighbor.g) {

          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || heuristic(neighbor, end);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
          graph.markDirty(neighbor);
          if (closest) {
            // If the neighbour is closer than the current closestNode or if it's equally close but has
            // a cheaper path than the current closest node then it becomes the closest node
            if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
              closestNode = neighbor;
            }
          }

          if (!beenVisited) {
            // Pushing to heap will put it in proper place based on the 'f' value.
            openHeap.push(neighbor);
          } else {
            // Already seen the node, but since it has been rescored we need to reorder it in the heap
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }

    if (closest) {
      return pathTo(closestNode);
    }

    // No result was found - empty array signifies failure to find path.
    return [];
  },
  // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
  heuristics: {
    manhattan: function(pos0, pos1) {
      var d1 = Math.abs(pos1.x - pos0.x);
      var d2 = Math.abs(pos1.y - pos0.y);
      return d1 + d2;
    },
    diagonal: function(pos0, pos1) {
      var D = 1;
      var D2 = Math.sqrt(2);
      var d1 = Math.abs(pos1.x - pos0.x);
      var d2 = Math.abs(pos1.y - pos0.y);
      return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
    }
  },
  cleanNode: function(node) {
    node.f = 0;
    node.g = 0;
    node.h = 0;
    node.visited = false;
    node.closed = false;
    node.parent = null;
  }
};

/**
 * A graph memory structure
 * @param {Array} gridIn 2D array of input weights
 * @param {Object} [options]
 * @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
 */
function Graph(gridIn, options) {
  options = options || {};
  this.nodes = [];
  this.diagonal = !!options.diagonal;
  this.grid = [];
  for (var x = 0; x < gridIn.length; x++) {
    this.grid[x] = [];

    for (var y = 0, row = gridIn[x]; y < row.length; y++) {
      var node = new GridNode(x, y, row[y]);
      this.grid[x][y] = node;
      this.nodes.push(node);
    }
  }
  this.init();
}

Graph.prototype.init = function() {
  this.dirtyNodes = [];
  for (var i = 0; i < this.nodes.length; i++) {
    astar.cleanNode(this.nodes[i]);
  }
};

Graph.prototype.cleanDirty = function() {
  for (var i = 0; i < this.dirtyNodes.length; i++) {
    astar.cleanNode(this.dirtyNodes[i]);
  }
  this.dirtyNodes = [];
};

Graph.prototype.markDirty = function(node) {
  this.dirtyNodes.push(node);
};

Graph.prototype.neighbors = function(node) {
  var ret = [];
  var x = node.x;
  var y = node.y;
  var grid = this.grid;

  // West
  if (grid[x - 1] && grid[x - 1][y]) {
    ret.push(grid[x - 1][y]);
  }

  // East
  if (grid[x + 1] && grid[x + 1][y]) {
    ret.push(grid[x + 1][y]);
  }

  // South
  if (grid[x] && grid[x][y - 1]) {
    ret.push(grid[x][y - 1]);
  }

  // North
  if (grid[x] && grid[x][y + 1]) {
    ret.push(grid[x][y + 1]);
  }

  if (this.diagonal) {
    // Southwest
    if (grid[x - 1] && grid[x - 1][y - 1]) {
      ret.push(grid[x - 1][y - 1]);
    }

    // Southeast
    if (grid[x + 1] && grid[x + 1][y - 1]) {
      ret.push(grid[x + 1][y - 1]);
    }

    // Northwest
    if (grid[x - 1] && grid[x - 1][y + 1]) {
      ret.push(grid[x - 1][y + 1]);
    }

    // Northeast
    if (grid[x + 1] && grid[x + 1][y + 1]) {
      ret.push(grid[x + 1][y + 1]);
    }
  }

  return ret;
};

Graph.prototype.toString = function() {
  var graphString = [];
  var nodes = this.grid;
  for (var x = 0; x < nodes.length; x++) {
    var rowDebug = [];
    var row = nodes[x];
    for (var y = 0; y < row.length; y++) {
      rowDebug.push(row[y].weight);
    }
    graphString.push(rowDebug.join(" "));
  }
  return graphString.join("\n");
};

function GridNode(x, y, weight) {
  this.x = x;
  this.y = y;
  this.weight = weight;
}

GridNode.prototype.toString = function() {
  return "[" + this.x + " " + this.y + "]";
};

GridNode.prototype.getCost = function(fromNeighbor) {
  // Take diagonal weight into consideration.
  if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
    return this.weight * 1.41421;
  }
  return this.weight;
};

GridNode.prototype.isWall = function() {
  return this.weight === 0;
};

function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);

    // Allow it to sink down.
    this.sinkDown(this.content.length - 1);
  },
  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it bubble up.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  },
  remove: function(node) {
    var i = this.content.indexOf(node);

    // When it is found, the process seen in 'pop' is repeated
    // to fill up the hole.
    var end = this.content.pop();

    if (i !== this.content.length - 1) {
      this.content[i] = end;

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  },
  size: function() {
    return this.content.length;
  },
  rescoreElement: function(node) {
    this.sinkDown(this.content.indexOf(node));
  },
  sinkDown: function(n) {
    // Fetch the element that has to be sunk.
    var element = this.content[n];

    // When at 0, an element can not sink any further.
    while (n > 0) {

      // Compute the parent element's index, and fetch it.
      var parentN = ((n + 1) >> 1) - 1;
      var parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }
      // Found a parent that is less, no need to sink any further.
      else {
        break;
      }
    }
  },
  bubbleUp: function(n) {
    // Look up the target element and its score.
    var length = this.content.length;
    var element = this.content[n];
    var elemScore = this.scoreFunction(element);

    while (true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) << 1;
      var child1N = child2N - 1;
      // This is used to store the new position of the element, if any.
      var swap = null;
      var child1Score;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);

        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N];
        var child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  }
};

class TileSet {
    constructor(url) {
        this.url = url;
        this.tileWidth = 0;
        this.tileHeight = 0;
        this.tilesPerRow = 0;
        this.image = new Image();
        this.collision = {};
    }

    async load() {
        const response = await fetch(this.url),
            text = await response.text(),
            parser = new DOMParser(),
            xml = parser.parseFromString(text, "text/xml"),
            tileset = xml.documentElement,
            imageLoad = new Promise((resolve, reject) => {
                this.image.addEventListener("load", (evt) => {
                    this.tilesPerRow = Math.floor(this.image.width / this.tileWidth);
                    resolve();
                });
                this.image.addEventListener("error", reject);
            }),
            image = tileset.querySelector("image"),
            imageSource = image.getAttribute("source"),
            imageURL = new URL(imageSource, this.url),
            tiles = tileset.querySelectorAll("tile");

        for (let tile of tiles) {
            const id = 1 * tile.getAttribute("id"),
                collid = tile.querySelector("properties > property[name='Collision']"),
                value = collid.getAttribute("value");
            this.collision[id] = value === "true";
        }

        this.name = tileset.getAttribute("name");
        this.tileWidth = 1 * tileset.getAttribute("tilewidth");
        this.tileHeight = 1 * tileset.getAttribute("tileheight");
        this.tileCount = 1 * tileset.getAttribute("tilecount");
        this.image.src = imageURL.href;
        await imageLoad;
    }

    isClear(tile) {
        return !this.collision[tile - 1];
    }

    draw(g, tile, x, y) {
        if (tile > 0) {
            const idx = tile - 1,
                sx = this.tileWidth * (idx % this.tilesPerRow),
                sy = this.tileHeight * Math.floor(idx / this.tilesPerRow),
                dx = x * this.tileWidth,
                dy = y * this.tileHeight;

            g.drawImage(this.image,
                sx, sy, this.tileWidth, this.tileHeight,
                dx, dy, this.tileWidth, this.tileHeight);
        }
    }
}

/** @type {WeakMap<TileMap, TileMapPrivate>} */
const selfs$3 = new WeakMap();

class TileMapPrivate {
    constructor(tilemapName) {
        this.url = new URL(`data/tilemaps/${tilemapName}.tmx`, document.baseURI);
        this.tileWidth = 0;
        this.tileHeight = 0;
        this.layers = 0;
        this.width = 0;
        this.height = 0;
        this.offsetX = 0;
        this.offsetY = 0;

        /** @type {TileSet} */
        this.tileset = null;

        /** @type {number[][][]} */
        this.tiles = null;

        /** @type {Graph} */
        this.graph = null;

        /** @type {OffscreenCanvas[]} */
        this.layerImages = [];

        Object.seal(this);
    }
}

class TileMap {
    constructor(tilemapName) {
        selfs$3.set(this, new TileMapPrivate(tilemapName));
    }

    async load() {
        const self = selfs$3.get(this),
            response = await fetch(self.url.href),
            text = await response.text(),
            parser = new DOMParser(),
            xml = parser.parseFromString(text, "text/xml"),
            map = xml.documentElement,
            width = 1 * map.getAttribute("width"),
            height = 1 * map.getAttribute("height"),
            tileWidth = 1 * map.getAttribute("tilewidth"),
            tileHeight = 1 * map.getAttribute("tileheight"),
            tileset = map.querySelector("tileset"),
            tilesetSource = tileset.getAttribute("source"),
            layers = map.querySelectorAll("layer > data");

        self.layers = layers.length;
        self.width = width;
        self.height = height;
        self.offsetX = -Math.floor(width / 2);
        self.offsetY = -Math.floor(height / 2);
        self.tileWidth = tileWidth;
        self.tileHeight = tileHeight;

        self.tiles = [];
        for (let layer of layers) {
            const tileIds = layer.innerHTML
                .replace(" ", "")
                .replace("\t", "")
                .replace("\n", "")
                .replace("\r", "")
                .split(",")
                .map(s => parseInt(s, 10)),
                rows = [];
            let row = [];
            for (let tile of tileIds) {
                row.push(tile);
                if (row.length === width) {
                    rows.push(row);
                    row = [];
                }
            }
            if (row.length > 0) {
                rows.push(row);
            }

            self.tiles.push(rows);
        }

        self.tileset = new TileSet(new URL(tilesetSource, self.url));
        await self.tileset.load();
        self.tileWidth = self.tileset.tileWidth;
        self.tileHeight = self.tileset.tileHeight;

        for (let l = 0; l < self.layers; ++l) {
            const img = CanvasOffscreen(this.width * this.tileWidth, this.height * this.tileHeight);
            self.layerImages.push(img);
            const context = img.getContext("2d");
            const layer = self.tiles[l];
            for (let y = 0; y < this.height; ++y) {
                const row = layer[y];
                for (let x = 0; x < this.width; ++x) {
                    const tile = row[x];
                    self.tileset.draw(context, tile, x, y);
                }
            }
        }

        let grid = [];
        for (let row of self.tiles[0]) {
            let gridrow = [];
            for (let tile of row) {
                if (self.tileset.isClear(tile)) {
                    gridrow.push(1);
                } else {
                    gridrow.push(0);
                }
            }
            grid.push(gridrow);
        }
        self.graph = new Graph(grid, { diagonal: true });
    }

    get width() {
        return selfs$3.get(this).width;
    }

    get height() {
        return selfs$3.get(this).height;
    }

    get tileWidth() {
        return selfs$3.get(this).tileWidth;
    }

    get tileHeight() {
        return selfs$3.get(this).tileHeight;
    }

    isInBounds(x, y) {
        return 0 <= x && x < this.width
            && 0 <= y && y < this.height;
    }

    getGridNode(x, y) {
        const self = selfs$3.get(this);
        x -= self.offsetX;
        y -= self.offsetY;
        if (this.isInBounds(x, y)) {
            return self.graph.grid[y][x];
        }
        else {
            return null;
        }
    }

    draw(g) {
        const self = selfs$3.get(this);
        g.save();
        {
            g.translate(self.offsetX * this.tileWidth, self.offsetY * this.tileHeight);
            for (let img of self.layerImages) {
                g.drawImage(img, 0, 0);
            }
        }
        g.restore();
    }

    searchPath(start, end) {
        const self = selfs$3.get(this);
        return astar.search(self.graph, start, end)
            .map(p => {
                return {
                    x: p.y + self.offsetX,
                    y: p.x + self.offsetY
                };
            });
    }

    isClear(x, y, avatar) {
        const self = selfs$3.get(this);
        x -= self.offsetX;
        y -= self.offsetY;
        return x < 0 || this.width <= x
            || y < 0 || this.height <= y
            || self.tileset && self.tileset.isClear(self.tiles[0][y][x])
            || avatar && avatar.canSwim;
    }

    // Use Bresenham's line algorithm (with integer error)
    // to draw a line through the map, cutting it off if
    // it hits a wall.
    getClearTile(x, y, dx, dy, avatar) {
        const x1 = x + dx,
            y1 = y + dy,
            sx = x < x1 ? 1 : -1,
            sy = y < y1 ? 1 : -1;

        dx = Math.abs(x1 - x);
        dy = Math.abs(y1 - y);

        let err = (dx > dy ? dx : -dy) / 2;

        while (x !== x1
            || y !== y1) {
            const e2 = err;
            if (e2 > -dx) {
                if (this.isClear(x + sx, y, avatar)) {
                    err -= dy;
                    x += sx;
                }
                else {
                    break;
                }
            }
            if (e2 < dy) {
                if (this.isClear(x, y + sy, avatar)) {
                    err += dx;
                    y += sy;
                }
                else {
                    break;
                }
            }
        }

        return { x, y };
    }

    getClearTileNear(x, y, maxRadius, avatar) {
        for (let r = 1; r <= maxRadius; ++r) {
            for (let dx = -r; dx <= r; ++dx) {
                const dy = r - Math.abs(dx);
                const tx = x + dx;
                const ty1 = y + dy;
                const ty2 = y - dy;

                if (this.isClear(tx, ty1, avatar)) {
                    return { x: tx, y: ty1 };
                }
                else if (this.isClear(tx, ty2, avatar)) {
                    return { x: tx, y: ty2 };
                }
            }
        }

        return { x, y };
    }
}

const CAMERA_LERP = 0.01,
    CAMERA_ZOOM_MAX = 8,
    CAMERA_ZOOM_MIN = 0.1,
    CAMERA_ZOOM_SHAPE = 1 / 4,
    CAMERA_ZOOM_SPEED = 0.005,
    MAX_DRAG_DISTANCE = 5,
    MOVE_REPEAT = 0.125,
    gameStartedEvt = new Event("gameStarted"),
    gameEndedEvt = new Event("gameEnded"),
    zoomChangedEvt = new Event("zoomChanged"),
    emojiNeededEvt = new Event("emojiNeeded"),
    toggleAudioEvt$1 = new Event("toggleAudio"),
    toggleVideoEvt$2 = new Event("toggleVideo"),
    moveEvent = Object.assign(new Event("userMoved"), {
        x: 0,
        y: 0
    }),
    emoteEvt$1 = Object.assign(new Event("emote"), {
        emoji: null
    }),
    userJoinedEvt = Object.assign(new Event("userJoined", {
        user: null
    }));

/** @type {Map.<Game, EventedGamepad>} */
const gamepads = new Map();

class Game extends EventBase {

    constructor() {
        super();

        this.element = Canvas(
            id("frontBuffer"),
            cssWidth("100%"),
            cssHeight("100%"),
            touchAction("none"));
        this.gFront = this.element.getContext("2d");

        /** @type {User} */
        this.me = null;

        /** @type {TileMap} */
        this.map = null;

        this.waypoints = [];

        this.keys = {};

        /** @type {Map.<string, User>} */
        this.users = new Map();

        this.lastMove = Number.MAX_VALUE;
        this.lastWalk = Number.MAX_VALUE;
        this.gridOffsetX = 0;
        this.gridOffsetY = 0;
        this.cameraX = this.offsetCameraX = this.targetOffsetCameraX = 0;
        this.cameraY = this.offsetCameraY = this.targetOffsetCameraY = 0;
        this.cameraZ = this.targetCameraZ = 1.5;
        this.currentRoomName = null;
        this.fontSize = 10;

        this.drawHearing = false;
        this.audioDistanceMin = 2;
        this.audioDistanceMax = 10;
        this.rolloff = 5;

        this.pointers = [];
        this.lastPinchDistance = 0;
        this.canClick = false;

        this.currentEmoji = null;

        /** @type {Emote[]} */
        this.emotes = [];

        this.inputBinding = {
            keyButtonUp: "ArrowUp",
            keyButtonDown: "ArrowDown",
            keyButtonLeft: "ArrowLeft",
            keyButtonRight: "ArrowRight",
            keyButtonEmote: "e",
            keyButtonToggleAudio: "a",

            gpAxisLeftRight: 0,
            gpAxisUpDown: 1,

            gpButtonUp: 12,
            gpButtonDown: 13,
            gpButtonLeft: 14,
            gpButtonRight: 15,
            gpButtonEmote: 0,
            gpButtonToggleAudio: 1
        };

        this.lastGamepadIndex = -1;
        this.gamepadIndex = -1;
        this.transitionSpeed = 0.125;


        // ============= KEYBOARD =================

        addEventListener("keydown", (evt) => {
            this.keys[evt.key] = evt;
            if (!evt.ctrlKey
                && !evt.altKey
                && !evt.shiftKey
                && !evt.metaKey
                && evt.key === this.inputBinding.keyButtonToggleAudio
                && !!this.me) {
                this.toggleMyAudio();
            }
        });

        addEventListener("keyup", (evt) => {
            if (this.keys[evt.key]) {
                delete this.keys[evt.key];
            }
        });

        // ============= KEYBOARD =================

        // ============= POINTERS =================

        this.element.addEventListener("wheel", (evt) => {
            if (!evt.shiftKey
                && !evt.altKey
                && !evt.ctrlKey
                && !evt.metaKey) {
                // Chrome and Firefox report scroll values in completely different ranges.
                const deltaZ = evt.deltaY * (isFirefox ? 1 : 0.02);
                this.zoom(deltaZ);
            }
        }, { passive: true });

        function readPointer(evt) {
            return {
                id: evt.pointerId,
                buttons: evt.buttons,
                dragDistance: 0,
                x: evt.offsetX * devicePixelRatio,
                y: evt.offsetY * devicePixelRatio
            }
        }

        const findPointer = (pointer) => {
            return this.pointers.findIndex(p => p.id === pointer.id);
        };

        const replacePointer = (pointer) => {
            const idx = findPointer(pointer);
            if (idx > -1) {
                const last = this.pointers[idx];
                this.pointers[idx] = pointer;
                return last;
            }
            else {
                this.pointers.push(pointer);
                return null;
            }
        };

        const getPressCount = () => {
            let count = 0;
            for (let pointer of this.pointers) {
                if (pointer.buttons === 1) {
                    ++count;
                }
            }
            return count;
        };

        this.element.addEventListener("pointerdown", (evt) => {
            const oldCount = getPressCount(),
                pointer = readPointer(evt),
                _ = replacePointer(pointer),
                newCount = getPressCount();

            this.canClick = oldCount === 0
                && newCount === 1;
        });

        const getPinchDistance = () => {
            const count = getPressCount();
            if (count !== 2) {
                return null;
            }

            const pressed = this.pointers.filter(p => p.buttons === 1),
                a = pressed[0],
                b = pressed[1],
                dx = b.x - a.x,
                dy = b.y - a.y;

            return Math.sqrt(dx * dx + dy * dy);
        };

        this.element.addEventListener("pointermove", (evt) => {
            const oldPinchDistance = getPinchDistance(),
                pointer = readPointer(evt),
                last = replacePointer(pointer),
                count = getPressCount(),
                newPinchDistance = getPinchDistance();

            if (count === 1) {

                if (!!last
                    && pointer.buttons === 1
                    && last.buttons === pointer.buttons) {
                    const dx = pointer.x - last.x,
                        dy = pointer.y - last.y,
                        dist = Math.sqrt(dx * dx + dy * dy);
                    pointer.dragDistance = last.dragDistance + dist;

                    if (pointer.dragDistance > MAX_DRAG_DISTANCE) {
                        this.targetOffsetCameraX = this.offsetCameraX += dx;
                        this.targetOffsetCameraY = this.offsetCameraY += dy;
                        this.canClick = false;
                    }
                }

            }

            if (oldPinchDistance !== null
                && newPinchDistance !== null) {
                const ddist = oldPinchDistance - newPinchDistance;
                this.zoom(ddist / 5);
                this.canClick = false;
            }
        });

        this.element.addEventListener("pointerup", (evt) => {
            const pointer = readPointer(evt),
                _ = replacePointer(pointer);

            if (!!this.me && pointer.dragDistance < 2) {
                const tile = this.getTileAt(pointer),
                    dx = tile.x - this.me.gridX,
                    dy = tile.y - this.me.gridY;

                if (dx === 0 && dy === 0) {
                    this.emote(this.me.id, this.currentEmoji);
                }
                else if (this.canClick) {
                    this.moveMeByPath(dx, dy);
                }
            }
        });

        this.element.addEventListener("pointercancel", (evt) => {
            const pointer = readPointer(evt),
                idx = findPointer(pointer);

            if (idx >= 0) {
                arrayRemoveAt(this.pointers, idx);
            }

            return pointer;
        });

        // ============= POINTERS =================

        // ============= ACTION ==================
    }

    get style() {
        return this.element.style;
    }

    initializeUser(id, evt) {
        this.withUser("initialize user", id, (user) => {
            user.deserialize(evt);
        });
    }

    updateAudioActivity(id, isActive) {
        this.withUser("update audio activity", id, (user) => {
            user.isActive = isActive;
        });
    }

    emote(id, emoji) {
        if (this.users.has(id)) {
            const user = this.users.get(id);
            if (user.isMe) {

                emoji = emoji
                    || this.currentEmoji;

                if (!emoji) {
                    this.dispatchEvent(emojiNeededEvt);
                }
                else {
                    emoteEvt$1.emoji = this.currentEmoji = emoji;
                    this.dispatchEvent(emoteEvt$1);
                }
            }

            if (emoji) {
                this.emotes.push(new Emote(emoji, user.x, user.y));
            }
        }
    }

    getTileAt(cursor) {
        const imageX = cursor.x - this.gridOffsetX - this.offsetCameraX,
            imageY = cursor.y - this.gridOffsetY - this.offsetCameraY,
            zoomX = imageX / this.cameraZ,
            zoomY = imageY / this.cameraZ,
            mapX = zoomX - this.cameraX,
            mapY = zoomY - this.cameraY,
            mapWidth = this.map.tileWidth,
            mapHeight = this.map.tileHeight,
            gridX = Math.floor(mapX / mapWidth),
            gridY = Math.floor(mapY / mapHeight),
            tile = { x: gridX, y: gridY };
        return tile;
    }

    moveMeTo(x, y) {
        if (this.map.isClear(x, y, this.me.avatar)) {
            this.targetOffsetCameraX = 0;
            this.targetOffsetCameraY = 0;
            moveEvent.x = x;
            moveEvent.y = y;
            this.dispatchEvent(moveEvent);
        }
    }

    moveMeBy(dx, dy) {
        const clearTile = this.map.getClearTile(this.me.gridX, this.me.gridY, dx, dy, this.me.avatar);
        this.moveMeTo(clearTile.x, clearTile.y);
    }

    moveMeByPath(dx, dy) {
        arrayClear(this.waypoints);

        const x = this.me.gridX,
            y = this.me.gridY,
            start = this.map.getGridNode(x, y),
            tx = x + dx,
            ty = y + dy,
            end = this.map.getGridNode(tx, ty);

        if (!start || !end) {
            this.moveMeTo(x + dx, y + dy);
        }
        else {
            const result = this.map.searchPath(start, end);
            this.waypoints.push(...result);
        }
    }

    warpMeTo(x, y) {
        const clearTile = this.map.getClearTileNear(x, y, 3, this.me.avatar);
        this.moveMeTo(clearTile.x, clearTile.y);
    }

    visit(id) {
        this.withUser("visit", id, (user) => {
            this.warpMeTo(user.gridX, user.gridY);
        });
    }

    zoom(deltaZ) {
        const mag = Math.abs(deltaZ);
        if (0 < mag && mag <= 50) {
            const a = project(this.targetCameraZ, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX),
                b = Math.pow(a, CAMERA_ZOOM_SHAPE),
                c = b - deltaZ * CAMERA_ZOOM_SPEED,
                d = clamp(c, 0, 1),
                e = Math.pow(d, 1 / CAMERA_ZOOM_SHAPE);

            this.targetCameraZ = unproject(e, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX);
            this.dispatchEvent(zoomChangedEvt);
        }
    }

    /**
     * 
     * @param {string} id
     * @param {string} displayName
     * @param {Pose} pose
     */
    addUser(id, displayName, pose) {
        if (this.users.has(id)) {
            this.removeUser(id);
        }

        const user = new User(id, displayName, pose, false);
        this.users.set(id, user);

        userJoinedEvt.user = user;
        this.dispatchEvent(userJoinedEvt);
    }

    toggleMyAudio() {
        this.dispatchEvent(toggleAudioEvt$1);
    }

    toggleMyVideo() {
        this.dispatchEvent(toggleVideoEvt$2);
    }

    muteUserAudio(id, muted) {
        this.withUser("mute audio", id, (user) => {
            user.audioMuted = muted;
        });
    }

    muteUserVideo(id, muted) {
        this.withUser("mute video", id, (user) => {
            user.videoMuted = muted;
        });
    }

    /**
    * Used to perform on operation when a valid user object is found.
    * @callback withUserCallback
    * @param {User} user
    * @returns {void}
    */

    /**
     * Find a user by id, then perform an operation on it.
     * @param {string} msg
     * @param {string} id
     * @param {withUserCallback} callback
     * @param {number} timeout
     */
    withUser(msg, id, callback, timeout) {
        if (timeout === undefined) {
            timeout = 5000;
        }
        if (id) {
            if (this.users.has(id)) {
                const user = this.users.get(id);
                callback(user);
            }
            else {
                console.warn(`No user "${id}" found to ${msg}. Trying again in a quarter second.`);
                if (timeout > 0) {
                    setTimeout(this.withUser.bind(this, msg, id, callback, timeout - 250), 250);
                }
            }
        }
    }

    changeUserName(id, displayName) {
        this.withUser("change user name", id, (user) => {
            user.displayName = displayName;
        });
    }

    removeUser(id) {
        if (this.users.has(id)) {
            this.users.delete(id);
        }
    }

    setAvatarVideo(id, stream) {
        this.withUser("set avatar video", id, (user) => {
            user.setAvatarVideo(stream);
        });
    }

    setAvatarURL(id, url) {
        this.withUser("set avatar image", id, (user) => {
            user.avatarImage = url;
        });
    }

    setAvatarEmoji(id, emoji) {
        this.withUser("set avatar emoji", id, (user) => {
            user.avatarEmoji = emoji;
        });
    }

    /**
     * 
     * @param {string} id
     * @param {string} displayName
     * @param {Pose} pose
     * @param {string} avatarURL
     * @param {string} roomName
     */
    async startAsync(id, displayName, pose, avatarURL, roomName) {
        this.currentRoomName = roomName.toLowerCase();
        this.me = new User(id, displayName, pose, true);
        if (isString(avatarURL)) {
            this.me.avatarImage = avatarURL;
        }
        this.users.set(id, this.me);

        this.map = new TileMap(this.currentRoomName);
        let success = false;
        for (let retryCount = 0; retryCount < 2; ++retryCount) {
            try {
                await this.map.load();
                success = true;
            }
            catch (exp) {
                console.warn(exp);
                this.map = new TileMap("default");
            }
        }

        if (!success) {
            console.error("Couldn't load any maps!");
        }

        this.startLoop();
        this.dispatchEvent(zoomChangedEvt);
        this.dispatchEvent(gameStartedEvt);
    }

    startLoop() {
        show(this);
        this.resize();
        this.element.focus();
    }

    resize() {
        resizeCanvas(this.element, window.devicePixelRatio);
    }

    end() {
        this.currentRoomName = null;
        this.map = null;
        this.users.clear();
        this.me = null;
        hide(this);
        this.dispatchEvent(gameEndedEvt);
    }

    update(dt) {
        if (this.currentRoomName !== null) {
            dt /= 1000;
            this.gridOffsetX = Math.floor(0.5 * this.element.width / this.map.tileWidth) * this.map.tileWidth;
            this.gridOffsetY = Math.floor(0.5 * this.element.height / this.map.tileHeight) * this.map.tileHeight;

            this.lastMove += dt;
            if (this.lastMove >= MOVE_REPEAT) {
                let dx = 0,
                    dy = 0;

                for (let evt of Object.values(this.keys)) {
                    if (!evt.altKey
                        && !evt.shiftKey
                        && !evt.ctrlKey
                        && !evt.metaKey) {
                        switch (evt.key) {
                            case this.inputBinding.keyButtonUp: dy--; break;
                            case this.inputBinding.keyButtonDown: dy++; break;
                            case this.inputBinding.keyButtonLeft: dx--; break;
                            case this.inputBinding.keyButtonRight: dx++; break;
                            case this.inputBinding.keyButtonEmote: this.emote(this.me.id, this.currentEmoji); break;
                        }
                    }
                }

                const gp = navigator.getGamepads()[this.gamepadIndex];
                if (gp) {
                    if (!gamepads.has(this)) {
                        gamepads.set(this, new EventedGamepad(gp));
                    }

                    const pad = gamepads.get(this);
                    pad.update(gp);

                    if (pad.buttons[this.inputBinding.gpButtonEmote].pressed) {
                        this.emote(this.me.id, this.currentEmoji);
                    }

                    if (!pad.lastButtons[this.inputBinding.gpButtonToggleAudio].pressed
                        && pad.buttons[this.inputBinding.gpButtonToggleAudio].pressed) {
                        this.toggleMyAudio();
                    }

                    if (pad.buttons[this.inputBinding.gpButtonUp].pressed) {
                        --dy;
                    }
                    else if (pad.buttons[this.inputBinding.gpButtonDown].pressed) {
                        ++dy;
                    }

                    if (pad.buttons[this.inputBinding.gpButtonLeft].pressed) {
                        --dx;
                    }
                    else if (pad.buttons[this.inputBinding.gpButtonRight].pressed) {
                        ++dx;
                    }

                    dx += Math.round(pad.axes[this.inputBinding.gpAxisLeftRight]);
                    dy += Math.round(pad.axes[this.inputBinding.gpAxisUpDown]);

                    this.targetOffsetCameraX += -50 * Math.round(2 * pad.axes[2]);
                    this.targetOffsetCameraY += -50 * Math.round(2 * pad.axes[3]);
                    this.zoom(2 * (pad.buttons[6].value - pad.buttons[7].value));
                }

                dx = clamp(dx, -1, 1);
                dy = clamp(dy, -1, 1);

                if (dx !== 0
                    || dy !== 0) {
                    this.moveMeBy(dx, dy);
                    arrayClear(this.waypoints);
                }

                this.lastMove = 0;
            }

            this.lastWalk += dt;
            if (this.lastWalk >= this.transitionSpeed) {
                if (this.waypoints.length > 0) {
                    const waypoint = this.waypoints.shift();
                    this.moveMeTo(waypoint.x, waypoint.y);
                }

                this.lastWalk = 0;
            }

            for (let emote of this.emotes) {
                emote.update(dt);
            }

            this.emotes = this.emotes.filter(e => !e.isDead());

            for (let user of this.users.values()) {
                user.update(this.map, this.users);
            }

            this.render();
        }
    }

    render() {
        const targetCameraX = -this.me.x * this.map.tileWidth,
            targetCameraY = -this.me.y * this.map.tileHeight;

        this.cameraZ = lerp(this.cameraZ, this.targetCameraZ, CAMERA_LERP * 10);
        this.cameraX = lerp(this.cameraX, targetCameraX, CAMERA_LERP * this.cameraZ);
        this.cameraY = lerp(this.cameraY, targetCameraY, CAMERA_LERP * this.cameraZ);

        this.offsetCameraX = lerp(this.offsetCameraX, this.targetOffsetCameraX, CAMERA_LERP);
        this.offsetCameraY = lerp(this.offsetCameraY, this.targetOffsetCameraY, CAMERA_LERP);

        this.gFront.resetTransform();
        this.gFront.imageSmoothingEnabled = false;
        this.gFront.clearRect(0, 0, this.element.width, this.element.height);

        this.gFront.save();
        {
            this.gFront.translate(
                this.gridOffsetX + this.offsetCameraX,
                this.gridOffsetY + this.offsetCameraY);
            this.gFront.scale(this.cameraZ, this.cameraZ);
            this.gFront.translate(this.cameraX, this.cameraY);

            this.map.draw(this.gFront);

            for (let user of this.users.values()) {
                user.drawShadow(this.gFront, this.map);
            }

            for (let emote of this.emotes) {
                emote.drawShadow(this.gFront, this.map);
            }

            for (let user of this.users.values()) {
                user.drawAvatar(this.gFront, this.map);
            }

            this.drawCursor();

            for (let user of this.users.values()) {
                user.drawName(this.gFront, this.map, this.fontSize);
            }

            if (this.drawHearing) {
                this.me.drawHearingRange(
                    this.gFront,
                    this.map,
                    this.audioDistanceMin,
                    this.audioDistanceMax);
            }

            for (let emote of this.emotes) {
                emote.drawEmote(this.gFront, this.map);
            }

        }
        this.gFront.restore();
    }


    drawCursor() {
        if (this.pointers.length === 1) {
            const pointer = this.pointers[0],
                tile = this.getTileAt(pointer);
            this.gFront.strokeStyle = this.map.isClear(tile.x, tile.y, this.me.avatar)
                ? "green"
                : "red";
            this.gFront.strokeRect(
                tile.x * this.map.tileWidth,
                tile.y * this.map.tileHeight,
                this.map.tileWidth,
                this.map.tileHeight);
        }
    }
}

const KEY = "CallaSettings";

/** @type {WeakMap<Settings, SettingsPrivate>} */
const selfs$4 = new WeakMap();

class SettingsPrivate {
    constructor() {
        this.drawHearing = false;
        this.audioDistanceMin = 1;
        this.audioDistanceMax = 10;
        this.audioRolloff = 1;
        this.fontSize = 12;
        this.transitionSpeed = 1;
        this.zoom = 1.5;
        this.roomName = "calla";
        this.userName = "";
        this.avatarEmoji = null;

        /** @type {string} */
        this.avatarURL = null;
        this.gamepadIndex = 0;

        /** @type {string} */
        this.preferredAudioOutputID = null;

        /** @type {string} */
        this.preferredAudioInputID = null;

        /** @type {string} */
        this.preferredVideoInputID = null;

        this.inputBinding = {
            keyButtonUp: "ArrowUp",
            keyButtonDown: "ArrowDown",
            keyButtonLeft: "ArrowLeft",
            keyButtonRight: "ArrowRight",
            keyButtonEmote: "e",
            keyButtonToggleAudio: "a",

            gpButtonUp: 12,
            gpButtonDown: 13,
            gpButtonLeft: 14,
            gpButtonRight: 15,
            gpButtonEmote: 0,
            gpButtonToggleAudio: 1
        };

        const selfStr = localStorage.getItem(KEY);
        if (selfStr) {
            Object.assign(
                this,
                JSON.parse(selfStr));
        }

        Object.seal(this);
    }

    commit() {
        localStorage.setItem(KEY, JSON.stringify(this));
    }
}

class Settings {
    constructor() {
        const self = new SettingsPrivate();
        selfs$4.set(this, self);

        if (window.location.hash.length > 0) {
            self.roomName = window.location.hash.substring(1);
        }
        Object.seal(this);
    }

    get preferredAudioOutputID() {
        return selfs$4.get(this).preferredAudioOutputID;
    }

    set preferredAudioOutputID(value) {
        if (value !== this.preferredAudioOutputID) {
            const self = selfs$4.get(this);
            self.preferredAudioOutputID = value;
            self.commit();
        }
    }

    get preferredAudioInputID() {
        return selfs$4.get(this).preferredAudioInputID;
    }

    set preferredAudioInputID(value) {
        if (value !== this.preferredAudioInputID) {
            const self = selfs$4.get(this);
            self.preferredAudioInputID = value;
            self.commit();
        }
    }

    get preferredVideoInputID() {
        return selfs$4.get(this).preferredVideoInputID;
    }

    set preferredVideoInputID(value) {
        if (value !== this.preferredVideoInputID) {
            const self = selfs$4.get(this);
            self.preferredVideoInputID = value;
            self.commit();
        }
    }

    get transitionSpeed() {
        return selfs$4.get(this).transitionSpeed;
    }

    set transitionSpeed(value) {
        if (value !== this.transitionSpeed) {
            const self = selfs$4.get(this);
            self.transitionSpeed = value;
            self.commit();
        }
    }

    get drawHearing() {
        return selfs$4.get(this).drawHearing;
    }

    set drawHearing(value) {
        if (value !== this.drawHearing) {
            const self = selfs$4.get(this);
            self.drawHearing = value;
            self.commit();
        }
    }

    get audioDistanceMin() {
        return selfs$4.get(this).audioDistanceMin;
    }

    set audioDistanceMin(value) {
        if (value !== this.audioDistanceMin) {
            const self = selfs$4.get(this);
            self.audioDistanceMin = value;
            self.commit();
        }
    }

    get audioDistanceMax() {
        return selfs$4.get(this).audioDistanceMax;
    }

    set audioDistanceMax(value) {
        if (value !== this.audioDistanceMax) {
            const self = selfs$4.get(this);
            self.audioDistanceMax = value;
            self.commit();
        }
    }

    get audioRolloff() {
        return selfs$4.get(this).audioRolloff;
    }

    set audioRolloff(value) {
        if (value !== this.audioRolloff) {
            const self = selfs$4.get(this);
            self.audioRolloff = value;
            self.commit();
        }
    }

    get fontSize() {
        return selfs$4.get(this).fontSize;
    }

    set fontSize(value) {
        if (value !== this.fontSize) {
            const self = selfs$4.get(this);
            self.fontSize = value;
            self.commit();
        }
    }

    get zoom() {
        return selfs$4.get(this).zoom;
    }

    set zoom(value) {
        if (value !== this.zoom) {
            const self = selfs$4.get(this);
            self.zoom = value;
            self.commit();
        }
    }

    get userName() {
        return selfs$4.get(this).userName;
    }

    set userName(value) {
        if (value !== this.userName) {
            const self = selfs$4.get(this);
            self.userName = value;
            self.commit();
        }
    }

    get avatarEmoji() {
        return selfs$4.get(this).avatarEmoji;
    }

    set avatarEmoji(value) {
        if (value !== this.avatarEmoji) {
            const self = selfs$4.get(this);
            self.avatarEmoji = value;
            self.commit();
        }
    }

    get avatarURL() {
        return selfs$4.get(this).avatarURL;
    }

    set avatarURL(value) {
        if (value !== this.avatarURL) {
            const self = selfs$4.get(this);
            self.avatarURL = value;
            self.commit();
        }
    }

    get roomName() {
        return selfs$4.get(this).roomName;
    }

    set roomName(value) {
        if (value !== this.roomName) {
            const self = selfs$4.get(this);
            self.roomName = value;
            self.commit();
        }
    }

    get gamepadIndex() {
        return selfs$4.get(this).gamepadIndex;
    }

    set gamepadIndex(value) {
        if (value !== this.gamepadIndex) {
            const self = selfs$4.get(this);
            self.gamepadIndex = value;
            self.commit();
        }
    }

    get inputBinding() {
        return selfs$4.get(this).inputBinding;
    }

    set inputBinding(value) {
        if (value !== this.inputBinding) {
            const self = selfs$4.get(this);
            for (let key in value) {
                self.inputBinding[key] = value[key];
            }
            self.commit();
        }
    }
}

class TimerTickEvent extends Event {
    constructor() {
        super("tick");
        this.dt = 0;
        this.t = 0;
        Object.seal(this);
    }
}

class BaseTimer extends EventBase {

    /**
     * 
     * @param {number} targetFrameRate
     */
    constructor(targetFrameRate) {
        super();

        this._timer = null;
        this.targetFrameRate = targetFrameRate;

        /**
         * @param {number} t
         */
        this._onTick = (t) => {
            const tickEvt = new TimerTickEvent();
            let lt = t;
            /**
             * @param {number} t
             */
            this._onTick = (t) => {
                tickEvt.t = t;
                tickEvt.dt = t - lt;
                lt = t;
                this.dispatchEvent(tickEvt);
            };
        };
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

class RequestAnimationFrameTimer extends BaseTimer {
    constructor() {
        super(60);
    }

    start() {
        const updater = (t) => {
            this._timer = requestAnimationFrame(updater);
            this._onTick(t);
        };
        this._timer = requestAnimationFrame(updater);
    }

    stop() {
        if (this.isRunning) {
            cancelAnimationFrame(this._timer);
            super.stop();
        }
    }

    get targetFrameRate() {
        return super.targetFrameRate;
    }

    set targetFrameRate(fps) {
    }
}

const disabler$4 = disabled(true),
    enabler$4 = disabled(false);

/**
 * @param {string} JITSI_HOST
 * @param {string} JVB_HOST
 * @param {string} JVB_MUC
 */
function init(JITSI_HOST, JVB_HOST, JVB_MUC) {
    const settings = new Settings(),
        game = new Game(),
        login = new LoginForm(),
        directory = new UserDirectoryForm(),
        headbar = new HeaderBar(),
        footbar = new FooterBar(),
        options = new OptionsForm(),
        emoji = new EmojiForm(),
        client = new CallaClient(JITSI_HOST, JVB_HOST, JVB_MUC),
        timer = new RequestAnimationFrameTimer(),

        forExport = {
            settings,
            client,
            game,
            login,
            directory,
            headbar,
            footbar,
            options,
            emoji
        },

        forAppend = [
            game,
            directory,
            options,
            emoji,
            headbar,
            footbar,
            login
        ].filter(x => x.element);

    function showLogin() {
        hide(game);
        hide(directory);
        hide(options);
        hide(emoji);
        headbar.enabled = false;
        footbar.enabled = false;
        show(login);
    }

    async function withEmojiSelection(callback) {
        if (!isOpen(emoji)) {
            disabler$4.apply(headbar.optionsButton);
            disabler$4.apply(headbar.instructionsButton);
            hide(options);
            const e = await emoji.selectAsync();
            if (e) {
                callback(e);
            }
            enabler$4.apply(headbar.optionsButton);
            enabler$4.apply(headbar.instructionsButton);
        }
    }

    async function selectEmojiAsync() {
        await withEmojiSelection((e) => {
            game.emote(client.localUser, e);
            footbar.setEmojiButton(settings.inputBinding.keyButtonEmote, e);
        });
    }

    function setAudioProperties() {
        client.setAudioProperties(
            settings.audioDistanceMin = game.audioDistanceMin = options.audioDistanceMin,
            settings.audioDistanceMax = game.audioDistanceMax = options.audioDistanceMax,
            settings.audioRolloff = options.audioRolloff,
            settings.transitionSpeed);
    }

    function refreshGamepads() {
        options.gamepads = navigator.getGamepads();
        options.gamepadIndex = game.gamepadIndex;
    }

    function refreshUser(userID) {
        game.withUser("list user in directory", userID, (user) => directory.set(user));
    }

    gridRowsDef("auto", "1fr", "auto").apply(document.body);

    let z = 0;
    for (let e of forAppend) {
        if (e.element) {
            let g = null;
            if (e === headbar) {
                g = gridPos(1, 1);
            }
            else if (e === footbar) {
                g = gridPos(1, 3);
            }
            else if (e === game || e === login) {
                g = gridPos(1, 1, 1, 3);
            }
            else {
                g = gridPos(1, 2);
            }
            g.apply(e.element);
            e.element.style.zIndex = (z++);
            document.body.append(e.element);
        }
    }

    refreshGamepads();
    headbar.enabled = false;
    footbar.enabled = false;
    options.drawHearing = game.drawHearing = settings.drawHearing;
    options.audioDistanceMin = game.audioDistanceMin = settings.audioDistanceMin;
    options.audioDistanceMax = game.audioDistanceMax = settings.audioDistanceMax;
    options.audioRolloff = settings.audioRolloff;
    options.fontSize = game.fontSize = settings.fontSize;
    options.gamepadIndex = game.gamepadIndex = settings.gamepadIndex;
    options.inputBinding = game.inputBinding = settings.inputBinding;

    game.cameraZ = game.targetCameraZ = settings.zoom;
    game.transitionSpeed = settings.transitionSpeed = 0.5;
    login.userName = settings.userName;
    login.roomName = settings.roomName;

    client.audio
        .addClip("join", "audio/door-open.ogg", "audio/door-open.mp3", "audio/door-open.wav")
        .addClip("leave", "audio/door-close.ogg", "audio/door-close.mp3", "audio/door-close.wav");

    showLogin();

    addEventListeners(window, {
        gamepadconnected: refreshGamepads,
        gamepaddisconnected: refreshGamepads,

        resize: () => {
            game.resize();
        }
    });

    /**
     * @callback showViewCallback
     * @returns {void}
     */

    /**
     * @param {FormDialog} view
     * @returns {showViewCallback}
     */
    const showView = (view) => () => {
        if (!isOpen(emoji)) {
            const open = isOpen(view);
            hide(login);
            hide(directory);
            hide(options);
            setOpen(view, !open);
        }
    };

    addEventListeners(headbar, {
        toggleOptions: showView(options),
        toggleInstructions: showView(login),
        toggleUserDirectory: showView(directory),

        tweet: () => {
            const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
                url = new URL("https://twitter.com/intent/tweet?text=" + message);
            window.open(url);
        },

        leave: async () => {
            directory.clear();
            await client.leaveAsync();
        }
    });

    addEventListeners(footbar, {
        selectEmoji: selectEmojiAsync,

        emote: () => {
            game.emote(client.localUser, game.currentEmoji);
        },

        toggleAudio: async () => {
            await client.toggleAudioMutedAsync();
        },

        toggleVideo: async () => {
            await client.toggleVideoMutedAsync();
        }
    });


    login.addEventListener("login", () => {
        client.startAudio();
        setAudioProperties();
        if (window.location.hostname !== "localhost") {
            window.history.replaceState(undefined, undefined, "#" + login.roomName);
        }

        client.join(
            settings.roomName = login.roomName,
            settings.userName = login.userName);
    });


    addEventListeners(options, {
        audioPropertiesChanged: setAudioProperties,

        selectAvatar: async () => {
            await withEmojiSelection((e) => {
                settings.avatarEmoji
                    = client.avatarEmoji
                    = game.me.avatarEmoji
                    = e;
                refreshUser(client.localUser);
            });
        },

        avatarURLChanged: () => {
            settings.avatarURL
                = client.avatarURL
                = game.me.avatarImage
                = options.avatarURL;
            refreshUser(client.localUser);
        },

        toggleDrawHearing: () => {
            settings.drawHearing
                = game.drawHearing
                = options.drawHearing;
        },

        fontSizeChanged: () => {
            settings.fontSize
                = game.fontSize
                = options.fontSize;
        },

        gamepadChanged: () => {
            settings.gamepadIndex
                = game.gamepadIndex
                = options.gamepadIndex;
        },

        inputBindingChanged: () => {
            settings.inputBinding
                = game.inputBinding
                = options.inputBinding;
        },

        audioInputChanged: async () => {
            const device = options.currentAudioInputDevice;
            await client.setAudioInputDeviceAsync(device);
            settings.preferredAudioInputID = client.preferredAudioInputID;
        },

        audioOutputChanged: async () => {
            const device = options.currentAudioOutputDevice;
            await client.setAudioOutputDeviceAsync(device);
            settings.preferredAudioOutputID = client.preferredAudioOutputID;
        },

        videoInputChanged: async () => {
            const device = options.currentVideoInputDevice;
            await client.setVideoInputDeviceAsync(device);
            settings.preferredVideoInputID = client.preferredVideoInputID;
        },

        toggleVideo: async () => {
            await client.toggleVideoMutedAsync();
        }
    });

    addEventListeners(game, {
        emojiNeeded: selectEmojiAsync,

        emote: (evt) => {
            client.emote(evt.emoji);
        },

        userJoined: (evt) => {
            refreshUser(evt.user.id);
        },

        toggleAudio: async () => {
            await client.toggleAudioMutedAsync();
            settings.preferredAudioInputID = client.preferredAudioInputID;
        },

        toggleVideo: async () => {
            await client.toggleVideoMutedAsync();
            settings.preferredVideoInputID = client.preferredVideoInputID;
        },

        gameStarted: () => {
            gridPos(1, 2).apply(login.element);
            hide(login);

            options.user = game.me;

            headbar.enabled = true;
            footbar.enabled = true;

            settings.avatarEmoji
                = client.avatarEmoji
                = game.me.avatarEmoji
                = settings.avatarEmoji
                || allPeople.random();

            refreshUser(client.localUser);
        },

        userMoved: (evt) => {
            client.setLocalPosition(evt.x, 0, evt.y);
        },

        gameEnded: () => {
            gridPos(1, 1, 1, 3).apply(login.element);
            login.connected = false;
            showLogin();
        },

        zoomChanged: () => {
            settings.zoom = game.targetCameraZ;
        }
    });

    directory.addEventListener("warpTo", (evt) => {
        game.visit(evt.id);
    });

    addEventListeners(client, {

        videoConferenceJoined: async (evt) => {
            login.connected = true;

            await game.startAsync(evt.id, evt.displayName, evt.pose, evt.avatarURL, evt.roomName);

            client.avatarURL
                = game.me.avatarImage
                = options.avatarURL
                = settings.avatarURL;

            options.audioInputDevices = await client.getAudioInputDevicesAsync();
            options.audioOutputDevices = await client.getAudioOutputDevicesAsync();
            options.videoInputDevices = await client.getVideoInputDevicesAsync();

            settings.preferredAudioInputID = client.preferredAudioInputID;
            settings.preferredAudioOutputID = client.preferredAudioOutputID;
            settings.preferredVideoInputID = client.preferredVideoInputID;

            options.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
            options.currentAudioOutputDevice = await client.getCurrentAudioOutputDeviceAsync();
            options.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();

            const audioMuted = client.isAudioMuted;
            game.muteUserAudio(client.localUser, audioMuted);
            footbar.audioEnabled = !audioMuted;

            const videoMuted = client.isVideoMuted;
            game.muteUserVideo(client.localUser, videoMuted);
            footbar.videoEnabled = !videoMuted;
        },

        videoConferenceLeft: () => {
            game.end();
        },

        participantJoined: (evt) => {
            client.audio.playClip("join", 0.5);
            game.addUser(evt.id, evt.displayName, evt.pose);
        },

        participantLeft: (evt) => {
            client.audio.playClip("leave", 0.5);
            game.removeUser(evt.id);
            directory.delete(evt.id);
        },

        audioChanged: (evt) => {
            refreshUser(evt.id);
        },

        videoChanged: (evt) => {
            game.setAvatarVideo(evt.id, evt.stream);
            refreshUser(evt.id);
        },

        avatarChanged: (evt) => {
            game.setAvatarURL(evt.id, evt.url);
            refreshUser(evt.id);
        },

        displayNameChange: (evt) => {
            game.changeUserName(evt.id, evt.displayName);
            refreshUser(evt.id);
        },

        audioMuteStatusChanged: async (evt) => {
            game.muteUserAudio(evt.id, evt.muted);
        },

        localAudioMuteStatusChanged: async (evt) => {
            footbar.audioEnabled = !evt.muted;
            options.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
            settings.preferredAudioInputID = client.preferredAudioInputID;
        },

        videoMuteStatusChanged: async (evt) => {
            game.muteUserVideo(evt.id, evt.muted);
            settings.preferredVideoInputID = client.preferredVideoInputID;
        },

        localVideoMuteStatusChanged: async (evt) => {
            footbar.videoEnabled = !evt.muted;
            if (evt.muted) {
                options.setAvatarVideo(null);
            }
            else {
                options.setAvatarVideo(game.me.avatarVideo.element);
            }
            options.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();
        },

        userInitRequest: (evt) => {
            client.userInitResponse(evt.id, game.me.serialize());
        },

        userInitResponse: (evt) => {
            game.initializeUser(evt.id, evt);
            refreshUser(evt.id);
        },

        emote: (evt) => {
            game.emote(evt.id, evt);
        },

        setAvatarEmoji: (evt) => {
            game.setAvatarEmoji(evt.id, evt);
            refreshUser(evt.id);
        },

        audioActivity: (evt) => {
            game.updateAudioActivity(evt.id, evt.isActive);
        }
    });

    timer.addEventListener("tick", (evt) => {
        client.audio.update();
        options.update();
        directory.update();
        game.update(evt.dt);
    });

    login.ready = true;
    timer.start();

    return forExport;
}

init(JITSI_HOST, JVB_HOST, JVB_MUC);
