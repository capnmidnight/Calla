import { TypedEventBase } from "kudzu/events/EventBase";
import type { IDisposable } from "kudzu/using";
import { AudioActivityEvent } from "./AudioActivityEvent";
import { AudioStreamSource } from "./sources/AudioStreamSource";
interface AudioAnaylserEvents {
    audioActivity: AudioActivityEvent;
}
export declare class ActivityAnalyser extends TypedEventBase<AudioAnaylserEvents> implements IDisposable {
    private source;
    private id;
    private bufferSize;
    private buffer;
    private wasActive;
    private activityCounter;
    private analyser;
    constructor(source: AudioStreamSource, audioContext: BaseAudioContext, bufferSize: number);
    dispose(): void;
    update(): void;
}
export {};
