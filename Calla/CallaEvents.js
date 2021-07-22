export class CallaEvent extends Event {
    eventType;
    constructor(eventType) {
        super(eventType);
        this.eventType = eventType;
    }
}
export class CallaErrorEvent extends CallaEvent {
    error;
    constructor(error) {
        super("error");
        this.error = error;
    }
}
export class CallaInfoEvent extends CallaEvent {
    message;
    constructor(message) {
        super("info");
        this.message = message;
    }
}
export class CallaTeleconferenceServerConnectedEvent extends CallaEvent {
    constructor() {
        super("serverConnected");
    }
}
export class CallaTeleconferenceServerDisconnectedEvent extends CallaEvent {
    constructor() {
        super("serverDisconnected");
    }
}
export class CallaTeleconferenceServerFailedEvent extends CallaEvent {
    constructor() {
        super("serverFailed");
    }
}
export class CallaUserEvent extends CallaEvent {
    userID;
    constructor(type, userID) {
        super(type);
        this.userID = userID;
    }
}
export class CallaUserJoinedEvent extends CallaUserEvent {
    constructor(id) {
        super("userJoined", id);
    }
}
export class CallaUserLeftEvent extends CallaUserEvent {
    constructor(id) {
        super("userLeft", id);
    }
}
export class CallaRTCIceEvent extends CallaUserEvent {
    ice;
    constructor(id, ice) {
        super("iceReceived", id);
        this.ice = ice;
    }
}
export class CallaRTCOfferEvent extends CallaUserEvent {
    offer;
    constructor(id, offer) {
        super("offerReceived", id);
        this.offer = offer;
    }
}
export class CallaRTCAnswerEvent extends CallaUserEvent {
    answer;
    constructor(id, answer) {
        super("answerReceived", id);
        this.answer = answer;
    }
}
export class CallaParticipantEvent extends CallaUserEvent {
    displayName;
    constructor(type, id, displayName) {
        super(type, id);
        this.displayName = displayName;
    }
}
export class CallaUserNameChangedEvent extends CallaUserEvent {
    displayName;
    constructor(id, displayName) {
        super("userNameChanged", id);
        this.displayName = displayName;
    }
}
export class CallaConferenceJoinedEvent extends CallaUserEvent {
    pose;
    constructor(id, pose) {
        super("conferenceJoined", id);
        this.pose = pose;
    }
}
export class CallaConferenceLeftEvent extends CallaUserEvent {
    constructor(id) {
        super("conferenceLeft", id);
    }
}
export class CallaConferenceConnectedEvent extends CallaEvent {
    constructor() {
        super("conferenceConnected");
    }
}
export class CallaConferenceFailedEvent extends CallaEvent {
    constructor() {
        super("conferenceFailed");
    }
}
export class CallaConferenceRestoredEvent extends CallaEvent {
    constructor() {
        super("conferenceRestored");
    }
}
export class CallaParticipantJoinedEvent extends CallaParticipantEvent {
    source;
    constructor(id, displayName, source) {
        super("participantJoined", id, displayName);
        this.source = source;
    }
}
export class CallaParticipantLeftEvent extends CallaUserEvent {
    constructor(id) {
        super("participantLeft", id);
    }
}
export class CallaParticipantNameChangeEvent extends CallaParticipantEvent {
    constructor(id, displayName) {
        super("userNameChanged", id, displayName);
    }
}
export class CallaUserMutedEvent extends CallaUserEvent {
    muted;
    constructor(type, id, muted) {
        super(type, id);
        this.muted = muted;
    }
}
export class CallaUserAudioMutedEvent extends CallaUserMutedEvent {
    constructor(id, muted) {
        super("audioMuteStatusChanged", id, muted);
    }
}
export class CallaUserVideoMutedEvent extends CallaUserMutedEvent {
    constructor(id, muted) {
        super("videoMuteStatusChanged", id, muted);
    }
}
export var StreamType;
(function (StreamType) {
    StreamType["Audio"] = "audio";
    StreamType["Video"] = "video";
})(StreamType || (StreamType = {}));
export var StreamOpType;
(function (StreamOpType) {
    StreamOpType["Added"] = "added";
    StreamOpType["Removed"] = "removed";
    StreamOpType["Changed"] = "changed";
})(StreamOpType || (StreamOpType = {}));
export class CallaStreamEvent extends CallaUserEvent {
    kind;
    op;
    stream;
    constructor(type, kind, op, id, stream) {
        super(type, id);
        this.kind = kind;
        this.op = op;
        this.stream = stream;
    }
}
export class CallaStreamAddedEvent extends CallaStreamEvent {
    constructor(type, kind, id, stream) {
        super(type, kind, StreamOpType.Added, id, stream);
    }
}
export class CallaStreamRemovedEvent extends CallaStreamEvent {
    constructor(type, kind, id, stream) {
        super(type, kind, StreamOpType.Removed, id, stream);
    }
}
export class CallaStreamChangedEvent extends CallaStreamEvent {
    constructor(type, kind, id, stream) {
        super(type, kind, StreamOpType.Changed, id, stream);
    }
}
export class CallaAudioStreamAddedEvent extends CallaStreamAddedEvent {
    constructor(id, stream) {
        super("audioAdded", StreamType.Audio, id, stream);
    }
}
export class CallaAudioStreamRemovedEvent extends CallaStreamRemovedEvent {
    constructor(id, stream) {
        super("audioRemoved", StreamType.Audio, id, stream);
    }
}
export class CallaVideoStreamAddedEvent extends CallaStreamAddedEvent {
    constructor(id, stream) {
        super("videoAdded", StreamType.Video, id, stream);
    }
}
export class CallaVideoStreamRemovedEvent extends CallaStreamRemovedEvent {
    constructor(id, stream) {
        super("videoRemoved", StreamType.Video, id, stream);
    }
}
export class CallaPoseEvent extends CallaUserEvent {
    px;
    py;
    pz;
    fx;
    fy;
    fz;
    ux;
    uy;
    uz;
    constructor(type, id, px, py, pz, fx, fy, fz, ux, uy, uz) {
        super(type, id);
        this.px = px;
        this.py = py;
        this.pz = pz;
        this.fx = fx;
        this.fy = fy;
        this.fz = fz;
        this.ux = ux;
        this.uy = uy;
        this.uz = uz;
    }
    set(px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.px = px;
        this.py = py;
        this.pz = pz;
        this.fx = fx;
        this.fy = fy;
        this.fz = fz;
        this.ux = ux;
        this.uy = uy;
        this.uz = uz;
    }
}
export class CallaUserPosedEvent extends CallaPoseEvent {
    constructor(id, px, py, pz, fx, fy, fz, ux, uy, uz) {
        super("userPosed", id, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
}
export class CallaUserPointerEvent extends CallaPoseEvent {
    name;
    constructor(id, name, px, py, pz, fx, fy, fz, ux, uy, uz) {
        super("userPointer", id, px, py, pz, fx, fy, fz, ux, uy, uz);
        this.name = name;
    }
}
export class CallaEmojiEvent extends CallaUserEvent {
    emoji;
    constructor(type, id, emoji) {
        super(type, id);
        this.emoji = emoji;
    }
}
export class CallaEmoteEvent extends CallaEmojiEvent {
    constructor(id, emoji) {
        super("emote", id, emoji);
    }
}
export class CallaEmojiAvatarEvent extends CallaEmojiEvent {
    constructor(id, emoji) {
        super("setAvatarEmoji", id, emoji);
    }
}
export class CallaPhotoAvatarEvent extends CallaUserEvent {
    url;
    constructor(id, url) {
        super("setAvatarURL", id);
        this.url = url;
    }
}
export class CallaChatEvent extends CallaUserEvent {
    text;
    constructor(id, text) {
        super("chat", id);
        this.text = text;
    }
}
//# sourceMappingURL=CallaEvents.js.map