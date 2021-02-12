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
 * @file Listener model to spatialize sources in an environment.
 * @author Andrew Allen <bitllama@google.com>
 */
import { vec3 } from "gl-matrix";
import type { IDisposable } from "kudzu/using";
import type { RenderingMode } from "../omnitone/rendering-mode";
export interface ListenerOptions {
    /**
     * Desired ambisonic order. Defaults to
     * {@linkcode DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
     **/
    ambisonicOrder?: number;
    /**
     * Initial position (in meters), where origin is the center of
     * the room. Defaults to
     * {@linkcode DEFAULT_POSITION DEFAULT_POSITION}.
     **/
    position?: vec3;
    /**
     * The listener's initial forward vector. Defaults to
     * {@linkcode DEFAULT_FORWARD DEFAULT_FORWARD}.
     **/
    forward?: vec3;
    /**
     * The listener's initial up vector. Defaults to
     * {@linkcode DEFAULT_UP DEFAULT_UP}.
     */
    up?: vec3;
    renderingMode?: RenderingMode;
}
/**
 * Listener model to spatialize sources in an environment.
 */
export declare class Listener implements IDisposable {
    private tempMatrix3;
    private ambisonicOrder;
    private renderer;
    position: vec3;
    ambisonicOutput: GainNode;
    input: GainNode;
    output: GainNode;
    /**
     * Listener model to spatialize sources in an environment.
     */
    constructor(context: BaseAudioContext, options?: ListenerOptions);
    dispose(): void;
    getRenderingMode(): string;
    setRenderingMode(mode: string): void;
    /**
     * Set the source's orientation using forward and up vectors.
     */
    setOrientation(forward: vec3, up: vec3): void;
}
