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
import { ChannelMerger, ChannelSplitter, connect, Convolver, disconnect, gain, Gain, normalize } from "kudzu/audio";
/**
 * @file A collection of convolvers. Can be used for the optimized FOA binaural
 * rendering. (e.g. SH-MaxRe HRTFs)
 */
/**
 * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
 */
export class FOAConvolver {
    _active;
    _isBufferLoaded;
    _splitterWYZX;
    _mergerWY;
    _mergerZX;
    _convolverWY;
    _convolverZX;
    _splitterWY;
    _splitterZX;
    _inverter;
    _mergerBinaural;
    _summingBus;
    /**
     * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
     * @param hrirBufferList - An ordered-list of stereo AudioBuffers for convolution. (i.e. 2 stereo AudioBuffers for FOA)
     */
    constructor(hrirBufferList) {
        this._active = false;
        this._isBufferLoaded = false;
        this._mergerBinaural = ChannelMerger("foa-convolver-merger-binaural", 2);
        this._inverter = Gain("foa-convolver-inverter", gain(-1), [0, 1, this._mergerBinaural]);
        this._mergerWY = ChannelMerger("foa-convolver-merger-wy", 2, this._convolverWY = Convolver("foa-convolver-convolver-wy", 
        // By default, WebAudio's convolver does the normalization based on IR's
        // energy. For the precise convolution, it must be disabled before the buffer
        // assignment.
        normalize(false), this._splitterWY = ChannelSplitter("foa-convolver-splitter-wy", 2, [0, 0, this._mergerBinaural], [0, 1, this._mergerBinaural], [1, 0, this._mergerBinaural], [1, 0, this._inverter])));
        this._mergerZX = ChannelMerger("foa-convolver-merger-zx", 2, this._convolverZX = Convolver("foa-convolver-convolver-zx", 
        // By default, WebAudio's convolver does the normalization based on IR's
        // energy. For the precise convolution, it must be disabled before the buffer
        // assignment.
        normalize(false), this._splitterZX = ChannelSplitter("foa-convolver-splitter-zx", 2, [0, 0, this._mergerBinaural], [0, 1, this._mergerBinaural], [1, 0, this._mergerBinaural], [1, 1, this._mergerBinaural])));
        // Group W and Y, then Z and X.
        this._splitterWYZX = ChannelSplitter("foa-convolver-splitter-wyzx", 4, [0, 0, this._splitterWY], [1, 1, this._splitterWY], [2, 0, this._splitterZX], [3, 1, this._splitterZX]);
        this._summingBus = Gain("foa-convolver-summing-bus");
        if (hrirBufferList) {
            this.setHRIRBufferList(hrirBufferList);
        }
        this.enable();
    }
    get input() {
        return this._splitterWYZX;
    }
    get output() {
        return this._summingBus;
    }
    disposed = false;
    dispose() {
        if (!this.disposed) {
            if (this._active) {
                this.disable();
            }
            disconnect(this._splitterWYZX);
            disconnect(this._mergerWY);
            disconnect(this._mergerZX);
            disconnect(this._convolverWY);
            disconnect(this._convolverZX);
            disconnect(this._splitterWY);
            disconnect(this._inverter);
            disconnect(this._splitterZX);
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
        connect(this._mergerBinaural, this._summingBus);
        this._active = true;
    }
    /**
     * Disable FOAConvolver instance. The inner graph will be disconnected from the
     * audio destination, thus no CPU cycle will be consumed.
     */
    disable() {
        disconnect(this._mergerBinaural);
        this._active = false;
    }
}
//# sourceMappingURL=foa-convolver.js.map