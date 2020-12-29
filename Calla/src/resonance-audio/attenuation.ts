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
 * @file Distance-based attenuation filter.
 * @author Andrew Allen <bitllama@google.com>
 */

import { isGoodNumber } from "kudzu";
import type { AttenuationRolloff } from "./AttenuationRolloff";
import {
    DEFAULT_ATTENUATION_ROLLOFF,
    DEFAULT_MAX_DISTANCE,
    DEFAULT_MIN_DISTANCE,
    EPSILON_FLOAT
} from "./utils";


export interface AttenuationOptions {

    /**
     * Min. distance (in meters). Defaults to {@linkcode Utils.DEFAULT_MIN_DISTANCE DEFAULT_MIN_DISTANCE}.
     **/
    minDistance: number;

    /**
     * Max. distance (in meters). Defaults to {@linkcode Utils.DEFAULT_MAX_DISTANCE DEFAULT_MAX_DISTANCE}.
     **/
    maxDistance: number;

    /**
     * Rolloff model to use. Defaults to {@linkcode Utils.DEFAULT_ATTENUATION_ROLLOFF DEFAULT_ATTENUATION_ROLLOFF}.
     **/
    rolloff: AttenuationRolloff;
}

/**
 * Distance-based attenuation filter.
 */
export class Attenuation {
    minDistance: number = DEFAULT_MIN_DISTANCE;
    maxDistance: number = DEFAULT_MAX_DISTANCE;
    private rolloff: AttenuationRolloff = DEFAULT_ATTENUATION_ROLLOFF;

    private gainNode: GainNode;
    input: GainNode;
    output: GainNode;


    /**
     * Distance-based attenuation filter.
     */
    constructor(context: AudioContext, options?: Partial<AttenuationOptions>) {
        if (options) {
            if (isGoodNumber(options.minDistance)) {
                this.minDistance = options.minDistance;
            }

            if (isGoodNumber(options.maxDistance)) {
                this.maxDistance = options.maxDistance;
            }

            if (options.rolloff) {
                this.rolloff = options.rolloff;
            }
        }

        // Assign values.
        this.setRolloff(this.rolloff);

        // Create node.
        this.gainNode = context.createGain();

        // Initialize distance to max distance.
        this.setDistance(this.maxDistance);

        // Input/Output proxy.
        this.input = this.gainNode;
        this.output = this.gainNode;
    }

    /**
     * Set distance from the listener.
     * @param distance Distance (in meters).
     */
    setDistance(distance: number): void {
        let gain = 1;
        if (this.rolloff == 'logarithmic') {
            if (distance > this.maxDistance) {
                gain = 0;
            } else if (distance > this.minDistance) {
                let range = this.maxDistance - this.minDistance;
                if (range > EPSILON_FLOAT) {
                    // Compute the distance attenuation value by the logarithmic curve
                    // "1 / (d + 1)" with an offset of |minDistance|.
                    let relativeDistance = distance - this.minDistance;
                    let attenuation = 1 / (relativeDistance + 1);
                    let attenuationMax = 1 / (range + 1);
                    gain = (attenuation - attenuationMax) / (1 - attenuationMax);
                }
            }
        } else if (this.rolloff == 'linear') {
            if (distance > this.maxDistance) {
                gain = 0;
            } else if (distance > this.minDistance) {
                let range = this.maxDistance - this.minDistance;
                if (range > EPSILON_FLOAT) {
                    gain = (this.maxDistance - distance) / range;
                }
            }
        }
        this.gainNode.gain.value = gain;
    }


    /**
     * Set rolloff.
     * @param rolloff
     * Rolloff model to use, chosen from options in
     * {@linkcode ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
     */
    setRolloff(rolloff: AttenuationRolloff) {
        if (rolloff == null) {
            rolloff = DEFAULT_ATTENUATION_ROLLOFF;
        }
        this.rolloff = rolloff;
    }
}
