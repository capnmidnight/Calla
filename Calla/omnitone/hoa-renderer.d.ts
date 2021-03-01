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
import type { IDisposable } from "kudzu/using";
import { HOARotator } from './hoa-rotator';
import { RenderingMode } from "./rendering-mode";
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
export declare class HOARenderer implements IDisposable {
    private context;
    private config;
    input: GainNode;
    output: GainNode;
    private bypass;
    rotator: HOARotator;
    private convolver;
    /**
     * Omnitone HOA renderer class. Uses the optimized convolution technique.
     */
    constructor(context: BaseAudioContext, options: HOARendererOptions);
    /**
     * Builds the internal audio graph.
     */
    private _buildAudioGraph;
    private disposed;
    dispose(): void;
    /**
     * Initializes and loads the resource for the renderer.
     */
    initialize(): Promise<void>;
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
     * Set the decoding mode.
     * @param mode - Decoding mode.
     *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
     *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
     *    decoding or encoding.
     *  - 'off': all the processing off saving the CPU power.
     */
    setRenderingMode(mode: RenderingMode): void;
}
