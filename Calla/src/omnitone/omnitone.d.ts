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
 * @file Omnitone library name space and user-facing APIs.
 */
import type { BufferListOptions } from './buffer-list';
import { FOAConvolver } from './foa-convolver';
import type { FOARendererOptions } from './foa-renderer';
import { FOARenderer } from './foa-renderer';
import { FOARotator } from './foa-rotator';
import type { ChannelMap } from './foa-router';
import { FOARouter } from './foa-router';
import { HOAConvolver } from './hoa-convolver';
import { HOARenderer, HOARendererOptions } from './hoa-renderer';
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
export declare function createBufferList(context: BaseAudioContext, bufferData: string[], options?: BufferListOptions): Promise<AudioBuffer[]>;
/**
 * Creates an instance of FOA Convolver.
 * @see FOAConvolver
 * @param context The associated AudioContext.
 * @param [hrirBufferList] - An ordered-list of stereo
 */
export declare function createFOAConvolver(context: BaseAudioContext, hrirBufferList?: AudioBuffer[]): FOAConvolver;
/**
 * Create an instance of FOA Router.
 * @see FOARouter
 * @param context - Associated AudioContext.
 * @param channelMap - Routing destination array.
 */
export declare function createFOARouter(context: BaseAudioContext, channelMap: ChannelMap | number[]): FOARouter;
/**
 * Create an instance of FOA Rotator.
 * @see FOARotator
 * @param context - Associated AudioContext.
 */
export declare function createFOARotator(context: BaseAudioContext): FOARotator;
/**
 * Creates HOARotator for higher-order ambisonics rotation.
 * @param context - Associated AudioContext.
 * @param ambisonicOrder - Ambisonic order.
 */
export declare function createHOARotator(context: BaseAudioContext, ambisonicOrder: number): HOARotator;
/**
 * Creates HOAConvolver performs the multi-channel convolution for the optmized
 * binaural rendering.
 * @param context - Associated AudioContext.
 * @param ambisonicOrder - Ambisonic order. (2 or 3)
 * @param [hrirBufferList] - An ordered-list of stereo AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
 */
export declare function createHOAConvolver(context: BaseAudioContext, ambisonicOrder: number, hrirBufferList?: AudioBuffer[]): HOAConvolver;
/**
 * Create a FOARenderer, the first-order ambisonic decoder and the optimized
 * binaural renderer.
 */
export declare function createFOARenderer(context: BaseAudioContext, config?: FOARendererOptions): FOARenderer;
/**
 * Creates HOARenderer for higher-order ambisonic decoding and the optimized
 * binaural rendering.
 */
export declare function createHOARenderer(context: BaseAudioContext, config?: HOARendererOptions): HOARenderer;
