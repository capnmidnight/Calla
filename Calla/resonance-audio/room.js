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
// Internal dependencies.
import { vec3 } from "gl-matrix";
import { connect, disconnect, nameVertex } from "../audio/GraphVisualizer";
import { Dimension } from "./Dimension";
import { Direction } from "./Direction";
import { EarlyReflections } from './early-reflections';
import { LateReflections } from './late-reflections';
import { DEFAULT_POSITION, DEFAULT_REFLECTION_COEFFICIENTS, DEFAULT_ROOM_DIMENSIONS, DEFAULT_ROOM_MATERIALS, DEFAULT_SPEED_OF_SOUND, EPSILON_FLOAT, LISTENER_MAX_OUTSIDE_ROOM_DISTANCE, log, NUMBER_REFLECTION_AVERAGING_BANDS, NUMBER_REVERB_FREQUENCY_BANDS, ROOM_AIR_ABSORPTION_COEFFICIENTS, ROOM_EYRING_CORRECTION_COEFFICIENT, ROOM_MATERIAL_COEFFICIENTS, ROOM_MIN_VOLUME, ROOM_STARTING_AVERAGING_BAND, TWENTY_FOUR_LOG10 } from "./utils";
/**
 * Generate absorption coefficients from material names.
 */
function _getCoefficientsFromMaterials(materials) {
    // Initialize coefficients to use defaults.
    const coefficients = {
        [Direction.Left]: null,
        [Direction.Right]: null,
        [Direction.Front]: null,
        [Direction.Back]: null,
        [Direction.Up]: null,
        [Direction.Down]: null
    };
    for (const property of Object.values(Direction)) {
        const material = DEFAULT_ROOM_MATERIALS[property];
        coefficients[property] = ROOM_MATERIAL_COEFFICIENTS[material];
    }
    // Sanitize materials.
    if (materials == undefined) {
        materials = Object.assign({}, materials, DEFAULT_ROOM_MATERIALS);
    }
    // Assign coefficients using provided materials.
    for (const property of Object.values(Direction)) {
        if (materials[property] in ROOM_MATERIAL_COEFFICIENTS) {
            coefficients[property] =
                ROOM_MATERIAL_COEFFICIENTS[materials[property]];
        }
        else {
            log('Material \"' + materials[property] + '\" on wall \"' +
                property + '\" not found. Using \"' +
                DEFAULT_ROOM_MATERIALS[property] + '\".');
        }
    }
    return coefficients;
}
/**
 * Sanitize coefficients.
 * @param coefficients
 * @return {Object}
 */
function _sanitizeCoefficients(coefficients) {
    if (coefficients == undefined) {
        coefficients = {
            [Direction.Left]: null,
            [Direction.Right]: null,
            [Direction.Front]: null,
            [Direction.Back]: null,
            [Direction.Up]: null,
            [Direction.Down]: null
        };
    }
    for (const property of Object.values(Direction)) {
        if (!(coefficients.hasOwnProperty(property))) {
            // If element is not present, use default coefficients.
            coefficients[property] = ROOM_MATERIAL_COEFFICIENTS[DEFAULT_ROOM_MATERIALS[property]];
        }
    }
    return coefficients;
}
/**
 * Sanitize dimensions.
 * @param dimensions
 * @return {RoomDimensions}
 */
function _sanitizeDimensions(dimensions) {
    if (dimensions == undefined) {
        dimensions = {
            width: DEFAULT_ROOM_DIMENSIONS.width,
            height: DEFAULT_ROOM_DIMENSIONS.height,
            depth: DEFAULT_ROOM_DIMENSIONS.depth
        };
    }
    else {
        for (const dimension of Object.values(Dimension)) {
            if (!dimensions.hasOwnProperty(dimension)) {
                dimensions[dimension] = DEFAULT_ROOM_DIMENSIONS[dimension];
                ;
            }
        }
    }
    return dimensions;
}
/**
 * Compute frequency-dependent reverb durations.
 */
function _getDurationsFromProperties(dimensions, coefficients, speedOfSound) {
    const durations = new Float32Array(NUMBER_REVERB_FREQUENCY_BANDS);
    // Sanitize inputs.
    dimensions = _sanitizeDimensions(dimensions);
    coefficients = _sanitizeCoefficients(coefficients);
    if (speedOfSound == undefined) {
        speedOfSound = DEFAULT_SPEED_OF_SOUND;
    }
    // Acoustic constant.
    const k = TWENTY_FOUR_LOG10 / speedOfSound;
    // Compute volume, skip if room is not present.
    const volume = dimensions.width * dimensions.height * dimensions.depth;
    if (volume < ROOM_MIN_VOLUME) {
        return durations;
    }
    // Room surface area.
    const leftRightArea = dimensions.width * dimensions.height;
    const floorCeilingArea = dimensions.width * dimensions.depth;
    const frontBackArea = dimensions.depth * dimensions.height;
    const totalArea = 2 * (leftRightArea + floorCeilingArea + frontBackArea);
    for (let i = 0; i < NUMBER_REVERB_FREQUENCY_BANDS; i++) {
        // Effective absorptive area.
        const absorbtionArea = (coefficients.left[i] + coefficients.right[i]) * leftRightArea +
            (coefficients.down[i] + coefficients.up[i]) * floorCeilingArea +
            (coefficients.front[i] + coefficients.back[i]) * frontBackArea;
        const meanAbsorbtionArea = absorbtionArea / totalArea;
        // Compute reverberation using Eyring equation [1].
        // [1] Beranek, Leo L. "Analysis of Sabine and Eyring equations and their
        //     application to concert hall audience and chair absorption." The
        //     Journal of the Acoustical Society of America, Vol. 120, No. 3.
        //     (2006), pp. 1399-1399.
        durations[i] = ROOM_EYRING_CORRECTION_COEFFICIENT * k * volume /
            (-totalArea * Math.log(1 - meanAbsorbtionArea) + 4 *
                ROOM_AIR_ABSORPTION_COEFFICIENTS[i] * volume);
    }
    return durations;
}
/**
 * Compute reflection coefficients from absorption coefficients.
 * @param absorptionCoefficients
 * @return {Object}
 */
function _computeReflectionCoefficients(absorptionCoefficients) {
    const reflectionCoefficients = {
        [Direction.Left]: 0,
        [Direction.Right]: 0,
        [Direction.Front]: 0,
        [Direction.Back]: 0,
        [Direction.Up]: 0,
        [Direction.Down]: 0
    };
    for (const property of Object.values(Direction)) {
        if (DEFAULT_REFLECTION_COEFFICIENTS
            .hasOwnProperty(property)) {
            // Compute average absorption coefficient (per wall).
            reflectionCoefficients[property] = 0;
            for (let j = 0; j < NUMBER_REFLECTION_AVERAGING_BANDS; j++) {
                const bandIndex = j + ROOM_STARTING_AVERAGING_BAND;
                reflectionCoefficients[property] +=
                    absorptionCoefficients[property][bandIndex];
            }
            reflectionCoefficients[property] /=
                NUMBER_REFLECTION_AVERAGING_BANDS;
            // Convert absorption coefficient to reflection coefficient.
            reflectionCoefficients[property] =
                Math.sqrt(1 - reflectionCoefficients[property]);
        }
    }
    return reflectionCoefficients;
}
/**
 * Model that manages early and late reflections using acoustic
 * properties and listener position relative to a rectangular room.
 **/
export class Room {
    early;
    late;
    speedOfSound;
    output;
    _merger;
    constructor(context, options) {
        // Use defaults for undefined arguments.
        options = Object.assign({
            listenerPosition: vec3.copy(vec3.create(), DEFAULT_POSITION),
            dimensions: Object.assign({}, options.dimensions, DEFAULT_ROOM_DIMENSIONS),
            materials: Object.assign({}, options.materials, DEFAULT_ROOM_MATERIALS),
            speedOfSound: DEFAULT_SPEED_OF_SOUND
        }, options);
        // Sanitize room-properties-related arguments.
        options.dimensions = _sanitizeDimensions(options.dimensions);
        const absorptionCoefficients = _getCoefficientsFromMaterials(options.materials);
        const reflectionCoefficients = _computeReflectionCoefficients(absorptionCoefficients);
        const durations = _getDurationsFromProperties(options.dimensions, absorptionCoefficients, options.speedOfSound);
        // Construct submodules for early and late reflections.
        this.early = new EarlyReflections(context, {
            dimensions: options.dimensions,
            coefficients: reflectionCoefficients,
            speedOfSound: options.speedOfSound,
            listenerPosition: options.listenerPosition,
        });
        this.late = new LateReflections(context, {
            durations: durations,
        });
        this.speedOfSound = options.speedOfSound;
        // Construct auxillary audio nodes.
        this.output = nameVertex("room-output", context.createGain());
        connect(this.early.output, this.output);
        this._merger = nameVertex("room-merger", context.createChannelMerger(4));
        connect(this.late.output, this._merger, 0, 0);
        connect(this._merger, this.output);
    }
    dispose() {
        disconnect(this.early.output, this.output);
        disconnect(this.late.output, this._merger, 0, 0);
        disconnect(this._merger, this.output);
    }
    /**
     * Set the room's dimensions and wall materials.
     * @param dimensions Room dimensions (in meters). Defaults to
     * {@linkcode DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
     * @param materials Named acoustic materials per wall. Defaults to
     * {@linkcode DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
     */
    setProperties(dimensions, materials) {
        // Compute late response.
        const absorptionCoefficients = _getCoefficientsFromMaterials(materials);
        const durations = _getDurationsFromProperties(dimensions, absorptionCoefficients, this.speedOfSound);
        this.late.setDurations(durations);
        // Compute early response.
        this.early.speedOfSound = this.speedOfSound;
        const reflectionCoefficients = _computeReflectionCoefficients(absorptionCoefficients);
        this.early.setRoomProperties(dimensions, reflectionCoefficients);
    }
    /**
     * Set the listener's position (in meters), where origin is the center of
     * the room.
     */
    setListenerPosition(v) {
        this.early.speedOfSound = this.speedOfSound;
        this.early.setListenerPosition(v);
        // Disable room effects if the listener is outside the room boundaries.
        const distance = this.getDistanceOutsideRoom(v);
        let gain = 1;
        if (distance > EPSILON_FLOAT) {
            gain = 1 - distance / LISTENER_MAX_OUTSIDE_ROOM_DISTANCE;
            // Clamp gain between 0 and 1.
            gain = Math.max(0, Math.min(1, gain));
        }
        this.output.gain.value = gain;
    }
    /**
     * Compute distance outside room of provided position (in meters). Returns
     * Distance outside room (in meters). Returns 0 if inside room.
     */
    getDistanceOutsideRoom(v) {
        const dx = Math.max(0, -this.early.halfDimensions.width - v[0], v[0] - this.early.halfDimensions.width);
        const dy = Math.max(0, -this.early.halfDimensions.height - v[1], v[1] - this.early.halfDimensions.height);
        const dz = Math.max(0, -this.early.halfDimensions.depth - v[2], v[2] - this.early.halfDimensions.depth);
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}
//# sourceMappingURL=room.js.map