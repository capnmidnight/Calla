import type { IDisposable } from "kudzu";
import { clamp, isGoodNumber, TypedEventBase } from "kudzu";
import { AudioActivityEvent } from "./AudioActivityEvent";
import type { AudioSource } from "./AudioSource";
import { BaseNode } from "./spatializers/nodes/BaseNode";

const audioActivityEvt = new AudioActivityEvent();
const activityCounterMin = 0;
const activityCounterMax = 60;
const activityCounterThresh = 5;

function frequencyToIndex(frequency: number, sampleRate: number, bufferSize: number): number {
    const nyquist = sampleRate / 2;
    const index = Math.round(frequency / nyquist * bufferSize);
    return clamp(index, 0, bufferSize);
}

function analyserFrequencyAverage(analyser: AnalyserNode, frequencies: Float32Array, minHz: number, maxHz: number, bufferSize: number): number {
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

interface AudioAnaylserEvents {
    audioActivity: AudioActivityEvent;
}

export class ActivityAnalyser
    extends TypedEventBase<AudioAnaylserEvents>
    implements IDisposable {
    private id: string;
    private bufferSize: number;
    private buffer: Float32Array;
    private wasActive = false;
    private activityCounter: number;
    private analyser: AnalyserNode = null;

    constructor(source: AudioSource, audioContext: AudioContext, bufferSize: number) {
        super();

        if (!isGoodNumber(bufferSize)
            || bufferSize <= 0) {
            throw new Error("Buffer size must be greater than 0");
        }

        this.id = source.id;

        this.bufferSize = bufferSize;
        this.buffer = new Float32Array(this.bufferSize);

        this.wasActive = false;
        this.activityCounter = 0;

        const checkSource = () => {
            if (source.spatializer instanceof BaseNode
                && source.spatializer.source) {
                this.analyser = audioContext.createAnalyser();
                this.analyser.fftSize = 2 * this.bufferSize;
                this.analyser.smoothingTimeConstant = 0.2;
                source.spatializer.source.connect(this.analyser);
            }
            else {
                setTimeout(checkSource, 0);
            }
        };

        checkSource();
    }

    dispose(): void {
        if (this.analyser) {
            this.analyser.disconnect();
            this.analyser = null;
        }
        this.buffer = null;
    }

    update(): void {
        if (this.analyser) {
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