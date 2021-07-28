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
import { connect, disconnect, nameVertex } from "../audio/GraphVisualizer";
/**
 * @file A collection of convolvers. Can be used for the optimized HOA binaural
 * rendering. (e.g. SH-MaxRe HRTFs)
 */
/**
 * A convolver network for N-channel HOA stream.
 */
export class HOAConvolver {
    _context;
    _active = false;
    _isBufferLoaded = false;
    _ambisonicOrder;
    _numberOfChannels;
    _inputSplitter;
    _stereoMergers;
    _convolvers;
    _stereoSplitters;
    _positiveIndexSphericalHarmonics;
    _negativeIndexSphericalHarmonics;
    _inverter;
    _binauralMerger;
    _outputGain;
    input;
    output;
    /**
     * A convolver network for N-channel HOA stream.
      * @param context - Associated BaseAudioContext.
     * @param ambisonicOrder - Ambisonic order. (2 or 3)
     * @param [hrirBufferList] - An ordered-list of stereo
     * AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
     */
    constructor(context, ambisonicOrder, hrirBufferList) {
        this._context = context;
        // The number of channels K based on the ambisonic order N where K = (N+1)^2.
        this._ambisonicOrder = ambisonicOrder;
        this._numberOfChannels =
            (this._ambisonicOrder + 1) * (this._ambisonicOrder + 1);
        this._buildAudioGraph();
        if (hrirBufferList) {
            this.setHRIRBufferList(hrirBufferList);
        }
        this.enable();
    }
    /**
     * Build the internal audio graph.
     * For TOA convolution:
     *   input -> splitter(16) -[0,1]-> merger(2) -> convolver(2) -> splitter(2)
     *                         -[2,3]-> merger(2) -> convolver(2) -> splitter(2)
     *                         -[4,5]-> ... (6 more, 8 branches total)
     */
    _buildAudioGraph() {
        const numberOfStereoChannels = Math.ceil(this._numberOfChannels / 2);
        this._inputSplitter = nameVertex("hoa-convolver-splitter", this._context.createChannelSplitter(this._numberOfChannels));
        this._stereoMergers = [];
        this._convolvers = [];
        this._stereoSplitters = [];
        this._positiveIndexSphericalHarmonics = nameVertex("foa-convolver-positiveIndexSphericalHarmonics", this._context.createGain());
        this._negativeIndexSphericalHarmonics = nameVertex("foa-convolver-negativeIndexSphericalHarmonics", this._context.createGain());
        this._inverter = nameVertex("foa-convolver-inverter", this._context.createGain());
        this._binauralMerger = nameVertex("hoa-convolver-merger", this._context.createChannelMerger(2));
        this._outputGain = nameVertex("foa-convolver-outputGain", this._context.createGain());
        for (let i = 0; i < numberOfStereoChannels; ++i) {
            this._stereoMergers[i] = nameVertex("hoa-convolver-stereo-merger-" + i, this._context.createChannelMerger(2));
            this._convolvers[i] = nameVertex("hoa-convolver-stereo-convolver-" + i, this._context.createConvolver());
            this._stereoSplitters[i] = nameVertex("hoa-convolver-stereo-splitter" + i, this._context.createChannelSplitter(2));
            this._convolvers[i].normalize = false;
        }
        for (let l = 0; l <= this._ambisonicOrder; ++l) {
            for (let m = -l; m <= l; m++) {
                // We compute the ACN index (k) of ambisonics channel using the degree (l)
                // and index (m): k = l^2 + l + m
                const acnIndex = l * l + l + m;
                const stereoIndex = Math.floor(acnIndex / 2);
                // Split channels from input into array of stereo convolvers.
                // Then create a network of mergers that produces the stereo output.
                connect(this._inputSplitter, this._stereoMergers[stereoIndex], acnIndex, acnIndex % 2);
                connect(this._stereoMergers[stereoIndex], this._convolvers[stereoIndex]);
                connect(this._convolvers[stereoIndex], this._stereoSplitters[stereoIndex]);
                // Positive index (m >= 0) spherical harmonics are symmetrical around the
                // front axis, while negative index (m < 0) spherical harmonics are
                // anti-symmetrical around the front axis. We will exploit this symmetry
                // to reduce the number of convolutions required when rendering to a
                // symmetrical binaural renderer.
                if (m >= 0) {
                    connect(this._stereoSplitters[stereoIndex], this._positiveIndexSphericalHarmonics, acnIndex % 2);
                }
                else {
                    connect(this._stereoSplitters[stereoIndex], this._negativeIndexSphericalHarmonics, acnIndex % 2);
                }
            }
        }
        connect(this._positiveIndexSphericalHarmonics, this._binauralMerger, 0, 0);
        connect(this._positiveIndexSphericalHarmonics, this._binauralMerger, 0, 1);
        connect(this._negativeIndexSphericalHarmonics, this._binauralMerger, 0, 0);
        connect(this._negativeIndexSphericalHarmonics, this._inverter);
        connect(this._inverter, this._binauralMerger, 0, 1);
        // For asymmetric index.
        this._inverter.gain.value = -1;
        // Input/Output proxy.
        this.input = this._inputSplitter;
        this.output = this._outputGain;
    }
    dispose() {
        if (this._active) {
            this.disable();
        }
        for (let l = 0; l <= this._ambisonicOrder; ++l) {
            for (let m = -l; m <= l; m++) {
                // We compute the ACN index (k) of ambisonics channel using the degree (l)
                // and index (m): k = l^2 + l + m
                const acnIndex = l * l + l + m;
                const stereoIndex = Math.floor(acnIndex / 2);
                // Split channels from input into array of stereo convolvers.
                // Then create a network of mergers that produces the stereo output.
                disconnect(this._inputSplitter, this._stereoMergers[stereoIndex], acnIndex, acnIndex % 2);
                disconnect(this._stereoMergers[stereoIndex], this._convolvers[stereoIndex]);
                disconnect(this._convolvers[stereoIndex], this._stereoSplitters[stereoIndex]);
                // Positive index (m >= 0) spherical harmonics are symmetrical around the
                // front axis, while negative index (m < 0) spherical harmonics are
                // anti-symmetrical around the front axis. We will exploit this symmetry
                // to reduce the number of convolutions required when rendering to a
                // symmetrical binaural renderer.
                if (m >= 0) {
                    disconnect(this._stereoSplitters[stereoIndex], this._positiveIndexSphericalHarmonics, acnIndex % 2);
                }
                else {
                    disconnect(this._stereoSplitters[stereoIndex], this._negativeIndexSphericalHarmonics, acnIndex % 2);
                }
            }
        }
        disconnect(this._positiveIndexSphericalHarmonics, this._binauralMerger, 0, 0);
        disconnect(this._positiveIndexSphericalHarmonics, this._binauralMerger, 0, 1);
        disconnect(this._negativeIndexSphericalHarmonics, this._binauralMerger, 0, 0);
        disconnect(this._negativeIndexSphericalHarmonics, this._inverter);
        disconnect(this._inverter, this._binauralMerger, 0, 1);
    }
    /**
     * Assigns N HRIR AudioBuffers to N convolvers: Note that we use 2 stereo
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
        for (let i = 0; i < hrirBufferList.length; ++i) {
            this._convolvers[i].buffer = hrirBufferList[i];
        }
        this._isBufferLoaded = true;
    }
    /**
     * Enable HOAConvolver instance. The audio graph will be activated and pulled by
     * the WebAudio engine. (i.e. consume CPU cycle)
     */
    enable() {
        connect(this._binauralMerger, this._outputGain);
        this._active = true;
    }
    /**
     * Disable HOAConvolver instance. The inner graph will be disconnected from the
     * audio destination, thus no CPU cycle will be consumed.
     */
    disable() {
        disconnect(this._binauralMerger, this._outputGain);
        this._active = false;
    }
}
//# sourceMappingURL=hoa-convolver.js.map