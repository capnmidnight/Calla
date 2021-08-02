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
 * @file Omnitone HOARenderer. This is user-facing API for the higher-order
 * ambisonic decoder and the optimized binaural renderer.
 */


import { mat3, mat4 } from "gl-matrix";
import { channelCount, channelCountMode, channelInterpretation, connect, disconnect, ErsatzAudioNode, Gain } from "kudzu/audio";
import type { IDisposable } from "kudzu/using";
import { BufferDataType, BufferList } from './buffer-list';
import { HOAConvolver } from './hoa-convolver';
import { HOARotator } from './hoa-rotator';
import { RenderingMode } from "./rendering-mode";
import SOAHrirBase64 from './resources/omnitone-soa-hrir-base64';
import TOAHrirBase64 from './resources/omnitone-toa-hrir-base64';
import { log } from "./utils";


// Currently SOA and TOA are only supported.
const SupportedAmbisonicOrder = [2, 3];

export interface HOARendererOptions {

    ambisonicOrder?: number;

    /**
     * A list of paths to HRIR files. It overrides the internal HRIR list if given.
     **/
    hrirPathList?: string[];

    renderingMode?: RenderingMode;

    numberOfChannels?: number;

    numberOfStereoChannels?: number;
}

/**
 * Omnitone HOA renderer class. Uses the optimized convolution technique.
 */
export class HOARenderer implements IDisposable, ErsatzAudioNode {
    private config: HOARendererOptions;
    input: GainNode;
    output: GainNode;
    private bypass: GainNode;
    rotator: HOARotator;
    private convolver: HOAConvolver;

    /**
     * Omnitone HOA renderer class. Uses the optimized convolution technique.
     */
    constructor(options: HOARendererOptions) {

        this.config = Object.assign({
            ambisonicOrder: 3,
            renderingMode: RenderingMode.Ambisonic,
        }, options);

        if (!SupportedAmbisonicOrder.includes(this.config.ambisonicOrder)) {
            log('HOARenderer: Invalid ambisonic order. (got ' +
                this.config.ambisonicOrder + ') Fallbacks to 3rd-order ambisonic.');
            this.config.ambisonicOrder = Math.max(2, Math.min(3, this.config.ambisonicOrder));
        }

        this.config.numberOfChannels =
            (this.config.ambisonicOrder + 1) * (this.config.ambisonicOrder + 1);
        this.config.numberOfStereoChannels =
            Math.ceil(this.config.numberOfChannels / 2);

        if (this.config.hrirPathList.length !== this.config.numberOfStereoChannels) {
            throw new Error(
                'HOARenderer: Invalid HRIR URLs. It must be an array with ' +
                this.config.numberOfStereoChannels + ' URLs to HRIR files.' +
                ' (got ' + options.hrirPathList + ')');
        }

        this._buildAudioGraph();
    }


    /**
     * Builds the internal audio graph.
     */
    private _buildAudioGraph(): void {
        this.output = Gain("hoa-renderer-output");

        this.rotator = new HOARotator(this.config.ambisonicOrder);

        this.bypass = Gain("hoa-renderer-bypass");

        this.input = Gain(
            "hoa-renderer-input",
            channelCount(this.config.numberOfChannels),
            channelCountMode("explicit"),
            channelInterpretation("discrete"),
            this.rotator,
            this.bypass);

        this.convolver = new HOAConvolver(this.config.ambisonicOrder);

        connect(this.rotator, this.convolver);
        connect(this.convolver, this);
    }

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            if (this.getRenderingMode() === RenderingMode.Bypass) {
                disconnect(this.bypass);
            }

            disconnect(this.input);
            disconnect(this.rotator);
            disconnect(this.convolver);

            this.rotator.dispose();
            this.convolver.dispose();
            this.disposed = true;
        }
    }

    /**
     * Initializes and loads the resource for the renderer.
     */
    async initialize(): Promise<void> {
        let bufferList;
        if (this.config.hrirPathList) {
            bufferList =
                new BufferList(this.config.hrirPathList, { dataType: BufferDataType.URL });
        } else {
            bufferList = this.config.ambisonicOrder === 2
                ? new BufferList(SOAHrirBase64)
                : new BufferList(TOAHrirBase64);
        }

        try {
            const hrirBufferList = await bufferList.load();
            this.convolver.setHRIRBufferList(hrirBufferList);
            this.setRenderingMode(this.config.renderingMode);
        }
        catch (exp) {
            const errorMessage = `HOARenderer: HRIR loading/decoding (mode: ${this.config.renderingMode}) failed. Reason: ${exp.message}`;
            throw new Error(errorMessage);
        }
    }


    /**
     * Updates the rotation matrix with 3x3 matrix.
     * @param rotationMatrix3 - A 3x3 rotation matrix. (column-major)
     */
    setRotationMatrix3(rotationMatrix3: mat3): void {
        this.rotator.setRotationMatrix3(rotationMatrix3);
    }


    /**
     * Updates the rotation matrix with 4x4 matrix.
     * @param rotationMatrix4 - A 4x4 rotation matrix. (column-major)
     */
    setRotationMatrix4(rotationMatrix4: mat4): void {
        this.rotator.setRotationMatrix4(rotationMatrix4);
    }

    getRenderingMode(): RenderingMode {
        return this.config.renderingMode;
    }

    /**
     * Set the decoding mode.
     * @param mode - Decoding mode.
     *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
     *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
     *    decoding or encoding.
     *  - 'off': all the processing off saving the CPU power.
     */
    setRenderingMode(mode: RenderingMode): void {
        if (mode === this.config.renderingMode) {
            return;
        }

        if (mode === RenderingMode.Ambisonic) {
            this.convolver.enable;
        }
        else {
            this.convolver.disable();
        }

        if (mode === RenderingMode.Bypass) {
            connect(this.bypass, this.output);
        }
        else {
            disconnect(this.bypass, this.output);
        }

        this.config.renderingMode = mode;
    }
}