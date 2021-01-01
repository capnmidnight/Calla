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
export const DEFAULT_SOURCE_GAIN = 1;


/**
 * Maximum outside-the-room distance to attenuate far-field listener by.
 */
export const LISTENER_MAX_OUTSIDE_ROOM_DISTANCE = 1;


/**
 * Maximum outside-the-room distance to attenuate far-field sources by.
 */
export const SOURCE_MAX_OUTSIDE_ROOM_DISTANCE = 1;


/**
 * Default distance from listener when setting angle.
 */
export const DEFAULT_SOURCE_DISTANCE = 1;


export const DEFAULT_POSITION = vec3.zero(vec3.create()); 

export const DEFAULT_FORWARD = vec3.set(vec3.create(), 0, 0, -1);


export const DEFAULT_UP = vec3.set(vec3.create(), 0, 1, 0);


export const DEFAULT_RIGHT = vec3.set(vec3.create(), 1, 0, 0);


export const DEFAULT_SPEED_OF_SOUND = 343;

/**
 * Default rolloff model ('logarithmic').
 */
export const DEFAULT_ATTENUATION_ROLLOFF = AttenuationRolloff.Logarithmic;

/**
 * Default mode for rendering ambisonics.
 */
export const DEFAULT_RENDERING_MODE = 'ambisonic';


export const DEFAULT_MIN_DISTANCE = 1;


export const DEFAULT_MAX_DISTANCE = 1000;


/**
 * The default alpha (i.e. microphone pattern).
 */
export const DEFAULT_DIRECTIVITY_ALPHA = 0;


/**
 * The default pattern sharpness (i.e. pattern exponent).
 */
export const DEFAULT_DIRECTIVITY_SHARPNESS = 1;


/**
 * Default azimuth (in degrees). Suitable range is 0 to 360.
 * @type {Number}
 */
export const DEFAULT_AZIMUTH = 0;


/**
 * Default elevation (in degres).
 * Suitable range is from -90 (below) to 90 (above).
 */
export const DEFAULT_ELEVATION = 0;


/**
 * The default ambisonic order.
 */
export const DEFAULT_AMBISONIC_ORDER = 1;


/**
 * The default source width.
 */
export const DEFAULT_SOURCE_WIDTH = 0;


/**
 * The maximum delay (in seconds) of a single wall reflection.
 */
export const DEFAULT_REFLECTION_MAX_DURATION = 2;


/**
 * The -12dB cutoff frequency (in Hertz) for the lowpass filter applied to
 * all reflections.
 */
export const DEFAULT_REFLECTION_CUTOFF_FREQUENCY = 6400; // Uses -12dB cutoff.


/**
 * The default reflection coefficients (where 0 = no reflection, 1 = perfect
 * reflection, -1 = mirrored reflection (180-degrees out of phase)).
 */
export const DEFAULT_REFLECTION_COEFFICIENTS: ReflectionCoefficients = {
    [Direction.Left]: 0,
    [Direction.Right]: 0,
    [Direction.Front]: 0,
    [Direction.Back]: 0,
    [Direction.Down]: 0,
    [Direction.Up]: 0,
};


/**
 * The minimum distance we consider the listener to be to any given wall.
 */
export const DEFAULT_REFLECTION_MIN_DISTANCE = 1;


/**
 * Default room dimensions (in meters).
 */
export const DEFAULT_ROOM_DIMENSIONS: RoomDimensions = {
    [Dimension.Width]: 0,
    [Dimension.Height]: 0,
    [Dimension.Depth]: 0,
};


/**
 * The multiplier to apply to distances from the listener to each wall.
 */
export const DEFAULT_REFLECTION_MULTIPLIER = 1;


/** The default bandwidth (in octaves) of the center frequencies.
 */
export const DEFAULT_REVERB_BANDWIDTH = 1;


/** The default multiplier applied when computing tail lengths.
 */
export const DEFAULT_REVERB_DURATION_MULTIPLIER = 1;


/**
 * The late reflections pre-delay (in milliseconds).
 */
export const DEFAULT_REVERB_PREDELAY = 1.5;


/**
 * The length of the beginning of the impulse response to apply a
 * half-Hann window to.
 */
export const DEFAULT_REVERB_TAIL_ONSET = 3.8;


/**
 * The default gain (linear).
 */
export const DEFAULT_REVERB_GAIN = 0.01;


/**
 * The maximum impulse response length (in seconds).
 */
export const DEFAULT_REVERB_MAX_DURATION = 3;


/**
 * Center frequencies of the multiband late reflections.
 * Nine bands are computed by: 31.25 * 2^(0:8).
 */
export const DEFAULT_REVERB_FREQUENCY_BANDS = [
    31.25, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000,
];


/**
 * The number of frequency bands.
 */
export const NUMBER_REVERB_FREQUENCY_BANDS =
    DEFAULT_REVERB_FREQUENCY_BANDS.length;


/**
 * The default multiband RT60 durations (in seconds).
 */
export const DEFAULT_REVERB_DURATIONS =
    new Float32Array(NUMBER_REVERB_FREQUENCY_BANDS);

export enum Material {
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
export const ROOM_MATERIAL_COEFFICIENTS = {
    [Material.Transparent]:
        [1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000],
    [Material.AcousticCeilingTiles]:
        [0.672, 0.675, 0.700, 0.660, 0.720, 0.920, 0.880, 0.750, 1.000],
    [Material.BrickBare]:
        [0.030, 0.030, 0.030, 0.030, 0.030, 0.040, 0.050, 0.070, 0.140],
    [Material.BrickPainted]:
        [0.006, 0.007, 0.010, 0.010, 0.020, 0.020, 0.020, 0.030, 0.060],
    [Material.ConcreteBlockCoarse]:
        [0.360, 0.360, 0.360, 0.440, 0.310, 0.290, 0.390, 0.250, 0.500],
    [Material.ConcreteBlockPainted]:
        [0.092, 0.090, 0.100, 0.050, 0.060, 0.070, 0.090, 0.080, 0.160],
    [Material.CurtainHeavy]:
        [0.073, 0.106, 0.140, 0.350, 0.550, 0.720, 0.700, 0.650, 1.000],
    [Material.FiberGlassInsulation]:
        [0.193, 0.220, 0.220, 0.820, 0.990, 0.990, 0.990, 0.990, 1.000],
    [Material.GlassThin]:
        [0.180, 0.169, 0.180, 0.060, 0.040, 0.030, 0.020, 0.020, 0.040],
    [Material.GlassThick]:
        [0.350, 0.350, 0.350, 0.250, 0.180, 0.120, 0.070, 0.040, 0.080],
    [Material.Grass]:
        [0.050, 0.050, 0.150, 0.250, 0.400, 0.550, 0.600, 0.600, 0.600],
    [Material.LinoleumOnConcrete]:
        [0.020, 0.020, 0.020, 0.030, 0.030, 0.030, 0.030, 0.020, 0.040],
    [Material.Marble]:
        [0.010, 0.010, 0.010, 0.010, 0.010, 0.010, 0.020, 0.020, 0.040],
    [Material.Metal]:
        [0.030, 0.035, 0.040, 0.040, 0.050, 0.050, 0.050, 0.070, 0.090],
    [Material.ParquetOnConcrete]:
        [0.028, 0.030, 0.040, 0.040, 0.070, 0.060, 0.060, 0.070, 0.140],
    [Material.PlasterRough]:
        [0.017, 0.018, 0.020, 0.030, 0.040, 0.050, 0.040, 0.030, 0.060],
    [Material.PlasterSmooth]:
        [0.011, 0.012, 0.013, 0.015, 0.020, 0.030, 0.040, 0.050, 0.100],
    [Material.PlywoodPanel]:
        [0.400, 0.340, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
    [Material.PolishedConcreteOrTile]:
        [0.008, 0.008, 0.010, 0.010, 0.015, 0.020, 0.020, 0.020, 0.040],
    [Material.Sheetrock]:
        [0.290, 0.279, 0.290, 0.100, 0.050, 0.040, 0.070, 0.090, 0.180],
    [Material.WaterOrIceSurface]:
        [0.006, 0.006, 0.008, 0.008, 0.013, 0.015, 0.020, 0.025, 0.050],
    [Material.WoodCeiling]:
        [0.150, 0.147, 0.150, 0.110, 0.100, 0.070, 0.060, 0.070, 0.140],
    [Material.WoodPanel]:
        [0.280, 0.280, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
    [Material.Uniform]:
        [0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500],
};


/**
 * Default materials that use strings from
 * {@linkcode Utils.MATERIAL_COEFFICIENTS MATERIAL_COEFFICIENTS}
 */
export const DEFAULT_ROOM_MATERIALS: RoomMaterials = {
    [Direction.Left]: Material.Transparent,
    [Direction.Right]: Material.Transparent,
    [Direction.Front]: Material.Transparent,
    [Direction.Back]: Material.Transparent,
    [Direction.Down]: Material.Transparent,
    [Direction.Up]: Material.Transparent,
};


/**
 * The number of bands to average over when computing reflection coefficients.
 */
export const NUMBER_REFLECTION_AVERAGING_BANDS = 3;


/**
 * The starting band to average over when computing reflection coefficients.
 */
export const ROOM_STARTING_AVERAGING_BAND = 4;


/**
 * The minimum threshold for room volume.
 * Room model is disabled if volume is below this value.
 */
export const ROOM_MIN_VOLUME = 1e-4;


/**
 * Air absorption coefficients per frequency band.
 */
export const ROOM_AIR_ABSORPTION_COEFFICIENTS =
    [0.0006, 0.0006, 0.0007, 0.0008, 0.0010, 0.0015, 0.0026, 0.0060, 0.0207];


/**
 * A scalar correction value to ensure Sabine and Eyring produce the same RT60
 * value at the cross-over threshold.
 */
export const ROOM_EYRING_CORRECTION_COEFFICIENT = 1.38;


export const TWO_PI = 6.28318530717959;


export const TWENTY_FOUR_LOG10 = 55.2620422318571;


export const LOG1000 = 6.90775527898214;


export const LOG2_DIV2 = 0.346573590279973;


export const DEGREES_TO_RADIANS = 0.017453292519943;


export const RADIANS_TO_DEGREES = 57.295779513082323;


export const EPSILON_FLOAT = 1e-8;

/**
 * ResonanceAudio library logging function.
 */
export const log = function (...args: any[]): void {
    window.console.log.apply(window.console, [
        '%c[ResonanceAudio]%c '
        + args.join(' ') + ' %c(@'
        + performance.now().toFixed(2) + 'ms)',
        'background: #BBDEFB; color: #FF5722; font-weight: 700',
        'font-weight: 400',
        'color: #AAA',
    ]);
};

export const DirectionToDimension = {
    [Direction.Left]: Dimension.Width,
    [Direction.Right]: Dimension.Width,
    [Direction.Front]: Dimension.Depth,
    [Direction.Back]: Dimension.Depth,
    [Direction.Up]: Dimension.Height,
    [Direction.Down]: Dimension.Height
};

export const DirectionToAxis = {
    [Direction.Left]: 0,
    [Direction.Right]: 0,
    [Direction.Front]: 2,
    [Direction.Back]: 2,
    [Direction.Up]: 1,
    [Direction.Down]: 1
};

export const DirectionSign = {
    [Direction.Left]: 1,
    [Direction.Right]: -1,
    [Direction.Front]: 1,
    [Direction.Back]: -1,
    [Direction.Up]: -1,
    [Direction.Down]: 1
};