import { BaseAudioElement } from "../BaseAudioElement";
import type { BaseListener } from "./spatializers/BaseListener";
export declare type DestinationNode = AudioDestinationNode | MediaStreamAudioDestinationNode;
export declare class AudioDestination extends BaseAudioElement<BaseListener> {
    private _remoteUserInput;
    private _spatializedInput;
    private _nonSpatializedInput;
    private _trueDestination;
    constructor(destination: DestinationNode);
    private disposed2;
    dispose(): void;
    get spatialized(): boolean;
    get remoteUserInput(): AudioNode;
    get spatializedInput(): AudioNode;
    get nonSpatializedInput(): AudioNode;
    get trueDestination(): DestinationNode;
    setDestination(v: DestinationNode): void;
    protected disconnectSpatializer(): void;
    protected connectSpatializer(): void;
}
