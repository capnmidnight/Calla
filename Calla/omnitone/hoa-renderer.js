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
import { BufferDataType, BufferList } from './buffer-list';
import { HOAConvolver } from './hoa-convolver';
import { HOARotator } from './hoa-rotator';
import { RenderingMode } from "./rendering-mode";
import SOAHrirBase64 from './resources/omnitone-soa-hrir-base64';
import TOAHrirBase64 from './resources/omnitone-toa-hrir-base64';
import { log } from "./utils";
// Currently SOA and TOA are only supported.
const SupportedAmbisonicOrder = [2, 3];
/**
 * Omnitone HOA renderer class. Uses the optimized convolution technique.
 */
export class HOARenderer {
    /**
     * Omnitone HOA renderer class. Uses the optimized convolution technique.
     */
    constructor(context, options) {
        this.context = context;
        this.config = Object.assign({
            ambisonicOrder: 3,
            renderingMode: RenderingMode.Ambisonic,
        }, options);
        if (!SupportedAmbisonicOrder.includes(this.config.ambisonicOrder)) {
            log('HOARenderer: Invalid ambisonic order. (got ' +
                this.config.ambisonicOrder + ') Fallbacks to 3rd-order ambisonic.');
            this.config.ambisonicOrder = Math.max(2, Math.min(3, this.config.ambisonicOrder));
        }
        this.config.numberOfChannels =
            (this.config.ambisonicOrder + 1) * (this.config.ambisonicOrder + 1);
        this.config.numberOfStereoChannels =
            Math.ceil(this.config.numberOfChannels / 2);
        if (this.config.hrirPathList.length !== this.config.numberOfStereoChannels) {
            throw new Error('HOARenderer: Invalid HRIR URLs. It must be an array with ' +
                this.config.numberOfStereoChannels + ' URLs to HRIR files.' +
                ' (got ' + options.hrirPathList + ')');
        }
        this._buildAudioGraph();
    }
    /**
     * Builds the internal audio graph.
     */
    _buildAudioGraph() {
        this.input = this.context.createGain();
        this.output = this.context.createGain();
        this.bypass = this.context.createGain();
        this.rotator = new HOARotator(this.context, this.config.ambisonicOrder);
        this.convolver =
            new HOAConvolver(this.context, this.config.ambisonicOrder);
        this.input.connect(this.rotator.input);
        this.input.connect(this.bypass);
        this.rotator.output.connect(this.convolver.input);
        this.convolver.output.connect(this.output);
        this.input.channelCount = this.config.numberOfChannels;
        this.input.channelCountMode = 'explicit';
        this.input.channelInterpretation = 'discrete';
    }
    dispose() {
        if (this.getRenderingMode() === RenderingMode.Bypass) {
            this.bypass.connect(this.output);
        }
        this.input.disconnect(this.rotator.input);
        this.input.disconnect(this.bypass);
        this.rotator.output.disconnect(this.convolver.input);
        this.convolver.output.disconnect(this.output);
        this.rotator.dispose();
        this.convolver.dispose();
    }
    /**
     * Initializes and loads the resource for the renderer.
     */
    async initialize() {
        let bufferList;
        if (this.config.hrirPathList) {
            bufferList =
                new BufferList(this.context, this.config.hrirPathList, { dataType: BufferDataType.URL });
        }
        else {
            bufferList = this.config.ambisonicOrder === 2
                ? new BufferList(this.context, SOAHrirBase64)
                : new BufferList(this.context, TOAHrirBase64);
        }
        try {
            const hrirBufferList = await bufferList.load();
            this.convolver.setHRIRBufferList(hrirBufferList);
            this.setRenderingMode(this.config.renderingMode);
        }
        catch (exp) {
            const errorMessage = `HOARenderer: HRIR loading/decoding (mode: ${this.config.renderingMode}) failed. Reason: ${exp.message}`;
            throw new Error(errorMessage);
        }
    }
    /**
     * Updates the rotation matrix with 3x3 matrix.
     * @param rotationMatrix3 - A 3x3 rotation matrix. (column-major)
     */
    setRotationMatrix3(rotationMatrix3) {
        this.rotator.setRotationMatrix3(rotationMatrix3);
    }
    /**
     * Updates the rotation matrix with 4x4 matrix.
     * @param rotationMatrix4 - A 4x4 rotation matrix. (column-major)
     */
    setRotationMatrix4(rotationMatrix4) {
        this.rotator.setRotationMatrix4(rotationMatrix4);
    }
    getRenderingMode() {
        return this.config.renderingMode;
    }
    /**
     * Set the decoding mode.
     * @param mode - Decoding mode.
     *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
     *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
     *    decoding or encoding.
     *  - 'off': all the processing off saving the CPU power.
     */
    setRenderingMode(mode) {
        if (mode === this.config.renderingMode) {
            return;
        }
        switch (mode) {
            case RenderingMode.Ambisonic:
                this.convolver.enable();
                this.bypass.disconnect();
                break;
            case RenderingMode.Bypass:
                this.convolver.disable();
                this.bypass.connect(this.output);
                break;
            case RenderingMode.None:
                this.convolver.disable();
                this.bypass.disconnect();
                break;
            default:
                log('HOARenderer: Rendering mode "' + mode + '" is not ' +
                    'supported.');
                return;
        }
        this.config.renderingMode = mode;
    }
}
//# sourceMappingURL=hoa-renderer.js.map