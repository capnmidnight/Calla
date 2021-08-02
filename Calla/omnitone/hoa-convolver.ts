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

import { ChannelMerger, ChannelSplitter, connect, Convolver, disconnect, ErsatzAudioNode, gain, Gain } from "kudzu/audio";
import { IDisposable } from "kudzu/using";


/**
 * @file A collection of convolvers. Can be used for the optimized HOA binaural
 * rendering. (e.g. SH-MaxRe HRTFs)
 */


/**
 * A convolver network for N-channel HOA stream.
 */
export class HOAConvolver implements IDisposable, ErsatzAudioNode {
    private _active = false;
    private _isBufferLoaded = false;
    private _ambisonicOrder: number;
    private _numberOfChannels: number;
    private _inputSplitter: ChannelSplitterNode;
    private _stereoMergers = new Array<ChannelMergerNode>();
    private _convolvers = new Array<ConvolverNode>();
    private _stereoSplitters = new Array<ChannelSplitterNode>();
    private _positiveIndexSphericalHarmonics: GainNode;
    private _negativeIndexSphericalHarmonics: GainNode;
    private _inverter: GainNode;
    private _binauralMerger: ChannelMergerNode;
    private _outputGain: GainNode;

    /**
     * A convolver network for N-channel HOA stream.
      * @param context - Associated BaseAudioContext.
     * @param ambisonicOrder - Ambisonic order. (2 or 3)
     * @param [hrirBufferList] - An ordered-list of stereo
     * AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
     */
    constructor(ambisonicOrder: number, hrirBufferList?: AudioBuffer[]) {
        // The number of channels K based on the ambisonic order N where K = (N+1)^2.
        this._ambisonicOrder = ambisonicOrder;
        this._numberOfChannels =
            (this._ambisonicOrder + 1) * (this._ambisonicOrder + 1);

        const numberOfStereoChannels = Math.ceil(this._numberOfChannels / 2);

        this._inputSplitter = ChannelSplitter("hoa-convolver-splitter", this._numberOfChannels);
        this._binauralMerger = ChannelMerger("hoa-convolver-merger", 2);

        this._inverter = Gain(
            "foa-convolver-inverter",
            gain(-1),
            [0, 1, this._binauralMerger])

        this._positiveIndexSphericalHarmonics = Gain(
            "foa-convolver-positiveIndexSphericalHarmonics",
            [0, 0, this._binauralMerger],
            [0, 1, this._binauralMerger]);

        this._negativeIndexSphericalHarmonics = Gain(
            "foa-convolver-negativeIndexSphericalHarmonics",
            this._inverter,
            [0, 0, this._binauralMerger]);

        this._outputGain = Gain("foa-convolver-outputGain",);

        for (let i = 0; i < numberOfStereoChannels; ++i) {
            this._stereoMergers[i] = ChannelMerger("hoa-convolver-stereo-merger-" + i, 2);
            this._convolvers[i] = Convolver("hoa-convolver-stereo-convolver-" + i,);
            this._stereoSplitters[i] = ChannelSplitter("hoa-convolver-stereo-splitter" + i, 2);
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
                } else {
                    connect(this._stereoSplitters[stereoIndex], this._negativeIndexSphericalHarmonics, acnIndex % 2);
                }
            }
        }

        if (hrirBufferList) {
            this.setHRIRBufferList(hrirBufferList);
        }

        this.enable();
    }

    get input() {
        return this._inputSplitter;
    }

    get output() {
        return this._outputGain;
    }

    dispose(): void {
        if (this._active) {
            this.disable();
        }

        disconnect(this._inputSplitter);
        disconnect(this._positiveIndexSphericalHarmonics);
        disconnect(this._negativeIndexSphericalHarmonics);
        disconnect(this._inverter);

        for (const node of this._stereoMergers) {
            disconnect(node);
        }

        for (const node of this._convolvers) {
            disconnect(node);
        }

        for (const node of this._stereoSplitters) {
            disconnect(node);
        }

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
    setHRIRBufferList(hrirBufferList: AudioBuffer[]): void {
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
    enable(): void {
        connect(this._binauralMerger, this._outputGain);
        this._active = true;
    }


    /**
     * Disable HOAConvolver instance. The inner graph will be disconnected from the
     * audio destination, thus no CPU cycle will be consumed.
     */
    disable(): void {
        disconnect(this._binauralMerger);
        this._active = false;
    }
}