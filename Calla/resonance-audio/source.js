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
import { connect, disconnect } from "../audio/GraphVisualizer";
import { Attenuation } from './attenuation';
import { Directivity } from './directivity';
import { Encoder } from './encoder';
import { DEFAULT_ATTENUATION_ROLLOFF, DEFAULT_DIRECTIVITY_ALPHA, DEFAULT_DIRECTIVITY_SHARPNESS, DEFAULT_FORWARD, DEFAULT_MAX_DISTANCE, DEFAULT_MIN_DISTANCE, DEFAULT_POSITION, DEFAULT_SOURCE_GAIN, DEFAULT_SOURCE_WIDTH, DEFAULT_UP, EPSILON_FLOAT, RADIANS_TO_DEGREES, SOURCE_MAX_OUTSIDE_ROOM_DISTANCE } from "./utils";
/**
 * Determine the distance a source is outside of a room. Attenuate gain going
 * to the reflections and reverb when the source is outside of the room.
 * @param distance Distance in meters.
 * @return Gain (linear) of source.
 */
function _computeDistanceOutsideRoom(distance) {
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
export class Source {
    /**
     * Source model to spatialize an audio buffer.
     * @param scene Associated ResonanceAudio instance.
     * @param options
     * Options for constructing a new Source.
     */
    constructor(scene, options) {
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
        this.dx = vec3.create();
        ;
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
        connect(this.input, this.toLate);
        connect(this.toLate, scene.room.late.input);
        connect(this.input, this.attenuation.input);
        connect(this.attenuation.output, this.toEarly);
        connect(this.toEarly, scene.room.early.input);
        connect(this.attenuation.output, this.directivity.input);
        connect(this.directivity.output, this.encoder.input);
        // Assign initial conditions.
        this.setPosition(options.position);
        this.input.gain.value = options.gain;
    }
    get output() {
        return this.encoder.output;
    }
    dispose() {
        disconnect(this.directivity.output, this.encoder.input);
        disconnect(this.attenuation.output, this.directivity.input);
        disconnect(this.toEarly, this.scene.room.early.input);
        disconnect(this.attenuation.output, this.toEarly);
        disconnect(this.input, this.attenuation.input);
        disconnect(this.toLate, this.scene.room.late.input);
        disconnect(this.input, this.toLate);
        this.encoder.dispose();
    }
    // Update the source when changing the listener's position.
    update() {
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
    setRolloff(rolloff) {
        this.attenuation.setRolloff(rolloff);
    }
    /**
     * Set source's minimum distance (in meters).
     */
    setMinDistance(minDistance) {
        this.attenuation.minDistance = minDistance;
    }
    /**
     * Set source's maximum distance (in meters).
     */
    setMaxDistance(maxDistance) {
        this.attenuation.maxDistance = maxDistance;
    }
    /**
     * Set source's gain (linear).
     */
    setGain(gain) {
        this.input.gain.value = gain;
    }
    /**
     * Set source's position (in meters), where origin is the center of
     * the room.
     */
    setPosition(v) {
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
    setOrientation(forward, up) {
        vec3.copy(this.forward, forward);
        vec3.copy(this.up, up);
        vec3.cross(this.right, this.forward, this.up);
    }
    /**
     * Set the source width (in degrees). Where 0 degrees is a point source and 360
     * degrees is an omnidirectional source.
     */
    setSourceWidth(sourceWidth) {
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
    setDirectivityPattern(alpha, sharpness) {
        this.directivity.setPattern(alpha, sharpness);
        this.setPosition(this.position);
    }
}
//# sourceMappingURL=source.js.map