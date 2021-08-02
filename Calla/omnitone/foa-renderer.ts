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
 * @file Omnitone FOARenderer. This is user-facing API for the first-order
 * ambisonic decoder and the optimized binaural renderer.
 */


import { mat3, mat4 } from "gl-matrix";
import { channelCount, channelCountMode, channelInterpretation, connect, disconnect, ErsatzAudioNode, Gain } from "kudzu/audio";
import type { IDisposable } from "kudzu/using";
import { BufferDataType, BufferList } from './buffer-list';
import { FOAConvolver } from './foa-convolver';
import { FOARotator } from './foa-rotator';
import { ChannelMap, FOARouter } from './foa-router';
import { RenderingMode } from "./rendering-mode";
import FOAHrirBase64 from './resources/omnitone-foa-hrir-base64';
import { log } from "./utils";

/**
 * Configuration for the FAORenderer class
 **/
export interface FOARendererOptions {
    channelMap?: ChannelMap | number[];
    hrirPathList?: string[];
    renderingMode?: RenderingMode;
}

/**
 * Omnitone FOA renderer class. Uses the optimized convolution technique.
 */
export class FOARenderer implements IDisposable, ErsatzAudioNode {
    private config: FOARendererOptions;
    private bypass: GainNode;
    private router: FOARouter;
    private convolver: FOAConvolver;

    rotator: FOARotator;
    input: GainNode;
    output: GainNode;

    /**
     * Omnitone FOA renderer class. Uses the optimized convolution technique.
     */
    constructor(options: FOARendererOptions) {
        this.config = Object.assign({
            channelMap: ChannelMap.Default,
            renderingMode: RenderingMode.Ambisonic,
        }, options);

        if (this.config.channelMap instanceof Array
            && this.config.channelMap.length !== 4) {
            throw new Error(
                'FOARenderer: Invalid channel map. (got ' + this.config.channelMap
                + ')');
        }

        if (this.config.hrirPathList && this.config.hrirPathList.length !== 2) {
            throw new Error(
                'FOARenderer: Invalid HRIR URLs. It must be an array with ' +
                '2 URLs to HRIR files. (got ' + this.config.hrirPathList + ')');
        }

        this.buildAudioGraph();
    }


    /**
     * Builds the internal audio graph.
     */
    private buildAudioGraph(): void {
        this.router = new FOARouter(this.config.channelMap);
        this.bypass = Gain("foa-renderer-bypass");

        this.input = Gain("foa-renderer-input",
            channelCount(4),
            channelCountMode("explicit"),
            channelInterpretation("discrete"),
            this.router,
            this.bypass);

        this.output = Gain("foa-renderer-output");
        this.rotator = new FOARotator();
        this.convolver = new FOAConvolver();

        connect(this.router, this.rotator);
        connect(this.rotator, this.convolver);
        connect(this.convolver, this.output);
    }


    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            if (this.getRenderingMode() === RenderingMode.Bypass) {
                disconnect(this.bypass);
            }

            disconnect(this.input);
            disconnect(this.router);
            disconnect(this.rotator);
            disconnect(this.convolver);
            this.convolver.dispose();
            this.rotator.dispose();
            this.router.dispose();
            this.disposed = true;
        }
    }

    /**
     * Initializes and loads the resource for the renderer.
     */
    async initialize(): Promise<void> {
        const bufferList = this.config.hrirPathList
            ? new BufferList(this.config.hrirPathList, { dataType: BufferDataType.URL })
            : new BufferList(FOAHrirBase64, { dataType: BufferDataType.BASE64 });
        try {
            const hrirBufferList = await bufferList.load();
            this.convolver.setHRIRBufferList(hrirBufferList);
            this.setRenderingMode(this.config.renderingMode);
        }
        catch (exp) {
            const errorMessage = `FOARenderer: HRIR loading/decoding (mode: ${this.config.renderingMode}) failed. Reason: ${exp.message}`;
            throw new Error(errorMessage);
        }
    }


    /**
     * Set the channel map.
     * @param channelMap - Custom channel routing for FOA stream.
     */
    setChannelMap(channelMap: ChannelMap | number[]): void {
        if (channelMap.toString() !== this.config.channelMap.toString()) {
            log(
                'Remapping channels ([' + this.config.channelMap.toString() +
                '] -> [' + channelMap.toString() + ']).');
            if (channelMap instanceof Array) {
                this.config.channelMap = channelMap.slice();
            }
            else {
                this.config.channelMap = channelMap;
            }
            this.router.setChannelMap(this.config.channelMap);
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
     * Set the rendering mode.
     * @param mode - Rendering mode.
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