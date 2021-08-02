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
import { Gain } from "kudzu/audio";
import { isGoodNumber } from "kudzu/typeChecks";
import { DEFAULT_ATTENUATION_ROLLOFF, DEFAULT_MAX_DISTANCE, DEFAULT_MIN_DISTANCE, EPSILON_FLOAT } from "./utils";
/**
 * Distance-based attenuation filter.
 */
export class Attenuation {
    minDistance = DEFAULT_MIN_DISTANCE;
    maxDistance = DEFAULT_MAX_DISTANCE;
    rolloff = DEFAULT_ATTENUATION_ROLLOFF;
    gainNode;
    /**
     * Distance-based attenuation filter.
     */
    constructor(options) {
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
        this.gainNode = Gain("attenuation");
        // Initialize distance to max distance.
        this.setDistance(this.maxDistance);
    }
    get input() {
        return this.gainNode;
    }
    get output() {
        return this.gainNode;
    }
    /**
     * Set distance from the listener.
     * @param distance Distance (in meters).
     */
    setDistance(distance) {
        let gain = 1;
        if (this.rolloff == 'logarithmic') {
            if (distance > this.maxDistance) {
                gain = 0;
            }
            else if (distance > this.minDistance) {
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
        }
        else if (this.rolloff == 'linear') {
            if (distance > this.maxDistance) {
                gain = 0;
            }
            else if (distance > this.minDistance) {
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
    setRolloff(rolloff) {
        if (rolloff == null) {
            rolloff = DEFAULT_ATTENUATION_ROLLOFF;
        }
        this.rolloff = rolloff;
    }
}
//# sourceMappingURL=attenuation.js.map