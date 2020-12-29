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
import type { IDisposable } from "kudzu";
/**
 * @file A collection of convolvers. Can be used for the optimized FOA binaural
 * rendering. (e.g. SH-MaxRe HRTFs)
 */
/**
 * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
 */
export declare class FOAConvolver implements IDisposable {
    private _context;
    private _active;
    private _isBufferLoaded;
    private _splitterWYZX;
    private _mergerWY;
    private _mergerZX;
    private _convolverWY;
    private _convolverZX;
    private _splitterWY;
    private _splitterZX;
    private _inverter;
    private _mergerBinaural;
    private _summingBus;
    input: ChannelSplitterNode;
    output: GainNode;
    /**
     * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
     * @param context The associated AudioContext.
     * @param hrirBufferList - An ordered-list of stereo AudioBuffers for convolution. (i.e. 2 stereo AudioBuffers for FOA)
     */
    constructor(context: BaseAudioContext, hrirBufferList?: AudioBuffer[]);
    /**
     * Build the internal audio graph.
     */
    private _buildAudioGraph;
    dispose(): void;
    /**
     * Assigns 2 HRIR AudioBuffers to 2 convolvers: Note that we use 2 stereo
     * convolutions for 4-channel direct convolution. Using mono convolver or
     * 4-channel convolver is not viable because mono convolution wastefully
     * produces the stereo outputs, and the 4-ch convolver does cross-channel
     * convolution. (See Web Audio API spec)
     * @param hrirBufferList - An array of stereo AudioBuffers for
     * convolvers.
     */
    setHRIRBufferList(hrirBufferList: AudioBuffer[]): void;
    /**
     * Enable FOAConvolver instance. The audio graph will be activated and pulled by
     * the WebAudio engine. (i.e. consume CPU cycle)
     */
    enable(): void;
    /**
     * Disable FOAConvolver instance. The inner graph will be disconnected from the
     * audio destination, thus no CPU cycle will be consumed.
     */
    disable(): void;
}
