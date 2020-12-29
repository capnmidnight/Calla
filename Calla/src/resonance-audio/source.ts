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



// Internal dependencies.
import { vec3 } from "gl-matrix";
import type { IDisposable } from "kudzu";
import { Attenuation } from './attenuation';
import type { AttenuationRolloff } from "./AttenuationRolloff";
import { Directivity } from './directivity';
import { Encoder } from './encoder';
import type { ResonanceAudio } from "./resonance-audio";
import {
    DEFAULT_ATTENUATION_ROLLOFF,
    DEFAULT_DIRECTIVITY_ALPHA,
    DEFAULT_DIRECTIVITY_SHARPNESS,
    DEFAULT_FORWARD,
    DEFAULT_MAX_DISTANCE,
    DEFAULT_MIN_DISTANCE,
    DEFAULT_POSITION,
    DEFAULT_SOURCE_GAIN,
    DEFAULT_SOURCE_WIDTH,
    DEFAULT_UP,
    EPSILON_FLOAT,
    RADIANS_TO_DEGREES,
    SOURCE_MAX_OUTSIDE_ROOM_DISTANCE
} from "./utils";


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
 * Determine the distance a source is outside of a room. Attenuate gain going
 * to the reflections and reverb when the source is outside of the room.
 * @param distance Distance in meters.
 * @return Gain (linear) of source.
 */
function _computeDistanceOutsideRoom(distance: number): number {
    // We apply a linear ramp from 1 to 0 as the source is up to 1m outside.
    let gain = 1;
    if (distance > EPSILON_FLOAT) {
        gain = 1 - distance / SOURCE_MAX_OUTSIDE_ROOM_DISTANCE;

        // Clamp gain between 0 and 1.
        gain = Math.max(0, Math.min(1, gain));
    }
    return gain;
}

/**
 * Source model to spatialize an audio buffer.
 */
export class Source implements IDisposable {
    private scene: ResonanceAudio;
    private position: vec3;
    private forward: vec3;
    private up: vec3;
    private right: vec3;
    private dx: vec3;
    private directivity: Directivity;
    private toEarly: GainNode;
    private toLate: GainNode;
    private attenuation: Attenuation;
    private encoder: Encoder;

    input: GainNode;

    /**
     * Source model to spatialize an audio buffer.
     * @param scene Associated ResonanceAudio instance.
     * @param options
     * Options for constructing a new Source.
     */
    constructor(scene: ResonanceAudio, options?: SourceOptions) {
        // Use defaults for undefined arguments.
        options = Object.assign({
            position: vec3.copy(vec3.create(), DEFAULT_POSITION),
            forward: vec3.copy(vec3.create(), DEFAULT_FORWARD),
            up: vec3.copy(vec3.create(), DEFAULT_UP),
            minDistance: DEFAULT_MIN_DISTANCE,
            maxDistance: DEFAULT_MAX_DISTANCE,
            rolloff: DEFAULT_ATTENUATION_ROLLOFF,
            gain: DEFAULT_SOURCE_GAIN,
            alpha: DEFAULT_DIRECTIVITY_ALPHA,
            sharpness: DEFAULT_DIRECTIVITY_SHARPNESS,
            sourceWidth: DEFAULT_SOURCE_WIDTH,
        }, options);

        // Member variables.
        this.scene = scene;
        this.position = options.position;
        this.forward = options.forward;
        this.up = options.up;
        this.dx = vec3.create();;
        this.right = vec3.create();
        vec3.cross(this.right, this.forward, this.up);

        // Create audio nodes.
        let context = scene.context;
        this.input = context.createGain();
        this.directivity = new Directivity(context, {
            alpha: options.alpha,
            sharpness: options.sharpness,
        });
        this.toEarly = context.createGain();
        this.toLate = context.createGain();
        this.attenuation = new Attenuation(context, {
            minDistance: options.minDistance,
            maxDistance: options.maxDistance,
            rolloff: options.rolloff,
        });
        this.encoder = new Encoder(context, {
            ambisonicOrder: scene.ambisonicOrder,
            sourceWidth: options.sourceWidth,
        });

        // Connect nodes.
        this.input.connect(this.toLate);
        this.toLate.connect(scene.room.late.input);

        this.input.connect(this.attenuation.input);
        this.attenuation.output.connect(this.toEarly);
        this.toEarly.connect(scene.room.early.input);

        this.attenuation.output.connect(this.directivity.input);
        this.directivity.output.connect(this.encoder.input);

        this.encoder.output.connect(scene.listener.input);

        // Assign initial conditions.
        this.setPosition(options.position);
        this.input.gain.value = options.gain;
    }

    dispose(): void {
        this.encoder.output.disconnect(this.scene.listener.input);
        this.directivity.output.disconnect(this.encoder.input);
        this.attenuation.output.disconnect(this.directivity.input);
        this.toEarly.disconnect(this.scene.room.early.input);
        this.attenuation.output.disconnect(this.toEarly);
        this.input.disconnect(this.attenuation.input);
        this.toLate.disconnect(this.scene.room.late.input);
        this.input.disconnect(this.toLate);

        this.encoder.dispose();
    }


    // Update the source when changing the listener's position.
    update(): void {
        // Compute distance to listener.
        vec3.subtract(this.dx, this.position, this.scene.listener.position);
        const distance = vec3.length(this.dx);
        vec3.normalize(this.dx, this.dx);
        
        // Compuete angle of direction vector.
        const azimuth = RADIANS_TO_DEGREES * Math.atan2(-this.dx[0], this.dx[2]);
        const elevation = RADIANS_TO_DEGREES * Math.atan2(this.dx[1], Math.sqrt(this.dx[0] * this.dx[0] + this.dx[2] * this.dx[2]));

        // Set distance/directivity/direction values.
        this.attenuation.setDistance(distance);
        this.directivity.computeAngle(this.forward, this.dx);
        this.encoder.setDirection(azimuth, elevation);
    }


    /**
     * Set source's rolloff.
     * @param rolloff
     * Rolloff model to use, chosen from options in
     * {@linkcode ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
     */
    setRolloff(rolloff: AttenuationRolloff): void {
        this.attenuation.setRolloff(rolloff);
    }


    /**
     * Set source's minimum distance (in meters).
     */
    setMinDistance(minDistance: number): void {
        this.attenuation.minDistance = minDistance;
    }


    /**
     * Set source's maximum distance (in meters).
     */
    setMaxDistance(maxDistance: number): void {
        this.attenuation.maxDistance = maxDistance;
    }


    /**
     * Set source's gain (linear).
     */
    setGain(gain: number): void {
        this.input.gain.value = gain;
    }


    /**
     * Set source's position (in meters), where origin is the center of
     * the room.
     */
    setPosition(v: vec3): void {
        // Assign new position.
        vec3.copy(this.position, v);

        // Handle far-field effect.
        let distance = this.scene.room.getDistanceOutsideRoom(this.position);
        let gain = _computeDistanceOutsideRoom(distance);
        this.toLate.gain.value = gain;
        this.toEarly.gain.value = gain;

        this.update();
    }


    /**
     * Set the source's orientation using forward and up vectors.
     */
    setOrientation(forward: vec3, up: vec3): void {
        vec3.copy(this.forward, forward);
        vec3.copy(this.up, up);
        vec3.cross(this.right, this.forward, this.up);
    }


    /**
     * Set the source width (in degrees). Where 0 degrees is a point source and 360
     * degrees is an omnidirectional source.
     */
    setSourceWidth(sourceWidth: number): void {
        this.encoder.setSourceWidth(sourceWidth);
        this.setPosition(this.position);
    }


    /**
     * Set source's directivity pattern (defined by alpha), where 0 is an
     * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
     * pattern. The sharpness of the pattern is increased exponentially.
     * @param alpha - Determines directivity pattern (0 to 1).
     * @param sharpness - Determines the sharpness of the directivity pattern (1 to Inf).
     */
    setDirectivityPattern(alpha: number, sharpness: number): void {
        this.directivity.setPattern(alpha, sharpness);
        this.setPosition(this.position);
    }
}