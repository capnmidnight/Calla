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

import { connect, Convolver, Delay, disconnect, Gain } from "kudzu/audio";
import type { IDisposable } from "kudzu/using";
import {
    DEFAULT_REVERB_BANDWIDTH,
    DEFAULT_REVERB_DURATIONS,
    DEFAULT_REVERB_DURATION_MULTIPLIER,
    DEFAULT_REVERB_FREQUENCY_BANDS,
    DEFAULT_REVERB_GAIN,
    DEFAULT_REVERB_MAX_DURATION,
    DEFAULT_REVERB_PREDELAY,
    DEFAULT_REVERB_TAIL_ONSET,
    log,
    LOG1000,
    LOG2_DIV2,
    NUMBER_REVERB_FREQUENCY_BANDS,
    TWO_PI
} from "./utils";

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
export class LateReflections implements IDisposable {
    private bandwidthCoeff: number;
    private tailonsetSamples: number;
    private context: BaseAudioContext;
    private predelay: DelayNode;
    private convolver: ConvolverNode;

    input: GainNode;
    output: GainNode;
    /**
    * Late-reflections reverberation filter for Ambisonic content.
    */
    constructor(context: BaseAudioContext, options?: LateReflectionsOptions) {
        // Use defaults for undefined arguments.
        options = Object.assign({
            durations: DEFAULT_REVERB_DURATIONS.slice(),
            predelay: DEFAULT_REVERB_PREDELAY,
            gain: DEFAULT_REVERB_GAIN,
            bandwidth: DEFAULT_REVERB_BANDWIDTH,
            tailonset: DEFAULT_REVERB_TAIL_ONSET
        }, options);

        // Assign pre-computed variables.
        const delaySecs = options.predelay / 1000;
        this.bandwidthCoeff = options.bandwidth * LOG2_DIV2;
        this.tailonsetSamples = options.tailonset / 1000;

        // Create nodes.
        this.context = context;
        this.input = Gain("late-reflections-input");
        this.predelay = Delay("late-reflections-predelay", delaySecs);
        this.convolver = Convolver("late-reflections-convolver");
        this.output = Gain("late-reflections-output");

        // Set reverb attenuation.
        this.output.gain.value = options.gain;

        // Disable normalization.
        this.convolver.normalize = false;

        // Connect nodes.
        connect(this.input, this.predelay);
        connect(this.predelay, this.convolver);
        connect(this.convolver, this.output);

        // Compute IR using RT60 values.
        this.setDurations(options.durations);
    }

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            disconnect(this.input);
            disconnect(this.predelay);
            disconnect(this.convolver);
            this.disposed = true;
        }
    }


    /**
     * Re-compute a new impulse response by providing Multiband RT60 durations.
     * @param durations
     * Multiband RT60 durations (in seconds) for each frequency band, listed as
     * {@linkcode DEFAULT_REVERB_FREQUENCY_BANDS
     * DEFAULT_REVERB_FREQUENCY_BANDS}.
     */
    setDurations(durations: Float32Array): void {
        if (durations.length !== NUMBER_REVERB_FREQUENCY_BANDS) {
            log('Warning: invalid number of RT60 values provided to reverb.');
            return;
        }

        // Compute impulse response.
        const durationsSamples = new Float32Array(NUMBER_REVERB_FREQUENCY_BANDS);
        const sampleRate = this.context.sampleRate;

        for (let i = 0; i < durations.length; i++) {
            // Clamp within suitable range.
            durations[i] =
                Math.max(0, Math.min(DEFAULT_REVERB_MAX_DURATION, durations[i]));

            // Convert seconds to samples.
            durationsSamples[i] = Math.round(durations[i] * sampleRate *
                DEFAULT_REVERB_DURATION_MULTIPLIER);
        };

        // Determine max RT60 length in samples.
        let durationsSamplesMax = 0;
        for (let i = 0; i < durationsSamples.length; i++) {
            if (durationsSamples[i] > durationsSamplesMax) {
                durationsSamplesMax = durationsSamples[i];
            }
        }

        // Skip this step if there is no reverberation to compute.
        if (durationsSamplesMax < 1) {
            durationsSamplesMax = 1;
        }

        // Create impulse response buffer.
        const buffer = this.context.createBuffer(1, durationsSamplesMax, sampleRate);
        const bufferData = buffer.getChannelData(0);

        // Create noise signal (computed once, referenced in each band's routine).
        const noiseSignal = new Float32Array(durationsSamplesMax);
        for (let i = 0; i < durationsSamplesMax; i++) {
            noiseSignal[i] = Math.random() * 2 - 1;
        }

        // Compute the decay rate per-band and filter the decaying noise signal.
        for (let i = 0; i < NUMBER_REVERB_FREQUENCY_BANDS; i++) {
            // Compute decay rate.
            const decayRate = -LOG1000 / durationsSamples[i];

            // Construct a standard one-zero, two-pole bandpass filter:
            // H(z) = (b0 * z^0 + b1 * z^-1 + b2 * z^-2) / (1 + a1 * z^-1 + a2 * z^-2)
            const omega = TWO_PI *
                DEFAULT_REVERB_FREQUENCY_BANDS[i] / sampleRate;
            const sinOmega = Math.sin(omega);
            const alpha = sinOmega * Math.sinh(this.bandwidthCoeff * omega / sinOmega);
            const a0CoeffReciprocal = 1 / (1 + alpha);
            const b0Coeff = alpha * a0CoeffReciprocal;
            const a1Coeff = -2 * Math.cos(omega) * a0CoeffReciprocal;
            const a2Coeff = (1 - alpha) * a0CoeffReciprocal;

            // We optimize since b2 = -b0, b1 = 0.
            // Update equation for two-pole bandpass filter:
            //   u[n] = x[n] - a1 * x[n-1] - a2 * x[n-2]
            //   y[n] = b0 * (u[n] - u[n-2])
            let um1 = 0;
            let um2 = 0;
            for (let j = 0; j < durationsSamples[i]; j++) {
                // Exponentially-decaying white noise.
                const x = noiseSignal[j] * Math.exp(decayRate * j);

                // Filter signal with bandpass filter and add to output.
                const u = x - a1Coeff * um1 - a2Coeff * um2;
                bufferData[j] += b0Coeff * (u - um2);

                // Update coefficients.
                um2 = um1;
                um1 = u;
            }
        }

        // Create and apply half of a Hann window to the beginning of the
        // impulse response.
        const halfHannLength =
            Math.round(this.tailonsetSamples);
        for (let i = 0; i < Math.min(bufferData.length, halfHannLength); i++) {
            const halfHann =
                0.5 * (1 - Math.cos(TWO_PI * i / (2 * halfHannLength - 1)));
            bufferData[i] *= halfHann;
        }
        this.convolver.buffer = buffer;
    }
}
