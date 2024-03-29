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
import { ErsatzAudioNode } from "kudzu/audio";
import type { IDisposable } from "kudzu/using";
/**
 * @file An audio channel router to resolve different channel layouts between
 * browsers.
 */
export declare enum ChannelMap {
    Default = 0,
    Safari = 1,
    FUMA = 2
}
/**
 * Channel router for FOA stream.
 */
export declare class FOARouter implements IDisposable, ErsatzAudioNode {
    private _splitter;
    private _merger;
    input: ChannelSplitterNode;
    output: ChannelMergerNode;
    private _channelMap;
    /**
     * Channel router for FOA stream.
     * @param channelMap - Routing destination array.
     */
    constructor(channelMap: ChannelMap | number[]);
    /**
     * Sets channel map.
     * @param channelMap - A new channel map for FOA stream.
     */
    setChannelMap(channelMap: ChannelMap | number[]): void;
    private disposed;
    dispose(): void;
}
