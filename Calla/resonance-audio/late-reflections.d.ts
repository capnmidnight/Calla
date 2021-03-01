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
import type { IDisposable } from "kudzu/using";
/**
 * @file Late reverberation filter for Ambisonic content.
 * @author Andrew Allen <bitllama@google.com>
 */
export interface LateReflectionsOptions {
    /**
     *
    * @param options.durations
    * Multiband RT60 durations (in seconds) for each frequency band, listed as
    * {@linkcode DEFAULT_REVERB_FREQUENCY_BANDS
    * FREQUDEFAULT_REVERB_FREQUENCY_BANDSENCY_BANDS}. Defaults to
    * {@linkcode DEFAULT_REVERB_DURATIONS DEFAULT_REVERB_DURATIONS}.
    **/
    durations?: Float32Array;
    /**
    * @param options.predelay Pre-delay (in milliseconds). Defaults to
    * {@linkcode DEFAULT_REVERB_PREDELAY DEFAULT_REVERB_PREDELAY}.
    **/
    predelay?: number;
    /**
    * @param options.gain Output gain (linear). Defaults to
    * {@linkcode DEFAULT_REVERB_GAIN DEFAULT_REVERB_GAIN}.
    **/
    gain?: number;
    /**
    * @param options.bandwidth Bandwidth (in octaves) for each frequency
    * band. Defaults to
    * {@linkcode DEFAULT_REVERB_BANDWIDTH DEFAULT_REVERB_BANDWIDTH}.
    **/
    bandwidth?: number;
    /**
    * @param options.tailonset Length (in milliseconds) of impulse
    * response to apply a half-Hann window. Defaults to
    * {@linkcode DEFAULT_REVERB_TAIL_ONSET DEFAULT_REVERB_TAIL_ONSET}.
    **/
    tailonset?: number;
}
/**
 * Late-reflections reverberation filter for Ambisonic content.
 */
export declare class LateReflections implements IDisposable {
    private bandwidthCoeff;
    private tailonsetSamples;
    private context;
    private predelay;
    private convolver;
    input: GainNode;
    output: GainNode;
    /**
    * Late-reflections reverberation filter for Ambisonic content.
    */
    constructor(context: BaseAudioContext, options?: LateReflectionsOptions);
    private disposed;
    dispose(): void;
    /**
     * Re-compute a new impulse response by providing Multiband RT60 durations.
     * @param durations
     * Multiband RT60 durations (in seconds) for each frequency band, listed as
     * {@linkcode DEFAULT_REVERB_FREQUENCY_BANDS
     * DEFAULT_REVERB_FREQUENCY_BANDS}.
     */
    setDurations(durations: Float32Array): void;
}
