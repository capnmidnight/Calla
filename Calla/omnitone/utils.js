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
 * @file Omnitone library common utilities.
 */
/**
 * Omnitone library logging function.
 * @param Message to be printed out.
 */
export function log(...rest) {
    const message = `[Omnitone] ${rest.join(' ')}`;
    window.console.log(message);
}
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
 * @param out   The inverted result.
 * @param a     The source matrix.
 */
export function invertMatrix4(out, a) {
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
}
/**
 * Perform channel-wise merge on multiple AudioBuffers. The sample rate and
 * the length of buffers to be merged must be identical.
 * @param context - Associated BaseAudioContext.
 * @param bufferList - An array of AudioBuffers to be merged
 * channel-wise.
 * @return A single merged AudioBuffer.
 */
export function mergeBufferListByChannel(context, bufferList) {
    const bufferLength = bufferList[0].length;
    const bufferSampleRate = bufferList[0].sampleRate;
    let bufferNumberOfChannel = 0;
    for (let i = 0; i < bufferList.length; ++i) {
        if (bufferNumberOfChannel > 32) {
            throw new Error('Utils.mergeBuffer: Number of channels cannot exceed 32.' +
                '(got ' + bufferNumberOfChannel + ')');
        }
        if (bufferLength !== bufferList[i].length) {
            throw new Error('Utils.mergeBuffer: AudioBuffer lengths are ' +
                'inconsistent. (expected ' + bufferLength + ' but got ' +
                bufferList[i].length + ')');
        }
        if (bufferSampleRate !== bufferList[i].sampleRate) {
            throw new Error('Utils.mergeBuffer: AudioBuffer sample rates are ' +
                'inconsistent. (expected ' + bufferSampleRate + ' but got ' +
                bufferList[i].sampleRate + ')');
        }
        bufferNumberOfChannel += bufferList[i].numberOfChannels;
    }
    const buffer = context.createBuffer(bufferNumberOfChannel, bufferLength, bufferSampleRate);
    let destinationChannelIndex = 0;
    for (let i = 0; i < bufferList.length; ++i) {
        for (let j = 0; j < bufferList[i].numberOfChannels; ++j) {
            buffer.getChannelData(destinationChannelIndex++).set(bufferList[i].getChannelData(j));
        }
    }
    return buffer;
}
/**
 * Perform channel-wise split by the given channel count. For example,
 * 1 x AudioBuffer(8) -> splitBuffer(context, buffer, 2) -> 4 x AudioBuffer(2).
 * @param context - Associated BaseAudioContext.
 * @param audioBuffer - An AudioBuffer to be splitted.
 * @param splitBy - Number of channels to be splitted.
 * @return An array of splitted AudioBuffers.
 */
export function splitBufferByChannel(context, audioBuffer, splitBy) {
    if (audioBuffer.numberOfChannels <= splitBy) {
        throw new Error('Utils.splitBuffer: Insufficient number of channels. (' +
            audioBuffer.numberOfChannels + ' splitted by ' + splitBy + ')');
    }
    const bufferList = new Array();
    let sourceChannelIndex = 0;
    const numberOfSplittedBuffer = Math.ceil(audioBuffer.numberOfChannels / splitBy);
    for (let i = 0; i < numberOfSplittedBuffer; ++i) {
        const buffer = context.createBuffer(splitBy, audioBuffer.length, audioBuffer.sampleRate);
        for (let j = 0; j < splitBy; ++j) {
            if (sourceChannelIndex < audioBuffer.numberOfChannels) {
                buffer.getChannelData(j).set(audioBuffer.getChannelData(sourceChannelIndex++));
            }
        }
        bufferList.push(buffer);
    }
    return bufferList;
}
/**
 * Converts Base64-encoded string to ArrayBuffer.
 * @param base64String - Base64-encdoed string.
 * @return Converted ArrayBuffer object.
 */
export function getArrayBufferFromBase64String(base64String) {
    const binaryString = window.atob(base64String);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < byteArray.length; ++i) {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray.buffer;
}
//# sourceMappingURL=utils.js.map