import { StreamType } from "../../CallaEvents";
import { BaseAudioSource } from "./BaseAudioSource";

export type AudioStreamSourceNode = MediaStreamTrackAudioSourceNode | ChannelMergerNode | MediaElementAudioSourceNode | MediaStreamAudioSourceNode;

export class AudioStreamSource extends BaseAudioSource<AudioStreamSourceNode> {
    streams = new Map<StreamType, MediaStream>();

    constructor(id: string, audioContext: BaseAudioContext) {
        super(id, audioContext);
    }
}
