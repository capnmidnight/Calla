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
import { BiquadFilter, ChannelMerger, connect, Delay, disconnect, Gain } from "kudzu/audio";
import { isArray, isGoodNumber } from "kudzu/typeChecks";
import type { IDisposable } from "kudzu/using";
import { Direction } from "./Direction";
import type { Inverters } from "./Inverters";
import type { ReflectionCoefficients } from "./ReflectionCoefficients";
import type { ReflectionDelays } from "./ReflectionDelays";
import type { ReflectionGains } from "./ReflectionGains";
import type { RoomDimensions } from "./RoomDimensions";
import {
    DEFAULT_POSITION,
    DEFAULT_REFLECTION_COEFFICIENTS,
    DEFAULT_REFLECTION_CUTOFF_FREQUENCY,
    DEFAULT_REFLECTION_MAX_DURATION,
    DEFAULT_REFLECTION_MIN_DISTANCE,
    DEFAULT_REFLECTION_MULTIPLIER,
    DEFAULT_ROOM_DIMENSIONS,
    DEFAULT_SPEED_OF_SOUND,
    DirectionSign,
    DirectionToAxis,
    DirectionToDimension
} from "./utils";

export interface EarlyReflectionsOptions {

    /**
     * Room dimensions (in meters). Defaults to
     * {@linkcode DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
     **/
    dimensions: RoomDimensions;

    /**
     * (in meters / second). Defaults to {@linkcode DEFAULT_SPEED_OF_SOUND
     * DEFAULT_SPEED_OF_SOUND}.
     **/
    speedOfSound: number;

    /**
     * (in meters). Defaults to
     * {@linkcode DEFAULT_POSITION DEFAULT_POSITION}.
     **/
    listenerPosition: vec3;

    /**
     * Frequency-independent reflection coeffs per wall. Defaults to
     * {@linkcode DEFAULT_REFLECTION_COEFFICIENTS
     * DEFAULT_REFLECTION_COEFFICIENTS}.
     **/
    coefficients: ReflectionCoefficients;
}

/**
* Ray-tracing-based early reflections model.
*/
export class EarlyReflections implements IDisposable {

    private listenerPosition = vec3.copy(vec3.create(), DEFAULT_POSITION);

    speedOfSound = DEFAULT_SPEED_OF_SOUND;

    private coefficients: ReflectionCoefficients = {
        left: DEFAULT_REFLECTION_COEFFICIENTS.left,
        right: DEFAULT_REFLECTION_COEFFICIENTS.right,
        front: DEFAULT_REFLECTION_COEFFICIENTS.front,
        back: DEFAULT_REFLECTION_COEFFICIENTS.back,
        up: DEFAULT_REFLECTION_COEFFICIENTS.up,
        down: DEFAULT_REFLECTION_COEFFICIENTS.down,
    };

    halfDimensions: RoomDimensions = {
        width: 0.5 * DEFAULT_ROOM_DIMENSIONS.width,
        height: 0.5 * DEFAULT_ROOM_DIMENSIONS.height,
        depth: 0.5 * DEFAULT_ROOM_DIMENSIONS.depth,
    };

    private inverters: Inverters;
    private merger: ChannelMergerNode;
    private lowpass: BiquadFilterNode;
    private delays: ReflectionDelays;
    private gains: ReflectionGains;

    input: GainNode;
    output: GainNode;

    /**
     * Ray-tracing-based early reflections model.
     */
    constructor(options?: Partial<EarlyReflectionsOptions>) {
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
        this.input = Gain("early-reflections-input");
        this.output = Gain("early-reflections-output");
        this.lowpass = BiquadFilter("early-reflection-lowpass-filter");
        this.merger = ChannelMerger("early-reflection-merger", 4); // First-order encoding only.

        this.delays = {
            left: Delay("early-reflection-delay-left", DEFAULT_REFLECTION_MAX_DURATION),
            right: Delay("early-reflection-delay-right", DEFAULT_REFLECTION_MAX_DURATION),
            front: Delay("early-reflection-delay-front", DEFAULT_REFLECTION_MAX_DURATION),
            back: Delay("early-reflection-delay-back", DEFAULT_REFLECTION_MAX_DURATION),
            up: Delay("early-reflection-delay-up", DEFAULT_REFLECTION_MAX_DURATION),
            down: Delay("early-reflection-delay-down", DEFAULT_REFLECTION_MAX_DURATION)
        };

        this.gains = {
            left: Gain("early-reflections-gains-left"),
            right: Gain("early-reflections-gains-right"),
            front: Gain("early-reflections-gains-front"),
            back: Gain("early-reflections-gains-back"),
            up: Gain("early-reflections-gains-up"),
            down: Gain("early-reflections-gains-down")
        };

        this.inverters = {
            right: Gain("early-reflections-inverters-right"),
            back: Gain("early-reflections-inverters-back"),
            down: Gain("early-reflections-inverters-down")
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

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            disconnect(this.input);
            disconnect(this.lowpass);
            disconnect(this.merger);

            for (const property of Object.values(Direction)) {
                disconnect(this.delays[property]);
                disconnect(this.gains[property]);
                if (property === "right"
                    || property === "back"
                    || property === "down") {
                    disconnect(this.inverters[property]);
                }
            }

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
    setRoomProperties(dimensions: RoomDimensions, coefficients: ReflectionCoefficients): void {
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
    setListenerPosition(v: vec3): void {
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