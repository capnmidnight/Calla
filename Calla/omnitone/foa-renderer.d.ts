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
import { ErsatzAudioNode } from "kudzu/audio";
import type { IDisposable } from "kudzu/using";
import { FOARotator } from './foa-rotator';
import { ChannelMap } from './foa-router';
import { RenderingMode } from "./rendering-mode";
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
export declare class FOARenderer implements IDisposable, ErsatzAudioNode {
    private config;
    private bypass;
    private router;
    private convolver;
    rotator: FOARotator;
    input: GainNode;
    output: GainNode;
    /**
     * Omnitone FOA renderer class. Uses the optimized convolution technique.
     */
    constructor(options: FOARendererOptions);
    /**
     * Builds the internal audio graph.
     */
    private buildAudioGraph;
    private disposed;
    dispose(): void;
    /**
     * Initializes and loads the resource for the renderer.
     */
    initialize(): Promise<void>;
    /**
     * Set the channel map.
     * @param channelMap - Custom channel routing for FOA stream.
     */
    setChannelMap(channelMap: ChannelMap | number[]): void;
    /**
     * Updates the rotation matrix with 3x3 matrix.
     * @param rotationMatrix3 - A 3x3 rotation matrix. (column-major)
     */
    setRotationMatrix3(rotationMatrix3: mat3): void;
    /**
     * Updates the rotation matrix with 4x4 matrix.
     * @param rotationMatrix4 - A 4x4 rotation matrix. (column-major)
     */
    setRotationMatrix4(rotationMatrix4: mat4): void;
    getRenderingMode(): RenderingMode;
    /**
     * Set the rendering mode.
     * @param mode - Rendering mode.
     *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
     *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
     *    decoding or encoding.
     *  - 'off': all the processing off saving the CPU power.
     */
    setRenderingMode(mode: RenderingMode): void;
}
