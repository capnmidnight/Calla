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
/**
 * @file Sound field rotator for first-order-ambisonics decoding.
 */
/**
 * First-order-ambisonic decoder based on gain node network.
 */
export class FOARotator {
    /**
     * First-order-ambisonic decoder based on gain node network.
     * @param context - Associated AudioContext.
     */
    constructor(context) {
        this._context = context;
        this._splitter = this._context.createChannelSplitter(4);
        this._inX = this._context.createGain();
        this._inY = this._context.createGain();
        this._inZ = this._context.createGain();
        this._m0 = this._context.createGain();
        this._m1 = this._context.createGain();
        this._m2 = this._context.createGain();
        this._m3 = this._context.createGain();
        this._m4 = this._context.createGain();
        this._m5 = this._context.createGain();
        this._m6 = this._context.createGain();
        this._m7 = this._context.createGain();
        this._m8 = this._context.createGain();
        this._outX = this._context.createGain();
        this._outY = this._context.createGain();
        this._outZ = this._context.createGain();
        this._merger = this._context.createChannelMerger(4);
        // ACN channel ordering: [1, 2, 3] => [X, Y, Z]
        // X (from channel 1)
        this._splitter.connect(this._inX, 1);
        // Y (from channel 2)
        this._splitter.connect(this._inY, 2);
        // Z (from channel 3)
        this._splitter.connect(this._inZ, 3);
        this._inX.gain.value = -1;
        this._inY.gain.value = -1;
        this._inZ.gain.value = -1;
        // Apply the rotation in the world space.
        // |X|   | m0  m3  m6 |   | X * m0 + Y * m3 + Z * m6 |   | Xr |
        // |Y| * | m1  m4  m7 | = | X * m1 + Y * m4 + Z * m7 | = | Yr |
        // |Z|   | m2  m5  m8 |   | X * m2 + Y * m5 + Z * m8 |   | Zr |
        this._inX.connect(this._m0);
        this._inX.connect(this._m1);
        this._inX.connect(this._m2);
        this._inY.connect(this._m3);
        this._inY.connect(this._m4);
        this._inY.connect(this._m5);
        this._inZ.connect(this._m6);
        this._inZ.connect(this._m7);
        this._inZ.connect(this._m8);
        this._m0.connect(this._outX);
        this._m1.connect(this._outY);
        this._m2.connect(this._outZ);
        this._m3.connect(this._outX);
        this._m4.connect(this._outY);
        this._m5.connect(this._outZ);
        this._m6.connect(this._outX);
        this._m7.connect(this._outY);
        this._m8.connect(this._outZ);
        // Transform 3: world space to audio space.
        // W -> W (to channel 0)
        this._splitter.connect(this._merger, 0, 0);
        // X (to channel 1)
        this._outX.connect(this._merger, 0, 1);
        // Y (to channel 2)
        this._outY.connect(this._merger, 0, 2);
        // Z (to channel 3)
        this._outZ.connect(this._merger, 0, 3);
        this._outX.gain.value = -1;
        this._outY.gain.value = -1;
        this._outZ.gain.value = -1;
        this.setRotationMatrix3(mat3.identity(mat3.create()));
        // input/output proxy.
        this.input = this._splitter;
        this.output = this._merger;
    }
    dispose() {
        // ACN channel ordering: [1, 2, 3] => [X, Y, Z]
        // X (from channel 1)
        this._splitter.disconnect(this._inX, 1);
        // Y (from channel 2)
        this._splitter.disconnect(this._inY, 2);
        // Z (from channel 3)
        this._splitter.disconnect(this._inZ, 3);
        // Apply the rotation in the world space.
        // |X|   | m0  m3  m6 |   | X * m0 + Y * m3 + Z * m6 |   | Xr |
        // |Y| * | m1  m4  m7 | = | X * m1 + Y * m4 + Z * m7 | = | Yr |
        // |Z|   | m2  m5  m8 |   | X * m2 + Y * m5 + Z * m8 |   | Zr |
        this._inX.disconnect(this._m0);
        this._inX.disconnect(this._m1);
        this._inX.disconnect(this._m2);
        this._inY.disconnect(this._m3);
        this._inY.disconnect(this._m4);
        this._inY.disconnect(this._m5);
        this._inZ.disconnect(this._m6);
        this._inZ.disconnect(this._m7);
        this._inZ.disconnect(this._m8);
        this._m0.disconnect(this._outX);
        this._m1.disconnect(this._outY);
        this._m2.disconnect(this._outZ);
        this._m3.disconnect(this._outX);
        this._m4.disconnect(this._outY);
        this._m5.disconnect(this._outZ);
        this._m6.disconnect(this._outX);
        this._m7.disconnect(this._outY);
        this._m8.disconnect(this._outZ);
        // Transform 3: world space to audio space.
        // W -> W (to channel 0)
        this._splitter.disconnect(this._merger, 0, 0);
        // X (to channel 1)
        this._outX.disconnect(this._merger, 0, 1);
        // Y (to channel 2)
        this._outY.disconnect(this._merger, 0, 2);
        // Z (to channel 3)
        this._outZ.disconnect(this._merger, 0, 3);
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