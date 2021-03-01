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
import { arrayRemoveAt } from "kudzu/arrays/arrayRemoveAt";
import type { IDisposable } from "kudzu/using";
import { connect, disconnect } from "../audio/GraphVisualizer";
import type { RenderingMode } from "../omnitone/rendering-mode";
import { Encoder } from './encoder';
import { Listener } from './listener';
import { Room } from './room';
import type { RoomDimensions } from "./RoomDimensions";
import type { RoomMaterials } from "./RoomMaterials";
import type { SourceOptions } from './source';
import { Source } from './source';
import {
    DEFAULT_AMBISONIC_ORDER,
    DEFAULT_FORWARD,
    DEFAULT_POSITION,
    DEFAULT_RENDERING_MODE,
    DEFAULT_ROOM_DIMENSIONS,
    DEFAULT_ROOM_MATERIALS,
    DEFAULT_SPEED_OF_SOUND,
    DEFAULT_UP
} from "./utils";

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
export class ResonanceAudio implements IDisposable {
    private _sources: Source[];
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
    constructor(context: BaseAudioContext, options?: ResonanceAudioOptions) {
        // Use defaults for undefined arguments.
        options = Object.assign({
            ambisonicOrder: DEFAULT_AMBISONIC_ORDER,
            listenerPosition: vec3.copy(vec3.create(), DEFAULT_POSITION),
            listenerForward: vec3.copy(vec3.create(), DEFAULT_FORWARD),
            listenerUp: vec3.copy(vec3.create(), DEFAULT_UP),
            dimensions: Object.assign({}, options.dimensions, DEFAULT_ROOM_DIMENSIONS),
            materials: Object.assign({}, options.materials, DEFAULT_ROOM_MATERIALS),
            speedOfSound: DEFAULT_SPEED_OF_SOUND,
            renderingMode: DEFAULT_RENDERING_MODE
        }, options);

        // Create member submodules.
        this.ambisonicOrder = Encoder.validateAmbisonicOrder(options.ambisonicOrder);

        this._sources = new Array<Source>();
        this.room = new Room(context, {
            listenerPosition: options.listenerPosition,
            dimensions: options.dimensions,
            materials: options.materials,
            speedOfSound: options.speedOfSound,
        });
        this.listener = new Listener(context, {
            ambisonicOrder: options.ambisonicOrder,
            position: options.listenerPosition,
            forward: options.listenerForward,
            up: options.listenerUp,
            renderingMode: options.renderingMode
        });

        // Create auxillary audio nodes.
        this.context = context;
        this.output = context.createGain();
        this.ambisonicOutput = context.createGain();
        this.ambisonicInput = this.listener.input;

        // Connect audio graph.
        connect(this.room.output, this.listener.input);
        connect(this.listener.output, this.output);
        connect(this.listener.ambisonicOutput, this.ambisonicOutput);
    }

    getRenderingMode() {
        return this.listener.getRenderingMode();
    }

    setRenderingMode(mode: string): void {
        this.listener.setRenderingMode(mode);
    }

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            disconnect(this.room.output, this.listener.input);
            disconnect(this.listener.output, this.output);
            disconnect(this.listener.ambisonicOutput, this.ambisonicOutput);
            this.disposed = true;
        }
    }


    /**
     * Create a new source for the scene.
     * @param options
     * Options for constructing a new Source.
     * @return {Source}
     */
    createSource(options: SourceOptions) {
        // Create a source and push it to the internal sources array, returning
        // the object's reference to the user.
        let source = new Source(this, options);
        this._sources[this._sources.length] = source;
        return source;
    }

    /**
     * Remove an existing source for the scene.
     * @param source
     */
    removeSource(source: Source) {
        const sourceIdx = this._sources.findIndex((s) => s === source);
        if (sourceIdx > -1) {
            arrayRemoveAt(this._sources, sourceIdx);
            source.dispose();
        }
    }


    /**
     * Set the scene's desired ambisonic order.
     * @param ambisonicOrder Desired ambisonic order.
     */
    setAmbisonicOrder(ambisonicOrder: number) {
        this.ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);
    }


    /**
     * Set the room's dimensions and wall materials.
     * @param dimensions Room dimensions (in meters).
     * @param materials Named acoustic materials per wall.
     */
    setRoomProperties(dimensions: RoomDimensions, materials: RoomMaterials) {
        this.room.setProperties(dimensions, materials);
    }


    /**
     * Set the listener's position (in meters), where origin is the center of
     * the room.
     */
    setListenerPosition(v: vec3) {
        // Update listener position.
        vec3.copy(this.listener.position, v);
        this.room.setListenerPosition(v);

        // Update sources with new listener position.
        this._sources.forEach(function (element) {
            element.update();
        });
    }


    /**
     * Set the source's orientation using forward and up vectors.
     */
    setListenerOrientation(forward: vec3, up: vec3) {
        this.listener.setOrientation(forward, up);
    }

    /**
     * Set the speed of sound.
     */
    setSpeedOfSound(speedOfSound: number) {
        this.room.speedOfSound = speedOfSound;
    }
}