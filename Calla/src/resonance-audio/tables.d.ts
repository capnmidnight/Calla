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
 */
export declare const SPHERICAL_HARMONICS: number[][][];
export declare const SPHERICAL_HARMONICS_AZIMUTH_RESOLUTION: number;
export declare const SPHERICAL_HARMONICS_ELEVATION_RESOLUTION: number;
/**
 * The maximum allowed ambisonic order.
 */
export declare const SPHERICAL_HARMONICS_MAX_ORDER: number;
/**
 * Pre-computed per-band weighting coefficients for producing energy-preserving
 * Max-Re sources.
 */
export declare const MAX_RE_WEIGHTS: number[][];
export declare const MAX_RE_WEIGHTS_RESOLUTION: number;
