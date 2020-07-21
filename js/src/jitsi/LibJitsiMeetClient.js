/* global JitsiMeetJS */

import { AudioActivityEvent } from "../audio/AudioActivityEvent.js";
import { AudioManager as AudioClient } from "../audio/AudioManager.js";
import { canChangeAudioOutput } from "../audio/canChangeAudioOutput.js";
import { BaseJitsiClient } from "./BaseJitsiClient.js";
import { JITSI_HOST, JVB_HOST, JVB_MUC } from "/constants.js";

/**
 * @typedef {object} JitsiTrack
 * @property {Function} getParticipantId
 * @property {Function} getType
 * @property {Function} isMuted
 * @property {Function} isLocal
 * @property {Function} addEventListener
 * @property {Function} dispose
 * @property {MediaStream} stream
 **/

/** @type {Map<string, Map<string, JitsiTrack>>} */
const userInputs = new Map();

const audioActivityEvt = new AudioActivityEvent();


function logger(source, evtName) {
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

    if (window.location.hostname === "localhost") {
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
export class LibJitsiMeetClient extends BaseJitsiClient {

    constructor() {
        super();
        this.connection = null;
        this.conference = null;
        this.audioClient = new AudioClient();
        this.audioClient.addEventListener("audioActivity", (evt) => {
            audioActivityEvt.id = evt.id;
            audioActivityEvt.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt);
        });

        Object.seal(this);
    }

    async initializeAsync(roomName, userName) {
        await import(`${window.location.origin}/lib/jquery.min.js`);
        await import(`https://${JITSI_HOST}/libs/lib-jitsi-meet.min.js`);

        roomName = roomName.toLocaleLowerCase();

        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
        JitsiMeetJS.init();

        this.connection = new JitsiMeetJS.JitsiConnection(null, null, {
            hosts: {
                domain: JVB_HOST,
                muc: JVB_MUC
            },
            serviceUrl: `https://${JITSI_HOST}/http-bind`,
            enableLipSync: true
        });

        const {
            CONNECTION_ESTABLISHED,
            CONNECTION_FAILED,
            CONNECTION_DISCONNECTED
        } = JitsiMeetJS.events.connection;

        setLoggers(this.connection, JitsiMeetJS.events.connection);

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
                ENDPOINT_MESSAGE_RECEIVED
            } = JitsiMeetJS.events.conference;

            setLoggers(this.conference, JitsiMeetJS.events.conference);

            this.conference.addEventListener(CONFERENCE_JOINED, async () => {
                const id = this.conference.myUserId();

                this.dispatchEvent(Object.assign(
                    new Event("videoConferenceJoined"), {
                    id,
                    roomName,
                    displayName: userName
                }));
            });

            this.conference.addEventListener(CONFERENCE_LEFT, () => {
                this.dispatchEvent(Object.assign(
                    new Event("videoConferenceLeft"), {
                    roomName
                }));
            });

            const onTrackMuteChanged = (track, muted) => {
                const userID = track.getParticipantId() || this.localUser,
                    trackKind = track.getType(),
                    muteChangedEvtName = trackKind + "MuteStatusChanged",
                    evt = Object.assign(
                        new Event(muteChangedEvtName), {
                        id: userID,
                        muted
                    });

                this.dispatchEvent(evt);
            },

                onTrackChanged = (track) => {
                    onTrackMuteChanged(track, track.isMuted());
                };

            this.conference.addEventListener(USER_JOINED, (id, user) => {
                const evt = Object.assign(
                    new Event("participantJoined"), {
                    id,
                    displayName: user.getDisplayName()
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
                const userID = track.getParticipantId() || this.localUser,
                    isLocal = track.isLocal(),
                    trackKind = track.getType(),
                    trackType = trackKind.firstLetterToUpper();

                setLoggers(track, JitsiMeetJS.events.track);

                track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, onTrackChanged);

                if (!userInputs.has(userID)) {
                    userInputs.set(userID, new Map());
                }

                const inputs = userInputs.get(userID);
                if (inputs.has(trackKind)) {
                    inputs.get(trackKind).dispose();
                    inputs.delete(trackKind);
                }

                inputs.set(trackKind, track);

                if (!isLocal && trackKind === "audio") {
                    this.audioClient.createSource(userID, track.stream);
                }

                this.dispatchEvent(Object.assign(new Event(trackKind + "Added"), {
                    id: userID,
                    stream: track.stream
                }));

                onTrackMuteChanged(track, false);
            });

            this.conference.addEventListener(TRACK_REMOVED, (track) => {

                const userID = track.getParticipantId() || this.localUser,
                    isLocal = track.isLocal(),
                    trackKind = track.getType();

                if (userInputs.has(userID)) {
                    const inputs = userInputs.get(userID);
                    if (inputs.has(trackKind)) {
                        inputs.get(trackKind).dispose();
                        inputs.delete(trackKind);
                    }
                }

                if (!isLocal && trackKind === "audio") {
                    this.audioClient.removeSource(userID);
                }

                track.dispose();

                onTrackMuteChanged(track, true);

                this.dispatchEvent(Object.assign(new Event(trackKind + "Removed"), {
                    id: userID
                }));
            });

            this.conference.addEventListener(ENDPOINT_MESSAGE_RECEIVED, (user, data) => {
                this.rxGameData({ user, data });
            });

            this.conference.join();
        };

        const onFailed = (evt) => {
            console.error("Connection failed", evt);
            onDisconnect();
        };

        const onDisconnect = () => {
            this.connection.removeEventListener(CONNECTION_ESTABLISHED, onConnect);
            this.connection.removeEventListener(CONNECTION_FAILED, onFailed);
            this.connection.removeEventListener(CONNECTION_DISCONNECTED, onDisconnect);
        };

        this.connection.addEventListener(CONNECTION_ESTABLISHED, onConnect);
        this.connection.addEventListener(CONNECTION_FAILED, onFailed);
        this.connection.addEventListener(CONNECTION_DISCONNECTED, onDisconnect);

        setLoggers(JitsiMeetJS.mediaDevices, JitsiMeetJS.events.mediaDevices);

        this.connection.connect();
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

    leave() {
        if (this.conference) {
            if (this.localUser !== null && userInputs.has(this.localUser)) {
                const inputs = userInputs.get(this.localUser);
                if (inputs.has("audio")) {
                    this.conference.removeTrack(inputs.get("audio"));
                }

                if (inputs.has("video")) {
                    this.conference.removeTrack(inputs.get("video"));
                }
            }

            const leaveTask = this.conference.leave();
            leaveTask.then(() => {
                    this.connection.disconnect();
                    this.connection = null;
                });
            return leaveTask;
        }
    }

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

    async setAudioOutputDeviceAsync(device) {
        if (!canChangeAudioOutput) {
            return;
        }
        await super.setAudioOutputDeviceAsync(device);
        this.audioClient.setAudioOutputDevice(this.preferredAudioOutputID);
        await JitsiMeetJS.mediaDevices.setAudioOutputDevice(this.preferredAudioOutputID);
    }

    getCurrentMediaTrack(type) {
        if (this.localUser === null) {
            return null;
        }

        if (!userInputs.has(this.localUser)){
            return null;
        }

        const inputs = userInputs.get(this.localUser);
        if (!inputs.has(type)) {
            return null;
        }

        return inputs.get(type);
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

    taskOf(evt) {
        return this.when(evt, (evt) => evt.id === this.localUser, 5000);
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

    async setAudioInputDeviceAsync(device) {
        await super.setAudioInputDeviceAsync(device);

        const cur = this.getCurrentMediaTrack("audio");
        if (cur) {
            const removeTask = this.taskOf("audioRemoved");
            this.conference.removeTrack(cur);
            await removeTask;
        }

        if (this.preferredAudioInputID) {
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

    async setVideoInputDeviceAsync(device) {
        await super.setVideoInputDeviceAsync(device);

        const cur = this.getCurrentMediaTrack("video");
        if (cur) {
            const removeTask = this.taskOf("videoRemoved");
            this.conference.removeTrack(cur);
            await removeTask;
        }

        if (this.preferredVideoInputID) {
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

    setDisplayName(userName) {
        this.conference.setDisplayName(userName);
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

    startAudio() {
        this.audioClient.start();
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
}
