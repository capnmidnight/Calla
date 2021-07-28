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
import { vec3 } from "gl-matrix";
import { isArray, isGoodNumber } from "kudzu/typeChecks";
import { Direction } from "./Direction";
import { DEFAULT_POSITION, DEFAULT_REFLECTION_COEFFICIENTS, DEFAULT_REFLECTION_CUTOFF_FREQUENCY, DEFAULT_REFLECTION_MAX_DURATION, DEFAULT_REFLECTION_MIN_DISTANCE, DEFAULT_REFLECTION_MULTIPLIER, DEFAULT_ROOM_DIMENSIONS, DEFAULT_SPEED_OF_SOUND, DirectionSign, DirectionToAxis, DirectionToDimension } from "./utils";
import { connect, disconnect, nameVertex } from "../audio/GraphVisualizer";
/**
* Ray-tracing-based early reflections model.
*/
export class EarlyReflections {
    listenerPosition = vec3.copy(vec3.create(), DEFAULT_POSITION);
    speedOfSound = DEFAULT_SPEED_OF_SOUND;
    coefficients = {
        left: DEFAULT_REFLECTION_COEFFICIENTS.left,
        right: DEFAULT_REFLECTION_COEFFICIENTS.right,
        front: DEFAULT_REFLECTION_COEFFICIENTS.front,
        back: DEFAULT_REFLECTION_COEFFICIENTS.back,
        up: DEFAULT_REFLECTION_COEFFICIENTS.up,
        down: DEFAULT_REFLECTION_COEFFICIENTS.down,
    };
    halfDimensions = {
        width: 0.5 * DEFAULT_ROOM_DIMENSIONS.width,
        height: 0.5 * DEFAULT_ROOM_DIMENSIONS.height,
        depth: 0.5 * DEFAULT_ROOM_DIMENSIONS.depth,
    };
    inverters;
    merger;
    lowpass;
    delays;
    gains;
    input;
    output;
    /**
     * Ray-tracing-based early reflections model.
     */
    constructor(context, options) {
        if (options) {
            if (isGoodNumber(options.speedOfSound)) {
                this.speedOfSound = options.speedOfSound;
            }
            if (isArray(options.listenerPosition)
                && options.listenerPosition.length === 3
                && isGoodNumber(options.listenerPosition[0])
                && isGoodNumber(options.listenerPosition[1])
                && isGoodNumber(options.listenerPosition[2])) {
                this.listenerPosition[0] = options.listenerPosition[0];
                this.listenerPosition[1] = options.listenerPosition[1];
                this.listenerPosition[2] = options.listenerPosition[2];
            }
        }
        // Create nodes.
        this.input = nameVertex("early-reflections-input", context.createGain());
        this.output = nameVertex("early-reflections-output", context.createGain());
        this.lowpass = nameVertex("early-reflection-lowpass-filter", context.createBiquadFilter());
        this.merger = nameVertex("early-reflection-merger", context.createChannelMerger(4)); // First-order encoding only.
        this.delays = {
            left: nameVertex("early-reflection-delay-left", context.createDelay(DEFAULT_REFLECTION_MAX_DURATION)),
            right: nameVertex("early-reflection-delay-right", context.createDelay(DEFAULT_REFLECTION_MAX_DURATION)),
            front: nameVertex("early-reflection-delay-front", context.createDelay(DEFAULT_REFLECTION_MAX_DURATION)),
            back: nameVertex("early-reflection-delay-back", context.createDelay(DEFAULT_REFLECTION_MAX_DURATION)),
            up: nameVertex("early-reflection-delay-up", context.createDelay(DEFAULT_REFLECTION_MAX_DURATION)),
            down: nameVertex("early-reflection-delay-down", context.createDelay(DEFAULT_REFLECTION_MAX_DURATION))
        };
        this.gains = {
            left: nameVertex("early-reflections-gains-left", context.createGain()),
            right: nameVertex("early-reflections-gains-right", context.createGain()),
            front: nameVertex("early-reflections-gains-front", context.createGain()),
            back: nameVertex("early-reflections-gains-back", context.createGain()),
            up: nameVertex("early-reflections-gains-up", context.createGain()),
            down: nameVertex("early-reflections-gains-down", context.createGain())
        };
        this.inverters = {
            right: nameVertex("early-reflections-inverters-right", context.createGain()),
            back: nameVertex("early-reflections-inverters-back", context.createGain()),
            down: nameVertex("early-reflections-inverters-down", context.createGain())
        };
        // Connect audio graph for each wall reflection and initialize encoder directions, set delay times and gains to 0.
        for (const direction of Object.values(Direction)) {
            const delay = this.delays[direction];
            const gain = this.gains[direction];
            delay.delayTime.value = 0;
            gain.gain.value = 0;
            this.delays[direction] = delay;
            this.gains[direction] = gain;
            connect(this.lowpass, delay);
            connect(delay, gain);
            connect(gain, this.merger, 0, 0);
            // Initialize inverters for opposite walls ('right', 'down', 'back' only).
            if (direction === Direction.Right
                || direction == Direction.Back
                || direction === Direction.Down) {
                this.inverters[direction].gain.value = -1;
            }
        }
        connect(this.input, this.lowpass);
        // Initialize lowpass filter.
        this.lowpass.type = 'lowpass';
        this.lowpass.frequency.value = DEFAULT_REFLECTION_CUTOFF_FREQUENCY;
        this.lowpass.Q.value = 0;
        // Connect nodes.
        // Connect gains to ambisonic channel output.
        // Left: [1 1 0 0]
        // Right: [1 -1 0 0]
        // Up: [1 0 1 0]
        // Down: [1 0 -1 0]
        // Front: [1 0 0 1]
        // Back: [1 0 0 -1]
        connect(this.gains.left, this.merger, 0, 1);
        connect(this.gains.right, this.inverters.right);
        connect(this.inverters.right, this.merger, 0, 1);
        connect(this.gains.up, this.merger, 0, 2);
        connect(this.gains.down, this.inverters.down);
        connect(this.inverters.down, this.merger, 0, 2);
        connect(this.gains.front, this.merger, 0, 3);
        connect(this.gains.back, this.inverters.back);
        connect(this.inverters.back, this.merger, 0, 3);
        connect(this.merger, this.output);
        // Initialize.
        this.setRoomProperties(options && options.dimensions, options && options.coefficients);
    }
    disposed = false;
    dispose() {
        if (!this.disposed) {
            // Connect nodes.
            disconnect(this.input, this.lowpass);
            for (const property of Object.values(Direction)) {
                const delay = this.delays[property];
                const gain = this.gains[property];
                disconnect(this.lowpass, delay);
                disconnect(delay, gain);
                disconnect(gain, this.merger, 0, 0);
            }
            // Connect gains to ambisonic channel output.
            // Left: [1 1 0 0]
            // Right: [1 -1 0 0]
            // Up: [1 0 1 0]
            // Down: [1 0 -1 0]
            // Front: [1 0 0 1]
            // Back: [1 0 0 -1]
            disconnect(this.gains.left, this.merger, 0, 1);
            disconnect(this.gains.right, this.inverters.right);
            disconnect(this.inverters.right, this.merger, 0, 1);
            disconnect(this.gains.up, this.merger, 0, 2);
            disconnect(this.gains.down, this.inverters.down);
            disconnect(this.inverters.down, this.merger, 0, 2);
            disconnect(this.gains.front, this.merger, 0, 3);
            disconnect(this.gains.back, this.inverters.back);
            disconnect(this.inverters.back, this.merger, 0, 3);
            disconnect(this.merger, this.output);
            this.disposed = true;
        }
    }
    /**
     * Set the room's properties which determines the characteristics of
     * reflections.
     * @param dimensions
     * Room dimensions (in meters). Defaults to
     * {@linkcode DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
     * @param coefficients
     * Frequency-independent reflection coeffs per wall. Defaults to
     * {@linkcode DEFAULT_REFLECTION_COEFFICIENTS
     * DEFAULT_REFLECTION_COEFFICIENTS}.
     */
    setRoomProperties(dimensions, coefficients) {
        if (!dimensions) {
            dimensions = {
                width: DEFAULT_ROOM_DIMENSIONS.width,
                height: DEFAULT_ROOM_DIMENSIONS.height,
                depth: DEFAULT_ROOM_DIMENSIONS.depth,
            };
        }
        if (isGoodNumber(dimensions.width)
            && isGoodNumber(dimensions.height)
            && isGoodNumber(dimensions.depth)) {
            this.halfDimensions.width = 0.5 * dimensions.width;
            this.halfDimensions.height = 0.5 * dimensions.height;
            this.halfDimensions.depth = 0.5 * dimensions.depth;
        }
        if (!coefficients) {
            coefficients = {
                left: DEFAULT_REFLECTION_COEFFICIENTS.left,
                right: DEFAULT_REFLECTION_COEFFICIENTS.right,
                front: DEFAULT_REFLECTION_COEFFICIENTS.front,
                back: DEFAULT_REFLECTION_COEFFICIENTS.back,
                up: DEFAULT_REFLECTION_COEFFICIENTS.up,
                down: DEFAULT_REFLECTION_COEFFICIENTS.down,
            };
        }
        if (isGoodNumber(coefficients.left)
            && isGoodNumber(coefficients.right)
            && isGoodNumber(coefficients.front)
            && isGoodNumber(coefficients.back)
            && isGoodNumber(coefficients.up)
            && isGoodNumber(coefficients.down)) {
            this.coefficients.left = coefficients.left;
            this.coefficients.right = coefficients.right;
            this.coefficients.front = coefficients.front;
            this.coefficients.back = coefficients.back;
            this.coefficients.up = coefficients.up;
            this.coefficients.down = coefficients.down;
        }
        // Update listener position with new room properties.
        this.setListenerPosition(this.listenerPosition);
    }
    /**
     * Set the listener's position (in meters),
     * where [0,0,0] is the center of the room.
     */
    setListenerPosition(v) {
        // Assign listener position.
        vec3.copy(this.listenerPosition, v);
        // Assign delay & attenuation values using distances.
        for (const direction of Object.values(Direction)) {
            const dim = this.halfDimensions[DirectionToDimension[direction]];
            const axis = this.listenerPosition[DirectionToAxis[direction]];
            const sign = DirectionSign[direction];
            const distance = DEFAULT_REFLECTION_MULTIPLIER * Math.max(0, dim + sign * axis) + DEFAULT_REFLECTION_MIN_DISTANCE;
            // Compute and assign delay (in seconds).
            const delayInSecs = distance / this.speedOfSound;
            this.delays[direction].delayTime.value = delayInSecs;
            // Compute and assign gain, uses logarithmic rolloff: "g = R / (d + 1)"
            const attenuation = this.coefficients[direction] / distance;
            this.gains[direction].gain.value = attenuation;
        }
    }
}
//# sourceMappingURL=early-reflections.js.map