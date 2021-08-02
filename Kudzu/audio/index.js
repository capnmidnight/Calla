import { isArray, isDefined, isNullOrUndefined, isNumber } from "../typeChecks";
const graph = new Map();
const children = new WeakMap();
const names = new WeakMap();
function add(a, b) {
    if (isErsatzAudioNode(a)) {
        a = a.output;
    }
    if (isErsatzAudioNode(b)) {
        b = b.input;
    }
    if (isAudioNode(b)) {
        children.set(b, (children.get(b) || 0) + 1);
    }
    if (!graph.has(a)) {
        graph.set(a, new Set());
    }
    const g = graph.get(a);
    if (g.has(b)) {
        return false;
    }
    g.add(b);
    return true;
}
function rem(a, b) {
    if (isErsatzAudioNode(a)) {
        a = a.output;
    }
    if (isErsatzAudioNode(b)) {
        b = b.input;
    }
    if (!graph.has(a)) {
        return false;
    }
    const g = graph.get(a);
    let removed = false;
    if (isNullOrUndefined(b)) {
        removed = g.size > 0;
        g.clear();
    }
    else if (g.has(b)) {
        removed = true;
        g.delete(b);
    }
    if (g.size === 0) {
        graph.delete(a);
    }
    if (isAudioNode(b)
        && children.has(b)) {
        const newCount = children.get(b) - 1;
        children.set(b, newCount);
        if (newCount === 0) {
            children.delete(b);
        }
    }
    return removed;
}
function isAudioNode(a) {
    return isDefined(a)
        && isDefined(a.context);
}
function isAudioParam(a) {
    return !isAudioNode(a);
}
export function nameVertex(name, v) {
    names.set(v, name);
    return v;
}
export function connect(a, b, c, d) {
    if (isErsatzAudioNode(a)) {
        a = a.output;
    }
    if (isErsatzAudioNode(b)) {
        b = b.input;
    }
    if (isAudioNode(b)) {
        a.connect(b, c, d);
        return add(a, b);
    }
    else {
        a.connect(b, c);
        return add(a, b);
    }
}
export function disconnect(a, b, c, d) {
    if (isErsatzAudioNode(a)) {
        a = a.output;
    }
    if (isErsatzAudioNode(b)) {
        b = b.input;
    }
    if (isNullOrUndefined(b)) {
        a.disconnect();
        return rem(a);
    }
    else if (isNumber(b)) {
        a.disconnect(b);
        return rem(a);
    }
    else if (isAudioNode(b)
        && isNumber(c)
        && isNumber(d)) {
        a.disconnect(b, c, d);
        return rem(a, b);
    }
    else if (isAudioNode(b)
        && isNumber(c)) {
        a.disconnect(b, c);
        return rem(a, b);
    }
    else if (isAudioNode(b)) {
        a.disconnect(b);
        return rem(a, b);
    }
    else if (isAudioParam(b)
        && isNumber(c)) {
        a.disconnect(b);
        return rem(a, b);
    }
    else if (isAudioParam(b)) {
        a.disconnect(b);
        return rem(a, b);
    }
    return false;
}
export function print() {
    for (const node of graph.keys()) {
        if (!children.has(node)) {
            const stack = new Array();
            stack.push({
                pre: "",
                node
            });
            while (stack.length > 0) {
                const { pre, node } = stack.pop();
                const name = names.get(node) ?? "???";
                console.log(pre, name, node);
                if (isAudioNode(node)) {
                    const set = graph.get(node);
                    if (set) {
                        for (const child of set) {
                            stack.push({
                                pre: pre + "  ",
                                node: child
                            });
                        }
                    }
                }
            }
        }
    }
}
window.printGraph = print;
export const hasAudioContext = "AudioContext" in globalThis;
export const hasAudioListener = hasAudioContext && "AudioListener" in globalThis;
export const hasOldAudioListener = hasAudioListener && "setPosition" in AudioListener.prototype;
export const hasNewAudioListener = hasAudioListener && "positionX" in AudioListener.prototype;
export const audioCtx = new AudioContext();
nameVertex("speakers", audioCtx.destination);
export const audioReady = new Promise((resolve) => {
    if (audioCtx.state === "running") {
        resolve();
    }
    else {
        const onReady = () => {
            if (audioCtx.state === "running") {
                audioCtx.removeEventListener("statechange", onReady);
                resolve();
            }
        };
        audioCtx.addEventListener("statechange", onReady);
    }
});
export function isErsatzAudioNode(value) {
    return isDefined(value)
        && "input" in value
        && "output" in value
        && value.input instanceof AudioNode
        && value.output instanceof AudioNode;
}
export class AudioInit {
    fieldName;
    value;
    types;
    constructor(fieldName, value, ...types) {
        this.fieldName = fieldName;
        this.value = value;
        this.types = types;
    }
    apply(node) {
        if (!(this.fieldName in node)) {
            throw new Error("Node doesn't have field: " + this.fieldName);
        }
        if (this.types.map(t => node instanceof t)
            .reduce((a, b) => a || b, this.types.length === 0)) {
            const field = node[this.fieldName];
            if (field instanceof AudioParam) {
                if (isNumber(this.value)) {
                    field.setValueAtTime(this.value, audioCtx.currentTime);
                }
                else {
                    throw new Error("Expected a number");
                }
            }
            else if (typeof field === typeof this.value) {
                node[this.fieldName] = this.value;
            }
            else {
                throw new Error("Expected a " + typeof field);
            }
        }
    }
}
function initAudio(name, node, ...rest) {
    nameVertex(name, node);
    for (const prop of rest) {
        if (prop instanceof AudioNode) {
            connect(node, prop);
        }
        else if (isErsatzAudioNode(prop)) {
            connect(node, prop.input);
        }
        else if (isArray(prop)) {
            if (prop.length === 2) {
                let [output, node2] = prop;
                if (isErsatzAudioNode(node2)) {
                    node2 = node2.input;
                }
                if (node2 instanceof AudioNode) {
                    connect(node, node2, output);
                }
                else {
                    connect(node, node2, output);
                }
            }
            else if (prop.length === 3) {
                let [output, input, node2] = prop;
                if (isErsatzAudioNode(node2)) {
                    node2 = node2.input;
                }
                connect(node, node2, output, input);
            }
        }
        else {
            prop.apply(node);
        }
    }
    return node;
}
export function decodeAudioData(audioData) {
    return audioCtx.decodeAudioData(audioData);
}
export function Buffer(numberOfChannels, length, sampleRate) {
    return audioCtx.createBuffer(numberOfChannels, length, sampleRate);
}
export function PeriodicWave(real, imag, constraints) {
    return audioCtx.createPeriodicWave(real, imag, constraints);
}
export function Analyser(name, ...rest) { return initAudio(name, audioCtx.createAnalyser(), ...rest); }
export function BiquadFilter(name, ...rest) { return initAudio(name, audioCtx.createBiquadFilter(), ...rest); }
export function BufferSource(name, ...rest) { return initAudio(name, audioCtx.createBufferSource(), ...rest); }
export function ChannelMerger(name, numberOfInputs, ...rest) { return initAudio(name, audioCtx.createChannelMerger(numberOfInputs), ...rest); }
export function ChannelSplitter(name, numberOfOutputs, ...rest) { return initAudio(name, audioCtx.createChannelSplitter(numberOfOutputs), ...rest); }
export function ConstantSource(name, ...rest) { return initAudio(name, audioCtx.createConstantSource(), ...rest); }
export function Convolver(name, ...rest) { return initAudio(name, audioCtx.createConvolver(), ...rest); }
export function Delay(name, maxDelayTime, ...rest) { return initAudio(name, audioCtx.createDelay(maxDelayTime), ...rest); }
export function DynamicsCompressor(name, ...rest) { return initAudio(name, audioCtx.createDynamicsCompressor(), ...rest); }
export function Gain(name, ...rest) { return initAudio(name, audioCtx.createGain(), ...rest); }
export function IIRFilter(name, feedforward, feedback, ...rest) { return initAudio(name, audioCtx.createIIRFilter(feedforward, feedback), ...rest); }
export function MediaElementSource(name, mediaElement, ...rest) { return initAudio(name, audioCtx.createMediaElementSource(mediaElement), ...rest); }
export function MediaStreamDestination(name, ...rest) { return initAudio(name, audioCtx.createMediaStreamDestination(), ...rest); }
export function MediaStreamSource(name, mediaStream, ...rest) { return initAudio(name, audioCtx.createMediaStreamSource(mediaStream), ...rest); }
export function MediaStreamTrackSource(name, mediaStreamTrack, ...rest) { return initAudio(name, audioCtx.createMediaStreamTrackSource(mediaStreamTrack), ...rest); }
export function Oscillator(name, ...rest) { return initAudio(name, audioCtx.createOscillator(), ...rest); }
export function Panner(name, ...rest) { return initAudio(name, audioCtx.createPanner(), ...rest); }
export function ScriptProcessor(name, bufferSize, numberOfInputChannels, numberOfOutputChannels, ...rest) { return initAudio(name, audioCtx.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels), ...rest); }
export function StereoPanner(name, ...rest) { return initAudio(name, audioCtx.createStereoPanner(), ...rest); }
export function WaveShaper(name, ...rest) { return initAudio(name, audioCtx.createWaveShaper(), ...rest); }
export function attack(value) { return new AudioInit("attack", value, DynamicsCompressorNode); }
export function biquadFilterType(value) { return new AudioInit("type", value, BiquadFilterNode); }
export function buffer(value) { return new AudioInit("buffer", value, AudioBufferSourceNode, ConvolverNode); }
export function channelCount(value) { return new AudioInit("channelCount", value, AudioNode); }
export function channelCountMode(value) { return new AudioInit("channelCountMode", value, AudioNode); }
export function channelInterpretation(value) { return new AudioInit("channelInterpretation", value, AudioNode); }
export function coneInnerAngle(value) { return new AudioInit("coneInnerAngle", value, PannerNode); }
export function coneOuterAngle(value) { return new AudioInit("coneOuterAngle", value, PannerNode); }
export function coneOuterGain(value) { return new AudioInit("coneOuterGain", value, PannerNode); }
export function curve(value) { return new AudioInit("curve", value, WaveShaperNode); }
export function delayTime(value) { return new AudioInit("delayTime", value, DelayNode); }
export function detune(value) { return new AudioInit("detune", value, BiquadFilterNode, AudioBufferSourceNode, OscillatorNode); }
export function distanceModel(value) { return new AudioInit("distanceModel", value, PannerNode); }
export function fftSize(value) { return new AudioInit("fftSize", value, AnalyserNode); }
export function frequency(value) { return new AudioInit("frequency", value, BiquadFilterNode, OscillatorNode); }
export function gain(value) { return new AudioInit("gain", value, BiquadFilterNode, GainNode); }
export function iirFilterType(value) { return new AudioInit("type", value, IIRFilterNode); }
export function knee(value) { return new AudioInit("knee", value, DynamicsCompressorNode); }
export function loop(value) { return new AudioInit("loop", value, AudioBufferSourceNode); }
export function loopEnd(value) { return new AudioInit("loopEnd", value, AudioBufferSourceNode); }
export function loopStart(value) { return new AudioInit("loopStart", value, AudioBufferSourceNode); }
export function maxDecibels(value) { return new AudioInit("maxDecibels", value, AnalyserNode); }
export function maxDistance(value) { return new AudioInit("maxDistance", value, PannerNode); }
export function minDecibels(value) { return new AudioInit("minDecibels", value, AnalyserNode); }
export function normalize(value) { return new AudioInit("normalize", value, ConvolverNode); }
export function offset(value) { return new AudioInit("offset", value, ConstantSourceNode); }
export function orientationX(value) { return new AudioInit("orientationX", value, PannerNode); }
export function orientationY(value) { return new AudioInit("orientationY", value, PannerNode); }
export function orientationZ(value) { return new AudioInit("orientationZ", value, PannerNode); }
export function oscillatorType(value) { return new AudioInit("type", value, OscillatorNode); }
export function oversample(value) { return new AudioInit("oversample", value, WaveShaperNode); }
export function pan(value) { return new AudioInit("pan", value, StereoPannerNode); }
export function panningModel(value) { return new AudioInit("panningModel", value, PannerNode); }
export function positionX(value) { return new AudioInit("positionX", value, PannerNode); }
export function positionY(value) { return new AudioInit("positionY", value, PannerNode); }
export function positionZ(value) { return new AudioInit("positionZ", value, PannerNode); }
export function Q(value) { return new AudioInit("Q", value, BiquadFilterNode); }
export function ratio(value) { return new AudioInit("ratio", value, DynamicsCompressorNode); }
export function refDistance(value) { return new AudioInit("refDistance", value, PannerNode); }
export function release(value) { return new AudioInit("release", value, DynamicsCompressorNode); }
export function rolloffFactor(value) { return new AudioInit("rolloffFactor", value, PannerNode); }
export function smoothingTimeConstant(value) { return new AudioInit("smoothingTimeConstant", value, AnalyserNode); }
export function threshold(value) { return new AudioInit("threshold", value, DynamicsCompressorNode); }
//# sourceMappingURL=index.js.map