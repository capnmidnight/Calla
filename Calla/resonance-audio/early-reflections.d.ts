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
import { vec3 } from "gl-matrix";
import type { IDisposable } from "kudzu/using";
import type { ReflectionCoefficients } from "./ReflectionCoefficients";
import type { RoomDimensions } from "./RoomDimensions";
export interface EarlyReflectionsOptions {
    /**
     * Room dimensions (in meters). Defaults to
     * {@linkcode DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
     **/
    dimensions: RoomDimensions;
    /**
     * (in meters / second). Defaults to {@linkcode DEFAULT_SPEED_OF_SOUND
     * DEFAULT_SPEED_OF_SOUND}.
     **/
    speedOfSound: number;
    /**
     * (in meters). Defaults to
     * {@linkcode DEFAULT_POSITION DEFAULT_POSITION}.
     **/
    listenerPosition: vec3;
    /**
     * Frequency-independent reflection coeffs per wall. Defaults to
     * {@linkcode DEFAULT_REFLECTION_COEFFICIENTS
     * DEFAULT_REFLECTION_COEFFICIENTS}.
     **/
    coefficients: ReflectionCoefficients;
}
/**
* Ray-tracing-based early reflections model.
*/
export declare class EarlyReflections implements IDisposable {
    private listenerPosition;
    speedOfSound: number;
    private coefficients;
    halfDimensions: RoomDimensions;
    private inverters;
    private merger;
    private lowpass;
    private delays;
    private gains;
    input: GainNode;
    output: GainNode;
    /**
     * Ray-tracing-based early reflections model.
     */
    constructor(options?: Partial<EarlyReflectionsOptions>);
    private disposed;
    dispose(): void;
    /**
     * Set the room's properties which determines the characteristics of
     * reflections.
     * @param dimensions
     * Room dimensions (in meters). Defaults to
     * {@linkcode DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
     * @param coefficients
     * Frequency-independent reflection coeffs per wall. Defaults to
     * {@linkcode DEFAULT_REFLECTION_COEFFICIENTS
     * DEFAULT_REFLECTION_COEFFICIENTS}.
     */
    setRoomProperties(dimensions: RoomDimensions, coefficients: ReflectionCoefficients): void;
    /**
     * Set the listener's position (in meters),
     * where [0,0,0] is the center of the room.
     */
    setListenerPosition(v: vec3): void;
}
