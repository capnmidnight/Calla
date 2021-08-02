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
import { ErsatzAudioNode } from "kudzu/audio";
import { IDisposable } from "kudzu/using";
/**
 * @file A collection of convolvers. Can be used for the optimized HOA binaural
 * rendering. (e.g. SH-MaxRe HRTFs)
 */
/**
 * A convolver network for N-channel HOA stream.
 */
export declare class HOAConvolver implements IDisposable, ErsatzAudioNode {
    private _active;
    private _isBufferLoaded;
    private _ambisonicOrder;
    private _numberOfChannels;
    private _inputSplitter;
    private _stereoMergers;
    private _convolvers;
    private _stereoSplitters;
    private _positiveIndexSphericalHarmonics;
    private _negativeIndexSphericalHarmonics;
    private _inverter;
    private _binauralMerger;
    private _outputGain;
    /**
     * A convolver network for N-channel HOA stream.
      * @param context - Associated BaseAudioContext.
     * @param ambisonicOrder - Ambisonic order. (2 or 3)
     * @param [hrirBufferList] - An ordered-list of stereo
     * AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
     */
    constructor(ambisonicOrder: number, hrirBufferList?: AudioBuffer[]);
    get input(): ChannelSplitterNode;
    get output(): GainNode;
    dispose(): void;
    /**
     * Assigns N HRIR AudioBuffers to N convolvers: Note that we use 2 stereo
     * convolutions for 4-channel direct convolution. Using mono convolver or
     * 4-channel convolver is not viable because mono convolution wastefully
     * produces the stereo outputs, and the 4-ch convolver does cross-channel
     * convolution. (See Web Audio API spec)
     * @param hrirBufferList - An array of stereo AudioBuffers for
     * convolvers.
     */
    setHRIRBufferList(hrirBufferList: AudioBuffer[]): void;
    /**
     * Enable HOAConvolver instance. The audio graph will be activated and pulled by
     * the WebAudio engine. (i.e. consume CPU cycle)
     */
    enable(): void;
    /**
     * Disable HOAConvolver instance. The inner graph will be disconnected from the
     * audio destination, thus no CPU cycle will be consumed.
     */
    disable(): void;
}
