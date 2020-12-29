/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
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
import { ReadonlyMat3, ReadonlyMat4 } from "gl-matrix";
import type { IDisposable } from "kudzu";
/**
 * @file Sound field rotator for first-order-ambisonics decoding.
 */
/**
 * First-order-ambisonic decoder based on gain node network.
 */
export declare class FOARotator implements IDisposable {
    private _context;
    private _splitter;
    private _inX;
    private _inY;
    private _inZ;
    private _m0;
    private _m1;
    private _m2;
    private _m3;
    private _m4;
    private _m5;
    private _m6;
    private _m7;
    private _m8;
    private _outX;
    private _outY;
    private _outZ;
    private _merger;
    input: ChannelSplitterNode;
    output: ChannelMergerNode;
    /**
     * First-order-ambisonic decoder based on gain node network.
     * @param context - Associated AudioContext.
     */
    constructor(context: BaseAudioContext);
    dispose(): void;
    /**
     * Updates the rotation matrix with 3x3 matrix.
     * @param rotationMatrix3 - A 3x3 rotation matrix. (column-major)
     */
    setRotationMatrix3(rotationMatrix3: ReadonlyMat3): void;
    /**
     * Updates the rotation matrix with 4x4 matrix.
     * @param rotationMatrix4 - A 4x4 rotation matrix. (column-major)
     */
    setRotationMatrix4(rotationMatrix4: ReadonlyMat4): void;
    /**
     * Returns the current 3x3 rotation matrix.
     * @return A 3x3 rotation matrix. (column-major)
     */
    getRotationMatrix3(): ReadonlyMat3;
    /**
     * Returns the current 4x4 rotation matrix.
     * @return A 4x4 rotation matrix. (column-major)
     */
    getRotationMatrix4(): ReadonlyMat4;
}
