import { tag } from "../html/tag.js";
import { Span } from "../html/tags.js";
import { BaseJitsiClient } from "./BaseJitsiClient.js";
import { AudioManager as AudioClient } from '../audio/AudioManager.js';
import { id, autoPlay, srcObject, muted } from '../html/attrs.js';

const selfs = new Map(),
    audioActivityEvt = Object.assign(new Event("audioActivity"), {
        id: null,
        isActive: false
    });


function logger(source, evtName) {
    const handler = (...rest) => {
        if (evtName === "conference.endpoint_message_received"
            && rest[1].type === "e2e-ping-request") {
            return;
        }
        console.log(evtName, ...rest);
    };

    source.addEventListener(evtName, handler);
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
        const self = Object.seal({
            connection: null,
            conference: null,

            /** @type {HTMLAudioElement} */
            audioInput: null,

            /** @type {HTMLVideoElement} */
            videoInput: null,

            /** @type {Map.<MediaStreamTrack, Element>} */
            trackElements: new Map()
        });

        this.audioClient = new AudioClient();
        this.audioClient.addEventListener("audioActivity", (evt) => {
            audioActivityEvt.id = evt.id;
            audioActivityEvt.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt);
        });

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
        return selfs.get(this).conference;
    }

    set conference(value) {
        return selfs.get(this).conference = value;
    }

    async initializeAsync(host, roomName, userName) {
        await import(`//${window.location.host}/lib/jquery.min.js`);
        await import(`https://${host}/libs/lib-jitsi-meet.min.js`);
        const self = selfs.get(this);

        roomName = roomName.toLocaleLowerCase();

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

                this.dispatchEvent(Object.assign(
                    new Event("videoConferenceJoined"), {
                    id,
                    roomName,
                    displayName: userName
                }));

                const tracks = await JitsiMeetJS.createLocalTracks({ devices: ["audio"] });
                for (let track of tracks) {
                    this.conference.addTrack(track);
                }
            });

            this.conference.addEventListener(CONFERENCE_LEFT, () => {
                this.dispatchEvent(Object.assign(
                    new Event("videoConferenceLeft"), {
                    roomName
                }));
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

                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(TRACK_ADDED, (track) => {
                const userID = track.getParticipantId(),
                    containerID = `participant_${userID}`,
                    isLocal = track.isLocal(),
                    trackPrefix = isLocal ? "local" : "remote",
                    trackKind = track.getType(),
                    trackType = trackKind.firstLetterToUpper(),
                    trackID = track.getId(),
                    trackElementID = `${trackPrefix}${trackType}_${trackID}`;

                setLoggers(track, JitsiMeetJS.events.track);

                track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, (track) => {
                    const evtName = trackKind + "MuteStatusChanged",
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
                    this.element.appendChild(container);
                }

                let elem = document.getElementById(trackElementID);
                if (elem !== null) {
                    container.removeChild(elem);
                }

                elem = tag(trackType,
                    id(trackElementID),
                    autoPlay,
                    muted,
                    srcObject(track.stream));

                container.appendChild(elem);

                self.trackElements.set(track, elem);
                if (isLocal) {
                    self[trackKind + "Input"] = track;
                }

                this.dispatchEvent(Object.assign(new Event(trackKind + "Added"), {
                    id: userID,
                    element: elem
                }));
            });

            this.conference.addEventListener(TRACK_REMOVED, (track) => {

                console.log("REMOVE TRACK", track);

                if (self.trackElements.has(track)) {
                    const element = self.trackElements.get(track),
                        container = element.parentElement,
                        trackKind = track.getType(),
                        field = trackKind + "Input";

                    container.removeChild(element);
                    if (container.childElementCount === 0) {
                        this.element.removeChild(container);
                    }
                    self.trackElements.delete(track);

                    if (self[field] === track) {
                        self[field] = null;
                    }
                }
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
        if (evt.data.hax === APP_FINGERPRINT) {
            this.receiveMessageFrom(evt.user.getId(), evt.data.command, evt.data.value);
        }
    }

    leave() {
        if (this.conference) {
            const leaveTask = this.conference.leave();
            leaveTask
                .then(() => this.connection.disconnect());
            return leaveTask;
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

        const tracks = await JitsiMeetJS.createLocalTracks({
            devices: ["audio"],
            micDeviceId: device.deviceId
        });

        for (let track of tracks) {
            this.conference.addTrack(track);
        }
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
            this.conference.removeTrack(cur);
        }

        const tracks = await JitsiMeetJS.createLocalTracks({
            devices: ["video"],
            cameraDeviceId: device.deviceId
        });

        for (let track of tracks) {
            this.conference.addTrack(track);
        }
    }

    setDisplayName(userName) {
        this.conference.setDisplayName(userName);
    }

    async toggleAudioAsync() {
        const changeTask = this.once("localAudioMuteStatusChanged", 5000);
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
        else {
            const avail = await this.getAudioInputDevicesAsync();
            if (avail.length === 0) {
                throw new Error("No audio input devices available");
            }
            else {
                await this.setAudioInputDeviceAsync(avail[0]);
                this.dispatchEvent(Object.assign(
                    new Event("audioMuteStatusChanged"),
                    { muted: false }));
            }
        }
        return await changeTask;
    }

    async toggleVideoAsync() {
        const changeTask = this.once("localVideoMuteStatusChanged", 5000);
        const cur = selfs.get(this).videoInput;
        if (cur) {
            this.conference.removeTrack(cur);
            this.dispatchEvent(Object.assign(
                new Event("videoMuteStatusChanged"),
                { muted: true }));
        }
        else {
            const avail = await this.getVideoInputDevicesAsync();
            if (avail.length === 0) {
                throw new Error("No video input devices available");
            }
            else {
                await this.setVideoInputDeviceAsync(avail[0]);
                this.dispatchEvent(Object.assign(
                    new Event("videoMuteStatusChanged"),
                    { muted: false }));
            }
        }
        return await changeTask;
    }

    setAvatarURL(url) {
        throw new Error("Not implemented in base class");
    }

    async isAudioMutedAsync() {
        const cur = selfs.get(this).audioInput;
        if (cur === null) {
            return true;
        }
        else {
            return cur.isMuted();
        }
    }

    async isVideoMutedAsync() {
        const cur = selfs.get(this).videoInput;
        if (cur === null) {
            return true;
        }
        else {
            return cur.isMuted();
        }
    }

    startAudio() {
        this.audioClient.start();
    }
}