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
 * @file Streamlined AudioBuffer loader.
 */
/**
 * Buffer data type for ENUM.
 */
export declare enum BufferDataType {
    /** The data contains Base64-encoded string.. */
    BASE64 = "base64",
    /** The data is a URL for audio file. */
    URL = "url"
}
export interface BufferListOptions {
    /**
     * BufferDataType specifier
     **/
    dataType?: BufferDataType;
    /**
     * Log verbosity. |true| prints the individual message from each URL and AudioBuffer.
     **/
    verbose?: boolean;
}
/**
 * BufferList object mananges the async loading/decoding of multiple
 * AudioBuffers from multiple URLs.
 */
export declare class BufferList {
    private _options;
    private _bufferData;
    /**
     * BufferList object mananges the async loading/decoding of multiple
     * AudioBuffers from multiple URLs.
     * @param bufferData - An ordered list of URLs.
     * @param options - Options.
     */
    constructor(bufferData: string[], options?: BufferListOptions);
    /**
     * Starts AudioBuffer loading tasks.
     */
    load(): Promise<AudioBuffer[]>;
    /**
     * Run async loading task for Base64-encoded string.
     * @param bData - Base64-encoded data.
     */
    private _launchAsyncLoadTask;
    /**
     * Get an array buffer out of the given data.
     * @param bData - Base64-encoded data.
     */
    private _fetch;
}
