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
import type { AttenuationRolloff } from "./AttenuationRolloff";
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
export declare class Attenuation {
    minDistance: number;
    maxDistance: number;
    private rolloff;
    private gainNode;
    input: GainNode;
    output: GainNode;
    /**
     * Distance-based attenuation filter.
     */
    constructor(context: BaseAudioContext, options?: Partial<AttenuationOptions>);
    /**
     * Set distance from the listener.
     * @param distance Distance (in meters).
     */
    setDistance(distance: number): void;
    /**
     * Set rolloff.
     * @param rolloff
     * Rolloff model to use, chosen from options in
     * {@linkcode ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
     */
    setRolloff(rolloff: AttenuationRolloff): void;
}
