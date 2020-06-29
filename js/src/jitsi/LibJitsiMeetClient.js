import '../../lib/jquery.js';
import { tag } from "../html/tag.js";
import { Span } from "../html/tags.js";
import { BaseJitsiClient } from "./BaseJitsiClient.js";
import { AudioManager as AudioClient } from '../audio/AudioManager.js';
import { id, autoPlay, srcObject, muted } from '../html/attrs.js';

const selfs = new Map();


function logger(source, evtName) {
    const handler = (...rest) => {
        console.log(evtName, ...rest);
    };

    source.addEventListener(evtName, handler);
}

function setLoggers(source, evtObj) {
    for (let evtName of Object.values(evtObj)) {
        logger(source, evtName);
    }
}

// Manages communication between Jitsi Meet and Calla
export class LibJitsiMeetClient extends BaseJitsiClient {

    constructor() {
        super();
        const self = Object.seal({
            connection: null,
            room: null,
            audioInput: null,
            videoInput: null,
            trackContainers: new Map()
        });
        this._connection = { value: null };
        this._room = { value: null };
        this.audioClient = new AudioClient();

        selfs.set(this, self);
        Object.seal(this);
    }


    get connection() {
        return selfs.get(this).connection;
    }

    set connection(value) {
        selfs.get(this).connection = value;
    }

    get conference() {
        return selfs.get(this).room;
    }

    set conference(value) {
        return selfs.get(this).room = value;
    }

    async initializeAsync(host, roomName, userName) {
        roomName = roomName.toLocaleLowerCase();

        await import(`https://${host}/libs/lib-jitsi-meet.min.js`);

        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
        JitsiMeetJS.init();

        this.connection = new JitsiMeetJS.JitsiConnection(null, null, {
            hosts: {
                domain: host,
                muc: `conference.${host}`
            },
            serviceUrl: `https://${host}/http-bind`,
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
                ENDPOINT_MESSAGE_RECEIVED,
                DATA_CHANNEL_OPENED
            } = JitsiMeetJS.events.conference;

            setLoggers(this.conference, JitsiMeetJS.events.conference);

            this.conference.addEventListener(CONFERENCE_JOINED, async () => {
                const id = this.conference.myUserId();

                const tracks = await JitsiMeetJS.createLocalTracks({ devices: ["audio"] });
                for (let track of tracks) {
                    this.addTrack(id, track);
                }

                const evt = Object.assign(
                    new Event("videoConferenceJoined"), {
                    id,
                    roomName,
                    displayName: userName
                });

                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(CONFERENCE_LEFT, () => {
                const evt = Object.assign(
                    new Event("videoConferenceLeft"), {
                    roomName
                });

                this.dispatchEvent(evt);
            });


            let userJoinedEvent = null,
                dataChannelOpen = false;

            const checkUser = () => {
                if (!!userJoinedEvent && dataChannelOpen) {
                    this.dispatchEvent(userJoinedEvent);
                }
            };

            this.conference.addEventListener(USER_JOINED, (id, user) => {
                userJoinedEvent = Object.assign(
                    new Event("participantJoined"), {
                    id,
                    displayName: user.getDisplayName()
                });
                checkUser();
            });

            this.conference.addEventListener(DATA_CHANNEL_OPENED, () => {
                dataChannelOpen = true;
                checkUser();
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

                this.displayName(evt);
            });

            this.conference.addEventListener(TRACK_ADDED, (track) => {
                if (!track.isLocal()) {
                    this.addTrack(track.getParticipantId(), track);
                }
            });

            this.conference.addEventListener(TRACK_REMOVED, (track) =>
                this.removeTrack(track));

            this.conference.addEventListener(ENDPOINT_MESSAGE_RECEIVED, (user, data) =>
                this.rxGameData({ user, data }));


            addEventListener("unload", () =>
                this.leaveAsync());

            this.conference.join();
        };

        const onFailed = () => {
        };

        const onDisconnect = () => {
            this.connection.removeEventListener(CONNECTION_ESTABLISHED, onConnect);
            this.connection.removeEventListener(CONNECTION_FAILED, onFailed);
            this.connection.removeEventListener(CONNECTION_DISCONNECTED, onDisconnect);
        };

        this.connection.addEventListener(CONNECTION_ESTABLISHED, onConnect);
        this.connection.addEventListener(CONNECTION_DISCONNECTED, onFailed);
        this.connection.addEventListener(CONNECTION_DISCONNECTED, onDisconnect);

        setLoggers(JitsiMeetJS.mediaDevices, JitsiMeetJS.events.mediaDevices);

        this.connection.connect();
    }

    removeTrack(track) {
        const self = selfs.get(this),
            container = self.trackContainers.get(track);
        document.body.removeChild(container);
        self.trackContainers.delete(track);
    }

    addTrack(userID, track) {
        const self = selfs.get(this),
            containerID = `participant_${userID}`,
            isLocal = track.isLocal(),
            trackPrefix = isLocal ? "local" : "remote",
            trackKind = track.getType(),
            trackType = trackKind.firstLetterToUpper(),
            trackID = track.getId(),
            trackElementID = `${trackPrefix}${trackType}_${trackID}`;

        setLoggers(track, JitsiMeetJS.events.track);

        console.log(track, "is", trackType);

        track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, (track) => {
            const evtName = track.type + "MuteStatusChanged",
                id = track.getParticipantId(),
                muted = track.isMuted(),
                evt = Object.assign(
                    new Event(evtName), {
                    id,
                    muted
                });

            this.dispatchEvent(evt);
        });

        let container = document.getElementById(containerID);
        if (container === null) {
            container = Span(id(containerID));
            document.body.appendChild(container);
        }

        let elem = document.getElementById(trackElementID);
        if (elem !== null) {
            container.removeChild(elem);
        }

        elem = tag(trackType,
            id(trackElementID),
            autoPlay,
            srcObject(track.stream),
            muted(isLocal));

        container.appendChild(elem);

        self.trackContainers.set(track, container);
        if (isLocal) {
            self[trackKind + "Input"] = track;
            this.conference.addTrack(track);
        }
    }

    txGameData(toUserID, data) {
        this.conference.sendMessage(data, toUserID);
    }

    /// A listener to add to JitsiExternalAPI::endpointTextMessageReceived event
    /// to receive Calla messages from the Jitsi Meet data channel.
    rxGameData(evt) {
        if (evt.data.hax === APP_FINGERPRINT) {
            console.log("RX GAME DATA", evt.user, evt.data);
            this.receiveMessageFrom(user.getId(), evt.data);
        }
    }

    async leaveAsync() {
        if (!!this.conference) {
            const leaveTask = this.once("videoConferenceLeft");
            this.conference.leave();
            await leaveTask;
        }
    }

    async getAvailableDevicesAsync() {
        const devices = await new Promise((resolve, reject) => {
            try {
                JitsiMeetJS.mediaDevices.enumerateDevices(resolve);
            }
            catch (exp) {
                reject(exp);
            }
        });

        console.log("DEVICES", devices);

        return {
            audioOutput: devices.filter(d => d.kind === "audiooutput"),
            audioInput: devices.filter(d => d.kind === "audioinput"),
            videoInput: devices.filter(d => d.kind === "videoinput")
        };
    }

    async getAudioOutputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.audioOutput || [];
    }

    async getCurrentAudioOutputDeviceAsync() {
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

    setAudioOutputDevice(device) {
        JitsiMeetJS.mediaDevices.setAudioOutputDevice(device.deviceId);
    }

    async getAudioInputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.audioInput || [];
    }

    async getCurrentAudioInputDeviceAsync() {
        const cur = selfs.get(this).audioInput,
            devices = await this.getAudioInputDevicesAsync(),
            device = devices.filter((d) => cur !== null && d.deviceId === cur.deviceId);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    async setAudioInputDeviceAsync(device) {
        const self = selfs.get(this),
            cur = self.audioInput;
        if (cur) {
            this.conference.removeTrack(cur);
        }

        const next = await JitsiMeetJS.createLocalTracks({
            devices: ["audio"],
            micDeviceId: device.deviceId
        });

        this.addTrack(this.localUser, next[0]);
    }

    async getVideoInputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.videoInput || [];
    }

    async getCurrentVideoInputDeviceAsync() {
        const cur = selfs.get(this).videoInput,
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
        const self = selfs.get(this),
            cur = self.videoInput;
        if (cur) {
            this.removeTrack(cur);
        }

        const next = await JitsiMeetJS.createLocalTracks({
            devices: ["video"],
            cameraDeviceId: device.deviceId
        });

        this.addTrack(this.localUser, next[0]);
    }

    setDisplayName(userName) {
        this.conference.setDisplayName(userName);
    }

    async toggleAudioAsync() {
        const changeTask = this.once("localAudioMuteStatusChanged");
        const cur = selfs.get(this).audioInput;
        if (cur) {
            const muted = cur.isMuted();
            if (muted) {
                await cur.unmute();
            }
            else {
                await cur.mute();
            }
        }
        return await changeTask;
    }

    async toggleVideoAsync() {
        const changeTask = this.once("localVideoMuteStatusChanged");
        const cur = selfs.get(this).videoInput;
        if (cur) {
            const muted = cur.isMuted();
            if (muted) {
                await cur.unmute();
            }
            else {
                await cur.mute();
            }
        }
        return await changeTask;
    }

    setAvatarURL(url) {
        throw new Error("Not implemented in base class");
    }

    async isAudioMutedAsync() {
        const cur = selfs.get(this).audioInput;
        return cur && cur.isMuted();
    }

    async isVideoMutedAsync() {
        const cur = selfs.get(this).videoInput;
        return cur && cur.isMuted();
    }
}