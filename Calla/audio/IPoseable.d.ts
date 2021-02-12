import { BaseSpatializer } from "./BaseSpatializer";
import { InterpolatedPose } from "./positions/InterpolatedPose";
export interface IPoseable {
    pose: InterpolatedPose;
    spatializer: BaseSpatializer;
}
