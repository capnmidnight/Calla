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
/**
 * @file Omnitone library common utilities.
 */
/**
 * Omnitone library logging function.
 * @param Message to be printed out.
 */
export declare function log(...rest: any[]): void;
/**
 * A 4x4 matrix inversion utility. This does not handle the case when the
 * arguments are not proper 4x4 matrices.
 * @param out   The inverted result.
 * @param a     The source matrix.
 */
export declare function invertMatrix4(out: Float32Array, a: Float32Array): Float32Array;
/**
 * Perform channel-wise merge on multiple AudioBuffers. The sample rate and
 * the length of buffers to be merged must be identical.
 * @param context - Associated BaseAudioContext.
 * @param bufferList - An array of AudioBuffers to be merged
 * channel-wise.
 * @return A single merged AudioBuffer.
 */
export declare function mergeBufferListByChannel(context: BaseAudioContext, bufferList: AudioBuffer[]): AudioBuffer;
/**
 * Perform channel-wise split by the given channel count. For example,
 * 1 x AudioBuffer(8) -> splitBuffer(context, buffer, 2) -> 4 x AudioBuffer(2).
 * @param context - Associated BaseAudioContext.
 * @param audioBuffer - An AudioBuffer to be splitted.
 * @param splitBy - Number of channels to be splitted.
 * @return An array of splitted AudioBuffers.
 */
export declare function splitBufferByChannel(context: BaseAudioContext, audioBuffer: AudioBuffer, splitBy: number): AudioBuffer[];
/**
 * Converts Base64-encoded string to ArrayBuffer.
 * @param base64String - Base64-encdoed string.
 * @return Converted ArrayBuffer object.
 */
export declare function getArrayBufferFromBase64String(base64String: string): ArrayBuffer;
