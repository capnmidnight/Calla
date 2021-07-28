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
import { nameVertex } from "../audio/GraphVisualizer";
import {
    DEFAULT_DIRECTIVITY_ALPHA,
    DEFAULT_DIRECTIVITY_SHARPNESS,
    EPSILON_FLOAT
} from "./utils";

const forwardNorm = vec3.create();
const directionNorm = vec3.create();

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
export class Directivity {
    private alpha: number;
    private sharpness: number;
    private context: BaseAudioContext;
    private lowpass: BiquadFilterNode;
    private cosTheta = 0;

    input: BiquadFilterNode;
    output: BiquadFilterNode;

    constructor(context: BaseAudioContext, options?: DirectivityOptions) {
        // Use defaults for undefined arguments.
        options = Object.assign({
            alpha: DEFAULT_DIRECTIVITY_ALPHA,
            sharpness: DEFAULT_DIRECTIVITY_SHARPNESS
        }, options);

        // Create audio node.
        this.context = context;
        this.lowpass = nameVertex("directivity-lowpass-filter", context.createBiquadFilter());

        // Initialize filter coefficients.
        this.lowpass.type = 'lowpass';
        this.lowpass.Q.value = 0;
        this.lowpass.frequency.value = context.sampleRate * 0.5;

        this.setPattern(options.alpha, options.sharpness);

        // Input/Output proxy.
        this.input = this.lowpass;
        this.output = this.lowpass;
    }


    /**
     * Compute the filter using the source's forward orientation and the listener's
     * position.
     * @param forward The source's forward vector.
     * @param direction The direction from the source to the
     * listener.
     */
    computeAngle(forward: vec3, direction: vec3): void {
        vec3.normalize(forwardNorm, forward);
        vec3.normalize(directionNorm, direction);
        let coeff = 1;
        if (this.alpha > EPSILON_FLOAT) {
            let cosTheta = vec3.dot(forwardNorm, directionNorm);
            coeff = (1 - this.alpha) + this.alpha * cosTheta;
            coeff = Math.pow(Math.abs(coeff), this.sharpness);
        }
        this.lowpass.frequency.value = this.context.sampleRate * 0.5 * coeff;
    }


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
    setPattern(alpha: number, sharpness: number): void {
        // Clamp and set values.
        this.alpha = Math.min(1, Math.max(0, alpha));
        this.sharpness = Math.max(1, sharpness);

        // Update angle calculation using new values.
        this.computeAngle(
            vec3.set(forwardNorm, this.cosTheta * this.cosTheta, 0, 0),
            vec3.set(directionNorm, 1, 0, 0));
    }
}
