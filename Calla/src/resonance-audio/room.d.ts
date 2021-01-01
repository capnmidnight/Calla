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
 * @file Complete room model with early and late reflections.
 * @author Andrew Allen <bitllama@google.com>
 */
import { vec3 } from "gl-matrix";
import type { IDisposable } from "kudzu/using";
import { EarlyReflections } from './early-reflections';
import { LateReflections } from './late-reflections';
import type { RoomDimensions } from "./RoomDimensions";
import type { RoomMaterials } from "./RoomMaterials";
export interface RoomOptions {
    /**
     * The listener's initial position (in meters), where origin is the center of
     * the room. Defaults to {@linkcode DEFAULT_POSITION DEFAULT_POSITION}.
     **/
    listenerPosition?: vec3;
    /**
     * Room dimensions (in meters). Defaults to {@linkcode DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
     **/
    dimensions?: RoomDimensions;
    /**
     * Named acoustic materials per wall. Defaults to {@linkcode DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
     **/
    materials?: RoomMaterials;
    /**
     * Speed of sound (in meters/second). Defaults to {@linkcode DEFAULT_SPEED_OF_SOUND DEFAULT_SPEED_OF_SOUND}.
     */
    speedOfSound?: number;
}
/**
 * Model that manages early and late reflections using acoustic
 * properties and listener position relative to a rectangular room.
 **/
export declare class Room implements IDisposable {
    early: EarlyReflections;
    late: LateReflections;
    speedOfSound: number;
    output: GainNode;
    private _merger;
    constructor(context: AudioContext, options?: RoomOptions);
    dispose(): void;
    /**
     * Set the room's dimensions and wall materials.
     * @param dimensions Room dimensions (in meters). Defaults to
     * {@linkcode DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
     * @param materials Named acoustic materials per wall. Defaults to
     * {@linkcode DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
     */
    setProperties(dimensions: RoomDimensions, materials: RoomMaterials): void;
    /**
     * Set the listener's position (in meters), where origin is the center of
     * the room.
     */
    setListenerPosition(v: vec3): void;
    /**
     * Compute distance outside room of provided position (in meters). Returns
     * Distance outside room (in meters). Returns 0 if inside room.
     */
    getDistanceOutsideRoom(v: vec3): number;
}
