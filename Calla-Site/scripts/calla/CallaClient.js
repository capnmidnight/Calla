/* global JitsiMeetJS */

import "../lib/jquery";
import { arrayScan } from "./arrays/arrayScan";
import { AudioActivityEvent } from "./audio/AudioActivityEvent";
import { AudioManager } from "./audio/AudioManager";
import { canChangeAudioOutput } from "./audio/canChangeAudioOutput";
import { EventBase } from "./events/EventBase";
import { once } from "./events/once";
import { until } from "./events/until";
import { when } from "./events/when";
import { isGoodNumber, isNumber } from "./typeChecks";
import { versionString } from "./version";

console.info("Calla", versionString);

class CallaClientEvent extends Event {
    constructor(command, id, value) {
        super(command);
        this.id = id;
        for (let key in value) {
            if (key !== "isTrusted"
                && !Object.prototype.hasOwnProperty.call(Event.prototype, key)) {
                this[key] = value[key];
            }
        }
    }
}

// helps us filter out data channel messages that don't belong to us
const eventNames = [
    "userMoved",
    "userTurned",
    "userPosed",
    "emote",
    "userInitRequest",
    "userInitResponse",
    "audioMuteStatusChanged",
    "videoMuteStatusChanged",
    "localAudioMuteStatusChanged",
    "localVideoMuteStatusChanged",
    "videoConferenceJoined",
    "videoConferenceLeft",
    "participantJoined",
    "participantLeft",
    "avatarChanged",
    "displayNameChange",
    "audioActivity",
    "setAvatarEmoji",
    "deviceListChanged",
    "participantRoleChanged",
    "audioAdded",
    "videoAdded",
    "audioRemoved",
    "videoRemoved",
    "audioChanged",
    "videoChanged"
];

const audioActivityEvt = new AudioActivityEvent();

function logger(source, evtName) {
    if (window.location.hostname === "localhost") {
        const handler = (...rest) => {
            if (evtName === "conference.endpoint_message_received"
                && rest.length >= 2
                && (rest[1].type === "e2e-ping-request"
                    || rest[1].type === "e2e-ping-response"
                    || rest[1].type === "stats")) {
                return;
            }
            console.log(evtName, ...rest);
        };

        source.addEventListener(evtName, handler);
    }
}

function setLoggers(source, evtObj) {
    for (let evtName of Object.values(evtObj)) {
        if (evtName.indexOf("audioLevelsChanged") === -1) {
            logger(source, evtName);
        }
    }
}

// Manages communication between Jitsi Meet and Calla
export class CallaClient extends EventBase {

    /**
     * @param {string} JITSI_HOST
     * @param {string} JVB_HOST
     * @param {string} JVB_MUC
     */
    constructor(JITSI_HOST, JVB_HOST, JVB_MUC) {
        super();

        this.host = JITSI_HOST;
        this.bridgeHost = JVB_HOST;
        this.bridgeMUC = JVB_MUC;

        this._prepTask = null;
        this.joined = false;
        this.connection = null;
        this.conference = null;
        this.audio = new AudioManager();
        this.audio.addEventListener("audioActivity", (evt) => {
            audioActivityEvt.id = evt.id;
            audioActivityEvt.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt);
        });

        this.hasAudioPermission = false;
        this.hasVideoPermission = false;

        /** @type {String} */
        this.localUserID = null;

        /** @type {String} */
        this.preferredAudioOutputID = null;

        /** @type {String} */
        this.preferredAudioInputID = null;

        /** @type {String} */
        this.preferredVideoInputID = null;

        this.addEventListener("participantJoined", (evt) => {
            this.userInitRequest(evt.id);
        });

        this.addEventListener("userInitRequest", (evt) => {
            const user = this.audio.getUser(this.localUserID);
            const { p, f, u } = user.pose.end;
            this.userInitResponse(evt.id, {
                id: this.localUserID,
                px: p.x,
                py: p.y,
                pz: p.z,
                fx: f.x,
                fy: f.y,
                fz: f.z,
                ux: u.x,
                uy: u.y,
                uz: u.z
            });
        });

        this.addEventListener("userInitResponse", (evt) => {
            if (isNumber(evt.x)
                && isNumber(evt.y)
                && isNumber(evt.z)) {
                this.audio.setUserPosition(evt.id, evt.x, evt.y, evt.z);
            }
            else if (isNumber(evt.fx)
                && isNumber(evt.fy)
                && isNumber(evt.fz)
                && isNumber(evt.ux)
                && isNumber(evt.uy)
                && isNumber(evt.uz)) {
                if (isNumber(evt.px)
                    && isNumber(evt.py)
                    && isNumber(evt.pz)) {
                    this.audio.setUserPose(evt.id, evt.px, evt.py, evt.pz, evt.fx, evt.fy, evt.fz, evt.ux, evt.uy, evt.uz);
                }
                else {
                    this.audio.setUserOrientation(evt.id, evt.fx, evt.fy, evt.fz, evt.ux, evt.uy, evt.uz);
                }
            }
        });

        this.addEventListener("userMoved", (evt) => {
            this.audio.setUserPosition(evt.id, evt.x, evt.y, evt.z);
        });

        this.addEventListener("userTurned", (evt) => {
            this.audio.setUserOrientation(evt.id, evt.fx, evt.fy, evt.fz, evt.ux, evt.uy, evt.uz);
        });

        this.addEventListener("userPosed", (evt) => {
            this.audio.setUserPose(evt.id, evt.px, evt.py, evt.pz, evt.fx, evt.fy, evt.fz, evt.ux, evt.uy, evt.uz);
        });

        this.addEventListener("participantLeft", (evt) => {
            this.removeUser(evt.id);
        });

        const onAudioChange = (evt) => {
            const evt2 = Object.assign(new Event("audioChanged"), {
                id: evt.id,
                stream: evt.stream
            });
            this.dispatchEvent(evt2);
        };

        const onVideoChange = (evt) => {
            const evt2 = Object.assign(new Event("videoChanged"), {
                id: evt.id,
                stream: evt.stream
            });
            this.dispatchEvent(evt2);
        };

        this.addEventListener("audioAdded", onAudioChange);
        this.addEventListener("audioRemoved", onAudioChange);
        this.addEventListener("videoAdded", onVideoChange);
        this.addEventListener("videoRemoved", onVideoChange);

        this.addEventListener("audioMuteStatusChanged", (evt) => {
            if (evt.id === this.localUserID) {
                const evt2 = Object.assign(new Event("localAudioMuteStatusChanged"), {
                    id: evt.id,
                    muted: evt.muted
                })
                this.dispatchEvent(evt2);
            }
        });

        this.addEventListener("videoMuteStatusChanged", (evt) => {
            if (evt.id === this.localUserID) {
                const evt2 = Object.assign(new Event("localVideoMuteStatusChanged"), {
                    id: evt.id,
                    muted: evt.muted
                })
                this.dispatchEvent(evt2);
            }
        });

        const dispose = () => this.dispose();
        window.addEventListener("beforeunload", dispose);
        window.addEventListener("unload", dispose);
        window.addEventListener("pagehide", dispose);

        Object.seal(this);
    }

    get appFingerPrint() {
        return "Calla";
    }

    userIDs() {
        return Object.keys(this.conference.participants);
    }

    userExists(id) {
        return !!this.conference.participants[id];
    }

    users() {
        return Object.keys(this.conference.participants)
            .map(k => [k, this.conference.participants[k].getDisplayName()]);
    }

    update() {
        this.audio.update();
    }

    _prepareAsync() {
        if (!this._prepTask) {
            console.info("Connecting to:", this.host);
            this._prepTask = import(`https://${this.host}/libs/lib-jitsi-meet.min.js`);
        }
        return this._prepTask;
    }

    /**
     * @param {string} roomName
     * @param {string} userName
     */
    async join(roomName, userName) {
        await this.leaveAsync();

        await this._prepareAsync();

        roomName = roomName.toLocaleLowerCase();

        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
        JitsiMeetJS.init();

        this.connection = new JitsiMeetJS.JitsiConnection(null, null, {
            hosts: {
                domain: this.bridgeHost,
                muc: this.bridgeMUC
            },
            serviceUrl: `https://${this.host}/http-bind`,
            enableLipSync: true
        });

        const {
            CONNECTION_ESTABLISHED,
            CONNECTION_FAILED,
            CONNECTION_DISCONNECTED
        } = JitsiMeetJS.events.connection;

        setLoggers(this.connection, JitsiMeetJS.events.connection);

        const onConferenceLeft = () => {
            this.dispatchEvent(Object.assign(
                new Event("videoConferenceLeft"), {
                roomName
            }));
            this.localUserID = null;
            this.conference = null;
            this.joined = false;
        };

        const onFailed = (evt) => {
            console.error("Connection failed", evt);
            this.dispose();
            onConferenceLeft();
            onDisconnect();
        };

        const onDisconnect = () => {
            this.connection.removeEventListener(CONNECTION_ESTABLISHED, onConnect);
            this.connection.removeEventListener(CONNECTION_FAILED, onFailed);
            this.connection.removeEventListener(CONNECTION_DISCONNECTED, onDisconnect);
            this.connection = null;
        };

        const onConnect = (connectionID) => {
            this.conference = this.connection.initJitsiConference(roomName, {
                openBridgeChannel: true
            });

            const {
                TRACK_ADDED,
                TRACK_REMOVED,
                CONFERENCE_JOINED,
                CONFERENCE_LEFT,
                USER_JOINED,
                USER_LEFT,
                DISPLAY_NAME_CHANGED,
                ENDPOINT_MESSAGE_RECEIVED,
                CONNECTION_INTERRUPTED
            } = JitsiMeetJS.events.conference;

            setLoggers(this.conference, JitsiMeetJS.events.conference);

            this.conference.addEventListener(CONFERENCE_JOINED, async () => {
                this.localUserID = this.conference.myUserId();
                console.log("======== CONFERENCE_JOINED ::", this.localUserID);
                const user = this.audio.createLocalUser(this.localUserID);
                this.joined = true;
                this.setDisplayName(userName);
                this.dispatchEvent(Object.assign(
                    new Event("videoConferenceJoined"), {
                    id: this.localUserID,
                    roomName,
                    displayName: userName,
                    pose: user.pose
                }));
                await this.setPreferredDevicesAsync();
            });

            this.conference.addEventListener(CONFERENCE_LEFT, onConferenceLeft);

            const onTrackMuteChanged = (track, muted) => {
                const userID = track.getParticipantId() || this.localUserID,
                    trackKind = track.getType(),
                    muteChangedEvtName = trackKind + "MuteStatusChanged",
                    evt = Object.assign(
                        new Event(muteChangedEvtName), {
                        id: userID,
                        muted
                    });

                this.dispatchEvent(evt);
            };

            const onTrackChanged = (track) => {
                onTrackMuteChanged(track, track.isMuted());
            };

            this.conference.addEventListener(USER_JOINED, (id, jitsiUser) => {
                console.log("======== USER_JOINED ::", id);
                const user = this.audio.createUser(id);
                const evt = Object.assign(
                    new Event("participantJoined"), {
                    id,
                    displayName: jitsiUser.getDisplayName(),
                    pose: user.pose
                });
                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(USER_LEFT, (id) => {
                const evt = Object.assign(
                    new Event("participantLeft"), {
                    id
                });

                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(DISPLAY_NAME_CHANGED, (id, displayName) => {
                const evt = Object.assign(
                    new Event("displayNameChange"), {
                    id,
                    displayName
                });

                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(TRACK_ADDED, (track) => {
                const userID = track.getParticipantId() || this.localUserID,
                    isLocal = track.isLocal(),
                    trackKind = track.getType(),
                    trackAddedEvt = Object.assign(new Event(trackKind + "Added"), {
                        id: userID,
                        stream: track.stream
                    }),
                    user = this.audio.getUser(userID);

                setLoggers(track, JitsiMeetJS.events.track);

                track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, onTrackChanged);

                if (user.tracks.has(trackKind)) {
                    user.tracks.get(trackKind).dispose();
                    user.tracks.delete(trackKind);
                }

                user.tracks.set(trackKind, track);

                if (trackKind === "audio" && !isLocal) {
                    this.audio.setUserStream(userID, track.stream);
                }

                this.dispatchEvent(trackAddedEvt);

                onTrackMuteChanged(track, false);
            });

            this.conference.addEventListener(TRACK_REMOVED, (track) => {

                const userID = track.getParticipantId() || this.localUserID,
                    isLocal = track.isLocal(),
                    trackKind = track.getType(),
                    trackRemovedEvt = Object.assign(new Event(trackKind + "Removed"), {
                        id: userID,
                        stream: null
                    }),
                    user = this.audio.getUser(userID);

                if (user && user.tracks.has(trackKind)) {
                    user.tracks.get(trackKind).dispose();
                    user.tracks.delete(trackKind);
                }

                if (trackKind === "audio" && !isLocal) {
                    this.audio.setUserStream(userID, null);
                }

                track.dispose();

                onTrackMuteChanged(track, true);
                this.dispatchEvent(trackRemovedEvt);
            });

            this.conference.addEventListener(ENDPOINT_MESSAGE_RECEIVED, (user, data) => {
                this.rxGameData({ user, data });
            });

            this.conference.addEventListener(CONNECTION_INTERRUPTED, (...rest) => {
                console.log("CONNECTION_INTERRUPTED");
                onFailed(rest);
            });

            this.conference.join();
        };

        this.connection.addEventListener(CONNECTION_ESTABLISHED, onConnect);
        this.connection.addEventListener(CONNECTION_FAILED, onFailed);
        this.connection.addEventListener(CONNECTION_DISCONNECTED, onDisconnect);

        setLoggers(JitsiMeetJS.mediaDevices, JitsiMeetJS.events.mediaDevices);

        this.connection.connect();
    }

    dispatchEvent(evt) {
        if (evt.id === null
            || evt.id === undefined
            || evt.id === "local") {
            evt.id = this.localUserID;
            console.warn("Jitsi didn't give use the local user id");
            if (this.localUserID === null) {
                console.warn("BUT I DON'T KNOW THE LOCAL USER ID YET!");
            }
        }

        super.dispatchEvent(evt);
    }

    async setPreferredDevicesAsync() {
        await this.setPreferredAudioInputAsync(true);
        await this.setPreferredVideoInputAsync(false);
        await this.setPreferredAudioOutputAsync(true);
    }

    /**
     * @param {boolean} allowAny
     */
    async getPreferredAudioOutputAsync(allowAny) {
        const devices = await this.getAudioOutputDevicesAsync();
        const device = arrayScan(
            devices,
            (d) => d.deviceId === this.preferredAudioOutputID,
            (d) => d.deviceId === "communications",
            (d) => d.deviceId === "default",
            (d) => allowAny && d && d.deviceId);
        return device;
    }

    /**
     * @param {boolean} allowAny
     */
    async setPreferredAudioOutputAsync(allowAny) {
        const device = await this.getPreferredAudioOutputAsync(allowAny);
        if (device) {
            await this.setAudioOutputDeviceAsync(device);
        }
    }

    /**
     * @param {boolean} allowAny
     */
    async getPreferredAudioInputAsync(allowAny) {
        const devices = await this.getAudioInputDevicesAsync();
        const device = arrayScan(
            devices,
            (d) => d.deviceId === this.preferredAudioInputID,
            (d) => d.deviceId === "communications",
            (d) => d.deviceId === "default",
            (d) => allowAny && d && d.deviceId);
        return device;
    }

    /**
     * @param {boolean} allowAny
     */
    async setPreferredAudioInputAsync(allowAny) {
        const device = await this.getPreferredAudioInputAsync(allowAny);
        if (device) {
            await this.setAudioInputDeviceAsync(device);
        }
    }

    /**
     * @param {boolean} allowAny
     */
    async getPreferredVideoInputAsync(allowAny) {
        const devices = await this.getVideoInputDevicesAsync();
        const device = arrayScan(devices,
            (d) => d.deviceId === this.preferredVideoInputID,
            (d) => allowAny && d && /front/i.test(d.label),
            (d) => allowAny && d && d.deviceId);
        return device;
    }

    /**
     * @param {boolean} allowAny
     */
    async setPreferredVideoInputAsync(allowAny) {
        const device = await this.getPreferredVideoInputAsync(allowAny);
        if (device) {
            await this.setVideoInputDeviceAsync(device);
        }
    }

    dispose() {
        if (this.localUserID) {
            const user = this.audio.getUser(this.localUserID);
            if (user) {
                for (let track of user.tracks.values()) {
                    track.dispose();
                }
            }
        }
    }

    /**
     * 
     * @param {string} userName
     */
    setDisplayName(userName) {
        this.conference.setDisplayName(userName);
    }

    async leaveAsync() {
        if (this.conference) {
            if (this.localUserID !== null) {
                const user = this.audio.getUser(this.localUserID);
                if (user) {
                    if (user.tracks.has("video")) {
                        const removeTrackTask = once(this, "videoRemoved");
                        this.conference.removeTrack(user.tracks.get("video"));
                        await removeTrackTask;
                    }

                    if (user.tracks.has("audio")) {
                        const removeTrackTask = once(this, "audioRemoved");
                        this.conference.removeTrack(user.tracks.get("audio"));
                        await removeTrackTask;
                    }
                }
            }

            await this.conference.leave();
            await this.connection.disconnect();
        }
    }

    async _getDevicesAsync() {
        await this._prepareAsync();
        const devices = await navigator.mediaDevices.enumerateDevices();
        for (let device of devices) {
            if (device.deviceId.length > 0) {
                this.hasAudioPermission |= device.kind === "audioinput" && device.label.length > 0;
                this.hasVideoPermission |= device.kind === "videoinput" && device.label.length > 0;
            }
        }

        return devices;
    }

    async getAvailableDevicesAsync() {
        let devices = await this._getDevicesAsync();

        for (let i = 0; i < 3 && !this.hasAudioPermission; ++i) {
            devices = null;
            try {
                const _ = await navigator.mediaDevices.getUserMedia({ audio: !this.hasAudioPermission, video: !this.hasVideoPermission });
            }
            catch (exp) {
                console.warn(exp);
            }

            devices = await this._getDevicesAsync();
        }

        return {
            audioOutput: canChangeAudioOutput ? devices.filter(d => d.kind === "audiooutput") : [],
            audioInput: devices.filter(d => d.kind === "audioinput"),
            videoInput: devices.filter(d => d.kind === "videoinput")
        };
    }

    async getAudioOutputDevicesAsync() {
        if (!canChangeAudioOutput) {
            return [];
        }
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.audioOutput || [];
    }

    async getAudioInputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.audioInput || [];
    }

    async getVideoInputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.videoInput || [];
    }

    /**
     * 
     * @param {MediaDeviceInfo} device
     */
    async setAudioOutputDeviceAsync(device) {
        if (!canChangeAudioOutput) {
            return;
        }
        this.preferredAudioOutputID = device && device.deviceId || null;
        await JitsiMeetJS.mediaDevices.setAudioOutputDevice(this.preferredAudioOutputID);
    }

    taskOf(evt) {
        return when(this, evt, (evt) => evt.id === this.localUserID, 5000);
    }

    getCurrentMediaTrack(type) {
        if (this.localUserID === null) {
            return null;
        }

        const user = this.audio.getUser(this.localUserID);
        if (!user) {
            return null;
        }

        if (!user.tracks.has(type)) {
            return null;
        }

        return user.tracks.get(type);
    }

    /**
     *
     * @param {MediaDeviceInfo} device
     */
    async setAudioInputDeviceAsync(device) {
        this.preferredAudioInputID = device && device.deviceId || null;

        const cur = this.getCurrentMediaTrack("audio");
        if (cur) {
            const removeTask = this.taskOf("audioRemoved");
            this.conference.removeTrack(cur);
            await removeTask;
        }

        if (this.joined && this.preferredAudioInputID) {
            const addTask = this.taskOf("audioAdded");
            const tracks = await JitsiMeetJS.createLocalTracks({
                devices: ["audio"],
                micDeviceId: this.preferredAudioInputID
            });

            for (let track of tracks) {
                this.conference.addTrack(track);
            }

            await addTask;
        }
    }

    /**
     *
     * @param {MediaDeviceInfo} device
     */
    async setVideoInputDeviceAsync(device) {
        this.preferredVideoInputID = device && device.deviceId || null;

        const cur = this.getCurrentMediaTrack("video");
        if (cur) {
            const removeTask = this.taskOf("videoRemoved");
            this.conference.removeTrack(cur);
            await removeTask;
        }

        if (this.joined && this.preferredVideoInputID) {
            const addTask = this.taskOf("videoAdded");
            const tracks = await JitsiMeetJS.createLocalTracks({
                devices: ["video"],
                cameraDeviceId: this.preferredVideoInputID
            });

            for (let track of tracks) {
                this.conference.addTrack(track);
            }

            await addTask;
        }
    }

    async getCurrentAudioInputDeviceAsync() {
        const cur = this.getCurrentMediaTrack("audio"),
            devices = await this.getAudioInputDevicesAsync(),
            device = devices.filter((d) => cur !== null && d.deviceId === cur.deviceId);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    /**
     * @return {Promise<MediaDeviceInfo>} */
    async getCurrentAudioOutputDeviceAsync() {
        if (!canChangeAudioOutput) {
            return null;
        }
        const deviceId = JitsiMeetJS.mediaDevices.getAudioOutputDevice(),
            devices = await this.getAudioOutputDevicesAsync(),
            device = devices.filter((d) => d.deviceId === deviceId);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    async getCurrentVideoInputDeviceAsync() {
        const cur = this.getCurrentMediaTrack("video"),
            devices = await this.getVideoInputDevicesAsync(),
            device = devices.filter((d) => cur !== null && d.deviceId === cur.deviceId);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    async toggleAudioMutedAsync() {
        const changeTask = this.taskOf("audioMuteStatusChanged");
        const cur = this.getCurrentMediaTrack("audio");
        if (cur) {
            const muted = cur.isMuted();
            if (muted) {
                await cur.unmute();
            }
            else {
                await cur.mute();
            }
        }
        else {
            await this.setPreferredAudioInputAsync(true);
        }

        const evt = await changeTask;
        return evt.muted;
    }

    async toggleVideoMutedAsync() {
        const changeTask = this.taskOf("videoMuteStatusChanged");
        const cur = this.getCurrentMediaTrack("video");
        if (cur) {
            await this.setVideoInputDeviceAsync(null);
        }
        else {
            await this.setPreferredVideoInputAsync(true);
        }

        const evt = await changeTask;
        return evt.muted;
    }

    isMediaMuted(type) {
        const cur = this.getCurrentMediaTrack(type);
        return cur === null
            || cur.isMuted();
    }

    get isAudioMuted() {
        return this.isMediaMuted("audio");
    }

    get isVideoMuted() {
        return this.isMediaMuted("video");
    }

    txGameData(toUserID, data) {
        this.conference.sendMessage(data, toUserID);
    }

    /// A listener to add to JitsiExternalAPI::endpointTextMessageReceived event
    /// to receive Calla messages from the Jitsi Meet data channel.
    rxGameData(evt) {
        if (evt.data.hax === this.appFingerPrint) {
            this.receiveMessageFrom(evt.user.getId(), evt.data.command, evt.data.value);
        }
    }

    /// Send a Calla message through the Jitsi Meet data channel.
    sendMessageTo(toUserID, command, value) {
        this.txGameData(toUserID, {
            hax: this.appFingerPrint,
            command,
            value
        });
    }

    receiveMessageFrom(fromUserID, command, value) {
        const evt = new CallaClientEvent(command, fromUserID, value);
        this.dispatchEvent(evt);
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     */
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        this.audio.setAudioProperties(minDistance, maxDistance, rolloff, transitionTime);
    }

    /**
     * Set the position of the listener.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} z - the lateral component of the position.
     */
    setLocalPosition(x, y, z) {
        this.audio.setUserPosition(this.localUserID, x, y, z);
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "userMoved", { x, y, z });
        }
    }

    /**
     * Set the position of the listener.
     * @param {number} fx - the horizontal component of the forward vector.
     * @param {number} fy - the vertical component of the forward vector.
     * @param {number} fz - the lateral component of the forward vector.
     * @param {number} ux - the horizontal component of the up vector.
     * @param {number} uy - the vertical component of the up vector.
     * @param {number} uz - the lateral component of the up vector.
     */
    setLocalOrientation(fx, fy, fz, ux, uy, uz) {
        this.audio.setUserOrientation(this.localUserID, fx, fy, fz, ux, uy, uz);
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "userTurned", { x, y, z });
        }
    }

    /**
     * Set the position of the listener.
     * @param {number} px - the horizontal component of the position.
     * @param {number} py - the vertical component of the position.
     * @param {number} pz - the lateral component of the position.
     * @param {number} fx - the horizontal component of the forward vector.
     * @param {number} fy - the vertical component of the forward vector.
     * @param {number} fz - the lateral component of the forward vector.
     * @param {number} ux - the horizontal component of the up vector.
     * @param {number} uy - the vertical component of the up vector.
     * @param {number} uz - the lateral component of the up vector.
     */
    setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz);
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "userPosed", { px, py, pz, fx, fy, fz, ux, uy, uz });
        }
    }

    removeUser(id) {
        this.audio.removeUser(id);
    }

    /**
     *
     * @param {boolean} muted
     */
    async setAudioMutedAsync(muted) {
        let isMuted = this.isAudioMuted;
        if (muted !== isMuted) {
            isMuted = await this.toggleAudioMutedAsync();
        }
        return isMuted;
    }

    /**
     *
     * @param {boolean} muted
     */
    async setVideoMutedAsync(muted) {
        let isMuted = this.isVideoMuted;
        if (muted !== isMuted) {
            isMuted = await this.toggleVideoMutedAsync();
        }
        return isMuted;
    }

    /// Add a listener for Calla events that come through the Jitsi Meet data channel.
    /**
     * 
     * @param {string} evtName
     * @param {function} callback
     * @param {AddEventListenerOptions} opts
     */
    addEventListener(evtName, callback, opts) {
        if (eventNames.indexOf(evtName) === -1) {
            throw new Error(`Unsupported event type: ${evtName}`);
        }

        super.addEventListener(evtName, callback, opts);
    }

    /**
     * 
     * @param {string} toUserID
     */
    userInitRequest(toUserID) {
        this.sendMessageTo(toUserID, "userInitRequest");
    }

    /**
     * 
     * @param {string} toUserID
     */
    async userInitRequestAsync(toUserID) {
        return await until(this, "userInitResponse",
            () => this.userInitRequest(toUserID),
            (evt) => evt.id === toUserID
                && isGoodNumber(evt.px)
                && isGoodNumber(evt.py)
                && isGoodNumber(evt.pz),
            1000);
    }

    /**
     * @param {string} toUserID
     * @param {import("../game/User").User} fromUserState
     */
    userInitResponse(toUserID, fromUserState) {
        this.sendMessageTo(toUserID, "userInitResponse", fromUserState);
    }

    /**
     * @param {import("../emoji/Emoji").Emoji} emoji
     **/
    set avatarEmoji(emoji) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "setAvatarEmoji", emoji);
        }
    }

    /**
     * @param {string} url
     **/
    set avatarURL(url) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "avatarChanged", { url });
        }
    }

    /**
     * @param {import("../emoji/Emoji").Emoji} emoji
     **/
    emote(emoji) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "emote", emoji);
        }
    }

    startAudio() {
        this.audio.start();
    }
}