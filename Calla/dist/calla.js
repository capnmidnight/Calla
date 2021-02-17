var Calla = (function (exports) {
    'use strict';

    function t(o, s, c) {
        return typeof o === s
            || o instanceof c;
    }
    function isFunction(obj) {
        return t(obj, "function", Function);
    }

    /**
     * Indicates whether or not the current browser can change the destination device for audio output.
     **/
    const canChangeAudioOutput = isFunction(HTMLAudioElement.prototype.setSinkId);

    /**
     * Removes an item at the given index from an array.
     */
    function arrayRemoveAt(arr, idx) {
        return arr.splice(idx, 1)[0];
    }

    class EventBase {
        constructor() {
            this.listeners = new Map();
            this.listenerOptions = new Map();
        }
        addEventListener(type, callback, options) {
            if (isFunction(callback)) {
                let listeners = this.listeners.get(type);
                if (!listeners) {
                    listeners = new Array();
                    this.listeners.set(type, listeners);
                }
                if (!listeners.find(c => c === callback)) {
                    listeners.push(callback);
                    if (options) {
                        this.listenerOptions.set(callback, options);
                    }
                }
            }
        }
        removeEventListener(type, callback) {
            if (isFunction(callback)) {
                const listeners = this.listeners.get(type);
                if (listeners) {
                    this.removeListener(listeners, callback);
                }
            }
        }
        removeListener(listeners, callback) {
            const idx = listeners.findIndex(c => c === callback);
            if (idx >= 0) {
                arrayRemoveAt(listeners, idx);
                if (this.listenerOptions.has(callback)) {
                    this.listenerOptions.delete(callback);
                }
            }
        }
        dispatchEvent(evt) {
            const listeners = this.listeners.get(evt.type);
            if (listeners) {
                for (const callback of listeners) {
                    const options = this.listenerOptions.get(callback);
                    if (options && options.once) {
                        this.removeListener(listeners, callback);
                    }
                    callback.call(this, evt);
                }
            }
            return !evt.defaultPrevented;
        }
    }
    class TypedEventBase extends EventBase {
        constructor() {
            super(...arguments);
            this.mappedCallbacks = new Map();
        }
        addEventListener(type, callback, options) {
            let mappedCallback = this.mappedCallbacks.get(callback);
            if (mappedCallback == null) {
                mappedCallback = (evt) => callback(evt);
                this.mappedCallbacks.set(callback, mappedCallback);
            }
            super.addEventListener(type, mappedCallback, options);
        }
        removeEventListener(type, callback) {
            const mappedCallback = this.mappedCallbacks.get(callback);
            if (mappedCallback) {
                super.removeEventListener(type, mappedCallback);
            }
        }
    }

    function sleep(dt) {
        return new Promise((resolve) => {
            setTimeout(resolve, dt);
        });
    }

    class CallaEvent extends Event {
        constructor(eventType) {
            super(eventType);
            this.eventType = eventType;
        }
    }
    class CallaUserEvent extends CallaEvent {
        constructor(type, id) {
            super(type);
            this.id = id;
        }
    }
    var StreamType;
    (function (StreamType) {
        StreamType["Audio"] = "audio";
        StreamType["Video"] = "video";
    })(StreamType || (StreamType = {}));
    var StreamOpType;
    (function (StreamOpType) {
        StreamOpType["Added"] = "added";
        StreamOpType["Removed"] = "removed";
        StreamOpType["Changed"] = "changed";
    })(StreamOpType || (StreamOpType = {}));

    var ConnectionState;
    (function (ConnectionState) {
        ConnectionState["Disconnected"] = "Disconnected";
        ConnectionState["Connecting"] = "Connecting";
        ConnectionState["Connected"] = "Connected";
        ConnectionState["Disconnecting"] = "Disconnecting";
    })(ConnectionState || (ConnectionState = {}));

    class BaseMetadataClient extends TypedEventBase {
        constructor(sleepTime) {
            super();
            this.sleepTime = sleepTime;
            this.tasks = new Map();
        }
        async getNext(evtName, userID) {
            return new Promise((resolve) => {
                const getter = (evt) => {
                    if (evt instanceof CallaUserEvent
                        && evt.id === userID) {
                        this.removeEventListener(evtName, getter);
                        resolve(evt);
                    }
                };
                this.addEventListener(evtName, getter);
            });
        }
        get isConnected() {
            return this.metadataState === ConnectionState.Connected;
        }
        async callThrottled(key, command, ...args) {
            if (!this.tasks.has(key)) {
                const start = performance.now();
                const task = this.callInternal(command, ...args);
                this.tasks.set(key, task);
                await task;
                const delta = performance.now() - start;
                const sleepTime = this.sleepTime - delta;
                if (sleepTime > 0) {
                    await sleep(this.sleepTime);
                }
                this.tasks.delete(key);
            }
        }
        async callImmediate(command, ...args) {
            await this.callInternal(command, ...args);
        }
        setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.callThrottled("userPosed", "userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setLocalPoseImmediate(px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.callImmediate("userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.callThrottled("userPointer" + name, "userPointer", name, px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setAvatarEmoji(emoji) {
            this.callImmediate("setAvatarEmoji", emoji);
        }
        setAvatarURL(url) {
            this.callImmediate("avatarChanged", url);
        }
        emote(emoji) {
            this.callImmediate("emote", emoji);
        }
        chat(text) {
            this.callImmediate("chat", text);
        }
    }

    /**
     * Scans through a series of filters to find an item that matches
     * any of the filters. The first item of the first filter that matches
     * will be returned.
     */
    function arrayScan(arr, ...tests) {
        for (const test of tests) {
            for (const item of arr) {
                if (test(item)) {
                    return item;
                }
            }
        }
        return null;
    }

    function addLogger(obj, evtName) {
        obj.addEventListener(evtName, (...rest) => {
            if (loggingEnabled) {
                console.log(">== CALLA ==<", evtName, ...rest);
            }
        });
    }
    function filterDeviceDuplicates(devices) {
        const filtered = [];
        for (let i = 0; i < devices.length; ++i) {
            const a = devices[i];
            let found = false;
            for (let j = 0; j < filtered.length && !found; ++j) {
                const b = filtered[j];
                found = a.kind === b.kind && b.label.indexOf(a.label) > 0;
            }
            if (!found) {
                filtered.push(a);
            }
        }
        return filtered;
    }
    const PREFERRED_AUDIO_OUTPUT_ID_KEY = "calla:preferredAudioOutputID";
    const PREFERRED_AUDIO_INPUT_ID_KEY = "calla:preferredAudioInputID";
    const PREFERRED_VIDEO_INPUT_ID_KEY = "calla:preferredVideoInputID";
    const DEFAULT_LOCAL_USER_ID = "local-user";
    let loggingEnabled = window.location.hostname === "localhost"
        || /\bdebug\b/.test(window.location.search);
    class BaseTeleconferenceClient extends TypedEventBase {
        constructor(fetcher, audio, needsAudioDevice = true, needsVideoDevice = false) {
            super();
            this.needsAudioDevice = needsAudioDevice;
            this.needsVideoDevice = needsVideoDevice;
            this.localUserID = null;
            this.localUserName = null;
            this.roomName = null;
            this._connectionState = ConnectionState.Disconnected;
            this._conferenceState = ConnectionState.Disconnected;
            this.hasAudioPermission = false;
            this.hasVideoPermission = false;
            this.fetcher = fetcher;
            this.audio = audio;
            this.addEventListener("serverConnected", this.setConnectionState.bind(this, ConnectionState.Connected));
            this.addEventListener("serverFailed", this.setConnectionState.bind(this, ConnectionState.Disconnected));
            this.addEventListener("serverDisconnected", this.setConnectionState.bind(this, ConnectionState.Disconnected));
            this.addEventListener("conferenceJoined", this.setConferenceState.bind(this, ConnectionState.Connected));
            this.addEventListener("conferenceFailed", this.setConferenceState.bind(this, ConnectionState.Disconnected));
            this.addEventListener("conferenceRestored", this.setConferenceState.bind(this, ConnectionState.Connected));
            this.addEventListener("conferenceLeft", this.setConferenceState.bind(this, ConnectionState.Disconnected));
        }
        toggleLogging() {
            loggingEnabled = !loggingEnabled;
        }
        get connectionState() {
            return this._connectionState;
        }
        setConnectionState(state) {
            this._connectionState = state;
        }
        get conferenceState() {
            return this._conferenceState;
        }
        setConferenceState(state) {
            this._conferenceState = state;
        }
        dispatchEvent(evt) {
            if (evt instanceof CallaUserEvent
                && (evt.id == null
                    || evt.id === "local")) {
                if (this.localUserID === DEFAULT_LOCAL_USER_ID) {
                    evt.id = null;
                }
                else {
                    evt.id = this.localUserID;
                }
            }
            return super.dispatchEvent(evt);
        }
        async getNext(evtName, userID) {
            return new Promise((resolve) => {
                const getter = (evt) => {
                    if (evt instanceof CallaUserEvent
                        && evt.id === userID) {
                        this.removeEventListener(evtName, getter);
                        resolve(evt);
                    }
                };
                this.addEventListener(evtName, getter);
            });
        }
        get preferredAudioInputID() {
            return localStorage.getItem(PREFERRED_AUDIO_INPUT_ID_KEY);
        }
        set preferredAudioInputID(v) {
            localStorage.setItem(PREFERRED_AUDIO_INPUT_ID_KEY, v);
        }
        get preferredVideoInputID() {
            return localStorage.getItem(PREFERRED_VIDEO_INPUT_ID_KEY);
        }
        set preferredVideoInputID(v) {
            localStorage.setItem(PREFERRED_VIDEO_INPUT_ID_KEY, v);
        }
        async setPreferredDevices() {
            await this.setPreferredAudioInput(true);
            await this.setPreferredVideoInput(false);
            await this.setPreferredAudioOutput(true);
        }
        async getPreferredAudioInput(allowAny) {
            const devices = await this.getAudioInputDevices();
            const device = arrayScan(devices, (d) => d.deviceId === this.preferredAudioInputID, (d) => d.deviceId === "communications", (d) => d.deviceId === "default", (d) => allowAny && d.deviceId.length > 0);
            return device;
        }
        async setPreferredAudioInput(allowAny) {
            const device = await this.getPreferredAudioInput(allowAny);
            if (device) {
                await this.setAudioInputDevice(device);
            }
        }
        async getPreferredVideoInput(allowAny) {
            const devices = await this.getVideoInputDevices();
            const device = arrayScan(devices, (d) => d.deviceId === this.preferredVideoInputID, (d) => allowAny && d && /front/i.test(d.label), (d) => allowAny && d.deviceId.length > 0);
            return device;
        }
        async setPreferredVideoInput(allowAny) {
            const device = await this.getPreferredVideoInput(allowAny);
            if (device) {
                await this.setVideoInputDevice(device);
            }
        }
        async getDevices() {
            let devices = null;
            for (let i = 0; i < 3; ++i) {
                devices = await navigator.mediaDevices.enumerateDevices();
                for (const device of devices) {
                    if (device.deviceId.length > 0) {
                        this.hasAudioPermission = this.hasAudioPermission || device.kind === "audioinput" && device.label.length > 0;
                        this.hasVideoPermission = this.hasVideoPermission || device.kind === "videoinput" && device.label.length > 0;
                    }
                }
                if (this.hasAudioPermission) {
                    break;
                }
                try {
                    await navigator.mediaDevices.getUserMedia({
                        audio: this.needsAudioDevice && !this.hasAudioPermission,
                        video: this.needsVideoDevice && !this.hasVideoPermission
                    });
                }
                catch (exp) {
                    console.warn(exp);
                }
            }
            return devices || [];
        }
        async getMediaPermissions() {
            await this.getDevices();
            return {
                audio: this.hasAudioPermission,
                video: this.hasVideoPermission
            };
        }
        async getAvailableDevices(filterDuplicates = false) {
            let devices = await this.getDevices();
            if (filterDuplicates) {
                devices = filterDeviceDuplicates(devices);
            }
            return {
                audioOutput: canChangeAudioOutput ? devices.filter(d => d.kind === "audiooutput") : [],
                audioInput: devices.filter(d => d.kind === "audioinput"),
                videoInput: devices.filter(d => d.kind === "videoinput")
            };
        }
        async getAudioInputDevices(filterDuplicates = false) {
            const devices = await this.getAvailableDevices(filterDuplicates);
            return devices && devices.audioInput || [];
        }
        async getVideoInputDevices(filterDuplicates = false) {
            const devices = await this.getAvailableDevices(filterDuplicates);
            return devices && devices.videoInput || [];
        }
        async setAudioOutputDevice(device) {
            if (canChangeAudioOutput) {
                this.preferredAudioOutputID = device && device.deviceId || null;
            }
        }
        async getAudioOutputDevices(filterDuplicates = false) {
            if (!canChangeAudioOutput) {
                return [];
            }
            const devices = await this.getAvailableDevices(filterDuplicates);
            return devices && devices.audioOutput || [];
        }
        async getCurrentAudioOutputDevice() {
            if (!canChangeAudioOutput) {
                return null;
            }
            const curId = this.audio.getAudioOutputDeviceID(), devices = await this.getAudioOutputDevices(), device = devices.filter((d) => curId != null && d.deviceId === curId
                || curId == null && d.deviceId === this.preferredAudioOutputID);
            if (device.length === 0) {
                return null;
            }
            else {
                return device[0];
            }
        }
        get preferredAudioOutputID() {
            return localStorage.getItem(PREFERRED_AUDIO_OUTPUT_ID_KEY);
        }
        set preferredAudioOutputID(v) {
            localStorage.setItem(PREFERRED_AUDIO_OUTPUT_ID_KEY, v);
        }
        async getPreferredAudioOutput(allowAny) {
            const devices = await this.getAudioOutputDevices();
            const device = arrayScan(devices, (d) => d.deviceId === this.preferredAudioOutputID, (d) => d.deviceId === "communications", (d) => d.deviceId === "default", (d) => allowAny && d.deviceId.length > 0);
            return device;
        }
        async setPreferredAudioOutput(allowAny) {
            const device = await this.getPreferredAudioOutput(allowAny);
            if (device) {
                await this.setAudioOutputDevice(device);
            }
        }
        async setAudioInputDevice(device) {
            this.preferredAudioInputID = device && device.deviceId || null;
        }
        async setVideoInputDevice(device) {
            this.preferredVideoInputID = device && device.deviceId || null;
        }
        async connect() {
            this.setConnectionState(ConnectionState.Connecting);
        }
        async join(_roomName, _password) {
            this.setConferenceState(ConnectionState.Connecting);
        }
        async leave() {
            this.setConferenceState(ConnectionState.Disconnecting);
        }
        async disconnect() {
            this.setConnectionState(ConnectionState.Disconnecting);
        }
    }

    /**
     * An Event class for tracking changes to audio activity.
     **/
    class AudioActivityEvent extends Event {
        /** Creates a new "audioActivity" event */
        constructor() {
            super("audioActivity");
            this.id = null;
            this.isActive = false;
            Object.seal(this);
        }
        /**
         * Sets the current state of the event
         * @param id - the user for which the activity changed
         * @param isActive - the new state of the activity
         */
        set(id, isActive) {
            this.id = id;
            this.isActive = isActive;
        }
    }

    var ClientState;
    (function (ClientState) {
        ClientState["InConference"] = "in-conference";
        ClientState["JoiningConference"] = "joining-conference";
        ClientState["Connected"] = "connected";
        ClientState["Connecting"] = "connecting";
        ClientState["Prepaired"] = "prepaired";
        ClientState["Prepairing"] = "prepairing";
        ClientState["Unprepared"] = "unprepaired";
    })(ClientState || (ClientState = {}));
    const audioActivityEvt = new AudioActivityEvent();
    class Calla extends TypedEventBase {
        constructor(_fetcher, _tele, _meta) {
            super();
            this._fetcher = _fetcher;
            this._tele = _tele;
            this._meta = _meta;
            this.isAudioMuted = null;
            this.isVideoMuted = null;
            const fwd = this.dispatchEvent.bind(this);
            this._tele.addEventListener("serverConnected", fwd);
            this._tele.addEventListener("serverDisconnected", fwd);
            this._tele.addEventListener("serverFailed", fwd);
            this._tele.addEventListener("conferenceFailed", fwd);
            this._tele.addEventListener("conferenceRestored", fwd);
            this._tele.addEventListener("audioMuteStatusChanged", fwd);
            this._tele.addEventListener("videoMuteStatusChanged", fwd);
            this._tele.addEventListener("conferenceJoined", async (evt) => {
                const user = this.audio.setLocalUserID(evt.id);
                evt.pose = user.pose;
                this.dispatchEvent(evt);
                await this.setPreferredDevices();
            });
            this._tele.addEventListener("conferenceLeft", (evt) => {
                this.audio.setLocalUserID(evt.id);
                this.dispatchEvent(evt);
            });
            this._tele.addEventListener("participantJoined", async (joinEvt) => {
                joinEvt.source = this.audio.createUser(joinEvt.id);
                this.dispatchEvent(joinEvt);
            });
            this._tele.addEventListener("participantLeft", (evt) => {
                this.dispatchEvent(evt);
                this.audio.removeUser(evt.id);
            });
            this._tele.addEventListener("userNameChanged", fwd);
            this._tele.addEventListener("videoAdded", fwd);
            this._tele.addEventListener("videoRemoved", fwd);
            this._tele.addEventListener("audioAdded", (evt) => {
                const user = this.audio.getUser(evt.id);
                if (user) {
                    let stream = user.streams.get(evt.kind);
                    if (stream) {
                        user.streams.delete(evt.kind);
                    }
                    stream = evt.stream;
                    user.streams.set(evt.kind, stream);
                    if (evt.id !== this._tele.localUserID) {
                        this.audio.setUserStream(evt.id, stream);
                    }
                    this.dispatchEvent(evt);
                }
            });
            this._tele.addEventListener("audioRemoved", (evt) => {
                const user = this.audio.getUser(evt.id);
                if (user && user.streams.has(evt.kind)) {
                    user.streams.delete(evt.kind);
                }
                if (evt.id !== this._tele.localUserID) {
                    this.audio.setUserStream(evt.id, null);
                }
                this.dispatchEvent(evt);
            });
            this._meta.addEventListener("avatarChanged", fwd);
            this._meta.addEventListener("chat", fwd);
            this._meta.addEventListener("emote", fwd);
            this._meta.addEventListener("setAvatarEmoji", fwd);
            const offsetEvt = (poseEvt) => {
                const O = this.audio.getUserOffset(poseEvt.id);
                if (O) {
                    poseEvt.px += O[0];
                    poseEvt.py += O[1];
                    poseEvt.pz += O[2];
                }
                this.dispatchEvent(poseEvt);
            };
            this._meta.addEventListener("userPointer", offsetEvt);
            this._meta.addEventListener("userPosed", (evt) => {
                this.audio.setUserPose(evt.id, evt.px, evt.py, evt.pz, evt.fx, evt.fy, evt.fz, evt.ux, evt.uy, evt.uz);
                offsetEvt(evt);
            });
            this.audio.addEventListener("audioActivity", (evt) => {
                audioActivityEvt.id = evt.id;
                audioActivityEvt.isActive = evt.isActive;
                this.dispatchEvent(audioActivityEvt);
            });
            const dispose = this.dispose.bind(this);
            window.addEventListener("beforeunload", dispose);
            window.addEventListener("unload", dispose);
            window.addEventListener("pagehide", dispose);
            Object.seal(this);
        }
        get connectionState() {
            return this._tele.connectionState;
        }
        get conferenceState() {
            return this._tele.conferenceState;
        }
        get fetcher() {
            return this._fetcher;
        }
        get tele() {
            return this._tele;
        }
        get meta() {
            return this._meta;
        }
        get audio() {
            return this._tele.audio;
        }
        get preferredAudioOutputID() {
            return this._tele.preferredAudioOutputID;
        }
        set preferredAudioOutputID(v) {
            this._tele.preferredAudioOutputID = v;
        }
        get preferredAudioInputID() {
            return this._tele.preferredAudioInputID;
        }
        set preferredAudioInputID(v) {
            this._tele.preferredAudioInputID = v;
        }
        get preferredVideoInputID() {
            return this._tele.preferredVideoInputID;
        }
        set preferredVideoInputID(v) {
            this._tele.preferredVideoInputID = v;
        }
        async getCurrentAudioOutputDevice() {
            return await this._tele.getCurrentAudioOutputDevice();
        }
        async getMediaPermissions() {
            return await this._tele.getMediaPermissions();
        }
        async getAudioOutputDevices(filterDuplicates) {
            return await this._tele.getAudioOutputDevices(filterDuplicates);
        }
        async getAudioInputDevices(filterDuplicates) {
            return await this._tele.getAudioInputDevices(filterDuplicates);
        }
        async getVideoInputDevices(filterDuplicates) {
            return await this._tele.getVideoInputDevices(filterDuplicates);
        }
        dispose() {
            this.leave();
            this.disconnect();
        }
        get offsetRadius() {
            return this.audio.offsetRadius;
        }
        set offsetRadius(v) {
            this.audio.offsetRadius = v;
        }
        setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz, 0);
            this._meta.setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setLocalPoseImmediate(px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz, 0);
            this._meta.setLocalPoseImmediate(px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
            this._meta.setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setAvatarEmoji(emoji) {
            this._meta.setAvatarEmoji(emoji);
        }
        setAvatarURL(url) {
            this._meta.setAvatarURL(url);
        }
        emote(emoji) {
            this._meta.emote(emoji);
        }
        chat(text) {
            this._meta.chat(text);
        }
        async setPreferredDevices() {
            await this._tele.setPreferredDevices();
        }
        async setAudioInputDevice(device) {
            await this._tele.setAudioInputDevice(device);
        }
        async setVideoInputDevice(device) {
            await this._tele.setVideoInputDevice(device);
        }
        async getCurrentAudioInputDevice() {
            return await this._tele.getCurrentAudioInputDevice();
        }
        async getCurrentVideoInputDevice() {
            return await this._tele.getCurrentVideoInputDevice();
        }
        async toggleAudioMuted() {
            return await this._tele.toggleAudioMuted();
        }
        async toggleVideoMuted() {
            return await this._tele.toggleVideoMuted();
        }
        async getAudioMuted() {
            return await this._tele.getAudioMuted();
        }
        async getVideoMuted() {
            return await this._tele.getVideoMuted();
        }
        get metadataState() {
            return this._meta.metadataState;
        }
        get localUserID() {
            return this._tele.localUserID;
        }
        get localUserName() {
            return this._tele.localUserName;
        }
        get roomName() {
            return this._tele.roomName;
        }
        userExists(id) {
            return this._tele.userExists(id);
        }
        getUserNames() {
            return this._tele.getUserNames();
        }
        async connect() {
            await this._tele.connect();
            if (this._tele.connectionState === ConnectionState.Connected) {
                await this._meta.connect();
            }
        }
        async join(roomName) {
            await this._tele.join(roomName);
            if (this._tele.conferenceState === ConnectionState.Connected) {
                await this._meta.join(roomName);
            }
        }
        async identify(userName) {
            await this._tele.identify(userName);
            await this._meta.identify(this.localUserID);
        }
        async leave() {
            await this._meta.leave();
            await this._tele.leave();
        }
        async disconnect() {
            await this._meta.disconnect();
            await this._tele.disconnect();
        }
        update() {
            this.audio.update();
        }
        async setAudioOutputDevice(device) {
            this._tele.setAudioOutputDevice(device);
            if (canChangeAudioOutput) {
                await this.audio.setAudioOutputDeviceID(this._tele.preferredAudioOutputID);
            }
        }
        async setAudioMuted(muted) {
            let isMuted = this.isAudioMuted;
            if (muted !== isMuted) {
                isMuted = await this.toggleAudioMuted();
            }
            return isMuted;
        }
        async setVideoMuted(muted) {
            let isMuted = this.isVideoMuted;
            if (muted !== isMuted) {
                isMuted = await this.toggleVideoMuted();
            }
            return isMuted;
        }
    }

    var version = "1.0.0";

    console.info(`Calla v${version}.`);

    exports.BaseMetadataClient = BaseMetadataClient;
    exports.BaseTeleconferenceClient = BaseTeleconferenceClient;
    exports.Client = Calla;
    exports.DEFAULT_LOCAL_USER_ID = DEFAULT_LOCAL_USER_ID;
    exports.addLogger = addLogger;
    exports.canChangeAudioOutput = canChangeAudioOutput;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
//# sourceMappingURL=calla.js.map
