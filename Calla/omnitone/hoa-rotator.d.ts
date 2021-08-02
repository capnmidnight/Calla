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
import { ErsatzAudioNode } from "kudzu/audio";
import type { IDisposable } from "kudzu/using";
/**
 * Higher-order-ambisonic decoder based on gain node network. We expect
 * the order of the channels to conform to ACN ordering. Below are the helper
 * methods to compute SH rotation using recursion. The code uses maths described
 * in the following papers:
 *  [1] R. Green, "Spherical Harmonic Lighting: The Gritty Details", GDC 2003,
 *      http://www.research.scea.com/gdc2003/spherical-harmonic-lighting.pdf
 *  [2] J. Ivanic and K. Ruedenberg, "Rotation Matrices for Real
 *      Spherical Harmonics. Direct Determination by Recursion", J. Phys.
 *      Chem., vol. 100, no. 15, pp. 6342-6347, 1996.
 *      http://pubs.acs.org/doi/pdf/10.1021/jp953350u
 *  [2b] Corrections to initial publication:
 *       http://pubs.acs.org/doi/pdf/10.1021/jp9833350
 */
export declare class HOARotator implements IDisposable, ErsatzAudioNode {
    private _ambisonicOrder;
    private _splitter;
    private _merger;
    private _gainNodeMatrix;
    /**
     * Higher-order-ambisonic decoder based on gain node network. We expect
     * the order of the channels to conform to ACN ordering. Below are the helper
     * methods to compute SH rotation using recursion. The code uses maths described
     * in the following papers:
     *  [1] R. Green, "Spherical Harmonic Lighting: The Gritty Details", GDC 2003,
     *      http://www.research.scea.com/gdc2003/spherical-harmonic-lighting.pdf
     *  [2] J. Ivanic and K. Ruedenberg, "Rotation Matrices for Real
     *      Spherical Harmonics. Direct Determination by Recursion", J. Phys.
     *      Chem., vol. 100, no. 15, pp. 6342-6347, 1996.
     *      http://pubs.acs.org/doi/pdf/10.1021/jp953350u
     *  [2b] Corrections to initial publication:
     *       http://pubs.acs.org/doi/pdf/10.1021/jp9833350
     * @param ambisonicOrder - Ambisonic order.
     */
    constructor(ambisonicOrder: number);
    get input(): ChannelSplitterNode;
    get output(): ChannelMergerNode;
    private disposed;
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
    /**
     * Get the current ambisonic order.
     */
    getAmbisonicOrder(): number;
}
