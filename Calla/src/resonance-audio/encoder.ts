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
 * @file Spatially encodes input using weighted spherical harmonics.
 * @author Andrew Allen <bitllama@google.com>
 */


import type { IDisposable } from "kudzu";
import {
    MAX_RE_WEIGHTS,
    SPHERICAL_HARMONICS,
    SPHERICAL_HARMONICS_MAX_ORDER
} from "./tables";
import {
    DEFAULT_AMBISONIC_ORDER,
    DEFAULT_AZIMUTH,
    DEFAULT_ELEVATION,
    DEFAULT_SOURCE_WIDTH,
    log
} from "./utils";

export interface EncoderOptions {
    /**
     * Desired ambisonic order.Defaults to
     * {@linkcode DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
     **/
    ambisonicOrder?: number;

    /** 
    * Azimuth(in degrees).Defaults to {@linkcode DEFAULT_AZIMUTH DEFAULT_AZIMUTH}.
     **/
    azimuth?: number;

    /**
     * Elevation(in degrees).Defaults to {@linkcode DEFAULT_ELEVATION DEFAULT_ELEVATION}.
     **/
    elevation?: number;

    /**
     * Source width(in degrees). Where 0 degrees is a point source and 360 degrees
     * is an omnidirectional source.Defaults to
     * {@linkcode DEFAULT_SOURCE_WIDTH DEFAULT_SOURCE_WIDTH}.
     **/
    sourceWidth?: number;
}


/**
 * Spatially encodes input using weighted spherical harmonics.
 */
export class Encoder implements IDisposable {
    private context: AudioContext;
    private channelGain = new Array<GainNode>();
    private merger: ChannelMergerNode = null;
    private ambisonicOrder: number;
    private azimuth: number;
    private elevation: number;
    private spreadIndex: number;

    input: GainNode;
    output: GainNode;

    /**
     * Validate the provided ambisonic order.
     * @param ambisonicOrder Desired ambisonic order.
     * @return Validated/adjusted ambisonic order.
     */
    static validateAmbisonicOrder(ambisonicOrder: number): number {
        if (isNaN(ambisonicOrder) || ambisonicOrder == null) {
            log('Error: Invalid ambisonic order',
                ambisonicOrder, '\nUsing ambisonicOrder=1 instead.');
            ambisonicOrder = 1;
        } else if (ambisonicOrder < 1) {
            log('Error: Unable to render ambisonic order',
                ambisonicOrder, '(Min order is 1)',
                '\nUsing min order instead.');
            ambisonicOrder = 1;
        } else if (ambisonicOrder > SPHERICAL_HARMONICS_MAX_ORDER) {
            log('Error: Unable to render ambisonic order',
                ambisonicOrder, '(Max order is',
                SPHERICAL_HARMONICS_MAX_ORDER, ')\nUsing max order instead.');
            ambisonicOrder = SPHERICAL_HARMONICS_MAX_ORDER;
        }
        return ambisonicOrder;
    }

    /**
     * Spatially encodes input using weighted spherical harmonics.
     */
    constructor(context: AudioContext, options?: EncoderOptions) {
        // Use defaults for undefined arguments.
        options = Object.assign({
            ambisonicOrder: DEFAULT_AMBISONIC_ORDER,
            azimuth: DEFAULT_AZIMUTH,
            elevation: DEFAULT_ELEVATION,
            sourceWidth: DEFAULT_SOURCE_WIDTH
        }, options);

        this.context = context;

        // Create I/O nodes.
        this.input = context.createGain();
        this.output = context.createGain();

        // Set initial order, angle and source width.
        this.setAmbisonicOrder(options.ambisonicOrder);
        this.azimuth = options.azimuth;
        this.elevation = options.elevation;
        this.setSourceWidth(options.sourceWidth);
    }

    /**
     * Set the desired ambisonic order.
     * @param ambisonicOrder Desired ambisonic order.
     */
    setAmbisonicOrder(ambisonicOrder: number): void {
        this.ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);

        this.input.disconnect();
        for (let i = 0; i < this.channelGain.length; i++) {
            this.channelGain[i].disconnect();
        }
        if (this.merger != null) {
            this.merger.disconnect();
        }
        
        // Create audio graph.
        let numChannels = (this.ambisonicOrder + 1) * (this.ambisonicOrder + 1);
        this.merger = this.context.createChannelMerger(numChannels);
        this.channelGain = new Array(numChannels);
        for (let i = 0; i < numChannels; i++) {
            this.channelGain[i] = this.context.createGain();
            this.input.connect(this.channelGain[i]);
            this.channelGain[i].connect(this.merger, 0, i);
        }
        this.merger.connect(this.output);
    }

    dispose(): void {
        this.merger.disconnect(this.output);
        let numChannels = (this.ambisonicOrder + 1) * (this.ambisonicOrder + 1);
        for (let i = 0; i < numChannels; ++i) {
            this.channelGain[i].disconnect(this.merger, 0, i);
            this.input.disconnect(this.channelGain[i]);
        }
    }


    /**
     * Set the direction of the encoded source signal.
     * @param azimuth
     * Azimuth (in degrees). Defaults to
     * {@linkcode DEFAULT_AZIMUTH DEFAULT_AZIMUTH}.
     * @param elevation
     * Elevation (in degrees). Defaults to
     * {@linkcode DEFAULT_ELEVATION DEFAULT_ELEVATION}.
     */
    setDirection(azimuth: number, elevation: number): void {
        // Format input direction to nearest indices.
        if (azimuth == undefined || isNaN(azimuth)) {
            azimuth = DEFAULT_AZIMUTH;
        }
        if (elevation == undefined || isNaN(elevation)) {
            elevation = DEFAULT_ELEVATION;
        }

        // Store the formatted input (for updating source width).
        this.azimuth = azimuth;
        this.elevation = elevation;

        // Format direction for index lookups.
        azimuth = Math.round(azimuth % 360);
        if (azimuth < 0) {
            azimuth += 360;
        }
        elevation = Math.round(Math.min(90, Math.max(-90, elevation))) + 90;

        // Assign gains to each output.
        this.channelGain[0].gain.value = MAX_RE_WEIGHTS[this.spreadIndex][0];
        for (let i = 1; i <= this.ambisonicOrder; i++) {
            let degreeWeight = MAX_RE_WEIGHTS[this.spreadIndex][i];
            for (let j = -i; j <= i; j++) {
                const acnChannel = (i * i) + i + j;
                const elevationIndex = i * (i + 1) / 2 + Math.abs(j) - 1;
                let val = SPHERICAL_HARMONICS[1][elevation][elevationIndex];
                if (j != 0) {
                    let azimuthIndex = SPHERICAL_HARMONICS_MAX_ORDER + j - 1;
                    if (j < 0) {
                        azimuthIndex = SPHERICAL_HARMONICS_MAX_ORDER + j;
                    }
                    val *= SPHERICAL_HARMONICS[0][azimuth][azimuthIndex];
                }
                this.channelGain[acnChannel].gain.value = val * degreeWeight;
            }
        }
    }


    /**
     * Set the source width (in degrees). Where 0 degrees is a point source and 360
     * degrees is an omnidirectional source.
     * @param sourceWidth (in degrees).
     */
    setSourceWidth(sourceWidth: number): void {
        // The MAX_RE_WEIGHTS is a 360 x (SPHERICAL_HARMONICS_MAX_ORDER+1)
        // size table.
        this.spreadIndex = Math.min(359, Math.max(0, Math.round(sourceWidth)));
        this.setDirection(this.azimuth, this.elevation);
    }
}
