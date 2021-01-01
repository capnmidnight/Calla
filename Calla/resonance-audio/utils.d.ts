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
import { AttenuationRolloff } from "./AttenuationRolloff";
import { Dimension } from "./Dimension";
import { Direction } from "./Direction";
import type { ReflectionCoefficients } from "./ReflectionCoefficients";
import type { RoomDimensions } from "./RoomDimensions";
import type { RoomMaterials } from "./RoomMaterials";
/**
 * Default input gain (linear).
 */
export declare const DEFAULT_SOURCE_GAIN = 1;
/**
 * Maximum outside-the-room distance to attenuate far-field listener by.
 */
export declare const LISTENER_MAX_OUTSIDE_ROOM_DISTANCE = 1;
/**
 * Maximum outside-the-room distance to attenuate far-field sources by.
 */
export declare const SOURCE_MAX_OUTSIDE_ROOM_DISTANCE = 1;
/**
 * Default distance from listener when setting angle.
 */
export declare const DEFAULT_SOURCE_DISTANCE = 1;
export declare const DEFAULT_POSITION: vec3;
export declare const DEFAULT_FORWARD: vec3;
export declare const DEFAULT_UP: vec3;
export declare const DEFAULT_RIGHT: vec3;
export declare const DEFAULT_SPEED_OF_SOUND = 343;
/**
 * Default rolloff model ('logarithmic').
 */
export declare const DEFAULT_ATTENUATION_ROLLOFF = AttenuationRolloff.Logarithmic;
/**
 * Default mode for rendering ambisonics.
 */
export declare const DEFAULT_RENDERING_MODE = "ambisonic";
export declare const DEFAULT_MIN_DISTANCE = 1;
export declare const DEFAULT_MAX_DISTANCE = 1000;
/**
 * The default alpha (i.e. microphone pattern).
 */
export declare const DEFAULT_DIRECTIVITY_ALPHA = 0;
/**
 * The default pattern sharpness (i.e. pattern exponent).
 */
export declare const DEFAULT_DIRECTIVITY_SHARPNESS = 1;
/**
 * Default azimuth (in degrees). Suitable range is 0 to 360.
 * @type {Number}
 */
export declare const DEFAULT_AZIMUTH = 0;
/**
 * Default elevation (in degres).
 * Suitable range is from -90 (below) to 90 (above).
 */
export declare const DEFAULT_ELEVATION = 0;
/**
 * The default ambisonic order.
 */
export declare const DEFAULT_AMBISONIC_ORDER = 1;
/**
 * The default source width.
 */
export declare const DEFAULT_SOURCE_WIDTH = 0;
/**
 * The maximum delay (in seconds) of a single wall reflection.
 */
export declare const DEFAULT_REFLECTION_MAX_DURATION = 2;
/**
 * The -12dB cutoff frequency (in Hertz) for the lowpass filter applied to
 * all reflections.
 */
export declare const DEFAULT_REFLECTION_CUTOFF_FREQUENCY = 6400;
/**
 * The default reflection coefficients (where 0 = no reflection, 1 = perfect
 * reflection, -1 = mirrored reflection (180-degrees out of phase)).
 */
export declare const DEFAULT_REFLECTION_COEFFICIENTS: ReflectionCoefficients;
/**
 * The minimum distance we consider the listener to be to any given wall.
 */
export declare const DEFAULT_REFLECTION_MIN_DISTANCE = 1;
/**
 * Default room dimensions (in meters).
 */
export declare const DEFAULT_ROOM_DIMENSIONS: RoomDimensions;
/**
 * The multiplier to apply to distances from the listener to each wall.
 */
export declare const DEFAULT_REFLECTION_MULTIPLIER = 1;
/** The default bandwidth (in octaves) of the center frequencies.
 */
export declare const DEFAULT_REVERB_BANDWIDTH = 1;
/** The default multiplier applied when computing tail lengths.
 */
export declare const DEFAULT_REVERB_DURATION_MULTIPLIER = 1;
/**
 * The late reflections pre-delay (in milliseconds).
 */
export declare const DEFAULT_REVERB_PREDELAY = 1.5;
/**
 * The length of the beginning of the impulse response to apply a
 * half-Hann window to.
 */
export declare const DEFAULT_REVERB_TAIL_ONSET = 3.8;
/**
 * The default gain (linear).
 */
export declare const DEFAULT_REVERB_GAIN = 0.01;
/**
 * The maximum impulse response length (in seconds).
 */
export declare const DEFAULT_REVERB_MAX_DURATION = 3;
/**
 * Center frequencies of the multiband late reflections.
 * Nine bands are computed by: 31.25 * 2^(0:8).
 */
export declare const DEFAULT_REVERB_FREQUENCY_BANDS: number[];
/**
 * The number of frequency bands.
 */
export declare const NUMBER_REVERB_FREQUENCY_BANDS: number;
/**
 * The default multiband RT60 durations (in seconds).
 */
export declare const DEFAULT_REVERB_DURATIONS: Float32Array;
export declare enum Material {
    Transparent = "transparent",
    AcousticCeilingTiles = "acoustic-ceiling-tiles",
    BrickBare = "brick-bare",
    BrickPainted = "brick-painted",
    ConcreteBlockCoarse = "concrete-block-coarse",
    ConcreteBlockPainted = "concrete-block-painted",
    CurtainHeavy = "curtain-heavy",
    FiberGlassInsulation = "fiber-glass-insulation",
    GlassThin = "glass-thin",
    GlassThick = "glass-thick",
    Grass = "grass",
    LinoleumOnConcrete = "linoleum-on-concrete",
    Marble = "marble",
    Metal = "metal",
    ParquetOnConcrete = "parquet-on-concrete",
    PlasterRough = "plaster-rough",
    PlasterSmooth = "plaster-smooth",
    PlywoodPanel = "plywood-panel",
    PolishedConcreteOrTile = "polished-concrete-or-tile",
    Sheetrock = "sheetrock",
    WaterOrIceSurface = "water-or-ice-surface",
    WoodCeiling = "wood-ceiling",
    WoodPanel = "wood-panel",
    Uniform = "uniform"
}
/**
 * Pre-defined frequency-dependent absorption coefficients for listed materials.
 * Currently supported materials are:
 * <ul>
 * <li>'transparent'</li>
 * <li>'acoustic-ceiling-tiles'</li>
 * <li>'brick-bare'</li>
 * <li>'brick-painted'</li>
 * <li>'concrete-block-coarse'</li>
 * <li>'concrete-block-painted'</li>
 * <li>'curtain-heavy'</li>
 * <li>'fiber-glass-insulation'</li>
 * <li>'glass-thin'</li>
 * <li>'glass-thick'</li>
 * <li>'grass'</li>
 * <li>'linoleum-on-concrete'</li>
 * <li>'marble'</li>
 * <li>'metal'</li>
 * <li>'parquet-on-concrete'</li>
 * <li>'plaster-smooth'</li>
 * <li>'plywood-panel'</li>
 * <li>'polished-concrete-or-tile'</li>
 * <li>'sheetrock'</li>
 * <li>'water-or-ice-surface'</li>
 * <li>'wood-ceiling'</li>
 * <li>'wood-panel'</li>
 * <li>'uniform'</li>
 * </ul>
 * @type {Object}
 */
export declare const ROOM_MATERIAL_COEFFICIENTS: {
    transparent: number[];
    "acoustic-ceiling-tiles": number[];
    "brick-bare": number[];
    "brick-painted": number[];
    "concrete-block-coarse": number[];
    "concrete-block-painted": number[];
    "curtain-heavy": number[];
    "fiber-glass-insulation": number[];
    "glass-thin": number[];
    "glass-thick": number[];
    grass: number[];
    "linoleum-on-concrete": number[];
    marble: number[];
    metal: number[];
    "parquet-on-concrete": number[];
    "plaster-rough": number[];
    "plaster-smooth": number[];
    "plywood-panel": number[];
    "polished-concrete-or-tile": number[];
    sheetrock: number[];
    "water-or-ice-surface": number[];
    "wood-ceiling": number[];
    "wood-panel": number[];
    uniform: number[];
};
/**
 * Default materials that use strings from
 * {@linkcode Utils.MATERIAL_COEFFICIENTS MATERIAL_COEFFICIENTS}
 */
export declare const DEFAULT_ROOM_MATERIALS: RoomMaterials;
/**
 * The number of bands to average over when computing reflection coefficients.
 */
export declare const NUMBER_REFLECTION_AVERAGING_BANDS = 3;
/**
 * The starting band to average over when computing reflection coefficients.
 */
export declare const ROOM_STARTING_AVERAGING_BAND = 4;
/**
 * The minimum threshold for room volume.
 * Room model is disabled if volume is below this value.
 */
export declare const ROOM_MIN_VOLUME = 0.0001;
/**
 * Air absorption coefficients per frequency band.
 */
export declare const ROOM_AIR_ABSORPTION_COEFFICIENTS: number[];
/**
 * A scalar correction value to ensure Sabine and Eyring produce the same RT60
 * value at the cross-over threshold.
 */
export declare const ROOM_EYRING_CORRECTION_COEFFICIENT = 1.38;
export declare const TWO_PI = 6.28318530717959;
export declare const TWENTY_FOUR_LOG10 = 55.2620422318571;
export declare const LOG1000 = 6.90775527898214;
export declare const LOG2_DIV2 = 0.346573590279973;
export declare const DEGREES_TO_RADIANS = 0.017453292519943;
export declare const RADIANS_TO_DEGREES = 57.29577951308232;
export declare const EPSILON_FLOAT = 1e-8;
/**
 * ResonanceAudio library logging function.
 */
export declare const log: (...args: any[]) => void;
export declare const DirectionToDimension: {
    left: Dimension;
    right: Dimension;
    front: Dimension;
    back: Dimension;
    up: Dimension;
    down: Dimension;
};
export declare const DirectionToAxis: {
    left: number;
    right: number;
    front: number;
    back: number;
    up: number;
    down: number;
};
export declare const DirectionSign: {
    left: number;
    right: number;
    front: number;
    back: number;
    up: number;
    down: number;
};
