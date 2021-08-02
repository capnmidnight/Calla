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
import { mat3, mat4 } from "gl-matrix";
import { ChannelMerger, ChannelSplitter, disconnect, gain, Gain } from "kudzu/audio";
/**
 * @file Sound field rotator for first-order-ambisonics decoding.
 */
/**
 * First-order-ambisonic decoder based on gain node network.
 */
export class FOARotator {
    _splitter;
    _inX;
    _inY;
    _inZ;
    _m0;
    _m1;
    _m2;
    _m3;
    _m4;
    _m5;
    _m6;
    _m7;
    _m8;
    _outX;
    _outY;
    _outZ;
    _merger;
    /**
     * First-order-ambisonic decoder based on gain node network.
     */
    constructor() {
        this._merger = ChannelMerger("foa-rotator-merger", 4);
        this._splitter = ChannelSplitter("foa-rotator-splitter", 4, [1, this._inX], [2, this._inY], [3, this._inZ], [0, 0, this._merger]);
        this._outX = Gain("foa-rotator-outX", [0, 1, this._merger]);
        this._outY = Gain("foa-rotator-outY", [0, 2, this._merger]);
        this._outZ = Gain("foa-rotator-outZ", [0, 3, this._merger]);
        this._m0 = Gain("foa-rotator-m0", this._outX);
        this._m1 = Gain("foa-rotator-m1", this._outY);
        this._m2 = Gain("foa-rotator-m2", this._outZ);
        this._m3 = Gain("foa-rotator-m3", this._outX);
        this._m4 = Gain("foa-rotator-m4", this._outY);
        this._m5 = Gain("foa-rotator-m5", this._outZ);
        this._m6 = Gain("foa-rotator-m6", this._outX);
        this._m7 = Gain("foa-rotator-m7", this._outY);
        this._m8 = Gain("foa-rotator-m8", this._outZ);
        // Apply the rotation in the world space.
        // |X|   | m0  m3  m6 |   | X * m0 + Y * m3 + Z * m6 |   | Xr |
        // |Y| * | m1  m4  m7 | = | X * m1 + Y * m4 + Z * m7 | = | Yr |
        // |Z|   | m2  m5  m8 |   | X * m2 + Y * m5 + Z * m8 |   | Zr |
        this._inX = Gain("foa-rotator-inX", gain(-1), this._m0, this._m1, this._m2);
        this._inY = Gain("foa-rotator-inY", gain(-1), this._m3, this._m4, this._m5);
        this._inZ = Gain("foa-rotator-inZ", gain(-1), this._m6, this._m7, this._m8);
        this.setRotationMatrix3(mat3.identity(mat3.create()));
    }
    get input() {
        return this._splitter;
    }
    get output() {
        return this._merger;
    }
    disposed = false;
    dispose() {
        if (!this.disposed) {
            disconnect(this._splitter);
            disconnect(this._inX);
            disconnect(this._inY);
            disconnect(this._inZ);
            disconnect(this._m0);
            disconnect(this._m1);
            disconnect(this._m2);
            disconnect(this._m3);
            disconnect(this._m4);
            disconnect(this._m5);
            disconnect(this._m6);
            disconnect(this._m7);
            disconnect(this._m8);
            disconnect(this._outX);
            disconnect(this._outY);
            disconnect(this._outZ);
            this.disposed = true;
        }
    }
    /**
     * Updates the rotation matrix with 3x3 matrix.
     * @param rotationMatrix3 - A 3x3 rotation matrix. (column-major)
     */
    setRotationMatrix3(rotationMatrix3) {
        this._m0.gain.value = rotationMatrix3[0];
        this._m1.gain.value = rotationMatrix3[1];
        this._m2.gain.value = rotationMatrix3[2];
        this._m3.gain.value = rotationMatrix3[3];
        this._m4.gain.value = rotationMatrix3[4];
        this._m5.gain.value = rotationMatrix3[5];
        this._m6.gain.value = rotationMatrix3[6];
        this._m7.gain.value = rotationMatrix3[7];
        this._m8.gain.value = rotationMatrix3[8];
    }
    /**
     * Updates the rotation matrix with 4x4 matrix.
     * @param rotationMatrix4 - A 4x4 rotation matrix. (column-major)
     */
    setRotationMatrix4(rotationMatrix4) {
        this._m0.gain.value = rotationMatrix4[0];
        this._m1.gain.value = rotationMatrix4[1];
        this._m2.gain.value = rotationMatrix4[2];
        this._m3.gain.value = rotationMatrix4[4];
        this._m4.gain.value = rotationMatrix4[5];
        this._m5.gain.value = rotationMatrix4[6];
        this._m6.gain.value = rotationMatrix4[8];
        this._m7.gain.value = rotationMatrix4[9];
        this._m8.gain.value = rotationMatrix4[10];
    }
    /**
     * Returns the current 3x3 rotation matrix.
     * @return A 3x3 rotation matrix. (column-major)
     */
    getRotationMatrix3() {
        mat3.set(rotationMatrix3, this._m0.gain.value, this._m1.gain.value, this._m2.gain.value, this._m3.gain.value, this._m4.gain.value, this._m5.gain.value, this._m6.gain.value, this._m7.gain.value, this._m8.gain.value);
        return rotationMatrix3;
    }
    /**
     * Returns the current 4x4 rotation matrix.
     * @return A 4x4 rotation matrix. (column-major)
     */
    getRotationMatrix4() {
        mat4.set(rotationMatrix4, this._m0.gain.value, this._m1.gain.value, this._m2.gain.value, 0, this._m3.gain.value, this._m4.gain.value, this._m5.gain.value, 0, this._m6.gain.value, this._m7.gain.value, this._m8.gain.value, 0, 0, 0, 0, 1);
        return rotationMatrix4;
    }
}
const rotationMatrix3 = mat3.create();
const rotationMatrix4 = mat4.create();
//# sourceMappingURL=foa-rotator.js.map