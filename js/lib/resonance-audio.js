(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this || window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
 * @file ResonanceAudio library common utilities, mathematical constants,
 * and default values.
 * @author Andrew Allen <bitllama@google.com>
 */




/**
 * @class Utils
 * @description A set of defaults, constants and utility functions.
 */
function Utils() {};


/**
 * Default input gain (linear).
 * @type {Number}
 */
Utils.DEFAULT_SOURCE_GAIN = 1;


/**
 * Maximum outside-the-room distance to attenuate far-field listener by.
 * @type {Number}
 */
Utils.LISTENER_MAX_OUTSIDE_ROOM_DISTANCE = 1;


/**
 * Maximum outside-the-room distance to attenuate far-field sources by.
 * @type {Number}
 */
Utils.SOURCE_MAX_OUTSIDE_ROOM_DISTANCE = 1;


/**
 * Default distance from listener when setting angle.
 * @type {Number}
 */
Utils.DEFAULT_SOURCE_DISTANCE = 1;


/** @type {Float32Array} */
Utils.DEFAULT_POSITION = [0, 0, 0];


/** @type {Float32Array} */
Utils.DEFAULT_FORWARD = [0, 0, -1];


/** @type {Float32Array} */
Utils.DEFAULT_UP = [0, 1, 0];


/** @type {Float32Array} */
Utils.DEFAULT_RIGHT = [1, 0, 0];


/**
 * @type {Number}
 */
Utils.DEFAULT_SPEED_OF_SOUND = 343;


/** Rolloff models (e.g. 'logarithmic', 'linear', or 'none').
 * @type {Array}
 */
Utils.ATTENUATION_ROLLOFFS = ['logarithmic', 'linear', 'none'];


/** Default rolloff model ('logarithmic').
 * @type {string}
 */
Utils.DEFAULT_ATTENUATION_ROLLOFF = 'logarithmic';


/** @type {Number} */
Utils.DEFAULT_MIN_DISTANCE = 1;


/** @type {Number} */
Utils.DEFAULT_MAX_DISTANCE = 1000;


/**
 * The default alpha (i.e. microphone pattern).
 * @type {Number}
 */
Utils.DEFAULT_DIRECTIVITY_ALPHA = 0;


/**
 * The default pattern sharpness (i.e. pattern exponent).
 * @type {Number}
 */
Utils.DEFAULT_DIRECTIVITY_SHARPNESS = 1;


/**
 * Default azimuth (in degrees). Suitable range is 0 to 360.
 * @type {Number}
 */
Utils.DEFAULT_AZIMUTH = 0;


/**
 * Default elevation (in degres).
 * Suitable range is from -90 (below) to 90 (above).
 * @type {Number}
 */
Utils.DEFAULT_ELEVATION = 0;


/**
 * The default ambisonic order.
 * @type {Number}
 */
Utils.DEFAULT_AMBISONIC_ORDER = 1;


/**
 * The default source width.
 * @type {Number}
 */
Utils.DEFAULT_SOURCE_WIDTH = 0;


/**
 * The maximum delay (in seconds) of a single wall reflection.
 * @type {Number}
 */
Utils.DEFAULT_REFLECTION_MAX_DURATION = 0.5;


/**
 * The -12dB cutoff frequency (in Hertz) for the lowpass filter applied to
 * all reflections.
 * @type {Number}
 */
Utils.DEFAULT_REFLECTION_CUTOFF_FREQUENCY = 6400; // Uses -12dB cutoff.


/**
 * The default reflection coefficients (where 0 = no reflection, 1 = perfect
 * reflection, -1 = mirrored reflection (180-degrees out of phase)).
 * @type {Object}
 */
Utils.DEFAULT_REFLECTION_COEFFICIENTS = {
  left: 0, right: 0, front: 0, back: 0, down: 0, up: 0,
};


/**
 * The minimum distance we consider the listener to be to any given wall.
 * @type {Number}
 */
Utils.DEFAULT_REFLECTION_MIN_DISTANCE = 1;


/**
 * Default room dimensions (in meters).
 * @type {Object}
 */
Utils.DEFAULT_ROOM_DIMENSIONS = {
  width: 0, height: 0, depth: 0,
};


/**
 * The multiplier to apply to distances from the listener to each wall.
 * @type {Number}
 */
Utils.DEFAULT_REFLECTION_MULTIPLIER = 1;


/** The default bandwidth (in octaves) of the center frequencies.
 * @type {Number}
 */
Utils.DEFAULT_REVERB_BANDWIDTH = 1;


/** The default multiplier applied when computing tail lengths.
 * @type {Number}
 */
Utils.DEFAULT_REVERB_DURATION_MULTIPLIER = 1;


/**
 * The late reflections pre-delay (in milliseconds).
 * @type {Number}
 */
Utils.DEFAULT_REVERB_PREDELAY = 1.5;


/**
 * The length of the beginning of the impulse response to apply a
 * half-Hann window to.
 * @type {Number}
 */
Utils.DEFAULT_REVERB_TAIL_ONSET = 3.8;


/**
 * The default gain (linear).
 * @type {Number}
 */
Utils.DEFAULT_REVERB_GAIN = 0.01;


/**
 * The maximum impulse response length (in seconds).
 * @type {Number}
 */
Utils.DEFAULT_REVERB_MAX_DURATION = 3;


/**
 * Center frequencies of the multiband late reflections.
 * Nine bands are computed by: 31.25 * 2^(0:8).
 * @type {Array}
 */
Utils.DEFAULT_REVERB_FREQUENCY_BANDS = [
  31.25, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000,
];


/**
 * The number of frequency bands.
 */
Utils.NUMBER_REVERB_FREQUENCY_BANDS =
  Utils.DEFAULT_REVERB_FREQUENCY_BANDS.length;


/**
 * The default multiband RT60 durations (in seconds).
 * @type {Float32Array}
 */
Utils.DEFAULT_REVERB_DURATIONS =
  new Float32Array(Utils.NUMBER_REVERB_FREQUENCY_BANDS);


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
Utils.ROOM_MATERIAL_COEFFICIENTS = {
  'transparent':
  [1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000],
  'acoustic-ceiling-tiles':
  [0.672, 0.675, 0.700, 0.660, 0.720, 0.920, 0.880, 0.750, 1.000],
  'brick-bare':
  [0.030, 0.030, 0.030, 0.030, 0.030, 0.040, 0.050, 0.070, 0.140],
  'brick-painted':
  [0.006, 0.007, 0.010, 0.010, 0.020, 0.020, 0.020, 0.030, 0.060],
  'concrete-block-coarse':
  [0.360, 0.360, 0.360, 0.440, 0.310, 0.290, 0.390, 0.250, 0.500],
  'concrete-block-painted':
  [0.092, 0.090, 0.100, 0.050, 0.060, 0.070, 0.090, 0.080, 0.160],
  'curtain-heavy':
  [0.073, 0.106, 0.140, 0.350, 0.550, 0.720, 0.700, 0.650, 1.000],
  'fiber-glass-insulation':
  [0.193, 0.220, 0.220, 0.820, 0.990, 0.990, 0.990, 0.990, 1.000],
  'glass-thin':
  [0.180, 0.169, 0.180, 0.060, 0.040, 0.030, 0.020, 0.020, 0.040],
  'glass-thick':
  [0.350, 0.350, 0.350, 0.250, 0.180, 0.120, 0.070, 0.040, 0.080],
  'grass':
  [0.050, 0.050, 0.150, 0.250, 0.400, 0.550, 0.600, 0.600, 0.600],
  'linoleum-on-concrete':
  [0.020, 0.020, 0.020, 0.030, 0.030, 0.030, 0.030, 0.020, 0.040],
  'marble':
  [0.010, 0.010, 0.010, 0.010, 0.010, 0.010, 0.020, 0.020, 0.040],
  'metal':
  [0.030, 0.035, 0.040, 0.040, 0.050, 0.050, 0.050, 0.070, 0.090],
  'parquet-on-concrete':
  [0.028, 0.030, 0.040, 0.040, 0.070, 0.060, 0.060, 0.070, 0.140],
  'plaster-rough':
  [0.017, 0.018, 0.020, 0.030, 0.040, 0.050, 0.040, 0.030, 0.060],
  'plaster-smooth':
  [0.011, 0.012, 0.013, 0.015, 0.020, 0.030, 0.040, 0.050, 0.100],
  'plywood-panel':
  [0.400, 0.340, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
  'polished-concrete-or-tile':
  [0.008, 0.008, 0.010, 0.010, 0.015, 0.020, 0.020, 0.020, 0.040],
  'sheet-rock':
  [0.290, 0.279, 0.290, 0.100, 0.050, 0.040, 0.070, 0.090, 0.180],
  'water-or-ice-surface':
  [0.006, 0.006, 0.008, 0.008, 0.013, 0.015, 0.020, 0.025, 0.050],
  'wood-ceiling':
  [0.150, 0.147, 0.150, 0.110, 0.100, 0.070, 0.060, 0.070, 0.140],
  'wood-panel':
  [0.280, 0.280, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
  'uniform':
  [0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500],
};


/**
 * Default materials that use strings from
 * {@linkcode Utils.MATERIAL_COEFFICIENTS MATERIAL_COEFFICIENTS}
 * @type {Object}
 */
Utils.DEFAULT_ROOM_MATERIALS = {
  left: 'transparent', right: 'transparent', front: 'transparent',
  back: 'transparent', down: 'transparent', up: 'transparent',
};


/**
 * The number of bands to average over when computing reflection coefficients.
 * @type {Number}
 */
Utils.NUMBER_REFLECTION_AVERAGING_BANDS = 3;


/**
 * The starting band to average over when computing reflection coefficients.
 * @type {Number}
 */
Utils.ROOM_STARTING_AVERAGING_BAND = 4;


/**
 * The minimum threshold for room volume.
 * Room model is disabled if volume is below this value.
 * @type {Number} */
Utils.ROOM_MIN_VOLUME = 1e-4;


/**
 * Air absorption coefficients per frequency band.
 * @type {Float32Array}
 */
Utils.ROOM_AIR_ABSORPTION_COEFFICIENTS =
  [0.0006, 0.0006, 0.0007, 0.0008, 0.0010, 0.0015, 0.0026, 0.0060, 0.0207];


/**
 * A scalar correction value to ensure Sabine and Eyring produce the same RT60
 * value at the cross-over threshold.
 * @type {Number}
 */
Utils.ROOM_EYRING_CORRECTION_COEFFICIENT = 1.38;


/**
 * @type {Number}
 * @private
 */
Utils.TWO_PI = 6.28318530717959;


/**
 * @type {Number}
 * @private
 */
Utils.TWENTY_FOUR_LOG10 = 55.2620422318571;


/**
 * @type {Number}
 * @private
 */
Utils.LOG1000 = 6.90775527898214;


/**
 * @type {Number}
 * @private
 */
Utils.LOG2_DIV2 = 0.346573590279973;


/**
 * @type {Number}
 * @private
 */
Utils.DEGREES_TO_RADIANS = 0.017453292519943;


/**
 * @type {Number}
 * @private
 */
Utils.RADIANS_TO_DEGREES = 57.295779513082323;


/**
 * @type {Number}
 * @private
 */
Utils.EPSILON_FLOAT = 1e-8;


/**
 * ResonanceAudio library logging function.
 * @type {Function}
 * @param {any} Message to be printed out.
 * @private
 */
Utils.log = function() {
  window.console.log.apply(window.console, [
    '%c[ResonanceAudio]%c '
      + Array.prototype.slice.call(arguments).join(' ') + ' %c(@'
      + performance.now().toFixed(2) + 'ms)',
    'background: #BBDEFB; color: #FF5722; font-weight: 700',
    'font-weight: 400',
    'color: #AAA',
  ]);
};


/**
 * Normalize a 3-d vector.
 * @param {Float32Array} v 3-element vector.
 * @return {Float32Array} 3-element vector.
 * @private
 */
Utils.normalizeVector = function(v) {
  let n = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  if (n > exports.EPSILON_FLOAT) {
    n = 1 / n;
    v[0] *= n;
    v[1] *= n;
    v[2] *= n;
  }
  return v;
};


/**
 * Cross-product between two 3-d vectors.
 * @param {Float32Array} a 3-element vector.
 * @param {Float32Array} b 3-element vector.
 * @return {Float32Array}
 * @private
 */
Utils.crossProduct = function(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
};

module.exports = Utils;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
 * @file Spatially encodes input using weighted spherical harmonics.
 * @author Andrew Allen <bitllama@google.com>
 */



// Internal dependencies.
const Tables = __webpack_require__(3);
const Utils = __webpack_require__(0);


/**
 * @class Encoder
 * @description Spatially encodes input using weighted spherical harmonics.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.ambisonicOrder
 * Desired ambisonic order. Defaults to
 * {@linkcode Utils.DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
 * @param {Number} options.azimuth
 * Azimuth (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_AZIMUTH DEFAULT_AZIMUTH}.
 * @param {Number} options.elevation
 * Elevation (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_ELEVATION DEFAULT_ELEVATION}.
 * @param {Number} options.sourceWidth
 * Source width (in degrees). Where 0 degrees is a point source and 360 degrees
 * is an omnidirectional source. Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_WIDTH DEFAULT_SOURCE_WIDTH}.
 */
function Encoder(context, options) {
  // Public variables.
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Encoder
   * @instance
   */
  /**
   * Ambisonic (multichannel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Encoder
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.ambisonicOrder == undefined) {
    options.ambisonicOrder = Utils.DEFAULT_AMBISONIC_ORDER;
  }
  if (options.azimuth == undefined) {
    options.azimuth = Utils.DEFAULT_AZIMUTH;
  }
  if (options.elevation == undefined) {
    options.elevation = Utils.DEFAULT_ELEVATION;
  }
  if (options.sourceWidth == undefined) {
    options.sourceWidth = Utils.DEFAULT_SOURCE_WIDTH;
  }

  this._context = context;

  // Create I/O nodes.
  this.input = context.createGain();
  this._channelGain = [];
  this._merger = undefined;
  this.output = context.createGain();

  // Set initial order, angle and source width.
  this.setAmbisonicOrder(options.ambisonicOrder);
  this._azimuth = options.azimuth;
  this._elevation = options.elevation;
  this.setSourceWidth(options.sourceWidth);
}

/**
 * Set the desired ambisonic order.
 * @param {Number} ambisonicOrder Desired ambisonic order.
 */
Encoder.prototype.setAmbisonicOrder = function(ambisonicOrder) {
  this._ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);

  this.input.disconnect();
  for (let i = 0; i < this._channelGain.length; i++) {
    this._channelGain[i].disconnect();
  }
  if (this._merger != undefined) {
    this._merger.disconnect();
  }
  delete this._channelGain;
  delete this._merger;

  // Create audio graph.
  let numChannels = (this._ambisonicOrder + 1) * (this._ambisonicOrder + 1);
  this._merger = this._context.createChannelMerger(numChannels);
  this._channelGain = new Array(numChannels);
  for (let i = 0; i < numChannels; i++) {
    this._channelGain[i] = this._context.createGain();
    this.input.connect(this._channelGain[i]);
    this._channelGain[i].connect(this._merger, 0, i);
  }
  this._merger.connect(this.output);
};


/**
 * Set the direction of the encoded source signal.
 * @param {Number} azimuth
 * Azimuth (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_AZIMUTH DEFAULT_AZIMUTH}.
 * @param {Number} elevation
 * Elevation (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_ELEVATION DEFAULT_ELEVATION}.
 */
Encoder.prototype.setDirection = function(azimuth, elevation) {
  // Format input direction to nearest indices.
  if (azimuth == undefined || isNaN(azimuth)) {
    azimuth = Utils.DEFAULT_AZIMUTH;
  }
  if (elevation == undefined || isNaN(elevation)) {
    elevation = Utils.DEFAULT_ELEVATION;
  }

  // Store the formatted input (for updating source width).
  this._azimuth = azimuth;
  this._elevation = elevation;

  // Format direction for index lookups.
  azimuth = Math.round(azimuth % 360);
  if (azimuth < 0) {
    azimuth += 360;
  }
  elevation = Math.round(Math.min(90, Math.max(-90, elevation))) + 90;

  // Assign gains to each output.
  this._channelGain[0].gain.value = Tables.MAX_RE_WEIGHTS[this._spreadIndex][0];
  for (let i = 1; i <= this._ambisonicOrder; i++) {
    let degreeWeight = Tables.MAX_RE_WEIGHTS[this._spreadIndex][i];
    for (let j = -i; j <= i; j++) {
      let acnChannel = (i * i) + i + j;
      let elevationIndex = i * (i + 1) / 2 + Math.abs(j) - 1;
      let val = Tables.SPHERICAL_HARMONICS[1][elevation][elevationIndex];
      if (j != 0) {
        let azimuthIndex = Tables.SPHERICAL_HARMONICS_MAX_ORDER + j - 1;
        if (j < 0) {
          azimuthIndex = Tables.SPHERICAL_HARMONICS_MAX_ORDER + j;
        }
        val *= Tables.SPHERICAL_HARMONICS[0][azimuth][azimuthIndex];
      }
      this._channelGain[acnChannel].gain.value = val * degreeWeight;
    }
  }
};


/**
 * Set the source width (in degrees). Where 0 degrees is a point source and 360
 * degrees is an omnidirectional source.
 * @param {Number} sourceWidth (in degrees).
 */
Encoder.prototype.setSourceWidth = function(sourceWidth) {
  // The MAX_RE_WEIGHTS is a 360 x (Tables.SPHERICAL_HARMONICS_MAX_ORDER+1)
  // size table.
  this._spreadIndex = Math.min(359, Math.max(0, Math.round(sourceWidth)));
  this.setDirection(this._azimuth, this._elevation);
};


/**
 * Validate the provided ambisonic order.
 * @param {Number} ambisonicOrder Desired ambisonic order.
 * @return {Number} Validated/adjusted ambisonic order.
 * @private
 */
Encoder.validateAmbisonicOrder = function(ambisonicOrder) {
  if (isNaN(ambisonicOrder) || ambisonicOrder == undefined) {
    Utils.log('Error: Invalid ambisonic order',
    options.ambisonicOrder, '\nUsing ambisonicOrder=1 instead.');
    ambisonicOrder = 1;
  } else if (ambisonicOrder < 1) {
    Utils.log('Error: Unable to render ambisonic order',
    options.ambisonicOrder, '(Min order is 1)',
    '\nUsing min order instead.');
    ambisonicOrder = 1;
  } else if (ambisonicOrder > Tables.SPHERICAL_HARMONICS_MAX_ORDER) {
    Utils.log('Error: Unable to render ambisonic order',
    options.ambisonicOrder, '(Max order is',
    Tables.SPHERICAL_HARMONICS_MAX_ORDER, ')\nUsing max order instead.');
    options.ambisonicOrder = Tables.SPHERICAL_HARMONICS_MAX_ORDER;
  }
  return ambisonicOrder;
};


module.exports = Encoder;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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




// Internal dependencies.
const Omnitone = __webpack_require__(12);
const Encoder = __webpack_require__(1);
const Utils = __webpack_require__(0);


/**
 * @class Listener
 * @description Listener model to spatialize sources in an environment.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.ambisonicOrder
 * Desired ambisonic order. Defaults to
 * {@linkcode Utils.DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
 * @param {Float32Array} options.position
 * Initial position (in meters), where origin is the center of
 * the room. Defaults to
 * {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Float32Array} options.forward
 * The listener's initial forward vector. Defaults to
 * {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @param {Float32Array} options.up
 * The listener's initial up vector. Defaults to
 * {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 */
function Listener(context, options) {
  // Public variables.
  /**
   * Position (in meters).
   * @member {Float32Array} position
   * @memberof Listener
   * @instance
   */
  /**
   * Ambisonic (multichannel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Listener
   * @instance
   */
  /**
   * Binaurally-rendered stereo (2-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Listener
   * @instance
   */
  /**
   * Ambisonic (multichannel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} ambisonicOutput
   * @memberof Listener
   * @instance
   */
  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.ambisonicOrder == undefined) {
    options.ambisonicOrder = Utils.DEFAULT_AMBISONIC_ORDER;
  }
  if (options.position == undefined) {
    options.position = Utils.DEFAULT_POSITION.slice();
  }
  if (options.forward == undefined) {
    options.forward = Utils.DEFAULT_FORWARD.slice();
  }
  if (options.up == undefined) {
    options.up = Utils.DEFAULT_UP.slice();
  }

  // Member variables.
  this.position = new Float32Array(3);
  this._tempMatrix3 = new Float32Array(9);

  // Select the appropriate HRIR filters using 2-channel chunks since
  // multichannel audio is not yet supported by a majority of browsers.
  this._ambisonicOrder =
    Encoder.validateAmbisonicOrder(options.ambisonicOrder);

    // Create audio nodes.
  this._context = context;
  if (this._ambisonicOrder == 1) {
    this._renderer = Omnitone.Omnitone.createFOARenderer(context, {});
  } else if (this._ambisonicOrder > 1) {
    this._renderer = Omnitone.Omnitone.createHOARenderer(context, {
      ambisonicOrder: this._ambisonicOrder,
    });
  }

  // These nodes are created in order to safely asynchronously load Omnitone
  // while the rest of the scene is being created.
  this.input = context.createGain();
  this.output = context.createGain();
  this.ambisonicOutput = context.createGain();

  // Initialize Omnitone (async) and connect to audio graph when complete.
  let that = this;
  this._renderer.initialize().then(function() {
    // Connect pre-rotated soundfield to renderer.
    that.input.connect(that._renderer.input);

    // Connect rotated soundfield to ambisonic output.
    if (that._ambisonicOrder > 1) {
      that._renderer._hoaRotator.output.connect(that.ambisonicOutput);
    } else {
      that._renderer._foaRotator.output.connect(that.ambisonicOutput);
    }

    // Connect binaurally-rendered soundfield to binaural output.
    that._renderer.output.connect(that.output);
  });

  // Set orientation and update rotation matrix accordingly.
  this.setOrientation(options.forward[0], options.forward[1],
    options.forward[2], options.up[0], options.up[1], options.up[2]);
};


/**
 * Set the source's orientation using forward and up vectors.
 * @param {Number} forwardX
 * @param {Number} forwardY
 * @param {Number} forwardZ
 * @param {Number} upX
 * @param {Number} upY
 * @param {Number} upZ
 */
Listener.prototype.setOrientation = function(forwardX, forwardY, forwardZ,
  upX, upY, upZ) {
  let right = Utils.crossProduct([forwardX, forwardY, forwardZ],
    [upX, upY, upZ]);
  this._tempMatrix3[0] = right[0];
  this._tempMatrix3[1] = right[1];
  this._tempMatrix3[2] = right[2];
  this._tempMatrix3[3] = upX;
  this._tempMatrix3[4] = upY;
  this._tempMatrix3[5] = upZ;
  this._tempMatrix3[6] = forwardX;
  this._tempMatrix3[7] = forwardY;
  this._tempMatrix3[8] = forwardZ;
  this._renderer.setRotationMatrix3(this._tempMatrix3);
};


/**
 * Set the listener's position and orientation using a Three.js Matrix4 object.
 * @param {Object} matrix4
 * The Three.js Matrix4 object representing the listener's world transform.
 */
Listener.prototype.setFromMatrix = function(matrix4) {
  // Update ambisonic rotation matrix internally.
  this._renderer.setRotationMatrix4(matrix4.elements);

  // Extract position from matrix.
  this.position[0] = matrix4.elements[12];
  this.position[1] = matrix4.elements[13];
  this.position[2] = matrix4.elements[14];
};


module.exports = Listener;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file Pre-computed lookup tables for encoding ambisonic sources.
 * @author Andrew Allen <bitllama@google.com>
 */




/**
 * Pre-computed Spherical Harmonics Coefficients.
 *
 * This function generates an efficient lookup table of SH coefficients. It
 * exploits the way SHs are generated (i.e. Ylm = Nlm * Plm * Em). Since Nlm
 * & Plm coefficients only depend on theta, and Em only depends on phi, we
 * can separate the equation along these lines. Em does not depend on
 * degree, so we only need to compute (2 * l) per azimuth Em total and
 * Nlm * Plm is symmetrical across indexes, so only positive indexes are
 * computed ((l + 1) * (l + 2) / 2 - 1) per elevation.
 * @type {Float32Array}
 */
exports.SPHERICAL_HARMONICS =
[
  [
    [0.000000, 0.000000, 0.000000, 1.000000, 1.000000, 1.000000],
    [0.052336, 0.034899, 0.017452, 0.999848, 0.999391, 0.998630],
    [0.104528, 0.069756, 0.034899, 0.999391, 0.997564, 0.994522],
    [0.156434, 0.104528, 0.052336, 0.998630, 0.994522, 0.987688],
    [0.207912, 0.139173, 0.069756, 0.997564, 0.990268, 0.978148],
    [0.258819, 0.173648, 0.087156, 0.996195, 0.984808, 0.965926],
    [0.309017, 0.207912, 0.104528, 0.994522, 0.978148, 0.951057],
    [0.358368, 0.241922, 0.121869, 0.992546, 0.970296, 0.933580],
    [0.406737, 0.275637, 0.139173, 0.990268, 0.961262, 0.913545],
    [0.453990, 0.309017, 0.156434, 0.987688, 0.951057, 0.891007],
    [0.500000, 0.342020, 0.173648, 0.984808, 0.939693, 0.866025],
    [0.544639, 0.374607, 0.190809, 0.981627, 0.927184, 0.838671],
    [0.587785, 0.406737, 0.207912, 0.978148, 0.913545, 0.809017],
    [0.629320, 0.438371, 0.224951, 0.974370, 0.898794, 0.777146],
    [0.669131, 0.469472, 0.241922, 0.970296, 0.882948, 0.743145],
    [0.707107, 0.500000, 0.258819, 0.965926, 0.866025, 0.707107],
    [0.743145, 0.529919, 0.275637, 0.961262, 0.848048, 0.669131],
    [0.777146, 0.559193, 0.292372, 0.956305, 0.829038, 0.629320],
    [0.809017, 0.587785, 0.309017, 0.951057, 0.809017, 0.587785],
    [0.838671, 0.615661, 0.325568, 0.945519, 0.788011, 0.544639],
    [0.866025, 0.642788, 0.342020, 0.939693, 0.766044, 0.500000],
    [0.891007, 0.669131, 0.358368, 0.933580, 0.743145, 0.453990],
    [0.913545, 0.694658, 0.374607, 0.927184, 0.719340, 0.406737],
    [0.933580, 0.719340, 0.390731, 0.920505, 0.694658, 0.358368],
    [0.951057, 0.743145, 0.406737, 0.913545, 0.669131, 0.309017],
    [0.965926, 0.766044, 0.422618, 0.906308, 0.642788, 0.258819],
    [0.978148, 0.788011, 0.438371, 0.898794, 0.615661, 0.207912],
    [0.987688, 0.809017, 0.453990, 0.891007, 0.587785, 0.156434],
    [0.994522, 0.829038, 0.469472, 0.882948, 0.559193, 0.104528],
    [0.998630, 0.848048, 0.484810, 0.874620, 0.529919, 0.052336],
    [1.000000, 0.866025, 0.500000, 0.866025, 0.500000, 0.000000],
    [0.998630, 0.882948, 0.515038, 0.857167, 0.469472, -0.052336],
    [0.994522, 0.898794, 0.529919, 0.848048, 0.438371, -0.104528],
    [0.987688, 0.913545, 0.544639, 0.838671, 0.406737, -0.156434],
    [0.978148, 0.927184, 0.559193, 0.829038, 0.374607, -0.207912],
    [0.965926, 0.939693, 0.573576, 0.819152, 0.342020, -0.258819],
    [0.951057, 0.951057, 0.587785, 0.809017, 0.309017, -0.309017],
    [0.933580, 0.961262, 0.601815, 0.798636, 0.275637, -0.358368],
    [0.913545, 0.970296, 0.615661, 0.788011, 0.241922, -0.406737],
    [0.891007, 0.978148, 0.629320, 0.777146, 0.207912, -0.453990],
    [0.866025, 0.984808, 0.642788, 0.766044, 0.173648, -0.500000],
    [0.838671, 0.990268, 0.656059, 0.754710, 0.139173, -0.544639],
    [0.809017, 0.994522, 0.669131, 0.743145, 0.104528, -0.587785],
    [0.777146, 0.997564, 0.681998, 0.731354, 0.069756, -0.629320],
    [0.743145, 0.999391, 0.694658, 0.719340, 0.034899, -0.669131],
    [0.707107, 1.000000, 0.707107, 0.707107, 0.000000, -0.707107],
    [0.669131, 0.999391, 0.719340, 0.694658, -0.034899, -0.743145],
    [0.629320, 0.997564, 0.731354, 0.681998, -0.069756, -0.777146],
    [0.587785, 0.994522, 0.743145, 0.669131, -0.104528, -0.809017],
    [0.544639, 0.990268, 0.754710, 0.656059, -0.139173, -0.838671],
    [0.500000, 0.984808, 0.766044, 0.642788, -0.173648, -0.866025],
    [0.453990, 0.978148, 0.777146, 0.629320, -0.207912, -0.891007],
    [0.406737, 0.970296, 0.788011, 0.615661, -0.241922, -0.913545],
    [0.358368, 0.961262, 0.798636, 0.601815, -0.275637, -0.933580],
    [0.309017, 0.951057, 0.809017, 0.587785, -0.309017, -0.951057],
    [0.258819, 0.939693, 0.819152, 0.573576, -0.342020, -0.965926],
    [0.207912, 0.927184, 0.829038, 0.559193, -0.374607, -0.978148],
    [0.156434, 0.913545, 0.838671, 0.544639, -0.406737, -0.987688],
    [0.104528, 0.898794, 0.848048, 0.529919, -0.438371, -0.994522],
    [0.052336, 0.882948, 0.857167, 0.515038, -0.469472, -0.998630],
    [0.000000, 0.866025, 0.866025, 0.500000, -0.500000, -1.000000],
    [-0.052336, 0.848048, 0.874620, 0.484810, -0.529919, -0.998630],
    [-0.104528, 0.829038, 0.882948, 0.469472, -0.559193, -0.994522],
    [-0.156434, 0.809017, 0.891007, 0.453990, -0.587785, -0.987688],
    [-0.207912, 0.788011, 0.898794, 0.438371, -0.615661, -0.978148],
    [-0.258819, 0.766044, 0.906308, 0.422618, -0.642788, -0.965926],
    [-0.309017, 0.743145, 0.913545, 0.406737, -0.669131, -0.951057],
    [-0.358368, 0.719340, 0.920505, 0.390731, -0.694658, -0.933580],
    [-0.406737, 0.694658, 0.927184, 0.374607, -0.719340, -0.913545],
    [-0.453990, 0.669131, 0.933580, 0.358368, -0.743145, -0.891007],
    [-0.500000, 0.642788, 0.939693, 0.342020, -0.766044, -0.866025],
    [-0.544639, 0.615661, 0.945519, 0.325568, -0.788011, -0.838671],
    [-0.587785, 0.587785, 0.951057, 0.309017, -0.809017, -0.809017],
    [-0.629320, 0.559193, 0.956305, 0.292372, -0.829038, -0.777146],
    [-0.669131, 0.529919, 0.961262, 0.275637, -0.848048, -0.743145],
    [-0.707107, 0.500000, 0.965926, 0.258819, -0.866025, -0.707107],
    [-0.743145, 0.469472, 0.970296, 0.241922, -0.882948, -0.669131],
    [-0.777146, 0.438371, 0.974370, 0.224951, -0.898794, -0.629320],
    [-0.809017, 0.406737, 0.978148, 0.207912, -0.913545, -0.587785],
    [-0.838671, 0.374607, 0.981627, 0.190809, -0.927184, -0.544639],
    [-0.866025, 0.342020, 0.984808, 0.173648, -0.939693, -0.500000],
    [-0.891007, 0.309017, 0.987688, 0.156434, -0.951057, -0.453990],
    [-0.913545, 0.275637, 0.990268, 0.139173, -0.961262, -0.406737],
    [-0.933580, 0.241922, 0.992546, 0.121869, -0.970296, -0.358368],
    [-0.951057, 0.207912, 0.994522, 0.104528, -0.978148, -0.309017],
    [-0.965926, 0.173648, 0.996195, 0.087156, -0.984808, -0.258819],
    [-0.978148, 0.139173, 0.997564, 0.069756, -0.990268, -0.207912],
    [-0.987688, 0.104528, 0.998630, 0.052336, -0.994522, -0.156434],
    [-0.994522, 0.069756, 0.999391, 0.034899, -0.997564, -0.104528],
    [-0.998630, 0.034899, 0.999848, 0.017452, -0.999391, -0.052336],
    [-1.000000, 0.000000, 1.000000, 0.000000, -1.000000, -0.000000],
    [-0.998630, -0.034899, 0.999848, -0.017452, -0.999391, 0.052336],
    [-0.994522, -0.069756, 0.999391, -0.034899, -0.997564, 0.104528],
    [-0.987688, -0.104528, 0.998630, -0.052336, -0.994522, 0.156434],
    [-0.978148, -0.139173, 0.997564, -0.069756, -0.990268, 0.207912],
    [-0.965926, -0.173648, 0.996195, -0.087156, -0.984808, 0.258819],
    [-0.951057, -0.207912, 0.994522, -0.104528, -0.978148, 0.309017],
    [-0.933580, -0.241922, 0.992546, -0.121869, -0.970296, 0.358368],
    [-0.913545, -0.275637, 0.990268, -0.139173, -0.961262, 0.406737],
    [-0.891007, -0.309017, 0.987688, -0.156434, -0.951057, 0.453990],
    [-0.866025, -0.342020, 0.984808, -0.173648, -0.939693, 0.500000],
    [-0.838671, -0.374607, 0.981627, -0.190809, -0.927184, 0.544639],
    [-0.809017, -0.406737, 0.978148, -0.207912, -0.913545, 0.587785],
    [-0.777146, -0.438371, 0.974370, -0.224951, -0.898794, 0.629320],
    [-0.743145, -0.469472, 0.970296, -0.241922, -0.882948, 0.669131],
    [-0.707107, -0.500000, 0.965926, -0.258819, -0.866025, 0.707107],
    [-0.669131, -0.529919, 0.961262, -0.275637, -0.848048, 0.743145],
    [-0.629320, -0.559193, 0.956305, -0.292372, -0.829038, 0.777146],
    [-0.587785, -0.587785, 0.951057, -0.309017, -0.809017, 0.809017],
    [-0.544639, -0.615661, 0.945519, -0.325568, -0.788011, 0.838671],
    [-0.500000, -0.642788, 0.939693, -0.342020, -0.766044, 0.866025],
    [-0.453990, -0.669131, 0.933580, -0.358368, -0.743145, 0.891007],
    [-0.406737, -0.694658, 0.927184, -0.374607, -0.719340, 0.913545],
    [-0.358368, -0.719340, 0.920505, -0.390731, -0.694658, 0.933580],
    [-0.309017, -0.743145, 0.913545, -0.406737, -0.669131, 0.951057],
    [-0.258819, -0.766044, 0.906308, -0.422618, -0.642788, 0.965926],
    [-0.207912, -0.788011, 0.898794, -0.438371, -0.615661, 0.978148],
    [-0.156434, -0.809017, 0.891007, -0.453990, -0.587785, 0.987688],
    [-0.104528, -0.829038, 0.882948, -0.469472, -0.559193, 0.994522],
    [-0.052336, -0.848048, 0.874620, -0.484810, -0.529919, 0.998630],
    [-0.000000, -0.866025, 0.866025, -0.500000, -0.500000, 1.000000],
    [0.052336, -0.882948, 0.857167, -0.515038, -0.469472, 0.998630],
    [0.104528, -0.898794, 0.848048, -0.529919, -0.438371, 0.994522],
    [0.156434, -0.913545, 0.838671, -0.544639, -0.406737, 0.987688],
    [0.207912, -0.927184, 0.829038, -0.559193, -0.374607, 0.978148],
    [0.258819, -0.939693, 0.819152, -0.573576, -0.342020, 0.965926],
    [0.309017, -0.951057, 0.809017, -0.587785, -0.309017, 0.951057],
    [0.358368, -0.961262, 0.798636, -0.601815, -0.275637, 0.933580],
    [0.406737, -0.970296, 0.788011, -0.615661, -0.241922, 0.913545],
    [0.453990, -0.978148, 0.777146, -0.629320, -0.207912, 0.891007],
    [0.500000, -0.984808, 0.766044, -0.642788, -0.173648, 0.866025],
    [0.544639, -0.990268, 0.754710, -0.656059, -0.139173, 0.838671],
    [0.587785, -0.994522, 0.743145, -0.669131, -0.104528, 0.809017],
    [0.629320, -0.997564, 0.731354, -0.681998, -0.069756, 0.777146],
    [0.669131, -0.999391, 0.719340, -0.694658, -0.034899, 0.743145],
    [0.707107, -1.000000, 0.707107, -0.707107, -0.000000, 0.707107],
    [0.743145, -0.999391, 0.694658, -0.719340, 0.034899, 0.669131],
    [0.777146, -0.997564, 0.681998, -0.731354, 0.069756, 0.629320],
    [0.809017, -0.994522, 0.669131, -0.743145, 0.104528, 0.587785],
    [0.838671, -0.990268, 0.656059, -0.754710, 0.139173, 0.544639],
    [0.866025, -0.984808, 0.642788, -0.766044, 0.173648, 0.500000],
    [0.891007, -0.978148, 0.629320, -0.777146, 0.207912, 0.453990],
    [0.913545, -0.970296, 0.615661, -0.788011, 0.241922, 0.406737],
    [0.933580, -0.961262, 0.601815, -0.798636, 0.275637, 0.358368],
    [0.951057, -0.951057, 0.587785, -0.809017, 0.309017, 0.309017],
    [0.965926, -0.939693, 0.573576, -0.819152, 0.342020, 0.258819],
    [0.978148, -0.927184, 0.559193, -0.829038, 0.374607, 0.207912],
    [0.987688, -0.913545, 0.544639, -0.838671, 0.406737, 0.156434],
    [0.994522, -0.898794, 0.529919, -0.848048, 0.438371, 0.104528],
    [0.998630, -0.882948, 0.515038, -0.857167, 0.469472, 0.052336],
    [1.000000, -0.866025, 0.500000, -0.866025, 0.500000, 0.000000],
    [0.998630, -0.848048, 0.484810, -0.874620, 0.529919, -0.052336],
    [0.994522, -0.829038, 0.469472, -0.882948, 0.559193, -0.104528],
    [0.987688, -0.809017, 0.453990, -0.891007, 0.587785, -0.156434],
    [0.978148, -0.788011, 0.438371, -0.898794, 0.615661, -0.207912],
    [0.965926, -0.766044, 0.422618, -0.906308, 0.642788, -0.258819],
    [0.951057, -0.743145, 0.406737, -0.913545, 0.669131, -0.309017],
    [0.933580, -0.719340, 0.390731, -0.920505, 0.694658, -0.358368],
    [0.913545, -0.694658, 0.374607, -0.927184, 0.719340, -0.406737],
    [0.891007, -0.669131, 0.358368, -0.933580, 0.743145, -0.453990],
    [0.866025, -0.642788, 0.342020, -0.939693, 0.766044, -0.500000],
    [0.838671, -0.615661, 0.325568, -0.945519, 0.788011, -0.544639],
    [0.809017, -0.587785, 0.309017, -0.951057, 0.809017, -0.587785],
    [0.777146, -0.559193, 0.292372, -0.956305, 0.829038, -0.629320],
    [0.743145, -0.529919, 0.275637, -0.961262, 0.848048, -0.669131],
    [0.707107, -0.500000, 0.258819, -0.965926, 0.866025, -0.707107],
    [0.669131, -0.469472, 0.241922, -0.970296, 0.882948, -0.743145],
    [0.629320, -0.438371, 0.224951, -0.974370, 0.898794, -0.777146],
    [0.587785, -0.406737, 0.207912, -0.978148, 0.913545, -0.809017],
    [0.544639, -0.374607, 0.190809, -0.981627, 0.927184, -0.838671],
    [0.500000, -0.342020, 0.173648, -0.984808, 0.939693, -0.866025],
    [0.453990, -0.309017, 0.156434, -0.987688, 0.951057, -0.891007],
    [0.406737, -0.275637, 0.139173, -0.990268, 0.961262, -0.913545],
    [0.358368, -0.241922, 0.121869, -0.992546, 0.970296, -0.933580],
    [0.309017, -0.207912, 0.104528, -0.994522, 0.978148, -0.951057],
    [0.258819, -0.173648, 0.087156, -0.996195, 0.984808, -0.965926],
    [0.207912, -0.139173, 0.069756, -0.997564, 0.990268, -0.978148],
    [0.156434, -0.104528, 0.052336, -0.998630, 0.994522, -0.987688],
    [0.104528, -0.069756, 0.034899, -0.999391, 0.997564, -0.994522],
    [0.052336, -0.034899, 0.017452, -0.999848, 0.999391, -0.998630],
    [0.000000, -0.000000, 0.000000, -1.000000, 1.000000, -1.000000],
    [-0.052336, 0.034899, -0.017452, -0.999848, 0.999391, -0.998630],
    [-0.104528, 0.069756, -0.034899, -0.999391, 0.997564, -0.994522],
    [-0.156434, 0.104528, -0.052336, -0.998630, 0.994522, -0.987688],
    [-0.207912, 0.139173, -0.069756, -0.997564, 0.990268, -0.978148],
    [-0.258819, 0.173648, -0.087156, -0.996195, 0.984808, -0.965926],
    [-0.309017, 0.207912, -0.104528, -0.994522, 0.978148, -0.951057],
    [-0.358368, 0.241922, -0.121869, -0.992546, 0.970296, -0.933580],
    [-0.406737, 0.275637, -0.139173, -0.990268, 0.961262, -0.913545],
    [-0.453990, 0.309017, -0.156434, -0.987688, 0.951057, -0.891007],
    [-0.500000, 0.342020, -0.173648, -0.984808, 0.939693, -0.866025],
    [-0.544639, 0.374607, -0.190809, -0.981627, 0.927184, -0.838671],
    [-0.587785, 0.406737, -0.207912, -0.978148, 0.913545, -0.809017],
    [-0.629320, 0.438371, -0.224951, -0.974370, 0.898794, -0.777146],
    [-0.669131, 0.469472, -0.241922, -0.970296, 0.882948, -0.743145],
    [-0.707107, 0.500000, -0.258819, -0.965926, 0.866025, -0.707107],
    [-0.743145, 0.529919, -0.275637, -0.961262, 0.848048, -0.669131],
    [-0.777146, 0.559193, -0.292372, -0.956305, 0.829038, -0.629320],
    [-0.809017, 0.587785, -0.309017, -0.951057, 0.809017, -0.587785],
    [-0.838671, 0.615661, -0.325568, -0.945519, 0.788011, -0.544639],
    [-0.866025, 0.642788, -0.342020, -0.939693, 0.766044, -0.500000],
    [-0.891007, 0.669131, -0.358368, -0.933580, 0.743145, -0.453990],
    [-0.913545, 0.694658, -0.374607, -0.927184, 0.719340, -0.406737],
    [-0.933580, 0.719340, -0.390731, -0.920505, 0.694658, -0.358368],
    [-0.951057, 0.743145, -0.406737, -0.913545, 0.669131, -0.309017],
    [-0.965926, 0.766044, -0.422618, -0.906308, 0.642788, -0.258819],
    [-0.978148, 0.788011, -0.438371, -0.898794, 0.615661, -0.207912],
    [-0.987688, 0.809017, -0.453990, -0.891007, 0.587785, -0.156434],
    [-0.994522, 0.829038, -0.469472, -0.882948, 0.559193, -0.104528],
    [-0.998630, 0.848048, -0.484810, -0.874620, 0.529919, -0.052336],
    [-1.000000, 0.866025, -0.500000, -0.866025, 0.500000, 0.000000],
    [-0.998630, 0.882948, -0.515038, -0.857167, 0.469472, 0.052336],
    [-0.994522, 0.898794, -0.529919, -0.848048, 0.438371, 0.104528],
    [-0.987688, 0.913545, -0.544639, -0.838671, 0.406737, 0.156434],
    [-0.978148, 0.927184, -0.559193, -0.829038, 0.374607, 0.207912],
    [-0.965926, 0.939693, -0.573576, -0.819152, 0.342020, 0.258819],
    [-0.951057, 0.951057, -0.587785, -0.809017, 0.309017, 0.309017],
    [-0.933580, 0.961262, -0.601815, -0.798636, 0.275637, 0.358368],
    [-0.913545, 0.970296, -0.615661, -0.788011, 0.241922, 0.406737],
    [-0.891007, 0.978148, -0.629320, -0.777146, 0.207912, 0.453990],
    [-0.866025, 0.984808, -0.642788, -0.766044, 0.173648, 0.500000],
    [-0.838671, 0.990268, -0.656059, -0.754710, 0.139173, 0.544639],
    [-0.809017, 0.994522, -0.669131, -0.743145, 0.104528, 0.587785],
    [-0.777146, 0.997564, -0.681998, -0.731354, 0.069756, 0.629320],
    [-0.743145, 0.999391, -0.694658, -0.719340, 0.034899, 0.669131],
    [-0.707107, 1.000000, -0.707107, -0.707107, 0.000000, 0.707107],
    [-0.669131, 0.999391, -0.719340, -0.694658, -0.034899, 0.743145],
    [-0.629320, 0.997564, -0.731354, -0.681998, -0.069756, 0.777146],
    [-0.587785, 0.994522, -0.743145, -0.669131, -0.104528, 0.809017],
    [-0.544639, 0.990268, -0.754710, -0.656059, -0.139173, 0.838671],
    [-0.500000, 0.984808, -0.766044, -0.642788, -0.173648, 0.866025],
    [-0.453990, 0.978148, -0.777146, -0.629320, -0.207912, 0.891007],
    [-0.406737, 0.970296, -0.788011, -0.615661, -0.241922, 0.913545],
    [-0.358368, 0.961262, -0.798636, -0.601815, -0.275637, 0.933580],
    [-0.309017, 0.951057, -0.809017, -0.587785, -0.309017, 0.951057],
    [-0.258819, 0.939693, -0.819152, -0.573576, -0.342020, 0.965926],
    [-0.207912, 0.927184, -0.829038, -0.559193, -0.374607, 0.978148],
    [-0.156434, 0.913545, -0.838671, -0.544639, -0.406737, 0.987688],
    [-0.104528, 0.898794, -0.848048, -0.529919, -0.438371, 0.994522],
    [-0.052336, 0.882948, -0.857167, -0.515038, -0.469472, 0.998630],
    [-0.000000, 0.866025, -0.866025, -0.500000, -0.500000, 1.000000],
    [0.052336, 0.848048, -0.874620, -0.484810, -0.529919, 0.998630],
    [0.104528, 0.829038, -0.882948, -0.469472, -0.559193, 0.994522],
    [0.156434, 0.809017, -0.891007, -0.453990, -0.587785, 0.987688],
    [0.207912, 0.788011, -0.898794, -0.438371, -0.615661, 0.978148],
    [0.258819, 0.766044, -0.906308, -0.422618, -0.642788, 0.965926],
    [0.309017, 0.743145, -0.913545, -0.406737, -0.669131, 0.951057],
    [0.358368, 0.719340, -0.920505, -0.390731, -0.694658, 0.933580],
    [0.406737, 0.694658, -0.927184, -0.374607, -0.719340, 0.913545],
    [0.453990, 0.669131, -0.933580, -0.358368, -0.743145, 0.891007],
    [0.500000, 0.642788, -0.939693, -0.342020, -0.766044, 0.866025],
    [0.544639, 0.615661, -0.945519, -0.325568, -0.788011, 0.838671],
    [0.587785, 0.587785, -0.951057, -0.309017, -0.809017, 0.809017],
    [0.629320, 0.559193, -0.956305, -0.292372, -0.829038, 0.777146],
    [0.669131, 0.529919, -0.961262, -0.275637, -0.848048, 0.743145],
    [0.707107, 0.500000, -0.965926, -0.258819, -0.866025, 0.707107],
    [0.743145, 0.469472, -0.970296, -0.241922, -0.882948, 0.669131],
    [0.777146, 0.438371, -0.974370, -0.224951, -0.898794, 0.629320],
    [0.809017, 0.406737, -0.978148, -0.207912, -0.913545, 0.587785],
    [0.838671, 0.374607, -0.981627, -0.190809, -0.927184, 0.544639],
    [0.866025, 0.342020, -0.984808, -0.173648, -0.939693, 0.500000],
    [0.891007, 0.309017, -0.987688, -0.156434, -0.951057, 0.453990],
    [0.913545, 0.275637, -0.990268, -0.139173, -0.961262, 0.406737],
    [0.933580, 0.241922, -0.992546, -0.121869, -0.970296, 0.358368],
    [0.951057, 0.207912, -0.994522, -0.104528, -0.978148, 0.309017],
    [0.965926, 0.173648, -0.996195, -0.087156, -0.984808, 0.258819],
    [0.978148, 0.139173, -0.997564, -0.069756, -0.990268, 0.207912],
    [0.987688, 0.104528, -0.998630, -0.052336, -0.994522, 0.156434],
    [0.994522, 0.069756, -0.999391, -0.034899, -0.997564, 0.104528],
    [0.998630, 0.034899, -0.999848, -0.017452, -0.999391, 0.052336],
    [1.000000, 0.000000, -1.000000, -0.000000, -1.000000, 0.000000],
    [0.998630, -0.034899, -0.999848, 0.017452, -0.999391, -0.052336],
    [0.994522, -0.069756, -0.999391, 0.034899, -0.997564, -0.104528],
    [0.987688, -0.104528, -0.998630, 0.052336, -0.994522, -0.156434],
    [0.978148, -0.139173, -0.997564, 0.069756, -0.990268, -0.207912],
    [0.965926, -0.173648, -0.996195, 0.087156, -0.984808, -0.258819],
    [0.951057, -0.207912, -0.994522, 0.104528, -0.978148, -0.309017],
    [0.933580, -0.241922, -0.992546, 0.121869, -0.970296, -0.358368],
    [0.913545, -0.275637, -0.990268, 0.139173, -0.961262, -0.406737],
    [0.891007, -0.309017, -0.987688, 0.156434, -0.951057, -0.453990],
    [0.866025, -0.342020, -0.984808, 0.173648, -0.939693, -0.500000],
    [0.838671, -0.374607, -0.981627, 0.190809, -0.927184, -0.544639],
    [0.809017, -0.406737, -0.978148, 0.207912, -0.913545, -0.587785],
    [0.777146, -0.438371, -0.974370, 0.224951, -0.898794, -0.629320],
    [0.743145, -0.469472, -0.970296, 0.241922, -0.882948, -0.669131],
    [0.707107, -0.500000, -0.965926, 0.258819, -0.866025, -0.707107],
    [0.669131, -0.529919, -0.961262, 0.275637, -0.848048, -0.743145],
    [0.629320, -0.559193, -0.956305, 0.292372, -0.829038, -0.777146],
    [0.587785, -0.587785, -0.951057, 0.309017, -0.809017, -0.809017],
    [0.544639, -0.615661, -0.945519, 0.325568, -0.788011, -0.838671],
    [0.500000, -0.642788, -0.939693, 0.342020, -0.766044, -0.866025],
    [0.453990, -0.669131, -0.933580, 0.358368, -0.743145, -0.891007],
    [0.406737, -0.694658, -0.927184, 0.374607, -0.719340, -0.913545],
    [0.358368, -0.719340, -0.920505, 0.390731, -0.694658, -0.933580],
    [0.309017, -0.743145, -0.913545, 0.406737, -0.669131, -0.951057],
    [0.258819, -0.766044, -0.906308, 0.422618, -0.642788, -0.965926],
    [0.207912, -0.788011, -0.898794, 0.438371, -0.615661, -0.978148],
    [0.156434, -0.809017, -0.891007, 0.453990, -0.587785, -0.987688],
    [0.104528, -0.829038, -0.882948, 0.469472, -0.559193, -0.994522],
    [0.052336, -0.848048, -0.874620, 0.484810, -0.529919, -0.998630],
    [0.000000, -0.866025, -0.866025, 0.500000, -0.500000, -1.000000],
    [-0.052336, -0.882948, -0.857167, 0.515038, -0.469472, -0.998630],
    [-0.104528, -0.898794, -0.848048, 0.529919, -0.438371, -0.994522],
    [-0.156434, -0.913545, -0.838671, 0.544639, -0.406737, -0.987688],
    [-0.207912, -0.927184, -0.829038, 0.559193, -0.374607, -0.978148],
    [-0.258819, -0.939693, -0.819152, 0.573576, -0.342020, -0.965926],
    [-0.309017, -0.951057, -0.809017, 0.587785, -0.309017, -0.951057],
    [-0.358368, -0.961262, -0.798636, 0.601815, -0.275637, -0.933580],
    [-0.406737, -0.970296, -0.788011, 0.615661, -0.241922, -0.913545],
    [-0.453990, -0.978148, -0.777146, 0.629320, -0.207912, -0.891007],
    [-0.500000, -0.984808, -0.766044, 0.642788, -0.173648, -0.866025],
    [-0.544639, -0.990268, -0.754710, 0.656059, -0.139173, -0.838671],
    [-0.587785, -0.994522, -0.743145, 0.669131, -0.104528, -0.809017],
    [-0.629320, -0.997564, -0.731354, 0.681998, -0.069756, -0.777146],
    [-0.669131, -0.999391, -0.719340, 0.694658, -0.034899, -0.743145],
    [-0.707107, -1.000000, -0.707107, 0.707107, -0.000000, -0.707107],
    [-0.743145, -0.999391, -0.694658, 0.719340, 0.034899, -0.669131],
    [-0.777146, -0.997564, -0.681998, 0.731354, 0.069756, -0.629320],
    [-0.809017, -0.994522, -0.669131, 0.743145, 0.104528, -0.587785],
    [-0.838671, -0.990268, -0.656059, 0.754710, 0.139173, -0.544639],
    [-0.866025, -0.984808, -0.642788, 0.766044, 0.173648, -0.500000],
    [-0.891007, -0.978148, -0.629320, 0.777146, 0.207912, -0.453990],
    [-0.913545, -0.970296, -0.615661, 0.788011, 0.241922, -0.406737],
    [-0.933580, -0.961262, -0.601815, 0.798636, 0.275637, -0.358368],
    [-0.951057, -0.951057, -0.587785, 0.809017, 0.309017, -0.309017],
    [-0.965926, -0.939693, -0.573576, 0.819152, 0.342020, -0.258819],
    [-0.978148, -0.927184, -0.559193, 0.829038, 0.374607, -0.207912],
    [-0.987688, -0.913545, -0.544639, 0.838671, 0.406737, -0.156434],
    [-0.994522, -0.898794, -0.529919, 0.848048, 0.438371, -0.104528],
    [-0.998630, -0.882948, -0.515038, 0.857167, 0.469472, -0.052336],
    [-1.000000, -0.866025, -0.500000, 0.866025, 0.500000, -0.000000],
    [-0.998630, -0.848048, -0.484810, 0.874620, 0.529919, 0.052336],
    [-0.994522, -0.829038, -0.469472, 0.882948, 0.559193, 0.104528],
    [-0.987688, -0.809017, -0.453990, 0.891007, 0.587785, 0.156434],
    [-0.978148, -0.788011, -0.438371, 0.898794, 0.615661, 0.207912],
    [-0.965926, -0.766044, -0.422618, 0.906308, 0.642788, 0.258819],
    [-0.951057, -0.743145, -0.406737, 0.913545, 0.669131, 0.309017],
    [-0.933580, -0.719340, -0.390731, 0.920505, 0.694658, 0.358368],
    [-0.913545, -0.694658, -0.374607, 0.927184, 0.719340, 0.406737],
    [-0.891007, -0.669131, -0.358368, 0.933580, 0.743145, 0.453990],
    [-0.866025, -0.642788, -0.342020, 0.939693, 0.766044, 0.500000],
    [-0.838671, -0.615661, -0.325568, 0.945519, 0.788011, 0.544639],
    [-0.809017, -0.587785, -0.309017, 0.951057, 0.809017, 0.587785],
    [-0.777146, -0.559193, -0.292372, 0.956305, 0.829038, 0.629320],
    [-0.743145, -0.529919, -0.275637, 0.961262, 0.848048, 0.669131],
    [-0.707107, -0.500000, -0.258819, 0.965926, 0.866025, 0.707107],
    [-0.669131, -0.469472, -0.241922, 0.970296, 0.882948, 0.743145],
    [-0.629320, -0.438371, -0.224951, 0.974370, 0.898794, 0.777146],
    [-0.587785, -0.406737, -0.207912, 0.978148, 0.913545, 0.809017],
    [-0.544639, -0.374607, -0.190809, 0.981627, 0.927184, 0.838671],
    [-0.500000, -0.342020, -0.173648, 0.984808, 0.939693, 0.866025],
    [-0.453990, -0.309017, -0.156434, 0.987688, 0.951057, 0.891007],
    [-0.406737, -0.275637, -0.139173, 0.990268, 0.961262, 0.913545],
    [-0.358368, -0.241922, -0.121869, 0.992546, 0.970296, 0.933580],
    [-0.309017, -0.207912, -0.104528, 0.994522, 0.978148, 0.951057],
    [-0.258819, -0.173648, -0.087156, 0.996195, 0.984808, 0.965926],
    [-0.207912, -0.139173, -0.069756, 0.997564, 0.990268, 0.978148],
    [-0.156434, -0.104528, -0.052336, 0.998630, 0.994522, 0.987688],
    [-0.104528, -0.069756, -0.034899, 0.999391, 0.997564, 0.994522],
    [-0.052336, -0.034899, -0.017452, 0.999848, 0.999391, 0.998630],
  ],
  [
    [-1.000000, -0.000000, 1.000000, -0.000000, 0.000000,
     -1.000000, -0.000000, 0.000000, -0.000000],
    [-0.999848, 0.017452, 0.999543, -0.030224, 0.000264,
     -0.999086, 0.042733, -0.000590, 0.000004],
    [-0.999391, 0.034899, 0.998173, -0.060411, 0.001055,
     -0.996348, 0.085356, -0.002357, 0.000034],
    [-0.998630, 0.052336, 0.995891, -0.090524, 0.002372,
     -0.991791, 0.127757, -0.005297, 0.000113],
    [-0.997564, 0.069756, 0.992701, -0.120527, 0.004214,
     -0.985429, 0.169828, -0.009400, 0.000268],
    [-0.996195, 0.087156, 0.988606, -0.150384, 0.006578,
     -0.977277, 0.211460, -0.014654, 0.000523],
    [-0.994522, 0.104528, 0.983611, -0.180057, 0.009462,
     -0.967356, 0.252544, -0.021043, 0.000903],
    [-0.992546, 0.121869, 0.977722, -0.209511, 0.012862,
     -0.955693, 0.292976, -0.028547, 0.001431],
    [-0.990268, 0.139173, 0.970946, -0.238709, 0.016774,
     -0.942316, 0.332649, -0.037143, 0.002131],
    [-0.987688, 0.156434, 0.963292, -0.267617, 0.021193,
     -0.927262, 0.371463, -0.046806, 0.003026],
    [-0.984808, 0.173648, 0.954769, -0.296198, 0.026114,
     -0.910569, 0.409317, -0.057505, 0.004140],
    [-0.981627, 0.190809, 0.945388, -0.324419, 0.031530,
     -0.892279, 0.446114, -0.069209, 0.005492],
    [-0.978148, 0.207912, 0.935159, -0.352244, 0.037436,
     -0.872441, 0.481759, -0.081880, 0.007105],
    [-0.974370, 0.224951, 0.924096, -0.379641, 0.043823,
     -0.851105, 0.516162, -0.095481, 0.008999],
    [-0.970296, 0.241922, 0.912211, -0.406574, 0.050685,
     -0.828326, 0.549233, -0.109969, 0.011193],
    [-0.965926, 0.258819, 0.899519, -0.433013, 0.058013,
     -0.804164, 0.580889, -0.125300, 0.013707],
    [-0.961262, 0.275637, 0.886036, -0.458924, 0.065797,
     -0.778680, 0.611050, -0.141427, 0.016556],
    [-0.956305, 0.292372, 0.871778, -0.484275, 0.074029,
     -0.751940, 0.639639, -0.158301, 0.019758],
    [-0.951057, 0.309017, 0.856763, -0.509037, 0.082698,
     -0.724012, 0.666583, -0.175868, 0.023329],
    [-0.945519, 0.325568, 0.841008, -0.533178, 0.091794,
     -0.694969, 0.691816, -0.194075, 0.027281],
    [-0.939693, 0.342020, 0.824533, -0.556670, 0.101306,
     -0.664885, 0.715274, -0.212865, 0.031630],
    [-0.933580, 0.358368, 0.807359, -0.579484, 0.111222,
     -0.633837, 0.736898, -0.232180, 0.036385],
    [-0.927184, 0.374607, 0.789505, -0.601592, 0.121529,
     -0.601904, 0.756637, -0.251960, 0.041559],
    [-0.920505, 0.390731, 0.770994, -0.622967, 0.132217,
     -0.569169, 0.774442, -0.272143, 0.047160],
    [-0.913545, 0.406737, 0.751848, -0.643582, 0.143271,
     -0.535715, 0.790270, -0.292666, 0.053196],
    [-0.906308, 0.422618, 0.732091, -0.663414, 0.154678,
     -0.501627, 0.804083, -0.313464, 0.059674],
    [-0.898794, 0.438371, 0.711746, -0.682437, 0.166423,
     -0.466993, 0.815850, -0.334472, 0.066599],
    [-0.891007, 0.453990, 0.690839, -0.700629, 0.178494,
     -0.431899, 0.825544, -0.355623, 0.073974],
    [-0.882948, 0.469472, 0.669395, -0.717968, 0.190875,
     -0.396436, 0.833145, -0.376851, 0.081803],
    [-0.874620, 0.484810, 0.647439, -0.734431, 0.203551,
     -0.360692, 0.838638, -0.398086, 0.090085],
    [-0.866025, 0.500000, 0.625000, -0.750000, 0.216506,
     -0.324760, 0.842012, -0.419263, 0.098821],
    [-0.857167, 0.515038, 0.602104, -0.764655, 0.229726,
     -0.288728, 0.843265, -0.440311, 0.108009],
    [-0.848048, 0.529919, 0.578778, -0.778378, 0.243192,
     -0.252688, 0.842399, -0.461164, 0.117644],
    [-0.838671, 0.544639, 0.555052, -0.791154, 0.256891,
     -0.216730, 0.839422, -0.481753, 0.127722],
    [-0.829038, 0.559193, 0.530955, -0.802965, 0.270803,
     -0.180944, 0.834347, -0.502011, 0.138237],
    [-0.819152, 0.573576, 0.506515, -0.813798, 0.284914,
     -0.145420, 0.827194, -0.521871, 0.149181],
    [-0.809017, 0.587785, 0.481763, -0.823639, 0.299204,
     -0.110246, 0.817987, -0.541266, 0.160545],
    [-0.798636, 0.601815, 0.456728, -0.832477, 0.313658,
     -0.075508, 0.806757, -0.560132, 0.172317],
    [-0.788011, 0.615661, 0.431441, -0.840301, 0.328257,
     -0.041294, 0.793541, -0.578405, 0.184487],
    [-0.777146, 0.629320, 0.405934, -0.847101, 0.342984,
     -0.007686, 0.778379, -0.596021, 0.197040],
    [-0.766044, 0.642788, 0.380236, -0.852869, 0.357821,
     0.025233, 0.761319, -0.612921, 0.209963],
    [-0.754710, 0.656059, 0.354380, -0.857597, 0.372749,
     0.057383, 0.742412, -0.629044, 0.223238],
    [-0.743145, 0.669131, 0.328396, -0.861281, 0.387751,
     0.088686, 0.721714, -0.644334, 0.236850],
    [-0.731354, 0.681998, 0.302317, -0.863916, 0.402807,
     0.119068, 0.699288, -0.658734, 0.250778],
    [-0.719340, 0.694658, 0.276175, -0.865498, 0.417901,
     0.148454, 0.675199, -0.672190, 0.265005],
    [-0.707107, 0.707107, 0.250000, -0.866025, 0.433013,
     0.176777, 0.649519, -0.684653, 0.279508],
    [-0.694658, 0.719340, 0.223825, -0.865498, 0.448125,
     0.203969, 0.622322, -0.696073, 0.294267],
    [-0.681998, 0.731354, 0.197683, -0.863916, 0.463218,
     0.229967, 0.593688, -0.706405, 0.309259],
    [-0.669131, 0.743145, 0.171604, -0.861281, 0.478275,
     0.254712, 0.563700, -0.715605, 0.324459],
    [-0.656059, 0.754710, 0.145620, -0.857597, 0.493276,
     0.278147, 0.532443, -0.723633, 0.339844],
    [-0.642788, 0.766044, 0.119764, -0.852869, 0.508205,
     0.300221, 0.500009, -0.730451, 0.355387],
    [-0.629320, 0.777146, 0.094066, -0.847101, 0.523041,
     0.320884, 0.466490, -0.736025, 0.371063],
    [-0.615661, 0.788011, 0.068559, -0.840301, 0.537768,
     0.340093, 0.431982, -0.740324, 0.386845],
    [-0.601815, 0.798636, 0.043272, -0.832477, 0.552367,
     0.357807, 0.396584, -0.743320, 0.402704],
    [-0.587785, 0.809017, 0.018237, -0.823639, 0.566821,
     0.373991, 0.360397, -0.744989, 0.418613],
    [-0.573576, 0.819152, -0.006515, -0.813798, 0.581112,
     0.388612, 0.323524, -0.745308, 0.434544],
    [-0.559193, 0.829038, -0.030955, -0.802965, 0.595222,
     0.401645, 0.286069, -0.744262, 0.450467],
    [-0.544639, 0.838671, -0.055052, -0.791154, 0.609135,
     0.413066, 0.248140, -0.741835, 0.466352],
    [-0.529919, 0.848048, -0.078778, -0.778378, 0.622833,
     0.422856, 0.209843, -0.738017, 0.482171],
    [-0.515038, 0.857167, -0.102104, -0.764655, 0.636300,
     0.431004, 0.171288, -0.732801, 0.497894],
    [-0.500000, 0.866025, -0.125000, -0.750000, 0.649519,
     0.437500, 0.132583, -0.726184, 0.513490],
    [-0.484810, 0.874620, -0.147439, -0.734431, 0.662474,
     0.442340, 0.093837, -0.718167, 0.528929],
    [-0.469472, 0.882948, -0.169395, -0.717968, 0.675150,
     0.445524, 0.055160, -0.708753, 0.544183],
    [-0.453990, 0.891007, -0.190839, -0.700629, 0.687531,
     0.447059, 0.016662, -0.697950, 0.559220],
    [-0.438371, 0.898794, -0.211746, -0.682437, 0.699602,
     0.446953, -0.021550, -0.685769, 0.574011],
    [-0.422618, 0.906308, -0.232091, -0.663414, 0.711348,
     0.445222, -0.059368, -0.672226, 0.588528],
    [-0.406737, 0.913545, -0.251848, -0.643582, 0.722755,
     0.441884, -0.096684, -0.657339, 0.602741],
    [-0.390731, 0.920505, -0.270994, -0.622967, 0.733809,
     0.436964, -0.133395, -0.641130, 0.616621],
    [-0.374607, 0.927184, -0.289505, -0.601592, 0.744496,
     0.430488, -0.169397, -0.623624, 0.630141],
    [-0.358368, 0.933580, -0.307359, -0.579484, 0.754804,
     0.422491, -0.204589, -0.604851, 0.643273],
    [-0.342020, 0.939693, -0.324533, -0.556670, 0.764720,
     0.413008, -0.238872, -0.584843, 0.655990],
    [-0.325568, 0.945519, -0.341008, -0.533178, 0.774231,
     0.402081, -0.272150, -0.563635, 0.668267],
    [-0.309017, 0.951057, -0.356763, -0.509037, 0.783327,
     0.389754, -0.304329, -0.541266, 0.680078],
    [-0.292372, 0.956305, -0.371778, -0.484275, 0.791997,
     0.376077, -0.335319, -0.517778, 0.691399],
    [-0.275637, 0.961262, -0.386036, -0.458924, 0.800228,
     0.361102, -0.365034, -0.493216, 0.702207],
    [-0.258819, 0.965926, -0.399519, -0.433013, 0.808013,
     0.344885, -0.393389, -0.467627, 0.712478],
    [-0.241922, 0.970296, -0.412211, -0.406574, 0.815340,
     0.327486, -0.420306, -0.441061, 0.722191],
    [-0.224951, 0.974370, -0.424096, -0.379641, 0.822202,
     0.308969, -0.445709, -0.413572, 0.731327],
    [-0.207912, 0.978148, -0.435159, -0.352244, 0.828589,
     0.289399, -0.469527, -0.385215, 0.739866],
    [-0.190809, 0.981627, -0.445388, -0.324419, 0.834495,
     0.268846, -0.491693, -0.356047, 0.747790],
    [-0.173648, 0.984808, -0.454769, -0.296198, 0.839912,
     0.247382, -0.512145, -0.326129, 0.755082],
    [-0.156434, 0.987688, -0.463292, -0.267617, 0.844832,
     0.225081, -0.530827, -0.295521, 0.761728],
    [-0.139173, 0.990268, -0.470946, -0.238709, 0.849251,
     0.202020, -0.547684, -0.264287, 0.767712],
    [-0.121869, 0.992546, -0.477722, -0.209511, 0.853163,
     0.178279, -0.562672, -0.232494, 0.773023],
    [-0.104528, 0.994522, -0.483611, -0.180057, 0.856563,
     0.153937, -0.575747, -0.200207, 0.777648],
    [-0.087156, 0.996195, -0.488606, -0.150384, 0.859447,
     0.129078, -0.586872, -0.167494, 0.781579],
    [-0.069756, 0.997564, -0.492701, -0.120527, 0.861811,
     0.103786, -0.596018, -0.134426, 0.784806],
    [-0.052336, 0.998630, -0.495891, -0.090524, 0.863653,
     0.078146, -0.603158, -0.101071, 0.787324],
    [-0.034899, 0.999391, -0.498173, -0.060411, 0.864971,
     0.052243, -0.608272, -0.067500, 0.789126],
    [-0.017452, 0.999848, -0.499543, -0.030224, 0.865762,
     0.026165, -0.611347, -0.033786, 0.790208],
    [0.000000, 1.000000, -0.500000, 0.000000, 0.866025,
     -0.000000, -0.612372, 0.000000, 0.790569],
    [0.017452, 0.999848, -0.499543, 0.030224, 0.865762,
     -0.026165, -0.611347, 0.033786, 0.790208],
    [0.034899, 0.999391, -0.498173, 0.060411, 0.864971,
     -0.052243, -0.608272, 0.067500, 0.789126],
    [0.052336, 0.998630, -0.495891, 0.090524, 0.863653,
     -0.078146, -0.603158, 0.101071, 0.787324],
    [0.069756, 0.997564, -0.492701, 0.120527, 0.861811,
     -0.103786, -0.596018, 0.134426, 0.784806],
    [0.087156, 0.996195, -0.488606, 0.150384, 0.859447,
     -0.129078, -0.586872, 0.167494, 0.781579],
    [0.104528, 0.994522, -0.483611, 0.180057, 0.856563,
     -0.153937, -0.575747, 0.200207, 0.777648],
    [0.121869, 0.992546, -0.477722, 0.209511, 0.853163,
     -0.178279, -0.562672, 0.232494, 0.773023],
    [0.139173, 0.990268, -0.470946, 0.238709, 0.849251,
     -0.202020, -0.547684, 0.264287, 0.767712],
    [0.156434, 0.987688, -0.463292, 0.267617, 0.844832,
     -0.225081, -0.530827, 0.295521, 0.761728],
    [0.173648, 0.984808, -0.454769, 0.296198, 0.839912,
     -0.247382, -0.512145, 0.326129, 0.755082],
    [0.190809, 0.981627, -0.445388, 0.324419, 0.834495,
     -0.268846, -0.491693, 0.356047, 0.747790],
    [0.207912, 0.978148, -0.435159, 0.352244, 0.828589,
     -0.289399, -0.469527, 0.385215, 0.739866],
    [0.224951, 0.974370, -0.424096, 0.379641, 0.822202,
     -0.308969, -0.445709, 0.413572, 0.731327],
    [0.241922, 0.970296, -0.412211, 0.406574, 0.815340,
     -0.327486, -0.420306, 0.441061, 0.722191],
    [0.258819, 0.965926, -0.399519, 0.433013, 0.808013,
     -0.344885, -0.393389, 0.467627, 0.712478],
    [0.275637, 0.961262, -0.386036, 0.458924, 0.800228,
     -0.361102, -0.365034, 0.493216, 0.702207],
    [0.292372, 0.956305, -0.371778, 0.484275, 0.791997,
     -0.376077, -0.335319, 0.517778, 0.691399],
    [0.309017, 0.951057, -0.356763, 0.509037, 0.783327,
     -0.389754, -0.304329, 0.541266, 0.680078],
    [0.325568, 0.945519, -0.341008, 0.533178, 0.774231,
     -0.402081, -0.272150, 0.563635, 0.668267],
    [0.342020, 0.939693, -0.324533, 0.556670, 0.764720,
     -0.413008, -0.238872, 0.584843, 0.655990],
    [0.358368, 0.933580, -0.307359, 0.579484, 0.754804,
     -0.422491, -0.204589, 0.604851, 0.643273],
    [0.374607, 0.927184, -0.289505, 0.601592, 0.744496,
     -0.430488, -0.169397, 0.623624, 0.630141],
    [0.390731, 0.920505, -0.270994, 0.622967, 0.733809,
     -0.436964, -0.133395, 0.641130, 0.616621],
    [0.406737, 0.913545, -0.251848, 0.643582, 0.722755,
     -0.441884, -0.096684, 0.657339, 0.602741],
    [0.422618, 0.906308, -0.232091, 0.663414, 0.711348,
     -0.445222, -0.059368, 0.672226, 0.588528],
    [0.438371, 0.898794, -0.211746, 0.682437, 0.699602,
     -0.446953, -0.021550, 0.685769, 0.574011],
    [0.453990, 0.891007, -0.190839, 0.700629, 0.687531,
     -0.447059, 0.016662, 0.697950, 0.559220],
    [0.469472, 0.882948, -0.169395, 0.717968, 0.675150,
     -0.445524, 0.055160, 0.708753, 0.544183],
    [0.484810, 0.874620, -0.147439, 0.734431, 0.662474,
     -0.442340, 0.093837, 0.718167, 0.528929],
    [0.500000, 0.866025, -0.125000, 0.750000, 0.649519,
     -0.437500, 0.132583, 0.726184, 0.513490],
    [0.515038, 0.857167, -0.102104, 0.764655, 0.636300,
     -0.431004, 0.171288, 0.732801, 0.497894],
    [0.529919, 0.848048, -0.078778, 0.778378, 0.622833,
     -0.422856, 0.209843, 0.738017, 0.482171],
    [0.544639, 0.838671, -0.055052, 0.791154, 0.609135,
     -0.413066, 0.248140, 0.741835, 0.466352],
    [0.559193, 0.829038, -0.030955, 0.802965, 0.595222,
     -0.401645, 0.286069, 0.744262, 0.450467],
    [0.573576, 0.819152, -0.006515, 0.813798, 0.581112,
     -0.388612, 0.323524, 0.745308, 0.434544],
    [0.587785, 0.809017, 0.018237, 0.823639, 0.566821,
     -0.373991, 0.360397, 0.744989, 0.418613],
    [0.601815, 0.798636, 0.043272, 0.832477, 0.552367,
     -0.357807, 0.396584, 0.743320, 0.402704],
    [0.615661, 0.788011, 0.068559, 0.840301, 0.537768,
     -0.340093, 0.431982, 0.740324, 0.386845],
    [0.629320, 0.777146, 0.094066, 0.847101, 0.523041,
     -0.320884, 0.466490, 0.736025, 0.371063],
    [0.642788, 0.766044, 0.119764, 0.852869, 0.508205,
     -0.300221, 0.500009, 0.730451, 0.355387],
    [0.656059, 0.754710, 0.145620, 0.857597, 0.493276,
     -0.278147, 0.532443, 0.723633, 0.339844],
    [0.669131, 0.743145, 0.171604, 0.861281, 0.478275,
     -0.254712, 0.563700, 0.715605, 0.324459],
    [0.681998, 0.731354, 0.197683, 0.863916, 0.463218,
     -0.229967, 0.593688, 0.706405, 0.309259],
    [0.694658, 0.719340, 0.223825, 0.865498, 0.448125,
     -0.203969, 0.622322, 0.696073, 0.294267],
    [0.707107, 0.707107, 0.250000, 0.866025, 0.433013,
     -0.176777, 0.649519, 0.684653, 0.279508],
    [0.719340, 0.694658, 0.276175, 0.865498, 0.417901,
     -0.148454, 0.675199, 0.672190, 0.265005],
    [0.731354, 0.681998, 0.302317, 0.863916, 0.402807,
     -0.119068, 0.699288, 0.658734, 0.250778],
    [0.743145, 0.669131, 0.328396, 0.861281, 0.387751,
     -0.088686, 0.721714, 0.644334, 0.236850],
    [0.754710, 0.656059, 0.354380, 0.857597, 0.372749,
     -0.057383, 0.742412, 0.629044, 0.223238],
    [0.766044, 0.642788, 0.380236, 0.852869, 0.357821,
     -0.025233, 0.761319, 0.612921, 0.209963],
    [0.777146, 0.629320, 0.405934, 0.847101, 0.342984,
     0.007686, 0.778379, 0.596021, 0.197040],
    [0.788011, 0.615661, 0.431441, 0.840301, 0.328257,
     0.041294, 0.793541, 0.578405, 0.184487],
    [0.798636, 0.601815, 0.456728, 0.832477, 0.313658,
     0.075508, 0.806757, 0.560132, 0.172317],
    [0.809017, 0.587785, 0.481763, 0.823639, 0.299204,
     0.110246, 0.817987, 0.541266, 0.160545],
    [0.819152, 0.573576, 0.506515, 0.813798, 0.284914,
     0.145420, 0.827194, 0.521871, 0.149181],
    [0.829038, 0.559193, 0.530955, 0.802965, 0.270803,
     0.180944, 0.834347, 0.502011, 0.138237],
    [0.838671, 0.544639, 0.555052, 0.791154, 0.256891,
     0.216730, 0.839422, 0.481753, 0.127722],
    [0.848048, 0.529919, 0.578778, 0.778378, 0.243192,
     0.252688, 0.842399, 0.461164, 0.117644],
    [0.857167, 0.515038, 0.602104, 0.764655, 0.229726,
     0.288728, 0.843265, 0.440311, 0.108009],
    [0.866025, 0.500000, 0.625000, 0.750000, 0.216506,
     0.324760, 0.842012, 0.419263, 0.098821],
    [0.874620, 0.484810, 0.647439, 0.734431, 0.203551,
     0.360692, 0.838638, 0.398086, 0.090085],
    [0.882948, 0.469472, 0.669395, 0.717968, 0.190875,
     0.396436, 0.833145, 0.376851, 0.081803],
    [0.891007, 0.453990, 0.690839, 0.700629, 0.178494,
     0.431899, 0.825544, 0.355623, 0.073974],
    [0.898794, 0.438371, 0.711746, 0.682437, 0.166423,
     0.466993, 0.815850, 0.334472, 0.066599],
    [0.906308, 0.422618, 0.732091, 0.663414, 0.154678,
     0.501627, 0.804083, 0.313464, 0.059674],
    [0.913545, 0.406737, 0.751848, 0.643582, 0.143271,
     0.535715, 0.790270, 0.292666, 0.053196],
    [0.920505, 0.390731, 0.770994, 0.622967, 0.132217,
     0.569169, 0.774442, 0.272143, 0.047160],
    [0.927184, 0.374607, 0.789505, 0.601592, 0.121529,
     0.601904, 0.756637, 0.251960, 0.041559],
    [0.933580, 0.358368, 0.807359, 0.579484, 0.111222,
     0.633837, 0.736898, 0.232180, 0.036385],
    [0.939693, 0.342020, 0.824533, 0.556670, 0.101306,
     0.664885, 0.715274, 0.212865, 0.031630],
    [0.945519, 0.325568, 0.841008, 0.533178, 0.091794,
     0.694969, 0.691816, 0.194075, 0.027281],
    [0.951057, 0.309017, 0.856763, 0.509037, 0.082698,
     0.724012, 0.666583, 0.175868, 0.023329],
    [0.956305, 0.292372, 0.871778, 0.484275, 0.074029,
     0.751940, 0.639639, 0.158301, 0.019758],
    [0.961262, 0.275637, 0.886036, 0.458924, 0.065797,
     0.778680, 0.611050, 0.141427, 0.016556],
    [0.965926, 0.258819, 0.899519, 0.433013, 0.058013,
     0.804164, 0.580889, 0.125300, 0.013707],
    [0.970296, 0.241922, 0.912211, 0.406574, 0.050685,
     0.828326, 0.549233, 0.109969, 0.011193],
    [0.974370, 0.224951, 0.924096, 0.379641, 0.043823,
     0.851105, 0.516162, 0.095481, 0.008999],
    [0.978148, 0.207912, 0.935159, 0.352244, 0.037436,
     0.872441, 0.481759, 0.081880, 0.007105],
    [0.981627, 0.190809, 0.945388, 0.324419, 0.031530,
     0.892279, 0.446114, 0.069209, 0.005492],
    [0.984808, 0.173648, 0.954769, 0.296198, 0.026114,
     0.910569, 0.409317, 0.057505, 0.004140],
    [0.987688, 0.156434, 0.963292, 0.267617, 0.021193,
     0.927262, 0.371463, 0.046806, 0.003026],
    [0.990268, 0.139173, 0.970946, 0.238709, 0.016774,
     0.942316, 0.332649, 0.037143, 0.002131],
    [0.992546, 0.121869, 0.977722, 0.209511, 0.012862,
     0.955693, 0.292976, 0.028547, 0.001431],
    [0.994522, 0.104528, 0.983611, 0.180057, 0.009462,
     0.967356, 0.252544, 0.021043, 0.000903],
    [0.996195, 0.087156, 0.988606, 0.150384, 0.006578,
     0.977277, 0.211460, 0.014654, 0.000523],
    [0.997564, 0.069756, 0.992701, 0.120527, 0.004214,
     0.985429, 0.169828, 0.009400, 0.000268],
    [0.998630, 0.052336, 0.995891, 0.090524, 0.002372,
     0.991791, 0.127757, 0.005297, 0.000113],
    [0.999391, 0.034899, 0.998173, 0.060411, 0.001055,
     0.996348, 0.085356, 0.002357, 0.000034],
    [0.999848, 0.017452, 0.999543, 0.030224, 0.000264,
     0.999086, 0.042733, 0.000590, 0.000004],
    [1.000000, -0.000000, 1.000000, -0.000000, 0.000000,
     1.000000, -0.000000, 0.000000, -0.000000],
  ],
];


/** @type {Number} */
exports.SPHERICAL_HARMONICS_AZIMUTH_RESOLUTION =
  exports.SPHERICAL_HARMONICS[0].length;


/** @type {Number} */
exports.SPHERICAL_HARMONICS_ELEVATION_RESOLUTION =
  exports.SPHERICAL_HARMONICS[1].length;


/**
 * The maximum allowed ambisonic order.
 * @type {Number}
 */
exports.SPHERICAL_HARMONICS_MAX_ORDER =
  exports.SPHERICAL_HARMONICS[0][0].length / 2;


/**
 * Pre-computed per-band weighting coefficients for producing energy-preserving
 * Max-Re sources.
 */
exports.MAX_RE_WEIGHTS =
[
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.003236, 1.002156, 0.999152, 0.990038],
  [1.032370, 1.021194, 0.990433, 0.898572],
  [1.062694, 1.040231, 0.979161, 0.799806],
  [1.093999, 1.058954, 0.964976, 0.693603],
  [1.126003, 1.077006, 0.947526, 0.579890],
  [1.158345, 1.093982, 0.926474, 0.458690],
  [1.190590, 1.109437, 0.901512, 0.330158],
  [1.222228, 1.122890, 0.872370, 0.194621],
  [1.252684, 1.133837, 0.838839, 0.052614],
  [1.281987, 1.142358, 0.801199, 0.000000],
  [1.312073, 1.150207, 0.760839, 0.000000],
  [1.343011, 1.157424, 0.717799, 0.000000],
  [1.374649, 1.163859, 0.671999, 0.000000],
  [1.406809, 1.169354, 0.623371, 0.000000],
  [1.439286, 1.173739, 0.571868, 0.000000],
  [1.471846, 1.176837, 0.517465, 0.000000],
  [1.504226, 1.178465, 0.460174, 0.000000],
  [1.536133, 1.178438, 0.400043, 0.000000],
  [1.567253, 1.176573, 0.337165, 0.000000],
  [1.597247, 1.172695, 0.271688, 0.000000],
  [1.625766, 1.166645, 0.203815, 0.000000],
  [1.652455, 1.158285, 0.133806, 0.000000],
  [1.676966, 1.147506, 0.061983, 0.000000],
  [1.699006, 1.134261, 0.000000, 0.000000],
  [1.720224, 1.119789, 0.000000, 0.000000],
  [1.741631, 1.104810, 0.000000, 0.000000],
  [1.763183, 1.089330, 0.000000, 0.000000],
  [1.784837, 1.073356, 0.000000, 0.000000],
  [1.806548, 1.056898, 0.000000, 0.000000],
  [1.828269, 1.039968, 0.000000, 0.000000],
  [1.849952, 1.022580, 0.000000, 0.000000],
  [1.871552, 1.004752, 0.000000, 0.000000],
  [1.893018, 0.986504, 0.000000, 0.000000],
  [1.914305, 0.967857, 0.000000, 0.000000],
  [1.935366, 0.948837, 0.000000, 0.000000],
  [1.956154, 0.929471, 0.000000, 0.000000],
  [1.976625, 0.909790, 0.000000, 0.000000],
  [1.996736, 0.889823, 0.000000, 0.000000],
  [2.016448, 0.869607, 0.000000, 0.000000],
  [2.035721, 0.849175, 0.000000, 0.000000],
  [2.054522, 0.828565, 0.000000, 0.000000],
  [2.072818, 0.807816, 0.000000, 0.000000],
  [2.090581, 0.786964, 0.000000, 0.000000],
  [2.107785, 0.766051, 0.000000, 0.000000],
  [2.124411, 0.745115, 0.000000, 0.000000],
  [2.140439, 0.724196, 0.000000, 0.000000],
  [2.155856, 0.703332, 0.000000, 0.000000],
  [2.170653, 0.682561, 0.000000, 0.000000],
  [2.184823, 0.661921, 0.000000, 0.000000],
  [2.198364, 0.641445, 0.000000, 0.000000],
  [2.211275, 0.621169, 0.000000, 0.000000],
  [2.223562, 0.601125, 0.000000, 0.000000],
  [2.235230, 0.581341, 0.000000, 0.000000],
  [2.246289, 0.561847, 0.000000, 0.000000],
  [2.256751, 0.542667, 0.000000, 0.000000],
  [2.266631, 0.523826, 0.000000, 0.000000],
  [2.275943, 0.505344, 0.000000, 0.000000],
  [2.284707, 0.487239, 0.000000, 0.000000],
  [2.292939, 0.469528, 0.000000, 0.000000],
  [2.300661, 0.452225, 0.000000, 0.000000],
  [2.307892, 0.435342, 0.000000, 0.000000],
  [2.314654, 0.418888, 0.000000, 0.000000],
  [2.320969, 0.402870, 0.000000, 0.000000],
  [2.326858, 0.387294, 0.000000, 0.000000],
  [2.332343, 0.372164, 0.000000, 0.000000],
  [2.337445, 0.357481, 0.000000, 0.000000],
  [2.342186, 0.343246, 0.000000, 0.000000],
  [2.346585, 0.329458, 0.000000, 0.000000],
  [2.350664, 0.316113, 0.000000, 0.000000],
  [2.354442, 0.303208, 0.000000, 0.000000],
  [2.357937, 0.290738, 0.000000, 0.000000],
  [2.361168, 0.278698, 0.000000, 0.000000],
  [2.364152, 0.267080, 0.000000, 0.000000],
  [2.366906, 0.255878, 0.000000, 0.000000],
  [2.369446, 0.245082, 0.000000, 0.000000],
  [2.371786, 0.234685, 0.000000, 0.000000],
  [2.373940, 0.224677, 0.000000, 0.000000],
  [2.375923, 0.215048, 0.000000, 0.000000],
  [2.377745, 0.205790, 0.000000, 0.000000],
  [2.379421, 0.196891, 0.000000, 0.000000],
  [2.380959, 0.188342, 0.000000, 0.000000],
  [2.382372, 0.180132, 0.000000, 0.000000],
  [2.383667, 0.172251, 0.000000, 0.000000],
  [2.384856, 0.164689, 0.000000, 0.000000],
  [2.385945, 0.157435, 0.000000, 0.000000],
  [2.386943, 0.150479, 0.000000, 0.000000],
  [2.387857, 0.143811, 0.000000, 0.000000],
  [2.388694, 0.137421, 0.000000, 0.000000],
  [2.389460, 0.131299, 0.000000, 0.000000],
  [2.390160, 0.125435, 0.000000, 0.000000],
  [2.390801, 0.119820, 0.000000, 0.000000],
  [2.391386, 0.114445, 0.000000, 0.000000],
  [2.391921, 0.109300, 0.000000, 0.000000],
  [2.392410, 0.104376, 0.000000, 0.000000],
  [2.392857, 0.099666, 0.000000, 0.000000],
  [2.393265, 0.095160, 0.000000, 0.000000],
  [2.393637, 0.090851, 0.000000, 0.000000],
  [2.393977, 0.086731, 0.000000, 0.000000],
  [2.394288, 0.082791, 0.000000, 0.000000],
  [2.394571, 0.079025, 0.000000, 0.000000],
  [2.394829, 0.075426, 0.000000, 0.000000],
  [2.395064, 0.071986, 0.000000, 0.000000],
  [2.395279, 0.068699, 0.000000, 0.000000],
  [2.395475, 0.065558, 0.000000, 0.000000],
  [2.395653, 0.062558, 0.000000, 0.000000],
  [2.395816, 0.059693, 0.000000, 0.000000],
  [2.395964, 0.056955, 0.000000, 0.000000],
  [2.396099, 0.054341, 0.000000, 0.000000],
  [2.396222, 0.051845, 0.000000, 0.000000],
  [2.396334, 0.049462, 0.000000, 0.000000],
  [2.396436, 0.047186, 0.000000, 0.000000],
  [2.396529, 0.045013, 0.000000, 0.000000],
  [2.396613, 0.042939, 0.000000, 0.000000],
  [2.396691, 0.040959, 0.000000, 0.000000],
  [2.396761, 0.039069, 0.000000, 0.000000],
  [2.396825, 0.037266, 0.000000, 0.000000],
  [2.396883, 0.035544, 0.000000, 0.000000],
  [2.396936, 0.033901, 0.000000, 0.000000],
  [2.396984, 0.032334, 0.000000, 0.000000],
  [2.397028, 0.030838, 0.000000, 0.000000],
  [2.397068, 0.029410, 0.000000, 0.000000],
  [2.397104, 0.028048, 0.000000, 0.000000],
  [2.397137, 0.026749, 0.000000, 0.000000],
  [2.397167, 0.025509, 0.000000, 0.000000],
  [2.397194, 0.024326, 0.000000, 0.000000],
  [2.397219, 0.023198, 0.000000, 0.000000],
  [2.397242, 0.022122, 0.000000, 0.000000],
  [2.397262, 0.021095, 0.000000, 0.000000],
  [2.397281, 0.020116, 0.000000, 0.000000],
  [2.397298, 0.019181, 0.000000, 0.000000],
  [2.397314, 0.018290, 0.000000, 0.000000],
  [2.397328, 0.017441, 0.000000, 0.000000],
  [2.397341, 0.016630, 0.000000, 0.000000],
  [2.397352, 0.015857, 0.000000, 0.000000],
  [2.397363, 0.015119, 0.000000, 0.000000],
  [2.397372, 0.014416, 0.000000, 0.000000],
  [2.397381, 0.013745, 0.000000, 0.000000],
  [2.397389, 0.013106, 0.000000, 0.000000],
  [2.397396, 0.012496, 0.000000, 0.000000],
  [2.397403, 0.011914, 0.000000, 0.000000],
  [2.397409, 0.011360, 0.000000, 0.000000],
  [2.397414, 0.010831, 0.000000, 0.000000],
  [2.397419, 0.010326, 0.000000, 0.000000],
  [2.397424, 0.009845, 0.000000, 0.000000],
  [2.397428, 0.009387, 0.000000, 0.000000],
  [2.397432, 0.008949, 0.000000, 0.000000],
  [2.397435, 0.008532, 0.000000, 0.000000],
  [2.397438, 0.008135, 0.000000, 0.000000],
  [2.397441, 0.007755, 0.000000, 0.000000],
  [2.397443, 0.007394, 0.000000, 0.000000],
  [2.397446, 0.007049, 0.000000, 0.000000],
  [2.397448, 0.006721, 0.000000, 0.000000],
  [2.397450, 0.006407, 0.000000, 0.000000],
  [2.397451, 0.006108, 0.000000, 0.000000],
  [2.397453, 0.005824, 0.000000, 0.000000],
  [2.397454, 0.005552, 0.000000, 0.000000],
  [2.397456, 0.005293, 0.000000, 0.000000],
  [2.397457, 0.005046, 0.000000, 0.000000],
  [2.397458, 0.004811, 0.000000, 0.000000],
  [2.397459, 0.004586, 0.000000, 0.000000],
  [2.397460, 0.004372, 0.000000, 0.000000],
  [2.397461, 0.004168, 0.000000, 0.000000],
  [2.397461, 0.003974, 0.000000, 0.000000],
  [2.397462, 0.003788, 0.000000, 0.000000],
  [2.397463, 0.003611, 0.000000, 0.000000],
  [2.397463, 0.003443, 0.000000, 0.000000],
  [2.397464, 0.003282, 0.000000, 0.000000],
  [2.397464, 0.003129, 0.000000, 0.000000],
  [2.397465, 0.002983, 0.000000, 0.000000],
  [2.397465, 0.002844, 0.000000, 0.000000],
  [2.397465, 0.002711, 0.000000, 0.000000],
  [2.397466, 0.002584, 0.000000, 0.000000],
  [2.397466, 0.002464, 0.000000, 0.000000],
  [2.397466, 0.002349, 0.000000, 0.000000],
  [2.397466, 0.002239, 0.000000, 0.000000],
  [2.397467, 0.002135, 0.000000, 0.000000],
  [2.397467, 0.002035, 0.000000, 0.000000],
  [2.397467, 0.001940, 0.000000, 0.000000],
  [2.397467, 0.001849, 0.000000, 0.000000],
  [2.397467, 0.001763, 0.000000, 0.000000],
  [2.397467, 0.001681, 0.000000, 0.000000],
  [2.397468, 0.001602, 0.000000, 0.000000],
  [2.397468, 0.001527, 0.000000, 0.000000],
  [2.397468, 0.001456, 0.000000, 0.000000],
  [2.397468, 0.001388, 0.000000, 0.000000],
  [2.397468, 0.001323, 0.000000, 0.000000],
  [2.397468, 0.001261, 0.000000, 0.000000],
  [2.397468, 0.001202, 0.000000, 0.000000],
  [2.397468, 0.001146, 0.000000, 0.000000],
  [2.397468, 0.001093, 0.000000, 0.000000],
  [2.397468, 0.001042, 0.000000, 0.000000],
  [2.397468, 0.000993, 0.000000, 0.000000],
  [2.397468, 0.000947, 0.000000, 0.000000],
  [2.397468, 0.000902, 0.000000, 0.000000],
  [2.397468, 0.000860, 0.000000, 0.000000],
  [2.397468, 0.000820, 0.000000, 0.000000],
  [2.397469, 0.000782, 0.000000, 0.000000],
  [2.397469, 0.000745, 0.000000, 0.000000],
  [2.397469, 0.000710, 0.000000, 0.000000],
  [2.397469, 0.000677, 0.000000, 0.000000],
  [2.397469, 0.000646, 0.000000, 0.000000],
  [2.397469, 0.000616, 0.000000, 0.000000],
  [2.397469, 0.000587, 0.000000, 0.000000],
  [2.397469, 0.000559, 0.000000, 0.000000],
  [2.397469, 0.000533, 0.000000, 0.000000],
  [2.397469, 0.000508, 0.000000, 0.000000],
  [2.397469, 0.000485, 0.000000, 0.000000],
  [2.397469, 0.000462, 0.000000, 0.000000],
  [2.397469, 0.000440, 0.000000, 0.000000],
  [2.397469, 0.000420, 0.000000, 0.000000],
  [2.397469, 0.000400, 0.000000, 0.000000],
  [2.397469, 0.000381, 0.000000, 0.000000],
  [2.397469, 0.000364, 0.000000, 0.000000],
  [2.397469, 0.000347, 0.000000, 0.000000],
  [2.397469, 0.000330, 0.000000, 0.000000],
  [2.397469, 0.000315, 0.000000, 0.000000],
  [2.397469, 0.000300, 0.000000, 0.000000],
  [2.397469, 0.000286, 0.000000, 0.000000],
  [2.397469, 0.000273, 0.000000, 0.000000],
  [2.397469, 0.000260, 0.000000, 0.000000],
  [2.397469, 0.000248, 0.000000, 0.000000],
  [2.397469, 0.000236, 0.000000, 0.000000],
  [2.397469, 0.000225, 0.000000, 0.000000],
  [2.397469, 0.000215, 0.000000, 0.000000],
  [2.397469, 0.000205, 0.000000, 0.000000],
  [2.397469, 0.000195, 0.000000, 0.000000],
  [2.397469, 0.000186, 0.000000, 0.000000],
  [2.397469, 0.000177, 0.000000, 0.000000],
  [2.397469, 0.000169, 0.000000, 0.000000],
  [2.397469, 0.000161, 0.000000, 0.000000],
  [2.397469, 0.000154, 0.000000, 0.000000],
  [2.397469, 0.000147, 0.000000, 0.000000],
  [2.397469, 0.000140, 0.000000, 0.000000],
  [2.397469, 0.000133, 0.000000, 0.000000],
  [2.397469, 0.000127, 0.000000, 0.000000],
  [2.397469, 0.000121, 0.000000, 0.000000],
  [2.397469, 0.000115, 0.000000, 0.000000],
  [2.397469, 0.000110, 0.000000, 0.000000],
  [2.397469, 0.000105, 0.000000, 0.000000],
  [2.397469, 0.000100, 0.000000, 0.000000],
  [2.397469, 0.000095, 0.000000, 0.000000],
  [2.397469, 0.000091, 0.000000, 0.000000],
  [2.397469, 0.000087, 0.000000, 0.000000],
  [2.397469, 0.000083, 0.000000, 0.000000],
  [2.397469, 0.000079, 0.000000, 0.000000],
  [2.397469, 0.000075, 0.000000, 0.000000],
  [2.397469, 0.000071, 0.000000, 0.000000],
  [2.397469, 0.000068, 0.000000, 0.000000],
  [2.397469, 0.000065, 0.000000, 0.000000],
  [2.397469, 0.000062, 0.000000, 0.000000],
  [2.397469, 0.000059, 0.000000, 0.000000],
  [2.397469, 0.000056, 0.000000, 0.000000],
  [2.397469, 0.000054, 0.000000, 0.000000],
  [2.397469, 0.000051, 0.000000, 0.000000],
  [2.397469, 0.000049, 0.000000, 0.000000],
  [2.397469, 0.000046, 0.000000, 0.000000],
  [2.397469, 0.000044, 0.000000, 0.000000],
  [2.397469, 0.000042, 0.000000, 0.000000],
  [2.397469, 0.000040, 0.000000, 0.000000],
  [2.397469, 0.000038, 0.000000, 0.000000],
  [2.397469, 0.000037, 0.000000, 0.000000],
  [2.397469, 0.000035, 0.000000, 0.000000],
  [2.397469, 0.000033, 0.000000, 0.000000],
  [2.397469, 0.000032, 0.000000, 0.000000],
  [2.397469, 0.000030, 0.000000, 0.000000],
  [2.397469, 0.000029, 0.000000, 0.000000],
  [2.397469, 0.000027, 0.000000, 0.000000],
  [2.397469, 0.000026, 0.000000, 0.000000],
  [2.397469, 0.000025, 0.000000, 0.000000],
  [2.397469, 0.000024, 0.000000, 0.000000],
  [2.397469, 0.000023, 0.000000, 0.000000],
  [2.397469, 0.000022, 0.000000, 0.000000],
  [2.397469, 0.000021, 0.000000, 0.000000],
  [2.397469, 0.000020, 0.000000, 0.000000],
  [2.397469, 0.000019, 0.000000, 0.000000],
  [2.397469, 0.000018, 0.000000, 0.000000],
  [2.397469, 0.000017, 0.000000, 0.000000],
  [2.397469, 0.000016, 0.000000, 0.000000],
  [2.397469, 0.000015, 0.000000, 0.000000],
  [2.397469, 0.000015, 0.000000, 0.000000],
  [2.397469, 0.000014, 0.000000, 0.000000],
  [2.397469, 0.000013, 0.000000, 0.000000],
  [2.397469, 0.000013, 0.000000, 0.000000],
  [2.397469, 0.000012, 0.000000, 0.000000],
  [2.397469, 0.000012, 0.000000, 0.000000],
  [2.397469, 0.000011, 0.000000, 0.000000],
  [2.397469, 0.000011, 0.000000, 0.000000],
  [2.397469, 0.000010, 0.000000, 0.000000],
  [2.397469, 0.000010, 0.000000, 0.000000],
  [2.397469, 0.000009, 0.000000, 0.000000],
  [2.397469, 0.000009, 0.000000, 0.000000],
  [2.397469, 0.000008, 0.000000, 0.000000],
  [2.397469, 0.000008, 0.000000, 0.000000],
  [2.397469, 0.000008, 0.000000, 0.000000],
  [2.397469, 0.000007, 0.000000, 0.000000],
  [2.397469, 0.000007, 0.000000, 0.000000],
  [2.397469, 0.000007, 0.000000, 0.000000],
  [2.397469, 0.000006, 0.000000, 0.000000],
  [2.397469, 0.000006, 0.000000, 0.000000],
  [2.397469, 0.000006, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000001, 0.000000, 0.000000],
  [2.397469, 0.000001, 0.000000, 0.000000],
  [2.397469, 0.000001, 0.000000, 0.000000],
];


/** @type {Number} */
exports.MAX_RE_WEIGHTS_RESOLUTION = exports.MAX_RE_WEIGHTS.length;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
 * @file Source model to spatialize an audio buffer.
 * @author Andrew Allen <bitllama@google.com>
 */




// Internal dependencies.
const Directivity = __webpack_require__(5);
const Attenuation = __webpack_require__(6);
const Encoder = __webpack_require__(1);
const Utils = __webpack_require__(0);


/**
 * @class Source
 * @description Source model to spatialize an audio buffer.
 * @param {ResonanceAudio} scene Associated {@link ResonanceAudio
 * ResonanceAudio} instance.
 * @param {Object} options
 * @param {Float32Array} options.position
 * The source's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Float32Array} options.forward
 * The source's initial forward vector. Defaults to
 * {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @param {Float32Array} options.up
 * The source's initial up vector. Defaults to
 * {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 * @param {Number} options.minDistance
 * Min. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MIN_DISTANCE DEFAULT_MIN_DISTANCE}.
 * @param {Number} options.maxDistance
 * Max. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MAX_DISTANCE DEFAULT_MAX_DISTANCE}.
 * @param {string} options.rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}. Defaults to
 * {@linkcode Utils.DEFAULT_ATTENUATION_ROLLOFF DEFAULT_ATTENUATION_ROLLOFF}.
 * @param {Number} options.gain Input gain (linear). Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_GAIN DEFAULT_SOURCE_GAIN}.
 * @param {Number} options.alpha Directivity alpha. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_ALPHA DEFAULT_DIRECTIVITY_ALPHA}.
 * @param {Number} options.sharpness Directivity sharpness. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_SHARPNESS
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 * @param {Number} options.sourceWidth
 * Source width (in degrees). Where 0 degrees is a point source and 360 degrees
 * is an omnidirectional source. Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_WIDTH DEFAULT_SOURCE_WIDTH}.
 */
function Source(scene, options) {
  // Public variables.
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Source
   * @instance
   */
  /**
   *
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.position == undefined) {
    options.position = Utils.DEFAULT_POSITION.slice();
  }
  if (options.forward == undefined) {
    options.forward = Utils.DEFAULT_FORWARD.slice();
  }
  if (options.up == undefined) {
    options.up = Utils.DEFAULT_UP.slice();
  }
  if (options.minDistance == undefined) {
    options.minDistance = Utils.DEFAULT_MIN_DISTANCE;
  }
  if (options.maxDistance == undefined) {
    options.maxDistance = Utils.DEFAULT_MAX_DISTANCE;
  }
  if (options.rolloff == undefined) {
    options.rolloff = Utils.DEFAULT_ROLLOFF;
  }
  if (options.gain == undefined) {
    options.gain = Utils.DEFAULT_SOURCE_GAIN;
  }
  if (options.alpha == undefined) {
    options.alpha = Utils.DEFAULT_DIRECTIVITY_ALPHA;
  }
  if (options.sharpness == undefined) {
    options.sharpness = Utils.DEFAULT_DIRECTIVITY_SHARPNESS;
  }
  if (options.sourceWidth == undefined) {
    options.sourceWidth = Utils.DEFAULT_SOURCE_WIDTH;
  }

  // Member variables.
  this._scene = scene;
  this._position = options.position;
  this._forward = options.forward;
  this._up = options.up;
  this._dx = new Float32Array(3);
  this._right = Utils.crossProduct(this._forward, this._up);

  // Create audio nodes.
  let context = scene._context;
  this.input = context.createGain();
  this._directivity = new Directivity(context, {
    alpha: options.alpha,
    sharpness: options.sharpness,
  });
  this._toEarly = context.createGain();
  this._toLate = context.createGain();
  this._attenuation = new Attenuation(context, {
    minDistance: options.minDistance,
    maxDistance: options.maxDistance,
    rolloff: options.rolloff,
  });
  this._encoder = new Encoder(context, {
    ambisonicOrder: scene._ambisonicOrder,
    sourceWidth: options.sourceWidth,
  });

  // Connect nodes.
  this.input.connect(this._toLate);
  this._toLate.connect(scene._room.late.input);

  this.input.connect(this._attenuation.input);
  this._attenuation.output.connect(this._toEarly);
  this._toEarly.connect(scene._room.early.input);

  this._attenuation.output.connect(this._directivity.input);
  this._directivity.output.connect(this._encoder.input);

  this._encoder.output.connect(scene._listener.input);

  // Assign initial conditions.
  this.setPosition(
    options.position[0], options.position[1], options.position[2]);
  this.input.gain.value = options.gain;
};


/**
 * Set source's position (in meters), where origin is the center of
 * the room.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
Source.prototype.setPosition = function(x, y, z) {
  // Assign new position.
  this._position[0] = x;
  this._position[1] = y;
  this._position[2] = z;

  // Handle far-field effect.
  let distance = this._scene._room.getDistanceOutsideRoom(
    this._position[0], this._position[1], this._position[2]);
    let gain = _computeDistanceOutsideRoom(distance);
  this._toLate.gain.value = gain;
  this._toEarly.gain.value = gain;

  this._update();
};


// Update the source when changing the listener's position.
Source.prototype._update = function() {
  // Compute distance to listener.
  for (let i = 0; i < 3; i++) {
    this._dx[i] = this._position[i] - this._scene._listener.position[i];
  }
  let distance = Math.sqrt(this._dx[0] * this._dx[0] +
    this._dx[1] * this._dx[1] + this._dx[2] * this._dx[2]);
  if (distance > 0) {
    // Normalize direction vector.
    this._dx[0] /= distance;
    this._dx[1] /= distance;
    this._dx[2] /= distance;
  }

  // Compuete angle of direction vector.
  let azimuth = Math.atan2(-this._dx[0], this._dx[2]) *
    Utils.RADIANS_TO_DEGREES;
  let elevation = Math.atan2(this._dx[1], Math.sqrt(this._dx[0] * this._dx[0] +
    this._dx[2] * this._dx[2])) * Utils.RADIANS_TO_DEGREES;

  // Set distance/directivity/direction values.
  this._attenuation.setDistance(distance);
  this._directivity.computeAngle(this._forward, this._dx);
  this._encoder.setDirection(azimuth, elevation);
};


/**
 * Set source's rolloff.
 * @param {string} rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
 */
Source.prototype.setRolloff = function(rolloff) {
  this._attenuation.setRolloff(rolloff);
};


/**
 * Set source's minimum distance (in meters).
 * @param {Number} minDistance
 */
Source.prototype.setMinDistance = function(minDistance) {
  this._attenuation.minDistance = minDistance;
};


/**
 * Set source's maximum distance (in meters).
 * @param {Number} maxDistance
 */
Source.prototype.setMaxDistance = function(maxDistance) {
  this._attenuation.maxDistance = maxDistance;
};


/**
 * Set source's gain (linear).
 * @param {Number} gain
 */
Source.prototype.setGain = function(gain) {
  this.input.gain.value = gain;
};


/**
 * Set the source's orientation using forward and up vectors.
 * @param {Number} forwardX
 * @param {Number} forwardY
 * @param {Number} forwardZ
 * @param {Number} upX
 * @param {Number} upY
 * @param {Number} upZ
 */
Source.prototype.setOrientation = function(forwardX, forwardY, forwardZ,
    upX, upY, upZ) {
  this._forward[0] = forwardX;
  this._forward[1] = forwardY;
  this._forward[2] = forwardZ;
  this._up[0] = upX;
  this._up[1] = upY;
  this._up[2] = upZ;
  this._right = Utils.crossProduct(this._forward, this._up);
};


// TODO(bitllama): Make sure this works with Three.js as intended.
/**
 * Set source's position and orientation using a
 * Three.js modelViewMatrix object.
 * @param {Float32Array} matrix4
 * The Matrix4 representing the object position and rotation in world space.
 */
Source.prototype.setFromMatrix = function(matrix4) {
  this._right[0] = matrix4.elements[0];
  this._right[1] = matrix4.elements[1];
  this._right[2] = matrix4.elements[2];
  this._up[0] = matrix4.elements[4];
  this._up[1] = matrix4.elements[5];
  this._up[2] = matrix4.elements[6];
  this._forward[0] = matrix4.elements[8];
  this._forward[1] = matrix4.elements[9];
  this._forward[2] = matrix4.elements[10];

  // Normalize to remove scaling.
  this._right = Utils.normalizeVector(this._right);
  this._up = Utils.normalizeVector(this._up);
  this._forward = Utils.normalizeVector(this._forward);

  // Update position.
  this.setPosition(
    matrix4.elements[12], matrix4.elements[13], matrix4.elements[14]);
};


/**
 * Set the source width (in degrees). Where 0 degrees is a point source and 360
 * degrees is an omnidirectional source.
 * @param {Number} sourceWidth (in degrees).
 */
Source.prototype.setSourceWidth = function(sourceWidth) {
  this._encoder.setSourceWidth(sourceWidth);
  this.setPosition(this._position[0], this._position[1], this._position[2]);
};


/**
 * Set source's directivity pattern (defined by alpha), where 0 is an
 * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
 * pattern. The sharpness of the pattern is increased exponentially.
 * @param {Number} alpha
 * Determines directivity pattern (0 to 1).
 * @param {Number} sharpness
 * Determines the sharpness of the directivity pattern (1 to Inf).
 */
Source.prototype.setDirectivityPattern = function(alpha, sharpness) {
  this._directivity.setPattern(alpha, sharpness);
  this.setPosition(this._position[0], this._position[1], this._position[2]);
};


/**
 * Determine the distance a source is outside of a room. Attenuate gain going
 * to the reflections and reverb when the source is outside of the room.
 * @param {Number} distance Distance in meters.
 * @return {Number} Gain (linear) of source.
 * @private
 */
function _computeDistanceOutsideRoom(distance) {
  // We apply a linear ramp from 1 to 0 as the source is up to 1m outside.
  let gain = 1;
  if (distance > Utils.EPSILON_FLOAT) {
    gain = 1 - distance / Utils.SOURCE_MAX_OUTSIDE_ROOM_DISTANCE;

    // Clamp gain between 0 and 1.
    gain = Math.max(0, Math.min(1, gain));
  }
  return gain;
}


module.exports = Source;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
 * @file Directivity/occlusion filter.
 * @author Andrew Allen <bitllama@google.com>
 */



// Internal dependencies.
const Utils = __webpack_require__(0);


/**
 * @class Directivity
 * @description Directivity/occlusion filter.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.alpha
 * Determines directivity pattern (0 to 1). See
 * {@link Directivity#setPattern setPattern} for more details. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_ALPHA DEFAULT_DIRECTIVITY_ALPHA}.
 * @param {Number} options.sharpness
 * Determines the sharpness of the directivity pattern (1 to Inf). See
 * {@link Directivity#setPattern setPattern} for more details. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_SHARPNESS
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 */
function Directivity(context, options) {
  // Public variables.
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Directivity
   * @instance
   */
  /**
   * Mono (1-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Directivity
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.alpha == undefined) {
    options.alpha = Utils.DEFAULT_DIRECTIVITY_ALPHA;
  }
  if (options.sharpness == undefined) {
    options.sharpness = Utils.DEFAULT_DIRECTIVITY_SHARPNESS;
  }

  // Create audio node.
  this._context = context;
  this._lowpass = context.createBiquadFilter();

  // Initialize filter coefficients.
  this._lowpass.type = 'lowpass';
  this._lowpass.Q.value = 0;
  this._lowpass.frequency.value = context.sampleRate * 0.5;

  this._cosTheta = 0;
  this.setPattern(options.alpha, options.sharpness);

  // Input/Output proxy.
  this.input = this._lowpass;
  this.output = this._lowpass;
}


/**
 * Compute the filter using the source's forward orientation and the listener's
 * position.
 * @param {Float32Array} forward The source's forward vector.
 * @param {Float32Array} direction The direction from the source to the
 * listener.
 */
Directivity.prototype.computeAngle = function(forward, direction) {
  let forwardNorm = Utils.normalizeVector(forward);
  let directionNorm = Utils.normalizeVector(direction);
  let coeff = 1;
  if (this._alpha > Utils.EPSILON_FLOAT) {
    let cosTheta = forwardNorm[0] * directionNorm[0] +
      forwardNorm[1] * directionNorm[1] + forwardNorm[2] * directionNorm[2];
    coeff = (1 - this._alpha) + this._alpha * cosTheta;
    coeff = Math.pow(Math.abs(coeff), this._sharpness);
  }
  this._lowpass.frequency.value = this._context.sampleRate * 0.5 * coeff;
};


/**
 * Set source's directivity pattern (defined by alpha), where 0 is an
 * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
 * pattern. The sharpness of the pattern is increased exponenentially.
 * @param {Number} alpha
 * Determines directivity pattern (0 to 1).
 * @param {Number} sharpness
 * Determines the sharpness of the directivity pattern (1 to Inf).
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 */
Directivity.prototype.setPattern = function(alpha, sharpness) {
  // Clamp and set values.
  this._alpha = Math.min(1, Math.max(0, alpha));
  this._sharpness = Math.max(1, sharpness);

  // Update angle calculation using new values.
  this.computeAngle([this._cosTheta * this._cosTheta, 0, 0], [1, 0, 0]);
};


module.exports = Directivity;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
 * @file Distance-based attenuation filter.
 * @author Andrew Allen <bitllama@google.com>
 */




// Internal dependencies.
const Utils = __webpack_require__(0);


/**
 * @class Attenuation
 * @description Distance-based attenuation filter.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.minDistance
 * Min. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MIN_DISTANCE DEFAULT_MIN_DISTANCE}.
 * @param {Number} options.maxDistance
 * Max. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MAX_DISTANCE DEFAULT_MAX_DISTANCE}.
 * @param {string} options.rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}. Defaults to
 * {@linkcode Utils.DEFAULT_ATTENUATION_ROLLOFF DEFAULT_ATTENUATION_ROLLOFF}.
 */
function Attenuation(context, options) {
  // Public variables.
  /**
   * Min. distance (in meters).
   * @member {Number} minDistance
   * @memberof Attenuation
   * @instance
   */
  /**
   * Max. distance (in meters).
   * @member {Number} maxDistance
   * @memberof Attenuation
   * @instance
   */
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Attenuation
   * @instance
   */
  /**
   * Mono (1-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Attenuation
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.minDistance == undefined) {
    options.minDistance = Utils.DEFAULT_MIN_DISTANCE;
  }
  if (options.maxDistance == undefined) {
    options.maxDistance = Utils.DEFAULT_MAX_DISTANCE;
  }
  if (options.rolloff == undefined) {
    options.rolloff = Utils.DEFAULT_ATTENUATION_ROLLOFF;
  }

  // Assign values.
  this.minDistance = options.minDistance;
  this.maxDistance = options.maxDistance;
  this.setRolloff(options.rolloff);

  // Create node.
  this._gainNode = context.createGain();

  // Initialize distance to max distance.
  this.setDistance(options.maxDistance);

  // Input/Output proxy.
  this.input = this._gainNode;
  this.output = this._gainNode;
}


/**
 * Set distance from the listener.
 * @param {Number} distance Distance (in meters).
 */
Attenuation.prototype.setDistance = function(distance) {
  let gain = 1;
  if (this._rolloff == 'logarithmic') {
    if (distance > this.maxDistance) {
      gain = 0;
    } else if (distance > this.minDistance) {
      let range = this.maxDistance - this.minDistance;
      if (range > Utils.EPSILON_FLOAT) {
        // Compute the distance attenuation value by the logarithmic curve
        // "1 / (d + 1)" with an offset of |minDistance|.
        let relativeDistance = distance - this.minDistance;
        let attenuation = 1 / (relativeDistance + 1);
        let attenuationMax = 1 / (range + 1);
        gain = (attenuation - attenuationMax) / (1 - attenuationMax);
      }
    }
  } else if (this._rolloff == 'linear') {
    if (distance > this.maxDistance) {
      gain = 0;
    } else if (distance > this.minDistance) {
      let range = this.maxDistance - this.minDistance;
      if (range > Utils.EPSILON_FLOAT) {
        gain = (this.maxDistance - distance) / range;
      }
    }
  }
  this._gainNode.gain.value = gain;
};


/**
 * Set rolloff.
 * @param {string} rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
 */
Attenuation.prototype.setRolloff = function(rolloff) {
  let isValidModel = ~Utils.ATTENUATION_ROLLOFFS.indexOf(rolloff);
  if (rolloff == undefined || !isValidModel) {
    if (!isValidModel) {
      Utils.log('Invalid rolloff model (\"' + rolloff +
        '\"). Using default: \"' + Utils.DEFAULT_ATTENUATION_ROLLOFF + '\".');
    }
    rolloff = Utils.DEFAULT_ATTENUATION_ROLLOFF;
  } else {
    rolloff = rolloff.toString().toLowerCase();
  }
  this._rolloff = rolloff;
};


module.exports = Attenuation;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
const LateReflections = __webpack_require__(8);
const EarlyReflections = __webpack_require__(9);
const Utils = __webpack_require__(0);


/**
 * Generate absorption coefficients from material names.
 * @param {Object} materials
 * @return {Object}
 */
function _getCoefficientsFromMaterials(materials) {
  // Initialize coefficients to use defaults.
  let coefficients = {};
  for (let property in Utils.DEFAULT_ROOM_MATERIALS) {
    if (Utils.DEFAULT_ROOM_MATERIALS.hasOwnProperty(property)) {
      coefficients[property] = Utils.ROOM_MATERIAL_COEFFICIENTS[
        Utils.DEFAULT_ROOM_MATERIALS[property]];
    }
  }

  // Sanitize materials.
  if (materials == undefined) {
    materials = {};
    Object.assign(materials, Utils.DEFAULT_ROOM_MATERIALS);
  }

  // Assign coefficients using provided materials.
  for (let property in Utils.DEFAULT_ROOM_MATERIALS) {
    if (Utils.DEFAULT_ROOM_MATERIALS.hasOwnProperty(property) &&
        materials.hasOwnProperty(property)) {
      if (materials[property] in Utils.ROOM_MATERIAL_COEFFICIENTS) {
        coefficients[property] =
          Utils.ROOM_MATERIAL_COEFFICIENTS[materials[property]];
      } else {
        Utils.log('Material \"' + materials[property] + '\" on wall \"' +
          property + '\" not found. Using \"' +
          Utils.DEFAULT_ROOM_MATERIALS[property] + '\".');
      }
    } else {
      Utils.log('Wall \"' + property + '\" is not defined. Default used.');
    }
  }
  return coefficients;
}

/**
 * Sanitize coefficients.
 * @param {Object} coefficients
 * @return {Object}
 */
function _sanitizeCoefficients(coefficients) {
  if (coefficients == undefined) {
    coefficients = {};
  }
  for (let property in Utils.DEFAULT_ROOM_MATERIALS) {
    if (!(coefficients.hasOwnProperty(property))) {
      // If element is not present, use default coefficients.
      coefficients[property] = Utils.ROOM_MATERIAL_COEFFICIENTS[
        Utils.DEFAULT_ROOM_MATERIALS[property]];
    }
  }
  return coefficients;
}

/**
 * Sanitize dimensions.
 * @param {Object} dimensions
 * @return {Object}
 */
function _sanitizeDimensions(dimensions) {
  if (dimensions == undefined) {
    dimensions = {};
  }
  for (let property in Utils.DEFAULT_ROOM_DIMENSIONS) {
    if (!(dimensions.hasOwnProperty(property))) {
      dimensions[property] = Utils.DEFAULT_ROOM_DIMENSIONS[property];
    }
  }
  return dimensions;
}

/**
 * Compute frequency-dependent reverb durations.
 * @param {Object} dimensions
 * @param {Object} coefficients
 * @param {Number} speedOfSound
 * @return {Array}
 */
function _getDurationsFromProperties(dimensions, coefficients, speedOfSound) {
  let durations = new Float32Array(Utils.NUMBER_REVERB_FREQUENCY_BANDS);

  // Sanitize inputs.
  dimensions = _sanitizeDimensions(dimensions);
  coefficients = _sanitizeCoefficients(coefficients);
  if (speedOfSound == undefined) {
    speedOfSound = Utils.DEFAULT_SPEED_OF_SOUND;
  }

  // Acoustic constant.
  let k = Utils.TWENTY_FOUR_LOG10 / speedOfSound;

  // Compute volume, skip if room is not present.
  let volume = dimensions.width * dimensions.height * dimensions.depth;
  if (volume < Utils.ROOM_MIN_VOLUME) {
    return durations;
  }

  // Room surface area.
  let leftRightArea = dimensions.width * dimensions.height;
  let floorCeilingArea = dimensions.width * dimensions.depth;
  let frontBackArea = dimensions.depth * dimensions.height;
  let totalArea = 2 * (leftRightArea + floorCeilingArea + frontBackArea);
  for (let i = 0; i < Utils.NUMBER_REVERB_FREQUENCY_BANDS; i++) {
    // Effective absorptive area.
    let absorbtionArea =
      (coefficients.left[i] + coefficients.right[i]) * leftRightArea +
      (coefficients.down[i] + coefficients.up[i]) * floorCeilingArea +
      (coefficients.front[i] + coefficients.back[i]) * frontBackArea;
    let meanAbsorbtionArea = absorbtionArea / totalArea;

    // Compute reverberation using Eyring equation [1].
    // [1] Beranek, Leo L. "Analysis of Sabine and Eyring equations and their
    //     application to concert hall audience and chair absorption." The
    //     Journal of the Acoustical Society of America, Vol. 120, No. 3.
    //     (2006), pp. 1399-1399.
    durations[i] = Utils.ROOM_EYRING_CORRECTION_COEFFICIENT * k * volume /
      (-totalArea * Math.log(1 - meanAbsorbtionArea) + 4 *
      Utils.ROOM_AIR_ABSORPTION_COEFFICIENTS[i] * volume);
  }
  return durations;
}


/**
 * Compute reflection coefficients from absorption coefficients.
 * @param {Object} absorptionCoefficients
 * @return {Object}
 */
function _computeReflectionCoefficients(absorptionCoefficients) {
  let reflectionCoefficients = [];
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      // Compute average absorption coefficient (per wall).
      reflectionCoefficients[property] = 0;
      for (let j = 0; j < Utils.NUMBER_REFLECTION_AVERAGING_BANDS; j++) {
        let bandIndex = j + Utils.ROOM_STARTING_AVERAGING_BAND;
        reflectionCoefficients[property] +=
          absorptionCoefficients[property][bandIndex];
      }
      reflectionCoefficients[property] /=
        Utils.NUMBER_REFLECTION_AVERAGING_BANDS;

      // Convert absorption coefficient to reflection coefficient.
      reflectionCoefficients[property] =
        Math.sqrt(1 - reflectionCoefficients[property]);
    }
  }
  return reflectionCoefficients;
}


/**
 * @class Room
 * @description Model that manages early and late reflections using acoustic
 * properties and listener position relative to a rectangular room.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Float32Array} options.listenerPosition
 * The listener's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Object} options.dimensions Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} options.materials Named acoustic materials per wall.
 * Defaults to {@linkcode Utils.DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
 * @param {Number} options.speedOfSound
 * (in meters/second). Defaults to
 * {@linkcode Utils.DEFAULT_SPEED_OF_SOUND DEFAULT_SPEED_OF_SOUND}.
 */
function Room(context, options) {
  // Public variables.
  /**
   * EarlyReflections {@link EarlyReflections EarlyReflections} submodule.
   * @member {AudioNode} early
   * @memberof Room
   * @instance
   */
  /**
   * LateReflections {@link LateReflections LateReflections} submodule.
   * @member {AudioNode} late
   * @memberof Room
   * @instance
   */
  /**
   * Ambisonic (multichannel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Room
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.listenerPosition == undefined) {
    options.listenerPosition = Utils.DEFAULT_POSITION.slice();
  }
  if (options.dimensions == undefined) {
    options.dimensions = {};
    Object.assign(options.dimensions, Utils.DEFAULT_ROOM_DIMENSIONS);
  }
  if (options.materials == undefined) {
    options.materials = {};
    Object.assign(options.materials, Utils.DEFAULT_ROOM_MATERIALS);
  }
  if (options.speedOfSound == undefined) {
    options.speedOfSound = Utils.DEFAULT_SPEED_OF_SOUND;
  }

  // Sanitize room-properties-related arguments.
  options.dimensions = _sanitizeDimensions(options.dimensions);
  let absorptionCoefficients = _getCoefficientsFromMaterials(options.materials);
  let reflectionCoefficients =
    _computeReflectionCoefficients(absorptionCoefficients);
  let durations = _getDurationsFromProperties(options.dimensions,
    absorptionCoefficients, options.speedOfSound);

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
  this.output = context.createGain();
  this.early.output.connect(this.output);
  this._merger = context.createChannelMerger(4);

  this.late.output.connect(this._merger, 0, 0);
  this._merger.connect(this.output);
}


/**
 * Set the room's dimensions and wall materials.
 * @param {Object} dimensions Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} materials Named acoustic materials per wall. Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
 */
Room.prototype.setProperties = function(dimensions, materials) {
  // Compute late response.
  let absorptionCoefficients = _getCoefficientsFromMaterials(materials);
  let durations = _getDurationsFromProperties(dimensions,
    absorptionCoefficients, this.speedOfSound);
  this.late.setDurations(durations);

  // Compute early response.
  this.early.speedOfSound = this.speedOfSound;
  let reflectionCoefficients =
    _computeReflectionCoefficients(absorptionCoefficients);
  this.early.setRoomProperties(dimensions, reflectionCoefficients);
};


/**
 * Set the listener's position (in meters), where origin is the center of
 * the room.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
Room.prototype.setListenerPosition = function(x, y, z) {
  this.early.speedOfSound = this.speedOfSound;
  this.early.setListenerPosition(x, y, z);

  // Disable room effects if the listener is outside the room boundaries.
  let distance = this.getDistanceOutsideRoom(x, y, z);
  let gain = 1;
  if (distance > Utils.EPSILON_FLOAT) {
    gain = 1 - distance / Utils.LISTENER_MAX_OUTSIDE_ROOM_DISTANCE;

    // Clamp gain between 0 and 1.
    gain = Math.max(0, Math.min(1, gain));
  }
  this.output.gain.value = gain;
};


/**
 * Compute distance outside room of provided position (in meters).
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @return {Number}
 * Distance outside room (in meters). Returns 0 if inside room.
 */
Room.prototype.getDistanceOutsideRoom = function(x, y, z) {
  let dx = Math.max(0, -this.early._halfDimensions.width - x,
    x - this.early._halfDimensions.width);
    let dy = Math.max(0, -this.early._halfDimensions.height - y,
    y - this.early._halfDimensions.height);
    let dz = Math.max(0, -this.early._halfDimensions.depth - z,
    z - this.early._halfDimensions.depth);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};


module.exports = Room;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
 * @file Late reverberation filter for Ambisonic content.
 * @author Andrew Allen <bitllama@google.com>
 */



// Internal dependencies.
const Utils = __webpack_require__(0);


/**
 * @class LateReflections
 * @description Late-reflections reverberation filter for Ambisonic content.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Array} options.durations
 * Multiband RT60 durations (in seconds) for each frequency band, listed as
 * {@linkcode Utils.DEFAULT_REVERB_FREQUENCY_BANDS
 * FREQUDEFAULT_REVERB_FREQUENCY_BANDSENCY_BANDS}. Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_DURATIONS DEFAULT_REVERB_DURATIONS}.
 * @param {Number} options.predelay Pre-delay (in milliseconds). Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_PREDELAY DEFAULT_REVERB_PREDELAY}.
 * @param {Number} options.gain Output gain (linear). Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_GAIN DEFAULT_REVERB_GAIN}.
 * @param {Number} options.bandwidth Bandwidth (in octaves) for each frequency
 * band. Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_BANDWIDTH DEFAULT_REVERB_BANDWIDTH}.
 * @param {Number} options.tailonset Length (in milliseconds) of impulse
 * response to apply a half-Hann window. Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_TAIL_ONSET DEFAULT_REVERB_TAIL_ONSET}.
 */
function LateReflections(context, options) {
  // Public variables.
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof LateReflections
   * @instance
   */
  /**
   * Mono (1-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof LateReflections
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.durations == undefined) {
    options.durations = Utils.DEFAULT_REVERB_DURATIONS.slice();
  }
  if (options.predelay == undefined) {
    options.predelay = Utils.DEFAULT_REVERB_PREDELAY;
  }
  if (options.gain == undefined) {
    options.gain = Utils.DEFAULT_REVERB_GAIN;
  }
  if (options.bandwidth == undefined) {
    options.bandwidth = Utils.DEFAULT_REVERB_BANDWIDTH;
  }
  if (options.tailonset == undefined) {
    options.tailonset = Utils.DEFAULT_REVERB_TAIL_ONSET;
  }

  // Assign pre-computed variables.
  let delaySecs = options.predelay / 1000;
  this._bandwidthCoeff = options.bandwidth * Utils.LOG2_DIV2;
  this._tailonsetSamples = options.tailonset / 1000;

  // Create nodes.
  this._context = context;
  this.input = context.createGain();
  this._predelay = context.createDelay(delaySecs);
  this._convolver = context.createConvolver();
  this.output = context.createGain();

  // Set reverb attenuation.
  this.output.gain.value = options.gain;

  // Disable normalization.
  this._convolver.normalize = false;

  // Connect nodes.
  this.input.connect(this._predelay);
  this._predelay.connect(this._convolver);
  this._convolver.connect(this.output);

  // Compute IR using RT60 values.
  this.setDurations(options.durations);
}


/**
 * Re-compute a new impulse response by providing Multiband RT60 durations.
 * @param {Array} durations
 * Multiband RT60 durations (in seconds) for each frequency band, listed as
 * {@linkcode Utils.DEFAULT_REVERB_FREQUENCY_BANDS
 * DEFAULT_REVERB_FREQUENCY_BANDS}.
 */
LateReflections.prototype.setDurations = function(durations) {
  if (durations.length !== Utils.NUMBER_REVERB_FREQUENCY_BANDS) {
    Utils.log('Warning: invalid number of RT60 values provided to reverb.');
    return;
  }

  // Compute impulse response.
  let durationsSamples =
    new Float32Array(Utils.NUMBER_REVERB_FREQUENCY_BANDS);
    let sampleRate = this._context.sampleRate;

  for (let i = 0; i < durations.length; i++) {
    // Clamp within suitable range.
    durations[i] =
      Math.max(0, Math.min(Utils.DEFAULT_REVERB_MAX_DURATION, durations[i]));

    // Convert seconds to samples.
    durationsSamples[i] = Math.round(durations[i] * sampleRate *
      Utils.DEFAULT_REVERB_DURATION_MULTIPLIER);
  };

  // Determine max RT60 length in samples.
  let durationsSamplesMax = 0;
  for (let i = 0; i < durationsSamples.length; i++) {
    if (durationsSamples[i] > durationsSamplesMax) {
      durationsSamplesMax = durationsSamples[i];
    }
  }

  // Skip this step if there is no reverberation to compute.
  if (durationsSamplesMax < 1) {
    durationsSamplesMax = 1;
  }

  // Create impulse response buffer.
  let buffer = this._context.createBuffer(1, durationsSamplesMax, sampleRate);
  let bufferData = buffer.getChannelData(0);

  // Create noise signal (computed once, referenced in each band's routine).
  let noiseSignal = new Float32Array(durationsSamplesMax);
  for (let i = 0; i < durationsSamplesMax; i++) {
    noiseSignal[i] = Math.random() * 2 - 1;
  }

  // Compute the decay rate per-band and filter the decaying noise signal.
  for (let i = 0; i < Utils.NUMBER_REVERB_FREQUENCY_BANDS; i++) {
    // Compute decay rate.
    let decayRate = -Utils.LOG1000 / durationsSamples[i];

    // Construct a standard one-zero, two-pole bandpass filter:
    // H(z) = (b0 * z^0 + b1 * z^-1 + b2 * z^-2) / (1 + a1 * z^-1 + a2 * z^-2)
    let omega = Utils.TWO_PI *
      Utils.DEFAULT_REVERB_FREQUENCY_BANDS[i] / sampleRate;
    let sinOmega = Math.sin(omega);
    let alpha = sinOmega * Math.sinh(this._bandwidthCoeff * omega / sinOmega);
    let a0CoeffReciprocal = 1 / (1 + alpha);
    let b0Coeff = alpha * a0CoeffReciprocal;
    let a1Coeff = -2 * Math.cos(omega) * a0CoeffReciprocal;
    let a2Coeff = (1 - alpha) * a0CoeffReciprocal;

    // We optimize since b2 = -b0, b1 = 0.
    // Update equation for two-pole bandpass filter:
    //   u[n] = x[n] - a1 * x[n-1] - a2 * x[n-2]
    //   y[n] = b0 * (u[n] - u[n-2])
    let um1 = 0;
    let um2 = 0;
    for (let j = 0; j < durationsSamples[i]; j++) {
      // Exponentially-decaying white noise.
      let x = noiseSignal[j] * Math.exp(decayRate * j);

      // Filter signal with bandpass filter and add to output.
      let u = x - a1Coeff * um1 - a2Coeff * um2;
      bufferData[j] += b0Coeff * (u - um2);

      // Update coefficients.
      um2 = um1;
      um1 = u;
    }
  }

  // Create and apply half of a Hann window to the beginning of the
  // impulse response.
  let halfHannLength =
    Math.round(this._tailonsetSamples);
  for (let i = 0; i < Math.min(bufferData.length, halfHannLength); i++) {
    let halfHann =
      0.5 * (1 - Math.cos(Utils.TWO_PI * i / (2 * halfHannLength - 1)));
      bufferData[i] *= halfHann;
  }
  this._convolver.buffer = buffer;
};


module.exports = LateReflections;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
 * @file Ray-tracing-based early reflections model.
 * @author Andrew Allen <bitllama@google.com>
 */



// Internal dependencies.
const Utils = __webpack_require__(0);


/**
 * @class EarlyReflections
 * @description Ray-tracing-based early reflections model.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Object} options.dimensions
 * Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} options.coefficients
 * Frequency-independent reflection coeffs per wall. Defaults to
 * {@linkcode Utils.DEFAULT_REFLECTION_COEFFICIENTS
 * DEFAULT_REFLECTION_COEFFICIENTS}.
 * @param {Number} options.speedOfSound
 * (in meters / second). Defaults to {@linkcode Utils.DEFAULT_SPEED_OF_SOUND
 * DEFAULT_SPEED_OF_SOUND}.
 * @param {Float32Array} options.listenerPosition
 * (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 */
function EarlyReflections(context, options) {
  // Public variables.
  /**
   * The room's speed of sound (in meters/second).
   * @member {Number} speedOfSound
   * @memberof EarlyReflections
   * @instance
   */
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof EarlyReflections
   * @instance
   */
  /**
   * First-order ambisonic (4-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof EarlyReflections
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.speedOfSound == undefined) {
    options.speedOfSound = Utils.DEFAULT_SPEED_OF_SOUND;
  }
  if (options.listenerPosition == undefined) {
    options.listenerPosition = Utils.DEFAULT_POSITION.slice();
  }
  if (options.coefficients == undefined) {
    options.coefficients = {};
    Object.assign(options.coefficients, Utils.DEFAULT_REFLECTION_COEFFICIENTS);
  }

  // Assign room's speed of sound.
  this.speedOfSound = options.speedOfSound;

  // Create nodes.
  this.input = context.createGain();
  this.output = context.createGain();
  this._lowpass = context.createBiquadFilter();
  this._delays = {};
  this._gains = {}; // gainPerWall = (ReflectionCoeff / Attenuation)
  this._inverters = {}; // 3 of these are needed for right/back/down walls.
  this._merger = context.createChannelMerger(4); // First-order encoding only.

  // Connect audio graph for each wall reflection.
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      this._delays[property] =
        context.createDelay(Utils.MAX_DURATION);
      this._gains[property] = context.createGain();
    }
  }
  this._inverters.right = context.createGain();
  this._inverters.down = context.createGain();
  this._inverters.back = context.createGain();

  // Initialize lowpass filter.
  this._lowpass.type = 'lowpass';
  this._lowpass.frequency.value = Utils.DEFAULT_REFLECTION_CUTOFF_FREQUENCY;
  this._lowpass.Q.value = 0;

  // Initialize encoder directions, set delay times and gains to 0.
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      this._delays[property].delayTime.value = 0;
      this._gains[property].gain.value = 0;
    }
  }

  // Initialize inverters for opposite walls ('right', 'down', 'back' only).
  this._inverters.right.gain.value = -1;
  this._inverters.down.gain.value = -1;
  this._inverters.back.gain.value = -1;

  // Connect nodes.
  this.input.connect(this._lowpass);
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      this._lowpass.connect(this._delays[property]);
      this._delays[property].connect(this._gains[property]);
      this._gains[property].connect(this._merger, 0, 0);
    }
  }

  // Connect gains to ambisonic channel output.
  // Left: [1 1 0 0]
  // Right: [1 -1 0 0]
  // Up: [1 0 1 0]
  // Down: [1 0 -1 0]
  // Front: [1 0 0 1]
  // Back: [1 0 0 -1]
  this._gains.left.connect(this._merger, 0, 1);

  this._gains.right.connect(this._inverters.right);
  this._inverters.right.connect(this._merger, 0, 1);

  this._gains.up.connect(this._merger, 0, 2);

  this._gains.down.connect(this._inverters.down);
  this._inverters.down.connect(this._merger, 0, 2);

  this._gains.front.connect(this._merger, 0, 3);

  this._gains.back.connect(this._inverters.back);
  this._inverters.back.connect(this._merger, 0, 3);
  this._merger.connect(this.output);

  // Initialize.
  this._listenerPosition = options.listenerPosition;
  this.setRoomProperties(options.dimensions, options.coefficients);
}


/**
 * Set the listener's position (in meters),
 * where [0,0,0] is the center of the room.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
EarlyReflections.prototype.setListenerPosition = function(x, y, z) {
  // Assign listener position.
  this._listenerPosition = [x, y, z];

  // Determine distances to each wall.
  let distances = {
    left: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.width + x) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    right: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.width - x) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    front: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.depth + z) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    back: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.depth - z) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    down: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.height + y) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    up: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.height - y) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
  };

  // Assign delay & attenuation values using distances.
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      // Compute and assign delay (in seconds).
      let delayInSecs = distances[property] / this.speedOfSound;
      this._delays[property].delayTime.value = delayInSecs;

      // Compute and assign gain, uses logarithmic rolloff: "g = R / (d + 1)"
      let attenuation = this._coefficients[property] / distances[property];
      this._gains[property].gain.value = attenuation;
    }
  }
};


/**
 * Set the room's properties which determines the characteristics of
 * reflections.
 * @param {Object} dimensions
 * Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} coefficients
 * Frequency-independent reflection coeffs per wall. Defaults to
 * {@linkcode Utils.DEFAULT_REFLECTION_COEFFICIENTS
 * DEFAULT_REFLECTION_COEFFICIENTS}.
 */
EarlyReflections.prototype.setRoomProperties = function(dimensions,
                                                        coefficients) {
  if (dimensions == undefined) {
    dimensions = {};
    Object.assign(dimensions, Utils.DEFAULT_ROOM_DIMENSIONS);
  }
  if (coefficients == undefined) {
    coefficients = {};
    Object.assign(coefficients, Utils.DEFAULT_REFLECTION_COEFFICIENTS);
  }
  this._coefficients = coefficients;

  // Sanitize dimensions and store half-dimensions.
  this._halfDimensions = {};
  this._halfDimensions.width = dimensions.width * 0.5;
  this._halfDimensions.height = dimensions.height * 0.5;
  this._halfDimensions.depth = dimensions.depth * 0.5;

  // Update listener position with new room properties.
  this.setListenerPosition(this._listenerPosition[0],
    this._listenerPosition[1], this._listenerPosition[2]);
};


module.exports = EarlyReflections;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
 * @file Primary namespace for ResonanceAudio library.
 * @author Andrew Allen <bitllama@google.com>
 */

 


// Main module.
exports.ResonanceAudio = __webpack_require__(11);


// Testable Submodules.
exports.ResonanceAudio.Attenuation = __webpack_require__(6);
exports.ResonanceAudio.Directivity = __webpack_require__(5);
exports.ResonanceAudio.EarlyReflections = __webpack_require__(9);
exports.ResonanceAudio.Encoder = __webpack_require__(1);
exports.ResonanceAudio.LateReflections = __webpack_require__(8);
exports.ResonanceAudio.Listener = __webpack_require__(2);
exports.ResonanceAudio.Room = __webpack_require__(7);
exports.ResonanceAudio.Source = __webpack_require__(4);
exports.ResonanceAudio.Tables = __webpack_require__(3);
exports.ResonanceAudio.Utils = __webpack_require__(0);
exports.ResonanceAudio.Version = __webpack_require__(13);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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




// Internal dependencies.
const Listener = __webpack_require__(2);
const Source = __webpack_require__(4);
const Room = __webpack_require__(7);
const Encoder = __webpack_require__(1);
const Utils = __webpack_require__(0);


/**
 * @class ResonanceAudio
 * @description Main class for managing sources, room and listener models.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.ambisonicOrder
 * Desired ambisonic Order. Defaults to
 * {@linkcode Utils.DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
 * @param {Float32Array} options.listenerPosition
 * The listener's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Float32Array} options.listenerForward
 * The listener's initial forward vector.
 * Defaults to {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @param {Float32Array} options.listenerUp
 * The listener's initial up vector.
 * Defaults to {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 * @param {Object} options.dimensions Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} options.materials Named acoustic materials per wall.
 * Defaults to {@linkcode Utils.DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
 * @param {Number} options.speedOfSound
 * (in meters/second). Defaults to
 * {@linkcode Utils.DEFAULT_SPEED_OF_SOUND DEFAULT_SPEED_OF_SOUND}.
 */
function ResonanceAudio(context, options) {
  // Public variables.
  /**
   * Binaurally-rendered stereo (2-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof ResonanceAudio
   * @instance
   */
  /**
   * Ambisonic (multichannel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}
   * (For rendering input soundfields).
   * @member {AudioNode} ambisonicInput
   * @memberof ResonanceAudio
   * @instance
   */
  /**
   * Ambisonic (multichannel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}
   * (For allowing external rendering / post-processing).
   * @member {AudioNode} ambisonicOutput
   * @memberof ResonanceAudio
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.ambisonicOrder == undefined) {
    options.ambisonicOrder = Utils.DEFAULT_AMBISONIC_ORDER;
  }
  if (options.listenerPosition == undefined) {
    options.listenerPosition = Utils.DEFAULT_POSITION.slice();
  }
  if (options.listenerForward == undefined) {
    options.listenerForward = Utils.DEFAULT_FORWARD.slice();
  }
  if (options.listenerUp == undefined) {
    options.listenerUp = Utils.DEFAULT_UP.slice();
  }
  if (options.dimensions == undefined) {
    options.dimensions = {};
    Object.assign(options.dimensions, Utils.DEFAULT_ROOM_DIMENSIONS);
  }
  if (options.materials == undefined) {
    options.materials = {};
    Object.assign(options.materials, Utils.DEFAULT_ROOM_MATERIALS);
  }
  if (options.speedOfSound == undefined) {
    options.speedOfSound = Utils.DEFAULT_SPEED_OF_SOUND;
  }

  // Create member submodules.
  this._ambisonicOrder = Encoder.validateAmbisonicOrder(options.ambisonicOrder);
  this._sources = [];
  this._room = new Room(context, {
    listenerPosition: options.listenerPosition,
    dimensions: options.dimensions,
    materials: options.materials,
    speedOfSound: options.speedOfSound,
  });
  this._listener = new Listener(context, {
    ambisonicOrder: options.ambisonicOrder,
    position: options.listenerPosition,
    forward: options.listenerForward,
    up: options.listenerUp,
  });

  // Create auxillary audio nodes.
  this._context = context;
  this.output = context.createGain();
  this.ambisonicOutput = context.createGain();
  this.ambisonicInput = this._listener.input;

  // Connect audio graph.
  this._room.output.connect(this._listener.input);
  this._listener.output.connect(this.output);
  this._listener.ambisonicOutput.connect(this.ambisonicOutput);
}


/**
 * Create a new source for the scene.
 * @param {Object} options
 * @param {Float32Array} options.position
 * The source's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Float32Array} options.forward
 * The source's initial forward vector. Defaults to
 * {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @param {Float32Array} options.up
 * The source's initial up vector. Defaults to
 * {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 * @param {Number} options.minDistance
 * Min. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MIN_DISTANCE DEFAULT_MIN_DISTANCE}.
 * @param {Number} options.maxDistance
 * Max. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MAX_DISTANCE DEFAULT_MAX_DISTANCE}.
 * @param {string} options.rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}. Defaults to
 * {@linkcode Utils.DEFAULT_ATTENUATION_ROLLOFF DEFAULT_ATTENUATION_ROLLOFF}.
 * @param {Number} options.gain Input gain (linear). Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_GAIN DEFAULT_SOURCE_GAIN}.
 * @param {Number} options.alpha Directivity alpha. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_ALPHA DEFAULT_DIRECTIVITY_ALPHA}.
 * @param {Number} options.sharpness Directivity sharpness. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_SHARPNESS
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 * @param {Number} options.sourceWidth
 * Source width (in degrees). Where 0 degrees is a point source and 360 degrees
 * is an omnidirectional source. Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_WIDTH DEFAULT_SOURCE_WIDTH}.
 * @return {Source}
 */
ResonanceAudio.prototype.createSource = function(options) {
  // Create a source and push it to the internal sources array, returning
  // the object's reference to the user.
  let source = new Source(this, options);
  this._sources[this._sources.length] = source;
  return source;
};


/**
 * Set the scene's desired ambisonic order.
 * @param {Number} ambisonicOrder Desired ambisonic order.
 */
ResonanceAudio.prototype.setAmbisonicOrder = function(ambisonicOrder) {
  this._ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);
};


/**
 * Set the room's dimensions and wall materials.
 * @param {Object} dimensions Room dimensions (in meters).
 * @param {Object} materials Named acoustic materials per wall.
 */
ResonanceAudio.prototype.setRoomProperties = function(dimensions, materials) {
  this._room.setProperties(dimensions, materials);
};


/**
 * Set the listener's position (in meters), where origin is the center of
 * the room.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
ResonanceAudio.prototype.setListenerPosition = function(x, y, z) {
  // Update listener position.
  this._listener.position[0] = x;
  this._listener.position[1] = y;
  this._listener.position[2] = z;
  this._room.setListenerPosition(x, y, z);

  // Update sources with new listener position.
  this._sources.forEach(function(element) {
     element._update();
  });
};


/**
 * Set the source's orientation using forward and up vectors.
 * @param {Number} forwardX
 * @param {Number} forwardY
 * @param {Number} forwardZ
 * @param {Number} upX
 * @param {Number} upY
 * @param {Number} upZ
 */
ResonanceAudio.prototype.setListenerOrientation = function(forwardX, forwardY,
  forwardZ, upX, upY, upZ) {
  this._listener.setOrientation(forwardX, forwardY, forwardZ, upX, upY, upZ);
};


/**
 * Set the listener's position and orientation using a Three.js Matrix4 object.
 * @param {Object} matrix
 * The Three.js Matrix4 object representing the listener's world transform.
 */
ResonanceAudio.prototype.setListenerFromMatrix = function(matrix) {
  this._listener.setFromMatrix(matrix);

  // Update the rest of the scene using new listener position.
  this.setListenerPosition(this._listener.position[0],
    this._listener.position[1], this._listener.position[2]);
};


/**
 * Set the speed of sound.
 * @param {Number} speedOfSound
 */
ResonanceAudio.prototype.setSpeedOfSound = function(speedOfSound) {
  this._room.speedOfSound = speedOfSound;
};


module.exports = ResonanceAudio;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
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
 * @file Omnitone library common utilities.
 */


/**
 * Omnitone library logging function.
 * @param {any} Message to be printed out.
 */
exports.log = function() {
  window.console.log.apply(window.console, [
    '%c[Omnitone]%c ' + Array.prototype.slice.call(arguments).join(' ') +
        ' %c(@' + performance.now().toFixed(2) + 'ms)',
    'background: #BBDEFB; color: #FF5722; font-weight: 500', 'font-weight: 300',
    'color: #AAA',
  ]);
};


/**
 * Omnitone library error-throwing function.
 * @param {any} Message to be printed out.
 */
exports.throw = function() {
  window.console.error.apply(window.console, [
    '%c[Omnitone]%c ' + Array.prototype.slice.call(arguments).join(' ') +
        ' %c(@' + performance.now().toFixed(2) + 'ms)',
    'background: #C62828; color: #FFEBEE; font-weight: 800', 'font-weight: 400',
    'color: #AAA',
  ]);

  throw new Error(false);
};


// Static temp storage for matrix inversion.
let a00;
let a01;
let a02;
let a03;
let a10;
let a11;
let a12;
let a13;
let a20;
let a21;
let a22;
let a23;
let a30;
let a31;
let a32;
let a33;
let b00;
let b01;
let b02;
let b03;
let b04;
let b05;
let b06;
let b07;
let b08;
let b09;
let b10;
let b11;
let det;


/**
 * A 4x4 matrix inversion utility. This does not handle the case when the
 * arguments are not proper 4x4 matrices.
 * @param {Float32Array} out   The inverted result.
 * @param {Float32Array} a     The source matrix.
 * @return {Float32Array} out
 */
exports.invertMatrix4 = function(out, a) {
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  a30 = a[12];
  a31 = a[13];
  a32 = a[14];
  a33 = a[15];
  b00 = a00 * a11 - a01 * a10;
  b01 = a00 * a12 - a02 * a10;
  b02 = a00 * a13 - a03 * a10;
  b03 = a01 * a12 - a02 * a11;
  b04 = a01 * a13 - a03 * a11;
  b05 = a02 * a13 - a03 * a12;
  b06 = a20 * a31 - a21 * a30;
  b07 = a20 * a32 - a22 * a30;
  b08 = a20 * a33 - a23 * a30;
  b09 = a21 * a32 - a22 * a31;
  b10 = a21 * a33 - a23 * a31;
  b11 = a22 * a33 - a23 * a32;
  det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
};


/**
 * Check if a value is defined in the ENUM dictionary.
 * @param {Object} enumDictionary - ENUM dictionary.
 * @param {Number|String} entryValue - a value to probe.
 * @return {Boolean}
 */
exports.isDefinedENUMEntry = function(enumDictionary, entryValue) {
  for (let enumKey in enumDictionary) {
    if (entryValue === enumDictionary[enumKey]) {
      return true;
    }
  }
  return false;
};


/**
 * Check if the given object is an instance of BaseAudioContext.
 * @param {AudioContext} context - A context object to be checked.
 * @return {Boolean}
 */
exports.isAudioContext = function(context) {
  // TODO(hoch): Update this when BaseAudioContext is available for all
  // browsers.
  return context instanceof AudioContext ||
    context instanceof OfflineAudioContext;
};


/**
 * Check if the given object is a valid AudioBuffer.
 * @param {Object} audioBuffer An AudioBuffer object to be checked.
 * @return {Boolean}
 */
exports.isAudioBuffer = function(audioBuffer) {
  return audioBuffer instanceof AudioBuffer;
};


/**
 * Perform channel-wise merge on multiple AudioBuffers. The sample rate and
 * the length of buffers to be merged must be identical.
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer[]} bufferList - An array of AudioBuffers to be merged
 * channel-wise.
 * @return {AudioBuffer} - A single merged AudioBuffer.
 */
exports.mergeBufferListByChannel = function(context, bufferList) {
  const bufferLength = bufferList[0].length;
  const bufferSampleRate = bufferList[0].sampleRate;
  let bufferNumberOfChannel = 0;

  for (let i = 0; i < bufferList.length; ++i) {
    if (bufferNumberOfChannel > 32) {
      exports.throw('Utils.mergeBuffer: Number of channels cannot exceed 32.' +
          '(got ' + bufferNumberOfChannel + ')');
    }
    if (bufferLength !== bufferList[i].length) {
      exports.throw('Utils.mergeBuffer: AudioBuffer lengths are ' +
          'inconsistent. (expected ' + bufferLength + ' but got ' +
          bufferList[i].length + ')');
    }
    if (bufferSampleRate !== bufferList[i].sampleRate) {
      exports.throw('Utils.mergeBuffer: AudioBuffer sample rates are ' +
          'inconsistent. (expected ' + bufferSampleRate + ' but got ' +
          bufferList[i].sampleRate + ')');
    }
    bufferNumberOfChannel += bufferList[i].numberOfChannels;
  }

  const buffer = context.createBuffer(bufferNumberOfChannel,
                                      bufferLength,
                                      bufferSampleRate);
  let destinationChannelIndex = 0;
  for (let i = 0; i < bufferList.length; ++i) {
    for (let j = 0; j < bufferList[i].numberOfChannels; ++j) {
      buffer.getChannelData(destinationChannelIndex++).set(
          bufferList[i].getChannelData(j));
    }
  }

  return buffer;
};


/**
 * Perform channel-wise split by the given channel count. For example,
 * 1 x AudioBuffer(8) -> splitBuffer(context, buffer, 2) -> 4 x AudioBuffer(2).
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer} audioBuffer - An AudioBuffer to be splitted.
 * @param {Number} splitBy - Number of channels to be splitted.
 * @return {AudioBuffer[]} - An array of splitted AudioBuffers.
 */
exports.splitBufferbyChannel = function(context, audioBuffer, splitBy) {
  if (audioBuffer.numberOfChannels <= splitBy) {
    exports.throw('Utils.splitBuffer: Insufficient number of channels. (' +
        audioBuffer.numberOfChannels + ' splitted by ' + splitBy + ')');
  }

  let bufflerList = [];
  let sourceChannelIndex = 0;
  const numberOfSplittedBuffer =
      Math.ceil(audioBuffer.numberOfChannels / splitBy);
  for (let i = 0; i < numberOfSplittedBuffer; ++i) {
    let buffer = context.createBuffer(splitBy,
                                      audioBuffer.length,
                                      audioBuffer.sampleRate);
    for (let j = 0; j < splitBy; ++j) {
      if (sourceChannelIndex < audioBuffer.numberOfChannels) {
        buffer.getChannelData(j).set(
          audioBuffer.getChannelData(sourceChannelIndex++));
      }
    }
    bufflerList.push(buffer);
  }

  return bufferList;
};


/**
 * Converts Base64-encoded string to ArrayBuffer.
 * @param {string} base64String - Base64-encdoed string.
 * @return {ArrayByuffer} Converted ArrayBuffer object.
 */
exports.getArrayBufferFromBase64String = function(base64String) {
  let binaryString = window.atob(base64String);
  let byteArray = new Uint8Array(binaryString.length);
  byteArray.forEach(
    (value, index) => byteArray[index] = binaryString.charCodeAt(index));
  return byteArray.buffer;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file Streamlined AudioBuffer loader.
 */




const Utils = __webpack_require__(0);

/**
 * @typedef {string} BufferDataType
 */

/**
 * Buffer data type for ENUM.
 * @enum {BufferDataType}
 */
const BufferDataType = {
  /** @type {string} The data contains Base64-encoded string.. */
  BASE64: 'base64',
  /** @type {string} The data is a URL for audio file. */
  URL: 'url',
};


/**
 * BufferList object mananges the async loading/decoding of multiple
 * AudioBuffers from multiple URLs.
 * @constructor
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {string[]} bufferData - An ordered list of URLs.
 * @param {Object} options - Options
 * @param {string} [options.dataType='base64'] - BufferDataType specifier.
 * @param {Boolean} [options.verbose=false] - Log verbosity. |true| prints the
 * individual message from each URL and AudioBuffer.
 */
function BufferList(context, bufferData, options) {
  this._context = Utils.isAudioContext(context) ?
      context :
      Utils.throw('BufferList: Invalid BaseAudioContext.');

  this._options = {
    dataType: BufferDataType.BASE64,
    verbose: false,
  };

  if (options) {
    if (options.dataType &&
        Utils.isDefinedENUMEntry(BufferDataType, options.dataType)) {
      this._options.dataType = options.dataType;
    }
    if (options.verbose) {
      this._options.verbose = Boolean(options.verbose);
    }
  }

  this._bufferList = [];
  this._bufferData = this._options.dataType === BufferDataType.BASE64
      ? bufferData
      : bufferData.slice(0);
  this._numberOfTasks = this._bufferData.length;

  this._resolveHandler = null;
  this._rejectHandler = new Function();
}


/**
 * Starts AudioBuffer loading tasks.
 * @return {Promise<AudioBuffer[]>} The promise resolves with an array of
 * AudioBuffer.
 */
BufferList.prototype.load = function() {
  return new Promise(this._promiseGenerator.bind(this));
};


/**
 * Promise argument generator. Internally starts multiple async loading tasks.
 * @private
 * @param {function} resolve Promise resolver.
 * @param {function} reject Promise reject.
 */
BufferList.prototype._promiseGenerator = function(resolve, reject) {
  if (typeof resolve !== 'function') {
    Utils.throw('BufferList: Invalid Promise resolver.');
  } else {
    this._resolveHandler = resolve;
  }

  if (typeof reject === 'function') {
    this._rejectHandler = reject;
  }

  for (let i = 0; i < this._bufferData.length; ++i) {
    this._options.dataType === BufferDataType.BASE64
        ? this._launchAsyncLoadTask(i)
        : this._launchAsyncLoadTaskXHR(i);
  }
};


/**
 * Run async loading task for Base64-encoded string.
 * @private
 * @param {Number} taskId Task ID number from the ordered list |bufferData|.
 */
BufferList.prototype._launchAsyncLoadTask = function(taskId) {
  const that = this;
  this._context.decodeAudioData(
      Utils.getArrayBufferFromBase64String(this._bufferData[taskId]),
      function(audioBuffer) {
        that._updateProgress(taskId, audioBuffer);
      },
      function(errorMessage) {
        that._updateProgress(taskId, null);
        const message = 'BufferList: decoding ArrayByffer("' + taskId +
            '" from Base64-encoded data failed. (' + errorMessage + ')';
        Utils.throw(message);
        that._rejectHandler(message);
      });
};


/**
 * Run async loading task via XHR for audio file URLs.
 * @private
 * @param {Number} taskId Task ID number from the ordered list |bufferData|.
 */
BufferList.prototype._launchAsyncLoadTaskXHR = function(taskId) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', this._bufferData[taskId]);
  xhr.responseType = 'arraybuffer';

  const that = this;
  xhr.onload = function() {
    if (xhr.status === 200) {
      that._context.decodeAudioData(
          xhr.response,
          function(audioBuffer) {
            that._updateProgress(taskId, audioBuffer);
          },
          function(errorMessage) {
            that._updateProgress(taskId, null);
            const message = 'BufferList: decoding "' +
                that._bufferData[taskId] + '" failed. (' + errorMessage + ')';
            Utils.throw(message);
            that._rejectHandler(message);
          });
    } else {
      const message = 'BufferList: XHR error while loading "' +
          that._bufferData[taskId] + '(' + xhr.statusText + ')';
      Utils.throw(message);
      that._rejectHandler(message);
    }
  };

  xhr.onerror = function(event) {
    Utils.throw(
        'BufferList: XHR network failed on loading "' +
        that._bufferData[taskId] + '".');
    that._updateProgress(taskId, null);
    that._rejectHandler();
  };

  xhr.send();
};


/**
 * Updates the overall progress on loading tasks.
 * @param {Number} taskId Task ID number.
 * @param {AudioBuffer} audioBuffer Decoded AudioBuffer object.
 */
BufferList.prototype._updateProgress = function(taskId, audioBuffer) {
  this._bufferList[taskId] = audioBuffer;

  if (this._options.verbose) {
    let messageString = this._options.dataType === BufferDataType.BASE64
        ? 'ArrayBuffer(' + taskId + ') from Base64-encoded HRIR'
        : '"' + this._bufferData[taskId] + '"';
    Utils.log('BufferList: ' + messageString + ' successfully loaded.');
  }

  if (--this._numberOfTasks === 0) {
    let messageString = this._options.dataType === BufferDataType.BASE64
        ? this._bufferData.length + ' AudioBuffers from Base64-encoded HRIRs'
        : this._bufferData.length + ' files via XHR';
    Utils.log('BufferList: ' + messageString + ' loaded successfully.');
    this._resolveHandler(this._bufferList);
  }
};


module.exports = BufferList;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file An audio channel router to resolve different channel layouts between
 * browsers.
 */




/**
 * @typedef {Number[]} ChannelMap
 */

/**
 * Channel map dictionary ENUM.
 * @enum {ChannelMap}
 */
const ChannelMap = {
  /** @type {Number[]} - ACN channel map for Chrome and FireFox. (FFMPEG) */
  DEFAULT: [0, 1, 2, 3],
  /** @type {Number[]} - Safari's 4-channel map for AAC codec. */
  SAFARI: [2, 0, 1, 3],
  /** @type {Number[]} - ACN > FuMa conversion map. */
  FUMA: [0, 3, 1, 2],
};


/**
 * Channel router for FOA stream.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number[]} channelMap - Routing destination array.
 */
function FOARouter(context, channelMap) {
  this._context = context;

  this._splitter = this._context.createChannelSplitter(4);
  this._merger = this._context.createChannelMerger(4);

  // input/output proxy.
  this.input = this._splitter;
  this.output = this._merger;

  this.setChannelMap(channelMap || ChannelMap.DEFAULT);
}


/**
 * Sets channel map.
 * @param {Number[]} channelMap - A new channel map for FOA stream.
 */
FOARouter.prototype.setChannelMap = function(channelMap) {
  if (!Array.isArray(channelMap)) {
    return;
  }

  this._channelMap = channelMap;
  this._splitter.disconnect();
  this._splitter.connect(this._merger, 0, this._channelMap[0]);
  this._splitter.connect(this._merger, 1, this._channelMap[1]);
  this._splitter.connect(this._merger, 2, this._channelMap[2]);
  this._splitter.connect(this._merger, 3, this._channelMap[3]);
};


/**
 * Static channel map ENUM.
 * @static
 * @type {ChannelMap}
 */
FOARouter.ChannelMap = ChannelMap;


module.exports = FOARouter;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file Sound field rotator for first-order-ambisonics decoding.
 */




/**
 * First-order-ambisonic decoder based on gain node network.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 */
function FOARotator(context) {
  this._context = context;

  this._splitter = this._context.createChannelSplitter(4);
  this._inY = this._context.createGain();
  this._inZ = this._context.createGain();
  this._inX = this._context.createGain();
  this._m0 = this._context.createGain();
  this._m1 = this._context.createGain();
  this._m2 = this._context.createGain();
  this._m3 = this._context.createGain();
  this._m4 = this._context.createGain();
  this._m5 = this._context.createGain();
  this._m6 = this._context.createGain();
  this._m7 = this._context.createGain();
  this._m8 = this._context.createGain();
  this._outY = this._context.createGain();
  this._outZ = this._context.createGain();
  this._outX = this._context.createGain();
  this._merger = this._context.createChannelMerger(4);

  // ACN channel ordering: [1, 2, 3] => [-Y, Z, -X]
  // Y (from channel 1)
  this._splitter.connect(this._inY, 1);
  // Z (from channel 2)
  this._splitter.connect(this._inZ, 2);
  // X (from channel 3)
  this._splitter.connect(this._inX, 3);
  this._inY.gain.value = -1;
  this._inX.gain.value = -1;

  // Apply the rotation in the world space.
  // |Y|   | m0  m3  m6 |   | Y * m0 + Z * m3 + X * m6 |   | Yr |
  // |Z| * | m1  m4  m7 | = | Y * m1 + Z * m4 + X * m7 | = | Zr |
  // |X|   | m2  m5  m8 |   | Y * m2 + Z * m5 + X * m8 |   | Xr |
  this._inY.connect(this._m0);
  this._inY.connect(this._m1);
  this._inY.connect(this._m2);
  this._inZ.connect(this._m3);
  this._inZ.connect(this._m4);
  this._inZ.connect(this._m5);
  this._inX.connect(this._m6);
  this._inX.connect(this._m7);
  this._inX.connect(this._m8);
  this._m0.connect(this._outY);
  this._m1.connect(this._outZ);
  this._m2.connect(this._outX);
  this._m3.connect(this._outY);
  this._m4.connect(this._outZ);
  this._m5.connect(this._outX);
  this._m6.connect(this._outY);
  this._m7.connect(this._outZ);
  this._m8.connect(this._outX);

  // Transform 3: world space to audio space.
  // W -> W (to channel 0)
  this._splitter.connect(this._merger, 0, 0);
  // Y (to channel 1)
  this._outY.connect(this._merger, 0, 1);
  // Z (to channel 2)
  this._outZ.connect(this._merger, 0, 2);
  // X (to channel 3)
  this._outX.connect(this._merger, 0, 3);
  this._outY.gain.value = -1;
  this._outX.gain.value = -1;

  this.setRotationMatrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));

  // input/output proxy.
  this.input = this._splitter;
  this.output = this._merger;
}


/**
 * Updates the rotation matrix with 3x3 matrix.
 * @param {Number[]} rotationMatrix3 - A 3x3 rotation matrix. (column-major)
 */
FOARotator.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  this._m0.gain.value = rotationMatrix3[0];
  this._m1.gain.value = rotationMatrix3[1];
  this._m2.gain.value = rotationMatrix3[2];
  this._m3.gain.value = rotationMatrix3[3];
  this._m4.gain.value = rotationMatrix3[4];
  this._m5.gain.value = rotationMatrix3[5];
  this._m6.gain.value = rotationMatrix3[6];
  this._m7.gain.value = rotationMatrix3[7];
  this._m8.gain.value = rotationMatrix3[8];
};


/**
 * Updates the rotation matrix with 4x4 matrix.
 * @param {Number[]} rotationMatrix4 - A 4x4 rotation matrix. (column-major)
 */
FOARotator.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  this._m0.gain.value = rotationMatrix4[0];
  this._m1.gain.value = rotationMatrix4[1];
  this._m2.gain.value = rotationMatrix4[2];
  this._m3.gain.value = rotationMatrix4[4];
  this._m4.gain.value = rotationMatrix4[5];
  this._m5.gain.value = rotationMatrix4[6];
  this._m6.gain.value = rotationMatrix4[8];
  this._m7.gain.value = rotationMatrix4[9];
  this._m8.gain.value = rotationMatrix4[10];
};


/**
 * Returns the current 3x3 rotation matrix.
 * @return {Number[]} - A 3x3 rotation matrix. (column-major)
 */
FOARotator.prototype.getRotationMatrix3 = function() {
  return [
    this._m0.gain.value, this._m1.gain.value, this._m2.gain.value,
    this._m3.gain.value, this._m4.gain.value, this._m5.gain.value,
    this._m6.gain.value, this._m7.gain.value, this._m8.gain.value,
  ];
};


/**
 * Returns the current 4x4 rotation matrix.
 * @return {Number[]} - A 4x4 rotation matrix. (column-major)
 */
FOARotator.prototype.getRotationMatrix4 = function() {
  let rotationMatrix4 = new Float32Array(16);
  rotationMatrix4[0] = this._m0.gain.value;
  rotationMatrix4[1] = this._m1.gain.value;
  rotationMatrix4[2] = this._m2.gain.value;
  rotationMatrix4[4] = this._m3.gain.value;
  rotationMatrix4[5] = this._m4.gain.value;
  rotationMatrix4[6] = this._m5.gain.value;
  rotationMatrix4[8] = this._m6.gain.value;
  rotationMatrix4[9] = this._m7.gain.value;
  rotationMatrix4[10] = this._m8.gain.value;
  return rotationMatrix4;
};


module.exports = FOARotator;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file A collection of convolvers. Can be used for the optimized FOA binaural
 * rendering. (e.g. SH-MaxRe HRTFs)
 */




/**
 * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
 * @constructor
 * @param {BaseAudioContext} context The associated AudioContext.
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * AudioBuffers for convolution. (i.e. 2 stereo AudioBuffers for FOA)
 */
function FOAConvolver(context, hrirBufferList) {
  this._context = context;

  this._active = false;
  this._isBufferLoaded = false;

  this._buildAudioGraph();

  if (hrirBufferList) {
    this.setHRIRBufferList(hrirBufferList);
  }

  this.enable();
}


/**
 * Build the internal audio graph.
 *
 * @private
 */
FOAConvolver.prototype._buildAudioGraph = function() {
  this._splitterWYZX = this._context.createChannelSplitter(4);
  this._mergerWY = this._context.createChannelMerger(2);
  this._mergerZX = this._context.createChannelMerger(2);
  this._convolverWY = this._context.createConvolver();
  this._convolverZX = this._context.createConvolver();
  this._splitterWY = this._context.createChannelSplitter(2);
  this._splitterZX = this._context.createChannelSplitter(2);
  this._inverter = this._context.createGain();
  this._mergerBinaural = this._context.createChannelMerger(2);
  this._summingBus = this._context.createGain();

  // Group W and Y, then Z and X.
  this._splitterWYZX.connect(this._mergerWY, 0, 0);
  this._splitterWYZX.connect(this._mergerWY, 1, 1);
  this._splitterWYZX.connect(this._mergerZX, 2, 0);
  this._splitterWYZX.connect(this._mergerZX, 3, 1);

  // Create a network of convolvers using splitter/merger.
  this._mergerWY.connect(this._convolverWY);
  this._mergerZX.connect(this._convolverZX);
  this._convolverWY.connect(this._splitterWY);
  this._convolverZX.connect(this._splitterZX);
  this._splitterWY.connect(this._mergerBinaural, 0, 0);
  this._splitterWY.connect(this._mergerBinaural, 0, 1);
  this._splitterWY.connect(this._mergerBinaural, 1, 0);
  this._splitterWY.connect(this._inverter, 1, 0);
  this._inverter.connect(this._mergerBinaural, 0, 1);
  this._splitterZX.connect(this._mergerBinaural, 0, 0);
  this._splitterZX.connect(this._mergerBinaural, 0, 1);
  this._splitterZX.connect(this._mergerBinaural, 1, 0);
  this._splitterZX.connect(this._mergerBinaural, 1, 1);

  // By default, WebAudio's convolver does the normalization based on IR's
  // energy. For the precise convolution, it must be disabled before the buffer
  // assignment.
  this._convolverWY.normalize = false;
  this._convolverZX.normalize = false;

  // For asymmetric degree.
  this._inverter.gain.value = -1;

  // Input/output proxy.
  this.input = this._splitterWYZX;
  this.output = this._summingBus;
};


/**
 * Assigns 2 HRIR AudioBuffers to 2 convolvers: Note that we use 2 stereo
 * convolutions for 4-channel direct convolution. Using mono convolver or
 * 4-channel convolver is not viable because mono convolution wastefully
 * produces the stereo outputs, and the 4-ch convolver does cross-channel
 * convolution. (See Web Audio API spec)
 * @param {AudioBuffer[]} hrirBufferList - An array of stereo AudioBuffers for
 * convolvers.
 */
FOAConvolver.prototype.setHRIRBufferList = function(hrirBufferList) {
  // After these assignments, the channel data in the buffer is immutable in
  // FireFox. (i.e. neutered) So we should avoid re-assigning buffers, otherwise
  // an exception will be thrown.
  if (this._isBufferLoaded) {
    return;
  }

  this._convolverWY.buffer = hrirBufferList[0];
  this._convolverZX.buffer = hrirBufferList[1];
  this._isBufferLoaded = true;
};


/**
 * Enable FOAConvolver instance. The audio graph will be activated and pulled by
 * the WebAudio engine. (i.e. consume CPU cycle)
 */
FOAConvolver.prototype.enable = function() {
  this._mergerBinaural.connect(this._summingBus);
  this._active = true;
};


/**
 * Disable FOAConvolver instance. The inner graph will be disconnected from the
 * audio destination, thus no CPU cycle will be consumed.
 */
FOAConvolver.prototype.disable = function() {
  this._mergerBinaural.disconnect();
  this._active = false;
};


module.exports = FOAConvolver;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @fileOverview DEPRECATED at V1. Audio buffer loading utility.
 */



const Utils = __webpack_require__(0);

/**
 * Streamlined audio file loader supports Promise.
 * @param {Object} context          AudioContext
 * @param {Object} audioFileData    Audio file info as [{name, url}]
 * @param {Function} resolve        Resolution handler for promise.
 * @param {Function} reject         Rejection handler for promise.
 * @param {Function} progress       Progress event handler.
 */
function AudioBufferManager(context, audioFileData, resolve, reject, progress) {
  this._context = context;

  this._buffers = new Map();
  this._loadingTasks = {};

  this._resolve = resolve;
  this._reject = reject;
  this._progress = progress;

  // Iterating file loading.
  for (let i = 0; i < audioFileData.length; i++) {
    const fileInfo = audioFileData[i];

    // Check for duplicates filename and quit if it happens.
    if (this._loadingTasks.hasOwnProperty(fileInfo.name)) {
      Utils.log('Duplicated filename when loading: ' + fileInfo.name);
      return;
    }

    // Mark it as pending (0)
    this._loadingTasks[fileInfo.name] = 0;
    this._loadAudioFile(fileInfo);
  }
}

AudioBufferManager.prototype._loadAudioFile = function(fileInfo) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', fileInfo.url);
  xhr.responseType = 'arraybuffer';

  const that = this;
  xhr.onload = function() {
    if (xhr.status === 200) {
      that._context.decodeAudioData(xhr.response,
        function(buffer) {
          // Utils.log('File loaded: ' + fileInfo.url);
          that._done(fileInfo.name, buffer);
        },
        function(message) {
          Utils.log('Decoding failure: '
            + fileInfo.url + ' (' + message + ')');
          that._done(fileInfo.name, null);
        });
    } else {
      Utils.log('XHR Error: ' + fileInfo.url + ' (' + xhr.statusText
        + ')');
      that._done(fileInfo.name, null);
    }
  };

  // TODO: fetch local resources if XHR fails.
  xhr.onerror = function(event) {
    Utils.log('XHR Network failure: ' + fileInfo.url);
    that._done(fileInfo.name, null);
  };

  xhr.send();
};

AudioBufferManager.prototype._done = function(filename, buffer) {
  // Label the loading task.
  this._loadingTasks[filename] = buffer !== null ? 'loaded' : 'failed';

  // A failed task will be a null buffer.
  this._buffers.set(filename, buffer);

  this._updateProgress(filename);
};

AudioBufferManager.prototype._updateProgress = function(filename) {
  let numberOfFinishedTasks = 0;
  let numberOfFailedTask = 0;
  let numberOfTasks = 0;

  for (const task in this._loadingTasks) {
    if (Object.prototype.hasOwnProperty.call(this._loadingTasks, task)) {
      numberOfTasks++;
      if (this._loadingTasks[task] === 'loaded') {
        numberOfFinishedTasks++;
      } else if (this._loadingTasks[task] === 'failed') {
        numberOfFailedTask++;
      }
    }
  }

  if (typeof this._progress === 'function') {
    this._progress(filename, numberOfFinishedTasks, numberOfTasks);
    return;
  }

  if (numberOfFinishedTasks === numberOfTasks) {
    this._resolve(this._buffers);
    return;
  }

  if (numberOfFinishedTasks + numberOfFailedTask === numberOfTasks) {
    this._reject(this._buffers);
    return;
  }
};

module.exports = AudioBufferManager;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file Phase matched filter for first-order-ambisonics decoding.
 */



const Utils = __webpack_require__(0);


// Static parameters.
const CROSSOVER_FREQUENCY = 690;
const GAIN_COEFFICIENTS = [1.4142, 0.8166, 0.8166, 0.8166];


/**
 * Generate the coefficients for dual band filter.
 * @param {Number} crossoverFrequency
 * @param {Number} sampleRate
 * @return {Object} Filter coefficients.
 */
function generateDualBandCoefficients(crossoverFrequency, sampleRate) {
  const k = Math.tan(Math.PI * crossoverFrequency / sampleRate);
  const k2 = k * k;
  const denominator = k2 + 2 * k + 1;

  return {
    lowpassA: [1, 2 * (k2 - 1) / denominator, (k2 - 2 * k + 1) / denominator],
    lowpassB: [k2 / denominator, 2 * k2 / denominator, k2 / denominator],
    hipassA: [1, 2 * (k2 - 1) / denominator, (k2 - 2 * k + 1) / denominator],
    hipassB: [1 / denominator, -2 * 1 / denominator, 1 / denominator],
  };
}


/**
 * FOAPhaseMatchedFilter: A set of filters (LP/HP) with a crossover frequency to
 * compensate the gain of high frequency contents without a phase difference.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 */
function FOAPhaseMatchedFilter(context) {
  this._context = context;

  this._input = this._context.createGain();

  if (!this._context.createIIRFilter) {
    Utils.log('IIR filter is missing. Using Biquad filter instead.');
    this._lpf = this._context.createBiquadFilter();
    this._hpf = this._context.createBiquadFilter();
    this._lpf.frequency.value = CROSSOVER_FREQUENCY;
    this._hpf.frequency.value = CROSSOVER_FREQUENCY;
    this._hpf.type = 'highpass';
  } else {
    const coef = generateDualBandCoefficients(CROSSOVER_FREQUENCY,
                                              this._context.sampleRate);
    this._lpf = this._context.createIIRFilter(coef.lowpassB, coef.lowpassA);
    this._hpf = this._context.createIIRFilter(coef.hipassB, coef.hipassA);
  }

  this._splitterLow = this._context.createChannelSplitter(4);
  this._splitterHigh = this._context.createChannelSplitter(4);
  this._gainHighW = this._context.createGain();
  this._gainHighY = this._context.createGain();
  this._gainHighZ = this._context.createGain();
  this._gainHighX = this._context.createGain();
  this._merger = this._context.createChannelMerger(4);

  this._input.connect(this._hpf);
  this._hpf.connect(this._splitterHigh);
  this._splitterHigh.connect(this._gainHighW, 0);
  this._splitterHigh.connect(this._gainHighY, 1);
  this._splitterHigh.connect(this._gainHighZ, 2);
  this._splitterHigh.connect(this._gainHighX, 3);
  this._gainHighW.connect(this._merger, 0, 0);
  this._gainHighY.connect(this._merger, 0, 1);
  this._gainHighZ.connect(this._merger, 0, 2);
  this._gainHighX.connect(this._merger, 0, 3);

  this._input.connect(this._lpf);
  this._lpf.connect(this._splitterLow);
  this._splitterLow.connect(this._merger, 0, 0);
  this._splitterLow.connect(this._merger, 1, 1);
  this._splitterLow.connect(this._merger, 2, 2);
  this._splitterLow.connect(this._merger, 3, 3);

  // Apply gain correction to hi-passed pressure and velocity components:
  // Inverting sign is necessary as the low-passed and high-passed portion are
  // out-of-phase after the filtering.
  const now = this._context.currentTime;
  this._gainHighW.gain.setValueAtTime(-1 * GAIN_COEFFICIENTS[0], now);
  this._gainHighY.gain.setValueAtTime(-1 * GAIN_COEFFICIENTS[1], now);
  this._gainHighZ.gain.setValueAtTime(-1 * GAIN_COEFFICIENTS[2], now);
  this._gainHighX.gain.setValueAtTime(-1 * GAIN_COEFFICIENTS[3], now);

  // Input/output Proxy.
  this.input = this._input;
  this.output = this._merger;
}


module.exports = FOAPhaseMatchedFilter;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file Virtual speaker abstraction for first-order-ambisonics decoding.
 */




/**
 * DEPRECATED at V1: A virtual speaker with ambisonic decoding gain coefficients
 * and HRTF convolution for first-order-ambisonics stream. Note that the
 * subgraph directly connects to context's destination.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} options - Options for speaker.
 * @param {Number[]} options.coefficients - Decoding coefficients for (W,Y,Z,X).
 * @param {AudioBuffer} options.IR - Stereo IR buffer for HRTF convolution.
 * @param {Number} options.gain - Post-gain for the speaker.
 */
function FOAVirtualSpeaker(context, options) {
  if (options.IR.numberOfChannels !== 2) {
    throw new Error('IR does not have 2 channels. cannot proceed.');
  }

  this._active = false;
  this._context = context;

  this._input = this._context.createChannelSplitter(4);
  this._cW = this._context.createGain();
  this._cY = this._context.createGain();
  this._cZ = this._context.createGain();
  this._cX = this._context.createGain();
  this._convolver = this._context.createConvolver();
  this._gain = this._context.createGain();

  this._input.connect(this._cW, 0);
  this._input.connect(this._cY, 1);
  this._input.connect(this._cZ, 2);
  this._input.connect(this._cX, 3);
  this._cW.connect(this._convolver);
  this._cY.connect(this._convolver);
  this._cZ.connect(this._convolver);
  this._cX.connect(this._convolver);
  this._convolver.connect(this._gain);
  this._gain.connect(this._context.destination);

  this.enable();

  this._convolver.normalize = false;
  this._convolver.buffer = options.IR;
  this._gain.gain.value = options.gain;

  // Set gain coefficients for FOA ambisonic streams.
  this._cW.gain.value = options.coefficients[0];
  this._cY.gain.value = options.coefficients[1];
  this._cZ.gain.value = options.coefficients[2];
  this._cX.gain.value = options.coefficients[3];

  // Input proxy. Output directly connects to the destination.
  this.input = this._input;
}


FOAVirtualSpeaker.prototype.enable = function() {
  this._gain.connect(this._context.destination);
  this._active = true;
};


FOAVirtualSpeaker.prototype.disable = function() {
  this._gain.disconnect();
  this._active = false;
};


module.exports = FOAVirtualSpeaker;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file A collection of convolvers. Can be used for the optimized HOA binaural
 * rendering. (e.g. SH-MaxRe HRTFs)
 */




/**
 * A convolver network for N-channel HOA stream.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order. (2 or 3)
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
 */
function HOAConvolver(context, ambisonicOrder, hrirBufferList) {
  this._context = context;

  this._active = false;
  this._isBufferLoaded = false;

  // The number of channels K based on the ambisonic order N where K = (N+1)^2.
  this._ambisonicOrder = ambisonicOrder;
  this._numberOfChannels =
      (this._ambisonicOrder + 1) * (this._ambisonicOrder + 1);

  this._buildAudioGraph();
  if (hrirBufferList) {
    this.setHRIRBufferList(hrirBufferList);
  }

  this.enable();
}


/**
 * Build the internal audio graph.
 * For TOA convolution:
 *   input -> splitter(16) -[0,1]-> merger(2) -> convolver(2) -> splitter(2)
 *                         -[2,3]-> merger(2) -> convolver(2) -> splitter(2)
 *                         -[4,5]-> ... (6 more, 8 branches total)
 * @private
 */
HOAConvolver.prototype._buildAudioGraph = function() {
  const numberOfStereoChannels = Math.ceil(this._numberOfChannels / 2);

  this._inputSplitter =
      this._context.createChannelSplitter(this._numberOfChannels);
  this._stereoMergers = [];
  this._convolvers = [];
  this._stereoSplitters = [];
  this._positiveIndexSphericalHarmonics = this._context.createGain();
  this._negativeIndexSphericalHarmonics = this._context.createGain();
  this._inverter = this._context.createGain();
  this._binauralMerger = this._context.createChannelMerger(2);
  this._outputGain = this._context.createGain();

  for (let i = 0; i < numberOfStereoChannels; ++i) {
    this._stereoMergers[i] = this._context.createChannelMerger(2);
    this._convolvers[i] = this._context.createConvolver();
    this._stereoSplitters[i] = this._context.createChannelSplitter(2);
    this._convolvers[i].normalize = false;
  }

  for (let l = 0; l <= this._ambisonicOrder; ++l) {
    for (let m = -l; m <= l; m++) {
      // We compute the ACN index (k) of ambisonics channel using the degree (l)
      // and index (m): k = l^2 + l + m
      const acnIndex = l * l + l + m;
      const stereoIndex = Math.floor(acnIndex / 2);

      // Split channels from input into array of stereo convolvers.
      // Then create a network of mergers that produces the stereo output.
      this._inputSplitter.connect(
          this._stereoMergers[stereoIndex], acnIndex, acnIndex % 2);
      this._stereoMergers[stereoIndex].connect(this._convolvers[stereoIndex]);
      this._convolvers[stereoIndex].connect(this._stereoSplitters[stereoIndex]);

      // Positive index (m >= 0) spherical harmonics are symmetrical around the
      // front axis, while negative index (m < 0) spherical harmonics are
      // anti-symmetrical around the front axis. We will exploit this symmetry
      // to reduce the number of convolutions required when rendering to a
      // symmetrical binaural renderer.
      if (m >= 0) {
        this._stereoSplitters[stereoIndex].connect(
            this._positiveIndexSphericalHarmonics, acnIndex % 2);
      } else {
        this._stereoSplitters[stereoIndex].connect(
            this._negativeIndexSphericalHarmonics, acnIndex % 2);
      }
    }
  }

  this._positiveIndexSphericalHarmonics.connect(this._binauralMerger, 0, 0);
  this._positiveIndexSphericalHarmonics.connect(this._binauralMerger, 0, 1);
  this._negativeIndexSphericalHarmonics.connect(this._binauralMerger, 0, 0);
  this._negativeIndexSphericalHarmonics.connect(this._inverter);
  this._inverter.connect(this._binauralMerger, 0, 1);

  // For asymmetric index.
  this._inverter.gain.value = -1;

  // Input/Output proxy.
  this.input = this._inputSplitter;
  this.output = this._outputGain;
};


/**
 * Assigns N HRIR AudioBuffers to N convolvers: Note that we use 2 stereo
 * convolutions for 4-channel direct convolution. Using mono convolver or
 * 4-channel convolver is not viable because mono convolution wastefully
 * produces the stereo outputs, and the 4-ch convolver does cross-channel
 * convolution. (See Web Audio API spec)
 * @param {AudioBuffer[]} hrirBufferList - An array of stereo AudioBuffers for
 * convolvers.
 */
HOAConvolver.prototype.setHRIRBufferList = function(hrirBufferList) {
  // After these assignments, the channel data in the buffer is immutable in
  // FireFox. (i.e. neutered) So we should avoid re-assigning buffers, otherwise
  // an exception will be thrown.
  if (this._isBufferLoaded) {
    return;
  }

  for (let i = 0; i < hrirBufferList.length; ++i) {
    this._convolvers[i].buffer = hrirBufferList[i];
  }

  this._isBufferLoaded = true;
};


/**
 * Enable HOAConvolver instance. The audio graph will be activated and pulled by
 * the WebAudio engine. (i.e. consume CPU cycle)
 */
HOAConvolver.prototype.enable = function() {
  this._binauralMerger.connect(this._outputGain);
  this._active = true;
};


/**
 * Disable HOAConvolver instance. The inner graph will be disconnected from the
 * audio destination, thus no CPU cycle will be consumed.
 */
HOAConvolver.prototype.disable = function() {
  this._binauralMerger.disconnect();
  this._active = false;
};


module.exports = HOAConvolver;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file Sound field rotator for higher-order-ambisonics decoding.
 */




/**
 * Kronecker Delta function.
 * @param {Number} i
 * @param {Number} j
 * @return {Number}
 */
function getKroneckerDelta(i, j) {
  return i === j ? 1 : 0;
}


/**
 * A helper function to allow us to access a matrix array in the same
 * manner, assuming it is a (2l+1)x(2l+1) matrix. [2] uses an odd convention of
 * referring to the rows and columns using centered indices, so the middle row
 * and column are (0, 0) and the upper left would have negative coordinates.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} l
 * @param {Number} i
 * @param {Number} j
 * @param {Number} gainValue
 */
function setCenteredElement(matrix, l, i, j, gainValue) {
  const index = (j + l) * (2 * l + 1) + (i + l);
  // Row-wise indexing.
  matrix[l - 1][index].gain.value = gainValue;
}


/**
 * This is a helper function to allow us to access a matrix array in the same
 * manner, assuming it is a (2l+1) x (2l+1) matrix.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} l
 * @param {Number} i
 * @param {Number} j
 * @return {Number}
 */
function getCenteredElement(matrix, l, i, j) {
  // Row-wise indexing.
  const index = (j + l) * (2 * l + 1) + (i + l);
  return matrix[l - 1][index].gain.value;
}


/**
 * Helper function defined in [2] that is used by the functions U, V, W.
 * This should not be called on its own, as U, V, and W (and their coefficients)
 * select the appropriate matrix elements to access arguments |a| and |b|.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} i
 * @param {Number} a
 * @param {Number} b
 * @param {Number} l
 * @return {Number}
 */
function getP(matrix, i, a, b, l) {
  if (b === l) {
    return getCenteredElement(matrix, 1, i, 1) *
        getCenteredElement(matrix, l - 1, a, l - 1) -
        getCenteredElement(matrix, 1, i, -1) *
        getCenteredElement(matrix, l - 1, a, -l + 1);
  } else if (b === -l) {
    return getCenteredElement(matrix, 1, i, 1) *
        getCenteredElement(matrix, l - 1, a, -l + 1) +
        getCenteredElement(matrix, 1, i, -1) *
        getCenteredElement(matrix, l - 1, a, l - 1);
  } else {
    return getCenteredElement(matrix, 1, i, 0) *
        getCenteredElement(matrix, l - 1, a, b);
  }
}


/**
 * The functions U, V, and W should only be called if the correspondingly
 * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
 * When the coefficient is 0, these would attempt to access matrix elements that
 * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
 * previously completed band rotations. These functions are valid for |l >= 2|.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} m
 * @param {Number} n
 * @param {Number} l
 * @return {Number}
 */
function getU(matrix, m, n, l) {
  // Although [1, 2] split U into three cases for m == 0, m < 0, m > 0
  // the actual values are the same for all three cases.
  return getP(matrix, 0, m, n, l);
}


/**
 * The functions U, V, and W should only be called if the correspondingly
 * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
 * When the coefficient is 0, these would attempt to access matrix elements that
 * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
 * previously completed band rotations. These functions are valid for |l >= 2|.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} m
 * @param {Number} n
 * @param {Number} l
 * @return {Number}
 */
function getV(matrix, m, n, l) {
  if (m === 0) {
    return getP(matrix, 1, 1, n, l) + getP(matrix, -1, -1, n, l);
  } else if (m > 0) {
    const d = getKroneckerDelta(m, 1);
    return getP(matrix, 1, m - 1, n, l) * Math.sqrt(1 + d) -
        getP(matrix, -1, -m + 1, n, l) * (1 - d);
  } else {
    // Note there is apparent errata in [1,2,2b] dealing with this particular
    // case. [2b] writes it should be P*(1-d)+P*(1-d)^0.5
    // [1] writes it as P*(1+d)+P*(1-d)^0.5, but going through the math by hand,
    // you must have it as P*(1-d)+P*(1+d)^0.5 to form a 2^.5 term, which
    // parallels the case where m > 0.
    const d = getKroneckerDelta(m, -1);
    return getP(matrix, 1, m + 1, n, l) * (1 - d) +
        getP(matrix, -1, -m - 1, n, l) * Math.sqrt(1 + d);
  }
}


/**
 * The functions U, V, and W should only be called if the correspondingly
 * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
 * When the coefficient is 0, these would attempt to access matrix elements that
 * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
 * previously completed band rotations. These functions are valid for |l >= 2|.
 * @param {Number[]} matrix N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} m
 * @param {Number} n
 * @param {Number} l
 * @return {Number}
 */
function getW(matrix, m, n, l) {
  // Whenever this happens, w is also 0 so W can be anything.
  if (m === 0) {
    return 0;
  }

  return m > 0 ? getP(matrix, 1, m + 1, n, l) + getP(matrix, -1, -m - 1, n, l) :
                 getP(matrix, 1, m - 1, n, l) - getP(matrix, -1, -m + 1, n, l);
}


/**
 * Calculates the coefficients applied to the U, V, and W functions. Because
 * their equations share many common terms they are computed simultaneously.
 * @param {Number} m
 * @param {Number} n
 * @param {Number} l
 * @return {Array} 3 coefficients for U, V and W functions.
 */
function computeUVWCoeff(m, n, l) {
  const d = getKroneckerDelta(m, 0);
  const reciprocalDenominator =
      Math.abs(n) === l ? 1 / (2 * l * (2 * l - 1)) : 1 / ((l + n) * (l - n));

  return [
    Math.sqrt((l + m) * (l - m) * reciprocalDenominator),
    0.5 * (1 - 2 * d) * Math.sqrt((1 + d) *
                                  (l + Math.abs(m) - 1) *
                                  (l + Math.abs(m)) *
                                  reciprocalDenominator),
    -0.5 * (1 - d) * Math.sqrt((l - Math.abs(m) - 1) * (l - Math.abs(m))) *
        reciprocalDenominator,
  ];
}


/**
 * Calculates the (2l+1) x (2l+1) rotation matrix for the band l.
 * This uses the matrices computed for band 1 and band l-1 to compute the
 * matrix for band l. |rotations| must contain the previously computed l-1
 * rotation matrices.
 * This implementation comes from p. 5 (6346), Table 1 and 2 in [2] taking
 * into account the corrections from [2b].
 * @param {Number[]} matrix - N matrices of gainNodes, each with where
 * n=1,2,...,N.
 * @param {Number} l
 */
function computeBandRotation(matrix, l) {
  // The lth band rotation matrix has rows and columns equal to the number of
  // coefficients within that band (-l <= m <= l implies 2l + 1 coefficients).
  for (let m = -l; m <= l; m++) {
    for (let n = -l; n <= l; n++) {
      const uvwCoefficients = computeUVWCoeff(m, n, l);

      // The functions U, V, W are only safe to call if the coefficients
      // u, v, w are not zero.
      if (Math.abs(uvwCoefficients[0]) > 0) {
        uvwCoefficients[0] *= getU(matrix, m, n, l);
      }
      if (Math.abs(uvwCoefficients[1]) > 0) {
        uvwCoefficients[1] *= getV(matrix, m, n, l);
      }
      if (Math.abs(uvwCoefficients[2]) > 0) {
        uvwCoefficients[2] *= getW(matrix, m, n, l);
      }

      setCenteredElement(
          matrix, l, m, n,
          uvwCoefficients[0] + uvwCoefficients[1] + uvwCoefficients[2]);
    }
  }
}


/**
 * Compute the HOA rotation matrix after setting the transform matrix.
 * @param {Array} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 */
function computeHOAMatrices(matrix) {
  // We start by computing the 2nd-order matrix from the 1st-order matrix.
  for (let i = 2; i <= matrix.length; i++) {
    computeBandRotation(matrix, i);
  }
}


/**
 * Higher-order-ambisonic decoder based on gain node network. We expect
 * the order of the channels to conform to ACN ordering. Below are the helper
 * methods to compute SH rotation using recursion. The code uses maths described
 * in the following papers:
 *  [1] R. Green, "Spherical Harmonic Lighting: The Gritty Details", GDC 2003,
 *      http://www.research.scea.com/gdc2003/spherical-harmonic-lighting.pdf
 *  [2] J. Ivanic and K. Ruedenberg, "Rotation Matrices for Real
 *      Spherical Harmonics. Direct Determination by Recursion", J. Phys.
 *      Chem., vol. 100, no. 15, pp. 6342-6347, 1996.
 *      http://pubs.acs.org/doi/pdf/10.1021/jp953350u
 *  [2b] Corrections to initial publication:
 *       http://pubs.acs.org/doi/pdf/10.1021/jp9833350
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order.
 */
function HOARotator(context, ambisonicOrder) {
  this._context = context;
  this._ambisonicOrder = ambisonicOrder;

  // We need to determine the number of channels K based on the ambisonic order
  // N where K = (N + 1)^2.
  const numberOfChannels = (ambisonicOrder + 1) * (ambisonicOrder + 1);

  this._splitter = this._context.createChannelSplitter(numberOfChannels);
  this._merger = this._context.createChannelMerger(numberOfChannels);

  // Create a set of per-order rotation matrices using gain nodes.
  this._gainNodeMatrix = [];
  let orderOffset;
  let rows;
  let inputIndex;
  let outputIndex;
  let matrixIndex;
  for (let i = 1; i <= ambisonicOrder; i++) {
    // Each ambisonic order requires a separate (2l + 1) x (2l + 1) rotation
    // matrix. We compute the offset value as the first channel index of the
    // current order where
    //   k_last = l^2 + l + m,
    // and m = -l
    //   k_last = l^2
    orderOffset = i * i;

    // Uses row-major indexing.
    rows = (2 * i + 1);

    this._gainNodeMatrix[i - 1] = [];
    for (let j = 0; j < rows; j++) {
      inputIndex = orderOffset + j;
      for (let k = 0; k < rows; k++) {
        outputIndex = orderOffset + k;
        matrixIndex = j * rows + k;
        this._gainNodeMatrix[i - 1][matrixIndex] = this._context.createGain();
        this._splitter.connect(
            this._gainNodeMatrix[i - 1][matrixIndex], inputIndex);
        this._gainNodeMatrix[i - 1][matrixIndex].connect(
            this._merger, 0, outputIndex);
      }
    }
  }

  // W-channel is not involved in rotation, skip straight to ouput.
  this._splitter.connect(this._merger, 0, 0);

  // Default Identity matrix.
  this.setRotationMatrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));

  // Input/Output proxy.
  this.input = this._splitter;
  this.output = this._merger;
}


/**
 * Updates the rotation matrix with 3x3 matrix.
 * @param {Number[]} rotationMatrix3 - A 3x3 rotation matrix. (column-major)
 */
HOARotator.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  for (let i = 0; i < 9; ++i) {
    this._gainNodeMatrix[0][i].gain.value = rotationMatrix3[i];
  }
  computeHOAMatrices(this._gainNodeMatrix);
};


/**
 * Updates the rotation matrix with 4x4 matrix.
 * @param {Number[]} rotationMatrix4 - A 4x4 rotation matrix. (column-major)
 */
HOARotator.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  this._gainNodeMatrix[0][0].gain.value = rotationMatrix4[0];
  this._gainNodeMatrix[0][1].gain.value = rotationMatrix4[1];
  this._gainNodeMatrix[0][2].gain.value = rotationMatrix4[2];
  this._gainNodeMatrix[0][3].gain.value = rotationMatrix4[4];
  this._gainNodeMatrix[0][4].gain.value = rotationMatrix4[5];
  this._gainNodeMatrix[0][5].gain.value = rotationMatrix4[6];
  this._gainNodeMatrix[0][6].gain.value = rotationMatrix4[8];
  this._gainNodeMatrix[0][7].gain.value = rotationMatrix4[9];
  this._gainNodeMatrix[0][8].gain.value = rotationMatrix4[10];
  computeHOAMatrices(this._gainNodeMatrix);
};


/**
 * Returns the current 3x3 rotation matrix.
 * @return {Number[]} - A 3x3 rotation matrix. (column-major)
 */
HOARotator.prototype.getRotationMatrix3 = function() {
  let rotationMatrix3 = new Float32Array(9);
  for (let i = 0; i < 9; ++i) {
    rotationMatrix3[i] = this._gainNodeMatrix[0][i].gain.value;
  }
  return rotationMatrix3;
};


/**
 * Returns the current 4x4 rotation matrix.
 * @return {Number[]} - A 4x4 rotation matrix. (column-major)
 */
HOARotator.prototype.getRotationMatrix4 = function() {
  let rotationMatrix4 = new Float32Array(16);
  rotationMatrix4[0] = this._gainNodeMatrix[0][0].gain.value;
  rotationMatrix4[1] = this._gainNodeMatrix[0][1].gain.value;
  rotationMatrix4[2] = this._gainNodeMatrix[0][2].gain.value;
  rotationMatrix4[4] = this._gainNodeMatrix[0][3].gain.value;
  rotationMatrix4[5] = this._gainNodeMatrix[0][4].gain.value;
  rotationMatrix4[6] = this._gainNodeMatrix[0][5].gain.value;
  rotationMatrix4[8] = this._gainNodeMatrix[0][6].gain.value;
  rotationMatrix4[9] = this._gainNodeMatrix[0][7].gain.value;
  rotationMatrix4[10] = this._gainNodeMatrix[0][8].gain.value;
  return rotationMatrix4;
};


/**
 * Get the current ambisonic order.
 * @return {Number}
 */
HOARotator.prototype.getAmbisonicOrder = function() {
  return this._ambisonicOrder;
};


module.exports = HOARotator;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
 * @file Namespace for Omnitone library.
 */




exports.Omnitone = __webpack_require__(11);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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




const BufferList = __webpack_require__(1);
const FOAConvolver = __webpack_require__(4);
const FOADecoder = __webpack_require__(12);
const FOAPhaseMatchedFilter = __webpack_require__(6);
const FOARenderer = __webpack_require__(14);
const FOARotator = __webpack_require__(3);
const FOARouter = __webpack_require__(2);
const FOAVirtualSpeaker = __webpack_require__(7);
const HOAConvolver = __webpack_require__(8);
const HOARenderer = __webpack_require__(16);
const HOARotator = __webpack_require__(9);
const Polyfill = __webpack_require__(19);
const Utils = __webpack_require__(0);
const Version = __webpack_require__(20);

// DEPRECATED in V1, in favor of BufferList.
const AudioBufferManager = __webpack_require__(5);


/**
 * Omnitone namespace.
 * @namespace
 */
let Omnitone = {};


/**
 * @typedef {Object} BrowserInfo
 * @property {string} name - Browser name.
 * @property {string} version - Browser version.
 */

/**
 * An object contains the detected browser name and version.
 * @memberOf Omnitone
 * @static {BrowserInfo}
 */
Omnitone.browserInfo = Polyfill.getBrowserInfo();


// DEPRECATED in V1. DO. NOT. USE.
Omnitone.loadAudioBuffers = function(context, speakerData) {
  return new Promise(function(resolve, reject) {
    new AudioBufferManager(context, speakerData, function(buffers) {
      resolve(buffers);
    }, reject);
  });
};


/**
 * Performs the async loading/decoding of multiple AudioBuffers from multiple
 * URLs.
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {string[]} bufferData - An ordered list of URLs.
 * @param {Object} [options] - BufferList options.
 * @param {String} [options.dataType='url'] - BufferList data type.
 * @return {Promise<AudioBuffer[]>} - The promise resolves with an array of
 * AudioBuffer.
 */
Omnitone.createBufferList = function(context, bufferData, options) {
  const bufferList =
      new BufferList(context, bufferData, options || {dataType: 'url'});
  return bufferList.load();
};


/**
 * Perform channel-wise merge on multiple AudioBuffers. The sample rate and
 * the length of buffers to be merged must be identical.
 * @static
 * @function
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer[]} bufferList - An array of AudioBuffers to be merged
 * channel-wise.
 * @return {AudioBuffer} - A single merged AudioBuffer.
 */
Omnitone.mergeBufferListByChannel = Utils.mergeBufferListByChannel;


/**
 * Perform channel-wise split by the given channel count. For example,
 * 1 x AudioBuffer(8) -> splitBuffer(context, buffer, 2) -> 4 x AudioBuffer(2).
 * @static
 * @function
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer} audioBuffer - An AudioBuffer to be splitted.
 * @param {Number} splitBy - Number of channels to be splitted.
 * @return {AudioBuffer[]} - An array of splitted AudioBuffers.
 */
Omnitone.splitBufferbyChannel = Utils.splitBufferbyChannel;


/**
 * Creates an instance of FOA Convolver.
 * @see FOAConvolver
 * @param {BaseAudioContext} context The associated AudioContext.
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * @return {FOAConvolver}
 */
Omnitone.createFOAConvolver = function(context, hrirBufferList) {
  return new FOAConvolver(context, hrirBufferList);
};


/**
 * Create an instance of FOA Router.
 * @see FOARouter
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number[]} channelMap - Routing destination array.
 * @return {FOARouter}
 */
Omnitone.createFOARouter = function(context, channelMap) {
  return new FOARouter(context, channelMap);
};


/**
 * Create an instance of FOA Rotator.
 * @see FOARotator
 * @param {AudioContext} context - Associated AudioContext.
 * @return {FOARotator}
 */
Omnitone.createFOARotator = function(context) {
  return new FOARotator(context);
};


/**
 * Create an instance of FOAPhaseMatchedFilter.
 * @ignore
 * @see FOAPhaseMatchedFilter
 * @param {AudioContext} context - Associated AudioContext.
 * @return {FOAPhaseMatchedFilter}
 */
Omnitone.createFOAPhaseMatchedFilter = function(context) {
  return new FOAPhaseMatchedFilter(context);
};


/**
 * Create an instance of FOAVirtualSpeaker. For parameters, refer the
 * definition of VirtualSpeaker class.
 * @ignore
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} options - Options.
 * @return {FOAVirtualSpeaker}
 */
Omnitone.createFOAVirtualSpeaker = function(context, options) {
  return new FOAVirtualSpeaker(context, options);
};


/**
 * DEPRECATED. Use FOARenderer instance.
 * @see FOARenderer
 * @param {AudioContext} context - Associated AudioContext.
 * @param {DOMElement} videoElement - Video or Audio DOM element to be streamed.
 * @param {Object} options - Options for FOA decoder.
 * @param {String} options.baseResourceUrl - Base URL for resources.
 * (base path for HRIR files)
 * @param {Number} [options.postGain=26.0] - Post-decoding gain compensation.
 * @param {Array} [options.routingDestination]  Custom channel layout.
 * @return {FOADecoder}
 */
Omnitone.createFOADecoder = function(context, videoElement, options) {
  Utils.log('WARNING: FOADecoder is deprecated in favor of FOARenderer.');
  return new FOADecoder(context, videoElement, options);
};


/**
 * Create a FOARenderer, the first-order ambisonic decoder and the optimized
 * binaural renderer.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Array} [config.channelMap] - Custom channel routing map. Useful for
 * handling the inconsistency in browser's multichannel audio decoding.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 * @return {FOARenderer}
 */
Omnitone.createFOARenderer = function(context, config) {
  return new FOARenderer(context, config);
};


/**
 * Creates HOARotator for higher-order ambisonics rotation.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order.
 * @return {HOARotator}
 */
Omnitone.createHOARotator = function(context, ambisonicOrder) {
  return new HOARotator(context, ambisonicOrder);
};


/**
 * Creates HOAConvolver performs the multi-channel convolution for the optmized
 * binaural rendering.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order. (2 or 3)
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
 * @return {HOAConvovler}
 */
Omnitone.createHOAConvolver = function(
    context, ambisonicOrder, hrirBufferList) {
  return new HOAConvolver(context, ambisonicOrder, hrirBufferList);
};


/**
 * Creates HOARenderer for higher-order ambisonic decoding and the optimized
 * binaural rendering.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Number} [config.ambisonicOrder=3] - Ambisonic order.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 * @return {HOARenderer}
 */
Omnitone.createHOARenderer = function(context, config) {
  return new HOARenderer(context, config);
};


// Handler Preload Tasks.
// - Detects the browser information.
// - Prints out the version number.
(function() {
  Utils.log('Version ' + Version + ' (running ' +
      Omnitone.browserInfo.name + ' ' + Omnitone.browserInfo.version +
      ' on ' + Omnitone.browserInfo.platform +')');
  if (Omnitone.browserInfo.name.toLowerCase() === 'safari') {
    Polyfill.patchSafari();
    Utils.log(Omnitone.browserInfo.name + ' detected. Appliying polyfill...');
  }
})();


module.exports = Omnitone;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file Omnitone FOA decoder, DEPRECATED in favor of FOARenderer.
 */



const AudioBufferManager = __webpack_require__(5);
const FOARouter = __webpack_require__(2);
const FOARotator = __webpack_require__(3);
const FOAPhaseMatchedFilter = __webpack_require__(6);
const FOAVirtualSpeaker = __webpack_require__(7);
const FOASpeakerData = __webpack_require__(13);
const Utils = __webpack_require__(0);

// By default, Omnitone fetches IR from the spatial media repository.
const HRTFSET_URL = 'https://raw.githubusercontent.com/GoogleChrome/omnitone/master/build/resources/';

// Post gain compensation value.
let POST_GAIN_DB = 0;


/**
 * Omnitone FOA decoder.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {VideoElement} videoElement - Target video (or audio) element for
 * streaming.
 * @param {Object} options
 * @param {String} options.HRTFSetUrl - Base URL for the cube HRTF sets.
 * @param {Number} options.postGainDB - Post-decoding gain compensation in dB.
 * @param {Number[]} options.channelMap - Custom channel map.
 */
function FOADecoder(context, videoElement, options) {
  this._isDecoderReady = false;
  this._context = context;
  this._videoElement = videoElement;
  this._decodingMode = 'ambisonic';

  this._postGainDB = POST_GAIN_DB;
  this._HRTFSetUrl = HRTFSET_URL;
  this._channelMap = FOARouter.ChannelMap.DEFAULT; // ACN

  if (options) {
    if (options.postGainDB) {
      this._postGainDB = options.postGainDB;
    }
    if (options.HRTFSetUrl) {
      this._HRTFSetUrl = options.HRTFSetUrl;
    }
    if (options.channelMap) {
      this._channelMap = options.channelMap;
    }
  }

  // Rearrange speaker data based on |options.HRTFSetUrl|.
  this._speakerData = [];
  for (let i = 0; i < FOASpeakerData.length; ++i) {
    this._speakerData.push({
      name: FOASpeakerData[i].name,
      url: this._HRTFSetUrl + '/' + FOASpeakerData[i].url,
      coef: FOASpeakerData[i].coef,
    });
  }

  this._tempMatrix4 = new Float32Array(16);
}


/**
 * Initialize and load the resources for the decode.
 * @return {Promise}
 */
FOADecoder.prototype.initialize = function() {
  Utils.log('Initializing... (mode: ' + this._decodingMode + ')');

  // Rerouting channels if necessary.
  let channelMapString = this._channelMap.toString();
  let defaultChannelMapString = FOARouter.ChannelMap.DEFAULT.toString();
  if (channelMapString !== defaultChannelMapString) {
    Utils.log('Remapping channels ([' + defaultChannelMapString + '] -> ['
      + channelMapString + '])');
  }

  this._audioElementSource =
      this._context.createMediaElementSource(this._videoElement);
  this._foaRouter = new FOARouter(this._context, this._channelMap);
  this._foaRotator = new FOARotator(this._context);
  this._foaPhaseMatchedFilter = new FOAPhaseMatchedFilter(this._context);

  this._audioElementSource.connect(this._foaRouter.input);
  this._foaRouter.output.connect(this._foaRotator.input);
  this._foaRotator.output.connect(this._foaPhaseMatchedFilter.input);

  this._foaVirtualSpeakers = [];

  // Bypass signal path.
  this._bypass = this._context.createGain();
  this._audioElementSource.connect(this._bypass);

  // Get the linear amplitude from the post gain option, which is in decibel.
  const postGainLinear = Math.pow(10, this._postGainDB/20);
  Utils.log('Gain compensation: ' + postGainLinear + ' (' + this._postGainDB
    + 'dB)');

  // This returns a promise so developers can use the decoder when it is ready.
  const that = this;
  return new Promise(function(resolve, reject) {
    new AudioBufferManager(that._context, that._speakerData,
      function(buffers) {
        for (let i = 0; i < that._speakerData.length; ++i) {
          that._foaVirtualSpeakers[i] = new FOAVirtualSpeaker(that._context, {
            coefficients: that._speakerData[i].coef,
            IR: buffers.get(that._speakerData[i].name),
            gain: postGainLinear,
          });

          that._foaPhaseMatchedFilter.output.connect(
            that._foaVirtualSpeakers[i].input);
        }

        // Set the decoding mode.
        that.setMode(that._decodingMode);
        that._isDecoderReady = true;
        Utils.log('HRTF IRs are loaded successfully. The decoder is ready.');
        resolve();
      }, reject);
  });
};

/**
 * Set the rotation matrix for the sound field rotation.
 * @param {Array} rotationMatrix      3x3 rotation matrix (row-major
 *                                    representation)
 */
FOADecoder.prototype.setRotationMatrix = function(rotationMatrix) {
  this._foaRotator.setRotationMatrix(rotationMatrix);
};


/**
 * Update the rotation matrix from a Three.js camera object.
 * @param  {Object} cameraMatrix      The Matrix4 obejct of Three.js the camera.
 */
FOADecoder.prototype.setRotationMatrixFromCamera = function(cameraMatrix) {
  // Extract the inner array elements and inverse. (The actual view rotation is
  // the opposite of the camera movement.)
  Utils.invertMatrix4(this._tempMatrix4, cameraMatrix.elements);
  this._foaRotator.setRotationMatrix4(this._tempMatrix4);
};

/**
 * Set the decoding mode.
 * @param {String} mode               Decoding mode. When the mode is 'bypass'
 *                                    the decoder is disabled and bypass the
 *                                    input stream to the output. Setting the
 *                                    mode to 'ambisonic' activates the decoder.
 *                                    When the mode is 'off', all the
 *                                    processing is completely turned off saving
 *                                    the CPU power.
 */
FOADecoder.prototype.setMode = function(mode) {
  if (mode === this._decodingMode) {
    return;
  }

  switch (mode) {
    case 'bypass':
      this._decodingMode = 'bypass';
      for (let i = 0; i < this._foaVirtualSpeakers.length; ++i) {
        this._foaVirtualSpeakers[i].disable();
      }
      this._bypass.connect(this._context.destination);
      break;

    case 'ambisonic':
      this._decodingMode = 'ambisonic';
      for (let i = 0; i < this._foaVirtualSpeakers.length; ++i) {
        this._foaVirtualSpeakers[i].enable();
      }
      this._bypass.disconnect();
      break;

    case 'off':
      this._decodingMode = 'off';
      for (let i = 0; i < this._foaVirtualSpeakers.length; ++i) {
        this._foaVirtualSpeakers[i].disable();
      }
      this._bypass.disconnect();
      break;

    default:
      break;
  }

  Utils.log('Decoding mode changed. (' + mode + ')');
};

module.exports = FOADecoder;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/**
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
 * The data for FOAVirtualSpeaker. Each entry contains the URL for IR files and
 * the gain coefficients for the associated IR files. Note that the order of
 * coefficients follows the ACN channel ordering. (W,Y,Z,X)
 * @type {Object[]}
 */
const FOASpeakerData = [{
  name: 'E35_A135',
  url: 'E35_A135.wav',
  gainFactor: 1,
  coef: [.1250, 0.216495, 0.21653, -0.216495],
}, {
  name: 'E35_A-135',
  url: 'E35_A-135.wav',
  gainFactor: 1,
  coef: [.1250, -0.216495, 0.21653, -0.216495],
}, {
  name: 'E-35_A135',
  url: 'E-35_A135.wav',
  gainFactor: 1,
  coef: [.1250, 0.216495, -0.21653, -0.216495],
}, {
  name: 'E-35_A-135',
  url: 'E-35_A-135.wav',
  gainFactor: 1,
  coef: [.1250, -0.216495, -0.21653, -0.216495],
}, {
  name: 'E35_A45',
  url: 'E35_A45.wav',
  gainFactor: 1,
  coef: [.1250, 0.216495, 0.21653, 0.216495],
}, {
  name: 'E35_A-45',
  url: 'E35_A-45.wav',
  gainFactor: 1,
  coef: [.1250, -0.216495, 0.21653, 0.216495],
}, {
  name: 'E-35_A45',
  url: 'E-35_A45.wav',
  gainFactor: 1,
  coef: [.1250, 0.216495, -0.21653, 0.216495],
}, {
  name: 'E-35_A-45',
  url: 'E-35_A-45.wav',
  gainFactor: 1,
  coef: [.1250, -0.216495, -0.21653, 0.216495],
}];


module.exports = FOASpeakerData;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file Omnitone FOARenderer. This is user-facing API for the first-order
 * ambisonic decoder and the optimized binaural renderer.
 */



const BufferList = __webpack_require__(1);
const FOAConvolver = __webpack_require__(4);
const FOAHrirBase64 = __webpack_require__(15);
const FOARotator = __webpack_require__(3);
const FOARouter = __webpack_require__(2);
const Utils = __webpack_require__(0);


/**
 * @typedef {string} RenderingMode
 */

/**
 * Rendering mode ENUM.
 * @enum {RenderingMode}
 */
const RenderingMode = {
  /** @type {string} Use ambisonic rendering. */
  AMBISONIC: 'ambisonic',
  /** @type {string} Bypass. No ambisonic rendering. */
  BYPASS: 'bypass',
  /** @type {string} Disable audio output. */
  OFF: 'off',
};


/**
 * Omnitone FOA renderer class. Uses the optimized convolution technique.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Array} [config.channelMap] - Custom channel routing map. Useful for
 * handling the inconsistency in browser's multichannel audio decoding.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 */
function FOARenderer(context, config) {
  this._context = Utils.isAudioContext(context) ?
      context :
      Utils.throw('FOARenderer: Invalid BaseAudioContext.');

  this._config = {
    channelMap: FOARouter.ChannelMap.DEFAULT,
    renderingMode: RenderingMode.AMBISONIC,
  };

  if (config) {
    if (config.channelMap) {
      if (Array.isArray(config.channelMap) && config.channelMap.length === 4) {
        this._config.channelMap = config.channelMap;
      } else {
        Utils.throw(
            'FOARenderer: Invalid channel map. (got ' + config.channelMap
            + ')');
      }
    }

    if (config.hrirPathList) {
      if (Array.isArray(config.hrirPathList) &&
          config.hrirPathList.length === 2) {
        this._config.pathList = config.hrirPathList;
      } else {
        Utils.throw(
            'FOARenderer: Invalid HRIR URLs. It must be an array with ' +
            '2 URLs to HRIR files. (got ' + config.hrirPathList + ')');
      }
    }

    if (config.renderingMode) {
      if (Object.values(RenderingMode).includes(config.renderingMode)) {
        this._config.renderingMode = config.renderingMode;
      } else {
        Utils.log(
            'FOARenderer: Invalid rendering mode order. (got' +
            config.renderingMode + ') Fallbacks to the mode "ambisonic".');
      }
    }
  }

  this._buildAudioGraph();

  this._tempMatrix4 = new Float32Array(16);
  this._isRendererReady = false;
}


/**
 * Builds the internal audio graph.
 * @private
 */
FOARenderer.prototype._buildAudioGraph = function() {
  this.input = this._context.createGain();
  this.output = this._context.createGain();
  this._bypass = this._context.createGain();
  this._foaRouter = new FOARouter(this._context, this._config.channelMap);
  this._foaRotator = new FOARotator(this._context);
  this._foaConvolver = new FOAConvolver(this._context);
  this.input.connect(this._foaRouter.input);
  this.input.connect(this._bypass);
  this._foaRouter.output.connect(this._foaRotator.input);
  this._foaRotator.output.connect(this._foaConvolver.input);
  this._foaConvolver.output.connect(this.output);

  this.input.channelCount = 4;
  this.input.channelCountMode = 'explicit';
  this.input.channelInterpretation = 'discrete';
};


/**
 * Internal callback handler for |initialize| method.
 * @private
 * @param {function} resolve - Resolution handler.
 * @param {function} reject - Rejection handler.
 */
FOARenderer.prototype._initializeCallback = function(resolve, reject) {
  const bufferList = this._config.pathList
      ? new BufferList(this._context, this._config.pathList, {dataType: 'url'})
      : new BufferList(this._context, FOAHrirBase64);
  bufferList.load().then(
      function(hrirBufferList) {
        this._foaConvolver.setHRIRBufferList(hrirBufferList);
        this.setRenderingMode(this._config.renderingMode);
        this._isRendererReady = true;
        Utils.log('FOARenderer: HRIRs loaded successfully. Ready.');
        resolve();
      }.bind(this),
      function() {
        const errorMessage = 'FOARenderer: HRIR loading/decoding failed.';
        Utils.throw(errorMessage);
        reject(errorMessage);
      });
};


/**
 * Initializes and loads the resource for the renderer.
 * @return {Promise}
 */
FOARenderer.prototype.initialize = function() {
  Utils.log(
      'FOARenderer: Initializing... (mode: ' + this._config.renderingMode +
      ')');

  return new Promise(this._initializeCallback.bind(this), function(error) {
    Utils.throw('FOARenderer: Initialization failed. (' + error + ')');
  });
};


/**
 * Set the channel map.
 * @param {Number[]} channelMap - Custom channel routing for FOA stream.
 */
FOARenderer.prototype.setChannelMap = function(channelMap) {
  if (!this._isRendererReady) {
    return;
  }

  if (channelMap.toString() !== this._config.channelMap.toString()) {
    Utils.log(
        'Remapping channels ([' + this._config.channelMap.toString() +
        '] -> [' + channelMap.toString() + ']).');
    this._config.channelMap = channelMap.slice();
    this._foaRouter.setChannelMap(this._config.channelMap);
  }
};


/**
 * Updates the rotation matrix with 3x3 matrix.
 * @param {Number[]} rotationMatrix3 - A 3x3 rotation matrix. (column-major)
 */
FOARenderer.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  if (!this._isRendererReady) {
    return;
  }

  this._foaRotator.setRotationMatrix3(rotationMatrix3);
};


/**
 * Updates the rotation matrix with 4x4 matrix.
 * @param {Number[]} rotationMatrix4 - A 4x4 rotation matrix. (column-major)
 */
FOARenderer.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  if (!this._isRendererReady) {
    return;
  }

  this._foaRotator.setRotationMatrix4(rotationMatrix4);
};


/**
 * Set the rotation matrix from a Three.js camera object. Depreated in V1, and
 * this exists only for the backward compatiblity. Instead, use
 * |setRotatationMatrix4()| with Three.js |camera.worldMatrix.elements|.
 * @deprecated
 * @param {Object} cameraMatrix - Matrix4 from Three.js |camera.matrix|.
 */
FOARenderer.prototype.setRotationMatrixFromCamera = function(cameraMatrix) {
  if (!this._isRendererReady) {
    return;
  }

  // Extract the inner array elements and inverse. (The actual view rotation is
  // the opposite of the camera movement.)
  Utils.invertMatrix4(this._tempMatrix4, cameraMatrix.elements);
  this._foaRotator.setRotationMatrix4(this._tempMatrix4);
};


/**
 * Set the rendering mode.
 * @param {RenderingMode} mode - Rendering mode.
 *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
 *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
 *    decoding or encoding.
 *  - 'off': all the processing off saving the CPU power.
 */
FOARenderer.prototype.setRenderingMode = function(mode) {
  if (mode === this._config.renderingMode) {
    return;
  }

  switch (mode) {
    case RenderingMode.AMBISONIC:
      this._foaConvolver.enable();
      this._bypass.disconnect();
      break;
    case RenderingMode.BYPASS:
      this._foaConvolver.disable();
      this._bypass.connect(this.output);
      break;
    case RenderingMode.OFF:
      this._foaConvolver.disable();
      this._bypass.disconnect();
      break;
    default:
      Utils.log(
          'FOARenderer: Rendering mode "' + mode + '" is not ' +
          'supported.');
      return;
  }

  this._config.renderingMode = mode;
  Utils.log('FOARenderer: Rendering mode changed. (' + mode + ')');
};


module.exports = FOARenderer;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

const OmnitoneFOAHrirBase64 = [
"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",
];

module.exports = OmnitoneFOAHrirBase64;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file Omnitone HOARenderer. This is user-facing API for the higher-order
 * ambisonic decoder and the optimized binaural renderer.
 */



const BufferList = __webpack_require__(1);
const HOAConvolver = __webpack_require__(8);
const HOARotator = __webpack_require__(9);
const TOAHrirBase64 = __webpack_require__(17);
const SOAHrirBase64 = __webpack_require__(18);
const Utils = __webpack_require__(0);


/**
 * @typedef {string} RenderingMode
 */

/**
 * Rendering mode ENUM.
 * @enum {RenderingMode}
 */
const RenderingMode = {
  /** @type {string} Use ambisonic rendering. */
  AMBISONIC: 'ambisonic',
  /** @type {string} Bypass. No ambisonic rendering. */
  BYPASS: 'bypass',
  /** @type {string} Disable audio output. */
  OFF: 'off',
};


// Currently SOA and TOA are only supported.
const SupportedAmbisonicOrder = [2, 3];


/**
 * Omnitone HOA renderer class. Uses the optimized convolution technique.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Number} [config.ambisonicOrder=3] - Ambisonic order.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 */
function HOARenderer(context, config) {
  this._context = Utils.isAudioContext(context) ?
      context :
      Utils.throw('HOARenderer: Invalid BaseAudioContext.');

  this._config = {
    ambisonicOrder: 3,
    renderingMode: RenderingMode.AMBISONIC,
  };

  if (config && config.ambisonicOrder) {
    if (SupportedAmbisonicOrder.includes(config.ambisonicOrder)) {
      this._config.ambisonicOrder = config.ambisonicOrder;
    } else {
      Utils.log(
          'HOARenderer: Invalid ambisonic order. (got ' +
          config.ambisonicOrder + ') Fallbacks to 3rd-order ambisonic.');
    }
  }

  this._config.numberOfChannels =
      (this._config.ambisonicOrder + 1) * (this._config.ambisonicOrder + 1);
  this._config.numberOfStereoChannels =
      Math.ceil(this._config.numberOfChannels / 2);

  if (config && config.hrirPathList) {
    if (Array.isArray(config.hrirPathList) &&
        config.hrirPathList.length === this._config.numberOfStereoChannels) {
      this._config.pathList = config.hrirPathList;
    } else {
      Utils.throw(
          'HOARenderer: Invalid HRIR URLs. It must be an array with ' +
          this._config.numberOfStereoChannels + ' URLs to HRIR files.' +
          ' (got ' + config.hrirPathList + ')');
    }
  }

  if (config && config.renderingMode) {
    if (Object.values(RenderingMode).includes(config.renderingMode)) {
      this._config.renderingMode = config.renderingMode;
    } else {
      Utils.log(
          'HOARenderer: Invalid rendering mode. (got ' +
          config.renderingMode + ') Fallbacks to "ambisonic".');
    }
  }

  this._buildAudioGraph();

  this._isRendererReady = false;
}


/**
 * Builds the internal audio graph.
 * @private
 */
HOARenderer.prototype._buildAudioGraph = function() {
  this.input = this._context.createGain();
  this.output = this._context.createGain();
  this._bypass = this._context.createGain();
  this._hoaRotator = new HOARotator(this._context, this._config.ambisonicOrder);
  this._hoaConvolver =
      new HOAConvolver(this._context, this._config.ambisonicOrder);
  this.input.connect(this._hoaRotator.input);
  this.input.connect(this._bypass);
  this._hoaRotator.output.connect(this._hoaConvolver.input);
  this._hoaConvolver.output.connect(this.output);

  this.input.channelCount = this._config.numberOfChannels;
  this.input.channelCountMode = 'explicit';
  this.input.channelInterpretation = 'discrete';
};


/**
 * Internal callback handler for |initialize| method.
 * @private
 * @param {function} resolve - Resolution handler.
 * @param {function} reject - Rejection handler.
 */
HOARenderer.prototype._initializeCallback = function(resolve, reject) {
  let bufferList;
  if (this._config.pathList) {
    bufferList =
        new BufferList(this._context, this._config.pathList, {dataType: 'url'});
  } else {
    bufferList = this._config.ambisonicOrder === 2
        ? new BufferList(this._context, SOAHrirBase64)
        : new BufferList(this._context, TOAHrirBase64);
  }

  bufferList.load().then(
      function(hrirBufferList) {
        this._hoaConvolver.setHRIRBufferList(hrirBufferList);
        this.setRenderingMode(this._config.renderingMode);
        this._isRendererReady = true;
        Utils.log('HOARenderer: HRIRs loaded successfully. Ready.');
        resolve();
      }.bind(this),
      function() {
        const errorMessage = 'HOARenderer: HRIR loading/decoding failed.';
        Utils.throw(errorMessage);
        reject(errorMessage);
      });
};


/**
 * Initializes and loads the resource for the renderer.
 * @return {Promise}
 */
HOARenderer.prototype.initialize = function() {
  Utils.log(
      'HOARenderer: Initializing... (mode: ' + this._config.renderingMode +
      ', ambisonic order: ' + this._config.ambisonicOrder + ')');

  return new Promise(this._initializeCallback.bind(this), function(error) {
    Utils.throw('HOARenderer: Initialization failed. (' + error + ')');
  });
};


/**
 * Updates the rotation matrix with 3x3 matrix.
 * @param {Number[]} rotationMatrix3 - A 3x3 rotation matrix. (column-major)
 */
HOARenderer.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  if (!this._isRendererReady) {
    return;
  }

  this._hoaRotator.setRotationMatrix3(rotationMatrix3);
};


/**
 * Updates the rotation matrix with 4x4 matrix.
 * @param {Number[]} rotationMatrix4 - A 4x4 rotation matrix. (column-major)
 */
HOARenderer.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  if (!this._isRendererReady) {
    return;
  }

  this._hoaRotator.setRotationMatrix4(rotationMatrix4);
};


/**
 * Set the decoding mode.
 * @param {RenderingMode} mode - Decoding mode.
 *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
 *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
 *    decoding or encoding.
 *  - 'off': all the processing off saving the CPU power.
 */
HOARenderer.prototype.setRenderingMode = function(mode) {
  if (mode === this._config.renderingMode) {
    return;
  }

  switch (mode) {
    case RenderingMode.AMBISONIC:
      this._hoaConvolver.enable();
      this._bypass.disconnect();
      break;
    case RenderingMode.BYPASS:
      this._hoaConvolver.disable();
      this._bypass.connect(this.output);
      break;
    case RenderingMode.OFF:
      this._hoaConvolver.disable();
      this._bypass.disconnect();
      break;
    default:
      Utils.log(
          'HOARenderer: Rendering mode "' + mode + '" is not ' +
          'supported.');
      return;
  }

  this._config.renderingMode = mode;
  Utils.log('HOARenderer: Rendering mode changed. (' + mode + ')');
};


module.exports = HOARenderer;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

const OmnitoneTOAHrirBase64 = [
"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AAD7/wEAAgD7//7/AQD8/wAAAwD8//3/AwD9/wAAAgD9//z/AwD/////AgD+//z/AwAAAP7/AQD///3/AgABAP3/AAAAAP3/AgACAPz///8BAP3/AQACAP3//v8BAP7/AAABAP3//v8CAP7///8BAP7//f8CAP////8AAAAA/v8CAAAAAAAAAAAA/v8BAAAAAAD//wAA//8AAP//AAD//wAA//8AAP//",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAP//AAD//wAA//8AAAAA/////wAAAQD+////AAAGAP3/OAABAIIAAwBv//f/E/0QAK0ADQCzA/7/8P4u/0cBDQCJA6ABbQDg/w7/z/9o+Vn/SPnL/1//Ef+2+jr9RfZgA5QFZwILDFj+PAb2/nEFKgKk/R0Dlv6b/FUDsP6YAoj9SgAT/iL/tAPwAv8A0P6zAr7/dwAnAf39uP22/skA2v///2YCoP4UAUsAZgF2AJH+4P70/rz9+f+U/Xv/8v7CAcb+TACS/kwAv/+x/tX9oP71/oL/1f8nAEUAZwGtAAgAIgC/AD4BaP8GAGH/dQDF/64Arf8nAakAhAH9/+kAQQD3AFb/q/8p/yIAR/8FAPD/ZAA/AIYA3v8tADQADQBp/3f/CwABAP3/Wf8OANj/WwDH/xoAe/8DAKz/zv96/z8A3f/J/5X/IAD5//j/q//c/+//RADq//D/vv8pADUAFQDI/y8ACAAbANb/OwD3/+3/9f/e/wcAIAAeAMH/8/8xAC0AEADW/+3/HAADAPv/8P8DAOL/OwD3/xcACQAHAM//5f8XAAcAz//T/9D/HgD9////yf/e//v/AgD//9H/6/////H/+/8hAAIA9//7/w0AFgAQAPL/2v/8/xsAGQABANz/9P8YAAQA/v/y/wMA5v8YAAkAAAAAAAMA7/8KABgADwDs//j/BwATABsA8P/1//z/BAAMAAAA9P/s/xAA/v8GAAkA/v/p/wMACwALAP7/9P/p/wcADQAFAPb/7//4/w0ACAD8//b//v/1/wMACwD1//T/8P/8/wAACQDz/+f/5P8GAAkABQD5//D/+v8FAA0AAwD///T/AgACABAA/v8CAPD/+/8FAAoA9f/3//f//v8GAP7/9v/t//z/+f8AAPj/+v/3/wEA+v8HAPr//P/5/wQA//8DAPr/+P/3/wYA///+//X/+//5/wQA/f/7//X/+//4/wMA/f/8//j//v/9/wYA///8//f/AgAAAAUA/f/6//n/AwACAAIA/f/7//z/AwACAAAA/f/6//3/AgADAP7//f/7/wAAAwAFAPz////8/wMAAgAEAPv//v/+/wMAAgADAPv//v///wMAAQABAPv//f8AAAIAAAD///v//f8BAAIA///+//z//v8CAAIA/v/9//3///8CAAEA/v/9//7/AAACAAAA/v/9////AAABAAAA/f/9/wAAAQABAP///f/+/wEAAQAAAP///v/+/wEAAQD///7//v///wEAAQD///7//v///wEAAAD+//7///8AAAAAAAD+//7///8AAAAA///+//7///8AAAAA////////AAAAAP////////////8AAP//////////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAAAAAAABAAAAAAD//////////////v////3/////////+//8////AQD9//z/9f8BAAIA+f8dACgAWQBxAJX/qv+Y/uz9aP9k/7UDUQQBAiQA4Pgi/AkB0gKaBsD/+fxp/vz9CQSp/I/+ywDO+vMD0fzK/PABcgBeBfoBv/+uAuH9Sf5gAy39awMmBWUBuP9fA9/9fgDj/2/+EACaACcCSv9Z/2j/rv7hAA0AWf55/7L84P7E/SIAT/67AMv/tf+FAA7/1v+7/gv/IP+E/sQA+P5aAXz/tP9XAFX/tP8o/4r/j//e/yQAMv9mAJT/rgCr/9X/EwCb//H/9f7F/6D/EAAoAK3//v+e/zsAh/+B/7r/if/C/2r/4P/z/6//HwCy/0IA7/9ZALT/y/80ACgA9v/J/9//DgA5ADUALQARADIACwAfAOf/NgArACMACQBBAEcAGAAjAC4AWQBUAHcAAAAfACEAIAAcAPj/CADk/yQA7v89AEEAFwD5/xYA6f8aAOX/AADF/zQADwAUAOT/BQDr/yUA6P8XAOf/HADR/0AA8P8nAAgACQDt/ycAKAAHAPH/IQDz/xsACADn//n/DgADAA4A8P///8z/GgDN/yMA/f8QANj/MwACAC0ACwAOAO3/JgAZAAUACgAAAA4AIgAaAAkADwACAAAAHQATAAUABQACAAgACwAjAO////8AAA8ABQAPAPL//f8GAAsABgAGAPD/8v8GAPz/CAD6//H/6v8PAAgABgD4//3/9v8aAAgABwD1//7//v8QAAoACAD//wUA9v8QAAoABAAFAAgAAgAJAAoAAwD//w0AAgD//wcA/v8DAAoABQAFABUABAAKAAYABwAHAA8ACgAGAAwADwAMAAkAEAAJAAgADwAMAAgADgAJAAUACQAPAAUACwAHAAEABgAIAAEABAAGAP//AgAJAAAAAgAEAP7///8IAAIA//8GAAEAAQAJAAIA/v8EAAMA//8JAAEA/v8DAAMA/v8HAAMA/f8BAAUA/v8FAAMA/v8BAAcA//8DAAMA/v8BAAYA//8CAAMA/////wcAAAAAAAMAAAD//wYAAQD+/wMAAQD//wUAAQD+/wIAAgD//wQAAgD+/wEAAwD//wMAAwD+/wEAAwD//wIAAwD//wEABAAAAAEABAD//wAABAABAAAAAwAAAAAABAABAP//AwABAAAAAwACAP//AgACAAAAAwACAP//AgACAAAAAgACAAAAAQADAAAAAQACAAAAAQADAAAAAQACAAAAAAACAAEAAAACAAEAAAACAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAAAAAAAAAAAAAAA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAP//AAD//wAA//8AAAAA//8AAP//AAACAAAA+f8BAAYA///4/wIA//8AAA8A/v/V/wEAEwA9AAEBRwA2AF7/kfog/3gBwv99CDYBU/qtAUX/AP7OAfkAX/o9B38FSfwaAuT14/60BAr8CQAI/tfyIQTzAXP+egdUBBwBof7TBMT8bAWi/5EEWwBRAAAKyfxE/8b88vp6ACP+PAF4/qD8MQNM/ygCJ/2XAPD9kP5gAVT/iP9I/lEB4P8qAD0BFAGa/+7/DgB2AOP98gFm/u/+Vv5/AG8ASP9gAM//qv9w//oAcv+2/jIBHgA7/6D/oAAGAKH/lADT/wAAggC8AAYAkP9yAEcAkf8BAOD/RAAr/zUANwDt/xQAJQAkAMT/zwA/AOH/xv9zAGsANQBTAIcALAAvACIATACy/xMADADg/xcAWABvAJL/7f9VAPb/EgDt/wcA4f8kAPP/5P+h/wgACQDy//r/LgAQAMn/8/9CAOX/5v/S/9//3P8pABYAuP/s/w8AFgDt/+3/7v/w/9j/5/8GAOf/2P/2//P//v8kABMAuf/m/xoADADZ/+r/3P8KAAUAKwDe/wsA3P8VAAAADgAfAB0ACAAMAF4AGgAhAPL/MwDz/0kABAAKAPX/LwAbAAkA9v/s/+3/8/8CABAAAADm//n/BQALAAUAAQDj//n/JQAVAPX/9v/+/wIAEQABAPP/8P/1/wAABgD6/+3/7//o//j/DAD8/+b/8P8IAAkABgD4//D/8P8UAAoAAwD4/wAA+f8OAAcAAAAFAPX/9v8TAAkA8v8EAPb/9/8dAA0A7/8CAPn/+f8SAAQA8/8CAOf/+v8DAAgA9P////H//P8IAAUA8//0/wIAAQAGAAgA9//7/wAA+/8EAP//+P/+////AgACAAsA8v/+/wIABQD7/wgA9v/7/wMABAD5/wAA/P/3/wEAAQD7//7//P/1/wQA///3//r////3/wMAAwD1//r/AwD6////AgD4//n/AwD8//7/AgD4//n/AwD+//3/AQD4//n/BQD///n/AAD6//j/BAABAPj/AAD9//v/AwADAPj//v/+//z/AwAEAPj//v8BAP7/AQADAPj//f8CAP////8EAPr//P8DAAAA/v8CAPv//P8DAAEA/f8BAP3//f8DAAIA/P8AAP7//f8DAAIA/P///wAA/f8BAAIA+//+/wEA//8AAAEA+//+/wEA/////wEA/P/+/wEA///+/wAA/f/9/wEAAAD9/wAA/f/+/wEAAQD8/////v/+/wAAAQD8////////////AQD9////AAD/////AAD+////AAAAAP//AAD///////8AAP//AAD//wAA//8AAP//",
];

module.exports = OmnitoneTOAHrirBase64;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

const OmnitoneSOAHrirBase64 = [
"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/P////v//P8CAAQA+//+//3//f8CAAUA+v/9//////8AAAQA+v/8////AAD//wIA+//8/wAAAQD+/wEA+//8/wAAAgD9/////P/9/wEAAgD8//7//f/9/wAAAgD8//3//v/+////AQD8//z/////////AAD8//3///8AAP7/AAD9//7///8AAP7////+//////8AAP7////+////////////////////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////v8AAP///////wAAAAAAAP7/AQABAAAABwD///X/BQAjAPL/CQDb/9D/GAAb/7sAYwCW/z0BcP/X/7T/2QDW+wH8yANCCCUJ5QT++UXmhPwhA78FuAxH+p78ifudBlAG9vmu/lAK2fdlB///cfjoCa0E7Akn9Yb/zvba+AkAHPywBGEBFwUNAL8AXAAGA20DFvmR/kz+F/06Ag/+GwHl/5EEKgJd/q0AP/ym/9n6EfxY/2H+/QFtAC4C6QBDAaMCo/20/+3/3f/p/fL9rv9V/6cBhQHuAX4AcwJYAaH/IP/P/gsApP0LAe7/sQBuAI0AAgGDAE4BzACe/5X//v+v/+f+Zf+gAOv/5QBhAOIApAANASYAuP+h/8b/HQBr/9//bACWAGEAFAB5AD0AWQDU/+D/Yf/p//D/s/+R/4QAMQBvABEAkQBfABQAJgDW/wwA8/8XALz/vf8zAFAAKwD1/zEAPwDJ/x0A7/8LAOX/FwDR//H/EQAdAO//6P8QAFEA2f8WABEAMgDy/xIA+f/s/xAALgDv////HQAvAPT/+f8iAAYAEgAFABoAGgD//w0A+f/0/xsAHgDx/9f/GAACAPH/8f8JAPf/GwALABEA7/8cAPT/CgD2//j/BQD8/+3/OgAgAAYA9f8PAN7/DgD9/9r/1//3/+3/9//1//b/8//5//f/AgAJAOf/+v8OAAMACwD9/+7/5f8eAAEA9//q//7/8P8WAP7/+//4/wIA+f8TAAIA9f/5/wcA+P8iAAgA9v/n/xoA//8gAAUABwDj/wAA9v8BAAUAFQDn/wMA7v8QABAAEQDm/wwA8f8aAAAABwDu/wcACgASAAEA7//w//f/BgARAAkA6P/3/wcADgAKAAYA4f/4/wYADgAAAPr/8P/9/xQACgAHAPn/7//9/xEAAgD+//L/8v/8/xUAAwDw//H/9f8CAAsA/v/q//L/+f8FAAYA/P/r//j///8GAAkA+//o//j/AQAIAP//+v/o//v/CAAIAPv/+P/w/wEACQAHAPj/+f/0/wIACwAFAPb/+f/4/wQACwACAPP/+f/+/wYACAD///L/+/8BAAYABQD9//P//P8FAAUAAgD7//T//f8HAAQA///7//f///8IAAMA/P/6//r/AQAIAAEA+v/6//3/AgAHAAAA+f/7/wAAAwAFAP7/+P/8/wIAAgACAP3/+f/9/wMAAwAAAPz/+v/+/wQAAgD+//z/+/8AAAQAAQD8//z//f8BAAQAAAD7//3///8BAAMA///7//3/AAACAAEA/v/7//7/AQABAAAA/v/9////AQAAAP///v/+////AAD/////////////////////////////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD////////+//////8AAAAA/v/+/wAAAQD8//3/CQAJAP3/+v8PAAcApABlABkBkwCO/i//lfqa/HQAcf/3BdkCzwJcBCMC0wMN/9/9wgI7AaECYfxV/Tf83vhn/xrt8Owx/8n7cgHABYb43QcZDh4WugNrA7P74gHu/9z/zv0t/acCiQHY/iv4qQOl/ysCE/0//XT9Sf4O//j9xfupAn394gHO+rsCXAFIAxQC9wIXBgcD2AQuAnb/9gJh/6wAVfxEAI4Bvf7oAFv/bALsAMQBe/88/joAT/4dAH39/v9LAXn/gwDI//QBdABcAA0A7f4lAMn///+9/tv/iABp/13/pP/dALv/w/8MAHv//f+y/6////7U/5AAZP+Z/8r/nQDR/5r/DwDr/xAA4v+s/3z/+P9uAOv/t/82AGcAHgCb/yQAFQBGAM7/CgD3/xoAegAaAOz/CgBHAA8Adv8/AAAABQC2/xIAAAA7ABQAKgCj/z4AAQAXAJz/JAADAAcA8f/1/2AAAQAlAPD/NgDx/1wA7v/4/wMAZADv//3/HQAkAFoA8P9FAPv/FgBIAPf/WQAHAEUACQD0/xIAQwDu/wMAwP9VALn/XwCw/yEA5f8sAPj/FgDD/1YAyv8rAOX/HQDo//j/IQAQACAAHwD9/yQAHQBAABgABQAiAAUAKAD3/wkACwAKAAMABwAJAPb/+f8GAOr/JQAHABMA6P8TAA4AGgD//woA8/8ZAP//GADu/w0A9v8SAAMABwD4/wQA5P8XAAQACgDq/wUA+/8VAAcACADs/xIAAAATAPH/+v/1//T/7f///+z/+v/y/+//9/8KAAcACgAJAPT/BAAKAAAABgAIAPL/9v8KAAMABAACAPr/9v8OAAIA+P/x//v/+f8MAPb/+P/w/wQA9f8MAPn////7/woA/v8PAAEAAgD1/xAAAQAPAP//AwD//xQABwALAAAABgADABAAAgAHAAAACAABAA8ABQAFAAMABwAEAA4ABwADAAEACQAFAAoAAwD//wAACQADAAUAAQD/////CAABAAMAAAD/////BwACAAEAAAD/////BwACAP7///8BAAAABgABAP7///8CAAAABAAAAP7///8DAAAAAwAAAP3///8DAAAAAQAAAP3//v8EAAAAAAD+//////8EAP/////+/wAA/v8EAP/////+/wEA/v8EAP///v/+/wIA//8DAP///v/+/wIA//8BAP///v/+/wMA//8BAP/////+/wMA//8AAP//AAD+/wQA//8AAP7/AQD//wIA////////AQD//wIA////////AQAAAAEAAAAAAP//AQD//wEAAAAAAP//AQAAAAEAAAAAAAAA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wAA+v8AAPz/AAD//wAA/f8AAAEAAAD+/wAACQAAAAQAAAAZAAAAtgAAAFsBAABW/gAAH/oAAGcBAABoBwAAlAAAAO3/AAARAQAA+wIAAEoEAACe/gAAiv4AALD0AADJ8wAAkQQAAF34AABi8QAAPQAAAAH2AAD19AAADAMAAJwGAACTEAAA0AwAAJkHAACOBwAAuQEAANcDAAC6AgAAHwUAAHEFAAB0AwAAbgEAADz+AADYAQAAGAAAAJwCAADgAAAA//0AAMn+AAAT/AAAwP8AAOn9AAAJAAAAewEAAOn+AACN/wAAOv0AAO3+AADN/gAAcP8AACj/AACq/gAA+f4AAML9AACa/wAA/f4AAN7/AABo/wAA6/4AAE//AAAC/wAAEQAAAHX/AAB0AAAA5f8AAEwAAAB3AAAA5/8AAMIAAABCAAAAzgAAAE8AAAB3AAAAKAAAADMAAACqAAAALwAAAK4AAAASAAAAVgAAACgAAAAtAAAATAAAAP3/AAA7AAAA2/8AACQAAADw/wAALQAAADEAAAAlAAAAbAAAADMAAABUAAAAEAAAACgAAAD1/wAA9v8AAPr/AADu/wAALgAAABIAAABUAAAARAAAAGUAAABGAAAAOAAAAGAAAAAuAAAARQAAACEAAAAfAAAAAAAAAAkAAAAQAAAAAwAAABIAAADs/wAAEAAAAAYAAAASAAAAIgAAABEAAAADAAAABAAAAA8AAAD4/wAAHQAAAAsAAAAIAAAADgAAAP//AAAcAAAADwAAAAYAAAASAAAAFwAAAAMAAAAYAAAAEgAAAPr/AAAQAAAADQAAAAoAAAD3/wAABgAAAPb/AADf/wAA/v8AAPL/AAD6/wAAFAAAAAQAAAAEAAAAGwAAAAEAAAAMAAAAIAAAAAIAAAAdAAAAGAAAAAIAAAAcAAAAEgAAAAcAAAAeAAAADwAAAAQAAAAeAAAABAAAAAYAAAAZAAAAAQAAAA4AAAATAAAA/v8AAAoAAAAOAAAA+/8AAAsAAAAJAAAA+f8AAAsAAAABAAAA+f8AAAoAAAD9/wAA+v8AAAcAAAD5/wAA+v8AAAUAAAD3/wAA/f8AAAQAAAD2/wAAAAAAAAEAAAD3/wAAAgAAAAAAAAD4/wAAAwAAAP7/AAD6/wAABAAAAP3/AAD8/wAABAAAAPv/AAD+/wAAAwAAAPv/AAD//wAAAQAAAPv/AAAAAAAAAAAAAPv/AAACAAAA//8AAPz/AAACAAAA/v8AAP3/AAACAAAA/f8AAP7/AAABAAAA/f8AAP//AAABAAAA/f8AAAAAAAAAAAAA/v8AAAEAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
];

module.exports = OmnitoneSOAHrirBase64;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file Cross-browser support polyfill for Omnitone library.
 */




/**
 * Detects browser type and version.
 * @return {string[]} - An array contains the detected browser name and version.
 */
exports.getBrowserInfo = function() {
  const ua = navigator.userAgent;
  let M = ua.match(
      /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) ||
      [];
  let tem;

  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {name: 'IE', version: (tem[1] || '')};
  }

  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/);
    if (tem != null) {
      return {name: 'Opera', version: tem[1]};
    }
  }

  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/([\d.]+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }

  let platform = ua.match(/android|ipad|iphone/i);
  if (!platform) {
    platform = ua.match(/cros|linux|mac os x|windows/i);
  }

  return {
    name: M[0],
    version: M[1],
    platform: platform ? platform[0] : 'unknown',
  };
};


/**
 * Patches AudioContext if the prefixed API is found.
 */
exports.patchSafari = function() {
  if (window.webkitAudioContext && window.webkitOfflineAudioContext) {
    window.AudioContext = window.webkitAudioContext;
    window.OfflineAudioContext = window.webkitOfflineAudioContext;
  }
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file Omnitone version.
 */




/**
 * Omnitone library version
 * @type {String}
 */
module.exports = '1.0.6';


/***/ })
/******/ ]);
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
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
 * @file ResonanceAudio version.
 * @author Andrew Allen <bitllama@google.com>
 */




/**
 * ResonanceAudio library version
 * @type {String}
 */
module.exports = '0.0.4';


/***/ })
/******/ ]);
});