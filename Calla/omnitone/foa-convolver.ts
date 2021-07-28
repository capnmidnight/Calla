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
import { connect, disconnect, nameVertex } from "../audio/GraphVisualizer";


/**
 * @file A collection of convolvers. Can be used for the optimized FOA binaural
 * rendering. (e.g. SH-MaxRe HRTFs)
 */


/**
 * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
 */
export class FOAConvolver implements IDisposable {
    private _context: BaseAudioContext;
    private _active: boolean;
    private _isBufferLoaded: boolean;
    private _splitterWYZX: ChannelSplitterNode;
    private _mergerWY: ChannelMergerNode;
    private _mergerZX: ChannelMergerNode;
    private _convolverWY: ConvolverNode;
    private _convolverZX: ConvolverNode;
    private _splitterWY: ChannelSplitterNode;
    private _splitterZX: ChannelSplitterNode;
    private _inverter: GainNode;
    private _mergerBinaural: ChannelMergerNode;
    private _summingBus: GainNode;
    input: ChannelSplitterNode;
    output: GainNode;

    /**
     * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
     * @param context The associated BaseAudioContext.
     * @param hrirBufferList - An ordered-list of stereo AudioBuffers for convolution. (i.e. 2 stereo AudioBuffers for FOA)
     */
    constructor(context: BaseAudioContext, hrirBufferList?: AudioBuffer[]) {
        this._context = context;

        this._active = false;
        this._isBufferLoaded = false;

        this._buildAudioGraph();

        if (hrirBufferList) {
            this.setHRIRBufferList(hrirBufferList);
        }

        this.enable();
    }


    /**
     * Build the internal audio graph.
     */
    private _buildAudioGraph(): void {
        this._splitterWYZX = nameVertex("foa-convolver-splitter-wyzx", this._context.createChannelSplitter(4));
        this._mergerWY = nameVertex("foa-convolver-merger-wy", this._context.createChannelMerger(2));
        this._mergerZX = nameVertex("foa-convolver-merger-zx", this._context.createChannelMerger(2));
        this._convolverWY = nameVertex("foa-convolver-convolver-wy", this._context.createConvolver());
        this._convolverZX = nameVertex("foa-convolver-convolver-zx", this._context.createConvolver());
        this._splitterWY = nameVertex("foa-convolver-splitter-wy", this._context.createChannelSplitter(2));
        this._splitterZX = nameVertex("foa-convolver-splitter-zx", this._context.createChannelSplitter(2));
        this._inverter = nameVertex("foa-convolver-inverter", this._context.createGain());
        this._mergerBinaural = nameVertex("foa-convolver-merger-binaural", this._context.createChannelMerger(2));
        this._summingBus = nameVertex("foa-convolver-summing-bus", this._context.createGain());

        // Group W and Y, then Z and X.
        connect(this._splitterWYZX, this._mergerWY, 0, 0);
        connect(this._splitterWYZX, this._mergerWY, 1, 1);
        connect(this._splitterWYZX, this._mergerZX, 2, 0);
        connect(this._splitterWYZX, this._mergerZX, 3, 1);

        // Create a network of convolvers using splitter/merger.
        connect(this._mergerWY, this._convolverWY);
        connect(this._mergerZX, this._convolverZX);
        connect(this._convolverWY, this._splitterWY);
        connect(this._convolverZX, this._splitterZX);
        connect(this._splitterWY, this._mergerBinaural, 0, 0);
        connect(this._splitterWY, this._mergerBinaural, 0, 1);
        connect(this._splitterWY, this._mergerBinaural, 1, 0);
        connect(this._splitterWY, this._inverter, 1, 0);
        connect(this._inverter, this._mergerBinaural, 0, 1);
        connect(this._splitterZX, this._mergerBinaural, 0, 0);
        connect(this._splitterZX, this._mergerBinaural, 0, 1);
        connect(this._splitterZX, this._mergerBinaural, 1, 0);
        connect(this._splitterZX, this._mergerBinaural, 1, 1);

        // By default, WebAudio's convolver does the normalization based on IR's
        // energy. For the precise convolution, it must be disabled before the buffer
        // assignment.
        this._convolverWY.normalize = false;
        this._convolverZX.normalize = false;

        // For asymmetric degree.
        this._inverter.gain.value = -1;

        // Input/output proxy.
        this.input = this._splitterWYZX;
        this.output = this._summingBus;
    }


    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            if (this._active) {
                this.disable();
            }

            // Group W and Y, then Z and X.
            disconnect(this._splitterWYZX, this._mergerWY, 0, 0);
            disconnect(this._splitterWYZX, this._mergerWY, 1, 1);
            disconnect(this._splitterWYZX, this._mergerZX, 2, 0);
            disconnect(this._splitterWYZX, this._mergerZX, 3, 1);

            // Create a network of convolvers using splitter/merger.
            disconnect(this._mergerWY, this._convolverWY);
            disconnect(this._mergerZX, this._convolverZX);
            disconnect(this._convolverWY, this._splitterWY);
            disconnect(this._convolverZX, this._splitterZX);
            disconnect(this._splitterWY, this._mergerBinaural, 0, 0);
            disconnect(this._splitterWY, this._mergerBinaural, 0, 1);
            disconnect(this._splitterWY, this._mergerBinaural, 1, 0);
            disconnect(this._splitterWY, this._inverter, 1, 0);
            disconnect(this._inverter, this._mergerBinaural, 0, 1);
            disconnect(this._splitterZX, this._mergerBinaural, 0, 0);
            disconnect(this._splitterZX, this._mergerBinaural, 0, 1);
            disconnect(this._splitterZX, this._mergerBinaural, 1, 0);
            disconnect(this._splitterZX, this._mergerBinaural, 1, 1);
            this.disposed = true;
        }
    }


    /**
     * Assigns 2 HRIR AudioBuffers to 2 convolvers: Note that we use 2 stereo
     * convolutions for 4-channel direct convolution. Using mono convolver or
     * 4-channel convolver is not viable because mono convolution wastefully
     * produces the stereo outputs, and the 4-ch convolver does cross-channel
     * convolution. (See Web Audio API spec)
     * @param hrirBufferList - An array of stereo AudioBuffers for
     * convolvers.
     */
    setHRIRBufferList(hrirBufferList: AudioBuffer[]): void {
        // After these assignments, the channel data in the buffer is immutable in
        // FireFox. (i.e. neutered) So we should avoid re-assigning buffers, otherwise
        // an exception will be thrown.
        if (this._isBufferLoaded) {
            return;
        }

        this._convolverWY.buffer = hrirBufferList[0];
        this._convolverZX.buffer = hrirBufferList[1];
        this._isBufferLoaded = true;
    }


    /**
     * Enable FOAConvolver instance. The audio graph will be activated and pulled by
     * the WebAudio engine. (i.e. consume CPU cycle)
     */
    enable(): void {
        connect(this._mergerBinaural, this._summingBus);
        this._active = true;
    }


    /**
     * Disable FOAConvolver instance. The inner graph will be disconnected from the
     * audio destination, thus no CPU cycle will be consumed.
     */
    disable(): void {
        disconnect(this._mergerBinaural, this._summingBus);
        this._active = false;
    }
}
