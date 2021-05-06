import { vec3 } from "gl-matrix";
import { Pose } from "./Pose";
/**
 * A position value that is blended from the current position to
 * a target position over time.
 */
export declare class InterpolatedPose {
    start: Pose;
    current: Pose;
    end: Pose;
    offset: vec3;
    /**
     * Set the target comfort offset for the time `t + dt`.
     */
    setOffset(ox: number, oy: number, oz: number): void;
    /**
     * Set the target position and orientation for the time `t + dt`.
     * @param px - the horizontal component of the position.
     * @param py - the vertical component of the position.
     * @param pz - the lateral component of the position.
     * @param fx - the horizontal component of the position.
     * @param fy - the vertical component of the position.
     * @param fz - the lateral component of the position.
     * @param ux - the horizontal component of the position.
     * @param uy - the vertical component of the position.
     * @param uz - the lateral component of the position.
     * @param t - the time at which to start the transition.
     * @param dt - the amount of time to take making the transition.
     */
    setTarget(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number, t: number, dt: number): void;
    /**
     * Set the target position for the time `t + dt`.
     * @param px - the horizontal component of the position.
     * @param py - the vertical component of the position.
     * @param pz - the lateral component of the position.
     * @param t - the time at which to start the transition.
     * @param dt - the amount of time to take making the transition.
     */
    setTargetPosition(px: number, py: number, pz: number, t: number, dt: number): void;
    /**
     * Set the target orientation for the time `t + dt`.
     * @param fx - the horizontal component of the position.
     * @param fy - the vertical component of the position.
     * @param fz - the lateral component of the position.
     * @param ux - the horizontal component of the position.
     * @param uy - the vertical component of the position.
     * @param uz - the lateral component of the position.
     * @param t - the time at which to start the transition.
     * @param dt - the amount of time to take making the transition.
     */
    setTargetOrientation(fx: number, fy: number, fz: number, ux: number, uy: number, uz: number, t: number, dt: number): void;
    /**
     * Calculates the new position for the given time.
     */
    update(t: number): void;
}
