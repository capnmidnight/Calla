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
 * @file ResonanceAudio library name space and common utilities.
 * @author Andrew Allen <bitllama@google.com>
 */
import { vec3 } from "gl-matrix";
import type { IDisposable } from "kudzu/using";
import type { RenderingMode } from "../omnitone/rendering-mode";
import { Listener } from './listener';
import { Room } from './room';
import type { RoomDimensions } from "./RoomDimensions";
import type { RoomMaterials } from "./RoomMaterials";
import type { SourceOptions } from './source';
import { Source } from './source';
/**
 * Options for constructing a new ResonanceAudio scene.
 **/
interface ResonanceAudioOptions {
    /**
     * @property {Number} ambisonicOrder
     * Desired ambisonic Order. Defaults to
     * {@linkcode DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
     **/
    ambisonicOrder?: number;
    renderingMode?: RenderingMode;
    /**
     * @property {Float32Array} listenerPosition
     * The listener's initial position (in meters), where origin is the center of
     * the room. Defaults to {@linkcode DEFAULT_POSITION DEFAULT_POSITION}.
     **/
    listenerPosition?: vec3;
    /**
     * @property {Float32Array} listenerForward
     * The listener's initial forward vector.
     * Defaults to {@linkcode DEFAULT_FORWARD DEFAULT_FORWARD}.
     **/
    listenerForward?: vec3;
    /**
     * @property {Float32Array} listenerUp
     * The listener's initial up vector.
     * Defaults to {@linkcode DEFAULT_UP DEFAULT_UP}.
     **/
    listenerUp?: vec3;
    /**
     * @property {Utils~RoomDimensions} dimensions Room dimensions (in meters). Defaults to
     * {@linkcode DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
     **/
    dimensions?: RoomDimensions;
    /**
     * @property {Utils~RoomMaterials} materials Named acoustic materials per wall.
     * Defaults to {@linkcode DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
     **/
    materials?: RoomMaterials;
    /**
     * @property {Number} speedOfSound
     * (in meters/second). Defaults to
     * {@linkcode DEFAULT_SPEED_OF_SOUND DEFAULT_SPEED_OF_SOUND}.
     */
    speedOfSound?: number;
}
/**
 * Main class for managing sources, room and listener models.
 */
export declare class ResonanceAudio implements IDisposable {
    private _sources;
    listener: Listener;
    room: Room;
    ambisonicOrder: number;
    context: BaseAudioContext;
    output: GainNode;
    ambisonicOutput: GainNode;
    ambisonicInput: GainNode;
    /**
     * Main class for managing sources, room and listener models.
     * @param context
     * Associated {@link
    https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
     * @param options
     * Options for constructing a new ResonanceAudio scene.
     */
    constructor(context: BaseAudioContext, options?: ResonanceAudioOptions);
    getRenderingMode(): string;
    setRenderingMode(mode: string): void;
    private disposed;
    dispose(): void;
    /**
     * Create a new source for the scene.
     * @param options
     * Options for constructing a new Source.
     * @return {Source}
     */
    createSource(options: SourceOptions): Source;
    /**
     * Remove an existing source for the scene.
     * @param source
     */
    removeSource(source: Source): void;
    /**
     * Set the scene's desired ambisonic order.
     * @param ambisonicOrder Desired ambisonic order.
     */
    setAmbisonicOrder(ambisonicOrder: number): void;
    /**
     * Set the room's dimensions and wall materials.
     * @param dimensions Room dimensions (in meters).
     * @param materials Named acoustic materials per wall.
     */
    setRoomProperties(dimensions: RoomDimensions, materials: RoomMaterials): void;
    /**
     * Set the listener's position (in meters), where origin is the center of
     * the room.
     */
    setListenerPosition(v: vec3): void;
    /**
     * Set the source's orientation using forward and up vectors.
     */
    setListenerOrientation(forward: vec3, up: vec3): void;
    /**
     * Set the speed of sound.
     */
    setSpeedOfSound(speedOfSound: number): void;
}
export {};
