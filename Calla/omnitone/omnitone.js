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
import { BufferDataType, BufferList } from './buffer-list';
import { FOAConvolver } from './foa-convolver';
import { FOARenderer } from './foa-renderer';
import { FOARotator } from './foa-rotator';
import { FOARouter } from './foa-router';
import { HOAConvolver } from './hoa-convolver';
import { HOARenderer } from './hoa-renderer';
import { HOARotator } from './hoa-rotator';
/**
 * Performs the async loading/decoding of multiple AudioBuffers from multiple
 * URLs.
 * @param context - Associated BaseAudioContext.
 * @param  bufferData - An ordered list of URLs.
 * @param  [options] - BufferList options.
 * @param [options.dataType='url'] - BufferList data type.
 * @return - The promise resolves with an array of
 * AudioBuffer.
 */
export function createBufferList(context, bufferData, options) {
    const bufferList = new BufferList(context, bufferData, options || { dataType: BufferDataType.URL });
    return bufferList.load();
}
/**
 * Creates an instance of FOA Convolver.
 * @see FOAConvolver
 * @param context The associated BaseAudioContext.
 * @param [hrirBufferList] - An ordered-list of stereo
 */
export function createFOAConvolver(context, hrirBufferList) {
    return new FOAConvolver(context, hrirBufferList);
}
/**
 * Create an instance of FOA Router.
 * @see FOARouter
 * @param context - Associated BaseAudioContext.
 * @param channelMap - Routing destination array.
 */
export function createFOARouter(context, channelMap) {
    return new FOARouter(context, channelMap);
}
/**
 * Create an instance of FOA Rotator.
 * @see FOARotator
 * @param context - Associated BaseAudioContext.
 */
export function createFOARotator(context) {
    return new FOARotator(context);
}
/**
 * Creates HOARotator for higher-order ambisonics rotation.
 * @param context - Associated BaseAudioContext.
 * @param ambisonicOrder - Ambisonic order.
 */
export function createHOARotator(context, ambisonicOrder) {
    return new HOARotator(context, ambisonicOrder);
}
/**
 * Creates HOAConvolver performs the multi-channel convolution for the optmized
 * binaural rendering.
 * @param context - Associated BaseAudioContext.
 * @param ambisonicOrder - Ambisonic order. (2 or 3)
 * @param [hrirBufferList] - An ordered-list of stereo AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
 */
export function createHOAConvolver(context, ambisonicOrder, hrirBufferList) {
    return new HOAConvolver(context, ambisonicOrder, hrirBufferList);
}
/**
 * Create a FOARenderer, the first-order ambisonic decoder and the optimized
 * binaural renderer.
 */
export function createFOARenderer(context, config) {
    return new FOARenderer(context, config);
}
/**
 * Creates HOARenderer for higher-order ambisonic decoding and the optimized
 * binaural rendering.
 */
export function createHOARenderer(context, config) {
    return new HOARenderer(context, config);
}
//# sourceMappingURL=omnitone.js.map