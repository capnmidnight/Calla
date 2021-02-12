/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @file Source model to spatialize an audio buffer.
 * @author Andrew Allen <bitllama@google.com>
 */
import { vec3 } from "gl-matrix";
import type { IDisposable } from "kudzu/using";
import type { AttenuationRolloff } from "./AttenuationRolloff";
import type { ResonanceAudio } from "./resonance-audio";
/**
 * Options for constructing a new Source.
 **/
export interface SourceOptions {
    /**
     * @property {Float32Array} position
     * The source's initial position (in meters), where origin is the center of
     * the room. Defaults to {@linkcode DEFAULT_POSITION DEFAULT_POSITION}.
     **/
    position?: vec3;
    /**
     * @property {Float32Array} forward
     * The source's initial forward vector. Defaults to
     * {@linkcode DEFAULT_FORWARD DEFAULT_FORWARD}.
     **/
    forward?: vec3;
    /**
     * @property {Float32Array} up
     * The source's initial up vector. Defaults to
     * {@linkcode DEFAULT_UP DEFAULT_UP}.
     **/
    up?: vec3;
    /**
     * @property {Number} minDistance
     * Min. distance (in meters). Defaults to
     * {@linkcode DEFAULT_MIN_DISTANCE DEFAULT_MIN_DISTANCE}.
     **/
    minDistance?: number;
    /**
     * @property {Number} maxDistance
     * Max. distance (in meters). Defaults to
     * {@linkcode DEFAULT_MAX_DISTANCE DEFAULT_MAX_DISTANCE}.
     **/
    maxDistance?: number;
    /**
     * @property {string} rolloff
     * Rolloff model to use, chosen from options in
     * {@linkcode ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}. Defaults to
     * {@linkcode DEFAULT_ATTENUATION_ROLLOFF DEFAULT_ATTENUATION_ROLLOFF}.
     **/
    rolloff?: AttenuationRolloff;
    /**
     * @property {Number} gain Input gain (linear). Defaults to
     * {@linkcode DEFAULT_SOURCE_GAIN DEFAULT_SOURCE_GAIN}.
     **/
    gain?: number;
    /**
     * @property {Number} alpha Directivity alpha. Defaults to
     * {@linkcode DEFAULT_DIRECTIVITY_ALPHA DEFAULT_DIRECTIVITY_ALPHA}.
     **/
    alpha?: number;
    /**
     * @property {Number} sharpness Directivity sharpness. Defaults to
     * {@linkcode DEFAULT_DIRECTIVITY_SHARPNESS
     * DEFAULT_DIRECTIVITY_SHARPNESS}.
     **/
    sharpness?: number;
    /**
     * @property {Number} sourceWidth
     * Source width (in degrees). Where 0 degrees is a point source and 360 degrees
     * is an omnidirectional source. Defaults to
     * {@linkcode DEFAULT_SOURCE_WIDTH DEFAULT_SOURCE_WIDTH}.
     **/
    sourceWidth?: number;
}
/**
 * Source model to spatialize an audio buffer.
 */
export declare class Source implements IDisposable {
    private scene;
    private position;
    private forward;
    private up;
    private right;
    private dx;
    private directivity;
    private toEarly;
    private toLate;
    private attenuation;
    private encoder;
    input: GainNode;
    /**
     * Source model to spatialize an audio buffer.
     * @param scene Associated ResonanceAudio instance.
     * @param options
     * Options for constructing a new Source.
     */
    constructor(scene: ResonanceAudio, options?: SourceOptions);
    get output(): GainNode;
    dispose(): void;
    update(): void;
    /**
     * Set source's rolloff.
     * @param rolloff
     * Rolloff model to use, chosen from options in
     * {@linkcode ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
     */
    setRolloff(rolloff: AttenuationRolloff): void;
    /**
     * Set source's minimum distance (in meters).
     */
    setMinDistance(minDistance: number): void;
    /**
     * Set source's maximum distance (in meters).
     */
    setMaxDistance(maxDistance: number): void;
    /**
     * Set source's gain (linear).
     */
    setGain(gain: number): void;
    /**
     * Set source's position (in meters), where origin is the center of
     * the room.
     */
    setPosition(v: vec3): void;
    /**
     * Set the source's orientation using forward and up vectors.
     */
    setOrientation(forward: vec3, up: vec3): void;
    /**
     * Set the source width (in degrees). Where 0 degrees is a point source and 360
     * degrees is an omnidirectional source.
     */
    setSourceWidth(sourceWidth: number): void;
    /**
     * Set source's directivity pattern (defined by alpha), where 0 is an
     * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
     * pattern. The sharpness of the pattern is increased exponentially.
     * @param alpha - Determines directivity pattern (0 to 1).
     * @param sharpness - Determines the sharpness of the directivity pattern (1 to Inf).
     */
    setDirectivityPattern(alpha: number, sharpness: number): void;
}
