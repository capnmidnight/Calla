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
import { mat3, vec3 } from "gl-matrix";
import { connect, disconnect, Gain } from "kudzu/audio";
import { FOARenderer } from "../omnitone/foa-renderer";
import { HOARenderer } from "../omnitone/hoa-renderer";
import { Encoder } from "./encoder";
import { DEFAULT_AMBISONIC_ORDER, DEFAULT_FORWARD, DEFAULT_POSITION, DEFAULT_RENDERING_MODE, DEFAULT_UP } from "./utils";
/**
 * Listener model to spatialize sources in an environment.
 */
export class Listener {
    tempMatrix3;
    ambisonicOrder;
    renderer;
    position;
    ambisonicOutput;
    input;
    output;
    /**
     * Listener model to spatialize sources in an environment.
     */
    constructor(options) {
        // Use defaults for undefined arguments.
        options = Object.assign({
            ambisonicOrder: DEFAULT_AMBISONIC_ORDER,
            position: vec3.copy(vec3.create(), DEFAULT_POSITION),
            forward: vec3.copy(vec3.create(), DEFAULT_FORWARD),
            up: vec3.copy(vec3.create(), DEFAULT_UP),
            renderingMode: DEFAULT_RENDERING_MODE
        }, options);
        // Member variables.
        this.position = vec3.create();
        this.tempMatrix3 = mat3.create();
        // Select the appropriate HRIR filters using 2-channel chunks since
        // multichannel audio is not yet supported by a majority of browsers.
        this.ambisonicOrder =
            Encoder.validateAmbisonicOrder(options.ambisonicOrder);
        // Create audio nodes.
        if (this.ambisonicOrder == 1) {
            this.renderer = new FOARenderer({
                renderingMode: options.renderingMode
            });
        }
        else if (this.ambisonicOrder > 1) {
            this.renderer = new HOARenderer({
                ambisonicOrder: this.ambisonicOrder,
                renderingMode: options.renderingMode
            });
        }
        // These nodes are created in order to safely asynchronously load Omnitone
        // while the rest of the scene is being created.
        this.input = Gain("listener-input");
        this.output = Gain("listener-output");
        this.ambisonicOutput = Gain("listener-ambisonic-input");
        // Initialize Omnitone (async) and connect to audio graph when complete.
        this.renderer.initialize().then(() => {
            // Connect pre-rotated soundfield to renderer.
            connect(this.input, this.renderer);
            // Connect rotated soundfield to ambisonic output.
            connect(this.renderer.rotator, this.ambisonicOutput);
            // Connect binaurally-rendered soundfield to binaural output.
            connect(this.renderer, this.output);
        });
        // Set orientation and update rotation matrix accordingly.
        this.setOrientation(options.forward, options.up);
    }
    disposed = false;
    dispose() {
        if (!this.disposed) {
            disconnect(this.input);
            disconnect(this.renderer.rotator);
            disconnect(this.renderer);
            this.renderer.dispose();
            this.disposed = true;
        }
    }
    getRenderingMode() {
        return this.renderer.getRenderingMode();
    }
    setRenderingMode(mode) {
        this.renderer.setRenderingMode(mode);
    }
    /**
     * Set the source's orientation using forward and up vectors.
     */
    setOrientation(forward, up) {
        vec3.copy(F, forward);
        vec3.copy(U, up);
        vec3.cross(R, F, U);
        mat3.set(this.tempMatrix3, R[0], R[1], R[2], U[0], U[1], U[2], -F[0], -F[1], -F[2]);
        this.renderer.setRotationMatrix3(this.tempMatrix3);
    }
}
const F = vec3.create();
const U = vec3.create();
const R = vec3.create();
//# sourceMappingURL=listener.js.map