import { Pose } from "../../positions/Pose";
import { BaseEmitter } from "../../sources/spatializers/BaseEmitter";
import { AudioDestination } from "../AudioDestination";
import { BaseListener } from "./BaseListener";
export declare class NoSpatializationListener extends BaseListener {
    constructor();
    /**
     * Do nothing
     */
    update(_loc: Pose, _t: number): void;
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(_spatialize: boolean, _isRemoteStream: boolean, destination: AudioDestination): BaseEmitter;
}
