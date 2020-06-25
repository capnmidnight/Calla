import '../../lib/jquery.js';
import { tag } from "../html/tag.js";
import { Span } from "../html/tags.js";
import { CallaUserEvent } from '../events.js';
import { AudioManager } from '../audio/AudioManager.js';



// helps us filter out data channel messages that don't belong to us
const APP_FINGERPRINT = "Calla",
    eventNames = [
        "audioMuteStatusChanged",
        "videoMuteStatusChanged",
        "localAudioMuteStatusChanged",
        "localVideoMuteStatusChanged",
        "remoteAudioMuteStatusChanged",
        "removeVideoMuteStatusChanged",
        "videoConferenceJoined",
        "videoConferenceLeft",
        "participantJoined",
        "participantLeft",
        "displayNameChange",
        "audioActivity",
        "moveTo",
        "emote",
        "userInitRequest",
        "userInitResponse",
        "avatarChanged"
    ];



// Manages communication between Jitsi Meet and Calla
export class LibJitsiMeetClient extends EventTarget {

    constructor() {
        super();
        this._connection = { value: null };
        this._room = { value: null };
        this.updater = this._updater.bind(this);
        this.audioClient = new AudioManager();
        Object.freeze(this);
    }


    get connection() {
        return this._connection.value;
    }

    set connection(value) {
        this._connection.value = value;
    }

    get room() {
        return this._room.value;
    }

    set room(value) {
        this._room.value = value;
    }


    /// Send a Calla message through the Jitsi Meet data channel.
    txGameData(id, command, value) {
        const evt = {
            hax: APP_FINGERPRINT,
            command,
            value
        };
        this.room.sendMessage(evt, id);
    }

    /// A listener to add to JitsiExternalAPI::endpointTextMessageReceived event
    /// to receive Calla messages from the Jitsi Meet data channel.
    rxGameData(user, data) {
        if (data.hax === APP_FINGERPRINT) {
            console.log("RX GAME DATA", user, data);
            const evt = new CallaUserEvent(user.getId(), data);
            this.dispatchEvent(evt);
        }
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

        const onConnect = () => {
            this.room = this.connection.initJitsiConference(roomName, {
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
                AVATAR_CHANGED,
                ENDPOINT_MESSAGE_RECEIVED,
                DATA_CHANNEL_OPENED,
            } = JitsiMeetJS.events.conference;

            this.room.addEventListener(CONFERENCE_JOINED, () => {
                const id = this.room.myUserId();

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

            this.room.addEventListener(CONFERENCE_LEFT, () => {
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

            this.room.addEventListener(USER_JOINED, (id, user) => {
                userJoinedEvent = Object.assign(
                    new Event("participantJoined"), {
                    id,
                    displayName: user.getDisplayName()
                });
                checkUser();
            });

            this.room.addEventListener(DATA_CHANNEL_OPENED, () => {
                dataChannelOpen = true;
                checkUser();
            });

            this.room.addEventListener(USER_LEFT, (id) => {
                const evt = Object.assign(
                    new Event("participantLeft"), {
                    id
                });

                this.dispatchEvent(evt);
            });

            // TODO lib-jitsi-meet doesn't currently call AVATAR_CHANGED
            logger(this.room, AVATAR_CHANGED);

            this.room.addEventListener(DISPLAY_NAME_CHANGED, (id, displayName) => {
                const evt = Object.assign(
                    new Event("displayNameChange"), {
                    id,
                    displayName
                });

                this.displayName(evt);
            });

            this.room.addEventListener(TRACK_ADDED, (track) => {
                if (!track.isLocal()) {
                    this.addTrack(track.getParticipantId(), track);
                }
            });

            this.room.addEventListener(TRACK_REMOVED, (track) =>
                this.removeTrack(track));

            this.room.addEventListener(ENDPOINT_MESSAGE_RECEIVED, (user, data) =>
                this.rxGameData(user, data));


            addEventListener("unload", () =>
                this.leave());

            this.room.join();
            this.room.setDisplayName(userName);
        };

        this.connection.addEventListener(CONNECTION_ESTABLISHED, onConnect);

        const onFailed = logger(this.connection, CONNECTION_FAILED);
        const onDisconnect = logger(this.connection, CONNECTION_DISCONNECTED, () => {
            this.connection.removeEventListener(CONNECTION_ESTABLISHED, onConnect);
            this.connection.removeEventListener(CONNECTION_FAILED, onFailed);
            this.connection.removeEventListener(CONNECTION_DISCONNECTED, onDisconnect);
        });

        const {
            DEVICE_LIST_CHANGED
        } = JitsiMeetJS.events.mediaDevices;

        logger(JitsiMeetJS.mediaDevices, DEVICE_LIST_CHANGED);

        this.connection.connect();

        const tracks = await JitsiMeetJS.createLocalTracks({ devices: ["audio"] });
    }

    audioActivity(id, isActive) {
        const evt = Object.assign(new Event("audioActivity"), {
            id: id,
            isActive
        });

        this.dispatchEvent(evt);
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
        const containerID = `participant_${id}`,
            trackPrefix = track.isLocal() ? "local" : "remote",
            trackId = track.getId(),
            {
                TRACK_AUDIO_LEVEL_CHANGED,
                TRACK_MUTE_CHANGED,
                LOCAL_TRACK_STOPPED,
                TRACK_AUDIO_OUTPUT_CHANGED
            } = JitsiMeetJS.events.track;

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

        //logger(track, TRACK_AUDIO_LEVEL_CHANGED);
        logger(track, TRACK_AUDIO_OUTPUT_CHANGED);
        logger(track, LOCAL_TRACK_STOPPED);

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
            this.room.addTrack(track);
            elem.muted = true;
        }
    }

    leave() {
        if (!!this.room) {
            this.room.leave();
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
        const devices = await this.getCurrentDevices();
        return devices && devices.audioOutput || null;
    }

    setAudioOutputDevice(device) {
        this.api.setAudioOutputDevice(device.label, device.id);
    }

    async getAudioInputDevices() {
        const devices = await this.getAvailableDevices();
        return devices && devices.audioInput || [];
    }

    async getCurrentAudioInputDevice() {
        const devices = await this.getCurrentDevices();
        return devices && devices.audioInput || null;
    }

    setAudioInputDevice(device) {
        this.api.setAudioInputDevice(device.label, device.id);
    }

    async getVideoInputDevices() {
        const devices = await this.getAvailableDevices();
        return devices && devices.videoInput || [];
    }

    async getCurrentVideoInputDevice() {
        const devices = await this.getCurrentDevices();
        return devices && devices.videoInput || null;
    }

    setVideoInputDevice(device) {
        this.api.setVideoInputDevice(device.label, device.id);
    }

    toggleAudio() {
        this.api.executeCommand("toggleAudio");
    }

    toggleVideo() {
        this.api.executeCommand("toggleVideo");
    }

    setAvatarURL(url) {
        this.api.executeCommand("avatarUrl", url);
    }

    async isAudioMutedAsync() {
        return await this.api.isAudioMuted();
    }

    async setAudioMutedAsync(muted) {
        const isMuted = await this.isAudioMutedAsync();
        if (muted !== isMuted) {
            this.toggleAudio();
        }
    }

    async isVideoMutedAsync() {
        return await this.api.isVideoMuted();
    }

    async setVideoMutedAsync(muted) {
        const isMuted = await this.isVideoMutedAsync();
        if (muted !== isMuted) {
            this.toggleVideo();
        }
    }

    /// Add a listener for Calla events that come through the Jitsi Meet data channel.
    addEventListener(evtName, callback, opts) {
        if (eventNames.indexOf(evtName) === -1) {
            throw new Error(`Unsupported event type: ${evtName}`);
        }

        super.addEventListener(evtName, callback, opts);
    }

    userInitRequest(toUserID) {
        this.txGameData(toUserID, "userInitRequest");
    }

    userInitResponse(toUserID, fromUser) {
        this.txGameData(toUserID, "userInitResponse", fromUser);
    }

    emote(toUserID, emoji) {
        this.txGameData(toUserID, "emote", emoji);
    }

    audioMuteStatusChanged(toUserID, muted) {
        this.txGameData(toUserID, "audioMuteStatusChanged", { muted });
    }

    videoMuteStatusChanged(toUserID, muted) {
        this.txGameData(toUserID, "videoMuteStatusChanged", { muted });
    }

    moveTo(toUserID, evt) {
        this.txGameData(toUserID, "moveTo", evt);
    }
}