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
 * @file A collection of convolvers. Can be used for the optimized FOA binaural
 * rendering. (e.g. SH-MaxRe HRTFs)
 */
/**
 * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
 */
export class FOAConvolver {
    /**
     * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
     * @param context The associated AudioContext.
     * @param hrirBufferList - An ordered-list of stereo AudioBuffers for convolution. (i.e. 2 stereo AudioBuffers for FOA)
     */
    constructor(context, hrirBufferList) {
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
    _buildAudioGraph() {
        this._splitterWYZX = this._context.createChannelSplitter(4);
        this._mergerWY = this._context.createChannelMerger(2);
        this._mergerZX = this._context.createChannelMerger(2);
        this._convolverWY = this._context.createConvolver();
        this._convolverZX = this._context.createConvolver();
        this._splitterWY = this._context.createChannelSplitter(2);
        this._splitterZX = this._context.createChannelSplitter(2);
        this._inverter = this._context.createGain();
        this._mergerBinaural = this._context.createChannelMerger(2);
        this._summingBus = this._context.createGain();
        // Group W and Y, then Z and X.
        this._splitterWYZX.connect(this._mergerWY, 0, 0);
        this._splitterWYZX.connect(this._mergerWY, 1, 1);
        this._splitterWYZX.connect(this._mergerZX, 2, 0);
        this._splitterWYZX.connect(this._mergerZX, 3, 1);
        // Create a network of convolvers using splitter/merger.
        this._mergerWY.connect(this._convolverWY);
        this._mergerZX.connect(this._convolverZX);
        this._convolverWY.connect(this._splitterWY);
        this._convolverZX.connect(this._splitterZX);
        this._splitterWY.connect(this._mergerBinaural, 0, 0);
        this._splitterWY.connect(this._mergerBinaural, 0, 1);
        this._splitterWY.connect(this._mergerBinaural, 1, 0);
        this._splitterWY.connect(this._inverter, 1, 0);
        this._inverter.connect(this._mergerBinaural, 0, 1);
        this._splitterZX.connect(this._mergerBinaural, 0, 0);
        this._splitterZX.connect(this._mergerBinaural, 0, 1);
        this._splitterZX.connect(this._mergerBinaural, 1, 0);
        this._splitterZX.connect(this._mergerBinaural, 1, 1);
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
    dispose() {
        if (this._active) {
            this.disable();
        }
        // Group W and Y, then Z and X.
        this._splitterWYZX.disconnect(this._mergerWY, 0, 0);
        this._splitterWYZX.disconnect(this._mergerWY, 1, 1);
        this._splitterWYZX.disconnect(this._mergerZX, 2, 0);
        this._splitterWYZX.disconnect(this._mergerZX, 3, 1);
        // Create a network of convolvers using splitter/merger.
        this._mergerWY.disconnect(this._convolverWY);
        this._mergerZX.disconnect(this._convolverZX);
        this._convolverWY.disconnect(this._splitterWY);
        this._convolverZX.disconnect(this._splitterZX);
        this._splitterWY.disconnect(this._mergerBinaural, 0, 0);
        this._splitterWY.disconnect(this._mergerBinaural, 0, 1);
        this._splitterWY.disconnect(this._mergerBinaural, 1, 0);
        this._splitterWY.disconnect(this._inverter, 1, 0);
        this._inverter.disconnect(this._mergerBinaural, 0, 1);
        this._splitterZX.disconnect(this._mergerBinaural, 0, 0);
        this._splitterZX.disconnect(this._mergerBinaural, 0, 1);
        this._splitterZX.disconnect(this._mergerBinaural, 1, 0);
        this._splitterZX.disconnect(this._mergerBinaural, 1, 1);
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
    setHRIRBufferList(hrirBufferList) {
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
    enable() {
        this._mergerBinaural.connect(this._summingBus);
        this._active = true;
    }
    /**
     * Disable FOAConvolver instance. The inner graph will be disconnected from the
     * audio destination, thus no CPU cycle will be consumed.
     */
    disable() {
        this._mergerBinaural.disconnect();
        this._active = false;
    }
}
//# sourceMappingURL=foa-convolver.js.map