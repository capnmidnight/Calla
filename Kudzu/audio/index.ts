import { onUserGesture } from "../events/onUserGesture";
import { isArray, isDefined, isNullOrUndefined, isNumber } from "../typeChecks";

export type AudioVertex = AudioNodeType | AudioParam;

const graph = new Map<AudioNode, Set<AudioNode | AudioParam>>();
const children = new WeakMap<AudioNode, number>();
const names = new WeakMap<AudioNode | AudioParam, string>();

function add(a: AudioNodeType, b: AudioVertex): boolean {
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
        graph.set(a, new Set<AudioNode | AudioParam>());
    }

    const g = graph.get(a);
    if (g.has(b)) {
        return false;
    }

    g.add(b);
    return true;
}

function rem(a: AudioNodeType, b?: AudioVertex): boolean {
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

function isAudioNode(a: AudioVertex | number): a is AudioNode {
    return isDefined(a)
        && isDefined((a as AudioNode).context);
}

function isAudioParam(a: AudioVertex): a is AudioParam {
    return !isAudioNode(a);
}

export function nameVertex<T>(name: string, node: T & AudioNode): T;
export function nameVertex<T>(name: string, param: T & AudioParam): T;
export function nameVertex<T>(name: string, v: T & (AudioNode | AudioParam)): T {
    names.set(v, name);
    return v;
}

export function connect(a: AudioNodeType, destinationNode: AudioNodeType, output?: number, input?: number): boolean;
export function connect(a: AudioNodeType, destinationParam: AudioParam, output?: number): boolean;
export function connect(a: AudioNodeType, b: AudioVertex, c?: number, d?: number): boolean {
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


export function disconnect(a: AudioNodeType): boolean;
export function disconnect(a: AudioNodeType, output: number): boolean;
export function disconnect(a: AudioNodeType, destinationNode: AudioNodeType, output: number, input: number): boolean;
export function disconnect(a: AudioNodeType, destinationNode: AudioNodeType, output: number): boolean;
export function disconnect(a: AudioNodeType, destinationNode: AudioNodeType): boolean;
export function disconnect(a: AudioNodeType, destinationParam: AudioParam, output: number): boolean;
export function disconnect(a: AudioNodeType, destinationParam: AudioParam): boolean;
export function disconnect(a: AudioNodeType, b?: number | AudioVertex, c?: number, d?: number): boolean {
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

interface Node {
    pre: string;
    node: AudioNode | AudioParam;
}

export function print() {
    for (const node of graph.keys()) {
        if (!children.has(node)) {
            const stack = new Array<Node>();
            stack.push({
                pre: "",
                node
            });

            while (stack.length > 0) {
                const { pre, node } = stack.pop();
                const name = names.get(node) || "???";
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

(window as any).printGraph = print;

export const hasAudioContext = "AudioContext" in globalThis;
export const hasAudioListener = hasAudioContext && "AudioListener" in globalThis;
export const hasOldAudioListener = hasAudioListener && "setPosition" in AudioListener.prototype;
export const hasNewAudioListener = hasAudioListener && "positionX" in AudioListener.prototype;

export const audioCtx = new AudioContext();
nameVertex("speakers", audioCtx.destination);

export const audioReady = new Promise<void>((resolve) => {
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

        onUserGesture(() => audioCtx.resume());
    }
});

export interface ErsatzAudioNode {
    input: AudioNode;
    output: AudioNode;
}

export type AudioNodeType = AudioNode | ErsatzAudioNode;

export function isErsatzAudioNode(value: any): value is ErsatzAudioNode {
    return isDefined(value)
        && "input" in value
        && "output" in value
        && value.input instanceof AudioNode
        && value.output instanceof AudioNode;
}

export class AudioInit<ValueT> {
    private readonly types: Function[];

    constructor(private readonly fieldName: string, private readonly value: ValueT, ...types: Function[]) {
        this.types = types;
    }

    apply(node: AudioNode) {
        if (!(this.fieldName in node)) {
            throw new Error("Node doesn't have field: " + this.fieldName);
        }

        if (this.types.map(t => node instanceof t)
            .reduce((a, b) =>
                a || b, this.types.length === 0)) {
            const field = (node as any)[this.fieldName];
            if (field instanceof AudioParam) {
                if (isNumber(this.value)) {
                    field.setValueAtTime(this.value, audioCtx.currentTime);
                }
                else {
                    throw new Error("Expected a number");
                }
            }
            else if (typeof field === typeof this.value) {
                (node as any)[this.fieldName] = this.value;
            }
            else {
                throw new Error("Expected a " + typeof field);
            }
        }
    }
}

type AudioNodeParam<ValueT>
    = AudioNodeType
    | [number, AudioNodeType | AudioParam]
    | [number, number, AudioNodeType]
    | AudioInit<ValueT>;

function initAudio<NodeT extends AudioNode, ValueT>(name: string, node: NodeT, ...rest: (AudioNodeParam<ValueT>)[]) {
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


export function decodeAudioData(audioData: ArrayBuffer): Promise<AudioBuffer> {
    return audioCtx.decodeAudioData(audioData);
}

export function Buffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer {
    return audioCtx.createBuffer(numberOfChannels, length, sampleRate);
}

export function PeriodicWave(real: number[] | Float32Array, imag: number[] | Float32Array, constraints?: PeriodicWaveConstraints): PeriodicWave {
    return audioCtx.createPeriodicWave(real, imag, constraints);
}

type BaseAudioNodeParamType = number | ChannelCountMode | ChannelInterpretation;



export function Analyser(name: string, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): AnalyserNode { return initAudio(name, audioCtx.createAnalyser(), ...rest); }
export function BiquadFilter(name: string, ...rest: AudioNodeParam<BaseAudioNodeParamType | BiquadFilterType>[]): BiquadFilterNode { return initAudio(name, audioCtx.createBiquadFilter(), ...rest); }
export function BufferSource(name: string, ...rest: AudioNodeParam<BaseAudioNodeParamType| boolean | AudioBuffer>[]): AudioBufferSourceNode { return initAudio(name, audioCtx.createBufferSource(), ...rest); }
export function ChannelMerger(name: string, numberOfInputs?: number, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): ChannelMergerNode { return initAudio(name, audioCtx.createChannelMerger(numberOfInputs), ...rest); }
export function ChannelSplitter(name: string, numberOfOutputs?: number, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): ChannelSplitterNode { return initAudio(name, audioCtx.createChannelSplitter(numberOfOutputs), ...rest); }
export function ConstantSource(name: string, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): ConstantSourceNode { return initAudio(name, audioCtx.createConstantSource(), ...rest); }
export function Convolver(name: string, ...rest: AudioNodeParam<BaseAudioNodeParamType | boolean>[]): ConvolverNode { return initAudio(name, audioCtx.createConvolver(), ...rest); }
export function Delay(name: string, maxDelayTime?: number, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): DelayNode { return initAudio(name, audioCtx.createDelay(maxDelayTime), ...rest); }
export function DynamicsCompressor(name: string, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): DynamicsCompressorNode { return initAudio(name, audioCtx.createDynamicsCompressor(), ...rest); }
export function Gain(name: string, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): GainNode { return initAudio(name, audioCtx.createGain(), ...rest); }
export function IIRFilter(name: string, feedforward: number[], feedback: number[], ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): IIRFilterNode { return initAudio(name, audioCtx.createIIRFilter(feedforward, feedback), ...rest); }
export function MediaElementSource(name: string, mediaElement: HTMLMediaElement, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): MediaElementAudioSourceNode { return initAudio(name, audioCtx.createMediaElementSource(mediaElement), ...rest); }
export function MediaStreamDestination(name: string, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): MediaStreamAudioDestinationNode { return initAudio(name, audioCtx.createMediaStreamDestination(), ...rest); }
export function MediaStreamSource(name: string, mediaStream: MediaStream, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): MediaStreamAudioSourceNode { return initAudio(name, audioCtx.createMediaStreamSource(mediaStream), ...rest); }
export function MediaStreamTrackSource(name: string, mediaStreamTrack: MediaStreamTrack, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): MediaStreamTrackAudioSourceNode { return initAudio(name, audioCtx.createMediaStreamTrackSource(mediaStreamTrack), ...rest); }
export function Oscillator(name: string, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): OscillatorNode { return initAudio(name, audioCtx.createOscillator(), ...rest); }
export function Panner(name: string, ...rest: AudioNodeParam<BaseAudioNodeParamType | PanningModelType | DistanceModelType>[]): PannerNode { return initAudio(name, audioCtx.createPanner(), ...rest); }
export function ScriptProcessor(name: string, bufferSize?: number, numberOfInputChannels?: number, numberOfOutputChannels?: number, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): ScriptProcessorNode { return initAudio(name, audioCtx.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels), ...rest); }
export function StereoPanner(name: string, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): StereoPannerNode { return initAudio(name, audioCtx.createStereoPanner(), ...rest); }
export function WaveShaper(name: string, ...rest: AudioNodeParam<BaseAudioNodeParamType>[]): WaveShaperNode { return initAudio(name, audioCtx.createWaveShaper(), ...rest); }

export function attack(value: number): AudioInit<number> { return new AudioInit("attack", value, DynamicsCompressorNode); }
export function biquadFilterType(value: BiquadFilterType): AudioInit<BiquadFilterType> { return new AudioInit("type", value, BiquadFilterNode); }
export function buffer(value: AudioBuffer): AudioInit<AudioBuffer> { return new AudioInit("buffer", value, AudioBufferSourceNode, ConvolverNode); }
export function channelCount(value: number): AudioInit<number> { return new AudioInit("channelCount", value, AudioNode); }
export function channelCountMode(value: ChannelCountMode): AudioInit<ChannelCountMode> { return new AudioInit("channelCountMode", value, AudioNode); }
export function channelInterpretation(value: ChannelInterpretation): AudioInit<ChannelInterpretation> { return new AudioInit("channelInterpretation", value, AudioNode); }
export function coneInnerAngle(value: number): AudioInit<number> { return new AudioInit("coneInnerAngle", value, PannerNode); }
export function coneOuterAngle(value: number): AudioInit<number> { return new AudioInit("coneOuterAngle", value, PannerNode); }
export function coneOuterGain(value: number): AudioInit<number> { return new AudioInit("coneOuterGain", value, PannerNode); }
export function curve(value: Float32Array): AudioInit<Float32Array> { return new AudioInit("curve", value, WaveShaperNode); }
export function delayTime(value: number): AudioInit<number> { return new AudioInit("delayTime", value, DelayNode); }
export function detune(value: number): AudioInit<number> { return new AudioInit("detune", value, BiquadFilterNode, AudioBufferSourceNode, OscillatorNode); }
export function distanceModel(value: DistanceModelType): AudioInit<DistanceModelType> { return new AudioInit("distanceModel", value, PannerNode); }
export function fftSize(value: number): AudioInit<number> { return new AudioInit("fftSize", value, AnalyserNode); }
export function frequency(value: number): AudioInit<number> { return new AudioInit("frequency", value, BiquadFilterNode, OscillatorNode); }
export function gain(value: number): AudioInit<number> { return new AudioInit("gain", value, BiquadFilterNode, GainNode); }
export function iirFilterType(value: OscillatorType): AudioInit<OscillatorType> { return new AudioInit("type", value, IIRFilterNode); }
export function knee(value: number): AudioInit<number> { return new AudioInit("knee", value, DynamicsCompressorNode); }
export function loop(value: boolean): AudioInit<boolean> { return new AudioInit("loop", value, AudioBufferSourceNode); }
export function loopEnd(value: number): AudioInit<number> { return new AudioInit("loopEnd", value, AudioBufferSourceNode); }
export function loopStart(value: number): AudioInit<number> { return new AudioInit("loopStart", value, AudioBufferSourceNode); }
export function maxDecibels(value: number): AudioInit<number> { return new AudioInit("maxDecibels", value, AnalyserNode); }
export function maxDistance(value: number): AudioInit<number> { return new AudioInit("maxDistance", value, PannerNode); }
export function minDecibels(value: number): AudioInit<number> { return new AudioInit("minDecibels", value, AnalyserNode); }
export function normalize(value: boolean): AudioInit<boolean> { return new AudioInit("normalize", value, ConvolverNode); }
export function offset(value: number): AudioInit<number> { return new AudioInit("offset", value, ConstantSourceNode); }
export function orientationX(value: number): AudioInit<number> { return new AudioInit("orientationX", value, PannerNode); }
export function orientationY(value: number): AudioInit<number> { return new AudioInit("orientationY", value, PannerNode); }
export function orientationZ(value: number): AudioInit<number> { return new AudioInit("orientationZ", value, PannerNode); }
export function oscillatorType(value: OscillatorType): AudioInit<OscillatorType> { return new AudioInit("type", value, OscillatorNode); }
export function oversample(value: OverSampleType): AudioInit<OverSampleType> { return new AudioInit("oversample", value, WaveShaperNode); }
export function pan(value: number): AudioInit<number> { return new AudioInit("pan", value, StereoPannerNode); }
export function panningModel(value: PanningModelType): AudioInit<PanningModelType> { return new AudioInit("panningModel", value, PannerNode); }
export function positionX(value: number): AudioInit<number> { return new AudioInit("positionX", value, PannerNode); }
export function positionY(value: number): AudioInit<number> { return new AudioInit("positionY", value, PannerNode); }
export function positionZ(value: number): AudioInit<number> { return new AudioInit("positionZ", value, PannerNode); }
export function Q(value: number): AudioInit<number> { return new AudioInit("Q", value, BiquadFilterNode); }
export function ratio(value: number): AudioInit<number> { return new AudioInit("ratio", value, DynamicsCompressorNode); }
export function refDistance(value: number): AudioInit<number> { return new AudioInit("refDistance", value, PannerNode); }
export function release(value: number): AudioInit<number> { return new AudioInit("release", value, DynamicsCompressorNode); }
export function rolloffFactor(value: number): AudioInit<number> { return new AudioInit("rolloffFactor", value, PannerNode); }
export function smoothingTimeConstant(value: number): AudioInit<number> { return new AudioInit("smoothingTimeConstant", value, AnalyserNode); }
export function threshold(value: number): AudioInit<number> { return new AudioInit("threshold", value, DynamicsCompressorNode); }
