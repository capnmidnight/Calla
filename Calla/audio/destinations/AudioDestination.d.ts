import { BaseAudioElement } from "../BaseAudioElement";
import type { BaseListener } from "./spatializers/BaseListener";
export declare type DestinationNode = AudioDestinationNode | MediaStreamAudioDestinationNode;
export declare class AudioDestination extends BaseAudioElement<BaseListener> {
    private _spatializedInput;
    private _nonSpatializedInput;
    private _trueDestination;
    constructor(audioContext: BaseAudioContext, destination: DestinationNode);
    dispose(): void;
    get spatialized(): boolean;
    get spatializedInput(): AudioNode;
    get nonSpatializedInput(): AudioNode;
    setDestination(v: DestinationNode): void;
    protected disconnectSpatializer(): void;
    protected connectSpatializer(): void;
}
