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

import { ChannelMerger, ChannelSplitter, connect, disconnect, ErsatzAudioNode } from "kudzu/audio";
import type { IDisposable } from "kudzu/using";

/**
 * @file An audio channel router to resolve different channel layouts between
 * browsers.
 */

export enum ChannelMap {
    Default = 0,
    Safari = 1,
    FUMA = 2
};

/**
 * Channel map dictionary ENUM.
 */
const ChannelMaps = {
    /** ACN channel map for Chrome and FireFox. (FFMPEG) */
    [ChannelMap.Default]: [0, 1, 2, 3],
    /** Safari's 4-channel map for AAC codec. */
    [ChannelMap.Safari]: [2, 0, 1, 3],
    /** ACN > FuMa conversion map. */
    [ChannelMap.FUMA]: [0, 3, 1, 2]
};


/**
 * Channel router for FOA stream.
 */
export class FOARouter implements IDisposable, ErsatzAudioNode {
    private _splitter: ChannelSplitterNode;
    private _merger: ChannelMergerNode;
    input: ChannelSplitterNode;
    output: ChannelMergerNode;
    private _channelMap: number[];
    /**
     * Channel router for FOA stream.
     * @param channelMap - Routing destination array.
     */
    constructor(channelMap: ChannelMap|number[]) {
        this.input = this._splitter = ChannelSplitter("foa-router-splitter", 4);
        this.output = this._merger = ChannelMerger("foa-router-merger", 4);

        this.setChannelMap(channelMap || ChannelMap.Default);
    }


    /**
     * Sets channel map.
     * @param channelMap - A new channel map for FOA stream.
     */
    setChannelMap(channelMap: ChannelMap | number[]): void {
        if (channelMap instanceof Array) {
            this._channelMap = channelMap;
        }
        else {
            this._channelMap = ChannelMaps[channelMap];
        }

        for (let i = 0; i < this._channelMap.length; ++i) {
            connect(this._splitter, this._merger, i, this._channelMap[i]);
        }
    }


    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            disconnect(this._splitter);
            this.disposed = true;
        }
    }

}

