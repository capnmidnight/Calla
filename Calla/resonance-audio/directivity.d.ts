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
/**
 * @file Directivity/occlusion filter.
 * @author Andrew Allen <bitllama@google.com>
 */
export interface DirectivityOptions {
    /**
     * Determines directivity pattern (0 to 1). See
     * {@link Directivity#setPattern setPattern} for more details. Defaults to
     * {@linkcode DEFAULT_DIRECTIVITY_ALPHA DEFAULT_DIRECTIVITY_ALPHA}.
     **/
    alpha?: number;
    /**
     * Determines the sharpness of the directivity pattern (1 to Inf). See
     * {@link Directivity#setPattern setPattern} for more details. Defaults to
     * {@linkcode DEFAULT_DIRECTIVITY_SHARPNESS
     * DEFAULT_DIRECTIVITY_SHARPNESS}.
     **/
    sharpness?: number;
}
/**
 * Directivity/occlusion filter.
 **/
export declare class Directivity {
    private alpha;
    private sharpness;
    private context;
    private lowpass;
    private cosTheta;
    input: BiquadFilterNode;
    output: BiquadFilterNode;
    constructor(context: AudioContext, options?: DirectivityOptions);
    /**
     * Compute the filter using the source's forward orientation and the listener's
     * position.
     * @param forward The source's forward vector.
     * @param direction The direction from the source to the
     * listener.
     */
    computeAngle(forward: vec3, direction: vec3): void;
    /**
     * Set source's directivity pattern (defined by alpha), where 0 is an
     * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
     * pattern. The sharpness of the pattern is increased exponenentially.
     * @param alpha
     * Determines directivity pattern (0 to 1).
     * @param sharpness
     * Determines the sharpness of the directivity pattern (1 to Inf).
     * DEFAULT_DIRECTIVITY_SHARPNESS}.
     */
    setPattern(alpha: number, sharpness: number): void;
}
