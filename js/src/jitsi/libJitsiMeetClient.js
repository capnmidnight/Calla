import {
    tag,
    Span
} from "../html/tags.js";

import '../../lib/jquery.js';

// helps us filter out data channel messages that don't belong to us
const BUFFER_SIZE = 1024,
    APP_FINGERPRINT = "Calla",
    isOldAudioAPI = !AudioListener.prototype.hasOwnProperty("positionX"),
    userLookup = {},
    userList = [],
    activityCounterMin = 0,
    activityCounterMax = 60,
    activityCounterThresh = 5,
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

class User {
    constructor(jitsiClient, userID, audio) {
        this.jitsiClient = jitsiClient;
        this.id = userID;
        this.lastAudible = true;
        this.activityCounter = 0;
        this.wasActive = false;

        this.audio = audio;

        const stream = !!audio.mozCaptureStream
            ? audio.mozCaptureStream()
            : audio.captureStream();

        this.source = audioContext.createMediaStreamSource(stream);
        this.panner = audioContext.createPanner();
        this.analyser = audioContext.createAnalyser();
        this.buffer = new Float32Array(BUFFER_SIZE);

        this.audio.volume = 0;

        this.panner.panningModel = "HRTF";
        this.panner.distanceModel = "inverse";
        this.panner.refDistance = minDistance;
        this.panner.rolloffFactor = rolloff;
        this.panner.coneInnerAngle = 360;
        this.panner.coneOuterAngle = 0;
        this.panner.coneOuterGain = 0;

        this.panner.positionY.setValueAtTime(0, audioContext.currentTime);

        this.analyser.fftSize = 2 * BUFFER_SIZE;
        this.analyser.smoothingTimeConstant = 0.2;


        this.source.connect(this.analyser);
        this.source.connect(this.panner);
        this.panner.connect(audioContext.destination);
    }

    setPosition(evt) {
        const time = audioContext.currentTime + transitionTime;
        // our 2D position is in X/Y coords, but our 3D position
        // along the horizontal plane is X/Z coords.
        this.panner.positionX.linearRampToValueAtTime(evt.x, time);
        this.panner.positionZ.linearRampToValueAtTime(evt.y, time);
    }

    isAudible() {
        const lx = isOldAudioAPI ? listenerX : audioContext.listener.positionX.value,
            ly = isOldAudioAPI ? listenerY : audioContext.listener.positionZ.value,
            distX = this.panner.positionX.value - lx,
            distZ = this.panner.positionZ.value - ly,
            dist = Math.sqrt(distX * distX + distZ * distZ),
            range = clamp(project(dist, minDistance, maxDistance), 0, 1);

        return range < 1;
    }

    update() {
        const audible = this.isAudible();
        if (audible !== this.lastAudible) {
            this.lastAudible = audible;
            if (audible) {
                this.source.connect(this.panner);
            }
            else {
                this.source.disconnect(this.panner);
            }
        }

        this.analyser.getFloatFrequencyData(this.buffer);

        const average = 1.1 + analyserFrequencyAverage(this.analyser, this.buffer, 85, 255) / 100;
        if (average >= 0.5 && this.activityCounter < activityCounterMax) {
            this.activityCounter++;
        } else if (average < 0.5 && this.activityCounter > activityCounterMin) {
            this.activityCounter--;
        }

        const isActive = this.activityCounter > activityCounterThresh;
        if (this.wasActive !== isActive) {
            this.wasActive = isActive;
            this.jitsiClient.audioActivity(this.id, isActive);
        }
    }
}

function analyserFrequencyAverage(analyser, frequencies, minHz, maxHz) {
    const sampleRate = analyser.context.sampleRate,
        start = frequencyToIndex(minHz, sampleRate),
        end = frequencyToIndex(maxHz, sampleRate),
        count = end - start
    let sum = 0
    for (let i = start; i < end; ++i) {
        sum += frequencies[i];
    }
    return count === 0 ? 0 : (sum / count);
}

function frequencyToIndex(frequency, sampleRate) {
    var nyquist = sampleRate / 2
    var index = Math.round(frequency / nyquist * BUFFER_SIZE)
    return clamp(index, 0, BUFFER_SIZE)
}

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

function project(v, min, max) {
    return (v - min) / (max - min);
}

function logger(obj, name, handler) {
    const func = !handler
        ? console.log.bind(console, name)
        : (evt) => {
            console.log(name, evt);
            handler(evt);
        };

    obj.addEventListener(name, func);
    return func;
}

// Manages communication between Jitsi Meet and Calla
export class LibJitsiMeetClient extends EventTarget {

    constructor() {
        super();
        this._connection = { value: null };
        this._room = { value: null };
        this._audioContext = { value: null };
        this._minDistance = { value: 1 };
        this._maxDistance = { value: 10 };
        this._rolloff = { value: 5 };
        this._transitionTime = { value: 0.125 };
        this._startMoveTime = { value: 0 };
        this._endMoveTime = { value: 0 };
        this._startListenerX = { value: 0 };
        this._startListenerY = { value: 0 };
        this._targetListenerX = { value: 0 };
        this._targetListenerY = { value: 0 };
        this._listenerX = { value: 0 };
        this._listenerY = { value: 0 };
        this.updater = this._updater.bind(this);
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


    get audioContext() {
        return this._audioContext;
    }

    set audioContext(value) {
        this._audioContext.value = value;
    }


    get minDistance() {
        return this._minDistance;
    }

    set minDistance(value) {
        this._minDistance.value = value;
    }


    get maxDistance() {
        return this._maxDistance;
    }

    set maxDistance(value) {
        this._maxDistance.value = value;
    }


    get rolloff() {
        return this._rolloff;
    }

    set rolloff(value) {
        this._rolloff.value = value;
    }


    get transitionTime() {
        return this._transitionTime;
    }

    set transitionTime(value) {
        this._transitionTime.value = value;
    }


    get startMoveTime() {
        return this._startMoveTime;
    }

    set startMoveTime(value) {
        this._startMoveTime.value = value;
    }


    get endMoveTime() {
        return this._endMoveTime;
    }

    set endMoveTime(value) {
        this._endMoveTime.value = value;
    }


    get startListenerX() {
        return this._startListenerX;
    }

    set startListenerX(value) {
        this._startListenerX.value = value;
    }


    get startListenerY() {
        return this._startListenerY;
    }

    set startListenerY(value) {
        this._startListenerY.value = value;
    }


    get targetListenerX() {
        return this._targetListenerX;
    }

    set targetListenerX(value) {
        this._targetListenerX.value = value;
    }


    get targetListenerY() {
        return this._targetListenerY;
    }

    set targetListenerY(value) {
        this._targetListenerY.value = value;
    }


    get listenerX() {
        return this._listenerX;
    }

    set listenerX(value) {
        this._listenerX.value = value;
    }


    get listenerY() {
        return this._listenerY;
    }

    set listenerY(value) {
        this._listenerY.value = value;
    }

    ensureContext() {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
            const time = this.audioContext.currentTime,
                listener = this.audioContext.listener;

            if (isOldAudioAPI) {
                listener.setPosition(0, 0, 0);
                listener.setOrientation(0, 0, -1, 0, 1, 0);
            }
            else {
                listener.positionX.setValueAtTime(0, time);
                listener.positionY.setValueAtTime(0, time);
                listener.positionZ.setValueAtTime(0, time);
                listener.forwardX.setValueAtTime(0, time);
                listener.forwardY.setValueAtTime(0, time);
                listener.forwardZ.setValueAtTime(-1, time);
                listener.upX.setValueAtTime(0, time);
                listener.upY.setValueAtTime(1, time);
                listener.upZ.setValueAtTime(0, time);
            }
            requestAnimationFrame(this.updater);
        }
    }

    _updater() {
        requestAnimationFrame(this.updater);

        if (isOldAudioAPI) {
            const time = this.audioContext.currentTime,
                p = project(time, this.startMoveTime, this.endMoveTime);

            if (p <= 1) {
                const deltaX = this.targetListenerX - this.startListenerX,
                    deltaY = this.targetListenerY - this.startListenerY;

                this.listenerX = this.startListenerX + p * deltaX;
                this.listenerY = this.startListenerY + p * deltaY;

                this.audioContext.listener.setPosition(this.listenerX, 0, this.listenerY);
            }
        }

        for (let user of userList) {
            user.update();
        }
    }



    getUser(userID) {
        if (!userLookup[userID]) {
            const elementID = `#participant_${userID} audio`,
                audio = document.querySelector(elementID);

            if (!!audio) {
                userLookup[userID] = new User(this, userID, audio);
                userList.push(userLookup[userID]);
            }
        }

        const user = userLookup[userID];
        if (!user) {
            console.warn(`no audio for user ${userID}`);
        }
        return user;
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
            const evt = new JitsiClientEvent(user.getId(), data);
            this.dispatchEvent(evt);
        }
    }

    async joinAsync(roomName, userName) {
        roomName = roomName.toLocaleLowerCase();

        await import(`https://${JITSI_HOST}/libs/lib-jitsi-meet.min.js`);

        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
        JitsiMeetJS.init();

        this.connection = new JitsiMeetJS.JitsiConnection(null, null, {
            hosts: {
                domain: JITSI_HOST,
                muc: `conference.${JITSI_HOST}`
            },
            serviceUrl: `https://${JITSI_HOST}/http-bind`,
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

    setAudioProperties(origin, transitionTime, minDistance, maxDistance, rolloff) {
        this.minDistance = evt.minDistance;
        this.maxDistance = evt.maxDistance;
        this.transitionTime = evt.transitionTime;
        this.rolloff = evt.rolloff;

        this.ensureContext();
        for (let user of this.userList) {
            user.panner.refDistance = minDistance;
            user.panner.rolloffFactor = rolloff;
        }
    }

    setLocalPosition(evt) {
        this.ensureContext();
        const time = this.audioContext.currentTime + this.transitionTime,
            listener = this.audioContext.listener;
        if (isOldAudioAPI) {
            this.startMoveTime = this.audioContext.currentTime;
            this.endMoveTime = time;
            this.startListenerX = this.listenerX;
            this.startListenerY = this.listenerY;
            this.targetListenerX = evt.x;
            this.targetListenerY = evt.y;
        }
        else {
            listener.positionX.linearRampToValueAtTime(evt.x, time);
            listener.positionZ.linearRampToValueAtTime(evt.y, time);
        }
    }

    setUserPosition(evt) {
        const user = this.getUser(evt.id);
        if (!user) {
            return;
        }

        user.setPosition(evt);
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

class CallaEvent extends Event {
    constructor(data) {
        super(data.command);
        this.data = data;
    }
}

class JitsiClientEvent extends CallaEvent {
    constructor(id, data) {
        super(data);
        this.id = id;
    }
}