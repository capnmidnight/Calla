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
export declare class Encoder implements IDisposable {
    private context;
    private channelGain;
    private merger;
    private ambisonicOrder;
    private azimuth;
    private elevation;
    private spreadIndex;
    input: GainNode;
    output: GainNode;
    /**
     * Validate the provided ambisonic order.
     * @param ambisonicOrder Desired ambisonic order.
     * @return Validated/adjusted ambisonic order.
     */
    static validateAmbisonicOrder(ambisonicOrder: number): number;
    /**
     * Spatially encodes input using weighted spherical harmonics.
     */
    constructor(context: AudioContext, options?: EncoderOptions);
    /**
     * Set the desired ambisonic order.
     * @param ambisonicOrder Desired ambisonic order.
     */
    setAmbisonicOrder(ambisonicOrder: number): void;
    dispose(): void;
    /**
     * Set the direction of the encoded source signal.
     * @param azimuth
     * Azimuth (in degrees). Defaults to
     * {@linkcode DEFAULT_AZIMUTH DEFAULT_AZIMUTH}.
     * @param elevation
     * Elevation (in degrees). Defaults to
     * {@linkcode DEFAULT_ELEVATION DEFAULT_ELEVATION}.
     */
    setDirection(azimuth: number, elevation: number): void;
    /**
     * Set the source width (in degrees). Where 0 degrees is a point source and 360
     * degrees is an omnidirectional source.
     * @param sourceWidth (in degrees).
     */
    setSourceWidth(sourceWidth: number): void;
}
