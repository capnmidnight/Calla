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
import { connect, disconnect } from "../audio/GraphVisualizer";
/**
 * @file An audio channel router to resolve different channel layouts between
 * browsers.
 */
export var ChannelMap;
(function (ChannelMap) {
    ChannelMap[ChannelMap["Default"] = 0] = "Default";
    ChannelMap[ChannelMap["Safari"] = 1] = "Safari";
    ChannelMap[ChannelMap["FUMA"] = 2] = "FUMA";
})(ChannelMap || (ChannelMap = {}));
;
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
export class FOARouter {
    _context;
    _splitter;
    _merger;
    input;
    output;
    _channelMap;
    /**
     * Channel router for FOA stream.
     * @param context - Associated BaseAudioContext.
     * @param channelMap - Routing destination array.
     */
    constructor(context, channelMap) {
        this._context = context;
        this._splitter = this._context.createChannelSplitter(4);
        this._merger = this._context.createChannelMerger(4);
        // input/output proxy.
        this.input = this._splitter;
        this.output = this._merger;
        this.setChannelMap(channelMap || ChannelMap.Default);
    }
    /**
     * Sets channel map.
     * @param channelMap - A new channel map for FOA stream.
     */
    setChannelMap(channelMap) {
        if (channelMap instanceof Array) {
            this._channelMap = channelMap;
        }
        else {
            this._channelMap = ChannelMaps[channelMap];
        }
        connect(this._splitter, this._merger, 0, this._channelMap[0]);
        connect(this._splitter, this._merger, 1, this._channelMap[1]);
        connect(this._splitter, this._merger, 2, this._channelMap[2]);
        connect(this._splitter, this._merger, 3, this._channelMap[3]);
    }
    disposed = false;
    dispose() {
        if (!this.disposed) {
            disconnect(this._splitter, this._merger, 0, this._channelMap[0]);
            disconnect(this._splitter, this._merger, 1, this._channelMap[1]);
            disconnect(this._splitter, this._merger, 2, this._channelMap[2]);
            disconnect(this._splitter, this._merger, 3, this._channelMap[3]);
            this.disposed = true;
        }
    }
}
//# sourceMappingURL=foa-router.js.map