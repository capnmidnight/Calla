import '../../lib/jquery.js';
import { tag } from "../html/tag.js";
import { Span } from "../html/tags.js";
import { BaseJitsiClient } from "./BaseJitsiClient.js";
import { AudioManager as AudioClient } from '../audio/AudioManager.js';

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
            videoInput: null
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

    async joinAsync(host, roomName, userName) {
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

            this.conference.addEventListener(CONFERENCE_JOINED, () => {
                const id = this.conference.myUserId();

                for (let track of tracks) {
                    this.addTrack(id, track);
                }

                const evt = Object.assign(
                    new Event("videoConferenceJoined"), {
                    id: id,
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
                this.leave());

            this.conference.join();
            this.conference.setDisplayName(userName);
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

        const tracks = await JitsiMeetJS.createLocalTracks({ devices: ["audio"] });
    }

    removeTrack(track) {
        const trackPrefix = track.isLocal() ? "local" : "remote",
            trackId = track.getId();

        let trackType = track.getType();
        trackType = trackType[0].toLocaleUpperCase()
            + trackType.substring(1);

        const trackID = `${trackPrefix}${trackType}_${trackId}`,
            elem = document.getElementById(trackID);
        if (elem !== null) {
            const container = elem.parentElement;
            container.removeChild(elem);
            if (container.childElementCount === 0) {
                container.parentElement.removeChild(container);
            }
        }
    }

    addTrack(id, track) {

        selfs.get(this)[track.track.kind + "Input"] = track.track.label;

        const containerID = `participant_${id}`,
            trackPrefix = track.isLocal() ? "local" : "remote",
            trackId = track.getId(),
            {
                TRACK_MUTE_CHANGED
            } = JitsiMeetJS.events.track;

        setLoggers(track, JitsiMeetJS.events.track);

        let trackType = track.getType();
        trackType = trackType[0].toLocaleUpperCase()
            + trackType.substring(1);

        const trackID = `${trackPrefix}${trackType}_${trackId}`;

        console.log(track, "is", trackType);

        track.addEventListener(TRACK_MUTE_CHANGED, (track) => {
            const evtName = track.type + "MuteStatusChanged",
                id = track.getParticipantId(),
                muted = track.muted,
                evt = Object.assign(
                    new Event(evtName), {
                    id,
                    muted
                });

            this.dispatch(evt);
        });

        let container = document.getElementById(containerID);
        if (container === null) {
            container = Span({ id: containerID });
            document.body.appendChild(container);
        }

        let elem = document.getElementById(trackID);
        if (elem !== null) {
            container.removeChild(elem);
        }

        elem = tag(trackType, {
            id: trackID,
            autoplay: true,
            srcObject: track.stream,
            muted: track.isLocal()
        });

        container.appendChild(elem);

        if (track.isLocal()) {
            this.conference.addTrack(track);
            elem.muted = true;
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

    leave() {
        if (!!this.conference) {
            this.conference.leave();
        }
    }

    async getAvailableDevices() {
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

    async getAudioOutputDevices() {
        const devices = await this.getAvailableDevices();
        return devices && devices.audioOutput || [];
    }

    async getCurrentAudioOutputDevice() {
        return JitsiMeetJS.mediaDevices.getAudioOutputDevice();
    }

    setAudioOutputDevice(device) {
        JitsiMeetJS.mediaDevices.setAudiouOutputDevice(device);
    }

    async getAudioInputDevices() {
        const devices = await this.getAvailableDevices();
        return devices && devices.audioInput || [];
    }

    async getCurrentAudioInputDevice() {
        const label = selfs.get(this).audioInput,
            devices = await this.getAudioInputDevices(),
            device = devices.filter((d) => d.label === label);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    setAudioInputDevice(device) {
        throw new Error("Not implemented in base class");
    }

    async getVideoInputDevices() {
        const devices = await this.getAvailableDevices();
        return devices && devices.videoInput || [];
    }

    async getCurrentVideoInputDevice() {
        return selfs.get(this).videoInput;
    }

    setVideoInputDevice(device) {
        throw new Error("Not implemented in base class");
    }

    setDisplayName(userName) {
        throw new Error("Not implemented in base class");
    }

    toggleAudio() {
        throw new Error("Not implemented in base class");
    }

    toggleVideo() {
        throw new Error("Not implemented in base class");
    }

    setAvatarURL(url) {
        throw new Error("Not implemented in base class");
    }

    async isAudioMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    async isVideoMutedAsync() {
        throw new Error("Not implemented in base class");
    }
}