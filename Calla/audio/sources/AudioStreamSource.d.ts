import { StreamType } from "../../CallaEvents";
import { BaseAudioSource } from "./BaseAudioSource";
export declare type AudioStreamSourceNode = MediaStreamTrackAudioSourceNode | ChannelMergerNode | MediaElementAudioSourceNode | MediaStreamAudioSourceNode;
export declare class AudioStreamSource extends BaseAudioSource<AudioStreamSourceNode> {
    streams: Map<StreamType, MediaStream>;
    constructor(id: string, audioContext: BaseAudioContext);
}
